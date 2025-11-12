import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUsers, deleteUser } from "../../services/userService.js";
import useRequireAdmin from "../../hooks/useRequireAdmin.js";
import ListLayout from "../../layouts/ListLayout.jsx";
import ActionButtons from "../../components/lists/ActionButtons.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function UsersList() {
  useRequireAdmin();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao carregar os usuários.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) {
      return;
    }

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("Usuário excluído com sucesso!");
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Erro ao excluir usuário.";
      toast.error(msg);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const headers = [
    { label: "Nome", key: "name" },
    { label: "Email", key: "email" },
    { label: "Usuário", key: "username" },
    { label: "Função", key: "role", width: "w-42" },
    { label: "Ações", key: "actions", align: "text-center", width: "w-36" },
  ];

  const data = users.map((u) => ({
    name: u.name,
    email: u.email,
    username: u.username,
    role: u.role === "admin" ? "Administrador" : "Usuário comum",
    actions: (
      <ActionButtons
        onView={`/users/${u.id}`}
        onEdit={`/users/${u.id}/edit`}
        onDelete={() => handleDelete(u.id)}
      />
    ),
  }));

  return (
    <ListLayout
      title="Usuários"
      addButton={{ label: "Adicionar", to: "/users/new" }}
      headers={headers}
      data={data}
    />
  );
}
