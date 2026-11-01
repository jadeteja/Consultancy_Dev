package com.careerbridge.security;

import com.careerbridge.user.Role;
import com.careerbridge.user.RoleRepository;
import com.careerbridge.user.RoleType;
import com.careerbridge.user.UserProfile;
import com.careerbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class SupabaseJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Value("${app.consultancy.admin-emails:${app.consultancy.default-admin-email:nextstepsolutions.recruitment@gmail.com,Jade.teja@gmail.com,teja.jade@gmail.com}}")
    private String adminEmails;

    private boolean isSuperAdminEmail(String email) {
        if (email == null) return false;
        return Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .anyMatch(e -> e.equalsIgnoreCase(email.trim()));
    }

    @Override
    @Transactional
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String sub = jwt.getSubject();
        if (sub == null) {
            throw new IllegalArgumentException("JWT subject (sub) claim is missing");
        }
        UUID userId = UUID.fromString(sub);
        String email = jwt.getClaimAsString("email");
        if (email == null) {
            Map<String, Object> userMetadata = jwt.getClaimAsMap("user_metadata");
            if (userMetadata != null && userMetadata.containsKey("email")) {
                email = (String) userMetadata.get("email");
            }
        }

        String fullName = null;
        Map<String, Object> userMetadata = jwt.getClaimAsMap("user_metadata");
        if (userMetadata != null) {
            fullName = (String) userMetadata.getOrDefault("full_name", userMetadata.get("name"));
        }
        if (fullName == null || fullName.isBlank()) {
            fullName = email != null ? email.split("@")[0] : "User";
        }

        final String finalEmail = email;
        final String finalFullName = fullName;

        // Fetch or initialize user in local database
        UserProfile user = userRepository.findById(userId).orElseGet(() -> {
            log.info("Provisioning newly registered Supabase user with ID {} and email {}", userId, finalEmail);
            UserProfile newUser = UserProfile.builder()
                    .id(userId)
                    .email(finalEmail != null ? finalEmail : userId + "@careerbridge.local")
                    .fullName(finalFullName)
                    .isActive(true)
                    .roles(new HashSet<>())
                    .build();

            // Default role is CANDIDATE unless matching configured bootstrap admin email
            if (isSuperAdminEmail(finalEmail)) {
                Role adminRole = roleRepository.findByName(RoleType.ROLE_SUPER_ADMIN)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_SUPER_ADMIN).build()));
                newUser.getRoles().add(adminRole);
            } else {
                Role candidateRole = roleRepository.findByName(RoleType.ROLE_CANDIDATE)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_CANDIDATE).build()));
                newUser.getRoles().add(candidateRole);
            }

            return userRepository.save(newUser);
        });

        // Ensure user whose email matches admin emails always has ROLE_SUPER_ADMIN
        if (isSuperAdminEmail(finalEmail)) {
            boolean hasSuperAdmin = user.getRoles().stream()
                    .anyMatch(r -> r.getName() == RoleType.ROLE_SUPER_ADMIN);
            if (!hasSuperAdmin) {
                log.info("Upgrading user {} with email {} to ROLE_SUPER_ADMIN", user.getId(), finalEmail);
                Role adminRole = roleRepository.findByName(RoleType.ROLE_SUPER_ADMIN)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_SUPER_ADMIN).build()));
                user.getRoles().add(adminRole);
                user = userRepository.save(user);
            }
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new DisabledException("User profile is suspended or disabled");
        }

        List<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getName().name()))
                .collect(Collectors.toList());

        UserPrincipal principal = new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                authorities,
                user.getIsActive()
        );

        return new UsernamePasswordAuthenticationToken(principal, jwt, authorities);
    }
}
