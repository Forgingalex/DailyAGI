'use client'

import { WalletButton } from './components/WalletButton'
import { Dashboard } from './components/Dashboard'
import { FloatingParticles } from './components/FloatingParticles'
import { WaterGlassIcon } from './components/WaterGlassIcon'
import { Navbar } from './components/Navbar'
import { DemoBanner } from './components/DemoBanner'
import { ChatModal } from './components/ChatModal'
import { useWallet } from './hooks/useWallet'
import { useTheme } from './providers'
import { Sparkles, MessageCircle, ExternalLink, Bell, DollarSign, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  const { isConnected, address, ensName, avatar } = useWallet()
  const { theme, toggleTheme } = useTheme()
  const [demoMode, setDemoMode] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)

  // Show dashboard if connected, has address, or in demo mode
  const showDashboard = (isConnected || address) || demoMode
  const demoAddress = demoMode ? '0x1234567890123456789012345678901234567890' : address
  
  // Debug logging in useEffect to avoid render issues
  useEffect(() => {
    console.log('Dashboard state:', { 
      isConnected, 
      address, 
      showDashboard, 
      demoMode,
      hasAddress: !!address,
      localStorage: typeof window !== 'undefined' ? localStorage.getItem('wallet_address') : null
    })
  }, [isConnected, address, showDashboard, demoMode])
  
  // Force re-render when address changes
  useEffect(() => {
    if (address) {
      console.log('Address detected, dashboard should show:', address)
    }
  }, [address])
  
  // Listen for wallet connection event
  useEffect(() => {
    const handleWalletConnected = () => {
      console.log('Wallet connected event received, forcing re-render')
      // Force component to re-check wallet state
      const savedAddress = typeof window !== 'undefined' ? localStorage.getItem('wallet_address') : null
      if (savedAddress) {
        // Trigger a state update by checking localStorage
        window.location.reload() // Reload to ensure state is synced
      }
    }
    
    window.addEventListener('walletConnected', handleWalletConnected)
    return () => window.removeEventListener('walletConnected', handleWalletConnected)
  }, [])

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#d4a5e8] via-[#c28dd9] to-[#a875c7] bg-[length:400%_400%] animate-gradient-slow">
      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Soft floating orbs - flowing light effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute top-10 left-5 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(212, 165, 232, 0.3)' }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-10 right-5 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(168, 117, 199, 0.25)' }}
          animate={{
            y: [0, 30, 0],
            x: [0, -25, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(194, 141, 217, 0.2)' }}
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.25, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <Navbar />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {!showDashboard ? (
          <div className="max-w-6xl mx-auto">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-16 mt-12 hero-backdrop relative"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            >
              <motion.div
                className="mb-8 relative inline-block"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.div
                  className="absolute inset-0 blur-2xl opacity-40"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
                  animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                <Sparkles className="w-28 h-28 relative z-10 text-white" style={{ filter: 'drop-shadow(0 2px 12px rgba(255, 255, 255, 0.4))' }} />
              </motion.div>
              <motion.h2
                className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold font-display mb-6 premium-heading relative z-10"
                data-text="Welcome to DAILYAGI"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                style={{
                  textShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                }}
              >
                Welcome to DAILYAGI
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-4 font-light relative z-10 px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                style={{
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}
              >
                Your decentralized AI life assistant
              </motion.p>
              <motion.p
                className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto relative z-10 px-4"
                style={{ color: '#f3e8ff', textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
              >
                Manage reminders, track spending, and organize groceries with AI-powered automation
              </motion.p>
              <motion.div
                className="mt-8 flex items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9, ease: 'easeOut' }}
              >
                <motion.button
                  onClick={() => setDemoMode(true)}
                  className="group relative flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-medium transition-all duration-300 hover:scale-105 overflow-hidden glass border border-white/25"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <span className="relative z-10">Try Demo</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Bell, title: 'Smart Reminders', desc: 'AI-powered scheduling and notifications' },
                { icon: DollarSign, title: 'Spending Insights', desc: 'Track & analyze your expenses' },
                { icon: ShoppingCart, title: 'Grocery Lists', desc: 'Vision AI shopping assistant' },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    className="group relative p-8 glass-strong rounded-2xl border border-white/25 transition-all duration-500"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 + index * 0.15, ease: 'easeOut' }}
                    whileHover={{ 
                      y: -16, 
                      scale: 1.04,
                    }}
                    style={{
                      boxShadow: '0 16px 64px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      }}
                    />
                    <div className="relative z-10">
                      <WaterGlassIcon icon={Icon} size={32} className="mb-4 sm:mb-6" />
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-2 sm:mb-3">{feature.title}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: '#f3e8ff' }}>{feature.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* CTA Section */}
            <motion.div
              className="glass-strong rounded-3xl p-6 sm:p-8 md:p-12 border border-white/25 text-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <motion.h3
                className="text-2xl sm:text-3xl font-bold font-display text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6 }}
              >
                Ready to get started?
              </motion.h3>
              <motion.p
                className="mb-6 sm:mb-8 text-base sm:text-lg px-4"
                style={{ color: '#f3e8ff' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.7 }}
              >
                Connect your wallet to unlock the full power of DAILYAGI
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
              >
                <WalletButton />
              </motion.div>
            </motion.div>
          </div>
        ) : (
          <>
            {demoMode && !isConnected && (
              <DemoBanner onExit={() => setDemoMode(false)} />
            )}
            
            {/* Floating Action Buttons - Bottom Right */}
            {showDashboard && (
              <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 flex flex-col gap-3 items-end">
                {/* Sentient Chat Button */}
                <motion.a
                  href="https://sentient.chat/?agent=dailyAGI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-3 rounded-xl glass-strong border border-white/25 shadow-2xl flex items-center gap-2 text-white font-medium"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 159, 243, 0.3) 0%, rgba(197, 108, 240, 0.3) 100%)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="text-sm">Sentient</span>
                </motion.a>
                
                {/* Chat Modal Button */}
                <motion.button
                  onClick={() => setChatModalOpen(true)}
                  className="p-4 rounded-full glass-strong border border-white/25 shadow-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
                    boxShadow: '0 8px 32px rgba(255, 159, 243, 0.4)',
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <MessageCircle className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            )}
            
            <ChatModal 
              isOpen={chatModalOpen} 
              onClose={() => setChatModalOpen(false)}
              demoMode={demoMode}
            />
            <Dashboard
              address={demoAddress}
              ensName={demoMode ? 'Demo User' : ensName}
              avatar={avatar}
            />
          </>
        )}
      </div>
      
      {/* Footer with Sentient Badge */}
      <footer className="relative z-10 border-t border-white/25 glass-strong mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 text-sm">
              © 2025 dailyAGI. Built with privacy and decentralization in mind.
            </p>
            <motion.div
              className="flex items-center gap-2 text-white/60 text-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Powered by</span>
              <a
                href="https://sentient.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                Sentient AGI
              </a>
            </motion.div>
          </div>
        </div>
      </footer>
    </main>
  )
}
