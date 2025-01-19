"use server"
import { generateSessionToken, createSession, setSessionTokenCookie } from "@/lib/session";
import { cookies } from "next/headers";
import type { OAuth2Tokens } from "arctic";
import { github } from "@/lib/auth";
import { createUser, getUserFromGithubId } from "@/actions/user.action";
import { NextResponse } from "next/server";
import { AuthResponseMsg } from "@/types/auth.type";


export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;
  if (code === null || state === null || storedState === null) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(AuthResponseMsg.InvalidRequest)}`, request.url));
  }
  if (state !== storedState) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(AuthResponseMsg.InvalidRequest)}`, request.url));
  }

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code)
  } catch (e) {
    // Invalid code or client credentials
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(AuthResponseMsg.InvalidClientCredentials)}`, request.url));
  }
  const githubUserResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`
    }
  });
  const githubUser = await githubUserResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  const existingUser = await getUserFromGithubId(githubUserId);

  if (existingUser !== null) {
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, existingUser.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);
    return NextResponse.redirect(new URL("/p", request.url));
  }

  const user = await createUser(githubUserId, githubUsername);

  if (user === null) {
    return NextResponse.redirect(new URL(`/auth?error=${encodeURIComponent(AuthResponseMsg.InternalServerError)}`, request.url));
  }

  const sessionToken = await generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);
  return NextResponse.redirect(new URL("/p", request.url));
}
