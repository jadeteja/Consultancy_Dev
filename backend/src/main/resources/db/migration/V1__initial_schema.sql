-- V1__initial_schema.sql
-- CareerBridge Consultancy Job Portal schema

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

-- Seed default roles
INSERT INTO roles (name, description) VALUES
    ('ROLE_CANDIDATE', 'Standard job seeker authenticated via Supabase Auth'),
    ('ROLE_RECRUITER', 'Authorized consultancy recruiter managing assigned job postings'),
    ('ROLE_SUPER_ADMIN', 'Platform super administrator with unrestricted access')
ON CONFLICT (name) DO NOTHING;

-- 2. User Profiles (Linked to Supabase Auth UUID)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY, -- Matches auth.users.id
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(25),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Roles mapping table
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 4. Candidate Profiles
CREATE TABLE IF NOT EXISTS candidate_profiles (
    user_id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
    highest_qualification VARCHAR(100),
    passout_year INTEGER,
    preferred_category VARCHAR(50), -- IT, NON_IT, SEMI_IT
    preferred_location VARCHAR(150),
    current_city VARCHAR(100),
    experience_years NUMERIC(4, 1) DEFAULT 0.0,
    resume_url VARCHAR(500),
    resume_filename VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Candidate Skills
CREATE TABLE IF NOT EXISTS candidate_skills (
    id SERIAL PRIMARY KEY,
    candidate_id UUID NOT NULL REFERENCES candidate_profiles(user_id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_candidate_skill UNIQUE(candidate_id, skill_name)
);

-- 5. Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL UNIQUE,
    slug VARCHAR(200) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    website_url VARCHAR(255),
    description TEXT,
    industry VARCHAR(100),
    headquarters VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Jobs
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_code VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,
    job_category VARCHAR(50) NOT NULL, -- IT, NON_IT, SEMI_IT
    department VARCHAR(100),
    location VARCHAR(150) NOT NULL,
    work_mode VARCHAR(50) NOT NULL DEFAULT 'ON_SITE', -- ON_SITE, HYBRID, REMOTE
    employment_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    min_qualification VARCHAR(100),
    eligible_passout_years VARCHAR(100), -- e.g. "2023, 2024, 2025"
    min_experience NUMERIC(4, 1) DEFAULT 0.0,
    max_experience NUMERIC(4, 1) DEFAULT 0.0,
    min_salary NUMERIC(12, 2),
    max_salary NUMERIC(12, 2),
    salary_period VARCHAR(50) DEFAULT 'ANNUAL', -- ANNUAL, MONTHLY
    currency VARCHAR(10) DEFAULT 'INR',
    vacancies INTEGER DEFAULT 1,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    benefits TEXT,
    application_deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED', -- DRAFT, PUBLISHED, PAUSED, CLOSED, EXPIRED
    created_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Job Skills
CREATE TABLE IF NOT EXISTS job_skills (
    id SERIAL PRIMARY KEY,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    CONSTRAINT uq_job_skill UNIQUE(job_id, skill_name)
);

-- 7. Recruiter Job Assignments
CREATE TABLE IF NOT EXISTS recruiter_job_assignments (
    id SERIAL PRIMARY KEY,
    recruiter_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_recruiter_job UNIQUE(recruiter_id, job_id)
);

-- 8. Saved Jobs
CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_saved_job UNIQUE(user_id, job_id)
);

-- 9. Applications
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(50) NOT NULL UNIQUE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL, -- Nullable for Guest WhatsApp application
    applicant_name VARCHAR(150) NOT NULL,
    applicant_email VARCHAR(255) NOT NULL,
    applicant_mobile VARCHAR(25) NOT NULL,
    highest_qualification VARCHAR(100),
    passout_year INTEGER,
    preferred_category VARCHAR(50),
    preferred_location VARCHAR(150),
    experience_level VARCHAR(50),
    current_city VARCHAR(100),
    resume_url VARCHAR(500),
    consent_given BOOLEAN NOT NULL DEFAULT TRUE,
    recruitment_status VARCHAR(50) NOT NULL DEFAULT 'NEW', -- NEW, CONTACTED, SCREENING, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED, WITHDRAWN
    whatsapp_redirect_status VARCHAR(50) NOT NULL DEFAULT 'INITIATED', -- INITIATED, SELF_REPORTED_SENT
    source VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP_PORTAL',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 10. Application Status History (Audit trail of recruitment status changes)
CREATE TABLE IF NOT EXISTS application_status_history (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    notes TEXT,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Application Events (Tracks redirect clicks, verification attempts, etc.)
CREATE TABLE IF NOT EXISTS application_events (
    id SERIAL PRIMARY KEY,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- WHATSAPP_REDIRECT_INITIATED, WHATSAPP_SENT_CONFIRMED, STATUS_CHANGED
    metadata_json TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    portal_name VARCHAR(150) NOT NULL DEFAULT 'Next step solutions',
    tagline VARCHAR(255) DEFAULT 'Your Career, Our Guidance',
    whatsapp_number VARCHAR(25) NOT NULL DEFAULT '917285927080',
    contact_email VARCHAR(150) DEFAULT 'nextstepsolutions.recruitment@gmail.com',
    contact_phone VARCHAR(25) DEFAULT '+91 72859 27080',
    office_address TEXT DEFAULT 'Cyber Towers, Hitech City, Hyderabad, Telangana 500081',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT single_row_check CHECK (id = 1)
);

-- 13. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    actor_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(job_category);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(recruitment_status);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_assignments_recruiter ON recruiter_job_assignments(recruiter_id);
