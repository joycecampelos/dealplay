import { useContext, useEffect, useState } from "react";
import { Gamepad2, CheckCircle2, FolderPlus, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getPlayLogs } from "../../services/playlogService.js";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [playLogs, setPlayLogs] = useState([]);
  const [activeTab, setActiveTab] = useState("jogando");
  const [loading, setLoading] = useState(true);

  if (!user) {
    return null;
  }

  const initial = user.name?.charAt(0).toUpperCase();

  useEffect(() => {
    async function fetchPlayLogs() {
      try {
        const response = await getPlayLogs();
        setPlayLogs(response);
      } catch (err) {
        console.error("Erro ao carregar PlayLogs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayLogs();
  }, [user.id]);

  const tabs = [
    { key: "jogando", label: "Jogando", icon: <Gamepad2 className="w-4 h-4" /> },
    { key: "finalizado", label: "Finalizado", icon: <CheckCircle2 className="w-4 h-4" /> },
    { key: "quero jogar", label: "Quero jogar", icon: <FolderPlus className="w-4 h-4" /> },
    { key: "abandonado", label: "Abandonado", icon: <XCircle className="w-4 h-4" /> },
  ];

  const filteredGames = playLogs.filter(
    (log) => log.status?.toLowerCase() === activeTab
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="pt-10 px-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-8">
          <div className="flex items-center gap-6">
            <div className="w-28 h-28 flex items-center justify-center rounded-full bg-blue-600 text-white text-4xl font-semibold shadow-md">
              {initial}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-gray-500">
                @{user.username}
              </p>
            </div>
          </div>

          <div>
            <Link
              to="/profile/edit"
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-md shadow-sm transition"
            >
              Editar perfil
            </Link>
          </div>
        </div>

        {user.role !== "admin" && (
          <div>
            <div className="flex border-b border-gray-200 mt-10 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-blue-600"
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                  {filteredGames.map((log) => (
                    <Link
                      key={log.id}
                      to={`/games/details/${log.games.id_itad}/${log.games.slug}`}
                      className="block bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                      <img
                        src={log.games.cover_url || "/placeholder-game.png"}
                        alt={log.games.title}
                        className="w-full h-auto rounded-t-lg object-cover"
                      />
                      <p className="text-center text-xs text-gray-700 font-medium p-2">
                        {log.games.title}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10 italic">
                  Nenhum jogo encontrado nesta categoria.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
