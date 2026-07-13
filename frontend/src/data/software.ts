import { getMediaForStory } from './media'
import {
  aboutImages,
  mediaBackedProject,
  portfolioOwner,
  sectionOrder,
  sharedLinks,
  sharedMetrics,
  sharedNavigation,
} from './shared'
import type {
  CapabilityStory,
  ExperienceStory,
  PortfolioPage,
  ProjectStory,
} from './types'

const mediaIdsFor = (storyId: string) => getMediaForStory(storyId).map(({ id }) => id)

const softwareExperience = [
  {
    id: 'dily',
    period: 'Sep 2025 - Present',
    title: 'Full Stack Developer',
    company: 'Dily',
    summary:
      'Build fintech and lending software end to end with clear domain boundaries and testable product flows.',
    contribution:
      'Work across TypeScript and Node.js services, Angular delivery, and lending-domain design in a real monorepo.',
    outcome:
      'Product changes land through DDD and hexagonal boundaries that keep core lending behavior maintainable.',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Nx', 'MySQL', 'PostgreSQL', 'AWS'],
    mediaIds: mediaIdsFor('dily'),
  },
  {
    id: 'gridworks',
    period: '2026 - Present',
    title: 'Lead Engineer, Alerting Platform Migration',
    company: 'GridWorks',
    summary:
      'Lead the rebuild of an industrial alerting platform with modular services and a safer migration path.',
    contribution:
      'Shape ingestion, rules, escalation, operator tooling, and rollout controls around operational parity.',
    outcome:
      'A disciplined modernization path that can replace legacy automation without abandoning live workflows.',
    technologies: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'PostgreSQL'],
    mediaIds: mediaIdsFor('gridworks'),
  },
  {
    id: 'flair',
    period: 'Dec 2024 - Jul 2025',
    title: 'Software Engineer',
    company: 'Flair',
    summary:
      'Built production services, enterprise UI, and time-series workflows for commercial-building energy optimization.',
    contribution:
      'Worked across Python services, Vue interfaces, AWS infrastructure, and high-frequency sensor data.',
    outcome:
      'Helped ship platform capabilities tied to measured HVAC efficiency gains of up to 50%.',
    technologies: ['Python', 'Vue.js', 'AWS', 'InfluxDB', 'DynamoDB'],
    mediaIds: mediaIdsFor('flair'),
    link: { label: 'Visit Flair', href: 'https://goflair.cl/', external: true },
  },
  {
    id: 'notreDame',
    period: 'Jan 2024 - Mar 2024',
    title: 'AI Systems Developer',
    company: 'Drone Response, University of Notre Dame',
    summary:
      'Implemented mission-planning logic for autonomous drone coordination in emergency-response research.',
    contribution:
      'Combined routing algorithms, MQTT messaging, and OpenAI-assisted decision support with the project’s Angular and Java systems.',
    outcome:
      'Delivered planning logic in an international NASA- and NSF-backed research environment.',
    technologies: ['Python', 'Algorithms', 'MQTT', 'OpenAI API', 'Angular', 'Java Spring'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  },
  {
    id: 'politiktok',
    period: 'Jul 2023 - Present',
    title: 'Data Science Researcher',
    company: 'Politiktok, Pontificia Universidad Católica de Chile',
    summary:
      'Build large-scale political-content research infrastructure with GPU-backed machine-learning and data workflows.',
    contribution:
      'Turn research questions into repeatable Python, PyTorch, CUDA, NLP, and PostgreSQL processing systems.',
    outcome: 'Processed more than 100,000 records and improved research-pipeline performance by 10x.',
    technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'Data Pipelines'],
    mediaIds: mediaIdsFor('politiktok'),
    link: { label: 'Visit Politiktok', href: 'https://politiktok.cl/', external: true },
  },
  {
    id: 'teaching',
    period: 'Mar 2023 - Present',
    title: 'Advanced Teaching Assistant & Technical Instructor',
    company: 'Pontificia Universidad Católica de Chile & Escuela Militar de Chile',
    summary:
      'Design and teach applied programming while supporting advanced computer-science courses and technical learners.',
    contribution:
      'Teach Python and AI applications and mentor work in operating systems, networks, high-performance computing, and extended reality.',
    outcome:
      'Earned the Advanced Teaching Assistant distinction across more than 14 teaching and mentoring roles.',
    technologies: ['Python', 'Software Testing', 'Operating Systems', 'HPC', 'Technical Communication'],
    mediaIds: mediaIdsFor('teaching'),
  },
  {
    id: 'geoscience',
    period: 'Jan 2023 - Jul 2024',
    title: 'Simulation Engineer',
    company: 'Pontificia Universidad Católica de Chile',
    summary:
      'Developed GPU-accelerated scientific software for tectonic-plate modeling and seismic-risk analysis.',
    contribution:
      'Built Python and CUDA simulation workflows for predictive analysis and large scientific datasets.',
    outcome: 'Optimized parallel algorithms to achieve a 15x performance improvement.',
    technologies: ['Python', 'CUDA', 'Optimization', 'Data Pipelines', 'Simulation'],
    mediaIds: mediaIdsFor('geoscience'),
  },
] satisfies ExperienceStory[]

