'use client'

import { useState } from 'react'
import { RemindersTab } from './tabs/RemindersTab'
import { SpendingTab } from './tabs/SpendingTab'
import { GroceryTab } from './tabs/GroceryTab'
import { Bell, DollarSign, ShoppingCart } from 'lucide-react'

interface DashboardProps {
  address: string | null
  ensName: string | null
  avatar: string | null
}

type Tab = 'reminders' | 'spending' | 'grocery'

export function Dashboard({ address, ensName, avatar }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('reminders')

  const tabs = [
    { id: 'reminders' as Tab, label: 'Reminders', icon: Bell },
    { id: 'spending' as Tab, label: 'Spending', icon: DollarSign },
    { id: 'grocery' as Tab, label: 'Grocery', icon: ShoppingCart },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Welcome back{ensName ? `, ${ensName}` : ''}!
        </h2>
        <p className="text-gray-400">
          Manage your reminders, track spending, and organize groceries
        </p>
      </div>

      <div className="bg-sentient-800/50 backdrop-blur-sm rounded-xl border border-sentient-700 overflow-hidden">
        <div className="flex border-b border-sentient-700">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-sentient-700 text-white border-b-2 border-sentient-500'
                    : 'text-sentient-400 hover:text-white hover:bg-sentient-700/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'reminders' && <RemindersTab address={address} />}
          {activeTab === 'spending' && <SpendingTab address={address} />}
          {activeTab === 'grocery' && <GroceryTab address={address} />}
        </div>
      </div>
    </div>
  )
}

