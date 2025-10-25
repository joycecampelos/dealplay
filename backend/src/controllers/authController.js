import login from "../services/authService.js";

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const userData = await login(email, password);
    res.json(userData);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export default loginUser;
