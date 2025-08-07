
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProductsContent } from './products-content'

export const dynamic = 'force-dynamic'

export default async function ProdutosPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !['ADMIN', 'ESTHETICIAN'].includes(session.user?.role || '')) {
    redirect('/auth/signin')
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando produtos...</div>}>
      <ProductsContent />
    </Suspense>
  )
}
