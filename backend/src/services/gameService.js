import { validateRequiredFields, validateReleaseDate } from "../utils/validationUtils.js";
import { normalizeFields } from "../utils/normalizationUtils.js";
import * as gameModel from "../models/gameModel.js";

export async function listGames() {
  return await gameModel.getAllGames();
}

export async function getGame(id) {
  const game = await gameModel.getGameById(id);

  if (!game) {
    throw new Error("Jogo não encontrado.");
  }

  return game;
}

export async function getGameByIdItad(id_itad) {
  const game = await gameModel.getGameByIdItad(id_itad);

  return game;
}

export async function createGame(payload) {
  validateRequiredFields(payload, ["title", "slug"]);
  validateReleaseDate(payload.release_date);

  const newGame = normalizeFields(payload);

  return await gameModel.createGame(newGame);
}

export async function updateGame(id, updates) {
  const game = await gameModel.getGameById(id);
  
  if (!game) {
    throw new Error("Jogo não encontrado.");
  }

  if (updates.release_date) {
    validateReleaseDate(updates.release_date);
  }

  const normalizedUpdates = normalizeFields(updates);

  return await gameModel.updateGame(id, normalizedUpdates);
}

export async function deleteGame(id) {
  const game = await gameModel.getGameById(id);

  if (!game) {
    throw new Error("Jogo não encontrado.");
  }

  return await gameModel.deleteGame(id);
}
