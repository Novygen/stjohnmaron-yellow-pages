// app/(protected)/onboarding/components/Step2.tsx
"use client";

import { useEffect, useState } from "react";
import useOnboarding from "../hooks/useOnboarding";

export default function Step2() {
  const { currentStep, loading, step2Data, setStep2Data, loadStep, saveStep } = useOnboarding();
  
  // Local states for new items
  const [newMinistry, setNewMinistry] = useState("");
  const [newVolunteerRole, setNewVolunteerRole] = useState("");

  // For now, we mock available ministries and volunteer roles.
  const availableMinistries = ["Choir", "Youth Ministry", "Teaching", "Worship Team"];
  const availableVolunteerRoles = ["Usher", "Tech Support", "Administrative", "Community Outreach"];

  useEffect(() => {
    if (currentStep === 2) {
      loadStep(2);
    }
  }, [currentStep, loadStep]);

  // Handler to add a ministry from either the dropdown or free text.
  function handleAddMinistry() {
    if (!newMinistry.trim()) return;
    // Only add if not already present.
    if (!step2Data.churchMembership.ministries_involved.includes(newMinistry.trim())) {
      setStep2Data({
        ...step2Data,
        churchMembership: {
          ...step2Data.churchMembership,
          ministries_involved: [
            ...step2Data.churchMembership.ministries_involved,
            newMinistry.trim(),
          ],
        },
      });
    }
    setNewMinistry("");
  }

  function handleRemoveMinistry(index: number) {
    const updated = [...step2Data.churchMembership.ministries_involved];
    updated.splice(index, 1);
    setStep2Data({
      ...step2Data,
      churchMembership: {
        ...step2Data.churchMembership,
        ministries_involved: updated,
      },
    });
  }

  // Handler to add a volunteer role.
  function handleAddVolunteerRole() {
    if (!newVolunteerRole.trim()) return;
    if (!step2Data.churchMembership.volunteer_roles.includes(newVolunteerRole.trim())) {
      setStep2Data({
        ...step2Data,
        churchMembership: {
          ...step2Data.churchMembership,
          volunteer_roles: [
            ...step2Data.churchMembership.volunteer_roles,
            newVolunteerRole.trim(),
          ],
        },
      });
    }
    setNewVolunteerRole("");
  }

  function handleRemoveVolunteerRole(index: number) {
    const updated = [...step2Data.churchMembership.volunteer_roles];
    updated.splice(index, 1);
    setStep2Data({
      ...step2Data,
      churchMembership: {
        ...step2Data.churchMembership,
        volunteer_roles: updated,
      },
    });
  }

  function handleNext() {
    saveStep(2, true);
  }

  function handleBack() {
    saveStep(2, false);
  }

  return (
    <div className="bg-white p-6 rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Step 2: Church Involvement & Volunteer Interests</h2>
      {loading && <p className="text-blue-600 mb-4">Saving/Loading data...</p>}

      {/* Church Membership */}
      <label className="block mb-1 font-semibold">Are you a registered church member?</label>
      <select
        className="border w-full p-2 rounded mb-4"
        value={step2Data.churchMembership.is_registered_member ? "yes" : "no"}
        onChange={(e) =>
          setStep2Data({
            ...step2Data,
            churchMembership: {
              ...step2Data.churchMembership,
              is_registered_member: e.target.value === "yes",
            },
          })
        }
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      <label className="block mb-1 font-semibold">How long have you been attending?</label>
      <input
        type="text"
        placeholder="e.g. 2 years"
        className="border w-full p-2 rounded mb-4"
        value={step2Data.churchMembership.attending_duration}
        onChange={(e) =>
          setStep2Data({
            ...step2Data,
            churchMembership: {
              ...step2Data.churchMembership,
              attending_duration: e.target.value,
            },
          })
        }
      />

      <label className="block mb-1 font-semibold">Attending Frequency</label>
      <input
        type="text"
        placeholder="e.g. Weekly"
        className="border w-full p-2 rounded mb-4"
        value={step2Data.churchMembership.attending_frequency}
        onChange={(e) =>
          setStep2Data({
            ...step2Data,
            churchMembership: {
              ...step2Data.churchMembership,
              attending_frequency: e.target.value,
            },
          })
        }
      />

      {/* Ministries Involved */}
      <label className="block mb-1 font-semibold">Ministries Involved</label>
      <div className="flex gap-2 mb-2">
        <select
          className="border p-2 rounded flex-1"
          value={newMinistry}
          onChange={(e) => setNewMinistry(e.target.value)}
        >
          <option value="">Select a ministry</option>
          {availableMinistries.map((ministry, idx) => (
            <option key={idx} value={ministry}>
              {ministry}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddMinistry}
          className="bg-gray-300 px-3 py-2 rounded"
        >
          Add
        </button>
      </div>
      {step2Data.churchMembership.ministries_involved.length > 0 && (
        <ul className="mb-4">
          {step2Data.churchMembership.ministries_involved.map((m, idx) => (
            <li key={idx} className="flex justify-between items-center text-sm">
              <span>{m}</span>
              <button onClick={() => handleRemoveMinistry(idx)} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <label className="block mb-1 font-semibold">Do you want to volunteer?</label>
      <select
        className="border w-full p-2 rounded mb-4"
        value={step2Data.churchMembership.wants_to_volunteer ? "yes" : "no"}
        onChange={(e) =>
          setStep2Data({
            ...step2Data,
            churchMembership: {
              ...step2Data.churchMembership,
              wants_to_volunteer: e.target.value === "yes",
            },
          })
        }
      >
        <option value="no">No</option>
        <option value="yes">Yes</option>
      </select>

      {/* Volunteer Roles */}
      <label className="block mb-1 font-semibold">Volunteer Roles</label>
      <div className="flex gap-2 mb-2">
        <select
          className="border p-2 rounded flex-1"
          value={newVolunteerRole}
          onChange={(e) => setNewVolunteerRole(e.target.value)}
        >
          <option value="">Select a role</option>
          {availableVolunteerRoles.map((role, idx) => (
            <option key={idx} value={role}>
              {role}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddVolunteerRole}
          className="bg-gray-300 px-3 py-2 rounded"
        >
          Add
        </button>
      </div>
      {step2Data.churchMembership.volunteer_roles.length > 0 && (
        <ul className="mb-4">
          {step2Data.churchMembership.volunteer_roles.map((role, idx) => (
            <li key={idx} className="flex justify-between items-center text-sm">
              <span>{role}</span>
              <button onClick={() => handleRemoveVolunteerRole(idx)} className="text-red-500">
                Remove
              </button>
            </li>
          ))}
        </ul>
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
