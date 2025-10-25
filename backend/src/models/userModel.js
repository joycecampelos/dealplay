import supabase from "../configs/supabaseConfig.js";

const TABLE = "users";

// Lista todos
async function getAllUsers() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, username, email, name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Busca por id
async function getUserById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, username, email, name, role, created_at")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Busca por e-mail
async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Busca por username
async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

// Cria novo usuário
async function createUser(user) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(user)
    .select("id, username, email, name, role, created_at")
    .single();

  if (error) throw error;
  return data;
}

// Atualiza usuário
async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select("id, username, email, name, role, created_at")
    .single();

  if (error) throw error;
  return data;
}

// Exclui usuário
async function deleteUser(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select("id, username, email, name, role, created_at")
    .single();

  if (error) throw error;
  return data;
}

export {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
}
