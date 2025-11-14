'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface Tab {
  id: string
  label: string
  icon: LucideIcon
}

interface BottomTabsProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export function BottomTabs({ tabs, activeTab, onTabChange }: BottomTabsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass-strong border-t border-white/25 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 159, 243, 0.2) 0%, rgba(197, 108, 240, 0.2) 100%)',
                    }}
                    layoutId="activeTab"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`relative z-10 w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                />
                <span 
                  className={`relative z-10 text-xs font-medium transition-colors ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}



