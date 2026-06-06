import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { GerenteModal } from './GerenteModal'
import { deleteGerente } from '@/services/gerentes'
import { useToast } from '@/hooks/use-toast'

export function GerentesSidebar({
  segmentId,
  gerentes,
  activeId,
  onSelect,
}: {
  segmentId: string
  gerentes: any[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGerente, setEditingGerente] = useState<any>(null)
  const { toast } = useToast()

  const handleAdd = () => {
    setEditingGerente(null)
    setModalOpen(true)
  }

  const handleEdit = (g: any) => {
    setEditingGerente(g)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este Gerente de Carteira?')) return
    try {
      await deleteGerente(id)
      if (activeId === id) onSelect('')
      toast({ title: 'Removido' })
    } catch {
      toast({ title: 'Erro', variant: 'destructive' })
    }
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-semibold text-sm text-muted-foreground">GERENTES</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleAdd}
          disabled={!segmentId}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 pr-4">
          {gerentes
            .filter((g) => g.segmento_id === segmentId)
            .map((g) => (
              <div key={g.id} className="group flex items-center justify-between w-full">
                <Button
                  variant={activeId === g.id ? 'secondary' : 'ghost'}
                  className="flex-1 justify-start font-normal truncate"
                  onClick={() => onSelect(g.id)}
                >
                  {g.name}
                </Button>
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleEdit(g)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDelete(g.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          {gerentes.filter((g) => g.segmento_id === segmentId).length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-4">Nenhum gerente encontrado.</p>
          )}
        </div>
      </ScrollArea>
      <GerenteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        segmentId={segmentId}
        gerente={editingGerente}
      />
    </div>
  )
}
