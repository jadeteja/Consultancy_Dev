package com.careerbridge.application;

import com.careerbridge.common.SiteSetting;
import com.careerbridge.common.SiteSettingRepository;
import com.careerbridge.company.Company;
import com.careerbridge.job.Job;
import com.careerbridge.job.JobCategory;
import com.careerbridge.job.JobRepository;
import com.careerbridge.job.JobStatus;
import com.careerbridge.user.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTests {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ApplicationStatusHistoryRepository statusHistoryRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SiteSettingRepository siteSettingRepository;

    @InjectMocks
    private ApplicationService applicationService;

    @Test
    @DisplayName("Guest candidate WhatsApp application generates formatted wa.me URL")
    void testWhatsAppApplicationCreation() {
        UUID jobId = UUID.randomUUID();
        Company company = Company.builder().name("Infosys Limited").build();
        Job job = Job.builder()
                .id(jobId)
                .jobCode("JOB-1025")
                .title("Business Analyst")
                .company(company)
                .jobCategory(JobCategory.IT)
                .status(JobStatus.PUBLISHED)
                .build();

        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(siteSettingRepository.getSiteSettings()).thenReturn(Optional.of(
                SiteSetting.builder().whatsappNumber("917285927080").build()
        ));

        Application savedApp = Application.builder()
                .id(UUID.randomUUID())
                .applicationNumber("APP-998877")
                .job(job)
                .applicantName("Akash Sharma")
                .recruitmentStatus(RecruitmentStatus.NEW)
                .build();

        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        ApplicationIntentRequest request = ApplicationIntentRequest.builder()
                .jobId(jobId)
                .applicantName("Akash Sharma")
                .applicantEmail("akash@example.com")
                .applicantMobile("9876543210")
                .highestQualification("B.Tech")
                .passoutYear(2025)
                .preferredCategory("IT")
                .consentGiven(true)
                .build();

        Map<String, Object> result = applicationService.createGuestOrUserApplication(request, null);

        assertNotNull(result);
        assertEquals("APP-998877", result.get("applicationNumber"));
        assertTrue(result.get("whatsappUrl").toString().contains("wa.me/917285927080"));
        assertTrue(result.get("prefilledMessage").toString().contains("Akash Sharma"));
        assertTrue(result.get("prefilledMessage").toString().contains("JOB-1025"));
    }
}
