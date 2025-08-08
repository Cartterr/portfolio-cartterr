// Static image manifest - images served from public directory
export const imageManifest = {
  profile: [
    'profile1.jpg',
    'profile2.jpg',
    'profile5.jpg',
    'profile6.jpeg',
    'profile6.jpg',
    'profile7.jpg',
    'profile8.jpg',
    'profile9.jpg'
  ],
  flair: [
    'flair1.jpg',
    'flair2.png',
    'flair3.png',
    'flair4.png'
  ],
  nd: [
    'nd1.jpg',
    'nd2.png',
    'nd3.png',
    'nd4.JPG',
    'nd5.jpg',
    'nd6.jpg'
  ],
  politiktok: [
    'politiktok (1).png',
    'politiktok (2).png',
    'politiktok (3).png',
    'politiktok (4).png',
    'politiktok (5).png',
    'politiktok (6).png',
    'politiktok (7).png',
    'politiktok (8).png',
    'politiktok (9).png',
    'politiktok (10).png',
    'politiktok (11).png',
    'politiktok (12).png'
  ],
  ayudante: [
    'ayudante (1).jpg',
    'ayudante (2).jpg',
    'ayudante (3).jpg',
    'ayudante (4).jpg',
    'ayudante (5).jpg'
  ],
  geoscience: [
    'geoscience (1).png',
    'geoscience (2).png',
    'geoscience (3).png',
    'geoscience (4).png',
    'geoscience (5).png',
    'geoscience (6).png',
    'geoscience (7).png',
    'geoscience (8).png',
    'geoscience (9).png'
  ]
}

export const getImages = (category: keyof typeof imageManifest) => {
  const images = imageManifest[category] || []
  return images.map(name => ({
    name,
    url: `/images/${name}?v=${Date.now()}` // Add cache busting
  }))
}

export const getShuffledImages = (category: keyof typeof imageManifest) => {
  const images = getImages(category)
  const shuffled = [...images].sort(() => Math.random() - 0.5)

  // Ensure profile1.jpg is first for profile category
  if (category === 'profile') {
    const profile1 = shuffled.find(img => img.name.toLowerCase() === 'profile1.jpg')
    if (profile1) {
      const others = shuffled.filter(img => img.name.toLowerCase() !== 'profile1.jpg')
      return [profile1, ...others]
    }
  }

  return shuffled
}
