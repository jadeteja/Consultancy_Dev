export interface Job {
  id: string;
  jobCode: string;
  slug: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogoUrl?: string;
  jobCategory: 'IT' | 'NON_IT' | 'SEMI_IT';
  department?: string;
  location: string;
  workMode: 'ON_SITE' | 'HYBRID' | 'REMOTE';
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP';
  minQualification?: string;
  eligiblePassoutYears?: string;
  minExperience?: number;
  maxExperience?: number;
  minSalary?: number;
  maxSalary?: number;
  salaryPeriod: string;
  currency: string;
  vacancies: number;
  description: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  applicationDeadline?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'CLOSED' | 'EXPIRED';
  requiredSkills: string[];
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  industry?: string;
  headquarters?: string;
}

export interface SiteSettings {
  portalName: string;
  tagline: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  officeAddress: string;
}

export interface ApplicationIntentRequest {
  jobId: string;
  applicantName: string;
  applicantMobile: string;
  applicantEmail: string;
  highestQualification?: string;
  passoutYear?: number;
  preferredCategory?: string;
  preferredLocation?: string;
  experienceLevel?: string;
  currentCity?: string;
  resumeUrl?: string;
  consentGiven: boolean;
}

export interface ApplicationRecord {
  id: string;
  applicationNumber: string;
  job: Job;
  applicantName: string;
  applicantEmail: string;
  applicantMobile: string;
  highestQualification?: string;
  passoutYear?: number;
  preferredCategory?: string;
  preferredLocation?: string;
  recruitmentStatus: string;
  whatsappRedirectStatus: string;
  createdAt: string;
}
