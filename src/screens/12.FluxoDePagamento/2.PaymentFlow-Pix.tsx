import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import Svg, { Path, Rect } from 'react-native-svg';
import { SalesContractViewer, downloadSalesContract } from './2.SalesContract';
import PaymentFlowPixApproved from './2.PaymentFlow-Pix-Approved';
import PaymentFlowPixTimeExceeded from './2.PaymentFlow-Pix-TimeExceeded';

const Logo = require('../../../assets/00001.png');
const ProductCover = require('../../../assets/00001.png');

type Nav = StackNavigationProp<RootStackParamList, 'PaymentFlowPix'>;

const BackIconBlock: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path d="M19 28L10 19M10 19L19 10M10 19L28 19" stroke="#1777CF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const InfoIconBlock: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 9C13.481 9 9 13.481 9 19C9 24.519 13.481 29 19 29C24.519 29 29 24.519 29 19C29 13.481 24.519 9 19 9ZM19 10.5385C23.6697 10.5385 27.4615 14.3303 27.4615 19C27.4615 23.6697 23.6697 27.4615 19 27.4615C14.3303 27.4615 10.5385 23.6697 10.5385 19C10.5385 14.3303 14.3303 10.5385 19 10.5385Z"
      fill="#3A3F51"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.2308 18.4872V22.5897C18.2308 22.7938 18.3118 22.9894 18.4561 23.1337C18.6003 23.2779 18.796 23.359 19 23.359C19.204 23.359 19.3997 23.2779 19.5439 23.1337C19.6882 22.9894 19.7692 22.7938 19.7692 22.5897V18.4872C19.7692 18.2832 19.6882 18.0875 19.5439 17.9433C19.3997 17.799 19.204 17.7179 19 17.7179C18.796 17.7179 18.6003 17.799 18.4561 17.9433C18.3118 18.0875 18.2308 18.2832 18.2308 18.4872Z"
      fill="#3A3F51"
    />
    <Path d="M19 16.4359C19.4248 16.4359 19.7692 16.0915 19.7692 15.6667C19.7692 15.2418 19.4248 14.8974 19 14.8974C18.5752 14.8974 18.2308 15.2418 18.2308 15.6667C18.2308 16.0915 18.5752 16.4359 19 16.4359Z" fill="#3A3F51" />
  </Svg>
);

const DownloadIcon13: React.FC = () => (
  <Svg width={13} height={13} viewBox="0 0 13 13" fill="none">
    <Path d="M6.40348 5.85249C6.70263 5.85249 6.94889 6.078 6.98258 6.36811L6.98649 6.4355V10.2773L8.32438 8.9394C8.53462 8.72942 8.86517 8.71384 9.09391 8.89155L9.14957 8.9394C9.35986 9.14968 9.37536 9.48107 9.19743 9.70991L9.14957 9.7646L6.81559 12.0986C6.60529 12.3085 6.27475 12.3243 6.04606 12.1464L5.99137 12.0986L3.65739 9.7646C3.42984 9.53677 3.42967 9.16712 3.65739 8.9394C3.86767 8.72921 4.19909 8.71365 4.42789 8.89155L4.48258 8.9394L5.82047 10.2773V6.4355C5.82058 6.11342 6.08138 5.85249 6.40348 5.85249ZM5.37223 0.0243629C7.15852 0.262563 8.65725 1.45743 9.28825 3.1103L9.35075 3.28511H9.61149C10.9822 3.28511 12.2267 4.25366 12.7033 5.64741L12.7492 5.78803C12.9484 6.71789 12.7739 7.62172 12.2736 8.47944C12.1112 8.75763 11.754 8.85171 11.4757 8.6894C11.1978 8.527 11.1036 8.1697 11.2658 7.89155C11.6256 7.27468 11.743 6.66443 11.6193 6.07807C11.3465 5.16917 10.5596 4.50654 9.71696 4.45503L9.61149 4.4521H8.91129C8.64055 4.45188 8.40564 4.26551 8.34391 4.0019C7.9946 2.50487 6.74507 1.38406 5.23746 1.18257C3.73004 1.03182 2.26358 1.83726 1.56266 3.18843C0.945244 4.47513 1.06053 6.5902 1.81657 7.74995C1.99256 8.0198 1.91649 8.38158 1.64664 8.55757C1.37688 8.73324 1.01595 8.65727 0.840004 8.38764C-0.141695 6.88237 -0.281457 4.33333 0.518715 2.66694C1.44642 0.877812 3.36766 -0.176411 5.37223 0.0243629Z" fill="#3A3F51" />
  </Svg>
);

