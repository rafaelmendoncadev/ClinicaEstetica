
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'
import { AppointmentStatus } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    let where: any = {}

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      
      where.date = {
        gte: startDate,
        lt: endDate,
      }
    }

    if (status && status !== 'all') {
      where.status = status
    }

    let appointments = db.findAllAppointments()

    // Aplicar filtros
    if (date) {
      const filterDate = new Date(date)
      appointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate.toDateString() === filterDate.toDateString()
      })
    }

    if (status && status !== 'all') {
      appointments = appointments.filter(appointment => appointment.status === status)
    }

    // Ordenar por data e hora
    appointments.sort((a, b) => {
      const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime()
      if (dateCompare !== 0) return dateCompare
      return a.startTime.localeCompare(b.startTime)
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error)
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

    const data = await request.json()

    const appointment = db.createAppointment({
      patientId: data.patientId,
      procedureId: data.procedureId,
      userId: data.userId,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      status: (data.status as AppointmentStatus) || AppointmentStatus.SCHEDULED,
      notes: data.notes,
    })

    // Buscar o appointment com related data
    const fullAppointment = db.findAppointmentById(appointment.id)

    return NextResponse.json(fullAppointment)
  } catch (error) {
    console.error('Erro ao criar agendamento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
