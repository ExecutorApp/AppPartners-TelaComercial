import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Svg, Line } from 'react-native-svg';

type FullFlowProps = {
  visible: boolean;
  onClose: () => void;
  currentStep?: number;
  summaries?: Partial<Record<number, string>>;
  onSelectStep?: (step: number) => void;
  // Maior etapa acessível (etapas posteriores ficam bloqueadas). Por padrão, 1.
  maxAccessibleStep?: number;
};

const TOTAL_STEPS = 8;

export default function FullFlow({ visible, onClose, currentStep = 1, summaries, onSelectStep, maxAccessibleStep = 1 }: FullFlowProps) {
  const normalize = (s?: string) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const typeLabel = normalize(summaries?.[5] ?? '');
  const isDualMode = typeLabel.includes('prolabore') && (typeLabel.includes('exito') || typeLabel.includes('êxito'));
  const paymentIndex = isDualMode ? 7 : 6;
  const contractIndex = isDualMode ? 8 : 7;
  const formatPaymentMethods = React.useCallback((raw: string, fallbackToPix: boolean) => {
    const txt = normalize(raw);
    const methods: string[] = [];
    if (txt.includes('pix')) methods.push('Pix');
    if (txt.includes('credito') || txt.includes('cartao')) methods.push('cartão');
    if (txt.includes('boleto')) methods.push('Boleto');
    if (txt.includes('ted')) methods.push('TED');
    if (txt.includes('doc')) methods.push('DOC');
    const uniq = Array.from(new Set(methods));
    if (uniq.length) return uniq.join(', ');
    return fallbackToPix ? 'Pix' : '-----------';
  }, []);
  const stepConfig = React.useMemo(() => ([
    { index: 1, label: 'Cliente' },
    { index: 2, label: 'Produto' },
    { index: 4, label: 'Atividade' },
    { index: 5, label: 'Tipo de honorários' },
    { index: paymentIndex, label: 'Forma de pagamento' },
    { index: contractIndex, label: 'Contrato de venda' },
  ]), [paymentIndex, contractIndex]);
  const visibleSteps = stepConfig;
  const SEGMENT_HEIGHT = 50;
  const SEGMENT_STROKE_WIDTH = 2.5;
  const [rowsLayout, setRowsLayout] = React.useState<Record<number, { y: number; height: number }>>({});
  const segments = React.useMemo(() => {
    const segs: { top: number }[] = [];
    for (let i = 0; i < visibleSteps.length - 1; i++) {
      const currIdx = visibleSteps[i].index;
      const nextIdx = visibleSteps[i + 1].index;
      const curr = rowsLayout[currIdx];
      const next = rowsLayout[nextIdx];
      if (curr && next) {
        const gapStart = curr.y + curr.height;
        const gapEnd = next.y;
        const gap = gapEnd - gapStart;
        const top = gapStart + (gap - SEGMENT_HEIGHT) / 2;
        segs.push({ top });
      }
    }
    return segs;
  }, [rowsLayout, visibleSteps]);

  const maxCompletedFromSummaries = React.useMemo(() => {
    const entries = Object.entries(summaries ?? {});
    const completed = entries
      .filter(([key, val]) => {
        const v = (val ?? '').trim();
        return v.length > 0 && v !== 'Nenhum';
      })
      .map(([key]) => Number(key))
      .filter((n) => Number.isFinite(n) && n >= 1 && n <= TOTAL_STEPS);
    return completed.length ? Math.max(...completed) : 0;
  }, [summaries]);

  const maxCompletedStep = Math.max(
    0,
    Math.min(maxAccessibleStep - 1, TOTAL_STEPS),
    maxCompletedFromSummaries
  );

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>Fluxo completo</Text>
          <View style={styles.divider} />
          <View pointerEvents="none" style={styles.dashedSegmentsColumn}>
            {segments.map((seg, idx) => (
              <Svg
                key={`seg-${idx}`}
                width={SEGMENT_STROKE_WIDTH}
                height={SEGMENT_HEIGHT}
                style={[styles.segmentSvg, { top: seg.top }]}
              >
                <Line
                  x1={SEGMENT_STROKE_WIDTH / 2}
                  y1={0}
                  x2={SEGMENT_STROKE_WIDTH / 2}
                  y2={SEGMENT_HEIGHT}
                  stroke="#5F758B"
                  strokeOpacity={0.4}
                  strokeWidth={SEGMENT_STROKE_WIDTH}
                  strokeDasharray={[4, 2]}
                />
              </Svg>
            ))}
          </View>
          {visibleSteps.map(({ label, index }, visibleIdx) => {
            const active = index === currentStep;
            const rawValue = summaries?.[index] ?? '';
            const hasRealValue = rawValue && rawValue.trim().length > 0 && rawValue !== 'Nenhum';
            const canShowValue = index <= maxCompletedStep || (active && hasRealValue);
            const displayValue =
              index === contractIndex
                ? (active ? 'Contrato gerado' : (hasRealValue ? rawValue : '-----------'))
                : index === paymentIndex
                  ? (active
                      ? formatPaymentMethods(rawValue, true)
                      : (hasRealValue ? formatPaymentMethods(rawValue, false) : '-----------'))
                  : (canShowValue && hasRealValue ? rawValue : '-----------');
            const isDisabled = index > maxAccessibleStep;
            return (
              <TouchableOpacity
                key={label}
                style={styles.stepRow}
                activeOpacity={0.8}
                disabled={isDisabled}
                accessibilityRole="button"
                accessibilityLabel={`Abrir etapa ${visibleIdx + 1}: ${label}`}
                onPress={() => {
                  if (!isDisabled) {
                    onSelectStep?.(index);
                    onClose();
                  }
                }}
                onLayout={(e) => {
                  const { y, height } = e.nativeEvent.layout;
                  setRowsLayout((prev) => {
                    const current = prev[index];
                    if (current && current.y === y && current.height === height) return prev;
                    return { ...prev, [index]: { y, height } };
                  });
                }}
              >
                <View
                  style={[styles.stepBadge, active && styles.stepBadgeActive]}
                >
                  <Text style={[styles.stepBadgeText, active && styles.stepBadgeTextActive]}>{visibleIdx + 1}°</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[styles.stepTitle, active && styles.stepTitleActive]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {label}
                  </Text>
                  <Text
                    style={styles.stepPlaceholder}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {displayValue}
                  </Text>
                  {visibleIdx < visibleSteps.length - 1 && <View style={styles.itemDivider} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Fechar fluxo completo"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(58,63,81,0.12)',
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  backdrop: {
    flex: 1,
  },
  panel: {
    width: 260,
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderRightWidth: 1,
    borderColor: '#D8E0F0',
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'web' ? 0.08 : 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  title: {
    fontSize: 18,
    color: '#3A3F51',
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    height: 0.08,
    backgroundColor: '#D8E0F0',
    marginVertical: 20,
    alignSelf: 'stretch',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 10,
    marginBottom: 20,
    alignSelf: 'stretch',
  },
  stepBadge: {
    width: 35,
    height: 40,
    borderRadius: 4,
    borderWidth: 0.05,
    borderColor: '#D8E0F0',
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  stepBadgeText: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  stepBadgeTextActive: {
    color: '#FCFCFC',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    color: '#91929E',
    fontFamily: 'Inter_500Medium',
  },
  stepTitleActive: {
    color: '#91929E',
  },
  stepPlaceholder: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
  itemDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#D8E0F0',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  dashedSegmentsColumn: {
    position: 'absolute',
    left: 28,
    top: -12,
    bottom: 0,
    width: 2,
    pointerEvents: 'none',
    zIndex: -1,
  },
  segmentSvg: {
    position: 'absolute',
    left: 0,
  },
});
