import profile5 from './assets/images/profile5.jpg'
import profile2 from './assets/images/profile2.jpg'
import profile6jpeg from './assets/images/profile6.jpeg'
import profile7 from './assets/images/profile7.jpg'
import flair1 from './assets/images/flair1.jpg'
import flair2 from './assets/images/flair2.png'
import flair3 from './assets/images/flair3.png'
import flair4 from './assets/images/flair4.png'
import nd3 from './assets/images/nd3.png'
import nd5 from './assets/images/nd5.jpg'
import nd6 from './assets/images/nd6.jpg'
import politiktok1 from './assets/images/politiktok (1).png'
import politiktok3 from './assets/images/politiktok (3).png'
import politiktok5 from './assets/images/politiktok (5).png'
import politiktok8 from './assets/images/politiktok (8).png'
import ayudante5 from './assets/images/ayudante (5).jpg'
import ayudante3 from './assets/images/ayudante (3).jpg'
import ayudante4 from './assets/images/ayudante (4).jpg'
import geoscience8 from './assets/images/geoscience (8).png'
import geoscience9 from './assets/images/geoscience (9).png'
import geoscience6 from './assets/images/geoscience (6).png'
import geoscience1 from './assets/images/geoscience (1).png'

export type GalleryKey =
  | 'profile'
  | 'flair'
  | 'nd'
  | 'politiktok'
  | 'ayudante'
  | 'geoscience'

export type GalleryImage = {
  name: string
  url: string
}

const galleries: Record<GalleryKey, GalleryImage[]> = {
  profile: [
    { name: 'profile5.jpg', url: profile5 },
    { name: 'profile2.jpg', url: profile2 },
    { name: 'profile6.jpeg', url: profile6jpeg },
    { name: 'profile7.jpg', url: profile7 },
  ],
  flair: [
    { name: 'flair1.jpg', url: flair1 },
    { name: 'flair2.png', url: flair2 },
    { name: 'flair3.png', url: flair3 },
    { name: 'flair4.png', url: flair4 },
  ],
  nd: [
    { name: 'nd3.png', url: nd3 },
    { name: 'nd5.jpg', url: nd5 },
    { name: 'nd6.jpg', url: nd6 },
  ],
  politiktok: [
    { name: 'politiktok (1).png', url: politiktok1 },
    { name: 'politiktok (3).png', url: politiktok3 },
    { name: 'politiktok (5).png', url: politiktok5 },
    { name: 'politiktok (8).png', url: politiktok8 },
  ],
  ayudante: [
    { name: 'ayudante (5).jpg', url: ayudante5 },
    { name: 'ayudante (3).jpg', url: ayudante3 },
    { name: 'ayudante (4).jpg', url: ayudante4 },
  ],
  geoscience: [
    { name: 'geoscience (8).png', url: geoscience8 },
    { name: 'geoscience (9).png', url: geoscience9 },
    { name: 'geoscience (6).png', url: geoscience6 },
    { name: 'geoscience (1).png', url: geoscience1 },
  ],
}

export const getImages = (group: GalleryKey): GalleryImage[] => galleries[group]
export const getFeaturedImage = (group: GalleryKey): GalleryImage | null => galleries[group][0] ?? null
