import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { updateUser } from "../../services/userService.js";
import FormLayout from "../../layouts/FormLayout.jsx";
import FormField from "../../components/forms/FormField.jsx";
import PasswordField from "../../components/forms/PasswordField.jsx";

export default function ProfileEdit() {
  const { user, updateUserContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("As senhas novas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const updates = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
      };

      if (formData.newPassword) {
        updates.currentPassword = formData.currentPassword;
        updates.newPassword = formData.newPassword;
      }

      const data = await updateUser(user.id, updates);

      updateUserContext({ ...user, ...data });

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      toast.success("Perfil atualizado com sucesso!");
      navigate("/profile");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar perfil.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout
      title="Meu Perfil"
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Salvar alterações"
      cancelUrl="/profile"
    >
      <FormField
        label="Nome"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required={true}
      />

      <FormField
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required={true}
      />

      <FormField
        label="Nome de usuário"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required={true}
      />

      <div className="col-span-2 border-t border-gray-200 my-4" />

      <h4 className="col-span-2 text-gray-700 font-medium">
        Alterar senha (opcional)
      </h4>

      <PasswordField
        label="Senha atual"
        value={formData.currentPassword}
        onChange={(e) =>
          setFormData({ ...formData, currentPassword: e.target.value })
        }
        required={false}
        placeholder="Digite sua senha atual"
      />

      <PasswordField
        label="Nova senha"
        value={formData.newPassword}
        onChange={(e) =>
          setFormData({ ...formData, newPassword: e.target.value })
        }
        required={false}
        placeholder="Digite a nova senha"
      />

      <PasswordField
        label="Confirmar nova senha"
        value={formData.confirmPassword}
        onChange={(e) =>
          setFormData({ ...formData, confirmPassword: e.target.value })
        }
        required={false}
        placeholder="Confirme a nova senha"
      />
    </FormLayout>
  );
}
