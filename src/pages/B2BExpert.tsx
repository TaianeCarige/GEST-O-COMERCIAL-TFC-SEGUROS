import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
  Target,
  MessageCircleWarning,
  Briefcase,
} from 'lucide-react'

type ProductMix =
  | 'Automóveis e Frotas'
  | 'Saúde'
  | 'Vida'
  | 'Odontológico'
  | 'Responsabilidade Civil'
  | 'Patrimonial'

interface BriefingData {
  sector: string
  risks: string[]
  productMix: ProductMix[]
  arguments: string[]
  objections: { question: string; answer: string }[]
}

const SECTOR_DATA: Record<string, BriefingData> = {
  industria: {
    sector: 'Indústria / Manufatura',
    risks: [
      'Riscos operacionais e parada de maquinário',
      'Danos a terceiros e poluição acidental',
      'Interrupção de negócios e lucros cessantes',
      'Incêndio em armazéns e parques fabris',
      'Acidentes de trabalho com severidade',
    ],
    productMix: ['Patrimonial', 'Responsabilidade Civil', 'Automóveis e Frotas'],
    arguments: [
      'Sua operação não pode parar por um sinistro. O Seguro Patrimonial garante a continuidade e protege o caixa.',
      'O RC Operações e Empregador blinda a empresa contra processos trabalhistas e de terceiros que podem consumir margens de lucro.',
      'Uma frota de transporte parada significa quebra de contratos. Frota protegida é logística garantida.',
    ],
    objections: [
      {
        question: 'Já temos seguro de incêndio obrigatório.',
        answer:
          'Nossa análise foca em gaps que apólices antigas não cobrem, como lucros cessantes e despesas fixas durante a parada operacional.',
      },
      {
        question: 'O custo do seguro é muito alto.',
        answer:
          'O custo de uma parada operacional de 1 semana é em média 10x maior que o prêmio anual do seguro. É uma proteção de balanço.',
      },
    ],
  },
  servicos: {
    sector: 'Serviços / Tecnologia / Consultoria',
    risks: [
      'Retenção e atração de talentos (turnover)',
      'Falhas profissionais e processos por erro/omissão (E&O)',
      'Afastamentos de funcionários críticos',
      'Responsabilidade civil em contratos SLA',
    ],
    productMix: ['Saúde', 'Vida', 'Odontológico', 'Responsabilidade Civil'],
    arguments: [
      'Benefícios corporativos (Saúde/Odonto) são a principal ferramenta de retenção de talentos especializados hoje.',
      'Um bom plano de Vida em Grupo demonstra cuidado real com a família do colaborador, fidelizando a equipe.',
      'O RC Profissional (E&O) blinda os sócios contra erros não intencionais na prestação do serviço.',
    ],
    objections: [
      {
        question: 'Nossa equipe é jovem e quase não usa plano de saúde.',
        answer:
          'Exatamente por isso a sinistralidade é baixa e podemos negociar taxas excelentes, funcionando como atrativo para novos talentos.',
      },
      {
        question: 'Já temos plano de saúde.',
        answer:
          'Podemos realizar um estudo de rede referenciada e coparticipação que pode reduzir seu custo atual em até 15% mantendo o mesmo nível.',
      },
    ],
  },
  comercio: {
    sector: 'Comércio / Varejo',
    risks: [
      'Roubo e furto qualificado de mercadorias',
      'Incêndio e danos elétricos em instalações',
      'Acidentes com clientes dentro do estabelecimento',
      'Obrigações sindicais e convenções coletivas',
    ],
    productMix: ['Patrimonial', 'Vida', 'Automóveis e Frotas'],
    arguments: [
      'Estoque é dinheiro imobilizado. O Patrimonial garante que um roubo ou incêndio não quebre o fluxo de caixa.',
      'RC Operações cobre eventuais quedas ou acidentes com clientes na loja, transferindo o risco jurídico.',
      'Seguro de Vida atende à convenção coletiva obrigatória do comércio, evitando multas e ações sindicais.',
    ],
    objections: [
      {
        question: 'Nunca fomos roubados nem tivemos incêndio.',
        answer:
          'O risco de danos elétricos, vendaval e alagamento cresceu na região. O roubo é apenas uma das dezenas de coberturas.',
      },
      {
        question: 'A margem do varejo está apertada para assumir mais custos.',
        answer:
          'Podemos desenhar uma apólice enxuta sob medida, focando estritamente nos riscos catastróficos para não pesar no orçamento.',
      },
    ],
  },
  default: {
    sector: 'Empresa / Setor Geral',
    risks: [
      'Riscos de responsabilidade civil geral e processos',
      'Riscos relacionados a saúde e retenção de colaboradores',
      'Impactos imprevistos ao patrimônio físico ou digital',
    ],
    productMix: ['Saúde', 'Patrimonial', 'Responsabilidade Civil'],
    arguments: [
      'Uma blindagem básica envolvendo Saúde, RC e Patrimonial é o pilar de qualquer negócio sólido e profissional.',
      'Avaliamos o custo-benefício de pacotes unificados de riscos para otimizar sua linha de despesas operacionais.',
      'Nosso foco como consultoria é mapear os buracos por onde a empresa pode perder caixa através de imprevistos.',
    ],
    objections: [
      {
        question: 'Não tenho tempo agora para avaliar seguros.',
        answer:
          'O briefing e a análise de apólices atuais levam 15 minutos e mostram exatamente onde você pode estar pagando a mais.',
      },
      {
        question: 'A matriz que decide isso.',
        answer:
          'Podemos preparar um relatório executivo comparativo para você apresentar à matriz com um claro business case de redução de custos.',
      },
    ],
  },
}

