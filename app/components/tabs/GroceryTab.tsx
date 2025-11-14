'use client'

import { useState, useRef } from 'react'
import { Upload, ShoppingCart, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { WaterGlassIcon } from '../WaterGlassIcon'

interface GroceryTabProps {
  address: string | null
}

interface GroceryItem {
  name: string
  quantity: string
  category: string
}

interface GroceryList {
  items: GroceryItem[]
  cid: string
  timestamp: string
}

export function GroceryTab({ address }: GroceryTabProps) {
  const [list, setList] = useState<GroceryList | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !address) return

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

  const markItemComplete = (index: number) => {
    if (!list) return
    const updatedItems = [...list.items]
    updatedItems[index] = { ...updatedItems[index] }
    setList({ ...list, items: updatedItems })
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold font-display text-white premium-heading relative z-10" data-text="Grocery List" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
          Grocery List
        </h3>
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
            boxShadow: '0 4px 20px rgba(255, 159, 243, 0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin relative z-10" />
              <span className="relative z-10">Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Upload Fridge Photo</span>
            </>
          )}
        </motion.button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <motion.div
            className="inline-block rounded-full h-8 w-8 border-2 border-white/30 border-t-white mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-white/70">Loading grocery list...</p>
        </div>
      ) : !list ? (
        <motion.div
          className="text-center py-16 glass rounded-2xl border-2 border-dashed border-white/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-6"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ShoppingCart className="w-20 h-20 mx-auto" style={{ color: 'rgba(255, 255, 255, 0.5)', filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.4))' }} />
          </motion.div>
          <p className="text-white mb-2 text-lg font-medium">No grocery list yet</p>
          <p className="text-sm mb-6" style={{ color: '#f3e8ff' }}>
            Upload a photo of your fridge to generate a shopping list
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
            Get Started
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass rounded-xl border border-white/20 p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/70 mb-1">IPFS CID</p>
                <p className="text-white font-mono text-sm">{list.cid}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-white/70 mb-1">Created</p>
                <p className="text-white text-sm">
                  {new Date(list.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.items.map((item, index) => (
              <motion.div
                key={index}
                className="group p-5 glass rounded-xl border border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                style={{
                  boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-2 text-lg">
                      {item.name}
                    </h4>
                    <p className="text-sm text-white/80 mb-3">
                      Quantity: {item.quantity}
                    </p>
                    <span className="inline-block px-3 py-1 text-xs rounded-lg border border-white/20" style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}>
                      {item.category}
                    </span>
                  </div>
                  <motion.button
                    onClick={() => markItemComplete(index)}
                    className="p-2 rounded-lg transition-all duration-200"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckCircle className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {list.items.length === 0 && (
            <div className="text-center py-12 glass rounded-2xl border border-white/20">
              <p className="text-white/70">No items in the list</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
