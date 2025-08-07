
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  Clock,
  DollarSign,
  Tag,
  Scissors
} from 'lucide-react'
import { Procedure } from '@/lib/types'
import { ProcedureDialog } from '@/components/procedure-dialog'

export const dynamic = 'force-dynamic'

export default function ProcedimentosPage() {
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [filteredProcedures, setFilteredProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProcedure, setEditingProcedure] = useState<Procedure | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProcedures()
  }, [])

  useEffect(() => {
    const filtered = procedures.filter(procedure =>
      procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      procedure.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (procedure.description && procedure.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredProcedures(filtered)
  }, [procedures, searchTerm])

  const fetchProcedures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/procedures')
      if (response.ok) {
        const data = await response.json()
        setProcedures(data)
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar os procedimentos',
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

  const handleEdit = (procedure: Procedure) => {
    setEditingProcedure(procedure)
    setIsDialogOpen(true)
  }

  const handleDelete = async (procedureId: string) => {
    if (!confirm('Tem certeza que deseja excluir este procedimento?')) return

    try {
      const response = await fetch(`/api/procedures/${procedureId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Procedimento excluído com sucesso',
        })
        fetchProcedures()
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível excluir o procedimento',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro de conexão',
        variant: 'destructive',
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingProcedure(null)
    fetchProcedures()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours === 0) {
      return `${minutes}min`
    } else if (remainingMinutes === 0) {
      return `${hours}h`
    } else {
      return `${hours}h ${remainingMinutes}min`
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              Procedimentos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Gerencie os procedimentos oferecidos pela clínica
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Procedimento
            </Button>
          </motion.div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center space-x-4"
        >
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar procedimentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Procedures Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded" />
                      <div className="h-4 bg-muted rounded w-2/3" />
                      <div className="h-8 bg-muted rounded w-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredProcedures.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Scissors className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">
              {searchTerm ? 'Nenhum procedimento encontrado' : 'Nenhum procedimento cadastrado'}
            </h3>
            <p className="mt-2 text-muted-foreground">
              {searchTerm 
                ? 'Tente ajustar os termos da busca'
                : 'Comece cadastrando o primeiro procedimento da clínica'
              }
            </p>
            {!searchTerm && (
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Procedimento
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProcedures.map((procedure, index) => (
              <motion.div
                key={procedure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{procedure.name}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {procedure.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(procedure)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(procedure.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {procedure.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {procedure.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatDuration(procedure.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">
                          {formatPrice(procedure.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        procedure.active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {procedure.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog */}
      <ProcedureDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        procedure={editingProcedure}
      />
    </DashboardLayout>
  )
}
