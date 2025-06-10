import { NextResponse } from "next/server";
import { generateToken } from "../../lib/auth";
import { findUserByEmail } from "../../lib/users";

export async function POST(request) {
  const { email, password, userName, phoneNumber } = await request.json();

  const user = findUserByEmail(email);

  if (!user || user.password !== password) {
    return NextResponse.json(
      { error: "Geçersiz kullanıcı adı veya şifre" },
      { status: 401 }
    );
  }

  const token = generateToken(user);

  return NextResponse.json({ token });
}
