import { Link } from "react-router-dom";

export default function HomePublic() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Bem-vindo ao DealPlay!
      </h1>

      <p className="text-gray-600 max-w-md mb-6">
        Crie sua conta para acompanhar seus jogos favoritos, comparar preços e
        descobrir promoções imperdíveis!
      </p>

      <div className="flex gap-3">
        <Link
          to="/register"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-8 py-2 rounded-md shadow-sm transition"
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
