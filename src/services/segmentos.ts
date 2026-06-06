import pb from '@/lib/pocketbase/client'

export const getSegmentos = () => pb.collection('segmentos').getFullList({ sort: 'created' })
export const createSegmento = (data: { name: string }) => pb.collection('segmentos').create(data)
export const updateSegmento = (id: string, data: { name: string }) =>
  pb.collection('segmentos').update(id, data)
export const deleteSegmento = (id: string) => pb.collection('segmentos').delete(id)
