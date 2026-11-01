# Environment Variables Reference

## Frontend Environment Variables (`frontend/.env`)
```env
# URL of the deployed Spring Boot backend
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Supabase Auth Project URL and Anon/Publishable Key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_public_key
```

## Backend Environment Variables (`backend/.env` or Render Web Service)
```env
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# PostgreSQL Database (Supabase direct connection or pooler)
DATABASE_URL=jdbc:postgresql://db.your-project.supabase.co:5432/postgres?sslmode=require
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_database_password

# Supabase Auth & JWT
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_JWT_ISSUER=https://your-project.supabase.co/auth/v1
SUPABASE_JWKS_URL=https://your-project.supabase.co/auth/v1/.well-known/jwks.json
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Supabase Storage Bucket for Candidate Resumes
SUPABASE_STORAGE_BUCKET=resumes

# Frontend URL for secure CORS configuration
FRONTEND_URL=https://careerbridge-frontend.onrender.com,http://localhost:5173

# Consultancy WhatsApp Official Number (Country code + phone)
CONSULTANCY_WHATSAPP_NUMBER=919876543210

# Default Initial Administrator Email (Automatically granted ROLE_SUPER_ADMIN upon signup)
DEFAULT_ADMIN_EMAIL=admin@careerbridgeconsultancy.com
```
