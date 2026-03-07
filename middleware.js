import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("auth-token")
  const isLoginPage = request.nextUrl.pathname === "/login"

  // If no token and not on login page → redirect to login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If has token and on login page → redirect to home
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

// Which routes to protect
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
}