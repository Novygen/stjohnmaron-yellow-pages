// app/(protected)/onboarding/components/Step5.tsx
import { useOnboarding } from "../hooks/useOnboarding";

const Step5 = () => {
  const { goNext, goBack, updateField, data } = useOnboarding();

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Step 5: Community Engagement
      </h2>

      <div className="mb-4">
        <label className="block mb-2">
          Are you interested in networking with other parishioners?
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.networkingInterest || ""}
          onChange={(e) => updateField("networkingInterest", e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          Would you like to mentor or be mentored in your professional field?
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.mentorshipPreference || ""}
          onChange={(e) => updateField("mentorshipPreference", e.target.value)}
        >
          <option value="">Select</option>
          <option value="mentor">Mentor</option>
          <option value="mentee">Mentee</option>
          <option value="both">Both</option>
        </select>
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

export default Step5;
