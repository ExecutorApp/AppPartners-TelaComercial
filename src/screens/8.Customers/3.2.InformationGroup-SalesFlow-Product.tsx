import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle, Line } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { ProductItem } from './3.2.InformationGroup-SalesFlow-Orchestrator';

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

type ProductStatus = 'clock' | 'check' | 'question';

// ========================================
// PROPS DO COMPONENTE
// ========================================

type Props = {
  products: ProductItem[];
  selectedProductId: string | null;
  onProductSelect: (productId: string) => void;
};

const CustomersInformationGroupSalesFlowProducts: React.FC<Props> = ({
  products,
  selectedProductId,
  onProductSelect,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const statusItems = useMemo(
    () => [
      { id: 'done', icon: <StatusCircleIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE} />, value: '02' },
      { id: 'inProgress', icon: <StatusCheckIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE} />, value: '01' },
      { id: 'question', icon: <StatusQuestionIcon color={COLORS.orange} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'blocked', icon: <StatusBanIcon color={COLORS.red} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'error', icon: <StatusXIcon color={COLORS.red} size={STATUS_ICON_SIZE} />, value: '00' },
      { id: 'success', icon: <StatusFilledCheckIcon color={COLORS.blue} size={STATUS_CONCLUIDO_ICON_SIZE} />, value: '00' },
    ],
    []
  );

  const renderProductStatusIcon = (status: ProductStatus) => {
    if (status === 'clock') return <StatusCircleIcon color={COLORS.textSecondary} />;
    if (status === 'check') return <StatusCheckIcon color={COLORS.textSecondary} />;
    return <StatusQuestionIcon color={COLORS.orange} />;
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.page}>
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

      <View style={styles.listContainer}>
        <View style={styles.list}>
          {products.map((p, idx) => {
            const selected = p.id === selectedProductId;
            return (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.85}
                style={[styles.row, idx === products.length - 1 ? styles.rowLast : null]}
                onPress={() => onProductSelect(p.id)}
              >
                <View style={styles.rowLeft}>
                  {renderProductStatusIcon(p.status)}
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
  // MANUTENCAO - Espacamento entre container de status e divisoria inferior: alterar paddingBottom abaixo (atual: 20px = 10px original + 10px de ajuste)
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
  // MANUTENCAO - Espacamento lateral do container de lista de produtos: alterar paddingHorizontal abaixo (atual: 20px)
  listContainer: {
    paddingHorizontal: 20,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0, // MANUTENCAO - Espacamento horizontal dos itens da lista: ajustar aqui (atual: 0px para alinhar com divisorias)
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

export default CustomersInformationGroupSalesFlowProducts;