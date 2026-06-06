import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { getMapeamentos, deleteMapeamento } from '@/services/mapeamentos'
import { useRealtime } from '@/hooks/use-realtime'
import { useToast } from '@/hooks/use-toast'
import { ClientModal } from './ClientModal'

export function LeadsTable({ gerenteId }: { gerenteId: string }) {
  const [data, setData] = useState<any[]>([])
  const [editingClient, setEditingClient] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  const loadData = async () => {
    if (!gerenteId) return setData([])
    try {
      setData(await getMapeamentos(gerenteId))
    } catch {
      /* intentionally ignored */
    }
  }

  useEffect(() => {
    loadData()
  }, [gerenteId])
  useRealtime('mapeamentos', () => loadData(), !!gerenteId)

  const handleEdit = (client: any) => {
    setEditingClient(client)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir cliente?')) return
    try {
      await deleteMapeamento(id)
      toast({ title: 'Removido' })
    } catch {
      /* intentionally ignored */
    }
  }

  if (!gerenteId)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Selecione um Gerente para ver os clientes.
      </div>
    )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Clientes e Leads</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingClient(null)
            setModalOpen(true)
          }}
        >
          Adicionar Cliente
        </Button>
      </div>
      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Último Contato</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary">
                    {item.status || item.type}
                  </span>
                </TableCell>
                <TableCell>
                  {item.last_contact_at ? (
                    <div className="text-xs">
                      {new Date(item.last_contact_at).toLocaleDateString()}
                      <br />
                      <span className="text-muted-foreground">
                        {item.expand?.last_contact_by?.name || item.expand?.last_contact_by?.email}
                      </span>
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum cliente cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <ClientModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        gerenteId={gerenteId}
        client={editingClient}
      />
    </div>
  )
}
