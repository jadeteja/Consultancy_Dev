package com.careerbridge.job;

import com.careerbridge.company.Company;
import com.careerbridge.company.CompanyRepository;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.user.UserProfile;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    @Transactional(readOnly = true)
    public Page<JobDTO> searchJobs(
            String keyword,
            JobCategory category,
            String location,
            BigDecimal minExp,
            BigDecimal maxExp,
            BigDecimal minSalary,
            String workMode,
            String passoutYear,
            Pageable pageable
    ) {
        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), JobStatus.PUBLISHED));

            if (keyword != null && !keyword.isBlank()) {
                String searchPattern = "%" + keyword.toLowerCase() + "%";
                Predicate titleMatch = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate companyMatch = cb.like(cb.lower(root.get("company").get("name")), searchPattern);
                Predicate descMatch = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titleMatch, companyMatch, descMatch));
            }

            if (category != null) {
                predicates.add(cb.equal(root.get("jobCategory"), category));
            }

            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }

            if (minExp != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("minExperience"), minExp));
            }

            if (maxExp != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxExperience"), maxExp));
            }

            if (minSalary != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("maxSalary"), minSalary));
            }

            if (workMode != null && !workMode.isBlank()) {
                predicates.add(cb.equal(cb.upper(root.get("workMode")), workMode.toUpperCase()));
            }

            if (passoutYear != null && !passoutYear.isBlank()) {
                predicates.add(cb.like(root.get("eligiblePassoutYears"), "%" + passoutYear + "%"));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec, pageable).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public JobDTO getJobByIdOrSlug(String identifier) {
        Job job;
        try {
            UUID id = UUID.fromString(identifier);
            job = jobRepository.findById(id).orElse(null);
        } catch (IllegalArgumentException e) {
            job = null;
        }

        if (job == null) {
            job = jobRepository.findBySlug(identifier)
                    .orElseThrow(() -> new ResourceNotFoundException("Job not found with identifier: " + identifier));
        }

        return toDTO(job);
    }

    @Transactional
    public JobDTO createJob(JobCreateRequest request, UserProfile creator) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with ID: " + request.getCompanyId()));

        String slug = generateSlug(request.getTitle(), request.getLocation());
        String jobCode = "JOB-" + (1000 + (int)(Math.random() * 9000));

        Job job = Job.builder()
                .jobCode(jobCode)
                .slug(slug)
                .title(request.getTitle())
                .company(company)
                .jobCategory(request.getJobCategory())
                .department(request.getDepartment())
                .location(request.getLocation())
                .workMode(request.getWorkMode() != null ? request.getWorkMode() : "ON_SITE")
                .employmentType(request.getEmploymentType() != null ? request.getEmploymentType() : "FULL_TIME")
                .minQualification(request.getMinQualification())
                .eligiblePassoutYears(request.getEligiblePassoutYears())
                .minExperience(request.getMinExperience() != null ? request.getMinExperience() : BigDecimal.ZERO)
                .maxExperience(request.getMaxExperience() != null ? request.getMaxExperience() : BigDecimal.ZERO)
                .minSalary(request.getMinSalary())
                .maxSalary(request.getMaxSalary())
                .salaryPeriod(request.getSalaryPeriod() != null ? request.getSalaryPeriod() : "ANNUAL")
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .vacancies(request.getVacancies() != null ? request.getVacancies() : 1)
                .description(request.getDescription())
                .responsibilities(request.getResponsibilities())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .applicationDeadline(request.getApplicationDeadline())
                .status(JobStatus.PUBLISHED)
                .createdBy(creator)
                .requiredSkills(request.getRequiredSkills() != null ? request.getRequiredSkills() : new HashSet<>())
                .build();

        Job saved = jobRepository.save(job);
        return toDTO(saved);
    }

    @Transactional
    public JobDTO updateJobStatus(UUID jobId, JobStatus newStatus) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with ID: " + jobId));
        job.setStatus(newStatus);
        return toDTO(jobRepository.save(job));
    }

    @Scheduled(cron = "0 0 1 * * ?") // Daily at 1 AM
    @Transactional
    public void autoExpireJobs() {
        List<Job> expiredJobs = jobRepository.findJobsToMarkExpired(LocalDate.now());
        if (!expiredJobs.isEmpty()) {
            log.info("Expiring {} overdue job postings", expiredJobs.size());
            for (Job j : expiredJobs) {
                j.setStatus(JobStatus.EXPIRED);
            }
            jobRepository.saveAll(expiredJobs);
        }
    }

    public JobDTO toDTO(Job job) {
        return JobDTO.builder()
                .id(job.getId())
                .jobCode(job.getJobCode())
                .slug(job.getSlug())
                .title(job.getTitle())
                .companyId(job.getCompany().getId())
                .companyName(job.getCompany().getName())
                .companyLogoUrl(job.getCompany().getLogoUrl())
                .jobCategory(job.getJobCategory().name())
                .department(job.getDepartment())
                .location(job.getLocation())
                .workMode(job.getWorkMode())
                .employmentType(job.getEmploymentType())
                .minQualification(job.getMinQualification())
                .eligiblePassoutYears(job.getEligiblePassoutYears())
                .minExperience(job.getMinExperience())
                .maxExperience(job.getMaxExperience())
                .minSalary(job.getMinSalary())
                .maxSalary(job.getMaxSalary())
                .salaryPeriod(job.getSalaryPeriod())
                .currency(job.getCurrency())
                .vacancies(job.getVacancies())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .benefits(job.getBenefits())
                .applicationDeadline(job.getApplicationDeadline())
                .status(job.getStatus().name())
                .requiredSkills(job.getRequiredSkills())
                .createdAt(job.getCreatedAt())
                .build();
    }

    private String generateSlug(String title, String location) {
        String base = (title + "-" + location).toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        return base + "-" + System.currentTimeMillis() % 10000;
    }
}
