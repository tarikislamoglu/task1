import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "gizliAnahtar";

export async function POST(request) {
  try {
    const { userId, password, email } = await request.json();
    const cookieStore = await cookies();

    // Mevcut kullanıcıları kontrol et
    const existingUserData = cookieStore.get("userData")?.value;
    if (existingUserData) {
      try {
        const decoded = jwt.verify(existingUserData, SECRET);
        if (decoded.userId === userId) {
          return NextResponse.json(
            { error: "Bu kullanıcı adı zaten kullanımda" },
            { status: 400 }
          );
        }
      } catch (error) {
        // Token geçersizse devam et
      }
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Kullanıcı bilgilerini içeren token oluştur
    const userToken = jwt.sign(
      {
        userId,
        email,
        hashedPassword,
      },
      SECRET,
      { expiresIn: "7d" }
    );

    // Oturum token'ı oluştur
    const sessionToken = jwt.sign(
      {
        userId,
        email,
      },
      SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      user: { userId, email },
    });

    // Kullanıcı bilgilerini cookie'ye kaydet
    response.cookies.set("userData", userToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 gün
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
    console.error("REGISTER API ERROR:", error);
    return NextResponse.json(
      { error: "Kayıt işlemi sırasında bir hata oluştu" },
      { status: 500 }
    );
  }
}
