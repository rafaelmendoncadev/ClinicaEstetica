
'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User, Lock, Sparkles, Database } from 'lucide-react'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)
  const [needsSeeding, setNeedsSeeding] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Verificar se existem usuários no localStorage
    const users = localStorage.getItem('clinic_users')
    if (!users || JSON.parse(users).length === 0) {
      setNeedsSeeding(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Erro ao fazer login',
          description: 'Email ou senha inválidos',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Login realizado com sucesso',
          description: 'Bem-vindo ao sistema!',
        })
        router.push('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro inesperado',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      })

      if (response.ok) {
        toast({
          title: 'Dados criados com sucesso!',
          description: 'Agora você pode fazer login com as credenciais padrão',
        })
        setNeedsSeeding(false)
      } else {
        throw new Error('Erro ao criar dados')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar os dados iniciais',
        variant: 'destructive',
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const fillTestCredentials = () => {
    setEmail('teste@teste.com')
    setPassword('123')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Clínica de Estética
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {needsSeeding && (
            <div className="mt-4">
              <Button
                onClick={handleSeedDatabase}
                disabled={isSeeding}
                variant="outline"
                className="w-full"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando dados iniciais...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Criar dados iniciais
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t">
            <div className="text-sm text-muted-foreground text-center">
              <p className="font-medium mb-3">🔑 Contas de teste disponíveis:</p>
              
              {/* Conta de teste em destaque */}
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border">
                <p className="font-semibold text-blue-700 dark:text-blue-300 mb-2">⚡ TESTE RÁPIDO</p>
                <div className="flex items-center justify-center gap-2 text-sm mb-2">
                  <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">teste@teste.com</code>
                  <span>/</span>
                  <code className="px-2 py-1 bg-white dark:bg-gray-800 rounded">123</code>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestCredentials}
                  className="text-xs h-7"
                >
                  🚀 Preencher automaticamente
                </Button>
              </div>
              
              {/* Outras contas */}
              <details className="text-xs">
                <summary className="cursor-pointer font-medium mb-2 hover:text-foreground transition-colors">
                  Ver mais contas de teste
                </summary>
                <div className="space-y-1 mt-2 pt-2 border-t">
                  <p><strong>Admin:</strong> admin@clinica.com / admin123</p>
                  <p><strong>Esteticista:</strong> maria@clinica.com / esteticista123</p>
                  <p><strong>Recepcionista:</strong> ana@clinica.com / recepcao123</p>
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
