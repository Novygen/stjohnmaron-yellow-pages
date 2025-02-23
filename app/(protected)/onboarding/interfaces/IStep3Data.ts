// app/(protected)/onboarding/interfaces/IStep3Data.ts

export interface IEmploymentStatus {
    status: string; // e.g. "Employed", "BusinessOwner", "Retired", "Student"
  }
  
  export interface IEmploymentDetails {
    company_name: string;
    job_title: string;
    industry: string;
    years_of_experience: number;
  }
  
  export interface IEmploymentHistory {
    previous_occupation?: string;
    mentorship_interest: boolean;
  }
  
  export interface IBusinessAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  export interface IBusiness {
    business_name: string;
    business_type: string;   // e.g. "Retail", "Service"
    has_physical_store: boolean;
    business_address?: IBusinessAddress;
  }
  
  export interface IServiceProvider {
    service_name: string;
    service_details: string[];
  }
  
  export interface IStudent {
    school_name: string;
    field_of_study: string;
    expected_graduation_year: number;
  }
  
  export interface IProfessionalInfo {
    employment_status: IEmploymentStatus;
    employment_details?: IEmploymentDetails;
    employment_history?: IEmploymentHistory;
    businesses?: IBusiness[];
    service_providers?: IServiceProvider[];
    students?: IStudent[];
  }
  
  export interface IStep3Data {
    professionalInfo: IProfessionalInfo;
  }
  