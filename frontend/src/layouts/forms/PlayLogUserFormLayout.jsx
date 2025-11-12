import { useContext, useState } from "react";
import { toast } from "sonner";
import { Gamepad2, CheckCircle2, FolderPlus, XCircle, Star } from "lucide-react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { createPlayLog, updatePlayLog } from "../../services/playlogService.js";
import { createGame, getGameByIdItad } from "../../services/gameService.js";
import Modal from "../../components/common/Modal.jsx";
import FormField from "../../components/forms/FormField.jsx";
import TextareaField from "../../components/forms/TextareaField.jsx";

export default function PlayLogUserFormLayout({
  onClose,
  title,
  game,
  onSubmitSuccess,
  existingPlayLog
}) {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState(
    {
      user_id: existingPlayLog?.user_id || user?.id,
      status: existingPlayLog?.status || "quero jogar",
      progress: existingPlayLog?.progress || "",
      rating: existingPlayLog?.rating || 0,
      review: existingPlayLog?.review || "",
      notes: existingPlayLog?.notes || "",
    }
  );
  const [loading, setLoading] = useState(false);

  const newGame = {
    title: game?.details.title || "",
    slug: game?.details.slug || "",
    type: game?.details.type || "",
    release_date: game?.details.releaseDate || "",
    platforms: game?.igdb.platforms_igdb || [],
    genres: game?.igdb.genres_igdb || [],
    developers: game?.details.developers.map((d) => d.name) || [],
    publishers: game?.details.publishers.map((p) => p.name) || [],
    cover_url: game?.details.assets.boxart || "",
    tags: game?.details.tags || [],
    id_itad: game?.details.id || "",
    id_igdb: game?.igdb.id_igdb || "",
    description: game?.igdb.sumary_translated_igdb || "",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      let gameRecord;
      const existingGame = await getGameByIdItad(newGame.id_itad);

      if (existingGame.length > 0) {
        gameRecord = existingGame[0];
      } else {
        gameRecord = await createGame(newGame);
      }

      const payload = {
        ...form,
        game_id: gameRecord.id,
      };
      console.log("PlayLog:", existingPlayLog);
      if (existingPlayLog) {
        await updatePlayLog(existingPlayLog.id, payload);
      } else {
        await createPlayLog(payload);
      }

      toast.success("PlayLog criado com sucesso!");
      onSubmitSuccess?.();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar PlayLog.");
    } finally {
      setLoading(false);
    }
  }

  const statusOptions = [
    {
      key: "quero jogar",
      label: "Quero jogar",
      icon: <FolderPlus className="w-4 h-4" />,
    },
    { key: "jogando", label: "Jogando", icon: <Gamepad2 className="w-4 h-4" /> },
    {
      key: "finalizado",
      label: "Finalizado",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    { key: "abandonado", label: "Abandonado", icon: <XCircle className="w-4 h-4" /> },
  ];

  const handleStarClick = (value) => {
    setForm((prev) => ({ ...prev, rating: value }));
  };

  return (
    <Modal onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6 px-2 py-2">
        <div className="flex items-center gap-4">
          <img
            src={
              game?.details?.assets?.banner145 ||
              game?.details?.assets?.banner300 ||
              "/placeholder-game.png"
            }
            alt={game?.details.title}
            className="w-28 h-auto rounded-md shadow-sm object-cover"
          />
          <h2 className="text-lg font-semibold text-gray-800">{game?.details.title}</h2>
        </div>

        <div>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            Status <span className="text-red-500 ml-0.5">*</span>
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
            {statusOptions.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, status: s.key }))}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${form.status === s.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {s.icon}
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Progresso (%)"
            type="number"
            value={form.progress}
            onChange={(e) => setForm({ ...form, progress: e.target.value })}
            placeholder="0 a 100"
          />

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Nota
            </p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleStarClick(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${value <= form.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <TextareaField
            label="Review"
            value={form.review}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, review: e.target.value }))
            }
            placeholder="O que está achando do jogo?"
          />

          <TextareaField
            label="Notas pessoais"
            value={form.notes}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, notes: e.target.value }))
            }
            placeholder="Observações pessoais, detalhes adicionais..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md shadow-sm transition disabled:opacity-70"
          >
            {loading ? "Salvando..." : "Salvar PlayLog"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
