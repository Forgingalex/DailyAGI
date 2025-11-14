'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Calendar, Clock, Trash2, X } from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'
import { WaterGlassIcon } from '../components/WaterGlassIcon'
import { useWallet } from '../hooks/useWallet'
import { Navbar } from '../components/Navbar'
import { BottomTabs } from '../components/BottomTabs'
import { Bell, ShoppingCart, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Reminder {
  id: string
  title: string
  description: string
  datetime: string
  completed: boolean
  cid?: string
}

export default function RemindersPage() {
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
  })

  // Demo data
  const demoReminders: Reminder[] = [
    {
      id: '1',
      title: 'Call Mom',
      description: 'Weekly check-in call',
      datetime: new Date(Date.now() + 86400000).toISOString(),
      completed: false,
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Q4 planning session',
      datetime: new Date(Date.now() + 172800000).toISOString(),
      completed: false,
    },
  ]

  useEffect(() => {
    if (isConnected && address) {
      loadReminders()
    } else {
      setReminders(demoReminders)
    }
  }, [isConnected, address])

  const loadReminders = async () => {
    if (!address) return
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/reminders`,
        { params: { address } }
      )
      setReminders(response.data.reminders || [])
    } catch (error) {
      console.error('Failed to load reminders:', error)
      setReminders(demoReminders)
    } finally {
      setLoading(false)
    }
  }

  const createReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isConnected || !address) {
      alert('Please connect your wallet')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/reminders`,
        {
          address,
          ...formData,
        }
      )
      setReminders([...reminders, response.data.reminder])
      setFormData({ title: '', description: '', datetime: '' })
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create reminder:', error)
      alert('Failed to create reminder')
    } finally {
      setLoading(false)
    }
  }

  const deleteReminder = async (id: string) => {
    if (!isConnected || !address) return
    
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/reminders/${id}`,
        { params: { address } }
      )
      setReminders(reminders.filter((r) => r.id !== id))
    } catch (error) {
      console.error('Failed to delete reminder:', error)
    }
  }

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
              Your Reminders
            </h1>
            <motion.button
              onClick={() => setShowForm(!showForm)}
              className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium transition-all duration-300 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
                boxShadow: '0 4px 20px rgba(255, 159, 243, 0.4)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>Add Reminder</span>
            </motion.button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                onSubmit={createReminder}
                className="mb-6 p-6 glass rounded-2xl border border-white/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    rows={3}
                  />
                  <input
                    type="datetime-local"
                    value={formData.datetime}
                    onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
                    className="w-full px-4 py-3 glass rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                    required
                  />
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #ff9ff3 0%, #c56cf0 100%)',
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? 'Creating...' : 'Create'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2.5 glass rounded-xl text-white font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {loading && !showForm ? (
            <div className="text-center py-12">
              <div className="inline-block rounded-full h-8 w-8 border-2 border-white/30 border-t-white animate-spin mb-4" />
              <p className="text-white/70">Loading reminders...</p>
            </div>
          ) : reminders.length === 0 ? (
            <motion.div
              className="text-center py-12 glass rounded-2xl border border-white/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Calendar className="w-12 h-12 mx-auto mb-4 text-white/50" />
              <p className="text-white/70">No reminders yet. Create one to get started!</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <motion.div
                  key={reminder.id}
                  className="group p-5 glass rounded-xl border border-white/20 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <WaterGlassIcon icon={Calendar} size={20} />
                        <h4 className="font-semibold text-white text-lg">{reminder.title}</h4>
                      </div>
                      {reminder.description && (
                        <p className="text-sm mb-3 ml-12" style={{ color: '#f3e8ff' }}>
                          {reminder.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm ml-12" style={{ color: '#f3e8ff' }}>
                        <Clock className="w-4 h-4" />
                        <span>{format(new Date(reminder.datetime), 'PPp')}</span>
                      </div>
                      {reminder.cid && (
                        <div className="mt-2 text-xs text-white/50 ml-12 font-mono">
                          IPFS: {reminder.cid.slice(0, 20)}...
                        </div>
                      )}
                    </div>
                    {isConnected && (
                      <motion.button
                        onClick={() => deleteReminder(reminder.id)}
                        className="p-2 rounded-lg transition-all"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileHover={{ scale: 1.1, rotate: 12 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 className="w-5 h-5 text-white" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
      <BottomTabs
        tabs={tabs}
        activeTab="reminders"
        onTabChange={(tab) => {
          if (tab === 'spending') router.push('/spending')
          if (tab === 'grocery') router.push('/grocery')
        }}
      />
    </div>
  )
}

