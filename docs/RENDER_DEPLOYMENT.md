# Render Deployment Guide

This guide walks you through deploying the complete full-stack **CareerBridge Consultancy Job Portal** to Render and Supabase.

---

## 1. Supabase Database & Auth Setup

1. Create a new project on [Supabase](https://supabase.com).
2. Note down your:
   - **Project URL** (`https://xyzcompany.supabase.co`)
   - **Anon / Public Key**
   - **Database Connection String (URI)**
3. Under **Authentication > URL Configuration**:
   - Add your frontend URL to **Redirect URLs**: `https://<YOUR-RENDER-FRONTEND>.onrender.com/**`
   - Enable Email/Password authentication.
4. Under **Storage**:
   - Create a bucket named `resumes` (Private).

---

## 2. Deploying Backend Web Service on Render

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following configuration:
   - **Name**: `careerbridge-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.`
   - **Region**: Oregon (or your preferred region)
   - **Plan**: Free
5. Add the following **Environment Variables**:
   - `PORT`: `8080`
   - `SPRING_PROFILES_ACTIVE`: `prod`
   - `DATABASE_URL`: `jdbc:postgresql://db.<PROJECT_REF>.supabase.co:5432/postgres?sslmode=require`
   - `DATABASE_USERNAME`: `postgres`
   - `DATABASE_PASSWORD`: `<YOUR_SUPABASE_DB_PASSWORD>`
   - `SUPABASE_URL`: `https://<PROJECT_REF>.supabase.co`
   - `SUPABASE_JWT_ISSUER`: `https://<PROJECT_REF>.supabase.co/auth/v1`
   - `SUPABASE_JWKS_URL`: `https://<PROJECT_REF>.supabase.co/auth/v1/.well-known/jwks.json`
   - `FRONTEND_URL`: `https://<YOUR-RENDER-FRONTEND>.onrender.com`
   - `CONSULTANCY_WHATSAPP_NUMBER`: `919876543210`
   - `DEFAULT_ADMIN_EMAIL`: `admin@careerbridge.com`
6. Click **Create Web Service**. Flyway will execute database migrations `V1` and `V2` automatically on startup.

---

## 3. Deploying Frontend Static Site on Render

1. In Render, click **New +** -> **Static Site**.
2. Connect your GitHub repository.
3. Set the following configuration:
   - **Name**: `careerbridge-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://careerbridge-backend.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://<PROJECT_REF>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`: `<YOUR_SUPABASE_ANON_KEY>`
5. Add **Rewrite Rule** (SPA routing):
   - **Source**: `/*`
   - **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## 4. Verification

1. Verify backend health endpoint: `https://careerbridge-backend.onrender.com/actuator/health` returns `{"status":"UP"}`.
2. Verify API Docs: `https://careerbridge-backend.onrender.com/swagger-ui.html`.
3. Open your frontend static site URL and verify homepage categories, job listings, WhatsApp apply modal, candidate sign-in, recruiter dashboard, and admin console.
