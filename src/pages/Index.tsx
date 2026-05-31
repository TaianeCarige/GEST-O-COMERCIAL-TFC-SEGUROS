import React from 'react'
import useAppStore from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, AlertTriangle, Clock, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Index() {
  const { leads, consultants, currentUser } = useAppStore()

  const me = consultants.find((c) => c.id === currentUser)
  const isAgency = me?.role === 'Agência'
  const isManager = me?.role === 'Gestora' || isAgency

  const visibleLeads = isAgency
    ? leads
    : isManager
      ? leads.filter(
          (l) =>
            consultants.find((c) => c.id === l.consultantId)?.managerId === me?.id ||
            l.consultantId === me?.id,
        )
      : leads.filter((l) => l.consultantId === currentUser)

  const totalSales = visibleLeads
    .filter((l) => ['Fechado', 'Fechamento'].includes(l.status))
    .reduce((sum, l) => sum + l.value, 0)
  const inPipelineCount = visibleLeads.filter((l) =>
    ['Cotação', 'Fechamento'].includes(l.status),
  ).length

  const now = new Date().getTime()

  const expiringPoliciesLeads = visibleLeads.filter((l) =>
    l.policies?.some((p) => {
      const diff = new Date(p.expirationDate).getTime() - now
      return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
    }),
  )

  const retentionAlerts = visibleLeads.filter(
    (l) => now - new Date(l.lastContact).getTime() >= 90 * 24 * 60 * 60 * 1000,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Comercial</h1>
          <p className="text-muted-foreground mt-1">
            {isAgency
              ? 'Visão global da agência'
              : isManager
                ? 'Visão da equipe'
                : 'Sua performance pessoal'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume em Fechamento</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 0,
              }).format(totalSales)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Negócios fechados ou na reta final</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Ativo</CardTitle>
            <Clock className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inPipelineCount} leads</div>
            <p className="text-xs text-muted-foreground mt-1">Em fase de Cotação/Fechamento</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-500">
              Renovações Próximas
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {expiringPoliciesLeads.length} apólices
            </div>
            <p className="text-xs text-muted-foreground mt-1">Vencimento em menos de 30 dias</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">
              Contatos Inativos
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {retentionAlerts.length} clientes
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mais de 90 dias sem contato</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Alerta de Renovações</CardTitle>
              <CardDescription>Apólices expirando em até 30 dias</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {expiringPoliciesLeads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.branch}</p>
                  </div>
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    Ação Necessária
                  </Badge>
                </div>
              ))}
              {expiringPoliciesLeads.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma apólice expirando próximo.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>Inatividade (+90 dias)</CardTitle>
              <CardDescription>Oportunidades de reativação</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/leads">
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {retentionAlerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-sm">{alert.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Últ. Contato: {new Date(alert.lastContact).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge variant="destructive" className="text-[10px]">
                    Perigo de Base
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
    </div>
  )
}
