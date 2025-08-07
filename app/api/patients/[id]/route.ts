
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'

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

    const patient = db.findPatientById(params.id)

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
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

    const data = await request.json()

    const patient = db.updatePatient(params.id, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      address: data.address,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      observations: data.observations,
      active: data.active,
    })

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error)
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

    // Verificar se o paciente tem agendamentos ou tratamentos
    const appointments = db.findAllAppointments().filter(a => a.patientId === params.id)
    const treatments = db.findAllTreatments().filter(t => t.patientId === params.id)

    if (appointments.length > 0 || treatments.length > 0) {
      // Apenas desativar se tiver relacionamentos
      db.updatePatient(params.id, { active: false })
    } else {
      // Excluir se não tiver relacionamentos
      db.deletePatient(params.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao excluir paciente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
