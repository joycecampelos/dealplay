import { Link } from "react-router-dom";
import useGameImage from "../../hooks/useGameImage.js";

export default function SearchResultCard({ game }) {
  const { id, slug, title, type, assets } = game;
  const { imageSrc, handleImageError } = useGameImage(assets);

  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <div className="sm:w-2/5 flex-shrink-0">
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-36 sm:h-32 object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-3 sm:w-3/5 flex-grow">
        <div>
          <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
            {title}
          </h3>

          {type && (
            <p className="text-xs text-gray-500 capitalize">
              Categoria: <span className="font-medium text-gray-700">{type}</span>
            </p>
          )}
        </div>

        <Link
          to={`/games/details/${id}/${slug}`}
          className="self-end bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition"
        >
          Ver detalhes
        </Link>
      </div>
    </div>
  );
}
