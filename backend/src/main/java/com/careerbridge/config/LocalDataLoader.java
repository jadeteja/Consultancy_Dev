package com.careerbridge.config;

import com.careerbridge.common.SiteSetting;
import com.careerbridge.common.SiteSettingRepository;
import com.careerbridge.company.Company;
import com.careerbridge.company.CompanyRepository;
import com.careerbridge.job.Job;
import com.careerbridge.job.JobCategory;
import com.careerbridge.job.JobRepository;
import com.careerbridge.job.JobStatus;
import com.careerbridge.user.Role;
import com.careerbridge.user.RoleRepository;
import com.careerbridge.user.RoleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

@Component
@Profile("local")
@RequiredArgsConstructor
@Slf4j
public class LocalDataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    @Override
    public void run(String... args) {
        log.info("Bootstrapping in-memory data for local development...");

        // 1. Roles
        roleRepository.save(Role.builder().name(RoleType.ROLE_CANDIDATE).description("Candidate").build());
        roleRepository.save(Role.builder().name(RoleType.ROLE_RECRUITER).description("Recruiter").build());
        roleRepository.save(Role.builder().name(RoleType.ROLE_SUPER_ADMIN).description("Admin").build());

        // 2. Site settings
        siteSettingRepository.save(SiteSetting.builder()
                .id(1)
                .portalName("Next step solutions")
                .tagline("Your Career, Our Guidance")
                .whatsappNumber("917285927080")
                .contactEmail("nextstepsolutions.recruitment@gmail.com")
                .contactPhone("+91 72859 27080")
                .officeAddress("Cyber Towers, HITEC City, Hyderabad, 500081")
                .build());

        // 3. Companies
        Company tcs = companyRepository.save(Company.builder()
                .name("Tata Consultancy Services (TCS)")
                .slug("tcs")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg")
                .industry("Information Technology")
                .headquarters("Mumbai, India")
                .build());

        Company infosys = companyRepository.save(Company.builder()
                .name("Infosys Limited")
                .slug("infosys")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg")
                .industry("Information Technology")
                .headquarters("Bengaluru, India")
                .build());

        Company wipro = companyRepository.save(Company.builder()
                .name("Wipro Limited")
                .slug("wipro")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg")
                .industry("Information Technology")
                .headquarters("Bengaluru, India")
                .build());

        Company accenture = companyRepository.save(Company.builder()
                .name("Accenture")
                .slug("accenture")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg")
                .industry("Management Consulting")
                .headquarters("Dublin, Ireland")
                .build());

        Company hcl = companyRepository.save(Company.builder()
                .name("HCL Technologies")
                .slug("hcl-technologies")
                .logoUrl("https://upload.wikimedia.org/wikipedia/commons/8/8e/HCLTech_Logo.svg")
                .industry("Information Technology")
                .headquarters("Noida, India")
                .build());

        // 4. Jobs across IT, Non-IT, Semi-IT
        jobRepository.save(Job.builder()
                .jobCode("JOB-1024")
                .slug("software-developer-hyderabad-1024")
                .title("Software Developer")
                .company(tcs)
                .jobCategory(JobCategory.IT)
                .department("Application Development")
                .location("Hyderabad")
                .workMode("HYBRID")
                .employmentType("FULL_TIME")
                .minQualification("B.Tech / B.E / MCA")
                .eligiblePassoutYears("2023, 2024, 2025, 2026")
                .minExperience(BigDecimal.ZERO)
                .maxExperience(BigDecimal.valueOf(2.0))
                .minSalary(BigDecimal.valueOf(600000))
                .maxSalary(BigDecimal.valueOf(1000000))
                .description("We are looking for passionate Software Developers to join our team.")
                .responsibilities("Develop web applications; Write unit tests; Collaborate with cross-functional teams.")
                .requirements("Java, Spring Boot, React, REST API, SQL.")
                .benefits("Health Insurance, Flexible Hybrid Work, Performance Bonus")
                .applicationDeadline(LocalDate.now().plusDays(45))
                .status(JobStatus.PUBLISHED)
                .requiredSkills(Set.of("Java", "Spring Boot", "React", "REST API", "SQL"))
                .build());

        jobRepository.save(Job.builder()
                .jobCode("JOB-1025")
                .slug("business-analyst-pune-1025")
                .title("Business Analyst")
                .company(infosys)
                .jobCategory(JobCategory.IT)
                .department("Analytics & Consulting")
                .location("Pune")
                .workMode("HYBRID")
                .employmentType("FULL_TIME")
                .minQualification("B.Tech / MBA / MCA")
                .eligiblePassoutYears("2022, 2023, 2024, 2025")
                .minExperience(BigDecimal.valueOf(2.0))
                .maxExperience(BigDecimal.valueOf(4.0))
                .minSalary(BigDecimal.valueOf(800000))
                .maxSalary(BigDecimal.valueOf(1200000))
                .description("Seeking a skilled Business Analyst to bridge technology and business.")
                .requirements("SQL, Data Analysis, Reporting, Excel.")
                .applicationDeadline(LocalDate.now().plusDays(30))
                .status(JobStatus.PUBLISHED)
                .requiredSkills(Set.of("SQL", "Data Analysis", "Reporting", "Excel"))
                .build());

        jobRepository.save(Job.builder()
                .jobCode("JOB-1026")
                .slug("hr-executive-hyderabad-1026")
                .title("HR Executive")
                .company(wipro)
                .jobCategory(JobCategory.NON_IT)
                .department("Human Resources")
                .location("Hyderabad")
                .workMode("ON_SITE")
                .employmentType("FULL_TIME")
                .minQualification("MBA HR / BBA / Graduate")
                .eligiblePassoutYears("2023, 2024, 2025, 2026")
                .minExperience(BigDecimal.ZERO)
                .maxExperience(BigDecimal.valueOf(2.0))
                .minSalary(BigDecimal.valueOf(300000))
                .maxSalary(BigDecimal.valueOf(500000))
                .description("Talent sourcing, candidate scheduling, and HR operations.")
                .requirements("Recruitment, Communication, MS Office, Sourcing.")
                .applicationDeadline(LocalDate.now().plusDays(40))
                .status(JobStatus.PUBLISHED)
                .requiredSkills(Set.of("Recruitment", "Communication", "MS Office"))
                .build());

        jobRepository.save(Job.builder()
                .jobCode("JOB-1027")
                .slug("process-associate-chennai-1027")
                .title("Process Associate")
                .company(accenture)
                .jobCategory(JobCategory.SEMI_IT)
                .department("Process Operations")
                .location("Chennai")
                .workMode("ON_SITE")
                .employmentType("FULL_TIME")
                .minQualification("Any Graduate")
                .eligiblePassoutYears("2023, 2024, 2025, 2026")
                .minExperience(BigDecimal.ZERO)
                .maxExperience(BigDecimal.valueOf(1.0))
                .minSalary(BigDecimal.valueOf(250000))
                .maxSalary(BigDecimal.valueOf(400000))
                .description("Customer support, verification workflows, and technical process assistance.")
                .requirements("Customer Support, Process workflows, Fluent English.")
                .applicationDeadline(LocalDate.now().plusDays(50))
                .status(JobStatus.PUBLISHED)
                .requiredSkills(Set.of("Customer Support", "Process", "Communication"))
                .build());

        jobRepository.save(Job.builder()
                .jobCode("JOB-1028")
                .slug("operations-executive-bangalore-1028")
                .title("Operations Executive")
                .company(hcl)
                .jobCategory(JobCategory.NON_IT)
                .department("Operations & MIS")
                .location("Bangalore")
                .workMode("ON_SITE")
                .employmentType("FULL_TIME")
                .minQualification("B.Com / BBA / Graduate")
                .eligiblePassoutYears("2022, 2023, 2024, 2025")
                .minExperience(BigDecimal.valueOf(1.0))
                .maxExperience(BigDecimal.valueOf(3.0))
                .minSalary(BigDecimal.valueOf(400000))
                .maxSalary(BigDecimal.valueOf(600000))
                .description("Operational reporting, MIS dashboard generation, and SLA monitoring.")
                .requirements("Operations, MIS, Reporting, Excel.")
                .applicationDeadline(LocalDate.now().plusDays(35))
                .status(JobStatus.PUBLISHED)
                .requiredSkills(Set.of("Operations", "MIS", "Reporting"))
                .build());

        log.info("Local seed data loaded successfully!");
    }
}
