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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Copy, CalendarClock, PhoneOutgoing } from 'lucide-react'

export default function Planner() {
  const { leads, getConsultant, consultants, currentUser } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const isManager = me?.role === 'Gestora'
  const visibleLeads = isManager ? leads : leads.filter((l) => l.consultantId === currentUser)

  // Definition for Planner: Proximity to 90 days (e.g. > 75 days) or Pending follow-ups
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - 75)

  const plannerLeads = visibleLeads
    .filter(
      (l) =>
        new Date(l.lastContact) < thresholdDate && l.status !== 'Fechado' && l.status !== 'Perdido',
    )
    .sort((a, b) => new Date(a.lastContact).getTime() - new Date(b.lastContact).getTime())

  const copyToClipboard = () => {
    const text = plannerLeads
      .map((l) => {
        const days = Math.floor(
          (new Date().getTime() - new Date(l.lastContact).getTime()) / (1000 * 3600 * 24),
        )
        return `${l.name} | Ramo: ${l.branch} | Resp: ${getConsultant(l.consultantId)?.name} | Dias s/ contato: ${days}`
      })
      .join('\n')

    navigator.clipboard.writeText(text)
    toast({
      title: 'Lista copiada!',
      description: 'A lista de contatos semanais foi copiada para a área de transferência.',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planejador Semanal</h1>
          <p className="text-muted-foreground mt-1">
            Clientes para contactar esta semana (Proximidade 90 dias)
          </p>
        </div>
        <Button onClick={copyToClipboard} variant="outline" className="shrink-0 bg-white">
          <Copy className="h-4 w-4 mr-2" />
          Copiar Lista
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fila de Contatos Prioritários</CardTitle>
              <CardDescription>Ordenados por urgência e tempo sem contato</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Cliente</TableHead>
                    {isManager && <TableHead>Consultor</TableHead>}
                    <TableHead className="text-right">Dias Inativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plannerLeads.length > 0 ? (
                    plannerLeads.map((lead, index) => {
                      const days = Math.floor(
                        (new Date().getTime() - new Date(lead.lastContact).getTime()) /
                          (1000 * 3600 * 24),
                      )
                      const isCritical = days >= 90

                      return (
                        <TableRow
                          key={lead.id}
                          className={isCritical ? 'bg-destructive/5 hover:bg-destructive/10' : ''}
                        >
                          <TableCell>
                            <Badge variant={isCritical ? 'destructive' : 'secondary'}>
                              {isCritical ? 'Alta' : 'Média'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-medium block">{lead.name}</span>
                            <span className="text-xs text-muted-foreground">{lead.branch}</span>
                          </TableCell>
                          {isManager && (
                            <TableCell>{getConsultant(lead.consultantId)?.name}</TableCell>
                          )}
                          <TableCell className="text-right font-medium">
                            <span className={isCritical ? 'text-destructive' : ''}>{days}</span>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={isManager ? 4 : 3}
                        className="text-center h-24 text-muted-foreground"
                      >
                        Nenhum cliente na fila de alerta. Ótimo trabalho de retenção!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Meta Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2">{plannerLeads.length}</div>
              <p className="text-sm opacity-80">
                Contatos de reativação pendentes para esta semana.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instruções de Abordagem</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <PhoneOutgoing className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="font-medium text-sm">Foco em Relacionamento</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Não tente vender imediatamente. Pergunte sobre as mudanças na empresa desde o
                    último contato.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <PhoneOutgoing className="h-5 w-5 text-accent shrink-0" />
                <div>
                  <p className="font-medium text-sm">Renovação de Apólices</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Verifique se o cliente possui apólices com concorrentes vencendo no próximo
                    trimestre.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
