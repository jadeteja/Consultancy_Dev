package com.careerbridge.admin;

import com.careerbridge.application.Application;
import com.careerbridge.application.ApplicationRepository;
import com.careerbridge.application.ApplicationService;
import com.careerbridge.application.RecruitmentStatus;
import com.careerbridge.common.SiteSetting;
import com.careerbridge.common.SiteSettingRepository;
import com.careerbridge.company.Company;
import com.careerbridge.company.CompanyRepository;
import com.careerbridge.exception.ResourceNotFoundException;
import com.careerbridge.job.JobCategory;
import com.careerbridge.job.JobRepository;
import com.careerbridge.job.JobStatus;
import com.careerbridge.user.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final ApplicationService applicationService;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalJobs = jobRepository.count();
        long activeJobs = jobRepository.countByStatus(JobStatus.PUBLISHED);
        long expiredJobs = jobRepository.countByStatus(JobStatus.EXPIRED);
        long totalCandidates = userRepository.count();
        long totalApplications = applicationRepository.count();

        List<Object[]> jobsCatRaw = jobRepository.countJobsByCategory();
        Map<String, Long> jobsByCategory = new HashMap<>();
        for (Object[] row : jobsCatRaw) {
            jobsByCategory.put(row[0].toString(), (Long) row[1]);
        }

        List<Object[]> appsStatusRaw = applicationRepository.countApplicationsByStatus();
        Map<String, Long> applicationsByStatus = new HashMap<>();
        for (Object[] row : appsStatusRaw) {
            applicationsByStatus.put(row[0].toString(), (Long) row[1]);
        }

        return ResponseEntity.ok(Map.of(
                "totalJobs", totalJobs,
                "activeJobs", activeJobs,
                "expiredJobs", expiredJobs,
                "totalCandidates", totalCandidates,
                "totalApplications", totalApplications,
                "jobsByCategory", jobsByCategory,
                "applicationsByStatus", applicationsByStatus
        ));
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserProfile>> listUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/recruiters/assign")
    @Transactional
    public ResponseEntity<Map<String, String>> assignRecruiterRole(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        UserProfile user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Role recruiterRole = roleRepository.findByName(RoleType.ROLE_RECRUITER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ROLE_RECRUITER).build()));

        user.getRoles().add(recruiterRole);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Recruiter role assigned to " + email));
    }

    @PostMapping("/companies")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        if (company.getName() == null || company.getName().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Company name is required."));
        }

        String trimmedName = company.getName().trim();
        company.setName(trimmedName);

        if (companyRepository.existsByName(trimmedName)) {
            return ResponseEntity.badRequest().body(Map.of("message", "A company with the name '" + trimmedName + "' already exists."));
        }

        // Generate and ensure unique slug
        String baseSlug = (company.getSlug() != null && !company.getSlug().trim().isBlank())
                ? company.getSlug().trim().toLowerCase().replaceAll("[^a-z0-9]+", "-")
                : trimmedName.toLowerCase().replaceAll("[^a-z0-9]+", "-");
        baseSlug = baseSlug.replaceAll("^-+|-+$", "");
        if (baseSlug.isBlank()) {
            baseSlug = "company-" + UUID.randomUUID().toString().substring(0, 8);
        }

        String candidateSlug = baseSlug;
        int counter = 1;
        while (companyRepository.findBySlug(candidateSlug).isPresent()) {
            candidateSlug = baseSlug + "-" + counter++;
        }
        company.setSlug(candidateSlug);

        // Sanitize optional fields
        if (company.getIndustry() != null && company.getIndustry().trim().isBlank()) {
            company.setIndustry(null);
        } else if (company.getIndustry() != null) {
            company.setIndustry(company.getIndustry().trim());
        }

        if (company.getHeadquarters() != null && company.getHeadquarters().trim().isBlank()) {
            company.setHeadquarters(null);
        } else if (company.getHeadquarters() != null) {
            company.setHeadquarters(company.getHeadquarters().trim());
        }

        if (company.getLogoUrl() != null && company.getLogoUrl().trim().isBlank()) {
            company.setLogoUrl(null);
        } else if (company.getLogoUrl() != null) {
            company.setLogoUrl(company.getLogoUrl().trim());
        }

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/applications")
    public ResponseEntity<Page<Application>> listAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        return ResponseEntity.ok(applicationService.getAllApplicationsForAdmin(PageRequest.of(page, size)));
    }

    @PutMapping("/site-settings")
    public ResponseEntity<SiteSetting> updateSiteSettings(@RequestBody SiteSetting updatedSettings) {
        SiteSetting setting = siteSettingRepository.getSiteSettings()
                .orElse(SiteSetting.builder().id(1).build());

        if (updatedSettings.getPortalName() != null) setting.setPortalName(updatedSettings.getPortalName());
        if (updatedSettings.getTagline() != null) setting.setTagline(updatedSettings.getTagline());
        if (updatedSettings.getWhatsappNumber() != null) setting.setWhatsappNumber(updatedSettings.getWhatsappNumber());
        if (updatedSettings.getContactEmail() != null) setting.setContactEmail(updatedSettings.getContactEmail());
        if (updatedSettings.getContactPhone() != null) setting.setContactPhone(updatedSettings.getContactPhone());
        if (updatedSettings.getOfficeAddress() != null) setting.setOfficeAddress(updatedSettings.getOfficeAddress());

        return ResponseEntity.ok(siteSettingRepository.save(setting));
    }
}
