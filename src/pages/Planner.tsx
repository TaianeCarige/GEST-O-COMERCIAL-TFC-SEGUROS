import React, { useState } from 'react'
import useAppStore, { Reminder, ReminderStatus } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Edit, Trash2, CalendarClock, Plus, History, Info } from 'lucide-react'

export default function Planner() {
  const { reminders, addReminder, editReminder, deleteReminder, currentUser } = useAppStore()
  const { toast } = useToast()

  const myReminders = reminders.filter((r) => r.userId === currentUser)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Reminder | null>(null)
  const [isNewOpen, setIsNewOpen] = useState(false)

  const [form, setForm] = useState({
    description: '',
    dateTime: '',
    observations: '',
    status: 'Pendente' as ReminderStatus,
  })

  const handleEditClick = (rem: Reminder) => {
    setEditData(rem)
    setForm({
      description: rem.description,
      dateTime: rem.dateTime ? rem.dateTime.substring(0, 16) : '',
      observations: rem.observations,
      status: rem.status,
    })
  }

  const handleSaveEdit = () => {
    if (editData) {
      editReminder(editData.id, {
        description: form.description,
        dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : new Date().toISOString(),
        observations: form.observations,
        status: form.status,
      })
      setEditData(null)
      toast({
        title: 'Lembrete atualizado',
        description: 'As alterações foram salvas com sucesso.',
      })
    }
  }

  const handleCreate = () => {
    addReminder({
      description: form.description,
      dateTime: form.dateTime ? new Date(form.dateTime).toISOString() : new Date().toISOString(),
      observations: form.observations,
      status: 'Pendente',
    })
    setIsNewOpen(false)
    setForm({ description: '', dateTime: '', observations: '', status: 'Pendente' })
    toast({ title: 'Lembrete criado', description: 'Novo lembrete adicionado à sua agenda.' })
  }

  const handleDelete = () => {
    if (deleteId) {
      deleteReminder(deleteId)
      setDeleteId(null)
      toast({ title: 'Lembrete excluído', description: 'O lembrete foi removido permanentemente.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Lembretes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas atividades, tarefas e follow-ups agendados.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm({ description: '', dateTime: '', observations: '', status: 'Pendente' })
            setIsNewOpen(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Novo Lembrete
        </Button>
      </div>

      <div className="bg-primary/10 text-primary-foreground border-primary/20 p-3 rounded-lg flex items-center gap-2 text-sm">
        <Info className="w-4 h-4 text-primary" />
        <span className="text-primary">
          As exclusões e alterações operam em modo local (estático) e serão redefinidas ao
          recarregar a página sem backend conectado.
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Atividades</CardTitle>
          <CardDescription>Acompanhe e edite seus lembretes e status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myReminders.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">
                Nenhum lembrete encontrado.
              </p>
            ) : (
              myReminders
                .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
                .map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex gap-4 w-full">
                      <div className="mt-1 bg-primary/10 p-2 rounded-full h-fit shrink-0">
                        <CalendarClock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg">{r.description}</h4>
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                          {r.observations}
                        </p>
                        <div className="flex flex-wrap gap-2 items-center mt-3">
                          <Badge variant={r.status === 'Concluído' ? 'default' : 'secondary'}>
                            {r.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {new Date(r.dateTime).toLocaleString('pt-BR', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>

                        {r.history && r.history.length > 0 && (
                          <div className="mt-4 pt-3 border-t space-y-2 w-full">
                            <p className="text-xs font-semibold flex items-center gap-1 text-muted-foreground uppercase tracking-wider">
                              <History className="w-3 h-3" /> Histórico de Alterações (Log de
                              Auditoria)
                            </p>
                            <div className="space-y-1">
                              {r.history.slice(0, 3).map((h) => (
                                <p
                                  key={h.id}
                                  className="text-[11px] text-muted-foreground border-l-2 border-primary/30 pl-2 py-0.5"
                                >
                                  {h.note}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      <Button variant="outline" size="icon" onClick={() => handleEditClick(r)}>
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="hover:bg-destructive/10 hover:border-destructive"
                        onClick={() => setDeleteId(r.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive/70 hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editData} onOpenChange={(open) => !open && setEditData(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Editar Lembrete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição da Atividade</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data e Horário</Label>
              <Input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: ReminderStatus) => setForm({ ...form, status: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                rows={4}
                value={form.observations}
                onChange={(e) => setForm({ ...form, observations: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditData(null)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Dialog */}
      <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Novo Lembrete</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Descrição da Atividade</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Retorno de ligação para Cliente X"
              />
            </div>
            <div className="space-y-2">
              <Label>Data e Horário</Label>
              <Input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                rows={4}
                value={form.observations}
                onChange={(e) => setForm({ ...form, observations: e.target.value })}
                placeholder="Notas extras sobre a atividade..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Lembrete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Lembrete?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente este lembrete e todo seu histórico do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
