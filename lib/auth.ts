import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      // TODO: envoi email réel (Milestone 1 = placeholder)
      console.log(`[Better Auth] Reset password pour ${user.email}: ${url}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 jours — session persistante mobile
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 min
    },
  },
  plugins: [nextCookies()],
});
