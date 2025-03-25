"use client";

import React, { useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import onboardingReducer from "@/store/slices/onboardingSlice";
import userReducer, { rehydrateUser } from "@/store/slices/userSlice";
import adminReducer, { rehydrateAdmin } from "@/store/slices/adminSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["uid", "email", "displayName", "phoneNumber", "isAuthenticated"], // Only persist these fields
};

const adminPersistConfig = {
  key: "admin",
  storage,
  whitelist: ["token", "email", "isAuthenticated"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedAdminReducer = persistReducer(adminPersistConfig, adminReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: persistedAdminReducer,
    onboarding: onboardingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

function PersistenceManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate user data
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        dispatch(rehydrateUser(parsedUser));
      } catch (error) {
        console.error("Error parsing saved user data:", error);
      }
    }

    // Rehydrate admin data
    const savedAdmin = localStorage.getItem("admin");
    if (savedAdmin) {
      try {
        const parsedAdmin = JSON.parse(savedAdmin);
        dispatch(rehydrateAdmin(parsedAdmin));
      } catch (error) {
        console.error("Error parsing saved admin data:", error);
        // Clear invalid admin data
        localStorage.removeItem("admin");
      }
    }
  }, [dispatch]);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PersistenceManager />
        {children}
      </PersistGate>
    </Provider>
  );
}
