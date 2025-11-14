'use client'

import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Dynamic import for WalletConnect Modal
let createWalletConnectModal: any = null
let EthereumProvider: any = null

if (typeof window !== 'undefined') {
  try {
    // Try to load WalletConnect Modal v2
    const wcModal = require('@walletconnect/modal')
    createWalletConnectModal = wcModal.createWalletConnectModal || wcModal.default?.createWalletConnectModal || wcModal.default
    
    // Also load Ethereum Provider
    const wc = require('@walletconnect/ethereum-provider')
    EthereumProvider = wc.EthereumProvider || wc.default?.EthereumProvider || wc.default
  } catch (e) {
    console.warn('WalletConnect not available:', e)
  }
}

interface WalletState {
  isConnected: boolean
  address: string | null
  ensName: string | null
  avatar: string | null
  provider: any
  signer: ethers.JsonRpcSigner | null
  chainId: number | null
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    address: null,
    ensName: null,
    avatar: null,
    provider: null,
    signer: null,
    chainId: null,
  })

  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address')
    if (savedAddress) {
      // If address exists in localStorage, consider it connected
      setState(prev => ({
        ...prev,
        address: savedAddress,
        isConnected: true,
      }))
      console.log('Restored wallet connection from localStorage:', savedAddress)
    }
  }, [])

  const connect = async () => {
    try {
      // First, try to use WalletConnect Modal (shows wallet selection UI)
      if (createWalletConnectModal) {
        try {
          const modal = createWalletConnectModal({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
            metadata: {
              name: 'dailyAGI',
              description: 'AI-powered life assistant',
              url: window.location.origin,
              icons: [],
            },
            features: ['email', 'socials', 'wallet'],
            enableAccountView: true,
            enableNetworkView: true,
            enableOnramp: false,
          })

          // Open the modal - this shows wallet selection UI
          await modal.open()
          
          // Get the provider from the modal
          const provider = modal.getWalletConnectProvider()
          
          if (provider && provider.accounts && provider.accounts.length > 0) {
            const address = provider.accounts[0]
            const chainId = provider.chainId || null
            const ensName = await resolveENS(address)
            localStorage.setItem('wallet_address', address)
            
            setState({
              isConnected: true,
              address,
              ensName,
              avatar: null,
              provider,
              signer: null,
              chainId,
            })
            console.log('WalletConnect Modal connected:', { address, isConnected: true, chainId })
            return
          }
        } catch (wcModalError) {
          console.log('WalletConnect Modal failed, trying EthereumProvider:', wcModalError)
        }
      }

      // Fallback: Try WalletConnect EthereumProvider (also shows modal)
      if (EthereumProvider) {
        try {
          const provider = await EthereumProvider.init({
            projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo',
            chains: [1, 137, 8453], // Ethereum, Polygon, Base
            optionalChains: [5, 80001], // Goerli, Mumbai
            showQrModal: true, // This shows the wallet selection UI
            metadata: {
              name: 'dailyAGI',
              description: 'AI-powered life assistant',
              url: window.location.origin,
              icons: [],
            },
          })

          // Connect - this opens the modal with wallet options
          await provider.connect()

          const accounts = provider.accounts
          if (accounts.length > 0) {
            const address = accounts[0]
            const chainId = provider.chainId || null
            const ensName = await resolveENS(address)
            localStorage.setItem('wallet_address', address)
            
            setState({
              isConnected: true,
              address,
              ensName,
              avatar: null,
              provider,
              signer: null,
              chainId,
            })
            console.log('WalletConnect connected:', { address, isConnected: true, chainId })
            return
          }
        } catch (wcError) {
          console.log('WalletConnect failed, trying injected wallets:', wcError)
        }
      }

      // Last resort: Show custom wallet selection for injected wallets
      const injectedWallets = detectInjectedWallets()
      
      if (injectedWallets.length > 0) {
        // Show custom wallet selection modal
        const selectedWallet = await showWalletSelection(injectedWallets)
        
        if (selectedWallet) {
          const provider = new ethers.BrowserProvider(selectedWallet.provider)
          await provider.send('eth_requestAccounts', [])
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          const network = await provider.getNetwork()
          const ensName = await resolveENS(address)
          
          localStorage.setItem('wallet_address', address)
          
          setState({
            isConnected: true,
            address,
            ensName,
            avatar: null,
            provider: provider as any,
            signer: signer as any,
            chainId: Number(network.chainId),
          })
          console.log('Injected wallet connected:', { address, wallet: selectedWallet.name, chainId: Number(network.chainId) })
          return
        }
      }

      throw new Error('No wallet found. Please install a Web3 wallet like MetaMask, OKX, or connect via WalletConnect.')
    } catch (error) {
      console.error('Connection failed:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet'
      alert(`Wallet Connection Error: ${errorMessage}\n\nPlease ensure:\n1. You have a Web3 wallet installed (MetaMask, OKX, etc.)\n2. Your wallet is unlocked\n3. You approve the connection request`)
      throw error
    }
  }

  const disconnect = async () => {
    try {
      if (state.provider && typeof state.provider.disconnect === 'function') {
        await state.provider.disconnect()
      }
    } catch (error) {
      console.error('Disconnect error:', error)
    }
    
    localStorage.removeItem('wallet_address')
    setState({
      isConnected: false,
      address: null,
      ensName: null,
      avatar: null,
      provider: null,
      signer: null,
      chainId: null,
    })
  }

  return {
    ...state,
    connect,
    disconnect,
  }
}

