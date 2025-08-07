
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { DashboardContent } from './dashboard-content'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando dashboard...</div>}>
      <DashboardContent user={session.user} />
    </Suspense>
  )
}
