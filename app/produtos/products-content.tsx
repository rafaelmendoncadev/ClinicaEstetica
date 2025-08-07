
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ProductDialog } from './product-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

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
  createdAt: string
  updatedAt: string
}

export function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        throw new Error('Erro ao carregar produtos')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os produtos',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products?.filter(product => {
    const matchesSearch = 
      product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
      product?.brand?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '') ||
      product?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase() || '')

    const matchesCategory = categoryFilter === 'all' || product?.category === categoryFilter

    let matchesStock = true
    if (stockFilter === 'low') {
      matchesStock = product?.currentStock <= product?.minStock
    } else if (stockFilter === 'out') {
      matchesStock = product?.currentStock === 0
    } else if (stockFilter === 'good') {
      matchesStock = product?.currentStock > product?.minStock
    }

    return matchesSearch && matchesCategory && matchesStock
  }) || []

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Produto excluído com sucesso',
        })
        fetchProducts()
      } else {
        throw new Error('Erro ao excluir produto')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o produto',
        variant: 'destructive',
      })
    }
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
    fetchProducts()
  }

  const getStockStatus = (product: Product) => {
    if (product?.currentStock === 0) {
      return { label: 'Sem estoque', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
    }
    if (product?.currentStock <= product?.minStock) {
      return { label: 'Estoque baixo', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' }
    }
    return { label: 'Estoque normal', color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' }
  }

  const getCategories = () => {
    const categories = Array.from(new Set(products?.map(p => p?.category)))
    return categories.sort()
  }

  const getStats = () => {
    const total = products?.length || 0
    const lowStock = products?.filter(p => p?.currentStock <= p?.minStock)?.length || 0
    const outOfStock = products?.filter(p => p?.currentStock === 0)?.length || 0
    const totalValue = products?.reduce((sum, p) => sum + (p?.costPrice * p?.currentStock), 0) || 0

    return { total, lowStock, outOfStock, totalValue }
  }

  const stats = getStats()

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
              <Package className="h-8 w-8 text-primary" />
              Produtos
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Gerencie o inventário de produtos da clínica
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
              Novo Produto
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, marca ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Categorias</SelectItem>
              {getCategories().map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status do Estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="good">Estoque Normal</SelectItem>
              <SelectItem value="low">Estoque Baixo</SelectItem>
              <SelectItem value="out">Sem Estoque</SelectItem>
            </SelectContent>
          </Select>
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
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total de Produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.lowStock}</p>
                  <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.outOfStock}</p>
                  <p className="text-sm text-muted-foreground">Sem Estoque</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-full">
                  <DollarSign className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Lista de Produtos ({filteredProducts?.length})</CardTitle>
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
              ) : filteredProducts?.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm || categoryFilter !== 'all' || stockFilter !== 'all'
                      ? 'Nenhum produto encontrado com os filtros aplicados'
                      : 'Nenhum produto cadastrado'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts?.map((product, index) => {
                    const stockStatus = getStockStatus(product)
                    const profit = product?.salePrice ? ((product.salePrice - product.costPrice) / product.costPrice * 100) : 0
                    
                    return (
                      <motion.div
                        key={product?.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg line-clamp-2">{product?.name}</h3>
                              {product?.brand && (
                                <p className="text-sm text-muted-foreground">{product.brand}</p>
                              )}
                              <Badge variant="secondary" className="mt-1">
                                {product?.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(product?.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Estoque:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {product?.currentStock} {product?.unit}
                                </span>
                                {product?.currentStock <= product?.minStock && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Mínimo:</span>
                              <span>{product?.minStock} {product?.unit}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Custo:</span>
                              <span>R$ {product?.costPrice?.toFixed(2)}</span>
                            </div>

                            {product?.salePrice && (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Venda:</span>
                                  <span>R$ {product.salePrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Margem:</span>
                                  <span className={profit > 0 ? "text-green-600" : "text-red-600"}>
                                    {profit > 0 && '+'}{profit.toFixed(1)}%
                                  </span>
                                </div>
                              </>
                            )}

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-medium">
                                R$ {(product?.costPrice * product?.currentStock)?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t">
                            <Badge className={stockStatus.color}>
                              {stockStatus.label}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        product={selectedProduct}
      />
    </DashboardLayout>
  )
}
