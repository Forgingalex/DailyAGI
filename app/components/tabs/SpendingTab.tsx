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
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-4"></div>
        <p className="text-pink-300/60">Analyzing spending...</p>
      </div>
    )
  }

  if (!data || data.transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-pink-900/10 rounded-2xl border border-pink-800/30">
        <DollarSign className="w-12 h-12 text-pink-400/50 mx-auto mb-4" />
        <p className="text-pink-300/60 mb-4">No spending data found</p>
        <button
          onClick={loadSpending}
          className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-pink-500/30"
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
          Spending Analysis
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
          className="px-4 py-2.5 bg-pink-950/40 border border-pink-800/50 rounded-xl text-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all backdrop-blur-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="group p-6 bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 animate-fade-in-up hover-lift relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-green-400 group-hover:animate-pulse" />
            </div>
            <span className="text-pink-300/60 text-sm">Total Spent</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent relative z-10 group-hover:scale-110 transition-transform">
            ${data.totalSpent.toFixed(2)}
          </p>
        </div>
        <div className="group p-6 bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 animate-fade-in-up hover-lift relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-pink-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-pink-400 group-hover:animate-pulse" />
            </div>
            <span className="text-pink-300/60 text-sm">Transactions</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent relative z-10 group-hover:scale-110 transition-transform">
            {data.transactions.length}
          </p>
        </div>
        <div className="group p-6 bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-105 animate-fade-in-up hover-lift relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-rose-500/5 to-fuchsia-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-fuchsia-500/20 rounded-lg group-hover:scale-110 transition-transform">
              <TrendingDown className="w-6 h-6 text-fuchsia-400 group-hover:animate-pulse" />
            </div>
            <span className="text-pink-300/60 text-sm">Categories</span>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent relative z-10 group-hover:scale-110 transition-transform">
            {categoryData.length}
          </p>
        </div>
      </div>

      <div className="bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 p-6 shadow-lg animate-fade-in-up">
        <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-4">
          Spending Over Time
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#831843" opacity={0.3} />
            <XAxis dataKey="date" stroke="#f9a8d4" />
            <YAxis stroke="#f9a8d4" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#500724',
                border: '1px solid #831843',
                borderRadius: '12px',
                color: '#f9a8d4',
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ec4899"
              strokeWidth={3}
              name="Amount ($)"
              dot={{ fill: '#ec4899', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 p-6 shadow-lg animate-fade-in-up">
        <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-4">
          Spending by Category
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#831843" opacity={0.3} />
            <XAxis dataKey="name" stroke="#f9a8d4" />
            <YAxis stroke="#f9a8d4" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#500724',
                border: '1px solid #831843',
                borderRadius: '12px',
                color: '#f9a8d4',
              }}
            />
            <Legend />
            <Bar dataKey="value" fill="#ec4899" name="Amount ($)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-pink-900/20 backdrop-blur-xl rounded-xl border border-pink-800/50 p-6 shadow-lg animate-fade-in-up">
        <h4 className="text-lg font-semibold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent mb-4">
          Recent Transactions
        </h4>
        <div className="space-y-3">
          {data.transactions.slice(0, 10).map((tx, index) => (
            <div
              key={tx.hash}
              className="p-4 bg-pink-950/40 backdrop-blur-sm rounded-xl border border-pink-800/50 flex justify-between items-center hover:border-pink-700/70 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div>
                <p className="text-pink-100 font-medium">{tx.category}</p>
                <p className="text-sm text-pink-300/60">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-pink-100 font-semibold text-lg">
                  ${Number(tx.value).toFixed(2)}
                </p>
                <p className="text-xs text-pink-400/50 font-mono">
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

