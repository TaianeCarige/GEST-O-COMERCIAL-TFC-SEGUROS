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
import pb from '@/lib/pocketbase/client'
import { Loader2 } from 'lucide-react'

const PRODUCTS = ['Saúde', 'Odonto', 'Patrimonial', 'Auto/Frota', 'Responsabilidade Civil', 'Vida']

export default function ScriptGenerator() {
  const { consultants, currentUser, permissions } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)
  const myPermissions = permissions[me?.role || 'Consultor']
  const { toast } = useToast()

  const [product, setProduct] = useState('')
  const [company, setCompany] = useState('')
  const [contact, setContact] = useState('')
  const [generatedScript, setGeneratedScript] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!product || !company || !contact) return
    setIsGenerating(true)

    try {
      const res = await fetch(
        `${import.meta.env.VITE_POCKETBASE_URL}/backend/v1/ask-tfc-consultant`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: pb.authStore.token },
          body: JSON.stringify({
            message: `Crie um script de vendas B2B curto e direto para o produto ${product}. Decisor: ${contact}, Empresa: ${company}. Meu nome é ${me?.name || 'Consultor'}. Use um tom profissional e focado em blindagem patrimonial e eficiência de custos para agendar um Assessment Executivo de 15 minutos. Traga contexto real do mercado deste ramo se aplicável.`,
          }),
        },
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setGeneratedScript(data.content)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    } finally {
      setIsGenerating(false)
    }
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
                  {PRODUCTS.map((key) => (
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
              disabled={!product || !company || !contact || isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Gerando Script...' : 'Gerar Script VIP'}
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
