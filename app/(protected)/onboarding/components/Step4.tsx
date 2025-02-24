/* eslint-disable @typescript-eslint/no-explicit-any */
// app/(protected)/onboarding/components/Step4.tsx
"use client";
import { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step4Props {
  next: () => void;
  back: () => void;
}

// Define configuration for each section and its fields.
interface FieldOption {
  key: string;
  label: string;
}

interface SectionOption {
  key: keyof typeof defaultVisibility;
  label: string;
  fields: FieldOption[];
  nested?: {
    key: string;
    label: string;
    fields: FieldOption[];
  }[];
}

// Default visibility object used if no selection has been made.
const defaultVisibility = {
  personal_details: { first_name: false, last_name: false, middle_name: false },
  demographic_information: { date_of_birth: false, gender: false },
  contact_information: {
    primary_phone_number: false,
    primary_email: false,
    address: { line1: false, line2: false, city: false, state: false, zip: false, country: false },
  },
  professional_info: {
    employment_status: false,
    employment_details: { company_name: false, job_title: false, industry: false, years_of_experience: false },
    employment_history: { previous_occupation: false, mentorship_interest: false },
    businesses: false,
    service_providers: false,
    students: false,
  },
  social_presence: { personal_website: false, linked_in_profile: false, facebook_profile: false, instagram_handle: false, other_social_media_links: false },
};

const sections: SectionOption[] = [
  {
    key: "personal_details",
    label: "Personal Details",
    fields: [
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "middle_name", label: "Middle Name" },
    ],
  },
  {
    key: "demographic_information",
    label: "Demographic Information",
    fields: [
      { key: "date_of_birth", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
    ],
  },
  {
    key: "contact_information",
    label: "Contact Information",
    fields: [
      { key: "primary_phone_number", label: "Phone Number" },
      { key: "primary_email", label: "Email" },
    ],
    nested: [
      {
        key: "address",
        label: "Address",
        fields: [
          { key: "line1", label: "Address Line 1" },
          { key: "line2", label: "Address Line 2" },
          { key: "city", label: "City" },
          { key: "state", label: "State" },
          { key: "zip", label: "ZIP" },
          { key: "country", label: "Country" },
        ],
      },
    ],
  },
  {
    key: "professional_info",
    label: "Professional Info",
    fields: [
      { key: "employment_status", label: "Employment Status" },
    ],
    nested: [
      {
        key: "employment_details",
        label: "Employment Details",
        fields: [
          { key: "company_name", label: "Company Name" },
          { key: "job_title", label: "Job Title" },
          { key: "industry", label: "Industry" },
          { key: "years_of_experience", label: "Years of Experience" },
        ],
      },
      {
        key: "employment_history",
        label: "Employment History",
        fields: [
          { key: "previous_occupation", label: "Previous Occupation" },
          { key: "mentorship_interest", label: "Mentorship Interest" },
        ],
      },
      {
        key: "businesses",
        label: "Businesses",
        fields: [],
      },
      {
        key: "service_providers",
        label: "Service Providers",
        fields: [],
      },
      {
        key: "students",
        label: "Students",
        fields: [],
      },
    ],
  },
  {
    key: "social_presence",
    label: "Social Presence",
    fields: [
      { key: "personal_website", label: "Personal Website" },
      { key: "linked_in_profile", label: "LinkedIn Profile" },
      { key: "facebook_profile", label: "Facebook Profile" },
      { key: "instagram_handle", label: "Instagram Handle" },
      { key: "other_social_media_links", label: "Other Social Media Links" },
    ],
  },
];

export default function Step4({ next, back }: Step4Props) {
  const { membershipData, updatePrivacyConsent } = useMembershipRequest();
  const [localData, setLocalData] = useState(membershipData.privacy_consent);

  useEffect(() => {
    setLocalData(membershipData.privacy_consent);
  }, [membershipData.privacy_consent]);

  // Update a flat field in a section.
  const updateVisibilityField = (sectionKey: keyof typeof defaultVisibility, fieldKey: string, value: boolean) => {
    setLocalData(prev => ({
      ...prev,
      public_visibility: {
        ...prev.public_visibility,
        [sectionKey]: {
          ...(prev.public_visibility?.[sectionKey] || {}),
          [fieldKey]: value,
        },
      },
    }));
  };

  // Update a nested field (e.g. address) in a section.
  const updateVisibilityNestedField = (sectionKey: keyof typeof defaultVisibility, nestedKey: string, fieldKey: string, value: boolean) => {
    setLocalData(prev => ({
      ...prev,
      public_visibility: {
        ...prev.public_visibility,
        [sectionKey]: {
          ...(prev.public_visibility?.[sectionKey] || {}),
          [nestedKey]: {
            ...((prev.public_visibility?.[sectionKey] as any)?.[nestedKey] || {}),
            [fieldKey]: value,
          },
        },
      },
    }));
  };

  function handleNext() {
    // If yellow pages display is active and public_visibility hasn't been set, default all fields to false.
    if (
      localData.display_in_yellow_pages &&
      (!localData.public_visibility || Object.keys(localData.public_visibility).length === 0)
    ) {
      setLocalData(prev => ({
        ...prev,
        public_visibility: defaultVisibility,
      }));
    }
    updatePrivacyConsent(localData);
    next();
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 4: Privacy, Consent & Review</h2>
      <label className="block mb-1 font-semibold">Display in Yellow Pages?</label>
      <select
        className="border w-full p-2 rounded mb-4"
        value={localData.display_in_yellow_pages ? "yes" : "no"}
        onChange={(e) => setLocalData({ ...localData, display_in_yellow_pages: e.target.value === "yes" })}
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>
      {localData.display_in_yellow_pages && (
        <div className="mb-4">
          <p className="mb-2 font-semibold">Select details to display publicly:</p>
          {sections.map(section => (
            <div key={section.key} className="mb-4 border p-2 rounded">
              <h3 className="font-semibold">{section.label}</h3>
              {section.fields.map(field => {
                const checked = ((localData.public_visibility as any)?.[section.key]?.[field.key]) || false;
                return (
                  <div key={field.key} className="flex items-center ml-4">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={checked}
                      onChange={(e) => updateVisibilityField(section.key, field.key, e.target.checked)}
                    />
                    <span className="text-sm">{field.label}</span>
                  </div>
                );
              })}
              {section.nested &&
                section.nested.map(nested => (
                  <div key={nested.key} className="ml-6 mt-2 border p-2 rounded">
                    <h4 className="font-semibold">{nested.label}</h4>
                    {nested.fields.map(field => {
                      const checked = ((localData.public_visibility?.[section.key] as any)?.[nested.key]?.[field.key]) || false;
                      return (
                        <div key={field.key} className="flex items-center ml-4">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={checked}
                            onChange={(e) =>
                                updateVisibilityNestedField(section.key, nested.key, field.key, e.target.checked)
                              }
                          />
                          <span className="text-sm">{field.label}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">
          Previous
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}
