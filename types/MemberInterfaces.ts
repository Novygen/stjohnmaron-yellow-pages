export interface PersonalDetails {
    firstName: string;
    lastName: string;
    middleName?: string;
  }
  
  export interface DemographicInformation {
    dateOfBirth: string;
    gender?: string;
  }
  
  export interface Address {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  export interface ContactInformation {
    primaryPhoneNumber: string;
    primaryEmail: string;
    address: Address;
  }
  
  export interface ChurchMembership {
    isRegisteredMember: boolean;
    attendingDuration: string;
    attendingFrequency: string;
    ministriesInvolved: string[];
    wantsToVolunteer: boolean;
    volunteerRoles: string[];
  }
  
  export interface VolunteerInvolvement {
    wantsToVolunteer: boolean;
    volunteerRoles: string[];
  }
  
  export interface EmploymentStatus {
    status: string; // e.g. "Employed", "BusinessOwner", "Retired", etc.
  }
  
  export interface EmploymentDetails {
    companyName: string;
    jobTitle: string;
    industry: string;
    yearsOfExperience: number;
  }
  
  export interface EmploymentHistory {
    previousOccupation: string;
    mentorshipInterest: boolean;
  }
  
  export interface Business {
    businessName: string;
    businessType: string;
    hasPhysicalStore: boolean;
    businessAddress: Address;
  }
  
  export interface ServiceProvider {
    serviceName: string;
    serviceDetails: string[];
  }
  
  export interface Student {
    schoolName: string;
    fieldOfStudy: string;
    expectedGraduationYear: number;
  }
  
  export interface ProfessionalInfo {
    employmentStatus: EmploymentStatus;
    employmentDetails: EmploymentDetails;
    employmentHistory: EmploymentHistory;
    businesses: Business[];
    services: ServiceProvider[];
    educationHistory: Student[];
  }
  
  export interface SocialPresence {
    personalWebsite?: string;
    linkedInProfile?: string;
    facebookProfile?: string;
    instagramHandle?: string;
    otherSocialMediaLinks?: string[];
  }
  
  export interface AdditionalInterests {
    networkingInterest: boolean;
    mentorshipPreference: string;
  }
  
  export interface PrivacyConsent {
    displayInYellowPages: boolean;
    publicDetails: string[];
  }
  
  export interface Member {
    personalDetails: PersonalDetails;
    demographicInformation: DemographicInformation;
    contactInformation: ContactInformation;
    churchMembership: ChurchMembership;
    professionalInfo: ProfessionalInfo;
    socialPresence: SocialPresence;
    additionalInterests: AdditionalInterests;
    privacyConsent: PrivacyConsent;
  }
  