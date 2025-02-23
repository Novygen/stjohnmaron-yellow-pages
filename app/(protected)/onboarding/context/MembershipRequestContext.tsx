/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(protected)/onboarding/context/MembershipRequestContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUserUid } from "@/store/slices/userSlice";

// Define the shape of your membership data
export interface MembershipRequestData {
  member_login: {
    uid: string;
  };
  personal_details: {
    first_name: string;
    last_name: string;
    middle_name: string;
  };
  demographic_information: {
    date_of_birth: string;
    gender: string;
  };
  contact_information: {
    primary_phone_number: string;
    primary_email: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  professional_info: {
    employment_status: { status: string };
    employment_details: {
      company_name: string;
      job_title: string;
      industry: string;
      years_of_experience: number;
    };
    employment_history: {
      previous_occupation: string;
      mentorship_interest: boolean;
    };
    businesses: {
      business_name: string;
      business_type: string;
      has_physical_store: boolean;
      business_address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        zip: string;
        country: string;
      };
    }[];
    service_providers: {
      service_name: string;
      service_details: string[];
    }[];
    students: {
      school_name: string;
      field_of_study: string;
      expected_graduation_year: number;
    }[];
  };
  social_presence: {
    personal_website: string;
    linked_in_profile: string;
    facebook_profile: string;
    instagram_handle: string;
    other_social_media_links: string[];
  };
  privacy_consent: {
    display_in_yellow_pages: boolean;
    public_details: string[];
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define a default membership request with an empty uid; we'll update it from the Redux store.
export const defaultMembershipRequest: MembershipRequestData = {
  member_login: {
    uid: ""
  },
  personal_details: { first_name: "", last_name: "", middle_name: "" },
  demographic_information: { date_of_birth: "", gender: "" },
  contact_information: {
    primary_phone_number: "",
    primary_email: "",
    address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
  },
  professional_info: {
    employment_status: { status: "" },
    employment_details: { company_name: "", job_title: "", industry: "", years_of_experience: 0 },
    employment_history: { previous_occupation: "", mentorship_interest: false },
    businesses: [],
    service_providers: [],
    students: [],
  },
  social_presence: {
    personal_website: "",
    linked_in_profile: "",
    facebook_profile: "",
    instagram_handle: "",
    other_social_media_links: [],
  },
  privacy_consent: { display_in_yellow_pages: false, public_details: [] },
  isApproved: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

interface MembershipRequestContextType {
  membershipData: MembershipRequestData;
  setMembershipData: React.Dispatch<React.SetStateAction<MembershipRequestData>>;
  updatePersonalDetails: (data: Partial<MembershipRequestData["personal_details"]>) => void;
  updateDemographicInformation: (data: Partial<MembershipRequestData["demographic_information"]>) => void;
  updateContactInformation: (data: Partial<MembershipRequestData["contact_information"]>) => void;
  updateProfessionalInfo: (data: Partial<MembershipRequestData["professional_info"]>) => void;
  updateSocialPresence: (data: Partial<MembershipRequestData["social_presence"]>) => void;
  updatePrivacyConsent: (data: Partial<MembershipRequestData["privacy_consent"]>) => void;
  submitMembershipRequest: () => Promise<any>;
  loading: boolean;
}

const MembershipRequestContext = createContext<MembershipRequestContextType | undefined>(undefined);

export const MembershipRequestProvider = ({ children }: { children: ReactNode }) => {
  // Get the uid from Redux via useSelector.
  const userUid = useSelector(selectUserUid) ?? "";
  
  // Initialize the membership data using the uid from Redux.
  const [membershipData, setMembershipData] = useState<MembershipRequestData>(() => ({
    ...defaultMembershipRequest,
    member_login: { uid: userUid },
  }));
  
  const [loading, setLoading] = useState<boolean>(false);

  // Ensure membershipData.member_login.uid updates if userUid changes.
  useEffect(() => {
    setMembershipData(prev => ({
      ...prev,
      member_login: { uid: userUid }
    }));
  }, [userUid]);

  const updatePersonalDetails = (data: Partial<MembershipRequestData["personal_details"]>) => {
    setMembershipData(prev => ({
      ...prev,
      personal_details: { ...prev.personal_details, ...data },
    }));
  };

  const updateDemographicInformation = (data: Partial<MembershipRequestData["demographic_information"]>) => {
    setMembershipData(prev => ({
      ...prev,
      demographic_information: { ...prev.demographic_information, ...data },
    }));
  };

  const updateContactInformation = (data: Partial<MembershipRequestData["contact_information"]>) => {
    setMembershipData(prev => ({
      ...prev,
      contact_information: { ...prev.contact_information, ...data },
    }));
  };

  const updateProfessionalInfo = (data: Partial<MembershipRequestData["professional_info"]>) => {
    setMembershipData(prev => ({
      ...prev,
      professional_info: { ...prev.professional_info, ...data },
    }));
  };

  const updateSocialPresence = (data: Partial<MembershipRequestData["social_presence"]>) => {
    setMembershipData(prev => ({
      ...prev,
      social_presence: { ...prev.social_presence, ...data },
    }));
  };

  const updatePrivacyConsent = (data: Partial<MembershipRequestData["privacy_consent"]>) => {
    setMembershipData(prev => ({
      ...prev,
      privacy_consent: { ...prev.privacy_consent, ...data },
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
        throw new Error(result.error || "Submission failed");
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
        updateDemographicInformation,
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
