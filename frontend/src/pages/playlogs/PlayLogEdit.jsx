import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getPlayLogById, updatePlayLog } from "../../services/playLogService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import PlayLogFormLayout from "../../layouts/forms/PlayLogFormLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function PlayLogEdit() {
  useRequireAdmin();

  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    user_id: "",
    game_id: "",
    status: "quero jogar",
    progress: "",
    rating: "",
    review: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchPlayLog() {
    try {
      const data = await getPlayLogById(id);
      setForm({
        user_id: data.user_id || "",
        game_id: data.game_id || "",
        status: data.status || "quero jogar",
        progress: data.progress ?? "",
        rating: data.rating ?? "",
        review: data.review || "",
        notes: data.notes || "",
      });
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

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePlayLog(id, form);
      toast.success("PlayLog atualizado com sucesso!");
      navigate("/playlogs");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar PlayLog.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PlayLogFormLayout
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      loading={saving}
      submitLabel="Salvar alterações"
    />
  );
}
