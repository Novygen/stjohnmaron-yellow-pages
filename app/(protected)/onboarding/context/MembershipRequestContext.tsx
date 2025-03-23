/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserUid } from "@/store/slices/userSlice";
import {
  IMemberLogin,
  IPersonalDetails,
  IContactInformation,
  IProfessionalInfo,
  ISocialPresence,
  IPrivacyConsent,
} from "@/models/MembershipRequest";
import { IVisibility } from "@/models/Member";

export interface MembershipRequestData {
  memberLogin: IMemberLogin;
  personalDetails: IPersonalDetails;
  contactInformation: IContactInformation;
  professionalInfo: IProfessionalInfo;
  socialPresence: ISocialPresence;
  privacyConsent: IPrivacyConsent;
  visibility: IVisibility;
  isApproved: boolean;
  softDeleted?: boolean;
  lastModifiedBy?: string;
}

export const defaultMembershipRequest: MembershipRequestData = {
  memberLogin: { uid: "" },
  personalDetails: { 
    firstName: "", 
    lastName: "", 
    ageRange: "",
    parishStatus: { 
      status: "member" 
    }
  },
  contactInformation: {
    primaryPhoneNumber: "",
    primaryEmail: "",
    address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
  },
  professionalInfo: {
    employmentStatus: { status: "employed" },
  },
  socialPresence: {
    linkedInProfile: "",
    personalWebsite: "",
  },
  privacyConsent: {
    termsAccepted: false,
    privacyPolicyAccepted: false,
    directoryListing: false,
    dataSharing: false,
    internalConsent: false,
    displayInYellowPages: false,
    displayPhonePublicly: false,
  },
  visibility: {
    profile: 'public',
    contact: {
      email: 'private',
      phone: 'private',
      address: 'private',
    },
    employment: {
      current: 'public',
      history: 'private',
    },
    social: 'public',
    phoneNumber: 'private'
  },
  isApproved: false,
  softDeleted: false,
};

interface MembershipRequestContextType {
  membershipData: MembershipRequestData;
  setMembershipData: React.Dispatch<React.SetStateAction<MembershipRequestData>>;
  updatePersonalDetails: (data: Partial<IPersonalDetails>) => void;
  updateContactInformation: (data: Partial<IContactInformation>) => void;
  updateProfessionalInfo: (data: Partial<IProfessionalInfo>) => void;
  updateSocialPresence: (data: Partial<ISocialPresence>) => void;
  updatePrivacyConsent: (data: Partial<IPrivacyConsent>) => void;
  submitMembershipRequest: () => Promise<any>;
  loading: boolean;
}

const MembershipRequestContext = createContext<MembershipRequestContextType | undefined>(undefined);

export const MembershipRequestProvider = ({ children }: { children: ReactNode }) => {
  const userUid = useSelector(selectUserUid) ?? "";
  
  const [membershipData, setMembershipData] = useState<MembershipRequestData>(() => ({
    ...defaultMembershipRequest,
    memberLogin: { uid: userUid },
  }));
  
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setMembershipData(prev => ({
      ...prev,
      memberLogin: { uid: userUid }
    }));
  }, [userUid]);

  const updatePersonalDetails = (data: Partial<IPersonalDetails>) => {
    setMembershipData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...data },
    }));
  };

  const updateContactInformation = (data: Partial<IContactInformation>) => {
    setMembershipData(prev => ({
      ...prev,
      contactInformation: { ...prev.contactInformation, ...data },
    }));
  };

  const updateProfessionalInfo = (data: Partial<IProfessionalInfo>) => {
    setMembershipData(prev => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, ...data },
    }));
  };

  const updateSocialPresence = (data: Partial<ISocialPresence>) => {
    setMembershipData(prev => ({
      ...prev,
      socialPresence: { ...prev.socialPresence, ...data },
    }));
  };

  const updatePrivacyConsent = (data: Partial<IPrivacyConsent>) => {
    setMembershipData(prev => ({
      ...prev,
      privacyConsent: { ...prev.privacyConsent, ...data },
    }));
  };

  const submitMembershipRequest = async () => {
    setLoading(true);
    try {
      // Set phoneNumber visibility based on displayPhonePublicly
      const phoneVisibility = membershipData.privacyConsent.displayPhonePublicly ? 'public' : 'private';
      
      // Create a new data object with properly set visibility
      const dataToSubmit = {
        ...membershipData,
        visibility: {
          ...membershipData.visibility,
          contact: {
            ...membershipData.visibility.contact,
            phone: phoneVisibility,  // Set phone visibility in contact
          },
          phoneNumber: phoneVisibility  // Also set the standalone phoneNumber field
        }
      };

      console.log('Submitting membership request with data:', JSON.stringify(dataToSubmit, null, 2));
      
      const res = await fetch("/api/membership-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit),
      });
      
      const result = await res.json();
      if (!res.ok) {
        let errorMessage = "Submission failed";
        if (result.error) {
          errorMessage = typeof result.error === "object" 
            ? JSON.stringify(result.error) 
            : result.error;
        }
        throw new Error(errorMessage);
      }
      return result;
    } catch (err) {
      console.error("Error submitting membership request", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <MembershipRequestContext.Provider
      value={{
        membershipData,
        setMembershipData,
        updatePersonalDetails,
        updateContactInformation,
        updateProfessionalInfo,
        updateSocialPresence,
        updatePrivacyConsent,
        submitMembershipRequest,
        loading,
      }}
    >
      {children}
    </MembershipRequestContext.Provider>
  );
};

export const useMembershipRequest = () => {
  const context = useContext(MembershipRequestContext);
  if (!context) {
    throw new Error("useMembershipRequest must be used within a MembershipRequestProvider");
  }
  return context;
};
