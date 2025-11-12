import * as gameService from "../services/gameService.js";

export async function listGames(req, res) {
  try {
    const games = await gameService.listGames();
    res.status(200).json({ success: true, data: games });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getGame(req, res) {
  try {
    const game = await gameService.getGame(req.params.id);
    res.status(200).json({ success: true, data: game });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
}

export async function getGameByIdItad(req, res) {
  try {
    const game = await gameService.getGameByIdItad(req.params.id_itad);
    res.status(200).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function createGame(req, res) {
  try {
    const game = await gameService.createGame(req.body);
    res.status(201).json({ success: true, data: game });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateGame(req, res) {
  try {
    const game = await gameService.updateGame(req.params.id, req.body);
    res.status(200).json({ success: true, data: game });
  } catch (err) {
    const status = err.message.includes("não encontrado") ? 404 : 400;
    res.status(status).json({ success: false, error: err.message });
  }
}

export async function deleteGame(req, res) {
  try {
    const result = await gameService.deleteGame(req.params.id);
    res.status(200).json({
      success: true,
      message: "Jogo removido com sucesso.",
      data: result
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
}
