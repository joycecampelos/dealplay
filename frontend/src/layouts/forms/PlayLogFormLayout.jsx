import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "../../services/userService.js";
import { getGames } from "../../services/gameService.js";
import FormLayout from "../FormLayout.jsx";
import FormField from "../../components/forms/FormField.jsx";
import SelectField from "../../components/forms/SelectField.jsx";
import SelectSearchField from "../../components/forms/SelectSearchField.jsx";
import TextareaField from "../../components/forms/TextareaField.jsx";

export default function PlayLogFormLayout({
  form,
  setForm,
  onSubmit,
  loading,
  submitLabel,
}) {
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [usersData, gamesData] = await Promise.all([
          getUsers(),
          getGames(),
        ]);
        setUsers(usersData);
        setGames(gamesData);
      } catch (err) {
        toast.error("Erro ao carregar opções de usuários e jogos.");
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchOptions();
  }, []);

  return (
    <FormLayout
      title="PlayLog"
      onSubmit={onSubmit}
      loading={loading || loadingOptions}
      cancelUrl="/playlogs"
      submitLabel={submitLabel}
    >

      <SelectSearchField
        label="Usuário"
        value={form.user_id}
        onChange={(e) => setForm({ ...form, user_id: e.target.value })}
        options={
          users.map((u) => ({ value: u.id, label: u.name }))
        }
        isLoading={loadingOptions}
        required={true}
      />

      <SelectSearchField
        label="Jogo"
        value={form.game_id}
        onChange={(e) => setForm({ ...form, game_id: e.target.value })}
        options={games.map((g) => ({ value: g.id, label: g.title }))}
        isLoading={loadingOptions}
        required={true}
      />

      <SelectField
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
        options={[
          { value: "quero jogar", label: "Quero jogar" },
          { value: "jogando", label: "Jogando" },
          { value: "finalizado", label: "Finalizado" },
          { value: "abandonado", label: "Abandonado" },
        ]}
        required={true}
        testid="playlogform-status-select"
      />

      <FormField
        label="Progresso (%)"
        type="number"
        value={form.progress}
        onChange={(e) => setForm({ ...form, progress: e.target.value })}
        placeholder="0 a 100"
        testid="playlogform-progress-input"
      />

      <FormField
        label="Nota (1 a 5)"
        type="number"
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: e.target.value })}
        placeholder="Ex: 4"
        testid="playlogform-rating-input"
      />

      <TextareaField
        label="Review"
        value={form.review}
        onChange={(e) => setForm({ ...form, review: e.target.value })}
        placeholder="Escreva sua opinião sobre o jogo..."
        testid="playlogform-review-textarea"
      />

      <TextareaField
        label="Notas pessoais"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
        placeholder="Observações pessoais, detalhes adicionais..."
        rows={2}
        testid="playlogform-notes-textarea"
      />
    </FormLayout>
  );
}
