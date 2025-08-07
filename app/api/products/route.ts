
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const products = db.findAllProducts()
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
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

    const data = await request.json()

    const product = db.createProduct({
      name: data.name,
      brand: data.brand,
      category: data.category,
      unit: data.unit,
      costPrice: data.costPrice,
      salePrice: data.salePrice,
      minStock: data.minStock ?? 0,
      currentStock: data.currentStock ?? 0,
      active: data.active ?? true,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
