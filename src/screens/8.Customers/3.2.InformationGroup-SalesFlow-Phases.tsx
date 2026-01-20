import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Svg, Path, Circle, Line } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ProductItem, PhaseItem, ActivityItem } from './3.2.InformationGroup-SalesFlow-Orchestrator';
import StatusActivitiesModal from './3.2.InformationGroup-SalesFlow-Activities-Chat-StatusActivities';

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
  orange: '#FF8A00',
  red: '#F44336',
  blue: '#1E88E5',
};

// ========================================
// CONTAINER: STATUS SUPERIOR
// Icones e contadores de status do fluxo
// ========================================

// Icones de status (geral)
const STATUS_ICON_SIZE = 20;           // ajusta tamanho dos icones de status (geral)

// Icone de status Concluido
const STATUS_CONCLUIDO_ICON_SIZE = 22; // ajusta tamanho do icone de status Concluido

const StatusCircleIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path d="M7.64999 14.6499C11.516 14.6499 14.65 11.5159 14.65 7.6499C14.65 3.78391 11.516 0.649902 7.64999 0.649902C3.784 0.649902 0.649994 3.78391 0.649994 7.6499C0.649994 11.5159 3.784 14.6499 7.64999 14.6499Z" stroke="#6F7DA0" strokeWidth="1.3"/>
  </Svg>
);

const StatusCheckIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Path d="M5.2 8.1L7.2 10.1L10.8 6.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StatusQuestionIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Path
      d="M6.7 6.5C6.7 5.7 7.3 5.1 8.1 5.1C8.9 5.1 9.5 5.7 9.5 6.5C9.5 7.9 8.1 7.8 8.1 9.1"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="8.1" cy="11" r="0.8" fill={color} />
  </Svg>
);

const StatusBanIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Line x1="4.9" y1="11.1" x2="11.1" y2="4.9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const StatusXIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Path d="M5.7 5.7L10.3 10.3M10.3 5.7L5.7 10.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </Svg>
);

const StatusFilledCheckIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" fill={color} />
    <Path d="M5.2 8.1L7.2 10.1L10.8 6.3" stroke={COLORS.white} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Icone de Menu (tres pontos verticais)
const MenuDotsIcon = ({ color = '#7D8592' }: { color?: string }) => (
  <Svg width={4} height={18} viewBox="0 0 4 18" fill="none">
    <Path d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z" fill={color} />
    <Path d="M4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9Z" fill={color} />
    <Path d="M2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.895431 14 0 14.8954 0 16C0 17.1046 0.895431 18 2 18Z" fill={color} />
  </Svg>
);

// ========================================
// ICONES DO CONTAINER DE CONTEXTO
// Icone de Produtos, Fases e Atividades
// ========================================

const ProductsIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size * 0.8333} viewBox="0 0 18 15" fill="none">
    <Path
      d="M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365ZM0.77984 12.9566V3.39879C0.77984 3.14166 0.990597 2.9319 1.24895 2.9319L4.20635 2.93528V8.35873V13.4234L1.24895 13.4201C0.990597 13.4234 0.77984 13.2137 0.77984 12.9566ZM4.20635 13.4234V8.35873V2.93528H3.86642V13.4234H4.20635ZM13.3301 13.4234V2.93528H12.9902V13.4234H13.3301ZM16.4167 12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902V2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566Z"
      fill={COLORS.textSecondary}
    />
    <Path
      d="M4.20635 2.93528L1.24895 2.9319C0.990597 2.9319 0.77984 3.14166 0.77984 3.39879V12.9566C0.77984 13.2137 0.990597 13.4234 1.24895 13.4201L4.20635 13.4234M4.20635 2.93528H3.86642V13.4234H4.20635M4.20635 2.93528V8.35873V13.4234M12.9902 2.93528H13.3301V13.4234H12.9902M12.9902 2.93528V13.4234M12.9902 2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365Z"
      stroke={COLORS.textSecondary}
      strokeWidth={0.2}
    />
  </Svg>
);

