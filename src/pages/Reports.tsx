import React from 'react'
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
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, AlertCircle, Award } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function Reports() {
  const { consultants, leads, currentUser } = useAppStore()

  const me = consultants.find((c) => c.id === currentUser)
  const isManager = me?.role === 'Gestora'

  if (!isManager) {
    return <Navigate to="/" replace />
  }

  // Calculate stats for reports
  const stats = consultants
    .map((c) => {
      const consultantLeads = leads.filter((l) => l.consultantId === c.id)
      const closedLeads = consultantLeads.filter((l) => l.status === 'Fechado')

      const conversionRate =
        consultantLeads.length > 0
          ? Math.round((closedLeads.length / consultantLeads.length) * 100)
          : 0

      // Avanço de Funil (Leads that are in negotiation or scheduled)
      const advancedLeads = consultantLeads.filter(
        (l) => l.status === 'Em Negociação' || l.status === 'Agendado' || l.status === 'Fechado',
      ).length

      const funnelAdvancementRate =
        consultantLeads.length > 0 ? Math.round((advancedLeads / consultantLeads.length) * 100) : 0

      // Determine bottlenecks (Gargalos)
      const bottlenecks = []
      if (c.callsRealized < c.callsGoal * 0.8) {
        bottlenecks.push('Baixo volume de prospecção')
      }
      if (c.visitsRealized < c.visitsGoal * 0.8) {
        bottlenecks.push('Falta de contato presencial')
      }
      if (conversionRate < 20 && consultantLeads.length > 0) {
        bottlenecks.push('Baixa taxa de conversão (Cotação -> Fechamento)')
      }
      if (bottlenecks.length === 0) {
        bottlenecks.push('Desempenho Adequado')
      }

      return {
        ...c,
        totalContacts: consultantLeads.length,
        closedDeals: closedLeads.length,
        conversionRate,
        funnelAdvancementRate,
        bottlenecks,
      }
    })
    .sort((a, b) => b.salesRealized - a.salesRealized)

  // Top branches
  const branchMap: Record<string, number> = {}
  leads
    .filter((l) => l.status === 'Fechado')
    .forEach((l) => {
      branchMap[l.branch] = (branchMap[l.branch] || 0) + l.value
    })

  const sortedBranches = Object.entries(branchMap).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatório de Performance Semanal</h1>
        <p className="text-muted-foreground mt-1">
          Dados consolidados de conversão, rankeamento e identificação de gargalos.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Desempenho da Equipe e Gargalos
            </CardTitle>
            <CardDescription>Análise aprofundada por consultor</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consultor</TableHead>
                  <TableHead className="text-center">Contatados</TableHead>
                  <TableHead className="text-center">Avanço de Funil</TableHead>
                  <TableHead className="text-center">Taxa de Conversão</TableHead>
                  <TableHead>Diagnóstico (Gargalos)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-center">{c.totalContacts}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{c.funnelAdvancementRate}%</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          c.conversionRate >= 30
                            ? 'default'
                            : c.conversionRate >= 20
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {c.conversionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 items-start">
                        {c.bottlenecks.map((b, i) => (
                          <span
                            key={i}
                            className={`text-xs flex items-center gap-1 ${b === 'Desempenho Adequado' ? 'text-success' : 'text-destructive'}`}
                          >
                            {b !== 'Desempenho Adequado' && <AlertCircle className="h-3 w-3" />}
                            {b}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              Ranking por Ramos (R$)
            </CardTitle>
            <CardDescription>Volume de vendas fechadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedBranches.length > 0 ? (
                sortedBranches.map(([branch, value], index) => (
                  <div
                    key={branch}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-muted-foreground w-4">{index + 1}º</span>
                      <span className="font-medium">{branch}</span>
                    </div>
                    <span className="font-semibold text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(value)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Dados insuficientes no momento.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
