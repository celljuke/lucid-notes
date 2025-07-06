import { auth } from "@/auth";

export const createContext = async () => {
  return { auth: await auth() };
};

export type Context = Awaited<ReturnType<typeof createContext>>;
