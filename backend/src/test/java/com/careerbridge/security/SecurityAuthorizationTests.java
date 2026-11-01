package com.careerbridge.security;

import com.careerbridge.user.Role;
import com.careerbridge.user.RoleType;
import com.careerbridge.user.UserProfile;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class SecurityAuthorizationTests {

    @Test
    @DisplayName("Candidate user principal has only ROLE_CANDIDATE authority")
    void testCandidateAuthorities() {
        UUID id = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(
                id,
                "candidate@example.com",
                "Test Candidate",
                List.of(new SimpleGrantedAuthority("ROLE_CANDIDATE")),
                true
        );

        assertEquals("candidate@example.com", principal.getUsername());
        assertTrue(principal.isEnabled());
        assertTrue(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_CANDIDATE")));
        assertFalse(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")));
        assertFalse(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_RECRUITER")));
    }

    @Test
    @DisplayName("Recruiter user principal has ROLE_RECRUITER authority")
    void testRecruiterAuthorities() {
        UUID id = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(
                id,
                "recruiter@careerbridge.com",
                "Senior Recruiter",
                List.of(new SimpleGrantedAuthority("ROLE_RECRUITER")),
                true
        );

        assertTrue(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_RECRUITER")));
        assertFalse(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")));
    }

    @Test
    @DisplayName("Disabled or suspended account cannot be enabled")
    void testSuspendedUserPrincipal() {
        UUID id = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(
                id,
                "suspended@example.com",
                "Suspended Candidate",
                List.of(new SimpleGrantedAuthority("ROLE_CANDIDATE")),
                false
        );

        assertFalse(principal.isEnabled());
        assertFalse(principal.isAccountNonLocked());
    }

    @Test
    @DisplayName("Super admin has ROLE_SUPER_ADMIN authority")
    void testSuperAdminAuthorities() {
        UUID id = UUID.randomUUID();
        UserPrincipal principal = new UserPrincipal(
                id,
                "admin@careerbridge.com",
                "Platform Admin",
                List.of(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN")),
                true
        );

        assertTrue(principal.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_SUPER_ADMIN")));
    }
}
