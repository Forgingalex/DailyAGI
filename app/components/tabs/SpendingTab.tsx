'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import axios from 'axios'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface SpendingTabProps {
  address: string | null
}

interface Transaction {
  hash: string
  value: string
  category: string
  timestamp: string
  from: string
  to: string
}

interface SpendingData {
  transactions: Transaction[]
  totalSpent: number
  categories: Record<string, number>
  chartData: Array<{ date: string; amount: number }>
}

export function SpendingTab({ address }: SpendingTabProps) {
  const [data, setData] = useState<SpendingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    if (address) {
      loadSpending()
    }
  }, [address, timeRange])

  const loadSpending = async () => {
    if (!address) return

    try {
      setLoading(true)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/agent/spending`,
        {
          address,
          timeRange,
        }
      )
      setData(response.data)
    } catch (error) {
      console.error('Failed to load spending:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-400">Analyzing spending...</div>
    )
  }

  if (!data || data.transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 mb-4">No spending data found</p>
        <button
          onClick={loadSpending}
          className="px-4 py-2 bg-sentient-600 hover:bg-sentient-700 rounded-lg text-white font-medium transition-colors"
        >
          Refresh
        </button>
      </div>
    )
  }

  const categoryData = Object.entries(data.categories).map(([name, value]) => ({
    name,
    value: Number(value),
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Spending Analysis</h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sentient-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-sentient-700/50 rounded-lg border border-sentient-600">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span className="text-gray-400 text-sm">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-white">
            ${data.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="p-6 bg-sentient-700/50 rounded-lg border border-sentient-600">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-sentient-400" />
            <span className="text-gray-400 text-sm">Transactions</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {data.transactions.length}
          </p>
        </div>
        <div className="p-6 bg-sentient-700/50 rounded-lg border border-sentient-600">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="w-6 h-6 text-purple-400" />
            <span className="text-gray-400 text-sm">Categories</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {categoryData.length}
          </p>
        </div>
      </div>

      <div className="bg-sentient-700/50 rounded-lg border border-sentient-600 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Spending Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              name="Amount ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-sentient-700/50 rounded-lg border border-sentient-600 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Spending by Category
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#8B5CF6" name="Amount ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-sentient-700/50 rounded-lg border border-sentient-600 p-6">
        <h4 className="text-lg font-semibold text-white mb-4">
          Recent Transactions
        </h4>
        <div className="space-y-2">
          {data.transactions.slice(0, 10).map((tx) => (
            <div
              key={tx.hash}
              className="p-3 bg-sentient-800/50 rounded-lg border border-sentient-600 flex justify-between items-center"
            >
              <div>
                <p className="text-white font-medium">{tx.category}</p>
                <p className="text-sm text-gray-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">
                  ${Number(tx.value).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  {tx.hash.slice(0, 10)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

