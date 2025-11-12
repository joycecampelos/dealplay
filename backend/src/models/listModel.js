import supabase from "../config/supabaseConfig.js";

const TABLE = "lists";
const BASE_FIELDS = "id, user_id, game_id, status, progress, rating, review, notes, created_at, updated_at";
const BASE_FIELDS_GET = `${BASE_FIELDS}, users ( id, name ), games ( id, title, slug, cover_url, id_itad )`;

export async function getAllLists() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS_GET)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar registros.");
  }

  return data;
}

export async function getListsByUser(user_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS_GET)
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar registros do usuário.");
  }

  return data;
}

export async function getListsByGame(game_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS_GET)
    .eq("game_id", game_id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar registros do jogo.");
  }

  return data;
}

export async function getListByUserAndGame(user_id, id_itad) {
  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("id_itad", id_itad)
    .single();

  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS_GET)
    .eq("user_id", user_id)
    .eq("game_id", game.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar registros do usuário para o jogo informado.");
  }

  return data;
}

export async function getListById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS_GET)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar registro por ID.");
  }

  return data;
}

export async function createList(list) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(list)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar registro.");
  }

  return data;
}

export async function updateList(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar registro.");
  }

  if (!data) {
    throw new Error("Registro não encontrado para atualização.");
  }

  return data;
}

export async function deleteList(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select(BASE_FIELDS)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao excluir registro.");
  }

  if (!data) {
    throw new Error("Registro não encontrado para exclusão.");
  }

  return data;
}
