import { useState } from 'react';
import { X, ZoomIn, ImageOff } from 'lucide-react';

interface LightboxImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function LightboxImage({ src, alt = '', className = '' }: LightboxImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Placeholder image URL
  const placeholderUrl = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Image+Not+Available';

  const handleImageError = () => {
    setHasError(true);
  };

  const imageSrc = hasError || !src ? placeholderUrl : src;

  return (
    <>
      {/* Thumbnail with click handler */}
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={() => !hasError && setIsOpen(true)}
      >
        {hasError || !src ? (
          /* Placeholder with icon */
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="text-center">
              <ImageOff className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Image Not Available</p>
            </div>
          </div>
        ) : (
          <>
            <img 
              src={imageSrc} 
              alt={alt}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            {/* Overlay icon on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isOpen && !hasError && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Full size image */}
          <img 
            src={imageSrc} 
            alt={alt}
            className="max-w-full max-h-full object-contain"
            onError={handleImageError}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
