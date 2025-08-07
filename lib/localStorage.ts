import { 
  User, 
  Patient, 
  Procedure, 
  Product, 
  Appointment, 
  Treatment, 
  FinancialRecord, 
  StockMovement 
} from './types'

// Chaves do localStorage
const STORAGE_KEYS = {
  USERS: 'clinic_users',
  PATIENTS: 'clinic_patients',
  PROCEDURES: 'clinic_procedures',
  PRODUCTS: 'clinic_products',
  APPOINTMENTS: 'clinic_appointments',
  TREATMENTS: 'clinic_treatments',
  FINANCIAL_RECORDS: 'clinic_financial_records',
  STOCK_MOVEMENTS: 'clinic_stock_movements',
} as const

// Utility functions para localStorage
class LocalStorageDB {
  private isClient = typeof window !== 'undefined'

  private getItem<T>(key: string): T[] {
    if (!this.isClient) return []
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : []
    } catch {
      return []
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    if (!this.isClient) return
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Erro ao salvar no localStorage:`, error)
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private parseDate(obj: any): any {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string' && 
            (key.includes('Date') || key.includes('At') || key === 'date')) {
          obj[key] = new Date(obj[key])
        } else if (typeof obj[key] === 'object') {
          obj[key] = this.parseDate(obj[key])
        }
      }
    }
    return obj
  }

  // CRUD genérico
  private create<T extends { id: string; createdAt: Date; updatedAt: Date }>(key: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T {
    const items = this.getItem<T>(key)
    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as T
    
    items.push(newItem)
    this.setItem(key, items)
    return newItem
  }

  private findMany<T>(key: string): T[] {
    return this.getItem<T>(key).map(item => this.parseDate(item))
  }

  private findById<T extends { id: string }>(key: string, id: string): T | null {
    const items = this.getItem<T>(key)
    const item = items.find(item => item.id === id)
    return item ? this.parseDate(item) : null
  }

  private update<T extends { id: string; updatedAt: Date }>(
    key: string, 
    id: string, 
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): T | null {
    const items = this.getItem<T>(key)
    const index = items.findIndex(item => item.id === id)
    
    if (index === -1) return null
    
    items[index] = {
      ...items[index],
      ...data,
      updatedAt: new Date(),
    } as T
    
    this.setItem(key, items)
    return this.parseDate(items[index])
  }

  private delete<T extends { id: string }>(key: string, id: string): boolean {
    const items = this.getItem<T>(key)
    const initialLength = items.length
    const filteredItems = items.filter(item => item.id !== id)
    
    this.setItem(key, filteredItems)
    return filteredItems.length < initialLength
  }

  // Users
  createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    return this.create<User>(STORAGE_KEYS.USERS, user)
  }

  findAllUsers(): User[] {
    return this.findMany<User>(STORAGE_KEYS.USERS)
  }

  findUserById(id: string): User | null {
    return this.findById<User>(STORAGE_KEYS.USERS, id)
  }

  updateUser(id: string, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>): User | null {
    return this.update<User>(STORAGE_KEYS.USERS, id, data)
  }

  deleteUser(id: string): boolean {
    return this.delete<User>(STORAGE_KEYS.USERS, id)
  }

  // Patients
  createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient {
    return this.create<Patient>(STORAGE_KEYS.PATIENTS, patient)
  }

  findAllPatients(): Patient[] {
    return this.findMany<Patient>(STORAGE_KEYS.PATIENTS)
  }

  findPatientById(id: string): Patient | null {
    return this.findById<Patient>(STORAGE_KEYS.PATIENTS, id)
  }

  updatePatient(id: string, data: Partial<Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>>): Patient | null {
    return this.update<Patient>(STORAGE_KEYS.PATIENTS, id, data)
  }

  deletePatient(id: string): boolean {
    return this.delete<Patient>(STORAGE_KEYS.PATIENTS, id)
  }

  // Procedures
  createProcedure(procedure: Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>): Procedure {
    return this.create<Procedure>(STORAGE_KEYS.PROCEDURES, procedure)
  }

  findAllProcedures(): Procedure[] {
    return this.findMany<Procedure>(STORAGE_KEYS.PROCEDURES)
  }

  findProcedureById(id: string): Procedure | null {
    return this.findById<Procedure>(STORAGE_KEYS.PROCEDURES, id)
  }

  updateProcedure(id: string, data: Partial<Omit<Procedure, 'id' | 'createdAt' | 'updatedAt'>>): Procedure | null {
    return this.update<Procedure>(STORAGE_KEYS.PROCEDURES, id, data)
  }

  deleteProcedure(id: string): boolean {
    return this.delete<Procedure>(STORAGE_KEYS.PROCEDURES, id)
  }

  // Products
  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    return this.create<Product>(STORAGE_KEYS.PRODUCTS, product)
  }

  findAllProducts(): Product[] {
    return this.findMany<Product>(STORAGE_KEYS.PRODUCTS)
  }

  findProductById(id: string): Product | null {
    return this.findById<Product>(STORAGE_KEYS.PRODUCTS, id)
  }

  updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Product | null {
    return this.update<Product>(STORAGE_KEYS.PRODUCTS, id, data)
  }

  deleteProduct(id: string): boolean {
    return this.delete<Product>(STORAGE_KEYS.PRODUCTS, id)
  }

  // Appointments
  createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Appointment {
    return this.create<Appointment>(STORAGE_KEYS.APPOINTMENTS, appointment)
  }

  findAllAppointments(): Appointment[] {
    const appointments = this.findMany<Appointment>(STORAGE_KEYS.APPOINTMENTS)
    return appointments.map(appointment => ({
      ...appointment,
      patient: this.findPatientById(appointment.patientId) || undefined,
      procedure: this.findProcedureById(appointment.procedureId) || undefined,
      user: this.findUserById(appointment.userId) || undefined,
    }))
  }

  findAppointmentById(id: string): Appointment | null {
    const appointment = this.findById<Appointment>(STORAGE_KEYS.APPOINTMENTS, id)
    if (!appointment) return null

    return {
      ...appointment,
      patient: this.findPatientById(appointment.patientId) || undefined,
      procedure: this.findProcedureById(appointment.procedureId) || undefined,
      user: this.findUserById(appointment.userId) || undefined,
    }
  }

  updateAppointment(id: string, data: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>): Appointment | null {
    return this.update<Appointment>(STORAGE_KEYS.APPOINTMENTS, id, data)
  }

  deleteAppointment(id: string): boolean {
    return this.delete<Appointment>(STORAGE_KEYS.APPOINTMENTS, id)
  }

  // Treatments
  createTreatment(treatment: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>): Treatment {
    return this.create<Treatment>(STORAGE_KEYS.TREATMENTS, treatment)
  }

  findAllTreatments(): Treatment[] {
    const treatments = this.findMany<Treatment>(STORAGE_KEYS.TREATMENTS)
    return treatments.map(treatment => ({
      ...treatment,
      patient: this.findPatientById(treatment.patientId) || undefined,
      procedure: this.findProcedureById(treatment.procedureId) || undefined,
      user: this.findUserById(treatment.userId) || undefined,
    }))
  }

  findTreatmentById(id: string): Treatment | null {
    const treatment = this.findById<Treatment>(STORAGE_KEYS.TREATMENTS, id)
    if (!treatment) return null

    return {
      ...treatment,
      patient: this.findPatientById(treatment.patientId) || undefined,
      procedure: this.findProcedureById(treatment.procedureId) || undefined,
      user: this.findUserById(treatment.userId) || undefined,
    }
  }

  updateTreatment(id: string, data: Partial<Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>>): Treatment | null {
    return this.update<Treatment>(STORAGE_KEYS.TREATMENTS, id, data)
  }

  deleteTreatment(id: string): boolean {
    return this.delete<Treatment>(STORAGE_KEYS.TREATMENTS, id)
  }

  // Financial Records
  createFinancialRecord(record: Omit<FinancialRecord, 'id' | 'createdAt' | 'updatedAt'>): FinancialRecord {
    return this.create<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS, record)
  }

  findAllFinancialRecords(): FinancialRecord[] {
    const records = this.findMany<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS)
    return records.map(record => ({
      ...record,
      user: this.findUserById(record.userId) || undefined,
    }))
  }

  findFinancialRecordById(id: string): FinancialRecord | null {
    const record = this.findById<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS, id)
    if (!record) return null

    return {
      ...record,
      user: this.findUserById(record.userId) || undefined,
    }
  }

  updateFinancialRecord(id: string, data: Partial<Omit<FinancialRecord, 'id' | 'createdAt' | 'updatedAt'>>): FinancialRecord | null {
    return this.update<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS, id, data)
  }

  deleteFinancialRecord(id: string): boolean {
    return this.delete<FinancialRecord>(STORAGE_KEYS.FINANCIAL_RECORDS, id)
  }

  // Stock Movements
  createStockMovement(movement: Omit<StockMovement, 'id' | 'createdAt' | 'updatedAt'>): StockMovement {
    const newMovement = this.create<StockMovement>(STORAGE_KEYS.STOCK_MOVEMENTS, movement)
    
    // Atualizar o estoque do produto
    const product = this.findProductById(movement.productId)
    if (product) {
      const quantityChange = movement.type === 'IN' ? movement.quantity : -movement.quantity
      this.updateProduct(movement.productId, {
        currentStock: product.currentStock + quantityChange
      })
    }
    
    return newMovement
  }

  findAllStockMovements(): StockMovement[] {
    const movements = this.findMany<StockMovement>(STORAGE_KEYS.STOCK_MOVEMENTS)
    return movements.map(movement => ({
      ...movement,
      product: this.findProductById(movement.productId) || undefined,
      user: this.findUserById(movement.userId) || undefined,
    }))
  }

  findStockMovementById(id: string): StockMovement | null {
    const movement = this.findById<StockMovement>(STORAGE_KEYS.STOCK_MOVEMENTS, id)
    if (!movement) return null

    return {
      ...movement,
      product: this.findProductById(movement.productId) || undefined,
      user: this.findUserById(movement.userId) || undefined,
    }
  }

  // Utility methods
  clearAllData(): void {
    if (!this.isClient) return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  exportData(): string {
    if (!this.isClient) return '{}'
    const data = Object.fromEntries(
      Object.entries(STORAGE_KEYS).map(([name, key]) => [
        name.toLowerCase(),
        this.getItem(key)
      ])
    )
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    if (!this.isClient) return false
    try {
      const data = JSON.parse(jsonData)
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        const lowerName = name.toLowerCase()
        if (data[lowerName]) {
          this.setItem(key, data[lowerName])
        }
      })
      return true
    } catch {
      return false
    }
  }
}

// Singleton instance
export const db = new LocalStorageDB()