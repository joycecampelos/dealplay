import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const URL_AUTH = process.env.IGDB_BASE_URL_AUTH;
const URL_API = process.env.IGDB_BASE_URL_API
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

if (!URL_AUTH || !URL_API || !CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Variáveis IGDB_BASE_URL_AUTH, IGDB_BASE_URL_API, IGDB_CLIENT_ID ou IGDB_CLIENT_SECRET não definidas.");
}

export async function authenticate() {
  try {
    const res = await axios.post(
      URL_AUTH,
      null,
      {
        params:
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: "client_credentials"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error(`[IGDB] Erro na autenticação: ${err.response.message}`);

    throw new Error(`Erro na autenticação IGDB: ${err.response.message}`);
  }
}

export async function getGameBySlug(slug, token) {
  const url = `${URL_API}/games`;

  try {
    const res = await axios.post(
      url,
      `fields genres,name,platforms,slug,summary; where slug = "${slug}";`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`[IGDB] Erro em getGameBySlug: ${err.response.message}`);

    throw new Error(`Erro ao buscar jogo pelo slug: ${err.response.message}`);
  }
}

export async function getGenresByIds(ids, token) {
  const url = `${URL_API}/genres`;

  try {
    const res = await axios.post(
      url,
      `fields name; where id = (${ids.join(",")});`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`[IGDB] Erro em getGenresByIds: ${err.response.message}`);

    throw new Error(`Erro ao buscar gêneros pelos IDs: ${err.response.message}`);
  }
}

export async function getPlatformsByIds(ids, token) {
  const url = `${URL_API}/platforms`;

  try {
    const res = await axios.post(
      url,
      `fields name; where id = (${ids.join(",")});`,
      {
        headers: {
          "Client-ID": CLIENT_ID,
          Authorization: `Bearer ${token}`
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error(`[IGDB] Erro em getPlatformsByIds: ${err.response.message}`);

    throw new Error(`Erro ao buscar plataformas pelos IDs: ${err.response.message}`);
  }
}
