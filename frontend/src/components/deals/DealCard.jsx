import { Link } from "react-router-dom";
import { formatPrice, formatListMapping } from "../../utils/formatters.js";
import useGameImage from "../../hooks/useGameImage.js";

export default function DealCard({ deal }) {
  const { id, slug, title, assets, deal: info } = deal;
  const { imageSrc, handleImageError } = useGameImage(assets);

  return (
    <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <div className="sm:w-2/5 flex-shrink-0">
        <img
          src={imageSrc}
          alt={title}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-between p-3 sm:w-3/5 flex-grow">
        <div>
          <h3 className="text-base font-semibold text-gray-800 truncate mb-1">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex flex-col items-start">
            <p className="text-xs text-gray-500">
              Loja:{" "}
              <span className="font-medium text-gray-700">{info.shop.name}</span>
            </p>

            <p className="text-xs text-gray-500">
              Plataforma:{" "}
              <span className="font-medium text-gray-700">
                {formatListMapping(info.platforms, "name")}
              </span>
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-gray-500 line-through text-xs">
                {formatPrice(info.regular)}
              </span>
              <span className="text-base font-bold text-green-600">
                {formatPrice(info.price)}
              </span>
              <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                -{info.cut}%
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <Link
              to={`/games/details/${id}/${slug}`}
              className="w-full sm:w-[120px] text-center bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm border border-gray-200 transition"
            >
              Ver jogo
            </Link>

            <a
              href={info.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-[120px] text-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition"
            >
              Ver oferta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
