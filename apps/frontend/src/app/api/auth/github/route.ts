import { generateState } from "arctic";
import { cookies } from "next/headers";
import { github } from "@/lib/auth";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET() {
  console.log("GET /api/auth/github");
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);

  return NextResponse.json({
    redirect_url: url.toString(),
    github_state: state,
  });
}
