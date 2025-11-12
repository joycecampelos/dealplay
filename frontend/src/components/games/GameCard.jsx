import { Link } from "react-router-dom";
import { formatDate } from "../../utils/formatters.js";
import useGameImage from "../../hooks/useGameImage.js";

export default function GameCard({ game }) {
  const { id, slug, title, assets, tags, releaseDate } = game;
  const { imageSrc, handleImageError } = useGameImage(assets);

  return (
    <Link
      to={`/games/details/${id}/${slug}`}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
    >
      <img
        src={imageSrc}
        alt={title}
        onError={handleImageError}
        loading="lazy"
        className="w-full h-48 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          Lançamento:{" "}
          {releaseDate ? formatDate(releaseDate) : "Data não informada"}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {tags?.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
