
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/localStorage'
import { UserRole } from '@/lib/types'
import bcrypt from 'bcryptjs'

// Função para inicializar dados se necessário
async function initializeData() {
  const users = db.findAllUsers()
  if (users.length === 0) {
    // Criar usuário de teste simples (primeiro)
    const testPassword = await bcrypt.hash('123', 12)
    db.createUser({
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      password: testPassword,
      role: UserRole.ADMIN,
      active: true,
    })

    // Criar usuário admin padrão
    const adminPassword = await bcrypt.hash('admin123', 12)
    db.createUser({
      name: 'Administrador',
      email: 'admin@clinica.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      active: true,
    })

    // Criar usuário esteticista
    const estheticianPassword = await bcrypt.hash('esteticista123', 12)
    db.createUser({
      name: 'Dra. Maria Silva',
      email: 'maria@clinica.com',
      password: estheticianPassword,
      role: UserRole.ESTHETICIAN,
      active: true,
    })

    // Criar usuário recepcionista
    const receptionistPassword = await bcrypt.hash('recepcao123', 12)
    db.createUser({
      name: 'Ana Santos',
      email: 'ana@clinica.com',
      password: receptionistPassword,
      role: UserRole.RECEPTIONIST,
      active: true,
    })

    console.log('✅ Usuários inicializados automaticamente')
    console.log('🚀 Teste rápido: teste@teste.com / 123')
  }
}

export default async function HomePage() {
  // Inicializar dados automaticamente
  await initializeData()
  
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  redirect('/auth/signin')
}
