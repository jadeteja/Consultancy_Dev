# REST API Documentation

Base path: `/api/v1`
Interactive Swagger UI: `http://localhost:8080/swagger-ui.html`
OpenAPI JSON: `http://localhost:8080/api-docs`

---

## 1. Public APIs (No authentication required)

### `GET /api/v1/jobs`
Search and filter published jobs with pagination.
- **Query Params**: `keyword`, `category` (IT, NON_IT, SEMI_IT), `location`, `workMode`, `passoutYear`, `minSalary`, `page`, `size`, `sortBy`, `sortDir`.
- **Response**: `Page<JobDTO>`

### `GET /api/v1/jobs/{identifier}`
Get job details by ID or URL slug.
- **Response**: `JobDTO`

### `GET /api/v1/companies`
List verified corporate hiring partners.
- **Response**: `List<Company>`

### `GET /api/v1/site-settings/public`
Retrieve public consultancy contact information and configured WhatsApp number.
- **Response**: `SiteSetting`

### `POST /api/v1/applications/guest-intent`
Submit an application intent and generate the official `wa.me` redirect URL.
- **Body**: `ApplicationIntentRequest`
- **Response**: `{ applicationId, applicationNumber, whatsappUrl, prefilledMessage }`

---

## 2. Candidate APIs (`ROLE_CANDIDATE` or `ROLE_SUPER_ADMIN`)

### `GET /api/v1/candidate/profile`
Retrieve the current authenticated candidate's profile.

### `PUT /api/v1/candidate/profile`
Update education, passout year, preferred category, location, and skills.

### `GET /api/v1/candidate/saved-jobs`
List bookmarked jobs for the authenticated candidate.

### `POST /api/v1/candidate/saved-jobs`
Bookmark a job opening. Body: `{ "jobId": "uuid" }`.

### `DELETE /api/v1/candidate/saved-jobs/{jobId}`
Remove a job from saved bookmarks.

### `GET /api/v1/candidate/applications`
Track application history and current recruitment screening status.

---

## 3. Recruiter APIs (`ROLE_RECRUITER` or `ROLE_SUPER_ADMIN`)

### `POST /api/v1/recruiter/jobs`
Create and publish a new job opening for a partner company.
- **Body**: `JobCreateRequest`

### `PATCH /api/v1/recruiter/jobs/{id}/status`
Update job lifecycle status (`PUBLISHED`, `PAUSED`, `CLOSED`, `EXPIRED`).

### `GET /api/v1/recruiter/applications`
List candidate applications submitted to assigned postings.

### `PATCH /api/v1/recruiter/applications/{id}/status`
Update candidate recruitment stage (`NEW`, `CONTACTED`, `SCREENING`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `SELECTED`, `REJECTED`).

---

## 4. Super Admin APIs (`ROLE_SUPER_ADMIN`)

### `GET /api/v1/admin/dashboard`
Analytics overview: total jobs, active jobs, expired jobs, candidates, applications, jobs by category, and recruitment funnel stages.

### `GET /api/v1/admin/users`
List all registered user accounts and their assigned roles.

### `POST /api/v1/admin/recruiters/assign`
Assign `ROLE_RECRUITER` to a user by email. Body: `{ "email": "user@example.com" }`.

### `POST /api/v1/admin/companies`
Register a new corporate hiring partner.

### `GET /api/v1/admin/applications`
Global list of all applications across all jobs.

### `PUT /api/v1/admin/site-settings`
Update consultancy portal name, official WhatsApp number, and contact info.
