import React, { useState } from 'react'
import useAppStore, { ReminderStatus } from '@/stores/useAppStore'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Plus, Clock, History, Trash2 } from 'lucide-react'

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

  const handleAdd = () => {
    if (!newReminder.description || !newReminder.dateTime) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha a descrição e a data/hora.',
        variant: 'destructive',
      })
      return
    }
    addReminder({
      description: newReminder.description,
      dateTime: new Date(newReminder.dateTime).toISOString(),
      observations: newReminder.observations,
      status: 'Pendente',
    })
    setNewReminder({ description: '', dateTime: '', observations: '' })
    setIsAddOpen(false)
    toast({ title: 'Lembrete adicionado' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Lembretes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas atividades, reuniões e follow-ups.
          </p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Novo Lembrete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Lembrete</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Descrição (Obrigatório)</Label>
                <Input
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                  placeholder="Ex: Ligar para Indústrias Alfa"
                />
              </div>
              <div className="space-y-2">
                <Label>Data e Hora (Obrigatório)</Label>
                <Input
                  type="datetime-local"
                  value={newReminder.dateTime}
                  onChange={(e) => setNewReminder({ ...newReminder, dateTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Observações Adicionais</Label>
                <Textarea
                  value={newReminder.observations}
                  onChange={(e) => setNewReminder({ ...newReminder, observations: e.target.value })}
                  placeholder="Informações úteis para a atividade..."
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
          .map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              updateStatus={updateReminderStatus}
              addObservation={addReminderObservation}
              deleteReminder={deleteReminder}
            />
          ))}
        {myReminders.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border rounded-lg border-dashed">
            Você não possui lembretes no momento.
          </div>
        )}
      </div>
    </div>
  )
}

function ReminderCard({ reminder, updateStatus, addObservation, deleteReminder }: any) {
  const [newObs, setNewObs] = useState('')
  const { toast } = useToast()

  const isPast =
    new Date(reminder.dateTime).getTime() < new Date().getTime() && reminder.status === 'Pendente'

  const handleAddObs = () => {
    if (!newObs) return
    addObservation(reminder.id, newObs)
    setNewObs('')
    toast({ title: 'Observação adicionada' })
  }

  return (
    <Card
      className={`flex flex-col h-full ${isPast ? 'border-destructive/50 shadow-sm shadow-destructive/10' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-lg leading-tight">{reminder.description}</CardTitle>
          <Badge
            variant={
              reminder.status === 'Pendente' ? (isPast ? 'destructive' : 'secondary') : 'default'
            }
            className="shrink-0"
          >
            {reminder.status}
          </Badge>
        </div>
        <CardDescription
          className={`flex items-center gap-1 mt-1 text-xs font-medium ${isPast ? 'text-destructive font-bold' : ''}`}
        >
          <Clock className="w-3 h-3" />
          {new Date(reminder.dateTime).toLocaleString('pt-BR')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {reminder.observations && (
          <div className="text-sm bg-muted/30 p-2 rounded-md border text-muted-foreground whitespace-pre-wrap">
            {reminder.observations}
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-semibold flex items-center gap-1">
            <History className="w-3 h-3" /> Histórico
          </h4>
          <div className="max-h-32 overflow-y-auto space-y-2 text-xs">
            {reminder.history.map((h: any) => (
              <div key={h.id} className="border-l-2 border-primary/30 pl-2 py-0.5">
                <p className="whitespace-pre-wrap">{h.note}</p>
              </div>
            ))}
            {reminder.history.length === 0 && (
              <p className="text-muted-foreground">Sem histórico.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t bg-muted/10 flex flex-col gap-3 mt-auto">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Adicionar observação..."
            className="h-8 text-xs"
            value={newObs}
            onChange={(e) => setNewObs(e.target.value)}
          />
          <Button size="sm" className="h-8" variant="secondary" onClick={handleAddObs}>
            Salvar
          </Button>
        </div>
        <div className="flex items-center justify-between w-full">
          <Select
            value={reminder.status}
            onValueChange={(val: ReminderStatus) => updateStatus(reminder.id, val)}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
            onClick={() => deleteReminder(reminder.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
