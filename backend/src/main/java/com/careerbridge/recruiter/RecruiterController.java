package com.careerbridge.recruiter;

import com.careerbridge.application.Application;
import com.careerbridge.application.ApplicationService;
import com.careerbridge.application.RecruitmentStatus;
import com.careerbridge.job.JobCreateRequest;
import com.careerbridge.job.JobDTO;
import com.careerbridge.job.JobService;
import com.careerbridge.job.JobStatus;
import com.careerbridge.security.UserPrincipal;
import com.careerbridge.user.UserProfile;
import com.careerbridge.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/recruiter")
@PreAuthorize("hasAnyRole('RECRUITER', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping("/jobs")
    public ResponseEntity<JobDTO> postJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody JobCreateRequest request
    ) {
        UserProfile user = userRepository.findById(principal.getId()).orElseThrow();
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<JobDTO> updateJobStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload
    ) {
        JobStatus status = JobStatus.valueOf(payload.get("status").toUpperCase());
        return ResponseEntity.ok(jobService.updateJobStatus(id, status));
    }

    @GetMapping("/applications")
    public ResponseEntity<Page<Application>> getAssignedApplications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsForRecruiter(principal.getId(), PageRequest.of(page, size)));
    }

    @PatchMapping("/applications/{id}/status")
    public ResponseEntity<Map<String, String>> updateApplicationStatus(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @RequestBody Map<String, String> payload
    ) {
        RecruitmentStatus newStatus = RecruitmentStatus.valueOf(payload.get("status").toUpperCase());
        String notes = payload.get("notes");
        applicationService.updateRecruitmentStatus(id, newStatus, principal.getId(), notes);
        return ResponseEntity.ok(Map.of("message", "Application status updated to " + newStatus));
    }
}
