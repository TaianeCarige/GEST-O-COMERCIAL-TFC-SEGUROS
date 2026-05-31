import React, { useState } from 'react'
import useAppStore, { Role, PermissionKey } from '@/stores/useAppStore'
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
import { Badge } from '@/components/ui/badge'
import { ShieldAlert, KeyRound, UserPlus, Database } from 'lucide-react'
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

export default function Users() {
  const { consultants, currentUser, addConsultant, resetPassword, permissions, updatePermission } =
    useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
  const myPermissions = permissions[me?.role || 'Consultor']
  const isManager = me?.role === 'Gestora' || me?.role === 'Agência'

  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState<Role>('Consultor')

  const handleAddUser = () => {
    if (!newName) return
    addConsultant({
      name: newName,
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
    toast({ title: 'Usuário Criado', description: 'O novo usuário foi adicionado com sucesso.' })
  }

  const handleResetPassword = (id: string) => {
    resetPassword(id)
    toast({
      title: 'Senha Resetada',
      description: 'Um link de recuperação foi enviado para o email do usuário.',
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
        <AlertTitle className="text-primary font-semibold">Persistência de Dados</AlertTitle>
        <AlertDescription className="text-muted-foreground mt-1">
          As alterações de permissões e usuários estão sendo salvas no state temporário. Para
          persistência definitiva e aplicação segura do RBAC, conecte com o banco de dados (Supabase
          ou Skip Cloud).
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="equipe" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="equipe">Gestão de Equipe</TabsTrigger>
          {isManager && <TabsTrigger value="permissoes">Matriz de Permissões</TabsTrigger>}
        </TabsList>

        <TabsContent value="equipe" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" /> Novo Usuário
                </CardTitle>
                <CardDescription>Crie um novo acesso ao sistema.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Ana Souza"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nível de Acesso (Cargo)</Label>
                  <Select value={newRole} onValueChange={(v: Role) => setNewRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultor">Colaborador / Consultor</SelectItem>
                      <SelectItem value="Gestora">Gestora</SelectItem>
                      <SelectItem value="Agência">Agência (Admin)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full mt-2" onClick={handleAddUser} disabled={!newName.trim()}>
                  Criar Acesso
                </Button>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Equipe Cadastrada</CardTitle>
                <CardDescription>Gerencie as senhas dos colaboradores ativos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Perfil</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {consultants.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                c.role === 'Gestora' || c.role === 'Agência'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className={c.role === 'Gestora' ? 'bg-primary/80' : ''}
                            >
                              {c.role === 'Consultor' ? 'Colaborador' : c.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResetPassword(c.id)}
                            >
                              <KeyRound className="w-4 h-4 mr-2 text-muted-foreground" /> Resetar
                              Senha
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
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
                        <TableHead className="text-center">Colaborador</TableHead>
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
