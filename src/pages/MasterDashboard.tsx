import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { Navigate } from 'react-router-dom'
import { Users, CheckCircle2, AlertCircle, PhoneCall } from 'lucide-react'

export default function MasterDashboard() {
  const { user, loading } = useAuth()
  const [users, setUsers] = useState<any[]>([])
  const [mapeamentos, setMapeamentos] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'manager') {
      setIsLoading(false)
      return
    }

    Promise.all([
      pb.collection('users').getFullList({ sort: 'name' }),
      pb.collection('mapeamentos').getFullList(),
    ])
      .then(([u, m]) => {
        setUsers(u)
        setMapeamentos(m)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [user])

  if (loading || isLoading) return <div className="p-8 text-center">Carregando...</div>
  if (user?.role !== 'manager') return <Navigate to="/" replace />

  const stats = users.map((u) => {
    const userMapeamentos = mapeamentos.filter((m) => m.manager_id === u.id)
    const totalLeads = userMapeamentos.length
    const pending = userMapeamentos.filter(
      (m) => m.status === 'Provável' || m.status === 'Frio',
    ).length
    const closed = userMapeamentos.filter((m) => m.status === 'Fechado').length
    const contacted = userMapeamentos.filter((m) => m.last_contact_by === u.id).length

    return {
      ...u,
      totalLeads,
      pending,
      closed,
      contacted,
    }
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Master Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão unificada de toda a equipe e negociações.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mapeamentos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Negociações Pendentes</CardTitle>
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mapeamentos.filter((m) => m.status === 'Provável' || m.status === 'Frio').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Negócios Fechados</CardTitle>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mapeamentos.filter((m) => m.status === 'Fechado').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Contatos Realizados</CardTitle>
            <PhoneCall className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mapeamentos.filter((m) => m.last_contact_at).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desempenho da Equipe</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultor</TableHead>
                <TableHead className="text-center">Total de Leads</TableHead>
                <TableHead className="text-center">Pendentes (Provável/Frio)</TableHead>
                <TableHead className="text-center">Fechados</TableHead>
                <TableHead className="text-center">Contatos (Última Ação)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name || s.email}</TableCell>
                  <TableCell className="text-center">{s.totalLeads}</TableCell>
                  <TableCell className="text-center">{s.pending}</TableCell>
                  <TableCell className="text-center text-success font-semibold">
                    {s.closed}
                  </TableCell>
                  <TableCell className="text-center">{s.contacted}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
