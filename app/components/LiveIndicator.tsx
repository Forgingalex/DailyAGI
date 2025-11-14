'use client'

import { motion } from 'framer-motion'
import { Activity } from 'lucide-react'

export function LiveIndicator() {
  return (
    <motion.div
      className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/20"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <motion.div
        className="relative"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.3)' }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative w-2 h-2 rounded-full bg-green-500" />
      </motion.div>
      <Activity className="w-5 h-5 text-white animate-pulse" />
      <span className="text-white text-sm font-medium">Live</span>
    </motion.div>
  )
}



