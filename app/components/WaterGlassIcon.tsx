'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface WaterGlassIconProps {
  icon: LucideIcon
  size?: number
  className?: string
  shape?: 'circle' | 'pill'
}

export function WaterGlassIcon({ icon: Icon, size = 24, className = '', shape = 'pill' }: WaterGlassIconProps) {
  const isPill = shape === 'pill'
  const containerSize = size + 32
  
  return (
    <motion.div
      className={`water-glass-icon ${isPill ? 'water-glass-icon-pill' : 'water-glass-icon-circle'} ${className}`}
      animate={{
        y: [0, -16, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{
        scale: 1.2,
        y: -20,
        rotate: [0, 8, -8, 0],
      }}
      style={{
        width: `${containerSize}px`,
        height: `${isPill ? containerSize * 0.7 : containerSize}px`,
      }}
    >
      {/* Inner shine effect */}
      <div className="water-glass-icon-shine" />
      
      {/* Icon */}
      <Icon 
        className="relative z-10 text-white" 
        size={size}
        style={{
          filter: 'drop-shadow(0 2px 12px rgba(255, 255, 255, 0.5))',
        }}
      />
    </motion.div>
  )
}
