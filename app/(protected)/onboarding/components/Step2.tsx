// app/(protected)/onboarding/components/Step2.tsx
import { useOnboarding } from "../hooks/useOnboarding";
import { useState } from "react";

const Step2 = () => {
  const { goNext, goBack, updateField, data } = useOnboarding();
  const [selectedVolunteerRoles, setSelectedVolunteerRoles] = useState<string[]>(data.volunteerRoles || []);

  const handleCheckboxChange = (role: string) => {
    let updatedRoles;
    if (selectedVolunteerRoles.includes(role)) {
      updatedRoles = selectedVolunteerRoles.filter(r => r !== role);
    } else {
      updatedRoles = [...selectedVolunteerRoles, role];
    }
    setSelectedVolunteerRoles(updatedRoles);
    updateField("volunteerRoles", updatedRoles);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Step 2: Church Involvement & Volunteer Interests
      </h2>

      {/* Church Membership */}
      <div className="mb-4">
        <label className="block mb-2">
          Would you like to register as a church member?
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.churchMember || ""}
          onChange={(e) => updateField("churchMember", e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">
          How long have you been attending?
        </label>
        <input
          type="text"
          placeholder="e.g. 2 years"
          className="w-full p-2 border rounded-md"
          value={data.attendingDuration || ""}
          onChange={(e) => updateField("attendingDuration", e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Do you attend regularly?</label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.regularAttendance || ""}
          onChange={(e) => updateField("regularAttendance", e.target.value)}
        >
          <option value="">Select</option>
          <option value="regular">Regularly</option>
          <option value="occasional">Occasionally</option>
        </select>
      </div>

      {/* Volunteer Involvement */}
      <div className="mb-4">
        <label className="block mb-2">Would you like to volunteer?</label>
        <select
          className="w-full p-2 border rounded-md"
          value={data.volunteerInterest || ""}
          onChange={(e) => updateField("volunteerInterest", e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>

      {data.volunteerInterest === "yes" && (
        <div className="mb-4">
          <p className="mb-2">Select Volunteer Roles Interested In:</p>
          {["Usher", "Choir", "Teaching", "Tech", "Other"].map((role) => (
            <div key={role} className="flex items-center mb-1">
              <input
                type="checkbox"
                checked={selectedVolunteerRoles.includes(role)}
                onChange={() => handleCheckboxChange(role)}
                className="mr-2"
              />
              <span>{role}</span>
            </div>
          ))}
        </div>
      )}

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

export default Step2;
