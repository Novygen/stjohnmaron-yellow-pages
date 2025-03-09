// models/MembershipRequest.ts
import mongoose, { Document, Schema } from "mongoose";

// Login information
export interface IMemberLogin {
  uid: string;
}

export interface IPersonalDetails {
  firstName: string;
  lastName: string;
  middleName?: string;
  ageRange: string;
  state?: string;
}

export interface IAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface IContactInformation {
  primaryPhoneNumber: string;
  primaryEmail: string;
  address?: IAddress;
}

export interface IEmploymentStatus {
  status: string; // Comma-separated values: "employed,business_owner,student" or "other"
}

export interface IEmploymentDetails {
  companyName: string;
  jobTitle: string;
  specialization: string;
}

export interface IBusiness {
  businessName: string;
  industry: string;
  description: string;
  website?: string;
  phoneNumber?: string;
}

export interface IStudent {
  schoolName?: string;
  fieldOfStudy?: string;
  expectedGraduationYear?: number;
}

export interface IProfessionalInfo {
  employmentStatus: IEmploymentStatus;
  employmentDetails?: IEmploymentDetails;
  business?: IBusiness;
  student?: IStudent;
}

export interface ISocialPresence {
  linkedInProfile?: string;
  personalWebsite?: string;
}

export interface IPrivacyConsent {
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
  directoryListing: boolean;
  dataSharing: boolean;
  internalConsent: boolean;
  displayInYellowPages: boolean;
  displayPhonePublicly: boolean;
}

export interface IMembershipRequest extends Document {
  memberLogin: IMemberLogin;
  personalDetails: IPersonalDetails;
  contactInformation: IContactInformation;
  professionalInfo: IProfessionalInfo;
  socialPresence: ISocialPresence;
  privacyConsent: IPrivacyConsent;
  isApproved: boolean;
  softDeleted?: boolean;
  lastModifiedBy?: string;
}

const MembershipRequestSchema = new Schema<IMembershipRequest>(
  {
    memberLogin: {
      type: Object,
      required: true,
      validate: {
        validator: (value: IMemberLogin) => {
          return value.uid !== undefined && value.uid !== null;
        },
        message: "Member login UID is required",
      },
    },
    personalDetails: {
      type: Object,
      required: true,
      validate: {
        validator: (value: IPersonalDetails) => {
          return (
            value.firstName !== undefined &&
            value.firstName.trim() !== "" &&
            value.lastName !== undefined &&
            value.lastName.trim() !== "" &&
            value.ageRange !== undefined &&
            value.ageRange.trim() !== ""
          );
        },
        message: "First name, last name, and age range are required",
      },
    },
    contactInformation: {
      type: Object,
      required: true,
      validate: {
        validator: (value: IContactInformation) => {
          return (
            value.primaryPhoneNumber !== undefined &&
            value.primaryPhoneNumber.trim() !== "" &&
            value.primaryEmail !== undefined &&
            value.primaryEmail.trim() !== ""
          );
        },
        message: "Primary phone number and email are required",
      },
    },
    professionalInfo: {
      type: Object,
      required: true,
      validate: {
        validator: (value: IProfessionalInfo) => {
          if (!value.employmentStatus?.status) return false;

          const statuses = value.employmentStatus.status.split(',');
          
          // Check if the combination is valid
          if (statuses.includes('other')) {
            return statuses.length === 1; // 'other' can't be combined with other statuses
          }

          // For active statuses (employed, business_owner, student)
          let isValid = true;

          // Check required fields for each selected status
          if (statuses.includes('employed')) {
            isValid = isValid && !!(
              value.employmentDetails?.companyName?.trim() &&
              value.employmentDetails?.jobTitle?.trim() &&
              value.employmentDetails?.specialization?.trim()
            );
          }

          if (statuses.includes('business_owner')) {
            isValid = isValid && !!(
              value.business?.businessName?.trim() &&
              value.business?.industry?.trim() &&
              value.business?.description?.trim()
            );
          }

          // Student fields are optional, so no validation needed
          return isValid;
        },
        message: "Required professional information is missing or employment status combination is invalid",
      },
    },
    socialPresence: { type: Object, required: true },
    privacyConsent: { type: Object, required: true },
    isApproved: { type: Boolean, default: false },
    softDeleted: { type: Boolean, default: false },
    lastModifiedBy: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.MembershipRequest ||
  mongoose.model<IMembershipRequest>("MembershipRequest", MembershipRequestSchema);
