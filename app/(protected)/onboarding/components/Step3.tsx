"use client";
import { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step3Props {
  next: () => void;
  back: () => void;
}

export default function Step3({ next, back }: Step3Props) {
  const { membershipData, updateSocialPresence } = useMembershipRequest();
  const [localSocial, setLocalSocial] = useState(membershipData.socialPresence);

  useEffect(() => {
    setLocalSocial(membershipData.socialPresence);
  }, [membershipData.socialPresence]);

  const validateUrl = (url: string) => {
    return url.startsWith("http://") || url.startsWith("https://");
  };

  function handleNext() {
    if (localSocial.personalWebsite && !validateUrl(localSocial.personalWebsite)) {
      alert("Please enter a valid URL for your personal website (must start with http:// or https://).");
      return;
    }
    if (localSocial.linkedInProfile && !validateUrl(localSocial.linkedInProfile)) {
      alert("Please enter a valid URL for your LinkedIn profile (must start with http:// or https://).");
      return;
    }
    if (localSocial.facebookProfile && !validateUrl(localSocial.facebookProfile)) {
      alert("Please enter a valid URL for your Facebook profile (must start with http:// or https://).");
      return;
    }
    if (localSocial.instagramHandle && !localSocial.instagramHandle.startsWith("@")) {
      alert("Instagram handle should start with '@'.");
      return;
    }
    updateSocialPresence(localSocial);
    next();
  }

  return (
    <div className="bg-white p-4 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 3: Social & Online Presence</h2>
      <label className="block mb-1 font-semibold">Personal Website</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        placeholder="https://yourwebsite.com"
        value={localSocial.personalWebsite || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, personalWebsite: e.target.value })}
      />
      <label className="block mb-1 font-semibold">LinkedIn Profile</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        placeholder="https://www.linkedin.com/..."
        value={localSocial.linkedInProfile || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, linkedInProfile: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Facebook Profile</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-2"
        placeholder="https://www.facebook.com/..."
        value={localSocial.facebookProfile || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, facebookProfile: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Instagram Handle</label>
      <input
        type="text"
        className="border w-full p-2 rounded mb-4"
        placeholder="@instagram"
        value={localSocial.instagramHandle || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, instagramHandle: e.target.value })}
      />
      <div className="flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">
          Previous
        </button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">
          Next
        </button>
      </div>
    </div>
  );
}
