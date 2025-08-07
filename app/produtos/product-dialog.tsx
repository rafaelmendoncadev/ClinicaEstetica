
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

interface Product {
  id: string
  name: string
  brand?: string
  category: string
  unit: string
  costPrice: number
  salePrice?: number
  minStock: number
  currentStock: number
  active: boolean
}

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
}

interface FormData {
  name: string
  brand: string
  category: string
  unit: string
  costPrice: string
  salePrice: string
  minStock: string
  currentStock: string
  active: boolean
}

export function ProductDialog({ isOpen, onClose, product }: ProductDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    brand: '',
    category: '',
    unit: '',
    costPrice: '',
    salePrice: '',
    minStock: '',
    currentStock: '',
    active: true,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        category: product.category || '',
        unit: product.unit || '',
        costPrice: product.costPrice?.toString() || '',
        salePrice: product.salePrice?.toString() || '',
        minStock: product.minStock?.toString() || '',
        currentStock: product.currentStock?.toString() || '',
        active: product.active,
      })
    } else {
      setFormData({
        name: '',
        brand: '',
        category: '',
        unit: 'ml',
        costPrice: '',
        salePrice: '',
        minStock: '1',
        currentStock: '0',
        active: true,
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const method = product ? 'PUT' : 'POST'
      const url = product ? `/api/products/${product.id}` : '/api/products'
      
      // Prepare data for submission
      const submitData = {
        name: formData.name,
        brand: formData.brand || null,
        category: formData.category,
        unit: formData.unit,
        costPrice: parseFloat(formData.costPrice),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        minStock: parseInt(formData.minStock),
        currentStock: parseInt(formData.currentStock),
        active: formData.active,
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
          description: product 
            ? 'Produto atualizado com sucesso' 
            : 'Produto criado com sucesso',
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
        description: product 
          ? 'Erro ao atualizar produto' 
          : 'Erro ao criar produto',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const calculateMargin = () => {
    const cost = parseFloat(formData.costPrice)
    const sale = parseFloat(formData.salePrice)
    if (cost && sale && cost > 0) {
      return ((sale - cost) / cost * 100).toFixed(1)
    }
    return '0.0'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Atualize as informações do produto' 
              : 'Preencha os dados do novo produto'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: Sérum Vitamina C"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleChange('brand', e.target.value)}
                  disabled={loading}
                  placeholder="Ex: SkinCare Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: Sérum, Hidratante, Máscara"
                  list="categories"
                />
                <datalist id="categories">
                  <option value="Sérum" />
                  <option value="Hidratante" />
                  <option value="Máscara" />
                  <option value="Óleo" />
                  <option value="Creme" />
                  <option value="Protetor Solar" />
                  <option value="Peeling" />
                  <option value="Tônico" />
                  <option value="Limpeza" />
                  <option value="Outros" />
                </datalist>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade *</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Ex: ml, g, unidade"
                  list="units"
                />
                <datalist id="units">
                  <option value="ml" />
                  <option value="g" />
                  <option value="unidade" />
                  <option value="frasco" />
                  <option value="tubo" />
                </datalist>
              </div>
            </div>
          </div>

          {/* Preços */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preços</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.costPrice}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Preço de Venda</Label>
                <Input
                  id="salePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.salePrice}
                  onChange={(e) => handleChange('salePrice', e.target.value)}
                  disabled={loading}
                  placeholder="0.00"
                />
              </div>
            </div>

            {formData.costPrice && formData.salePrice && (
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">
                  <strong>Margem de Lucro:</strong> {calculateMargin()}%
                </p>
              </div>
            )}
          </div>

          {/* Estoque */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Controle de Estoque</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Estoque Atual *</Label>
                <Input
                  id="currentStock"
                  type="number"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => handleChange('currentStock', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Estoque Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => handleChange('minStock', e.target.value)}
                  required
                  disabled={loading}
                  placeholder="1"
                />
                <p className="text-xs text-muted-foreground">
                  Alerta será exibido quando o estoque atingir este valor
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => handleChange('active', checked)}
                disabled={loading}
              />
              <Label htmlFor="active">Produto ativo</Label>
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
              {product ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
