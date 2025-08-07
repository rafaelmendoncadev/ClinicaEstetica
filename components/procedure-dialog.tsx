
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Procedure } from '@/lib/types'
import { Loader2 } from 'lucide-react'

interface ProcedureDialogProps {
  open: boolean
  onClose: () => void
  procedure?: Procedure | null
}

interface ProcedureFormData {
  name: string
  description?: string
  duration: number
  price: number
  category: string
  active: boolean
}

const categories = [
  'Tratamento Facial',
  'Tratamento Corporal',
  'Depilação',
  'Massagem',
  'Peeling',
  'Limpeza de Pele',
  'Hidratação',
  'Rejuvenescimento',
  'Outros'
]

export function ProcedureDialog({ open, onClose, procedure }: ProcedureDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProcedureFormData>({
    defaultValues: {
      name: '',
      description: '',
      duration: 60,
      price: 0,
      category: '',
      active: true,
    }
  })

  const selectedCategory = watch('category')
  const isActive = watch('active')

  useEffect(() => {
    if (procedure) {
      reset({
        name: procedure.name,
        description: procedure.description || '',
        duration: procedure.duration,
        price: procedure.price,
        category: procedure.category,
        active: procedure.active,
      })
    } else {
      reset({
        name: '',
        description: '',
        duration: 60,
        price: 0,
        category: '',
        active: true,
      })
    }
  }, [procedure, reset])

  const onSubmit = async (data: ProcedureFormData) => {
    try {
      setLoading(true)
      
      const url = procedure ? `/api/procedures/${procedure.id}` : '/api/procedures'
      const method = procedure ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Procedimento ${procedure ? 'atualizado' : 'criado'} com sucesso`,
        })
        onClose()
      } else {
        const error = await response.json()
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao salvar procedimento',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {procedure ? 'Editar Procedimento' : 'Novo Procedimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Procedimento *</Label>
            <Input
              id="name"
              {...register('name', { 
                required: 'Nome é obrigatório',
                minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
              })}
              placeholder="Ex: Limpeza de Pele"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição detalhada do procedimento..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos) *</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="480"
                step="15"
                {...register('duration', { 
                  required: 'Duração é obrigatória',
                  min: { value: 15, message: 'Duração mínima é 15 minutos' },
                  max: { value: 480, message: 'Duração máxima é 8 horas' }
                })}
                className={errors.duration ? 'border-red-500' : ''}
              />
              {errors.duration && (
                <p className="text-sm text-red-500">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                {...register('price', { 
                  required: 'Preço é obrigatório',
                  min: { value: 0, message: 'Preço deve ser positivo' }
                })}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={(checked) => setValue('active', checked)}
            />
            <Label htmlFor="active">Procedimento ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                procedure ? 'Atualizar' : 'Criar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
