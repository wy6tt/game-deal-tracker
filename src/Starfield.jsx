import { useEffect, useRef } from "react"

function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let animationId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars = Array.from({ length: 150 }, () => {
      const green = Math.random() < 0.3
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: green ? Math.random() * 2 + 1 : Math.random() * 1.2 + 0.2,
        opacity: green ? Math.random() * 0.5 + 0.5 : Math.random(),
        speed: Math.random() * 0.3 + 0.05,
        twinkleSpeed: green ? Math.random() * 0.04 + 0.01 : Math.random() * 0.02 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        green,
      }
    })

    const shootingStars = []

    const spawnShootingStar = () => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        length: Math.random() * 120 + 60,
        speed: Math.random() * 6 + 4,
        opacity: 1,
        angle: Math.PI / 4,
      })
    }

    setInterval(spawnShootingStar, 3000)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        star.opacity += star.twinkleSpeed * star.twinkleDir
        if (star.opacity >= 1 || star.opacity <= 0.1) star.twinkleDir *= -1

        if (star.green) {
          ctx.shadowBlur = 8
          ctx.shadowColor = "rgba(74, 222, 128, 0.8)"
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.green
          ? `rgba(74, 222, 128, ${star.opacity})`
          : `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()
        ctx.shadowBlur = 0

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i]
        const gradient = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.length,
          s.y - Math.sin(s.angle) * s.length
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()

        s.x += Math.cos(s.angle) * s.speed
        s.y += Math.sin(s.angle) * s.speed
        s.opacity -= 0.015

        if (s.opacity <= 0) shootingStars.splice(i, 1)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  )
}

export default Starfield
