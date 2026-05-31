import React, { useState } from 'react'
import useAppStore from '@/stores/useAppStore'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts'
import { DollarSign, Clock, AlertTriangle, Briefcase, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { leads, consultants, currentUser, getConsultant } = useAppStore()
  const [briefingOpen, setBriefingOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<string>('')

  const me = getConsultant(currentUser)
  const isManager = me?.role === 'Gestora'

  const visibleLeads = isManager ? leads : leads.filter((l) => l.consultantId === currentUser)
  const visibleConsultants = isManager
    ? consultants
    : consultants.filter((c) => c.id === currentUser)

  const totalSales = isManager
    ? visibleLeads.filter((l) => l.status === 'Fechado').reduce((sum, l) => sum + l.value, 0)
    : me?.salesRealized || 0

  const pendingVisitsCount = visibleLeads.filter(
    (l) => l.status === 'Visita Pendente' || l.status === 'Agendado',
  ).length

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  const retentionAlerts = visibleLeads.filter((l) => new Date(l.lastContact) < ninetyDaysAgo)

  const todayStr = new Date().toISOString().split('T')[0]
  const todayVisits = visibleLeads.filter(
    (l) => l.scheduledDate && l.scheduledDate.startsWith(todayStr),
  )

  const handleBriefing = (leadName: string) => {
    setSelectedLead(leadName)
    setBriefingOpen(true)
  }

  const chartData = visibleConsultants.map((c) => ({
    name: c.name,
    'Ligações Realizadas': c.callsRealized,
    'Meta Ligações': c.callsGoal,
    'Visitas Realizadas': c.visitsRealized,
    'Meta Visitas': c.visitsGoal,
  }))

  const chartConfig = {
    'Ligações Realizadas': { color: 'hsl(var(--chart-1))' },
    'Meta Ligações': { color: 'hsl(var(--muted-foreground))' },
    'Visitas Realizadas': { color: 'hsl(var(--chart-2))' },
    'Meta Visitas': { color: 'hsl(var(--muted-foreground))' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Comercial</h1>
          <p className="text-muted-foreground mt-1">
            Visualização de {isManager ? 'toda a equipe' : 'sua carteira pessoal'}
          </p>
        </div>
      </div>

      {!isManager && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta de Ligações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {me?.callsRealized} / {me?.callsGoal}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>
                    {Math.min(
                      Math.round(((me?.callsRealized || 0) / (me?.callsGoal || 1)) * 100),
                      100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: `${Math.min(Math.round(((me?.callsRealized || 0) / (me?.callsGoal || 1)) * 100), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta de Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {me?.visitsRealized} / {me?.visitsGoal}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progresso</span>
                  <span>
                    {Math.min(
                      Math.round(((me?.visitsRealized || 0) / (me?.visitsGoal || 1)) * 100),
                      100,
                    )}
                    %
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full transition-all"
                    style={{
                      width: `${Math.min(Math.round(((me?.visitsRealized || 0) / (me?.visitsGoal || 1)) * 100), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meta de Vendas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                }).format(totalSales)}
              </div>
              <div className="mt-3 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Meta:{' '}
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      maximumFractionDigits: 0,
                    }).format(me?.salesGoal || 0)}
                  </span>
                  <span>
                    {Math.min(Math.round((totalSales / (me?.salesGoal || 1)) * 100), 100)}%
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-success h-full transition-all"
                    style={{
                      width: `${Math.min(Math.round((totalSales / (me?.salesGoal || 1)) * 100), 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {isManager && (
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso de Vendas (Mês)</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                  totalSales,
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        )}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas Pendentes / Agendadas</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVisitsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Foco na conversão</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Alertas de Retenção (90+ dias)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{retentionAlerts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Risco de perda de base</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Clientes para Visitar Hoje</CardTitle>
            <CardDescription>Prioridade máxima para o time comercial.</CardDescription>
          </CardHeader>
          <CardContent>
            {todayVisits.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    {isManager && <TableHead>Consultor</TableHead>}
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayVisits.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      {isManager && <TableCell>{getConsultant(lead.consultantId)?.name}</TableCell>}
                      <TableCell>
                        <Badge variant={lead.status === 'Agendado' ? 'default' : 'secondary'}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleBriefing(lead.name)}>
                          Preparar Briefing
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
                <Briefcase className="h-10 w-10 mb-3 opacity-20" />
                <p>Não há visitas agendadas para hoje nesta visão.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Alerta de Retenção</CardTitle>
              <CardDescription className="text-destructive font-medium">
                Reativação Necessária (+90 dias)
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/reactivation">
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {retentionAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{alert.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {alert.branch}{' '}
                      {isManager && `• Consultor: ${getConsultant(alert.consultantId)?.name}`}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px]">
                    {Math.floor(
                      (new Date().getTime() - new Date(alert.lastContact).getTime()) /
                        (1000 * 3600 * 24),
                    )}{' '}
                    dias
                  </Badge>
                </div>
              ))}
              {retentionAlerts.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum alerta crítico no momento.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho de Atividades vs Metas</CardTitle>
          <CardDescription>Acompanhamento de ligações e visitas</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend verticalAlign="top" height={36} />
              <Bar
                dataKey="Ligações Realizadas"
                fill="var(--color-Ligações Realizadas)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Meta Ligações"
                fill="var(--color-Meta Ligações)"
                radius={[4, 4, 0, 0]}
                opacity={0.3}
              />
              <Bar
                dataKey="Visitas Realizadas"
                fill="var(--color-Visitas Realizadas)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="Meta Visitas"
                fill="var(--color-Meta Visitas)"
                radius={[4, 4, 0, 0]}
                opacity={0.3}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Dialog open={briefingOpen} onOpenChange={setBriefingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inteligência B2B</DialogTitle>
            <DialogDescription>Briefing para {selectedLead}</DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-accent" />
            </div>
            <p className="text-lg font-medium">
              Prepare-se com o Expert de Inteligência B2B para esta reunião.
            </p>
            <p className="text-sm text-muted-foreground">
              O sistema analisou o histórico do cliente e sugere focar em oportunidades de
              cross-selling para o ramo de Vida e Saúde.
            </p>
          </div>
          <div className="flex justify-end">
            <Button asChild>
              <Link to={`/b2b-expert?sector=${encodeURIComponent('Saúde')}`}>Acessar Expert</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
