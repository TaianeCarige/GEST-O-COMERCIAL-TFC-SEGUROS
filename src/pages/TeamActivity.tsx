import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { Activity, User } from 'lucide-react'

export default function TeamActivity() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    pb.collection('mapeamentos')
      .getFullList({
        sort: '-updated',
        expand: 'manager_id,last_contact_by',
        limit: 50,
      })
      .then(setActivities)
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Atividade da Equipe</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do pipeline de negociações em andamento no time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Últimas Movimentações
          </CardTitle>
          <CardDescription>
            Mostrando os leads e clientes trabalhados recentemente (dados sensíveis de clientes
            ocultos entre consultores).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((act) => {
              const consultantName =
                act.expand?.manager_id?.name || act.expand?.manager_id?.email || 'Consultor'
              const isOwner = act.manager_id === user?.id
              const isManager = user?.role === 'manager'
              const canSeeDetails = isOwner || isManager

              return (
                <div
                  key={act.id}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-card transition-colors hover:bg-muted/50"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-semibold">{consultantName}</span> atualizou uma
                      negociação.
                    </p>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="font-medium text-foreground">
                        {canSeeDetails ? act.name : act.name}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">Status:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary">
                        {act.status || 'Sem status'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Atualizado em {new Date(act.updated).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )
            })}
            {activities.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Nenhuma atividade recente.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
