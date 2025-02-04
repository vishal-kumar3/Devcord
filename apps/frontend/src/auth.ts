import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@devcord/node-prisma"
import authConfig from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth",
    error: "/auth",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.username = token.username as string
        session.user.github_token = token.github_token as string
        session.user.email = token.email as string
        session.user.role = token.role
        session.userId = token.sub
      }
      return session
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
      });

      if (!user) return token;
      token.name = user.name;
      token.email = user.email;
      token.username = user.username;
      token.github_token = user.github_token;
      token.role = user.role;

      return token;
    },

    async signIn({ user, account, profile, email, credentials }) {
      if (account?.access_token && user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            github_token: account.access_token,
            bio: profile?.bio as string,
          },
        }).catch((e) => {
          console.error("Error updating user:- ", e.stack)
        })
      }
      return true;
    }

  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  ...authConfig,
})
