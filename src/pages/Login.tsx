import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '@/stores/useAppStore'
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
import { ShieldCheck } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAppStore()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const success = login(email, password)
    if (success) {
      navigate('/')
    } else {
      toast({
        title: 'Erro de autenticação',
        description: 'Email ou senha incorretos.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in-up">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center mb-2 shadow-sm">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">CRM TFC</CardTitle>
          <CardDescription>Faça login para acessar o Ecossistema Comercial</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@tfc.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
      </Card>
    </div>
  )
}
