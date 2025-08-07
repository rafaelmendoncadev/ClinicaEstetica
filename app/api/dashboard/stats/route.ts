
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    // Buscar estatísticas do localStorage
    const patients = db.findAllPatients()
    const appointments = db.findAllAppointments()
    const treatments = db.findAllTreatments()
    const procedures = db.findAllProcedures()

    const totalPacientes = patients.filter(p => p.active).length
    
    const agendamentosHoje = appointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate >= today && aptDate < tomorrow
    }).length
    
    const receitaMes = treatments
      .filter(t => {
        const tDate = new Date(t.date)
        return tDate >= startOfMonth && tDate <= endOfMonth
      })
      .reduce((sum, t) => sum + (t.totalPaid || 0), 0)
    
    const procedimentosAtivos = procedures.filter(p => p.active).length
    
    const agendamentosPendentes = appointments.filter(apt => apt.status === 'SCHEDULED').length
    
    const tratamentosRealizados = treatments.length

    return NextResponse.json({
      totalPacientes,
      agendamentosHoje,
      receitaMes,
      procedimentosAtivos,
      agendamentosPendentes,
      tratamentosRealizados,
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
