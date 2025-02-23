// app/(protected)/onboarding/hooks/useOnboarding.ts
"use client";

import { useState, useCallback } from "react";
import { IStep1Data } from "../interfaces/IStep1Data";
import { IStep2Data } from "../interfaces/IStep2Data";
import { IStep3Data } from "../interfaces/IStep3Data";
import { IStep4Data } from "../interfaces/IStep4Data";
import { IStep5Data } from "../interfaces/IStep5Data";
import { IStep6Data } from "../interfaces/IStep6Data";
import { IStep7Data } from "../interfaces/IStep7Data";

// Strategy interface
interface StepStrategy<T> {
  load: (memberId: string, token: string) => Promise<T>;
  save: (memberId: string, token: string, data: Partial<T>) => Promise<void>;
}

// Step 1 Strategy
const Step1Strategy: StepStrategy<IStep1Data> = {
  async load(memberId, token) {
    // Example aggregator endpoint or direct calls:
    const res = await fetch(`/api/members/personal-details?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const personal = await res.json();

    const res2 = await fetch(`/api/members/demographic-information?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const demographic = await res2.json();

    const res3 = await fetch(`/api/members/contact-information?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const contact = await res3.json();

    // Merge them into one object:
    return {
      personalDetails: {
        first_name: personal?.first_name || "",
        last_name: personal?.last_name || "",
        middle_name: personal?.middle_name || "",
      },
      demographicInformation: {
        date_of_birth: demographic?.date_of_birth || "",
        gender: demographic?.gender || "",
      },
      contactInformation: {
        primary_phone_number: contact?.primary_phone_number || "",
        primary_email: contact?.primary_email || "",
        address: contact?.address || {
          line1: "",
          line2: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      },
    };
  },

  async save(memberId, token, data) {
    // Save each sub-document
    // 1) personal-details
    await fetch(`/api/members/personal-details?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...data.personalDetails,
        memberId,
      }),
    });
    // 2) demographic-information
    await fetch(`/api/members/demographic-information?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.demographicInformation),
    });
    // 3) contact-information
    await fetch(`/api/members/contact-information?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.contactInformation),
    });
  },
};

// Step 2 Strategy
const Step2Strategy: StepStrategy<IStep2Data> = {
  async load(memberId, token) {
    const res = await fetch(`/api/members/church-membership?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const church = await res.json();

    const res2 = await fetch(`/api/members/volunteer-involvement?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const volunteer = await res2.json();

    return {
      churchMembership: {
        is_registered_member: church?.is_registered_member || false,
        attending_duration: church?.attending_duration || "",
        attending_frequency: church?.attending_frequency || "",
        ministries_involved: church?.ministries_involved || [],
        wants_to_volunteer: church?.wants_to_volunteer || false,
        volunteer_roles: church?.volunteer_roles || [],
      },
      volunteerInvolvement: {
        wants_to_volunteer: volunteer?.wants_to_volunteer || false,
        volunteer_roles: volunteer?.volunteer_roles || [],
      },
    };
  },
  async save(memberId, token, data) {
    await fetch(`/api/members/church-membership?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.churchMembership),
    });
    await fetch(`/api/members/volunteer-involvement?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.volunteerInvolvement),
    });
  },
};

// Repeat for Step 3, 4, 5, 6. For brevity, we’ll show just Step3:
const Step3Strategy: StepStrategy<IStep3Data> = {
  async load(memberId, token) {
    const res = await fetch(`/api/members/professional-info?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const prof = await res.json();
    return {
      professionalInfo: prof || {
        employment_status: { status: "" },
        employment_details: undefined,
        employment_history: undefined,
        businesses: [],
        service_providers: [],
        students: [],
      },
    };
  },
  async save(memberId, token, data) {
    await fetch(`/api/members/professional-info?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.professionalInfo),
    });
  },
};

// Step4 Strategy
const Step4Strategy: StepStrategy<IStep4Data> = {
  async load(memberId, token) {
    const res = await fetch(`/api/members/social-presence?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const social = await res.json();
    return {
      socialPresence: social || {
        personal_website: "",
        linked_in_profile: "",
        facebook_profile: "",
        instagram_handle: "",
        other_social_media_links: [],
      },
    };
  },
  async save(memberId, token, data) {
    await fetch(`/api/members/social-presence?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.socialPresence),
    });
  },
};

// Step5 Strategy
const Step5Strategy: StepStrategy<IStep5Data> = {
  async load(memberId, token) {
    const res = await fetch(`/api/members/additional-interests?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const interests = await res.json();
    return {
      additionalInterests: interests ||{
        networking_interest: false,
        mentorship_preference: "",
      }
    };
  },
  async save(memberId, token, data) {
    await fetch(`/api/members/additional-interests?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.additionalInterests),
    });
  },
};

// Step6 Strategy
const Step6Strategy: StepStrategy<IStep6Data> = {
  async load(memberId, token) {
    const res = await fetch(`/api/members/privacy-consent?id=${memberId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const consent = await res.json();
    return {
      privacyConsent: consent || {
        display_in_yellow_pages: false,
        public_details: [],
      },
    };
  },
  async save(memberId, token, data) {
    await fetch(`/api/members/privacy-consent?id=${memberId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data.privacyConsent),
    });
  },
};