// Detect installed injected wallets
function detectInjectedWallets(): Array<{ name: string; provider: any; icon?: string }> {
  const wallets: Array<{ name: string; provider: any; icon?: string }> = []
  
  if (typeof window === 'undefined') return wallets
  
  const win = window as any
  
  // Check for various wallet providers
  if (win.ethereum) {
    // MetaMask
    if (win.ethereum.isMetaMask) {
      wallets.push({ name: 'MetaMask', provider: win.ethereum, icon: '🦊' })
    }
    // OKX Wallet
    if (win.ethereum.isOKExWallet) {
      wallets.push({ name: 'OKX Wallet', provider: win.ethereum, icon: '🔷' })
    }
    // Coinbase Wallet
    if (win.ethereum.isCoinbaseWallet) {
      wallets.push({ name: 'Coinbase Wallet', provider: win.ethereum, icon: '🔵' })
    }
    // Trust Wallet
    if (win.ethereum.isTrust) {
      wallets.push({ name: 'Trust Wallet', provider: win.ethereum, icon: '🔒' })
    }
    // Generic injected wallet (if none of the above)
    if (!win.ethereum.isMetaMask && !win.ethereum.isOKExWallet && !win.ethereum.isCoinbaseWallet && !win.ethereum.isTrust) {
      wallets.push({ name: 'Injected Wallet', provider: win.ethereum, icon: '💼' })
    }
  }
  
  // Check for OKX specific provider
  if (win.okxwallet) {
    wallets.push({ name: 'OKX Wallet', provider: win.okxwallet, icon: '🔷' })
  }
  
  return wallets
}

// Show custom wallet selection modal
function showWalletSelection(wallets: Array<{ name: string; provider: any; icon?: string }>): Promise<any> {
  return new Promise((resolve, reject) => {
    // Create modal overlay
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    
    // Create modal content
    const modal = document.createElement('div')
    modal.style.cssText = `
      background: linear-gradient(135deg, rgba(212, 165, 232, 0.95) 0%, rgba(194, 141, 217, 0.95) 100%);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 32px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.25);
    `
    
    const title = document.createElement('h2')
    title.textContent = 'Select Wallet'
    title.style.cssText = `
      color: white;
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 24px 0;
      text-align: center;
    `
    
    const walletList = document.createElement('div')
    walletList.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 12px;
    `
    
    wallets.forEach((wallet) => {
      const button = document.createElement('button')
      button.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 16px;
        padding: 16px 20px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        text-align: left;
      `
      
      button.innerHTML = `
        <span style="font-size: 24px;">${wallet.icon || '💼'}</span>
        <span>${wallet.name}</span>
      `
      
      button.onmouseenter = () => {
        button.style.background = 'rgba(255, 255, 255, 0.3)'
        button.style.transform = 'translateY(-2px)'
      }
      
      button.onmouseleave = () => {
        button.style.background = 'rgba(255, 255, 255, 0.2)'
        button.style.transform = 'translateY(0)'
      }
      
      button.onclick = () => {
        overlay.remove()
        resolve(wallet)
      }
      
      walletList.appendChild(button)
    })
    
    const closeButton = document.createElement('button')
    closeButton.textContent = 'Cancel'
    closeButton.style.cssText = `
      margin-top: 16px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 12px 24px;
      color: white;
      font-size: 14px;
      cursor: pointer;
      width: 100%;
      transition: all 0.3s;
    `
    
    closeButton.onclick = () => {
      overlay.remove()
      reject(new Error('User cancelled wallet selection'))
    }
    
    modal.appendChild(title)
    modal.appendChild(walletList)
    modal.appendChild(closeButton)
    overlay.appendChild(modal)
    
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove()
        reject(new Error('User cancelled wallet selection'))
      }
    }
    
    document.body.appendChild(overlay)
  })
}

async function resolveENS(address: string): Promise<string | null> {
  try {
    const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com')
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
