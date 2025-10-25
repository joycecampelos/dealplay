import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs/jwtConfig.js";

// Verifica se há token e se ele é válido
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // formato: Bearer <token>

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido ou expirado" });
    req.user = user;
    next();
  });
}

// Middleware para verificar se o usuário é admin
function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Acesso negado: requer papel de administrador" });
  }
  next();
}

export {
  authenticateToken,
  authorizeAdmin
}
