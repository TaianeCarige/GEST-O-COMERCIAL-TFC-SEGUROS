import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Upload, Plus, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  getMapeamentos,
  createMapeamento,
  updateMapeamento,
  deleteMapeamento,
} from '@/services/mapeamentos'
import { getUsers } from '@/services/users'
import { useRealtime } from '@/hooks/use-realtime'

export default function Leads() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [data, setData] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    phone: '',
    type: 'Lead',
    insurance_expiry: '',
    status: 'Prospecção',
    manager_id: user?.id || '',
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  const loadData = async () => {
    try {
      const [mData, uData] = await Promise.all([getMapeamentos(), getUsers()])
      setData(mData)
      setUsers(uData)
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

  const handleSave = async () => {
    if (!form.name) {
      toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' })
      return
    }
    try {
      if (editingId) {
        await updateMapeamento(editingId, form)
      } else {
        await createMapeamento(form)
      }
      setIsOpen(false)
      toast({ title: 'Sucesso', description: 'Registro salvo com sucesso.' })
      setForm({
        name: '',
        email: '',
        phone: '',
        type: 'Lead',
        insurance_expiry: '',
        status: 'Prospecção',
        manager_id: user?.id || '',
      })
      setEditingId(null)
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' })
    }
  }

  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setForm({
      name: item.name,
      email: item.email,
      phone: item.phone,
      type: item.type,
      insurance_expiry: item.insurance_expiry ? item.insurance_expiry.split('T')[0] : '',
      status: item.status,
      manager_id: item.manager_id,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Excluir registro?')) {
      await deleteMapeamento(id)
      toast({ title: 'Removido' })
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim())
      if (lines.length < 2) return
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase())
      for (const line of lines.slice(1)) {
        const values = line.split(',').map((v) => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => {
          obj[h] = values[i]
        })
        try {
          await createMapeamento({
            name: obj.name,
            email: obj.email,
            phone: obj.phone,
            type: obj.type || 'Lead',
            insurance_expiry: obj.insurance_expiry
              ? new Date(obj.insurance_expiry).toISOString()
              : '',
            status: obj.status || 'Prospecção',
            manager_id: obj.manager_id || user?.id,
          })
        } catch {
          /* intentionally ignored */
        }
      }
      toast({ title: 'Importação concluída' })
      if (fileRef.current) fileRef.current.value = ''
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads & Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie leads, clientes e importações.</p>
        </div>
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".csv"
            className="hidden"
            ref={fileRef}
            onChange={handleImport}
          />
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Importar CSV
          </Button>
          <Dialog
            open={isOpen}
            onOpenChange={(val) => {
              setIsOpen(val)
              if (!val) {
                setEditingId(null)
                setForm({
                  name: '',
                  email: '',
                  phone: '',
                  type: 'Lead',
                  insurance_expiry: '',
                  status: 'Prospecção',
                  manager_id: user?.id || '',
                })
              }
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Novo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingId ? 'Editar' : 'Adicionar Novo'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lead">Lead</SelectItem>
                      <SelectItem value="Cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Vencimento Seguro</Label>
                  <Input
                    type="date"
                    value={form.insurance_expiry}
                    onChange={(e) => setForm({ ...form, insurance_expiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Input
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Consultor / Manager</Label>
                  <Select
                    value={form.manager_id}
                    onValueChange={(v) => setForm({ ...form, manager_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name || u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    {item.expand?.manager_id?.name || item.expand?.manager_id?.email || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    Nenhum registro encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
