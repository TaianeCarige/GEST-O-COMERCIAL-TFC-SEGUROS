import React, { useState } from 'react'
import useAppStore, { Role, PermissionKey, Consultant } from '@/stores/useAppStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ShieldAlert, UserPlus, Database, Save, Eye, EyeOff } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

const PERMISSIONS_LIST: { key: PermissionKey; label: string; desc: string }[] = [
  {
    key: 'leads_tab',
    label: 'Aba Mestra: Leads e Clientes',
    desc: 'Acesso à listagem geral de leads',
  },
  { key: 'tab_1327', label: 'Sub-aba: 1327', desc: 'Visualização da carteira 1327 e gerentes' },
  { key: 'tab_corporate', label: 'Sub-aba: Corporate', desc: 'Visualização de contas Corporate' },
  {
    key: 'import_leads',
    label: 'Importação de Planilhas',
    desc: 'Permissão para importar listas de leads',
  },
  {
    key: 'global_dashboard',
    label: 'Dashboard Global',
    desc: 'Acesso aos relatórios consolidados gerenciais',
  },
  {
    key: 'user_management',
    label: 'Gestão de Usuários',
    desc: 'Criação e edição de acessos da equipe',
  },
  {
    key: 'script_generator',
    label: 'Gerador de Scripts VIP',
    desc: 'Acesso à ferramenta de prospecção B2B',
  },
]

function EditableUserRow({ user }: { user: Consultant }) {
  const { updateConsultant } = useAppStore()
  const { toast } = useToast()

  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [role, setRole] = useState<Role>(user.role)
  const [password, setPassword] = useState(user.password || '')
  const [showPassword, setShowPassword] = useState(false)

  const hasChanges =
    name !== user.name || email !== user.email || role !== user.role || password !== user.password

  const handleSave = () => {
    updateConsultant(user.id, { name, email, role, password })
    toast({
      title: 'Usuário Atualizado',
      description: 'As alterações foram salvas com sucesso.',
    })
  }

  return (
    <TableRow>
      <TableCell className="p-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 min-w-[120px]"
        />
      </TableCell>
      <TableCell className="p-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9 min-w-[160px]"
        />
      </TableCell>
      <TableCell className="p-2">
        <Select value={role} onValueChange={(v: Role) => setRole(v)}>
          <SelectTrigger className="h-9 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Consultor">Consultor</SelectItem>
            <SelectItem value="Gestora">Gestora</SelectItem>
            <SelectItem value="Agência">Agência</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="p-2">
        <div className="flex items-center gap-1">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-9 w-[140px]"
            placeholder="Senha..."
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </TableCell>
      <TableCell className="p-2 text-right">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges}
          className="h-9 w-full md:w-auto whitespace-nowrap"
        >
          <Save className="w-4 h-4 mr-2 hidden md:block" /> Salvar
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default function Users() {
  const { consultants, currentUser, addConsultant, permissions, updatePermission } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser) || consultants[0]
  const myPermissions = permissions[me?.role || 'Consultor']
  const isManager = me?.role === 'Gestora' || me?.role === 'Agência'

  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<Role>('Consultor')

  const handleAddUser = () => {
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return
    addConsultant({
      name: newName,
      email: newEmail,
      password: newPassword,
      role: newRole,
      color: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`,
      callsGoal: 100,
      callsRealized: 0,
      visitsGoal: 20,
      visitsRealized: 0,
      salesGoal: 50000,
      salesRealized: 0,
    })
    setNewName('')
    setNewEmail('')
    setNewPassword('')
    setNewRole('Consultor')
    toast({
      title: 'Usuário Criado',
      description: 'O novo usuário foi adicionado com sucesso.',
    })
  }

  const handleTogglePermission = (role: Role, key: PermissionKey, value: boolean) => {
    updatePermission(role, key, value)
    toast({
      title: 'Permissão Atualizada',
      description: `A permissão foi ${value ? 'concedida' : 'revogada'} para o perfil ${role}.`,
    })
  }

  if (!myPermissions.user_management) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 animate-fade-in-up">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold">Acesso Restrito</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Esta área é exclusiva. Você não tem permissões para acessar as configurações de usuários.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Usuários</h1>
        <p className="text-muted-foreground mt-1">
          Crie acessos, defina permissões e gerencie a equipe do Ecossistema TFC.
        </p>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <Database className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary font-semibold">
          Nota sobre Persistência de Dados
        </AlertTitle>
        <AlertDescription className="text-muted-foreground mt-1">
          Como o banco de dados ainda não está conectado (Supabase ou Skip Cloud), todos os usuários
          registrados e senhas estão sendo salvos apenas na sessão atual do navegador e serão
          perdidos ao atualizar a página.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="equipe">Gestão de Equipe</TabsTrigger>
          {isManager && <TabsTrigger value="permissoes">Matriz de Permissões</TabsTrigger>}
        </TabsList>

        <TabsContent value="equipe" className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Novo Usuário
              </CardTitle>
              <CardDescription>
                Crie um novo acesso ao sistema e defina sua senha inicial.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-5 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Ana Souza"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Ex: ana@tfc.com.br"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso</Label>
                  <Select value={newRole} onValueChange={(v: Role) => setNewRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultor">Consultor</SelectItem>
                      <SelectItem value="Gestora">Gestora</SelectItem>
                      <SelectItem value="Agência">Agência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Senha inicial"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddUser}
                  disabled={!newName.trim() || !newEmail.trim() || !newPassword.trim()}
                >
                  Criar Acesso
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipe Cadastrada</CardTitle>
              <CardDescription>
                Edite nomes, perfis e senhas dos colaboradores ativos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Senha</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {consultants.map((c) => (
                      <EditableUserRow key={c.id} user={c} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isManager && (
          <TabsContent value="permissoes">
            <Card>
              <CardHeader>
                <CardTitle>Matriz de Permissões (RBAC)</CardTitle>
                <CardDescription>
                  Configure o acesso detalhado para cada perfil do sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">Funcionalidade</TableHead>
                        <TableHead className="text-center">Agência</TableHead>
                        <TableHead className="text-center">Gestora</TableHead>
                        <TableHead className="text-center">Consultor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {PERMISSIONS_LIST.map((perm) => (
                        <TableRow key={perm.key}>
                          <TableCell>
                            <p className="font-medium">{perm.label}</p>
                            <p className="text-xs text-muted-foreground">{perm.desc}</p>
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={permissions['Agência'][perm.key]}
                              onCheckedChange={(val) =>
                                handleTogglePermission('Agência', perm.key, val)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={permissions['Gestora'][perm.key]}
                              onCheckedChange={(val) =>
                                handleTogglePermission('Gestora', perm.key, val)
                              }
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Switch
                              checked={permissions['Consultor'][perm.key]}
                              onCheckedChange={(val) =>
                                handleTogglePermission('Consultor', perm.key, val)
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
