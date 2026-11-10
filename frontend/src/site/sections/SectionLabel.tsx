type SectionLabelProps = {
  index: string
  label: string
  note?: string
}

/** The small numbered line that opens each section. */
export function SectionLabel({ index, label, note }: SectionLabelProps) {
  return (
    <p className="jc-label" data-reveal>
      <span className="jc-label__index">{index}</span>
      <span aria-hidden="true" className="jc-label__rule" />
      <span>{label}</span>
      {note ? <span className="jc-label__note">{note}</span> : null}
    </p>
  )
}
