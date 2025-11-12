import * as itadIntegration from "../integrations/itadIntegration.js";
import { getGameDetailsBySlug } from "./igdbService.js";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listBestDeals(offset, limit, sort) {
  return await itadIntegration.getBestDeals(offset, limit, sort);
}

export async function listPopularGames(offset, limit) {
  const games = await itadIntegration.getPopularGames(offset, limit);

  const result = [];
  const BATCH_SIZE = 3;

  for (let i = 0; i < games.length; i += BATCH_SIZE) {
    const batch = games.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (game) => {
        try {
          const details = await itadIntegration.getGameById(game.id);

          return {
            position: game.position,
            id: game.id,
            slug: game.slug,
            title: game.title,
            assets: details.assets || {},
            tags: details.tags || [],
            releaseDate: details.releaseDate || null,
          };
        } catch (err) {
          console.warn(`[ITAD] Falha ao buscar detalhes de ${game.title}:`, err.message);
          return null;
        }
      })
    );
    result.push(...batchResults.filter(Boolean));
    await sleep(1000);
  }
  return result;
}

export async function searchGamesByName(title, results) {
  if (!title) {
    throw new Error("Informe o nome do jogo para a busca.");
  }

  return await itadIntegration.getGamesByName(title, results);
}

export async function getGameAllDetailsById(id, slug) {
  if (!id) {
    throw new Error("Informe o ID do jogo para a busca.");
  }

  const [details, subscriptions, prices, igdb] = await Promise.all([
    itadIntegration.getGameById(id),
    itadIntegration.getSubscriptionsByGames(id),
    itadIntegration.getPricesByGames(id),
    getGameDetailsBySlug(slug)
  ]);

  return {
    details,
    subscriptions,
    prices,
    igdb
  }
}
