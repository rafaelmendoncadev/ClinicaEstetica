
'use client'

export const dynamic = 'force-dynamic'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { History, Construction } from 'lucide-react'

export default function HistoricoPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Histórico</h1>
          <p className="text-muted-foreground">
            Histórico de tratamentos realizados
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <Construction className="mx-auto h-12 w-12 text-muted-foreground" />
            <CardTitle>Módulo em Desenvolvimento</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              O módulo de histórico de tratamentos está sendo desenvolvido.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
