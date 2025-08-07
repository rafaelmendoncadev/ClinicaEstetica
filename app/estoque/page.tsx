
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { StockContent } from './stock-content'

export const dynamic = 'force-dynamic'

export default async function EstoquePage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando estoque...</div>}>
      <StockContent user={session.user} />
    </Suspense>
  )
}
