# Database Design & Schema Specification

The CareerBridge PostgreSQL database consists of 13 normalized tables deployed on Supabase.

## Table Definitions

### 1. `roles`
Stores standard system security roles.
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR(50) UNIQUE) -> `ROLE_CANDIDATE`, `ROLE_RECRUITER`, `ROLE_SUPER_ADMIN`
- `description` (VARCHAR(255))

### 2. `user_profiles`
Links to Supabase Auth `auth.users(id)`.
- `id` (UUID PRIMARY KEY)
- `email` (VARCHAR(255) UNIQUE NOT NULL)
- `full_name` (VARCHAR(150) NOT NULL)
- `phone_number` (VARCHAR(25))
- `is_active` (BOOLEAN DEFAULT TRUE)
- `created_at`, `updated_at` (TIMESTAMP WITH TIME ZONE)

### 3. `user_roles`
Many-to-many relationship mapping users to security roles.
- `user_id` (UUID REFERENCES user_profiles(id) ON DELETE CASCADE)
- `role_id` (INTEGER REFERENCES roles(id) ON DELETE CASCADE)
- PRIMARY KEY (`user_id`, `role_id`)

### 4. `candidate_profiles` & `candidate_skills`
Detailed resume and qualification metadata for job seekers.
- `user_id` (UUID PRIMARY KEY REFERENCES user_profiles(id))
- `highest_qualification`, `passout_year`, `preferred_category`, `preferred_location`, `current_city`
- `experience_years` (NUMERIC(4,1))
- `resume_url`, `resume_filename`

### 5. `companies`
Corporate hiring partners and MNC clients.
- `id` (UUID PRIMARY KEY)
- `name`, `slug` (UNIQUE)
- `logo_url`, `website_url`, `description`, `industry`, `headquarters`

### 6. `jobs` & `job_skills`
Job openings across IT, Non-IT, and Semi-IT.
- `id` (UUID PRIMARY KEY)
- `job_code`, `slug` (UNIQUE)
- `company_id` (UUID REFERENCES companies(id))
- `job_category` (`IT`, `NON_IT`, `SEMI_IT`)
- `work_mode`, `employment_type`
- `min_qualification`, `eligible_passout_years`
- `min_experience`, `max_experience`
- `min_salary`, `max_salary`, `currency`
- `description`, `responsibilities`, `requirements`, `benefits`
- `application_deadline` (DATE)
- `status` (`DRAFT`, `PUBLISHED`, `PAUSED`, `CLOSED`, `EXPIRED`)
- `created_by` (UUID REFERENCES user_profiles(id))

### 7. `applications`, `application_status_history`, `application_events`
Audit logs and candidate submissions initiated via WhatsApp and the web portal.
- Tracks candidate contact data, job reference, and recruitment status (`NEW`, `CONTACTED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED`, `REJECTED`, `WITHDRAWN`).

### 8. `saved_jobs`
Job bookmarks saved by authenticated candidates.

### 9. `site_settings`
Consultancy name, contact info, and official WhatsApp desk number.
