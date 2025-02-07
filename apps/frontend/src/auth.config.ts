import { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";

const providers: Provider[] = [
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
    authorization: {
      params: {
        scope: "repo user admin:repo_hook admin:org gist notifications",
      },
    },
    // whatever you return will be passed as user
    profile(profile) {
      return {
        name: profile.name || profile.login,
        email: profile.email,
        avatar: profile.avatar_url,
        username: profile.login,
        bio: profile.bio,
      };
    },

  }),
];

export default {
  providers,
} satisfies NextAuthConfig;
