// Dropbox direct links - no backend dependency, no caching issues
const DROPBOX_BASE = 'https://www.dropbox.com/scl/fi/feg6527t2o8nu35ckh1gr'

const imageUrls: Record<string, string> = {
  // Profile images
  'profile1.jpg': `${DROPBOX_BASE}/profile1.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile2.jpg': `${DROPBOX_BASE}/profile2.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile5.jpg': `${DROPBOX_BASE}/profile5.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile6.jpeg': `${DROPBOX_BASE}/profile6.jpeg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile6.jpg': `${DROPBOX_BASE}/profile6.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile7.jpg': `${DROPBOX_BASE}/profile7.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile8.jpg': `${DROPBOX_BASE}/profile8.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'profile9.jpg': `${DROPBOX_BASE}/profile9.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,

  // Flair images
  'flair1.jpg': `${DROPBOX_BASE}/flair1.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'flair2.png': `${DROPBOX_BASE}/flair2.png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'flair3.png': `${DROPBOX_BASE}/flair3.png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'flair4.png': `${DROPBOX_BASE}/flair4.png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,

  // ND images
  'nd1.jpg': `${DROPBOX_BASE}/nd1.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'nd2.png': `${DROPBOX_BASE}/nd2.png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'nd3.png': `${DROPBOX_BASE}/nd3.png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'nd4.JPG': `${DROPBOX_BASE}/nd4.JPG?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'nd5.jpg': `${DROPBOX_BASE}/nd5.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'nd6.jpg': `${DROPBOX_BASE}/nd6.jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,

  // Politiktok images
  'politiktok (1).png': `${DROPBOX_BASE}/politiktok%20(1).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (2).png': `${DROPBOX_BASE}/politiktok%20(2).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (3).png': `${DROPBOX_BASE}/politiktok%20(3).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (4).png': `${DROPBOX_BASE}/politiktok%20(4).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (5).png': `${DROPBOX_BASE}/politiktok%20(5).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (6).png': `${DROPBOX_BASE}/politiktok%20(6).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (7).png': `${DROPBOX_BASE}/politiktok%20(7).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (8).png': `${DROPBOX_BASE}/politiktok%20(8).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (9).png': `${DROPBOX_BASE}/politiktok%20(9).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (10).png': `${DROPBOX_BASE}/politiktok%20(10).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (11).png': `${DROPBOX_BASE}/politiktok%20(11).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'politiktok (12).png': `${DROPBOX_BASE}/politiktok%20(12).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,

  // Ayudante images
  'ayudante (1).jpg': `${DROPBOX_BASE}/ayudante%20(1).jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'ayudante (2).jpg': `${DROPBOX_BASE}/ayudante%20(2).jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'ayudante (3).jpg': `${DROPBOX_BASE}/ayudante%20(3).jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'ayudante (4).jpg': `${DROPBOX_BASE}/ayudante%20(4).jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'ayudante (5).jpg': `${DROPBOX_BASE}/ayudante%20(5).jpg?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,

  // Geoscience images
  'geoscience (1).png': `${DROPBOX_BASE}/geoscience%20(1).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (2).png': `${DROPBOX_BASE}/geoscience%20(2).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (3).png': `${DROPBOX_BASE}/geoscience%20(3).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (4).png': `${DROPBOX_BASE}/geoscience%20(4).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (5).png': `${DROPBOX_BASE}/geoscience%20(5).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (6).png': `${DROPBOX_BASE}/geoscience%20(6).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (7).png': `${DROPBOX_BASE}/geoscience%20(7).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (8).png': `${DROPBOX_BASE}/geoscience%20(8).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
  'geoscience (9).png': `${DROPBOX_BASE}/geoscience%20(9).png?rlkey=i5t1er3knootsqqr2ad9bhobh&raw=1`,
}

// Static image manifest - using external URLs
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
    url: imageUrls[name] || 'https://via.placeholder.com/400x300?text=Image+Not+Found'
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
