// app/(protected)/onboarding/components/Step1.tsx
"use client";

import React from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step1Props {
  next: () => void;
}

export default function Step1({ next }: Step1Props) {
  const { membershipData, updatePersonalDetails, updateDemographicInformation, updateContactInformation } = useMembershipRequest();

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 1: Basic Information</h2>
      {/* Personal Details */}
      <label className="block mb-1 font-semibold">First Name</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.personal_details.first_name}
        onChange={(e) => updatePersonalDetails({ first_name: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Last Name</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.personal_details.last_name}
        onChange={(e) => updatePersonalDetails({ last_name: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Middle Name (optional)</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-4"
        value={membershipData.personal_details.middle_name}
        onChange={(e) => updatePersonalDetails({ middle_name: e.target.value })}
      />

      {/* Demographic Information */}
      <label className="block mb-1 font-semibold">Date of Birth</label>
      <input
        type="date"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.demographic_information.date_of_birth}
        onChange={(e) => updateDemographicInformation({ date_of_birth: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Gender (optional)</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-4"
        placeholder="Male, Female, etc."
        value={membershipData.demographic_information.gender}
        onChange={(e) => updateDemographicInformation({ gender: e.target.value })}
      />

      {/* Contact Information */}
      <label className="block mb-1 font-semibold">Phone Number</label>
      <input
        type="tel"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.contact_information.primary_phone_number}
        onChange={(e) => updateContactInformation({ primary_phone_number: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Email</label>
      <input
        type="email"
        className="border w-full p-2 rounded mb-4"
        value={membershipData.contact_information.primary_email}
        onChange={(e) => updateContactInformation({ primary_email: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Address Line 1</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.contact_information.address.line1}
        onChange={(e) =>
          updateContactInformation({ address: { ...membershipData.contact_information.address, line1: e.target.value } })
        }
      />
      <label className="block mb-1 font-semibold">Address Line 2</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={membershipData.contact_information.address.line2}
        onChange={(e) =>
          updateContactInformation({ address: { ...membershipData.contact_information.address, line2: e.target.value } })
        }
      />
      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">City</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={membershipData.contact_information.address.city}
            onChange={(e) =>
              updateContactInformation({ address: { ...membershipData.contact_information.address, city: e.target.value } })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">State</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={membershipData.contact_information.address.state}
            onChange={(e) =>
              updateContactInformation({ address: { ...membershipData.contact_information.address, state: e.target.value } })
            }
          />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">ZIP</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={membershipData.contact_information.address.zip}
            onChange={(e) =>
              updateContactInformation({ address: { ...membershipData.contact_information.address, zip: e.target.value } })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Country</label>
          <input
            type="text"
            className="border w-full p-2 rounded"
            value={membershipData.contact_information.address.country}
            onChange={(e) =>
              updateContactInformation({ address: { ...membershipData.contact_information.address, country: e.target.value } })
            }
          />
        </div>
      </div>
      <button onClick={next} className="bg-blue-500 text-white px-4 py-2 rounded">
        Next
      </button>
    </div>
  );
}
