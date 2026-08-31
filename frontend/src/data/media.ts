import type { MediaFit, PortfolioImageMedia, PortfolioMedia } from './types'

const legacyMainAssets = import.meta.glob<string>(
  [
    '../assets/images/optimized/*-main.webp',
    '!../assets/images/optimized/gridworks2-main.webp',
    '!../assets/images/optimized/flair4-main.webp',
  ],
  { eager: true, import: 'default' },
)

const legacyThumbnailAssets = import.meta.glob<string>(
  [
    '../assets/images/optimized/*-thumb.webp',
    '!../assets/images/optimized/gridworks2-thumb.webp',
    '!../assets/images/optimized/flair4-thumb.webp',
  ],
  { eager: true, import: 'default' },
)

const gridWorksMainAssets = import.meta.glob<string>(
  [
    '../assets/images/gridworks-landing-overview.png',
    '../assets/images/gridworks-dashboard-food-history.png',
    '../assets/images/gridworks-dashboard-operations.png',
    '../assets/images/gridworks-alert-history.png',
  ],
  {
    eager: true,
    import: 'default',
    query: { format: 'webp', w: '1400', withoutEnlargement: 'true' },
  },
)

const gridWorksThumbnailAssets = import.meta.glob<string>(
  [
    '../assets/images/gridworks-landing-overview.png',
    '../assets/images/gridworks-dashboard-food-history.png',
    '../assets/images/gridworks-dashboard-operations.png',
    '../assets/images/gridworks-alert-history.png',
  ],
  {
    eager: true,
    import: 'default',
    query: { format: 'webp', w: '240', withoutEnlargement: 'true' },
  },
)

const visualMainAssets = import.meta.glob<string>(
  ['../assets/visual/*.png', '../assets/visual/*.jpg'],
  {
    eager: true,
    import: 'default',
    query: { format: 'webp', w: '1400', withoutEnlargement: 'true' },
  },
)

const visualThumbnailAssets = import.meta.glob<string>(
  ['../assets/visual/*.png', '../assets/visual/*.jpg'],
  {
    eager: true,
    import: 'default',
    query: { format: 'webp', w: '240', withoutEnlargement: 'true' },
  },
)

const visualAvifSources = import.meta.glob<string>(
  ['../assets/visual/*.png', '../assets/visual/*.jpg'],
  {
    eager: true,
    import: 'default',
    query: {
      as: 'srcset',
      format: 'avif',
      w: '640;960;1400',
      withoutEnlargement: 'true',
    },
  },
)

const visualWebpSources = import.meta.glob<string>(
  ['../assets/visual/*.png', '../assets/visual/*.jpg'],
  {
    eager: true,
    import: 'default',
    query: {
      as: 'srcset',
      format: 'webp',
      w: '640;960;1400',
      withoutEnlargement: 'true',
    },
  },
)

const visualJpegSources = import.meta.glob<string>(
  ['../assets/visual/*.png', '../assets/visual/*.jpg'],
  {
    eager: true,
    import: 'default',
    query: {
      as: 'srcset',
      format: 'jpeg',
      w: '640;960;1400',
      withoutEnlargement: 'true',
    },
  },
)

const readAsset = (assets: Record<string, string>, path: string) => {
  const asset = assets[path]
  if (!asset) throw new Error(`Portfolio media asset is missing: ${path}`)
  return asset
}

type LegacyMediaDefinition = {
  name: string
  sourceName?: string
  width: number
  height: number
  alt: string
  caption: string
  fit?: MediaFit
  objectPosition?: string
}

