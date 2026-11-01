# Authentication Architecture

## Overview
Authentication is handled via **Supabase Auth**, with authorization and access token verification enforced by **Spring Security**.

## Authentication Flow

1. **User Sign Up / Sign In**:
   - The React application communicates directly with Supabase Auth (`supabase.auth.signUp()` / `signInWithPassword()`).
   - Supabase returns a signed JWT `access_token` with user ID (`sub`), email, and metadata.
2. **API Request**:
   - Axios request interceptor attaches the Bearer token to all outgoing requests to Spring Boot (`Authorization: Bearer <jwt>`).
3. **Backend JWT Validation**:
   - Spring Security checks the JWT against the Supabase JWKS URL (`https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`) or shared secret.
   - The token's signature, issuer (`iss`), and expiration (`exp`) are validated.
4. **User Provisioning & Role Resolution**:
   - [`SupabaseJwtAuthenticationConverter`](file:///c:/Users/jadet/Documents/code/consultancy_dev/backend/src/main/java/com/careerbridge/security/SupabaseJwtAuthenticationConverter.java) checks if the user exists in `user_profiles`.
   - If not found, a new profile is provisioned with default role `ROLE_CANDIDATE` (or `ROLE_SUPER_ADMIN` if the email matches `DEFAULT_ADMIN_EMAIL`).
   - If the account has `is_active = false`, authentication is rejected with a `DisabledException`.
