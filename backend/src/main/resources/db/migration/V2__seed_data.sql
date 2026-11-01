-- V2__seed_data.sql
-- Seed initial site settings, top hiring companies, and real job openings across IT, Non-IT, and Semi-IT

INSERT INTO site_settings (id, portal_name, tagline, whatsapp_number, contact_email, contact_phone, office_address)
VALUES (
    1,
    'Next step solutions',
    'Your Career, Our Guidance - Discover the right opportunities in IT, Non-IT and Semi-IT sectors with personalized career support.',
    '917285927080',
    'nextstepsolutions.recruitment@gmail.com',
    '+91 72859 27080',
    'Level 4, Cyber Towers, HITEC City, Hyderabad, Telangana 500081'
) ON CONFLICT (id) DO NOTHING;

-- Seed Top Hiring Companies
INSERT INTO companies (id, name, slug, logo_url, website_url, description, industry, headquarters) VALUES
('c0000000-0000-0000-0000-000000000001', 'Tata Consultancy Services (TCS)', 'tcs', 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', 'https://www.tcs.com', 'Tata Consultancy Services is a global leader in IT services, consulting, and business solutions with a vast global footprint.', 'Information Technology', 'Mumbai, India'),
('c0000000-0000-0000-0000-000000000002', 'Infosys Limited', 'infosys', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', 'https://www.infosys.com', 'Infosys is a global leader in next-generation digital services and consulting enabling clients across 56 countries to navigate digital transformation.', 'Information Technology', 'Bengaluru, India'),
('c0000000-0000-0000-0000-000000000003', 'Wipro Limited', 'wipro', 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', 'https://www.wipro.com', 'Wipro is a leading technology services and consulting company focused on building innovative solutions addressing complex digital transformation needs.', 'Information Technology & Consulting', 'Bengaluru, India'),
('c0000000-0000-0000-0000-000000000004', 'Accenture', 'accenture', 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', 'https://www.accenture.com', 'Accenture is a leading global professional services company providing a broad range of services in strategy, consulting, digital, and operations.', 'Management Consulting & IT', 'Dublin, Ireland'),
('c0000000-0000-0000-0000-000000000005', 'HCL Technologies', 'hcl-technologies', 'https://upload.wikimedia.org/wikipedia/commons/8/8e/HCLTech_Logo.svg', 'https://www.hcltech.com', 'HCLTech is a global technology company home to 220,000+ people across 60 countries delivering industry-leading capabilities centered around digital, engineering, and cloud.', 'Information Technology', 'Noida, India'),
('c0000000-0000-0000-0000-000000000006', 'Cognizant', 'cognizant', 'https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg', 'https://www.cognizant.com', 'Cognizant engineers modern businesses to improve everyday lives across enterprise technology, cloud modernization, and business operations.', 'IT & Business Services', 'Teaneck, NJ, USA')
ON CONFLICT (name) DO NOTHING;

-- Seed Jobs across IT, Non-IT, Semi-IT
-- Job 1: IT - Software Developer (TCS)
INSERT INTO jobs (
    id, job_code, slug, title, company_id, job_category, department, location, work_mode, employment_type,
    min_qualification, eligible_passout_years, min_experience, max_experience, min_salary, max_salary,
    salary_period, currency, vacancies, description, responsibilities, requirements, benefits,
    application_deadline, status
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'JOB-1024',
    'software-developer-hyderabad-1024',
    'Software Developer',
    'c0000000-0000-0000-0000-000000000001',
    'IT',
    'Application Development',
    'Hyderabad',
    'HYBRID',
    'FULL_TIME',
    'B.Tech / B.E / MCA',
    '2023, 2024, 2025, 2026',
    0.0,
    2.0,
    600000.00,
    1000000.00,
    'ANNUAL',
    'INR',
    5,
    'We are looking for passionate and talented Software Developers to join our team. You will be involved in designing, developing, and maintaining software applications for global clients.',
    'Develop and maintain web applications; Work with cross-functional teams; Debug and resolve issues; Participate in code reviews; Contribute to continuous improvement',
    'Strong fundamentals in Java, Spring Boot, React, and REST APIs; Understanding of SQL and database indexing; Good problem solving and analytical thinking.',
    'Health Insurance, Annual Performance Bonus, Flexible Hybrid Work, Continuous Learning Sponsorship',
    CURRENT_DATE + INTERVAL '45 days',
    'PUBLISHED'
) ON CONFLICT (job_code) DO NOTHING;

-- Skills for Job 1
INSERT INTO job_skills (job_id, skill_name) VALUES
('a0000000-0000-0000-0000-000000000001', 'Java'),
('a0000000-0000-0000-0000-000000000001', 'Spring Boot'),
('a0000000-0000-0000-0000-000000000001', 'React'),
('a0000000-0000-0000-0000-000000000001', 'REST API'),
('a0000000-0000-0000-0000-000000000001', 'SQL'),
('a0000000-0000-0000-0000-000000000001', 'Git')
ON CONFLICT (job_id, skill_name) DO NOTHING;

-- Job 2: IT - Business Analyst (Infosys)
INSERT INTO jobs (
    id, job_code, slug, title, company_id, job_category, department, location, work_mode, employment_type,
    min_qualification, eligible_passout_years, min_experience, max_experience, min_salary, max_salary,
    salary_period, currency, vacancies, description, responsibilities, requirements, benefits,
    application_deadline, status
) VALUES (
    'a0000000-0000-0000-0000-000000000002',
    'JOB-1025',
    'business-analyst-pune-1025',
    'Business Analyst',
    'c0000000-0000-0000-0000-000000000002',
    'IT',
    'Business Analytics & Consulting',
    'Pune',
    'HYBRID',
    'FULL_TIME',
    'B.Tech / MBA / MCA',
    '2022, 2023, 2024, 2025',
    2.0,
    4.0,
    800000.00,
    1200000.00,
    'ANNUAL',
    'INR',
    3,
    'Seeking a skilled Business Analyst to bridge technology and business requirements. You will liaise with stakeholders to gather requirements, analyze data workflows, and produce insightful technical documentation.',
    'Gather and document client functional requirements; Create user stories and process flow diagrams; Collaborate with software architects; Conduct User Acceptance Testing (UAT).',
    'Proficiency in SQL, Data Analysis, Excel, Agile Scrum methodology, and Stakeholder Communication.',
    'Comprehensive Medical Cover, Performance Incentives, Hybrid working model',
    CURRENT_DATE + INTERVAL '30 days',
    'PUBLISHED'
) ON CONFLICT (job_code) DO NOTHING;

INSERT INTO job_skills (job_id, skill_name) VALUES
('a0000000-0000-0000-0000-000000000002', 'SQL'),
('a0000000-0000-0000-0000-000000000002', 'Data Analysis'),
('a0000000-0000-0000-0000-000000000002', 'Reporting'),
('a0000000-0000-0000-0000-000000000002', 'Excel')
ON CONFLICT (job_id, skill_name) DO NOTHING;

-- Job 3: Non-IT - HR Executive (Wipro)
INSERT INTO jobs (
    id, job_code, slug, title, company_id, job_category, department, location, work_mode, employment_type,
    min_qualification, eligible_passout_years, min_experience, max_experience, min_salary, max_salary,
    salary_period, currency, vacancies, description, responsibilities, requirements, benefits,
    application_deadline, status
) VALUES (
    'a0000000-0000-0000-0000-000000000003',
    'JOB-1026',
    'hr-executive-hyderabad-1026',
    'HR Executive',
    'c0000000-0000-0000-0000-000000000003',
    'NON_IT',
    'Human Resources',
    'Hyderabad',
    'ON_SITE',
    'FULL_TIME',
    'MBA HR / BBA / Any Graduate',
    '2023, 2024, 2025, 2026',
    0.0,
    2.0,
    300000.00,
    500000.00,
    'ANNUAL',
    'INR',
    4,
    'Responsible for talent sourcing, conducting initial phone screenings, scheduling interviews, and coordinating onboarding activities for lateral and fresh talent.',
    'Screen candidate resumes on recruitment portals; Schedule interviews with hiring managers; Facilitate onboarding and documentation; Maintain applicant records.',
    'Excellent English verbal and written communication; MS Office skills; Enthusiastic interpersonal skills.',
    'Paid Leaves, Health Insurance, Transportation Support',
    CURRENT_DATE + INTERVAL '40 days',
    'PUBLISHED'
) ON CONFLICT (job_code) DO NOTHING;

INSERT INTO job_skills (job_id, skill_name) VALUES
('a0000000-0000-0000-0000-000000000003', 'Recruitment'),
('a0000000-0000-0000-0000-000000000003', 'Communication'),
('a0000000-0000-0000-0000-000000000003', 'MS Office'),
('a0000000-0000-0000-0000-000000000003', 'Sourcing')
ON CONFLICT (job_id, skill_name) DO NOTHING;

-- Job 4: Semi-IT - Process Associate (Accenture)
INSERT INTO jobs (
    id, job_code, slug, title, company_id, job_category, department, location, work_mode, employment_type,
    min_qualification, eligible_passout_years, min_experience, max_experience, min_salary, max_salary,
    salary_period, currency, vacancies, description, responsibilities, requirements, benefits,
    application_deadline, status
) VALUES (
    'a0000000-0000-0000-0000-000000000004',
    'JOB-1027',
    'process-associate-chennai-1027',
    'Process Associate',
    'c0000000-0000-0000-0000-000000000004',
    'SEMI_IT',
    'Operations & Technical Support',
    'Chennai',
    'ON_SITE',
    'FULL_TIME',
    'Any Graduate (B.Com, B.Sc, B.A, B.Tech)',
    '2023, 2024, 2025, 2026',
    0.0,
    1.0,
    250000.00,
    400000.00,
    'ANNUAL',
    'INR',
    10,
    'Engage with global customers to assist with process workflows, customer support tickets, verification, and data processing in a semi-technical environment.',
    'Handle inbound client requests and support inquiries; Verify client data with high accuracy; Follow standard operating procedures (SOPs); Provide prompt ticket resolution.',
    'Strong communication skills in English; Basic computer & web navigation abilities; Ready to work in flexible shifts.',
    'Night Shift Allowance, Cab facility for home drop, Medical Coverage',
    CURRENT_DATE + INTERVAL '50 days',
    'PUBLISHED'
) ON CONFLICT (job_code) DO NOTHING;

INSERT INTO job_skills (job_id, skill_name) VALUES
('a0000000-0000-0000-0000-000000000004', 'Customer Support'),
('a0000000-0000-0000-0000-000000000004', 'Process'),
('a0000000-0000-0000-0000-000000000004', 'Communication')
ON CONFLICT (job_id, skill_name) DO NOTHING;

-- Job 5: Non-IT - Operations Executive (HCL Technologies)
INSERT INTO jobs (
    id, job_code, slug, title, company_id, job_category, department, location, work_mode, employment_type,
    min_qualification, eligible_passout_years, min_experience, max_experience, min_salary, max_salary,
    salary_period, currency, vacancies, description, responsibilities, requirements, benefits,
    application_deadline, status
) VALUES (
    'a0000000-0000-0000-0000-000000000005',
    'JOB-1028',
    'operations-executive-bangalore-1028',
    'Operations Executive',
    'c0000000-0000-0000-0000-000000000005',
    'NON_IT',
    'Operations & MIS',
    'Bangalore',
    'ON_SITE',
    'FULL_TIME',
    'B.Com / BBA / Any Graduate',
    '2022, 2023, 2024, 2025',
    1.0,
    3.0,
    400000.00,
    600000.00,
    'ANNUAL',
    'INR',
    2,
    'Oversee operational reporting, MIS generation, coordination between branch offices, and vendor management.',
    'Generate daily and weekly MIS operational dashboards; Track SLA compliance; Coordinate with cross-departmental teams; Resolve billing and documentation issues.',
    'Advanced Microsoft Excel (VLOOKUP, Pivot tables), Problem-solving mindset, Organizational skills.',
    'Provident Fund, Medical Insurance, Performance Bonus',
    CURRENT_DATE + INTERVAL '35 days',
    'PUBLISHED'
) ON CONFLICT (job_code) DO NOTHING;

INSERT INTO job_skills (job_id, skill_name) VALUES
('a0000000-0000-0000-0000-000000000005', 'Operations'),
('a0000000-0000-0000-0000-000000000005', 'MIS'),
('a0000000-0000-0000-0000-000000000005', 'Reporting')
ON CONFLICT (job_id, skill_name) DO NOTHING;
