import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { Progress } from '@/components/ui/progress'

export default function Goals() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [users, setUsers] = useState<any[]>([])
  const [mapeamentos, setMapeamentos] = useState<any[]>([])
  const [editingGoals, setEditingGoals] = useState<
    Record<string, { callsGoal: number; visitsGoal: number; salesGoal: number }>
  >({})

  const isManager = user?.role === 'manager'

  useEffect(() => {
    pb.collection('users')
      .getFullList({ sort: 'name' })
      .then(setUsers)
      .catch(() => {})
    pb.collection('mapeamentos')
      .getFullList()
      .then(setMapeamentos)
      .catch(() => {})
  }, [])

  const visibleUsers = isManager ? users : users.filter((u) => u.id === user?.id)

  const enrichedUsers = visibleUsers.map((u) => {
    const uMapeamentos = mapeamentos.filter((m) => m.manager_id === u.id)
    const closedDeals = uMapeamentos.filter((m) => m.status === 'Fechado')
    const salesRealized = closedDeals.reduce((acc, m) => acc + (m.value || 0), 0)
    const visitsRealized = uMapeamentos.filter((m) => m.last_contact_at).length

    return {
      ...u,
      salesRealized,
      visitsRealized,
      callsGoal: u.callsGoal || 100,
      visitsGoal: u.visitsGoal || 20,
      salesGoal: u.salesGoal || 50000,
    }
  })

  const handleGoalChange = (id: string, field: string, value: string) => {
    setEditingGoals((prev) => {
      const current = prev[id] ||
        enrichedUsers.find((u) => u.id === id) || { callsGoal: 0, visitsGoal: 0, salesGoal: 0 }
      return {
        ...prev,
        [id]: { ...current, [field]: Number(value) },
      }
    })
  }

  const handleSaveGoals = async (id: string) => {
    const goals = editingGoals[id]
    if (goals) {
      try {
        await pb.collection('users').update(id, goals)
        setUsers(users.map((u) => (u.id === id ? { ...u, ...goals } : u)))
        toast({ title: 'Metas Atualizadas' })
      } catch (e: any) {
        toast({ title: 'Erro ao atualizar metas', description: e.message, variant: 'destructive' })
      }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas & Evolução em Vendas</h1>
          <p className="text-muted-foreground mt-1">
            {isManager ? 'Acompanhamento consolidado da equipe' : 'Suas metas e evolução'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho vs Meta</CardTitle>
          <CardDescription>
            Acompanhe o volume fechado em relação à meta estabelecida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultor</TableHead>
                <TableHead>Meta (R$)</TableHead>
                <TableHead>Realizado (R$)</TableHead>
                <TableHead>Progresso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enrichedUsers.map((c) => {
                const percentage =
                  c.salesGoal > 0 ? Math.round((c.salesRealized / c.salesGoal) * 100) : 0
                return (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name || c.email}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(c.salesGoal)}
                    </TableCell>
                    <TableCell className={percentage >= 100 ? 'text-success font-bold' : ''}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(c.salesRealized)}
                    </TableCell>
                    <TableCell className="w-[30%]">
                      <div className="flex items-center gap-2">
                        <Progress value={Math.min(percentage, 100)} className="h-2 flex-1" />
                        <span className="text-sm font-medium w-10">{percentage}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isManager && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Gestão de Metas da Equipe</CardTitle>
            <CardDescription>Defina os objetivos financeiros por consultor</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consultor</TableHead>
                  <TableHead>Vendas (R$)</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrichedUsers.map((c) => {
                  const currentEdit = editingGoals[c.id] || c
                  return (
                    <TableRow key={`edit-${c.id}`}>
                      <TableCell className="font-medium">{c.name || c.email}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-40"
                          value={currentEdit.salesGoal}
                          onChange={(e) => handleGoalChange(c.id, 'salesGoal', e.target.value)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleSaveGoals(c.id)}
                          disabled={!editingGoals[c.id]}
                        >
                          <Save className="w-4 h-4 mr-2" /> Salvar
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
