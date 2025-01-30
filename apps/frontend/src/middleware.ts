import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoutes } from "./routes";
import authConfig from "./auth.config";

const {auth} = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log("Route:- ", nextUrl.pathname)
  console.log("isLoggedIn:- ", isLoggedIn)


  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.some((route: string | RegExp) => {
    if (typeof route === 'string') {
      return route === nextUrl.pathname; // Exact match for static rorlrutes
    }
    if (route instanceof RegExp) {
      return route.test(nextUrl.pathname); // Pattern match for dynamic routes
    }
    return false;
  });
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if(isApiAuthRoute) return

  if(isAuthRoute){
    if(isLoggedIn){
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return
  }

  if(!isLoggedIn && !isPublicRoute){
    return NextResponse.redirect(new URL("/auth", nextUrl))
  }

  return ;
})

export const config = {
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}
