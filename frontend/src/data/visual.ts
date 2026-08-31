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
    id: 'dily-software-engineer',
    period: 'Sep 2025 - Present',
    title: 'Software Engineer',
    company: 'Dily',
    summary:
      'Develop end-to-end automotive-finance workflows across TypeScript/Node.js services and Angular/Nx micro-frontends.',
    contribution:
      'Build modular production systems with cloud integrations, messaging, data persistence, observability, and automated testing.',
    outcome: 'Reliable production features delivered across product, frontend, backend, and operations.',
    technologies: ['TypeScript', 'Node.js', 'Angular', 'AWS', 'PostgreSQL'],
    mediaIds: mediaIdsFor('dily'),
  },
  {
    id: 'flair-software-engineer',
    period: 'Dec 2024 - Aug 2025',
    title: 'Software Engineer',
    company: 'Flair',
    summary:
      'Built software for an autonomous building-management platform monitoring energy and carbon-impact metrics.',
    contribution:
      'Maintained Python services, Vue/React interfaces, and high-frequency InfluxDB and DynamoDB integrations on AWS.',
    outcome: 'End-to-end product ownership in a fast-moving sustainability startup.',
    technologies: ['Python', 'Vue', 'React', 'AWS', 'InfluxDB'],
    mediaIds: mediaIdsFor('flair'),
  },
  {
    id: 'politiktok-research-engineer',
    period: 'Jul 2023 - Jul 2025',
    title: 'Research Software Engineer',
    company: 'Politiktok · Pontificia Universidad Católica de Chile',
    summary:
      'Led engineering of a Python/PostgreSQL research platform processing more than 100,000 social-media records.',
    contribution:
      'Built ingestion, processing, API, NLP, and visualization workflows for multidisciplinary Fondecyt research.',
    outcome: 'Approximately 10× faster processing and a peer-reviewed Springer publication.',
    technologies: ['Python', 'PostgreSQL', 'NLP', 'Data Engineering', 'APIs'],
    mediaIds: mediaIdsFor('politiktok'),
  },
  {
    id: 'geoscience-visual-lab',
    period: 'Aug 2022 - Dec 2024',
    title: 'Simulation Engineer',
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
    id: 'drone-response-visual-lab',
    period: 'Jan 2024 - Mar 2024',
    title: 'Software Engineer Intern',
    company: 'Drone Response · University of Notre Dame',
    summary:
      'Developed a smart mission-planning system for coordinated autonomous rescue-drone operations.',
    contribution:
      'Implemented Python route optimization, clustering, MQTT event communication, and backend integrations.',
    outcome:
      'Presented the field-connected system with an international multidisciplinary research team.',
    technologies: ['Python', 'Algorithms', 'MQTT', 'Java Spring', 'Spatial Planning'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  },
  {
    id: 'puc-senior-teaching-assistant',
    period: 'Mar 2023 - Jul 2025',
    title: 'Senior Teaching Assistant',
    company: 'Pontificia Universidad Católica de Chile',
    summary:
      'Completed more than 14 assistantships supporting over 100 students across systems, networks, HPC, XR, and testing.',
    contribution:
      'Delivered lectures, debugging support, practical activities, assessment feedback, and technical learning material.',
    outcome: 'Recognized as a Senior Teaching Assistant through the DCC UC program.',
    technologies: ['Systems', 'Networks', 'HPC', 'Software Testing', 'Technical Communication'],
    mediaIds: mediaIdsFor('ayudante'),
  },
  {
    id: 'escuela-militar-instructor',
    period: 'Jul 2024 - Jul 2026',
    title: 'Programming Instructor & Teaching Assistant',
    company: 'Escuela Militar',
    summary:
      'Taught introductory programming and problem-solving with Python to military cadets.',
    contribution:
      'Designed assessments and guided students through implementation and debugging of programming solutions.',
    outcome: 'Formally recognized by Escuela Militar and the Academic Vice-Rector of PUC.',
    technologies: ['Python', 'Teaching', 'Algorithms', 'Assessment Design', 'Mentoring'],
    mediaIds: mediaIdsFor('ayudante'),
  },
] satisfies ExperienceStory[]

