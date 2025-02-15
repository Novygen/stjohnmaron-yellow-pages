// components/onboarding/SuccessStep.tsx
"use client";

import { useRouter } from "next/navigation";

export default function SuccessStep() {
  const router = useRouter();
  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-4">You are successfully registered!</h2>
      <p className="mb-4">Thank you for completing the onboarding process.</p>
      <button
        className="bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => router.push("/dashboard")}
      >
        Let&apos;s Start
      </button>
    </div>
  );
}
