// app/(protected)/onboarding/components/Step3.tsx
import { useOnboarding } from "../hooks/useOnboarding";

const Step3 = () => {
  const { goNext, goBack, updateField, data } = useOnboarding();
  const employmentStatus = data.employmentStatus || "";

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Step 3: Professional & Business Information
      </h2>

      <div className="mb-4">
        <label className="block mb-2">Employment Status</label>
        <select
          className="w-full p-2 border rounded-md"
          value={employmentStatus}
          onChange={(e) => updateField("employmentStatus", e.target.value)}
        >
          <option value="">Select</option>
          <option value="employed">Employed</option>
          <option value="businessOwner">Business Owner</option>
          <option value="retired">Retired/Unemployed</option>
          <option value="student">Student</option>
        </select>
      </div>

      {employmentStatus === "employed" && (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Company Name</label>
            <input
              type="text"
              placeholder="Your company name"
              className="w-full p-2 border rounded-md"
              value={data.companyName || ""}
              onChange={(e) => updateField("companyName", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Job Title/Role</label>
            <input
              type="text"
              placeholder="Your role"
              className="w-full p-2 border rounded-md"
              value={data.jobTitle || ""}
              onChange={(e) => updateField("jobTitle", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Industry</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.industry || ""}
              onChange={(e) => updateField("industry", e.target.value)}
            >
              <option value="">Select</option>
              <option value="tech">Tech</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Years of Experience</label>
            <input
              type="number"
              placeholder="Years of experience"
              className="w-full p-2 border rounded-md"
              value={data.yearsExperience || ""}
              onChange={(e) => updateField("yearsExperience", e.target.value)}
            />
          </div>
        </div>
      )}

      {employmentStatus === "businessOwner" && (
        <div>
          <div className="mb-4">
            <label className="block mb-2">Business Name</label>
            <input
              type="text"
              placeholder="Your business name"
              className="w-full p-2 border rounded-md"
              value={data.businessName || ""}
              onChange={(e) => updateField("businessName", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Business Type</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.businessType || ""}
              onChange={(e) => updateField("businessType", e.target.value)}
            >
              <option value="">Select</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="manufacturing">Manufacturing</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">
              Do you have a physical store/location?
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.hasPhysicalStore || ""}
              onChange={(e) => updateField("hasPhysicalStore", e.target.value)}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {data.hasPhysicalStore === "yes" && (
            <div className="mb-4">
              <label className="block mb-2">Business Address</label>
              <input
                type="text"
                placeholder="Your business address"
                className="w-full p-2 border rounded-md"
                value={data.businessAddress || ""}
                onChange={(e) => updateField("businessAddress", e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {employmentStatus === "retired" && (
        <div>
          <div className="mb-4">
            <label className="block mb-2">
              Previous Occupation (if applicable)
            </label>
            <input
              type="text"
              placeholder="Your previous occupation"
              className="w-full p-2 border rounded-md"
              value={data.previousOccupation || ""}
              onChange={(e) => updateField("previousOccupation", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Interested in Mentorship?</label>
            <select
              className="w-full p-2 border rounded-md"
              value={data.mentorshipInterest || ""}
              onChange={(e) => updateField("mentorshipInterest", e.target.value)}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
      )}

      {employmentStatus === "student" && (
        <div>
          <div className="mb-4">
            <label className="block mb-2">School/University Name</label>
            <input
              type="text"
              placeholder="Your institution"
              className="w-full p-2 border rounded-md"
              value={data.schoolName || ""}
              onChange={(e) => updateField("schoolName", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Field of Study</label>
            <input
              type="text"
              placeholder="Your field of study"
              className="w-full p-2 border rounded-md"
              value={data.fieldOfStudy || ""}
              onChange={(e) => updateField("fieldOfStudy", e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Expected Graduation Year</label>
            <input
              type="number"
              placeholder="e.g. 2026"
              className="w-full p-2 border rounded-md"
              value={data.expectedGraduationYear || ""}
              onChange={(e) => updateField("expectedGraduationYear", e.target.value)}
            />
          </div>
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

export default Step3;
