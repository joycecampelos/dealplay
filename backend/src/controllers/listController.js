import * as listService from "../services/listService.js";

export async function listAllLists(req, res) {
  try {
    const lists = await listService.listAllLists(req.user);
    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getListsByGame(req, res) {
  try {
    const lists = await listService.getListsByGame(req.params.game_id);
    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getListByUserAndGame(req, res) {
  try {
    const lists = await listService.getListByUserAndGame(req.params.user_id, req.params.id_itad);
    res.status(200).json({ success: true, data: lists });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getListById(req, res) {
  try {
    const list = await listService.getListById(req.params.id, req.user);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    const status = err.message.includes("Acesso negado") ? 403 : 404;
    res.status(status).json({ success: false, error: err.message });
  }
}

export async function createList(req, res) {
  try {
    const list = await listService.createList(req.body, req.user);
    res.status(201).json({ success: true, data: list });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateList(req, res) {
  try {
    const list = await listService.updateList(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: list });
  } catch (err) {
    const status = err.message.includes("Acesso negado") ? 403 : 400;
    res.status(status).json({ success: false, error: err.message });
  }
}

export async function deleteList(req, res) {
  try {
    const deleted = await listService.deleteList(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: "Entrada removida com sucesso",
      data: deleted
    });
  } catch (err) {
    const status = err.message.includes("Acesso negado") ? 403 : 404;
    res.status(status).json({ success: false, error: err.message });
  }
}
