
export type UserRole = 'ADMIN' | 'ATTENDANT' | 'SALES' | 'MARKETING' | 'FINANCE';
export type LeadSource = 'Instagram' | 'Facebook' | 'Google Ads' | 'Website' | 'Indicação' | 'WhatsApp' | 'Outros';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar?: string;
  active: boolean;
  specialty?: string;
}

export interface ClinicalRecord {
  id: string;
  date: string;
  procedure: string;
  notes: string;
  professionalName: string;
  attachments?: string[]; // URLs ou Base64 de fotos Antes/Depois
}

export interface Client {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
  clinicalNotes: string;
  clinicalHistory: ClinicalRecord[];
  lgpdConsent: boolean;
  lgpdTimestamp?: string; // Data/Hora do aceite
  status: 'LEAD' | 'ACTIVE' | 'INACTIVE';
  source: LeadSource;
  tags: string[];
  lastProcedure?: string;
  totalSpent: number;
  photoUrl?: string; // Foto de perfil do paciente
}

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  procedure: string;
  date: string;
  time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';
  reminderSent?: boolean;
}

export interface Transaction {
  id: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  description: string;
  value: number;
  date: string;
  status: 'PENDING' | 'PAID';
  paymentMethod?: 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH';
  clientId?: string;
}

export interface ProcedurePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  sessions: number;
  installments: number;
}

export interface FunnelStage {
  id: string;
  title: string;
  color: string;
}

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  value: number;
  stageId: string;
  expectedCloseDate: string;
  label: 'Novo' | 'Quente' | 'Urgente' | 'Fidelizado';
}

export interface Supplier {
  id: string;
  name: string;
  category: 'Toxinas' | 'Preenchedores' | 'Equipamentos' | 'Descartáveis' | 'Outros';
  contactPerson: string;
  phone: string;
  email: string;
  rating: number;
  lastOrder?: string;
}
