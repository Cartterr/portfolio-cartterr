import geoscienceImage from '../assets/images/optimized/geoscience7-main.webp'
import gridWorksImage from '../assets/images/optimized/gridworks1-main.webp'
import khipuImage from '../assets/images/optimized/profile1-main.webp'
import notreDameImage from '../assets/images/optimized/nd1-main.webp'
import politiktokImage from '../assets/images/optimized/politiktok1-main.webp'
import spaceGenerationImage from '../assets/images/optimized/profile15-main.webp'

export type PortfolioLink = {
  label: string
  href: string
  external?: boolean
}

export type PortfolioMetric = {
  value: string
  label: string
  context: string
}

export type CaseStudy = {
  slug: string
  title: string
  eyebrow: string
  role: string
  period: string
  summary: string
  problem: string
  contribution: string
  outcome: string
  technologies: string[]
  image: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  link?: PortfolioLink
  private?: boolean
}

export type ExperienceItem = {
  period: string
  title: string
  company: string
  summary: string
}

export type CapabilityGroup = {
  title: string
  summary: string
  items: string[]
}

export type PortfolioContent = {
  hero: {
    name: string
    title: string
    summary: string
    location: string
    primaryCta: PortfolioLink
    secondaryCta: PortfolioLink
  }
  metrics: PortfolioMetric[]
  caseStudies: CaseStudy[]
  experience: ExperienceItem[]
  capabilities: CapabilityGroup[]
  about: {
    heading: string
    paragraphs: string[]
    images: Array<{ src: string; alt: string; width: number; height: number }>
  }
  contact: {
    heading: string
    body: string
    links: PortfolioLink[]
  }
}

