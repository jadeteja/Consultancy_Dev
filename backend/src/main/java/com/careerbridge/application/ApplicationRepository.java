package com.careerbridge.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    Optional<Application> findByApplicationNumber(String applicationNumber);

    Page<Application> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.id = :jobId ORDER BY a.createdAt DESC")
    Page<Application> findByJobId(@Param("jobId") UUID jobId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.job.id IN " +
           "(SELECT r.jobId FROM RecruiterJobAssignment r WHERE r.recruiterId = :recruiterId) " +
           "OR a.job.createdBy.id = :recruiterId ORDER BY a.createdAt DESC")
    Page<Application> findAssignedToRecruiter(@Param("recruiterId") UUID recruiterId, Pageable pageable);

    long countByRecruitmentStatus(RecruitmentStatus status);

    @Query("SELECT a.recruitmentStatus, COUNT(a) FROM Application a GROUP BY a.recruitmentStatus")
    List<Object[]> countApplicationsByStatus();
}
