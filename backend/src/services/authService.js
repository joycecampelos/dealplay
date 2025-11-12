import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userModel from "../models/userModel.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwtConfig.js";
import supabase from "../config/supabaseConfig.js";

export async function login(email, password) {
  if (!email) {
    throw new Error("O campo e-mail é obrigatório.");
  }

  if (!password) {
    throw new Error("O campo senha é obrigatório.");
  }

  const userEmail = await userModel.getUserByEmail(email);
  if (!userEmail) {
    throw new Error("Usuário não encontrado.");
  }

  const user = await userModel.getUserWithPasswordById(userEmail.id);
  const senhaValida = await bcrypt.compare(password, user.password);
  if (!senhaValida) {
    throw new Error("Senha incorreta.");
  }

  const jwtToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    token: jwtToken,
  };
}

export async function loginWithSupabase(token) {
  if (!token) {
    throw new Error("Token de autenticação ausente.");
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user) {
    throw new Error("Token Supabase inválido.");
  }

  const email = data.user.email;
  const user = await userModel.getUserByEmail(email);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const jwtToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    token: jwtToken,
  };
}
