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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Your Reminders</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={createReminder}
          className="mb-6 p-4 bg-sentient-700/50 rounded-lg border border-sentient-600"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-sentient-800 border border-sentient-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sentient-500"
              required
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-sentient-800 border border-sentient-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sentient-500"
              rows={3}
            />
            <input
              type="datetime-local"
              value={formData.datetime}
              onChange={(e) =>
                setFormData({ ...formData, datetime: e.target.value })
              }
              className="w-full px-4 py-2 bg-sentient-800 border border-sentient-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sentient-500"
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {loading && !showForm ? (
        <div className="text-center py-8 text-gray-400">Loading reminders...</div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No reminders yet. Create one to get started!
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className="p-4 bg-sentient-700/50 rounded-lg border border-sentient-600 hover:border-gray-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-sentient-400" />
                    <h4 className="font-semibold text-white">{reminder.title}</h4>
                  </div>
                  {reminder.description && (
                    <p className="text-gray-300 text-sm mb-2 ml-8">
                      {reminder.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-400 ml-8">
                    <Clock className="w-4 h-4" />
                    <span>
                      {format(new Date(reminder.datetime), 'PPp')}
                    </span>
                  </div>
                  {reminder.cid && (
                    <div className="mt-2 text-xs text-gray-500 ml-8">
                      IPFS: {reminder.cid.slice(0, 20)}...
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
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