const EyeIcon20x12: React.FC = () => (
  <Svg width={20} height={12} viewBox="0 0 20 12" fill="none">
    <Path d="M10 0C4.75546 0 0.317297 5.4 0.129769 5.634C0.0456258 5.73892 0 5.8676 0 6C0 6.1324 0.0456258 6.26109 0.129769 6.366C0.317297 6.6 4.75546 12 10 12C15.2445 12 19.6827 6.6 19.8702 6.366C19.9544 6.26109 20 6.1324 20 6C20 5.8676 19.9544 5.73892 19.8702 5.634C19.6827 5.4 15.2445 0 10 0ZM10 10.8C6.10567 10.8 2.49887 7.2 1.43621 6C2.49887 4.8 6.09941 1.2 10 1.2C13.9006 1.2 17.5011 4.8 18.5638 6C17.5011 7.2 13.9006 10.8 10 10.8Z" fill="#3A3F51" />
    <Path d="M13.1255 5.4C13.2286 5.39992 13.3302 5.37533 13.4211 5.32842C13.5119 5.28151 13.5893 5.21374 13.6462 5.13116C13.7032 5.04858 13.7379 4.95375 13.7474 4.85514C13.7569 4.75652 13.7408 4.65719 13.7006 4.566C13.3567 3.90877 12.8276 3.35735 12.1734 2.97444C11.5192 2.59153 10.7662 2.39251 10 2.4C9.00529 2.4 8.05132 2.77929 7.34795 3.45442C6.64458 4.12955 6.24944 5.04522 6.24944 6C6.24944 6.95478 6.64458 7.87045 7.34795 8.54559C8.05132 9.22072 9.00529 9.6 10 9.6C10.7662 9.60749 11.5192 9.40847 12.1734 9.02556C12.8276 8.64266 13.3567 8.09123 13.7006 7.434C13.7408 7.34281 13.7569 7.24348 13.7474 7.14487C13.7379 7.04625 13.7032 6.95143 13.6462 6.86884C13.5893 6.78626 13.5119 6.71849 13.4211 6.67158C13.3302 6.62467 13.2286 6.60008 13.1255 6.6C13.0412 6.60849 12.956 6.5988 12.8762 6.57165C12.7963 6.5445 12.7238 6.50057 12.6639 6.44306C12.604 6.38556 12.5582 6.31594 12.5299 6.23928C12.5016 6.16263 12.4915 6.08088 12.5004 6C12.4915 5.91912 12.5016 5.83737 12.5299 5.76072C12.5582 5.68406 12.604 5.61444 12.6639 5.55694C12.7238 5.49944 12.7963 5.4555 12.8762 5.42835C12.956 5.4012 13.0412 5.39151 13.1255 5.4Z" fill="#3A3F51" />
  </Svg>
);

