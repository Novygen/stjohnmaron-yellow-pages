// app/(protected)/onboarding/components/Step5.tsx
"use client";

import { useEffect } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step5() {
  const {
    currentStep,
    loading,
    step5Data,
    setStep5Data,
    loadStep,
    saveStep,
  } = useOnboarding();

  useEffect(() => {
    if (currentStep === 5) {
      loadStep(5);
    }
  }, [currentStep, loadStep]);

  function handleNext() {
    saveStep(5, true);
  }
  function handleBack() {
    saveStep(5, false);
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 5: Community Engagement</h2>
      {loading && <p className="text-blue-600 mb-4">Saving/Loading data...</p>}

      <label className="block mb-1 font-semibold">
        Interested in networking with other parishioners?
      </label>
      <select
        className="border w-full mb-2 p-2 rounded"
        value={step5Data.additionalInterests.networking_interest ? "yes" : "no"}
        onChange={(e) =>
          setStep5Data({
            ...step5Data,
            additionalInterests: {
              ...step5Data.additionalInterests,
              networking_interest: e.target.value === "yes",
            },
          })
        }
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      <label className="block mb-1 font-semibold">
        Mentorship Preference
      </label>
      <select
        className="border w-full mb-2 p-2 rounded"
        value={step5Data.additionalInterests.mentorship_preference}
        onChange={(e) =>
          setStep5Data({
            ...step5Data,
            additionalInterests: {
              ...step5Data.additionalInterests,
              mentorship_preference: e.target.value,
            },
          })
        }
      >
        <option value="">Select</option>
        <option value="mentor">Mentor</option>
        <option value="mentee">Mentee</option>
        <option value="both">Both</option>
      </select>

      <div className="flex justify-between mt-4">
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
