import { useEffect, useState, useCallback } from "react"

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY })
    })
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"], input, textarea, select')
      setIsHovering(!!isInteractive)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.body.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseover", handleMouseOver, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseover", handleMouseOver)
    }
  }, [handleMouseMove])

  return (
    <>
      <div
        className="fixed pointer-events-none hidden lg:block"
        style={{
          left: position.x,
          top: position.y,
          width: isHovering ? "500px" : "400px",
          height: isHovering ? "500px" : "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(var(--glow-color)) 0%, transparent 65%)",
          transform: "translate(-50%, -50%)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease, height 0.3s ease",
          zIndex: 0,
          filter: "blur(10px)",
        }}
      />
      <div
        className="fixed pointer-events-none hidden lg:block"
        style={{
          left: position.x,
          top: position.y,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          opacity: isVisible ? 0.15 : 0,
          transition: "opacity 0.2s ease",
          filter: "blur(4px)",
          mixBlendMode: "screen",
        }}
      />
    </>
  )
}
