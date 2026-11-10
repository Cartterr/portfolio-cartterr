import { Fragment } from 'react'
import dictuc from '../../assets/logos/dictuc.png'
import dily from '../../assets/logos/dily.svg'
import escuelaMilitar from '../../assets/logos/escuela-militar.png'
import flair from '../../assets/logos/flair.svg'
import gridworks from '../../assets/logos/gridworks.png'
import notreDame from '../../assets/logos/notre-dame.svg'
import politiktok from '../../assets/logos/politiktok.png'
import tek from '../../assets/logos/tek.png'
import uc from '../../assets/logos/uc.png'

/**
 * Each organization's own icon, taken from its official site. `pattern` finds the
 * organization wherever its name appears in a line of copy.
 */
const orgs = [
  { pattern: 'TEK Chile', src: tek },
  { pattern: 'DICTUC', src: dictuc },
  { pattern: 'Pontificia Universidad Católica de Chile|\\bPUC\\b|\\bUC\\b', src: uc },
  { pattern: '(?:University of )?Notre Dame', src: notreDame },
  { pattern: 'GridWorks', src: gridworks },
  { pattern: 'Dily', src: dily },
  { pattern: 'Flair', src: flair },
  { pattern: 'Politiktok', src: politiktok },
  { pattern: 'Escuela Militar de Chile', src: escuelaMilitar },
]

const anyOrg = new RegExp(`(${orgs.map(({ pattern }) => pattern).join('|')})`, 'g')
const findOrg = (name: string) =>
  orgs.find(({ pattern }) => new RegExp(`^(?:${pattern})$`).test(name))

/** One organization's name with its icon. Unknown names come back as plain text. */
export function OrgName({ name }: { name: string }) {
  const org = findOrg(name)
  if (!org) return <>{name}</>
  return (
    <span className="jc-org">
      {/* Decorative: the name beside it already says who it is. */}
      <img
        alt=""
        aria-hidden="true"
        className="jc-org-mark"
        decoding="async"
        draggable={false}
        src={org.src}
      />
      {name}
    </span>
  )
}

/** The text as written, with each organization it names shown with its icon. */
export function OrgText({ text }: { text: string }) {
  return (
    <>
      {text.split(anyOrg).map((part, index) =>
        index % 2 === 1 ? (
          <OrgName key={index} name={part} />
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  )
}
