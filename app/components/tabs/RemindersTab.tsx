'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import axios from 'axios'

interface Reminder {
  id: string
  title: string
  description: string
  datetime: string
  completed: boolean
  cid?: string
}

interface RemindersTabProps {
  address: string | null
}

export function RemindersTab({ address }: RemindersTabProps) {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    datetime: '',
  })

  useEffect(() => {
    if (address) {
      loadReminders()
    }
  }, [address])

  const loadReminders = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/reminders`,
        { params: { address } }
      )
      setReminders(response.data.reminders || [])
    } catch (error) {
      console.error('Failed to load reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  const createReminder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) return

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

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
          Your Reminders
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="group relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-pink-500/30 hover:scale-105 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-white/20 to-rose-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
          <span className="relative z-10">Add Reminder</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createReminder}
          className="mb-6 p-6 bg-pink-900/20 backdrop-blur-xl rounded-2xl border border-pink-800/50 shadow-lg animate-fade-in-up"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 bg-pink-950/40 border border-pink-800/50 rounded-xl text-pink-100 placeholder-pink-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all backdrop-blur-sm"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 bg-pink-950/40 border border-pink-800/50 rounded-xl text-pink-100 placeholder-pink-400/50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all backdrop-blur-sm resize-none"
              rows={3}
            />
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
              className="w-full px-4 py-3 bg-pink-950/40 border border-pink-800/50 rounded-xl text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all backdrop-blur-sm"
              required
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/30"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2.5 bg-pink-900/40 hover:bg-pink-800/60 rounded-xl text-pink-200 font-medium transition-all duration-300 border border-pink-800/50 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-pink-300/60">Loading reminders...</p>
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-12 bg-pink-900/10 rounded-2xl border border-pink-800/30">
          <Calendar className="w-12 h-12 text-pink-400/50 mx-auto mb-4" />
          <p className="text-pink-300/60">
            No reminders yet. Create one to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder, index) => (
            <div
              key={reminder.id}
              className="group p-5 bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] animate-fade-in-up hover-lift relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="flex justify-between items-start relative z-10">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-pink-500/20 rounded-lg">
                      <Calendar className="w-5 h-5 text-pink-400" />
                    </div>
                    <h4 className="font-semibold text-pink-100 text-lg">{reminder.title}</h4>
                  </div>
                  {reminder.description && (
                    <p className="text-pink-200/70 text-sm mb-3 ml-12">
                      {reminder.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-pink-300/60 ml-12">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(reminder.datetime), 'PPp')}
                    </span>
                  </div>
                  {reminder.cid && (
                    <div className="mt-2 text-xs text-pink-400/50 ml-12 font-mono">
                      IPFS: {reminder.cid.slice(0, 20)}...
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 hover:bg-pink-800/40 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-12"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

