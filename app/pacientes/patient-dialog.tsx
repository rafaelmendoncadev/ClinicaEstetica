
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
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
}

interface PatientDialogProps {
  isOpen: boolean
  onClose: () => void
  patient?: Patient | null
}

interface FormData {
  name: string
  email: string
  phone: string
  cpf: string
  birthDate: string
  address: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  observations: string
  active: boolean
}

export function PatientDialog({ isOpen, onClose, patient }: PatientDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    observations: '',
    active: true,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        email: patient.email || '',
        phone: patient.phone || '',
        cpf: patient.cpf || '',
        birthDate: patient.birthDate ? patient.birthDate.split('T')[0] : '',
        address: patient.address || '',
        neighborhood: patient.neighborhood || '',
        city: patient.city || '',
        state: patient.state || '',
        zipCode: patient.zipCode || '',
        observations: patient.observations || '',
        active: patient.active,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthDate: '',
        address: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        observations: '',
        active: true,
      })
    }
  }, [patient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = patient ? 'PUT' : 'POST'
      const url = patient ? `/api/patients/${patient.id}` : '/api/patients'
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        email: formData.email || null,
        cpf: formData.cpf || null,
        address: formData.address || null,
        neighborhood: formData.neighborhood || null,
        city: formData.city || null,
        state: formData.state || null,
        zipCode: formData.zipCode || null,
        observations: formData.observations || null,
      }

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
          description: patient 
            ? 'Paciente atualizado com sucesso' 
            : 'Paciente criado com sucesso',
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
        description: patient 
          ? 'Erro ao atualizar paciente' 
          : 'Erro ao criar paciente',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? 'Editar Paciente' : 'Novo Paciente'}
          </DialogTitle>
          <DialogDescription>
            {patient 
              ? 'Atualize as informações do paciente' 
              : 'Preencha os dados do novo paciente'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Dados Básicos</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={formData.cpf}
                  onChange={(e) => handleChange('cpf', e.target.value)}
                  disabled={loading}
                  placeholder="000.000.000-00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Data de Nascimento</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Endereço</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  disabled={loading}
                  placeholder="Rua, número"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => handleChange('neighborhood', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  disabled={loading}
                  placeholder="SP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">CEP</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleChange('zipCode', e.target.value)}
                  disabled={loading}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                disabled={loading}
                rows={3}
                placeholder="Informações adicionais sobre o paciente..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange('active', checked)}
                disabled={loading}
              />
              <Label htmlFor="active">Paciente ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {patient ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
