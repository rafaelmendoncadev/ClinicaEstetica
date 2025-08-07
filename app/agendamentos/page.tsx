
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AppointmentsContent } from './appointments-content'

export const dynamic = 'force-dynamic'

export default async function AgendamentosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando agendamentos...</div>}>
      <AppointmentsContent />
    </Suspense>
  )
}
