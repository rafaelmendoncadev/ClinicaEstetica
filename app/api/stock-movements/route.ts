
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'
import { StockMovementType } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const movements = db.findAllStockMovements()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 100) // Limitar a 100 registros mais recentes

    return NextResponse.json(movements)
  } catch (error) {
    console.error('Erro ao buscar movimentações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin ou esteticista
    if (!['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const { productId, type, quantity, reason, userId } = await request.json()

    // Buscar produto atual
    const product = db.findProductById(productId)

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 400 }
      )
    }

    // Verificar estoque para saídas
    if (type === 'OUT' && quantity > product.currentStock) {
      return NextResponse.json(
        { error: 'Quantidade insuficiente em estoque' },
        { status: 400 }
      )
    }

    // Criar registro de movimentação (que atualizará o estoque automaticamente)
    const movement = db.createStockMovement({
      productId,
      type: type as StockMovementType,
      quantity,
      reason,
      userId,
      date: new Date(),
    })

    // Buscar movimento com dados relacionados
    const result = db.findStockMovementById(movement.id)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Erro ao criar movimentação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
