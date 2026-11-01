package com.careerbridge.candidate;

import com.careerbridge.application.Application;
import com.careerbridge.application.ApplicationService;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.job.Job;
import com.careerbridge.job.JobDTO;
import com.careerbridge.job.JobRepository;
import com.careerbridge.job.JobService;
import com.careerbridge.security.UserPrincipal;
import com.careerbridge.user.UserProfile;
import com.careerbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidate")
@PreAuthorize("hasAnyRole('CANDIDATE', 'SUPER_ADMIN')")
@RequiredArgsConstructor
public class CandidateController {

    private final CandidateProfileRepository candidateProfileRepository;
    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationService applicationService;
    private final JobService jobService;

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfile> getProfile(@AuthenticationPrincipal UserPrincipal principal) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(principal.getId())
                .orElseGet(() -> {
                    UserProfile user = userRepository.findById(principal.getId()).orElseThrow();
                    CandidateProfile newProf = CandidateProfile.builder()
                            .userId(user.getId())
                            .userProfile(user)
                            .build();
                    return candidateProfileRepository.save(newProf);
                });
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfile> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody CandidateProfile updatedProfile
    ) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(principal.getId())
                .orElseGet(() -> {
                    UserProfile user = userRepository.findById(principal.getId()).orElseThrow();
                    return CandidateProfile.builder().userId(user.getId()).userProfile(user).build();
                });

        profile.setHighestQualification(updatedProfile.getHighestQualification());
        profile.setPassoutYear(updatedProfile.getPassoutYear());
        profile.setPreferredCategory(updatedProfile.getPreferredCategory());
        profile.setPreferredLocation(updatedProfile.getPreferredLocation());
        profile.setCurrentCity(updatedProfile.getCurrentCity());
        profile.setExperienceYears(updatedProfile.getExperienceYears());
        if (updatedProfile.getSkills() != null) {
            profile.setSkills(updatedProfile.getSkills());
        }
        if (updatedProfile.getResumeUrl() != null) {
            profile.setResumeUrl(updatedProfile.getResumeUrl());
            profile.setResumeFilename(updatedProfile.getResumeFilename());
        }

        return ResponseEntity.ok(candidateProfileRepository.save(profile));
    }

    @GetMapping("/saved-jobs")
    public ResponseEntity<Page<JobDTO>> getSavedJobs(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<JobDTO> savedJobs = savedJobRepository.findByUserIdOrderBySavedAtDesc(
                principal.getId(), PageRequest.of(page, size)
        ).map(sj -> jobService.toDTO(sj.getJob()));
        return ResponseEntity.ok(savedJobs);
    }

    @PostMapping("/saved-jobs")
    public ResponseEntity<Map<String, String>> saveJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, String> payload
    ) {
        UUID jobId = UUID.fromString(payload.get("jobId"));
        if (!savedJobRepository.existsByUserIdAndJobId(principal.getId(), jobId)) {
            UserProfile user = userRepository.findById(principal.getId()).orElseThrow();
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));
            SavedJob savedJob = SavedJob.builder().user(user).job(job).build();
            savedJobRepository.save(savedJob);
        }
        return ResponseEntity.ok(Map.of("message", "Job saved successfully"));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    @Transactional
    public ResponseEntity<Map<String, String>> removeSavedJob(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID jobId
    ) {
        savedJobRepository.deleteByUserIdAndJobId(principal.getId(), jobId);
        return ResponseEntity.ok(Map.of("message", "Job removed from saved list"));
    }

    @GetMapping("/applications")
    public ResponseEntity<Page<Application>> getMyApplications(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(applicationService.getApplicationsForCandidate(principal.getId(), PageRequest.of(page, size)));
    }
}
