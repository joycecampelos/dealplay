import * as itadService from "../services/itadService.js";

export async function listBestDeals(req, res) {
  try {
    const deals = await itadService.listBestDeals(req.query.offset, req.query.limit, req.query.sort);
    res.status(200).json({ success: true, data: deals });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function listPopularGames(req, res) {
  try {
    const games = await itadService.listPopularGames(req.query.offset, req.query.limit);
    res.status(200).json({ success: true, data: games });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function searchGamesByName(req, res) {
  try {
    const games = await itadService.searchGamesByName(req.query.title, req.query.results);
    res.status(200).json({ success: true, data: games });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function getGameAllDetailsById(req, res) {
  try {
    const game = await itadService.getGameAllDetailsById(req.query.id, req.query.slug);
    res.status(200).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}
