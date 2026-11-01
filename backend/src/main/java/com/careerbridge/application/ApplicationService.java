package com.careerbridge.application;

import com.careerbridge.common.SiteSetting;
import com.careerbridge.common.SiteSettingRepository;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.job.Job;
import com.careerbridge.job.JobRepository;
import com.careerbridge.user.UserProfile;
import com.careerbridge.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationStatusHistoryRepository statusHistoryRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SiteSettingRepository siteSettingRepository;

    @Transactional
    public Map<String, Object> createGuestOrUserApplication(ApplicationIntentRequest request, UUID authenticatedUserId) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job opening not found with ID: " + request.getJobId()));

        UserProfile userProfile = null;
        if (authenticatedUserId != null) {
            userProfile = userRepository.findById(authenticatedUserId).orElse(null);
        }

        String appNumber = "APP-" + System.currentTimeMillis() % 10000000;

        Application app = Application.builder()
                .applicationNumber(appNumber)
                .job(job)
                .user(userProfile)
                .applicantName(request.getApplicantName())
                .applicantEmail(request.getApplicantEmail())
                .applicantMobile(request.getApplicantMobile())
                .highestQualification(request.getHighestQualification())
                .passoutYear(request.getPassoutYear())
                .preferredCategory(request.getPreferredCategory())
                .preferredLocation(request.getPreferredLocation())
                .experienceLevel(request.getExperienceLevel())
                .currentCity(request.getCurrentCity())
                .resumeUrl(request.getResumeUrl())
                .consentGiven(Boolean.TRUE.equals(request.getConsentGiven()))
                .recruitmentStatus(RecruitmentStatus.NEW)
                .whatsappRedirectStatus("INITIATED")
                .source(authenticatedUserId != null ? "PORTAL_CANDIDATE" : "PORTAL_GUEST")
                .build();

        Application savedApp = applicationRepository.save(app);

        // Fetch consultancy WhatsApp number
        String whatsappNumber = siteSettingRepository.getSiteSettings()
                .map(SiteSetting::getWhatsappNumber)
                .orElse("917285927080");

        // Format message
        String prefilledMessage = buildWhatsAppMessage(request, job);
        String encodedMessage = URLEncoder.encode(prefilledMessage, StandardCharsets.UTF_8);
        String waLink = "https://wa.me/" + whatsappNumber.replaceAll("[^0-9]", "") + "?text=" + encodedMessage;

        return Map.of(
                "applicationId", savedApp.getId(),
                "applicationNumber", savedApp.getApplicationNumber(),
                "whatsappUrl", waLink,
                "prefilledMessage", prefilledMessage
        );
    }

    @Transactional
    public void updateRecruitmentStatus(UUID applicationId, RecruitmentStatus newStatus, UUID actorId, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        String oldStatus = application.getRecruitmentStatus().name();
        application.setRecruitmentStatus(newStatus);
        applicationRepository.save(application);

        UserProfile actor = actorId != null ? userRepository.findById(actorId).orElse(null) : null;

        ApplicationStatusHistory history = ApplicationStatusHistory.builder()
                .application(application)
                .oldStatus(oldStatus)
                .newStatus(newStatus.name())
                .changedBy(actor)
                .notes(notes)
                .build();

        statusHistoryRepository.save(history);
    }

    @Transactional(readOnly = true)
    public Page<Application> getApplicationsForCandidate(UUID candidateId, Pageable pageable) {
        return applicationRepository.findByUserIdOrderByCreatedAtDesc(candidateId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Application> getApplicationsForRecruiter(UUID recruiterId, Pageable pageable) {
        return applicationRepository.findAssignedToRecruiter(recruiterId, pageable);
    }

    @Transactional(readOnly = true)
    public Page<Application> getAllApplicationsForAdmin(Pageable pageable) {
        return applicationRepository.findAll(pageable);
    }

    private String buildWhatsAppMessage(ApplicationIntentRequest req, Job job) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hello Next step solutions,\n\n");
        sb.append("I am interested in applying for a job.\n\n");
        sb.append("Name: ").append(req.getApplicantName()).append("\n");
        sb.append("Mobile: ").append(req.getApplicantMobile()).append("\n");
        sb.append("Email: ").append(req.getApplicantEmail()).append("\n");
        if (req.getHighestQualification() != null) {
            sb.append("Qualification: ").append(req.getHighestQualification()).append("\n");
        }
        if (req.getPassoutYear() != null) {
            sb.append("Passout Year: ").append(req.getPassoutYear()).append("\n");
        }
        if (req.getPreferredCategory() != null) {
            sb.append("Preferred Category: ").append(req.getPreferredCategory()).append("\n");
        }
        if (req.getPreferredLocation() != null) {
            sb.append("Preferred Location: ").append(req.getPreferredLocation()).append("\n");
        }
        if (req.getExperienceLevel() != null) {
            sb.append("Experience: ").append(req.getExperienceLevel()).append("\n\n");
        }
        sb.append("Job Title: ").append(job.getTitle()).append("\n");
        sb.append("Company: ").append(job.getCompany().getName()).append("\n");
        sb.append("Job ID: ").append(job.getJobCode()).append("\n\n");
        sb.append("Please share further details.\n\nThank you.");
        return sb.toString();
    }
}
