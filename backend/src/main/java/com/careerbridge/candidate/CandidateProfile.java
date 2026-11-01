package com.careerbridge.candidate;

import com.careerbridge.user.UserProfile;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "candidate_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private UserProfile userProfile;

    @Column(name = "highest_qualification", length = 100)
    private String highestQualification;

    @Column(name = "passout_year")
    private Integer passoutYear;

    @Column(name = "preferred_category", length = 50)
    private String preferredCategory; // IT, NON_IT, SEMI_IT

    @Column(name = "preferred_location", length = 150)
    private String preferredLocation;

    @Column(name = "current_city", length = 100)
    private String currentCity;

    @Column(name = "experience_years", precision = 4, scale = 1)
    @Builder.Default
    private BigDecimal experienceYears = BigDecimal.ZERO;

    @Column(name = "resume_url", length = 500)
    private String resumeUrl;

    @Column(name = "resume_filename", length = 255)
    private String resumeFilename;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "candidate_skills", joinColumns = @JoinColumn(name = "candidate_id"))
    @Column(name = "skill_name")
    @Builder.Default
    private Set<String> skills = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
