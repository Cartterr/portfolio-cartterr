import { useEffect, useState } from 'react'

type Props = {
  phrases: string[]
  typingSpeed?: number
  pauseMs?: number
}

const Typewriter = ({ phrases, typingSpeed = 40, pauseMs = 1200 }: Props) => {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let timer: number
    const current = phrases[index % phrases.length]
    if (!deleting) {
      if (text.length < current.length) {
        timer = window.setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed)
      } else {
        timer = window.setTimeout(() => setDeleting(true), pauseMs)
      }
    } else {
      if (text.length > 0) {
        timer = window.setTimeout(() => setText(current.slice(0, text.length - 1)), typingSpeed / 2)
      } else {
        setDeleting(false)
        setIndex(i => i + 1)
      }
    }
    return () => clearTimeout(timer)
  }, [text, deleting, index, phrases, typingSpeed, pauseMs])

  return (
    <span className="whitespace-pre border-r-2 border-accent-blue pr-1 animate-pulse">{text}</span>
  )
}

export default Typewriter


