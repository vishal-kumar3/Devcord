import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/session";
import { cookies } from "next/headers";

import type { OAuth2Tokens } from "arctic";
import { github } from "@/lib/auth";
import { createUser, getUserFromGithubId } from "@/actions/user.action";

export async function GET(request: Request): Promise<Response> {
  console.log("GET /api/auth/github/callback");
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return new Response(null, {
      status: 400
    });
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400
    });
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400
    });
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`
    }
  });
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  // TODO: Replace this with your own DB query.
  const existingUser = await getUserFromGithubId(githubUserId);

  if (existingUser !== null) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/"
      }
    });
  }

  // TODO: Replace this with your own DB query.
  const user = await createUser(githubUserId, githubUsername);

  if (user === null) {
    return new Response(null, {
      status: 500,
      statusText: "Internal Server Error"
    });
  }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/"
    }
  });
}
