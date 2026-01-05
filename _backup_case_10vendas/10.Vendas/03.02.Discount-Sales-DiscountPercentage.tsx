import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Colors, BorderRadius } from '../../constants/theme';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (percentString: string) => void;
  initialInteger?: number;
  initialDecimal?: number;
  minInteger?: number;
  maxInteger?: number;
};

const ITEM_HEIGHT = 36;
const MASK_GAP = 10;
const TOP_PAD = ITEM_HEIGHT * 2;
const BOTTOM_PAD = ITEM_HEIGHT * 2;

const PercentIcon = () => (
<svg width={35} height={35} viewBox="0 0 35 35" fill="none">
  <path 
    d="M17.5 0.25C22.0735 0.25494 26.4584 2.07368 29.6924 5.30762C32.9263 8.54155 34.7451 12.9265 34.75 17.5L34.7383 18.1387C34.6202 21.3267 33.6198 24.4245 31.8428 27.084C29.9474 29.9205 27.2533 32.1309 24.1016 33.4365C20.9496 34.7421 17.4809 35.0845 14.1348 34.4189C10.7886 33.7533 7.71519 32.1097 5.30273 29.6973C2.89028 27.2848 1.24665 24.2114 0.581055 20.8652C-0.0845012 17.5191 0.257884 14.0504 1.56348 10.8984C2.86906 7.74669 5.07953 5.0526 7.91602 3.15723C10.5755 1.38023 13.6733 0.379803 16.8613 0.261719L17.5 0.25ZM23.3994 3.25684C20.5825 2.09007 17.4826 1.78505 14.4922 2.37988C11.5017 2.97477 8.75464 4.44263 6.59863 6.59863C4.44263 8.75464 2.97477 11.5017 2.37988 14.4922C1.78505 17.4826 2.09007 20.5825 3.25684 23.3994C4.42364 26.2163 6.39947 28.6244 8.93457 30.3184C11.4698 32.0124 14.4509 32.917 17.5 32.917C21.5871 32.912 25.5055 31.2855 28.3955 28.3955C31.2855 25.5055 32.912 21.5871 32.917 17.5L32.9062 16.9287C32.8006 14.0797 31.9064 11.3112 30.3184 8.93457C28.6244 6.39947 26.2163 4.42364 23.3994 3.25684ZM22.167 18.917C23.0288 18.9171 23.8554 19.2588 24.4648 19.8682C25.0743 20.4777 25.417 21.305 25.417 22.167V24.5C25.417 25.3619 25.0742 26.1884 24.4648 26.7979C23.8554 27.4073 23.0288 27.7499 22.167 27.75C21.305 27.75 20.4777 27.4073 19.8682 26.7979C19.2589 26.1884 18.917 25.3618 18.917 24.5V22.167C18.917 21.305 19.2587 20.4777 19.8682 19.8682C20.4777 19.2587 21.305 18.917 22.167 18.917ZM22.167 20.75C21.7913 20.75 21.4307 20.8994 21.165 21.165C20.8994 21.4307 20.75 21.7913 20.75 22.167V24.5C20.75 24.8757 20.8994 25.2363 21.165 25.502C21.4307 25.7675 21.7913 25.917 22.167 25.917C22.5424 25.9169 22.9024 25.7673 23.168 25.502C23.4336 25.2363 23.583 24.8757 23.583 24.5V22.167C23.583 21.7913 23.4336 21.4307 23.168 21.165C22.9024 20.8995 22.5425 20.7501 22.167 20.75ZM24.5 9.58203C24.6206 9.58203 24.7402 9.60523 24.8516 9.65137C24.9629 9.69751 25.0642 9.76534 25.1494 9.85059C25.2347 9.93583 25.3025 10.0371 25.3486 10.1484C25.3948 10.2598 25.418 10.3794 25.418 10.5C25.418 10.6206 25.3948 10.7402 25.3486 10.8516C25.3025 10.9629 25.2347 11.0642 25.1494 11.1494L11.1494 25.1494C11.0642 25.2347 10.9629 25.3025 10.8516 25.3486C10.7402 25.3948 10.6206 25.418 10.5 25.418C10.2565 25.418 10.0228 25.3216 9.85059 25.1494C9.76534 25.0642 9.69751 24.9629 9.65137 24.8516C9.60523 24.7402 9.58203 24.6206 9.58203 24.5C9.58203 24.3794 9.60523 24.2598 9.65137 24.1484C9.69751 24.0371 9.76534 23.9358 9.85059 23.8506L23.8506 9.85059C23.9358 9.76534 24.0371 9.69751 24.1484 9.65137C24.2598 9.60523 24.3794 9.58203 24.5 9.58203ZM12.833 7.25C13.695 7.25 14.5223 7.59266 15.1318 8.20215C15.7411 8.81161 16.083 9.6382 16.083 10.5V12.833C16.083 13.695 15.7413 14.5223 15.1318 15.1318C14.5223 15.7413 13.695 16.083 12.833 16.083C11.9713 16.0829 11.1446 15.7412 10.5352 15.1318C9.92566 14.5223 9.58301 13.695 9.58301 12.833V10.5C9.58301 9.63812 9.92577 8.81163 10.5352 8.20215C11.1446 7.59273 11.9712 7.25009 12.833 7.25ZM12.833 9.08301C12.4576 9.0831 12.0976 9.23265 11.832 9.49805C11.5664 9.76372 11.417 10.1243 11.417 10.5V12.833C11.417 13.2087 11.5664 13.5693 11.832 13.835C12.0976 14.1005 12.4575 14.2499 12.833 14.25C13.2087 14.25 13.5693 14.1006 13.835 13.835C14.1006 13.5693 14.25 13.2087 14.25 12.833V10.5C14.25 10.1243 14.1006 9.76372 13.835 9.49805C13.5693 9.23247 13.2087 9.08301 12.833 9.08301Z" 
    fill="#3A3F51" 
    stroke="#F4F4F4" 
    stroke-width={0.5}
  />
</svg>
);

