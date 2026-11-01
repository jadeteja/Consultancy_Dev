package com.careerbridge.job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID>, JpaSpecificationExecutor<Job> {

    Optional<Job> findBySlug(String slug);
    Optional<Job> findByJobCode(String jobCode);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND (j.applicationDeadline IS NULL OR j.applicationDeadline >= :currentDate)")
    Page<Job> findActiveJobs(@Param("status") JobStatus status, @Param("currentDate") LocalDate currentDate, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.status = 'PUBLISHED' AND j.applicationDeadline < :currentDate")
    List<Job> findJobsToMarkExpired(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT j.jobCategory, COUNT(j) FROM Job j WHERE j.status = 'PUBLISHED' GROUP BY j.jobCategory")
    List<Object[]> countJobsByCategory();

    long countByStatus(JobStatus status);

    long countByCompanyId(UUID companyId);

    List<Job> findByCreatedBy(com.careerbridge.user.UserProfile user);
}
