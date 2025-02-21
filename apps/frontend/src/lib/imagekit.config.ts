

export const imagekitAuthenticator = async () => {

  const response = await fetch("/api/imagekit/auth").catch((e) => null)

  if (!response) {
    throw new Error("Authentication request failed")
  }

  if(!response.ok){
    const errorText = await response?.text()
    throw new Error(`Request failed with status ${response?.status}. Error: ${errorText}`)
  }

  const data = await response.json()
  const { signature, expire, token } = data
  return { signature, expire, token }
}
