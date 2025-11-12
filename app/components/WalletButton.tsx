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
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sentient-500 to-accent-pink hover:from-sentient-600 hover:to-accent-pink/90 rounded-lg font-medium text-white transition-all shadow-lg hover:shadow-xl shadow-sentient-500/20"
      >
        <Wallet className="w-5 h-5" />
        Connect Wallet
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 px-4 py-2 bg-sentient-800 rounded-lg border border-sentient-700">
        {ensName ? (
          <span className="text-sm font-medium text-white">{ensName}</span>
        ) : (
          <span className="text-sm font-mono text-sentient-300">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        )}
        <button
          onClick={copyAddress}
          className="p-1 hover:bg-sentient-700 rounded transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-sentient-400" />
          ) : (
            <Copy className="w-4 h-4 text-sentient-400" />
          )}
        </button>
      </div>
      <button
        onClick={disconnect}
        className="p-2 bg-sentient-800 hover:bg-sentient-700 rounded-lg border border-sentient-700 transition-colors"
        title="Disconnect"
      >
        <LogOut className="w-5 h-5 text-sentient-400" />
      </button>
    </div>
  )
}

