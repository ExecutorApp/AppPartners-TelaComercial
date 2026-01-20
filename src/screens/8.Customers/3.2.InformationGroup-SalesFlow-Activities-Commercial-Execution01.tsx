import React from 'react';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

// ========================================
// CORES DO TEMA
// ========================================
export const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  background: '#F4F4F4', //....Cor de fundo
  white: '#FCFCFC', //.........Cor branca
  border: '#D8E0F0', //........Cor da borda
  green: '#4CAF50', //.........Cor verde (concluido)
};

// ========================================
// ICONES SVG
// ========================================

// Icone Navegacao Esquerda (Botao com borda)
export const NavArrowLeftIcon = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect
      x={0.25}
      y={0.25}
      width={34.5}
      height={34.5}
      rx={3.75}
      fill={COLORS.white}
      stroke={COLORS.border}
      strokeWidth={0.5}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.2208 11.7762C21.6036 12.1345 21.5912 12.7042 21.1931 13.0488L15.9428 17.5L21.1931 21.9513C21.5912 22.2958 21.6036 22.8655 21.2208 23.2238C20.838 23.5821 20.205 23.5933 19.8069 23.2487L13.8069 18.1487C13.6108 17.9791 13.5 17.7448 13.5 17.5C13.5 17.2552 13.6108 17.0209 13.8069 16.8513L19.8069 11.7513C20.205 11.4067 20.838 11.4179 21.2208 11.7762Z"
      fill={COLORS.primary}
    />
  </Svg>
);

// Icone Navegacao Direita (Botao com borda)
export const NavArrowRightIcon = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect
      x={0.25}
      y={0.25}
      width={34.5}
      height={34.5}
      rx={3.75}
      fill={COLORS.white}
      stroke={COLORS.border}
      strokeWidth={0.5}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7792 11.7762C13.3964 12.1345 13.4088 12.7042 13.8069 13.0488L19.0572 17.5L13.8069 21.9513C13.4088 22.2958 13.3964 22.8655 13.7792 23.2238C14.162 23.5821 14.795 23.5933 15.1931 23.2487L21.1931 18.1487C21.3892 17.9791 21.5 17.7448 21.5 17.5C21.5 17.2552 21.3892 17.0209 21.1931 16.8513L15.1931 11.7513C14.795 11.4067 14.162 11.4179 13.7792 11.7762Z"
      fill={COLORS.primary}
    />
  </Svg>
);

// Icone Play (apenas seta)
export const PlayIcon = () => (
  <Svg width={10} height={12} viewBox="0 0 10 12" fill="none">
    <Path
      d="M0.4925 0C0.5979 0 0.695 0.0345 0.7751 0.0918C0.7762 0.0926 0.7775 0.0932 0.7789 0.0934C0.7801 0.0935 0.7813 0.0939 0.7824 0.0946L9.7451 5.5642C9.8965 5.6495 10 5.8117 10 6C10 6.1881 9.8963 6.3501 9.7451 6.4354L0.7826 11.9053C0.7815 11.906 0.7802 11.9063 0.7789 11.9063C0.7774 11.9063 0.7761 11.9067 0.7749 11.9076C0.6948 11.965 0.598 12 0.4925 12C0.2205 12 0 11.7759 0 11.4998V0.5002C0 0.2241 0.2205 0 0.4925 0Z"
      fill={COLORS.primary}
    />
  </Svg>
);

// Icone Fechar do Header (fundo cinza)
export const HeaderCloseIcon = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect
      width={35}
      height={35}
      rx={8}
      fill={COLORS.background}
    />
    <Rect
      width={35}
      height={35}
      rx={8}
      stroke="#EDF2F6"
      strokeWidth={1}
    />
    <Path
      d="M23.655 11.7479C23.2959 11.4179 22.7339 11.4173 22.374 11.7466L17.5 16.2065L12.626 11.7466C12.2661 11.4173 11.7041 11.4179 11.345 11.7479L11.2916 11.797C10.9022 12.1549 10.9029 12.757 11.2931 13.114L16.0863 17.5L11.2931 21.886C10.9029 22.243 10.9022 22.8451 11.2916 23.203L11.345 23.2521C11.7041 23.5821 12.2661 23.5827 12.626 23.2534L17.5 18.7935L22.374 23.2534C22.7339 23.5827 23.2959 23.5821 23.655 23.2521L23.7084 23.203C24.0978 22.8451 24.0971 22.243 23.7069 21.886L18.9137 17.5L23.7069 13.114C24.0971 12.757 24.0978 12.1549 23.7084 11.797L23.655 11.7479Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

// Icone Check (Concluido) para Timeline
export const CheckIcon = () => (
  <Svg width={12} height={10} viewBox="0 0 12 10" fill="none">
    <Path
      d="M1 5L4.5 8.5L11 1.5"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Checkbox Vazio (Pendente)
export const CheckboxUncheckedIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3 1H17C18.1 1 19 1.9 19 3V17C19 18.1 18.1 19 17 19H3C1.9 19 1 18.1 1 17V3C1 1.9 1.9 1 3 1Z"
      stroke={COLORS.border}
      strokeWidth={1.5}
      fill="transparent"
    />
  </Svg>
);