const legacyStory = (
  storyId: string,
  owner: string,
  definitions: readonly LegacyMediaDefinition[],
): PortfolioImageMedia[] =>
  definitions.map((definition) => {
    const sourceName = definition.sourceName ?? definition.name
    const isReplacement = sourceName !== definition.name
    return {
      id: definition.name,
      kind: 'image',
      src: readAsset(
        legacyMainAssets,
        `../assets/images/optimized/${sourceName}-main.webp`,
      ),
      thumbnail: readAsset(
        legacyThumbnailAssets,
        `../assets/images/optimized/${sourceName}-thumb.webp`,
      ),
      width: definition.width,
      height: definition.height,
      alt: definition.alt,
      caption: definition.caption,
      fit: definition.fit ?? 'cover',
      objectPosition: definition.objectPosition ?? '50% 50%',
      rights: {
        owner,
        source: isReplacement
          ? 'Public-safe duplicate of an existing approved project identity asset'
          : 'Previously published portfolio media from commit c94ed511',
        clearance: isReplacement ? 'privacy-safe-replacement' : 'previously-published',
        ...(isReplacement
          ? { replacementFor: `${definition.name} private authenticated dashboard` }
          : {}),
      },
      publication: 'approved',
      storyId,
    }
  })

const profileMedia = legacyStory('profile', 'José Ernesto Carter Arriagada', [
  {
    name: 'profile14',
    width: 800,
    height: 1066,
    alt: 'José Carter holding his graduation diploma beside family members',
    caption: 'Graduation portrait with family after completing his engineering studies.',
    objectPosition: '50% 42%',
  },
  {
    name: 'profile15',
    width: 480,
    height: 852,
    alt: 'José Carter at the 10th South American Space Generation Workshop',
    caption: 'Attending the 10th South American Space Generation Workshop in Santiago.',
    objectPosition: '53% 45%',
  },
  {
    name: 'profile10',
    width: 800,
    height: 1067,
    alt: 'José Carter receiving a teaching assistant distinction at PUC',
    caption: 'Recognition during the PUC Computer Science teaching assistant ceremony.',
    objectPosition: '50% 45%',
  },
  {
    name: 'profile12',
    width: 1280,
    height: 936,
    alt: 'José Carter with a faculty member at an engineering graduation ceremony',
    caption: 'Engineering graduation ceremony at Pontificia Universidad Católica de Chile.',
  },
  {
    name: 'profile13',
    width: 480,
    height: 860,
    alt: 'José Carter with a presenter at a professional event',
    caption: 'A professional event marking another step in José’s technical career.',
    objectPosition: '50% 42%',
  },
  {
    name: 'profile1',
    width: 1370,
    height: 1600,
    alt: 'José Carter standing in front of the KHIPU 2025 event backdrop',
    caption: 'Taking part in KHIPU 2025 and the Latin American machine-learning community.',
    objectPosition: '50% 45%',
  },
  {
    name: 'profile2',
    width: 1600,
    height: 1135,
    alt: 'José Carter with colleagues during the Notre Dame research visit',
    caption: 'The international research team together during the Drone Response visit.',
    objectPosition: '50% 45%',
  },
  {
    name: 'profile5',
    width: 1600,
    height: 1067,
    alt: 'José Carter with the HackING 2024 event team',
    caption: 'Organizing and supporting a student computing event with the HackING team.',
    objectPosition: '50% 42%',
  },
  {
    name: 'profile6',
    width: 1600,
    height: 1066,
    alt: 'José Carter with a computer science outreach team and dinosaur mascot',
    caption: 'Computer science outreach with student-built demonstrations and playful hardware.',
    objectPosition: '50% 44%',
  },
  {
    name: 'profile6-alt',
    width: 1600,
    height: 1064,
    alt: 'José Carter standing beside a Drone Response aircraft',
    caption: 'Fieldwork portrait beside the autonomous aircraft used by Drone Response.',
    objectPosition: '60% 48%',
  },
  {
    name: 'profile7',
    width: 1600,
    height: 1280,
    alt: 'José Carter seated beside a student-built arcade cabinet',
    caption: 'A hands-on computing project connecting software, hardware, and playful design.',
    objectPosition: '55% 52%',
  },
  {
    name: 'profile8',
    width: 1600,
    height: 1200,
    alt: 'José Carter in front of a ferris wheel and city skyline',
    caption: 'A city visit during the Notre Dame research experience in the United States.',
    objectPosition: '42% 55%',
  },
  {
    name: 'profile9',
    width: 1600,
    height: 1280,
    alt: 'José Carter with a teaching and student event team',
    caption: 'Collaborating with teaching assistants and students at a PUC computing event.',
    objectPosition: '50% 44%',
  },
])

