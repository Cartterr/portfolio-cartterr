import React, { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number }

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const dprRef = useRef<number>(1)

  const resize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)

    const area = rect.width * rect.height
    const base = Math.max(30, Math.min(120, Math.floor(area / 18000)))
    const current = particlesRef.current.length
    if (current < base) {
      for (let i = current; i < base; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25 * dpr,
          vy: (Math.random() - 0.5) * 0.25 * dpr,
        })
      }
    } else if (current > base) {
      particlesRef.current = particlesRef.current.slice(0, base)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    resize()

    const loop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      const dpr = dprRef.current
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }

      ctx.lineWidth = 1 * dpr
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist2 = dx * dx + dy * dy
          const maxDist = 140 * dpr
          if (dist2 < maxDist * maxDist) {
            const t = 1 - Math.sqrt(dist2) / maxDist
            ctx.strokeStyle = `rgba(255,255,255,${0.06 * t})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    const onResize = () => resize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default ParticleNetwork


