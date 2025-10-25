import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function UsersList() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert("Erro ao excluir usuário: " + (err.response?.data?.error || err.message));
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Usuários</h2>
      {user?.role === "admin" && (
        <Link to="/users/new" style={{ display: "inline-block", marginBottom: 10 }}>
          ➕ Novo Usuário
        </Link>
      )}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Nome de usuário</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>
                <Link to={`/users/${u.id}`}>🔍 Ver</Link>{" "}
                {user?.role === "admin" && (
                  <>
                    <Link to={`/users/${u.id}/edit`}>✏️ Editar</Link>{" "}
                    <button onClick={() => handleDelete(u.id)}>🗑️ Excluir</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersList;
