"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { signUpSchema } from "@/modules/auth/schema";
import { signInWithCredentials } from "@/lib/auth-actions";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (data: Record<string, string>) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong.");
        return;
      }

      // Sign in the user automatically after successful registration
      const signInResult = await signInWithCredentials(
        data.email,
        data.password
      );

      if (signInResult.error) {
        setError(
          "Account created but sign-in failed. Please sign in manually."
        );
        router.push("/sign-in");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-12">
      <div className="w-full max-w-md space-y-4">
        <AuthForm
          mode="signup"
          onSubmit={handleSignUp}
          isLoading={isLoading}
          error={error}
          schema={signUpSchema}
        />
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
