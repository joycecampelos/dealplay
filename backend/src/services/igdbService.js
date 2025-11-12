import * as igdbIntegration from "../integrations/igdbIntegration.js";
import { translateText } from "./deeplService.js";

let cachedToken = null;
let tokenExpiresAt = 0;

async function getValidToken() {
  const now = Date.now();

  if (cachedToken && now < tokenExpiresAt) {
    return cachedToken;
  }

  const authData = await igdbIntegration.authenticate();

  cachedToken = authData.access_token;
  tokenExpiresAt = now + authData.expires_in * 1000;

  return cachedToken;
}

export async function getGameDetailsBySlug(slug) {
  if (!slug) {
    throw new Error("Informe o slug do jogo para a busca.");
  }

  const token = await getValidToken();

  const game = await igdbIntegration.getGameBySlug(slug, token);
  if (!game || !game.length) {
    return null;
  }

  const genreIds = game[0]?.genres || [];
  const platformIds = game[0]?.platforms || [];

  const [genres, platforms, summaryTranslated] = await Promise.all([
    genreIds.length ? igdbIntegration.getGenresByIds(genreIds, token) : Promise.resolve([]),
    platformIds.length ? igdbIntegration.getPlatformsByIds(platformIds, token) : Promise.resolve([]),
    translateText(game[0]?.summary)
  ]);

  return {
    id_igdb: game[0]?.id || null,
    name_igdb: game[0]?.name || null,
    slug_igdb: game[0]?.slug || null,
    summary_igdb: game[0]?.summary || null,
    sumary_translated_igdb: summaryTranslated || null,
    genres_igdb: (genres || []).map(genre => genre.name),
    platforms_igdb: (platforms || []).map(platform => platform.name)
  }
}
