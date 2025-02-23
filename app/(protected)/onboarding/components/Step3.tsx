"use client";

import { useEffect } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step3() {
  const { currentStep, loading, step3Data, setStep3Data, loadStep, saveStep } = useOnboarding();

  useEffect(() => {
    if (currentStep === 3) {
      loadStep(3);
    }
  }, [currentStep, loadStep]);

  const employmentStatus = step3Data.professionalInfo.employment_status.status;

  const handleNext = () => {
    saveStep(3, true);
  };

  const handleBack = () => {
    saveStep(3, false);
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Step 3: Professional &amp; Business Info
      </h2>
      {loading && <p className="text-blue-600 mb-4">Saving/Loading data...</p>}
      
      <label className="block mb-1 font-semibold">Employment Status</label>
      <select
        className="border w-full p-2 rounded mb-4"
        value={employmentStatus}
        onChange={(e) =>
          setStep3Data({
            ...step3Data,
            professionalInfo: {
              ...step3Data.professionalInfo,
              employment_status: { status: e.target.value as "Employed" | "BusinessOwner" | "Retired" | "Student" },
              // Reset conditional fields on status change:
              employment_details: { company_name: "", job_title: "", industry: "", years_of_experience: 0 },
              employment_history: { previous_occupation: "", mentorship_interest: false },
              businesses: [],
              service_providers: [],
              students: [],
            },
          })
        }
      >
        <option value="">Select</option>
        <option value="Employed">Employed</option>
        <option value="BusinessOwner">Business Owner</option>
        <option value="Retired">Retired/Unemployed</option>
        <option value="Student">Student</option>
      </select>

      {employmentStatus === "Employed" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">Company Name</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Company Name"
            value={step3Data.professionalInfo.employment_details?.company_name || ""}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_details: {
                    company_name: e.target.value,
                    job_title: step3Data.professionalInfo.employment_details?.job_title || "",
                    industry: step3Data.professionalInfo.employment_details?.industry || "",
                    years_of_experience: step3Data.professionalInfo.employment_details?.years_of_experience || 0,
                  },
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Job Title/Role</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Job Title/Role"
            value={step3Data.professionalInfo.employment_details?.job_title || ""}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_details: {
                    company_name: step3Data.professionalInfo.employment_details?.company_name || "",
                    job_title: e.target.value,
                    industry: step3Data.professionalInfo.employment_details?.industry || "",
                    years_of_experience: step3Data.professionalInfo.employment_details?.years_of_experience || 0,
                  },
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Industry</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Industry"
            value={step3Data.professionalInfo.employment_details?.industry || ""}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_details: {
                    company_name: step3Data.professionalInfo.employment_details?.company_name || "",
                    job_title: step3Data.professionalInfo.employment_details?.job_title || "",
                    industry: e.target.value,
                    years_of_experience: step3Data.professionalInfo.employment_details?.years_of_experience || 0,
                  },
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Years of Experience</label>
          <input
            type="number"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Years of Experience"
            value={step3Data.professionalInfo.employment_details?.years_of_experience || 0}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_details: {
                    company_name: step3Data.professionalInfo.employment_details?.company_name || "",
                    job_title: step3Data.professionalInfo.employment_details?.job_title || "",
                    industry: step3Data.professionalInfo.employment_details?.industry || "",
                    years_of_experience: parseInt(e.target.value, 10) || 0,
                  },
                },
              })
            }
          />
        </div>
      )}

      {employmentStatus === "BusinessOwner" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">Business Name</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Business Name"
            value={step3Data.professionalInfo.businesses?.[0]?.business_name || ""}
            onChange={(e) => {
              const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              const updatedBusiness = {
                ...currentBusiness,
                business_name: e.target.value,
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  businesses: [updatedBusiness],
                },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Business Type</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Business Type"
            value={step3Data.professionalInfo.businesses?.[0]?.business_type || ""}
            onChange={(e) => {
              const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              const updatedBusiness = {
                ...currentBusiness,
                business_type: e.target.value,
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  businesses: [updatedBusiness],
                },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Has Physical Store?</label>
          <select
            className="border w-full mb-2 p-2 rounded"
            value={step3Data.professionalInfo.businesses?.[0]?.has_physical_store ? "yes" : "no"}
            onChange={(e) => {
              const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              const updatedBusiness = {
                ...currentBusiness,
                has_physical_store: e.target.value === "yes",
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  businesses: [updatedBusiness],
                },
              });
            }}
          />
          {step3Data.professionalInfo.businesses?.[0]?.has_physical_store === true && (
            <div className="mt-2 border p-2 rounded bg-white">
              <label className="block mb-1 font-semibold">Store Address Line 1</label>
              <input
                className="border w-full mb-2 p-2 rounded"
                placeholder="Address Line 1"
                value={step3Data.professionalInfo.businesses?.[0]?.business_address?.line1 || ""}
                onChange={(e) => {
                  const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                    business_name: "",
                    business_type: "",
                    has_physical_store: false,
                    business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                  };
                  const updatedBusiness = {
                    ...currentBusiness,
                    business_address: {
                      ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      ...currentBusiness.business_address,
                      line1: e.target.value,
                    },
                  };
                  setStep3Data({
                    ...step3Data,
                    professionalInfo: {
                      ...step3Data.professionalInfo,
                      businesses: [updatedBusiness],
                    },
                  });
                }}
              />
              <label className="block mb-1 font-semibold">Store Address Line 2</label>
              <input
                className="border w-full mb-2 p-2 rounded"
                placeholder="Address Line 2"
                value={step3Data.professionalInfo.businesses?.[0]?.business_address?.line2 || ""}
                onChange={(e) => {
                  const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                    business_name: "",
                    business_type: "",
                    has_physical_store: false,
                    business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                  };
                  const updatedBusiness = {
                    ...currentBusiness,
                    business_address: {
                      ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      ...currentBusiness.business_address,
                      line2: e.target.value,
                    },
                  };
                  setStep3Data({
                    ...step3Data,
                    professionalInfo: {
                      ...step3Data.professionalInfo,
                      businesses: [updatedBusiness],
                    },
                  });
                }}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">City</label>
                  <input
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="City"
                    value={step3Data.professionalInfo.businesses?.[0]?.business_address?.city || ""}
                    onChange={(e) => {
                      const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: false,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      const updatedBusiness = {
                        ...currentBusiness,
                        business_address: {
                          ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                          ...currentBusiness.business_address,
                          city: e.target.value,
                        },
                      };
                      setStep3Data({
                        ...step3Data,
                        professionalInfo: {
                          ...step3Data.professionalInfo,
                          businesses: [updatedBusiness],
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">State</label>
                  <input
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="State"
                    value={step3Data.professionalInfo.businesses?.[0]?.business_address?.state || ""}
                    onChange={(e) => {
                      const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: false,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      const updatedBusiness = {
                        ...currentBusiness,
                        business_address: {
                          ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                          ...currentBusiness.business_address,
                          state: e.target.value,
                        },
                      };
                      setStep3Data({
                        ...step3Data,
                        professionalInfo: {
                          ...step3Data.professionalInfo,
                          businesses: [updatedBusiness],
                        },
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">ZIP</label>
                  <input
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="ZIP"
                    value={step3Data.professionalInfo.businesses?.[0]?.business_address?.zip || ""}
                    onChange={(e) => {
                      const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: false,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      const updatedBusiness = {
                        ...currentBusiness,
                        business_address: {
                          ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                          ...currentBusiness.business_address,
                          zip: e.target.value,
                        },
                      };
                      setStep3Data({
                        ...step3Data,
                        professionalInfo: {
                          ...step3Data.professionalInfo,
                          businesses: [updatedBusiness],
                        },
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Country</label>
                  <input
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="Country"
                    value={step3Data.professionalInfo.businesses?.[0]?.business_address?.country || ""}
                    onChange={(e) => {
                      const currentBusiness = step3Data.professionalInfo.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: false,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      const updatedBusiness = {
                        ...currentBusiness,
                        business_address: {
                          ...{ line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                          ...currentBusiness.business_address,
                          country: e.target.value,
                        },
                      };
                      setStep3Data({
                        ...step3Data,
                        professionalInfo: {
                          ...step3Data.professionalInfo,
                          businesses: [updatedBusiness],
                        },
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {employmentStatus === "Retired" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">Previous Occupation</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Previous Occupation"
            value={step3Data.professionalInfo.employment_history?.previous_occupation || ""}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_history: {
                    previous_occupation: e.target.value,
                    mentorship_interest: step3Data.professionalInfo.employment_history?.mentorship_interest || false,
                  },
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Interested in Mentorship?</label>
          <select
            className="border w-full mb-2 p-2 rounded"
            value={step3Data.professionalInfo.employment_history?.mentorship_interest ? "yes" : "no"}
            onChange={(e) =>
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  employment_history: {
                    previous_occupation: step3Data.professionalInfo.employment_history?.previous_occupation || "",
                    mentorship_interest: e.target.value === "yes",
                  },
                },
              })
            }
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
      )}

      {employmentStatus === "Student" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">School/University Name</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="School/University"
            value={step3Data.professionalInfo.students?.[0]?.school_name || ""}
            onChange={(e) => {
              const currentStudent = step3Data.professionalInfo.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              const updatedStudent = {
                ...currentStudent,
                school_name: e.target.value,
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  students: [updatedStudent],
                },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Field of Study</label>
          <input
            className="border w-full mb-2 p-2 rounded"
            placeholder="Field of Study"
            value={step3Data.professionalInfo.students?.[0]?.field_of_study || ""}
            onChange={(e) => {
              const currentStudent = step3Data.professionalInfo.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              const updatedStudent = {
                ...currentStudent,
                field_of_study: e.target.value,
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  students: [updatedStudent],
                },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Expected Graduation Year</label>
          <input
            type="number"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Graduation Year"
            value={step3Data.professionalInfo.students?.[0]?.expected_graduation_year || 0}
            onChange={(e) => {
              const currentStudent = step3Data.professionalInfo.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              const updatedStudent = {
                ...currentStudent,
                expected_graduation_year: parseInt(e.target.value, 10) || 0,
              };
              setStep3Data({
                ...step3Data,
                professionalInfo: {
                  ...step3Data.professionalInfo,
                  students: [updatedStudent],
                },
              });
            }}
          />
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 text-black px-4 py-2 rounded"
          disabled={loading}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}
