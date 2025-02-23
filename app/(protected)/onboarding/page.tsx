// app/(protected)/onboarding/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import useOnboarding from "./hooks/useOnboarding";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import Step7 from "./components/Step7";
import withAuth from "@/hoc/withAuth";

function OnboardingPage() {
  const {
    currentStep,
    loading,
    checkOnboardingComplete,
  } = useOnboarding();
  const router = useRouter();

  // Called on Step 7 (Finish)
  async function handleFinish() {
    const isComplete = await checkOnboardingComplete();
    if (!isComplete) {
      // Alert is shown inside checkOnboardingComplete
      return;
    }
    // Redirect to Dashboard if onboarding is complete
    router.push("/dashboard");
  }

  // Render the current step. While loading, show a loader.
  function renderStep() {
    if (loading) {
      return (
        <div className="text-center p-4">
          <p className="text-blue-600">Loading (mock delay)...</p>
        </div>
      );
    }
    switch (currentStep) {
      case 1:
        return <Step1 key="step1" />;
      case 2:
        return <Step2 key="step2" />;
      case 3:
        return <Step3 key="step3" />;
      case 4:
        return <Step4 key="step4" />;
      case 5:
        return <Step5 key="step5" />;
      case 6:
        return <Step6 key="step6" />;
      case 7:
        return <Step7 key="step7" onFinish={handleFinish} />;
      default:
        return <Step1 key="step1" />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 bg-blue-500 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Onboarding Steps</h2>
        <ul className="space-y-4">
          <li className={currentStep >= 1 ? "opacity-100" : "opacity-50"}>
            1. Basic Information
          </li>
          <li className={currentStep >= 2 ? "opacity-100" : "opacity-50"}>
            2. Church Involvement
          </li>
          <li className={currentStep >= 3 ? "opacity-100" : "opacity-50"}>
            3. Professional &amp; Business Info
          </li>
          <li className={currentStep >= 4 ? "opacity-100" : "opacity-50"}>
            4. Social Presence
          </li>
          <li className={currentStep >= 5 ? "opacity-100" : "opacity-50"}>
            5. Community Engagement
          </li>
          <li className={currentStep >= 6 ? "opacity-100" : "opacity-50"}>
            6. Privacy &amp; Consent
          </li>
          <li className={currentStep >= 7 ? "opacity-100" : "opacity-50"}>
            7. Success
          </li>
        </ul>
      </aside>
      {/* Main Content */}
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
  );
}

export default withAuth(OnboardingPage);
