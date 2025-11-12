import FormLayout from "../FormLayout.jsx";
import FormField from "../../components/forms/FormField.jsx";
import SelectField from "../../components/forms/SelectField.jsx";
import PasswordField from "../../components/forms/PasswordField.jsx";

export default function UserForm({
  form,
  setForm,
  onSubmit,
  loading,
  showPassword = true,
  submitLabel,
}) {
  return (
    <FormLayout
      title="Usuário"
      onSubmit={onSubmit}
      loading={loading}
      cancelUrl="/users"
      submitLabel={submitLabel}
    >
      <FormField
        label="Nome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required={true}
        testid="userform-name-input"
      />

      <FormField
        label="E-mail"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required={true}
        testid="userform-email-input"
      />

      <FormField
        label="Nome de usuário"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required={true}
        testid="userform-username-input"
      />

      {showPassword && (
        <PasswordField
          label="Senha"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          testid="userform-password-input"
        />
      )}

      <SelectField
        label="Função"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
        options={[
          { value: "user", label: "Usuário comum" },
          { value: "admin", label: "Administrador" },
        ]}
        testid="userform-role-select"
      />
    </FormLayout>
  );
}
