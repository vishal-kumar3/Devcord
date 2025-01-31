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
      console.log("Account:- ", account)
      if (account?.access_token) {
        const updatedUser = await prisma.user.upsert({
          where: { id: user.id },
          create: {
            email: user.email || profile?.email as string,
            name: user.name || profile?.login as string,
            username: user.name || profile?.login as string,
            github_token: account.access_token,
            image: user.image || profile?.avatar_url as string,
            bio: profile?.bio as string,
          },
          update: { github_token: account.access_token },
        }).catch((e) => {
          console.error("Error updating user:- ", e)
        })
      }
      return true;
    }

  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  ...authConfig,
})
