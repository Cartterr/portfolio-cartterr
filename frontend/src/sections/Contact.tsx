import { ArrowLink } from '../components/ui/ArrowLink'
import type { PortfolioContent } from '../data/portfolio'

type ContactProps = {
  content: PortfolioContent['contact']
}

export function Contact({ content }: ContactProps) {
  return (
    <section aria-labelledby="contact-title" className="contact" id="contact">
      <div className="contact__inner">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">{content.heading}</h2>
        <p>{content.body}</p>
        <ul className="contact__links">
          {content.links.map((link) => (
            <li key={link.href}>
              <ArrowLink {...link} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
