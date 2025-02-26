"use client";
import React, { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step4Props {
  next: () => void;
  back: () => void;
}

export default function Step4({ next, back }: Step4Props) {
  const { membershipData, updatePrivacyConsent } = useMembershipRequest();
  const [localPrivacy, setLocalPrivacy] = useState(membershipData.privacyConsent);

  useEffect(() => {
    setLocalPrivacy(membershipData.privacyConsent);
  }, [membershipData.privacyConsent]);

  const handleConsent = () => {
    if (!localPrivacy.internalConsent) {
      alert("You must consent to internal use to proceed.");
      return;
    }
    updatePrivacyConsent(localPrivacy);
    next();
  };

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Privacy, Consent & Review</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={localPrivacy.internalConsent}
            onChange={(e) =>
              setLocalPrivacy({ ...localPrivacy, internalConsent: e.target.checked })
            }
          />
          <span>I understand and consent to share my information for internal purposes.</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={localPrivacy.displayInYellowPages}
            onChange={(e) =>
              setLocalPrivacy({ ...localPrivacy, displayInYellowPages: e.target.checked })
            }
          />
          <span>I consent to display my information (name, email, etc.) in the Yellow Pages.</span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={localPrivacy.displayPhonePublicly}
            onChange={(e) =>
              setLocalPrivacy({ ...localPrivacy, displayPhonePublicly: e.target.checked })
            }
          />
          <span>I consent to display my phone number publicly.</span>
        </label>
      </div>
      <div className="flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">
          Previous
        </button>
        <button onClick={handleConsent} className="bg-blue-500 text-white px-4 py-2 rounded">
          I consent
        </button>
      </div>
    </div>
  );
}
