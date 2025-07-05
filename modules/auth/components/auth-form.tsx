"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, PenTool } from "lucide-react";
import Link from "next/link";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  schema: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function AuthForm({
  mode,
  onSubmit,
  isLoading = false,
  error,
  schema,
}: AuthFormProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "signin"
        ? { email: "", password: "" }
        : { name: "", email: "", password: "", confirmPassword: "" },
  });

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      await onSubmit(data);
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>

      {/* Main paper stack */}
      <div className="relative">
        {/* Paper stack effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl transform rotate-2 opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl transform -rotate-1 opacity-40"></div>

        {/* Main form card */}
        <div className="relative bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-2xl border border-indigo-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Lucid
            </h1>

            <p className="text-gray-600 text-sm">
              {mode === "signin"
                ? "Sign in to access your intelligent notes"
                : "Create your account to unlock AI-powered note taking"}
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <PenTool className="h-4 w-4 text-purple-500" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your full name"
                            className="bg-white/80 border-purple-200 focus:border-purple-400 focus:ring-purple-400 rounded-xl h-12 px-4 text-gray-800 placeholder-gray-500"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full opacity-50"></div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"></div>
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter your email"
                          type="email"
                          className="bg-white/80 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-xl h-12 px-4 text-gray-800 placeholder-gray-500"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-yellow-500 rounded-full"></div>
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          className="bg-white/80 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl h-12 px-4 text-gray-800 placeholder-gray-500"
                          {...field}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="bg-white/80 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-xl h-12 px-4 text-gray-800 placeholder-gray-500"
                            {...field}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-pink-400 rounded-full opacity-50"></div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-700">
                    {error}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {mode === "signin" ? "Sign In to Lucid" : "Create My Account"}
              </Button>
            </form>
          </Form>

          {mode === "signup" && (
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">Already have an account?</p>
              <Link
                href="/sign-in"
                className="text-sm inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                Sign in to your account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {mode === "signin" && (
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm">
                Don&apos;t have an account?
              </p>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group text-sm"
              >
                Create an account
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          )}

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 left-4 opacity-20">
            <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-green-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
