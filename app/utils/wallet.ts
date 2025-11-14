/**
 * Wallet utility functions
 */

export function formatAddress(address: string | null, chars: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export function getChainName(chainId: number): string {
  const chains: Record<number, string> = {
    1: 'Ethereum',
    5: 'Goerli',
    137: 'Polygon',
    8453: 'Base',
  }
  return chains[chainId] || `Chain ${chainId}`
}



