import bcrypt from "bcrypt";
import * as userModel from "../models/userModel.js";

const SALT_ROUNDS = 10; // número de iterações para o hash

// Valida campos obrigatórios
function validateRequiredFields(user) {
  const required = ["username", "email", "password", "name"];
  const missing = required.filter(field => !user[field]);

  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios ausentes: ${missing.join(", ")}`);
  }
}

// Função para validar força da senha
function validatePassword(password) {
  if (!password) {
    throw new Error("A senha é obrigatória.");
  }

  // Exemplo: pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 símbolo
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  if (password.length < minLength) {
    throw new Error(`A senha deve ter no mínimo ${minLength} caracteres.`);
  }

  if (!hasUppercase || !hasNumber || !hasSymbol) {
    throw new Error("A senha deve conter pelo menos uma letra maiúscula, um número e um símbolo.");
  }
}

// Cria usuário
async function createUser(payload, userRole) {
  validateRequiredFields(payload);
  validatePassword(payload.password);

  // Checa duplicidade de email
  const existingEmail = await userModel.getUserByEmail(payload.email);
  if (existingEmail) {
    throw new Error("Este e-mail já está cadastrado.");
  }

  // Checa duplicidade de username
  const existingUsername = await userModel.getUserByUsername(payload.username);
  if (existingUsername) {
    throw new Error("Este nome de usuário já está em uso.");
  }

  // Criptografa senha antes de salvar
  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);

  const role = userRole === 'admin' ? (payload.role || 'user') : 'user';

  const userToSave = {
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    name: payload.name,
    role
  };

  return await userModel.createUser(userToSave);
}

// Atualiza usuário
async function updateUser(id, updates, userRole) {
  // Busca o usuário atual
  const user = await userModel.getUserById(id);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  // Se email for alterado, verificar duplicidade
  if (updates.email && updates.email !== user.email) {
    const existingEmail = await userModel.getUserByEmail(updates.email);
    if (existingEmail) {
      throw new Error("Este e-mail já está cadastrado.");
    }
  }

  // Se username for alterado, verificar duplicidade
  if (updates.username && updates.username !== user.username) {
    const existingUsername = await userModel.getUserByUsername(updates.username);
    if (existingUsername) {
      throw new Error("Este nome de usuário já está em uso.");
    }
  }

  // Se senha for alterada, criptografar novamente
  if (updates.password) {
    validatePassword(updates.password);
    updates.password = await bcrypt.hash(updates.password, SALT_ROUNDS);
  }

  // Só admin pode alterar o campo "role"
  if (updates.role && userRole !== 'admin') {
    delete updates.role;
  }

  if (updates.role && !['user', 'admin'].includes(updates.role)) {
    throw new Error('Valor de função inválido.');
  }

  return await userModel.updateUser(id, updates);
}

// Demais operações simples
async function listUsers() {
  return await userModel.getAllUsers();
}

async function getUser(id) {
  const user = await userModel.getUserById(id);
  if (!user) throw new Error("Usuário não encontrado.");
  return user;
}

async function deleteUser(id) {
  const user = await userModel.getUserById(id);
  if (!user) throw new Error("Usuário não encontrado.");
  return await userModel.deleteUser(id);
}

export {
  createUser,
  updateUser,
  listUsers,
  getUser,
  deleteUser
}
