import supabase from "../config/supabaseConfig.js";

const TABLE = "games";
const BASE_FIELDS = "id, title, slug, type, release_date, cover_url, description, platforms, genres, developers, publishers, tags, id_itad, id_igdb, created_at";

export async function getAllGames() {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Erro ao listar jogos.");
  }

  return data;
}

export async function getGameById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || "Erro ao buscar jogo por ID.");
  }

  return data;
}

export async function getGameByIdItad(id_itad) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(BASE_FIELDS)
    .eq("id_itad", id_itad);

  if (error) {
    throw new Error(error.message || "Erro ao buscar jogo por ID_ITAD.");
  }

  return data;
}

export async function createGame(game) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(game)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao criar jogo.");
  }

  return data;
}

export async function updateGame(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao atualizar jogo.");
  }

  if (!data) {
    throw new Error("Jogo não encontrado para atualização.");
  }

  return data;
}

export async function deleteGame(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id)
    .select(BASE_FIELDS)
    .single();

  if (error) {
    throw new Error(error.message || "Erro ao excluir jogo.");
  }

  if (!data) {
    throw new Error("Jogo não encontrado para exclusão.");
  }

  return data;
}
