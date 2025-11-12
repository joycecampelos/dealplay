import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getPlayLogs } from "../../services/playlogService.js";
import { getBestDeals } from "../../services/itadService.js";
import { formatPrice } from "../../utils/formatters.js";
import { Gamepad2, CheckCircle2, FolderPlus, XCircle, Flame, ArrowRight } from "lucide-react";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function HomeUser() {
  const { user } = useContext(AuthContext);
  const [playLogs, setPlayLogs] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [logsRes, dealsRes] = await Promise.all([
          getPlayLogs(),
          getBestDeals(0, 6, "-hot")
        ]);
        setPlayLogs(logsRes);
        setDeals(dealsRes);
      } catch (err) {
        console.error("Erro ao carregar dados da home:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user.id]);

  if (loading) return <LoadingSpinner />;

  const stats = {
    jogando: playLogs.filter((p) => p.status === "jogando").length,
    finalizado: playLogs.filter((p) => p.status === "finalizado").length,
    "quero jogar": playLogs.filter((p) => p.status === "quero jogar").length,
    abandonado: playLogs.filter((p) => p.status === "abandonado").length,
  };

  const cards = [
    {
      label: "Jogando",
      value: stats.jogando,
      icon: <Gamepad2 className="w-6 h-6 text-blue-600" />,
      color: "bg-blue-50 border-blue-200",
    },
    {
      label: "Finalizado",
      value: stats.finalizado,
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      color: "bg-green-50 border-green-200",
    },
    {
      label: "Quero jogar",
      value: stats["quero jogar"],
      icon: <FolderPlus className="w-6 h-6 text-yellow-600" />,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      label: "Abandonado",
      value: stats.abandonado,
      icon: <XCircle className="w-6 h-6 text-red-600" />,
      color: "bg-red-50 border-red-200",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-12">
        Olá, {user?.name}!
      </h1>

      {/* Painel de estatísticas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mb-16">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border ${card.color} shadow-sm`}
          >
            {card.icon}
            <p className="text-gray-700 text-sm font-medium mt-2">
              {card.label}
            </p>
            <p className="text-2xl font-semibold text-gray-700">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Flame className="w-6 h-6 text-orange-500" />
            Melhores promoções
          </h2>
          <Link
            to="/deals/best"
            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Ver todas <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {deals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {deals.map((deal, i) => (
              <Link
                key={i}
                to={`/games/details/${deal.id}/${deal.slug}`}
                className="bg-white rounded-lg shadow hover:shadow-md transition flex flex-col border border-gray-100"
              >
                <img
                  src={deal.assets.banner600}
                  alt={deal.title}
                  className="w-full h-auto rounded-t-lg object-cover"
                />
                <div className="p-2 text-sm flex flex-col flex-grow justify-between">
                  <p className="font-medium text-gray-800 truncate">
                    {deal.title}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-green-600 font-bold">
                      {formatPrice(deal.deal.price)}
                    </p>
                    {deal.deal.cut && deal.deal.cut > 0 && (
                      <span className="flex text-xs text-gray-500 gap-1">
                        -{deal.deal.cut}%
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center italic">
            Nenhuma oferta disponível no momento.
          </p>
        )}
      </div>
    </div>
  );
}
