import { getMediaForStory } from './media'
import {
  aboutImages,
  mediaBackedProject,
  portfolioOwner,
  sectionOrder,
  sharedLinks,
  sharedNavigation,
} from './shared'
import type {
  CapabilityStory,
  ExperienceStory,
  PortfolioMetric,
  PortfolioPage,
  ProjectStory,
} from './types'

const mediaIdsFor = (storyId: string) => getMediaForStory(storyId).map(({ id }) => id)

const visualMetrics = [
  {
    value: '15x',
    label: 'Simulation speedup',
    context: 'CUDA-optimized scientific computing for tectonic-plate modeling.',
  },
  {
    value: '3D',
    label: 'Parametric product visualization',
    context: 'Measured room geometry, shelf configuration, validation, and export workflows.',
  },
  {
    value: 'Field-tested',
    label: 'Spatial autonomy research',
    context: 'Mission planning connected to real Drone Response aircraft and operator workflows.',
  },
  {
    value: '14+',
    label: 'Teaching and mentoring roles',
    context: 'Technical learning across computing, simulation, and extended reality.',
  },
] satisfies PortfolioMetric[]

const visualExperience = [
  {
    id: 'geoscience-visual-lab',
    period: 'Jan 2023 - Jul 2024',
    title: '3D Geoscience & Simulation',
    company: 'Pontificia Universidad Católica de Chile',
    summary:
      'Translated terrain, plate geometry, and scientific data into a three-dimensional simulation and visualization workflow.',
    contribution:
      'Built Python and CUDA processing around spatial models, then developed rendered views that make the subsurface system legible.',
    outcome:
      'A visual research pipeline paired with a 15x improvement in the underlying scientific-computing workload.',
    technologies: ['Python', 'CUDA', '3D Geometry', 'Scientific Visualization', 'Simulation'],
    mediaIds: mediaIdsFor('geoscience'),
  },
  {
    id: 'parametric-configurator-lab',
    period: '2026',
    title: 'Parametric 3D Configurator',
    company: 'Independent product visualization',
    summary:
      'A working Three.js system that turns room and shelving measurements into interactive spatial proposals.',
    contribution:
      'Built parametric scene geometry, plan and 3D editing views, validation around physical constraints, and model export paths.',
    outcome:
      'A repeatable visualization workflow for explaining layouts before fabrication or quotation.',
    technologies: ['TypeScript', 'Three.js', 'Parametric Geometry', 'Vite', 'Playwright'],
    mediaIds: mediaIdsFor('parametric-configurator'),
  },
  {
    id: 'drone-response-visual-lab',
    period: 'Jan 2024 - Mar 2024',
    title: 'Spatial Autonomy & Mission Planning',
    company: 'Drone Response, University of Notre Dame',
    summary:
      'Connected spatial interfaces, routing logic, and real aircraft into an emergency-response planning workflow.',
    contribution:
      'Implemented route planning, mission assignment, MQTT messaging, and assisted decisions around live field constraints.',
    outcome:
      'A field-connected planning system demonstrated in an international NASA- and NSF-backed research environment.',
    technologies: ['Python', 'Spatial Algorithms', 'MQTT', 'Angular', 'Java Spring'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  },
] satisfies ExperienceStory[]

const visualProjects = [
  mediaBackedProject({
    id: 'geoscience-simulation',
    slug: 'geoscience-simulation',
    title: 'Marga-Marga 3D geoscience pipeline',
    eyebrow: 'Scientific visualization',
    role: 'Simulation Engineer',
    period: 'Jan 2023 - Jul 2024',
    status: 'Completed research project',
    summary:
      'A rendered terrain and subsurface system grounded in scientific simulation and GPU computing.',
    problem:
      'Complex spatial data needed to become both computationally tractable and visually understandable.',
    contribution:
      'I built the Python and CUDA workflow and produced spatial views of terrain, plate surfaces, and modeled layers.',
    outcome: 'A 15x simulation speedup paired with a coherent set of 3D scientific visuals.',
    technologies: ['Python', 'CUDA', '3D Geometry', 'Simulation', 'Scientific Visualization'],
    mediaIds: mediaIdsFor('geoscience'),
  }),
  mediaBackedProject({
    id: 'parametric-configurator',
    slug: 'parametric-configurator',
    title: 'Parametric shelving configurator',
    eyebrow: 'Interactive 3D product visualization',
    role: 'Designer & Engineer',
    period: '2026',
    status: 'Working product demo',
    summary:
      'A browser-based toolkit for measured shelving layouts, quote previews, and exportable scene geometry.',
    problem:
      'Room constraints and shelving configurations are difficult to validate from measurements or flat proposals alone.',
    contribution:
      'I built interactive plan and 3D views, parametric geometry, constraint feedback, and export-oriented scene tooling.',
    outcome:
      'A repeatable way to inspect clearances, compare views, and communicate a proposed layout before delivery.',
    technologies: ['TypeScript', 'Three.js', 'Vite', 'Parametric Geometry', 'Playwright'],
    mediaIds: mediaIdsFor('parametric-configurator'),
  }),
  mediaBackedProject({
    id: 'drone-response-spatial-autonomy',
    slug: 'drone-response-spatial-autonomy',
    title: 'Drone Response spatial autonomy',
    eyebrow: 'Autonomous systems',
    role: 'AI Systems Developer',
    period: 'Jan 2024 - Mar 2024',
    status: 'Completed research engagement',
    summary:
      'Mission-planning logic and spatial interfaces for autonomous emergency-response aircraft.',
    problem:
      'Operators needed routes and resource assignments that could adapt to field conditions in real time.',
    contribution:
      'I implemented route optimization, mission assignment, MQTT integration, and OpenAI-assisted decision support.',
    outcome: 'Delivered planning logic connected to real aircraft and field-testing workflows.',
    technologies: ['Python', 'Algorithms', 'MQTT', 'Angular', 'OpenAI API'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  }),
] satisfies ProjectStory[]

const visualCapabilities = [
  {
    id: 'research-reference',
    title: 'Research and reference',
    summary: 'Start from measured constraints, scientific sources, and the real use context.',
    items: ['Spatial data', 'Scientific references', 'Field requirements', 'Visual research'],
    proofStoryIds: ['geoscience-simulation', 'drone-response-spatial-autonomy'],
  },
  {
    id: 'geometry-modeling',
    title: 'Geometry and modeling',
    summary: 'Build spatial systems whose structure follows data and user-controlled parameters.',
    items: ['Three.js', 'Parametric geometry', 'Scene graphs', 'Terrain models'],
    proofStoryIds: ['parametric-configurator', 'geoscience-simulation'],
  },
  {
    id: 'simulation-rendering',
    title: 'Simulation and rendering',
    summary: 'Connect computation to clear real-time and scientific visual output.',
    items: ['CUDA', 'Simulation', 'WebGL', 'Scientific visualization'],
    proofStoryIds: ['geoscience-simulation'],
  },
  {
    id: 'integration-delivery',
    title: 'Integration and delivery',
    summary: 'Turn visual systems into tested interfaces, exports, and operator-ready workflows.',
    items: ['TypeScript', 'Vite', 'Model export', 'Playwright', 'MQTT'],
    proofStoryIds: ['parametric-configurator', 'drone-response-spatial-autonomy'],
  },
] satisfies CapabilityStory[]

const visualAboutMediaIds = ['profile6-alt', 'geoscience7', 'profile1']

export const visualPortfolio = {
  mode: 'visual',
  path: '/visual',
  meta: {
    title: 'José Ernesto Carter Arriagada — VFX, 3D & Visual Computing',
    description:
      'Visual computing across real-time 3D, scientific visualization, simulation, and spatial autonomy.',
  },
  navigation: sharedNavigation,
  sections: sectionOrder,
  hero: {
    name: portfolioOwner.name,
    eyebrow: 'VFX, 3D & Visual Computing',
    title: 'Creative technologist building real-time graphics, simulation, and interactive 3D systems.',
    summary:
      'I connect computer science, spatial data, and visual tooling to make complex systems explorable and useful.',
    location: portfolioOwner.location,
    primaryCta: { label: 'Explore visual work', href: '#work' },
    secondaryCta: { label: 'Discuss a visual project', href: '#contact' },
  },
  metrics: visualMetrics,
  about: {
    heading: 'Where computation becomes spatial and visual',
    paragraphs: [
      'My visual-computing work grows from software engineering, simulation, and graphics rather than from invented production credits.',
      'I build interactive product visualization, technical 3D prototypes, scientific visuals, real-time spatial interfaces, and the pipeline tooling around them.',
      'The strongest current evidence is in geoscience modeling, parametric Three.js tools, and autonomous mission-planning research.',
    ],
    mediaIds: visualAboutMediaIds,
    images: aboutImages(visualAboutMediaIds),
  },
  experience: visualExperience,
  projects: visualProjects,
  capabilities: visualCapabilities,
  contact: {
    heading: 'Make a complex idea visible',
    body:
      'For interactive 3D, graphics prototypes, simulation visuals, spatial interfaces, or visual-computing collaboration, email me or find me online.',
    subject: 'Visual computing project',
    links: [sharedLinks.email, sharedLinks.github, sharedLinks.linkedIn],
  },
} satisfies PortfolioPage
