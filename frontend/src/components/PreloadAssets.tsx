import { useEffect } from 'react'
import { imageManifest } from '../imageManifest'

const PreloadAssets = () => {
  useEffect(() => {
    // Preload all images from the manifest
    const allImages = Object.values(imageManifest).flat()
    allImages.forEach((name) => {
      const img = new Image()
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = `/images/${name}`
    })
  }, [])
  return null
}

export default PreloadAssets


