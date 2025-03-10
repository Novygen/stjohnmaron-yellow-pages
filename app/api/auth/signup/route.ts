/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import dbConnect from '@/lib/dbConnect';
import { signupSchema } from "@/lib/validators";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Validate input using Zod
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }
    const { email } = parsed.data;

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { memberId: email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        message: "Member account created successfully",
        token,
        memberId: email,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
