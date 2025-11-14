'use client'

import { motion } from 'framer-motion'
import { Eye, X } from 'lucide-react'
import { WalletButton } from './WalletButton'

interface DemoBannerProps {
  onExit: () => void
}

export function DemoBanner({ onExit }: DemoBannerProps) {
  return (
    <motion.div
      className="mb-6 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="glass rounded-xl p-4 border border-white/25 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff9ff3]/20 via-[#c56cf0]/20 to-[#ff9ff3]/20 animate-gradient-slow" />
        
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">Demo Mode Active</p>
              <p className="text-xs" style={{ color: '#f3e8ff' }}>
                You're viewing a preview. Connect your wallet for full functionality.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              onClick={onExit}
              className="px-4 py-2 glass rounded-lg text-white text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-4 h-4" />
              Exit Demo
            </motion.button>
            <WalletButton />
          </div>
        </div>
      </div>
    </motion.div>
  )
}



