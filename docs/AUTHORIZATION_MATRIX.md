# Role Authorization Matrix

| Feature / Resource | Guest | Candidate (`ROLE_CANDIDATE`) | Recruiter (`ROLE_RECRUITER`) | Super Admin (`ROLE_SUPER_ADMIN`) |
|---|:---:|:---:|:---:|:---:|
| Browse & Search Public Jobs | Yes | Yes | Yes | Yes |
| Filter by IT / Non-IT / Semi-IT | Yes | Yes | Yes | Yes |
| Apply via WhatsApp (`wa.me`) | Yes | Yes | Yes | Yes |
| Save / Bookmark Jobs | No | Yes | No | Yes |
| Maintain Candidate Profile & Skills | No | Yes | No | Yes |
| View Own Application History | No | Yes | No | Yes |
| Post New Job Vacancies | No | No | Yes | Yes |
| Update Recruitment Status on Jobs | No | No | Assigned Jobs | All Jobs |
| View Assigned Applications | No | No | Yes | Yes |
| Assign / Revoke Recruiter Roles | No | No | No | Yes |
| Manage Partner Companies | No | No | No | Yes |
| Configure WhatsApp Number & Settings | No | No | No | Yes |
| View Platform Analytics & Funnel | No | No | No | Yes |

## Enforcement

- Enforced at HTTP layer in `SecurityConfig`:
  - `/api/v1/admin/**` -> `.hasRole("SUPER_ADMIN")`
  - `/api/v1/recruiter/**` -> `.hasAnyRole("RECRUITER", "SUPER_ADMIN")`
  - `/api/v1/candidate/**` -> `.hasAnyRole("CANDIDATE", "SUPER_ADMIN")`
- Enforced at Method layer with `@PreAuthorize`.
