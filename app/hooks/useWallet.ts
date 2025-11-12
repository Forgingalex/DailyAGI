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
    const checkConnection = async () => {
      const savedAddress = localStorage.getItem('wallet_address')
      if (savedAddress) {
        // Try to reconnect
        try {
          const provider = await EthereumProvider.init({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
            chains: [137, 8453], // Polygon, Base
            optionalChains: [1, 5], // Ethereum mainnet, Goerli
            showQrModal: false,
          })

          if (provider.session) {
            const accounts = provider.accounts
            if (accounts.length > 0) {
              const address = accounts[0]
              const ensName = await resolveENS(address)
              setState({
                isConnected: true,
                address,
                ensName,
                avatar: null,
                provider,
                signer: null,
              })
            }
          }
        } catch (error) {
          console.error('Reconnection failed:', error)
          localStorage.removeItem('wallet_address')
        }
      }
    }

    checkConnection()
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
    const name = await provider.lookupAddress(address)
    return name
  } catch {
    return null
  }
}


