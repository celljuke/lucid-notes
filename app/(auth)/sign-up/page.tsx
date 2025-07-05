"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/modules/auth/components/auth-form";
import { signUpSchema } from "@/modules/auth/schema";
import { signInWithCredentials } from "@/lib/auth-actions";
import { Brain, Shield, Rocket, Users } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full opacity-15 blur-3xl"></div>

        {/* Floating note papers */}
        <div className="absolute top-16 left-16 w-14 h-18 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg opacity-40 transform -rotate-12 shadow-lg"></div>
        <div className="absolute bottom-40 right-16 w-18 h-22 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg opacity-40 transform rotate-6 shadow-lg"></div>
        <div className="absolute top-1/4 left-1/3 w-10 h-14 bg-gradient-to-br from-green-200 to-yellow-200 rounded-lg opacity-40 transform -rotate-30 shadow-lg"></div>
      </div>

      <div className="relative z-10 flex min-h-screen container mx-auto">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Join Lucid Today
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Start your journey with intelligent note-taking. Transform how
                you capture, organize, and connect your ideas.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    AI-Powered Intelligence
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Smart suggestions and automated organization
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-full">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Privacy First</h3>
                  <p className="text-gray-600 text-sm">
                    Your notes are secure and private by design
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Fast & Reliable
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Lightning-fast performance with cloud sync
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-2 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Growing Community
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Join thousands of productive note-takers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <AuthForm
              mode="signup"
              onSubmit={handleSignUp}
              isLoading={isLoading}
              error={error}
              schema={signUpSchema}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
