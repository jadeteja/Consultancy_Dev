package com.careerbridge.application;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationIntentRequest {

    @NotNull(message = "Job ID is required")
    private UUID jobId;

    @NotBlank(message = "Applicant name is required")
    private String applicantName;

    @NotBlank(message = "Mobile number is required")
    private String applicantMobile;

    @NotBlank(message = "Email is required")
    @Email(message = "Valid email is required")
    private String applicantEmail;

    private String highestQualification;
    private Integer passoutYear;
    private String preferredCategory;
    private String preferredLocation;
    private String experienceLevel;
    private String currentCity;
    private String resumeUrl;
    private Boolean consentGiven;
}
