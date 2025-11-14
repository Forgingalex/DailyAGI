'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, Bell, Wallet, Database, Shield, Moon, Sun, Copy, Check } from 'lucide-react'
import { useWallet } from '../hooks/useWallet'
import { useTheme } from '../providers'
import { Navbar } from '../components/Navbar'
import { formatAddress } from '../utils/wallet'

export default function SettingsPage() {
  const { address, isConnected, disconnect } = useWallet()
  const { theme, toggleTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    reminders: true,
    spending: true,
    grocery: true,
  })
  const [agentPermissions, setAgentPermissions] = useState({
    reminders: true,
    spending: true,
    grocery: true,
  })
  const [ipfsCids, setIpfsCids] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    // Load IPFS CIDs from localStorage or API
    const saved = localStorage.getItem('ipfs_cids')
    if (saved) {
      setIpfsCids(JSON.parse(saved))
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(text)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4a5e8] via-[#c28dd9] to-[#a875c7]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold font-display text-white premium-heading mb-8">
            Settings
          </h1>

          <div className="space-y-6">
            {/* Wallet Info */}
            <motion.div
              className="p-6 glass-strong rounded-2xl border border-white/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Wallet</h2>
              </div>
              {isConnected && address ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 glass rounded-xl">
                    <span className="text-white/70">Address</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono">{formatAddress(address)}</span>
                      <motion.button
                        onClick={() => copyToClipboard(address)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied === address ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/80" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                  <motion.button
                    onClick={disconnect}
                    className="w-full px-4 py-2 glass rounded-xl text-white font-medium transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Disconnect Wallet
                  </motion.button>
                </div>
              ) : (
                <p className="text-white/70">No wallet connected</p>
              )}
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              className="p-6 glass-strong rounded-2xl border border-white/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 glass rounded-xl">
                    <span className="text-white capitalize">{key}</span>
                    <motion.button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-green-500' : 'bg-white/20'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                        animate={{ x: value ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Agent Permissions */}
            <motion.div
              className="p-6 glass-strong rounded-2xl border border-white/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Agent Permissions</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(agentPermissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 glass rounded-xl">
                    <span className="text-white capitalize">{key} Agent</span>
                    <motion.button
                      onClick={() => setAgentPermissions({ ...agentPermissions, [key]: !value })}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        value ? 'bg-green-500' : 'bg-white/20'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"
                        animate={{ x: value ? 24 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </motion.button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* IPFS Data */}
            <motion.div
              className="p-6 glass-strong rounded-2xl border border-white/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">IPFS Stored Data</h2>
              </div>
              {ipfsCids.length > 0 ? (
                <div className="space-y-2">
                  {ipfsCids.map((cid, index) => (
                    <div key={index} className="flex items-center justify-between p-3 glass rounded-xl">
                      <span className="text-white/70 font-mono text-sm">{cid}</span>
                      <motion.button
                        onClick={() => copyToClipboard(cid)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {copied === cid ? (
                          <Check className="w-4 h-4 text-white" />
                        ) : (
                          <Copy className="w-4 h-4 text-white/80" />
                        )}
                      </motion.button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">No IPFS data stored yet</p>
              )}
            </motion.div>

            {/* Theme */}
            <motion.div
              className="p-6 glass-strong rounded-2xl border border-white/25"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-4">
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
                <h2 className="text-2xl font-bold text-white">Theme</h2>
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-xl">
                <span className="text-white capitalize">{theme} Mode</span>
                <motion.button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg glass transition-all"
                  whileHover={{ scale: 1.1, rotate: 12 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-white" />
                  ) : (
                    <Moon className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}



