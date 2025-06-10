import { NextResponse } from "next/server";
import { addUser, findUserByEmail } from "../../lib/users";

export async function POST(req) {
  const { email, password, username, phone } = await req.json();

  if (!email || !password || !username || !phone) {
    return NextResponse.json({ error: "Tüm alanlar zorunlu" }, { status: 400 });
  }

  if (findUserByEmail(email)) {
    return NextResponse.json(
      { error: "Bu email zaten kayıtlı." },
      { status: 400 }
    );
  }

  addUser({ email, password, username, phone });

  return NextResponse.json({ message: "Kayıt başarılı" });
}
