import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Diamond, ShieldAlert, BadgeDollarSign, Target } from 'lucide-react'

export default function VIPMentor() {
  const [searchParams] = useSearchParams()
  const [targetName, setTargetName] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mentorData, setMentorData] = useState<{
    mindset: string
    dos: string[]
    donts: string[]
    insight: string
  } | null>(null)

  useEffect(() => {
    const lead = searchParams.get('lead')
    if (lead) {
      setTargetName(lead)
      handleAnalyze(lead)
    }
  }, [searchParams])

  const handleAnalyze = (target: string) => {
    if (!target.trim()) return
    setIsAnalyzing(true)
    setMentorData(null)

    setTimeout(() => {
      setMentorData({
        mindset:
          'O cliente Alta Renda/Corporativo não compra preço, compra Autoridade e Solução de Risco. O tempo dele é o ativo mais valioso.',
        dos: [
          'Vista-se (física e verbalmente) como um executivo de igual para igual.',
          "Fale em 'Exposição ao Risco', 'Blindagem Patrimonial' e 'Continuidade do Negócio'.",
          'Apresente cases de sucesso anônimos da própria corretora TFC.',
          "Crie escassez: 'Avaliamos poucas contas com esse perfil mensalmente para garantir exclusividade.'",
        ],
        donts: [
          "Não use a palavra 'Cotação' ou 'Segurinho'.",
          'Não seja insistente ou ansioso (necessity vibes espantam Alta Renda).',
          'Não faça perguntas de triagem básicas que você já poderia ter pesquisado (Google/LinkedIn).',
        ],
        insight: `Para o contato com ${target}, foque em agendar um 'Assessment Executivo de 15 min'. O objetivo inicial NÃO é fechar negócio, mas conquistar o status de 'Conselheiro de Riscos'.`,
      })
      setIsAnalyzing(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAnalyze(targetName)
  }

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-amber-500" />
          Expert Mentor Alta Renda (VIP)
        </h1>
        <p className="text-muted-foreground mt-1">
          Refinamento de postura, abordagem e mindset para reuniões com Decisores C-Level.
        </p>
      </div>

      <Card className="border-amber-500/20 bg-amber-500/5 shadow-none">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <label htmlFor="target-input" className="text-sm font-medium leading-none">
                Nome do Lead ou Cargo do Decisor (Ex: CEO Grupo Alpha)
              </label>
              <Input
                id="target-input"
                placeholder="CEO, Diretor Financeiro, Presidente..."
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="bg-background border-amber-500/30 focus-visible:ring-amber-500"
              />
            </div>
            <Button
              type="submit"
              disabled={isAnalyzing || !targetName.trim()}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isAnalyzing ? 'Refinando Mindset...' : 'Solicitar Mentoria VIP'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {mentorData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          <Card className="md:col-span-2 bg-slate-900 text-white border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Diamond className="h-5 w-5" />
                O Mindset do Executivo Alta Renda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium leading-relaxed italic border-l-4 border-amber-500 pl-4">
                "{mentorData.mindset}"
              </p>
              <div className="mt-6 p-4 bg-white/10 rounded-lg flex gap-3 items-start">
                <Target className="h-6 w-6 text-amber-400 shrink-0" />
                <p className="text-sm font-medium">{mentorData.insight}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/30 border-2">
            <CardHeader className="bg-success/5 pb-4">
              <CardTitle className="text-success flex items-center gap-2">
                <BadgeDollarSign className="h-5 w-5" />
                DOs (O que Fazer)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {mentorData.dos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                    <div className="h-5 w-5 rounded-full bg-success/20 text-success flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      ✓
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 border-2">
            <CardHeader className="bg-destructive/5 pb-4">
              <CardTitle className="text-destructive flex items-center gap-2">
                <ShieldAlert className="h-5 w-5" />
                DON'Ts (O que Evitar)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {mentorData.donts.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                    <div className="h-5 w-5 rounded-full bg-destructive/20 text-destructive flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      ✗
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
