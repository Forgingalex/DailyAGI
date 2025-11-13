'use client'

import { useState, useRef } from 'react'
import { Upload, ShoppingCart, CheckCircle, Loader } from 'lucide-react'
import axios from 'axios'

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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
          Grocery List
        </h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/20 to-rose-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
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
        </button>
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-pink-300/60">Loading grocery list...</p>
        </div>
      ) : !list ? (
        <div className="text-center py-16 bg-pink-900/10 rounded-2xl border-2 border-dashed border-pink-800/50 hover:border-pink-700/70 transition-all duration-300">
          <div className="mb-6 animate-float">
            <ShoppingCart className="w-20 h-20 text-pink-400/50 mx-auto" />
          </div>
          <p className="text-pink-200/80 mb-2 text-lg font-medium">No grocery list yet</p>
          <p className="text-sm text-pink-300/60 mb-6">
            Upload a photo of your fridge to generate a shopping list
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/30"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in-up">
          <div className="bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 p-5 shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-pink-300/60 mb-1">IPFS CID</p>
                <p className="text-pink-100 font-mono text-sm">{list.cid}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-pink-300/60 mb-1">Created</p>
                <p className="text-pink-100 text-sm">
                  {new Date(list.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.items.map((item, index) => (
              <div
                key={index}
                className="group p-5 bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 animate-fade-in-up hover-lift relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex justify-between items-start mb-2 relative z-10">
                  <div className="flex-1">
                    <h4 className="font-semibold text-pink-100 mb-2 text-lg">
                      {item.name}
                    </h4>
                    <p className="text-sm text-pink-300/70 mb-3">
                      Quantity: {item.quantity}
                    </p>
                    <span className="inline-block px-3 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-lg border border-pink-800/50">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => markItemComplete(index)}
                    className="p-2 hover:bg-pink-800/40 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-12"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {list.items.length === 0 && (
            <div className="text-center py-12 bg-pink-900/10 rounded-2xl border border-pink-800/30">
              <p className="text-pink-300/60">No items in the list</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

