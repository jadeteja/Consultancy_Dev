package com.careerbridge.company;

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
}
