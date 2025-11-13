'use client'

import { WalletButton } from './components/WalletButton'
import { Dashboard } from './components/Dashboard'
import { ParticleBackground } from './components/ParticleBackground'
import { useWallet } from './hooks/useWallet'
import { useTheme } from './providers'
import { Moon, Sun, Sparkles, Eye, Bell, DollarSign, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const { isConnected, address, ensName, avatar } = useWallet()
  const { theme, toggleTheme } = useTheme()
  const [demoMode, setDemoMode] = useState(false)

  // Use demo mode if not connected, or show real dashboard if connected
  const showDashboard = isConnected || demoMode
  const demoAddress = demoMode ? '0x1234567890123456789012345678901234567890' : address

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-950 via-rose-950 to-fuchsia-950 relative overflow-hidden">
      {/* Particle background */}
      <ParticleBackground />
      
      {/* Animated background elements with morphing */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-float animate-morph"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-float animate-morph" style={{ animationDelay: '2s', animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl animate-pulse-slow animate-morph" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-pink-400/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s', animationDuration: '8s' }}></div>
      </div>

      <nav className="relative border-b border-pink-900/50 bg-pink-950/30 backdrop-blur-xl z-20 glass-strong">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-pink-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity animate-pulse-ring"></div>
              <Sparkles className="w-6 h-6 text-pink-400 animate-pulse relative z-10 group-hover:scale-125 transition-transform duration-300" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent animate-gradient-shift relative">
              DAILYAGI
              <span className="absolute inset-0 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 bg-clip-text text-transparent opacity-0 hover:opacity-100 transition-opacity animate-shimmer"></span>
            </h1>
            <span className="text-xs text-pink-300/60 animate-pulse">v1.0</span>
          </div>
          <div className="flex items-center gap-3 animate-fade-in">
            {!showDashboard && (
              <button
                onClick={() => setDemoMode(true)}
                className="group relative flex items-center gap-2 px-4 py-2 bg-pink-900/40 hover:bg-pink-800/60 backdrop-blur-sm border border-pink-800/50 rounded-xl text-pink-200 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/10 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="relative z-10">Demo</span>
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-pink-900/40 hover:bg-pink-800/60 backdrop-blur-sm border border-pink-800/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20 hover:rotate-12 relative group"
              aria-label="Toggle theme"
            >
              <div className="absolute inset-0 rounded-xl bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse-ring"></div>
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-pink-300 transition-transform group-hover:rotate-180 duration-500 relative z-10" />
              ) : (
                <Moon className="w-5 h-5 text-pink-400 transition-transform group-hover:rotate-180 duration-500 relative z-10" />
              )}
            </button>
            <WalletButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {!showDashboard ? (
          <div className="max-w-4xl mx-auto mt-12 animate-fade-in-up">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="mb-6 animate-float relative inline-block">
                <div className="absolute inset-0 bg-pink-400 blur-2xl opacity-50 animate-pulse-ring"></div>
                <Sparkles className="w-20 h-20 text-pink-400 mx-auto relative z-10 hover:scale-125 transition-transform duration-300" />
              </div>
              <h2 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent animate-gradient-shift">
                Welcome to DAILYAGI
              </h2>
              <p className="text-pink-200/80 mb-4 text-xl animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                Your decentralized AI life assistant
              </p>
              <p className="text-pink-300/60 text-lg mb-8 animate-slide-up" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                Manage reminders, track spending, and organize groceries with AI-powered automation
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: Bell, title: 'Smart Reminders', desc: 'AI-powered scheduling', color: 'from-pink-500 to-rose-500' },
                { icon: DollarSign, title: 'Spending Insights', desc: 'Track & analyze expenses', color: 'from-rose-500 to-fuchsia-500' },
                { icon: ShoppingCart, title: 'Grocery Lists', desc: 'Vision AI shopping assistant', color: 'from-fuchsia-500 to-pink-500' },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className="group relative p-6 bg-pink-900/20 backdrop-blur-xl rounded-2xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-500 hover:shadow-xl hover:shadow-pink-500/20 hover:scale-105 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${0.6 + index * 0.1}s`, animationFillMode: 'both' }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 rounded-2xl"></div>
                    <div className="relative z-10">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} opacity-20 group-hover:opacity-30 mb-4 inline-block group-hover:scale-110 transition-all duration-300`}>
                        <Icon className="w-6 h-6 text-pink-300" />
                      </div>
                      <h3 className="text-xl font-bold text-pink-100 mb-2">{feature.title}</h3>
                      <p className="text-pink-300/60 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA Section */}
            <div className="bg-pink-900/20 backdrop-blur-xl rounded-2xl p-8 border border-pink-800/50 shadow-2xl shadow-pink-900/20 hover:border-pink-700/70 transition-all duration-300 hover:shadow-pink-500/30 hover-lift hover-glow group relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/0 via-rose-500/10 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-bold text-pink-100 mb-4">Ready to get started?</h3>
                <p className="text-pink-300/60 mb-6">Connect your wallet to unlock the full power of DAILYAGI</p>
                <WalletButton />
              </div>
            </div>
          </div>
        ) : (
          <>
            {demoMode && !isConnected && (
              <div className="mb-4 max-w-7xl mx-auto">
                <div className="bg-pink-900/30 backdrop-blur-xl rounded-xl p-4 border border-pink-800/50 flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Eye className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-pink-100 font-medium">Demo Mode Active</p>
                      <p className="text-xs text-pink-300/60">You're viewing a preview. Connect your wallet for full functionality.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDemoMode(false)}
                      className="px-4 py-2 bg-pink-900/40 hover:bg-pink-800/60 rounded-lg text-pink-200 text-sm transition-all duration-300 border border-pink-800/50"
                    >
                      Exit Demo
                    </button>
                    <WalletButton />
                  </div>
                </div>
              </div>
            )}
            <Dashboard
              address={demoAddress}
              ensName={demoMode ? 'Demo User' : ensName}
              avatar={avatar}
            />
          </>
        )}
      </div>
    </main>
  )
}
