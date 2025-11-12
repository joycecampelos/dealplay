import { login, loginWithSupabase } from "../services/authService.js";

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const userData = await login(email, password);

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
}

export async function loginUserWithSupabase(req, res) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "").trim();
    const userData = await loginWithSupabase(token);

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
}
