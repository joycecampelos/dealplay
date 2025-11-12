import { validateRequiredFields } from "../utils/validationUtils.js";
import { normalizeFields } from "../utils/normalizationUtils.js";
import * as listModel from "../models/listModel.js";
import * as gameModel from "../models/gameModel.js";
import * as userModel from "../models/userModel.js";

export async function listAllLists(loggedUser) {
  if (loggedUser.role === "admin") {
    return await listModel.getAllLists();
  }
  return await listModel.getListsByUser(loggedUser.id);
}

export async function getListsByGame(game_id) {
  return await listModel.getListsByGame(game_id);
}

export async function getListByUserAndGame(user_id, id_itad) {
  return await listModel.getListByUserAndGame(user_id, id_itad);
}

export async function getListById(id, loggedUser) {
  const list = await listModel.getListById(id);

  if (!list) {
    throw new Error("Entrada não encontrada.");
  }

  if (loggedUser.role !== "admin" && list.user_id !== loggedUser.id) {
    throw new Error("Acesso negado: você só pode visualizar suas próprias entradas.");
  }

  return list;
}

export async function createList(payload, loggedUser) {
  validateRequiredFields(payload, ["user_id", "game_id", "status"]);

  if (loggedUser.role !== "admin") {
    payload.user_id = loggedUser.id;
  }

  const userExists = await userModel.getUserById(payload.user_id);
  if (!userExists) {
    throw new Error("Usuário não encontrado.");
  }

  const gameExists = await gameModel.getGameById(payload.game_id);
  if (!gameExists) {
    throw new Error("Jogo não encontrado.");
  }

  const existingLists = await listModel.getListsByUser(payload.user_id);
  const duplicate = existingLists.find(item => item.game_id === payload.game_id);

  if (duplicate) {
    throw new Error("Este jogo já está na lista do usuário.");
  }

  const newList = normalizeFields(payload);

  return await listModel.createList(newList);
}

export async function updateList(id, updates, loggedUser) {
  const list = await listModel.getListById(id);

  if (!list) {
    throw new Error("Entrada não encontrada.");
  }

  if (loggedUser.role !== "admin" && list.user_id !== loggedUser.id) {
    throw new Error("Acesso negado: você só pode editar suas próprias entradas.");
  }

  const normalizedUpdates = normalizeFields(updates);

  return await listModel.updateList(id, normalizedUpdates);
}

export async function deleteList(id, loggedUser) {
  const list = await listModel.getListById(id);

  if (!list) {
    throw new Error("Entrada não encontrada.");
  }

  if (loggedUser.role !== "admin" && list.user_id !== loggedUser.id) {
    throw new Error("Acesso negado: você só pode excluir suas próprias entradas.");
  }

  return await listModel.deleteList(id);
}
