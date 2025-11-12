import { Link } from "react-router-dom";

export default function FormLayout({
  title,
  onSubmit,
  loading,
  children,
  cancelUrl = null,
  submitLabel = "Salvar",
}) {
  return (
    <div className="pt-10">
      <div className="max-w-7xl w-full mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8 space-y-6">
        {title && (
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3" testid="formlayout-title">
            {title}
          </h2>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {children}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-100">
            {cancelUrl ? (
              <Link
                to={cancelUrl}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-5 py-2 rounded-md transition text-center"
                testid="formlayout-cancel-btn"
              >
                Cancelar
              </Link>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-md shadow-sm transition disabled:opacity-70"
              testid="formlayout-submit-btn"
            >
              {loading ? "Salvando..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
