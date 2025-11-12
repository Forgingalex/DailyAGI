'use client'

import { useEffect, useState } from 'react'
import { WalletButton } from './components/WalletButton'
import { Dashboard } from './components/Dashboard'
import { useWallet } from './hooks/useWallet'
import { useTheme } from './providers'
import { Moon, Sun } from 'lucide-react'

export default function Home() {
  const { isConnected, address, ensName, avatar } = useWallet()
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="min-h-screen bg-gradient-to-br from-sentient-950 via-sentient-900 to-sentient-950 dark:from-black dark:via-sentient-950 dark:to-black">
      <nav className="border-b border-sentient-800 bg-sentient-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sentient-400 via-sentient-500 to-accent-pink bg-clip-text text-transparent">
              DAILYAGI
            </h1>
            <span className="text-xs text-gray-400">v1.0</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-sentient-800 hover:bg-sentient-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-sentient-300" />
              ) : (
                <Moon className="w-5 h-5 text-sentient-400" />
              )}
            </button>
            <WalletButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <div className="max-w-2xl mx-auto mt-20 text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Welcome to DAILYAGI
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              Connect your wallet to get started with your decentralized AI life assistant
            </p>
            <div className="bg-sentient-800/50 rounded-lg p-8 backdrop-blur-sm border border-sentient-700">
              <WalletButton />
            </div>
          </div>
        ) : (
          <Dashboard
            address={address}
            ensName={ensName}
            avatar={avatar}
          />
        )}
      </div>
    </main>
  )
}

