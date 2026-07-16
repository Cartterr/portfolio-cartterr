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
  MilestoneStory,
  PortfolioPage,
  ProjectStory,
  ServiceStory,
} from './types'

const mediaIdsFor = (storyId: string) => getMediaForStory(storyId).map(({ id }) => id)

const softwareExperience = [
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
    links: [
      {
        label: 'Open the GridWorks alerting platform',
        href: 'https://alerta.gridworks.cl/',
        external: true,
      },
    ],
  },
  {
    id: 'dily',
    period: 'Sep 2025 - Present',
    title: 'Software Engineer · Full Stack Developer',
    company: 'Dily',
    summary:
      'Build fintech and lending software end to end with clear domain boundaries and testable product flows.',
    contribution:
      'Work across TypeScript and Node.js services, Angular delivery, and lending-domain design in a real monorepo.',
    outcome:
      'Product changes land through DDD and hexagonal boundaries that keep core lending behavior maintainable.',
    technologies: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Nx', 'MySQL', 'PostgreSQL', 'AWS'],
    mediaIds: mediaIdsFor('dily'),
    links: [{ label: 'Visit Dily', href: 'https://www.dily.cl/', external: true }],
  },
  {
    id: 'flair',
    period: 'Dec 2024 - Aug 2025',
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
    links: [{ label: 'Visit Flair', href: 'https://goflair.cl/', external: true }],
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
    links: [
      { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
      {
        label: 'View the research-fair presentation',
        href: 'https://es.linkedin.com/posts/jose-carter-arriagada_investigaci%C3%B3n-innovaci%C3%B3n-tecnolog%C3%ADa-activity-7254333344656584704-uCV_',
        external: true,
      },
    ],
  },
  {
    id: 'politiktok',
    period: 'Jul 2023 - Present',
    title: 'Data Science Researcher',
    company: 'Politiktok, Pontificia Universidad Católica de Chile',
    summary:
      'Built the data foundation for large-scale TikTok research and contributed as a Data Scientist to my second published paper, “Political Subjectification on TikTok: A Postdigital Mode of Inquiry for Tracing Affects Among Chilean Youth,” published by Springer Nature on 6 April 2026.',
    contribution:
      'Built data-mining and processing workflows for dataset consolidation, quality checks, deduplication, transcription processing, analytical variables, and feature engineering.',
    outcome:
      'Published a peer-reviewed paper in Postdigital Science and Education while contributing the technical research pipeline.',
    technologies: [
      'Python',
      'PyTorch',
      'CUDA',
      'NLP',
      'PostgreSQL',
      'Data Mining',
      'Feature Engineering',
      'Data Pipelines',
    ],
    mediaIds: mediaIdsFor('politiktok'),
    links: [
      {
        label: 'Read the published Springer paper',
        href: 'https://doi.org/10.1007/s42438-026-00638-4',
        external: true,
      },
      { label: 'Explore Politiktok', href: 'https://politiktok.cl/', external: true },
      {
        label: 'Read the publication announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7450175859099095041/',
        external: true,
      },
    ],
  },
  {
    id: 'teaching-puc',
    period: 'Mar 2023 - Present',
    title: 'Advanced Teaching Assistant & Technical Mentor',
    company: 'Pontificia Universidad Católica de Chile',
    summary:
      'Support advanced computer-science courses through teaching, mentoring, learning activities, and technical course material.',
    contribution:
      'Mentor work in operating systems, networks, high-performance computing, extended reality, and Exploratorio de Computación.',
    outcome:
      'Earned the Advanced Teaching Assistant distinction across more than 14 teaching and mentoring roles.',
    technologies: ['Python', 'Software Testing', 'Operating Systems', 'HPC', 'Technical Communication'],
    mediaIds: mediaIdsFor('teaching'),
  },
  {
    id: 'escuela-militar',
    period: 'Jul 2024 - Dec 2025',
    title: 'Programming Instructor',
    company: 'Escuela Militar de Chile',
    summary:
      'Taught Introduction to Programming with Python to military cadets through the UC-Escuela Militar collaboration.',
    contribution:
      'Designed instruction, practical assessments, and academic support around functions, lists, control structures, and computational problem solving.',
    outcome:
      'Received formal teaching recognition for the second semester of 2024 and completed the role in December 2025.',
    technologies: ['Python', 'Teaching', 'Assessment Design', 'Technical Communication'],
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
    links: [
      {
        label: 'Open the GridWorks alerting platform',
        href: 'https://alerta.gridworks.cl/',
        external: true,
      },
    ],
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
    links: [
      { label: 'Visit Drone Response', href: 'https://droneresponse.ai/', external: true },
      {
        label: 'View the research-fair presentation',
        href: 'https://es.linkedin.com/posts/jose-carter-arriagada_investigaci%C3%B3n-innovaci%C3%B3n-tecnolog%C3%ADa-activity-7254333344656584704-uCV_',
        external: true,
      },
    ],
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
      'Research infrastructure and a technical data pipeline for repeatable political-media analysis across large TikTok datasets.',
    problem:
      'The ANID-funded Fondecyt project needed a reproducible data foundation for interdisciplinary research into how Chilean youth express political and social opinions on TikTok.',
    contribution:
      'I built the data-mining pipeline: dataset consolidation, cleaning and normalization, video deduplication, transcription filtering and processing, analytical variables, and feature engineering—transforming noisy, real-world social-media data into structured, research-ready datasets.',
    outcome:
      'Enabled computational analysis of political discourse at scale and contributed as Data Scientist to the 6 April 2026 Springer Nature publication “Political Subjectification on TikTok: A Postdigital Mode of Inquiry for Tracing Affects Among Chilean Youth” in Postdigital Science and Education.',
    technologies: [
      'Python',
      'PyTorch',
      'CUDA',
      'NLP',
      'PostgreSQL',
      'Data Mining',
      'Feature Engineering',
      'Data Engineering',
    ],
    mediaIds: mediaIdsFor('politiktok'),
    links: [
      {
        label: 'Read the published Springer paper',
        href: 'https://doi.org/10.1007/s42438-026-00638-4',
        external: true,
      },
      { label: 'Explore Politiktok', href: 'https://politiktok.cl/', external: true },
      {
        label: 'Read the publication announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7450175859099095041/',
        external: true,
      },
    ],
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
    links: [
      {
        label: 'Explore the visual geoscience case study',
        href: '/visual#visual-project-geoscience-simulation',
      },
    ],
  }),
  mediaBackedProject({
    id: 'dily-fintech-systems',
    slug: 'dily-fintech-systems',
    title: 'Domain-driven lending systems',
    eyebrow: 'Dily',
    role: 'Software Engineer · Full Stack Developer',
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
    links: [{ label: 'Visit Dily', href: 'https://www.dily.cl/', external: true }],
  }),
  mediaBackedProject({
    id: 'flair-energy-systems',
    slug: 'flair-energy-systems',
    title: 'Commercial-building energy systems',
    eyebrow: 'Flair',
    role: 'Software Engineer',
    period: 'Dec 2024 - Aug 2025',
    status: 'Completed production role',
    summary: 'Production software for building controls, sensor data, and HVAC optimization.',
    problem:
      'Commercial-building operations need reliable controls and time-series visibility across connected devices.',
    contribution:
      'I shipped production services, enterprise UI, and high-frequency sensor-data workflows.',
    outcome: 'Contributed to platform capabilities tied to HVAC energy reductions of up to 50%.',
    technologies: ['Python', 'Vue.js', 'AWS', 'InfluxDB', 'DynamoDB'],
    mediaIds: mediaIdsFor('flair'),
    links: [{ label: 'Visit Flair', href: 'https://goflair.cl/', external: true }],
  }),
] satisfies ProjectStory[]

