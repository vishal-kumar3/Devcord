import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  //  NOTE: This is a very basic session implementation that only uses a cookie to store the session token.  You may need to implement a more complex session implementation depending on your application's requirements. For example, you may need to use a database to store session data.  You may also need to use a cache to store session data.  You may also need to use a distributed cache to store session data.  You may also need to use a key-value store to store session data.  You may also need to use a distributed key-value store to store session data.  You may also need to use a key-value store with a cache to store session data.  You may also need to use a distributed key-value store with a cache to store session data.  You may also need to use a key-value store with a cache and a database to store session data.  You may also need to use a distributed key-value store with a cache and a database to store session data.
  if (request.method === "GET") {
    console.log("GET request");
    const response = NextResponse.next();
    const token = request.cookies.get("session")?.value ?? null;
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });
    }
    return response;
  }
  console.log("POST request");

  // NOTE: This is a very basic CORS implementation that only checks if the `Origin` header matches the `Host` header.  You may need to implement a more complex CORS policy depending on your application's requirements. For example, you may need to check the `Access-Control-Request-Method` and `Access-Control-Request-Headers` headers to implement preflight requests. You may also need to implement a more complex `Origin` header check to allow multiple origins.  You may also need to implement a more complex `Host` header check to allow multiple hosts.  You may also need to implement a more complex `Access-Control-Allow-Origin` header to allow multiple origins.  You may also need to implement a more complex `Access-Control-Allow-Credentials` header to allow credentials.  You may also need to implement a more complex `Access-Control-Allow-Methods` header to allow multiple methods.  You may also need to implement a more complex `Access-Control-Allow-Headers` header to allow multiple headers.
  const originHeader = request.headers.get("Origin");
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get("Host");
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403
    });
  }
  return NextResponse.next();
}
