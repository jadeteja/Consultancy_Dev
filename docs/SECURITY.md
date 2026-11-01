# Security & Compliance Specification

## 1. Principles of Least Privilege & RBAC
- All public endpoints are explicitly declared in `SecurityConfig.java`. Everything else requires authentication (`.anyRequest().authenticated()`).
- Roles are prefixed with `ROLE_` (`ROLE_CANDIDATE`, `ROLE_RECRUITER`, `ROLE_SUPER_ADMIN`) and mapped automatically to Spring Security GrantedAuthorities.
- Role elevation is restricted: public signup creates only `ROLE_CANDIDATE`. Super Admin roles can only be granted by existing Super Admins or via the `DEFAULT_ADMIN_EMAIL` bootstrap process.

## 2. JWT Verification
- Backend validates all incoming bearer tokens against the Supabase JWKS endpoint.
- Expired tokens, forged signatures, or tokens with incorrect issuers are rejected with HTTP 401 Unauthorized.
- Accounts marked `is_active = false` in `user_profiles` are rejected immediately with a `DisabledException` (HTTP 403 Forbidden).

## 3. Data Privacy & Candidate Protection
- Candidate resumes are kept in private Supabase Storage buckets, not accessible via public URL.
- Direct database credentials and service-role keys are never exposed in frontend code. Frontend only utilizes the public anon key.
- Sensitive environment variables are kept out of Git and managed via Render / environment variables.

## 4. WhatsApp Application Safety
- Candidate data is encoded with URL-encoding (`StandardCharsets.UTF_8`) to prevent link injection.
- Candidacy redirects are logged with `INITIATED` status rather than false delivery confirmation.
