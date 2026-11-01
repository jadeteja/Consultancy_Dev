package com.careerbridge.company;

import com.careerbridge.job.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @GetMapping
    public ResponseEntity<List<Company>> getCompanies() {
        return ResponseEntity.ok(companyRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'RECRUITER')")
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        if (company.getName() == null || company.getName().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Company name is required."));
        }

        String trimmedName = company.getName().trim();
        company.setName(trimmedName);

        if (companyRepository.existsByName(trimmedName)) {
            return ResponseEntity.badRequest().body(Map.of("message", "A company with the name '" + trimmedName + "' already exists."));
        }

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

        sanitizeCompany(company);

        Company saved = companyRepository.save(company);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'RECRUITER')")
    public ResponseEntity<?> updateCompany(@PathVariable UUID id, @RequestBody Company updateRequest) {
        Company existing = companyRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Company not found with ID: " + id));
        }

        if (updateRequest.getName() == null || updateRequest.getName().trim().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Company name is required."));
        }

        String trimmedName = updateRequest.getName().trim();
        if (!trimmedName.equalsIgnoreCase(existing.getName()) && companyRepository.existsByName(trimmedName)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Another company with the name '" + trimmedName + "' already exists."));
        }

        existing.setName(trimmedName);
        existing.setIndustry(updateRequest.getIndustry() != null && !updateRequest.getIndustry().trim().isBlank() ? updateRequest.getIndustry().trim() : null);
        existing.setHeadquarters(updateRequest.getHeadquarters() != null && !updateRequest.getHeadquarters().trim().isBlank() ? updateRequest.getHeadquarters().trim() : null);
        existing.setLogoUrl(updateRequest.getLogoUrl() != null && !updateRequest.getLogoUrl().trim().isBlank() ? updateRequest.getLogoUrl().trim() : null);
        existing.setWebsiteUrl(updateRequest.getWebsiteUrl() != null && !updateRequest.getWebsiteUrl().trim().isBlank() ? updateRequest.getWebsiteUrl().trim() : null);
        existing.setDescription(updateRequest.getDescription() != null && !updateRequest.getDescription().trim().isBlank() ? updateRequest.getDescription().trim() : null);

        Company saved = companyRepository.save(existing);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteCompany(@PathVariable UUID id) {
        Company existing = companyRepository.findById(id).orElse(null);
        if (existing == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Company not found with ID: " + id));
        }

        long activeJobs = jobRepository.countByCompanyId(id);
        if (activeJobs > 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete company '" + existing.getName() + "' because it has " + activeJobs + " active job posting(s). Delete or reassign the jobs first."));
        }

        companyRepository.delete(existing);
        return ResponseEntity.ok(Map.of("message", "Company '" + existing.getName() + "' successfully deleted."));
    }

    private void sanitizeCompany(Company company) {
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
    }
}
