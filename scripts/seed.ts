
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.stockMovement.deleteMany()
  await prisma.treatmentProduct.deleteMany()
  await prisma.treatment.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.procedureProduct.deleteMany()
  await prisma.financialRecord.deleteMany()
  await prisma.product.deleteMany()
  await prisma.procedure.deleteMany()
  await prisma.patient.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Criar usuários
  const hashedPassword1 = await bcrypt.hash('admin123', 12)
  const hashedPassword2 = await bcrypt.hash('estetic123', 12)
  const hashedPassword3 = await bcrypt.hash('recepcao123', 12)
  const hashedPassword4 = await bcrypt.hash('123', 12)

  const admin = await prisma.user.create({
    data: {
      name: 'Ana Silva',
      email: 'admin@clinica.com',
      password: hashedPassword1,
      role: 'ADMIN',
    },
  })

  const esteticista = await prisma.user.create({
    data: {
      name: 'Dr. Carlos Mendes',
      email: 'esteticista@clinica.com',
      password: hashedPassword2,
      role: 'ESTHETICIAN',
    },
  })

  const recepcionista = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'recepcao@clinica.com',
      password: hashedPassword3,
      role: 'RECEPTIONIST',
    },
  })

  // Usuário de teste obrigatório
  await prisma.user.create({
    data: {
      name: 'Usuário Teste',
      email: 'teste@teste.com',
      password: hashedPassword4,
      role: 'ADMIN',
    },
  })

  // Criar procedimentos
  const limpezaPele = await prisma.procedure.create({
    data: {
      name: 'Limpeza de Pele Profunda',
      description: 'Limpeza completa com extração e hidratação',
      duration: 90,
      price: 120.00,
      category: 'Tratamento Facial',
    },
  })

  const peeling = await prisma.procedure.create({
    data: {
      name: 'Peeling Químico',
      description: 'Renovação celular com ácidos',
      duration: 60,
      price: 200.00,
      category: 'Tratamento Facial',
    },
  })

  const drenagem = await prisma.procedure.create({
    data: {
      name: 'Drenagem Linfática',
      description: 'Massagem terapêutica para redução de edemas',
      duration: 60,
      price: 80.00,
      category: 'Tratamento Corporal',
    },
  })

  const microagulhamento = await prisma.procedure.create({
    data: {
      name: 'Microagulhamento',
      description: 'Estimulação de colágeno para rejuvenescimento',
      duration: 120,
      price: 300.00,
      category: 'Tratamento Facial',
    },
  })

  const radiofrequencia = await prisma.procedure.create({
    data: {
      name: 'Radiofrequência',
      description: 'Tratamento para flacidez e firmeza da pele',
      duration: 45,
      price: 150.00,
      category: 'Tratamento Corporal',
    },
  })

  // Criar produtos
  const serum = await prisma.product.create({
    data: {
      name: 'Sérum Vitamina C',
      brand: 'SkinCare Pro',
      category: 'Sérum',
      unit: 'ml',
      costPrice: 25.00,
      salePrice: 60.00,
      minStock: 5,
      currentStock: 15,
    },
  })

  const acidoHialuronico = await prisma.product.create({
    data: {
      name: 'Ácido Hialurônico',
      brand: 'DermaLux',
      category: 'Hidratante',
      unit: 'ml',
      costPrice: 45.00,
      salePrice: 120.00,
      minStock: 3,
      currentStock: 8,
    },
  })

  const mascara = await prisma.product.create({
    data: {
      name: 'Máscara Hidratante',
      brand: 'BeautyLine',
      category: 'Máscara',
      unit: 'unidade',
      costPrice: 15.00,
      salePrice: 40.00,
      minStock: 10,
      currentStock: 25,
    },
  })

  const oleo = await prisma.product.create({
    data: {
      name: 'Óleo Essencial Relaxante',
      brand: 'Nature Essence',
      category: 'Óleo',
      unit: 'ml',
      costPrice: 20.00,
      salePrice: 55.00,
      minStock: 5,
      currentStock: 12,
    },
  })

  // Criar pacientes
  const paciente1 = await prisma.patient.create({
    data: {
      name: 'Juliana Costa',
      email: 'juliana.costa@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-01',
      birthDate: new Date('1985-03-15'),
      address: 'Rua das Flores, 123',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
  })

  const paciente2 = await prisma.patient.create({
    data: {
      name: 'Ricardo Oliveira',
      email: 'ricardo.oliveira@email.com',
      phone: '(11) 95432-1098',
      cpf: '987.654.321-09',
      birthDate: new Date('1978-08-22'),
      address: 'Av. Central, 456',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01987-654',
    },
  })

  const paciente3 = await prisma.patient.create({
    data: {
      name: 'Fernanda Lima',
      email: 'fernanda.lima@email.com',
      phone: '(11) 91234-5678',
      birthDate: new Date('1992-12-05'),
      address: 'Rua do Sol, 789',
      neighborhood: 'Vila Nova',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '05432-109',
    },
  })

  // Criar agendamentos
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  await prisma.appointment.create({
    data: {
      patientId: paciente1.id,
      procedureId: limpezaPele.id,
      userId: esteticista.id,
      date: today,
      startTime: '09:00',
      endTime: '10:30',
      status: 'SCHEDULED',
      notes: 'Primeira consulta - pele sensível',
    },
  })

  await prisma.appointment.create({
    data: {
      patientId: paciente2.id,
      procedureId: radiofrequencia.id,
      userId: esteticista.id,
      date: tomorrow,
      startTime: '14:00',
      endTime: '14:45',
      status: 'CONFIRMED',
    },
  })

  // Criar alguns tratamentos realizados
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)

  await prisma.treatment.create({
    data: {
      patientId: paciente3.id,
      procedureId: peeling.id,
      userId: esteticista.id,
      date: lastMonth,
      price: 200.00,
      totalPaid: 200.00,
      paymentMethod: 'Cartão de Crédito',
      observations: 'Resultado excelente, paciente satisfeita',
    },
  })

  await prisma.treatment.create({
    data: {
      patientId: paciente1.id,
      procedureId: microagulhamento.id,
      userId: esteticista.id,
      date: new Date(),
      price: 300.00,
      discount: 30.00,
      totalPaid: 270.00,
      paymentMethod: 'PIX',
      observations: 'Desconto por indicação',
    },
  })

  // Criar registros financeiros
  await prisma.financialRecord.create({
    data: {
      type: 'INCOME',
      category: 'Tratamentos',
      description: 'Peeling Químico - Fernanda Lima',
      amount: 200.00,
      date: lastMonth,
      userId: admin.id,
    },
  })

  await prisma.financialRecord.create({
    data: {
      type: 'EXPENSE',
      category: 'Produtos',
      description: 'Compra de produtos para estoque',
      amount: 500.00,
      date: new Date(),
      userId: admin.id,
    },
  })

  // Criar movimentações de estoque
  await prisma.stockMovement.create({
    data: {
      productId: serum.id,
      type: 'IN',
      quantity: 10,
      reason: 'Compra para estoque',
      userId: admin.id,
    },
  })

  await prisma.stockMovement.create({
    data: {
      productId: serum.id,
      type: 'OUT',
      quantity: 2,
      reason: 'Uso em tratamento',
      userId: esteticista.id,
    },
  })

  console.log('Seed concluído com sucesso!')
  console.log('Usuários criados:')
  console.log('- Admin: admin@clinica.com / admin123')
  console.log('- Esteticista: esteticista@clinica.com / estetic123')
  console.log('- Recepcionista: recepcao@clinica.com / recepcao123')
  console.log('- Teste: teste@teste.com / 123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
