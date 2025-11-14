'use client'

import { motion } from 'framer-motion'
import { Sparkles, Moon, Sun } from 'lucide-react'
import { useTheme } from '../providers'
import { WalletButton } from './WalletButton'

export function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="relative border-b border-white/25 glass-strong z-20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative group">
            <motion.div
              className="absolute inset-0 blur-xl opacity-60"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <Sparkles className="w-6 h-6 relative z-10 text-white group-hover:scale-125 transition-transform duration-300" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))' }} />
          </div>
          <motion.h1
            className="text-xl sm:text-2xl md:text-3xl font-bold font-display premium-heading"
            data-text="DAILYAGI"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            DAILYAGI
          </motion.h1>
          <span className="text-xs" style={{ color: '#f3e8ff' }}>v1.0</span>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass transition-all duration-300 hover:scale-110 hover:rotate-12 relative group"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-white transition-transform group-hover:rotate-180 duration-500" />
            ) : (
              <Moon className="w-5 h-5 text-white transition-transform group-hover:rotate-180 duration-500" />
            )}
          </motion.button>
          <WalletButton />
        </motion.div>
      </div>
    </nav>
  )
}



