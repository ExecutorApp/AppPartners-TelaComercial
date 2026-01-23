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
  status: CommitmentStatus; //........Status atual
  subStatus?: StartedSubStatus; //....Subestado (se iniciada)
  startTime: string; //...............Horario inicio "08:00"
  endTime: string; //.................Horario fim "08:30"
  estimatedMinutes: number; //........Duracao em minutos
  isFixed: boolean; //................Agenda = true
  timeBalance?: number; //............Tempo restante/atraso em min
  clientPhoto?: string; //............URL/URI da foto do cliente
  clientName?: string; //.............Nome do cliente
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
  {
    id: '1',
    number: '01',
    title: 'Prospecao de leads',
    category: 'comercial',
    status: 'not_started',
    startTime: '08:00',
    endTime: '08:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 15,
    clientName: 'Diversos',
    productName: 'Consorcio',
  },
  {
    id: '2',
    number: '02',
    title: 'Follow-up Joao Silva',
    category: 'comercial',
    status: 'not_started',
    startTime: '08:30',
    endTime: '09:00',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 10,
    clientName: 'Joao Silva',
    productName: 'Consorcio',
    phaseName: 'Negociacao',
  },
  {
    id: '3',
    number: '03',
    title: 'Reuniao cliente ABC',
    category: 'agenda',
    status: 'not_started',
    startTime: '09:00',
    endTime: '10:00',
    estimatedMinutes: 60,
    isFixed: true,
    timeBalance: 0,
    clientName: 'Empresa ABC',
    productName: 'Consorcio Premium',
    activityName: 'Apresentacao',
  },
  {
    id: '4',
    number: '04',
    title: 'Cadastrar keymans',
    category: 'clientes',
    status: 'started',
    subStatus: 'pending',
    startTime: '10:00',
    endTime: '10:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: -5,
    clientName: 'Maria Santos',
    productName: 'Consorcio',
    phaseName: 'Documentacao',
    activityName: 'Cadastro de Keymans',
  },
  {
    id: '5',
    number: '05',
    title: 'Upload documentos',
    category: 'clientes',
    status: 'completed',
    startTime: '10:30',
    endTime: '11:00',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 0,
    clientName: 'Carlos Oliveira',
    productName: 'Consorcio',
    phaseName: 'Documentacao',
    activityName: 'Upload de Docs',
  },
  {
    id: '6',
    number: '06',
    title: 'Treinamento diario',
    category: 'rotina',
    status: 'not_started',
    startTime: '11:00',
    endTime: '11:30',
    estimatedMinutes: 30,
    isFixed: false,
    timeBalance: 20,
  },
];
