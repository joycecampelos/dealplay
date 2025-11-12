import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function ListLayout({
  title,
  addButton,
  headers,
  data = []
}) {
  return (
    <div className="space-y-8 pt-10">
      {(title || addButton) && (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-800" testid="listlayout-title">
              {title}
            </h2>
          )}

          {addButton && (
            <Link
              to={addButton.to}
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
              testid="listlayout-add-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButton.label || "Adicionar"}
            </Link>
          )}
        </div>
      )}

      <div className="hidden sm:block overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`px-4 py-3 font-medium ${header.width || "w-auto"} ${header.align || "text-left"
                    } whitespace-nowrap`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition"
                testid={`listlayout-row-${idx}`}>
                  {headers.map((header, i) => (
                    <td
                      key={i}
                      className={`px-4 py-3 ${header.align || "text-left"}`}
                      testid={`listlayout-${header.key}-cell-${idx}`}
                    >
                      {item[header.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers.length}
                  className="text-center py-6 text-gray-500"
                  testid="listlayout-no-records"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden space-y-4">
        {data.length > 0 ? (
          data.map((item, idx) => (
            <div
              key={idx}
              className="bg-white shadow rounded-lg border border-gray-100 p-4 space-y-2"
            >
              {headers.map((header, i) => {
                if (header.key === "actions") return null;
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">
                      {header.label}:
                    </span>
                    <span className="text-gray-800 text-right">
                      {item[header.key]}
                    </span>
                  </div>
                );
              })}
              {item.actions && (
                <div className="pt-2 flex justify-end">{item.actions}</div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">
            Nenhum registro encontrado.
          </p>
        )}
      </div>
    </div>
  );
}
