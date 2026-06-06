import pb from '@/lib/pocketbase/client'

export const getMapeamentos = (gerenteId?: string) =>
  pb.collection('mapeamentos').getFullList({
    filter: gerenteId ? `gerente_carteira_id = "${gerenteId}"` : '',
    expand: 'manager_id,gerente_carteira_id,last_contact_by',
    sort: '-created',
  })
export const createMapeamento = (data: any) => pb.collection('mapeamentos').create(data)
export const updateMapeamento = (id: string, data: any) =>
  pb.collection('mapeamentos').update(id, data)
export const deleteMapeamento = (id: string) => pb.collection('mapeamentos').delete(id)
