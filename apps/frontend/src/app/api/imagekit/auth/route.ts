import { imagekit } from "@/lib/imagekit.config";
import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  const authenticationParameters = imagekit.getAuthenticationParameters() ?? null;

  if (!authenticationParameters)
    return NextResponse.json({ error: "Failed to authenticate with ImageKit" });

  return NextResponse.json(authenticationParameters);
}
