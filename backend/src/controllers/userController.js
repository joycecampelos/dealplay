import * as userService from "../services/userService.js";

export async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getUser(req, res) {
  try {
    const user = await userService.getUser(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body, req.user?.role || "user");
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.role);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    const status = err.message.includes("não encontrado") ? 404 : 400;
    res.status(status).json({ success: false, error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: "Usuário removido com sucesso.",
      data: result
    });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
}
