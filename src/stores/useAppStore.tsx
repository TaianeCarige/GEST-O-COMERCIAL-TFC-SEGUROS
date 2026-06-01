import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Branch =
  | 'Automóveis/Frotas'
  | 'Saúde'
  | 'Vida'
  | 'Odonto'
  | 'RC'
  | 'Patrimonial'
  | 'Outros'
export type Status =
  | 'Prospecção'
  | 'Cotação'
  | 'Fechamento'
  | 'Visita Pendente'
  | 'Agendado'
  | 'Em Negociação'
  | 'Fechado'
  | 'Perdido'
  | 'Objeção'

export type Role = 'Agência' | 'Gestora' | 'Consultor'

export type PermissionKey =
  | 'leads_tab'
  | 'tab_1327'
  | 'tab_corporate'
  | 'import_leads'
  | 'global_dashboard'
  | 'user_management'
  | 'script_generator'

export type RolePermissions = Record<Role, Record<PermissionKey, boolean>>

export type PolicyType =
  | 'Automóvel'
  | 'Frota'
  | 'Saúde'
  | 'Dental'
  | 'Vida Funcionários'
  | 'Vida Individual'
  | 'Responsabilidade Civil'
  | 'Seguros Patrimoniais'
  | 'Outros'

export interface Consultant {
  id: string
  name: string
  color: string
  role: Role
  managerId?: string
  callsGoal: number
  callsRealized: number
  visitsGoal: number
  visitsRealized: number
  salesGoal: number
  salesRealized: number
}

export interface Policy {
  id: string
  type: PolicyType
  expirationDate: string
}

export interface Interaction {
  id: string
  date: string
  userId: string
  userName: string
  note: string
  newStatus: Status
}

export interface Lead {
  id: string
  name: string
  cnpj?: string
  industry?: string
  contactName?: string
  contactPhone?: string
  branch: Branch
  status: Status
  lastContact: string
  consultantId: string
  value: number
  scheduledDate?: string
  policies: Policy[]
  history: Interaction[]
  category?: '1327' | 'Corporate'
  gerenteId?: string
}

export interface Gerente1327 {
  id: string
  name: string
}

export type ReminderStatus = 'Pendente' | 'Concluído'

export interface Reminder {
  id: string
  userId: string
  description: string
  dateTime: string
  observations: string
  status: ReminderStatus
  history: { id: string; date: string; note: string }[]
}

export interface AvailableLead {
  id: string
  name: string
  branch: Branch
  revenue: string
  contact: string
  role: string
  value: number
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
    role: 'Gestora',
    callsGoal: 0,
    callsRealized: 0,
    visitsGoal: 0,
    visitsRealized: 0,
    salesGoal: 0,
    salesRealized: 0,
  },
  {
    id: '2',
    name: 'Carlos',
    color: 'hsl(var(--chart-2))',
    role: 'Gestora',
    managerId: '1',
    callsGoal: 100,
    callsRealized: 110,
    visitsGoal: 20,
    visitsRealized: 15,
    salesGoal: 50000,
    salesRealized: 45000,
  },
  {
    id: '3',
    name: 'Mariana',
    color: 'hsl(var(--chart-3))',
    role: 'Consultor',
    managerId: '2',
    callsGoal: 90,
    callsRealized: 60,
    visitsGoal: 18,
    visitsRealized: 10,
    salesGoal: 45000,
    salesRealized: 20000,
  },
  {
    id: '4',
    name: 'João',
    color: 'hsl(var(--chart-4))',
    role: 'Consultor',
    managerId: '2',
    callsGoal: 80,
    callsRealized: 75,
    visitsGoal: 15,
    visitsRealized: 12,
    salesGoal: 30000,
    salesRealized: 25000,
  },
]

