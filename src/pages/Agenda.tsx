import React, { useState } from 'react'
import useAppStore, { Lead } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Briefcase } from 'lucide-react'

export default function Agenda() {
  const { leads, consultants } = useAppStore()
  const [selectedEvent, setSelectedEvent] = useState<Lead | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Generate a simple calendar grid for the current month
  const today = new Date()
  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay() // 0 is Sunday

  const daysArray = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDayOfWeek + 1
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      // pad with 0
      const dStr = dayNumber.toString().padStart(2, '0')
      const mStr = (currentMonth + 1).toString().padStart(2, '0')
      const dateStr = `${currentYear}-${mStr}-${dStr}`
      return { day: dayNumber, dateStr }
    }
    return { day: null, dateStr: null }
  })

  const getEventsForDate = (dateStr: string | null) => {
    if (!dateStr) return []
    return leads.filter((l) => l.scheduledDate && l.scheduledDate.startsWith(dateStr))
  }

  const handleEventClick = (lead: Lead) => {
    setSelectedEvent(lead)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Agenda Compartilhada</h1>
      </div>

      <Card className="flex-1 flex flex-col min-h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div>
            <CardTitle>
              {today.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()}
            </CardTitle>
            <CardDescription>Visão geral de compromissos da equipe comercial</CardDescription>
          </div>
          <div className="flex gap-4">
            {consultants.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                {c.name}
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="grid grid-cols-7 border-b bg-muted/30">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="py-3 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 flex-1">
            {daysArray.map((cell, idx) => {
              const events = getEventsForDate(cell.dateStr)
              const isToday = cell.dateStr === today.toISOString().split('T')[0]

              return (
                <div
                  key={idx}
                  className={`border-r border-b min-h-[100px] p-2 flex flex-col ${cell.day === null ? 'bg-muted/10' : 'bg-card'} ${isToday ? 'bg-accent/5' : ''}`}
                >
                  {cell.day && (
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}
                    >
                      {cell.day}
                    </span>
                  )}
                  <div className="flex flex-col gap-1 overflow-y-auto">
                    {events.map((event) => {
                      const consultant = consultants.find((c) => c.id === event.consultantId)
                      return (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity text-white"
                          style={{ backgroundColor: consultant?.color || '#ccc' }}
                          title={`${event.name} - ${event.status}`}
                        >
                          {event.name}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da Agenda</DialogTitle>
                <DialogDescription>Compromisso com {selectedEvent.name}</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Ramo</span>
                    <span className="font-medium">{selectedEvent.branch}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Status</span>
                    <span className="font-medium">{selectedEvent.status}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Consultor</span>
                    <span className="font-medium">
                      {consultants.find((c) => c.id === selectedEvent.consultantId)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Valor Estimado</span>
                    <span className="font-medium">
                      R$ {selectedEvent.value.toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/10 p-4 rounded-lg flex items-start gap-3 mt-4 border border-accent/20">
                  <Briefcase className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm text-foreground mb-1">
                      Recomendação de Preparação B2B
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Analise o histórico de sinistralidade do cliente no ramo de{' '}
                      {selectedEvent.branch}. Prepare uma apresentação focada em mitigação de riscos
                      e redução de custos operacionais.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