const softwareCapabilities = [
  {
    id: 'product-platforms',
    title: 'Product and platform engineering',
    summary: 'Backend, frontend, and domain design for software that must keep changing safely.',
    items: [
      'TypeScript',
      'Python',
      'React',
      'Node.js',
      'Angular',
      'Next.js',
      'Flask',
      'Django',
      'Design Patterns',
      'Functional Programming',
      'Unit Testing',
    ],
    proofStoryIds: ['dily-fintech-systems', 'gridworks-alerting-platform'],
  },
  {
    id: 'ai-data-research',
    title: 'AI, data, and research infrastructure',
    summary: 'Repeatable data and machine-learning systems that support real research questions.',
    items: ['PyTorch', 'NLP', 'Pandas', 'NumPy', 'PostgreSQL', 'Data pipelines', 'OpenAI API'],
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
    items: [
      'DDD',
      'Hexagonal Architecture',
      'Distributed Systems',
      'Docker',
      'AWS EC2 / S3 / Lambda',
      'Azure',
      'Railway',
      'MQTT',
    ],
    proofStoryIds: ['gridworks-alerting-platform', 'notre-dame-drone-response'],
  },
] satisfies CapabilityStory[]

const softwareServices = [
  {
    id: 'research-engineering',
    title: 'Research engineering',
    summary:
      'Technical foundations for computational research, from online data collection to reproducible analysis pipelines.',
    items: ['Data mining', 'NLP pipelines', 'Research prototypes', 'Online research'],
  },
  {
    id: 'custom-software-saas',
    title: 'Custom software & SaaS',
    summary:
      'End-to-end product and platform delivery for teams that need dependable software shaped around their domain.',
    items: ['Web applications', 'Backend systems', 'SaaS platforms', 'IT consulting'],
  },
  {
    id: 'data-analytics',
    title: 'Data & analytics',
    summary:
      'Structured data products that turn operational or research information into reliable decisions.',
    items: ['Business analytics', 'Information management', 'Feature engineering', 'Dashboards'],
  },
  {
    id: 'cloud-database-delivery',
    title: 'Cloud & database delivery',
    summary:
      'Production-ready cloud applications and database systems with a practical focus on maintainability and operations.',
    items: ['Cloud applications', 'Database design', 'Deployment pipelines', 'System integration'],
  },
  {
    id: 'spatial-computing-ar',
    title: 'Spatial computing & AR prototyping',
    summary:
      'Prototype spatial interfaces and context-aware experiences for smart glasses, mobile AR, and immersive devices.',
    items: ['Smart-glasses concepts', 'Spatial UI', 'Unity / WebXR', 'Computer vision integration'],
  },
  {
    id: 'agentic-ai-automation',
    title: 'Agentic AI & automation',
    summary:
      'Design reliable tool-using agents and multi-step automation pipelines with evaluation, observability, and human control.',
    items: ['Agent workflows', 'RAG & knowledge systems', 'API / browser automation', 'Evaluations & observability'],
  },
] satisfies ServiceStory[]

