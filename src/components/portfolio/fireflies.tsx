import { useEffect, useRef } from 'react'

export const Fireflies = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let lastTime = 0
        const fps = 10 // Lower FPS to feel like retro stepped animation
        const interval = 1000 / fps

        // Detect reduced motion preference
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (prefersReduced) return

        let width = (canvas.width = window.innerWidth)
        let height = (canvas.height = window.innerHeight)

        const handleResize = () => {
            if (!canvas) return
            width = canvas.width = window.innerWidth
            height = canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        interface Particle {
            x: number
            y: number
            size: number
            vx: number
            vy: number
            alpha: number
            alphaSpeed: number
            type: 'firefly' | 'leaf'
            rotation?: number
            rotSpeed?: number
        }

        const particles: Array<Particle> = []

        // Spawn fireflies
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 3 + 2, // 2px to 5px
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                alpha: Math.random(),
                alphaSpeed: (Math.random() * 0.02 + 0.01) * (Math.random() > 0.5 ? 1 : -1),
                type: 'firefly'
            })
        }

        // Spawn falling leaves
        for (let i = 0; i < 6; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * -height, // Start above screen
                size: Math.random() * 4 + 4, // 4px to 8px
                vx: Math.random() * 0.5 + 0.2, // Drift right
                vy: Math.random() * 1.0 + 0.5, // Fall down
                alpha: Math.random() * 0.4 + 0.6,
                alphaSpeed: 0,
                type: 'leaf',
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.05
            })
        }

        const update = () => {
            for (const p of particles) {
                if (p.type === 'firefly') {
                    p.x += p.vx
                    p.y += p.vy
                    p.alpha += p.alphaSpeed

                    // Bounce off edges
                    if (p.x < 0 || p.x > width) p.vx *= -1
                    if (p.y < 0 || p.y > height) p.vy *= -1

                    // Fade in and out
                    if (p.alpha > 1) {
                        p.alpha = 1
                        p.alphaSpeed *= -1
                    } else if (p.alpha < 0.1) {
                        p.alpha = 0.1
                        p.alphaSpeed *= -1
                    }
                } else {
                    // Leaf movement (drift and fall)
                    p.x += p.vx
                    p.y += p.vy
                    if (p.rotation !== undefined && p.rotSpeed !== undefined) {
                        p.rotation += p.rotSpeed
                    }

                    // Reset leaf if it goes off bottom or right
                    if (p.y > height || p.x > width) {
                        p.y = -20
                        p.x = Math.random() * width * 0.8
                        p.vy = Math.random() * 1.0 + 0.5
                        p.vx = Math.random() * 0.5 + 0.2
                    }
                }
            }
        }

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            for (const p of particles) {
                ctx.save()
                ctx.globalAlpha = p.alpha

                if (p.type === 'firefly') {
                    // Draw a blocky square firefly (retro style)
                    ctx.fillStyle = '#F6C64E' // Tree gold
                    ctx.shadowColor = '#F6C64E'
                    ctx.shadowBlur = p.size * 2
                    ctx.fillRect(
                        Math.floor(p.x),
                        Math.floor(p.y),
                        Math.floor(p.size),
                        Math.floor(p.size)
                    )
                } else {
                    // Draw a blocky leaf fragment
                    ctx.fillStyle = '#E88A24' // Ember
                    ctx.translate(Math.floor(p.x), Math.floor(p.y))
                    if (p.rotation !== undefined) {
                        ctx.rotate(p.rotation)
                    }
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
                }

                ctx.restore()
            }
        }

        const loop = (timestamp: number) => {
            animationFrameId = requestAnimationFrame(loop)

            const elapsed = timestamp - lastTime
            if (elapsed > interval) {
                lastTime = timestamp - (elapsed % interval)
                update()
                draw()
            }
        }

        animationFrameId = requestAnimationFrame(loop)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return <canvas ref={canvasRef} className='pointer-events-none fixed inset-0 z-0' />
}