const dilyMedia = legacyStory('dily', 'Dily', [
  {
    name: 'dily1',
    width: 1600,
    height: 1200,
    alt: 'Dily team gathered outdoors for a group photograph',
    caption: 'The Dily product and engineering team together outside the office.',
    objectPosition: '50% 50%',
  },
  {
    name: 'dily2',
    width: 800,
    height: 639,
    alt: 'Dily company wordmark on a pale geometric background',
    caption: 'Dily project identity for José’s fintech and lending systems work.',
    fit: 'contain',
  },
  {
    name: 'dily3',
    width: 800,
    height: 600,
    alt: 'Dily colleagues gathered for an office presentation',
    caption: 'A team presentation inside Dily’s shared product and engineering workspace.',
    objectPosition: '50% 48%',
  },
])

const gridWorksCaptureDefinitions = [
  {
    id: 'gridworks-landing-overview',
    file: 'gridworks-landing-overview.png',
    width: 1265,
    height: 712,
    alt: 'GridWorks public landing page introducing real-time industrial monitoring',
    caption: 'The public GridWorks product story frames operational monitoring around faster response.',
    source: 'Browser capture of the public GridWorks landing page on 2026-08-30',
  },
  {
    id: 'gridworks-dashboard-operations',
    file: 'gridworks-dashboard-operations.png',
    width: 1265,
    height: 712,
    alt: 'GridWorks operations dashboard showing live pavilion sensor status and trends',
    caption: 'The operational dashboard consolidates live device state, telemetry, and recent trends.',
    source: 'User-authorized authenticated GridWorks dashboard capture on 2026-08-30',
  },
  {
    id: 'gridworks-dashboard-food-history',
    file: 'gridworks-dashboard-food-history.png',
    width: 1888,
    height: 936,
    alt: 'GridWorks historical food monitoring dashboard with pavilion comparison charts',
    caption: 'Historical feed telemetry supports range comparison across multiple production pavilions.',
    source: 'User-provided GridWorks dashboard capture cleared for this portfolio update',
  },
  {
    id: 'gridworks-alert-history',
    file: 'gridworks-alert-history.png',
    width: 1265,
    height: 712,
    alt: 'GridWorks alert history listing resolved operational events and responsible operators',
    caption: 'Alert history preserves event type, ownership, resolution state, and drill-down actions.',
    source: 'User-authorized authenticated GridWorks alert-history capture on 2026-08-30',
  },
] as const

const gridWorksMedia: PortfolioImageMedia[] = gridWorksCaptureDefinitions.map((definition) => {
  const path = `../assets/images/${definition.file}`
  return {
    id: definition.id,
    kind: 'image',
    src: readAsset(gridWorksMainAssets, path),
    thumbnail: readAsset(gridWorksThumbnailAssets, path),
    width: definition.width,
    height: definition.height,
    alt: definition.alt,
    caption: definition.caption,
    fit: 'contain',
    objectPosition: '50% 50%',
    rights: {
      owner: 'GridWorks',
      source: definition.source,
      clearance: 'cleared-project-capture',
    },
    publication: 'approved',
    storyId: 'gridworks',
  }
})

