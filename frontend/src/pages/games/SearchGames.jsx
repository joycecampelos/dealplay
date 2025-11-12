import { useState } from "react";
import { toast } from "sonner";
import { searchGamesByName } from "../../services/itadService.js";
import SearchResultCard from "../../components/games/SearchResultCard.jsx";
import LoadingSpinner from "../../components/common/LoadingSpinner.jsx";

export default function SearchGames() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();

    if (!query.trim()) {
      toast.warning("Digite o nome de um jogo para buscar.");
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchGamesByName(query);
      setResults(data);
    } catch (err) {
      toast.error("Erro ao buscar jogos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Buscar Jogos
      </h1>

      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-14 max-w-lg mx-auto"
      >
        <input
          type="text"
          placeholder="Digite o nome do jogo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 rounded-md transition"
        >
          Buscar
        </button>
      </form>

      {loading && (
        <div className="flex justify-center mt-6">
          <LoadingSpinner />
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((game, index) => (
            <SearchResultCard key={`${game.id}-${index}`} game={game} />
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Nenhum jogo encontrado para <strong>"{query}"</strong>.
        </p>
      )}
    </div>
  );
}
