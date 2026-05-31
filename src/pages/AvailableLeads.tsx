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
import { Inbox, CheckCircle2 } from 'lucide-react'

export default function AvailableLeads() {
  const { availableLeads, claimLead, consultants, currentUser } = useAppStore()
  const { toast } = useToast()

  const handleClaim = (id: string, name: string) => {
    claimLead(id)
    toast({
      title: 'Lead Assumido com Sucesso',
      description: `${name} foi adicionado à sua carteira. Inicie a prospecção!`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Inbox className="h-8 w-8 text-primary" />
          Busca Proativa (Leads Disponíveis)
        </h1>
        <p className="text-muted-foreground mt-1">
          Navegue pelas oportunidades corporativas mapeadas e assuma a gestão comercial.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pool de Oportunidades B2B</CardTitle>
          <CardDescription>Contas não atribuídas na base de dados da corretora.</CardDescription>
        </CardHeader>
        <CardContent>
          {availableLeads.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Ramo Alvo</TableHead>
                  <TableHead>Porte (Faturamento)</TableHead>
                  <TableHead>Decisor</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{lead.branch}</Badge>
                    </TableCell>
                    <TableCell>{lead.revenue}</TableCell>
                    <TableCell>
                      {lead.contact}{' '}
                      <span className="text-xs text-muted-foreground">({lead.role})</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleClaim(lead.id, lead.name)}>
                        Assumir Conta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 mb-3 text-success/50" />
              <p className="text-lg font-medium">Nenhum lead disponível no momento.</p>
              <p className="text-sm">O pool de oportunidades foi totalmente distribuído.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
