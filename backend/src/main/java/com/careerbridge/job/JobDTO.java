package com.careerbridge.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private UUID id;
    private String jobCode;
    private String slug;
    private String title;
    private UUID companyId;
    private String companyName;
    private String companyLogoUrl;
    private String jobCategory;
    private String department;
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
    private String description;
    private String responsibilities;
    private String requirements;
    private String benefits;
    private LocalDate applicationDeadline;
    private String status;
    private Set<String> requiredSkills;
    private OffsetDateTime createdAt;
}
