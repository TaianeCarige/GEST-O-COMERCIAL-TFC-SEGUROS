import pb from '@/lib/pocketbase/client'

export const getGerentes = () => pb.collection('gerentes_carteira').getFullList({ sort: 'created' })
export const createGerente = (data: { name: string; segmento_id: string }) =>
  pb.collection('gerentes_carteira').create(data)
export const updateGerente = (id: string, data: { name: string }) =>
  pb.collection('gerentes_carteira').update(id, data)
export const deleteGerente = (id: string) => pb.collection('gerentes_carteira').delete(id)
