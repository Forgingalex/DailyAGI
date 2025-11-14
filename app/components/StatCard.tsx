'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { WaterGlassIcon } from './WaterGlassIcon'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  subtitle?: string
  onClick?: () => void
  delay?: number
}

export function StatCard({ icon: Icon, label, value, subtitle, onClick, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      className="group relative p-6 glass-strong rounded-2xl border border-white/25 transition-all duration-500 overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ 
        scale: 1.05,
        y: -8,
      }}
      onClick={onClick}
      style={{
        boxShadow: '0 16px 64px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
      }}
    >
      {/* Hover gradient overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <WaterGlassIcon icon={Icon} size={24} />
        </div>
        <div>
          <p className="text-3xl font-bold text-white mb-1">
            {value}
          </p>
          <p className="text-sm font-medium" style={{ color: '#f3e8ff' }}>{subtitle || label}</p>
          <p className="text-white font-semibold mt-2">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}



