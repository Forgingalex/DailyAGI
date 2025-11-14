'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Sparkles } from 'lucide-react'
import { streamSSE } from '../utils/sse'
import { useWallet } from '../hooks/useWallet'

interface ChatModalProps {
  isOpen: boolean
  onClose: () => void
  demoMode?: boolean
}

export function ChatModal({ isOpen, onClose, demoMode = false }: ChatModalProps) {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentStream, setCurrentStream] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { address, isConnected } = useWallet()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentStream])

  const handleSend = async () => {
    if (!message.trim() || isStreaming) return

    // Allow if address exists OR demo mode
    const walletAddress = address || (demoMode ? '0x1234567890123456789012345678901234567890' : null)
    if (!walletAddress) {
      alert('Please connect your wallet first')
      return
    }

    const userMessage = message.trim()
    setMessage('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsStreaming(true)
    setCurrentStream('')

    try {
      await streamSSE(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'}/sentient/agent`,
        {
          message: userMessage,
          wallet: walletAddress,
        },
        {
          onStart: (content) => {
            setCurrentStream(content)
          },
          onProgress: (content) => {
            setCurrentStream(content)
          },
          onMessage: (content) => {
            setCurrentStream('')
            setMessages(prev => [...prev, { role: 'assistant', content }])
            setIsStreaming(false)
          },
          onEnd: () => {
            if (currentStream) {
              setMessages(prev => [...prev, { role: 'assistant', content: currentStream }])
              setCurrentStream('')
            }
            setIsStreaming(false)
          },
          onError: (error) => {
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }])
            setIsStreaming(false)
            setCurrentStream('')
          },
        }
      )
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Error: ${error instanceof Error ? error.message : 'Failed to connect to agent'}` 
      }])
      setIsStreaming(false)
      setCurrentStream('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed bottom-20 right-4 w-full max-w-md h-[600px] glass-strong rounded-2xl border border-white/25 z-50 flex flex-col shadow-2xl"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="text-lg font-bold text-white">Ask dailyAGI</h3>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-white/60 py-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with dailyAGI</p>
                </div>
              )}
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'glass text-white'
                        : 'glass-strong text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {isStreaming && currentStream && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="max-w-[80%] rounded-2xl px-4 py-2 glass-strong text-white">
                    <p className="text-sm">{currentStream}</p>
                    <motion.span
                      className="inline-block w-2 h-2 bg-white rounded-full ml-1"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask dailyAGI anything..."
                  className="flex-1 px-4 py-2 glass rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  disabled={isStreaming}
                />
                <motion.button
                  onClick={handleSend}
                  disabled={isStreaming || !message.trim()}
                  className="p-2 glass rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

