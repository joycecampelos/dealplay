import api from "./apiService.js";

export async function getPopularGames(offset = 0, limit = 9) {
  const res = await api.get(`/itad/games/popular?offset=${offset}&limit=${limit}`);
  return res.data.data;
}

export async function getBestDeals(offset = 0, limit = 10, sort = "-hot") {
  const res = await api.get(`/itad/deals/best?offset=${offset}&limit=${limit}&sort=${sort}`);
  return res.data.data?.list;
}

export async function searchGamesByName(title) {
  if (!title || title.trim().length === 0) {
    return [];
  }

  const res = await api.get(`/itad/games/search?title=${encodeURIComponent(title)}`);
  return res.data.data;
}

export async function getGameAllDetailsById(id, slug) {
  const res = await api.get(`/itad/games/details?id=${id}&slug=${slug}`);
  return res.data.data;
}
