/**
 * Utility to compress images (Data URLs or Files) using HTML Canvas.
 * Resizes large photos into compact avatar/thumbnail dimensions (e.g., max 300x300 for avatars)
 * and compresses them with JPEG format to avoid localStorage QuotaExceededError.
 */
export function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 300,
  maxHeight = 300,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (typeof fileOrDataUrl === 'string' && !fileOrDataUrl.startsWith('data:image/')) {
      // Non-dataURL string (e.g., http URL or empty string)
      resolve(fileOrDataUrl);
      return;
    }

    const img = new Image();
    
    const processImage = () => {
      try {
        let width = img.width;
        let height = img.height;

        if (width === 0 || height === 0) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        // Scale down maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Convert to optimized JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn('Image compression fallback:', err);
        resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
      }
    };

    img.onload = processImage;
    img.onerror = (err) => {
      console.warn('Failed to load image for compression:', err);
      resolve(typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '');
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        } else {
          reject(new Error('Failed to read image file'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
