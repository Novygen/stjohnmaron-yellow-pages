// app/(protected)/onboarding/components/Step2.tsx
"use client";
import React, { useState } from "react";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Step2Props {
  next: () => void;
  back: () => void;
}

export default function Step2({ next, back }: Step2Props) {
  const { membershipData, updateProfessionalInfo } = useMembershipRequest();
  const [localProfessional, setLocalProfessional] = useState(membershipData.professional_info);
  const employmentStatus = localProfessional.employment_status.status;

  const handleStatusChange = (value: string) => {
    setLocalProfessional({
      ...localProfessional,
      employment_status: { status: value },
      employment_details: { company_name: "", job_title: "", industry: "", years_of_experience: 0 },
      employment_history: { previous_occupation: "", mentorship_interest: false },
      businesses: [],
      service_providers: [],
      students: [],
    });
  };

  const handleNext = () => {
    if (employmentStatus === "Employed") {
      const details = localProfessional.employment_details;
      if (!details?.company_name.trim() || !details?.job_title.trim() || !details?.industry.trim()) {
        alert("Please fill in all required employment details.");
        return;
      }
    }
    updateProfessionalInfo(localProfessional);
    next();
  };

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 2: Professional & Business Info</h2>
      <label className="block mb-1 font-semibold">Employment Status</label>
      <select
        className="border w-full p-2 rounded mb-4"
        value={employmentStatus}
        onChange={(e) => handleStatusChange(e.target.value)}
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
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Company Name"
            value={localProfessional.employment_details?.company_name || ""}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_details: {
                  ...localProfessional.employment_details,
                  company_name: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Job Title/Role</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Job Title/Role"
            value={localProfessional.employment_details?.job_title || ""}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_details: {
                  ...localProfessional.employment_details,
                  job_title: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Industry</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Industry"
            value={localProfessional.employment_details?.industry || ""}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_details: {
                  ...localProfessional.employment_details,
                  industry: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Years of Experience</label>
          <input
            type="number"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Years of Experience"
            value={localProfessional.employment_details?.years_of_experience || 0}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_details: {
                  ...localProfessional.employment_details,
                  years_of_experience: parseInt(e.target.value, 10) || 0,
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
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Business Name"
            value={localProfessional.businesses?.[0]?.business_name || ""}
            onChange={(e) => {
              const current = localProfessional.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              setLocalProfessional({
                ...localProfessional,
                businesses: [{ ...current, business_name: e.target.value }],
              });
            }}
          />
          <label className="block mb-1 font-semibold">Business Type</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Business Type"
            value={localProfessional.businesses?.[0]?.business_type || ""}
            onChange={(e) => {
              const current = localProfessional.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              setLocalProfessional({
                ...localProfessional,
                businesses: [{ ...current, business_type: e.target.value }],
              });
            }}
          />
          <label className="block mb-1 font-semibold">Has Physical Store?</label>
          <select
            className="border w-full mb-2 p-2 rounded"
            value={localProfessional.businesses?.[0]?.has_physical_store ? "yes" : "no"}
            onChange={(e) => {
              const current = localProfessional.businesses?.[0] || {
                business_name: "",
                business_type: "",
                has_physical_store: false,
                business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
              };
              setLocalProfessional({
                ...localProfessional,
                businesses: [{ ...current, has_physical_store: e.target.value === "yes" }],
              });
            }}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          {localProfessional.businesses?.[0]?.has_physical_store && (
            <div className="mt-2 border p-2 rounded bg-white">
              <label className="block mb-1 font-semibold">Store Address Line 1</label>
              <input
                type="text"
                className="border w-full mb-2 p-2 rounded"
                placeholder="Address Line 1"
                value={localProfessional.businesses?.[0]?.business_address?.line1 || ""}
                onChange={(e) => {
                  const current = localProfessional.businesses?.[0] || {
                    business_name: "",
                    business_type: "",
                    has_physical_store: true,
                    business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                  };
                  setLocalProfessional({
                    ...localProfessional,
                    businesses: [{
                      ...current,
                      business_address: { ...current.business_address, line1: e.target.value },
                    }],
                  });
                }}
              />
              <label className="block mb-1 font-semibold">Store Address Line 2</label>
              <input
                type="text"
                className="border w-full mb-2 p-2 rounded"
                placeholder="Address Line 2"
                value={localProfessional.businesses?.[0]?.business_address?.line2 || ""}
                onChange={(e) => {
                  const current = localProfessional.businesses?.[0] || {
                    business_name: "",
                    business_type: "",
                    has_physical_store: true,
                    business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                  };
                  setLocalProfessional({
                    ...localProfessional,
                    businesses: [{
                      ...current,
                      business_address: { ...current.business_address, line2: e.target.value },
                    }],
                  });
                }}
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">City</label>
                  <input
                    type="text"
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="City"
                    value={localProfessional.businesses?.[0]?.business_address?.city || ""}
                    onChange={(e) => {
                      const current = localProfessional.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: true,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      setLocalProfessional({
                        ...localProfessional,
                        businesses: [{
                          ...current,
                          business_address: { ...current.business_address, city: e.target.value },
                        }],
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">State</label>
                  <input
                    type="text"
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="State"
                    value={localProfessional.businesses?.[0]?.business_address?.state || ""}
                    onChange={(e) => {
                      const current = localProfessional.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: true,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      setLocalProfessional({
                        ...localProfessional,
                        businesses: [{
                          ...current,
                          business_address: { ...current.business_address, state: e.target.value },
                        }],
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">ZIP</label>
                  <input
                    type="text"
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="ZIP"
                    value={localProfessional.businesses?.[0]?.business_address?.zip || ""}
                    onChange={(e) => {
                      const current = localProfessional.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: true,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      setLocalProfessional({
                        ...localProfessional,
                        businesses: [{
                          ...current,
                          business_address: { ...current.business_address, zip: e.target.value },
                        }],
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1 font-semibold">Country</label>
                  <input
                    type="text"
                    className="border w-full mb-2 p-2 rounded"
                    placeholder="Country"
                    value={localProfessional.businesses?.[0]?.business_address?.country || ""}
                    onChange={(e) => {
                      const current = localProfessional.businesses?.[0] || {
                        business_name: "",
                        business_type: "",
                        has_physical_store: true,
                        business_address: { line1: "", line2: "", city: "", state: "", zip: "", country: "" },
                      };
                      setLocalProfessional({
                        ...localProfessional,
                        businesses: [{
                          ...current,
                          business_address: { ...current.business_address, country: e.target.value },
                        }],
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
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Previous Occupation"
            value={localProfessional.employment_history?.previous_occupation || ""}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_history: {
                  ...localProfessional.employment_history,
                  previous_occupation: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Interested in Mentorship?</label>
          <select
            className="border w-full mb-2 p-2 rounded"
            value={localProfessional.employment_history?.mentorship_interest ? "yes" : "no"}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                employment_history: {
                  ...localProfessional.employment_history,
                  mentorship_interest: e.target.value === "yes",
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
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="School/University"
            value={localProfessional.students?.[0]?.school_name || ""}
            onChange={(e) => {
              const current = localProfessional.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              setLocalProfessional({
                ...localProfessional,
                students: [{ ...current, school_name: e.target.value }],
              });
            }}
          />
          <label className="block mb-1 font-semibold">Field of Study</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Field of Study"
            value={localProfessional.students?.[0]?.field_of_study || ""}
            onChange={(e) => {
              const current = localProfessional.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              setLocalProfessional({
                ...localProfessional,
                students: [{ ...current, field_of_study: e.target.value }],
              });
            }}
          />
          <label className="block mb-1 font-semibold">Expected Graduation Year</label>
          <input
            type="number"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Graduation Year"
            value={localProfessional.students?.[0]?.expected_graduation_year || 0}
            onChange={(e) => {
              const current = localProfessional.students?.[0] || {
                school_name: "",
                field_of_study: "",
                expected_graduation_year: 0,
              };
              setLocalProfessional({
                ...localProfessional,
                students: [{ ...current, expected_graduation_year: parseInt(e.target.value, 10) || 0 }],
              });
            }}
          />
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button onClick={back} className="bg-gray-300 text-black px-4 py-2 rounded">Previous</button>
        <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2 rounded">Next</button>
      </div>
    </div>
  );
}
