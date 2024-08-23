import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const cookie = cookies();
  const token = cookie.get("ds");

  // If the user has a token and is trying to access the login page, redirect to the home page
  if (token && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user does not have a token and is trying to access the home page, redirect to the login page
  if (!token && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request to proceed as normal
  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/"],
};
