import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "Token não fornecido." });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: "Token inválido ou expirado." });
  }
}

export function optionalAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    console.warn("Token inválido!");
  }
  next();
}

export function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res
      .status(403)
      .json({
        success: false,
        error: "Acesso negado. Apenas administradores podem acessar este recurso."
      });
  }
  next();
}
