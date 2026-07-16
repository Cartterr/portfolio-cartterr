import { softwarePortfolio } from './software'
import type { PortfolioContent, PortfolioMode, PortfolioPage } from './types'
import { visualPortfolio } from './visual'

export { softwarePortfolio } from './software'
export { visualPortfolio } from './visual'
export type {
  CapabilityGroup,
  CapabilityStory,
  CaseStudy,
  ExperienceItem,
  ExperienceStory,
  MediaPublication,
  MediaRights,
  PortfolioContent,
  PortfolioImageMedia,
  PortfolioLink,
  PortfolioMedia,
  PortfolioMetric,
  PortfolioMode,
  PortfolioPage,
  MilestoneStory,
  ServiceStory,
  PortfolioVideoMedia,
  ProjectStory,
} from './types'

const portfolios: Record<PortfolioMode, PortfolioPage> = {
  software: softwarePortfolio,
  visual: visualPortfolio,
}

export const getPortfolio = (mode: PortfolioMode): PortfolioPage => portfolios[mode]

// Compatibility bridge for the Task 1 page shell. Later section tasks consume getPortfolio(mode)
// directly, but keeping this view avoids duplicating or weakening the new source of truth.
export const portfolioContent: PortfolioContent = {
  hero: softwarePortfolio.hero,
  metrics: softwarePortfolio.metrics,
  caseStudies: softwarePortfolio.projects,
  experience: softwarePortfolio.experience,
  capabilities: softwarePortfolio.capabilities,
  about: softwarePortfolio.about,
  contact: softwarePortfolio.contact,
}
