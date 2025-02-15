/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { nextStep, prevStep, updateData, resetOnboarding } from "@/store/slices/onboardingSlice";

export const useOnboarding = () => {
  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.onboarding.step);
  const data = useSelector((state: RootState) => state.onboarding.data);

  const goNext = () => dispatch(nextStep());
  const goBack = () => dispatch(prevStep());
  const updateField = (key: string, value: any) => dispatch(updateData({ key, value }));
  const reset = () => dispatch(resetOnboarding());

  return { step, data, goNext, goBack, updateField, reset };
};
