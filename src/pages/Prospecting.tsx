import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FileText, Copy, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import useAppStore from '@/stores/useAppStore'
import { Navigate } from 'react-router-dom'

const SCRIPT_TEMPLATES = {
  Saúde: {
    hook: 'Somos especialistas em blindagem patrimonial e eficiência de custos com benefícios corporativos.',
    pain: 'Sabemos que a inflação médica e a dificuldade na retenção de talentos estão impactando as margens das operações e expondo o caixa.',
    value:
      'Desenhamos uma arquitetura de Saúde focada na redução de sinistralidade e otimização de custos, garantindo a proteção financeira do seu balanço.',
  },
  Odonto: {
    hook: 'Atuamos na valorização do capital humano com alto impacto perceptível e eficiência de custos.',
    pain: 'Muitas empresas perdem a chance de fidelizar a equipe e acabam assumindo passivos trabalhistas ocultos.',
    value:
      'A TFC estrutura planos odontológicos eficientes que não oneram a folha e atuam como uma camada extra de proteção ao capital humano.',
  },
  Patrimonial: {
    hook: 'Nossa consultoria é focada na continuidade de negócios, blindagem patrimonial e proteção do balanço financeiro.',
    pain: 'Uma interrupção operacional imprevista pode quebrar o caixa de operações que não possuem compliance adequado de apólices.',
    value:
      'Realizamos uma varredura de exposição de riscos e desenhamos uma blindagem jurídica e patrimonial, garantindo a solidez e eficiência de custos.',
  },
  'Auto/Frota': {
    hook: 'Somos especialistas em otimização de custo logístico e blindagem patrimonial de ativos corporativos.',
    pain: 'Veículos parados ou sinistros mal geridos representam aumento drástico de custos operacionais e passivos.',
    value:
      'A TFC implementa proteção de ativos e gestão de frotas, reduzindo significativamente seu custo operacional e exposição de capital.',
  },
  RC: {
    hook: 'Atuamos com proteção e blindagem patrimonial corporativa para sócios, diretores e operações complexas.',
    pain: 'Processos judiciais e falhas em compliance estão em escalada, ameaçando diretamente o patrimônio da empresa e de seus executivos.',
    value:
      'Estruturamos a blindagem jurídica através do seguro de Responsabilidade Civil, permitindo operação sem exposição patrimonial e com eficiência de custos.',
  },
}

export default function Prospecting() {
  const { consultants, currentUser, permissions } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)
  const myPermissions = permissions[me?.role || 'Consultor']
  const { toast } = useToast()

  const [product, setProduct] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')

  const handleGenerate = () => {
    if (!product || !company || !contact) return

    const template = SCRIPT_TEMPLATES[product as keyof typeof SCRIPT_TEMPLATES]
    if (!template) return

    const script = `Olá, ${contact}. Aqui é ${me?.name}, da TFC Seguros Corporativos.

${template.hook}

Avaliando o cenário atual da ${company}, identificamos um desafio comum no seu setor: ${template.pain}

${template.value}

O objetivo do nosso contato é agendar um Assessment Executivo de 15 minutos para mapear seu cenário e apresentar um modelo de mitigação de riscos, blindando seu patrimônio e garantindo eficiência de custos.

Como está sua disponibilidade para um call na próxima terça-feira pela manhã?`

    setGeneratedScript(script)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript)
    toast({
      title: 'Script copiado!',
      description: 'O script foi copiado para a área de transferência.',
    })
  }

  if (!myPermissions.script_generator) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Gerador Dinâmico de Scripts VIP
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie abordagens de alta conversão adaptadas ao Ramo de Atuação do prospect (Foco em
          Blindagem Patrimonial e Eficiência).
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Parâmetros do Prospect VIP</CardTitle>
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
          <Card className="bg-primary/5 border-primary/20 animate-fade-in-up">
            <CardHeader className="pb-3 border-b border-primary/10">
              <CardTitle className="text-lg">Script Estratégico Gerado</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-foreground bg-background p-4 rounded-md border shadow-sm">
                {generatedScript}
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copiar para Área de Transferência
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
