"use client"
import { imagekitAuthenticator } from "@/lib/imagekit.config";
import { ImageKitProvider } from "imagekitio-next";


export default function ImagekitProvider({ children }) {
  const imagekitPublicKey = process.env.NEXT_PUBLIC_IMAGEKIT_KEY
  const imagekitUrlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!imagekitPublicKey || !imagekitUrlEndpoint) {
    throw new Error("Imagekit public key or url endpoint is missing")
  }

  return (
    <ImageKitProvider
      publicKey={imagekitPublicKey}
      urlEndpoint={imagekitUrlEndpoint}
      authenticator={imagekitAuthenticator}
    >
      {children}
    </ImageKitProvider>
  )
}
