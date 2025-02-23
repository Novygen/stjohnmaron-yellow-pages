// app/(protected)/onboarding/components/Step1.tsx
"use client";

import { useEffect } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step1() {
  const {
    step1Data,
    setStep1Data,
    loadStep,
    saveStep,
    currentStep,
    loading,
  } = useOnboarding();

  // On mount, load the data for step 1
  useEffect(() => {
    if (currentStep === 1) {
      loadStep(1);
    }
  }, [currentStep, loadStep]);

  const handleNext = () => {
    console.log("Saving step 1 data", step1Data);
    saveStep(1, true);
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 1: Basic Information</h2>
      {loading && <p className="text-blue-600 mb-4">Saving / Loading data...</p>}

      {/* Personal Details */}
      <label className="block mb-1 font-semibold">First Name</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.personalDetails.first_name}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            personalDetails: {
              ...step1Data.personalDetails,
              first_name: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Last Name</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.personalDetails.last_name}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            personalDetails: {
              ...step1Data.personalDetails,
              last_name: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Middle Name (optional)</label>
      <input
        className="border w-full mb-4 p-2 rounded"
        value={step1Data.personalDetails.middle_name || ""}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            personalDetails: {
              ...step1Data.personalDetails,
              middle_name: e.target.value,
            },
          })
        }
      />

      {/* Demographic Info */}
      <label className="block mb-1 font-semibold">Date of Birth</label>
      <input
        type="date"
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.demographicInformation.date_of_birth}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            demographicInformation: {
              ...step1Data.demographicInformation,
              date_of_birth: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Gender (optional)</label>
      <input
        className="border w-full mb-4 p-2 rounded"
        value={step1Data.demographicInformation.gender || ""}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            demographicInformation: {
              ...step1Data.demographicInformation,
              gender: e.target.value,
            },
          })
        }
      />

      {/* Contact Info */}
      <label className="block mb-1 font-semibold">Phone Number</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.contactInformation.primary_phone_number}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            contactInformation: {
              ...step1Data.contactInformation,
              primary_phone_number: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Email</label>
      <input
        type="email"
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.contactInformation.primary_email}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            contactInformation: {
              ...step1Data.contactInformation,
              primary_email: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Address Line 1</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.contactInformation.address.line1}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            contactInformation: {
              ...step1Data.contactInformation,
              address: {
                ...step1Data.contactInformation.address,
                line1: e.target.value,
              },
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Address Line 2</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        value={step1Data.contactInformation.address.line2 || ""}
        onChange={(e) =>
          setStep1Data({
            ...step1Data,
            contactInformation: {
              ...step1Data.contactInformation,
              address: {
                ...step1Data.contactInformation.address,
                line2: e.target.value,
              },
            },
          })
        }
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">City</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            value={step1Data.contactInformation.address.city}
            onChange={(e) =>
              setStep1Data({
                ...step1Data,
                contactInformation: {
                  ...step1Data.contactInformation,
                  address: {
                    ...step1Data.contactInformation.address,
                    city: e.target.value,
                  },
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">State</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            value={step1Data.contactInformation.address.state}
            onChange={(e) =>
              setStep1Data({
                ...step1Data,
                contactInformation: {
                  ...step1Data.contactInformation,
                  address: {
                    ...step1Data.contactInformation.address,
                    state: e.target.value,
                  },
                },
              })
            }
          />
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <label className="block mb-1 font-semibold">ZIP</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            value={step1Data.contactInformation.address.zip}
            onChange={(e) =>
              setStep1Data({
                ...step1Data,
                contactInformation: {
                  ...step1Data.contactInformation,
                  address: {
                    ...step1Data.contactInformation.address,
                    zip: e.target.value,
                  },
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label className="block mb-1 font-semibold">Country</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            value={step1Data.contactInformation.address.country}
            onChange={(e) =>
              setStep1Data({
                ...step1Data,
                contactInformation: {
                  ...step1Data.contactInformation,
                  address: {
                    ...step1Data.contactInformation.address,
                    country: e.target.value,
                  },
                },
              })
            }
          />
        </div>
      </div>

      <button
        onClick={handleNext}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        disabled={loading}
      >
        Next
      </button>
    </div>
  );
}
