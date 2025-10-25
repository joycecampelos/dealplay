import * as userService from "../services/userService.js";

async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body, req.user?.role || 'user');
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateUser(req, res) {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user.role);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const result = await userService.deleteUser(req.params.id);
    res.json({ message: "Usuário removido com sucesso", user: result });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
}
