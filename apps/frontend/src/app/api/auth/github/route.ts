import { generateState } from "arctic";
import { github } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const state = generateState();
  const url = github.createAuthorizationURL(state, []);
  
  return NextResponse.json({
    redirect_url: url.toString(),
    github_state: state,
  });
}
