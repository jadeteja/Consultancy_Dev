# CareerBridge Consultancy Job Portal

Production-grade Recruitment Consultancy Web Application with direct WhatsApp candidate application workflow, role-based access control (RBAC), Flyway migrations, and Render + Supabase deployment architecture.

![UI Design Reference](media_1793437889995_68322f06.jpg)

## Technology Stack

- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS, Lucide React, TanStack Query, Axios, React Router.
- **Backend**: Java 21, Spring Boot 3.3.4, Spring Data JPA, Spring Security with Supabase JWT & JWKS validation, Flyway Migrations, Springdoc OpenAPI 2.6.
- **Database**: Supabase PostgreSQL with automated Flyway versioned schemas and realistic seed data.
- **Hosting & CI/CD**: Render Static Site (Frontend) + Render Web Service (Multi-stage Dockerfile Backend).

---

## Key Features

1. **Category Navigation**: 3 prominent sectors: **IT Jobs**, **Non-IT Jobs**, and **Semi-IT Jobs**.
2. **Interactive WhatsApp Application Flow**: Candidates fill in name, mobile, email, qualification, and passout batch. CareerBridge formats the application message and redirects directly to the official WhatsApp desk (`wa.me`) while logging submission events.
3. **Role-Based Access Control**:
   - **Guest**: Public job search, company listings, and WhatsApp applications.
   - **Candidate**: Personal profile, application tracker, saved jobs bookmarking.
   - **Recruiter**: Job vacancy creation, recruitment funnel stage updates (NEW, SCREENING, SHORTLISTED, INTERVIEW_SCHEDULED, SELECTED, REJECTED).
   - **Super Admin**: Analytics dashboard, user & recruiter role assignment, partner corporate management, WhatsApp number configuration.
4. **Production Architecture**:
   - Flyway automated migrations (`V1__initial_schema.sql`, `V2__seed_data.sql`).
   - Stateless JWT authentication via Supabase Auth with server-enforced RBAC.
   - OpenAPI Swagger documentation available at `/swagger-ui.html`.
   - Multi-stage Docker container for Render deployment.

---

## Local Development Setup

### 1. Backend

```bash
cd backend
mvn spring-boot:run
```

API runs by default on `http://localhost:8080`.
Swagger UI documentation: `http://localhost:8080/swagger-ui.html`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Deployment to Render

Refer to [`docs/RENDER_DEPLOYMENT.md`](docs/RENDER_DEPLOYMENT.md) for step-by-step instructions and use [`render.yaml`](render.yaml) for automated Blueprint provisioning.
