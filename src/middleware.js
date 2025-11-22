import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/register';

  const tokenCookie = request.cookies.get('mylogintoken')?.value || "";

  let userRole = null;
  try {
    if (tokenCookie) {
      const parsedCookie = JSON.parse(tokenCookie);
      userRole = parsedCookie.role;
    }
  } catch (error) {
    console.error("Failed to parse token cookie:", error);
  }

  if (isPublicPath && tokenCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isPublicPath && !tokenCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path === '/product' && userRole !== 'manager') {
    return NextResponse.redirect(new URL('/access-denied', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/product",
    "/dashboard",
    "/access-denied",
    "/profile",
    "/receipts",
    "/deliveries",
    "/transfers",
    "/adjustments",
    "/moves",
    "/settings",
    
  ],
};
