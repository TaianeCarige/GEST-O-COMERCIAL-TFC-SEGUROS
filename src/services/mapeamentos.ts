import pb from '@/lib/pocketbase/client'

export const getMapeamentos = () =>
  pb.collection('mapeamentos').getFullList({ expand: 'manager_id', sort: '-created' })
export const createMapeamento = (data: any) => pb.collection('mapeamentos').create(data)
export const updateMapeamento = (id: string, data: any) =>
  pb.collection('mapeamentos').update(id, data)
export const deleteMapeamento = (id: string) => pb.collection('mapeamentos').delete(id)
