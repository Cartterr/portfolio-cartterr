import { useEffect } from 'react'
import { imageManifest, getImages } from '../imageManifest'

const PreloadAssets = () => {
  useEffect(() => {
    // Preload all images using the proper URLs
    Object.keys(imageManifest).forEach((category) => {
      const images = getImages(category as keyof typeof imageManifest)
      images.forEach(({ url }) => {
        const img = new Image()
        img.decoding = 'async'
        img.loading = 'eager'
        img.src = url
      })
    })
  }, [])
  return null
}

export default PreloadAssets


