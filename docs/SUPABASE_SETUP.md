# Supabase Setup Guide

## 1. Project Creation
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under Project Settings -> API, copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (keep secure, never use in frontend)

## 2. Authentication Configuration
1. Navigate to **Authentication -> Providers -> Email**:
   - Ensure Email provider is enabled.
2. Navigate to **Authentication -> URL Configuration**:
   - Set **Site URL** to your frontend production domain (e.g., `https://careerbridge.onrender.com`).
   - Add **Redirect URLs**: `https://careerbridge.onrender.com/**` and `http://localhost:5173/**`.

## 3. Storage Setup
1. Go to **Storage -> Create Bucket**:
   - Name: `resumes`
   - Privacy: **Private**
2. Resumes uploaded by candidates can only be read through backend authenticated signed URLs.

## 4. Database Connection
1. In Project Settings -> Database:
   - Note the connection pooling connection string (port 6543) or direct connection (port 5432).
   - Use direct connection string for Spring Boot Flyway migrations:
     `jdbc:postgresql://db.<REF>.supabase.co:5432/postgres?sslmode=require`
