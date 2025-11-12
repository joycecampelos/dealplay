import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getGameById, updateGame } from "../../services/gameService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import GameFormLayout from "../../layouts/forms/GameFormLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function GameEdit() {
  useRequireAdmin();

  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState({
    title: "",
    slug: "",
    type: "",
    release_date: "",
    platforms: [],
    genres: [],
    developers: [],
    publishers: [],
    cover_url: "",
    tags: [],
    id_itad: "",
    id_igdb: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchGame() {
    try {
      const data = await getGameById(id);
      setGame({
        title: data.title || "",
        slug: data.slug || "",
        type: data.type || "",
        release_date: data.release_date || "",
        platforms: data.platforms || [],
        genres: data.genres || [],
        developers: data.developers || [],
        publishers: data.publishers || [],
        cover_url: data.cover_url || "",
        tags: data.tags || [],
        id_itad: data.id_itad || "",
        id_igdb: data.id_igdb || "",
        description: data.description || ""
      });
    } catch (err) {
      const msg = err.response?.data?.error || "Jogo não encontrado.";
      toast.error(msg);
      navigate("/games");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGame();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await updateGame(id, game);

      toast.success("Jogo atualizado com sucesso!");
      navigate("/games");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar jogo.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <GameFormLayout
      form={game}
      setForm={setGame}
      onSubmit={handleSubmit}
      loading={saving}
      submitLabel="Salvar alterações"
    />
  );
}
