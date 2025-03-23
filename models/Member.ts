import mongoose, { Document, Schema } from "mongoose";

export interface IEmployment {
  type: 'employed' | 'business_owner' | 'student';
  details: {
    // For employed
    companyName?: string;
    jobTitle?: string;
    specialization?: string;
    // For business owner
    businessName?: string;
    industry?: string;
    description?: string;
    website?: string;
    phoneNumber?: string;
    businessEmail?: string;
    // For student
    schoolName?: string;
    fieldOfStudy?: string;
    expectedGraduationYear?: number;
  };
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface IVisibility {
  profile: 'public' | 'private';
  contact: {
    email: 'public' | 'private';
    phone: 'public' | 'private';
    address: 'public' | 'private';
  };
  employment: {
    current: 'public' | 'private';
    history: 'public' | 'private';
  };
  social: 'public' | 'private';
  phoneNumber: 'public' | 'private';
}

export interface ISkills {
  skills?: string;
  description?: string;
}

export interface IMember extends Document {
  uid: string; // Firebase Auth UID
  personalDetails: {
    firstName: string;
    lastName: string;
    middleName?: string;
    ageRange: string;
    state?: string;
    profileImage?: string;
    parishStatus?: {
      status: 'member' | 'visitor' | 'other_parish';
      otherParishName?: string;
    };
  };
  contactInformation: {
    primaryEmail: string;
    primaryPhoneNumber: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  employments: IEmployment[];
  skills?: ISkills;
  socialPresence: {
    linkedInProfile?: string;
    personalWebsite?: string;
    instagramProfile?: string;
    facebookProfile?: string;
    xProfile?: string;
  };
  social?: {
    linkedInProfile?: string;
    personalWebsite?: string;
    instagramProfile?: string;
    facebookProfile?: string;
    xProfile?: string;
  };
  visibility: IVisibility;
  status: 'active' | 'inactive' | 'suspended';
  memberSince: Date;
  lastUpdated: Date;
  lastUpdatedBy: string;
}

const EmploymentSchema = new Schema<IEmployment>({
  type: { 
    type: String, 
    required: true, 
    enum: ['employed', 'business_owner', 'student'] 
  },
  details: {
    // Employed fields
    companyName: String,
    jobTitle: String,
    specialization: String,
    // Business owner fields
    businessName: String,
    industry: String,
    description: String,
    website: String,
    phoneNumber: String,
    businessEmail: String,
    // Student fields
    schoolName: String,
    fieldOfStudy: String,
    expectedGraduationYear: Number,
  },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
});

const VisibilitySchema = new Schema<IVisibility>({
  profile: { 
    type: String, 
    enum: ['public', 'private'],
    default: 'public'
  },
  contact: {
    email: { 
      type: String, 
      enum: ['public', 'private'],
      default: 'private'
    },
    phone: { 
      type: String, 
      enum: ['public', 'private'],
      default: 'private'
    },
    address: { 
      type: String, 
      enum: ['public', 'private'],
      default: 'private'
    },
  },
  employment: {
    current: { 
      type: String, 
      enum: ['public', 'private'],
      default: 'public'
    },
    history: { 
      type: String, 
      enum: ['public', 'private'],
      default: 'private'
    },
  },
  social: { 
    type: String, 
    enum: ['public', 'private'],
    default: 'public'
  },
  phoneNumber: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  }
});

const MemberSchema = new Schema<IMember>({
  uid: { type: String, required: true, unique: true },
  personalDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: String,
    ageRange: { type: String, required: true },
    state: String,
    profileImage: String,
    parishStatus: {
      status: {
        type: String,
        enum: ['member', 'visitor', 'other_parish'],
      },
      otherParishName: String,
    },
  },
  contactInformation: {
    primaryEmail: { type: String, required: true },
    primaryPhoneNumber: { type: String, required: true },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
  },
  employments: [EmploymentSchema],
  skills: {
    skills: String,
    description: String,
  },
  socialPresence: {
    linkedInProfile: String,
    personalWebsite: String,
    instagramProfile: String,
    facebookProfile: String,
    xProfile: String,
  },
  social: {
    linkedInProfile: String,
    personalWebsite: String,
    instagramProfile: String,
    facebookProfile: String,
    xProfile: String,
  },
  visibility: { type: VisibilitySchema, required: true },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  memberSince: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  lastUpdatedBy: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema); 