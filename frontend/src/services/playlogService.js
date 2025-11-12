import api from "./apiService.js";

export async function getPlayLogs() {
  const res = await api.get("/lists");
  return res.data.data;
}

export async function getPlayLogsByGame(game_id) {
  const res = await api.get(`/lists/game/${game_id}`);
  return res.data.data;
}

export async function getPlayLogsByUserAndGame(user_id, id_itad) {
  const res = await api.get(`/lists/user/${user_id}/game/${id_itad}`);
  return res.data.data;
}

export async function getPlayLogById(id) {
  const res = await api.get(`/lists/${id}`);
  return res.data.data;
}

export async function createPlayLog(data) {
  const res = await api.post("/lists", data);
  return res.data.data;
}

export async function updatePlayLog(id, data) {
  const res = await api.put(`/lists/${id}`, data);
  return res.data.data;
}

export async function deletePlayLog(id) {
  const res = await api.delete(`/lists/${id}`);
  return res.data;
}
