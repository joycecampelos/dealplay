import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getUserById, updateUser } from "../../services/userService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import UserFormLayout from "../../layouts/forms/UserFormLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function UserEdit() {
  useRequireAdmin();

  const navigate = useNavigate();
  const { id } = useParams();
  const { user: loggedUser, updateUserContext } = useContext(AuthContext);
  const [user, setUser] = useState({
    name: "",
    email: "",
    username: "",
    role: "user"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchUser() {
    try {
      const data = await getUserById(id);
      setUser({
        name: data.name || "",
        email: data.email || "",
        username: data.username || "",
        role: data.role || "user",
      });
    } catch (err) {
      const msg = err.response?.data?.error || "Usuário não encontrado.";
      toast.error(msg);
      navigate("/users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = await updateUser(id, user);

      if (loggedUser?.id === user.id || loggedUser?.id === Number(id)) {
        updateUserContext({ ...loggedUser, ...updates });
      }

      toast.success("Usuário atualizado com sucesso!");
      navigate("/users");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao atualizar usuário.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <UserFormLayout
      form={user}
      setForm={setUser}
      onSubmit={handleSubmit}
      loading={saving}
      showPassword={false}
      submitLabel="Salvar alterações"
    />
  );
}
