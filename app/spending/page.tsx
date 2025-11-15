'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import axios from 'axios'
import { WaterGlassIcon } from '../components/WaterGlassIcon'
import { useWallet } from '../hooks/useWallet'
import { Navbar } from '../components/Navbar'
import { BottomTabs } from '../components/BottomTabs'
import { Bell, DollarSign as DollarSignIcon, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS = ['#ff9ff3', '#c56cf0', '#a875c7', '#d4a5e8', '#c28dd9']

export default function SpendingPage() {
  const { isConnected, address } = useWallet()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  // Demo data
  const demoData = {
    total: 847.32,
    categories: {
      food: 245.50,
      coffee: 89.20,
      transport: 156.80,
      shopping: 356.82,
    },
    chartData: [
      { date: 'Mon', amount: 120 },
      { date: 'Tue', amount: 95 },
      { date: 'Wed', amount: 145 },
      { date: 'Thu', amount: 180 },
      { date: 'Fri', amount: 210 },
      { date: 'Sat', amount: 67 },
      { date: 'Sun', amount: 30 },
    ],
    pieData: [
      { name: 'Food', value: 245.50 },
      { name: 'Coffee', value: 89.20 },
      { name: 'Transport', value: 156.80 },
      { name: 'Shopping', value: 356.82 },
    ],
    nudge: 'You spent 22% more on food this week. Consider meal planning!',
  }

  useEffect(() => {
    if (isConnected && address) {
      loadSpending()
    } else {
      setData(demoData)
    }
  }, [isConnected, address, timeRange])

  const loadSpending = async () => {
    if (!address) return
    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/spending`,
        { address, timeRange }
      )
      setData(response.data)
    } catch (error) {
      console.error('Failed to load spending:', error)
      setData(demoData)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'spending', label: 'Spending', icon: DollarSignIcon },
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
              Spending Analysis
            </h1>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="px-4 py-2 glass rounded-xl text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block rounded-full h-8 w-8 border-2 border-white/30 border-t-white animate-spin mb-4" />
              <p className="text-white/70">Analyzing spending...</p>
            </div>
          ) : data ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <WaterGlassIcon icon={DollarSign} size={24} />
                    <span className="text-white/70 text-sm">Total Spent</span>
                  </div>
                  <p className="text-3xl font-bold text-white">${data.total?.toFixed(2) || '0.00'}</p>
                </motion.div>
                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-white" />
                    <span className="text-white/70 text-sm">Top Category</span>
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {Object.entries(data.categories || {}).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A'}
                  </p>
                </motion.div>
                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown className="w-6 h-6 text-white" />
                    <span className="text-white/70 text-sm">Categories</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{Object.keys(data.categories || {}).length}</p>
                </motion.div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Weekly Spending</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.chartData || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="date" stroke="#f3e8ff" />
                      <YAxis stroke="#f3e8ff" />
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#ff9ff3"
                        strokeWidth={2}
                        dot={{ fill: '#c56cf0', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-xl font-bold text-white mb-4">Category Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.pieData || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {(data.pieData || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Weekly Insights */}
              {data.nudge && (
                <motion.div
                  className="p-6 glass-strong rounded-2xl border border-white/25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-xl font-bold text-white mb-2">Weekly Insights</h3>
                  <p className="text-white/90">{data.nudge}</p>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl border border-white/20">
              <DollarSign className="w-12 h-12 text-white/50 mx-auto mb-4" />
              <p className="text-white/70">No spending data available</p>
            </div>
          )}
        </motion.div>
      </div>
      <BottomTabs
        tabs={tabs}
        activeTab="spending"
        onTabChange={(tab) => {
          if (tab === 'reminders') router.push('/reminders')
          if (tab === 'grocery') router.push('/grocery')
        }}
      />
    </div>
  )
}

