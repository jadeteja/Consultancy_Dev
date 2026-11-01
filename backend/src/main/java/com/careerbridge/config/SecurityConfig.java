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

    @Value("${supabase.url:}")
    private String supabaseUrl;

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
                // Company management by authorized staff
                .requestMatchers(HttpMethod.POST, "/api/v1/companies").hasAnyRole("RECRUITER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/companies/**").hasAnyRole("RECRUITER", "SUPER_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/companies/**").hasRole("SUPER_ADMIN")
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
        String effectiveJwksUrl = jwksUrl;
        if ((effectiveJwksUrl == null || effectiveJwksUrl.isBlank() || effectiveJwksUrl.contains("xyzcompany.supabase.co")) 
                && supabaseUrl != null && !supabaseUrl.isBlank() && !supabaseUrl.contains("xyzcompany.supabase.co")) {
            effectiveJwksUrl = supabaseUrl.replaceAll("/+$", "") + "/auth/v1/.well-known/jwks.json";
        }
        if (effectiveJwksUrl == null || effectiveJwksUrl.isBlank() || effectiveJwksUrl.contains("xyzcompany.supabase.co")) {
            effectiveJwksUrl = "https://jgdtzkfwymrgzdqapkiv.supabase.co/auth/v1/.well-known/jwks.json";
        }

        // Supabase signs tokens with ES256 (as well as RS256)
        return NimbusJwtDecoder.withJwkSetUri(effectiveJwksUrl)
                .jwsAlgorithms(algorithms -> {
                    algorithms.add(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.ES256);
                    algorithms.add(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.RS256);
                })
                .build();
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