const flairMedia = legacyStory('flair', 'Flair', [
  {
    name: 'flair1',
    width: 1600,
    height: 1600,
    alt: 'Flair Air Analytics company wordmark',
    caption: 'Flair project identity for commercial-building energy optimization work.',
    fit: 'contain',
  },
  {
    name: 'flair2',
    width: 1600,
    height: 1561,
    alt: 'Flair interface showing connected thermostat states and temperatures',
    caption: 'A public portfolio view of connected HVAC controls in the Flair interface.',
    fit: 'contain',
  },
  {
    name: 'flair3',
    width: 1600,
    height: 930,
    alt: 'Flair interface chart comparing carbon dioxide sensor readings',
    caption: 'Time-series CO2 readings visualized for commercial-building monitoring.',
    fit: 'contain',
  },
  {
    name: 'flair4',
    sourceName: 'flair1',
    width: 1600,
    height: 1600,
    alt: 'Public-safe Flair project identity',
    caption: 'Privacy-safe replacement for an authenticated employer dashboard capture.',
    fit: 'contain',
  },
])

const notreDameMedia = legacyStory('notreDame', 'José Ernesto Carter Arriagada / Drone Response', [
  {
    name: 'nd1',
    width: 1600,
    height: 1200,
    alt: 'Drone Response aircraft prepared on a field-testing runway',
    caption: 'Autonomous aircraft prepared for an emergency-response field test.',
    objectPosition: '50% 58%',
  },
  {
    name: 'nd7',
    width: 1600,
    height: 1064,
    alt: 'José Carter in front of a ferris wheel and city skyline',
    caption: 'José during the international research visit connected to Drone Response.',
    objectPosition: '48% 56%',
  },
  {
    name: 'nd8',
    width: 1201,
    height: 1600,
    alt: 'Golden dome of the University of Notre Dame Main Building',
    caption: 'The University of Notre Dame campus during the Drone Response research visit.',
    objectPosition: '50% 40%',
  },
  {
    name: 'nd9',
    width: 1600,
    height: 1200,
    alt: 'Drone Response aircraft resting beside a test runway',
    caption: 'The field aircraft used to connect mission-planning software with operations.',
    objectPosition: '50% 58%',
  },
  {
    name: 'nd2',
    width: 1131,
    height: 1600,
    alt: 'Research poster about AI-assisted critical drone management',
    caption: 'José’s poster documenting the Smart Mission Planner methods and results.',
    fit: 'contain',
  },
  {
    name: 'nd4',
    width: 1600,
    height: 1064,
    alt: 'José Carter standing beside a Drone Response aircraft in the field',
    caption: 'José beside the autonomous aircraft during mission-planning fieldwork.',
    objectPosition: '58% 48%',
  },
  {
    name: 'nd5',
    width: 1600,
    height: 1200,
    alt: 'Drone Response research team together at the field-test site',
    caption: 'The international research team after work at the aircraft test site.',
    objectPosition: '50% 50%',
  },
  {
    name: 'nd6',
    width: 1600,
    height: 1200,
    alt: 'Drone remote controller overlooking the field-testing runway',
    caption: 'Field-control hardware used alongside the Smart Mission Planner workflow.',
    objectPosition: '45% 48%',
  },
  {
    name: 'nd3',
    width: 1600,
    height: 908,
    alt: 'Drone Response mission-planning map with route grid and mission queue',
    caption: 'The mission-planning interface used to assign and launch drone routes.',
    fit: 'contain',
  },
])

