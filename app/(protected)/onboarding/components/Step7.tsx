// app/(protected)/onboarding/components/Step7.tsx
"use client";

import { useEffect } from "react";
import useOnboarding from "../hooks/useOnboarding";

interface Step7Props {
  onFinish: () => void; // callback from the container page
}

export default function Step7({ onFinish }: Step7Props) {
  const { currentStep, loadStep, loading } = useOnboarding();

  useEffect(() => {
    if (currentStep === 7) {
      loadStep(7);
    }
  }, [currentStep, loadStep]);

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Onboarding Completed!</h2>
      {loading && <p className="text-blue-600 mb-4">Loading final step...</p>}
      <p className="mb-6">
        Congratulations! You have completed all the onboarding steps.
      </p>
      <button
        onClick={onFinish}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Finish &amp; Go to Dashboard
      </button>
    </div>
  );
}
