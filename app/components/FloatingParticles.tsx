'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particleCount = 60
    const particles: HTMLDivElement[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      const size = Math.random() * 3 + 1.5
      const startX = Math.random() * 100
      const startY = Math.random() * 100
      const duration = Math.random() * 20 + 30
      const delay = Math.random() * 10
      
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${startX}%`
      particle.style.top = `${startY}%`
      particle.style.animationDuration = `${duration}s`
      particle.style.animationDelay = `${delay}s`
      particle.style.opacity = `${0.15 + Math.random() * 0.25}`
      
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(particle => particle.remove())
    }
  }, [])

  return (
    <>
      <motion.div 
        ref={containerRef} 
        className="floating-particles"
        animate={{
          y: [0, -15, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Slow Swirling Gradient Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 60%)',
        }}
        animate={{
          x: [0, 20, -20, 0],
          y: [0, 15, -15, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  )
}
