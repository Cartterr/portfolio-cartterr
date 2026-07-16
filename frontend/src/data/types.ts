export type PortfolioMode = 'software' | 'visual'

export type PortfolioLink = {
  label: string
  href: string
  external?: boolean
  download?: boolean
}

export type PortfolioMetric = {
  value: string
  label: string
  context: string
}

export type MediaFit = 'cover' | 'contain'
export type MediaPublication = 'approved' | 'restricted' | 'pending'

export type MediaRights = {
  owner: string
  source: string
  clearance: 'previously-published' | 'cleared-project-capture' | 'privacy-safe-replacement'
  replacementFor?: string
}

type PortfolioMediaBase = {
  id: string
  src: string
  thumbnail: string
  width: number
  height: number
  alt: string
  caption: string
  fit: MediaFit
  objectPosition: string
  rights: MediaRights
  publication: MediaPublication
  storyId: string
}

export type PortfolioImageSource = {
  type: 'image/avif' | 'image/webp' | 'image/jpeg'
  srcSet: string
}

export type PortfolioImageMedia = PortfolioMediaBase & {
  kind: 'image'
  sources?: PortfolioImageSource[]
}

export type PortfolioVideoMedia = PortfolioMediaBase & {
  kind: 'video'
  mimeType: 'video/mp4' | 'video/webm'
  durationSeconds: number
}

export type PortfolioMedia = PortfolioImageMedia | PortfolioVideoMedia

export type ExperienceStory = {
  id: string
  period: string
  title: string
  company: string
  summary: string
  contribution: string
  outcome: string
  technologies: string[]
  mediaIds: string[]
  link?: PortfolioLink
}

export type ProjectStory = {
  id: string
  slug: string
  title: string
  eyebrow: string
  role: string
  period: string
  status: string
  summary: string
  problem: string
  contribution: string
  outcome: string
  technologies: string[]
  mediaIds: string[]
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  link?: PortfolioLink
  private?: boolean
}

export type CapabilityStory = {
  id: string
  title: string
  summary: string
  items: string[]
  proofStoryIds: string[]
}

export type PortfolioSectionKind =
  | 'hero'
  | 'about'
  | 'experience'
  | 'work'
  | 'capabilities'
  | 'contact'

export type PortfolioSection = {
  id: string
  kind: PortfolioSectionKind
  label: string
}

export type PortfolioPage = {
  mode: PortfolioMode
  path: '/' | '/visual'
  meta: {
    title: string
    description: string
    canonical: string
    themeColor: string
    socialImage: string
    socialImageAlt: string
    twitterCard: 'summary' | 'summary_large_image'
  }
  navigation: Array<{ label: string; href: string }>
  sections: PortfolioSection[]
  hero: {
    name: string
    eyebrow: string
    title: string
    summary: string
    location: string
    primaryCta: PortfolioLink
    secondaryCta: PortfolioLink
  }
  metrics: PortfolioMetric[]
  about: {
    heading: string
    paragraphs: string[]
    mediaIds: string[]
    images: Array<{ src: string; alt: string; width: number; height: number }>
  }
  experience: ExperienceStory[]
  projects: ProjectStory[]
  capabilities: CapabilityStory[]
  contact: {
    heading: string
    body: string
    subject: string
    links: PortfolioLink[]
  }
}

export type CaseStudy = ProjectStory
export type ExperienceItem = ExperienceStory
export type CapabilityGroup = CapabilityStory
export type PortfolioContent = Pick<
  PortfolioPage,
  'hero' | 'metrics' | 'experience' | 'capabilities' | 'about' | 'contact'
> & {
  caseStudies: ProjectStory[]
}
