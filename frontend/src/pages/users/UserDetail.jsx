import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getUserById } from "../../services/userService.js";
import { formatDateTime } from "../../utils/formatters.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";
import DetailLayout from "../../layouts/DetailLayout.jsx";

export default function UserDetail() {
  useRequireAdmin();

  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchUser() {
    try {
      const data = await getUserById(id);
      setUser(data);
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

  if (loading) {
    return <LoadingSpinner />;
  }

  const fields = [
    { label: "Nome", value: user.name, testid: "name" },
    { label: "E-mail", value: user.email, testid: "email" },
    { label: "Nome de usuário", value: user.username, testid: "username" },
    {
      label: "Função",
      value: user.role === "admin" ? "Administrador" : "Usuário comum",
      testid: "role"
    },
    {
      label: "Criado em",
      value: formatDateTime(user.created_at),
      testid: "created_at"
    },
  ];

  return (
    <DetailLayout
      title="Detalhes do usuário"
      fields={fields}
      editUrl={`/users/${user.id}/edit`}
      backUrl="/users"
    />
  );
}
