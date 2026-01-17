/**
 * ----------------------------------------===================================
 * 3.2.InformationGroup-SalesFlow-Activities-Chat-StatusActivities.tsx
 * ----------------------------------------===================================
 * Modal de Historico de Status da Atividade.
 * Exibe o historico de alteracoes de status da atividade vinculada ao chat.
 *
 * Status Principais (Macro):
 * - "null": Atividade nao precisa ser executada para o cliente
 * - "not_started": Atividade nao iniciada
 * - "started": Atividade iniciada (com eventos internos)
 * - "completed": Atividade concluida
 *
 * Sempre exibe tres cards:
 * 1. Nao Iniciada - com data prevista
 * 2. Iniciada - com eventos internos (pendente/retomada)
 * 3. Concluida - com data final
 * ----------------------------------------===================================
 */

import React, { memo, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// ----------------------------------------===================================
// Constantes
// ----------------------------------------===================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  background: '#FCFCFC',
  border: '#D8E0F0',
  white: '#FFFFFF',
  red: '#F44336',
  green: '#4CAF50',
  orange: '#FF9800',
  lightGray: '#F8F9FA',
  lightBlue: 'rgba(23, 119, 207, 0.05)',
};

// ----------------------------------------===================================
// Interfaces - Status Principais
// ----------------------------------------===================================

// Quatro status principais (macro) da atividade
export type ActivityStatus = 'null' | 'not_started' | 'started' | 'completed';

// Tipos de eventos internos dentro do status "started"
export type InternalEventType =
  | 'started'            // Inicio do fluxo (primeiro evento)
  | 'waiting_documents'  // Aguardando documentos (pendente)
  | 'delayed'            // Atrasado
  | 'custom';            // Evento personalizado

// Informacoes do colaborador responsavel
export type CollaboratorInfo = {
  name: string;
  whatsApp: string;
  photoUrl: string;
};

// Documento obrigatorio para checklist
export type RequiredDocument = {
  id: string;
  name: string;
  isReceived: boolean;
  receivedAt?: string; // Data e hora de recebimento (automatico)
  daysStatus: number;  // Dias: positivo = dentro do prazo, negativo = atrasado
  isOnTime: boolean;   // true = dentro do prazo (azul), false = atrasado (vermelho)
};

// Evento interno (ocorre dentro do status "started")
export type InternalEvent = {
  id: string;
  type: InternalEventType;
  date: string;
  time: string;
  collaborator?: CollaboratorInfo; // Responsavel pelo evento
  comment?: string; // Comentario/motivo
  documents?: RequiredDocument[]; // Checklist de documentos (para waiting_documents)
};

// Informacoes das colunas (Previsao, Realidade, Status) - Inicio e Conclusao
export type StatusColumnsInfo = {
  // Dados de CONCLUSAO (obrigatorios)
  forecastDate: string;    // Data de previsao de conclusao
  actualDate?: string;     // Data real de conclusao (quando disponivel)
  daysStatus: number;      // Dias de status da conclusao (+ ou -)
  isOnTime: boolean;       // Conclusao dentro do prazo ou nao
  // Dados de INICIO (opcionais - para produtos)
  startForecastDate?: string;  // Data de previsao de inicio
  startActualDate?: string;    // Data real de inicio (quando atividade iniciou)
  startDaysStatus?: number;    // Dias de status do inicio (+ ou -)
  startIsOnTime?: boolean;     // Inicio dentro do prazo ou nao
};

// Dados do card "Nao Iniciada"
export type NotStartedData = {
  forecastDate: string;    // Data prevista para inicio
  forecastTime: string;    // Hora prevista para inicio
};

// Dados do card "Iniciada" com eventos internos
export type StartedStatusData = {
  columns: StatusColumnsInfo;           // Tres colunas obrigatorias
  internalEvents: InternalEvent[];      // Eventos internos
};

// Dados do card "Concluida"
export type CompletedStatusData = {
  columns: StatusColumnsInfo;           // Tres colunas de conclusao
};

// Informacoes de status do Produto
export type ProductStatusInfo = {
  id: string;
  name: string;
  status: ActivityStatus;
  columns?: StatusColumnsInfo;          // Previsao, Realidade, Status
};

// Informacoes de status da Fase
export type PhaseStatusInfo = {
  id: string;
  name: string;
  status: ActivityStatus;
  productId: string;                    // ID do produto ao qual a fase pertence
  columns?: StatusColumnsInfo;          // Previsao, Realidade, Status
};

// Informacoes da atividade
export type ActivityInfo = {
  id: string;
  number: string;
  title: string;
  status: ActivityStatus;
  columns?: StatusColumnsInfo;          // Previsao, Realidade, Status (para o card principal)
  notStartedData?: NotStartedData;      // Dados do card "Nao Iniciada"
  startedData?: StartedStatusData;      // Dados do card "Iniciada"
  completedData?: CompletedStatusData;  // Dados do card "Concluida"
};

// Props do componente
type Props = {
  visible: boolean;
  onClose: () => void;
  activity: ActivityInfo | null;
  productInfo: ProductStatusInfo;       // Informacoes de status do produto atual
  phaseInfo: PhaseStatusInfo;           // Informacoes de status da fase atual
  currentActivityPosition: number;
  totalActivities: number;
  currentProductPosition?: number;      // Posicao atual do produto (ex: 1)
  totalProducts?: number;               // Total de produtos (ex: 3)
  currentPhasePosition?: number;        // Posicao atual da fase (ex: 2)
  totalPhases?: number;                 // Total de fases (ex: 5)
  // Lista de todos os produtos e fases
  allProducts?: ProductStatusInfo[];    // Lista de todos os produtos
  allPhases?: PhaseStatusInfo[];        // Lista de todas as fases (filtradas por produto)
  onProductSelect?: (productIndex: number) => void;  // Callback quando seleciona produto
  onPhaseSelect?: (phaseIndex: number) => void;      // Callback quando seleciona fase
  onActivitySelect?: (activityIndex: number) => void; // Callback quando seleciona atividade (navegacao pelas setas)
};

// ----------------------------------------===================================
// Icones SVG
// ----------------------------------------===================================

// Icone de Fechar (X) - cor mais escura para melhor contraste
const CloseIcon = memo(() => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Olho Aberto (para toggle no Header - mostra conteudo)
const EyeOpenIcon = memo(() => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke={COLORS.textPrimary}
      strokeWidth={2}
    />
  </Svg>
));

// Icone de Olho Fechado (para toggle no Header - oculta conteudo)
const EyeClosedIcon = memo(() => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 1L23 23"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Olho Aberto Pequeno (para toggle no StatusCard)
const EyeOpenIconSmall = memo(() => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke={COLORS.textSecondary}
      strokeWidth={2}
    />
  </Svg>
));

