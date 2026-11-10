import type { CSSProperties } from 'react'

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

/**
 * A figure whose digits roll into place when it scrolls into view. The motion is a
 * CSS transform transition, so it runs on the compositor at the display's refresh rate.
 * Screen readers get the plain value.
 */
export function Odometer({ value }: { value: string }) {
  let digitIndex = 0

  return (
    <span className="jc-odo">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="jc-odo__face">
        {Array.from(value).map((character, index) => {
          if (!/\d/.test(character)) {
            return (
              <span className="jc-odo__text" key={index}>
                {character === ' ' ? ' ' : character}
              </span>
            )
          }
          const style = { '--n': Number(character), '--i': digitIndex++ } as CSSProperties
          return (
            <span className="jc-odo__digit" key={index} style={style}>
              <span className="jc-odo__reel">
                {digits.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
