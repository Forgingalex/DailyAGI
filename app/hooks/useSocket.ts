'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const newSocket = io(apiUrl, {
      transports: ['websocket', 'polling'],
    })

    newSocket.on('connect', () => {
      setConnected(true)
      console.log('Socket connected')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
      console.log('Socket disconnected')
    })

    newSocket.on('reminder_created', (data) => {
      console.log('Reminder created:', data)
      // You can add toast notification here
    })

    newSocket.on('spending_nudge', (data) => {
      console.log('Spending nudge:', data)
      // You can add toast notification here
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  return { socket, connected }
}


