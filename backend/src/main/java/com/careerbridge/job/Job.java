package com.careerbridge.job;

import com.careerbridge.company.Company;
import com.careerbridge.user.UserProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "job_code", nullable = false, unique = true, length = 50)
    private String jobCode;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_category", nullable = false, length = 50)
    private JobCategory jobCategory;

    @Column(length = 100)
    private String department;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "work_mode", nullable = false, length = 50)
    @Builder.Default
    private String workMode = "ON_SITE"; // ON_SITE, HYBRID, REMOTE

    @Column(name = "employment_type", nullable = false, length = 50)
    @Builder.Default
    private String employmentType = "FULL_TIME"; // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP

    @Column(name = "min_qualification", length = 100)
    private String minQualification;

    @Column(name = "eligible_passout_years", length = 100)
    private String eligiblePassoutYears;

    @Column(name = "min_experience", precision = 4, scale = 1)
    private BigDecimal minExperience;

    @Column(name = "max_experience", precision = 4, scale = 1)
    private BigDecimal maxExperience;

    @Column(name = "min_salary", precision = 12, scale = 2)
    private BigDecimal minSalary;

    @Column(name = "max_salary", precision = 12, scale = 2)
    private BigDecimal maxSalary;

    @Column(name = "salary_period", length = 50)
    @Builder.Default
    private String salaryPeriod = "ANNUAL"; // ANNUAL, MONTHLY

    @Column(length = 10)
    @Builder.Default
    private String currency = "INR";

    @Column(nullable = false)
    @Builder.Default
    private Integer vacancies = 1;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private JobStatus status = JobStatus.PUBLISHED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private UserProfile createdBy;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> requiredSkills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
