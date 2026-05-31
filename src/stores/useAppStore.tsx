import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Branch = 'Automóveis/Frotas' | 'Saúde' | 'Vida' | 'Odonto' | 'RC' | 'Patrimonial'
export type Status =
  | 'Visita Pendente'
  | 'Agendado'
  | 'Em Negociação'
  | 'Fechado'
  | 'Perdido'
  | 'Objeção'

export interface Consultant {
  id: string
  name: string
  color: string
  callsGoal: number
  callsRealized: number
  visitsGoal: number
  visitsRealized: number
  salesGoal: number
  salesRealized: number
}

export interface Lead {
  id: string
  name: string
  branch: Branch
  status: Status
  lastContact: string
  consultantId: string
  value: number
  scheduledDate?: string
}

const now = new Date()
const getDaysAgo = (days: number) =>
  new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString()
const getDaysAhead = (days: number) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: '1',
    name: 'Taiane',
    color: 'hsl(var(--chart-1))',
    callsGoal: 100,
    callsRealized: 110,
    visitsGoal: 20,
    visitsRealized: 15,
    salesGoal: 50000,
    salesRealized: 45000,
  },
  {
    id: '2',
    name: 'Carlos',
    color: 'hsl(var(--chart-2))',
    callsGoal: 80,
    callsRealized: 85,
    visitsGoal: 15,
    visitsRealized: 18,
    salesGoal: 40000,
    salesRealized: 52000,
  },
  {
    id: '3',
    name: 'Mariana',
    color: 'hsl(var(--chart-3))',
    callsGoal: 90,
    callsRealized: 60,
    visitsGoal: 18,
    visitsRealized: 10,
    salesGoal: 45000,
    salesRealized: 20000,
  },
]

const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'TechCorp SA',
    branch: 'Saúde',
    status: 'Agendado',
    lastContact: getDaysAgo(5),
    consultantId: '1',
    value: 15000,
    scheduledDate: now.toISOString(),
  },
  {
    id: 'l2',
    name: 'Logística Alfa',
    branch: 'Automóveis/Frotas',
    status: 'Visita Pendente',
    lastContact: getDaysAgo(2),
    consultantId: '2',
    value: 25000,
    scheduledDate: now.toISOString(),
  },
  {
    id: 'l3',
    name: 'Indústrias Sigma',
    branch: 'Patrimonial',
    status: 'Em Negociação',
    lastContact: getDaysAgo(95),
    consultantId: '1',
    value: 85000,
  },
  {
    id: 'l4',
    name: 'Construtora Beta',
    branch: 'RC',
    status: 'Visita Pendente',
    lastContact: getDaysAgo(110),
    consultantId: '3',
    value: 30000,
    scheduledDate: getDaysAhead(1),
  },
  {
    id: 'l5',
    name: 'Clínica Sorriso',
    branch: 'Odonto',
    status: 'Fechado',
    lastContact: getDaysAgo(10),
    consultantId: '2',
    value: 5000,
  },
  {
    id: 'l6',
    name: 'Varejo Central',
    branch: 'Vida',
    status: 'Agendado',
    lastContact: getDaysAgo(15),
    consultantId: '3',
    value: 12000,
    scheduledDate: getDaysAhead(3),
  },
  {
    id: 'l7',
    name: 'Transportes Rápidos',
    branch: 'Automóveis/Frotas',
    status: 'Perdido',
    lastContact: getDaysAgo(40),
    consultantId: '1',
    value: 45000,
  },
  {
    id: 'l8',
    name: 'Hospital Vida',
    branch: 'RC',
    status: 'Visita Pendente',
    lastContact: getDaysAgo(88),
    consultantId: '2',
    value: 60000,
  },
]

interface AppStore {
  leads: Lead[]
  consultants: Consultant[]
  updateLeadStatus: (id: string, status: Status) => void
  getConsultant: (id: string) => Consultant | undefined
}

const AppContext = createContext<AppStore | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [consultants] = useState<Consultant[]>(MOCK_CONSULTANTS)

  const updateLeadStatus = (id: string, status: Status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const getConsultant = (id: string) => consultants.find((c) => c.id === id)

  return React.createElement(
    AppContext.Provider,
    { value: { leads, consultants, updateLeadStatus, getConsultant } },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}
