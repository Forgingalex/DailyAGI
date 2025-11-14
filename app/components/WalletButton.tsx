'use client'

import { useWallet } from '../hooks/useWallet'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

export function WalletButton() {
  const { isConnected, address, ensName, connect, disconnect } = useWallet()
  const [copied, setCopied] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isConnected) {
    return (
      <motion.button
        onClick={async () => {
          setIsConnecting(true)
          try {
            await connect()
            console.log('Wallet connection completed, state should update')
            setIsConnecting(false)
            // Small delay to ensure state propagates, then trigger re-render
            setTimeout(() => {
              // Dispatch custom event to trigger re-check
              window.dispatchEvent(new Event('walletConnected'))
            }, 300)
          } catch (error) {
            setIsConnecting(false)
            console.error('Connection error:', error)
          }
        }}
        disabled={isConnecting}
        className="group relative flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
          boxShadow: '0 4px 20px rgba(255, 159, 243, 0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: [
            '0 4px 20px rgba(255, 159, 243, 0.4)',
            '0 8px 30px rgba(197, 108, 240, 0.6)',
            '0 4px 20px rgba(255, 159, 243, 0.4)',
          ],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        <Wallet className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
        <span className="relative z-10">Connect Wallet</span>
      </motion.button>
    )
  }

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl border border-white/25">
        {ensName ? (
          <span className="text-sm font-medium text-white">{ensName}</span>
        ) : (
          <span className="text-sm font-mono text-white/90">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        )}
        <button
          onClick={copyAddress}
          className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-white" />
          ) : (
            <Copy className="w-4 h-4 text-white/80" />
          )}
        </button>
      </div>
      <button
        onClick={disconnect}
        className="p-2 glass rounded-xl border border-white/25 transition-all duration-300 hover:scale-110"
        title="Disconnect"
      >
        <LogOut className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
      </button>
    </motion.div>
  )
}
