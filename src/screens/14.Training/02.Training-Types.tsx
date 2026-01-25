import React from 'react';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

// ========================================
// CORES DO TEMA
// ========================================

export const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  background: '#F4F4F4', //.....Cor de fundo
  white: '#FFFFFF', //..........Cor branca
  border: '#E8E8E8', //.........Cor da borda
  success: '#1B883C', //........Cor de sucesso (verde)
  warning: '#F5A623', //........Cor de alerta (amarelo)
  red: '#E53935', //............Cor de erro (vermelho)
};

// ========================================
// STATUS DO TREINAMENTO
// ========================================

export type TrainingStatus =
  | 'not_started' //..Nao iniciado
  | 'in_progress' //..Em andamento
  | 'completed'; //....Concluido

// ========================================
// TIPO DE CONTEUDO
// ========================================

export type ContentType =
  | 'video' //.......Video explicativo
  | 'text' //........Texto orientativo
  | 'checklist' //...Checklist pratico
  | 'material' //....Material de apoio
  | 'tip'; //.........Dica rapida

// ========================================
// CATEGORIAS DE TREINAMENTO
// ========================================

export type TrainingCategory =
  | 'produto' //........Treinamento de Produto
  | 'operacional' //....Treinamento Operacional
  | 'comercial' //.....Treinamento Comercial
  | 'sistema' //........Treinamento do Sistema
  | 'desenvolvimento'; //..Desenvolvimento Pessoal

// ========================================
// SUBCATEGORIAS COMERCIAIS
// ========================================

export type CommercialSubcategory =
  | 'prospeccao' //..........Abordagem inicial
  | 'negociacao' //..........Conducao de reunioes
  | 'relacionamento_lead' //..Manutencao de relacionamento
  | 'relacionamento_time'; //..Alinhamento interno

// ========================================
// INTERFACE DO ITEM DE CONTEUDO
// ========================================

export interface TrainingContentItem {
  id: string; //..............ID unico
  type: ContentType; //.......Tipo do conteudo
  title: string; //...........Titulo do conteudo
  duration?: number; //......Duracao em minutos
  url?: string; //............URL do conteudo
  description?: string; //....Descricao do conteudo
  completed: boolean; //......Se foi concluido
}

// ========================================
// INTERFACE DO TREINAMENTO
// ========================================

export interface TrainingItem {
  id: string; //..................ID unico
  title: string; //...............Titulo do treinamento
  category: TrainingCategory; //..Categoria principal
  subcategory?: CommercialSubcategory; //..Subcategoria (comercial)
  description: string; //........Descricao do treinamento
  status: TrainingStatus; //......Status atual
  progress: number; //............Progresso 0-100
  estimatedMinutes: number; //....Duracao estimada
  contents: TrainingContentItem[]; //..Lista de conteudos
  relatedProduct?: string; //.....Produto relacionado
  relatedPhase?: string; //......Fase relacionada
  relatedActivity?: string; //....Atividade relacionada
  thumbnail?: string; //..........URL da thumbnail
}

// ========================================
// INTERFACE DA CATEGORIA
// ========================================

export interface CategoryItem {
  key: TrainingCategory; //......Chave da categoria
  title: string; //..............Titulo da categoria
  description: string; //........Descricao da categoria
  totalCourses: number; //.......Total de cursos
  completedCourses: number; //...Cursos concluidos
}

// ========================================
// LABELS DAS CATEGORIAS
// ========================================

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  produto: 'Produto',
  operacional: 'Operacional',
  comercial: 'Comercial',
  sistema: 'Sistema',
  desenvolvimento: 'Desenvolvimento',
};

// ========================================
// LABELS DAS SUBCATEGORIAS COMERCIAIS
// ========================================

export const COMMERCIAL_SUBCATEGORY_LABELS: Record<CommercialSubcategory, string> = {
  prospeccao: 'Prospecção',
  negociacao: 'Negociação',
  relacionamento_lead: 'Relacionamento com Lead',
  relacionamento_time: 'Relacionamento com Time',
};

// ========================================
// LABELS DOS STATUS
// ========================================

export const STATUS_LABELS: Record<TrainingStatus, string> = {
  not_started: 'Não iniciado',
  in_progress: 'Em andamento',
  completed: 'Concluído',
};

// ========================================
// LABELS DOS TIPOS DE CONTEUDO
// ========================================

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: 'Vídeo',
  text: 'Texto',
  checklist: 'Checklist',
  material: 'Material',
  tip: 'Dica',
};

// ========================================
// ICONES SVG
// ========================================

