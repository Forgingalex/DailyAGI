'use client'

import { useState, useEffect } from 'react'
import { RemindersTab } from './tabs/RemindersTab'
import { SpendingTab } from './tabs/SpendingTab'
import { GroceryTab } from './tabs/GroceryTab'
import { Bell, DollarSign, ShoppingCart, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { StatCard } from './StatCard'
import { LiveIndicator } from './LiveIndicator'
import { useWallet } from '../hooks/useWallet'

interface DashboardProps {
  address: string | null
  ensName: string | null
  avatar: string | null
}

type Tab = 'reminders' | 'spending' | 'grocery'

export function Dashboard({ address, ensName, avatar }: DashboardProps) {
  const { isConnected } = useWallet()
  const [activeTab, setActiveTab] = useState<Tab>('reminders')
  const [stats, setStats] = useState({
    reminders: 12,
    spending: 847,
    grocery: 8,
  })

  // Use demo stats if not connected, otherwise load real data
  useEffect(() => {
    if (isConnected && address) {
      // Load real stats from API
      // For now, keep demo stats
    } else {
      // Demo mode - use hardcoded values
      setStats({ reminders: 12, spending: 847, grocery: 8 })
    }
  }, [isConnected, address])

  const tabs = [
    { id: 'reminders' as Tab, label: 'Reminders', icon: Bell },
    { id: 'spending' as Tab, label: 'Spending', icon: DollarSign },
    { id: 'grocery' as Tab, label: 'Grocery', icon: ShoppingCart },
  ]

  return (
    <motion.div
      className="max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.div
        className="mb-8 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-bold font-display text-white mb-2 premium-heading relative z-10" data-text={`Welcome back${ensName ? `, ${ensName}` : ''}!`} style={{ textShadow: '0 2px 12px rgba(0, 0, 0, 0.1)' }}>
              Welcome back{ensName ? `, ${ensName}` : ''}!
            </h2>
            <p className="text-lg relative z-10" style={{ color: '#f3e8ff', textShadow: '0 1px 6px rgba(0, 0, 0, 0.08)' }}>
              Your AI-powered life assistant dashboard
            </p>
          </div>
          <LiveIndicator />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const statValue = tab.id === 'reminders' ? stats.reminders : tab.id === 'spending' ? `$${stats.spending}` : stats.grocery
            const statLabel = tab.id === 'reminders' ? 'Active' : tab.id === 'spending' ? 'Spent' : 'Items'

            return (
              <StatCard
                key={tab.id}
                icon={Icon}
                label={tab.label}
                value={statValue}
                subtitle={statLabel}
                onClick={() => setActiveTab(tab.id)}
                delay={0.2 + index * 0.1}
              />
            )
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="glass-strong rounded-2xl border border-white/25 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          boxShadow: '0 20px 60px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="flex border-b border-white/25" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
                style={isActive ? {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                } : {}}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
                    }}
                    layoutId="activeTab"
                  />
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110 rotate-12' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'reminders' && <RemindersTab address={address} />}
          {activeTab === 'spending' && <SpendingTab address={address} />}
          {activeTab === 'grocery' && <GroceryTab address={address} />}
        </div>
      </motion.div>
    </motion.div>
  )
}