export default function B2BExpert() {
  const [searchParams] = useSearchParams()
  const [inputVal, setInputVal] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [briefing, setBriefing] = useState<BriefingData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const sectorParam = searchParams.get('sector')
    if (sectorParam) {
      setInputVal(sectorParam)
      // Auto-trigger analysis if directly coming with a pre-filled sector
      handleAnalysis(sectorParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAnalysis = async (sectorValue: string) => {
    if (!sectorValue.trim()) return

    setIsGenerating(true)
    setBriefing(null)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-tfc-consultant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
          body: JSON.stringify({
            message: `Gere um briefing B2B estratégico para o setor ou empresa: "${sectorValue}". Retorne estritamente um JSON válido (sem marcação de markdown como \`\`\`json) com a seguinte estrutura exata: {"risks": ["risco 1", "risco 2"], "productMix": ["Produto A"], "arguments": ["arg 1", "arg 2"], "objections": [{"question": "obj 1", "answer": "resp 1"}]}. O productMix deve conter apenas valores desta lista (escolha de 1 a 4 focados no setor): "Automóveis e Frotas", "Saúde", "Vida", "Odontológico", "Responsabilidade Civil", "Patrimonial". Crie de 3 a 5 risks, 3 arguments e 2 objections inteligentes e consultivas.`,
          }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const text = data.content
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim()
      const parsed = JSON.parse(text)
      setBriefing({ ...parsed, sector: sectorValue })
    } catch (err: any) {
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar a análise. Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault()
    handleAnalysis(inputVal)
  }

  return (
    <div className="space-y-6 h-full flex flex-col pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          Especialista em Inteligência B2B - TFC
        </h1>
        <p className="text-muted-foreground mt-1">
          Motor de análise estratégica para preparação de reuniões corporativas de alto nível.
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5 shadow-none">
        <CardContent className="pt-6">
          <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1 w-full">
              <label
                htmlFor="sector-input"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Nome da Empresa ou Setor de Atuação
              </label>
              <Input
                id="sector-input"
                placeholder="Ex: Indústria Metalúrgica, TechCorp, Clínica Médica..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="bg-background"
              />
            </div>
            <Button
              type="submit"
              disabled={isGenerating || !inputVal.trim()}
              className="w-full sm:w-auto"
            >
              {isGenerating ? 'Analisando Setor...' : 'Gerar Briefing Estratégico'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {briefing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {/* Riscos Assessment */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-destructive/10 border-b border-destructive/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Matriz de Riscos Inerentes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {briefing.risks.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Product Mix Recommender */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-primary/10 border-b border-primary/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-primary">
                <ShieldCheck className="h-5 w-5" />
                Mix de Produtos Ideal (TFC)
              </CardTitle>
              <CardDescription className="text-primary/80">
                Foco sugerido para fechamento completo (Cross-sell)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {[
                  'Automóveis e Frotas',
                  'Saúde',
                  'Vida',
                  'Odontológico',
                  'Responsabilidade Civil',
                  'Patrimonial',
                ].map((prod) => {
                  const isRecommended = briefing.productMix.includes(prod as ProductMix)
                  return (
                    <Badge
                      key={prod}
                      variant={isRecommended ? 'default' : 'outline'}
                      className={
                        isRecommended ? 'px-3 py-1 text-sm' : 'px-3 py-1 text-sm opacity-50'
                      }
                    >
                      {prod}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Argumentation Kit */}
          <Card className="lg:col-span-2">
            <CardHeader className="bg-accent/10 border-b border-accent/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-accent">
                <Target className="h-5 w-5" />
                Argumentos de Venda (High-Impact)
              </CardTitle>
              <CardDescription>
                Use estas 3 abordagens como quebra-gelo ou fechamento
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {briefing.arguments.map((arg, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-bold">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium leading-relaxed">{arg}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling */}
          <Card className="lg:col-span-1">
            <CardHeader className="bg-orange-500/10 border-b border-orange-500/20 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-orange-600 dark:text-orange-400">
                <MessageCircleWarning className="h-5 w-5" />
                Guia de Objeções
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-2">
              <Accordion type="single" collapsible className="w-full">
                {briefing.objections.map((obj, idx) => (
                  <AccordionItem value={`item-${idx}`} key={idx} className="border-b-0 px-2">
                    <AccordionTrigger className="text-sm font-semibold text-left py-3 hover:no-underline hover:text-orange-600 dark:hover:text-orange-400">
                      "{obj.question}"
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-4 border-l-2 border-orange-500/50 pl-3 ml-1">
                      <span className="font-medium text-foreground mb-1 flex items-center gap-1">
                        <Briefcase className="h-3 w-3" /> Resposta Consultor Senior:
                      </span>
                      {obj.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
