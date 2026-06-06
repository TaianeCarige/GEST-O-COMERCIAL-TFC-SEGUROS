import { useState, useEffect } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Upload } from 'lucide-react'
import { SegmentModal } from '@/components/leads/SegmentModal'
import { GerentesSidebar } from '@/components/leads/GerentesSidebar'
import { LeadsTable } from '@/components/leads/LeadsTable'
import { ImportModal } from '@/components/leads/ImportModal'
import { getSegmentos, deleteSegmento } from '@/services/segmentos'
import { getGerentes } from '@/services/gerentes'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'

export default function Leads() {
  const [segments, setSegments] = useState<any[]>([])
  const [gerentes, setGerentes] = useState<any[]>([])
  const [activeSegmentId, setActiveSegmentId] = useState<string>('')
  const [activeGerenteId, setActiveGerenteId] = useState<string>('')

  const [segmentModalOpen, setSegmentModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<any>(null)

  const { toast } = useToast()

  const loadData = async () => {
    try {
      const [segs, gers] = await Promise.all([getSegmentos(), getGerentes()])
      setSegments(segs)
      setGerentes(gers)
      if (segs.length > 0 && !activeSegmentId) {
        setActiveSegmentId(segs[0].id)
      }
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadData()
  }, [activeSegmentId])
  useRealtime('segmentos', () => loadData())
  useRealtime('gerentes_carteira', () => loadData())

  const handleAddSegment = () => {
    setEditingSegment(null)
    setSegmentModalOpen(true)
  }

  const handleEditSegment = () => {
    const seg = segments.find((s) => s.id === activeSegmentId)
    if (seg) {
      setEditingSegment(seg)
      setSegmentModalOpen(true)
    }
  }

  const handleDeleteSegment = async () => {
    if (!confirm('Deseja excluir este segmento e todos os seus gerentes?')) return
    try {
      await deleteSegmento(activeSegmentId)
      setActiveSegmentId('')
      toast({ title: 'Segmento excluído' })
    } catch {
      toast({ title: 'Erro ao excluir', variant: 'destructive' })
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leads & Clientes</h1>
          <p className="text-muted-foreground mt-1">Organize carteiras por segmentos e gerentes.</p>
        </div>
        <Button variant="secondary" onClick={() => setImportModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" /> Importar
        </Button>
      </div>

      <div className="flex items-center justify-between border-b pb-2">
        <Tabs value={activeSegmentId} onValueChange={setActiveSegmentId} className="w-full">
          <TabsList className="bg-transparent space-x-2">
            {segments.map((s) => (
              <TabsTrigger
                key={s.id}
                value={s.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-1 ml-4 shrink-0">
          <Button variant="outline" size="sm" onClick={handleAddSegment}>
            <Plus className="w-4 h-4 mr-1" /> Tab
          </Button>
          {activeSegmentId && (
            <>
              <Button variant="ghost" size="icon" onClick={handleEditSegment}>
                <Edit className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDeleteSegment}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="w-64 border-r pr-4 overflow-y-auto shrink-0">
          <GerentesSidebar
            segmentId={activeSegmentId}
            gerentes={gerentes}
            activeId={activeGerenteId}
            onSelect={setActiveGerenteId}
          />
        </div>
        <div className="flex-1 overflow-y-auto pl-2 pb-8">
          <LeadsTable gerenteId={activeGerenteId} />
        </div>
      </div>

      <SegmentModal
        open={segmentModalOpen}
        onOpenChange={setSegmentModalOpen}
        segment={editingSegment}
      />
      <ImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        segments={segments}
        gerentes={gerentes}
      />
    </div>
  )
}