const MOCK_LEADS: Lead[] = [
  {
    id: 'l1',
    name: 'TechCorp SA',
    category: '1327',
    gerenteId: 'g1',
    cnpj: '12.345.678/0001-90',
    industry: 'Tecnologia',
    contactName: 'Ana Silva',
    contactPhone: '(11) 99999-1111',
    branch: 'Saúde',
    status: 'Cotação',
    lastContact: getDaysAgo(5),
    consultantId: '3',
    value: 15000,
    scheduledDate: now.toISOString(),
    policies: [{ id: 'p1', type: 'Saúde', expirationDate: getDaysAhead(20) }],
    history: [
      {
        id: 'h1',
        date: getDaysAgo(5),
        userId: '3',
        userName: 'Mariana',
        note: 'Apresentação enviada e cotação em andamento.',
        newStatus: 'Cotação',
      },
    ],
  },
  {
    id: 'l2',
    name: 'Logística Alfa',
    category: 'Corporate',
    cnpj: '98.765.432/0001-10',
    industry: 'Logística',
    contactName: 'Carlos Souza',
    contactPhone: '(11) 98888-2222',
    branch: 'Automóveis/Frotas',
    status: 'Prospecção',
    lastContact: getDaysAgo(95),
    consultantId: '4',
    value: 25000,
    policies: [],
    history: [],
  },
  {
    id: 'l3',
    name: 'Indústrias Sigma',
    category: '1327',
    gerenteId: 'g2',
    branch: 'Patrimonial',
    status: 'Fechamento',
    lastContact: getDaysAgo(2),
    consultantId: '3',
    value: 85000,
    policies: [{ id: 'p3', type: 'Seguros Patrimoniais', expirationDate: getDaysAhead(150) }],
    history: [],
  },
  {
    id: 'l4',
    name: 'Construtora Beta',
    category: 'Corporate',
    branch: 'RC',
    status: 'Prospecção',
    lastContact: getDaysAgo(110),
    consultantId: '4',
    value: 30000,
    scheduledDate: getDaysAhead(1),
    policies: [{ id: 'p4', type: 'Responsabilidade Civil', expirationDate: getDaysAhead(10) }],
    history: [],
  },
  {
    id: 'l5',
    name: 'Clínica Sorriso',
    category: '1327',
    gerenteId: 'g1',
    branch: 'Odonto',
    status: 'Fechado',
    lastContact: getDaysAgo(10),
    consultantId: '2',
    value: 5000,
    policies: [],
    history: [],
  },
]

const MOCK_AVAILABLE_LEADS: AvailableLead[] = [
  {
    id: 'a1',
    name: 'Grupo ABC',
    branch: 'Saúde',
    revenue: 'R$ 10M - 50M',
    contact: 'Dr. Roberto',
    role: 'Diretor',
    value: 20000,
  },
  {
    id: 'a2',
    name: 'Indústrias Metal Fort',
    branch: 'Patrimonial',
    revenue: 'R$ 100M+',
    contact: 'Fernanda',
    role: 'CEO',
    value: 120000,
  },
]

const DEFAULT_PERMISSIONS: RolePermissions = {
  Agência: {
    leads_tab: true,
    tab_1327: true,
    tab_corporate: true,
    import_leads: true,
    global_dashboard: true,
    user_management: true,
    script_generator: true,
  },
  Gestora: {
    leads_tab: true,
    tab_1327: true,
    tab_corporate: true,
    import_leads: true,
    global_dashboard: true,
    user_management: true,
    script_generator: true,
  },
  Consultor: {
    leads_tab: true,
    tab_1327: true,
    tab_corporate: true,
    import_leads: false,
    global_dashboard: false,
    user_management: false,
    script_generator: true,
  },
}

