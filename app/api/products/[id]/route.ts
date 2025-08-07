
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao buscar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        unit: data.unit,
        costPrice: data.costPrice,
        salePrice: data.salePrice,
        minStock: data.minStock,
        currentStock: data.currentStock,
        active: data.active,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Verificar se é admin ou esteticista
    if (!['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    // Verificar se o produto está sendo usado em procedimentos
    const procedureProducts = await prisma.procedureProduct.count({
      where: { productId: params.id },
    })

    const treatmentProducts = await prisma.treatmentProduct.count({
      where: { productId: params.id },
    })

    if (procedureProducts > 0 || treatmentProducts > 0) {
      // Apenas desativar se estiver sendo usado
      await prisma.product.update({
        where: { id: params.id },
        data: { active: false },
      })
    } else {
      // Excluir se não estiver sendo usado
      await prisma.product.delete({
        where: { id: params.id },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
