package com.careerbridge.application;

import com.careerbridge.job.Job;
import com.careerbridge.user.UserProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "application_number", nullable = false, unique = true, length = 50)
    private String applicationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserProfile user;

    @Column(name = "applicant_name", nullable = false, length = 150)
    private String applicantName;

    @Column(name = "applicant_email", nullable = false)
    private String applicantEmail;

    @Column(name = "applicant_mobile", nullable = false, length = 25)
    private String applicantMobile;

    @Column(name = "highest_qualification", length = 100)
    private String highestQualification;

    @Column(name = "passout_year")
    private Integer passoutYear;

    @Column(name = "preferred_category", length = 50)
    private String preferredCategory;

    @Column(name = "preferred_location", length = 150)
    private String preferredLocation;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "current_city", length = 100)
    private String currentCity;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "consent_given", nullable = false)
    @Builder.Default
    private Boolean consentGiven = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "recruitment_status", nullable = false, length = 50)
    @Builder.Default
    private RecruitmentStatus recruitmentStatus = RecruitmentStatus.NEW;

    @Column(name = "whatsapp_redirect_status", nullable = false, length = 50)
    @Builder.Default
    private String whatsappRedirectStatus = "INITIATED"; // INITIATED, SELF_REPORTED_SENT

    @Column(nullable = false, length = 50)
    @Builder.Default
    private String source = "WHATSAPP_PORTAL";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