interface AppStore {
  currentUser: string
  setCurrentUser: (id: string) => void
  permissions: RolePermissions
  updatePermission: (role: Role, key: PermissionKey, value: boolean) => void
  leads: Lead[]
  availableLeads: AvailableLead[]
  consultants: Consultant[]
  gerentes1327: Gerente1327[]
  updateLeadStatus: (id: string, status: Status) => void
  updateLeadConsultant: (id: string, consultantId: string) => void
  getConsultant: (id: string) => Consultant | undefined
  claimLead: (leadId: string) => void
  updateLeadDetails: (id: string, details: Partial<Lead>) => void
  addPolicy: (leadId: string, policy: Omit<Policy, 'id'>) => void
  updatePolicyDate: (leadId: string, type: PolicyType, date: string) => void
  addInteraction: (leadId: string, note: string, newStatus: Status) => void
  addGerente1327: (name: string) => void
  updateConsultantGoals: (
    id: string,
    goals: { callsGoal: number; visitsGoal: number; salesGoal: number },
  ) => void
  importLeads: (gerenteId: string, category: '1327' | 'Corporate') => void
  addConsultant: (consultant: Omit<Consultant, 'id'>) => void
  resetPassword: (id: string) => void
  reminders: Reminder[]
  addReminder: (reminder: Omit<Reminder, 'id' | 'userId' | 'history'>) => void
  updateReminderStatus: (id: string, status: ReminderStatus) => void
  addReminderObservation: (id: string, note: string) => void
  deleteReminder: (id: string) => void
  editReminder: (id: string, details: Partial<Reminder>) => void
  deleteLead: (id: string) => void
}

