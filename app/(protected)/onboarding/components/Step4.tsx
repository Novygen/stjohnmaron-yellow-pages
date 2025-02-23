// app/(protected)/onboarding/components/Step4.tsx
"use client";

import { useEffect } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step4() {
  const {
    currentStep,
    loading,
    step4Data,
    setStep4Data,
    loadStep,
    saveStep,
  } = useOnboarding();

  useEffect(() => {
    if (currentStep === 4) {
      loadStep(4);
    }
  }, [currentStep, loadStep]);

  function handleNext() {
    saveStep(4, true);
  }
  function handleBack() {
    saveStep(4, false);
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Step 4: Social &amp; Online Presence
      </h2>
      {loading && <p className="text-blue-600 mb-4">Saving/Loading data...</p>}

      <label className="block mb-1 font-semibold">Personal Website</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="https://mywebsite.com"
        value={step4Data.socialPresence.personal_website || ""}
        onChange={(e) =>
          setStep4Data({
            ...step4Data,
            socialPresence: {
              ...step4Data.socialPresence,
              personal_website: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">LinkedIn Profile</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="LinkedIn URL"
        value={step4Data.socialPresence.linked_in_profile || ""}
        onChange={(e) =>
          setStep4Data({
            ...step4Data,
            socialPresence: {
              ...step4Data.socialPresence,
              linked_in_profile: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Facebook Profile</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="Facebook URL"
        value={step4Data.socialPresence.facebook_profile || ""}
        onChange={(e) =>
          setStep4Data({
            ...step4Data,
            socialPresence: {
              ...step4Data.socialPresence,
              facebook_profile: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Instagram Handle</label>
      <input
        className="border w-full mb-2 p-2 rounded"
        placeholder="@instagram"
        value={step4Data.socialPresence.instagram_handle || ""}
        onChange={(e) =>
          setStep4Data({
            ...step4Data,
            socialPresence: {
              ...step4Data.socialPresence,
              instagram_handle: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Other Social Links</label>
      <textarea
        className="border w-full mb-2 p-2 rounded"
        placeholder="One URL per line or comma-separated"
        value={step4Data.socialPresence.other_social_media_links.join(", ")}
        onChange={(e) =>
          setStep4Data({
            ...step4Data,
            socialPresence: {
              ...step4Data.socialPresence,
              other_social_media_links: e.target.value
                .split(",")
                .map((link) => link.trim()),
            },
          })
        }
      />

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