const CopyIcon35: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.5} y={0.5} width={34} height={34} rx={6} fill="transparent" />
    <Rect x={0.5} y={0.5} width={34} height={34} rx={6} stroke="#1777CF" strokeWidth={1} />
    <Path d="M10.8433 21.4475C10.5875 21.3021 10.3747 21.0916 10.2266 20.8374C10.0785 20.5832 10.0003 20.2942 10 20V11.6667C10 10.75 10.75 10 11.6667 10H20C20.625 10 20.965 10.3208 21.25 10.8333M13.3333 15.5558C13.3333 14.9664 13.5675 14.4011 13.9843 13.9843C14.4011 13.5675 14.9664 13.3333 15.5558 13.3333H22.7775C23.0694 13.3333 23.3584 13.3908 23.628 13.5025C23.8977 13.6142 24.1427 13.7779 24.349 13.9843C24.5554 14.1907 24.7191 14.4357 24.8308 14.7053C24.9425 14.975 25 15.264 25 15.5558V22.7775C25 23.0694 24.9425 23.3584 24.8308 23.628C24.7191 23.8977 24.5554 24.1427 24.349 24.349C24.1427 24.5554 23.8977 24.7191 23.628 24.8308C23.3584 24.9425 23.0694 25 22.7775 25H15.5558C15.264 25 14.975 24.9425 14.7053 24.8308C14.4357 24.7191 14.1907 24.5554 13.9843 24.349C13.7779 24.1427 13.6142 23.8977 13.5025 23.628C13.3908 23.3584 13.3333 23.0694 13.3333 22.7775V15.5558Z" stroke="#1777CF" strokeWidth={0.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PixQrCode: React.FC = () => {
  const SIZE = 35;
  const MODULE = 3;
  const QUIET = 2;
  const DARK = '#3A3F51';

  const inBounds = (r: number, c: number) => r >= 0 && c >= 0 && r < SIZE && c < SIZE;
  const matrix: boolean[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => false));
  const reserved: boolean[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => false));

  const setModule = (r: number, c: number, on: boolean, lock: boolean) => {
    if (!inBounds(r, c)) return;
    matrix[r][c] = on;
    if (lock) reserved[r][c] = true;
  };

  const drawFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const rr = top + r;
        const cc = left + c;
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setModule(rr, cc, isBorder || isCenter, true);
      }
    }
    for (let r = -1; r <= 7; r += 1) {
      for (let c = -1; c <= 7; c += 1) {
        setModule(top + r, left + c, matrix[top + Math.max(0, Math.min(6, r))]?.[left + Math.max(0, Math.min(6, c))] ?? false, true);
      }
    }
  };

  drawFinder(0, 0);
  drawFinder(0, SIZE - 7);
  drawFinder(SIZE - 7, 0);

  for (let i = 0; i < SIZE; i += 1) {
    if (!reserved[6][i]) setModule(6, i, i % 2 === 0, true);
    if (!reserved[i][6]) setModule(i, 6, i % 2 === 0, true);
  }

  let seed = 0x2f6e2b1;
  const nextRand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed;
  };

  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (reserved[r][c]) continue;
      const v = nextRand();
      const on = (v % 7) < 3;
      setModule(r, c, on, false);
    }
  }

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < SIZE; r += 1) {
    for (let c = 0; c < SIZE; c += 1) {
      if (!matrix[r][c]) continue;
      rects.push(
        <Rect
          key={`m-${r}-${c}`}
          x={QUIET + c * MODULE}
          y={QUIET + r * MODULE}
          width={MODULE}
          height={MODULE}
          fill={DARK}
        />,
      );
    }
  }

  return (
    <View style={styles.qrBox}>
      <Svg width="100%" height="100%" viewBox="0 0 110 110">
        {rects}
      </Svg>
    </View>
  );
};

const formatHMS = (ms: number): string => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const two = (n: number) => String(n).padStart(2, '0');
  return `${two(h)}:${two(m)}:${two(s)}`;
};

const PaymentFlowPixScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const TOTAL_MS = 90 * 60 * 1000;
  const PIX_CODE = '000201010212...PIXCODE...';
  const [remaining, setRemaining] = useState<number>(TOTAL_MS);
  const [qrReady, setQrReady] = useState<boolean>(false);
  const [contractViewerVisible, setContractViewerVisible] = useState<boolean>(false);
  const [approvedVisible, setApprovedVisible] = useState<boolean>(false);
  const [timeExceededVisible, setTimeExceededVisible] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string>('');
  const [pixCodeValue, setPixCodeValue] = useState<string>('');
  const [simulationNext, setSimulationNext] = useState<'approved' | 'timeExceeded'>('approved');
  const progress = useMemo(() => {
    return 1 - remaining / TOTAL_MS;
  }, [remaining]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQrReady(true);
  }, []);

  useEffect(() => {
    if (!qrReady) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1000;
        return next <= 0 ? 0 : next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [qrReady]);

  const handleCopyPix = () => {
    setPixCodeValue(PIX_CODE);
    setCopyFeedback('Pix copiado com sucesso');
    try {
      if (Platform.OS === 'web') {
        const nav = (globalThis as any)?.navigator;
        const writeText = nav?.clipboard?.writeText;
        if (typeof writeText === 'function') {
          writeText.call(nav.clipboard, PIX_CODE).catch(() => {});
        }
      }
    } catch {}
    setTimeout(() => {
      setSimulationNext((prev) => {
        if (prev === 'approved') {
          setApprovedVisible(true);
          return 'timeExceeded';
        }
        setTimeExceededVisible(true);
        return 'approved';
      });
    }, 3000);
    setTimeout(() => setCopyFeedback(''), 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={styles.page}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate(ScreenNames.PaymentFlowHome)}>
            <BackIconBlock />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
          <View style={styles.headerIcon}>
            <InfoIconBlock />
          </View>
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Contrato de venda</Text>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => downloadSalesContract()}>
              <Text style={styles.actionText}>Baixar</Text>
              <DownloadIcon13 />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.9} onPress={() => setContractViewerVisible(true)}>
              <Text style={styles.actionText}>Visualizar</Text>
              <EyeIcon20x12 />
            </TouchableOpacity>
          </View>
          <View style={styles.separator} />
        </View>

        <View style={styles.mainCard}>
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Pix</Text>
            </View>
            <View style={styles.productRow}>
              <View style={styles.productCoverWrap}>
                <Image source={ProductCover} style={styles.productCover} resizeMode="cover" />
              </View>
              <View style={styles.productCol}>
                <View style={styles.productTitleRow}>
                  <Text style={styles.productTitle}>Holding Patrimonial</Text>
                </View>
                <View style={styles.productSubRow}>
                  <Text style={styles.productSub}>Reunião de entrada</Text>
                </View>
                <View style={styles.productPriceRow}>
                  <Text style={styles.productPrice}>R$ 800,00</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.qrSection}>
            <View style={styles.qrWrapper}>
              <PixQrCode />
            </View>
            <View style={styles.timerRow}>
              <View style={styles.timerWidthFix}>
                <Text style={styles.timerText}>{formatHMS(remaining)}</Text>
              </View>
            </View>
            <View style={styles.progressBase}>
              <View style={[styles.progressBar, { width: `${Math.max(0, Math.min(1, progress)) * 100}%` }]} />
            </View>
            <View style={styles.instructionsRow}>
              <Text style={styles.instructions}>
                Escaneie o QR Code, copie ou{'\n'}envie através de uma das opções abaixo
              </Text>
            </View>
            <TouchableOpacity style={styles.copyRow} activeOpacity={0.9} onPress={handleCopyPix}>
              <View style={styles.copyCard}>
                <Text style={pixCodeValue ? styles.copyValue : styles.copyLabel} numberOfLines={1}>
                  {pixCodeValue ? pixCodeValue : 'Copiar código do pix'}
                </Text>
              </View>
              <View style={styles.copyIconWrap}>
                <CopyIcon35 />
              </View>
            </TouchableOpacity>
          {copyFeedback ? (
            <View style={styles.copyFeedbackRow}>
              <Text style={styles.copyFeedbackText}>{copyFeedback}</Text>
            </View>
          ) : null}
          <View style={styles.noticeWrap}>
            <View style={styles.noticeCard}>
              <Text style={styles.noticeTitle}>Antes de efetuar o pagamento, leia atentamente as regras:</Text>
              <Text style={styles.noticeText}>
                Não aceitamos depósitos de terceiros, ou seja, o valor depositado deve vir de uma conta com o seu CPF/CNPJ.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <SalesContractViewer visible={contractViewerVisible} onClose={() => setContractViewerVisible(false)} title="Contrato de venda" />
      <PaymentFlowPixApproved
        visible={approvedVisible}
        onClose={() => setApprovedVisible(false)}
        onFinalize={() => setApprovedVisible(false)}
      />
      <PaymentFlowPixTimeExceeded
        visible={timeExceededVisible}
        onClose={() => setTimeExceededVisible(false)}
        onGenerateNewPix={() => setTimeExceededVisible(false)}
        onFinalize={() => setTimeExceededVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  page: {
    flex: 1,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignSelf: 'stretch',
    paddingTop: 15,
    paddingBottom: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(252, 252, 252, 0.80)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  headerIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    flex: 1,
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  headerContent: {
    alignSelf: 'stretch',
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    gap: 20,
  },
  titleRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    width: 300,
    color: '#3A3F51',
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
  },
  actionsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionCard: {
    flex: 1,
    height: 38,
    padding: 14,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EDF2F6',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  actionText: {
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  separator: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: '#D8E0F0',
  },
  mainCard: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  section: {
    alignSelf: 'stretch',
    paddingLeft: 15,
    paddingRight: 15,
    gap: 10,
  },
  sectionTitleRow: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 24,
  },
  sectionTitle: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  productRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productCoverWrap: {
    width: 60,
    height: 70,
    borderRadius: 4,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  productCover: {
    width: '100%',
    height: '100%',
    // AJUSTE MANUAL (ZOOM/ESCALA): altere o valor de "scale" para aumentar/diminuir o zoom
    // AJUSTE MANUAL (CROP/OFFSET): altere "translateX/translateY" para reposicionar o recorte sem mudar o container
    transform: [
      {
        translateX: 0,
      },
      {
        translateY: 0,
      },
      {
        scale: 1,
      },
    ],
  },
  productCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  productTitleRow: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productTitle: {
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  productSubRow: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productSub: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  productPriceRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  productPrice: {
    color: '#91929E',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  qrSection: {
    alignSelf: 'stretch',
    paddingTop: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 30,
    gap: 15,
    backgroundColor: '#FFFFFF',
  },
  qrWrapper: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    width: 140,
    height: 140,
    // AJUSTE MANUAL (PADDING INTERNO): altere este "padding" para aumentar/diminuir o respiro interno do QR Code
    // Importante: este ajuste muda apenas o respiro interno, não deve alterar o tamanho do container (fixado acima)
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    backgroundColor: '#FFFFFF',
  },
  timerRow: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerWidthFix: {
    width: 88.39,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  timerText: {
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  progressBase: {
    alignSelf: 'stretch',
    height: 5,
    backgroundColor: '#F4F4F4',
    borderRadius: 40,
    overflow: 'hidden',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#1777CF',
    borderRadius: 40,
  },
  instructionsRow: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  copyRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  copyCard: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1777CF',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'transparent',
  },
  copyLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  copyValue: {
    color: '#3A3F51',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  copyIconWrap: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  copyFeedbackRow: {
    alignSelf: 'stretch',
    paddingTop: 6,
    paddingLeft: 15,
    paddingRight: 15,
  },
  copyFeedbackText: {
    color: '#1B883C',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  noticeWrap: {
    alignSelf: 'stretch',
    overflow: 'hidden',
  },
  noticeCard: {
    alignSelf: 'stretch',
    padding: 16,
    backgroundColor: '#FAF9E9',
    borderRadius: 8,
    gap: 16,
  },
  noticeTitle: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  noticeText: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default PaymentFlowPixScreen;
