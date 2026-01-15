import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path, Circle, Line } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';

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

const STATUS_ICON_SIZE_PX = 20;

const StatusCheckIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Path d="M5.2 8.1L7.2 10.1L10.8 6.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StatusClockIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
    <Path d="M8 4.9V8.2L10.2 9.6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

type ProductItem = {
  id: string;
  title: string;
  status: ProductStatus;
};

const CustomersInformationGroupSalesFlowProducts: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const products = useMemo<ProductItem[]>(
    () => [
      { id: '1', title: 'Holding Patrimonial', status: 'clock' },
      { id: '2', title: 'Ativos Fundiários', status: 'check' },
      { id: '3', title: 'Planejamento Tributário', status: 'question' },
    ],
    []
  );

  const statusItems = useMemo(
    () => [
      { id: 'done', icon: <StatusClockIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE_PX} />, value: '02' },
      { id: 'inProgress', icon: <StatusCheckIcon color={COLORS.textSecondary} size={STATUS_ICON_SIZE_PX} />, value: '01' },
      { id: 'question', icon: <StatusQuestionIcon color={COLORS.orange} size={STATUS_ICON_SIZE_PX} />, value: '00' },
      { id: 'blocked', icon: <StatusBanIcon color={COLORS.red} size={STATUS_ICON_SIZE_PX} />, value: '00' },
      { id: 'error', icon: <StatusXIcon color={COLORS.red} size={STATUS_ICON_SIZE_PX} />, value: '00' },
      { id: 'success', icon: <StatusFilledCheckIcon color={COLORS.blue} size={STATUS_ICON_SIZE_PX} />, value: '00' },
    ],
    []
  );

  const [selectedProductId, setSelectedProductId] = useState<string>('1');

  const renderProductStatusIcon = (status: ProductStatus) => {
    if (status === 'clock') return <StatusClockIcon color={COLORS.textSecondary} />;
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

      <View style={styles.list}>
        {products.map((p, idx) => {
          const selected = p.id === selectedProductId;
          return (
            <TouchableOpacity
              key={p.id}
              activeOpacity={0.85}
              style={[styles.row, idx === products.length - 1 ? styles.rowLast : null]}
              onPress={() => setSelectedProductId(p.id)}
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
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 8,
  },
  statusBlock: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  statusTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
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
  statusValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
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
