import { getMedia } from './media'
import type {
  PortfolioLink,
  PortfolioMetric,
  PortfolioSection,
  ProjectStory,
} from './types'

export const portfolioOwner = {
  name: 'José Ernesto Carter Arriagada',
  location: 'Santiago, Chile',
} as const

export const sharedLinks = {
  cv: { label: 'Download CV', href: '/Jose_Carter_CV_Eng.pdf' },
  email: { label: 'Email', href: 'mailto:jose.carterx@gmail.com' },
  github: { label: 'GitHub', href: 'https://github.com/Cartterr', external: true },
  linkedIn: {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jose-carter-arriagada',
    external: true,
  },
} satisfies Record<string, PortfolioLink>

export const sharedMetrics = [
  {
    value: 'Up to 50%',
    label: 'HVAC energy reduction',
    context: 'Production work on Flair’s commercial-building energy optimization platform.',
  },
  {
    value: '100k+',
    label: 'Research records processed',
    context: 'GPU-backed Politiktok data and machine-learning workflows.',
  },
  {
    value: '15x',
    label: 'Geoscience simulation speedup',
    context: 'CUDA-optimized parallel algorithms for tectonic-plate modeling.',
  },
  {
    value: '14+',
    label: 'Teaching and mentoring roles',
    context: 'Advanced engineering courses at PUC and Escuela Militar de Chile.',
  },
] satisfies PortfolioMetric[]

export const sectionOrder = [
  { id: 'hero', kind: 'hero', label: 'Introduction' },
  { id: 'about', kind: 'about', label: 'About' },
  { id: 'experience', kind: 'experience', label: 'Experience' },
  { id: 'work', kind: 'work', label: 'Selected work' },
  { id: 'capabilities', kind: 'capabilities', label: 'Capabilities' },
  { id: 'contact', kind: 'contact', label: 'Contact' },
] satisfies PortfolioSection[]

export const sharedNavigation = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Contact', href: '#contact' },
]

export const mediaBackedProject = (
  project: Omit<ProjectStory, 'image' | 'imageAlt' | 'imageWidth' | 'imageHeight'>,
): ProjectStory => {
  const media = getMedia(project.mediaIds[0])
  return {
    ...project,
    image: media.src,
    imageAlt: media.alt,
    imageWidth: media.width,
    imageHeight: media.height,
  }
}

export const aboutImages = (mediaIds: string[]) =>
  mediaIds.map((mediaId) => {
    const media = getMedia(mediaId)
    return { src: media.src, alt: media.alt, width: media.width, height: media.height }
  })
