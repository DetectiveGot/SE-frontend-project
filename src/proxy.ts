import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./lib/getUser";


export async function proxy(req:NextRequest) {
  const token = req.cookies.get("token")?.value;
  const user = await getUser();
  if(!token) return NextResponse.redirect(new URL('/login', req.url));

  const pathname = req.nextUrl.pathname;
  const rules = [
    { prefix: "/yourRestaurants", roles: ["owner"] },
  ];

  const match = rules.find((rule) => pathname.startsWith(rule.prefix));

  if (match && !match.roles.includes(user.role)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/api/reservations/:path*", "/reservations/:path*", "/yourRestaurants"],
};