const PhasesIcon = ({ size = 17 }: { size?: number }) => (
  <Svg width={size} height={size * 0.8824} viewBox="0 0 17 15" fill="none">
    <Path
      d="M15.8834 0.149902H13.5719H7.31721C7.16995 0.149902 7.05055 0.266243 7.05055 0.409735V2.99829H5.51565C5.36838 2.99829 5.24898 3.11463 5.24898 3.25812V5.41621H3.71396C3.56669 5.41621 3.44729 5.53255 3.44729 5.67604V8.36393H2.32034C2.17307 8.36393 2.05367 8.48028 2.05367 8.62377V11.0468H0.416691C0.269425 11.0468 0.150024 11.1631 0.150024 11.3066V13.8901C0.150024 14.0336 0.269425 14.1499 0.416691 14.1499H15.8834C16.0306 14.1499 16.15 14.0336 16.15 13.8901V0.409735C16.15 0.266243 16.0306 0.149902 15.8834 0.149902ZM13.3052 0.669567V2.99829H11.7702H7.58388V0.669567H13.3052ZM7.31721 3.51796H11.5035V5.41621H9.96865H5.78232V3.51796H7.31721ZM5.51565 5.93587H9.70198V8.36393H8.57489H3.98062V5.93587H5.51565ZM3.71396 8.8836H8.30823V11.0468H6.67138H2.587V8.8836H3.71396ZM0.683358 11.5664H2.32034H6.40471V13.6302H0.683358V11.5664ZM15.6167 13.6302H6.93805V11.5664H8.57489C8.72216 11.5664 8.84156 11.4501 8.84156 11.3066V8.8836H9.96865C10.1159 8.8836 10.2353 8.76726 10.2353 8.62377V5.93587H11.7702C11.9175 5.93587 12.0369 5.81953 12.0369 5.67604V3.51796H13.5719C13.7192 3.51796 13.8386 3.40162 13.8386 3.25812V0.669567H15.6167V13.6302Z"
      fill={COLORS.textSecondary}
      stroke={COLORS.textSecondary}
      strokeWidth={0.3}
    />
  </Svg>
);

