'use client';

import { useState } from 'react';
import { getImageUrl } from '@/lib/imageUtils';

export default function SafeImage({ src, alt, className, style, ...props }) {
  const [imageSrc, setImageSrc] = useState(getImageUrl(src));
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      // Try without cache-busting parameter
      const cleanUrl = src?.split('?')[0];
      if (cleanUrl && imageSrc !== getImageUrl(cleanUrl)) {
        setImageSrc(getImageUrl(cleanUrl));
        setHasError(true);
      } else {
        setHasError(true);
      }
    }
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

