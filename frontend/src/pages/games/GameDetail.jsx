import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getGameById } from "../../services/gameService.js";
import { getPlayLogsByGame, deletePlayLog } from "../../services/playLogService.js";
import { formatDate, formatDateTime } from "../../utils/formatters.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import ActionButtons from "../../components/lists/ActionButtons.jsx";
import DetailLayout from "../../layouts/DetailLayout.jsx";
import ListLayout from "../../layouts/ListLayout.jsx";

export default function GameDetail() {
  useRequireAdmin();

  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playLogs, setPlayLogs] = useState([]);

  async function fetchData() {
    try {
      const [data, logs] = await Promise.all([
        getGameById(id),
        getPlayLogsByGame(id),
      ]);

      setGame(data);
      setPlayLogs(logs);
    } catch (err) {
      const msg = err.response?.data?.error || "Jogo não encontrado.";
      toast.error(msg);
      navigate("/games");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este registro do PlayLog?")) {
      return;
    }

    try {
      await deletePlayLog(id);
      setPlayLogs((prev) => prev.filter((p) => p.id !== id));
      toast.success("Registro excluído com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao excluir registro.";
      toast.error(msg);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  console.log(game);

  const fields = [
    { label: "Título", value: game.title, testid: "title" },
    { label: "Slug", value: game.slug, testid: "slug" },
    { label: "Categoria", value: game.type || "—", testid: "type" },
    { label: "Data de lançamento", value: formatDate(game.release_date) || "—", testid: "release-date" },
    { label: "Plataforma(s)", value: game.platforms.join(", ") || "—", testid: "platforms" },
    { label: "Gênero(s)", value: game.genres.join(", ") || "—", testid: "genres" },
    { label: "Desenvolvedor(es)", value: game.developers.join(", ") || "—", testid: "developers" },
    { label: "Publicador(es)", value: game.publishers.join(", ") || "—", testid: "publishers" },
    { label: "URL da capa", value: game.cover_url || "—", testid: "cover-url" },
    { label: "Tags", value: game.tags.join(", ") || "—", testid: "tags" },
    { label: "Identificador ITAD", value: game.id_itad || "—", testid: "id-itad" },
    { label: "Identificador IGDB", value: game.id_igdb || "—", testid: "id-igdb" },
    { label: "Descrição", value: game.description || "Nenhuma descrição informada.", testid: "description" },
    { label: "Criado em", value: formatDateTime(game.created_at), testid: "created-at" },
  ];

  const headers = [
    { label: "Usuário", key: "user_name" },
    { label: "Status", key: "status" },
    { label: "Progresso (%)", key: "progress", align: "text-center", width: "w-28" },
    { label: "Nota", key: "rating", align: "text-center", width: "w-20" },
    { label: "Atualizado em", key: "updated_at", align: "text-center", width: "w-40" },
    { label: "Ações", key: "actions", align: "text-center", width: "w-36" },
  ];

  const statusOptions = {
    "quero jogar": "Quero jogar",
    "jogando": "Jogando",
    "finalizado": "Finalizado",
    "abandonado": "Abandonado",
  };

  const data = playLogs.map((log) => ({
    user_name: log.users.name,
    status: statusOptions[log.status],
    progress: log.progress ? `${log.progress}%` : "—",
    rating: log.rating ? `${log.rating}/5` : "—",
    updated_at: new Date(log.updated_at).toLocaleDateString("pt-BR"),
    actions: (
      <ActionButtons
        onView={`/playlogs/${log.id}`}
        onEdit={`/playlogs/${log.id}/edit`}
        onDelete={() => handleDelete(log.id)}
      />
    ),
  }));

  return (
    <div>
      <DetailLayout
        title="Detalhes do jogo"
        fields={fields}
        editUrl={`/games/${game.id}/edit`}
        backUrl="/games"
        imageUrl={game.cover_url}
      />

      <ListLayout
        title="PlayLogs recentes"
        addButton={{ label: "Adicionar", to: "/playlogs/new" }}
        headers={headers}
        data={data}
      />
    </div>
  );
}
