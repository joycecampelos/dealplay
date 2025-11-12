import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const BASE_URL = process.env.ITAD_BASE_URL;
const API_KEY = process.env.ITAD_API_KEY;

if (!BASE_URL || !API_KEY) {
  throw new Error("Variáveis ITAD_API_URL ou ITAD_API_KEY não definidas.");
}

export async function getPopularGames(offset = 0, limit = 9) {
  const url = `${BASE_URL}/stats/most-popular/v1`;

  try {
    const res = await axios.get(
      url,
      {
        params:
        {
          key: API_KEY,
          offset,
          limit
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar jogos populares: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro em getGamesPopular: ${err.message}`);

      throw new Error(`Erro ao buscar jogos populares: ${err.message}`);
    }
  }
}

export async function getBestDeals(offset = 0, limit = 20, sort = "-hot") {
  const url = `${BASE_URL}/deals/v2`;

  try {
    const res = await axios.get(
      url,
      {
        params:
        {
          key: API_KEY,
          country: "BR",
          offset,
          limit,
          sort
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar melhores ofertas: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro em getBestDeals: ${err.message}`);

      throw new Error(`Erro ao buscar melhores ofertas: ${err.message}`);
    }
  }
}

export async function getGamesByName(title, results = 20) {
  const url = `${BASE_URL}/games/search/v1`;

  try {
    const res = await axios.get(
      url,
      {
        params:
        {
          key: API_KEY,
          title,
          results
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar jogos pelo nome: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro em getGamesByName: ${err.message}`);

      throw new Error(`Erro ao buscar jogos pelo nome: ${err.message}`);
    }
  }
}

export async function getGameById(id) {
  const url = `${BASE_URL}/games/info/v2`;

  try {
    const res = await axios.get(
      url,
      {
        params:
        {
          key: API_KEY,
          id
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar informações do jogo: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro interno em getGameById: ${err.message}`);

      throw new Error(`Erro interno ao buscar informações do jogo: ${err.message}`);
    }
  }
}

export async function getSubscriptionsByGames(ids) {
  const url = `${BASE_URL}/games/subs/v1`;

  try {
    const res = await axios.post(
      url,
      [ids],
      {
        params:
        {
          key: API_KEY,
          country: "BR"
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar assinaturas de jogos: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro interno em getSubscriptionsByGames: ${err.message}`);

      throw new Error(`Erro interno ao buscar assinaturas de jogos: ${err.message}`);
    }
  }
}

export async function getPricesByGames(ids) {
  const url = `${BASE_URL}/games/prices/v3`;

  try {
    const res = await axios.post(
      url,
      [ids],
      {
        params:
        {
          key: API_KEY,
          country: "BR"
        }
      }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      console.error(`[ITAD] Erro HTTP ${err.response.status_code}: ${err.response.reason_phrase}`);

      throw new Error(`Falha ao buscar preços de jogos: ${err.response.reason_phrase}`);
    } else {
      console.error(`[ITAD] Erro em getPricesByGames: ${err.message}`);

      throw new Error(`Erro ao buscar preços de jogos: ${err.message}`);
    }
  }
}
