import NextAuth, { type DefaultSession } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prismaBase from "@/lib/prisma-base"
import { authConfig, isGoogleAuthConfigured } from "./auth.config"

export { isGoogleAuthConfigured }

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prismaBase),
  // When using an adapter, session strategy defaults to "database", 
  // but we can still use JWT if preferred. 
  // For now, we'll let it use the adapter for full functionality in non-edge routes.
  session: { strategy: "database" }, 
  debug: process.env.NODE_ENV === 'development',
})
