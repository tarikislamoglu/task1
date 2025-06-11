import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "gizliAnahtar";

export function generateToken(data) {
  return jwt.sign(data, SECRET, { expiresIn: "7d" });
}
