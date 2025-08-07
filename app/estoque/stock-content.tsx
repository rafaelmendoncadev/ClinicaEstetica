
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Search, 
  TrendingUp,
  TrendingDown,
  History,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { StockMovementDialog } from './stock-movement-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

interface StockMovement {
  id: string
  type: 'IN' | 'OUT'
  quantity: number
  reason: string
  date: string
  product: {
    name: string
    unit: string
  }
  user: {
    name: string
  }
}

interface StockContentProps {
  user: {
    name?: string | null
    id?: string | null
    role?: string | null
  }
}

export function StockContent({ user }: StockContentProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [movementType, setMovementType] = useState<'IN' | 'OUT'>('IN')
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      const [productsRes, movementsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/stock-movements')
      ])

      if (productsRes.ok && movementsRes.ok) {
        const [productsData, movementsData] = await Promise.all([
          productsRes.json(),
          movementsRes.json()
        ])
        setProducts(productsData)
        setMovements(movementsData)
      } else {
        throw new Error('Erro ao carregar dados')
      }
    } catch (error) {
      console.error('Erro:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
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

  const filteredMovements = movements?.filter(movement => {
    return movementTypeFilter === 'all' || movement?.type === movementTypeFilter
  }) || []

  const handleStockMovement = (product: Product, type: 'IN' | 'OUT') => {
    setSelectedProduct(product)
    setMovementType(type)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedProduct(null)
    fetchData()
  }

  const getCategories = () => {
    const categories = Array.from(new Set(products?.map(p => p?.category)))
    return categories.sort()
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

  const getStats = () => {
    const total = products?.length || 0
    const lowStock = products?.filter(p => p?.currentStock <= p?.minStock)?.length || 0
    const outOfStock = products?.filter(p => p?.currentStock === 0)?.length || 0
    const totalValue = products?.reduce((sum, p) => sum + (p?.costPrice * p?.currentStock), 0) || 0

    return { total, lowStock, outOfStock, totalValue }
  }

  const stats = getStats()

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Data inválida'
    }
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
              <ShoppingBag className="h-8 w-8 text-primary" />
              Controle de Estoque
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Gerencie movimentações de entrada e saída
            </motion.p>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Produtos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                  <TrendingDown className="h-6 w-6 text-yellow-600" />
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
                  <TrendingUp className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Produtos</TabsTrigger>
              <TabsTrigger value="movements">Movimentações</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
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
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="good">Estoque Normal</SelectItem>
                    <SelectItem value="low">Estoque Baixo</SelectItem>
                    <SelectItem value="out">Sem Estoque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Products List */}
              <Card>
                <CardHeader>
                  <CardTitle>Produtos ({filteredProducts?.length})</CardTitle>
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
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhum produto encontrado
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts?.map((product, index) => {
                        const stockStatus = getStockStatus(product)
                        
                        return (
                          <motion.div
                            key={product?.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">{product?.name}</h3>
                                  <Badge className={stockStatus.color}>
                                    {stockStatus.label}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-sm">
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground">Categoria</p>
                                    <p className="font-medium">{product?.category}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground">Estoque Atual</p>
                                    <p className="font-medium">
                                      {product?.currentStock} {product?.unit}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-muted-foreground">Estoque Mínimo</p>
                                    <p className="font-medium">
                                      {product?.minStock} {product?.unit}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStockMovement(product, 'IN')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Entrada
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStockMovement(product, 'OUT')}
                                  className="text-red-600 hover:text-red-700"
                                  disabled={product?.currentStock === 0}
                                >
                                  <Minus className="h-4 w-4 mr-1" />
                                  Saída
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="movements" className="space-y-6">
              {/* Movement Filters */}
              <div className="flex items-center gap-4">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Tipos</SelectItem>
                    <SelectItem value="IN">Entrada</SelectItem>
                    <SelectItem value="OUT">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Movements List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Histórico de Movimentações ({filteredMovements?.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-pulse space-y-4">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-16 bg-muted rounded" />
                        ))}
                      </div>
                    </div>
                  ) : filteredMovements?.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Nenhuma movimentação encontrada
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredMovements?.map((movement, index) => (
                        <motion.div
                          key={movement?.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-3 lg:space-y-0">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={
                                  movement?.type === 'IN' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }>
                                  {movement?.type === 'IN' ? (
                                    <>
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Entrada
                                    </>
                                  ) : (
                                    <>
                                      <TrendingDown className="h-3 w-3 mr-1" />
                                      Saída
                                    </>
                                  )}
                                </Badge>
                                <h3 className="font-semibold">{movement?.product?.name}</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Quantidade</p>
                                  <p className="font-medium">
                                    {movement?.type === 'IN' ? '+' : '-'}{movement?.quantity} {movement?.product?.unit}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-muted-foreground">Motivo</p>
                                  <p className="font-medium">{movement?.reason}</p>
                                </div>
                              </div>
                            </div>

                            <div className="text-right text-sm">
                              <p className="text-muted-foreground">Por: {movement?.user?.name}</p>
                              <p className="font-medium">{formatDate(movement?.date)}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <StockMovementDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        product={selectedProduct}
        type={movementType}
        userId={user?.id || ''}
      />
    </DashboardLayout>
  )
}
