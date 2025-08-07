
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/localStorage'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const procedures = db.findAllProcedures()
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(procedures)
  } catch (error) {
    console.error('Erro ao buscar procedimentos:', error)
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar permissões (apenas ADMIN e ESTHETICIAN podem criar procedimentos)
    if (!['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, description, duration, price, category, active } = body

    // Validações
    if (!name || !category || !duration || price === undefined) {
      return NextResponse.json(
        { error: 'Dados obrigatórios faltando' },
        { status: 400 }
      )
    }

    // Verificar se já existe um procedimento com o mesmo nome
    const existingProcedure = db.findAllProcedures()
      .find(p => p.name === name && p.active)

    if (existingProcedure) {
      return NextResponse.json(
        { error: 'Já existe um procedimento com este nome' },
        { status: 400 }
      )
    }

    const procedure = db.createProcedure({
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
      category,
      active: active !== undefined ? active : true,
    })

    return NextResponse.json(procedure, { status: 201 })

  } catch (error) {
    console.error('Erro ao criar procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
