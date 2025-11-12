import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createUser } from "../../services/userService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import UserFormLayout from "../../layouts/forms/UserFormLayout.jsx";

export default function UserCreate() {
  useRequireAdmin();

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await createUser(form);
      toast.success("Usuário criado com sucesso!");
      navigate("/users");
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao criar usuário.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserFormLayout
      form={form}
      setForm={setForm}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Criar usuário"
    />
  );
}
