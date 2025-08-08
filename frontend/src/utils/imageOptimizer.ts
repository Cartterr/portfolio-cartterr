// Image optimization utility for performance
export interface OptimizedImage {
  url: string
  width: number
  height: number
  size: number
}

export class ImageOptimizer {
  private static canvas: HTMLCanvasElement | null = null
  private static ctx: CanvasRenderingContext2D | null = null
  private static cache = new Map<string, OptimizedImage>()

  private static getCanvas(): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')!
      // Optimize canvas for performance
      this.ctx.imageSmoothingEnabled = true
      this.ctx.imageSmoothingQuality = 'medium'
    }
    return { canvas: this.canvas, ctx: this.ctx! }
  }

  static async optimizeImage(
    originalUrl: string,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.7,
    format: 'webp' | 'jpeg' = 'webp'
  ): Promise<OptimizedImage> {
    const cacheKey = `${originalUrl}_${maxWidth}_${maxHeight}_${quality}_${format}`

    // Return cached version if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!
    }

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          const { canvas, ctx } = this.getCanvas()

          // Calculate optimal dimensions maintaining aspect ratio
          const { width, height } = this.calculateOptimalSize(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          )

          // Resize canvas
          canvas.width = width
          canvas.height = height

          // Clear and draw optimized image
          ctx.clearRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to optimized format
          const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg'
          const optimizedUrl = canvas.toDataURL(mimeType, quality)

          const optimized: OptimizedImage = {
            url: optimizedUrl,
            width,
            height,
            size: optimizedUrl.length * 0.75 // Approximate size
          }

          // Cache the result
          this.cache.set(cacheKey, optimized)

          // Log compression stats
          console.log(`🖼️ Optimized ${originalUrl.split('/').pop()}: ${img.width}x${img.height} → ${width}x${height} (${format.toUpperCase()})`)

          resolve(optimized)
        } catch (error) {
          console.error('Image optimization failed:', error)
          reject(error)
        }
      }

      img.onerror = () => {
        console.error('Failed to load image for optimization:', originalUrl)
        reject(new Error('Failed to load image'))
      }

      img.src = originalUrl
    })
  }

  private static calculateOptimalSize(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth
    let height = originalHeight

    // Scale down if larger than max dimensions
    if (width > maxWidth) {
      height = (height * maxWidth) / width
      width = maxWidth
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height
      height = maxHeight
    }

    // Ensure even dimensions for better compression
    width = Math.floor(width / 2) * 2
    height = Math.floor(height / 2) * 2

    return { width, height }
  }

  static clearCache(): void {
    this.cache.clear()
    console.log('🗑️ Image optimization cache cleared')
  }

  static getCacheSize(): number {
    return this.cache.size
  }

  static async preloadOptimized(urls: string[]): Promise<void> {
    console.log(`🚀 Preloading ${urls.length} optimized images...`)

    const promises = urls.map(url =>
      this.optimizeImage(url, 800, 600, 0.6, 'webp').catch(error => {
        console.warn(`Failed to preload ${url}:`, error)
        return null
      })
    )

    await Promise.allSettled(promises)
    console.log('✅ Preloading complete')
  }
}

// Progressive image loading with multiple quality levels
export class ProgressiveImageLoader {
  static async loadProgressive(
    originalUrl: string,
    onLowQuality?: (url: string) => void,
    onHighQuality?: (url: string) => void
  ): Promise<void> {
    try {
      // Load low quality first (fast)
      const lowQuality = await ImageOptimizer.optimizeImage(
        originalUrl,
        400,
        300,
        0.4,
        'jpeg'
      )
      onLowQuality?.(lowQuality.url)

      // Then load high quality (slower)
      const highQuality = await ImageOptimizer.optimizeImage(
        originalUrl,
        800,
        600,
        0.8,
        'webp'
      )
      onHighQuality?.(highQuality.url)

    } catch (error) {
      console.error('Progressive loading failed:', error)
    }
  }
}
