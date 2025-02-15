// hooks/useAppDispatch.ts
"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
