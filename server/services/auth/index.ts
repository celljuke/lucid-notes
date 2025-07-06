import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import bcryptjs from "bcryptjs";
import type { SignUpInput, SignUpResponse } from "./schema";

export class AuthService {
  async signUp(input: SignUpInput): Promise<SignUpResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists.",
        });
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(input.password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      });

      return {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name!, // name is guaranteed to be present since we just created it
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Sign up error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong. Please try again.",
      });
    }
  }
}

export const authService = new AuthService();
