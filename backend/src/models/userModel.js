import supabase from "../config/supabaseConfig.js";

const TABLE = "users";
const BASE_FIELDS = "id, username, email, name, role, created_at";

export async function getAllUsers() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar usuários.");
  }

  return data;
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar usuário por ID.");
  }

  return data;
}

export async function getUserWithPasswordById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`${BASE_FIELDS}, password`)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao buscar dados do usuário.");
  }

  return data;
}

export async function getUserByEmail(email) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar usuário por e-mail.");
  }

  return data;
}

export async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .eq("username", username)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar usuário por nome de usuário.");
  }

  return data;
}

export async function createUser(user) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(user)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar usuário.");
  }

  return data;
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar usuário.");
  }

  if (!data) {
    throw new Error("Usuário não encontrado para atualização.");
  }

  return data;
}

export async function deleteUser(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao excluir usuário.");
  }

  if (!data) {
    throw new Error("Usuário não encontrado para exclusão.");
  }

  return data;
}
