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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Grocery List</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Fridge Photo
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
        <div className="text-center py-8 text-gray-400">
          Loading grocery list...
        </div>
      ) : !list ? (
        <div className="text-center py-12 bg-sentient-700/50 rounded-lg border border-sentient-600 border-dashed">
          <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No grocery list yet</p>
          <p className="text-sm text-gray-500 mb-4">
            Upload a photo of your fridge to generate a shopping list
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-sentient-700/50 rounded-lg border border-sentient-600 p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-400">IPFS CID</p>
                <p className="text-white font-mono text-sm">{list.cid}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Created</p>
                <p className="text-white text-sm">
                  {new Date(list.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.items.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-sentient-700/50 rounded-lg border border-sentient-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">
                      {item.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-1">
                      Quantity: {item.quantity}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs bg-sentient-600/20 text-sentient-400 rounded">
                      {item.category}
                    </span>
                  </div>
                  <button
                    onClick={() => markItemComplete(index)}
                    className="p-2 hover:bg-sentient-600 rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {list.items.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No items in the list
            </div>
          )}
        </div>
      )}
    </div>
  )
}

