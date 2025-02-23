// lib/validators.ts
import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  primary_phone_number: z.string().min(5),
});
