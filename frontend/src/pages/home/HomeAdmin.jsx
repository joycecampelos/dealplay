import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";

export default function HomeAdmin() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-8 text-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4" testid="home-admin-title">
        Área Administrativa
      </h1>
      <p className="text-gray-600 mb-6" testid="home-admin-welcome-message">
        Bem-vindo(a), {user?.name}. Aqui você pode gerenciar usuários, jogos e playlogs.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/users"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm"
        >
          Gerenciar usuários
        </Link>
        <Link
          to="/games"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm"
        >
          Gerenciar jogos
        </Link>
      </div>
    </div>
  );
}