const softwareProjects = [
  mediaBackedProject({
    id: 'gridworks-alerting-platform',
    slug: 'gridworks-alerting-platform',
    title: 'Production-safe alerting platform migration',
    eyebrow: 'GridWorks',
    role: 'Lead Engineer',
    period: '2026 - Present',
    status: 'Active production migration',
    summary:
      'An industrial alerting migration designed around operational parity, modular services, and safer rollout controls.',
    problem:
      'Legacy alerting workflows needed to move without losing ingestion, rules, escalation, and operator behavior.',
    contribution:
      'I lead the rebuild across alert lifecycle, escalation, ingestion logic, and production operator tooling.',
    outcome:
      'A controlled modernization path that preserves live workflows while replacing legacy automation.',
    technologies: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'PostgreSQL'],
    mediaIds: mediaIdsFor('gridworks'),
  }),
  mediaBackedProject({
    id: 'notre-dame-drone-response',
    slug: 'notre-dame-drone-response',
    title: 'Autonomous drone mission planning',
    eyebrow: 'Drone Response · University of Notre Dame',
    role: 'AI Systems Developer',
    period: 'Jan 2024 - Mar 2024',
    status: 'Completed research engagement',
    summary:
      'Smart Mission Planner logic for autonomous drone coordination in an emergency-response setting.',
    problem:
      'Emergency-response planning required route and resource-allocation logic under operational constraints.',
    contribution:
      'I implemented optimization, MQTT messaging, and OpenAI-assisted decision support for mission planning.',
    outcome: 'Delivered working planning logic in a NASA- and NSF-backed research environment.',
    technologies: ['Python', 'Algorithms', 'MQTT', 'OpenAI API', 'Angular', 'Java Spring'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  }),
  mediaBackedProject({
    id: 'politiktok-research-infrastructure',
    slug: 'politiktok-research-infrastructure',
    title: 'Politiktok research infrastructure',
    eyebrow: 'Pontificia Universidad Católica de Chile',
    role: 'Data Science Researcher',
    period: 'Jul 2023 - Present',
    status: 'Active research',
    summary:
      'Research infrastructure for repeatable political-media analysis across large datasets.',
    problem:
      'Funded research needed reliable software to process more than 100,000 records reproducibly.',
    contribution:
      'I built dataset-processing and GPU-backed machine-learning workflows with research-facing tools.',
    outcome: 'Processed 100,000+ records and improved research-pipeline performance by 10x.',
    technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'Data Engineering'],
    mediaIds: mediaIdsFor('politiktok'),
    link: { label: 'Visit Politiktok', href: 'https://politiktok.cl/', external: true },
  }),
  mediaBackedProject({
    id: 'geoscience-simulation',
    slug: 'cuda-geoscience-simulation',
    title: 'CUDA geoscience simulation',
    eyebrow: 'Pontificia Universidad Católica de Chile',
    role: 'Simulation Engineer',
    period: 'Jan 2023 - Jul 2024',
    status: 'Completed research project',
    summary: 'GPU-accelerated scientific software for tectonic-plate modeling.',
    problem:
      'Large scientific datasets and computationally intensive simulations needed efficient parallel processing.',
    contribution:
      'I developed Python and CUDA workflows for predictive analysis, terrain models, and plate geometry.',
    outcome: 'Achieved a 15x performance improvement in the scientific-computing workload.',
    technologies: ['Python', 'CUDA', 'Optimization', 'Data Pipelines', 'Simulation'],
    mediaIds: mediaIdsFor('geoscience'),
  }),
  mediaBackedProject({
    id: 'dily-fintech-systems',
    slug: 'dily-fintech-systems',
    title: 'Domain-driven lending systems',
    eyebrow: 'Dily',
    role: 'Full Stack Developer',
    period: 'Sep 2025 - Present',
    status: 'Active product engineering',
    summary: 'End-to-end fintech delivery around maintainable lending-domain boundaries.',
    problem:
      'Fast-moving lending flows need product flexibility without coupling core business rules to delivery details.',
    contribution:
      'I build TypeScript and Node.js services and Angular product flows using DDD and hexagonal architecture.',
    outcome: 'A testable product architecture that supports change across backend and frontend delivery.',
    technologies: ['TypeScript', 'Node.js', 'Angular', 'Nx', 'PostgreSQL', 'DDD'],
    mediaIds: mediaIdsFor('dily'),
  }),
  mediaBackedProject({
    id: 'flair-energy-systems',
    slug: 'flair-energy-systems',
    title: 'Commercial-building energy systems',
    eyebrow: 'Flair',
    role: 'Software Engineer',
    period: 'Dec 2024 - Jul 2025',
    status: 'Completed production role',
    summary: 'Production software for building controls, sensor data, and HVAC optimization.',
    problem:
      'Commercial-building operations need reliable controls and time-series visibility across connected devices.',
    contribution:
      'I shipped production services, enterprise UI, and high-frequency sensor-data workflows.',
    outcome: 'Contributed to platform capabilities tied to HVAC energy reductions of up to 50%.',
    technologies: ['Python', 'Vue.js', 'AWS', 'InfluxDB', 'DynamoDB'],
    mediaIds: mediaIdsFor('flair'),
    link: { label: 'Visit Flair', href: 'https://goflair.cl/', external: true },
  }),
] satisfies ProjectStory[]

