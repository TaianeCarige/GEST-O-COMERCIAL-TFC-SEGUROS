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
import { History, AlertTriangle, MessageSquarePlus } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

export default function Reactivation() {
  const { leads, consultants, currentUser, getConsultant } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const isManager = me?.role === 'Gestora'
  const visibleLeads = isManager ? leads : leads.filter((l) => l.consultantId === currentUser)

  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const retentionAlerts = visibleLeads.filter((l) => new Date(l.lastContact) < ninetyDaysAgo)

  const handleCopyMessage = (name: string, branch: string) => {
    const text = `Olá, ${name}. Notei que faz um tempo desde nossa última revisão da apólice de ${branch}. Com as recentes mudanças de mercado, é fundamental revisarmos sua estrutura de proteção para garantir que não haja defasagem nas coberturas. Podemos agendar 15 minutos na próxima semana?`
    navigator.clipboard.writeText(text)
    toast({
      title: 'Mensagem de Reativação Copiada',
      description: 'Envie para o cliente via WhatsApp ou Email.',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <History className="h-8 w-8 text-destructive" />
          Alerta de Reativação (Inatividade {'>'} 90 dias)
        </h1>
        <p className="text-muted-foreground mt-1">
          Clientes e prospects sem contato há mais de 3 meses. Alto risco de perda de base ou
          esfriamento comercial.
        </p>
      </div>

      <Card className="border-destructive/30 border-2">
        <CardHeader className="bg-destructive/5 pb-4">
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Radar de Oportunidades Frias
          </CardTitle>
          <CardDescription>
            Tome ação imediata. Estes contatos estão propensos ao assédio da concorrência.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {retentionAlerts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ramo</TableHead>
                  <TableHead>Dias Inativo</TableHead>
                  {isManager && <TableHead>Consultor Responsável</TableHead>}
                  <TableHead className="text-right">Plano de Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {retentionAlerts.map((lead) => {
                  const daysInactive = Math.floor(
                    (new Date().getTime() - new Date(lead.lastContact).getTime()) /
                      (1000 * 3600 * 24),
                  )
                  return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{lead.branch}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-start gap-1">
                          <span className="text-destructive font-bold">{daysInactive} dias</span>
                          <Badge variant="destructive" className="text-[10px] uppercase">
                            Reativação Imediata
                          </Badge>
                        </div>
                      </TableCell>
                      {isManager && <TableCell>{getConsultant(lead.consultantId)?.name}</TableCell>}
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopyMessage(lead.name, lead.branch)}
                        >
                          <MessageSquarePlus className="h-4 w-4 mr-1" /> Mensagem Rápida
                        </Button>
                        <Button size="sm" asChild>
                          <Link to="/planner">Marcar Tarefa</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <History className="h-12 w-12 mb-3 text-muted" />
              <p className="text-lg font-medium">Nenhum cliente crítico no radar.</p>
              <p className="text-sm">A carteira está com o follow-up em dia!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
