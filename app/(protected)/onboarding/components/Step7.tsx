import { useOnboarding } from "../hooks/useOnboarding";
import { useRouter } from "next/navigation";

const Step7 = () => {
  const { reset } = useOnboarding();
  const router = useRouter();

  const finish = () => {
    reset();
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-lg p-6 bg-white shadow-lg rounded-lg text-center">
      <h2 className="text-2xl font-bold">You&apos;re all set! 🎉</h2>
      <p className="mt-2">Your onboarding is complete.</p>
      <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md" onClick={finish}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default Step7;
