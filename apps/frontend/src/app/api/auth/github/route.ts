import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "@/lib/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(): Promise<Response> {
  console.log("GET /api/auth/github");
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);
  console.log(url.toString());

  const cookieStore = await cookies();
  cookieStore.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  });

  return redirect(url.toString());
  // return NextResponse.redirect(url.toString());
}
