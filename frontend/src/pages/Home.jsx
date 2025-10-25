import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div style={{ padding: 20 }}>
      <h2>Bem-vindo(a), {user?.name || user?.username}!</h2>
      <p>Você está autenticado como: {user?.role}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
}

export default Home;
