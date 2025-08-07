
'use client'

export const dynamic = 'force-dynamic'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, Construction } from 'lucide-react'

export default function FinanceiroPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Controle Financeiro</h1>
          <p className="text-muted-foreground">
            Gestão financeira da clínica
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Módulo em Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              O módulo de controle financeiro está sendo desenvolvido.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
