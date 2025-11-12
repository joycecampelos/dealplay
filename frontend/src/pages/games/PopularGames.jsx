import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { getPopularGames } from "../../services/itadService.js";
import GameCard from "../../components/games/GameCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function PopularGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 9;

  const observer = useRef(null);

  const loadGames = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const newGames = await getPopularGames(offset, LIMIT);

      if (newGames.length === 0) {
        setHasMore(false);
      } else {
        setGames((prev) => {
          const combined = [...prev, ...newGames];
          const unique = combined.filter(
            (game, index, self) => index === self.findIndex((g) => g.id === game.id)
          );
          return unique;
        });
        setOffset((prev) => prev + LIMIT);
      }
    } catch (err) {
      toast.error("Erro ao carregar jogos populares.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading]);

  useEffect(() => {
    loadGames();
  }, []);

  const lastGameRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadGames();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadGames]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center">
        Jogos Populares
      </h1>

      {games.length === 0 && !loading && (
        <p className="text-center text-gray-600">Nenhum jogo encontrado.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game, index) => {
          if (index === games.length - 1) {
            return (
              <div ref={lastGameRef} key={`${game.id}-${game.position}`}>
                <GameCard game={game} />
              </div>
            );
          }
          return <GameCard key={`${game.id}-${game.position}`} game={game} />;
        })}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-gray-500 mt-6">
          Todos os jogos populares foram carregados.
        </p>
      )}
    </div>
  );
}
