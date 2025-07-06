import { z } from "zod";

// Input schema for signup (without confirmPassword since it's client-side validation)
export const signUpInputSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

// Response schema for signup
export const signUpResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.date(),
  }),
});

// Response types
export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type SignUpResponse = z.infer<typeof signUpResponseSchema>;
