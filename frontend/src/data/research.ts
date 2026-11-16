// Research & public work on the Software page, newest first. Add an entry here; the layout
// reads everything from this list. `diagram` picks the schematic drawn in ResearchDiagram.tsx.

export type ResearchAuthor = { name: string; self?: true }

export type ResearchOutput = {
  id: string
  title: string
  titleLang?: 'es'
  subtitle?: string
  type: 'Journal article' | 'Conference abstract' | 'Conference poster'
  venue: string
  year: number
  date?: string
  authors: ResearchAuthor[]
  summary: string
  url?: string
  doi?: string
  linkLabel?: string
  relatedProjectId?: string
  diagram: 'affect-network' | 'fault-section' | 'corpus-funnel'
}

export const researchOutputs = [
  {
    id: 'ciie-2026-corpus',
    title: 'Del scraping a la experiencia juvenil: repensando la construcción de corpus digitales para investigación educativa',
    titleLang: 'es',
    subtitle:
      'From scraping to youth experience: rethinking digital corpus construction for educational research',
    type: 'Conference poster',
    venue:
      'VII Congreso Interdisciplinario de Investigación en Educación (CIIE 2026), Pontificia Universidad Católica de Chile, Campus Oriente · Project “Jóvenes y espiritualidad en un mundo conectado: resignificar experiencias vitales en Teachable moments”',
    year: 2026,
    date: '2026-10-27',
    authors: [
      { name: 'Almendra Carrillo Pavez' },
      { name: 'Bernardita Pérez Santander' },
      { name: 'Daryel Mery Sola' },
      { name: 'Alhena Arce' },
      { name: 'José Carter', self: true },
      { name: 'Maili Ow' },
    ],
    summary:
      'We compared a corpus built with scraping and AI filters against what young people say they actually watch. Of 386 Chilean youth accounts found (138 Instagram, 248 TikTok), 45 went to validation, and a focus group of 15 adolescents aged 14 to 18 said content reaches them through algorithmic recommendation rather than hashtags or search. That gap questions the “influencer” as the unit of analysis.',
    // Public link: no public version yet. Add `url` (and `doi` if any) here when one exists.
    url: undefined,
    diagram: 'corpus-funnel',
  },
  {
    id: 'pse-2026-tiktok',
    title:
      'Political Subjectification on TikTok: A Postdigital Mode of Inquiry for Tracing Affects Among Chilean Youth',
    type: 'Journal article',
    venue: 'Postdigital Science and Education (Springer)',
    year: 2026,
    date: '2026-04-06',
    authors: [
      { name: 'Valentina Errázuriz' },
      { name: 'Stephanie Martinic Caneo' },
      { name: 'Bárbara Marín Quero' },
      { name: 'Eliana Cardoch Meza' },
      { name: 'José Ernesto Carter', self: true },
    ],
    summary:
      'A method for tracing how young Chileans become political on TikTok, treating people, platform features and the recommendation algorithm as shaping that process together. It follows affects instead of arguments: political learning there runs through bodily, emotional reactions more than reasoned debate.',
    url: 'https://link.springer.com/article/10.1007/s42438-026-00638-4',
    doi: '10.1007/s42438-026-00638-4',
    linkLabel: 'Read the article',
    relatedProjectId: 'politiktok-research-infrastructure',
    diagram: 'affect-network',
  },
  {
    id: 'ssa-2023-megathrust',
    title: 'Interactions Between Megathrust and Adjacent Crustal Faults',
    type: 'Conference abstract',
    venue: 'Seismological Society of America Annual Meeting · Meeting abstract (poster)',
    year: 2023,
    date: '2023-04-20',
    authors: [
      { name: 'Jorge Crempien' },
      { name: 'Marco Herrera' },
      { name: 'Javiera Álvarez-Vargas' },
      { name: 'José Carter-Arriagada', self: true },
      { name: 'Marcos Moreno' },
    ],
    summary:
      'A 3D quasi-dynamic boundary element simulation of a crustal fault connected to a subduction interface. Mw~8.6 megathrust ruptures set off Mw 7 crustal earthquakes about every 1,100 years, and active crustal faults segment the margin, stopping Mw~9 ruptures from running through.',
    url: 'https://seismosoc.secure-platform.com/a/solicitations/28/sessiongallery/740/application/9880',
    linkLabel: 'View the abstract',
    relatedProjectId: 'geoscience-simulation',
    diagram: 'fault-section',
  },
] satisfies ResearchOutput[]
