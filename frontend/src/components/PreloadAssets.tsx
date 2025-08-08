import { useEffect } from 'react'

const PreloadAssets = () => {
  useEffect(() => {
    const base = (import.meta.env as any).VITE_API_URL || '/api'
    const preload = async (url: string) => {
      try {
        const res = await fetch(url, { cache: 'default' })
        const data = await res.json()
        const list: { url: string }[] = data.images || []
        list.forEach(({ url }) => {
          const img = new Image()
          img.decoding = 'async'
          img.loading = 'eager'
          img.src = url
        })
      } catch {}
    }
    preload(`${base}/images`)
    preload(`${base}/images?q=profile`)
  }, [])
  return null
}

export default PreloadAssets


