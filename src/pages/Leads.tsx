import React, { useState } from 'react'
import useAppStore, { Branch, Status } from '@/stores/useAppStore'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { MoreHorizontal, Filter, Megaphone, HelpCircle, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Leads() {
  const { leads, updateLeadStatus, updateLeadConsultant, getConsultant, consultants, currentUser } =
    useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const isManager = me?.role === 'Gestora'
  const visibleLeads = isManager ? leads : leads.filter((l) => l.consultantId === currentUser)

  const [branchFilter, setBranchFilter] = useState<Branch | 'Todos'>('Todos')
  const [statusFilter, setStatusFilter] = useState<Status | 'Todos'>('Todos')
  const [retentionFilter, setRetentionFilter] = useState(false)
  const [objectionDialog, setObjectionDialog] = useState<{ open: boolean; leadId: string | null }>({
    open: false,
    leadId: null,
  })

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const filteredLeads = visibleLeads.filter((l) => {
    if (branchFilter !== 'Todos' && l.branch !== branchFilter) return false
    if (statusFilter !== 'Todos' && l.status !== statusFilter) return false
    if (retentionFilter && new Date(l.lastContact) >= ninetyDaysAgo) return false
    return true
  })

  const handleGenerateReactivation = () => {
    toast({
      title: 'Reativação Iniciada',
      description:
        'O Analista de Retenção já pode gerar as mensagens de reativação para estes casos.',
    })
  }

  const handleObjection = (leadId: string) => {
    setObjectionDialog({ open: true, leadId })
  }

  const confirmObjection = () => {
    if (objectionDialog.leadId) {
      updateLeadStatus(objectionDialog.leadId, 'Objeção')
      toast({
        title: 'Objeção Registrada',
        description: 'Status atualizado com sucesso.',
      })
    }
    setObjectionDialog({ open: false, leadId: null })
  }

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Fechado':
        return 'bg-success text-success-foreground hover:bg-success/80'
      case 'Visita Pendente':
        return 'bg-accent text-accent-foreground hover:bg-accent/80'
      case 'Perdido':
        return 'bg-muted text-muted-foreground hover:bg-muted/80'
      case 'Objeção':
        return 'bg-destructive text-destructive-foreground hover:bg-destructive/80'
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads & Clientes</h1>
          <p className="text-muted-foreground mt-1">
            {isManager ? 'Carteira consolidada da corretora' : 'Sua carteira de clientes'}
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
              <SelectItem value="Vida">Vida</SelectItem>
              <SelectItem value="Odonto">Odonto</SelectItem>
              <SelectItem value="RC">RC</SelectItem>
              <SelectItem value="Patrimonial">Patrimonial</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os Status</SelectItem>
              <SelectItem value="Visita Pendente">Visita Pendente</SelectItem>
              <SelectItem value="Agendado">Agendado</SelectItem>
              <SelectItem value="Em Negociação">Em Negociação</SelectItem>
              <SelectItem value="Fechado">Fechado</SelectItem>
              <SelectItem value="Perdido">Perdido</SelectItem>
              <SelectItem value="Objeção">Objeção</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={retentionFilter ? 'destructive' : 'outline'}
            onClick={() => setRetentionFilter(!retentionFilter)}
            className="transition-all"
          >
            Filtro: +90 Dias
          </Button>

          {retentionFilter && filteredLeads.length > 0 && isManager && (
            <Button
              onClick={handleGenerateReactivation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 animate-fade-in"
            >
              <Megaphone className="w-4 h-4 mr-2" /> Gerar Reativação
            </Button>
          )}
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
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.branch}</TableCell>
                      <TableCell>
                        <Badge className={`border-none ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(lead.lastContact).toLocaleDateString('pt-BR')}
                        {new Date(lead.lastContact) < ninetyDaysAgo && (
                          <span className="ml-2 text-xs text-destructive font-bold inline-flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Reativação Necessária
                          </span>
                        )}
                      </TableCell>
                      {isManager && <TableCell>{getConsultant(lead.consultantId)?.name}</TableCell>}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Agendado')}>
                              Marcar Agendado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, 'Fechado')}>
                              Marcar Fechado
                            </DropdownMenuItem>

                            {isManager && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <UserPlus className="w-4 h-4 mr-2" /> Atribuir Lead
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    {consultants.map((c) => (
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
                              </>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleObjection(lead.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              Registrar Objeção
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase">
                              Integração Experts
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link to={`/b2b-expert?sector=${encodeURIComponent(lead.branch)}`}>
                                Briefing Técnico
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/vip-mentor?lead=${encodeURIComponent(lead.name)}`}>
                                Refinamento VIP
                              </Link>
                            </DropdownMenuItem>
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

      <Dialog
        open={objectionDialog.open}
        onOpenChange={(open) => !open && setObjectionDialog({ open: false, leadId: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Objeção</DialogTitle>
            <DialogDescription>Deseja marcar este cliente com status de objeção?</DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-4 rounded-lg flex gap-3 items-start my-4">
            <HelpCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <p className="text-sm">
              <span className="font-semibold block mb-1">Dica do Mentor de Vendas:</span>
              Consulte o Mentor de Vendas para estratégias de contorno. Entender o real motivo da
              recusa é o primeiro passo para uma futura reativação bem-sucedida.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setObjectionDialog({ open: false, leadId: null })}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmObjection}>
              Confirmar Objeção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}
