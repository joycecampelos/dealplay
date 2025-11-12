import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createGame } from "../../services/gameService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import GameFormLayout from "../../layouts/forms/GameFormLayout.jsx";

export default function GameCreate() {
  useRequireAdmin();

  const navigate = useNavigate();
  const [form, setForm] = useState({
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createGame(form);
      toast.success("Jogo adicionado com sucesso!");
      navigate("/games");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao adicionar jogo.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <GameFormLayout
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Adicionar jogo"
    />
  );
}
