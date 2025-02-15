// app/(protected)/onboarding/components/Step6.tsx
import { useOnboarding } from "../hooks/useOnboarding";
import { useState } from "react";

const Step6 = () => {
  const { goNext, goBack, updateField, data } = useOnboarding();
  const [selectedPublicDetails, setSelectedPublicDetails] = useState<string[]>(data.publicDetails || []);

  const handleCheckboxChange = (detail: string) => {
    let updated;
    if (selectedPublicDetails.includes(detail)) {
      updated = selectedPublicDetails.filter((d) => d !== detail);
    } else {
      updated = [...selectedPublicDetails, detail];
    }
    setSelectedPublicDetails(updated);
    updateField("publicDetails", updated);
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">
        Step 6: Privacy, Consent & Review
      </h2>

      {/* Privacy Settings Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
        <div className="mb-4">
          <label className="block mb-2">
            Do you want your information displayed in the church’s Yellow Pages?
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={data.displayInYellowPages || ""}
            onChange={(e) => updateField("displayInYellowPages", e.target.value)}
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        {data.displayInYellowPages === "yes" && (
          <div className="mb-4">
            <p className="mb-2">Select which details should be public:</p>
            {[
              "Personal Details",
              "Demographic Info",
              "Contact Information",
              "Social Media",
              "Employment",
            ].map((detail) => (
              <div key={detail} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={selectedPublicDetails.includes(detail)}
                  onChange={() => handleCheckboxChange(detail)}
                  className="mr-2"
                />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review & Confirm Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Review Your Information</h3>
        <div className="p-4 border rounded-md bg-gray-50 text-sm overflow-auto max-h-40">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
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
          Confirm & Next
        </button>
      </div>
    </div>
  );
};

export default Step6;
