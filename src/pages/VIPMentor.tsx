import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, Send, User, Bot, Loader2 } from 'lucide-react'
import { streamAgentChat, displayableMessages, DisplayMessage } from '@/lib/skipAi'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

export default function VIPMentor() {
  const [searchParams] = useSearchParams()
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const { toast } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/tfc-consultant/chats`,
          {
            headers: { Authorization: pb.authStore.token },
          },
        )
        const data = await res.json()
        if (data && data.items && data.items.length > 0) {
          const latestConv = data.items[0]
          setConversationId(latestConv.id)

          const msgsRes = await fetch(
            `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/tfc-consultant/chats/${latestConv.id}/messages`,
            {
              headers: { Authorization: pb.authStore.token },
            },
          )
          const msgsData = await msgsRes.json()
          if (msgsData.messages) {
            setMessages(displayableMessages(msgsData.messages))
          }
        } else {
          const lead = searchParams.get('lead')
          if (lead) {
            handleSend(`Como abordar estrategicamente o lead Alta Renda/VIP: ${lead}?`)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const tempId = Math.random().toString()
    const newUserMsg: DisplayMessage = {
      id: tempId,
      role: 'user',
      content: text,
      created: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newUserMsg])
    setInput('')
    setIsStreaming(true)

    abortControllerRef.current = new AbortController()

    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-tfc-consultant-stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
          body: JSON.stringify({ message: text, conversation_id: conversationId }),
          signal: abortControllerRef.current.signal,
        },
      )

      const result = await streamAgentChat(res, {
        onChunk: (delta, full) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last.role === 'assistant' && last.id === 'streaming') {
              return [...prev.slice(0, -1), { ...last, content: full }]
            } else {
              return [
                ...prev,
                {
                  id: 'streaming',
                  role: 'assistant',
                  content: full,
                  created: new Date().toISOString(),
                },
              ]
            }
          })
        },
        signal: abortControllerRef.current.signal,
      })

      setConversationId(res.headers.get('X-Conversation-Id') ?? result.conversation_id)
      setMessages((prev) => {
        const last = prev[prev.length - 1]
        if (last.id === 'streaming') {
          return [
            ...prev.slice(0, -1),
            {
              id: result.message_id,
              role: 'assistant',
              content: result.content,
              created: new Date().toISOString(),
            },
          ]
        }
        return prev
      })
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast({ title: 'Erro', description: err.message, variant: 'destructive' })
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSend(input)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col pb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-amber-500" />
          Mentor IA (Consultor Inteligente TFC)
        </h1>
        <p className="text-muted-foreground mt-1">
          Assistente estratégico para abordagens, estruturação de propostas e fechamento VIP.
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-amber-500/20 shadow-lg">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6 pb-4">
            {messages.length === 0 && !isStreaming && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground mt-20 space-y-4">
                <Bot className="h-12 w-12 text-amber-500/50" />
                <p>
                  Olá! Sou o Consultor Inteligente da TFC.
                  <br />
                  Como posso ajudar a estruturar sua próxima grande venda?
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={msg.id || i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Bot className="h-5 w-5 text-amber-600" />
                  </div>
                )}
                <div
                  className={`px-4 py-2.5 rounded-lg max-w-[85%] text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border shadow-sm'}`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="p-4 bg-background border-t">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida ou contexto do lead..."
              disabled={isStreaming}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isStreaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}
