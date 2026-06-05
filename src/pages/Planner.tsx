import React, { useState } from 'react'
import useAppStore, { Reminder } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle2, Clock, Plus, Trash2, CalendarDays } from 'lucide-react'

export default function Planner() {
  const {
    reminders,
    addReminder,
    updateReminderStatus,
    addReminderObservation,
    deleteReminder,
    currentUser,
  } = useAppStore()
  const { toast } = useToast()

  const myReminders = reminders.filter((r) => r.userId === currentUser)

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newReminder, setNewReminder] = useState({
    description: '',
    dateTime: '',
    observations: '',
  })

  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null)
  const [newNote, setNewNote] = useState('')

  const handleAdd = () => {
    if (!newReminder.description || !newReminder.dateTime) return
    addReminder({
      description: newReminder.description,
      dateTime: new Date(newReminder.dateTime).toISOString(),
      observations: newReminder.observations,
      status: 'Pendente',
    })
    setIsAddOpen(false)
    setNewReminder({ description: '', dateTime: '', observations: '' })
    toast({ title: 'Lembrete criado', description: 'Sua tarefa foi agendada.' })
  }

  const handleAddNote = () => {
    if (!selectedReminder || !newNote) return
    addReminderObservation(selectedReminder.id, newNote)
    setNewNote('')
    toast({ title: 'Observação adicionada', description: 'Histórico atualizado.' })
  }

  const now = new Date().getTime()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Lembretes</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas tarefas e compromissos.</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Lembrete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Tarefa</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  placeholder="Ex: Ligar para cliente..."
                />
              </div>
              <div className="space-y-2">
                <Label>Data e Hora</Label>
                <Input
                  type="datetime-local"
                  value={newReminder.dateTime}
                  onChange={(e) => setNewReminder({ ...newReminder, dateTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Observações Iniciais</Label>
                <Textarea
                  value={newReminder.observations}
                  onChange={(e) => setNewReminder({ ...newReminder, observations: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAdd}>Salvar Lembrete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myReminders
          .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
          .map((r) => {
            const isPending = r.status === 'Pendente'
            const rTime = new Date(r.dateTime).getTime()
            const isNear = isPending && rTime - now > 0 && rTime - now <= 24 * 60 * 60 * 1000
            const isLate = isPending && rTime < now

            return (
              <Card
                key={r.id}
                className={`flex flex-col transition-all ${isNear ? 'border-amber-500 shadow-amber-500/20 shadow-sm' : isLate ? 'border-destructive shadow-destructive/20 shadow-sm' : ''}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">{r.description}</CardTitle>
                    <Badge
                      variant={
                        isPending
                          ? isLate
                            ? 'destructive'
                            : isNear
                              ? 'outline'
                              : 'secondary'
                          : 'default'
                      }
                      className={isNear ? 'border-amber-500 text-amber-600' : ''}
                    >
                      {r.status}
                    </Badge>
                  </div>
                  <CardDescription
                    className={`flex items-center gap-1 mt-1 font-medium ${isLate ? 'text-destructive' : isNear ? 'text-amber-600' : ''}`}
                  >
                    <CalendarDays className="w-4 h-4" />{' '}
                    {new Date(r.dateTime).toLocaleString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {r.observations}
                  </p>

                  <Dialog
                    open={selectedReminder?.id === r.id}
                    onOpenChange={(open) => !open && setSelectedReminder(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedReminder(r)}
                      >
                        Ver Histórico e Adicionar Nota
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Histórico de: {r.description}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label>Nova Observação (Carimbo de Auditoria)</Label>
                          <Textarea
                            placeholder="Adicione uma nota..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <Button size="sm" onClick={handleAddNote}>
                            Adicionar Nota
                          </Button>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-auto">
                          {r.history?.map((h) => (
                            <div key={h.id} className="text-sm border p-3 rounded-md bg-muted/30">
                              <p className="whitespace-pre-wrap text-foreground">{h.note}</p>
                            </div>
                          ))}
                          {(!r.history || r.history.length === 0) && (
                            <p className="text-sm text-muted-foreground text-center">
                              Nenhum histórico registrado.
                            </p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="flex justify-between items-center pt-2 border-t mt-2">
                    {isPending ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-success hover:text-success hover:bg-success/10"
                        onClick={() => updateReminderStatus(r.id, 'Concluído')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Concluir
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateReminderStatus(r.id, 'Pendente')}
                      >
                        <Clock className="w-4 h-4 mr-2" /> Reabrir
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => deleteReminder(r.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        {myReminders.length === 0 && (
          <p className="text-muted-foreground col-span-full">
            Nenhum lembrete agendado no momento.
          </p>
        )}
      </div>
    </div>
  )
}
