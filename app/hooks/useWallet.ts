'use client'

import { useState, useEffect } from 'react'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import { ethers } from 'ethers'

interface WalletState {
  isConnected: boolean
  address: string | null
  ensName: string | null
  avatar: string | null
  provider: EthereumProvider | null
  signer: ethers.JsonRpcSigner | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    ensName: null,
    avatar: null,
    provider: null,
    signer: null,
  })

  useEffect(() => {
    // Skip WalletConnect initialization on mount to prevent blocking
    // Only initialize when user clicks connect
    const savedAddress = localStorage.getItem('wallet_address')
    if (savedAddress) {
      // Just set the address, don't try to reconnect automatically
      setState(prev => ({
        ...prev,
        address: savedAddress,
        isConnected: false, // Will be set to true when user connects
      }))
    }
  }, [])

  const connect = async () => {
    try {
      const provider = await EthereumProvider.init({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
        chains: [137, 8453], // Polygon, Base
        optionalChains: [1, 5],
        showQrModal: true,
      })

      await provider.connect()

      const accounts = provider.accounts
      if (accounts.length > 0) {
        const address = accounts[0]
        const ensName = await resolveENS(address)
        localStorage.setItem('wallet_address', address)
        
        setState({
          isConnected: true,
          address,
          ensName,
          avatar: null,
          provider,
          signer: null,
        })
      }
    } catch (error) {
      console.error('Connection failed:', error)
      throw error
    }
  }

  const disconnect = async () => {
    if (state.provider) {
      await state.provider.disconnect()
    }
    localStorage.removeItem('wallet_address')
    setState({
      isConnected: false,
      address: null,
      ensName: null,
      avatar: null,
      provider: null,
      signer: null,
    })
  }

  return {
    ...state,
    connect,
    disconnect,
  }
}

async function resolveENS(address: string): Promise<string | null> {
  try {
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com')
    // Add timeout for ENS resolution
    const timeoutPromise = new Promise<null>((resolve) => 
      setTimeout(() => resolve(null), 2000)
    )
    const namePromise = provider.lookupAddress(address)
    const name = await Promise.race([namePromise, timeoutPromise])
    return name
  } catch {
    return null
  }
}


