import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { ShieldCheck, UserPlus, LogIn } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signIn, signUp } = useAuth()

  // Login State
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register State
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(loginEmail, loginPassword)
    if (!error) {
      navigate('/')
    } else {
      toast({
        title: 'Erro de autenticação',
        description: error.message || 'E-mail ou senha incorretos.',
        variant: 'destructive',
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (regPassword !== regConfirmPassword) {
      toast({
        title: 'Erro de validação',
        description: 'As senhas não coincidem.',
        variant: 'destructive',
      })
      return
    }
    if (regPassword.length < 6) {
      toast({
        title: 'Erro de validação',
        description: 'A senha deve ter no mínimo 6 caracteres.',
        variant: 'destructive',
      })
      return
    }

    const { error } = await signUp(regEmail, regPassword, regName)
    if (!error) {
      toast({
        title: 'Cadastro realizado',
        description: 'Bem-vindo ao CRM TFC!',
      })
      navigate('/')
    } else {
      toast({
        title: 'Erro no cadastro',
        description: error.message || 'Ocorreu um erro no cadastro.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-2 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">CRM TFC</CardTitle>
          <CardDescription>Acesse o Ecossistema Comercial</CardDescription>
        </CardHeader>

        <Tabs defaultValue="login" className="w-full">
          <div className="px-6 pt-2 pb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastro
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="login" className="m-0">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">E-mail</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="nome@tfc.com.br"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-xs text-muted-foreground pt-2">
                  <p className="font-semibold">Contas de teste:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      Gestora: <span className="font-mono">taiane@tfc.com.br</span> /{' '}
                      <span className="font-mono">senha</span>
                    </li>
                    <li>
                      Consultor: <span className="font-mono">mariana@tfc.com.br</span> /{' '}
                      <span className="font-mono">senha</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-11">
                  Entrar
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          <TabsContent value="register" className="m-0">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Nome Completo</Label>
                  <Input
                    id="reg-name"
                    placeholder="Seu nome"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">E-mail</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="nome@tfc.com.br"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Senha</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-confirm">Confirmar Senha</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Digite a senha novamente"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full h-11">
                  Criar Conta
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
