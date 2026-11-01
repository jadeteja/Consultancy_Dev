package com.careerbridge.job;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class JobPublicController {

    private final JobService jobService;

    @GetMapping("/jobs")
    public ResponseEntity<Page<JobDTO>> getJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) JobCategory category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minExp,
            @RequestParam(required = false) BigDecimal maxExp,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) String workMode,
            @RequestParam(required = false) String passoutYear,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(jobService.searchJobs(keyword, category, location, minExp, maxExp, minSalary, workMode, passoutYear, pageable));
    }

    @GetMapping("/jobs/{identifier}")
    public ResponseEntity<JobDTO> getJobDetails(@PathVariable String identifier) {
        return ResponseEntity.ok(jobService.getJobByIdOrSlug(identifier));
    }

    @GetMapping("/job-categories")
    public ResponseEntity<List<String>> getJobCategories() {
        return ResponseEntity.ok(Arrays.stream(JobCategory.values()).map(Enum::name).toList());
    }
}
