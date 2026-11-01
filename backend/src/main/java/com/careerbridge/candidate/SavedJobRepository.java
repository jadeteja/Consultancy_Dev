package com.careerbridge.candidate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, Integer> {
    Page<SavedJob> findByUserIdOrderBySavedAtDesc(UUID userId, Pageable pageable);
    Optional<SavedJob> findByUserIdAndJobId(UUID userId, UUID jobId);
    boolean existsByUserIdAndJobId(UUID userId, UUID jobId);
    void deleteByUserIdAndJobId(UUID userId, UUID jobId);
    long countByUserId(UUID userId);
}
