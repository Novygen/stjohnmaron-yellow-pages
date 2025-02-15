'use client';

import { motion, AnimatePresence } from "framer-motion";
import { useOnboarding } from "./hooks/useOnboarding";

import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";
import Step7 from "./components/Step7";
import withAuth from "@/hoc/withAuth";

function OnboardingPage() {
  const { step } = useOnboarding();


  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 />;
      case 2: return <Step2 />;
      case 3: return <Step3 />;
      case 4: return <Step4 />;
      case 5: return <Step5 />;
      case 6: return <Step6 />;
      case 7: return <Step7 />;
      default: return <Step1 />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDEBAR (like the previous wireframe) */}
      <aside className="w-1/4 bg-blue-500 text-white p-8 hidden md:block">
        <h2 className="text-2xl font-bold mb-6">Get started</h2>
        <ul className="space-y-4">
          <li className={step >= 1 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white bg-white mr-2" />
              <span>Basic Information</span>
            </div>
          </li>
          <li className={step >= 2 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Church Involvement</span>
            </div>
          </li>
          <li className={step >= 3 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Professional &amp; Business Info</span>
            </div>
          </li>
          <li className={step >= 4 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Social Presence</span>
            </div>
          </li>
          <li className={step >= 5 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Community Engagement</span>
            </div>
          </li>
          <li className={step >= 6 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Privacy &amp; Consent</span>
            </div>
          </li>
          <li className={step >= 7 ? "opacity-100" : "opacity-50"}>
            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full border-2 border-white mr-2" />
              <span>Success</span>
            </div>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default withAuth(OnboardingPage);