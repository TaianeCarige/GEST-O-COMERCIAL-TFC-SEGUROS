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
import { TrendingUp, Award, Building2 } from 'lucide-react'
import { Navigate } from 'react-router-dom'

export default function Reports() {
  const { consultants, leads, currentUser } = useAppStore()

  const me = consultants.find((c) => c.id === currentUser)
  const isAgency = me?.role === 'Agência'
  const isManager = me?.role === 'Gestora' || isAgency

  if (!isManager) {
    return <Navigate to="/" replace />
  }

  // Calculate leads per entity (Group by Manager for Agency, or Consultant for Manager)
  const teamMembers = isAgency
    ? consultants.filter((c) => c.role === 'Gestora' || c.role === 'Agência')
    : consultants.filter((c) => c.managerId === me?.id || c.id === me?.id)

  const stats = teamMembers
    .map((member) => {
      // Collect all leads under this entity
      const memberLeads = isAgency
        ? leads.filter(
            (l) =>
              consultants.find((c) => c.id === l.consultantId)?.managerId === member.id ||
              l.consultantId === member.id,
          )
        : leads.filter((l) => l.consultantId === member.id)

      // Funnel advancement: Prospecção -> Cotação/Fechamento
      const advancedLeads = memberLeads.filter((l) =>
        ['Cotação', 'Fechamento', 'Fechado'].includes(l.status),
      )
      const conversionRate =
        memberLeads.length > 0 ? Math.round((advancedLeads.length / memberLeads.length) * 100) : 0

      return {
        ...member,
        totalContacts: memberLeads.length,
        conversionRate,
        proposalsVol: advancedLeads.reduce((acc, l) => acc + l.value, 0),
      }
    })
    .sort((a, b) => b.proposalsVol - a.proposalsVol)

  // Volume of proposals by branch
  const visibleTeamIds = isAgency
    ? consultants.map((c) => c.id)
    : consultants.filter((c) => c.managerId === me?.id || c.id === me?.id).map((c) => c.id)

  const visibleLeads = leads.filter((l) => visibleTeamIds.includes(l.consultantId))
  const proposalLeads = visibleLeads.filter((l) =>
    ['Cotação', 'Fechamento', 'Fechado'].includes(l.status),
  )

  const branchMap: Record<string, number> = {}
  proposalLeads.forEach((l) => {
    branchMap[l.branch] = (branchMap[l.branch] || 0) + l.value
  })

  const sortedBranches = Object.entries(branchMap).sort((a, b) => b[1] - a[1])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relatórios Gerenciais B2B</h1>
        <p className="text-muted-foreground mt-1">
          {isAgency
            ? 'Visão consolidada da operação (Gestores e Agência)'
            : 'Visão consolidada da sua equipe (Consultores)'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Taxa de Conversão & Volume de Leads
            </CardTitle>
            <CardDescription>
              KPIs de avanço no funil (Prospecção → Cotação/Fechamento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{isAgency ? 'Gestor / Unidade' : 'Consultor'}</TableHead>
                  <TableHead className="text-center">Total Tratados</TableHead>
                  <TableHead className="text-center">Tx. de Conversão</TableHead>
                  <TableHead className="text-right">Volume (Cotação+)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {isAgency && <Building2 className="w-4 h-4 text-muted-foreground" />}
                        {c.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{c.totalContacts}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          c.conversionRate >= 30
                            ? 'default'
                            : c.conversionRate >= 15
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {c.conversionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(c.proposalsVol)}
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
              Propostas por Ramo
            </CardTitle>
            <CardDescription>Volume financeiro em Cotação/Fechamento</CardDescription>
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
                      <span className="font-medium text-sm">{branch}</span>
                    </div>
                    <span className="font-semibold text-primary text-sm">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0,
                      }).format(value)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhuma proposta ativa.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