// Icone de Atividades (para container de contexto)
const ActivitiesContextIcon = ({ size = 12 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path
      d="M2.75199 6.14177C2.97762 5.69102 3.22339 5.25675 3.48929 4.83897C3.75569 4.42118 4.04925 4.01284 4.36999 3.61396L3.25274 3.38641C3.17802 3.3675 3.10572 3.36993 3.03585 3.39367C2.96597 3.41742 2.90289 3.45692 2.84661 3.51218L1.08085 5.27663C1.05271 5.30425 1.04325 5.33673 1.05247 5.37405C1.06169 5.41137 1.08498 5.43948 1.12234 5.45838L2.75199 6.14177ZM11.0887 0.710287C9.96882 0.790258 8.98259 1.03623 8.13004 1.4482C7.27749 1.86017 6.47565 2.44129 5.72451 3.19157C5.18785 3.72858 4.71935 4.2879 4.31904 4.8695C3.91872 5.45111 3.58877 6.02908 3.32917 6.60342L5.3897 8.65722C5.9647 8.39792 6.54552 8.06834 7.13216 7.66848C7.71881 7.26863 8.28119 6.80019 8.81931 6.26318C9.57045 5.5129 10.1522 4.71513 10.5647 3.86987C10.9771 3.0246 11.2234 2.04265 11.3035 0.924028C11.3035 0.894463 11.3013 0.867079 11.2969 0.841876C11.2925 0.816673 11.277 0.790501 11.2503 0.763359C11.2236 0.736217 11.1974 0.720708 11.1717 0.71683C11.146 0.712953 11.1186 0.710529 11.0895 0.70956M7.1984 4.80698C6.9849 4.59324 6.87815 4.33709 6.87815 4.03853C6.87815 3.73997 6.9849 3.48382 7.1984 3.27008C7.4119 3.05634 7.66907 2.94972 7.96992 2.9502C8.27076 2.95068 8.52769 3.05731 8.74071 3.27008C8.95372 3.48285 9.06047 3.739 9.06096 4.03853C9.06144 4.33806 8.95469 4.59397 8.74071 4.80625C8.52672 5.01854 8.26955 5.12517 7.96919 5.12614C7.66883 5.12711 7.41166 5.02048 7.19767 4.80625M5.85116 9.24682L6.53606 10.879C6.55498 10.9158 6.58288 10.9366 6.61976 10.9415C6.65664 10.9463 6.68939 10.9347 6.71802 10.9066L8.4845 9.15594C8.5403 9.10021 8.57985 9.0372 8.60314 8.96692C8.62692 8.89713 8.62934 8.82515 8.61042 8.751L8.3826 7.63504C7.98326 7.9559 7.57445 8.24839 7.15618 8.51254C6.73792 8.77669 6.30242 9.02145 5.85116 9.24682ZM12 0.604144C11.9942 1.81582 11.7642 2.93348 11.31 3.95711C10.8558 4.98073 10.1782 5.942 9.27713 6.84188C9.23055 6.8884 9.18615 6.93033 9.14393 6.96765C9.10172 7.00497 9.05756 7.04689 9.01146 7.09342L9.31934 8.59978C9.35816 8.79559 9.34846 8.98534 9.29023 9.16903C9.23152 9.35223 9.13107 9.5146 8.9889 9.65612L6.96185 11.6808C6.81725 11.8253 6.64087 11.8786 6.4327 11.8408C6.22503 11.8035 6.08188 11.6869 6.00327 11.4911L5.13132 9.43729L2.55183 6.84624L0.495663 5.97528C0.29963 5.89725 0.184388 5.75427 0.149936 5.54635C0.115485 5.33842 0.170559 5.16224 0.315157 5.01781L2.34148 2.99309C2.48317 2.85157 2.64669 2.75391 2.83205 2.70011C3.01692 2.64583 3.20738 2.63831 3.40341 2.67757L4.91078 2.9851C4.95736 2.93857 4.99715 2.89664 5.03015 2.85932C5.06266 2.822 5.1022 2.78008 5.14878 2.73355C6.04937 1.834 7.01207 1.15497 8.03688 0.696474C9.06169 0.237974 10.1809 0.00581607 11.3944 0C11.4726 0.00290803 11.5485 0.0184176 11.6222 0.0465286C11.696 0.0746396 11.7647 0.120684 11.8282 0.18466C11.8918 0.248637 11.9355 0.314795 11.9592 0.383133C11.983 0.451472 11.9961 0.525142 11.9985 0.604144M1.01462 8.91676C1.29945 8.63274 1.64542 8.49218 2.05253 8.49509C2.45964 8.498 2.8056 8.64195 3.09043 8.92694C3.37527 9.21192 3.51695 9.55749 3.5155 9.96365C3.51404 10.3708 3.3709 10.7163 3.08607 11.0004C2.68139 11.4046 2.20537 11.659 1.65803 11.7637C1.11069 11.8679 0.558015 11.9467 0 12C0.0533754 11.4329 0.134652 10.8785 0.243829 10.3366C0.353005 9.79474 0.60945 9.32146 1.01462 8.91676ZM1.5343 9.44529C1.31837 9.66097 1.16868 9.91421 1.08522 10.205C1.00176 10.4958 0.940377 10.7973 0.901074 11.1094C1.21405 11.0702 1.5161 11.0071 1.80724 10.9204C2.09838 10.8336 2.35167 10.6827 2.56711 10.4675C2.71268 10.3221 2.78692 10.1488 2.78983 9.94765C2.79226 9.74603 2.72069 9.57252 2.57512 9.42712C2.42955 9.28171 2.25608 9.21216 2.05471 9.21847C1.85334 9.22428 1.67987 9.29989 1.5343 9.44529Z"
      fill={COLORS.textSecondary}
    />
  </Svg>
);

// ========================================
// LINHAS TRACEJADAS (SVG)
// Conectam os icones no container de contexto
// ========================================

// Configuracoes comuns das linhas tracejadas
const DASHED_LINE_COMMON = {
  dashLength: 3,          // altura de cada traco (pedaco) da linha tracejada
  dashGap: 2,             // espacamento entre cada traco da linha tracejada
  strokeWidth: 3,         // largura de cada traco da linha tracejada
  lineWidth: 10,          // largura do container SVG
  positionLeft: 14,       // posicao horizontal (esquerda/direita)
  strokeColor: '#5F758B', // cor da linha tracejada
  strokeOpacity: 0.5,     // opacidade da linha tracejada
};

// Linha 1: Conecta Produto ao icone de Fase (borda inferior produto -> borda superior fase)
const DASHED_LINE_1_CONFIG = {
  ...DASHED_LINE_COMMON,  // herda configuracoes comuns
  lineHeight: 25,         // altura da linha (espacamento entre icones)
  positionTop: 25,        // posicao vertical: abaixo do icone de produto
};

// Linha 2: Conecta Fase ao icone de Atividade (borda inferior fase -> borda superior atividade)
const DASHED_LINE_2_CONFIG = {
  ...DASHED_LINE_COMMON,  // herda configuracoes comuns
  lineHeight: 27,         // altura da linha (espacamento entre icones)
  positionTop: 62,        // posicao vertical: abaixo do icone de fase
};

// Componente Linha Tracejada 1 (Produto -> Fase)
const DashedLine1 = () => (
  <Svg
    width={DASHED_LINE_1_CONFIG.lineWidth}
    height={DASHED_LINE_1_CONFIG.lineHeight}
    viewBox={`0 0 ${DASHED_LINE_1_CONFIG.lineWidth} ${DASHED_LINE_1_CONFIG.lineHeight}`}
    fill="none"
    style={{
      position: 'absolute',
      left: DASHED_LINE_1_CONFIG.positionLeft,
      top: DASHED_LINE_1_CONFIG.positionTop,
    }}
  >
    <Path
      d={`M${DASHED_LINE_1_CONFIG.lineWidth / 2} 0V${DASHED_LINE_1_CONFIG.lineHeight}`}
      stroke={DASHED_LINE_1_CONFIG.strokeColor}
      strokeOpacity={DASHED_LINE_1_CONFIG.strokeOpacity}
      strokeWidth={DASHED_LINE_1_CONFIG.strokeWidth}
      strokeDasharray={`${DASHED_LINE_1_CONFIG.dashLength} ${DASHED_LINE_1_CONFIG.dashGap}`}
    />
  </Svg>
);

// Componente Linha Tracejada 2 (Fase -> Atividade)
const DashedLine2 = () => (
  <Svg
    width={DASHED_LINE_2_CONFIG.lineWidth}
    height={DASHED_LINE_2_CONFIG.lineHeight}
    viewBox={`0 0 ${DASHED_LINE_2_CONFIG.lineWidth} ${DASHED_LINE_2_CONFIG.lineHeight}`}
    fill="none"
    style={{
      position: 'absolute',
      left: DASHED_LINE_2_CONFIG.positionLeft,
      top: DASHED_LINE_2_CONFIG.positionTop,
    }}
  >
    <Path
      d={`M${DASHED_LINE_2_CONFIG.lineWidth / 2} 0V${DASHED_LINE_2_CONFIG.lineHeight}`}
      stroke={DASHED_LINE_2_CONFIG.strokeColor}
      strokeOpacity={DASHED_LINE_2_CONFIG.strokeOpacity}
      strokeWidth={DASHED_LINE_2_CONFIG.strokeWidth}
      strokeDasharray={`${DASHED_LINE_2_CONFIG.dashLength} ${DASHED_LINE_2_CONFIG.dashGap}`}
    />
  </Svg>
);

type PhaseStatus = 'clock' | 'check' | 'question';

// ========================================
// PROPS DO COMPONENTE
// ========================================

type Props = {
  phases: PhaseItem[];
  selectedPhaseId: string | null;
  onPhaseSelect: (phaseId: string) => void;
  selectedProduct: ProductItem | null;
  selectedProductIndex: number;
  totalProducts: number;
  contextCardVisible: boolean;
  selectedActivity: ActivityItem | null;
  selectedActivityIndex: number;
  totalActivities: number;
};

const CustomersInformationGroupSalesFlowPhases: React.FC<Props> = ({
  phases,
  selectedPhaseId,
  onPhaseSelect,
  selectedProduct,
  selectedProductIndex,
  totalProducts,
  contextCardVisible,
  selectedActivity,
  selectedActivityIndex,
  totalActivities,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Estados para controle dos modals
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedPhaseForMenu, setSelectedPhaseForMenu] = useState<PhaseItem | null>(null);

  // Abre modal de opcoes ao clicar no menu
  const handleMenuPress = (phase: PhaseItem) => {
    setSelectedPhaseForMenu(phase);
    setOptionsModalVisible(true);
  };

  // Abre modal de historico de status
  const handleStatusHistoryPress = () => {
    setOptionsModalVisible(false);
    setStatusModalVisible(true);
  };

  const statusItems = useMemo(
    () => [
      { id: 'done', icon: <StatusCircleIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE} />, value: '06' },
      { id: 'inProgress', icon: <StatusCheckIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE} />, value: '01' },
      { id: 'question', icon: <StatusQuestionIcon color={COLORS.orange} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'blocked', icon: <StatusBanIcon color={COLORS.red} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'error', icon: <StatusXIcon color={COLORS.red} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'success', icon: <StatusFilledCheckIcon color={COLORS.blue} size={STATUS_CONCLUIDO_ICON_SIZE} />, value: '00' },
    ],
    []
  );

  const renderPhaseStatusIcon = (status: PhaseStatus) => {
    if (status === 'clock') return <StatusCircleIcon color={COLORS.textSecondary} />;
    if (status === 'check') return <StatusCheckIcon color={COLORS.textSecondary} />;
    return <StatusQuestionIcon color={COLORS.orange} />;
  };

  if (!fontsLoaded) return null;

  // Nome do produto ou placeholder se nao houver produto selecionado
  const productName = selectedProduct?.title || '----------';
  const productCount = selectedProduct
    ? `${String(selectedProductIndex).padStart(2, '0')}/${String(totalProducts).padStart(2, '0')}`
    : '--/--';

  // Busca a fase selecionada e calcula o indice
  const selectedPhase = phases.find(p => p.id === selectedPhaseId);
  const selectedPhaseIndex = selectedPhase ? phases.findIndex(p => p.id === selectedPhaseId) + 1 : 0;
  const totalPhases = phases.length;

  // Nome da fase ou placeholder se nenhuma fase estiver selecionada
  const phaseName = selectedPhase?.title || '----------';
  const phaseCount = selectedPhase
    ? `${String(selectedPhaseIndex).padStart(2, '0')}/${String(totalPhases).padStart(2, '0')}`
    : '--/--';

  // Nome da atividade ou placeholder
  const activityName = selectedActivity?.title || '----------';
  const activityCount = selectedActivity
    ? `${String(selectedActivityIndex).padStart(2, '0')}/${String(totalActivities).padStart(2, '0')}`
    : '--/--';

  return (
    <View style={styles.page}>
      {/* Container de Contexto - Produto + Fase + Atividade */}
      {contextCardVisible && (
        <View style={styles.contextCard}>
          {/* Linha do Produto */}
          <View style={styles.contextRow}>
            <View style={styles.contextIconContainer}>
              <ProductsIcon size={18} />
            </View>
            <View style={styles.contextContent}>
              <Text style={styles.contextLabel}>{productName}</Text>
              <Text style={styles.contextCount}>{productCount}</Text>
            </View>
          </View>

          {/* Divisoria Produto-Fase */}
          <View style={styles.contextDividerContainer}>
            <View style={styles.contextDivider} />
          </View>

          {/* Linha da Fase - mostra a fase selecionada ou placeholder */}
          <View style={styles.contextRow}>
            <View style={styles.contextIconContainer}>
              <PhasesIcon size={17} />
            </View>
            <View style={styles.contextContent}>
              <Text style={styles.contextLabel}>{phaseName}</Text>
              <Text style={styles.contextCount}>{phaseCount}</Text>
            </View>
          </View>

          {/* Divisoria Fase-Atividade */}
          <View style={styles.contextDividerContainer}>
            <View style={styles.contextDivider} />
          </View>

          {/* Linha da Atividade */}
          <View style={styles.contextRow}>
            <View style={styles.contextIconContainer}>
              <ActivitiesContextIcon size={16} />
            </View>
            <View style={styles.contextContent}>
              <Text style={styles.contextLabel}>{activityName}</Text>
              <Text style={styles.contextCount}>{activityCount}</Text>
            </View>
          </View>

          {/* Linhas Tracejadas */}
          <DashedLine1 />
          <DashedLine2 />
        </View>
      )}

      {/* Container de Status */}
      <View style={styles.statusBlock}>
        <Text style={styles.statusTitle}>Status</Text>
        <View style={styles.statusRow}>
          {statusItems.map((it) => (
            <View key={it.id} style={styles.statusItem}>
              {it.icon}
              <Text style={styles.statusValue}>{it.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lista de Fases */}
      <View style={styles.listContainer}>
        <View style={styles.list}>
          {phases.map((p, idx) => {
            const selected = p.id === selectedPhaseId;
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.85}
                style={[styles.row, idx === phases.length - 1 ? styles.rowLast : null]}
                onPress={() => onPhaseSelect(p.id)}
              >
                <View style={styles.rowLeft}>
                  {renderPhaseStatusIcon(p.status)}
                </View>
                <Text style={[styles.rowText, styles.rowTextFlex, selected ? styles.rowTextActive : null]}>
                  {p.title}
                </Text>
                <TouchableOpacity
                  style={styles.rowRight}
                  onPress={() => handleMenuPress(p)}
                  activeOpacity={0.7}
                >
                  <MenuDotsIcon />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Modal de Opcoes */}
      <Modal
        visible={optionsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOptionsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setOptionsModalVisible(false)}>
          <View style={styles.optionsModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.optionsModalContent}>
                <TouchableOpacity
                  style={styles.optionsModalItem}
                  onPress={handleStatusHistoryPress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionsModalText}>Histórico de Status</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Historico de Status */}
      <StatusActivitiesModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        activity={null}
        productInfo={{
          id: selectedProduct?.id || '',
          name: selectedProduct?.title || '',
          status: selectedProduct?.status || 'not_started',
        }}
        phaseInfo={{
          id: selectedPhaseForMenu?.id || '',
          name: selectedPhaseForMenu?.title || '',
          status: selectedPhaseForMenu?.status || 'not_started',
          productId: selectedProduct?.id || '',
        }}
        currentActivityPosition={0}
        totalActivities={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 8,
  },
  // ========================================
  // CONTAINER DE CONTEXTO
  // ========================================
  contextCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 18,
    marginTop: 0,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    position: 'relative',
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contextIconContainer: {
    width: 18,
    height: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contextLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  contextCount: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    width: 60,
    textAlign: 'right',
  },
  contextDividerContainer: {
    paddingLeft: 27,
    paddingTop: 10, // espaco acima da divisoria (ajustar conforme necessario)
    paddingBottom: 10, // espaco abaixo da divisoria (ajustar conforme necessario)
  },
  contextDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  // ========================================
  // CONTAINER DE STATUS
  // ========================================
  // MANUTENCAO - Espacamento entre container de status e divisoria inferior: alterar paddingBottom abaixo (atual: 20px = 10px original + 10px de margem)
  statusBlock: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  // MANUTENCAO - Tamanho do titulo "Status": alterar fontSize abaixo (atual: 16px)
  statusTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // MANUTENCAO - Tamanho dos valores numericos de status (ex: "02", "01"): alterar fontSize abaixo (atual: 14px)
  statusValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  // ========================================
  // LISTA DE FASES
  // ========================================
  listContainer: {
    paddingHorizontal: 20, // Espacamento lateral do container de lista de fases
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0, // Espacamento horizontal dos itens da lista: ajustar aqui (atual: 0px para alinhar com divisorias)
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLeft: {
    width: 26,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rowText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  rowTextFlex: {
    flex: 1, //...........Expande para ocupar espaco disponivel
  },
  rowTextActive: {
    color: COLORS.primary, //...Cor azul quando selecionado
    fontSize: 15, //............Fonte 1px maior para destaque
  },
  rowRight: {
    alignItems: 'flex-end' as const, //....Alinha icone a direita
    justifyContent: 'center' as const, //..Centraliza verticalmente
  },

  // Modal de Opcoes
  // Overlay escuro do modal de opcoes
  optionsModalOverlay: {
    flex: 1, //.............................Ocupa toda a tela
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //Fundo semi-transparente
    justifyContent: 'center', //............Centraliza verticalmente
    alignItems: 'center', //................Centraliza horizontalmente
  },

  // Conteudo do modal de opcoes
  optionsModalContent: {
    backgroundColor: COLORS.white, //...Fundo branco
    borderRadius: 8, //.................Bordas arredondadas
    paddingVertical: 8, //..............Espacamento vertical interno
    minWidth: 200, //...................Largura minima
    shadowColor: '#000', //.............Cor da sombra
    shadowOffset: { width: 0, height: 2 }, //Deslocamento da sombra
    shadowOpacity: 0.25, //.............Opacidade da sombra
    shadowRadius: 4, //.................Raio da sombra
    elevation: 5, //....................Elevacao para Android
  },

  // Item do modal de opcoes
  optionsModalItem: {
    paddingVertical: 14, //...Espacamento vertical
    paddingHorizontal: 20, //Espacamento horizontal
  },

  // Texto do item do modal de opcoes
  optionsModalText: {
    fontFamily: 'Inter_500Medium', //Fonte media
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
  },
});

export default CustomersInformationGroupSalesFlowPhases;