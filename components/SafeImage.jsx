'use client';

import { useEffect, useMemo, useState } from 'react';
import { FALLBACK_IMAGE, getDisplayImageUrl, normalizeImageUrl } from '../lib/imageUtils';

export default function SafeImage({
  src,
  images,
  alt = '',
  className = '',
  fallback = FALLBACK_IMAGE,
  loading = 'lazy',
  ...props
}) {
  const normalizedSrc = normalizeImageUrl(src);
  const displaySrc = getDisplayImageUrl(normalizedSrc);
  const normalizedImages = useMemo(
    () => (Array.isArray(images) ? images.map(normalizeImageUrl).filter(Boolean) : images),
    [images]
  );
  const [currentSrc, setCurrentSrc] = useState(displaySrc || fallback);

  useEffect(() => {
    console.log('[SHINEYOO image debug]', {
      src: normalizedSrc,
      displaySrc,
      images: normalizedImages,
      isImagesEmpty: Array.isArray(normalizedImages) ? normalizedImages.length === 0 : !normalizedImages
    });
    setCurrentSrc(displaySrc || fallback);
  }, [normalizedSrc, displaySrc, normalizedImages, fallback]);

  return (
    <img
      src={currentSrc || fallback}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setCurrentSrc(fallback)}
      {...props}
    />
  );
}
