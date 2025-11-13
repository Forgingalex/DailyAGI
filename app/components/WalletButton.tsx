'use client'

import { useWallet } from '../hooks/useWallet'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function WalletButton() {
  const { isConnected, address, ensName, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <button
        onClick={connect}
        className="group relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 hover:from-pink-600 hover:via-rose-600 hover:to-fuchsia-600 rounded-xl font-medium text-white transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 animate-glow overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/20 to-fuchsia-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
        <span className="relative z-10">Connect Wallet</span>
        <div className="absolute inset-0 rounded-xl border-2 border-pink-300/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-ring"></div>
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-2 bg-pink-900/40 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20">
        {ensName ? (
          <span className="text-sm font-medium text-pink-100">{ensName}</span>
        ) : (
          <span className="text-sm font-mono text-pink-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        )}
        <button
          onClick={copyAddress}
          className="p-1.5 hover:bg-pink-800/50 rounded-lg transition-all duration-200 hover:scale-110"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400 animate-fade-in" />
          ) : (
            <Copy className="w-4 h-4 text-pink-400" />
          )}
        </button>
      </div>
      <button
        onClick={disconnect}
        className="p-2 bg-pink-900/40 hover:bg-pink-800/60 backdrop-blur-sm rounded-xl border border-pink-800/50 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/20"
        title="Disconnect"
      >
        <LogOut className="w-5 h-5 text-pink-400 hover:text-pink-300 transition-colors" />
      </button>
    </div>
  )
}

