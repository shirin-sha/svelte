'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imageUtils';

export default function SafeImage({ src, alt, className, style, ...props }) {
  const normalizedSrc = getImageUrl(src);
  const [imageSrc, setImageSrc] = useState(normalizedSrc);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset state when src prop changes
  useEffect(() => {
    setImageSrc(getImageUrl(src));
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    // Only try once: retry without cache-busting parameter
    if (retryCount === 0) {
      const cleanUrl = src?.split('?')[0];
      const cleanNormalized = getImageUrl(cleanUrl);
      
      // Only retry if the URL is actually different
      if (cleanUrl && cleanNormalized !== imageSrc) {
        setImageSrc(cleanNormalized);
        setRetryCount(1);
        return;
      }
    }
    
    // After first retry (or if URLs are same), mark as failed
    setHasError(true);
  };

  // Don't render if no source or if error occurred
  if (!src || hasError) {
    return null;
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={handleError}
      className={className}
      style={style}
      {...props}
    />
  );
}

