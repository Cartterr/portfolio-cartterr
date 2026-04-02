export const stats = [
  { value: '50%', label: 'energy reduction delivered in production' },
  { value: '100k+', label: 'research records processed at scale' },
  { value: '15x', label: 'simulation speedup achieved in scientific computing' },
  { value: '14+', label: 'teaching assistantships and technical mentoring roles' },
]

export const focusAreas = [
  'AI systems and backend engineering',
  'Simulation, graphics, and scientific computing',
  'Autonomous systems, aerospace, and robotics',
  'Data, sensors, and research infrastructure',
]

export const experienceEntries = [
  {
    period: 'Sep 2025 - Present',
    title: 'Full Stack Developer',
    company: 'Dily',
    summary: 'Build fintech and lending software end to end using DDD and hexagonal architecture so product changes do not turn into backend chaos later.',
    impact: 'Work spans core lending flows, clean domain boundaries, testable services, and frontend delivery inside a real monorepo.',
    stack: ['TypeScript', 'Node.js', 'Express', 'Angular', 'Nx', 'MySQL', 'PostgreSQL', 'AWS'],
    spotlight: {
      eyebrow: 'Current role',
      title: 'Fintech product engineering with strong architecture constraints',
      points: [
        'DDD and hexagonal patterns for evolving loan-domain logic',
        'Backend services with Express, Knex, Mikro-ORM, and AWS integrations',
        'Angular micro-frontends with RxJS, NgRx, and production testing flows',
      ],
    },
  },
  {
    period: '2026 - Present',
    title: 'Lead Engineer, Alerting Platform Migration',
    company: 'GridWorks',
    summary: 'Leading the rebuild of an industrial alerting platform, replacing legacy automation paths with a modular multi-service system and a safer rollout strategy.',
    impact: 'The work is as much about migration discipline and operational parity as it is about writing code.',
    stack: ['Next.js', 'Node.js', 'Railway', 'WhatsApp', 'MQTT', 'PostgreSQL'],
    spotlight: {
      eyebrow: 'Freelance systems work',
      title: 'Production migration without breaking live operator flows',
      points: [
        'Alert lifecycle logic, escalation chains, ingestion durability, and admin tooling',
        'Safe cutovers from Base44 and Node-RED into a controlled service architecture',
        'Observability and rollout discipline for real production users',
      ],
    },
  },
  {
    period: 'Dec 2024 - Jul 2025',
    title: 'Software Engineer',
    company: 'Flair',
    summary: 'Built on an energy optimization platform for commercial buildings, with production-facing services, enterprise UI work, and time-series pipelines.',
    impact: 'Helped ship features tied to measurable HVAC efficiency gains and high-frequency sensor data workflows.',
    stack: ['Python', 'Vue.js', 'Docker', 'AWS', 'InfluxDB', 'DynamoDB'],
    gallery: 'flair' as const,
    link: { href: 'https://goflair.cl/', label: 'Company site' },
  },
  {
    period: 'Jan 2024 - Mar 2024',
    title: 'AI Systems Developer',
    company: 'Drone Response at Notre Dame',
    summary: 'Implemented mission-planning logic for autonomous drone coordination, combining routing algorithms, MQTT messaging, and OpenAI-assisted decision support.',
    impact: 'Focused on emergency-response planning under operational constraints in a NASA and NSF backed context.',
    stack: ['Python', 'Algorithms', 'MQTT', 'OpenAI API', 'Angular', 'Java Spring'],
    gallery: 'nd' as const,
    link: { href: 'https://droneresponse.ai/', label: 'Project site' },
  },
  {
    period: 'Jul 2023 - Present',
    title: 'Data Science Researcher',
    company: 'Politiktok, Pontificia Universidad Católica de Chile',
    summary: 'Work on large-scale political content analysis with GPU-backed ML pipelines, dataset processing, and research tooling for funded academic work.',
    impact: 'Processed more than 100,000 records, accelerated pipelines by 10x, and turned research needs into reliable software.',
    stack: ['Python', 'PyTorch', 'CUDA', 'NLP', 'PostgreSQL', 'Data Pipelines'],
    gallery: 'politiktok' as const,
    link: { href: 'https://politiktok.cl/', label: 'Open project' },
  },
  {
    period: 'Jan 2023 - Jul 2024',
    title: 'Simulation Engineer',
    company: 'Pontificia Universidad Católica de Chile',
    summary: 'Developed advanced computational simulations for tectonic plate modeling using Python and CUDA for predictive analysis.',
    impact: 'Optimized parallel algorithms achieving 15x performance improvements, and implemented seismic risk models for massive data processing.',
    stack: ['Python', 'CUDA', 'Optimization', 'Data Pipelines'],
  },
  {
    period: 'Mar 2023 - Nov 2024',
    title: 'Advanced Teaching Assistant & Instructor',
    company: 'PUC & Escuela Militar de Chile',
    summary: 'Designed and taught Python programming curriculums, covering APIs, automated testing, operating systems, and high-performance computing.',
    impact: 'Awarded "Advanced Teaching Assistant" distinction for exceptional performance across multiple advanced engineering courses.',
    stack: ['Python', 'Software Testing', 'Operating Systems', 'Technical Communication'],
  },
]

export const projectEntries = [
  {
    title: 'GridWorks Alerting Platform Migration',
    status: 'Active production migration',
    description: 'A multi-service industrial alerting platform covering ingestion, rules, escalation, operator tooling, and WhatsApp workflows under tight rollout constraints.',
    detail: 'This is the clearest example of the work I want to keep doing: production-safe migrations, systems thinking, and software that has to survive messy reality.',
    stack: ['Next.js', 'Node.js', 'Railway', 'MQTT', 'WhatsApp', 'PostgreSQL'],
  },
  {
    title: 'Politiktok Research Infrastructure',
    status: 'Active research',
    description: 'Research infrastructure for political-media analysis, with GPU acceleration, repeatable processing flows, and large-scale dataset handling.',
    detail: 'It sits at the intersection of software engineering, machine learning, and academic research where reproducibility matters as much as speed.',
    stack: ['Python', 'PyTorch', 'CUDA', 'PostgreSQL', 'NLP', 'Data Engineering'],
    link: 'https://politiktok.cl/',
  },
  {
    title: 'Autonomous Planning and Scientific Simulation',
    status: 'Direction I want to push further',
    description: 'Mission-planning work for autonomous drones plus GPU-heavy geoscience simulation and scientific computing.',
    detail: 'That combination is why I am especially interested in applying AI to satellite data, simulation, and aerospace problems over the next few years.',
    stack: ['Python', 'CUDA', 'Optimization', 'MQTT', 'OpenAI API', 'Simulation'],
    link: 'https://eartharxiv.org/repository/view/7166/',
  },
]

export const skillBuckets = [
  {
    title: 'Build',
    items: ['TypeScript', 'Python', 'React', 'Node.js', 'Express', 'Angular', 'Nx'],
  },
  {
    title: 'Scale',
    items: ['Docker', 'Railway', 'AWS', 'DDD', 'Hexagonal Architecture', 'REST APIs', 'Observability'],
  },
  {
    title: 'Analyze',
    items: ['PyTorch', 'CUDA', 'NLP', 'Optimization', 'Simulation', 'Computer Vision'],
  },
  {
    title: 'Integrate',
    items: ['MQTT', 'IoT', 'WhatsApp flows', 'Time-series systems', 'Operator tooling', 'Sensors'],
  },
]
