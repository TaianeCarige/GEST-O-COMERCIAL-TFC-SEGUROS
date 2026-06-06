import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { streamAgentChat } from '@/lib/skipAi'
import { BrainCircuit, MessageSquareWarning, Send } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function ObjectionSolver() {
  const [objection, setObjection] = useState('')
  const [loading, setLoading] = useState(false)
  const [solution, setSolution] = useState('')
  const { toast } = useToast()

  const handleSolve = async () => {
    if (!objection.trim()) return
    setLoading(true)
    setSolution('')

    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-advisor-stream`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
          body: JSON.stringify({ message: objection }),
        },
      )

      await streamAgentChat(res, {
        onChunk: (_delta, full) => setSolution(full),
      })
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Solucionador de Objeções (AI)
        </h1>
        <p className="text-muted-foreground mt-1">
          Enfrentando resistência? Insira a objeção do cliente e receba uma estratégia de contorno
          avançada baseada em reasoning AI.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareWarning className="w-5 h-5 text-orange-500" />
            Descreva a Objeção
          </CardTitle>
          <CardDescription>
            O que o cliente disse? (ex: "Achei caro", "Já tenho corretor")
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={objection}
            onChange={(e) => setObjection(e.target.value)}
            placeholder="Digite a objeção detalhada aqui..."
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSolve}
            disabled={loading || !objection.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              'Consultando AI...'
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Consultar Solução
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {solution && (
        <Card className="flex-1 min-h-[300px] flex flex-col border-primary/20 animate-fade-in-up">
          <CardHeader className="bg-primary/5">
            <CardTitle>Estratégia Recomendada</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1">
            <ScrollArea className="h-[400px] pr-4">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                {solution}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
