import { Outlet, Link, useLocation } from 'react-router-dom'
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
  LayoutDashboard,
  Users,
  Target,
  CalendarDays,
  ListTodo,
  Bell,
  Search,
  UserCircle,
  Plus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AppSidebar() {
  const location = useLocation()

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads & Clientes', path: '/leads', icon: Users },
    { name: 'Metas & Evolução', path: '/goals', icon: Target },
    { name: 'Agenda Compartilhada', path: '/agenda', icon: CalendarDays },
    { name: 'Planejador Semanal', path: '/planner', icon: ListTodo },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-lg">
            TF
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">TFC Gestão</span>
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
              <Button
                variant="ghost"
                size="icon"
                className="relative text-muted-foreground hover:text-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center gap-3 border-l pl-4 ml-2">
                <UserCircle className="h-8 w-8 text-primary" />
                <div className="text-sm hidden md:block">
                  <p className="font-semibold leading-none">Gestor Op.</p>
                  <p className="text-xs text-muted-foreground mt-1">TFC Corretora</p>
                </div>
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
