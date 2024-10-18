import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = ["/login", "/signup", "/verifyemail"].includes(path);

  // Retrieve token from cookies
  const token = request.cookies.get("token")?.value || "";

  // Redirect logged-in users from public paths to the home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect unauthenticated users from protected paths to the login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// Define paths to apply the middleware
export const config = {
  matcher: ["/", "/login", "/signup", "/verifyemail", "/profile"],
};
