import api from "./apiService.js";

export async function getGames() {
  const res = await api.get("/games");
  return res.data.data;
}

export async function getGameById(id) {
  const res = await api.get(`/games/${id}`);
  return res.data.data;
}

export async function getGameByIdItad(id_itad) {
  const res = await api.get(`/games/itad/${id_itad}`);
  return res.data.data;
}

export async function createGame(data) {
  const res = await api.post("/games", data);
  return res.data.data;
}

export async function updateGame(id, data) {
  const res = await api.put(`/games/${id}`, data);
  return res.data.data;
}

export async function deleteGame(id) {
  const res = await api.delete(`/games/${id}`);
  return res.data;
}
