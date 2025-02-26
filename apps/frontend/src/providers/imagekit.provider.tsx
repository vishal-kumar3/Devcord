"use client"
import { ImageKitProvider } from "imagekitio-next";

export const imagekitAuthenticator = async () => {
  const response = await fetch("/api/imagekit/auth").catch((e) => null)
  if (!response) {
    throw new Error("Authentication request failed")
  }

  if (!response.ok) {
    const errorText = await response?.text()
    throw new Error(`Request failed with status ${response?.status}. Error: ${errorText}`)
  }

  const data = await response.json()
  const { signature, expire, token } = data
  return { signature, expire, token }
}

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
