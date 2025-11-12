import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPlayLogById } from "../../services/playLogService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import { formatDateTime } from "../../utils/formatters.js";
import DetailLayout from "../../layouts/DetailLayout.jsx";

export default function PlayLogDetail() {
  useRequireAdmin();

  const { id } = useParams();
  const navigate = useNavigate();
  const [playLog, setPlayLog] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchPlayLog() {
    try {
      const data = await getPlayLogById(id);
      setPlayLog(data);
    } catch (err) {
      const msg = err.response?.data?.error || "Registro não encontrado.";
      toast.error(msg);
      navigate("/playlogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayLog();
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const statusOptions = {
    "quero jogar": "Quero jogar",
    "jogando": "Jogando",
    "finalizado": "Finalizado",
    "abandonado": "Abandonado",
  };

  const fields = [
    { label: "Usuário", value: playLog.users.name, testid: "user" },
    { label: "Atualizado em", value: playLog.updated_at ? formatDateTime(playLog.updated_at) : "—", testid: "updated_at" },
    { label: "Jogo", value: playLog.games.title, testid: "game" },
    { label: "Status", value: statusOptions[playLog.status], testid: "status" },
    { label: "Progresso", value: playLog.progress ? `${playLog.progress}%` : "—", testid: "progress" },
    { label: "Nota", value: playLog.rating ? `${playLog.rating}/5` : "—", testid: "rating" },
    { label: "Review", value: playLog.review || "—", testid: "review" },
    { label: "Notas pessoais", value: playLog.notes || "—", testid: "notes" }
  ];

  return (
    <DetailLayout
      title="Detalhes do PlayLog"
      fields={fields}
      editUrl={`/playlogs/${playLog.id}/edit`}
      backUrl="/playlogs"
    />
  );
}
