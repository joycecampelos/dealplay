import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userModel from "../models/userModel.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../configs/jwtConfig.js";

// Função simples de validação de senha no login
function validateLoginPassword(password) {
  if (!password) {
    throw new Error("O campo senha é obrigatório.");
  }

  if (password.length < 8) {
    throw new Error("A senha deve ter no mínimo 8 caracteres.");
  }
}

// Login de usuário
async function login(email, password) {
  if (!email) {
    throw new Error("O campo email é obrigatório.");
  }

  // Valida estrutura básica da senha antes de consultar o banco
  validateLoginPassword(password);

  // Verifica se existe o usuário
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  // Compara senha informada com hash salvo
  const senhaValida = await bcrypt.compare(password, user.password);
  if (!senhaValida) {
    throw new Error("Senha incorreta");
  }

  // Gera token JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Retorna dados básicos + token
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    token
  };
}

export default login;
