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

const SCRIPT_TEMPLATES = {
  'Saúde (Health)': {
    hook: 'Especialistas em blindagem e gestão de benefícios corporativos.',
    pain: 'A inflação médica e o alto turnover estão esmagando as margens das operações neste ano.',
    value:
      'Desenhamos uma arquitetura de Saúde que foca em retenção de talentos críticos enquanto aplicamos engenharia de redução de sinistralidade.',
  },
  'Odontológico (Dental)': {
    hook: 'Focados na valorização do capital humano com alto impacto perceptível.',
    pain: 'Muitas empresas perdem a chance de fidelizar a equipe por não oferecerem benefícios de alta percepção e baixo custo.',
    value:
      'A TFC estrutura planos odontológicos integrados que funcionam como alavanca de retenção de talentos sem onerar a folha.',
  },
  'Patrimonial (Property)': {
    hook: 'Consultoria focada em continuidade de negócios e proteção de balanço.',
    pain: 'Uma interrupção operacional imprevista (como danos elétricos ou incêndios) pode quebrar o caixa de operações que não têm apólices atualizadas.',
    value:
      'Realizamos uma varredura de exposição de riscos e desenhamos coberturas sob medida de Lucros Cessantes, garantindo a solidez do negócio.',
  },
  'Automóveis/Frotas (Auto/Fleet)': {
    hook: 'Especialistas em otimização de custo logístico e mitigação de riscos de transporte.',
    pain: 'Veículos parados ou sinistros mal geridos representam gargalos gigantes na operação e atrasos na entrega.',
    value:
      'A TFC implementa uma gestão de frotas voltada à disponibilidade dos ativos, reduzindo o custo total de risco e agilizando as operações.',
  },
  'Responsabilidade Civil (RC)': {
    hook: 'Proteção patrimonial para sócios, diretores e para a operação como um todo.',
    pain: 'Processos judiciais trabalhistas, profissionais e de terceiros estão em escalada, ameaçando diretamente o patrimônio da empresa e dos executivos.',
    value:
      'Estruturamos a blindagem jurídica através do RC Profissional e D&O, permitindo que a liderança tome decisões sem exposição patrimonial.',
  },
}

export default function ScriptGenerator() {
  const { consultants, currentUser } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)
  const { toast } = useToast()

  const [product, setProduct] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')

  const handleGenerate = () => {
    if (!product || !company || !contact) return

    const template = SCRIPT_TEMPLATES[product as keyof typeof SCRIPT_TEMPLATES]
    if (!template) return

    const script = `Olá ${contact}, aqui é ${me?.name}, da TFC Seguros Corporativos.

${template.hook}

Avaliando o cenário da ${company}, identificamos um desafio comum no seu setor: ${template.pain}

${template.value}

O objetivo do nosso contato é agendar um briefing de 15 minutos para mapear seu cenário atual e apresentar um case de redução de exposição. 

Como está sua agenda para a próxima terça-feira pela manhã?`

    setGeneratedScript(script)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript)
    toast({
      title: 'Script copiado!',
      description: 'O script foi copiado para a área de transferência.',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          Gerador Dinâmico de Scripts B2B
        </h1>
        <p className="text-muted-foreground mt-1">
          Crie abordagens de alta conversão adaptadas ao Ramo de Atuação do prospect.
        </p>
      </div>

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
