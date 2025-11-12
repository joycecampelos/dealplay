import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

if (!JWT_SECRET) {
  throw new Error("Variável JWT_SECRET não definida!");
}

export {
  JWT_SECRET,
  JWT_EXPIRES_IN
}