// Step7 usually doesn't store data, but we can define a no-op strategy:
const Step7Strategy: StepStrategy<IStep7Data> = {
  async load() {
    return { completed: true };
  },
  async save() {
    // No-op
  },
};

// A factory to get the strategy for a given step
function StepFactory(step: number) {
  switch (step) {
    case 1:
      return Step1Strategy;
    case 2:
      return Step2Strategy;
    case 3:
      return Step3Strategy;
    case 4:
      return Step4Strategy;
    case 5:
      return Step5Strategy;
    case 6:
      return Step6Strategy;
    case 7:
      return Step7Strategy;
    default:
      return Step1Strategy; // fallback
  }
}

export default function useOnboarding() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Step states:
  const [step1Data, setStep1Data] = useState<IStep1Data>({
    personalDetails: { first_name: "", last_name: "" },
    demographicInformation: { date_of_birth: "" },
    contactInformation: {
      primary_phone_number: "",
      primary_email: "",
      address: { line1: "", city: "", state: "", zip: "", country: "" },
    },
  });

  const [step2Data, setStep2Data] = useState<IStep2Data>({
    churchMembership: {
      is_registered_member: false,
      attending_duration: "",
      attending_frequency: "",
      ministries_involved: [],
      wants_to_volunteer: false,
      volunteer_roles: [],
    },
    volunteerInvolvement: {
      wants_to_volunteer: false,
      volunteer_roles: [],
    },
  });

  const [step3Data, setStep3Data] = useState<IStep3Data>({
    professionalInfo: {
      employment_status: { status: "" },
      employment_details: undefined,
      employment_history: undefined,
      businesses: [],
      service_providers: [],
      students: [],
    },
  });

  const [step4Data, setStep4Data] = useState<IStep4Data>({
    socialPresence: {
      personal_website: "",
      linked_in_profile: "",
      facebook_profile: "",
      instagram_handle: "",
      other_social_media_links: [],
    },
  });

  const [step5Data, setStep5Data] = useState<IStep5Data>({
    additionalInterests: {
      networking_interest: false,
      mentorship_preference: "",
    }
  });

  const [step6Data, setStep6Data] = useState<IStep6Data>({
    privacyConsent: {
      display_in_yellow_pages: false,
      public_details: [],
    },
  });

  // Similarly for step3Data, step4Data, step5Data, step6Data
  // Step7 typically doesn't store data, or just a "completed" flag

  // Retrieve token & memberId from localStorage or from Redux
  const token = (typeof window !== "undefined" && localStorage.getItem("token")) || "";
  const memberId = (typeof window !== "undefined" && localStorage.getItem("memberId")) || "";

  /**
   * Load the data for the current step from the relevant API endpoints
   */
  const loadStep = useCallback(async (step: number) => {
    setLoading(true);
    const strategy = StepFactory(step);
    try {
      const data = await strategy.load(memberId, token);

      // Save loaded data to the correct local state
      switch (step) {
        case 1:
          setStep1Data(data as IStep1Data);
          break;
        case 2:
          setStep2Data(data as IStep2Data);
          break;
        case 3:
          setStep3Data(data as IStep3Data);
          break;
        case 4:
          setStep4Data(data as IStep4Data);
          break;
        case 5:
          setStep5Data(data as IStep5Data);
          break;
        case 6:
          setStep6Data(data as IStep6Data);
          break;
        case 7:
          // Step7 strategy load
          break;
      }
    } catch (err) {
      console.error("Error loading step data:", err);
    } finally {
      setLoading(false);
    }
  }, [memberId, token]);

  /**
   * Save data for the current step
   * nextStep param: true = go forward, false = go back
   */
  const saveStep = useCallback(async (step: number, nextStep: boolean) => {
    setLoading(true);
    const strategy = StepFactory(step);
    try {
      // Save from local state
      switch (step) {
        case 1:
          await strategy.save(memberId, token, step1Data);
          break;
        case 2:
          await strategy.save(memberId, token, step2Data);
          break;
        case 3:
          await strategy.save(memberId, token, step3Data);
          break;
        case 4:
          await strategy.save(memberId, token, step4Data);
          break;
        case 5:
          await strategy.save(memberId, token, step5Data);
          break;
        case 6:
          await strategy.save(memberId, token, step6Data);
          break;
        case 7:
          // No-op
          break;
      }
      setCurrentStep((prev) => {
        const newStep = nextStep ? Math.min(prev + 1, 7) : Math.max(prev - 1, 1);
        // Trigger loading new step data
        loadStep(newStep);
        return newStep;
      });
    } catch (err) {
      console.error("Error saving step data:", err);
    } finally {
      setLoading(false);
    }
  }, [memberId, token, step1Data, step2Data, step3Data, step4Data, step5Data, step6Data, loadStep]);

  /**
   * Check if the entire onboarding is complete
   */
  async function checkOnboardingComplete(): Promise<boolean> {
    try {
      const res = await fetch("/api/members/onboarding-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.completed) {
        alert(`Onboarding incomplete. Missing step: ${data.currentStep}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  return {
    currentStep,
    setCurrentStep,
    loading,

    // Step data states
    step1Data,
    setStep1Data,
    step2Data,
    setStep2Data,
    step3Data,
    setStep3Data,
    step4Data,
    setStep4Data,
    step5Data,
    setStep5Data,
    step6Data,
    setStep6Data,

    // Actions
    loadStep,
    saveStep,
    checkOnboardingComplete,
  };
}
