import React from 'react';
import { Svg, Path, Circle } from 'react-native-svg';

// ========================================
// CORES DO TEMA
// ========================================

export const COLORS = {
  primary: '#1777CF', //.........Cor principal (azul)
  textPrimary: '#3A3F51', //.....Cor do texto principal
  textSecondary: '#7D8592', //...Cor do texto secundario
  background: '#F4F4F4', //......Cor de fundo
  white: '#FCFCFC', //...........Cor branca
  border: '#D8E0F0', //..........Cor da borda
  green: '#4CAF50', //...........Cor verde (concluido)
  red: '#E53935', //.............Cor vermelha (atraso)
  orange: '#FF9800', //..........Cor laranja (alerta)
};

// ========================================
// CATEGORIAS DE COMPROMISSO (5 FIXAS)
// ========================================

export type CommitmentCategory =
  | 'agenda' //.......Eventos fixos (nao arrasta)
  | 'comercial' //....Prospecao, follow-up
  | 'clientes' //....Atividades de produto
  | 'rotina' //.......Metas diarias
  | 'pendencias'; //..Intencoes sem horario

// ========================================
// SUBCATEGORIAS DE COMPROMISSO
// ========================================

export type CommitmentSubcategory =
  | 'prospeccao' //......Comercial sem lead
  | 'negociacao' //......Comercial com lead
  | 'relacionamento' //..Comercial pos-venda
  | 'atividade' //.......Cliente com produto
  | 'reuniao' //..........Cliente com produto
  | 'treinamento' //......Rotina simples
  | 'outros'; //...........Generico

// ========================================
// MODELO DE CARD (1, 2 OU 3)
// ========================================

export type CardModel = 1 | 2 | 3;

// ========================================
// STATUS DE COMPROMISSO (REUTILIZAR EXISTENTES)
// ========================================

export type CommitmentStatus =
  | 'not_started' //..Nao iniciada
  | 'started' //.....Iniciada
  | 'completed'; //...Concluida

// ========================================
// SUBESTADOS DE "INICIADA"
// ========================================

export type StartedSubStatus =
  | 'pending' //.....Aguardando terceiro
  | 'delayed'; //....Prazo estourado

// ========================================
// ITEM DE COMPROMISSO
// ========================================

export interface CommitmentItem {
  id: string; //......................ID unico
  number: string; //..................Numero "01", "02"...
  title: string; //...................Nome da acao
  category: CommitmentCategory; //....Categoria
  subcategory?: CommitmentSubcategory; //..Subcategoria
  status: CommitmentStatus; //........Status atual
  subStatus?: StartedSubStatus; //....Subestado (se iniciada)
  startTime: string; //...............Horario inicio "08:00"
  endTime: string; //.................Horario fim "08:30"
  estimatedMinutes: number; //........Duracao em minutos
  isFixed: boolean; //................Agenda = true
  timeBalance?: number; //............Tempo restante/atraso em min
  isAfterHours?: boolean; //..........Fora do expediente (apos 18h)
  clientPhoto?: string; //............URL/URI da foto do cliente
  clientName?: string; //.............Nome do cliente
  whatsapp?: string; //...............Telefone para WhatsApp
  productName?: string; //.............Nome do produto
  phaseName?: string; //..............Nome da fase
  activityName?: string; //...........Nome da atividade
  linkedScreen?: string; //...........Tela de destino
  linkedParams?: object; //...........Parametros de navegacao
}

// ========================================
// FILTRO DE PERIODO
// ========================================

export type PeriodFilter =
  | 'today' //........Apenas hoje
  | 'tomorrow' //....Hoje + amanha
  | 'week' //.........Semana
  | 'fortnight' //....15 dias
  | 'month'; //........1 mes

// ========================================
// LABELS DAS CATEGORIAS
// ========================================

export const CATEGORY_LABELS: Record<CommitmentCategory, string> = {
  agenda: 'Agenda',
  comercial: 'Comercial',
  clientes: 'Clientes',
  rotina: 'Rotina',
  pendencias: 'Pendencias',
};

// ========================================
// LABELS DOS FILTROS
// ========================================

export const PERIOD_LABELS: Record<PeriodFilter, string> = {
  today: 'Hoje',
  tomorrow: 'Amanha',
  week: 'Semana',
  fortnight: '15 dias',
  month: 'Mes',
};

// ========================================
// LABELS DAS SUBCATEGORIAS
// ========================================

