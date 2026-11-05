import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { resolveKurtiImageUrl } from '../data/outfitsData';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const resolvedSrc = resolveKurtiImageUrl(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [resolvedSrc]);

  if (hasError || !resolvedSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FCEEF4] via-[#F7E2EC] to-[#EED2E2] text-[#5B2C44] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="w-6 h-6 mb-2 text-[#A83264] opacity-75" />
        <span className="font-display text-base italic tracking-wide">
          {fallbackLabel || alt}
        </span>
        <span className="text-xs text-[#6E4B5E] mt-1">
          Jaybor Bangladesh Kurti Studio
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
