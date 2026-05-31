import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Telescope,
  Search,
  Building2,
  UserPlus,
  Sparkles,
  Copy,
  FileText,
  RefreshCw,
  BriefcaseBusiness,
  CheckCircle2,
} from 'lucide-react'
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

const SCRIPT_TEMPLATES = {
  Saúde: [
    {
      hook: 'Somos especialistas em blindagem e gestão de benefícios corporativos de alto nível.',
      pain: 'Sabemos que a inflação médica e a dificuldade na retenção de talentos estão esmagando as margens das operações neste ano.',
      value:
        'Desenhamos uma arquitetura de Saúde focada na retenção de talentos críticos e gestão de benefícios, enquanto aplicamos engenharia de redução de sinistralidade.',
    },
    {
      hook: 'Atuamos como parceiros estratégicos na otimização de custos com saúde corporativa.',
      pain: 'O aumento descontrolado de custos com planos de saúde tem impactado diretamente o EBITDA das grandes operações.',
      value:
        'Implementamos modelos preditivos de gestão de saúde que garantem a sustentabilidade do benefício sem perda de qualidade para o colaborador.',
    },
  ],
  Odonto: [
    {
      hook: 'Atuamos na valorização do capital humano com alto impacto perceptível.',
      pain: 'Muitas empresas perdem a chance de fidelizar a equipe por não oferecerem benefícios de alta percepção.',
      value:
        'A TFC estrutura planos odontológicos focados em retenção de talentos e gestão de benefícios eficientes que não oneram a folha.',
    },
    {
      hook: 'Nosso foco é ampliar o pacote de benefícios corporativos com inteligência financeira.',
      pain: 'A dificuldade em atrair e reter talentos muitas vezes está atrelada à falta de um pacote de benefícios competitivo.',
      value:
        'Desenhamos soluções odontológicas premium que elevam o moral da equipe e mantêm o equilíbrio do fluxo de caixa.',
    },
  ],
  Patrimonial: [
    {
      hook: 'Nossa consultoria é focada na continuidade de negócios e proteção do balanço financeiro.',
      pain: 'Uma interrupção operacional imprevista pode quebrar o caixa de operações que não possuem compliance adequado de apólices.',
      value:
        'Realizamos uma varredura de exposição a riscos e desenhamos uma blindagem jurídica e continuidade de negócios garantindo a solidez corporativa.',
    },
    {
      hook: 'Somos especialistas na proteção de ativos críticos e mitigação de riscos empresariais.',
      pain: 'A exposição a riscos não mapeados frequentemente ameaça a estabilidade e a reputação das empresas no mercado.',
      value:
        'Estruturamos programas de seguros patrimoniais robustos, garantindo que o seu balanço permaneça protegido mesmo nos piores cenários.',
    },
  ],
  'Auto/Frota': [
    {
      hook: 'Somos especialistas em otimização de custo logístico e proteção de ativos corporativos.',
      pain: 'Veículos parados ou sinistros mal geridos representam aumento de custos operacionais e gargalos na entrega.',
      value:
        'A TFC implementa uma proteção de ativos e gestão de frotas com assistência corporativa 24h, reduzindo significativamente seu custo operacional.',
    },
    {
      hook: 'Focamos na eficiência operacional através da gestão inteligente de riscos de frota.',
      pain: 'A imprevisibilidade de custos com manutenção e sinistros compromete a margem de lucro de operações logísticas.',
      value:
        'Aplicamos nossa expertise para blindar sua frota, garantindo disponibilidade máxima e previsibilidade de custos com assistência ágil.',
    },
  ],
  RC: [
    {
      hook: 'Atuamos com proteção patrimonial corporativa para sócios, diretores e operações complexas.',
      pain: 'Processos judiciais e falhas em compliance estão em escalada, ameaçando o patrimônio da empresa e dos executivos.',
      value:
        'Estruturamos a blindagem jurídica legal e compliance através do Responsabilidade Civil, permitindo que a liderança atue sem exposição patrimonial.',
    },
    {
      hook: 'Somos consultores em mitigação de riscos de gestão e proteção executiva.',
      pain: 'A crescente complexidade regulatória aumenta a vulnerabilidade dos executivos a litígios e passivos inesperados.',
      value:
        'Desenhamos apólices de D&O e RC sob medida que criam uma barreira de proteção ao patrimônio pessoal, garantindo tranquilidade na tomada de decisão.',
    },
  ],
}

function sectorToProduct(sector: string) {
  const s = sector.toLowerCase()
  if (s.includes('saúde') || s.includes('med')) return 'Saúde'
  if (s.includes('indústria') || s.includes('metalúrgica')) return 'Patrimonial'
  if (s.includes('transporte') || s.includes('logística')) return 'Auto/Frota'
  if (s.includes('tecnologia') || s.includes('cloud')) return 'RC'
  return ''
}

