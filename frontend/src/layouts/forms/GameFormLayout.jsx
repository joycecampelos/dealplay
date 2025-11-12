import FormLayout from "../FormLayout.jsx";
import FormField from "../../components/forms/FormField.jsx";
import TextareaField from "../../components/forms/TextareaField.jsx";
import TagInputField from "../../components/forms/TagInputField.jsx";

export default function GameFormLayout({
  form,
  setForm,
  onSubmit,
  loading,
  submitLabel,
}) {
  return (
    <FormLayout
      title="Jogo"
      onSubmit={onSubmit}
      loading={loading}
      cancelUrl="/games"
      submitLabel={submitLabel}
    >

      <FormField
        label="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required={true}
        testid="gameform-title-input"
      />

      <FormField
        label="Slug"
        value={form.slug}
        onChange={(e) => setForm({ ...form, slug: e.target.value })}
        required={true}
        testid="gameform-slug-input"
      />

      <FormField
        label="Categoria"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
        placeholder="Game, DLC, Expansão..."
        testid="gameform-type-input"
      />

      <FormField
        label="Data de lançamento"
        type="date"
        value={form.release_date}
        onChange={(e) => setForm({ ...form, release_date: e.target.value })}
        testid="gameform-release-date-input"
      />

      <TagInputField
        label="Plataforma(s)"
        values={form.platforms || []}
        onChange={(val) => setForm({ ...form, platforms: val })}
        testid="gameform-platforms-input"
      />

      <TagInputField
        label="Gênero(s)"
        values={form.genres || []}
        onChange={(val) => setForm({ ...form, genres: val })}
        testid="gameform-genres-input"
      />

      <TagInputField
        label="Desenvolvedor(es)"
        values={form.developers || []}
        onChange={(val) => setForm({ ...form, developers: val })}
        testid="gameform-developers-input"
      />

      <TagInputField
        label="Publicador(es)"
        values={form.publishers || []}
        onChange={(val) => setForm({ ...form, publishers: val })}
        testid="gameform-publishers-input"
      />

      <FormField
        label="URL da capa"
        type="url"
        value={form.cover_url}
        onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
        placeholder="https://..."
        testid="gameform-cover-url-input"
      />

      <TagInputField
        label="Tags"
        values={form.tags || []}
        onChange={(val) => setForm({ ...form, tags: val })}
        testid="gameform-tags-input"
      />

      <FormField
        label="Identificador ITAD"
        value={form.id_itad}
        onChange={(e) => setForm({ ...form, id_itad: e.target.value })}
        testid="gameform-id-itad-input"
      />

      <FormField
        label="Identificador IGDB"
        value={form.id_igdb}
        onChange={(e) => setForm({ ...form, id_igdb: e.target.value })}
        testid="gameform-id-igdb-input"
      />

      <TextareaField
        label="Descrição"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Breve descrição do jogo..."
        testid="gameform-description-input"
      />
    </FormLayout>
  );
}
