// models/MembershipRequest.ts
import mongoose, { Document, Schema } from "mongoose";
import { IVisibility } from './Member'; // Import from Member model

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
  parishStatus?: {
    status: 'member' | 'visitor' | 'other_parish';
    otherParishName?: string;
  };
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
  businessEmail?: string;
}

export interface ISkills {
  skills?: string;
  description?: string;
}

export interface IStudent {
  schoolName?: string;
  fieldOfStudy?: string;
  expectedGraduationYear?: number;
}

export interface IProfessionalInfo {
  employmentStatus: IEmploymentStatus;
  employmentDetails?: IEmploymentDetails;
  businesses?: IBusiness[];
  business?: IBusiness;  // Keep for backward compatibility
  student?: IStudent;
  skills?: ISkills;
}

export interface ISocialPresence {
  linkedInProfile?: string;
  personalWebsite?: string;
  instagramProfile?: string;
  facebookProfile?: string;
  xProfile?: string;
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
  visibility?: IVisibility;
  isApproved: boolean;
  softDeleted?: boolean;
  lastModifiedBy?: string;
  notes?: string;
  requestId?: string; // Unique ID for deduplication
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
        validator: function(value: IProfessionalInfo) {
          // Debug the complete input to see exactly what we're working with
          console.log('VALIDATOR INPUT:', JSON.stringify(value, null, 2));
          
          // Basic presence check
          if (!value.employmentStatus || typeof value.employmentStatus.status !== 'string') {
            console.log('VALIDATOR FAILED: Missing or invalid employmentStatus');
            return false;
          }
          
          // Get statuses as array
          const statusStr = value.employmentStatus.status.trim();
          if (!statusStr) {
            console.log('VALIDATOR FAILED: Empty status string');
            return false;
          }
          
          const statuses = statusStr.split(',').filter(Boolean);
          console.log('VALIDATOR STATUSES:', statuses);
          
          // Special case for "other" - can't be combined
          if (statuses.includes('other') && statuses.length > 1) {
            console.log('VALIDATOR FAILED: "other" combined with other statuses');
            return false;
          }
          
          // Check each required status
          if (statuses.includes('employed')) {
            // For employed status, check employment details
            if (!value.employmentDetails || 
                !value.employmentDetails.companyName || 
                !value.employmentDetails.jobTitle || 
                !value.employmentDetails.specialization) {
              console.log('VALIDATOR FAILED: Missing required employment details');
              return false;
            }
          }
          
          // For business owner, simplify check to be more lenient
          if (statuses.includes('business_owner')) {
            console.log('VALIDATOR BUSINESS DATA:', {
              businesses: value.businesses,
              business: value.business
            });
            
            // First try the array approach
            if (Array.isArray(value.businesses) && value.businesses.length > 0) {
              // Check if ANY business in the array has the required fields
              const validBusiness = value.businesses.some(b => 
                b && typeof b === 'object' && 
                b.businessName && b.industry && b.description
              );
              
              if (validBusiness) {
                console.log('VALIDATOR: Found valid business in array');
                return true; // Short circuit if we find at least one valid business
              }
            }
            
            // Fall back to single business object
            if (value.business && 
                value.business.businessName && 
                value.business.industry && 
                value.business.description) {
              console.log('VALIDATOR: Found valid single business');
              return true; // Short circuit if we find a valid single business
            }
            
            // If we get here with business_owner status, validation failed
            console.log('VALIDATOR FAILED: No valid business found for business_owner');
            return false;
          }
          
          // If we reach here, all required validations passed
          console.log('VALIDATOR PASSED');
          return true;
        },
        message: "Required professional information is missing or employment status combination is invalid",
      },
    },
    socialPresence: { type: Object, required: true },
    privacyConsent: { type: Object, required: true },
    visibility: { type: mongoose.Schema.Types.Mixed },
    isApproved: { type: Boolean, default: false },
    softDeleted: { type: Boolean, default: false },
    lastModifiedBy: { type: String },
    notes: { type: String },
    requestId: { type: String },
  },
  { timestamps: true }
);

// Add a unique index on requestId to prevent duplicates
MembershipRequestSchema.index({ requestId: 1 }, { unique: true, sparse: true });

// Add a pre-save hook as additional validation
MembershipRequestSchema.pre('save', function(next) {
  // Check if this is a business_owner submission
  if (this.professionalInfo && 
      this.professionalInfo.employmentStatus && 
      this.professionalInfo.employmentStatus.status && 
      this.professionalInfo.employmentStatus.status.includes('business_owner')) {
    
    console.log('PRE-SAVE HOOK: Checking business data', this.professionalInfo);
    
    // Ensure we have business data
    if (!this.professionalInfo.businesses || !Array.isArray(this.professionalInfo.businesses)) {
      this.professionalInfo.businesses = [];
    }
    
    // If we have a single business but no businesses array
    if (this.professionalInfo.business && this.professionalInfo.businesses.length === 0) {
      console.log('PRE-SAVE: Converting single business to array');
      this.professionalInfo.businesses = [this.professionalInfo.business];
    }
    
    // Ensure at least one business has required fields
    const hasValidBusiness = this.professionalInfo.businesses.some(b => 
      b && b.businessName && b.industry && b.description
    );
    
    if (!hasValidBusiness) {
      console.log('PRE-SAVE: No valid business found, checking legacy business');
      
      // Check legacy business as fallback
      if (this.professionalInfo.business && 
          this.professionalInfo.business.businessName && 
          this.professionalInfo.business.industry && 
          this.professionalInfo.business.description) {
        
        console.log('PRE-SAVE: Found valid legacy business, adding to businesses array');
        // Add the legacy business to the array
        this.professionalInfo.businesses = [this.professionalInfo.business];
      } else {
        console.log('PRE-SAVE: No valid business data found');
      }
    }
  }
  
  next();
});

export default mongoose.models.MembershipRequest ||
  mongoose.model<IMembershipRequest>("MembershipRequest", MembershipRequestSchema);
