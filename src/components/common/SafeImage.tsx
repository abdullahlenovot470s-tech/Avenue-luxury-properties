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
  fallbackSrc = '/src/assets/images/hero_luxury_villa_dusk_1794379157123.jpg',
  className = '',
  containerClassName = '',
  priority = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync state when src prop updates (e.g., photo carousel navigation)
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc && fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-200/60 ${containerClassName}`}>
      {/* Shimmer placeholder skeleton until image finishes loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse z-0" />
      )}

      {!hasError && currentSrc ? (
        <img
          src={currentSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      ) : (
        <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-[#1B2A44] to-[#2F4B73] flex flex-col items-center justify-center p-6 text-white/80">
          <Building2 className="w-8 h-8 mb-2 text-white/50" />
          <span className="text-[11px] uppercase tracking-wider font-display font-medium text-white/80 text-center line-clamp-2">
            {alt || 'Avenue Architectural Residence'}
          </span>
        </div>
      )}
    </div>
  );
};
