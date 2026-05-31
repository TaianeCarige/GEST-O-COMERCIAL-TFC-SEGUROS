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
import NotFound from './pages/NotFound'

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
            <Route path="/goals" element={<Goals />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/planner" element={<Planner />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AppStoreProvider>
  </BrowserRouter>
)

export default App
