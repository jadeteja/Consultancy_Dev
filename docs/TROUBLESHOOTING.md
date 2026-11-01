# Troubleshooting & FAQ

## Common Issues & Resolutions

### 1. Backend Fails to Start with Flyway Migration Error
- **Symptom**: `FlywayException: Migration failed...`
- **Cause**: Database connection string points to pooler with transaction mode or schema has unapplied manual modifications.
- **Resolution**: Use the direct Supabase PostgreSQL connection URI on port 5432 with `?sslmode=require`. If using session pooler, ensure `baseline-on-migrate: true` is configured in `application.yml`.

### 2. Frontend Receives 401 Unauthorized for Protected Endpoints
- **Symptom**: API calls to `/api/v1/candidate/**` or `/api/v1/recruiter/**` fail with 401.
- **Cause**: Supabase session token missing or expired, or backend `SUPABASE_JWKS_URL` does not match the Supabase project reference.
- **Resolution**: Verify `VITE_SUPABASE_URL` in frontend matches `SUPABASE_URL` in backend. Check token in browser DevTools Network tab -> Request Headers `Authorization: Bearer <token>`.

### 3. WhatsApp Redirect Doesn't Open Desktop / Mobile App
- **Symptom**: Browser opens blank `wa.me` page or fails to launch.
- **Cause**: Phone number contains dashes, spaces, or plus signs in raw URL.
- **Resolution**: Verify `CONSULTANCY_WHATSAPP_NUMBER` contains only numbers with country code (e.g., `919876543210` without `+` or spaces).

### 4. Render Static Site Gives 404 on Page Refresh (Deep Links)
- **Symptom**: Navigating directly to `/jobs/software-developer-1024` returns 404 on Render.
- **Cause**: Missing SPA rewrite rule.
- **Resolution**: Ensure the Render Static Site has a rewrite rule configured:
  - Source: `/*`
  - Destination: `/index.html`
  - Action: `Rewrite`
