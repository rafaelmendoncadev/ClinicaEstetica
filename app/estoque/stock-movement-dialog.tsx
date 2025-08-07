
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Plus, Minus, Package } from 'lucide-react'

interface Product {
  id: string
  name: string
  brand?: string
  category: string
  unit: string
  currentStock: number
  minStock: number
  costPrice: number
}

interface StockMovementDialogProps {
  isOpen: boolean
  onClose: () => void
  product?: Product | null
  type: 'IN' | 'OUT'
  userId: string
}

interface FormData {
  quantity: string
  reason: string
}

export function StockMovementDialog({ 
  isOpen, 
  onClose, 
  product, 
  type, 
  userId 
}: StockMovementDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    quantity: '',
    reason: '',
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const quantity = parseFloat(formData.quantity)
    if (quantity <= 0) {
      toast({
        title: 'Erro',
        description: 'A quantidade deve ser maior que zero',
        variant: 'destructive',
      })
      return
    }

    if (type === 'OUT' && quantity > product.currentStock) {
      toast({
        title: 'Erro',
        description: 'Quantidade insuficiente em estoque',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/stock-movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          type,
          quantity,
          reason: formData.reason,
          userId,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: `Movimentação de ${type === 'IN' ? 'entrada' : 'saída'} registrada com sucesso`,
        })
        setFormData({ quantity: '', reason: '' })
        onClose()
      } else {
        const error = await response.text()
        throw new Error(error)
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Erro ao registrar movimentação',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getDefaultReasons = () => {
    if (type === 'IN') {
      return [
        'Compra de estoque',
        'Reposição',
        'Devolução de cliente',
        'Ajuste de inventário',
        'Transferência entre lojas'
      ]
    } else {
      return [
        'Uso em tratamento',
        'Venda',
        'Produto vencido',
        'Perda/Quebra',
        'Amostra grátis',
        'Ajuste de inventário'
      ]
    }
  }

  const newStock = product ? (
    type === 'IN' 
      ? product.currentStock + parseFloat(formData.quantity || '0')
      : product.currentStock - parseFloat(formData.quantity || '0')
  ) : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === 'IN' ? (
              <>
                <Plus className="h-5 w-5 text-green-600" />
                Entrada de Estoque
              </>
            ) : (
              <>
                <Minus className="h-5 w-5 text-red-600" />
                Saída de Estoque
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            Registrar movimentação de {type === 'IN' ? 'entrada' : 'saída'} para o produto
          </DialogDescription>
        </DialogHeader>

        {product && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                {product.brand && (
                  <p className="text-sm text-muted-foreground">{product.brand}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Estoque Atual</p>
                <p className="font-medium">{product.currentStock} {product.unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Estoque Mínimo</p>
                <p className="font-medium">{product.minStock} {product.unit}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">
              Quantidade *
              {product && type === 'OUT' && (
                <span className="text-sm text-muted-foreground ml-2">
                  (Máx: {product.currentStock} {product.unit})
                </span>
              )}
            </Label>
            <Input
              id="quantity"
              type="number"
              step="0.001"
              min="0"
              max={type === 'OUT' ? product?.currentStock : undefined}
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              required
              disabled={loading}
              placeholder={`0 ${product?.unit || ''}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
              required
              disabled={loading}
              rows={3}
              placeholder="Descreva o motivo da movimentação..."
            />
            <div className="text-xs text-muted-foreground">
              <p>Sugestões:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {getDefaultReasons().map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handleChange('reason', reason)}
                    className="px-2 py-1 bg-muted hover:bg-muted/80 rounded text-xs"
                    disabled={loading}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {formData.quantity && parseFloat(formData.quantity) > 0 && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Previsão após movimentação:</h4>
              <div className="flex items-center justify-between text-sm">
                <span>Novo estoque:</span>
                <span className={`font-medium ${
                  newStock < (product?.minStock || 0) 
                    ? 'text-yellow-600' 
                    : newStock === 0 
                      ? 'text-red-600' 
                      : 'text-green-600'
                }`}>
                  {newStock.toFixed(3)} {product?.unit}
                  {newStock < (product?.minStock || 0) && newStock > 0 && ' (Abaixo do mínimo)'}
                  {newStock === 0 && ' (Sem estoque)'}
                </span>
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
              disabled={loading || !formData.quantity || !formData.reason}
              className={type === 'IN' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar {type === 'IN' ? 'Entrada' : 'Saída'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
