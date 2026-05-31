import React, { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Telescope, Search, Building2, UserPlus, Sparkles, Copy, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface Prospect {
  id: string
  name: string
  sector: string
  revenue: string
  contact: string
  role: string
}

const MOCK_PROSPECTS: Prospect[] = [
  {
    id: '1',
    name: 'TechSolutions Cloud',
    sector: 'Tecnologia',
    revenue: 'R$ 10M - 50M',
    contact: 'Roberto Almeida',
    role: 'CFO',
  },
  {
    id: '2',
    name: 'Logística Avançada Brasil',
    sector: 'Transportes',
    revenue: 'R$ 50M - 100M',
    contact: 'Carla Silva',
    role: 'Diretora Operacional',
  },
  {
    id: '3',
    name: 'Indústria Metalúrgica Força',
    sector: 'Indústria',
    revenue: 'R$ 100M+',
    contact: 'João Pedro',
    role: 'CEO',
  },
  {
    id: '4',
    name: 'Clínica Médica Premium',
    sector: 'Saúde',
    revenue: 'R$ 5M - 10M',
    contact: 'Dra. Ana Costa',
    role: 'Sócia-Diretora',
  },
]

export default function Prospecting() {
  const { consultants, currentUser } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)
  const { toast } = useToast()

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Prospect[]>([])
  const [scriptDialog, setScriptDialog] = useState<{ open: boolean; prospect: Prospect | null }>({
    open: false,
    prospect: null,
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setIsSearching(true)
    setTimeout(() => {
      const lower = searchTerm.toLowerCase()
      const filtered = MOCK_PROSPECTS.filter(
        (p) => p.sector.toLowerCase().includes(lower) || p.name.toLowerCase().includes(lower),
      )
      setResults(filtered.length > 0 ? filtered : MOCK_PROSPECTS.slice(0, 2))
      setIsSearching(false)
    }, 800)
  }

  const handleGenerateScript = (prospect: Prospect) => {
    setScriptDialog({ open: true, prospect })
  }

  const copyScript = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Script copiado!',
      description: 'O script foi copiado para a área de transferência.',
    })
  }

  const generateScriptText = (prospect: Prospect) => {
    return `Olá ${prospect.contact}, 

Sou ${me?.name}, especialista corporate na TFC Seguros. Nosso foco é a blindagem e proteção patrimonial de operações de alto impacto no setor de ${prospect.sector}.

Identificamos a ${prospect.name} como uma empresa referência. Atualmente, ajudamos corporações desse porte a estruturarem soluções exclusivas que garantem a continuidade dos negócios e a segurança jurídica de seus executivos (${prospect.role}), sem onerar o caixa da empresa.

Gostaria de agendar uma breve conversa de 15 minutos na próxima terça-feira para compartilhar um case de redução de exposição a riscos em uma operação similar à sua.

Teria disponibilidade?`
  }

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Telescope className="h-8 w-8 text-primary" />
          Prospecção Ativa B2B
        </h1>
        <p className="text-muted-foreground mt-1">
          Identifique novos alvos corporativos e gere scripts VIP de alta conversão.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-none">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <label htmlFor="search-input" className="text-sm font-medium leading-none">
                Perfil, Setor ou Porte (Ex: Saúde, Indústria, Logística)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-input"
                  placeholder="Buscar alvos B2B..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              className="w-full sm:w-auto"
            >
              {isSearching ? 'Buscando...' : 'Mapear Mercado'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <div className="space-y-4 animate-fade-in-up">
          <h2 className="text-xl font-semibold">Alvos Identificados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((prospect) => (
              <Card key={prospect.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{prospect.name}</h3>
                        <Badge variant="secondary" className="mt-1 font-normal text-xs">
                          {prospect.sector}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground flex-1">
                    <p>
                      <strong className="text-foreground font-medium">Faturamento Estimado:</strong>{' '}
                      {prospect.revenue}
                    </p>
                    <p>
                      <strong className="text-foreground font-medium">Decisor:</strong>{' '}
                      {prospect.contact} ({prospect.role})
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t flex gap-3">
                    <Button
                      onClick={() => handleGenerateScript(prospect)}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Sparkles className="h-4 w-4 mr-2" /> Script VIP
                    </Button>
                    <Button variant="outline" size="icon" title="Adicionar ao Funil">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {results.length === 0 && !isSearching && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
          <Telescope className="h-12 w-12 mb-4 opacity-20" />
          <p>Utilize a barra acima para mapear novos clientes no mercado.</p>
        </div>
      )}

      <Dialog
        open={scriptDialog.open}
        onOpenChange={(open) => !open && setScriptDialog({ open: false, prospect: null })}
      >
        <DialogContent className="sm:max-w-[600px]">
          {scriptDialog.prospect && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Sparkles className="h-5 w-5 text-accent" /> Script de Alta Performance
                </DialogTitle>
                <DialogDescription>
                  Abordagem VIP focada em Exclusividade e Proteção Patrimonial para{' '}
                  {scriptDialog.prospect.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-muted p-4 rounded-md mt-4 text-sm leading-relaxed whitespace-pre-wrap font-medium text-foreground">
                {generateScriptText(scriptDialog.prospect)}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Tom de voz: VIP / Corporate
                </div>
                <Button onClick={() => copyScript(generateScriptText(scriptDialog.prospect!))}>
                  <Copy className="h-4 w-4 mr-2" /> Copiar Script
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