const politiktokMedia = legacyStory('politiktok', 'Politiktok / Pontificia Universidad Católica de Chile', [
  {
    name: 'politiktok1',
    width: 1600,
    height: 792,
    alt: 'Politiktok public website describing its research questions',
    caption: 'The public Politiktok project page and its research objectives.',
    fit: 'contain',
  },
  {
    name: 'politiktok2',
    width: 1600,
    height: 787,
    alt: 'Politiktok public website introducing the research project',
    caption: 'An overview of the interdisciplinary research project and its public resources.',
    fit: 'contain',
  },
  {
    name: 'politiktok3',
    width: 1600,
    height: 778,
    alt: 'Politiktok analytics interface comparing creator audiences',
    caption: 'A comparison view for follower scale and political-perspective distributions.',
    fit: 'contain',
  },
  {
    name: 'politiktok4',
    width: 1600,
    height: 777,
    alt: 'Politiktok analytics interface showing sentiment results',
    caption: 'Sentiment-analysis results across creators and research records.',
    fit: 'contain',
  },
  {
    name: 'politiktok5',
    width: 1600,
    height: 776,
    alt: 'Politiktok research interface with an affective-word bubble chart',
    caption: 'Interactive exploration of word families, frequency, and affective values.',
    fit: 'contain',
  },
  {
    name: 'politiktok6',
    width: 1600,
    height: 780,
    alt: 'Politiktok research interface listing word frequency and sentiment',
    caption: 'A searchable lexicon view connecting word frequency, sentiment, and engagement.',
    fit: 'contain',
  },
  {
    name: 'politiktok7',
    width: 1600,
    height: 778,
    alt: 'Politiktok creator classification interface with a category chart',
    caption: 'Creator classification by political and social research categories.',
    fit: 'contain',
  },
  {
    name: 'politiktok8',
    width: 1600,
    height: 774,
    alt: 'Politiktok network visualization connecting creators and topics',
    caption: 'An interactive graph of relationships among creators, words, and sentiments.',
    fit: 'contain',
  },
  {
    name: 'politiktok9',
    width: 1600,
    height: 787,
    alt: 'Politiktok time-series interface charting videos and average views',
    caption: 'A temporal view of publication volume and audience activity.',
    fit: 'contain',
  },
  {
    name: 'politiktok10',
    width: 1600,
    height: 783,
    alt: 'Politiktok research assistant answering a dataset question with charts',
    caption: 'The research assistant combines natural-language questions with data summaries.',
    fit: 'contain',
  },
  {
    name: 'politiktok11',
    width: 1600,
    height: 783,
    alt: 'Politiktok data summary interface with generated research insights',
    caption: 'A structured summary of datasets, trends, sentiment, and generated findings.',
    fit: 'contain',
  },
  {
    name: 'politiktok12',
    width: 1600,
    height: 780,
    alt: 'Politiktok research assistant welcome screen and suggested questions',
    caption: 'The starting state for asking research questions or requesting a visualization.',
    fit: 'contain',
  },
])

const teachingMedia = legacyStory('teaching', 'José Ernesto Carter Arriagada / Pontificia Universidad Católica de Chile', [
  {
    name: 'ayudante1',
    width: 1600,
    height: 1280,
    alt: 'José Carter with a teaching assistant and student event team',
    caption: 'The teaching team together after a large student computing activity.',
    objectPosition: '50% 44%',
  },
  {
    name: 'ayudante2',
    width: 1600,
    height: 1200,
    alt: 'Teaching assistants leading an interactive activity in a lecture hall',
    caption: 'A collaborative classroom activity designed for a large group of students.',
    objectPosition: '50% 48%',
  },
  {
    name: 'ayudante5',
    width: 1600,
    height: 1200,
    alt: 'Large class and teaching team gathered for a group photograph',
    caption: 'Students and teaching assistants together at the end of the course activity.',
    objectPosition: '50% 52%',
  },
  {
    name: 'ayudante3',
    width: 1600,
    height: 1200,
    alt: 'Students participating in a live classroom quiz',
    caption: 'An interactive lecture-hall exercise facilitated by the teaching team.',
    objectPosition: '50% 48%',
  },
  {
    name: 'ayudante4',
    width: 1600,
    height: 1200,
    alt: 'Teaching assistants reviewing a classroom quiz scoreboard',
    caption: 'A quiz-based learning moment during a large student computing session.',
    objectPosition: '50% 48%',
  },
])