export default function Prospecting() {
  const { consultants, currentUser } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState('search')

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Prospect[]>([])

  const [product, setProduct] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [variationIndex, setVariationIndex] = useState(0)

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

  const generateScriptText = (p: string, c: string, ct: string, variant: number) => {
    if (!p || !c || !ct) return
    const templates = SCRIPT_TEMPLATES[p as keyof typeof SCRIPT_TEMPLATES]
    if (!templates) return
    const template = templates[variant % templates.length]

    const script = `Olá, ${ct}. Aqui é ${me?.name}, da TFC Seguros Corporativos.\n\n${template.hook}\n\nAvaliando o cenário atual da ${c}, identificamos um desafio comum no seu setor: ${template.pain}\n\n${template.value}\n\nO objetivo do nosso contato é agendar um Assessment Executivo de 15 minutos para mapear seu cenário e apresentar um modelo de mitigação de riscos.\n\nComo está sua disponibilidade para um call na próxima terça-feira pela manhã?`
    setGeneratedScript(script)
  }

  const handleRedirectToGenerator = (prospect: Prospect) => {
    setCompany(prospect.name)
    setContact(prospect.contact)
    const mapped = sectorToProduct(prospect.sector)

    setActiveTab('generator')
    if (mapped) {
      setProduct(mapped)
      setVariationIndex(0)
      generateScriptText(mapped, prospect.name, prospect.contact, 0)
      toast({
        title: 'Gerador Preparado',
        description: 'Script VIP gerado automaticamente baseado no setor.',
      })
    } else {
      setProduct('')
      setGeneratedScript('')
      toast({
        title: 'Gerador Preparado',
        description: 'Preencha o ramo de interesse para gerar o script VIP.',
      })
    }
  }

  const handleGenerate = () => {
    setVariationIndex(0)
    generateScriptText(product, company, contact, 0)
  }

  const handleRegenerate = () => {
    const newIdx = variationIndex + 1
    setVariationIndex(newIdx)
    generateScriptText(product, company, contact, newIdx)
  }

  const copyScript = () => {
    navigator.clipboard.writeText(generatedScript)
    toast({
      title: 'Script copiado!',
      description: 'O script foi copiado para a área de transferência.',
    })
  }

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Telescope className="h-8 w-8 text-primary" />
          Prospecção Ativa B2B
        </h1>
        <p className="text-muted-foreground mt-1">
          Identifique novos alvos corporativos e crie abordagens de alta conversão.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 bg-muted/50">
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Mapeamento de Mercado
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Gerador de Scripts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6 animate-fade-in-up mt-2">
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="space-y-2 flex-1 w-full">
                  <Label htmlFor="search-input">
                    Perfil, Setor ou Porte (Ex: Saúde, Indústria, Logística)
                  </Label>
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
            <div className="space-y-4">
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
                          <strong className="text-foreground font-medium">
                            Faturamento Estimado:
                          </strong>{' '}
                          {prospect.revenue}
                        </p>
                        <p>
                          <strong className="text-foreground font-medium">Decisor:</strong>{' '}
                          {prospect.contact} ({prospect.role})
                        </p>
                      </div>
                      <div className="mt-6 pt-4 border-t flex gap-3">
                        <Button
                          onClick={() => handleRedirectToGenerator(prospect)}
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
        </TabsContent>

        <TabsContent value="generator" className="space-y-6 mt-2 animate-fade-in-up">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros do Prospect</CardTitle>
                <CardDescription>
                  Preencha os dados para personalizar o discurso (Executive Copywriting).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome do Decisor</Label>
                  <Input
                    placeholder="Ex: Roberto Almeida"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nome da Empresa Alvo</Label>
                  <Input
                    placeholder="Ex: Indústrias Alfa"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ramo de Interesse (Produto)</Label>
                  <Select value={product} onValueChange={setProduct}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o Ramo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(SCRIPT_TEMPLATES).map((key) => (
                        <SelectItem key={key} value={key}>
                          {key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleGenerate}
                  disabled={!product || !company || !contact}
                >
                  <Sparkles className="w-4 h-4 mr-2" /> Gerar Script VIP
                </Button>
              </CardContent>
            </Card>

            {generatedScript && (
              <Card className="bg-primary/5 border-primary/20 flex flex-col">
                <CardHeader className="pb-3 border-b border-primary/10 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-lg">Script Estratégico Gerado</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-success" /> Corporate
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col">
                  <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-foreground bg-background p-4 rounded-md border shadow-sm flex-1">
                    {generatedScript}
                  </div>
                  <div className="flex justify-between mt-4 gap-2">
                    <Button
                      onClick={handleRegenerate}
                      variant="secondary"
                      className="flex-1 border"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Regerar Script
                    </Button>
                    <Button onClick={copyScript} className="flex-1">
                      <Copy className="w-4 h-4 mr-2" /> Copiar para Área de Transferência
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center p-5 bg-muted/40 rounded-lg border border-dashed">
            <span className="text-sm text-muted-foreground font-medium">
              Precisa de suporte técnico para a reunião?
            </span>
            <div className="flex gap-2">
              <Link to="/b2b-expert" tabIndex={-1}>
                <Button variant="outline" size="sm" className="h-9">
                  <BriefcaseBusiness className="w-4 h-4 mr-2" /> Especialista B2B
                </Button>
              </Link>
              <Link to="/vip-mentor" tabIndex={-1}>
                <Button variant="outline" size="sm" className="h-9">
                  <Sparkles className="w-4 h-4 mr-2" /> Mentor VIP
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
