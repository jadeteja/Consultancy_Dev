# System Architecture

## Architecture Overview

```text
                  PUBLIC USERS & CANDIDATES
                             |
                             v
                      REACT FRONTEND
                    (Render Static Site)
                      Vite + Tailwind
                             |
                +------------+------------+
                |                         |
                v                         v
          SUPABASE AUTH            SPRING BOOT API
        User Registration &     (Render Web Service)
        Password Management     Stateless REST Endpoints
        JWT Access Token                  |
                                          |
                                   SPRING SECURITY
                                RBAC + JWKS Validation
                                Resource-Level Access
                                          |
                             +------------+------------+
                             |                         |
                             v                         v
                      SUPABASE POSTGRES         SUPABASE STORAGE
                    Users, Jobs, Apps,        Candidate Resumes &
                    Companies, Site Settings    Corporate Logos
                             |
                             v
                     WHATSAPP REDIRECT
                   Official wa.me Links
```

## Architectural Decoupling & Security Boundaries

1. **Client Isolation**: The React frontend executes no database queries directly. All business CRUD operations pass through the Spring Boot API.
2. **Stateless JWT Authorization**: Spring Boot decodes Supabase-issued JWTs using the project's trusted JWKS endpoint (`/.well-known/jwks.json`) and verifies issuer, signature, expiry, and user status.
3. **Server-Enforced Roles**: Role assignments are retrieved from the `roles` and `user_roles` database tables rather than mutable user metadata submitted by the frontend.
4. **Flyway Migrations**: The authoritative database schema is maintained exclusively in versioned SQL migrations (`V1__initial_schema.sql` and `V2__seed_data.sql`).
