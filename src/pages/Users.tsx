import React, { useState } from 'react'
import useAppStore, { Role } from '@/stores/useAppStore'
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

export default function Users() {
  const { consultants, currentUser, addConsultant, resetPassword } = useAppStore()
  const { toast } = useToast()

  const me = consultants.find((c) => c.id === currentUser)
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

  if (!isManager) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <h2 className="text-2xl font-bold">Acesso Restrito</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Esta área é exclusiva para a Gestão. Você não tem permissões para acessar as configurações
          de usuários.
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
          Persistência de Dados Necessária
        </AlertTitle>
        <AlertDescription className="text-muted-foreground mt-1">
          Para garantir a segurança, restrição de acessos RBAC reais e salvamento permanente dos
          dados de usuários e logs de leads, você precisa conectar o banco de dados. Atualmente o
          sistema está rodando com armazenamento local (Mock).
        </AlertDescription>
        <div className="mt-3">
          <Button
            size="sm"
            variant="outline"
            className="border-primary text-primary hover:bg-primary/10 bg-background"
          >
            Conectar ao Supabase / Skip Cloud
          </Button>
        </div>
      </Alert>

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
                  <SelectItem value="Gestora">Gestor</SelectItem>
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
            <CardDescription>
              Gerencie as permissões e senhas dos colaboradores ativos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Nível de Acesso</TableHead>
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
                            c.role === 'Gestora' || c.role === 'Agência' ? 'default' : 'secondary'
                          }
                          className={c.role === 'Gestora' ? 'bg-primary/80' : ''}
                        >
                          {c.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleResetPassword(c.id)}>
                          <KeyRound className="w-4 h-4 mr-2 text-muted-foreground" /> Resetar Senha
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
    </div>
  )
}
