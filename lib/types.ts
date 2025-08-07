
// Enums definidos localmente (migrados do Prisma)
export enum UserRole {
  ADMIN = 'ADMIN',
  ESTHETICIAN = 'ESTHETICIAN',
  RECEPTIONIST = 'RECEPTIONIST'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum FinancialType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT'
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Patient {
  id: string
  name: string
  email?: string
  phone: string
  cpf?: string
  birthDate?: Date
  address?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
  observations?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Procedure {
  id: string
  name: string
  description?: string
  duration: number
  price: number
  category: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  brand?: string
  category: string
  unit: string
  costPrice: number
  salePrice?: number
  minStock: number
  currentStock: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  patientId: string
  procedureId: string
  userId: string
  date: Date
  startTime: string
  endTime: string
  status: AppointmentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
  patient?: Patient
  procedure?: Procedure
  user?: User
}

export interface Treatment {
  id: string
  patientId: string
  procedureId: string
  userId: string
  date: Date
  price: number
  discount?: number
  totalPaid: number
  paymentMethod: string
  observations?: string
  createdAt: Date
  updatedAt: Date
  patient?: Patient
  procedure?: Procedure
  user?: User
}

export interface FinancialRecord {
  id: string
  type: FinancialType
  category: string
  description: string
  amount: number
  date: Date
  userId: string
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface StockMovement {
  id: string
  productId: string
  type: StockMovementType
  quantity: number
  reason: string
  userId: string
  date: Date
  createdAt: Date
  updatedAt: Date
  product?: Product
  user?: User
}

