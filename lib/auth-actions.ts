"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { signUpSchema, signInSchema } from "@/modules/auth/schema";
import bcryptjs from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const validatedFields = signInSchema.parse({ email, password });

    await signIn("credentials", {
      email: validatedFields.email,
      password: validatedFields.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }

  redirect("/");
}

export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  try {
    const validatedFields = signUpSchema.parse({
      name,
      email,
      password,
      confirmPassword,
    });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists." };
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(validatedFields.password, 12);

    // Create user
    await prisma.user.create({
      data: {
        name: validatedFields.name,
        email: validatedFields.email,
        password: hashedPassword,
      },
    });

    // Sign in the user automatically
    await signIn("credentials", {
      email: validatedFields.email,
      password: validatedFields.password,
      redirect: false,
    });
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function signInWithCredentials(email: string, password: string) {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid credentials." };
    }

    return { success: true };
  } catch {
    return { error: "Something went wrong." };
  }
}
