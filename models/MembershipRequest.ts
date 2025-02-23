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

export interface IPrivacyConsent {
  display_in_yellow_pages: boolean;
  public_details: string[];
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
  },
  { timestamps: true }
);

export default mongoose.models.MembershipRequest ||
  mongoose.model<IMembershipRequest>("MembershipRequest", MembershipRequestSchema);