const visualProjects = [
  mediaBackedProject({
    id: 'parametric-configurator',
    slug: 'parametric-configurator',
    title: 'Parametric 3D Configurator',
    eyebrow: 'Interactive geometry, constraints, visualization, and export tooling',
    role: 'Designer & Engineer',
    period: '2026',
    status: 'Working product demo',
    summary:
      'Built a browser-based parametric configurator using Three.js and TypeScript, translating structured product constraints into interactive 3D geometry, synchronized views, validation logic, and exportable outputs.',
    problem:
      'Room constraints and shelving configurations are difficult to validate from measurements or flat proposals alone.',
    technicalChallenge:
      'Keep plan and perspective views synchronized while enforcing clearances and producing reusable geometry.',
    contribution:
      'I built the parametric scene model, editing views, constraint feedback, validation, and export-oriented tooling.',
    outcome:
      'A repeatable way to inspect inputs, compare views, validate layouts, and communicate a proposal before delivery.',
    technologies: ['TypeScript', 'Three.js', 'Vite', 'Parametric Geometry', 'Playwright'],
    mediaIds: mediaIdsFor('parametric-configurator'),
  }),
  mediaBackedProject({
    id: 'personal-vfx-studies',
    slug: 'personal-vfx-studies',
    title: 'Personal VFX & Look Development Studies',
    eyebrow: 'Self-directed rendering, compositing, FX, lighting, and material exploration',
    role: 'Independent 3D / VFX Artist',
    period: 'Ongoing',
    status: 'Personal study collection',
    summary:
      'A curated set of personal renders developed while learning production-style 3D, VFX, compositing, look development, lighting, and rendering workflows.',
    problem:
      'Build practical visual fluency across different DCC applications, render engines, scene types, and finishing workflows.',
    technicalChallenge:
      'Move ideas from modeling and procedural experimentation through materials, lighting, rendering, compositing, and final presentation.',
    contribution:
      'I created the scenes and studies through self-directed practice, exploring environment work, character FX, hard-surface look development, and cinematic lighting.',
    outcome:
      'A growing visual laboratory that demonstrates curiosity across the full path from scene construction to final image.',
    technologies: [
      'Houdini',
      'Nuke',
      'Cinema 4D',
      'Blender',
      'Arnold',
      'Octane',
      'Redshift',
    ],
    mediaIds: mediaIdsFor('personal-vfx-studies'),
  }),
  mediaBackedProject({
    id: 'drone-response-spatial-autonomy',
    slug: 'drone-response-spatial-autonomy',
    title: 'Drone Response Mission Planner',
    eyebrow: 'Spatial planning and distributed coordination for autonomous rescue drones',
    role: 'Software Engineer Intern',
    period: 'Jan 2024 - Mar 2024',
    status: 'Completed research engagement',
    summary:
      'Developed a smart mission-planning system for coordinated rescue-drone operations during an international research placement.',
    problem:
      'Operators needed routes and resource assignments that could adapt to field conditions in real time.',
    technicalChallenge:
      'Coordinate route optimization, clustering, events, interfaces, and backend services across a multi-drone workflow.',
    contribution:
      'I implemented Python planning algorithms, MQTT communication, OpenAI-powered interfaces, and Java Spring services.',
    outcome:
      'A field-connected system presented at a university research fair with an international team.',
    technologies: ['Python', 'Algorithms', 'MQTT', 'OpenAI API', 'Java Spring'],
    mediaIds: mediaIdsFor('notreDame'),
    link: { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
  }),
  mediaBackedProject({
    id: 'politiktok-research-platform',
    slug: 'politiktok-research-platform',
    title: 'Research Data Platform',
    eyebrow: '100,000+ records and approximately 10× faster processing',
    role: 'Research Software Engineer',
    period: 'Jul 2023 - Jul 2025',
    status: 'Published research platform',
    summary:
      'Built a Python/PostgreSQL platform for large-scale social-media research across ingestion, processing, NLP, APIs, and visualization.',
    problem:
      'A multidisciplinary research team needed noisy, large-scale social data transformed into reliable, research-ready datasets.',
    technicalChallenge:
      'Scale ingestion and analysis while preserving reproducibility, traceability, and usable interfaces for researchers.',
    contribution:
      'I led platform engineering, parallelization, query optimization, pipeline redesign, APIs, and visualization workflows.',
    outcome:
      'More than 100,000 records processed, approximately 10× faster pipelines, and a peer-reviewed Springer article.',
    technologies: ['Python', 'PostgreSQL', 'Data Engineering', 'NLP', 'Visualization'],
    mediaIds: mediaIdsFor('politiktok'),
    link: {
      label: 'Read the Springer publication',
      href: 'https://link.springer.com/article/10.1007/s42438-026-00638-4',
      external: true,
    },
  }),
  mediaBackedProject({
    id: 'geoscience-simulation',
    slug: 'geoscience-simulation',
    title: '3D Geoscience Simulation Pipeline',
    eyebrow: 'Scientific computing, spatial data, and high-performance visualization',
    role: 'Simulation Engineer',
    period: 'Aug 2022 - Dec 2024',
    status: 'Completed research project',
    summary:
      'Developed scientific-computing and visualization workflows for tectonic plates, subduction zones, and adjacent crustal faults.',
    problem:
      'Complex spatial data needed to become both computationally tractable and visually understandable.',
    technicalChallenge:
      'Optimize large scientific workloads without losing the spatial structure needed for interpretable 3D views.',
    contribution:
      'I built Python, Tectosaur, Mapbox, Houdini, and Cinema 4D workflows for processing, simulation, and presentation.',
    outcome:
      'Up to a 15× performance improvement and research presented at the 2023 SSA Annual Meeting.',
    technologies: ['Python', 'Tectosaur', 'Mapbox', 'Houdini', 'High-Performance Computing'],
    mediaIds: mediaIdsFor('geoscience'),
  }),
] satisfies ProjectStory[]

const visualCapabilities = [
  {
    id: 'research-reference',
    title: 'Research and reference',
    summary: 'Review spatial data, scientific sources, field requirements, and visual references.',
    items: ['Spatial data', 'Scientific references', 'Field requirements', 'Visual research'],
    proofStoryIds: ['geoscience-simulation', 'drone-response-spatial-autonomy'],
  },
  {
    id: 'geometry-modeling',
    title: 'Geometry and modeling',
    summary: 'Build spatial systems whose structure follows data and user-controlled parameters.',
    items: ['Three.js', 'Blender', 'Cinema 4D', 'Parametric geometry', 'Scene graphs'],
    proofStoryIds: ['parametric-configurator', 'personal-vfx-studies', 'geoscience-simulation'],
  },
  {
    id: 'simulation-rendering',
    title: 'Simulation and rendering',
    summary: 'Connect computation and look development to clear real-time, cinematic, and scientific output.',
    items: ['Houdini', 'Arnold', 'Octane', 'Redshift', 'CUDA'],
    proofStoryIds: ['personal-vfx-studies', 'geoscience-simulation'],
  },
  {
    id: 'integration-delivery',
    title: 'Compositing and delivery',
    summary: 'Finish visual work through compositing, tested interfaces, exports, and operator-ready workflows.',
    items: ['Nuke', 'TypeScript', 'Vite', 'Model export', 'Playwright'],
    proofStoryIds: ['personal-vfx-studies', 'parametric-configurator', 'drone-response-spatial-autonomy'],
  },
] satisfies CapabilityStory[]

const visualAboutMediaIds = ['profile6-alt', 'geoscience7', 'profile1']

export const visualPortfolio = {
  mode: 'visual',
  path: '/visual',
  meta: {
    title: 'José Carter Arriagada — Production Technology, Tools & Simulation',
    socialTitle: 'José Carter — Production Technology, Tools & Simulation',
    description:
      'Software engineer building production tools, simulation systems, workflow automation, real-time 3D applications, and data-intensive platforms.',
    socialDescription:
      'Software engineering across production tooling, simulation, real-time 3D, distributed systems, and scientific visualization.',
    canonical: 'https://josecarter.dev/visual',
    themeColor: '#11100f',
    socialImage: 'https://josecarter.dev/og-jose-carter-visual.png',
    socialImageAlt:
      "José Carter's visual computing portfolio for real-time 3D, simulation, and spatial systems",
    twitterCard: 'summary_large_image',
  },
  navigation: sharedNavigation,
  sections: sectionOrder,
  hero: {
    name: portfolioOwner.name,
    eyebrow: 'SOFTWARE ENGINEER · ACM SIGGRAPH 2026 STUDENT VOLUNTEER',
    title: 'Production technology, technical tools, and simulation systems.',
    summary:
      'I build reliable software that turns complex data, workflows, and spatial problems into usable technical tools—from distributed production platforms and automation to real-time 3D and scientific visualization.',
    location: portfolioOwner.location,
    primaryCta: { label: 'View Selected Work', href: '#work' },
    secondaryCta: { label: 'Download Résumé', href: '/resume' },
  },
  metrics: visualMetrics,
  about: {
    heading: 'Visual computing and technical 3D',
    paragraphs: [
      'My visual-computing work combines software engineering, simulation, graphics, and technical 3D.',
      'I build interactive product visualization, technical 3D prototypes, scientific visuals, real-time spatial interfaces, and the pipeline tooling around them.',
      'Current projects include geoscience modeling, parametric Three.js tools, autonomous mission-planning research, and self-directed VFX and look-development studies.',
    ],
    mediaIds: visualAboutMediaIds,
    images: aboutImages(visualAboutMediaIds),
  },
  experience: visualExperience,
  projects: visualProjects,
  capabilities: visualCapabilities,
  contact: {
    heading: 'Contact',
    body:
      'For production technology, technical tooling, simulation, real-time 3D, or software-engineering opportunities, email me or find me online. Based in Santiago, Chile.',
    subject: 'Production technology opportunity',
    links: [sharedLinks.cv, sharedLinks.email, sharedLinks.github, sharedLinks.linkedIn],
  },
} satisfies PortfolioPage
