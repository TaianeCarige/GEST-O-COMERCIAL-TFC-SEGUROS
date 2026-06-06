import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Textarea } from '@/components/ui/textarea'
import { createMapeamento, updateMapeamento } from '@/services/mapeamentos'
import { getUsers } from '@/services/users'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/use-auth'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  type: 'Lead',
  manager_id: '',
  status: 'Lead',
  value: 0,
  auto_expiry: '',
  auto_carrier: '',
  health_expiry: '',
  health_carrier: '',
  dental_expiry: '',
  dental_carrier: '',
  property_expiry: '',
  property_carrier: '',
  life_expiry: '',
  life_carrier: '',
  others_expiry: '',
  others_carrier: '',
  observations: '',
}

export function ClientModal({
  open,
  onOpenChange,
  gerenteId,
  client,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  gerenteId: string
  client?: any
}) {
  const [form, setForm] = useState<any>({ ...initialForm })
  const [users, setUsers] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (open) {
      if (client) {
        setForm({
          ...initialForm,
          ...client,
          auto_expiry: client.auto_expiry ? client.auto_expiry.split('T')[0] : '',
          health_expiry: client.health_expiry ? client.health_expiry.split('T')[0] : '',
          dental_expiry: client.dental_expiry ? client.dental_expiry.split('T')[0] : '',
          property_expiry: client.property_expiry ? client.property_expiry.split('T')[0] : '',
          life_expiry: client.life_expiry ? client.life_expiry.split('T')[0] : '',
          others_expiry: client.others_expiry ? client.others_expiry.split('T')[0] : '',
        })
      } else {
        setForm({ ...initialForm, manager_id: user?.id })
      }
    }
  }, [open, client, user])

  const handleSave = async () => {
    if (!form.name || !gerenteId)
      return toast({ title: 'Erro', description: 'Nome e Gerente são obrigatórios.' })
    const payload = { ...form, gerente_carteira_id: gerenteId }

    // Auto audit observation
    const oldObs = client?.observations || ''
    if (form.observations !== oldObs && form.observations.trim() && user) {
      payload.last_contact_by = user.id
      payload.last_contact_at = new Date().toISOString()
    }

    try {
      if (client?.id) await updateMapeamento(client.id, payload)
      else await createMapeamento(payload)
      toast({ title: 'Salvo com sucesso!' })
      onOpenChange(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  const renderInsuranceRow = (label: string, prefix: string) => (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label>{label} - Vencimento</Label>
        <Input
          type="date"
          value={form[`${prefix}_expiry`]}
          onChange={(e) => setForm({ ...form, [`${prefix}_expiry`]: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label>{label} - Seguradora</Label>
        <Input
          value={form[`${prefix}_carrier`]}
          onChange={(e) => setForm({ ...form, [`${prefix}_carrier`]: e.target.value })}
        />
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="basic" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="basic" className="flex-1">
              Básico
            </TabsTrigger>
            <TabsTrigger value="insurances" className="flex-1">
              Seguros
            </TabsTrigger>
            <TabsTrigger value="observations" className="flex-1">
              Observações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Nome *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Telefone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
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
              <div className="space-y-1">
                <Label>Status da Negociação</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Cotação">Cotação</SelectItem>
                    <SelectItem value="Provável">Provável</SelectItem>
                    <SelectItem value="Frio">Frio</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Valor Estimado (R$)</Label>
                <Input
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1 col-span-2">
                <Label>Consultor Associado</Label>
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
          </TabsContent>

          <TabsContent value="insurances" className="space-y-4 py-4">
            {renderInsuranceRow('Auto/Frota', 'auto')}
            {renderInsuranceRow('Saúde', 'health')}
            {renderInsuranceRow('Odonto', 'dental')}
            {renderInsuranceRow('Patrimonial', 'property')}
            {renderInsuranceRow('Vida', 'life')}
            {renderInsuranceRow('Demais', 'others')}
          </TabsContent>

          <TabsContent value="observations" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Histórico / Observações</Label>
              <Textarea
                rows={6}
                value={form.observations}
                onChange={(e) => setForm({ ...form, observations: e.target.value })}
              />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
