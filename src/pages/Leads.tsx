import React, { useState } from 'react'
import useAppStore, { Branch, Status, PolicyType } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import { useToast } from '@/hooks/use-toast'
import {
  MoreHorizontal,
  Filter,
  Megaphone,
  UserPlus,
  UserCircle,
  AlertTriangle,
  Clock,
  CalendarDays,
  History,
  Save,
  Plus,
} from 'lucide-react'

export default function Leads() {
  const { leads, updateLeadConsultant, getConsultant, consultants, currentUser } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const isAgency = me?.role === 'Agência'
  const isManager = me?.role === 'Gestora' || isAgency

  const visibleLeads = isAgency
    ? leads
    : isManager
      ? leads.filter(
          (l) =>
            consultants.find((c) => c.id === l.consultantId)?.managerId === me.id ||
            l.consultantId === me.id,
        )
      : leads.filter((l) => l.consultantId === currentUser)

  const [branchFilter, setBranchFilter] = useState<Branch | 'Todos'>('Todos')
  const [statusFilter, setStatusFilter] = useState<Status | 'Todos'>('Todos')
  const [retentionFilter, setRetentionFilter] = useState(false)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const now = new Date().getTime()

  const filteredLeads = visibleLeads.filter((l) => {
    if (branchFilter !== 'Todos' && l.branch !== branchFilter) return false
    if (statusFilter !== 'Todos' && l.status !== statusFilter) return false
    if (retentionFilter && new Date(l.lastContact) >= ninetyDaysAgo) return false
    return true
  })

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
      const diff = new Date(p.expirationDate).getTime() - now
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    })

  const isLeadInactive = (lastContact: string) => {
    return now - new Date(lastContact).getTime() >= 90 * 24 * 60 * 60 * 1000
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Clientes</h1>
          <p className="text-muted-foreground mt-1">
            {isAgency
              ? 'Visão consolidada da agência'
              : isManager
                ? 'Carteira da sua equipe'
                : 'Sua carteira de clientes'}
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
          <Button
            variant={retentionFilter ? 'destructive' : 'outline'}
            onClick={() => setRetentionFilter(!retentionFilter)}
            className="transition-all"
          >
            Alerta: +90 Dias
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Lista de Contatos</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Cliente</TableHead>
                  <TableHead>Ramo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Contato</TableHead>
                  {isManager && <TableHead>Consultor</TableHead>}
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {lead.name}
                          {isPolicyExpiring(lead.policies) && (
                            <AlertTriangle
                              className="w-4 h-4 text-amber-500"
                              title="Apólice expira em <30 dias"
                            />
                          )}
                          {isLeadInactive(lead.lastContact) && (
                            <Clock
                              className="w-4 h-4 text-destructive"
                              title="Sem contato há >90 dias"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{lead.branch}</TableCell>
                      <TableCell>
                        <Badge className={`border-none ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
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
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedLeadId(lead.id)}>
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
                                      (c) => isAgency || c.managerId === me?.id || c.id === me?.id,
                                    )
                                    .map((c) => (
                                      <DropdownMenuItem
                                        key={c.id}
                                        onClick={() => updateLeadConsultant(lead.id, c.id)}
                                        className={lead.consultantId === c.id ? 'bg-muted' : ''}
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={isManager ? 6 : 5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum cliente encontrado com os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={!!selectedLeadId} onOpenChange={(open) => !open && setSelectedLeadId(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto">
          {selectedLeadId && <LeadProfileSheet leadId={selectedLeadId} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function LeadProfileSheet({ leadId }: { leadId: string }) {
  const { leads, updateLeadDetails, addPolicy, addInteraction } = useAppStore()
  const { toast } = useToast()

  const lead = leads.find((l) => l.id === leadId)

  const [details, setDetails] = useState({
    cnpj: lead?.cnpj || '',
    industry: lead?.industry || '',
    contactName: lead?.contactName || '',
    contactPhone: lead?.contactPhone || '',
  })

  const [newPolicy, setNewPolicy] = useState<{ type: PolicyType; expirationDate: string }>({
    type: 'Outros',
    expirationDate: '',
  })

  const [interaction, setInteraction] = useState({
    note: '',
    newStatus: lead?.status || 'Prospecção',
  })

  if (!lead) return null

  const handleSaveDetails = () => {
    updateLeadDetails(leadId, details)
    toast({ title: 'Perfil atualizado', description: 'Dados cadastrais salvos com sucesso.' })
  }

  const handleAddPolicy = () => {
    if (!newPolicy.expirationDate) return
    addPolicy(leadId, newPolicy)
    setNewPolicy({ type: 'Outros', expirationDate: '' })
    toast({ title: 'Apólice adicionada', description: 'Vencimento registrado.' })
  }

  const handleAddInteraction = () => {
    if (!interaction.note) return
    addInteraction(leadId, interaction.note, interaction.newStatus as Status)
    setInteraction((prev) => ({ ...prev, note: '' }))
    toast({ title: 'Interação salva', description: 'Histórico e status atualizados.' })
  }

  return (
    <div className="space-y-8 py-4">
      <SheetHeader>
        <SheetTitle className="text-2xl flex items-center gap-2">
          {lead.name}
          <Badge variant="outline">{lead.branch}</Badge>
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
              placeholder="Ex: Logística, Tecnologia..."
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
          <CalendarDays className="w-5 h-5 text-primary" /> Apólices & Vencimentos
        </h3>
        {lead.policies && lead.policies.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo de Seguro</TableHead>
                  <TableHead>Vencimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lead.policies.map((p) => {
                  const isExpiring =
                    new Date(p.expirationDate).getTime() - new Date().getTime() <=
                    30 * 24 * 60 * 60 * 1000
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.type}</TableCell>
                      <TableCell className={isExpiring ? 'text-amber-500 font-bold' : ''}>
                        {new Date(p.expirationDate).toLocaleDateString('pt-BR')}
                        {isExpiring && <AlertTriangle className="w-4 h-4 inline ml-2" />}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <div className="flex gap-2 items-end bg-muted/30 p-4 rounded-lg">
          <div className="space-y-2 flex-1">
            <Label>Nova Apólice (Ramo)</Label>
            <Select
              value={newPolicy.type}
              onValueChange={(val: PolicyType) => setNewPolicy({ ...newPolicy, type: val })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  'Automóvel',
                  'Frota',
                  'Saúde',
                  'Dental',
                  'Vida Funcionários',
                  'Vida Individual',
                  'Responsabilidade Civil',
                  'Seguros Patrimoniais',
                  'Outros',
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 flex-1">
            <Label>Data de Vencimento</Label>
            <Input
              type="date"
              value={newPolicy.expirationDate}
              onChange={(e) => setNewPolicy({ ...newPolicy, expirationDate: e.target.value })}
            />
          </div>
          <Button onClick={handleAddPolicy} variant="secondary">
            <Plus className="w-4 h-4 mr-2" /> Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History className="w-5 h-5 text-primary" /> Histórico de Contatos
        </h3>

        <div className="bg-primary/5 p-4 rounded-lg space-y-3">
          <div className="space-y-2">
            <Label>Nova Interação (Pipeline)</Label>
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
              placeholder="Detalhes da ligação, e-mail enviado, etc..."
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
          {lead.history?.map((h) => (
            <div key={h.id} className="text-sm border p-3 rounded-md bg-card">
              <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{h.userName}</span>
                <span>{new Date(h.date).toLocaleString('pt-BR')}</span>
              </div>
              <p className="mb-2">{h.note}</p>
              <Badge variant="secondary" className="text-[10px]">
                Alterado para: {h.newStatus}
              </Badge>
            </div>
          ))}
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
