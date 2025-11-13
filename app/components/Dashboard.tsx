'use client'

import { useState, useEffect } from 'react'
import { RemindersTab } from './tabs/RemindersTab'
import { SpendingTab } from './tabs/SpendingTab'
import { GroceryTab } from './tabs/GroceryTab'
import { Bell, DollarSign, ShoppingCart, Sparkles, TrendingUp, Activity } from 'lucide-react'

interface DashboardProps {
  address: string | null
  ensName: string | null
  avatar: string | null
}

type Tab = 'reminders' | 'spending' | 'grocery'

export function Dashboard({ address, ensName, avatar }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('reminders')
  const [stats, setStats] = useState({
    reminders: 0,
    spending: 0,
    grocery: 0,
  })

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      setStats({
        reminders: Math.floor(12 * progress),
        spending: Math.floor(847 * progress),
        grocery: Math.floor(8 * progress),
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setStats({ reminders: 12, spending: 847, grocery: 8 })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const tabs = [
    { id: 'reminders' as Tab, label: 'Reminders', icon: Bell, color: 'from-pink-500 to-rose-500' },
    { id: 'spending' as Tab, label: 'Spending', icon: DollarSign, color: 'from-rose-500 to-fuchsia-500' },
    { id: 'grocery' as Tab, label: 'Grocery', icon: ShoppingCart, color: 'from-fuchsia-500 to-pink-500' },
  ]

  return (
    <div className="max-w-7xl mx-auto animate-fade-in-up">
      {/* Interactive Header with Stats */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-300 via-rose-300 to-fuchsia-300 bg-clip-text text-transparent mb-2 animate-gradient-shift">
              Welcome back{ensName ? `, ${ensName}` : ''}!
            </h2>
            <p className="text-pink-200/70 text-lg">
              Your AI-powered life assistant dashboard
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-900/30 backdrop-blur-xl rounded-xl border border-pink-800/50">
            <Activity className="w-5 h-5 text-pink-400 animate-pulse" />
            <span className="text-pink-200 text-sm font-medium">Live</span>
          </div>
        </div>

        {/* Interactive Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const statValue = tab.id === 'reminders' ? stats.reminders : tab.id === 'spending' ? stats.spending : stats.grocery
            const statLabel = tab.id === 'reminders' ? 'Active' : tab.id === 'spending' ? '$ Spent' : 'Items'

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative p-6 bg-pink-900/20 backdrop-blur-xl rounded-2xl border transition-all duration-500 overflow-hidden cursor-pointer ${
                  isActive
                    ? 'border-pink-500/50 shadow-2xl shadow-pink-500/30 scale-105'
                    : 'border-pink-800/50 hover:border-pink-700/70 hover:shadow-xl hover:shadow-pink-500/20 hover:scale-[1.02]'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-0 ${isActive ? 'opacity-10' : 'group-hover:opacity-5'} transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/5 to-rose-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tab.color} opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-300`}>
                      <Icon className={`w-6 h-6 text-pink-300`} />
                    </div>
                    {isActive && (
                      <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-1">
                      {statValue}
                    </p>
                    <p className="text-pink-300/60 text-sm font-medium">{statLabel}</p>
                    <p className="text-pink-200/80 font-semibold mt-2">{tab.label}</p>
                  </div>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 animate-gradient-shift"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="bg-pink-900/20 backdrop-blur-xl rounded-2xl border border-pink-800/50 overflow-hidden shadow-2xl shadow-pink-900/30 hover:shadow-pink-500/20 transition-all duration-500 hover-lift">
        <div className="flex border-b border-pink-800/50 bg-pink-950/20">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-b from-pink-800/40 to-pink-900/40 text-pink-100'
                    : 'text-pink-300/60 hover:text-pink-200 hover:bg-pink-900/20'
                }`}
              >
                {isActive && (
                  <>
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-400 animate-gradient-shift"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-fuchsia-500/10"></div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-white/5 to-fuchsia-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Icon className={`w-5 h-5 transition-all duration-300 relative z-10 ${isActive ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
                <span className="relative z-10">{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6 animate-fade-in animate-slide-up">
          {activeTab === 'reminders' && <RemindersTab address={address} />}
          {activeTab === 'spending' && <SpendingTab address={address} />}
          {activeTab === 'grocery' && <GroceryTab address={address} />}
        </div>
      </div>
    </div>
  )
}

