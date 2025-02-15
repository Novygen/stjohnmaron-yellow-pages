/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  step: number;
  data: Record<string, any>;
}

const initialState: OnboardingState = {
  step: 1,
  data: {},
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    nextStep: (state) => {
      if (state.step < 7) state.step += 1;
    },
    prevStep: (state) => {
      if (state.step > 1) state.step -= 1;
    },
    updateData: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.data[action.payload.key] = action.payload.value;
    },
    resetOnboarding: () => initialState,
  },
});

export const { nextStep, prevStep, updateData, resetOnboarding } = onboardingSlice.actions;
export default onboardingSlice.reducer;
