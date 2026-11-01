package com.careerbridge.application;

import com.careerbridge.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationPublicController {

    private final ApplicationService applicationService;

    @PostMapping("/guest-intent")
    public ResponseEntity<Map<String, Object>> submitGuestIntent(
            @Valid @RequestBody ApplicationIntentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                applicationService.createGuestOrUserApplication(request, principal != null ? principal.getId() : null)
        );
    }
}