// Icone de Produto (caixa)
export const ProductIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Operacional (engrenagem)
export const OperationalIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Comercial (grafico)
export const CommercialIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Sistema (monitor)
export const SystemIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect
      x={2}
      y={3}
      width={20}
      height={14}
      rx={2}
      ry={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M8 21h8M12 17v4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Desenvolvimento (usuario)
export const DevelopmentIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={12}
      cy={7}
      r={4}
      stroke={color}
      strokeWidth={2}
    />
  </Svg>
);

// Icone Video (play)
export const VideoIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 3l14 9-14 9V3z"
      fill={color}
    />
  </Svg>
);

// Icone Texto (documento)
export const TextIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Checklist (lista)
export const ChecklistIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 11l3 3L22 4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Tempo (relogio)
export const TimeIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Check (concluido)
export const CheckIcon = ({ color = COLORS.success }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta Voltar
export const BackIcon = ({ color = COLORS.textPrimary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// FUNCAO PARA OBTER ICONE DA CATEGORIA
// ========================================

export const getCategoryIcon = (category: TrainingCategory, color?: string) => {
  switch (category) {
    case 'produto':
      return <ProductIcon color={color} />;
    case 'operacional':
      return <OperationalIcon color={color} />;
    case 'comercial':
      return <CommercialIcon color={color} />;
    case 'sistema':
      return <SystemIcon color={color} />;
    case 'desenvolvimento':
      return <DevelopmentIcon color={color} />;
    default:
      return <ProductIcon color={color} />;
  }
};

// ========================================
// FUNCAO PARA OBTER ICONE DO TIPO DE CONTEUDO
// ========================================

export const getContentTypeIcon = (type: ContentType, color?: string) => {
  switch (type) {
    case 'video':
      return <VideoIcon color={color} />;
    case 'text':
    case 'material':
      return <TextIcon color={color} />;
    case 'checklist':
    case 'tip':
      return <ChecklistIcon color={color} />;
    default:
      return <TextIcon color={color} />;
  }
};

// ========================================
// MOCK DATA - CATEGORIAS
// ========================================

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    key: 'produto',
    title: 'Produto',
    description: 'Conheca os produtos vendidos e entregues',
    totalCourses: 12,
    completedCourses: 4,
  },
  {
    key: 'operacional',
    title: 'Operacional',
    description: 'Como executar atividades corretamente',
    totalCourses: 8,
    completedCourses: 2,
  },
  {
    key: 'comercial',
    title: 'Comercial',
    description: 'Performance comercial do Partner',
    totalCourses: 15,
    completedCourses: 6,
  },
  {
    key: 'sistema',
    title: 'Sistema',
    description: 'Uso completo do aplicativo',
    totalCourses: 10,
    completedCourses: 3,
  },
  {
    key: 'desenvolvimento',
    title: 'Desenvolvimento',
    description: 'Evolucao pessoal e profissional',
    totalCourses: 6,
    completedCourses: 1,
  },
];

// ========================================
// MOCK DATA - TREINAMENTOS
// ========================================

export const MOCK_TRAININGS: TrainingItem[] = [
  // Treinamentos de Produto
  {
    id: '1',
    title: 'Introdução ao Consórcio Premium',
    category: 'produto',
    description: 'Visão geral completa do produto Consórcio Premium, incluindo benefícios, diferenciais e expectativas do cliente.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 30,
    relatedProduct: 'Consórcio Premium',
    contents: [
      { id: '1-1', type: 'video', title: 'Visão geral do produto', duration: 10, completed: true },
      { id: '1-2', type: 'text', title: 'Benefícios e diferenciais', duration: 8, completed: true },
      { id: '1-3', type: 'checklist', title: 'Pontos-chave para apresentação', duration: 5, completed: true },
      { id: '1-4', type: 'tip', title: 'Dicas de abordagem', duration: 7, completed: true },
    ],
  },
  {
    id: '2',
    title: 'Holding Patrimonial - Planejamento',
    category: 'produto',
    description: 'Entenda a fase de planejamento da Holding Patrimonial e como conduzir reuniões estratégicas.',
    status: 'in_progress',
    progress: 45,
    estimatedMinutes: 45,
    relatedProduct: 'Holding Patrimonial',
    relatedPhase: 'Planejamento',
    contents: [
      { id: '2-1', type: 'video', title: 'Objetivo da Holding', duration: 12, completed: true },
      { id: '2-2', type: 'video', title: 'Reunião estratégica', duration: 15, completed: true },
      { id: '2-3', type: 'text', title: 'O que abordar na reunião', duration: 8, completed: false },
      { id: '2-4', type: 'checklist', title: 'Erros comuns a evitar', duration: 10, completed: false },
    ],
  },
  // Treinamentos Comerciais
  {
    id: '3',
    title: 'Técnicas de Prospecção',
    category: 'comercial',
    subcategory: 'prospeccao',
    description: 'Aprenda abordagens eficazes para prospectar novos clientes por diversos canais.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 40,
    contents: [
      { id: '3-1', type: 'video', title: 'Abordagem inicial', duration: 12, completed: false },
      { id: '3-2', type: 'text', title: 'Scripts de ligação', duration: 10, completed: false },
      { id: '3-3', type: 'text', title: 'Mensagens de primeiro contato', duration: 8, completed: false },
      { id: '3-4', type: 'checklist', title: 'Estratégias por canal', duration: 10, completed: false },
    ],
  },
  {
    id: '4',
    title: 'Negociação e Fechamento',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Domine técnicas de condução de reuniões e fechamento de vendas.',
    status: 'in_progress',
    progress: 25,
    estimatedMinutes: 50,
    contents: [
      { id: '4-1', type: 'video', title: 'Condução de reuniões', duration: 15, completed: true },
      { id: '4-2', type: 'video', title: 'Apresentação de propostas', duration: 12, completed: false },
      { id: '4-3', type: 'text', title: 'Tratamento de objeções', duration: 13, completed: false },
      { id: '4-4', type: 'checklist', title: 'Técnicas de fechamento', duration: 10, completed: false },
    ],
  },
  // Treinamentos do Sistema
  {
    id: '5',
    title: 'Visão Geral do Aplicativo',
    category: 'sistema',
    description: 'Conheça todas as funcionalidades do sistema Partner e como utilizá-las.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 25,
    contents: [
      { id: '5-1', type: 'video', title: 'Tour pelo aplicativo', duration: 10, completed: true },
      { id: '5-2', type: 'text', title: 'Navegação e menus', duration: 8, completed: true },
      { id: '5-3', type: 'tip', title: 'Atalhos úteis', duration: 7, completed: true },
    ],
  },
  {
    id: '6',
    title: 'Tela de Compromissos',
    category: 'sistema',
    description: 'Aprenda a usar a tela de compromissos para gerenciar suas atividades diárias.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: '6-1', type: 'video', title: 'Como criar compromissos', duration: 12, completed: false },
      { id: '6-2', type: 'video', title: 'Gerenciando atividades', duration: 10, completed: false },
      { id: '6-3', type: 'text', title: 'Filtros e status', duration: 8, completed: false },
      { id: '6-4', type: 'checklist', title: 'Boas práticas', duration: 5, completed: false },
    ],
  },
  // Treinamentos Operacionais
  {
    id: '7',
    title: 'Execução de Atividades',
    category: 'operacional',
    description: 'Como executar corretamente cada tipo de atividade no sistema.',
    status: 'in_progress',
    progress: 60,
    estimatedMinutes: 30,
    contents: [
      { id: '7-1', type: 'video', title: 'Tipos de atividades', duration: 10, completed: true },
      { id: '7-2', type: 'text', title: 'Fluxos corretos', duration: 8, completed: true },
      { id: '7-3', type: 'checklist', title: 'Tratamento de pendências', duration: 7, completed: false },
      { id: '7-4', type: 'tip', title: 'Dicas de produtividade', duration: 5, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento
  {
    id: '8',
    title: 'Gestão de Tempo',
    category: 'desenvolvimento',
    description: 'Técnicas para gerenciar seu tempo e aumentar sua produtividade.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 20,
    contents: [
      { id: '8-1', type: 'video', title: 'Princípios de gestão de tempo', duration: 8, completed: false },
      { id: '8-2', type: 'text', title: 'Técnicas práticas', duration: 7, completed: false },
      { id: '8-3', type: 'checklist', title: 'Rotina ideal', duration: 5, completed: false },
    ],
  },
];

// ========================================
// FUNCAO PARA CALCULAR PROGRESSO GERAL
// ========================================

export const calculateOverallProgress = (trainings: TrainingItem[]): number => {
  if (trainings.length === 0) return 0;
  const totalProgress = trainings.reduce((sum, t) => sum + t.progress, 0);
  return Math.round(totalProgress / trainings.length);
};

// ========================================
// FUNCAO PARA CONTAR POR STATUS
// ========================================

export const countByStatus = (trainings: TrainingItem[], status: TrainingStatus): number => {
  return trainings.filter(t => t.status === status).length;
};

// ========================================
// FUNCAO PARA FILTRAR POR CATEGORIA
// ========================================

export const filterByCategory = (
  trainings: TrainingItem[],
  category: TrainingCategory | null
): TrainingItem[] => {
  if (!category) return trainings;
  return trainings.filter(t => t.category === category);
};

// ========================================
// FUNCAO PARA FORMATAR DURACAO
// ========================================

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};