// Icone Checkbox Marcado (Concluido)
export const CheckboxCheckedIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3 1H17C18.1 1 19 1.9 19 3V17C19 18.1 18.1 19 17 19H3C1.9 19 1 18.1 1 17V3C1 1.9 1.9 1 3 1Z"
      fill={COLORS.primary}
      stroke={COLORS.primary}
      strokeWidth={1.5}
    />
    <Path
      d="M5 10L8.5 13.5L15 6.5"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Status Preenchido com Check (Atividade)
export const StatusFilledCheckIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6.5} fill={COLORS.primary} />
    <Path
      d="M5.2 8.1L7.2 10.1L10.8 6.3"
      stroke={COLORS.white}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta para Baixo (Expandir)
export const ChevronDownIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4 6L8 10L12 6"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta para Cima (Colapsar)
export const ChevronUpIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4 10L8 6L12 10"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta para Baixo (Azul - Checklist oculto)
export const ChevronDownBlueIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M4 6L8 10L12 6"
      stroke={COLORS.primary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Calendario (Agenda)
export const CalendarIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M12.667 2.667H3.333C2.597 2.667 2 3.264 2 4v9.333c0 .737.597 1.334 1.333 1.334h9.334c.736 0 1.333-.597 1.333-1.334V4c0-.736-.597-1.333-1.333-1.333z"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10.667 1.333v2.667M5.333 1.333v2.667M2 6.667h12"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Relogio (Tempo)
export const ClockIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 14.667A6.667 6.667 0 108 1.333a6.667 6.667 0 000 13.334z"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 4v4l2.667 1.333"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Avatar Slim (Cliente)
export const AvatarSlimIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.5 14C13.5 11.5147 11.0376 9.5 8 9.5C4.96243 9.5 2.5 11.5147 2.5 14"
      stroke={COLORS.primary}
      strokeWidth={1.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Ocultar (Olho com linha)
export const HideIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M7.412 7.41a2.25 2.25 0 103.18 3.18M13.455 13.455A7.613 7.613 0 019 15c-4.5 0-7.5-6-7.5-6a13.71 13.71 0 013.045-3.955m2.543-1.463A6.87 6.87 0 019 3c4.5 0 7.5 6 7.5 6a13.746 13.746 0 01-1.478 2.123M1.5 1.5l15 15"
      stroke={COLORS.textSecondary}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// TIPOS
// ========================================

// Status da acao
export type ActionStatus = 'pending' | 'in_progress' | 'completed';

// Item de acao
export interface ActionItem {
  id: string; //................ID da acao
  title: string; //.............Titulo da acao
  status: ActionStatus; //......Status da acao
  endDate?: string; //..........Data de conclusao
}

// Props do TimelineStep
export interface TimelineStepProps {
  number: string; //.............Numero da etapa
  title: string; //..............Titulo da etapa
  isCompleted: boolean; //.......Se esta concluido
  isCurrent: boolean; //..........Se e a etapa atual
  isLast: boolean; //.............Se e a ultima etapa
  onPress?: () => void; //........Callback ao clicar
}

// Props do ChecklistItem
export interface ChecklistItemProps {
  title: string; //..............Titulo do item
  isCompleted: boolean; //.......Se esta concluido
  completedDate?: string; //......Data de conclusao
  onPress?: () => void; //........Callback ao clicar
}

// Props da atividade
export interface ActivityProps {
  id: string; //................ID da atividade
  title: string; //.............Titulo da atividade
  count?: string; //............Contador
}

// Dados do cliente para exibicao
export interface CustomerInfoProps {
  name?: string; //................Nome do cliente
  photo?: any; //..................Foto do cliente
  productName?: string; //.........Nome do produto
  phaseName?: string; //...........Nome da fase
  productIndex?: number; //........Indice do produto selecionado
  totalProducts?: number; //.......Total de produtos
  phaseIndex?: number; //..........Indice da fase selecionada
  totalPhases?: number; //.........Total de fases
}

// Props do componente principal
export type Props = {
  visible: boolean; //.................Visibilidade do modal
  onClose: () => void; //..............Callback de fechamento
  activity: ActivityProps | null; //...Atividade selecionada
  customerInfo?: CustomerInfoProps; //..Informacoes do cliente
};

// ========================================
// DADOS INICIAIS
// ========================================

export const INITIAL_ACTIONS: ActionItem[] = [
  {
    id: '1',
    title: 'Cadastrar Keyman',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Baixar Planilha',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Upload Planilha',
    status: 'pending',
  },
];

// ========================================
// FUNCAO AUXILIAR: Formata data/hora atual
// ========================================

export const formatCurrentDateTime = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} às ${hours}:${minutes}`;
};
