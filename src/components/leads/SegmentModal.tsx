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
import { createSegmento, updateSegmento } from '@/services/segmentos'
import { useToast } from '@/hooks/use-toast'

export function SegmentModal({
  open,
  onOpenChange,
  segment,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  segment?: any
}) {
  const [name, setName] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (open) setName(segment?.name || '')
  }, [open, segment])

  const handleSave = async () => {
    if (!name.trim()) return
    try {
      if (segment?.id) await updateSegmento(segment.id, { name })
      else await createSegmento({ name })
      onOpenChange(false)
      toast({ title: 'Sucesso', description: 'Segmento salvo.' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{segment ? 'Editar Segmento' : 'Novo Segmento'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label>Nome do Segmento</Label>
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
