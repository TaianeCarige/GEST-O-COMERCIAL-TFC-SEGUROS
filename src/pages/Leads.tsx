import React, { useState } from 'react'
import useAppStore, { Branch, Status, PolicyType, Lead } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  MoreHorizontal,
  Filter,
  UserPlus,
  UserCircle,
  AlertTriangle,
  History,
  Save,
  Upload,
  Plus,
  RefreshCw,
  Sparkles,
  CalendarDays,
  Copy,
} from 'lucide-react'
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
  Frota: {
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

export default function Leads() {
  const {
    leads,
    updateLeadConsultant,
    getConsultant,
    consultants,
    currentUser,
    gerentes1327,
    addGerente1327,
    importLeads,
    permissions,
  } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const myPermissions = permissions[me?.role || 'Consultor']
  const isAgency = me?.role === 'Agência'
  const isManager = me?.role === 'Gestora' || isAgency

  const [mainCategory, setMainCategory] = useState<'1327' | 'Corporate'>('1327')

  React.useEffect(() => {
    if (!myPermissions.tab_1327 && myPermissions.tab_corporate && mainCategory === '1327') {
      setMainCategory('Corporate')
    } else if (
      !myPermissions.tab_corporate &&
      myPermissions.tab_1327 &&
      mainCategory === 'Corporate'
    ) {
      setMainCategory('1327')
    }
  }, [myPermissions.tab_1327, myPermissions.tab_corporate, mainCategory])
  const [gerenteTab, setGerenteTab] = useState<string>(gerentes1327[0]?.id || '')
  const [newGerenteName, setNewGerenteName] = useState('')
  const [isAddGerenteOpen, setIsAddGerenteOpen] = useState(false)

  const [branchFilter, setBranchFilter] = useState<Branch | 'Todos'>('Todos')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const handleAddGerente = () => {
    if (!newGerenteName.trim()) return
    addGerente1327(newGerenteName)
    setNewGerenteName('')
    setIsAddGerenteOpen(false)
    toast({ title: 'Gerente Adicionado', description: 'Nova aba de gerente criada com sucesso.' })
  }

  const handleImport = (gerenteId: string) => {
    importLeads(gerenteId, mainCategory)
    toast({ title: 'Planilha Importada', description: 'Leads carregados com sucesso.' })
  }

  const visibleLeads = isAgency
    ? leads
    : isManager
      ? leads.filter(
          (l) =>
            consultants.find((c) => c.id === l.consultantId)?.managerId === me.id ||
            l.consultantId === me.id,
        )
      : leads.filter((l) => l.consultantId === currentUser)

  const categorizedLeads = visibleLeads
    .filter((l) => {
      if (mainCategory === '1327') return l.category === '1327' && l.gerenteId === gerenteTab
      return l.category === 'Corporate'
    })
    .filter((l) => {
      if (branchFilter !== 'Todos' && l.branch !== branchFilter) return false
      return true
    })

  if (!myPermissions.leads_tab) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Navegação hierárquica por categoria e gestor.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={branchFilter} onValueChange={(val) => setBranchFilter(val as any)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Ramo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Ramos</SelectItem>
              <SelectItem value="Automóveis/Frotas">Automóveis/Frotas</SelectItem>
              <SelectItem value="Saúde">Saúde</SelectItem>
              <SelectItem value="Patrimonial">Patrimonial</SelectItem>
              <SelectItem value="RC">RC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs
        value={mainCategory}
        onValueChange={(v) => setMainCategory(v as any)}
        className="w-full space-y-6"
      >
        <TabsList className="bg-muted/50 p-1">
          {myPermissions.tab_1327 && (
            <TabsTrigger value="1327" className="px-8">
              1327
            </TabsTrigger>
          )}
          {myPermissions.tab_corporate && (
            <TabsTrigger value="Corporate" className="px-8">
              Corporate
            </TabsTrigger>
          )}
        </TabsList>

        {myPermissions.tab_1327 && (
          <TabsContent value="1327" className="space-y-4">
            <Tabs value={gerenteTab} onValueChange={setGerenteTab} className="w-full">
              <div className="flex items-center justify-between gap-4 border-b pb-2 mb-4">
                <TabsList className="bg-transparent h-auto p-0 justify-start w-full overflow-x-auto">
                  {gerentes1327.map((g) => (
                    <TabsTrigger
                      key={g.id}
                      value={g.id}
                      className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
                    >
                      {g.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <Dialog open={isAddGerenteOpen} onOpenChange={setIsAddGerenteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <Plus className="w-4 h-4 mr-2" /> Novo Gerente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Gerente</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <Label>Nome do Gerente</Label>
                      <Input
                        value={newGerenteName}
                        onChange={(e) => setNewGerenteName(e.target.value)}
                        placeholder="Ex: Ana Souza"
                        className="mt-2"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddGerente}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {gerentes1327.map((g) => (
                <TabsContent key={g.id} value={g.id}>
                  {myPermissions.import_leads && (
                    <div className="flex justify-end mb-4">
                      <Button variant="secondary" onClick={() => handleImport(g.id)}>
                        <Upload className="w-4 h-4 mr-2" /> Importar Planilha
                      </Button>
                    </div>
                  )}
                  <LeadsTable
                    leads={categorizedLeads}
                    onSelect={setSelectedLeadId}
                    isManager={isManager}
                    consultants={consultants}
                    updateLeadConsultant={updateLeadConsultant}
                    getConsultant={getConsultant}
                    me={me}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        )}

        {myPermissions.tab_corporate && (
          <TabsContent value="Corporate" className="space-y-4">
            {myPermissions.import_leads && (
              <div className="flex justify-end mb-4">
                <Button variant="secondary" onClick={() => handleImport('')}>
                  <Upload className="w-4 h-4 mr-2" /> Importar Planilha
                </Button>
              </div>
            )}
            <LeadsTable
              leads={categorizedLeads}
              onSelect={setSelectedLeadId}
              isManager={isManager}
              consultants={consultants}
              updateLeadConsultant={updateLeadConsultant}
              getConsultant={getConsultant}
              me={me}
            />
          </TabsContent>
        )}
      </Tabs>

      <Sheet open={!!selectedLeadId} onOpenChange={(open) => !open && setSelectedLeadId(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          {selectedLeadId && <LeadProfileSheet leadId={selectedLeadId} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function LeadsTable({
  leads,
  onSelect,
  isManager,
  consultants,
  updateLeadConsultant,
  getConsultant,
  me,
}: any) {
  const now = new Date().getTime()

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Fechamento':
      case 'Fechado':
        return 'bg-success text-success-foreground hover:bg-success/80'
      case 'Prospecção':
      case 'Visita Pendente':
        return 'bg-accent text-accent-foreground hover:bg-accent/80'
      case 'Perdido':
      case 'Objeção':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }
  }

  const isPolicyExpiring = (policies: any[]) =>
    policies?.some((p) => {
      if (!p.expirationDate) return false
      const diff = new Date(p.expirationDate).getTime() - now
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    })

  const isLeadInactive = (lastContact: string) => {
    return now - new Date(lastContact).getTime() >= 90 * 24 * 60 * 60 * 1000
  }

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Lista de Contatos</CardTitle>
        <CardDescription>Gerencie seus clientes e leads importados.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Cliente</TableHead>
                <TableHead>Ramo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Alertas</TableHead>
                {isManager && <TableHead>Consultor</TableHead>}
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.length > 0 ? (
                leads.map((lead: Lead) => {
                  const inactive = isLeadInactive(lead.lastContact)
                  const expiring = isPolicyExpiring(lead.policies)
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.branch}</TableCell>
                      <TableCell>
                        <Badge className={`border-none ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 items-start">
                          {inactive && (
                            <Badge
                              variant="destructive"
                              className="text-[10px] flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" /> REATIVAÇÃO (+90d)
                            </Badge>
                          )}
                          {expiring && (
                            <Badge
                              variant="outline"
                              className="text-[10px] border-amber-500 text-amber-600 flex items-center gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" /> VENCIMENTO PRÓXIMO
                            </Badge>
                          )}
                          {!inactive && !expiring && (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </div>
                      </TableCell>
                      {isManager && <TableCell>{getConsultant(lead.consultantId)?.name}</TableCell>}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelect(lead.id)}>
                              <UserCircle className="w-4 h-4 mr-2" /> Perfil & Histórico
                            </DropdownMenuItem>
                            {isManager && (
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <UserPlus className="w-4 h-4 mr-2" /> Atribuir Lead
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  {consultants
                                    .filter(
                                      (c: any) =>
                                        c.role === 'Agência' ||
                                        c.managerId === me?.id ||
                                        c.id === me?.id,
                                    )
                                    .map((c: any) => (
                                      <DropdownMenuItem
                                        key={c.id}
                                        onClick={() => updateLeadConsultant(lead.id, c.id)}
                                      >
                                        {c.name} {lead.consultantId === c.id && '(Atual)'}
                                      </DropdownMenuItem>
                                    ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isManager ? 6 : 5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

const POLICY_TYPES = [
  'Automóvel',
  'Frota',
  'Saúde',
  'Dental',
  'Vida Funcionários',
  'Vida Individual',
  'Responsabilidade Civil',
  'Seguros Patrimoniais',
  'Outros',
]

function LeadProfileSheet({ leadId }: { leadId: string }) {
  const { leads, updateLeadDetails, updatePolicyDate, addInteraction, consultants, currentUser } =
    useAppStore()
  const { toast } = useToast()

  const lead = leads.find((l) => l.id === leadId)
  const me = consultants.find((c) => c.id === currentUser)

  const [details, setDetails] = useState({
    cnpj: lead?.cnpj || '',
    industry: lead?.industry || '',
    contactName: lead?.contactName || '',
    contactPhone: lead?.contactPhone || '',
  })

  const [interaction, setInteraction] = useState({
    note: '',
    newStatus: lead?.status || 'Prospecção',
  })

  const [scriptType, setScriptType] = useState('Saúde')
  const [generatedScript, setGeneratedScript] = useState('')
  if (!lead) return null

  const handleSaveDetails = () => {
    updateLeadDetails(leadId, details)
    toast({ title: 'Perfil atualizado', description: 'Dados cadastrais salvos com sucesso.' })
  }

  const handleUpdatePolicyDate = (type: PolicyType, date: string) => {
    updatePolicyDate(leadId, type, date)
  }

  const handleAddInteraction = () => {
    if (!interaction.note) return
    addInteraction(leadId, interaction.note, interaction.newStatus as Status)
    setInteraction((prev) => ({ ...prev, note: '' }))
    toast({ title: 'Interação salva', description: 'Histórico e status atualizados.' })
  }

  const handleGenerateScript = () => {
    const template =
      SCRIPT_TEMPLATES[scriptType as keyof typeof SCRIPT_TEMPLATES] || SCRIPT_TEMPLATES['Saúde']

    const script = `Olá, ${details.contactName || 'Contato'}. Aqui é ${me?.name}, da TFC Seguros Corporativos.

${template.hook}

Avaliando o cenário atual da ${lead.name}, identificamos um desafio comum no seu setor: ${template.pain}

${template.value}

O objetivo do nosso contato é agendar um Assessment Executivo de 15 minutos para mapear seu cenário e apresentar um modelo de mitigação de riscos.

Como está sua disponibilidade para um call na próxima terça-feira pela manhã?`

    setGeneratedScript(script)
  }

  const now = new Date().getTime()

  return (
    <div className="space-y-8 py-4">
      <SheetHeader>
        <SheetTitle className="text-2xl flex items-center gap-2">
          {lead.name}
          <Badge variant="outline">
            {lead.category} {lead.category === '1327' ? '- Gerente' : ''}
          </Badge>
        </SheetTitle>
        <SheetDescription>
          Gerencie dados cadastrais, apólices e histórico de interações.
        </SheetDescription>
      </SheetHeader>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-primary" /> Dados Cadastrais
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>CNPJ</Label>
            <Input
              value={details.cnpj}
              onChange={(e) => setDetails({ ...details, cnpj: e.target.value })}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <div className="space-y-2">
            <Label>Ramo de Atividade</Label>
            <Input
              value={details.industry}
              onChange={(e) => setDetails({ ...details, industry: e.target.value })}
              placeholder="Ex: Logística"
            />
          </div>
          <div className="space-y-2">
            <Label>Nome do Responsável</Label>
            <Input
              value={details.contactName}
              onChange={(e) => setDetails({ ...details, contactName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Telefone do Responsável</Label>
            <Input
              value={details.contactPhone}
              onChange={(e) => setDetails({ ...details, contactPhone: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSaveDetails}>
            <Save className="w-4 h-4 mr-2" /> Salvar Dados
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" /> Vencimentos de Apólices
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-lg">
          {POLICY_TYPES.map((type) => {
            const policy = lead.policies?.find((p) => p.type === type)
            const dateStr = policy?.expirationDate ? policy.expirationDate.split('T')[0] : ''
            const isExpiring =
              policy?.expirationDate &&
              new Date(policy.expirationDate).getTime() - now <= 30 * 24 * 60 * 60 * 1000 &&
              new Date(policy.expirationDate).getTime() - now > 0

            return (
              <div key={type} className="flex flex-col space-y-1">
                <Label className="text-xs">{type}</Label>
                <div className="relative flex items-center">
                  <Input
                    type="date"
                    className={`h-9 ${isExpiring ? 'border-amber-500 bg-amber-500/5' : ''}`}
                    value={dateStr}
                    onChange={(e) =>
                      handleUpdatePolicyDate(
                        type as PolicyType,
                        e.target.value ? new Date(e.target.value).toISOString() : '',
                      )
                    }
                  />
                  {isExpiring && (
                    <AlertTriangle className="absolute right-2 w-4 h-4 text-amber-500 pointer-events-none" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" /> Gerador de Scripts
        </h3>
        <div className="bg-accent/5 border border-accent/20 p-4 rounded-lg space-y-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2 flex-1">
              <Label>Produto Alvo</Label>
              <Select value={scriptType} onValueChange={setScriptType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Odonto">Odonto</SelectItem>
                  <SelectItem value="Patrimonial">Patrimonial</SelectItem>
                  <SelectItem value="Frota">Frota</SelectItem>
                  <SelectItem value="RC">RC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerateScript} variant="secondary">
              <Sparkles className="w-4 h-4 mr-2" /> Gerar
            </Button>
          </div>
          {generatedScript && (
            <div className="space-y-2">
              <div className="text-sm bg-background p-3 rounded border whitespace-pre-wrap">
                {generatedScript}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedScript)
                    toast({ title: 'Copiado' })
                  }}
                >
                  <Copy className="w-4 h-4 mr-2" /> Copiar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Último Contato e Observações
        </h3>

        <div className="bg-primary/5 p-4 rounded-lg space-y-3">
          <div className="space-y-2">
            <Label>Novo Status</Label>
            <Select
              value={interaction.newStatus}
              onValueChange={(val) => setInteraction({ ...interaction, newStatus: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prospecção">Prospecção</SelectItem>
                <SelectItem value="Cotação">Cotação</SelectItem>
                <SelectItem value="Fechamento">Fechamento</SelectItem>
                <SelectItem value="Perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              placeholder="Detalhes da ligação..."
              value={interaction.note}
              onChange={(e) => setInteraction({ ...interaction, note: e.target.value })}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddInteraction} disabled={!interaction.note}>
              Salvar Interação
            </Button>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          {lead.history
            ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((h) => {
              const dateObj = new Date(h.date)
              const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
              return (
                <div key={h.id} className="text-sm border p-3 rounded-md bg-card">
                  <div className="flex justify-end mb-2">
                    <Badge variant="outline" className="text-[10px]">
                      {h.newStatus}
                    </Badge>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap">{h.note}</p>
                </div>
              )
            })}
          {(!lead.history || lead.history.length === 0) && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum histórico registrado.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
