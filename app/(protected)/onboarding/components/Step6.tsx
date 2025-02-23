// app/(protected)/onboarding/components/Step6.tsx
"use client";

import { useEffect, useState } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step6() {
  const {
    currentStep,
    loading,
    step6Data,
    setStep6Data,
    loadStep,
    saveStep,
  } = useOnboarding();

  // Example: a list of public details the user can toggle
  const allPublicDetails = [
    "PersonalDetails",
    "DemographicInformation",
    "ContactInformation",
    "SocialPresence",
    "ProfessionalInfo",
  ];

  const [reviewText, setReviewText] = useState(
    "Please review your information and confirm."
  );

  useEffect(() => {
    if (currentStep === 6) {
      loadStep(6);
    }
  }, [currentStep, loadStep]);

  function handleNext() {
    saveStep(6, true);
  }
  function handleBack() {
    saveStep(6, false);
  }

  function togglePublicDetail(detail: string) {
    let updated = [...step6Data.privacyConsent.public_details];
    if (updated.includes(detail)) {
      updated = updated.filter((d) => d !== detail);
    } else {
      updated.push(detail);
    }
    setStep6Data({
      ...step6Data,
      privacyConsent: {
        ...step6Data.privacyConsent,
        public_details: updated,
      },
    });
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Step 6: Privacy, Consent &amp; Review
      </h2>
      {loading && <p className="text-blue-600 mb-4">Saving/Loading data...</p>}

      <label className="block mb-1 font-semibold">
        Display in Yellow Pages?
      </label>
      <select
        className="border w-full mb-4 p-2 rounded"
        value={step6Data.privacyConsent.display_in_yellow_pages ? "yes" : "no"}
        onChange={(e) =>
          setStep6Data({
            ...step6Data,
            privacyConsent: {
              ...step6Data.privacyConsent,
              display_in_yellow_pages: e.target.value === "yes",
            },
          })
        }
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      {step6Data.privacyConsent.display_in_yellow_pages && (
        <div className="mb-4">
          <p className="mb-2 font-semibold">Select which details are public:</p>
          {allPublicDetails.map((detail) => (
            <div key={detail} className="flex items-center mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={step6Data.privacyConsent.public_details.includes(detail)}
                onChange={() => togglePublicDetail(detail)}
              />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}

      <label className="block mb-2 font-semibold">Review &amp; Confirm</label>
      <textarea
        className="border w-full p-2 rounded mb-4"
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
      />

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="bg-gray-300 text-black px-4 py-2 rounded"
          disabled={loading}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