const geoscienceMedia = legacyStory('geoscience', 'José Ernesto Carter Arriagada / Pontificia Universidad Católica de Chile', [
  {
    name: 'geoscience7',
    width: 1600,
    height: 898,
    alt: 'Rendered coastal terrain with a tectonic section cutting through it',
    caption: 'A cinematic view of the Marga-Marga terrain and simulated plate boundary.',
    objectPosition: '50% 50%',
  },
  {
    name: 'geoscience1',
    width: 1600,
    height: 900,
    alt: 'Three-dimensional geoscience block model of central Chile',
    caption: 'The terrain, coastline, and subsurface geometry assembled into a 3D model.',
    fit: 'contain',
  },
  {
    name: 'geoscience2',
    width: 1600,
    height: 900,
    alt: 'Colored tectonic simulation ribbons on a dark background',
    caption: 'A simulation frame isolating the modeled plate surfaces and deformation.',
    fit: 'contain',
  },
  {
    name: 'geoscience3',
    width: 1600,
    height: 900,
    alt: 'Tectonic simulation ribbons over a regional satellite map',
    caption: 'The simulated plate geometry registered against regional geography.',
    fit: 'contain',
  },
  {
    name: 'geoscience4',
    width: 1600,
    height: 900,
    alt: 'Vertical tectonic data surfaces rising from a satellite map',
    caption: 'Scientific data mapped into spatial surfaces for three-dimensional inspection.',
    fit: 'contain',
  },
  {
    name: 'geoscience5',
    width: 1600,
    height: 900,
    alt: 'Geoscience block model with colored subsurface layers',
    caption: 'A clear structural view of terrain and the modeled layers beneath it.',
    fit: 'contain',
  },
  {
    name: 'geoscience8',
    width: 1600,
    height: 884,
    alt: 'Rendered coastline crossed by a translucent tectonic section',
    caption: 'A close view of the spatial relationship between coastline and plate geometry.',
    objectPosition: '50% 50%',
  },
  {
    name: 'geoscience9',
    width: 1600,
    height: 900,
    alt: 'Rendered coastal city and surrounding terrain in the geoscience model',
    caption: 'Urban and regional context preserved inside the scientific terrain model.',
    objectPosition: '50% 50%',
  },
  {
    name: 'geoscience6',
    width: 1600,
    height: 902,
    alt: 'Geoscience block model with terrain above dark subsurface layers',
    caption: 'A second block-model view emphasizing the terrain-to-subsurface transition.',
    fit: 'contain',
  },
])

export const legacyMedia: PortfolioImageMedia[] = [
  ...profileMedia,
  ...dilyMedia,
  ...gridWorksMedia,
  ...flairMedia,
  ...notreDameMedia,
  ...politiktokMedia,
  ...teachingMedia,
  ...geoscienceMedia,
]

type VisualDefinition = {
  id: string
  file: string
  width: number
  height: number
  alt: string
  caption: string
  objectPosition: string
  fit?: MediaFit
  storyId: 'parametric-configurator' | 'personal-vfx-studies'
}

