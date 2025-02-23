// app/(protected)/onboarding/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import withAuth from "@/hoc/withAuth";
import { MembershipRequestProvider } from "./context/MembershipRequestContext";

function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();

  async function handleFinish() {
    router.push("/dashboard");
  }

  function renderStep() {
    switch (currentStep) {
      case 1:
        return <Step1 next={() => setCurrentStep(2)} />;
      case 2:
        return <Step2 next={() => setCurrentStep(3)} back={() => setCurrentStep(1)} />;
      case 3:
        return <Step3 next={() => setCurrentStep(4)} back={() => setCurrentStep(2)} />;
      case 4:
        return <Step4 next={() => setCurrentStep(5)} back={() => setCurrentStep(3)} />;
      case 5:
        return <Step5 finish={handleFinish} back={() => setCurrentStep(4)} />;
      default:
        return <Step1 next={() => setCurrentStep(2)} />;
    }
  }

  return (
    <MembershipRequestProvider>
      <div className="min-h-screen flex flex-col md:flex-row">
        <aside className="w-full md:w-1/4 bg-blue-500 text-white p-6">
          <h2 className="text-2xl font-bold mb-6">Onboarding Steps</h2>
          <ul className="space-y-4">
            <li className={currentStep >= 1 ? "opacity-100" : "opacity-50"}>1. Basic Information</li>
            <li className={currentStep >= 2 ? "opacity-100" : "opacity-50"}>2. Professional Info</li>
            <li className={currentStep >= 3 ? "opacity-100" : "opacity-50"}>3. Social Presence</li>
            <li className={currentStep >= 4 ? "opacity-100" : "opacity-50"}>4. Privacy & Consent</li>
            <li className={currentStep >= 5 ? "opacity-100" : "opacity-50"}>5. Success</li>
          </ul>
        </aside>
        <main className="flex-1 p-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </MembershipRequestProvider>
  );
}

export default withAuth(OnboardingPage);
