import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerClassName?: string;
  priority?: boolean;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Avenue luxury property architectural showcase',
  fallbackSrc,
  className = '',
  containerClassName = '',
  priority = false,
  width = 800,
  height = 600,
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state when src prop updates (e.g. navigation or filter changes)
  useEffect(() => {
    if (!src) {
      setHasError(true);
      return;
    }
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#1B2A44]/15 ${containerClassName}`}>
      {/* Subtle neutral navy shimmer placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A44]/20 via-[#2F4B73]/20 to-[#1B2A44]/20 animate-pulse z-0" />
      )}

      {!hasError && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover object-center transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      ) : (
        /* Neutral navy gradient fallback placeholder so no card is ever empty */
        <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-[#1B2A44] to-[#2F4B73] flex flex-col items-center justify-center p-6 text-white/90 select-none">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-2 border border-white/15">
            <Building2 className="w-5 h-5 text-amber-200" />
          </div>
          <span className="text-[11px] uppercase tracking-wider font-display font-medium text-white/90 text-center line-clamp-2 max-w-[200px]">
            {alt || 'Avenue Architectural Residence'}
          </span>
        </div>
      )}
    </div>
  );
};
