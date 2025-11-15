'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, ShoppingCart, CheckCircle, Loader, ExternalLink, Bell, DollarSign } from 'lucide-react'
import axios from 'axios'
import { WaterGlassIcon } from '../components/WaterGlassIcon'
import { useWallet } from '../hooks/useWallet'
import { Navbar } from '../components/Navbar'
import { BottomTabs } from '../components/BottomTabs'
import { useRouter } from 'next/navigation'

interface GroceryItem {
  name: string
  quantity: string
  category: string
}

interface GroceryList {
  items: GroceryItem[]
  missing_items: string[]
  list_cid?: string
  timestamp?: string
}

export default function GroceryPage() {
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const [list, setList] = useState<GroceryList | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Demo data
  const demoList: GroceryList = {
    items: [
      { name: 'Milk', quantity: '1 gallon', category: 'Dairy' },
      { name: 'Eggs', quantity: '1 dozen', category: 'Dairy' },
      { name: 'Lettuce', quantity: '1 head', category: 'Produce' },
    ],
    missing_items: ['Milk', 'Eggs', 'Lettuce'],
    list_cid: 'bafybeidemo123456789',
  }

  const handleFileUpload = async (file: File) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet to upload images')
      return
    }

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', file)
      formData.append('address', address)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/grocery`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setList(response.data)
    } catch (error) {
      console.error('Failed to process image:', error)
      alert('Failed to process image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [isConnected, address])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (!isConnected) {
      setList(demoList)
    } else {
      setList(null)
    }
  }, [isConnected])

  const tabs = [
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'spending', label: 'Spending', icon: DollarSign },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4a5e8] via-[#c28dd9] to-[#a875c7]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold font-display text-white premium-heading">
              Grocery List
            </h1>
          </div>

          {/* Upload Area */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative p-12 glass-strong rounded-2xl border-2 border-dashed transition-all duration-300 ${
                isDragging
                  ? 'border-white/50 bg-white/10'
                  : 'border-white/25'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="hidden"
              />
              
              <div className="text-center">
                {uploading ? (
                  <>
                    <Loader className="w-12 h-12 mx-auto mb-4 text-white animate-spin" />
                    <p className="text-white">Processing image...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto mb-4 text-white/70" />
                    <p className="text-white mb-2">
                      Drag & drop your fridge photo here, or
                    </p>
                    <motion.button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
                        boxShadow: '0 4px 20px rgba(255, 159, 243, 0.4)',
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Scan Fridge
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Grocery List */}
          {list ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {list.missing_items && list.missing_items.length > 0 ? (
                <>
                  <div className="p-6 glass-strong rounded-2xl border border-white/25">
                    <div className="flex items-center gap-3 mb-4">
                      <WaterGlassIcon icon={ShoppingCart} size={24} />
                      <h3 className="text-2xl font-bold text-white">Missing Items</h3>
                    </div>
                    <ul className="space-y-2">
                      {list.missing_items.map((item, index) => (
                        <motion.li
                          key={index}
                          className="flex items-center gap-3 p-3 glass rounded-xl border border-white/20"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CheckCircle className="w-5 h-5 text-white/60" />
                          <span className="text-white flex-1">{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {list.list_cid && (
                    <motion.div
                      className="p-4 glass rounded-xl border border-white/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium mb-1">IPFS Shopping List</p>
                          <p className="text-xs text-white/60 font-mono">{list.list_cid}</p>
                        </div>
                        <motion.a
                          href={`https://ipfs.io/ipfs/${list.list_cid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-white text-sm transition-all"
                          whileHover={{ scale: 1.05 }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View IPFS List
                        </motion.a>
                      </div>
                    </motion.div>
                  )}
                </>
              ) : (
                <motion.div
                  className="text-center py-12 glass rounded-2xl border border-white/20"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-white/50" />
                  <p className="text-white/70">Your fridge looks well-stocked! No missing items detected.</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12 glass rounded-2xl border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">Upload a photo of your fridge to generate a shopping list</p>
            </motion.div>
          )}
        </motion.div>
      </div>
      <BottomTabs
        tabs={tabs}
        activeTab="grocery"
        onTabChange={(tab) => {
          if (tab === 'reminders') router.push('/reminders')
          if (tab === 'spending') router.push('/spending')
        }}
      />
    </div>
  )
}

