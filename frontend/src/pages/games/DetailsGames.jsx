import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Star } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { getGameAllDetailsById } from "../../services/itadService.js";
import { getGameByIdItad } from "../../services/gameService.js";
import { getPlayLogsByUserAndGame, deletePlayLog } from "../../services/playlogService.js";
import { formatPrice, formatListMapping, formatDate } from "../../utils/formatters.js";
import PlayLogUserFormLayout from "../../layouts/forms/PlayLogUserFormLayout.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function GameDetails() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id, slug } = useParams();

  const [gameData, setGameData] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPlayLogModal, setShowPlayLogModal] = useState(false);
  const [userPlayLog, setUserPlayLog] = useState(null);

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await getGameAllDetailsById(id, slug);
        setGameData(data);
      } catch (err) {
        toast.error("Erro ao carregar detalhes do jogo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchGame();
  }, [id, slug]);

  async function fetchUserPlayLog() {
    const existingGame = await getGameByIdItad(id);

    if (!user || !existingGame[0]) {
      return;
    }

    try {
      const data = await getPlayLogsByUserAndGame(user.id, id);
      setUserPlayLog(data[0]);
    } catch {
      setUserPlayLog(null);
    }
  }

  useEffect(() => {
    if (user?.id && id) {
      fetchUserPlayLog();
    }
  }, [user, id]);

  const handleDeletePlayLog = async () => {
    if (!window.confirm("Tem certeza que deseja excluir seu PlayLog?")) {
      return;
    }

    try {
      await deletePlayLog(userPlayLog.id);
      toast.success("PlayLog excluído com sucesso!");
      setUserPlayLog(null);
    } catch (err) {
      toast.error("Erro ao excluir PlayLog.");
    }
  };

  const tabs = [];
  if (gameData) {
    const { prices, subscriptions, igdb } = gameData;

    if (user)
      tabs.push({ key: "playlog", label: "Meu PlayLog" });
    if (prices?.[0]?.deals?.length)
      tabs.push({ key: "offers", label: "Ofertas" });
    if (subscriptions?.[0]?.subs?.length)
      tabs.push({ key: "subs", label: "Assinaturas" });
    if (igdb && (igdb.genres_igdb?.length || igdb.platforms_igdb?.length))
      tabs.push({ key: "igdb", label: "Informações adicionais" });

  }

  useEffect(() => {
    if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].key);
    }
  }, [tabs.length]);

  if (loading) {
    return <LoadingSpinner />
  }

  if (!gameData) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Nenhum detalhe encontrado para este jogo.
      </p>
    );
  }

  const { details, prices, subscriptions, igdb } = gameData;

  const boxart = details.assets?.boxart || "/assets/boxartGame.png";

  const resumo =
    igdb?.sumary_translated_igdb ||
    igdb?.summary_igdb ||
    null;

  const statusOptions = {
    "quero jogar": "Quero jogar",
    "jogando": "Jogando",
    "finalizado": "Finalizado",
    "abandonado": "Abandonado",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </button>

        {user && (
          <button
            onClick={() => setShowPlayLogModal(true)}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
          >
            {userPlayLog ? (
              <>
                <Pencil className="w-4 h-4 mr-2" /> Editar PlayLog
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" /> Adicionar PlayLog
              </>
            )}
          </button>
        )}


      </div>


      {showPlayLogModal && (
        <PlayLogUserFormLayout
          onClose={() => setShowPlayLogModal(false)}
          title={userPlayLog ? "Editar PlayLog" : "Novo PlayLog"}
          game={gameData}
          existingPlayLog={userPlayLog}
          onSubmitSuccess={() => {
            setShowPlayLogModal(false);
            fetchUserPlayLog();
          }}
        />
      )}

      <div className="bg-white rounded-xl shadow-md p-6 mb-8 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
        <div className="flex justify-start md:justify-end">
          <img
            src={boxart}
            alt={details.title}
            className="w-64 md:w-72 h-auto rounded-lg shadow-sm object-contain"
          />
        </div>

        <div className="text-left md:pl-2">
          <h1 className="text-3xl font-bold text-gray-800 mb-3 leading-tight">
            {details.title}
          </h1>

          <p className="text-sm text-gray-600 mb-2">
            <strong>Data de lançamento:</strong>{" "}
            {details.releaseDate ? formatDate(details.releaseDate) : "Não informada"}
          </p>

          {details.developers?.length > 0 && (
            <p className="text-sm text-gray-600 mb-2">
              <strong>Desenvolvedora:</strong>{" "}
              {formatListMapping(details.developers, "name")}
            </p>
          )}

          {details.publishers?.length > 0 && (
            <p className="text-sm text-gray-600 mb-4">
              <strong>Publicadora:</strong>{" "}
              {formatListMapping(details.publishers, "name")}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {details.tags?.slice(0, 5).map((tag, i) => (
              <span
                key={i}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {details.reviews?.length > 0 && (
            <div className="flex flex-wrap gap-3 text-sm text-gray-700 mb-6">
              {details.reviews.slice(0, 3).map((r, i) => (
                <span key={i} className="font-medium">
                  {r.source}: {r.score}
                </span>
              ))}
            </div>
          )}

          {resumo && (
            <div>
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {resumo}
              </p>
            </div>
          )}
        </div>
      </div>

      {tabs.length > 0 && (
        <>
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            {activeTab === "playlog" && user && (
              <div>
                {userPlayLog ? (

                  <div className="space-y-3">
                    <div className="flex justify-end gap-3 mt-4">

                      <button
                        onClick={() => setShowPlayLogModal(true)}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={handleDeletePlayLog}
                        className="inline-flex items-center bg-red-700 hover:bg-red-800 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </button>
                    </div>

                    {userPlayLog.status && (<p><strong>Status:</strong> {statusOptions[userPlayLog.status]}</p>)}
                    {userPlayLog.progress && (<p><strong>Progresso:</strong> {userPlayLog.progress}%</p>)}
                    {userPlayLog.rating > 0 && (<p className="flex items-center gap-1"><strong className="mr-1">Nota:</strong>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < userPlayLog.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                            }`}
                        />
                      ))}</p>)}
                    {userPlayLog.review && (
                      <p><strong>Review:</strong> {userPlayLog.review}</p>
                    )}
                    {userPlayLog.notes && (
                      <p><strong>Notas pessoais:</strong> {userPlayLog.notes}</p>
                    )}


                  </div>
                ) : (
                  <div className="text-center text-gray-600">
                    <p>Você ainda não adicionou este jogo à sua lista.</p>
                    <button
                      onClick={() => setShowPlayLogModal(true)}
                      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition"
                    >
                      <Plus className="inline w-4 h-4 mr-1" />
                      Adicionar PlayLog
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "offers" && prices?.[0]?.deals?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Ofertas disponíveis
                </h2>

                {prices[0].historyLow?.all?.amount && (
                  <p className="text-sm text-gray-600 mb-4">
                    Menor preço histórico:{" "}
                    <strong>
                      {formatPrice(prices[0].historyLow.all)}
                    </strong>
                  </p>
                )}

                {(() => {
                  const lowestPrice = Math.min(...prices[0].deals.map((d) => d.price.amount));

                  return (
                    <div className="overflow-x-auto">
                      <ul>
                        {prices[0].deals
                          .sort((a, b) => a.price.amount - b.price.amount)
                          .map((deal, index) => {
                            const isLowest = deal.price.amount === lowestPrice;

                            return (
                              <li
                                key={index}
                                className={`grid grid-cols-4 items-center px-6 py-4 text-sm transition ${isLowest
                                  ? "bg-green-50 border-l-4 border-green-500 shadow-sm rounded-lg mb-2"
                                  : "hover:bg-gray-50"
                                  }`}
                              >
                                <div className="flex flex-col gap-1">
                                  <p className="font-medium text-gray-800">
                                    {deal.shop.name}
                                  </p>
                                  {deal.drm?.length > 0 && (
                                    <p className="text-xs text-gray-500">
                                      {formatListMapping(deal.drm, "name")}
                                    </p>
                                  )}
                                </div>

                                <div className="text-center">
                                  <p className="font-semibold text-green-600 text-base">
                                    {formatPrice(deal.price)}
                                  </p>
                                  {deal.cut > 0 && (
                                    <p className="text-xs text-gray-500">
                                      {deal.cut}% de desconto
                                    </p>
                                  )}
                                  {isLowest && (
                                    <span className="bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded mt-1 inline-block">
                                      Melhor oferta
                                    </span>
                                  )}
                                </div>

                                <div className="text-center text-gray-600 text-sm">
                                  {deal.regular?.amount && (
                                    <p className="line-through text-xs">
                                      {formatPrice(deal.regular)}
                                    </p>
                                  )}
                                  {deal.storeLow?.amount && (
                                    <p className="text-xs">
                                      Menor preço:{" "}
                                      {formatPrice(deal.storeLow)}
                                    </p>
                                  )}
                                </div>

                                <div className="text-right">
                                  <a
                                    href={deal.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-md shadow transition"
                                  >
                                    Ver oferta
                                  </a>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === "subs" && subscriptions?.[0]?.subs?.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Disponível em assinaturas
                </h2>
                <ul className="flex flex-wrap gap-3">
                  {subscriptions[0].subs.map((sub, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 text-blue-700 font-medium text-sm px-3 py-1.5 rounded-full border border-blue-200"
                    >
                      {sub.name}
                      {sub.leaving && (
                        <span className="ml-2 text-xs text-gray-500">
                          Sai em{" "}
                          {new Date(sub.leaving).toLocaleDateString("pt-BR")}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "igdb" && igdb && (
              <div className="space-y-3">
                {igdb.genres_igdb?.length > 0 && (
                  <p className="text-gray-700 text-sm">
                    <strong>Gêneros:</strong> {igdb.genres_igdb.join(", ")}
                  </p>
                )}
                {igdb.platforms_igdb?.length > 0 && (
                  <p className="text-gray-700 text-sm">
                    <strong>Plataformas:</strong>{" "}
                    {igdb.platforms_igdb.join(", ")}
                  </p>
                )}
                {!resumo && igdb.summary_igdb && (
                  <div>
                    <h3 className="text-md font-semibold mt-4 mb-1">Resumo</h3>
                    <p className="text-gray-700 text-sm">
                      {igdb.summary_igdb}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
