
'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  CalendarDays, 
  DollarSign, 
  Scissors,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface DashboardStats {
  totalPacientes: number
  agendamentosHoje: number
  receitaMes: number
  procedimentosAtivos: number
  agendamentosPendentes: number
  tratamentosRealizados: number
}

interface DashboardContentProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    agendamentosHoje: 0,
    receitaMes: 0,
    procedimentosAtivos: 0,
    agendamentosPendentes: 0,
    tratamentosRealizados: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    if (mounted) {
      fetchStats()
    }
  }, [mounted])

  if (!mounted) {
    return null
  }

  const statsCards = [
    {
      title: 'Total de Pacientes',
      value: stats.totalPacientes,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Agendamentos Hoje',
      value: stats.agendamentosHoje,
      icon: CalendarDays,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${Number(stats.receitaMes || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
    },
    {
      title: 'Procedimentos Ativos',
      value: stats.procedimentosAtivos,
      icon: Scissors,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Agendamentos Pendentes',
      value: stats.agendamentosPendentes,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Tratamentos Realizados',
      value: stats.tratamentosRealizados,
      icon: CheckCircle,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground"
          >
            Bem-vindo, {user?.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Aqui está um resumo das atividades da sua clínica hoje.
          </motion.p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {statsCards.map((card, index) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full ${card.bgColor}`}>
                      <Icon className={`h-4 w-4 ${card.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {loading ? (
                        <div className="animate-pulse bg-muted h-8 w-20 rounded" />
                      ) : (
                        card.value
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Novo Paciente</h3>
                      <p className="text-sm text-muted-foreground">Cadastrar paciente</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-8 w-8 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Agendar</h3>
                      <p className="text-sm text-muted-foreground">Novo agendamento</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Scissors className="h-8 w-8 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Procedimentos</h3>
                      <p className="text-sm text-muted-foreground">Gerenciar serviços</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-8 w-8 text-emerald-600" />
                    <div>
                      <h3 className="font-semibold">Financeiro</h3>
                      <p className="text-sm text-muted-foreground">Ver relatórios</p>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
