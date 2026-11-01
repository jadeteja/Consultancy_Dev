package com.careerbridge.recruiter;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "recruiter_job_assignments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecruiterJobAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "recruiter_id", nullable = false)
    private UUID recruiterId;

    @Column(name = "job_id", nullable = false)
    private UUID jobId;

    @CreationTimestamp
    @Column(name = "assigned_at", nullable = false, updatable = false)
    private OffsetDateTime assignedAt;
}
