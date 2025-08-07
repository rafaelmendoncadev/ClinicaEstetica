
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface PatientData {
  name: string
  phone: string
  email?: string
}

interface ProcedureData {
  name: string
  duration: number
  price: number
}

interface UserData {
  name: string
}

interface AppointmentDialogData {
  id: string
  patientId: string
  procedureId: string
  userId: string
  date: string
  startTime: string
  endTime: string
  status: string
  notes?: string
  patient: PatientData
  procedure: ProcedureData
  user: UserData
}

interface AppointmentDialogProps {
  isOpen: boolean
  onClose: () => void
  appointment?: AppointmentDialogData | null
}

interface FormData {
  patientId: string
  procedureId: string
  userId: string
  date: string
  startTime: string
  notes: string
  status: string
}

export function AppointmentDialog({ isOpen, onClose, appointment }: AppointmentDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    patientId: '',
    procedureId: '',
    userId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    notes: '',
    status: 'SCHEDULED',
  })
  const [patients, setPatients] = useState<any[]>([])
  const [procedures, setProcedures] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setDataLoading(true)
      const [patientsRes, proceduresRes, usersRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/procedures'),
        fetch('/api/users')
      ])

      const [patientsData, proceduresData, usersData] = await Promise.all([
        patientsRes.json(),
        proceduresRes.json(),
        usersRes.json()
      ])

      setPatients(patientsData || [])
      setProcedures(proceduresData || [])
      setUsers(usersData?.filter((u: any) => u?.role !== 'RECEPTIONIST') || [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao carregar dados do formulário',
        variant: 'destructive',
      })
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        procedureId: appointment.procedureId,
        userId: appointment.userId,
        date: appointment.date?.split('T')[0] || '',
        startTime: appointment.startTime,
        notes: appointment.notes || '',
        status: appointment.status,
      })
    } else {
      setFormData({
        patientId: '',
        procedureId: '',
        userId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        notes: '',
        status: 'SCHEDULED',
      })
    }
  }, [appointment])

  const calculateEndTime = (startTime: string, procedureId: string) => {
    const procedure = procedures?.find(p => p?.id === procedureId)
    if (!procedure) return startTime

    const [hours, minutes] = startTime.split(':').map(Number)
    const endDate = new Date()
    endDate.setHours(hours, minutes + procedure.duration, 0, 0)
    
    return endDate.toTimeString().slice(0, 5)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endTime = calculateEndTime(formData.startTime, formData.procedureId)
      
      const submitData = {
        ...formData,
        endTime,
        date: new Date(formData.date).toISOString(),
      }

      const method = appointment ? 'PUT' : 'POST'
      const url = appointment ? `/api/appointments/${appointment.id}` : '/api/appointments'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: appointment 
            ? 'Agendamento atualizado com sucesso' 
            : 'Agendamento criado com sucesso',
        })
        onClose()
      } else {
        const error = await response.text()
        throw new Error(error)
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: appointment 
          ? 'Erro ao atualizar agendamento' 
          : 'Erro ao criar agendamento',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const selectedProcedure = procedures?.find(p => p?.id === formData.procedureId)
  const endTime = selectedProcedure ? calculateEndTime(formData.startTime, formData.procedureId) : formData.startTime

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
          <DialogDescription>
            {appointment 
              ? 'Atualize as informações do agendamento' 
              : 'Preencha os dados do novo agendamento'}
          </DialogDescription>
        </DialogHeader>

        {dataLoading ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientId">Paciente *</Label>
                <Select
                  value={formData.patientId}
                  onValueChange={(value) => handleChange('patientId', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((patient) => (
                      <SelectItem key={patient?.id} value={patient?.id}>
                        {patient?.name} - {patient?.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="procedureId">Procedimento *</Label>
                <Select
                  value={formData.procedureId}
                  onValueChange={(value) => handleChange('procedureId', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    {procedures?.map((procedure) => (
                      <SelectItem key={procedure?.id} value={procedure?.id}>
                        {procedure?.name} - {procedure?.duration}min - R$ {procedure?.price?.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">Profissional *</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => handleChange('userId', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um profissional" />
                  </SelectTrigger>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user?.id} value={user?.id}>
                        {user?.name} - {user?.role === 'ADMIN' ? 'Admin' : 'Esteticista'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Horário de Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label>Horário de Término</Label>
                <Input
                  type="time"
                  value={endTime}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Calculado automaticamente
                </p>
              </div>

              {appointment && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleChange('status', value)}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                      <SelectItem value="NO_SHOW">Não Compareceu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Informações adicionais sobre o agendamento..."
              />
            </div>

            {selectedProcedure && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Resumo do Procedimento</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Procedimento:</strong> {selectedProcedure.name}</p>
                  <p><strong>Duração:</strong> {selectedProcedure.duration} minutos</p>
                  <p><strong>Preço:</strong> R$ {selectedProcedure.price?.toFixed(2)}</p>
                  <p><strong>Horário:</strong> {formData.startTime} - {endTime}</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.patientId || !formData.procedureId || !formData.userId}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {appointment ? 'Atualizar' : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