const aboutMediaIds = mediaIdsFor('profile')

const softwareMilestones = [
  {
    id: 'puc-computer-engineering',
    category: 'Education',
    period: '2025',
    title: 'Computer Engineering with distinction',
    issuer: 'Pontificia Universidad Católica de Chile',
    summary:
      'Ingeniero Civil en Ciencias de la Computación, with a Major in Software Engineering and a Minor in Data Science; graduated with distinction.',
    skills: ['Software Engineering', 'Data Science', 'Computer Science'],
    mediaId: 'profile14',
    links: [
      {
        label: 'View graduation announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7416418691279491072/',
        external: true,
      },
    ],
  },
  {
    id: 'politiktok-publication',
    category: 'Publication & communication',
    period: '6 Apr 2026',
    title: 'Second published paper · PoliTikTok',
    issuer: 'Springer Nature · Postdigital Science and Education',
    summary:
      'Contributed as Data Scientist to a peer-reviewed study of political subjectification among Chilean youth, backed by a technical pipeline developed since 2023.',
    skills: ['Data Mining', 'NLP', 'Feature Engineering'],
    mediaId: 'politiktok1',
    links: [
      {
        label: 'Read the DOI publication',
        href: 'https://doi.org/10.1007/s42438-026-00638-4',
        external: true,
      },
      { label: 'Explore Politiktok', href: 'https://politiktok.cl/', external: true },
      {
        label: 'Read the publication announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7450175859099095041/',
        external: true,
      },
    ],
  },
  {
    id: 'drone-response-presentation',
    category: 'Publication & communication',
    period: '2024',
    title: 'Drone Response Research-Fair Presentation',
    issuer: 'Dirección de Investigación e Innovación · Pontificia Universidad Católica de Chile',
    summary:
      'Presented the University of Notre Dame undergraduate research internship and its emergency-response mission-planning work at a public research fair.',
    skills: ['Research Communication', 'Autonomous Systems', 'AI'],
    mediaId: 'profile6-alt',
    links: [
      {
        label: 'View the research-fair post',
        href: 'https://es.linkedin.com/posts/jose-carter-arriagada_investigaci%C3%B3n-innovaci%C3%B3n-tecnolog%C3%ADa-activity-7254333344656584704-uCV_',
        external: true,
      },
    ],
  },
  {
    id: 'siggraph-2026',
    category: 'Recognition & community',
    period: '19-23 Jul 2026',
    title: 'SIGGRAPH 2026 Student Volunteer',
    issuer: 'ACM SIGGRAPH · Los Angeles',
    summary:
      'Selected to volunteer at SIGGRAPH 2026 and engage with current work in computer graphics, VFX, AI, real-time 3D, and XR.',
    skills: ['Computer Graphics', 'Real-time 3D', 'XR'],
    mediaId: 'siggraph-2026',
    links: [
      {
        label: 'View SIGGRAPH announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7483217477687160832/',
        external: true,
      },
    ],
  },
  {
    id: 'sa-sgw-2026',
    category: 'Recognition & community',
    period: 'Apr 2026',
    title: 'SA-SGW 2026 Delegate',
    issuer: 'Space Generation Advisory Council',
    summary:
      'Selected for the 10th South American Space Generation Workshop, exploring satellite communications, Earth-observation data, embedded mission software, and predictive models for space-industry applications.',
    skills: ['Space Technology', 'Earth Observation', 'Embedded Systems'],
    mediaId: 'profile15',
    links: [
      {
        label: 'View delegate announcement',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7447991715988393984/',
        external: true,
      },
      {
        label: 'View delegate credential',
        href: 'https://www.linkedin.com/in/jose-carter-arriagada/overlay/Certifications/521708200/treasury/?profileId=ACoAADWtRhwBN0Ai8iteXt0wHHx8ukN9TA8aNs4',
        external: true,
      },
    ],
  },
  {
    id: 'ayudante-senior',
    category: 'Recognition & community',
    period: 'Nov 2025',
    title: 'Ayudante Senior DCC UC',
    issuer: 'Computer Science Department · Pontificia Universidad Católica de Chile',
    summary:
      'Recognized for sustained teaching work, including lectures, learning activities, and course material for Exploratorio de Computación.',
    skills: ['Teaching', 'Communication', 'Course Design'],
    mediaId: 'profile10',
    links: [
      {
        label: 'View recognition post',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7411828564930588673/',
        external: true,
      },
      {
        label: 'View Ayudante Senior credential',
        href: 'https://www.linkedin.com/in/jose-carter-arriagada/overlay/Certifications/1886910690/treasury/?profileId=ACoAADWtRhwBN0Ai8iteXt0wHHx8ukN9TA8aNs4',
        external: true,
      },
    ],
  },
  {
    id: 'escuela-militar-recognition',
    category: 'Recognition & community',
    period: 'Nov 2024',
    title: 'Escuela Militar Teaching Recognition',
    issuer: 'Escuela Militar · UC collaboration',
    summary:
      'Recognized for teaching Introduction to Programming with Python to military cadets during the second semester of 2024.',
    skills: ['Python', 'Teaching', 'Assessment Design'],
    mediaId: 'profile9',
    links: [
      {
        label: 'View Escuela Militar credential',
        href: 'https://www.linkedin.com/in/jose-carter-arriagada/overlay/Certifications/1930234283/treasury/?profileId=ACoAADWtRhwBN0Ai8iteXt0wHHx8ukN9TA8aNs4',
        external: true,
      },
    ],
  },
  {
    id: 'khipu-2025',
    category: 'Recognition & community',
    period: 'Mar 2025',
    title: 'KHIPU 2025 · Latin American Meeting in Artificial Intelligence',
    issuer: 'Khipu AI',
    summary:
      'Participated in the Latin American AI and machine-learning community through KHIPU 2025.',
    skills: ['Artificial Intelligence', 'Machine Learning'],
    mediaId: 'profile1',
    links: [
      {
        label: 'Verify KHIPU credential',
        href: 'https://www.ecertificate.cl/certificate/572/29865?correlativo=1',
        external: true,
      },
      {
        label: 'View KHIPU LinkedIn credential',
        href: 'https://www.linkedin.com/in/jose-carter-arriagada/overlay/Certifications/1658079061/treasury/?profileId=ACoAADWtRhwBN0Ai8iteXt0wHHx8ukN9TA8aNs4',
        external: true,
      },
    ],
  },
] satisfies MilestoneStory[]

