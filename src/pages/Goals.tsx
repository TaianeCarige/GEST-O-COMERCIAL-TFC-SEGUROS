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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts'
import { Badge } from '@/components/ui/badge'

export default function Goals() {
  const { consultants, leads, currentUser } = useAppStore()

  const me = consultants.find((c) => c.id === currentUser)
  const isManager = me?.role === 'Gestora'
  const visibleLeads = isManager ? leads : leads.filter((l) => l.consultantId === currentUser)
  const visibleConsultants = isManager
    ? consultants
    : consultants.filter((c) => c.id === currentUser)

  // Mocking time-series data for evolution chart
  const evolutionData = [
    { day: '01', Taiane: 2000, Carlos: 1500, Mariana: 1000, Target: 1500 },
    { day: '05', Taiane: 8000, Carlos: 4000, Mariana: 2500, Target: 7500 },
    { day: '10', Taiane: 15000, Carlos: 12000, Mariana: 6000, Target: 15000 },
    { day: '15', Taiane: 22000, Carlos: 25000, Mariana: 10000, Target: 22500 },
    { day: '20', Taiane: 35000, Carlos: 38000, Mariana: 15000, Target: 30000 },
    { day: '25', Taiane: 45000, Carlos: 52000, Mariana: 20000, Target: 37500 },
  ]

  const lineChartConfig = {
    Taiane: { label: 'Taiane', color: 'hsl(var(--chart-1))' },
    Carlos: { label: 'Carlos', color: 'hsl(var(--chart-2))' },
    Mariana: { label: 'Mariana', color: 'hsl(var(--chart-3))' },
    Target: { label: 'Meta Esperada', color: 'hsl(var(--muted-foreground))' },
  }

  // Calculate branch distribution from leads
  const branchMap: Record<string, number> = {}
  visibleLeads
    .filter((l) => l.status === 'Fechado')
    .forEach((l) => {
      branchMap[l.branch] = (branchMap[l.branch] || 0) + l.value
    })

  // Provide mock data if not enough real closed sales
  if (Object.keys(branchMap).length < 2) {
    branchMap['Saúde'] = 45000
    branchMap['Automóveis/Frotas'] = 30000
    branchMap['Vida'] = 15000
    branchMap['Patrimonial'] = 27000
  }

  const pieData = Object.entries(branchMap).map(([name, value], i) => ({
    name,
    value,
    fill: `hsl(var(--chart-${(i % 5) + 1}))`,
  }))

  const pieChartConfig = {
    value: { label: 'Valor (R$)' },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metas & Evolução em Vendas</h1>
          <p className="text-muted-foreground mt-1">
            {isManager ? 'Acompanhamento consolidado da corretora' : 'Suas metas e evolução'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução de Vendas (R$)</CardTitle>
            <CardDescription>Acompanhamento mensal versus linha de meta</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
              <LineChart data={evolutionData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                  tickFormatter={(value) => `R${value / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />

                {isManager ? (
                  <>
                    <Line
                      type="monotone"
                      dataKey="Taiane"
                      stroke="var(--color-Taiane)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Carlos"
                      stroke="var(--color-Carlos)"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="Mariana"
                      stroke="var(--color-Mariana)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </>
                ) : (
                  <Line
                    type="monotone"
                    dataKey={me?.name || ''}
                    stroke={`var(--color-${me?.name})`}
                    strokeWidth={3}
                    dot={false}
                  />
                )}

                <Line
                  type="dashed"
                  strokeDasharray="5 5"
                  dataKey="Target"
                  stroke="var(--color-Target)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Ramo</CardTitle>
            <CardDescription>Volume de prêmios fechados no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={pieChartConfig}
              className="h-[300px] w-full flex items-center justify-center"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard e Desempenho</CardTitle>
          <CardDescription>
            Desempenho e insights baseados em atividades vs fechamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultor</TableHead>
                <TableHead>Meta (R$)</TableHead>
                <TableHead>Realizado (R$)</TableHead>
                <TableHead>Evolução da Carteira</TableHead>
                <TableHead>Insights Práticos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleConsultants
                .sort((a, b) => b.salesRealized / b.salesGoal - a.salesRealized / a.salesGoal)
                .map((c) => {
                  const percentage = Math.round((c.salesRealized / c.salesGoal) * 100)
                  const isUnderperforming = percentage < 80
                  const lowVisits = c.visitsRealized < c.visitsGoal

                  let insight = 'Desempenho sólido. Manter a cadência de visitas.'
                  if (isUnderperforming && lowVisits) {
                    insight =
                      'Aumentar volume de visitas. A conversão depende de maior contato presencial.'
                  } else if (isUnderperforming && !lowVisits) {
                    insight =
                      'Rever técnicas de fechamento. Alto volume de visitas com baixa conversão.'
                  } else if (percentage >= 100) {
                    insight = 'Meta batida! Focar em cross-sell e up-sell na carteira atual.'
                  }

                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: c.color }}
                        ></div>
                        {c.name}
                      </TableCell>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${percentage >= 100 ? 'bg-success' : percentage > 75 ? 'bg-accent' : 'bg-destructive'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{percentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isUnderperforming ? 'destructive' : 'secondary'}
                          className="font-normal text-xs leading-tight whitespace-normal max-w-[250px] inline-block"
                        >
                          {insight}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
