import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  actionLabel = "Entrar",
  actionUrl = "/login",
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition"
          >
            DealPlay
          </Link>

          {actionUrl && (
            <Link
              to={actionUrl}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
              testid="authlayout-action-link"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8 space-y-6">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} DealPlay — Todos os direitos reservados.
      </footer>
    </div>
  );
}
