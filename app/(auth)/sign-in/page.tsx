"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AuthForm } from "@/modules/auth/components/auth-form";
import { signInSchema } from "@/modules/auth/schema";
import { Lightbulb, Zap, Star } from "lucide-react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async (data: Record<string, string>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-15 blur-3xl"></div>

        {/* Floating note papers */}
        <div className="absolute top-10 right-10 w-16 h-20 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg opacity-40 transform rotate-12 shadow-lg"></div>
        <div className="absolute bottom-32 left-10 w-20 h-24 bg-gradient-to-br from-green-200 to-blue-200 rounded-lg opacity-40 transform -rotate-6 shadow-lg"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg opacity-40 transform rotate-45 shadow-lg"></div>
      </div>

      <div className="relative z-10 flex min-h-screen container mx-auto">
        {/* Left side - Welcome content */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Welcome to Lucid
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Your intelligent companion for note-taking, powered by AI to
                help you capture, organize, and discover insights.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Smart Organization
                  </h3>
                  <p className="text-gray-600 text-sm">
                    AI automatically categorizes and tags your notes
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Instant Insights
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Generate summaries and expand ideas effortlessly
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-500 to-yellow-500 p-2 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Beautiful Interface
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Elegant design that makes note-taking a joy
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
              mode="signin"
              onSubmit={handleSignIn}
              isLoading={isLoading}
              error={error}
              schema={signInSchema}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
