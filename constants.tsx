
import { FunnelStage, Client, User, Transaction, Appointment, ProcedurePackage, Supplier } from './types';

export const FUNNEL_STAGES: FunnelStage[] = [
  { id: 'new', title: 'Novo Lead', color: 'bg-blue-500' },
  { id: 'contact', title: 'Em Contato', color: 'bg-yellow-500' },
  { id: 'consult', title: 'Avaliação Marcada', color: 'bg-orange-500' },
  { id: 'proposal', title: 'Proposta Enviada', color: 'bg-purple-500' },
  { id: 'closed', title: 'Fechado', color: 'bg-green-500' },
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    cpf: '123.456.789-00',
    birthDate: '1990-05-15',
    phone: '11988887777',
    email: 'ana.silva@email.com',
    address: 'Rua das Flores, 123',
    clinicalNotes: 'Pele sensível, interessada em Botox.',
    clinicalHistory: [
      {
        id: 'h1',
        date: '2023-10-10',
        procedure: 'Avaliação Facial',
        notes: 'Paciente queixa-se de rugas na glabela. Pele tipo III.',
        professionalName: 'Dra. Jéssica Motta'
      },
      {
        id: 'h2',
        date: '2023-11-20',
        procedure: 'Aplicação de Botox',
        notes: 'Aplicado 30 unidades de Botox na região frontal e olhos. Sem intercorrências.',
        professionalName: 'Dra. Jéssica Motta'
      }
    ],
    lgpdConsent: true,
    status: 'ACTIVE',
    source: 'Instagram',
    tags: ['Botox', 'Premium'],
    lastProcedure: 'Botox Frontal',
    totalSpent: 1500,
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    cpf: '987.654.321-11',
    birthDate: '1985-10-20',
    phone: '11977776666',
    email: 'carlos.o@email.com',
    address: 'Av. Paulista, 1000',
    clinicalNotes: 'Tratamento capilar em andamento.',
    clinicalHistory: [],
    lgpdConsent: true,
    status: 'ACTIVE',
    source: 'Google Ads',
    tags: ['Capilar'],
    lastProcedure: 'Microagulhamento',
    totalSpent: 3200,
  },
  {
    id: '3',
    name: 'Beatriz Costa',
    cpf: '444.555.666-77',
    birthDate: '1992-03-12',
    phone: '11966665555',
    email: 'beatriz.c@email.com',
    address: 'Rua Augusta, 500',
    clinicalNotes: 'Interessada em preenchimento labial.',
    clinicalHistory: [],
    lgpdConsent: true,
    status: 'LEAD',
    source: 'Instagram',
    tags: ['Labial'],
    totalSpent: 0,
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'p1', 
    name: 'Dra. Elena Ramos', 
    email: 'elena@estetica.com', 
    password: '123', 
    role: 'ADMIN', 
    active: true, 
    avatar: 'https://picsum.photos/id/64/100/100', 
    specialty: 'Dermatologia' 
  },
  { 
    id: 'p2', 
    name: 'Dr. Marcos Viana', 
    email: 'marcos@estetica.com', 
    password: '123', 
    role: 'FINANCE', 
    active: true, 
    avatar: 'https://picsum.photos/id/65/100/100', 
    specialty: 'Harmonização' 
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'INCOME', category: 'Procedimento', description: 'Botox - Ana Silva', value: 1200, date: '2023-11-20', status: 'PAID', paymentMethod: 'PIX', clientId: '1' },
  { id: 't2', type: 'EXPENSE', category: 'Produtos', description: 'Compra de Toxina Botulínica', value: 3500, date: '2023-11-25', status: 'PENDING' },
  { id: 't3', type: 'INCOME', category: 'Pacote', description: 'Combo Verão - Carlos Oliveira', value: 2500, date: '2023-11-22', status: 'PAID', paymentMethod: 'CREDIT_CARD', clientId: '2' },
  { id: 't4', type: 'EXPENSE', category: 'Aluguel', description: 'Aluguel Sala Comercial Nov', value: 4200, date: '2023-11-10', status: 'PAID' },
  { id: 't5', type: 'EXPENSE', category: 'Marketing', description: 'Google Ads - Campanha Botox', value: 1500, date: '2023-11-30', status: 'PENDING' },
  { id: 't6', type: 'EXPENSE', category: 'Manutenção', description: 'Manutenção Aparelho Laser', value: 850, date: '2023-12-05', status: 'PENDING' },
  { id: 't7', type: 'INCOME', category: 'Avaliação', description: 'Avaliação Inicial - Maria Clara', value: 150, date: '2023-11-23', status: 'PAID', paymentMethod: 'CASH', clientId: '3' },
];

export const MOCK_PACKAGES: ProcedurePackage[] = [
  { id: 'pk1', name: 'Combo Verão 360', description: '10 sessões de drenagem linfática + 5 sessões de carboxiterapia para resultados rápidos.', price: 1500, sessions: 15, installments: 6 },
  { id: 'pk2', name: 'Protocolo Rejuvenescimento', description: 'Aplicação de Botox (3 áreas) + 3 sessões de Bioestimulador de colágeno para firmeza total.', price: 3800, sessions: 4, installments: 10 },
  { id: 'pk3', name: 'Detox Corporal Express', description: '5 sessões de massagem modeladora + manta térmica infravermelho.', price: 850, sessions: 5, installments: 3 },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientId: '1', professionalId: 'p1', procedure: 'Botox', date: '2023-11-25', time: '09:00', status: 'CONFIRMED' },
  { id: 'a2', clientId: '2', professionalId: 'p1', procedure: 'Microagulhamento', date: '2023-11-25', time: '10:30', status: 'SCHEDULED' },
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Allergan Aesthetics',
    category: 'Toxinas',
    contactPerson: 'Ricardo Mendes',
    phone: '11999990000',
    email: 'contato@allergan.com.br',
    rating: 5,
    lastOrder: '2023-11-15'
  },
  {
    id: 's2',
    name: 'Galderma Brasil',
    category: 'Preenchedores',
    contactPerson: 'Juliana Costa',
    phone: '11988881111',
    email: 'vendas@galderma.com',
    rating: 4.8,
    lastOrder: '2023-11-20'
  },
  {
    id: 's3',
    name: 'Medical Line',
    category: 'Equipamentos',
    contactPerson: 'Fernando Silva',
    phone: '11977772222',
    email: 'suporte@medicalline.com.br',
    rating: 4.5,
    lastOrder: '2023-10-05'
  },
  {
    id: 's4',
    name: 'Dental Speed',
    category: 'Descartáveis',
    contactPerson: 'Clara Nunes',
    phone: '08007773333',
    email: 'atendimento@dentalspeed.com',
    rating: 4.2,
    lastOrder: '2023-11-25'
  }
];