const softwareNavigation = sharedNavigation.flatMap((item) => {
  const entry = { ...item, href: `#software-${item.href.slice(1)}` }
  return item.href === '#about'
    ? [entry, { label: 'Milestones', href: '#software-milestones' }]
    : [entry]
})

const softwareSections = sectionOrder.flatMap((section) =>
  section.id === 'about'
    ? [section, { id: 'milestones', kind: 'milestones' as const, label: 'Milestones' }]
    : [section],
)

export const softwarePortfolio = {
  mode: 'software',
  path: '/',
  meta: {
    title: 'José Carter — Software Engineer for AI, Data & Autonomous Systems',
    description:
      'José Carter builds production software, AI and data infrastructure, scientific computing platforms, and autonomous systems.',
    canonical: 'https://josecarter.dev/',
    themeColor: '#111722',
    socialImage: 'https://josecarter.dev/og-jose-carter.png',
    socialImageAlt:
      "José Carter's editorial portfolio for reliable AI, data, and autonomous systems",
    twitterCard: 'summary_large_image',
  },
  navigation: softwareNavigation,
  sections: softwareSections,
  hero: {
    name: portfolioOwner.name,
    eyebrow: 'Software Engineering · AI · Data · Autonomy',
    title: 'Software engineer building reliable AI, data, and autonomous systems.',
    summary:
      'I build production software across AI systems, data infrastructure, scientific computing, and autonomous planning.',
    location: portfolioOwner.location,
    primaryCta: { label: 'View Work', href: '#software-work' },
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
    images: aboutImages(aboutMediaIds),
  },
  milestones: softwareMilestones,
  experience: softwareExperience,
  projects: softwareProjects,
  capabilities: softwareCapabilities,
  services: softwareServices,
  contact: {
    heading: 'Build something reliable',
    body:
      'For software engineering, AI systems, data infrastructure, scientific computing, or autonomous-systems work, email me or find me online.',
    subject: 'Software engineering project',
    links: [sharedLinks.email, sharedLinks.github, sharedLinks.linkedIn, sharedLinks.leetCode],
  },
} satisfies PortfolioPage
