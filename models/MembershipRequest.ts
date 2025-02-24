// models/MembershipRequest.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMemberLogin {
  uid: string;
}

export interface IPersonalDetails {
  first_name: string;
  last_name: string;
  middle_name?: string;
}

export interface IDemographicInformation {
  date_of_birth: string;
  gender?: string;
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IContactInformation {
  primary_phone_number: string;
  primary_email: string;
  address: IAddress;
}

export interface IEmploymentStatus {
  status: string;
}

export interface IEmploymentDetails {
  company_name: string;
  job_title: string;
  industry: string;
  years_of_experience: number;
}

export interface IEmploymentHistory {
  previous_occupation: string;
  mentorship_interest: boolean;
}

export interface IBusiness {
  business_name: string;
  business_type: string;
  has_physical_store: boolean;
  business_address: IAddress;
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

export interface ISocialPresence {
  personal_website?: string;
  linked_in_profile?: string;
  facebook_profile?: string;
  instagram_handle?: string;
  other_social_media_links: string[];
}

// Instead of a simple array, we use a structured object to specify
// for each category (and nested fields) whether the data is public.
export interface IPrivacyConsent {
  display_in_yellow_pages: boolean;
  public_visibility: {
    personal_details?: {
      first_name?: boolean;
      last_name?: boolean;
      middle_name?: boolean;
    };
    demographic_information?: {
      date_of_birth?: boolean;
      gender?: boolean;
    };
    contact_information?: {
      primary_phone_number?: boolean;
      primary_email?: boolean;
      address?: {
        line1?: boolean;
        line2?: boolean;
        city?: boolean;
        state?: boolean;
        zip?: boolean;
        country?: boolean;
      };
    };
    professional_info?: {
      employment_status?: boolean;
      employment_details?: {
        company_name?: boolean;
        job_title?: boolean;
        industry?: boolean;
        years_of_experience?: boolean;
      };
      employment_history?: {
        previous_occupation?: boolean;
        mentorship_interest?: boolean;
      };
      businesses?: boolean;
      service_providers?: boolean;
      students?: boolean;
    };
    social_presence?: {
      personal_website?: boolean;
      linked_in_profile?: boolean;
      facebook_profile?: boolean;
      instagram_handle?: boolean;
      other_social_media_links?: boolean;
    };
  };
}

export interface IMembershipRequest extends Document {
  member_login: IMemberLogin;
  personal_details: IPersonalDetails;
  demographic_information: IDemographicInformation;
  contact_information: IContactInformation;
  professional_info: IProfessionalInfo;
  social_presence: ISocialPresence;
  privacy_consent: IPrivacyConsent;
  isApproved: boolean;
  // Audit & GDPR fields:
  softDeleted?: boolean;
  lastModifiedBy?: string;
}

const MembershipRequestSchema = new Schema<IMembershipRequest>(
  {
    member_login: { type: Object, required: true },
    personal_details: { type: Object, required: true },
    demographic_information: { type: Object, required: true },
    contact_information: { type: Object, required: true },
    professional_info: { type: Object, required: true },
    social_presence: { type: Object, required: true },
    privacy_consent: { type: Object, required: true },
    isApproved: { type: Boolean, default: false },
    softDeleted: { type: Boolean, default: false },
    lastModifiedBy: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MembershipRequest ||
  mongoose.model<IMembershipRequest>("MembershipRequest", MembershipRequestSchema);
