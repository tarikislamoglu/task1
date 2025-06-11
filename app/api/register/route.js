import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { userId, password } = await request.json();

  const SECRET = process.env.JWT_SECRET;
  const hashedPassword = await bcrypt.hash(password, 10);
  const token = jwt.sign({ userId, hashedPassword }, SECRET, {
    expiresIn: "7d",
  });
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
