import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppStoreProvider } from '@/stores/useAppStore'

import Layout from './components/Layout'
import { AuthProvider, useAuth } from '@/hooks/use-auth'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
import Index from './pages/Index'
import Leads from './pages/Leads'
import Goals from './pages/Goals'
import Agenda from './pages/Agenda'
import Planner from './pages/Planner'
import B2BExpert from './pages/B2BExpert'
import ScriptGenerator from './pages/ScriptGenerator'
import Prospecting from './pages/Prospecting'
import Reports from './pages/Reports'
import NotFound from './pages/NotFound'
import AvailableLeads from './pages/AvailableLeads'
import Reactivation from './pages/Reactivation'
import VIPMentor from './pages/VIPMentor'
import Users from './pages/Users'
import Login from './pages/Login'
import { Navigate } from 'react-router-dom'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <AppStoreProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Index />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/available-leads" element={<AvailableLeads />} />
              <Route path="/reactivation" element={<Reactivation />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/b2b-expert" element={<B2BExpert />} />
              <Route path="/vip-mentor" element={<VIPMentor />} />
              <Route path="/prospecting" element={<Prospecting />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AppStoreProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
