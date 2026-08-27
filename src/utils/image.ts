/**
 * Optimizes image URLs for high performance, Core Web Vitals, and bandwidth reduction.
 * Automatically adds Cloudinary WebP/AVIF auto-formatting, compression, and width limits.
 *
 * @param {string} url - Original image URL
 * @param {Object} [options] - Image transformation options
 * @param {number} [options.width] - Target width in pixels
 * @param {string} [options.quality='auto'] - Cloudinary quality setting (e.g. 'auto', 'auto:good')
 * @param {string} [options.format='auto'] - Image format ('auto' serves AVIF/WebP based on browser support)
 * @param {string} [options.crop='limit'] - Crop/scaling mode
 * @returns {string} Optimized image URL
 */
export interface ImageOptimizationOptions {
  width?: number;
  quality?: string;
  format?: string;
  crop?: string;
}

export function getOptimizedImageUrl(url: string, options: ImageOptimizationOptions = {}) {
  if (!url || typeof url !== 'string') return url;

  // Cloudinary image transformation insertion
  if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
    const { width, quality = 'auto', format = 'auto', crop = 'limit' } = options;
    const transforms = [`f_${format}`, `q_${quality}`];
    
    if (width) {
      transforms.push(`w_${width}`);
      transforms.push(`c_${crop}`);
    }

    const transformStr = transforms.join(',');
    const uploadIndex = url.indexOf('/upload/');
    const prefix = url.substring(0, uploadIndex + 8);
    const suffix = url.substring(uploadIndex + 8);

    // Avoid duplicate transformations
    if (suffix.startsWith('f_') || suffix.startsWith('q_') || suffix.startsWith('w_')) {
      return url;
    }

    return `${prefix}${transformStr}/${suffix}`;
  }

  return url;
}
