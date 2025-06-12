import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "gizliAnahtar";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET);
    return NextResponse.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Geçersiz oturum" }, { status: 401 });
  }
}
