import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle, Line } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ProductItem, PhaseItem } from './3.2.InformationGroup-SalesFlow-Orchestrator';

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

// ========================================
// ICONES DO CONTAINER DE CONTEXTO
// Icone de Produtos e Fases
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

// ========================================
// LINHA TRACEJADA (SVG)
// Conecta Produto e Fase no container de contexto
// ========================================

// Configuracoes da linha tracejada
const DASHED_LINE_CONFIG = {
  dashLength: 3,        // altura de cada traco (pedaco) da linha tracejada
  dashGap: 2,           // espacamento entre cada traco da linha tracejada
  strokeWidth: 3,       // largura de cada traco da linha tracejada
  lineHeight: 23,       // altura total da linha tracejada (comprimento)
  lineWidth: 10,        // largura do container SVG
  positionLeft: 15,     // posicao horizontal (esquerda/direita)
  positionTop: 25,      // posicao vertical (cima/baixo)
  strokeColor: '#5F758B', // cor da linha tracejada
  strokeOpacity: 0.5,   // opacidade da linha tracejada
};

const DashedLine = () => (
  <Svg
    width={DASHED_LINE_CONFIG.lineWidth} // largura do container SVG
    height={DASHED_LINE_CONFIG.lineHeight} // altura total da linha tracejada (comprimento)
    viewBox={`0 0 ${DASHED_LINE_CONFIG.lineWidth} ${DASHED_LINE_CONFIG.lineHeight}`}
    fill="none"
    style={{
      position: 'absolute',
      left: DASHED_LINE_CONFIG.positionLeft, // mover linha para esquerda/direita
      top: DASHED_LINE_CONFIG.positionTop, // mover linha para cima/baixo
    }}
  >
    <Path
      d={`M${DASHED_LINE_CONFIG.lineWidth / 2} 0V${DASHED_LINE_CONFIG.lineHeight}`}
      stroke={DASHED_LINE_CONFIG.strokeColor} // cor da linha
      strokeOpacity={DASHED_LINE_CONFIG.strokeOpacity} // opacidade da linha
      strokeWidth={DASHED_LINE_CONFIG.strokeWidth} // largura de cada traco
      strokeDasharray={`${DASHED_LINE_CONFIG.dashLength} ${DASHED_LINE_CONFIG.dashGap}`} // altura do traco e espacamento
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
};

const CustomersInformationGroupSalesFlowPhases: React.FC<Props> = ({
  phases,
  selectedPhaseId,
  onPhaseSelect,
  selectedProduct,
  selectedProductIndex,
  totalProducts,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

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

  return (
    <View style={styles.page}>
      {/* Container de Contexto - Produto + Fase (placeholder) */}
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

        {/* Divisoria */}
        <View style={styles.contextDividerContainer}>
          <View style={styles.contextDivider} />
        </View>

        {/* Linha da Fase - sempre mostra placeholder pois nenhuma fase esta selecionada ainda */}
        <View style={styles.contextRow}>
          <View style={styles.contextIconContainer}>
            <PhasesIcon size={17} />
          </View>
          <View style={styles.contextContent}>
            <Text style={styles.contextLabel}>----------</Text>
            <Text style={styles.contextCount}>--/--</Text>
          </View>
        </View>

        {/* Linha Tracejada */}
        <DashedLine />
      </View>

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
                <Text style={[styles.rowText, selected ? styles.rowTextActive : null]}>
                  {idx + 1}. {p.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
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
  rowTextActive: {
    color: COLORS.primary,
  },
});

export default CustomersInformationGroupSalesFlowPhases;