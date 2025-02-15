"use client";

import React from "react";

import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import onboardingReducer from "@/store/slices/onboardingSlice";
import userReducer from "@/store/slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    onboarding: onboardingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
