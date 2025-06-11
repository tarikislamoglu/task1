import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "gizliAnahtar";

export async function POST(request) {
  const { userId, password } = await request.json();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Token bulunamadı" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, SECRET);

    if (decoded.userId !== userId) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 401 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      decoded.hashedPassword
    );
    if (!isPasswordMatch) {
      return NextResponse.json({ error: "Şifre yanlış" }, { status: 401 });
    }

    return NextResponse.json({ success: true, userId: decoded.userId });
  } catch (error) {
    return NextResponse.json({ error: "Token geçersiz" }, { status: 401 });
  }
}
