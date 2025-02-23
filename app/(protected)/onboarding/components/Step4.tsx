// app/(protected)/onboarding/components/Step4.tsx
"use client";
import { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step4Props {
  next: () => void;
  back: () => void;
}

export default function Step4({ next, back }: Step4Props) {
  const { membershipData, updatePrivacyConsent } = useMembershipRequest();
  const [localData, setLocalData] = useState(membershipData.privacy_consent);
  const allPublicDetails = ["PersonalDetails", "DemographicInformation", "ContactInformation", "SocialPresence", "ProfessionalInfo"];

  useEffect(() => {
    setLocalData(membershipData.privacy_consent);
  }, [membershipData.privacy_consent]);

  function togglePublicDetail(detail: string) {
    let updated = [...localData.public_details];
    if (updated.includes(detail)) {
      updated = updated.filter((d) => d !== detail);
    } else {
      updated.push(detail);
    }
    setLocalData({ ...localData, public_details: updated });
  }

  function handleNext() {
    if (localData.display_in_yellow_pages && localData.public_details.length === 0) {
      setLocalData({ ...localData, public_details: [allPublicDetails[0]] });
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
          {allPublicDetails.map((detail) => (
            <div key={detail} className="flex items-center mb-1">
              <input
                type="checkbox"
                className="mr-2"
                checked={localData.public_details.includes(detail)}
                onChange={() => togglePublicDetail(detail)}
              />
              <span>{detail}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">Previous</button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
