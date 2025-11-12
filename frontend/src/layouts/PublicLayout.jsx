import { Link } from "react-router-dom";

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            DealPlay
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-8 py-2 rounded-md shadow-sm transition"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DealPlay — Todos os direitos reservados.
      </footer>
    </div>
  );
}