// Icone de Olho Fechado Pequeno (para toggle no StatusCard)
const EyeClosedIconSmall = memo(() => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94C16.2306 19.243 14.1491 19.9649 12 20C5 20 1 12 1 12C2.24389 9.68192 3.96914 7.65663 6.06 6.06M9.9 4.24C10.5883 4.07888 11.2931 3.99834 12 4C19 4 23 12 23 12C22.393 13.1356 21.6691 14.2048 20.84 15.19M14.12 14.12C13.8454 14.4148 13.5141 14.6512 13.1462 14.8151C12.7782 14.9791 12.3809 15.0673 11.9781 15.0744C11.5753 15.0815 11.1752 15.0074 10.8016 14.8565C10.4281 14.7056 10.0887 14.4811 9.80385 14.1962C9.51897 13.9113 9.29439 13.572 9.14351 13.1984C8.99262 12.8249 8.91853 12.4247 8.92563 12.0219C8.93274 11.6191 9.02091 11.2218 9.18488 10.8538C9.34884 10.4859 9.58525 10.1546 9.88 9.88"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 1L23 23"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Seta Esquerda (navegacao de produto)
const ArrowLeftIcon = memo(() => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M12.5 15L7.5 10L12.5 5"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Seta Direita (navegacao de produto)
const ArrowRightIcon = memo(() => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M7.5 15L12.5 10L7.5 5"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Produto (pasta/livro)
const ProductIcon = memo(() => (
  <Svg width={18} height={15} viewBox="0 0 18 15" fill="none">
    <Path
      d="M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365ZM0.77984 12.9566V3.39879C0.77984 3.14166 0.990597 2.9319 1.24895 2.9319L4.20635 2.93528V8.35873V13.4234L1.24895 13.4201C0.990597 13.4234 0.77984 13.2137 0.77984 12.9566ZM4.20635 13.4234V8.35873V2.93528H3.86642V13.4234H4.20635ZM13.3301 13.4234V2.93528H12.9902V13.4234H13.3301ZM16.4167 12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902V2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566Z"
      fill="#7D8592"
    />
    <Path
      d="M4.20635 2.93528L1.24895 2.9319C0.990597 2.9319 0.77984 3.14166 0.77984 3.39879V12.9566C0.77984 13.2137 0.990597 13.4234 1.24895 13.4201L4.20635 13.4234M4.20635 2.93528H3.86642V13.4234H4.20635M4.20635 2.93528V8.35873V13.4234M12.9902 2.93528H13.3301V13.4234H12.9902M12.9902 2.93528V13.4234M12.9902 2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365Z"
      stroke="#7D8592"
      strokeWidth={0.2}
    />
  </Svg>
));

// Icone de Fase (escada)
const PhaseIcon = memo(() => (
  <Svg width={17} height={15} viewBox="0 0 17 15" fill="none">
    <Path
      d="M15.8834 0.149902H13.5719H7.31721C7.16995 0.149902 7.05055 0.266243 7.05055 0.409735V2.99829H5.51565C5.36838 2.99829 5.24898 3.11463 5.24898 3.25812V5.41621H3.71396C3.56669 5.41621 3.44729 5.53255 3.44729 5.67604V8.36393H2.32034C2.17307 8.36393 2.05367 8.48028 2.05367 8.62377V11.0468H0.416691C0.269425 11.0468 0.150024 11.1631 0.150024 11.3066V13.8901C0.150024 14.0336 0.269425 14.1499 0.416691 14.1499H15.8834C16.0306 14.1499 16.15 14.0336 16.15 13.8901V0.409735C16.15 0.266243 16.0306 0.149902 15.8834 0.149902ZM13.3052 0.669567V2.99829H11.7702H7.58388V0.669567H13.3052ZM7.31721 3.51796H11.5035V5.41621H9.96865H5.78232V3.51796H7.31721ZM5.51565 5.93587H9.70198V8.36393H8.57489H3.98062V5.93587H5.51565ZM3.71396 8.8836H8.30823V11.0468H6.67138H2.587V8.8836H3.71396ZM0.683358 11.5664H2.32034H6.40471V13.6302H0.683358V11.5664ZM15.6167 13.6302H6.93805V11.5664H8.57489C8.72216 11.5664 8.84156 11.4501 8.84156 11.3066V8.8836H9.96865C10.1159 8.8836 10.2353 8.76726 10.2353 8.62377V5.93587H11.7702C11.9175 5.93587 12.0369 5.81953 12.0369 5.67604V3.51796H13.5719C13.7192 3.51796 13.8386 3.40162 13.8386 3.25812V0.669567H15.6167V13.6302Z"
      fill="#7D8592"
      stroke="#7D8592"
      strokeWidth={0.3}
    />
  </Svg>
));

// Icone de Atividade Concluida (fundo solido azul com check branco) - PADRAO DO SISTEMA
// MANUTENCAO - Tamanho do icone de Atividade Concluida: alterar width/height abaixo (atual: 18px)
const CheckCircleBlueIcon = memo(() => (
  <Svg width={18} height={18} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6.5} fill={COLORS.primary} />
    <Path d="M5.2 8.1L7.2 10.1L10.8 6.3" stroke={COLORS.white} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

// Icone de Atividade Iniciada (circulo com check cinza)
const CheckCircleGrayIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5ZM8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.5312 6.53125C11.825 6.2375 11.825 5.7625 11.5312 5.47188C11.2375 5.18125 10.7625 5.17813 10.4719 5.47188L7.00313 8.94063L5.53438 7.47188C5.24063 7.17813 4.76562 7.17813 4.475 7.47188C4.18437 7.76563 4.18125 8.24063 4.475 8.53125L6.475 10.5312C6.76875 10.825 7.24375 10.825 7.53438 10.5312L11.5312 6.53125Z"
      fill={COLORS.textSecondary}
    />
  </Svg>
));

// Icone de Atividade Nao Iniciada (circulo vazio cinza)
const EmptyCircleIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7.25} stroke="#6F7DA0" strokeWidth={1.5} />
  </Svg>
));

// Icone de Atividade Nula (circulo com linha diagonal vermelho - mesmo padrao do sistema)
const NullCircleIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6.5} stroke={COLORS.red} strokeWidth={1.5} />
    <Path
      d="M4.9 11.1L11.1 4.9"
      stroke={COLORS.red}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
));

// Icone de Atividade Atrasada (X no circulo vermelho) - mesmo padrao do sistema
const DelayedCircleIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7.25} stroke={COLORS.red} strokeWidth={1.5} />
    <Path
      d="M5 5L11 11M11 5L5 11"
      stroke={COLORS.red}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
));

