import React, { createContext, useContext, useState, useMemo } from 'react'

export type Branch = 'Automóveis/Frotas' | 'Saúde' | 'Vida' | 'Odonto' | 'RC' | 'Patrimonial'
export type Status = 'Pendente' | 'Agendado' | 'Realizado' | 'Cancelado' | 'Em Negociação'

export interface Consultant {
  id: string
  name: string
  avatar: string
  color: string
  goals: {
    calls: number
    visits: number
    sales: number
  }
  actual: {
    calls: number
    visits: number
    sales: number
  }
  salesHistory: { date: string; amount: number }[]
}

export interface Lead {
  id: string
  name: string
  company: string
  branch: Branch
  status: Status
  lastContact: string
  consultantId: string
  value: number
  scheduledDate?: string
}

interface MainStore {
  consultants: Consultant[]
  leads: Lead[]
  updateLeadStatus: (id: string, status: Status) => void
}

const mockConsultants: Consultant[] = [
  {
    id: 'c1',
    name: 'Ana Silva',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    color: '#3B82F6',
    goals: { calls: 150, visits: 30, sales: 50000 },
    actual: { calls: 160, visits: 35, sales: 55000 },
    salesHistory: [
      { date: '2023-10-01', amount: 5000 },
      { date: '2023-10-08', amount: 15000 },
      { date: '2023-10-15', amount: 35000 },
      { date: '2023-10-22', amount: 55000 },
    ],
  },
  {
    id: 'c2',
    name: 'Carlos Mendes',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    color: '#10B981',
    goals: { calls: 150, visits: 30, sales: 50000 },
    actual: { calls: 120, visits: 20, sales: 30000 },
    salesHistory: [
      { date: '2023-10-01', amount: 2000 },
      { date: '2023-10-08', amount: 10000 },
      { date: '2023-10-15', amount: 20000 },
      { date: '2023-10-22', amount: 30000 },
    ],
  },
  {
    id: 'c3',
    name: 'Beatriz Costa',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    color: '#F59E0B',
    goals: { calls: 120, visits: 25, sales: 40000 },
    actual: { calls: 130, visits: 28, sales: 42000 },
    salesHistory: [
      { date: '2023-10-01', amount: 8000 },
      { date: '2023-10-08', amount: 18000 },
      { date: '2023-10-15', amount: 32000 },
      { date: '2023-10-22', amount: 42000 },
    ],
  },
]

const ninetyDaysAgo = new Date()
ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 95)
const today = new Date()

const mockLeads: Lead[] = [
  {
    id: 'l1',
    name: 'João Santos',
    company: 'TechCorp',
    branch: 'Saúde',
    status: 'Pendente',
    lastContact: ninetyDaysAgo.toISOString(),
    consultantId: 'c1',
    value: 12000,
  },
  {
    id: 'l2',
    name: 'Maria Oliveira',
    company: 'Logistica Sul',
    branch: 'Automóveis/Frotas',
    status: 'Agendado',
    scheduledDate: today.toISOString(),
    lastContact: new Date().toISOString(),
    consultantId: 'c2',
    value: 25000,
  },
  {
    id: 'l3',
    name: 'Roberto Carlos',
    company: 'Construtora RC',
    branch: 'RC',
    status: 'Realizado',
    lastContact: new Date().toISOString(),
    consultantId: 'c3',
    value: 8500,
  },
  {
    id: 'l4',
    name: 'Fernanda Lima',
    company: 'Varejo Bom',
    branch: 'Patrimonial',
    status: 'Pendente',
    lastContact: ninetyDaysAgo.toISOString(),
    consultantId: 'c2',
    value: 15000,
  },
  {
    id: 'l5',
    name: 'Carlos Eduardo',
    company: 'Transportes Rápidos',
    branch: 'Automóveis/Frotas',
    status: 'Agendado',
    scheduledDate: today.toISOString(),
    lastContact: new Date().toISOString(),
    consultantId: 'c1',
    value: 40000,
  },
  {
    id: 'l6',
    name: 'Ana Paula',
    company: 'Consultoria RH',
    branch: 'Vida',
    status: 'Em Negociação',
    lastContact: new Date().toISOString(),
    consultantId: 'c3',
    value: 5000,
  },
]

const MainContext = createContext<MainStore | null>(null)

export function MainProvider({ children }: { children: React.ReactNode }) {
  const [consultants] = useState<Consultant[]>(mockConsultants)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)

  const updateLeadStatus = (id: string, status: Status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const value = useMemo(
    () => ({
      consultants,
      leads,
      updateLeadStatus,
    }),
    [consultants, leads],
  )

  return React.createElement(MainContext.Provider, { value }, children)
}

export default function useMainStore() {
  const context = useContext(MainContext)
  if (!context) throw new Error('useMainStore must be used within MainProvider')
  return context
}
