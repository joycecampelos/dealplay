import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getPlayLogs, deletePlayLog } from "../../services/playlogService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import ListLayout from "../../layouts/ListLayout.jsx";
import ActionButtons from "../../components/lists/ActionButtons.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function PlayLogsList() {
  useRequireAdmin();

  const [playLogs, setPlayLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPlayLogs() {
    try {
      const data = await getPlayLogs();
      setPlayLogs(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao carregar o PlayLog.";
      toast.error(msg);
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
    loadPlayLogs();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const headers = [
    { label: "Usuário", key: "user_name" },
    { label: "Jogo", key: "game_title" },
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
    game_title: log.games.title,
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
    <ListLayout
      title="PlayLogs"
      addButton={{ label: "Adicionar", to: "/playlogs/new" }}
      headers={headers}
      data={data}
    />
  );
}
