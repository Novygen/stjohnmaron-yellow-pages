// app/(protected)/onboarding/components/Step4.tsx
import { useOnboarding } from "../hooks/useOnboarding";

const Step4 = () => {
  const { goNext, goBack, updateField, data } = useOnboarding();

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Step 4: Social & Online Presence
      </h2>

      <div className="mb-4">
        <label className="block mb-2">Personal Website / Blog</label>
        <input
          type="text"
          placeholder="https://yourwebsite.com"
          className="w-full p-2 border rounded-md"
          value={data.personalWebsite || ""}
          onChange={(e) => updateField("personalWebsite", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">LinkedIn Profile</label>
        <input
          type="text"
          placeholder="LinkedIn URL"
          className="w-full p-2 border rounded-md"
          value={data.linkedin || ""}
          onChange={(e) => updateField("linkedin", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Facebook Profile</label>
        <input
          type="text"
          placeholder="Facebook URL"
          className="w-full p-2 border rounded-md"
          value={data.facebook || ""}
          onChange={(e) => updateField("facebook", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Instagram Handle</label>
        <input
          type="text"
          placeholder="@yourhandle"
          className="w-full p-2 border rounded-md"
          value={data.instagram || ""}
          onChange={(e) => updateField("instagram", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Other Social Media Links</label>
        <input
          type="text"
          placeholder="Comma-separated URLs"
          className="w-full p-2 border rounded-md"
          value={data.otherSocialLinks || ""}
          onChange={(e) => updateField("otherSocialLinks", e.target.value)}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-gray-300 px-4 py-2 rounded-md"
          onClick={goBack}
        >
          Previous
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={goNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4;
