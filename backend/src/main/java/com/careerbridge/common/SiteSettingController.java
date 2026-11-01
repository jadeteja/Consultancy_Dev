package com.careerbridge.common;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/site-settings")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingRepository siteSettingRepository;

    @GetMapping("/public")
    public ResponseEntity<SiteSetting> getPublicSettings() {
        SiteSetting settings = siteSettingRepository.getSiteSettings()
                .orElseGet(() -> SiteSetting.builder()
                        .portalName("Next step solutions")
                        .tagline("Your Career, Our Guidance")
                        .whatsappNumber("917285927080")
                        .contactEmail("nextstepsolutions.recruitment@gmail.com")
                        .contactPhone("+91 72859 27080")
                        .officeAddress("Cyber Towers, HITEC City, Hyderabad, Telangana 500081")
                        .build());
        return ResponseEntity.ok(settings);
    }
}
