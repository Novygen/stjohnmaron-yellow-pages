/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserUid } from "@/store/slices/userSlice";

export interface MembershipRequestData {
  memberLogin: {
    uid: string;
  };
  personalDetails: {
    firstName: string;
    lastName: string;
    middleName: string;
    ageRange: string;
  };
  contactInformation: {
    primaryPhoneNumber: string;
    primaryEmail: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  professionalInfo: {
    employmentStatus: { status: string };
    employmentDetails?: {
      companyName: string;
      jobTitle: string;
      specialization: string;
      startDate: string;
    };
    ownsBusinessOrService?: boolean;
    business?: {
      businessName: string;
      additionalInformation: string;
      website: string;
      phoneNumber: string;
      industry: string;
    };
    student?: {
      schoolName: string;
      fieldOfStudy: string;
      expectedGraduationYear: number;
    };
  };
  socialPresence: {
    personalWebsite?: string;
    linkedInProfile?: string;
    facebookProfile?: string;
    instagramHandle?: string;
  };
  privacyConsent: {
    internalConsent: boolean;
    displayInYellowPages: boolean;
    displayPhonePublicly: boolean;
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  softDeleted?: boolean;
  lastModifiedBy?: string;
}

export const defaultMembershipRequest: MembershipRequestData = {
  memberLogin: { uid: "" },
  personalDetails: { firstName: "", lastName: "", middleName: "", ageRange: "" },
  contactInformation: {
    primaryPhoneNumber: "",
    primaryEmail: "",
    address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
  },
  professionalInfo: {
    employmentStatus: { status: "" },
  },
  socialPresence: {
    personalWebsite: "",
    linkedInProfile: "",
    facebookProfile: "",
    instagramHandle: "",
  },
  privacyConsent: { internalConsent: false, displayInYellowPages: false, displayPhonePublicly: false },
  isApproved: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface MembershipRequestContextType {
  membershipData: MembershipRequestData;
  setMembershipData: React.Dispatch<React.SetStateAction<MembershipRequestData>>;
  updatePersonalDetails: (data: Partial<MembershipRequestData["personalDetails"]>) => void;
  updateContactInformation: (data: Partial<MembershipRequestData["contactInformation"]>) => void;
  updateProfessionalInfo: (data: Partial<MembershipRequestData["professionalInfo"]>) => void;
  updateSocialPresence: (data: Partial<MembershipRequestData["socialPresence"]>) => void;
  updatePrivacyConsent: (data: Partial<MembershipRequestData["privacyConsent"]>) => void;
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

  const updatePersonalDetails = (data: Partial<MembershipRequestData["personalDetails"]>) => {
    setMembershipData(prev => ({
      ...prev,
      personalDetails: { ...prev.personalDetails, ...data },
    }));
  };

  const updateContactInformation = (data: Partial<MembershipRequestData["contactInformation"]>) => {
    setMembershipData(prev => ({
      ...prev,
      contactInformation: { ...prev.contactInformation, ...data },
    }));
  };

  const updateProfessionalInfo = (data: Partial<MembershipRequestData["professionalInfo"]>) => {
    setMembershipData(prev => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, ...data },
    }));
  };

  const updateSocialPresence = (data: Partial<MembershipRequestData["socialPresence"]>) => {
    setMembershipData(prev => ({
      ...prev,
      socialPresence: { ...prev.socialPresence, ...data },
    }));
  };

  const updatePrivacyConsent = (data: Partial<MembershipRequestData["privacyConsent"]>) => {
    setMembershipData(prev => ({
      ...prev,
      privacyConsent: { ...prev.privacyConsent, ...data },
    }));
  };

  const submitMembershipRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/membership-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(membershipData),
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
