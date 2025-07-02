"use client";

import { useSession } from "next-auth/react";
import { AuthUser, AuthState } from "../types";

export function useAuth(): AuthState {
  const { data: session, status } = useSession();

  const user: AuthUser | null = session?.user
    ? {
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name,
        image: session.user.image,
      }
    : null;

  return {
    user,
    isLoading: status === "loading",
    error: null, // NextAuth handles errors internally
  };
}
