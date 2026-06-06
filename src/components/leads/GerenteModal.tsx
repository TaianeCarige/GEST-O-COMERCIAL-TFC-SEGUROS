import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createGerente, updateGerente } from '@/services/gerentes'
import { useToast } from '@/hooks/use-toast'

export function GerenteModal({
  open,
  onOpenChange,
  segmentId,
  gerente,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  segmentId: string
  gerente?: any
}) {
  const [name, setName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (open) setName(gerente?.name || '')
  }, [open, gerente])

  const handleSave = async () => {
    if (!name.trim() || !segmentId) return
    try {
      if (gerente?.id) await updateGerente(gerente.id, { name })
      else await createGerente({ name, segmento_id: segmentId })
      onOpenChange(false)
      toast({ title: 'Sucesso', description: 'Gerente salvo.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{gerente ? 'Editar Gerente' : 'Novo Gerente'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label>Nome do Gerente de Carteira</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
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
