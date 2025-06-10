import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
  if (!SECRET) {
    throw new Error("JWT_SECRET env değişkeni eksik");
  }

  return jwt.sign({ email: user.email }, SECRET, { expiresIn: "1h" });
}

export function verifyToken(token) {
  if (!SECRET) {
    throw new Error("JWT_SECRET env değişkeni eksik");
  }

  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
