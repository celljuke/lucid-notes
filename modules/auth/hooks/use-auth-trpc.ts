import { trpc } from "@/lib/trpc/client";
import { useCallback } from "react";

export const useAuthTrpc = () => {
  // Mutations
  const signUpMutation = trpc.auth.signUp.useMutation();

  // Helper functions
  const signUp = useCallback(
    async (data: { name: string; email: string; password: string }) => {
      try {
        const result = await signUpMutation.mutateAsync(data);
        return { success: true, data: result };
      } catch (error) {
        return {
          success: false,
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        };
      }
    },
    [signUpMutation]
  );

  const clearError = useCallback(() => {
    signUpMutation.reset();
  }, [signUpMutation]);

  return {
    // Loading states
    isSigningUp: signUpMutation.isPending,

    // Error states
    error: signUpMutation.error?.message || null,

    // Actions
    signUp,
    clearError,

    // Mutation utilities
    reset: signUpMutation.reset,
  };
};