const AppContext = createContext<AppStore | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<string>('1')
  const [permissions, setPermissions] = useState<RolePermissions>(DEFAULT_PERMISSIONS)
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [availableLeads, setAvailableLeads] = useState<AvailableLead[]>(MOCK_AVAILABLE_LEADS)
  const [consultants, setConsultants] = useState<Consultant[]>(MOCK_CONSULTANTS)
  const [gerentes1327, setGerentes1327] = useState<Gerente1327[]>([
    { id: 'g1', name: 'Gerente João' },
    { id: 'g2', name: 'Gerente Maria' },
  ])
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 'r1',
      userId: '1',
      description: 'Follow up com Indústrias Sigma',
      dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      observations: 'Revisar apólice atual e propor cross-sell',
      status: 'Pendente',
      history: [],
    },
  ])

  const addReminder = (reminder: Omit<Reminder, 'id' | 'userId' | 'history'>) => {
    setReminders((prev) => [
      ...prev,
      { ...reminder, id: `r-${Date.now()}`, userId: currentUser, history: [] },
    ])
  }

  const updateReminderStatus = (id: string, status: ReminderStatus) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const me = consultants.find((c) => c.id === currentUser)
          const dateObj = new Date()
          const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          const note = `Status alterado para ${status} - ${me?.name} - ${formattedDate}`
          return {
            ...r,
            status,
            history: [{ id: `h-${Date.now()}`, date: dateObj.toISOString(), note }, ...r.history],
          }
        }
        return r
      }),
    )
  }

  const addReminderObservation = (id: string, note: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const me = consultants.find((c) => c.id === currentUser)
          const dateObj = new Date()
          const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          const formattedNote = `${note} - ${me?.name} - ${formattedDate}`
          return {
            ...r,
            history: [
              { id: `h-${Date.now()}`, date: dateObj.toISOString(), note: formattedNote },
              ...r.history,
            ],
          }
        }
        return r
      }),
    )
  }

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id))
  }

  const updateLeadStatus = (id: string, status: Status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)))
  }

  const updateLeadConsultant = (id: string, consultantId: string) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, consultantId } : l)))
  }

  const getConsultant = (id: string) => consultants.find((c) => c.id === id)

  const claimLead = (leadId: string) => {
    const leadToClaim = availableLeads.find((l) => l.id === leadId)
    if (leadToClaim) {
      setAvailableLeads((prev) => prev.filter((l) => l.id !== leadId))
      setLeads((prev) => [
        ...prev,
        {
          id: `claimed-${leadId}-${Date.now()}`,
          name: leadToClaim.name,
          branch: leadToClaim.branch,
          status: 'Prospecção',
          lastContact: new Date().toISOString(),
          consultantId: currentUser,
          value: leadToClaim.value,
          policies: [],
          history: [],
        },
      ])
    }
  }

  const updateLeadDetails = (id: string, details: Partial<Lead>) => {
    const me = consultants.find((c) => c.id === currentUser)
    const dateObj = new Date()
    const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    const note = `Dados atualizados - ${me?.name} - ${formattedDate}`

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return {
            ...l,
            ...details,
            history: [
              {
                id: `h-${Date.now()}`,
                date: dateObj.toISOString(),
                userId: me?.id || '',
                userName: me?.name || '',
                note,
                newStatus: l.status,
              },
              ...(l.history || []),
            ],
          }
        }
        return l
      }),
    )
  }

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id))
  }

  const editReminder = (id: string, details: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const me = consultants.find((c) => c.id === currentUser)
          const dateObj = new Date()
          const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
          const note = `Lembrete atualizado - ${me?.name} - ${formattedDate}`
          return {
            ...r,
            ...details,
            history: [{ id: `h-${Date.now()}`, date: dateObj.toISOString(), note }, ...r.history],
          }
        }
        return r
      }),
    )
  }

  const addPolicy = (leadId: string, policy: Omit<Policy, 'id'>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return { ...l, policies: [...(l.policies || []), { ...policy, id: `p-${Date.now()}` }] }
        }
        return l
      }),
    )
  }

  const updatePolicyDate = (leadId: string, type: PolicyType, date: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const policies = l.policies || []
          const existing = policies.find((p) => p.type === type)
          if (existing) {
            return {
              ...l,
              policies: policies.map((p) => (p.type === type ? { ...p, expirationDate: date } : p)),
            }
          } else {
            return {
              ...l,
              policies: [...policies, { id: `p-${Date.now()}`, type, expirationDate: date }],
            }
          }
        }
        return l
      }),
    )
  }

  const addInteraction = (leadId: string, note: string, newStatus: Status) => {
    const me = consultants.find((c) => c.id === currentUser)
    if (!me) return

    const dateObj = new Date()
    const formattedDate = `${dateObj.toLocaleDateString('pt-BR')} ${dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    const formattedNote = `${note} - ${me.name} - ${formattedDate}`

    const interaction: Interaction = {
      id: `h-${Date.now()}`,
      date: dateObj.toISOString(),
      userId: me.id,
      userName: me.name,
      note: formattedNote,
      newStatus,
    }
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            status: newStatus,
            lastContact: interaction.date,
            history: [interaction, ...(l.history || [])],
          }
        }
        return l
      }),
    )
  }

  const addGerente1327 = (name: string) => {
    setGerentes1327((prev) => [...prev, { id: `g-${Date.now()}`, name }])
  }

  const importLeads = (gerenteId: string, category: '1327' | 'Corporate') => {
    const newLead: Lead = {
      id: `imported-${Date.now()}`,
      name: 'Lead Importado ' + Math.floor(Math.random() * 1000),
      branch: 'Saúde',
      status: 'Prospecção',
      lastContact: new Date().toISOString(),
      consultantId: currentUser,
      value: 10000,
      policies: [],
      history: [],
      category,
      gerenteId,
    }
    setLeads((prev) => [...prev, newLead])
  }

  const addConsultant = (consultant: Omit<Consultant, 'id'>) => {
    setConsultants((prev) => [...prev, { ...consultant, id: `c-${Date.now()}` }])
  }

  const resetPassword = (id: string) => {
    console.log(`Reset password for consultant ${id}`)
  }

  const updateConsultantGoals = (
    id: string,
    goals: { callsGoal: number; visitsGoal: number; salesGoal: number },
  ) => {
    setConsultants((prev) => prev.map((c) => (c.id === id ? { ...c, ...goals } : c)))
  }

  const updatePermission = (role: Role, key: PermissionKey, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [key]: value,
      },
    }))
  }

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        currentUser,
        setCurrentUser,
        permissions,
        updatePermission,
        leads,
        availableLeads,
        consultants,
        gerentes1327,
        updateLeadStatus,
        updateLeadConsultant,
        getConsultant,
        claimLead,
        updateLeadDetails,
        addPolicy,
        updatePolicyDate,
        addInteraction,
        addGerente1327,
        importLeads,
        addConsultant,
        resetPassword,
        updateConsultantGoals,
        reminders,
        addReminder,
        updateReminderStatus,
        addReminderObservation,
        deleteReminder,
        editReminder,
        deleteLead,
      },
    },
    children,
  )
}

export default function useAppStore() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}
