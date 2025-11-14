/**
 * SSE (Server-Sent Events) streaming utility for Sentient Agent API
 */

export interface SSEEvent {
  object: string
  type: 'start' | 'progress' | 'message' | 'end' | 'error'
  data: {
    role: string
    content: string
  }
}

export interface SSEOptions {
  onStart?: (content: string) => void
  onProgress?: (content: string) => void
  onMessage?: (content: string) => void
  onEnd?: () => void
  onError?: (error: Error) => void
}

export async function streamSSE(
  url: string,
  data: { message: string; wallet: string },
  options: SSEOptions = {}
): Promise<void> {
  const { onStart, onProgress, onMessage, onEnd, onError } = options

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        onEnd?.()
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const eventData: SSEEvent = JSON.parse(line.slice(6))
            
            switch (eventData.type) {
              case 'start':
                onStart?.(eventData.data.content)
                break
              case 'progress':
                onProgress?.(eventData.data.content)
                break
              case 'message':
                onMessage?.(eventData.data.content)
                break
              case 'end':
                onEnd?.()
                return
              case 'error':
                onError?.(new Error(eventData.data.content))
                break
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e, line)
          }
        }
      }
    }
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)))
  }
}



