import { createContext, useContext } from 'react'
import type { PortfolioImageMedia } from '../../data/types'

export type OpenLightbox = (
  items: PortfolioImageMedia[],
  index: number,
  source?: HTMLElement | null,
) => void

export const LightboxContext = createContext<OpenLightbox>(() => undefined)

/** Opens the page's image viewer on `items[index]`, morphing from `source` when possible. */
export const useLightbox = () => useContext(LightboxContext)
