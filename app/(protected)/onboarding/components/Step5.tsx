// app/(protected)/onboarding/components/Step5.tsx
"use client";
import React, { useEffect, useState, useRef } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step5Props {
  finish: () => void;
  back: () => void;
}

export default function Step5({ finish, back }: Step5Props) {
  const { submitMembershipRequest } = useMembershipRequest();
  const [submissionStatus, setSubmissionStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple submissions by checking if we've already submitted
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    
    setSubmissionStatus("loading");
    (async function postData() {
      try {
        await submitMembershipRequest();
        setSubmissionStatus("success");
      } catch {
        setSubmissionStatus("error");
      }
    })();
  }, [submitMembershipRequest]);

  if (submissionStatus === "loading") {
    return <div className="text-center p-4">Submitting Request...</div>;
  } else if (submissionStatus === "error") {
    return (
      <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Submission Failed</h2>
        <p className="mb-6">There was an error submitting your membership request.</p>
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">
          Previous
        </button>
      </div>
    );
  } else if (submissionStatus === "success") {
    return (
      <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Onboarding Completed!</h2>
        <p className="mb-6">
          Congratulations! Your membership request was processed successfully.
        </p>
        <div className="flex justify-end">
          <button onClick={finish} className="bg-green-500 text-white px-4 py-2 rounded">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return null;
}
