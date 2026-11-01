# Automated Testing & Verification Guide

## Test Architecture

The CareerBridge application contains tests across both backend and frontend layers:

- **Backend Unit & Authorization Tests**: JUnit 5 + Mockito + Spring Security Test.
- **Backend Integration Tests**: `@SpringBootTest` with Spring Data JPA and H2 in PostgreSQL mode.
- **Frontend Type & Bundle Verification**: TypeScript strict mode (`tsc -b`) + Vite production builder.

---

## Running Backend Tests

```bash
cd backend
mvn clean test
```

### Test Classes:
1. `CareerBridgeApplicationTests`: Validates Spring application context bootstrap, Hikari pool initialization, JPA repositories, and security filter chains.
2. `SecurityAuthorizationTests`: Tests UserPrincipal authority generation, role differentiation between Candidate, Recruiter, and Super Admin, and account lock/suspension enforcement.
3. `ApplicationServiceTests`: Unit tests application intent creation, official WhatsApp URL generation (`wa.me`), prefilled message structure, and repository persistence.

---

## Running Frontend Verification

```bash
cd frontend
npm run build
```

Validates:
- Strict TypeScript compile without unused symbols or type mismatches.
- Tailwind CSS v4 class tree generation.
- Production bundle generation into `dist/`.
