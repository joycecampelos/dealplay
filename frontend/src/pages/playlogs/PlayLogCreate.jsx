import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createPlayLog } from "../../services/playlogService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import PlayLogFormLayout from "../../layouts/forms/PlayLogFormLayout.jsx";

export default function PlayLogCreate() {
  useRequireAdmin();

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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createPlayLog(form);
      toast.success("PlayLog adicionado com sucesso!");
      navigate("/playlogs");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao adicionar PlayLog.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PlayLogFormLayout
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Adicionar registro"
    />
  );
}