const softwareCapabilities = [
  {
    id: 'product-platforms',
    title: 'Product and platform engineering',
    summary: 'Backend, frontend, and domain design for software that must keep changing safely.',
    items: ['TypeScript', 'Python', 'React', 'Node.js', 'Angular', 'Next.js'],
    proofStoryIds: ['dily-fintech-systems', 'gridworks-alerting-platform'],
  },
  {
    id: 'ai-data-research',
    title: 'AI, data, and research infrastructure',
    summary: 'Repeatable data and machine-learning systems that support real research questions.',
    items: ['PyTorch', 'NLP', 'PostgreSQL', 'Data pipelines', 'OpenAI API'],
    proofStoryIds: ['politiktok-research-infrastructure', 'notre-dame-drone-response'],
  },
  {
    id: 'simulation-gpu',
    title: 'Simulation, GPU, and scientific computing',
    summary: 'Parallel computing and spatial models for demanding scientific workloads.',
    items: ['CUDA', 'Optimization', 'Simulation', 'Scientific visualization'],
    proofStoryIds: ['geoscience-simulation'],
  },
  {
    id: 'production-autonomy',
    title: 'Production, autonomy, and connected systems',
    summary: 'Operational software that connects devices, operators, and automated decisions.',
    items: ['DDD', 'Hexagonal Architecture', 'AWS', 'Railway', 'MQTT'],
    proofStoryIds: ['gridworks-alerting-platform', 'notre-dame-drone-response'],
  },
] satisfies CapabilityStory[]

const aboutMediaIds = ['profile15', 'profile1', 'profile6-alt']

export const softwarePortfolio = {
  mode: 'software',
  path: '/',
  meta: {
    title: 'José Ernesto Carter Arriagada — Software Engineer',
    description:
      'Software engineering across reliable AI, data infrastructure, scientific computing, and autonomous systems.',
  },
  navigation: sharedNavigation,
  sections: sectionOrder,
  hero: {
    name: portfolioOwner.name,
    eyebrow: 'Software Engineering · AI · Data · Autonomy',
    title: 'Software engineer building reliable AI, data, and autonomous systems.',
    summary:
      'I build production software across AI systems, data infrastructure, scientific computing, and autonomous planning.',
    location: portfolioOwner.location,
    primaryCta: { label: 'Explore selected work', href: '#work' },
    secondaryCta: sharedLinks.cv,
  },
  metrics: sharedMetrics,
  about: {
    heading: 'Engineering across production and research',
    paragraphs: [
      'I am a software engineer based in Santiago, Chile. My work spans production backend and frontend systems, GPU-backed research infrastructure, scientific simulation, and autonomous mission planning.',
      'Across Dily, GridWorks, Flair, Notre Dame, Politiktok, and PUC, I have worked on fintech, industrial alerting, energy optimization, political-media research, drone coordination, and geoscience simulation.',
      'I am especially interested in applying AI to satellite data, simulation, and aerospace problems.',
    ],
    mediaIds: aboutMediaIds,
    images: aboutImages(aboutMediaIds.slice(0, 2)),
  },
  experience: softwareExperience,
  projects: softwareProjects,
  capabilities: softwareCapabilities,
  contact: {
    heading: 'Build something reliable',
    body:
      'For software engineering, AI systems, data infrastructure, scientific computing, or autonomous-systems work, email me or find me online.',
    subject: 'Software engineering project',
    links: [sharedLinks.email, sharedLinks.github, sharedLinks.linkedIn],
  },
} satisfies PortfolioPage
