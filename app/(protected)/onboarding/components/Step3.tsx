// app/(protected)/onboarding/components/Step3.tsx
"use client";
import { useEffect, useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step3Props {
  next: () => void;
  back: () => void;
}

export default function Step3({ next, back }: Step3Props) {
  const { membershipData, updateSocialPresence } = useMembershipRequest();
  const [localSocial, setLocalSocial] = useState(membershipData.social_presence);

  useEffect(() => {
    setLocalSocial(membershipData.social_presence);
  }, [membershipData.social_presence]);

  function handleNext() {
    if (localSocial.personal_website && !localSocial.personal_website.startsWith("http")) {
      alert("Please enter a valid URL for your personal website.");
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
        className="border w-full p-2 rounded mb-2"
        placeholder="https://yourwebsite.com"
        value={localSocial.personal_website || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, personal_website: e.target.value })}
      />
      <label className="block mb-1 font-semibold">LinkedIn Profile</label>
      <input
        className="border w-full p-2 rounded mb-2"
        placeholder="LinkedIn URL"
        value={localSocial.linked_in_profile || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, linked_in_profile: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Facebook Profile</label>
      <input
        className="border w-full p-2 rounded mb-2"
        placeholder="Facebook URL"
        value={localSocial.facebook_profile || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, facebook_profile: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Instagram Handle</label>
      <input
        className="border w-full p-2 rounded mb-2"
        placeholder="@instagram"
        value={localSocial.instagram_handle || ""}
        onChange={(e) => setLocalSocial({ ...localSocial, instagram_handle: e.target.value })}
      />
      <label className="block mb-1 font-semibold">Other Social Media Links</label>
      <textarea
        className="border w-full p-2 rounded mb-4"
        placeholder="Comma separated links"
        value={localSocial.other_social_media_links.join(", ")}
        onChange={(e) =>
          setLocalSocial({
            ...localSocial,
            other_social_media_links: e.target.value.split(",").map(link => link.trim()),
          })
        }
      />
      <div className="flex justify-between">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">Previous</button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
