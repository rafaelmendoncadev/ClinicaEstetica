import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    await seedDatabase()
    return NextResponse.json({ 
      success: true, 
      message: 'Dados iniciais criados com sucesso!' 
    })
  } catch (error) {
    console.error('Erro ao criar dados iniciais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}