const visualDefinitions: VisualDefinition[] = [
  {
    id: 'configurator-front-angled',
    file: 'configurator-front-angled.png',
    width: 1400,
    height: 1000,
    alt: 'Front angled 3D shelving layout with room and structure measurements',
    caption: 'A measured front view of the parametric shelving layout inside the modeled room.',
    objectPosition: '50% 52%',
    storyId: 'parametric-configurator',
  },
  {
    id: 'configurator-entrance',
    file: 'configurator-entrance.png',
    width: 1400,
    height: 1000,
    alt: 'Entrance-level 3D view through a room fitted with parametric shelving',
    caption: 'An eye-level spatial check of aisle, entrance, and shelving relationships.',
    objectPosition: '50% 50%',
    storyId: 'parametric-configurator',
  },
  {
    id: 'configurator-door-clearance',
    file: 'configurator-door-clearance.png',
    width: 961,
    height: 579,
    alt: 'Interactive 3D shelving configurator showing a door and two labeled structures',
    caption: 'The working editor validates structure placement against the modeled door swing.',
    objectPosition: '50% 50%',
    storyId: 'parametric-configurator',
  },
  {
    id: 'vfx-campfire-environment',
    file: 'vfx-campfire-environment.jpg',
    width: 1920,
    height: 1080,
    alt: 'Nighttime campsite render with a seated character lit by a glowing campfire',
    caption: 'Environment lighting study balancing firelight, character focus, and a dark forest.',
    objectPosition: '50% 52%',
    storyId: 'personal-vfx-studies',
  },
  {
    id: 'vfx-crystal-environment',
    file: 'vfx-crystal-environment.jpg',
    width: 1920,
    height: 1080,
    alt: 'Blue science-fiction chamber centered on a luminous crystal formation',
    caption: 'Procedural environment and lighting study built around a luminous crystal chamber.',
    objectPosition: '50% 50%',
    storyId: 'personal-vfx-studies',
  },
  {
    id: 'vfx-orbital-portrait',
    file: 'vfx-orbital-portrait.jpg',
    width: 1920,
    height: 1080,
    alt: 'Metallic portrait with an illuminated orbital ring against a star field',
    caption: 'Portrait look-development study combining reflective materials, light trails, and compositing.',
    objectPosition: '50% 42%',
    storyId: 'personal-vfx-studies',
  },
  {
    id: 'vfx-disintegration-portrait',
    file: 'vfx-disintegration-portrait.jpg',
    width: 1920,
    height: 1080,
    alt: 'Human profile dissolving into layered leaves and glowing fragments',
    caption: 'FX study exploring organic scattering, layered materials, and emissive breakup.',
    objectPosition: '55% 48%',
    storyId: 'personal-vfx-studies',
  },
  {
    id: 'vfx-cyberpunk-lookdev',
    file: 'vfx-cyberpunk-lookdev.jpg',
    width: 1280,
    height: 720,
    alt: 'Backlit character overlooking a red and cyan cyberpunk city',
    caption: 'Cinematic lighting and atmosphere study for a dense futuristic city scene.',
    objectPosition: '50% 50%',
    storyId: 'personal-vfx-studies',
  },
  {
    id: 'vfx-robot-lookdev',
    file: 'vfx-robot-lookdev.jpg',
    width: 512,
    height: 512,
    alt: 'Detailed mechanical robot with glossy red and steel materials',
    caption: 'Hard-surface robot look development focused on material response and studio lighting.',
    objectPosition: '50% 46%',
    fit: 'contain',
    storyId: 'personal-vfx-studies',
  },
]

export const visualMedia: PortfolioImageMedia[] = visualDefinitions.map((definition) => {
  const path = `../assets/visual/${definition.file}`
  return {
    id: definition.id,
    kind: 'image',
    src: readAsset(visualMainAssets, path),
    thumbnail: readAsset(visualThumbnailAssets, path),
    width: definition.width,
    height: definition.height,
    alt: definition.alt,
    caption: definition.caption,
    fit: definition.fit ?? 'contain',
    objectPosition: definition.objectPosition,
    rights: {
      owner: 'José Ernesto Carter Arriagada',
      source:
        definition.storyId === 'parametric-configurator'
          ? 'Cleared native Playwright capture from repisas-3d-quote-demo'
          : 'User-provided personal render selected from F:\\VFX',
      clearance: 'cleared-project-capture',
    },
    publication: 'approved',
    storyId: definition.storyId,
    sources: [
      { type: 'image/avif', srcSet: readAsset(visualAvifSources, path) },
      { type: 'image/webp', srcSet: readAsset(visualWebpSources, path) },
      { type: 'image/jpeg', srcSet: readAsset(visualJpegSources, path) },
    ],
  }
})

export const portfolioMedia: PortfolioMedia[] = [...legacyMedia, ...visualMedia]

const mediaById = new Map(portfolioMedia.map((media) => [media.id, media]))

export const getMedia = (id: string): PortfolioMedia => {
  const media = mediaById.get(id)
  if (!media) throw new Error(`Portfolio media is missing: ${id}`)
  return media
}

export const getMediaForStory = (storyId: string): PortfolioMedia[] =>
  portfolioMedia.filter((media) => media.storyId === storyId)
