import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getGames, deleteGame } from "../../services/gameService.js";
import { formatDate } from "../../utils/formatters.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import ListLayout from "../../layouts/ListLayout.jsx";
import ActionButtons from "../../components/lists/ActionButtons.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function GamesList() {
  useRequireAdmin();

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadGames() {
    try {
      const data = await getGames();
      setGames(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao carregar os jogos.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este jogo?")) {
      return;
    }

    try {
      await deleteGame(id);
      setGames((prev) => prev.filter((g) => g.id !== id));
      toast.success("Jogo excluído com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao excluir jogo.";
      toast.error(msg);
    }
  }

  useEffect(() => {
    loadGames();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const headers = [
    { label: "Título", key: "title" },
    { label: "Gênero(s)", key: "genres" },
    { label: "Plataforma(s)", key: "platforms" },
    { label: "Lançamento", key: "release_data" },
    { label: "Desenvolvedora(s)", key: "developers" },
    { label: "Ações", key: "actions", align: "text-center", width: "w-36" },
  ];

  const data = games.map((g) => ({
    title: g.title,
    genres: g.genres.join(", ") || "—",
    platforms: g.platforms.join(", ") || "—",
    release_data: formatDate(g.release_date) || "—",
    developers: g.developers.join(", ") || "—",
    actions: (
      <ActionButtons
        onView={`/games/${g.id}`}
        onEdit={`/games/${g.id}/edit`}
        onDelete={() => handleDelete(g.id)}
      />
    ),
  }));

  return (
    <ListLayout
      title="Jogos"
      addButton={{ label: "Adicionar", to: "/games/new" }}
      headers={headers}
      data={data}
    />
  );
}
