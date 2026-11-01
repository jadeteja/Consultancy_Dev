package com.careerbridge.recruiter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecruiterJobAssignmentRepository extends JpaRepository<RecruiterJobAssignment, Integer> {
    List<RecruiterJobAssignment> findByRecruiterId(UUID recruiterId);
    boolean existsByRecruiterIdAndJobId(UUID recruiterId, UUID jobId);
}
