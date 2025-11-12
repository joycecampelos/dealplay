import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ActionButtons({ onView, onEdit, onDelete, size = 4 }) {
  return (
    <div className="flex justify-center gap-2">
      {onView && (
        <Link
          to={onView}
          className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
          title="Ver detalhes"
          testid="actionbuttons-view-btn"
        >
          <Eye className={`w-${size} h-${size}`} />
        </Link>
      )}
      {onEdit && (
        <Link
          to={onEdit}
          className="p-2 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
          title="Editar"
          testid="actionbuttons-edit-btn"
        >
          <Edit className={`w-${size} h-${size}`} />
        </Link>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
          title="Excluir"
          testid="actionbuttons-delete-btn"
        >
          <Trash2 className={`w-${size} h-${size}`} />
        </button>
      )}
    </div>
  );
}
