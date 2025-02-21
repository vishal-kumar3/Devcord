import ImageKit from "imagekit";
import { NextResponse } from "next/server";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function GET() {
  const authenticationParameters = imagekit.getAuthenticationParameters() ?? null;

  if (!authenticationParameters)
    return NextResponse.json({ error: "Failed to authenticate with ImageKit" });

  return NextResponse.json(authenticationParameters);
}
