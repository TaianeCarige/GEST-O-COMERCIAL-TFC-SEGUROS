import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMapeamentos } from '@/services/mapeamentos'
import { useRealtime } from '@/hooks/use-realtime'
import { Users, Clock, CalendarDays } from 'lucide-react'

export default function Index() {
  const [data, setData] = useState<any[]>([])

  const loadData = async () => {
    try {
      const mData = await getMapeamentos()
      setData(mData)
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  useRealtime('mapeamentos', () => {
    loadData()
  })

  const leads = data.filter((d) => d.type === 'Lead')
  const clients = data.filter((d) => d.type === 'Cliente')
  const expiring = data.filter((d) => {
    if (!d.insurance_expiry) return false
    const diff = new Date(d.insurance_expiry).getTime() - new Date().getTime()
    return diff > 0 && diff <= 30 * 24 * 60 * 60 * 1000
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Comercial</h1>
        <p className="text-muted-foreground mt-1">Visão geral dos seus Leads e Clientes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-500">
              Renovações Próximas
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{expiring.length}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
