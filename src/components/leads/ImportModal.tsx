import { useState, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createMapeamento } from '@/services/mapeamentos'
import { useAuth } from '@/hooks/use-auth'

const MAPPABLE_FIELDS = [
  { id: 'name', label: 'Nome' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Telefone' },
  { id: 'type', label: 'Tipo (Lead/Cliente)' },
  { id: 'auto_expiry', label: 'Auto Vencimento' },
  { id: 'auto_carrier', label: 'Auto Seguradora' },
  { id: 'health_expiry', label: 'Saúde Vencimento' },
  { id: 'health_carrier', label: 'Saúde Seguradora' },
]

export function ImportModal({
  open,
  onOpenChange,
  segments,
  gerentes,
}: {
  open: boolean
  onOpenChange: (val: boolean) => void
  segments: any[]
  gerentes: any[]
}) {
  const [segmentId, setSegmentId] = useState('')
  const [gerenteId, setGerenteId] = useState('')
  const [headers, setHeaders] = useState<string[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [parsedRows, setParsedRows] = useState<string[][]>([])
  const fileRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      const lines = text.split('\n').filter((l) => l.trim())
      if (lines.length < 1) return
      const h = lines[0].split(',').map((s) => s.trim())
      setHeaders(h)
      setParsedRows(lines.slice(1).map((l) => l.split(',').map((v) => v.trim())))

      const initialMap: Record<string, string> = {}
      MAPPABLE_FIELDS.forEach((field) => {
        const match = h.find(
          (hd) =>
            hd.toLowerCase().includes(field.label.toLowerCase()) || hd.toLowerCase() === field.id,
        )
        if (match) initialMap[field.id] = match
      })
      setMapping(initialMap)
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!gerenteId) return toast({ title: 'Selecione o Gerente', variant: 'destructive' })
    if (!mapping['name']) return toast({ title: 'Mapeie o campo Nome', variant: 'destructive' })

    let success = 0
    for (const row of parsedRows) {
      const payload: any = { gerente_carteira_id: gerenteId, manager_id: user?.id }
      Object.entries(mapping).forEach(([fieldId, headerName]) => {
        const idx = headers.indexOf(headerName)
        if (idx !== -1) {
          const val = row[idx]
          if (val && fieldId.includes('_expiry')) {
            try {
              payload[fieldId] = new Date(val).toISOString()
            } catch {
              /* intentionally ignored */
            }
          } else {
            payload[fieldId] = val
          }
        }
      })
      try {
        await createMapeamento(payload)
        success++
      } catch {
        /* intentionally ignored */
      }
    }
    toast({ title: 'Importação concluída', description: `${success} registros importados.` })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          setHeaders([])
          setParsedRows([])
          setMapping({})
        }
        onOpenChange(val)
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Clientes</DialogTitle>
          <DialogDescription>Importe via arquivo CSV (separado por vírgulas).</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-1">
            <Label>Segmento</Label>
            <Select value={segmentId} onValueChange={setSegmentId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {segments.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Gerente</Label>
            <Select value={gerenteId} onValueChange={setGerenteId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gerentes
                  .filter((g) => g.segmento_id === segmentId)
                  .map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <Label>Arquivo CSV</Label>
            <Input type="file" accept=".csv" ref={fileRef} onChange={handleFile} />
          </div>
        </div>

        {headers.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Mapeamento de Campos</h4>
            <div className="grid grid-cols-2 gap-4">
              {MAPPABLE_FIELDS.map((field) => (
                <div key={field.id} className="flex flex-col gap-1">
                  <Label className="text-xs">
                    {field.label} {field.id === 'name' && '*'}
                  </Label>
                  <Select
                    value={mapping[field.id] || 'none'}
                    onValueChange={(v) =>
                      setMapping(
                        v === 'none'
                          ? { ...mapping, [field.id]: '' }
                          : { ...mapping, [field.id]: v },
                      )
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Ignorar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ignorar</SelectItem>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleImport} disabled={!gerenteId || parsedRows.length === 0}>
            Importar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
