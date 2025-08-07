import { db } from './localStorage'
import { UserRole, AppointmentStatus } from './types'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  // Verificar se já há usuários
  const existingUsers = db.findAllUsers()
  
  if (existingUsers.length > 0) {
    console.log('Banco já possui dados, pulando seed...')
    return
  }

  console.log('Criando dados iniciais...')

  // Criar usuário admin padrão
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = db.createUser({
    name: 'Administrador',
    email: 'admin@clinica.com',
    password: adminPassword,
    role: UserRole.ADMIN,
    active: true,
  })

  // Criar usuário esteticista
  const estheticianPassword = await bcrypt.hash('esteticista123', 12)
  const esthetician = db.createUser({
    name: 'Dra. Maria Silva',
    email: 'maria@clinica.com',
    password: estheticianPassword,
    role: UserRole.ESTHETICIAN,
    active: true,
  })

  // Criar usuário recepcionista
  const receptionistPassword = await bcrypt.hash('recepcao123', 12)
  const receptionist = db.createUser({
    name: 'Ana Santos',
    email: 'ana@clinica.com',
    password: receptionistPassword,
    role: UserRole.RECEPTIONIST,
    active: true,
  })

  // Criar usuário de teste simples
  const testPassword = await bcrypt.hash('123', 12)
  const testUser = db.createUser({
    name: 'Usuário Teste',
    email: 'teste@teste.com',
    password: testPassword,
    role: UserRole.ADMIN,
    active: true,
  })

  // Criar alguns procedimentos de exemplo
  const limpezaPele = db.createProcedure({
    name: 'Limpeza de Pele',
    description: 'Limpeza profunda da pele com extração de cravos',
    duration: 60,
    price: 80.00,
    category: 'Facial',
    active: true,
  })

  const microagulhamento = db.createProcedure({
    name: 'Microagulhamento',
    description: 'Tratamento com microagulhas para renovação celular',
    duration: 90,
    price: 150.00,
    category: 'Facial',
    active: true,
  })

  const drenagemLinfatica = db.createProcedure({
    name: 'Drenagem Linfática',
    description: 'Massagem para redução de inchaço e melhora da circulação',
    duration: 60,
    price: 100.00,
    category: 'Corporal',
    active: true,
  })

  const peelingQuimico = db.createProcedure({
    name: 'Peeling Químico',
    description: 'Renovação celular com ácidos',
    duration: 45,
    price: 120.00,
    category: 'Facial',
    active: true,
  })

  const massagemRelaxante = db.createProcedure({
    name: 'Massagem Relaxante',
    description: 'Massagem corporal para relaxamento',
    duration: 90,
    price: 140.00,
    category: 'Corporal',
    active: true,
  })

  // Criar alguns produtos de exemplo
  db.createProduct({
    name: 'Sérum Vitamina C',
    brand: 'SkinCare Pro',
    category: 'Séruns',
    unit: 'ml',
    costPrice: 25.00,
    salePrice: 45.00,
    minStock: 5,
    currentStock: 20,
    active: true,
  })

  db.createProduct({
    name: 'Máscara de Argila',
    brand: 'Natural Beauty',
    category: 'Máscaras',
    unit: 'unidade',
    costPrice: 12.00,
    salePrice: 25.00,
    minStock: 10,
    currentStock: 30,
    active: true,
  })

  // Criar alguns pacientes de exemplo
  const joao = db.createPatient({
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-1111',
    cpf: '123.456.789-00',
    birthDate: new Date('1990-05-15'),
    address: 'Rua das Flores, 123',
    neighborhood: 'Centro',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    observations: 'Pele sensível',
    active: true,
  })

  const maria = db.createPatient({
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    phone: '(11) 99999-2222',
    cpf: '987.654.321-00',
    birthDate: new Date('1985-08-20'),
    address: 'Av. Paulista, 456',
    neighborhood: 'Bela Vista',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01310-100',
    active: true,
  })

  const ana = db.createPatient({
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(11) 99999-3333',
    cpf: '456.789.123-00',
    birthDate: new Date('1992-12-10'),
    address: 'Rua Augusta, 789',
    neighborhood: 'Consolação',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01305-000',
    observations: 'Primeira consulta',
    active: true,
  })

  const carlos = db.createPatient({
    name: 'Carlos Santos',
    email: 'carlos@email.com',
    phone: '(11) 99999-4444',
    cpf: '789.123.456-00',
    birthDate: new Date('1988-03-25'),
    address: 'Rua da Liberdade, 321',
    neighborhood: 'Liberdade',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01503-000',
    active: true,
  })

  // Criar alguns agendamentos de exemplo
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  // Agendamento para hoje
  db.createAppointment({
    patientId: joao.id,
    procedureId: limpezaPele.id,
    userId: esthetician.id,
    date: today,
    startTime: '09:00',
    endTime: '10:00',
    status: AppointmentStatus.CONFIRMED,
    notes: 'Primeira sessão de limpeza',
  })

  // Agendamento para amanhã
  db.createAppointment({
    patientId: maria.id,
    procedureId: microagulhamento.id,
    userId: esthetician.id,
    date: tomorrow,
    startTime: '14:00',
    endTime: '15:30',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Sessão de microagulhamento facial',
  })

  // Agendamento para próxima semana
  db.createAppointment({
    patientId: ana.id,
    procedureId: drenagemLinfatica.id,
    userId: esthetician.id,
    date: nextWeek,
    startTime: '10:00',
    endTime: '11:00',
    status: AppointmentStatus.SCHEDULED,
    notes: 'Primeira consulta - drenagem',
  })

  console.log('Dados iniciais criados com sucesso!')
  console.log('Usuários criados:')
  console.log('- Admin: admin@clinica.com / admin123')
  console.log('- Esteticista: maria@clinica.com / esteticista123')
  console.log('- Recepcionista: ana@clinica.com / recepcao123')
  console.log('- Teste: teste@teste.com / 123')
}