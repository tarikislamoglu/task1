import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "gizliAnahtar";

export async function POST(request) {
  try {
    const { userId, password } = await request.json();
    const cookieStore = cookies();

    // Kullanıcı bilgilerini cookie'den al
    const userData = cookieStore.get("userData")?.value;
    if (!userData) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 401 }
      );
    }

    // Token'ı doğrula ve kullanıcı bilgilerini al
    const decoded = jwt.verify(userData, SECRET);

    // Kullanıcı adı kontrolü
    if (decoded.userId !== userId) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(
      password,
      decoded.hashedPassword
    );
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Şifre hatalı" }, { status: 401 });
    }

    // Oturum token'ı oluştur
    const sessionToken = jwt.sign(
      {
        userId: decoded.userId,
        email: decoded.email,
      },
      SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
      },
    });

    // Oturum token'ını cookie'ye kaydet
    response.cookies.set("token", sessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
    });

    return response;
  } catch (error) {
    console.error("LOGIN API ERROR:", error);
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Geçersiz oturum, lütfen tekrar giriş yapın" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Giriş işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
