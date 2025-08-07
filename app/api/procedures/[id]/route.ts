
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/localStorage'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar permissões
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

    // Verificar se o procedimento existe
    const existingProcedure = db.findProcedureById(params.id)

    if (!existingProcedure) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se não há outro procedimento com o mesmo nome
    const duplicateProcedure = db.findAllProcedures()
      .find(p => p.name === name && p.id !== params.id && p.active)

    if (duplicateProcedure) {
      return NextResponse.json(
        { error: 'Já existe outro procedimento com este nome' },
        { status: 400 }
      )
    }

    const updatedProcedure = db.updateProcedure(params.id, {
      name,
      description,
      duration: parseInt(duration),
      price: parseFloat(price),
      category,
      active: active !== undefined ? active : true,
    })

    return NextResponse.json(updatedProcedure)

  } catch (error) {
    console.error('Erro ao atualizar procedimento:', error)
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verificar permissões
    if (!['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
      return NextResponse.json(
        { error: 'Permissão negada' },
        { status: 403 }
      )
    }

    // Verificar se o procedimento existe
    const existingProcedure = db.findProcedureById(params.id)

    if (!existingProcedure) {
      return NextResponse.json(
        { error: 'Procedimento não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se há agendamentos ou tratamentos usando este procedimento
    const appointments = db.findAllAppointments().filter(a => a.procedureId === params.id)
    const treatments = db.findAllTreatments().filter(t => t.procedureId === params.id)

    if (appointments.length > 0 || treatments.length > 0) {
      // Soft delete - apenas desativar
      db.updateProcedure(params.id, { active: false })

      return NextResponse.json({
        message: 'Procedimento desativado pois possui agendamentos/tratamentos vinculados'
      })
    }

    // Hard delete se não há vínculos
    db.deleteProcedure(params.id)

    return NextResponse.json({
      message: 'Procedimento excluído com sucesso'
    })

  } catch (error) {
    console.error('Erro ao excluir procedimento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
