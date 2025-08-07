
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CalendarDays, 
  Plus, 
  Filter, 
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  User,
  Scissors
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AppointmentDialog } from './appointment-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Appointment {
  id: string
  patientId: string
  procedureId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes?: string
  createdAt: string
  updatedAt: string
  patient: {
    name: string
    phone: string
    email?: string
  }
  procedure: {
    name: string
    duration: number
    price: number
  }
  user: {
    name: string
  }
}

const statusColors = {
  SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
  COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
  NO_SHOW: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
}

const statusLabels = {
  SCHEDULED: 'Agendado',
  CONFIRMED: 'Confirmado',
  IN_PROGRESS: 'Em Andamento',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
  NO_SHOW: 'Não Compareceu',
}

export function AppointmentsContent() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { toast } = useToast()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/appointments?date=${selectedDate}&status=${statusFilter}`)
      if (response.ok) {
        const data = await response.json()
        setAppointments(data)
      } else {
        throw new Error('Erro ao carregar agendamentos')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os agendamentos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [selectedDate, statusFilter])

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Status atualizado com sucesso',
        })
        fetchAppointments()
      } else {
        throw new Error('Erro ao atualizar status')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedAppointment(null)
    fetchAppointments()
  }

  const formatTime = (time: string) => {
    return time?.slice(0, 5) || ''
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return 'Data inválida'
    }
  }

  const formatPhone = (phone: string) => {
    return phone?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') || phone
  }

  const getStatsForDate = () => {
    const total = appointments?.length || 0
    const confirmed = appointments?.filter(a => a?.status === 'CONFIRMED')?.length || 0
    const completed = appointments?.filter(a => a?.status === 'COMPLETED')?.length || 0
    const cancelled = appointments?.filter(a => a?.status === 'CANCELLED' || a?.status === 'NO_SHOW')?.length || 0

    return { total, confirmed, completed, cancelled }
  }

  const stats = getStatsForDate()

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground flex items-center gap-3"
            >
              <CalendarDays className="h-8 w-8 text-primary" />
              Agendamentos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              {formatDate(selectedDate)}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="flex items-center gap-2">
            <label htmlFor="date" className="text-sm font-medium">Data:</label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="SCHEDULED">Agendado</SelectItem>
                <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
                <SelectItem value="NO_SHOW">Não Compareceu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.confirmed}</p>
                  <p className="text-sm text-muted-foreground">Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.cancelled}</p>
                  <p className="text-sm text-muted-foreground">Cancelados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Appointments List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lista de Agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              ) : appointments?.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum agendamento encontrado para esta data
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments?.map((appointment, index) => (
                    <motion.div
                      key={appointment?.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="text-lg font-medium">
                              {formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}
                            </div>
                            <Badge className={statusColors[appointment?.status] || statusColors.SCHEDULED}>
                              {statusLabels[appointment?.status] || 'Agendado'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment?.patient?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                {formatPhone(appointment?.patient?.phone)}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Scissors className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">{appointment?.procedure?.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                {appointment?.procedure?.duration} min - R$ {appointment?.procedure?.price?.toFixed(2)}
                              </div>
                            </div>
                          </div>

                          {appointment?.notes && (
                            <div className="mt-3 text-sm text-muted-foreground">
                              <strong>Observações:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {appointment?.status === 'SCHEDULED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment?.id, 'CONFIRMED')}
                              className="text-green-600 hover:text-green-700"
                            >
                              Confirmar
                            </Button>
                          )}
                          
                          {appointment?.status === 'CONFIRMED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment?.id, 'IN_PROGRESS')}
                              className="text-yellow-600 hover:text-yellow-700"
                            >
                              Iniciar
                            </Button>
                          )}
                          
                          {appointment?.status === 'IN_PROGRESS' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(appointment?.id, 'COMPLETED')}
                              className="text-emerald-600 hover:text-emerald-700"
                            >
                              Concluir
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(appointment)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <AppointmentDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        appointment={selectedAppointment}
      />
    </DashboardLayout>
  )
}
