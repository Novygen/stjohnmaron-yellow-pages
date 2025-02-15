import { useOnboarding } from "../hooks/useOnboarding";

const Step1 = () => {
  const { goNext, updateField, data } = useOnboarding();

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Step 1: Basic Information</h2>
      <input
        type="text"
        placeholder="First Name"
        className="w-full p-2 border rounded-md mb-2"
        value={data.firstName || ""}
        onChange={(e) => updateField("firstName", e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        className="w-full p-2 border rounded-md mb-2"
        value={data.lastName || ""}
        onChange={(e) => updateField("lastName", e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={goNext}
      >
        Next
      </button>
    </div>
  );
};

export default Step1;