// Icone de Joinha para Cima (dentro do prazo - azul)
const ThumbsUpIcon = memo(({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4.5 7H2.5C2.22386 7 2 7.22386 2 7.5V13.5C2 13.7761 2.22386 14 2.5 14H4.5C4.77614 14 5 13.7761 5 13.5V7.5C5 7.22386 4.77614 7 4.5 7Z"
      fill={color}
    />
    <Path
      d="M13.5 7H10.5L11.5 3.5C11.5 3.5 11.5 2 10 2C10 2 9 4 8 5.5C7.5 6.25 6.5 7 6.5 7V13C6.5 13 7 14 8 14H12C13 14 13.5 13.5 13.5 12.5V8C14 8 14 7 13.5 7Z"
      fill={color}
    />
  </Svg>
));

// Icone de Joinha para Baixo (fora do prazo - vermelho)
const ThumbsDownIcon = memo(({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4.5 9H2.5C2.22386 9 2 8.77614 2 8.5V2.5C2 2.22386 2.22386 2 2.5 2H4.5C4.77614 2 5 2.22386 5 2.5V8.5C5 8.77614 4.77614 9 4.5 9Z"
      fill={color}
    />
    <Path
      d="M13.5 9H10.5L11.5 12.5C11.5 12.5 11.5 14 10 14C10 14 9 12 8 10.5C7.5 9.75 6.5 9 6.5 9V3C6.5 3 7 2 8 2H12C13 2 13.5 2.5 13.5 3.5V8C14 8 14 9 13.5 9Z"
      fill={color}
    />
  </Svg>
));

// Icone de Check (checkbox marcado)
const CheckIcon = memo(({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Rect x={0.5} y={0.5} width={13} height={13} rx={2.5} fill={color} stroke={color} />
    <Path
      d="M3.5 7L5.5 9L10.5 4"
      stroke={COLORS.white}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Checkbox vazio
const UncheckedIcon = memo(() => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Rect x={0.5} y={0.5} width={13} height={13} rx={2.5} stroke={COLORS.border} strokeWidth={1} fill={COLORS.white} />
  </Svg>
));

// Icone de Relogio (aguardando/pendente)
const ClockIcon = memo(({ color = COLORS.orange }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7} stroke={color} strokeWidth={1.5} />
    <Path
      d="M8 4V8L10.5 10.5"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
));

// Icone de Play (retomado)
const PlayIcon = memo(({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7} stroke={color} strokeWidth={1.5} />
    <Path
      d="M6 5L11 8L6 11V5Z"
      fill={color}
    />
  </Svg>
));

// Icone de Interrogacao (pendente/aguardando) - igual ao icone de status original
const QuestionCircleIcon = memo(({ color = COLORS.orange }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7} stroke={color} strokeWidth={1.5} />
    <Path
      d="M6 6C6 4.89543 6.89543 4 8 4C9.10457 4 10 4.89543 10 6C10 6.83333 9.5 7.5 8.5 8C8.22386 8.13807 8 8.44772 8 8.75V9"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Circle cx={8} cy={11.5} r={0.75} fill={color} />
  </Svg>
));

// ----------------------------------------===================================
// Icones das Abas de Navegacao (Produto, Fase, Atividade)
// ----------------------------------------===================================

// Tipo para abas de visualizacao
type ViewTab = 'product' | 'phase' | 'activity';

// Icone de Produto para Tab (pasta/livro)
const ProductTabIcon = memo(({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={20} height={18} viewBox="0 0 18 15" fill="none">
    <Path
      d="M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365ZM0.77984 12.9566V3.39879C0.77984 3.14166 0.990597 2.9319 1.24895 2.9319L4.20635 2.93528V8.35873V13.4234L1.24895 13.4201C0.990597 13.4234 0.77984 13.2137 0.77984 12.9566ZM4.20635 13.4234V8.35873V2.93528H3.86642V13.4234H4.20635ZM13.3301 13.4234V2.93528H12.9902V13.4234H13.3301ZM16.4167 12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902V2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566Z"
      fill={color}
    />
  </Svg>
));

// Icone de Fase para Tab (escada)
const PhaseTabIcon = memo(({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={20} height={18} viewBox="0 0 17 15" fill="none">
    <Path
      d="M15.8834 0.149902H13.5719H7.31721C7.16995 0.149902 7.05055 0.266243 7.05055 0.409735V2.99829H5.51565C5.36838 2.99829 5.24898 3.11463 5.24898 3.25812V5.41621H3.71396C3.56669 5.41621 3.44729 5.53255 3.44729 5.67604V8.36393H2.32034C2.17307 8.36393 2.05367 8.48028 2.05367 8.62377V11.0468H0.416691C0.269425 11.0468 0.150024 11.1631 0.150024 11.3066V13.8901C0.150024 14.0336 0.269425 14.1499 0.416691 14.1499H15.8834C16.0306 14.1499 16.15 14.0336 16.15 13.8901V0.409735C16.15 0.266243 16.0306 0.149902 15.8834 0.149902ZM13.3052 0.669567V2.99829H11.7702H7.58388V0.669567H13.3052ZM7.31721 3.51796H11.5035V5.41621H9.96865H5.78232V3.51796H7.31721ZM5.51565 5.93587H9.70198V8.36393H8.57489H3.98062V5.93587H5.51565ZM3.71396 8.8836H8.30823V11.0468H6.67138H2.587V8.8836H3.71396ZM0.683358 11.5664H2.32034H6.40471V13.6302H0.683358V11.5664ZM15.6167 13.6302H6.93805V11.5664H8.57489C8.72216 11.5664 8.84156 11.4501 8.84156 11.3066V8.8836H9.96865C10.1159 8.8836 10.2353 8.76726 10.2353 8.62377V5.93587H11.7702C11.9175 5.93587 12.0369 5.81953 12.0369 5.67604V3.51796H13.5719C13.7192 3.51796 13.8386 3.40162 13.8386 3.25812V0.669567H15.6167V13.6302Z"
      fill={color}
      stroke={color}
      strokeWidth={0.3}
    />
  </Svg>
));

// Path do icone de foguete (Atividade) - icone original
const ACTIVITIES_ICON_PATH_D =
  'M2.75199 6.14177C2.97762 5.69102 3.22339 5.25675 3.48929 4.83897C3.75569 4.42118 4.04925 4.01284 4.36999 3.61396L3.25274 3.38641C3.17802 3.3675 3.10572 3.36993 3.03585 3.39367C2.96597 3.41742 2.90289 3.45692 2.84661 3.51218L1.08085 5.27663C1.05271 5.30425 1.04325 5.33673 1.05247 5.37405C1.06169 5.41137 1.08498 5.43948 1.12234 5.45838L2.75199 6.14177ZM11.0887 0.710287C9.96882 0.790258 8.98259 1.03623 8.13004 1.4482C7.27749 1.86017 6.47565 2.44129 5.72451 3.19157C5.18785 3.72858 4.71935 4.2879 4.31904 4.8695C3.91872 5.45111 3.58877 6.02908 3.32917 6.60342L5.3897 8.65722C5.9647 8.39792 6.54552 8.06834 7.13216 7.66848C7.71881 7.26863 8.28119 6.80019 8.81931 6.26318C9.57045 5.5129 10.1522 4.71513 10.5647 3.86987C10.9771 3.0246 11.2234 2.04265 11.3035 0.924028C11.3035 0.894463 11.3013 0.867079 11.2969 0.841876C11.2925 0.816673 11.277 0.790501 11.2503 0.763359C11.2236 0.736217 11.197' +
  '4 0.720708 11.1717 0.71683C11.146 0.712953 11.1186 0.710529 11.0895 0.70956M7.1984 4.80698C6.9849 4.59324 6.87815 4.33709 6.87815 4.03853C6.87815 3.73997 6.9849 3.48382 7.1984 3.27008C7.4119 3.05634 7.66907 2.94972 7.96992 2.9502C8.27076 2.95068 8.52769 3.05731 8.74071 3.27008C8.95372 3.48285 9.06047 3.739 9.06096 4.03853C9.06144 4.33806 8.95469 4.59397 8.74071 4.80625C8.52672 5.01854 8.26955 5.12517 7.96919 5.12614C7.66883 5.12711 7.41166 5.02048 7.19767 4.80625M5.85116 9.24682L6.53606 10.879C6.55498 10.9158 6.58288 10.9366 6.61976 10.9415C6.65664 10.9463 6.68939 10.9347 6.71802 10.9066L8.4845 9.15594C8.5403 9.10021 8.57985 9.0372 8.60314 8.96692C8.62692 8.89713 8.62934 8.82515 8.61042 8.751L8.3826 7.63504C7.98326 7.9559 7.57445 8.24839 7.15618 8.51254C6.73792 8.77669 6.30242 9.02145 5.85116 9.24682ZM12 0.604144C11.9942 1.81582 11.7642 2.93348 11.31 3.95711C10.8558 4.98073 10.1782 5.942' +
  '32 9.27713 6.84188C9.23055 6.8884 9.18615 6.93033 9.14393 6.96765C9.10172 7.00497 9.05756 7.04689 9.01146 7.09342L9.31934 8.59978C9.35816 8.79559 9.34846 8.98534 9.29023 9.16903C9.23152 9.35223 9.13107 9.5146 8.9889 9.65612L6.96185 11.6808C6.81725 11.8253 6.64087 11.8786 6.4327 11.8408C6.22503 11.8035 6.08188 11.6869 6.00327 11.4911L5.13132 9.43729L2.55183 6.84624L0.495663 5.97528C0.29963 5.89725 0.184388 5.75427 0.149936 5.54635C0.115485 5.33842 0.170559 5.16224 0.315157 5.01781L2.34148 2.99309C2.48317 2.85157 2.64669 2.75391 2.83205 2.70011C3.01692 2.64583 3.20738 2.63831 3.40341 2.67757L4.91078 2.9851C4.95736 2.93857 4.99715 2.89664 5.03015 2.85932C5.06266 2.822 5.1022 2.78008 5.14878 2.73355C6.04937 1.834 7.01207 1.15497 8.03688 0.696474C9.06169 0.237974 10.1809 0.00581607 11.3944 0C11.4726 0.00290803 11.5485 0.0184176 11.6222 0.0465286C11.696 0.0746396 11.7647 0.120684 11.8282 0.184' +
  '66C11.8918 0.248637 11.9355 0.314795 11.9592 0.383133C11.983 0.451472 11.9961 0.525142 11.9985 0.604144M1.01462 8.91676C1.29945 8.63274 1.64542 8.49218 2.05253 8.49509C2.45964 8.498 2.8056 8.64195 3.09043 8.92694C3.37527 9.21192 3.51695 9.55749 3.5155 9.96365C3.51404 10.3708 3.3709 10.7163 3.08607 11.0004C2.68139 11.4046 2.20537 11.659 1.65803 11.7637C1.11069 11.8679 0.558015 11.9467 0 12C0.0533754 11.4329 0.134652 10.8785 0.243829 10.3366C0.353005 9.79474 0.60945 9.32146 1.01462 8.91676ZM1.5343 9.44529C1.31837 9.66097 1.16868 9.91421 1.08522 10.205C1.00176 10.4958 0.940377 10.7973 0.901074 11.1094C1.21405 11.0702 1.5161 11.0071 1.80724 10.9204C2.09838 10.8336 2.35167 10.6827 2.56711 10.4675C2.71268 10.3221 2.78692 10.1488 2.78983 9.94765C2.79226 9.74603 2.72069 9.57252 2.57512 9.42712C2.42955 9.28171 2.25608 9.21216 2.05471 9.21847C1.85334 9.22428 1.67987 9.29989 1.5343 9.44529Z';

// Icone de Atividade para Tab (foguete - icone original)
const ActivityTabIcon = memo(({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={18} height={18} viewBox="0 0 12 12" fill="none">
    <Path d={ACTIVITIES_ICON_PATH_D} fill={color} />
  </Svg>
));

// ----------------------------------------===================================
// Linha Tracejada (SVG)
// ----------------------------------------===================================

const DASHED_LINE_CONFIG = {
  dashLength: 4,        // altura de cada traco (aumentado para mais visibilidade)
  dashGap: 2,           // espacamento entre tracos
  strokeWidth: 3,       // largura do traco
  lineWidth: 10,        // largura do SVG
  strokeColor: '#5F758B',
  strokeOpacity: 0.7,   // opacidade aumentada para mais visibilidade
};

// Altura para 4 tracos: 4 * dashLength + 3 * dashGap = 4*4 + 3*2 = 22px
const DASHED_LINE_HEIGHT_4_TRACES = 22;

const DashedLine = memo(({ height = 25 }: { height?: number }) => (
  <Svg
    width={DASHED_LINE_CONFIG.lineWidth}
    height={height}
    viewBox={`0 0 ${DASHED_LINE_CONFIG.lineWidth} ${height}`}
    fill="none"
  >
    <Path
      d={`M${DASHED_LINE_CONFIG.lineWidth / 2} 0V${height}`}
      stroke={DASHED_LINE_CONFIG.strokeColor}
      strokeOpacity={DASHED_LINE_CONFIG.strokeOpacity}
      strokeWidth={DASHED_LINE_CONFIG.strokeWidth}
      strokeDasharray={`${DASHED_LINE_CONFIG.dashLength} ${DASHED_LINE_CONFIG.dashGap}`}
    />
  </Svg>
));

// ----------------------------------------===================================
// Funcoes Auxiliares
// ----------------------------------------===================================

const getStatusLabel = (status: ActivityStatus): string => {
  switch (status) {
    case 'completed':
      return 'Atividade concluida';
    case 'started':
      return 'Atividade iniciada';
    case 'not_started':
      return 'Atividade nao iniciada';
    case 'null':
      return 'Nulo';
    default:
      return '';
  }
};

const getStatusIcon = (status: ActivityStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircleBlueIcon />;
    case 'started':
      return <CheckCircleGrayIcon />;
    case 'not_started':
      return <EmptyCircleIcon />;
    case 'null':
      return <NullCircleIcon />;
    default:
      return null;
  }
};

const getInternalEventLabel = (type: InternalEventType): string => {
  switch (type) {
    case 'started':
      return 'Atividade iniciada';
    case 'waiting_documents':
      return 'Atividade pendente';
    case 'delayed':
      return 'Atividade atrasada';
    case 'custom':
      return 'Evento';
    default:
      return '';
  }
};

const getInternalEventIcon = (type: InternalEventType) => {
  switch (type) {
    case 'started':
      return <CheckCircleGrayIcon />; // Icone original de atividade iniciada
    case 'waiting_documents':
      return <QuestionCircleIcon color={COLORS.orange} />; // Icone original de pendente
    case 'delayed':
      return <DelayedCircleIcon />; // Icone original de atrasado (X vermelho no circulo)
    case 'custom':
      return <EmptyCircleIcon />;
    default:
      return null;
  }
};

// Funcao para obter cores do evento (fundo e borda do container do icone)
const getInternalEventColors = (type: InternalEventType): { background: string; border: string } => {
  switch (type) {
    case 'started':
      return { background: 'rgba(111, 125, 160, 0.1)', border: COLORS.textSecondary }; // Cinza claro - mesma cor do icone
    case 'waiting_documents':
      return { background: 'rgba(255, 152, 0, 0.1)', border: COLORS.orange };
    case 'delayed':
      return { background: 'rgba(244, 67, 54, 0.1)', border: COLORS.red };
    case 'custom':
      return { background: 'rgba(111, 125, 160, 0.1)', border: '#6F7DA0' };
    default:
      return { background: COLORS.lightGray, border: COLORS.border };
  }
};

const formatDaysStatus = (days: number): string => {
  const absDays = Math.abs(days);
  return absDays.toString().padStart(2, '0');
};

// Formata data de DD/MM/YYYY para DD/MM/AA (formato compacto)
const formatDateCompact = (date: string | undefined): string => {
  if (!date) return '-'; // Hífen simples (mais sutil que travessão)
  // Verifica se a data esta no formato DD/MM/YYYY
  const parts = date.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    // Converte YYYY para AA (ultimos 2 digitos)
    return `${parts[0]}/${parts[1]}/${parts[2].slice(-2)}`;
  }
  // Se ja estiver em formato compacto ou outro, retorna como esta
  return date;
};

// Converte data DD/MM/YYYY para objeto Date
const parseDate = (dateStr: string | undefined): Date | null => {
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  // Formato: DD/MM/YYYY ou DD/MM/YY
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Mes e 0-indexed
  let year = parseInt(parts[2], 10);
  if (year < 100) year += 2000; // Converte YY para 20YY
  return new Date(year, month, day);
};

// Calcula a diferenca de dias entre duas datas
const calculateDaysBetween = (startDate: string | undefined, endDate: string | undefined): number | null => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return null;
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Calcula dias corridos desde uma data ate hoje
const calculateDaysFromToday = (startDate: string | undefined): number | null => {
  const start = parseDate(startDate);
  if (!start) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera horas para comparar apenas datas
  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Calcula dias de hoje ate uma data futura (positivo = dias restantes)
const calculateDaysUntilDate = (futureDate: string | undefined): number | null => {
  const future = parseDate(futureDate);
  if (!future) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Zera horas para comparar apenas datas
  const diffTime = future.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ----------------------------------------===================================
// Componente: Grid de Status do Produto (4 linhas x 4 colunas)
// Estrutura:
// Col1: vazio | Inicio | Conclusao | Dias
// Col2: Previsao | data prev inicio | data prev conclusao | dias previstos
// Col3: Real | data real inicio | data real conclusao | dias reais
// Col4: Status | status inicio | status conclusao | diferenca dias
// ----------------------------------------===================================

type ProductStatusGridProps = {
  columns?: StatusColumnsInfo;  // Dados atuais (usados para conclusao)
};

const ProductStatusGrid: React.FC<ProductStatusGridProps> = ({ columns }) => {
  // Se nao houver dados, nao renderiza nada
  if (!columns) return null;

  // Dados de CONCLUSAO
  const conclusionForecast = formatDateCompact(columns.forecastDate);
  const conclusionReal = formatDateCompact(columns.actualDate);

  // Status de conclusao: calcula dinamicamente
  // - Se tem conclusao real: previsao - real (quantos dias adiantou/atrasou)
  // - Se nao tem conclusao: previsao - hoje (quantos dias faltam ou passou)
  const conclusionDaysCalc = columns.actualDate
    ? calculateDaysBetween(columns.actualDate, columns.forecastDate) // Real -> Previsao
    : calculateDaysUntilDate(columns.forecastDate); // Hoje -> Previsao
  const conclusionDays = conclusionDaysCalc !== null
    ? formatDaysStatus(Math.abs(conclusionDaysCalc))
    : '-';
  const conclusionIsOnTime = conclusionDaysCalc !== null ? conclusionDaysCalc >= 0 : true;

  // Dados de INICIO
  const startForecast = formatDateCompact(columns.startForecastDate);
  const startReal = formatDateCompact(columns.startActualDate);

  // Status de inicio: SEMPRE calcula dinamicamente
  // - Se ja iniciou: previsao inicio - real inicio (quantos dias adiantou/atrasou)
  // - Se nao iniciou: previsao inicio - hoje (quantos dias faltam para comecar)
  const startDaysCalc = columns.startActualDate
    ? columns.startDaysStatus ?? 0 // Usa o valor existente se ja iniciou
    : calculateDaysUntilDate(columns.startForecastDate); // Hoje -> Previsao inicio
  const startDays = startDaysCalc !== null
    ? formatDaysStatus(Math.abs(startDaysCalc))
    : '-';
  const startIsOnTime = columns.startActualDate
    ? (columns.startIsOnTime ?? true)
    : (startDaysCalc !== null ? startDaysCalc >= 0 : true);

  // Dados de DIAS (nova linha)
  // Previsao: dias entre data previsao inicio e data previsao conclusao (150-365 dias)
  const daysForecast = calculateDaysBetween(columns.startForecastDate, columns.forecastDate);

  // Real:
  // - Se tem conclusao real: dias entre inicio real e conclusao real (travado)
  // - Se nao tem conclusao mas iniciou: dias corridos desde inicio real ate hoje
  // - Se nao iniciou: null (mostra "-")
  const daysReal = columns.actualDate
    ? calculateDaysBetween(columns.startActualDate, columns.actualDate)
    : calculateDaysFromToday(columns.startActualDate);

  // Status de dias: SEMPRE mostra quando tem previsao
  // - Se tem dias reais: previsao - real
  // - Se nao tem dias reais (nao iniciou): previsao - 0 = previsao (todos os dias disponiveis)
  const daysRealForCalc = daysReal ?? 0; // Se nao iniciou, considera 0 dias gastos
  const daysDiff = daysForecast !== null ? daysForecast - daysRealForCalc : null;
  const daysIsOnTime = daysDiff !== null ? daysDiff >= 0 : true;

  return (
    <View style={styles.productGridContainer}>
      {/* Linha 1: Cabecalhos */}
      <View style={styles.productGridRow}>
        <View style={styles.productGridCellLabel} />
        <View style={styles.productGridCellHeader}>
          <Text style={styles.productGridHeaderText}>Previsão</Text>
        </View>
        <View style={styles.productGridCellHeader}>
          <Text style={styles.productGridHeaderText}>Real</Text>
        </View>
        <View style={styles.productGridCellStatus}>
          <Text style={styles.productGridHeaderText}>Status</Text>
        </View>
      </View>

      {/* Linha 2: Início - Status SEMPRE visivel */}
      <View style={styles.productGridRow}>
        <View style={styles.productGridCellLabel}>
          <Text style={styles.productGridLabelText}>Início</Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>{startForecast}</Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>{startReal}</Text>
        </View>
        <View style={styles.productGridCellStatus}>
          <View style={styles.productGridStatusIndicator}>
            <Text style={[styles.productGridStatusText, { color: startIsOnTime ? COLORS.primary : COLORS.red }]}>
              {startDays}
            </Text>
            {startIsOnTime ? (
              <ThumbsUpIcon color={COLORS.primary} size={13} />
            ) : (
              <ThumbsDownIcon color={COLORS.red} size={13} />
            )}
          </View>
        </View>
      </View>

      {/* Linha 3: Conclusão */}
      <View style={styles.productGridRow}>
        <View style={styles.productGridCellLabel}>
          <Text style={styles.productGridLabelText}>Conclusão</Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>{conclusionForecast}</Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>{conclusionReal}</Text>
        </View>
        <View style={styles.productGridCellStatus}>
          <View style={styles.productGridStatusIndicator}>
            <Text
              style={[
                styles.productGridStatusText,
                { color: conclusionIsOnTime ? COLORS.primary : COLORS.red },
              ]}
            >
              {conclusionDays}
            </Text>
            {conclusionIsOnTime ? (
              <ThumbsUpIcon color={COLORS.primary} size={13} /> // MANUTENÇÃO: Tamanho do ícone like (linha 740)
            ) : (
              <ThumbsDownIcon color={COLORS.red} size={13} /> // MANUTENÇÃO: Tamanho do ícone like (linha 742)
            )}
          </View>
        </View>
      </View>

      {/* Linha 4: Dias - Status SEMPRE visivel */}
      <View style={[styles.productGridRow, styles.productGridRowLast]}>
        <View style={styles.productGridCellLabel}>
          <Text style={styles.productGridLabelText}>Dias</Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>
            {daysForecast !== null ? daysForecast.toString() : '-'}
          </Text>
        </View>
        <View style={styles.productGridCell}>
          <Text style={styles.productGridValueText}>
            {daysReal !== null ? daysReal.toString() : '-'}
          </Text>
        </View>
        <View style={styles.productGridCellStatus}>
          {daysDiff !== null ? (
            <View style={styles.productGridStatusIndicator}>
              <Text style={[styles.productGridStatusText, { color: daysIsOnTime ? COLORS.primary : COLORS.red }]}>
                {formatDaysStatus(Math.abs(daysDiff))}
              </Text>
              {daysIsOnTime ? (
                <ThumbsUpIcon color={COLORS.primary} size={13} />
              ) : (
                <ThumbsDownIcon color={COLORS.red} size={13} />
              )}
            </View>
          ) : (
            <Text style={styles.productGridValueText}>-</Text>
          )}
        </View>
      </View>
    </View>
  );
};

// ----------------------------------------===================================
// Componente: Tres Colunas (Previsao, Realidade, Status)
// ----------------------------------------===================================

type StatusColumnsProps = {
  columns: StatusColumnsInfo;
  secondColumnHeader?: string; // "Iniciou" para atividade iniciada, "Conclusao" para os demais
};

const StatusColumns: React.FC<StatusColumnsProps> = ({ columns, secondColumnHeader = 'Conclusao' }) => (
  <View style={styles.columnsRow}>
    {/* Coluna Previsao */}
    <View style={styles.column}>
      <Text style={styles.columnHeader}>Previsao</Text>
      <Text style={styles.columnValue}>{columns.forecastDate}</Text>
    </View>

    {/* Divisor */}
    <View style={styles.columnDivider} />

    {/* Coluna Iniciou/Conclusao */}
    <View style={styles.column}>
      <Text style={styles.columnHeader}>{secondColumnHeader}</Text>
      <Text style={styles.columnValue}>{columns.actualDate || '-'}</Text>
    </View>

    {/* Divisor */}
    <View style={styles.columnDivider} />

    {/* Coluna Status */}
    <View style={styles.column}>
      <Text style={styles.columnHeader}>Status</Text>
      <View style={styles.statusIndicator}>
        <Text
          style={[
            styles.statusDays,
            { color: columns.isOnTime ? COLORS.primary : COLORS.red },
          ]}
        >
          {formatDaysStatus(columns.daysStatus)}
        </Text>
        {columns.isOnTime ? (
          <ThumbsUpIcon color={COLORS.primary} size={15} />
        ) : (
          <ThumbsDownIcon color={COLORS.red} size={15} />
        )}
      </View>
    </View>
  </View>
);

// ----------------------------------------===================================
// Componente: Checklist de Documentos
// ----------------------------------------===================================

type DocumentChecklistProps = {
  documents: RequiredDocument[];
};

const DocumentChecklist: React.FC<DocumentChecklistProps> = ({ documents }) => (
  <View style={styles.checklistContainer}>
    <Text style={styles.checklistTitle}>Documentos obrigatorios</Text>
    {documents.map((doc, index) => {
      const isLast = index === documents.length - 1;
      return (
        <View
          key={doc.id}
          style={[
            styles.checklistItem,
            isLast && styles.checklistItemLast,
          ]}
        >
          <View style={styles.checklistCheckbox}>
            {doc.isReceived ? <CheckIcon /> : <UncheckedIcon />}
          </View>
          <View style={styles.checklistContent}>
            <Text
              style={[
                styles.checklistDocName,
                doc.isReceived && styles.checklistDocNameReceived,
              ]}
            >
              {doc.name}
            </Text>
            {doc.isReceived && doc.receivedAt && (
              <Text style={styles.checklistReceivedAt}>
                Recebido em: {doc.receivedAt}
              </Text>
            )}
          </View>
          {/* Indicador de dias */}
          <View style={styles.checklistDaysContainer}>
            <Text
              style={[
                styles.checklistDaysText,
                doc.isOnTime ? styles.checklistDaysOnTime : styles.checklistDaysLate,
              ]}
            >
              {Math.abs(doc.daysStatus).toString().padStart(2, '0')}
            </Text>
          </View>
        </View>
      );
    })}
  </View>
);

// ----------------------------------------===================================
// Componente: Evento Interno
// ----------------------------------------===================================

type InternalEventItemProps = {
  event: InternalEvent;
  isLast: boolean;
};

// Funcao para formatar telefone (remove +55 e formata com hifen)
const formatPhoneNumber = (phone: string): string => {
  // Remove +55 do inicio se existir
  let cleaned = phone.replace(/^\+55\s*/, '');
  // Remove espacos e caracteres especiais
  cleaned = cleaned.replace(/\s+/g, '').replace(/[()-]/g, '');
  // Formata como DDD-NUMERO (ex: 11 99999-2222)
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  return cleaned;
};

const InternalEventItem: React.FC<InternalEventItemProps> = ({ event, isLast }) => {
  const eventColors = getInternalEventColors(event.type);

  return (
    <View style={[styles.eventItemCard, isLast && styles.eventItemCardLast]}>
      {/* Header do evento: Icone + Status + Data/Hora */}
      <View style={styles.eventHeader}>
        <View
          style={[
            styles.eventIconContainer,
            {
              backgroundColor: eventColors.background,
              borderColor: eventColors.border,
              borderWidth: 1,
            },
          ]}
        >
          {getInternalEventIcon(event.type)}
        </View>
        <View style={styles.eventHeaderContent}>
          <Text style={styles.eventType}>{getInternalEventLabel(event.type)}</Text>
          <Text style={styles.eventDateTime}>
            {event.date} as {event.time}
          </Text>
        </View>
      </View>

      {/* Comentario/motivo (descricao) */}
      {event.comment && (
        <View style={styles.eventCommentContainer}>
          <Text style={styles.eventComment}>{event.comment}</Text>
        </View>
      )}

      {/* Colaborador responsavel */}
      {event.collaborator && (
        <View style={styles.eventCollaborator}>
          <Image
            source={{ uri: event.collaborator.photoUrl }}
            style={styles.eventCollaboratorPhoto}
          />
          <View style={styles.eventCollaboratorInfo}>
            <Text style={styles.eventCollaboratorName}>
              {event.collaborator.name}
            </Text>
            <Text style={styles.eventCollaboratorPhone}>
              {formatPhoneNumber(event.collaborator.whatsApp)}
            </Text>
          </View>
        </View>
      )}

      {/* Checklist de documentos (para evento waiting_documents) */}
      {event.type === 'waiting_documents' && event.documents && (
        <DocumentChecklist documents={event.documents} />
      )}
    </View>
  );
};

// ----------------------------------------===================================
// Componente: Card de Status
// ----------------------------------------===================================

type StatusCardProps = {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  children?: React.ReactNode;
  // Props opcionais para o toggle de visibilidade do historico de eventos
  showEyeToggle?: boolean;
  isEventsVisible?: boolean;
  onToggleEvents?: () => void;
};

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  icon,
  isActive,
  isCompleted,
  children,
  showEyeToggle = false,
  isEventsVisible = true,
  onToggleEvents,
}) => (
  <View
    style={[
      styles.statusCard,
      isActive && styles.statusCardActive,
      isCompleted && styles.statusCardCompleted,
    ]}
  >
    {/* Header do card */}
    <View style={styles.statusCardHeader}>
      <View style={styles.statusCardIconContainer}>
        {icon}
      </View>
      <Text style={styles.statusCardTitle}>{title}</Text>
      {/* Icone de olho para toggle do historico de eventos */}
      {showEyeToggle && onToggleEvents && (
        <TouchableOpacity
          style={styles.statusCardEyeButton}
          onPress={onToggleEvents}
          activeOpacity={0.7}
        >
          {isEventsVisible ? <EyeOpenIconSmall /> : <EyeClosedIconSmall />}
        </TouchableOpacity>
      )}
    </View>

    {/* Conteudo do card */}
    {children && (
      <View style={styles.statusCardContent}>
        {children}
      </View>
    )}
  </View>
);

// ----------------------------------------===================================
// Componente: Card de Item da Lista (Produto/Fase)
// ----------------------------------------===================================

type ListItemCardProps = {
  name: string;
  status: ActivityStatus;
  position: number;
  total: number;
  columns?: StatusColumnsInfo;
  isSelected: boolean;
  onPress: () => void;
};

const ListItemCard: React.FC<ListItemCardProps> = ({
  name,
  status,
  position,
  total,
  columns,
  isSelected,
  onPress,
}) => (
  <TouchableOpacity
    style={[
      styles.listItemCard,
      isSelected && styles.listItemCardSelected,
    ]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Header: Icone + Nome + Posicao */}
    <View style={styles.listItemHeader}>
      <View style={styles.listItemIconContainer}>
        {getStatusIcon(status)}
      </View>
      <Text style={styles.listItemName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.listItemPosition}>
        {String(position).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </Text>
    </View>

    {/* Conteudo: Grid 4x4 para Produto e Fase */}
    {columns && (
      <View style={styles.listItemColumns}>
        <ProductStatusGrid columns={columns} />
      </View>
    )}
  </TouchableOpacity>
);

// ----------------------------------------===================================
// Componente Principal
// ----------------------------------------===================================

const StatusActivitiesModal: React.FC<Props> = ({
  visible,
  onClose,
  activity,
  productInfo,
  phaseInfo,
  currentActivityPosition,
  totalActivities,
  currentProductPosition = 1,
  totalProducts = 1,
  currentPhasePosition = 1,
  totalPhases = 1,
  allProducts = [],
  allPhases = [],
  onProductSelect,
  onPhaseSelect,
  onActivitySelect,
}) => {
  const insets = useSafeAreaInsets();

  // Estado para controlar visibilidade do historico de eventos (olho aberto/fechado)
  const [showEventsHistory, setShowEventsHistory] = useState(true);

  // Estado para controlar visibilidade do conteudo superior (abas e atividades) - olho no header
  const [showTopContent, setShowTopContent] = useState(true);

  // Estado para a aba selecionada (Produto, Fase ou Atividade)
  const [selectedTab, setSelectedTab] = useState<ViewTab>('activity');

  // Animacao para entrada do card
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const cardTranslateY = useRef(new Animated.Value(0)).current;

  // Filtra fases pelo produto selecionado
  const phasesForCurrentProduct = allPhases.filter(
    (phase) => phase.productId === productInfo.id
  );

  // Funcao para trocar de aba com animacao
  const handleTabChange = (tab: ViewTab) => {
    if (tab === selectedTab) return;

    // Anima saida do card atual
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Troca a aba
      setSelectedTab(tab);

      // Reseta posicao para entrada
      cardTranslateY.setValue(20);

      // Anima entrada do novo card
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  // Funcoes de navegacao entre produtos
  const goToPreviousProduct = () => {
    if (currentProductPosition > 1 && onProductSelect) {
      onProductSelect(currentProductPosition - 2); // -2 porque position e 1-based e index e 0-based
    }
  };

  const goToNextProduct = () => {
    if (currentProductPosition < totalProducts && onProductSelect) {
      onProductSelect(currentProductPosition); // position ja e o proximo index
    }
  };

  // Funcoes de navegacao entre fases
  const goToPreviousPhase = () => {
    if (currentPhasePosition > 1 && onPhaseSelect) {
      onPhaseSelect(currentPhasePosition - 2);
    }
  };

  const goToNextPhase = () => {
    if (currentPhasePosition < totalPhases && onPhaseSelect) {
      onPhaseSelect(currentPhasePosition);
    }
  };

  // Funcoes de navegacao entre atividades
  const goToPreviousActivity = () => {
    if (currentActivityPosition > 1 && onActivitySelect) {
      onActivitySelect(currentActivityPosition - 2); // -2 porque position e 1-based e index e 0-based
    }
  };

  const goToNextActivity = () => {
    if (currentActivityPosition < totalActivities && onActivitySelect) {
      onActivitySelect(currentActivityPosition); // position ja e o proximo index
    }
  };

  // Funcao para selecionar produto na lista
  const handleProductListSelect = (index: number) => {
    if (onProductSelect) {
      onProductSelect(index);
    }
  };

  // Funcao para selecionar fase na lista
  const handlePhaseListSelect = (index: number) => {
    if (onPhaseSelect) {
      onPhaseSelect(index);
    }
  };

  if (!activity) return null;

  // Determina o estado de cada card
  const isNullStatus = activity.status === 'null';
  const isNotStarted = activity.status === 'not_started';
  const isStarted = activity.status === 'started';
  const isCompleted = activity.status === 'completed';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              paddingTop: insets.top + 10,
              // MANUTENCAO - Padding inferior do modal: alterar paddingBottom abaixo (atual: apenas insets.bottom para safe area)
              paddingBottom: insets.bottom,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Historico de Status</Text>
            <View style={styles.headerButtonsContainer}>
              {/* Botao do olho - apenas na aba Atividades */}
              {selectedTab === 'activity' && (
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => setShowTopContent(!showTopContent)}
                  activeOpacity={0.7}
                >
                  {showTopContent ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </TouchableOpacity>
              )}
              {/* Botao fechar */}
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <CloseIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Barra de Abas: Produto | Fase | Atividade - oculta quando olho fechado na aba Atividades */}
          {showTopContent && (
              <View style={styles.tabBar}>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'product' && styles.tabButtonActive,
                  ]}
                  onPress={() => handleTabChange('product')}
                  activeOpacity={0.7}
                >
                  <ProductTabIcon
                    color={selectedTab === 'product' ? COLORS.white : COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'phase' && styles.tabButtonActive,
                  ]}
                  onPress={() => handleTabChange('phase')}
                  activeOpacity={0.7}
                >
                  <PhaseTabIcon
                    color={selectedTab === 'phase' ? COLORS.white : COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tabButton,
                    selectedTab === 'activity' && styles.tabButtonActive,
                  ]}
                  onPress={() => handleTabChange('activity')}
                  activeOpacity={0.7}
                >
                  <ActivityTabIcon
                    color={selectedTab === 'activity' ? COLORS.white : COLORS.textPrimary}
                  />
                </TouchableOpacity>
              </View>
          )}

          {/* Container animado com o card selecionado - oculta quando olho fechado */}
          {showTopContent && (
              <Animated.View
                style={[
                  styles.animatedCardContainer,
                  {
                    opacity: cardOpacity,
                    transform: [{ translateY: cardTranslateY }],
                  },
                ]}
              >
                {/* Card Produto com Status */}
                {selectedTab === 'product' && (
                  <View style={styles.productPhaseStatusCard}>
                    {/* Linha de Navegacao de Produto (dentro do card) */}
                    <View style={styles.cardNavigationRow}>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToPreviousProduct}
                        activeOpacity={0.7}
                      >
                        <ArrowLeftIcon />
                      </TouchableOpacity>
                      <Text style={styles.cardNavigationTitle}>Produto</Text>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToNextProduct}
                        activeOpacity={0.7}
                      >
                        <ArrowRightIcon />
                      </TouchableOpacity>
                    </View>

                    {/* Divisoria entre navegacao e conteudo */}
                    <View style={styles.cardNavigationDivider} />

                    {/* Header do Produto */}
                    <View style={styles.productPhaseStatusHeader}>
                      <View style={styles.productPhaseStatusIconContainer}>
                        {getStatusIcon(productInfo.status)}
                      </View>
                      <Text style={styles.productPhaseStatusName} numberOfLines={1}>
                        {productInfo.name}
                      </Text>
                      <Text style={styles.productPhasePositionText}>
                        {String(currentProductPosition).padStart(2, '0')}/{String(totalProducts).padStart(2, '0')}
                      </Text>
                    </View>

                    {/* Grid de Status do Produto (3 linhas x 4 colunas) */}
                    <ProductStatusGrid columns={productInfo.columns} />
                  </View>
                )}

                {/* Card Fase com Status */}
                {selectedTab === 'phase' && (
                  <View style={styles.productPhaseStatusCard}>
                    {/* Linha de Navegacao de Fase (dentro do card) */}
                    <View style={styles.cardNavigationRow}>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToPreviousPhase}
                        activeOpacity={0.7}
                      >
                        <ArrowLeftIcon />
                      </TouchableOpacity>
                      <Text style={styles.cardNavigationTitle}>Fases</Text>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToNextPhase}
                        activeOpacity={0.7}
                      >
                        <ArrowRightIcon />
                      </TouchableOpacity>
                    </View>

                    {/* Divisoria entre navegacao e conteudo */}
                    <View style={styles.cardNavigationDivider} />

                    {/* Header da Fase */}
                    <View style={styles.productPhaseStatusHeader}>
                      <View style={styles.productPhaseStatusIconContainer}>
                        {getStatusIcon(phaseInfo.status)}
                      </View>
                      <Text style={styles.productPhaseStatusName} numberOfLines={1}>
                        {phaseInfo.name}
                      </Text>
                      <Text style={styles.productPhasePositionText}>
                        {String(currentPhasePosition).padStart(2, '0')}/{String(totalPhases).padStart(2, '0')}
                      </Text>
                    </View>

                    {/* Grid 4x4 da Fase (igual ao produto) */}
                    <ProductStatusGrid columns={phaseInfo.columns} />
                  </View>
                )}

                {/* Card Atividade com Status */}
                {selectedTab === 'activity' && (
                  <View style={styles.productPhaseStatusCard}>
                    {/* Linha de Navegacao de Atividade (dentro do card) */}
                    <View style={styles.cardNavigationRow}>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToPreviousActivity}
                        activeOpacity={0.7}
                      >
                        <ArrowLeftIcon />
                      </TouchableOpacity>
                      <Text style={styles.cardNavigationTitle}>Atividades</Text>
                      <TouchableOpacity
                        style={styles.navArrowButton}
                        onPress={goToNextActivity}
                        activeOpacity={0.7}
                      >
                        <ArrowRightIcon />
                      </TouchableOpacity>
                    </View>

                    {/* Divisoria entre navegacao e conteudo */}
                    <View style={styles.cardNavigationDivider} />

                    {/* Header da Atividade */}
                    <View style={styles.productPhaseStatusHeader}>
                      <View style={styles.productPhaseStatusIconContainer}>
                        {getStatusIcon(activity.status)}
                      </View>
                      <Text style={styles.productPhaseStatusName} numberOfLines={1}>
                        {activity.title}
                      </Text>
                      <Text style={styles.productPhasePositionText}>
                        {String(currentActivityPosition).padStart(2, '0')}/{String(totalActivities).padStart(2, '0')}
                      </Text>
                    </View>

                    {/* Grid 4x4 da Atividade (igual ao produto e fase) */}
                    <ProductStatusGrid columns={activity.columns} />
                  </View>
                )}
              </Animated.View>
          )}

              {/* ============================================================
                  CONTEUDO CONDICIONAL POR ABA:
                  - Produto: Lista de todos os produtos
                  - Fase: Lista de fases do produto selecionado
                  - Atividade: Fluxo de status da atividade
                  ============================================================ */}

              {/* ABA PRODUTO: Lista de todos os produtos */}
              {showTopContent && selectedTab === 'product' && (
                <View style={styles.listSectionWrapper}>
                  <View style={styles.statusFlowTopDivider} />
                  <View style={styles.listSectionLabelContainer}>
                    <Text style={styles.listSectionLabel}>TODOS OS PRODUTOS</Text>
                  </View>
                  <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.listScrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {allProducts.map((product, index) => (
                      <ListItemCard
                        key={product.id}
                        name={product.name}
                        status={product.status}
                        position={index + 1}
                        total={allProducts.length}
                        columns={product.columns}
                        isSelected={index === currentProductPosition - 1}
                        onPress={() => handleProductListSelect(index)}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* ABA FASE: Lista de fases do produto selecionado */}
              {showTopContent && selectedTab === 'phase' && (
                <View style={styles.listSectionWrapper}>
                  <View style={styles.statusFlowTopDivider} />
                  <View style={styles.listSectionLabelContainer}>
                    <TouchableOpacity
                      style={styles.listSectionLabelTouchable}
                      onLongPress={() => {
                        // Tooltip: mostra nome completo em alert para nomes truncados
                        if (productInfo.name.length > 25) {
                          alert(`Fases do Produto: ${productInfo.name}`);
                        }
                      }}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={styles.listSectionLabel}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        FASES DO PRODUTO:{' '}
                        <Text style={styles.listSectionLabelProductName}>
                          {productInfo.name.toUpperCase()}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    style={styles.scrollContainer}
                    contentContainerStyle={styles.listScrollContent}
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                  >
                    {phasesForCurrentProduct.map((phase, index) => (
                      <ListItemCard
                        key={phase.id}
                        name={phase.name}
                        status={phase.status}
                        position={index + 1}
                        total={phasesForCurrentProduct.length}
                        columns={phase.columns}
                        isSelected={index === currentPhasePosition - 1}
                        onPress={() => handlePhaseListSelect(index)}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* ABA ATIVIDADE: Fluxo de status */}
              {selectedTab === 'activity' && (
                <>
                  {/* Status "Nulo": Apenas mensagem simples */}
                  {isNullStatus && (
                    <View style={styles.nullStatusContainer}>
                      <Text style={styles.nullStatusText}>
                        Esta atividade nao precisa ser executada para este cliente.
                      </Text>
                    </View>
                  )}

                  {/* Secao "FLUXO DE STATUS" com fundo diferenciado */}
                  {!isNullStatus && (
                    <View style={styles.statusFlowSectionWrapper}>
                      {/* Divisoria fina no topo da secao */}
                      <View style={styles.statusFlowTopDivider} />
                      {/* Label "FLUXO DE STATUS" - centralizado */}
                      <View style={styles.statusFlowTitleContainer}>
                        <Text style={styles.statusFlowLabel}>FLUXO DE STATUS</Text>
                      </View>
                      {/* Contexto: Produto > Fase > Atividade - alinhado à esquerda */}
                      <View style={styles.statusFlowContextContainer}>
                        <Text style={styles.statusFlowContextLine}>
                          <Text style={styles.statusFlowContextLabel}>Produto: </Text>
                          <Text style={styles.statusFlowContextValue}>{productInfo.name}</Text>
                        </Text>
                        <View style={styles.statusFlowContextDivider} />
                        <Text style={styles.statusFlowContextLine}>
                          <Text style={styles.statusFlowContextLabel}>Fase: </Text>
                          <Text style={styles.statusFlowContextValue}>{phaseInfo.name}</Text>
                        </Text>
                        <View style={styles.statusFlowContextDivider} />
                        <Text style={styles.statusFlowContextLine}>
                          <Text style={styles.statusFlowContextLabel}>Atividade: </Text>
                          <Text style={styles.statusFlowContextValue}>{activity.title}</Text>
                        </Text>
                      </View>
                      {/* Cards que rolam */}
                      <ScrollView
                        style={styles.scrollContainer}
                        contentContainerStyle={styles.statusCardsScrollContent}
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                      >
                        {/* Card 1: Nao Iniciada (sem conteudo, pois a previsao ja esta no card Iniciada) */}
                        <StatusCard
                          title="Atividade nao iniciada"
                          icon={<EmptyCircleIcon />}
                          isActive={isNotStarted}
                          isCompleted={isStarted || isCompleted}
                        />

                        {/* Linha conectora */}
                        <View style={styles.connectorLine}>
                          <DashedLine height={20} />
                        </View>

                        {/* Card 2: Iniciada */}
                        <StatusCard
                          title="Atividade iniciada"
                          icon={<CheckCircleGrayIcon />}
                          isActive={isStarted}
                          isCompleted={isCompleted}
                          showEyeToggle={(isStarted || isCompleted) && activity.startedData?.internalEvents && activity.startedData.internalEvents.length > 0}
                          isEventsVisible={showEventsHistory}
                          onToggleEvents={() => setShowEventsHistory(!showEventsHistory)}
                        >
                          {/* Para atividades NAO iniciadas: mostra apenas colunas, sem historico */}
                          {isNotStarted && activity.columns && (
                            <StatusColumns columns={activity.columns} secondColumnHeader="Iniciou" />
                          )}

                          {/* Para atividades INICIADAS: mostra colunas + historico de eventos */}
                          {(isStarted || isCompleted) && activity.startedData && (
                            <>
                              {/* Tres colunas */}
                              <StatusColumns columns={activity.startedData.columns} secondColumnHeader="Iniciou" />

                              {/* Eventos internos - so aparece quando a atividade foi iniciada E o olho estiver aberto */}
                              {showEventsHistory && activity.startedData.internalEvents.length > 0 && (
                                <View style={styles.eventsSection}>
                                  <Text style={styles.eventsSectionTitle}>Historico de eventos</Text>
                                  {activity.startedData.internalEvents.map((event, index) => (
                                    <InternalEventItem
                                      key={event.id}
                                      event={event}
                                      isLast={index === activity.startedData!.internalEvents.length - 1}
                                    />
                                  ))}
                                </View>
                              )}
                            </>
                          )}
                        </StatusCard>

                        {/* Linha conectora */}
                        <View style={styles.connectorLine}>
                          <DashedLine height={20} />
                        </View>

                        {/* Card 3: Concluida - SEMPRE mostra as tres colunas */}
                        <StatusCard
                          title="Atividade concluida"
                          icon={<CheckCircleBlueIcon />}
                          isActive={isCompleted}
                          isCompleted={false}
                        >
                          {/* Usa completedData se disponivel, senao usa activity.columns */}
                          {activity.completedData ? (
                            <StatusColumns columns={activity.completedData.columns} />
                          ) : activity.columns ? (
                            <StatusColumns columns={activity.columns} />
                          ) : null}
                        </StatusCard>
                      </ScrollView>
                    </View>
                  )}
                </>
              )}
        </View>
      </View>
    </Modal>
  );
};

// ----------------------------------------===================================
// Estilos
// ----------------------------------------===================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH - 20,
    height: SCREEN_HEIGHT - 40,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    overflow: 'hidden',
  },

  // ----------------------------------------
  // Header
  // ----------------------------------------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
    textAlign: 'left',
  },

  // ----------------------------------------
  // Barra de Abas (Produto, Fase, Atividade)
  // ----------------------------------------
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  tabButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  animatedCardContainer: {
    marginBottom: 15, // Espacamento igual ao de cima (15px)
  },

  // ----------------------------------------
  // Navegacao dentro dos Cards (Produto/Fase)
  // ----------------------------------------
  cardNavigationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navArrowButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
  },
  cardNavigationTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  cardNavigationDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },

  // ----------------------------------------
  // Card Produto/Fase com Status
  // ----------------------------------------
  productPhaseStatusCard: {
    marginHorizontal: 15,
    marginTop: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  phaseStatusCard: {
    marginTop: 0,
  },
  productPhaseStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  productPhaseStatusIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productPhaseStatusName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  productPhasePositionText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  productPhaseConnector: {
    position: 'absolute',
    bottom: -15,
    left: 20,
    zIndex: 1,
  },
  productPhaseConnectorCentered: {
    alignItems: 'center',
    marginVertical: 5,
  },
  dashedLineConnector: {
    alignItems: 'center',
    // Sem margens para que os tracos colem nos containers
  },
  activityStatusCard: {
    marginTop: 0,
  },

  // ----------------------------------------
  // Cabecalho da Atividade
  // ----------------------------------------
  activityHeader: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  activityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityLabelText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  activityPositionText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activityIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },

  // ----------------------------------------
  // Status Nulo
  // ----------------------------------------
  nullStatusContainer: {
    margin: 15,
    padding: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  nullStatusText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },

  // ----------------------------------------
  // Scroll Container
  // ----------------------------------------
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 30,
  },
  scrollContentFull: {
    paddingBottom: 30,
  },
  // Secao superior (Produto, Fase, Atividade) no MODO 1
  upperSectionScroll: {
    maxHeight: '45%', // Limita a altura da secao superior para deixar espaco para os status cards
  },
  upperSectionContent: {
    paddingBottom: 10,
  },
  statusCardsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  // Wrapper da secao "FLUXO DE STATUS" com fundo diferenciado
  statusFlowSectionWrapper: {
    flex: 1,
    backgroundColor: '#EDF2F6', // Fundo cinza azulado claro para destacar a secao visualmente
  },
  // Divisoria fina no topo da secao de status
  statusFlowTopDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  // Container do titulo "FLUXO DE STATUS" - centralizado
  statusFlowTitleContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    alignItems: 'center', // Centralizado
  },
  statusFlowLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'center', // Centralizado
  },
  // Container do contexto: Produto > Fase > Atividade - alinhado à esquerda
  statusFlowContextContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    alignItems: 'flex-start', // Alinhado à esquerda
    gap: 2,
  },
  statusFlowContextLine: {
    fontFamily: 'Inter_400Regular',
  },
  statusFlowContextLabel: {
    fontSize: 14, // Tamanho da fonte dos labels (Produto:, Fase:, Atividade:)
    color: COLORS.textSecondary,
  },
  statusFlowContextValue: {
    fontSize: 13, // Tamanho da fonte dos valores (Holding Patrimonial, Keymans, etc)
    color: COLORS.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  // Divisoria entre linhas do contexto (Produto/Fase/Atividade)
  statusFlowContextDivider: {
    height: 0.5,
    alignSelf: 'stretch', // Largura maxima do container
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  // Conteudo dos cards de status que rola
  statusCardsScrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },

  // ----------------------------------------
  // Card de Status
  // ----------------------------------------
  statusCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 0.5, // Borda extremamente fina
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  statusCardActive: {
    // Borda fina cinza padrao (sem borda azul)
    borderColor: COLORS.border,
    backgroundColor: COLORS.white, // Fundo branco independente do status
  },
  statusCardCompleted: {
    // Borda fina cinza padrao (sem borda azul)
    borderColor: COLORS.border,
  },

  // ----------------------------------------
  // Card de Item da Lista (Produto/Fase)
  // ----------------------------------------
  listItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
    overflow: 'hidden',
  },
  listItemCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.lightBlue,
  },
  listItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  listItemIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItemName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  listItemPosition: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  listItemColumns: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  // Container da lista de produtos/fases
  listSectionWrapper: {
    flex: 1,
    backgroundColor: '#EDF2F6',
  },
  listSectionLabelContainer: {
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
  },
  listSectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  listSectionLabelProductName: {
    color: COLORS.textPrimary, // Preto para destacar o nome do produto
  },
  listSectionLabelTouchable: {
    alignItems: 'flex-start',
  },
  listScrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  statusCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    gap: 10,
  },
  statusCardIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  // Botao do olho para toggle do historico de eventos
  statusCardEyeButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#F4F4F4',
  },
  statusCardContent: {
    padding: 12,
  },

  // ----------------------------------------
  // Conteudo Nao Iniciada
  // ----------------------------------------
  notStartedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notStartedLabel: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  notStartedValue: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: COLORS.textPrimary,
  },

  // ----------------------------------------
  // Linha Conectora
  // ----------------------------------------
  connectorLine: {
    alignItems: 'center',
    // Sem margem para que a linha tracejada encoste nos containers
  },

  // ----------------------------------------
  // Tres Colunas (Previsao, Realidade, Status)
  // ----------------------------------------
  columnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: 12, // MANUTENÇÃO: Aumentado de 11 para 12
    fontFamily: 'Inter_500Medium',
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  columnValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  columnDivider: {
    width: 0.5,
    height: 35,
    backgroundColor: COLORS.border,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDays: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  // ----------------------------------------
  // Secao de Eventos
  // ----------------------------------------
  eventsSection: {
    marginTop: 12,
    paddingTop: 12,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.border,
    backgroundColor: 'rgba(23, 119, 207, 0.25)', // Azul com 80% de opacidade - altere o 0.8 para ajustar
    borderRadius: 8,
    marginHorizontal: -12, // Compensa o padding do statusCardContent
    marginBottom: -12, // Estende ate o final do container
  },
  eventsSectionTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#3A3F51', // Cor preta padrao do sistema - altere o hex para ajustar
    marginBottom: 12,
    textTransform: 'uppercase',
    paddingHorizontal: 5,
  },

  // ----------------------------------------
  // Eventos Internos - Cards individuais
  // ----------------------------------------
  eventItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10, // 10px de espacamento entre cards
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  eventItemCardLast: {
    marginBottom: 0, // Ultimo card sem margem inferior
  },
  // Estilos antigos mantidos para compatibilidade
  eventItem: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  eventItemLast: {
    borderBottomWidth: 0,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventIconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderRadius: 8,
  },
  eventHeaderContent: {
    flex: 1,
  },
  eventType: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  eventDateTime: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  eventCommentContainer: {
    marginTop: 10,
  },
  eventComment: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  eventCollaborator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  eventCollaboratorPhoto: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: COLORS.border,
  },
  eventCollaboratorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  eventCollaboratorName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: COLORS.textPrimary,
  },
  eventCollaboratorPhone: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // ----------------------------------------
  // Checklist de Documentos
  // ----------------------------------------
  checklistContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  checklistTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  checklistItemLast: {
    borderBottomWidth: 0, // Remove divisoria do ultimo item
  },
  checklistCheckbox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checklistContent: {
    flex: 1,
  },
  checklistDocName: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  checklistDocNameReceived: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  checklistReceivedAt: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: COLORS.green,
    marginTop: 2,
  },
  checklistDaysContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistDaysText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  checklistDaysOnTime: {
    color: COLORS.primary, // Azul - dentro do prazo
  },
  checklistDaysLate: {
    color: COLORS.red, // Vermelho - atrasado
  },
  // ----------------------------------------===================================
  // Estilos: Grid de Status do Produto (3 linhas x 4 colunas)
  // ----------------------------------------===================================
  productGridContainer: {
    marginTop: 8,
  },
  productGridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    paddingVertical: 6,
  },
  productGridRowLast: {
    borderBottomWidth: 0,
  },
  productGridCellLabel: {
    width: 70,
    paddingLeft: 4,
  },
  productGridCellHeader: {
    flex: 1.2, // Mais espaço entre Previsão e Real
    alignItems: 'center',
  },
  productGridCell: {
    flex: 1.2, // Mais espaço entre Previsão e Real
    alignItems: 'center',
  },
  productGridCellStatus: {
    flex: 0.8, // Coluna Status mais compacta
    alignItems: 'flex-end', // Alinhado a extrema direita
    paddingRight: 0, // Sem margem - vai ate o limite da coluna
  },
  productGridHeaderText: {
    fontSize: 12, // MANUTENÇÃO: Aumentado de 11 para 12 (linha 2489)
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  productGridLabelText: {
    fontSize: 12, // MANUTENÇÃO: Aumentado de 11 para 12 (linha 2495)
    fontFamily: 'Inter_400Regular',
    color: COLORS.textSecondary,
  },
  productGridValueText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
  },
  productGridStatusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  productGridStatusText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default StatusActivitiesModal;
