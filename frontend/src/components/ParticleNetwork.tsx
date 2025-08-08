import React, { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; vx: number; vy: number }

const ParticleNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const dprRef = useRef<number>(1)
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })

  const resize = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)

    const area = rect.width * rect.height
    const base = Math.max(40, Math.min(140, Math.floor(area / 16000)))
    const current = particlesRef.current.length
    if (current < base) {
      for (let i = current; i < base; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35 * dpr,
          vy: (Math.random() - 0.5) * 0.35 * dpr,
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
      const mouse = mouseRef.current
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        if (mouse.active) {
          const dxm = mouse.x - p.x
          const dym = mouse.y - p.y
          const dist2m = dxm * dxm + dym * dym
          const maxRm = 220 * dpr
          if (dist2m < maxRm * maxRm) {
            const distm = Math.max(8, Math.sqrt(dist2m))
            const force = 0.06 * dpr * (1 - distm / maxRm)
            p.vx += (dxm / distm) * force
            p.vy += (dym / distm) * force
          }
        }
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
      }

      ctx.lineWidth = 1.2 * dpr
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist2 = dx * dx + dy * dy
          const maxDist = 160 * dpr
          if (dist2 < maxDist * maxDist) {
            const t = 1 - Math.sqrt(dist2) / maxDist
            ctx.strokeStyle = `rgba(255,255,255,${0.18 * t})`
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.2 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      if (mouse.active) {
        ctx.fillStyle = 'rgba(0,212,255,0.35)'
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 3 * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    const onResize = () => resize()
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = dprRef.current
      mouseRef.current.x = (e.clientX - rect.left) * dpr
      mouseRef.current.y = (e.clientY - rect.top) * dpr
      mouseRef.current.active = true
    }
    const onLeave = () => { mouseRef.current.active = false }
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseout', onLeave, { passive: true })
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

export default ParticleNetwork