export const portfolioContent = {
  hero: {
    name: 'José Carter Arriagada',
    title: 'Software engineer building reliable AI, data, and autonomous systems.',
    summary:
      'I build production software across AI systems, data infrastructure, scientific computing, and autonomous planning.',
    location: 'Santiago, Chile',
    primaryCta: {
      label: 'Explore selected work',
      href: '#work',
    },
    secondaryCta: {
      label: 'Download CV',
      href: '/Jose_Carter_CV_Eng.pdf',
    },
  },
  metrics: [
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
  ],
  caseStudies: [
    {
      slug: 'gridworks-alerting-platform',
      title: 'Production-safe alerting platform migration',
      eyebrow: 'GridWorks',
      role: 'Lead Engineer',
      period: '2026 - Present',
      summary:
        'An industrial alerting platform migration designed around operational parity, modular services, and safer rollout controls.',
      problem:
        'Legacy industrial alerting workflows needed to move to a modular architecture without losing production parity across ingestion, rules, escalation, operator tooling, and WhatsApp flows.',
      contribution:
        'I lead the end-to-end rebuild, implementing alert lifecycle, escalation, and ingestion logic while shaping safer rollout controls and production-grade operator tooling.',
      outcome:
        'A disciplined modernization path that preserves live workflows while replacing legacy automation paths.',
      technologies: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'WhatsApp', 'PostgreSQL'],
      image: gridWorksImage,
      imageAlt: 'GridWorks logo for the industrial alerting platform',
      imageWidth: 1600,
      imageHeight: 1600,
    },
    {
      slug: 'notre-dame-drone-response',
      title: 'Autonomous drone mission planning',
      eyebrow: 'Drone Response · University of Notre Dame',
      role: 'AI Systems Developer',
      period: 'Jan 2024 - Mar 2024',
      summary:
        'Smart Mission Planner logic for autonomous drone coordination in an emergency-response research setting.',
      problem:
        'Emergency-response planning required route and resource-allocation logic that could coordinate autonomous drones with real-time messaging under operational constraints.',
      contribution:
        'I implemented mission-planning logic with optimization algorithms, MQTT messaging, and OpenAI-assisted decision support alongside Angular and Java Spring systems.',
      outcome:
        'Delivered planning logic in an international NASA- and NSF-backed research environment.',
      technologies: ['Python', 'Algorithms', 'MQTT', 'OpenAI API', 'Angular', 'Java Spring'],
      image: notreDameImage,
      imageAlt: 'Autonomous Drone Response aircraft prepared for a field test',
      imageWidth: 1600,
      imageHeight: 1200,
      link: {
        label: 'Visit Drone Response',
        href: 'https://droneresponse.ai/',
        external: true,
      },
    },
    {
      slug: 'politiktok-research-infrastructure',
      title: 'Politiktok research infrastructure',
      eyebrow: 'Pontificia Universidad Católica de Chile',
      role: 'Data Science Researcher',
      period: 'Jul 2023 - Present',
      summary:
        'Research infrastructure for repeatable political-media analysis across large datasets and GPU-backed processing workflows.',
      problem:
        'Funded political-media research needed reliable software to process more than 100,000 records while keeping large-scale analysis repeatable.',
      contribution:
        'I built dataset-processing and GPU-backed machine-learning workflows with Python, PyTorch, CUDA, NLP tooling, and PostgreSQL.',
      outcome:
        'Processed 100,000+ records and improved research-pipeline performance by 10x.',
      technologies: ['Python', 'PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'Data Engineering'],
      image: politiktokImage,
      imageAlt: 'Politiktok research project website describing its work',
      imageWidth: 1600,
      imageHeight: 792,
      link: {
        label: 'Visit Politiktok',
        href: 'https://politiktok.cl/',
        external: true,
      },
    },
    {
      slug: 'cuda-geoscience-simulation',
      title: 'CUDA geoscience simulation',
      eyebrow: 'Pontificia Universidad Católica de Chile',
      role: 'Simulation Engineer',
      period: 'Jan 2023 - Jul 2024',
      summary:
        'GPU-accelerated scientific software for tectonic-plate modeling and seismic-risk analysis.',
      problem:
        'Tectonic-plate modeling and seismic-risk analysis required efficient parallel processing for large scientific datasets and computationally intensive simulations.',
      contribution:
        'I developed the simulation workflow in Python and CUDA, optimizing parallel algorithms for predictive analysis and massive-data processing.',
      outcome:
        'Achieved a 15x performance improvement in the scientific-computing workload.',
      technologies: ['Python', 'CUDA', 'Optimization', 'Data Pipelines', 'Simulation'],
      image: geoscienceImage,
      imageAlt: 'Rendered geoscience simulation showing terrain and a plate boundary',
      imageWidth: 1600,
      imageHeight: 898,
    },
  ],
  experience: [
    {
      period: 'Sep 2025 - Present',
      title: 'Full Stack Developer',
      company: 'Dily',
      summary:
        'Build fintech and lending software with DDD, hexagonal architecture, TypeScript and Node.js services, and Angular frontend delivery.',
    },
    {
      period: '2026 - Present',
      title: 'Lead Engineer, Alerting Platform Migration',
      company: 'GridWorks',
      summary:
        'Lead a modular industrial-alerting rebuild focused on production parity, safer rollout controls, and operator tooling.',
    },
    {
      period: 'Dec 2024 - Jul 2025',
      title: 'Software Engineer',
      company: 'Flair',
      summary:
        'Built production services, enterprise UI, and time-series workflows for a commercial-building energy-optimization platform.',
    },
    {
      period: 'Jan 2024 - Mar 2024',
      title: 'AI Systems Developer',
      company: 'Drone Response, University of Notre Dame',
      summary:
        'Implemented autonomous mission planning with optimization algorithms, MQTT, and OpenAI-assisted decision support.',
    },
    {
      period: 'Jul 2023 - Present',
      title: 'Data Science Researcher',
      company: 'Politiktok, Pontificia Universidad Católica de Chile',
      summary:
        'Build GPU-backed research pipelines and data tooling for political-media analysis at 100,000+ record scale.',
    },
    {
      period: 'Jan 2023 - Jul 2024',
      title: 'Simulation Engineer',
      company: 'Pontificia Universidad Católica de Chile',
      summary:
        'Developed Python and CUDA simulations for tectonic-plate modeling, seismic-risk analysis, and large-scale processing.',
    },
    {
      period: 'Mar 2023 - Nov 2024',
      title: 'Advanced Teaching Assistant & Instructor',
      company: 'PUC & Escuela Militar de Chile',
      summary:
        'Designed and taught Python curricula covering APIs, automated testing, operating systems, and high-performance computing.',
    },
  ],
  capabilities: [
    {
      title: 'Software systems',
      summary: 'Product and platform engineering across backend, frontend, and domain boundaries.',
      items: ['TypeScript', 'Python', 'React', 'Node.js', 'Angular', 'Next.js'],
    },
    {
      title: 'AI, data, and simulation',
      summary: 'Research-grade processing, machine learning, and GPU-accelerated computing.',
      items: ['PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'Data pipelines', 'OpenAI API'],
    },
    {
      title: 'Production and autonomy',
      summary: 'Architecture and infrastructure for reliable services and connected systems.',
      items: ['DDD', 'Hexagonal Architecture', 'AWS', 'Railway', 'MQTT', 'Autonomous planning'],
    },
  ],
  about: {
    heading: 'Engineering across production and research',
    paragraphs: [
      'I am a software engineer based in Santiago, Chile. My work spans production backend and frontend systems, GPU-backed research infrastructure, scientific simulation, and autonomous mission planning.',
      'Across Dily, GridWorks, Flair, Notre Dame, Politiktok, and PUC, I have worked on fintech, industrial alerting, energy optimization, political-media research, drone coordination, and geoscience simulation.',
      'I am especially interested in applying AI to satellite data, simulation, and aerospace problems.',
    ],
    images: [
      {
        src: spaceGenerationImage,
        alt: 'José Carter at the 10th South American Space Generation Workshop in Santiago',
        width: 480,
        height: 852,
      },
      {
        src: khipuImage,
        alt: 'José Carter standing in front of the KHIPU 2025 event backdrop',
        width: 1370,
        height: 1600,
      },
    ],
  },
  contact: {
    heading: 'Build something reliable',
    body:
      'For software engineering, AI systems, data infrastructure, scientific computing, or autonomous-systems work, email me or find me online.',
    links: [
      {
        label: 'Email',
        href: 'mailto:jose.carterx@gmail.com',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/Cartterr',
        external: true,
      },
      {
        label: 'LinkedIn',
        href: 'https://linkedin.com/in/jose-carter-arriagada',
        external: true,
      },
    ],
  },
} satisfies PortfolioContent
