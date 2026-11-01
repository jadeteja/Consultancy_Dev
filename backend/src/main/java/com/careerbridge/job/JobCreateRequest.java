package com.careerbridge.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobCreateRequest {
    @NotBlank(message = "Job title is required")
    private String title;

    @NotNull(message = "Company ID is required")
    private UUID companyId;

    @NotNull(message = "Job category is required")
    private JobCategory jobCategory;

    private String department;

    @NotBlank(message = "Location is required")
    private String location;

    private String workMode;
    private String employmentType;
    private String minQualification;
    private String eligiblePassoutYears;
    private BigDecimal minExperience;
    private BigDecimal maxExperience;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String salaryPeriod;
    private String currency;
    private Integer vacancies;

    @NotBlank(message = "Job description is required")
    private String description;

    private String responsibilities;
    private String requirements;
    private String benefits;
    private LocalDate applicationDeadline;
    private Set<String> requiredSkills;
}
