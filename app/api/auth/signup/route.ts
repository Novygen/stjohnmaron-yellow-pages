// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { signupSchema } from "@/lib/validators";
import { createMember } from "@/services/memberService";
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
    const { email, password, primary_phone_number } = parsed.data;

    // Create the member using our service
    const member = await createMember({ email, password, primary_phone_number });

    // Generate a JWT token for authentication
    const token = jwt.sign(
      { memberId: member._id, email },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      {
        message: "Member account created successfully",
        token,
        memberId: member._id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
