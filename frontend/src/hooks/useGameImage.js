import { useState } from "react";

export default function useGameImage(assets) {
  const [imageSrc, setImageSrc] = useState(
    assets?.banner600 || assets?.banner400 || assets?.banner300 || assets?.banner145 || "/assets/bannerGame.png"
  );

  const handleImageError = () => {
    if (imageSrc === assets?.banner600 && assets?.banner400) {
      setImageSrc(assets.banner400);
    } else if (imageSrc === assets?.banner400 && assets?.banner300) {
      setImageSrc(assets.banner300);
    } else if (imageSrc === assets?.banner300 && assets?.banner145) {
      setImageSrc(assets.banner145);
    } else {
      setImageSrc("/assets/bannerGame.png");
    }
  };

  return { imageSrc, handleImageError };
}
