
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Phone,
  Mail,
  Calendar
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PatientDialog } from './patient-dialog'

interface Patient {
  id: string
  name: string
  email?: string
  phone: string
  cpf?: string
  birthDate?: string
  address?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  observations?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export function PatientsContent() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const { toast } = useToast()

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      } else {
        throw new Error('Erro ao carregar pacientes')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pacientes',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  const filteredPatients = patients?.filter(patient =>
    patient?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
    patient?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
    patient?.phone?.includes(searchTerm || '') ||
    patient?.cpf?.includes(searchTerm || '')
  ) || []

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) {
      return
    }

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Paciente excluído com sucesso',
        })
        fetchPatients()
      } else {
        throw new Error('Erro ao excluir paciente')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o paciente',
        variant: 'destructive',
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedPatient(null)
    fetchPatients()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch {
      return 'Data inválida'
    }
  }

  const formatPhone = (phone: string) => {
    return phone?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3') || phone
  }

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
              <Users className="h-8 w-8 text-primary" />
              Pacientes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Gerencie os pacientes da clínica
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
              Novo Paciente
            </Button>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, telefone ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{patients?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Total de Pacientes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {patients?.filter(p => p?.active)?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Pacientes Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{filteredPatients?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Resultados da Busca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Patients List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lista de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-muted rounded" />
                    ))}
                  </div>
                </div>
              ) : filteredPatients?.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPatients?.map((patient, index) => (
                    <motion.div
                      key={patient?.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{patient?.name}</h3>
                            <Badge variant={patient?.active ? "default" : "secondary"}>
                              {patient?.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            {patient?.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {patient.email}
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {formatPhone(patient?.phone)}
                            </div>
                            {patient?.cpf && (
                              <div className="flex items-center gap-2">
                                <span className="font-mono">CPF:</span>
                                {patient.cpf}
                              </div>
                            )}
                            {patient?.birthDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {formatDate(patient.birthDate)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(patient)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(patient?.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
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

      <PatientDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        patient={selectedPatient}
      />
    </DashboardLayout>
  )
}
