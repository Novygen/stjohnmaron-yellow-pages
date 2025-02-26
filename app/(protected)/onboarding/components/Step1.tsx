"use client";

import React from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";
import Select from "react-select";
import statesData from "@/data/states.json";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

interface Option {
  value: string;
  label: string;
}

interface Step1Props {
  next: () => void;
}

export default function Step1({ next }: Step1Props) {
  const { membershipData, updatePersonalDetails, updateContactInformation } = useMembershipRequest();
  const userEmail = useSelector((state: RootState) => state.user.email);

  // Age range options
  const ageRangeOptions: Option[] = [
    { value: "18-24", label: "18-24" },
    { value: "25-34", label: "25-34" },
    { value: "35-44", label: "35-44" },
    { value: "45-54", label: "45-54" },
    { value: "55-64", label: "55-64" },
    { value: "65+", label: "65+" },
  ];

  // Create state options from the states.json file
  const stateOptions: Option[] = statesData.states.map((state: string) => ({
    value: state,
    label: state,
  }));

  const { personalDetails, contactInformation } = membershipData;
  const address = contactInformation.address;

  const handleNext = () => {
    // Validate required fields
    if (!personalDetails.firstName.trim()) {
      alert("First Name is required.");
      return;
    }
    if (!personalDetails.lastName.trim()) {
      alert("Last Name is required.");
      return;
    }
    if (!personalDetails.ageRange) {
      alert("Please select an Age Range.");
      return;
    }
    if (!contactInformation.primaryPhoneNumber.trim()) {
      alert("Phone Number is required.");
      return;
    }
    if (!address.line1.trim()) {
      alert("Address Line 1 is required.");
      return;
    }
    if (!address.city.trim()) {
      alert("City is required.");
      return;
    }
    if (!address.state.trim()) {
      alert("State is required.");
      return;
    }
    if (!address.zip.trim()) {
      alert("ZIP is required.");
      return;
    }
    next();
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 1: Basic Information</h2>
      {/* Personal Details */}
      <label className="block mb-1 font-semibold">First Name</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={personalDetails.firstName}
        onChange={(e) => {
          updatePersonalDetails({ firstName: e.target.value });
          updateContactInformation({ primaryEmail: userEmail ?? "" });
        }}
        required
      />
      <label className="block mb-1 font-semibold">Last Name</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={personalDetails.lastName}
        onChange={(e) => updatePersonalDetails({ lastName: e.target.value })}
        required
      />
      <label className="block mb-1 font-semibold">Middle Name (optional)</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={personalDetails.middleName}
        onChange={(e) => updatePersonalDetails({ middleName: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Age Range</label>
      <Select
        options={ageRangeOptions}
        value={ageRangeOptions.find((opt) => opt.value === personalDetails.ageRange) || null}
        onChange={(option) => updatePersonalDetails({ ageRange: option ? option.value : "" })}
        placeholder="Select Age Range"
      />
      <hr className="my-4" />
      {/* Contact Information */}
      <label className="block mb-1 font-semibold">Phone Number</label>
      <input
        type="tel"
        className="border w-full p-2 rounded mb-2"
        value={contactInformation.primaryPhoneNumber}
        onChange={(e) => updateContactInformation({ primaryPhoneNumber: e.target.value })}
        required
      />
      <label className="block mb-1 font-semibold">Email</label>
      <input
        type="email"
        readOnly
        className="border w-full p-2 rounded mb-4 bg-gray-100"
        value={userEmail || ""}
      />
      <label className="block mb-1 font-semibold">Address Line 1</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={address.line1}
        onChange={(e) =>
          updateContactInformation({ address: { ...address, line1: e.target.value } })
        }
        required
      />
      <label className="block mb-1 font-semibold">Address Line 2</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={address.line2}
        onChange={(e) =>
          updateContactInformation({ address: { ...address, line2: e.target.value } })
        }
      />
      <label className="block mb-1 font-semibold">City</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={address.city}
        onChange={(e) =>
          updateContactInformation({ address: { ...address, city: e.target.value } })
        }
        required
      />
      <label className="block mb-1 font-semibold">State</label>
      <Select
        options={stateOptions}
        value={stateOptions.find((opt) => opt.value === address.state) || null}
        onChange={(option) =>
          updateContactInformation({ address: { ...address, state: option ? option.value : "" } })
        }
        placeholder="Select State"
        isSearchable
      />
      <label className="block mb-1 font-semibold">ZIP</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        value={address.zip}
        onChange={(e) =>
          updateContactInformation({ address: { ...address, zip: e.target.value } })
        }
        required
      />
      <label className="block mb-1 font-semibold">Country</label>
      <input
        type="text"
        readOnly
        className="border w-full p-2 rounded mb-4 bg-gray-100"
        value={statesData.country}
      />
      <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
        Next
      </button>
    </div>
  );
}
