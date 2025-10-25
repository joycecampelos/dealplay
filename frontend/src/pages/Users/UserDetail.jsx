import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api.js";

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get(`/users/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err.response?.data || err.message));
  }, [id]);

  if (!user) return <p>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Detalhes do Usuário</h2>
      <p><b>Nome:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>Papel:</b> {user.role}</p>
      <Link to="/users">⬅️ Voltar</Link>
    </div>
  );
}

export default UserDetail;
