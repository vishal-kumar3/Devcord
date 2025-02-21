import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@devcord/node-prisma"
import authConfig from "./auth.config"
import { UserRole } from "@prisma/client"

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
    },
  },

  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub
        session.user.username = token.username as string
        session.user.github_token = token.github_token as string
        session.user.email = token.email as string
        session.user.role = token.role as UserRole
        session.userId = token.sub
        session.user.bio = token.bio as string
        session.user.avatar = token.avatar as string
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
      token.bio = user.bio;
      token.avatar = user.avatar;

      return token;
    },

    async signIn({ account, profile }) {
      if (account && profile) {
        const devcordUser = await prisma.user.upsert({
          where: {
            username: profile.login as string,
            email: profile.email as string,
          },
          update: {
            email: profile.email as string,
            github_token: account.access_token,
          },
          create: {
            email: profile.email as string,
            name: profile.name || profile.login as string,
            avatar: profile.avatar_url as string,
            username: profile.login as string,
            github_token: account.access_token,
            bio: profile.bio as string,
          },
        })

        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider as string,
              providerAccountId: account.providerAccountId as string,
            },
            userId: devcordUser.id,
          },
          update: {
            access_token: account.access_token as string,
            scope: account.scope as string,
          },
          create: {
            user: {
              connect: {
                id: devcordUser.id,
              }
            },
            type: account.type as string,
            provider: account.provider as string,
            providerAccountId: account.providerAccountId as string,
            access_token: account.access_token as string,
            token_type: account.token_type as string,
            scope: account.scope as string,
          },
        })

        return true
      }

      return false
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  ...authConfig,
})
