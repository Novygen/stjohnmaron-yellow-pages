/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/auth.ts
import { auth } from "@/admin.firebase";
import { NextResponse } from "next/server";

export async function verifyToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Missing authorization header" }, { status: 401 });
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return NextResponse.json({ error: "Invalid authorization header" }, { status: 401 });
  }
  try {
    const decodedToken = await auth.verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return decodedToken;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
