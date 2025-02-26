/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import useMembershipRequest from "../hooks/useMembershipRequest";

interface Option {
  value: string;
  label: string;
}

interface Step2Props {
  next: () => void;
  back: () => void;
}

const defaultEmploymentDetails = {
  companyName: "",
  jobTitle: "",
  specialization: "",
  startDate: "",
};

const defaultBusiness = {
  businessName: "",
  additionalInformation: "",
  website: "",
  phoneNumber: "",
  industry: "",
};

export default function Step2({ next, back }: Step2Props) {
  const { membershipData, updateProfessionalInfo } = useMembershipRequest();
  const [localProfessional, setLocalProfessional] = useState(membershipData.professionalInfo);
  const employmentStatus = localProfessional.employmentStatus.status;

  // State for specialization and industry options
  const [specializationOptions, setSpecializationOptions] = useState<Option[]>([]);
  const [industryOptions, setIndustryOptions] = useState<Option[]>([]);

  // For Start Date dropdowns: Month and Year.
  const monthOptions: Option[] = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const yearOptions: Option[] = [];
  for (let y = currentYear; y >= 1990; y--) {
    yearOptions.push({ value: y.toString(), label: y.toString() });
  }
  const [startMonth, setStartMonth] = useState<string>("");
  const [startYear, setStartYear] = useState<string>("");

  // Initialize startMonth and startYear from employmentDetails.startDate if exists.
  useEffect(() => {
    if (localProfessional.employmentDetails?.startDate) {
      const parts = localProfessional.employmentDetails.startDate.split("/");
      if (parts.length === 2) {
        setStartMonth(parts[0]);
        setStartYear(parts[1]);
      }
    }
  }, [localProfessional.employmentDetails?.startDate]);

  // Fetch specialization options from API (fallback to local if error)
  useEffect(() => {
    async function fetchSpecializations() {
      try {
        const res = await fetch("/api/specializations");
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setSpecializationOptions(
            data.map((item: any) => ({ value: item.name, label: item.name }))
          );
        }
      } catch (error) {
        console.error("Error fetching specializations, using fallback.", error);
        import("@/data/specializations.json").then((module) => {
          const specs = module.default;
          setSpecializationOptions(
            specs.map((spec: any) => ({ value: spec.name, label: spec.name }))
          );
        });
      }
    }
    fetchSpecializations();
  }, []);

  // Fetch industry options from API (fallback to local if error)
  useEffect(() => {
    async function fetchIndustries() {
      try {
        const res = await fetch("/api/industries");
        const data = await res.json();
        if (data && Array.isArray(data)) {
          setIndustryOptions(
            data.map((item: any) => ({ value: item.name, label: item.name }))
          );
        }
      } catch (error) {
        console.error("Error fetching industries, using fallback.", error);
        import("@/data/industries.json").then((module) => {
          const inds = module.default;
          setIndustryOptions(
            inds.map((ind: any) => ({ value: ind.name, label: ind.name }))
          );
        });
      }
    }
    fetchIndustries();
  }, []);

  // Handle changes in employment status.
  const handleStatusChange = (value: string) => {
    if (value === "Employed") {
      setLocalProfessional({
        ...localProfessional,
        employmentStatus: { status: value },
        employmentDetails: { ...defaultEmploymentDetails },
        ownsBusinessOrService: false,
        business: undefined,
        student: undefined,
      });
    } else if (value === "BusinessOwner") {
      setLocalProfessional({
        ...localProfessional,
        employmentStatus: { status: value },
        business: { ...defaultBusiness },
        employmentDetails: undefined,
        ownsBusinessOrService: undefined,
        student: undefined,
      });
    } else if (value === "Student") {
      setLocalProfessional({
        ...localProfessional,
        employmentStatus: { status: value },
        student: { schoolName: "", fieldOfStudy: "", expectedGraduationYear: 0 },
        employmentDetails: undefined,
        business: undefined,
        ownsBusinessOrService: undefined,
      });
    } else {
      // Retired/Unemployed
      setLocalProfessional({
        ...localProfessional,
        employmentStatus: { status: value },
        employmentDetails: undefined,
        business: undefined,
        student: undefined,
        ownsBusinessOrService: undefined,
      });
    }
  };

  // Handle checkbox for "I also own a business/provide services"
  const handleOwnsBusinessChange = (checked: boolean) => {
    setLocalProfessional((prev) => ({
      ...prev,
      ownsBusinessOrService: checked,
      business: checked ? { ...defaultBusiness } : undefined,
    }));
  };

  // Handle changes for start month and year
  const handleStartMonthChange = (option: Option | null) => {
    const newMonth = option ? option.value : "";
    setStartMonth(newMonth);
    if (newMonth && startYear) {
      setLocalProfessional((prev) => ({
        ...prev,
        employmentDetails: {
          ...(prev.employmentDetails || defaultEmploymentDetails),
          startDate: `${newMonth}/${startYear}`,
        },
      }));
    }
  };

  const handleStartYearChange = (option: Option | null) => {
    const newYear = option ? option.value : "";
    setStartYear(newYear);
    if (startMonth && newYear) {
      setLocalProfessional((prev) => ({
        ...prev,
        employmentDetails: {
          ...(prev.employmentDetails || defaultEmploymentDetails),
          startDate: `${startMonth}/${newYear}`,
        },
      }));
    }
  };

  const handleNext = () => {
    if (employmentStatus === "Employed") {
      const details = localProfessional.employmentDetails || defaultEmploymentDetails;
      if (
        !details.companyName.trim() ||
        !details.jobTitle.trim() ||
        !details.specialization.trim() ||
        !details.startDate.trim()
      ) {
        alert("Please fill in all required employment details.");
        return;
      }
      if (localProfessional.ownsBusinessOrService) {
        const bus = localProfessional.business || defaultBusiness;
        if (
          !bus.businessName.trim() ||
          !bus.additionalInformation.trim() ||
          !bus.website.trim() ||
          !bus.phoneNumber.trim() ||
          !bus.industry.trim()
        ) {
          alert("Please fill in all required business details.");
          return;
        }
      }
    }
    if (employmentStatus === "BusinessOwner") {
      const bus = localProfessional.business || defaultBusiness;
      if (
        !bus.businessName.trim() ||
        !bus.additionalInformation.trim() ||
        !bus.website.trim() ||
        !bus.phoneNumber.trim() ||
        !bus.industry.trim()
      ) {
        alert("Please fill in all required business details.");
        return;
      }
    }
    if (employmentStatus === "Student") {
      const student = localProfessional.student;
      if (
        !student ||
        !student.schoolName.trim() ||
        !student.fieldOfStudy.trim() ||
        !student.expectedGraduationYear
      ) {
        alert("Please fill in all required student details.");
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
        <option value="BusinessOwner">Business Owner/Service Provider</option>
        <option value="Retired">Retired/Unemployed</option>
        <option value="Student">Student</option>
      </select>

      {employmentStatus === "Employed" && (
        <>
          {localProfessional.employmentDetails && (
            <div className="mb-4 border p-4 rounded bg-gray-50">
              <label className="block mb-1 font-semibold">Company Name</label>
              <input
                type="text"
                className="border w-full mb-2 p-2 rounded"
                placeholder="Company Name"
                value={localProfessional.employmentDetails.companyName}
                onChange={(e) =>
                  setLocalProfessional({
                    ...localProfessional,
                    employmentDetails: {
                      ...(localProfessional.employmentDetails || defaultEmploymentDetails),
                      companyName: e.target.value,
                    },
                  })
                }
              />
              <label className="block mb-1 font-semibold">Job Title/Role</label>
              <input
                type="text"
                className="border w-full mb-2 p-2 rounded"
                placeholder="Job Title/Role"
                value={localProfessional.employmentDetails.jobTitle}
                onChange={(e) =>
                  setLocalProfessional({
                    ...localProfessional,
                    employmentDetails: {
                      ...(localProfessional.employmentDetails || defaultEmploymentDetails),
                      jobTitle: e.target.value,
                    },
                  })
                }
              />
              <label className="block mb-1 font-semibold">Specialization</label>
              <Select
                options={specializationOptions}
                value={
                  specializationOptions.find(
                    (opt) =>
                      opt.value === (localProfessional.employmentDetails?.specialization || "")
                  ) || null
                }
                onChange={(option) =>
                  setLocalProfessional({
                    ...localProfessional,
                    employmentDetails: {
                      ...(localProfessional.employmentDetails || defaultEmploymentDetails),
                      specialization: option ? option.value : "",
                    },
                  })
                }
                placeholder="Select Specialization"
                isSearchable
              />
              <label className="block mb-1 font-semibold">Start Date</label>
              <div className="flex gap-2">
                <Select
                  options={monthOptions}
                  value={monthOptions.find((opt) => opt.value === startMonth) || null}
                  onChange={handleStartMonthChange}
                  placeholder="Month"
                  isSearchable
                />
                <Select
                  options={yearOptions}
                  value={yearOptions.find((opt) => opt.value === startYear) || null}
                  onChange={handleStartYearChange}
                  placeholder="Year"
                  isSearchable
                />
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!localProfessional.ownsBusinessOrService}
                onChange={(e) => handleOwnsBusinessChange(e.target.checked)}
              />
              <span>I also own a business/provide services</span>
            </label>
          </div>
          {localProfessional.ownsBusinessOrService && (
            <div className="mb-4 border p-4 rounded bg-gray-50">
            <label className="block mb-1 font-semibold">Business/Service Name</label>
            <input
              type="text"
              className="border w-full mb-2 p-2 rounded"
              placeholder="Business Name"
              value={(localProfessional.business || defaultBusiness).businessName}
              onChange={(e) =>
                setLocalProfessional({
                  ...localProfessional,
                  business: {
                    ...(localProfessional.business || defaultBusiness),
                    businessName: e.target.value,
                  },
                })
              }
            />
            <label className="block mb-1 font-semibold">Industry</label>
            <Select
              options={industryOptions}
              value={
                industryOptions.find(
                  (opt) =>
                    opt.value === (localProfessional.business?.industry || "")
                ) || null
              }
              onChange={(option) =>
                setLocalProfessional({
                  ...localProfessional,
                  business: {
                    ...(localProfessional.business || defaultBusiness),
                    industry: option ? option.value : "",
                  },
                })
              }
              placeholder="Select Industry"
              isSearchable
            />
            <label className="block mb-1 font-semibold">Additional Information</label>
            <input
              type="text"
              className="border w-full mb-2 p-2 rounded"
              placeholder="Additional Information"
              value={(localProfessional.business || defaultBusiness).additionalInformation}
              onChange={(e) =>
                setLocalProfessional({
                  ...localProfessional,
                  business: {
                    ...(localProfessional.business || defaultBusiness),
                    additionalInformation: e.target.value,
                  },
                })
              }
            />
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input
              type="text"
              className="border w-full mb-2 p-2 rounded"
              placeholder="Phone Number"
              value={(localProfessional.business || defaultBusiness).phoneNumber}
              onChange={(e) =>
                setLocalProfessional({
                  ...localProfessional,
                  business: {
                    ...(localProfessional.business || defaultBusiness),
                    phoneNumber: e.target.value,
                  },
                })
              }
            />
            <label className="block mb-1 font-semibold">Website</label>
            <input
              type="text"
              className="border w-full mb-2 p-2 rounded"
              placeholder="Website"
              value={(localProfessional.business || defaultBusiness).website}
              onChange={(e) =>
                setLocalProfessional({
                  ...localProfessional,
                  business: {
                    ...(localProfessional.business || defaultBusiness),
                    website: e.target.value,
                  },
                })
              }
            />
          </div>
          )}
        </>
      )}

      {employmentStatus === "BusinessOwner" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">Business/Service Name</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Business Name"
            value={(localProfessional.business || defaultBusiness).businessName}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                business: {
                  ...(localProfessional.business || defaultBusiness),
                  businessName: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Industry</label>
          <Select
            options={industryOptions}
            value={
              industryOptions.find(
                (opt) =>
                  opt.value === (localProfessional.business?.industry || "")
              ) || null
            }
            onChange={(option) =>
              setLocalProfessional({
                ...localProfessional,
                business: {
                  ...(localProfessional.business || defaultBusiness),
                  industry: option ? option.value : "",
                },
              })
            }
            placeholder="Select Industry"
            isSearchable
          />
          <label className="block mb-1 font-semibold">Additional Information</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Additional Information"
            value={(localProfessional.business || defaultBusiness).additionalInformation}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                business: {
                  ...(localProfessional.business || defaultBusiness),
                  additionalInformation: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Phone Number"
            value={(localProfessional.business || defaultBusiness).phoneNumber}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                business: {
                  ...(localProfessional.business || defaultBusiness),
                  phoneNumber: e.target.value,
                },
              })
            }
          />
          <label className="block mb-1 font-semibold">Industry</label>
          <label className="block mb-1 font-semibold">Website</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Website"
            value={(localProfessional.business || defaultBusiness).website}
            onChange={(e) =>
              setLocalProfessional({
                ...localProfessional,
                business: {
                  ...(localProfessional.business || defaultBusiness),
                  website: e.target.value,
                },
              })
            }
          />
        </div>
      )}

      {employmentStatus === "Student" && (
        <div className="mb-4 border p-4 rounded bg-gray-50">
          <label className="block mb-1 font-semibold">School/University Name</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="School/University"
            value={localProfessional.student?.schoolName || ""}
            onChange={(e) => {
              const current = localProfessional.student || { schoolName: "", fieldOfStudy: "", expectedGraduationYear: 0 };
              setLocalProfessional({
                ...localProfessional,
                student: { ...current, schoolName: e.target.value },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Field Of Study</label>
          <input
            type="text"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Field Of Study"
            value={localProfessional.student?.fieldOfStudy || ""}
            onChange={(e) => {
              const current = localProfessional.student || { schoolName: "", fieldOfStudy: "", expectedGraduationYear: 0 };
              setLocalProfessional({
                ...localProfessional,
                student: { ...current, fieldOfStudy: e.target.value },
              });
            }}
          />
          <label className="block mb-1 font-semibold">Expected Graduation Year</label>
          <input
            type="number"
            className="border w-full mb-2 p-2 rounded"
            placeholder="Graduation Year"
            value={localProfessional.student?.expectedGraduationYear || 0}
            onChange={(e) => {
              const current = localProfessional.student || { schoolName: "", fieldOfStudy: "", expectedGraduationYear: 0 };
              setLocalProfessional({
                ...localProfessional,
                student: { ...current, expectedGraduationYear: parseInt(e.target.value, 10) || 0 },
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
