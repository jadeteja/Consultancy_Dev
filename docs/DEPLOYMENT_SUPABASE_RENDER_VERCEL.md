# Complete Deployment Guide
## Architecture: Supabase (DB + Auth) + Render (Backend) + Vercel (Frontend)

This guide walks you through deploying **Next step solutions** with:
- **Database & Authentication**: Supabase (PostgreSQL + Auth + Storage)
- **Backend API**: Render (Spring Boot Docker Web Service)
- **Frontend App**: Vercel (React + Vite SPA)

---

## Part 1: Supabase Setup (Database & Auth)

1. Log into [supabase.com](https://supabase.com) and click **"New Project"**.
2. Set:
   - **Name**: `next-step-solutions` (or your preferred name)
   - **Database Password**: Set a strong password (remember this for your Render DB connection).
   - **Region**: Choose the closest region to your target audience (e.g., `South Asia (Mumbai)` or `Singapore`).
3. Once the project is created:
   - Go to **Project Settings** -> **API**:
     - Copy **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
     - Copy **Project API Keys** -> `anon` / `public`
   - Go to **Project Settings** -> **Database**:
     - Scroll to **Connection string** -> Choose **URI**.
     - Look for the Direct connection URI (port `5432`):
       ```text
       postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklm.supabase.co:5432/postgres
       ```
     - For Java JDBC, this format is used:
       ```text
       jdbc:postgresql://db.abcdefghijklm.supabase.co:5432/postgres?sslmode=require
       ```
4. Configure Authentication:
   - Go to **Authentication** -> **Providers** -> **Email**:
     - Ensure **Enable Email provider** is turned ON.
     - (Optional for testing) You can toggle **Confirm email** off if you want immediate logins without email verification.
   - Go to **Authentication** -> **URL Configuration**:
     - Set **Site URL** to your Vercel URL once deployed (or placeholder like `http://localhost:5173`).
     - Under **Redirect URLs**, add:
       - `https://*.vercel.app/**`
       - `http://localhost:5173/**`
5. Configure Storage (for resumes):
   - Go to **Storage** -> Click **New Bucket**.
   - Bucket name: `resumes`
   - Turn **Public bucket** OFF (private).

---

## Part 2: Render Setup (Spring Boot Backend)

1. Push your repository to **GitHub** (if you haven't already).
2. Log into [dashboard.render.com](https://dashboard.render.com).
3. Click **New +** -> **Web Service**.
4. Connect your GitHub repository.
5. In the service setup screen:
   - **Name**: `nextstepsolutions-backend` (or similar)
   - **Region**: Choose same region or closest (e.g., Singapore or Oregon)
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`
   - **Plan**: `Free`
6. Scroll down to **Environment Variables** and add:

| Key | Example Value | Description |
|---|---|---|
| `PORT` | `8080` | Container port |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |
| `DATABASE_URL` | `jdbc:postgresql://db.<REF>.supabase.co:5432/postgres?sslmode=require` | Direct Supabase JDBC connection |
| `DATABASE_USERNAME` | `postgres` | Supabase DB username |
| `DATABASE_PASSWORD` | `<YOUR-SUPABASE-PASSWORD>` | Your Supabase database password |
| `SUPABASE_URL` | `https://<REF>.supabase.co` | Your Supabase Project URL |
| `SUPABASE_JWT_ISSUER` | `https://<REF>.supabase.co/auth/v1` | Auth issuer URL |
| `SUPABASE_JWKS_URL` | `https://<REF>.supabase.co/auth/v1/.well-known/jwks.json` | Public JWKS endpoint |
| `SUPABASE_STORAGE_BUCKET` | `resumes` | Storage bucket name |
| `FRONTEND_URL` | `https://<YOUR-PROJECT>.vercel.app,http://localhost:5173` | Allowed CORS origins (Vercel domain) |
| `CONSULTANCY_WHATSAPP_NUMBER` | `917285927080` | Official WhatsApp number |
| `DEFAULT_ADMIN_EMAIL` | `nextstepsolutions.recruitment@gmail.com` | Automatically granted Super Admin role |

7. Click **Create Web Service**.
8. Render will build the Docker container and start the service.
   - On startup, Flyway runs the database migrations (`V1__initial_schema.sql` and `V2__seed_data.sql`) directly onto your Supabase PostgreSQL database.
   - Once deployment completes, note your backend URL:
     `https://nextstepsolutions-backend.onrender.com`
   - Test health check:
     `https://nextstepsolutions-backend.onrender.com/actuator/health` -> returns `{"status":"UP"}`.

---

## Part 3: Vercel Setup (React Frontend)

1. Log into [vercel.com](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Import your GitHub repository.
4. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `frontend`.
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_BASE_URL` | `https://nextstepsolutions-backend.onrender.com/api/v1` |
| `VITE_SUPABASE_URL` | `https://<REF>.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `<YOUR_SUPABASE_ANON_PUBLIC_KEY>` |

6. Click **Deploy**.
7. Vercel will install dependencies, compile the TypeScript code, run Tailwind CSS, and deploy to an edge static domain (e.g., `https://next-step-solutions.vercel.app`).
8. Notice that `frontend/vercel.json` already handles SPA routing so that refreshing deep links like `/jobs/software-developer-hyderabad-1024` works seamlessly without 404s.

---

## Part 4: Final Connect-up Step

Once your Vercel URL is live (e.g. `https://next-step-solutions.vercel.app`):
1. **Update Render CORS**:
   - In Render Web Service -> **Environment** -> Update `FRONTEND_URL` to `https://next-step-solutions.vercel.app`.
2. **Update Supabase Redirect URLs**:
   - In Supabase -> **Authentication** -> **URL Configuration** -> Add `https://next-step-solutions.vercel.app/**` to **Redirect URLs**.
