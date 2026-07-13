import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import type { PropsWithChildren } from 'react'

export function MotionProvider({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