export const SUBCATEGORY_LABELS: Record<CommitmentSubcategory, string> = {
  prospeccao: 'Prospecção',
  negociacao: 'Negociação',
  relacionamento: 'Relacionamento',
  atividade: 'Atividade',
  reuniao: 'Reunião',
  treinamento: 'Treinamento',
  outros: 'Outros',
};

// ========================================
// FUNCAO PARA DETERMINAR MODELO DO CARD
// ========================================

export const getCardModel = (item: CommitmentItem): CardModel => {
  // Modelo 03: Clientes (com produto + fase)
  if (item.category === 'clientes') return 3;
  // Modelo 02: Comercial com lead (negociacao, relacionamento)
  if (item.category === 'comercial') {
    if (item.subcategory === 'prospeccao') return 1;
    return 2;
  }
  // Modelo 01: Rotina, pendencias, outros
  return 1;
};

// ========================================
// ICONES SVG
// ========================================

// Icone Menu (3 linhas)
export const MenuIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 12H21M3 6H21M3 18H21"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Olho (expandir)
export const EyeIcon = ({ active = false }: { active?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 4.5C5.5 4.5 2 10 2 10C2 10 5.5 15.5 10 15.5C14.5 15.5 18 10 18 10C18 10 14.5 4.5 10 4.5Z"
      stroke={active ? COLORS.primary : COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={10}
      cy={10}
      r={3}
      stroke={active ? COLORS.primary : COLORS.textSecondary}
      strokeWidth={1.5}
    />
  </Svg>
);

// Icone Olho Fechado (enxugar)
export const EyeOffIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M8.5 4.7C9 4.6 9.5 4.5 10 4.5C14.5 4.5 18 10 18 10C18 10 17.3 11.2 16 12.5M11.5 11.5C11.1 11.9 10.6 12.1 10 12.1C8.9 12.1 8 11.2 8 10.1C8 9.5 8.2 9 8.6 8.6M3 3L17 17M6 6C3.5 7.8 2 10 2 10C2 10 5.5 15.5 10 15.5C11.5 15.5 12.9 15 14 14.2"
      stroke={COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Check (concluido)
export const CheckIcon = ({ size = 12, color = COLORS.white }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path
      d="M2 6L5 9L10 3"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Filtro
export const FilterIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M2 3H16M4 9H14M6 15H12"
      stroke={COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta Direita
export const ChevronRightIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M6 4L10 8L6 12"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Notificacao
export const NotificationIcon = ({ count = 0 }: { count?: number }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4 17.4 4.9 16.2 3.8C15.1 2.6 13.6 2 12 2C10.4 2 8.9 2.6 7.8 3.8C6.6 4.9 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.7 21C13.5 21.3 13.3 21.6 12.9 21.8C12.6 21.9 12.3 22 12 22C11.7 22 11.4 21.9 11.1 21.8C10.7 21.6 10.5 21.3 10.3 21"
      stroke={COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// DADOS MOCK PARA DESENVOLVIMENTO
// ========================================

export const MOCK_COMMITMENTS: CommitmentItem[] = [
  // ========================================
  // MANHA (08:00 - 12:00)
  // ========================================

  // 08:00 - 08:30 | Prospecção
  {
    id: '1',
    number: '01',
    title: 'Prospecção de novos leads',
    category: 'comercial',
    subcategory: 'prospeccao',
    status: 'completed',
    startTime: '08:00',
    endTime: '08:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 0,
  },
  // 08:30 - 09:00 | Follow-up lead
  {
    id: '2',
    number: '02',
    title: 'Follow-up João Silva',
    category: 'comercial',
    subcategory: 'negociacao',
    status: 'completed',
    startTime: '08:30',
    endTime: '09:00',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 0,
    clientName: 'João Silva',
    whatsapp: '11999887766',
  },
  // 09:00 - 10:00 | Reunião fixa
  {
    id: '3',
    number: '03',
    title: 'Apresentação Consórcio Premium',
    category: 'clientes',
    subcategory: 'reuniao',
    status: 'started',
    startTime: '09:00',
    endTime: '10:00',
    estimatedMinutes: 60,
    isFixed: true,
    timeBalance: -10,
    clientName: 'Roberto Almeida',
    productName: 'Consórcio Premium',
    phaseName: 'Apresentação',
  },
  // 10:00 - 10:30 | Treinamento diário
  {
    id: '4',
    number: '04',
    title: 'Treinamento técnicas de venda',
    category: 'rotina',
    subcategory: 'treinamento',
    status: 'not_started',
    startTime: '10:00',
    endTime: '10:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 25,
  },
  // 10:30 - 11:00 | Pós-venda
  {
    id: '5',
    number: '05',
    title: 'Ligação pós-venda Maria Santos',
    category: 'comercial',
    subcategory: 'relacionamento',
    status: 'not_started',
    startTime: '10:30',
    endTime: '11:00',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 20,
    clientName: 'Maria Santos',
    whatsapp: '11988776655',
  },
  // 11:00 - 12:00 | Atividade cliente
  {
    id: '6',
    number: '06',
    title: 'Cadastrar keymans no sistema',
    category: 'clientes',
    subcategory: 'atividade',
    status: 'not_started',
    startTime: '11:00',
    endTime: '12:00',
    estimatedMinutes: 60,
    isFixed: false,
    timeBalance: 15,
    clientName: 'Carlos Oliveira',
    productName: 'Consórcio Flex',
    phaseName: 'Documentação',
  },

  // ========================================
  // ALMOCO (12:00 - 14:00) - SEM COMPROMISSOS
  // ========================================

  // ========================================
  // TARDE (14:00 - 18:00)
  // ========================================

  // 14:00 - 14:40 | Prospecção
  {
    id: '7',
    number: '07',
    title: 'Prospecção redes sociais',
    category: 'comercial',
    subcategory: 'prospeccao',
    status: 'not_started',
    startTime: '14:00',
    endTime: '14:40',
    estimatedMinutes: 40,
    isFixed: false,
    timeBalance: 35,
  },
  // 14:40 - 15:30 | Reunião cliente
  {
    id: '8',
    number: '08',
    title: 'Fechamento proposta Empresa XYZ',
    category: 'clientes',
    subcategory: 'reuniao',
    status: 'not_started',
    startTime: '14:40',
    endTime: '15:30',
    estimatedMinutes: 50,
    isFixed: true,
    timeBalance: 45,
    clientName: 'Empresa XYZ Ltda',
    productName: 'Consórcio Empresarial',
    phaseName: 'Fechamento',
  },
  // 15:30 - 16:00 | Follow-up
  {
    id: '9',
    number: '09',
    title: 'Follow-up Ana Paula',
    category: 'comercial',
    subcategory: 'negociacao',
    status: 'not_started',
    startTime: '15:30',
    endTime: '16:00',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 25,
    clientName: 'Ana Paula Costa',
    whatsapp: '11977665544',
  },
  // 16:00 - 17:00 | Atividade
  {
    id: '10',
    number: '10',
    title: 'Envio de documentos cliente',
    category: 'clientes',
    subcategory: 'atividade',
    status: 'not_started',
    startTime: '16:00',
    endTime: '17:00',
    estimatedMinutes: 60,
    isFixed: false,
    timeBalance: 55,
    clientName: 'Pedro Henrique',
    productName: 'Consórcio Auto',
    phaseName: 'Documentação',
  },
  // 17:00 - 18:00 | Relacionamento
  {
    id: '11',
    number: '11',
    title: 'Visita cliente VIP',
    category: 'comercial',
    subcategory: 'relacionamento',
    status: 'not_started',
    startTime: '17:00',
    endTime: '18:00',
    estimatedMinutes: 60,
    isFixed: false,
    timeBalance: 55,
    clientName: 'Fernanda Lima',
    whatsapp: '11966554433',
  },

  // ========================================
  // FORA DO EXPEDIENTE (Apos 18:00)
  // ========================================

  // 19:00 - 19:30 | Compromisso pessoal
  {
    id: '12',
    number: '12',
    title: 'Ligação cliente urgente',
    category: 'comercial',
    subcategory: 'negociacao',
    status: 'not_started',
    startTime: '19:00',
    endTime: '19:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 25,
    isAfterHours: true,
    clientName: 'Marcelo Souza',
    whatsapp: '11955443322',
  },
  // 19:30 - 20:00 | Compromisso pessoal
  {
    id: '13',
    number: '13',
    title: 'Reunião online especial',
    category: 'clientes',
    subcategory: 'reuniao',
    status: 'not_started',
    startTime: '19:30',
    endTime: '20:00',
    estimatedMinutes: 30,
    isFixed: true,
    timeBalance: 25,
    isAfterHours: true,
    clientName: 'Juliana Martins',
    productName: 'Consórcio Premium Plus',
    phaseName: 'Negociação',
  },
];
