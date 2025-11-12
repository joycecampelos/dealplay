import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { validateRequiredFields, validatePassword } from "../utils/validationUtils.js";
import * as userModel from "../models/userModel.js";

dotenv.config();

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS);

export async function listUsers() {
  return await userModel.getAllUsers();
}

export async function getUser(id) {
  const user = await userModel.getUserById(id);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return user;
}

export async function createUser(payload, userRole) {
  validateRequiredFields(payload, ["username", "email", "password", "name"]);
  validatePassword(payload.password);

  const [existingEmail, existingUsername] = await Promise.all([
    userModel.getUserByEmail(payload.email),
    userModel.getUserByUsername(payload.username),
  ]);

  if (existingEmail) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  if (existingUsername) {
    throw new Error("Este nome de usuário já está em uso.");
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const role = userRole === "admin" ? (payload.role || "user") : "user";

  const newUser = {
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    name: payload.name,
    role
  };

  return await userModel.createUser(newUser);
}

export async function updateUser(id, updates, userRole) {
  const user = await userModel.getUserById(id);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (updates.email && updates.email !== user.email) {
    const existingEmail = await userModel.getUserByEmail(updates.email);
    if (existingEmail) {
      throw new Error("Este e-mail já está cadastrado.");
    }
  }

  if (updates.username && updates.username !== user.username) {
    const existingUsername = await userModel.getUserByUsername(updates.username);
    if (existingUsername) {
      throw new Error("Este nome de usuário já está em uso.");
    }
  }

  if (updates.currentPassword && updates.newPassword) {
    const userWithPassword = await userModel.getUserWithPasswordById(id);
    const valid = await bcrypt.compare(updates.currentPassword, userWithPassword.password);
    if (!valid) {
      throw new Error("Senha atual incorreta.");
    }

    validatePassword(updates.newPassword);
    updates.password = await bcrypt.hash(updates.newPassword, SALT_ROUNDS);
  }

  delete updates.currentPassword;
  delete updates.newPassword;

  if (updates.role && userRole !== "admin") {
    delete updates.role;
  }

  if (updates.role && !["user", "admin"].includes(updates.role)) {
    throw new Error("Valor de função inválido.");
  }

  return await userModel.updateUser(id, updates);
}

export async function deleteUser(id) {
  const user = await userModel.getUserById(id);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return await userModel.deleteUser(id);
}