const pad2 = (n: number) => n.toString().padStart(2, '0');
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const indexFromOffset = (y: number, len: number) => {
  const normalized = Math.max(0, y);
  const idx = Math.round(normalized / ITEM_HEIGHT);
  return Math.min(len - 1, Math.max(0, idx));
};

const DescontoModalDiscount: React.FC<Props> = ({ visible, onCancel, onConfirm, initialInteger = 0, initialDecimal = 0, minInteger = 2, maxInteger = 8 }) => {
  const [integer, setInteger] = React.useState<number>(0);
  const [decimal, setDecimal] = React.useState<number>(0);
  const [displayIntegerIndex, setDisplayIntegerIndex] = React.useState<number>(0);
  const [displayDecimalIndex, setDisplayDecimalIndex] = React.useState<number>(0);
  const [noDiscount, setNoDiscount] = React.useState<boolean>(false);
  const intRef = React.useRef<ScrollView | null>(null);
  const decRef = React.useRef<ScrollView | null>(null);
  const intIdleTimer = React.useRef<any>(null);
  const decIdleTimer = React.useRef<any>(null);
  const lastIntY = React.useRef(0);
  const lastDecY = React.useRef(0);

  React.useEffect(() => {
    if (!visible) return;
    setNoDiscount(false);
    const minInt = Math.max(0, Math.min(99, minInteger ?? 0));
    const maxInt = Math.max(minInt, Math.min(99, maxInteger ?? 99));
    const clampInt = (v: number) => Math.max(minInt, Math.min(maxInt, v));
    const ii = clampInt(Math.max(0, Math.min(99, initialInteger)));
    const di = Math.max(0, Math.min(99, initialDecimal));
    setInteger(ii);
    setDecimal(di);
    setDisplayIntegerIndex(ii);
    setDisplayDecimalIndex(di);
    setTimeout(() => {
      const iIdx = Math.max(0, integers.indexOf(ii));
      const dIdx = Math.max(0, decimals.indexOf(di));
      const iY = iIdx * ITEM_HEIGHT;
      const dY = dIdx * ITEM_HEIGHT;
      lastIntY.current = iY;
      lastDecY.current = dY;
      intRef.current?.scrollTo({ y: iY, animated: false });
      decRef.current?.scrollTo({ y: dY, animated: false });
    }, 0);
  }, [visible, initialInteger, initialDecimal, minInteger, maxInteger]);

  const integers = React.useMemo(() => {
    const minInt = Math.max(0, Math.min(99, minInteger ?? 0));
    const maxInt = Math.max(minInt, Math.min(99, maxInteger ?? 99));
    const len = maxInt - minInt + 1;
    return Array.from({ length: len }, (_, i) => i + minInt);
  }, [minInteger, maxInteger]);
  const decimals = React.useMemo(() => range(100), []);

  const formatSelectedPercent = (i: number, d: number) => {
    const intStr = String(i);
    if (d === 0) return `${intStr}%`;
    const decStr = String(d).padStart(2, '0');
    return `${intStr},${decStr}%`;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.headerBox}>
            <PercentIcon />
            <Text style={styles.headerTitle}>Desconto</Text>
          </View>
          <View style={styles.bodyBox}>
            <View style={styles.labelsRow}>
              <View style={styles.labelsCell}><Text style={styles.label}>Inteiro</Text></View>
              <View style={styles.labelsGap} />
              <View style={styles.labelsCell}><Text style={styles.label}>Decimal</Text></View>
            </View>

            <View style={styles.pickersRow}>
              <View style={styles.pickerWrapper}>
                <ScrollView
                  ref={(r) => (intRef.current = r)}
                  showsVerticalScrollIndicator={false}
                  decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
                  snapToInterval={ITEM_HEIGHT}
                  snapToAlignment="start"
                  onMomentumScrollEnd={(e) => {
                    const y = e?.nativeEvent?.contentOffset?.y || 0;
                    const idx = indexFromOffset(y, integers.length);
                    const safeIdx = Math.min(integers.length - 1, Math.max(0, idx));
                    const next = integers[safeIdx] ?? displayIntegerIndex;
                    setInteger(next);
                    setDisplayIntegerIndex(next);
                    intRef.current?.scrollTo({ y: safeIdx * ITEM_HEIGHT, animated: false });
                  }}
                  onScroll={(e) => {
                    const y = e?.nativeEvent?.contentOffset?.y || 0;
                    lastIntY.current = y;
                    const idx = indexFromOffset(y, integers.length);
                    const safeIdx = Math.min(integers.length - 1, Math.max(0, idx));
                    const curr = integers[safeIdx] ?? integers[0] ?? 0;
                    setDisplayIntegerIndex(curr);
                  }}
                  scrollEventThrottle={16}
                >
                  <View style={{ height: TOP_PAD }} />
                  {integers.map((n) => (
                    <View key={`i-${n}`} style={[styles.itemRow, n === displayIntegerIndex && styles.itemRowActive]}>
                      <Text style={[styles.itemText, n === displayIntegerIndex ? styles.itemTextHidden : null]}>{pad2(n)}</Text>
                    </View>
                  ))}
                  <View style={{ height: BOTTOM_PAD }} />
                </ScrollView>
              </View>

              <Text style={styles.separator}>,</Text>

              <View style={styles.pickerWrapper}>
                <ScrollView
                  ref={(r) => (decRef.current = r)}
                  showsVerticalScrollIndicator={false}
                  decelerationRate={Platform.OS === 'ios' ? 'fast' : 0.9}
                  snapToInterval={ITEM_HEIGHT}
                  snapToAlignment="start"
                  onMomentumScrollEnd={(e) => {
                    const y = e?.nativeEvent?.contentOffset?.y || 0;
                    const idx = indexFromOffset(y, decimals.length);
                    const safeIdx = Math.min(decimals.length - 1, Math.max(0, idx));
                    const next = decimals[safeIdx] ?? displayDecimalIndex;
                    setDecimal(next);
                    setDisplayDecimalIndex(next);
                    decRef.current?.scrollTo({ y: safeIdx * ITEM_HEIGHT, animated: false });
                  }}
                  onScroll={(e) => {
                    const y = e?.nativeEvent?.contentOffset?.y || 0;
                    lastDecY.current = y;
                    const idx = indexFromOffset(y, decimals.length);
                    const safeIdx = Math.min(decimals.length - 1, Math.max(0, idx));
                    const curr = decimals[safeIdx] ?? decimals[0] ?? 0;
                    setDisplayDecimalIndex(curr);
                  }}
                  scrollEventThrottle={16}
                >
                  <View style={{ height: TOP_PAD }} />
                  {decimals.map((n) => (
                    <View key={`d-${n}`} style={[styles.itemRow, n === displayDecimalIndex && styles.itemRowActive]}>
                      <Text style={[styles.itemText, n === displayDecimalIndex ? styles.itemTextHidden : null]}>{pad2(n)}</Text>
                    </View>
                  ))}
                  <View style={{ height: BOTTOM_PAD }} />
                </ScrollView>
              </View>

              <View pointerEvents="none" style={styles.selectionDividerTop} />
              <View pointerEvents="none" style={styles.selectionDividerBottom} />
              <View pointerEvents="none" style={styles.maskTop} />
              <View pointerEvents="none" style={styles.maskBottom} />

              <View pointerEvents="none" style={styles.innerMaskRow}>
                <View style={styles.innerMaskCell} />
                <View style={styles.innerMaskGap} />
                <View style={styles.innerMaskCell} />
              </View>

              <View pointerEvents="none" style={styles.centerOverlayRow}>
                <View style={styles.centerOverlayCell}>
                  <Text style={styles.itemTextActive}>{pad2(displayIntegerIndex)}</Text>
                </View>
                <View style={styles.centerOverlayGap} />
                <View style={styles.centerOverlayCell}>
                  <Text style={styles.itemTextActive}>{pad2(displayDecimalIndex)}</Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.noDiscountRow}
            activeOpacity={1}
            onPress={() => setNoDiscount((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: noDiscount }}
            accessibilityLabel="Sem desconto"
          >
            <View style={styles.noDiscountIconBox}>
              <Svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                <Rect x={0.75} y={0.75} width={20} height={20} rx={4} stroke={noDiscount ? '#1777CF' : '#3A3F51'} strokeWidth={1.5} />
                <Path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.1139 6.62943C17.4766 6.99206 17.5025 7.56391 17.1916 7.95643L17.1139 8.04365L10.0429 15.1147C9.68023 15.4773 9.10839 15.5032 8.71587 15.1924L8.62865 15.1147L4.38601 10.8721C3.99549 10.4816 3.99549 9.84839 4.38601 9.45786C4.74864 9.09523 5.32048 9.06933 5.713 9.38016L5.80022 9.45786L9.33598 12.9925L15.6997 6.62943C16.0623 6.26681 16.6342 6.2409 17.0267 6.55173L17.1139 6.62943Z"
                  fill="#1777CF"
                  opacity={noDiscount ? 1 : 0}
                />
              </Svg>
            </View>
            <View style={styles.noDiscountLabelBox}>
              <Text style={styles.noDiscountLabel}>Sem desconto</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} accessibilityRole="button" accessibilityLabel="Cancelar">
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (noDiscount) {
                  onConfirm('');
                  return;
                }
                const iIdx = indexFromOffset(lastIntY.current, integers.length);
                const dIdx = indexFromOffset(lastDecY.current, decimals.length);
                const iSafe = Math.min(integers.length - 1, Math.max(0, iIdx));
                const dSafe = Math.min(decimals.length - 1, Math.max(0, dIdx));
                const iVal = integers[iSafe] ?? displayIntegerIndex;
                const dVal = decimals[dSafe] ?? displayDecimalIndex;
                onConfirm(formatSelectedPercent(iVal, dVal));
              }}
              accessibilityRole="button"
              accessibilityLabel="Confirmar"
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    width: 300,
    borderRadius: 18,
    backgroundColor: Colors.background,
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 20,
    rowGap: 15,
  },
  headerBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 10,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  bodyBox: {
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    rowGap: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  labelsCell: {
    flex: 1,
    alignItems: 'center',
  },
  labelsGap: { width: 20 },
  label: {
    color: '#959DA6',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  pickersRow: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: ITEM_HEIGHT * 5,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  pickerWrapper: {
    flex: 1,
    height: ITEM_HEIGHT * 5,
    overflow: 'hidden',
  },
  itemRow: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: { fontSize: 16, fontFamily: 'Inter_500Medium', color: '#959DA6', lineHeight: ITEM_HEIGHT, textAlign: 'center' },
  itemTextHidden: { opacity: 0 },
  itemTextActive: { fontSize: 20, color: '#1777CF', fontFamily: 'Inter_700Bold', lineHeight: ITEM_HEIGHT, textAlign: 'center' },
  separator: { fontSize: 16, color: '#959DA6', fontFamily: 'Inter_700Bold', width: 20, textAlign: 'center' },
  selectionDividerTop: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#D8E0F0', top: ITEM_HEIGHT * 2, zIndex: 40, opacity: 1 },
  selectionDividerBottom: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#D8E0F0', top: ITEM_HEIGHT * 3, zIndex: 40, opacity: 1 },
  maskTop: { position: 'absolute', left: 0, right: 0, top: ITEM_HEIGHT * 2 - MASK_GAP, height: MASK_GAP, backgroundColor: Colors.background, zIndex: 9 },
  maskBottom: { position: 'absolute', left: 0, right: 0, top: ITEM_HEIGHT * 3, height: MASK_GAP, backgroundColor: Colors.background, zIndex: 9 },
  innerMaskRow: { position: 'absolute', left: 0, right: 0, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', zIndex: 20 },
  innerMaskCell: { flex: 1, backgroundColor: Colors.background, height: ITEM_HEIGHT },
  innerMaskGap: { width: 20, height: ITEM_HEIGHT, backgroundColor: 'transparent' },
  centerOverlayRow: { position: 'absolute', left: 0, right: 0, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 30 },
  centerOverlayCell: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  centerOverlayGap: { width: 20, height: ITEM_HEIGHT },
  noDiscountRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: 5, marginBottom: 3, paddingLeft: 2 },
  noDiscountIconBox: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  noDiscountLabelBox: { flex: 1, alignItems: 'flex-start', justifyContent: 'center' },
  noDiscountLabel: { color: '#3A3F51', fontSize: 14, fontFamily: 'Inter_400Regular' },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
    marginTop: 0,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  confirmButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  confirmButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default DescontoModalDiscount;
