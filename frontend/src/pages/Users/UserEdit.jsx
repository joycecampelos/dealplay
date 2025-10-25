import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api.js";
import { AuthContext } from "../../contexts/AuthContext.jsx";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: loggedUser } = useContext(AuthContext); // 👈 usuário logado
  const [user, setUser] = useState({ name: "", email: "", username: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => {
        const data = res.data || {};
        setUser((prev) => ({
          ...prev,
          ...data,
          role: data.role ?? prev.role
        }));
      })
      .catch((err) => setError(err.response?.data?.error || "Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const updates = { 
        name: user.name, 
        email: user.email, 
        username: user.username 
      };

      // Só envia o campo "role" se o logado for admin
      if (loggedUser?.role === "admin") {
        updates.role = user.role;
      }

      await api.put(`/users/${id}`, updates);
      alert("Usuário atualizado com sucesso!");
      navigate("/users");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao atualizar usuário");
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h2>Editar Usuário</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          Nome:
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          E-mail:
          <input
            type="email"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          Nome de usuário:
          <input
            type="text"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        {/* 👇 Campo visível só para administradores */}
        {loggedUser?.role === "admin" && (
          <label>
            Função:
            <select
              value={user.role || "user"}
              onChange={(e) => setUser({ ...user, role: e.target.value })}
              style={{ width: "100%", padding: "8px", marginTop: "4px" }}
            >
              <option value="user">Usuário comum</option>
              <option value="admin">Administrador</option>
            </select>
          </label>
        )}

        <button
          type="submit"
          style={{
            backgroundColor: "#2b6cb0",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px"
          }}
        >
          Salvar Alterações
        </button>
      </form>

      <Link to="/users" style={{ display: "inline-block", marginTop: 16 }}>
        ⬅️ Voltar para lista
      </Link>
    </div>
  );
}

export default UserEdit;
