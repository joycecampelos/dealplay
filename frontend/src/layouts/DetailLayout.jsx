import { Link } from "react-router-dom";
import { Pencil, ArrowLeft } from "lucide-react";

export default function DetailLayout({
  title,
  fields = [],
  editUrl,
  backUrl
}) {
  return (
    <div className="pt-10">
      <div className="max-w-7xl w-full mx-auto bg-white shadow-md rounded-lg p-6 sm:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4">
          <h2 className="text-2xl font-semibold text-gray-800" testid="detaillayout-title">
            {title}
          </h2>

          <div className="flex gap-3">
            {backUrl && (
              <Link
                to={backUrl}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
                testid="detaillayout-back-btn"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Link>
            )}
            {editUrl && (
              <Link
                to={editUrl}
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition"
                testid="detaillayout-edit-btn"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Link>
            )}

          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4">
          {fields.map((field, idx) => (
            <div key={idx}>
              <p className="text-gray-500 text-sm font-medium" testid={`detaillayout-${field.testid}-label`}>
                {field.label}
              </p>

              <p className="text-gray-900 text-base font-semibold" testid={`detaillayout-${field.testid}-value`}>
                {field.value || "—"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
