package com.careerbridge.config;

import com.careerbridge.security.SupabaseJwtAuthenticationConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final SupabaseJwtAuthenticationConverter jwtAuthenticationConverter;

    @Value("${supabase.jwt.jwks-url:}")
    private String jwksUrl;

    @Value("${supabase.jwt.secret:}")
    private String jwtSecret;

    @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:3000}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public Actuator & OpenAPI
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Public Portal Endpoints
                .requestMatchers(HttpMethod.GET, "/api/v1/jobs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/companies/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/job-categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/site-settings/public").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/applications/guest-intent").permitAll()
                // Company creation by authorized staff
                .requestMatchers(HttpMethod.POST, "/api/v1/companies").hasAnyRole("RECRUITER", "SUPER_ADMIN")
                // Role-specific protected endpoints
                .requestMatchers("/api/v1/admin/**").hasRole("SUPER_ADMIN")
                .requestMatchers("/api/v1/recruiter/**").hasAnyRole("RECRUITER", "SUPER_ADMIN")
                .requestMatchers("/api/v1/candidate/**").hasAnyRole("CANDIDATE", "SUPER_ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .decoder(jwtDecoder())
                    .jwtAuthenticationConverter(jwtAuthenticationConverter)
                )
            );

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        if (jwksUrl != null && !jwksUrl.isBlank()) {
            return NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
        } else if (jwtSecret != null && !jwtSecret.isBlank()) {
            byte[] keyBytes;
            try {
                // Supabase JWT secret is base64-encoded (or standard UTF-8)
                keyBytes = java.util.Base64.getDecoder().decode(jwtSecret.trim());
            } catch (IllegalArgumentException e) {
                keyBytes = jwtSecret.trim().getBytes(StandardCharsets.UTF_8);
            }
            SecretKeySpec secretKey = new SecretKeySpec(keyBytes, "HmacSHA256");
            return NimbusJwtDecoder.withSecretKey(secretKey).build();
        } else {
            // Fallback mock decoder for dev/tests
            SecretKeySpec secretKey = new SecretKeySpec("01234567890123456789012345678901".getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            return NimbusJwtDecoder.withSecretKey(secretKey).build();
        }
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();

        List<String> patterns = new java.util.ArrayList<>(origins);
        patterns.add("https://*.vercel.app");
        patterns.add("http://localhost:*");
        patterns.add("http://127.0.0.1:*");

        config.setAllowedOriginPatterns(patterns);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
