'use client';

import { useState } from 'react';
import { getImageUrl } from '@/lib/imageUtils';

export default function SafeImage({ src, alt, className, style, ...props }) {
  const [imageSrc, setImageSrc] = useState(getImageUrl(src));
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount === 0) {
      // First attempt: Try without cache-busting parameter
      const cleanUrl = src?.split('?')[0];
      if (cleanUrl && imageSrc !== getImageUrl(cleanUrl)) {
        setImageSrc(getImageUrl(cleanUrl));
        setRetryCount(1);
        return;
      }
    }
    
    // After one retry or if retry didn't help, stop and hide image
    setHasError(true);
    console.warn('Failed to load image:', src);
  };

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

