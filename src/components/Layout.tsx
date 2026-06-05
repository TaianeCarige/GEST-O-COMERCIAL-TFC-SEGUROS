import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  Users,
  Target,
  CalendarDays,
  ListTodo,
  Bell,
  Search,
  UserCircle,
  Plus,
  BriefcaseBusiness,
  Telescope,
  BarChart3,
  ChevronDown,
  FileText,
  History,
  Sparkles,
  Inbox,
  ShieldCheck,
  LogOut,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function AppSidebar() {
  const location = useLocation()
  const { consultants, currentUser, permissions } = useAppStore()
  const me = consultants.find((c) => c.id === currentUser)

  const myPermissions = permissions[me?.role || 'Consultor']

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
    { name: 'Leads & Clientes', path: '/leads', icon: Users, show: myPermissions.leads_tab },
    { name: 'Leads Disponíveis', path: '/available-leads', icon: Inbox, show: true },
    { name: 'Reativação (+90 dias)', path: '/reactivation', icon: History, show: true },
    { name: 'Metas & Evolução', path: '/goals', icon: Target, show: true },
    { name: 'Agenda', path: '/agenda', icon: CalendarDays, show: true },
    { name: 'Meus Lembretes', path: '/planner', icon: ListTodo, show: true },
    {
      name: 'Prospecção B2B (Scripts)',
      path: '/prospecting',
      icon: Telescope,
      show: myPermissions.script_generator,
    },
    { name: 'Especialista B2B', path: '/b2b-expert', icon: BriefcaseBusiness, show: true },
    { name: 'Mentor VIP', path: '/vip-mentor', icon: Sparkles, show: true },
    { name: 'Relatórios', path: '/reports', icon: BarChart3, show: myPermissions.global_dashboard },
    {
      name: 'Gestão de Usuários',
      path: '/users',
      icon: ShieldCheck,
      show: myPermissions.user_management,
    },
  ].filter((item) => item.show)

  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
            TF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground leading-tight">
              Ecossistema Comercial
            </span>
            <span className="text-xs text-muted-foreground">TFC Seguros</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-2">
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
                tooltip={item.name}
              >
                <Link to={item.path} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default function Layout() {
  const { consultants, currentUser, isAuthenticated, logout, reminders } = useAppStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const me = consultants.find((c) => c.id === currentUser)

  const myReminders =
    reminders?.filter((r) => r.userId === currentUser && r.status === 'Pendente') || []
  const upcomingReminders = myReminders.filter((r) => {
    const timeDiff = new Date(r.dateTime).getTime() - new Date().getTime()
    return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000 // up to 24 hours
  })

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b flex items-center justify-between px-4 md:px-6 bg-card sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar cliente ou lead..."
                  className="w-64 md:w-80 pl-9 bg-muted/50 border-none focus-visible:ring-1"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground"
                  >
                    <Bell className="h-5 w-5" />
                    {upcomingReminders.length > 0 && (
                      <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-sm">Notificações</h3>
                    {upcomingReminders.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhum lembrete próximo.</p>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {upcomingReminders.map((r) => (
                          <div key={r.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                            <p className="font-medium text-foreground">{r.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(r.dateTime).toLocaleString('pt-BR')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="border-l pl-4 ml-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto p-2 flex items-center gap-3 hover:bg-muted/50"
                    >
                      <UserCircle className="h-8 w-8 text-primary" />
                      <div className="text-sm hidden md:block text-left">
                        <p className="font-semibold leading-none">{me?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{me?.role}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair da conta</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 overflow-auto animate-fade-in-up">
            <Outlet />
          </main>

          {/* Mobile FAB */}
          <div className="fixed bottom-6 right-6 md:hidden z-50">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-elevation bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
