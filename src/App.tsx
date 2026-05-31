import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStoreProvider } from '@/stores/useAppStore'

import Layout from './components/Layout'
import Index from './pages/Index'
import Leads from './pages/Leads'
import Goals from './pages/Goals'
import Agenda from './pages/Agenda'
import Planner from './pages/Planner'
import B2BExpert from './pages/B2BExpert'
import Prospecting from './pages/Prospecting'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'
import AvailableLeads from './pages/AvailableLeads'
import ScriptGenerator from './pages/ScriptGenerator'
import Reactivation from './pages/Reactivation'
import VIPMentor from './pages/VIPMentor'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AppStoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/available-leads" element={<AvailableLeads />} />
            <Route path="/scripts" element={<ScriptGenerator />} />
            <Route path="/reactivation" element={<Reactivation />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/b2b-expert" element={<B2BExpert />} />
            <Route path="/vip-mentor" element={<VIPMentor />} />
            <Route path="/prospecting" element={<Prospecting />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppStoreProvider>
  </BrowserRouter>
)

export default App
