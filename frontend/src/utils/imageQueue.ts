export interface QueuedImage {
  url: string
  onSuccess: (url: string) => void
  onError: (error: Error) => void
  retryCount?: number
}

const proxify = (url: string): string => `/api/proxy-image?src=${encodeURIComponent(url)}`

class ImageQueue {
  private queue: QueuedImage[] = []
  private isProcessing = false
  private maxRetries = 3
  private retryDelay = 1000

  async add(item: QueuedImage): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        ...item,
        retryCount: item.retryCount || 0,
        onSuccess: (url) => {
          item.onSuccess(url)
          resolve()
        },
        onError: (error) => {
          item.onError(error)
          reject(error)
        }
      })
      if (!this.isProcessing) {
        this.processQueue()
      }
    })
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }
    this.isProcessing = true
    while (this.queue.length > 0) {
      const item = this.queue.shift()!
      try {
        await this.loadSingleImage(item)
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        if (item.retryCount! < this.maxRetries) {
          this.queue.unshift({
            ...item,
            retryCount: item.retryCount! + 1
          })
          await new Promise(resolve => setTimeout(resolve, this.retryDelay * Math.pow(2, item.retryCount!)))
        } else {
          item.onError(error as Error)
        }
      }
    }
    this.isProcessing = false
  }

  private async resizeIfNeeded(url: string, naturalWidth: number, naturalHeight: number): Promise<string> {
    const maxW = 1280
    const maxH = 720
    if (naturalWidth <= maxW && naturalHeight <= maxH) return url
    try {
      const res = await fetch(proxify(url), { cache: 'force-cache' })
      if (!res.ok) return url
      const blob = await res.blob()
      const bitmap = await createImageBitmap(blob)
      let targetW = bitmap.width
      let targetH = bitmap.height
      if (targetW > maxW) {
        targetH = Math.round((targetH * maxW) / targetW)
        targetW = maxW
      }
      if (targetH > maxH) {
        targetW = Math.round((targetW * maxH) / targetH)
        targetH = maxH
      }
      const useOffscreen = typeof (globalThis as any).OffscreenCanvas !== 'undefined'
      const canvas: any = useOffscreen ? new (globalThis as any).OffscreenCanvas(targetW, targetH) : document.createElement('canvas')
      if (!useOffscreen) {
        canvas.width = targetW
        canvas.height = targetH
      }
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      ctx.drawImage(bitmap, 0, 0, targetW, targetH)
      if (useOffscreen && typeof canvas.convertToBlob === 'function') {
        const out = await canvas.convertToBlob({ type: 'image/webp', quality: 0.6 })
        return URL.createObjectURL(out)
      }
      const out: Blob = await new Promise((resolve, reject) => {
        (canvas as HTMLCanvasElement).toBlob(b => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/webp', 0.6)
      })
      return URL.createObjectURL(out)
    } catch {
      return url
    }
  }

  private loadSingleImage(item: QueuedImage): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      let settled = false
      const done = async () => {
        if (settled) return
        settled = true
        let finalUrl = item.url
        try {
          finalUrl = await this.resizeIfNeeded(item.url, img.naturalWidth, img.naturalHeight)
        } catch {}
        item.onSuccess(finalUrl)
        resolve()
      }
      const fail = () => {
        if (settled) return
        settled = true
        reject(new Error('Image failed to load'))
      }
      const timeout = setTimeout(() => {
        img.onload = null
        img.onerror = null
        fail()
      }, 15000)
      img.onload = () => {
        clearTimeout(timeout)
        if (typeof (img as any).decode === 'function') {
          ;(img as any).decode().then(done).catch(done)
        } else {
          done()
        }
      }
      img.onerror = () => {
        clearTimeout(timeout)
        fail()
      }
      img.src = proxify(item.url)
    })
  }

  getQueueLength(): number {
    return this.queue.length
  }

  clear(): void {
    this.queue = []
  }
}

export const imageQueue = null as unknown as never
