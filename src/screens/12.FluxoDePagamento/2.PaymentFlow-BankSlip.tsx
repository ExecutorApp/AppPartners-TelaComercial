import React from 'react';
import { Alert, FlatList, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { SalesContractViewer, downloadSalesContract } from './2.SalesContract';

const ProductCover = require('../../../assets/00001.png');

type Nav = StackNavigationProp<RootStackParamList, 'PaymentFlowBankSlip'>;

type BankSlipItem = {
  id: number;
  date: string;
  value: string;
  sourceUri?: string;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function buildInstallmentDate(index: number): string {
  const baseDay = 12;
  const baseMonth = 1;
  const baseYear = 26;

  const month0 = baseMonth - 1 + index;
  const year = baseYear + Math.floor(month0 / 12);
  const month = (month0 % 12) + 1;
  return `${pad2(baseDay)}/${pad2(month)}/${pad2(year)}`;
}

const BOLETO_PDF_BASE64 =
  'JVBERi0xLjQKJcTl8uXrCjEgMCBvYmoKPDwKL1BhZ2VzIDIgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8Ci9LaWRzIFsgMyAwIFIgXQovQ291bnQgMQo+PgplbmRvYmoKMyAwIG9iago8PAovVHlwZSAvUGFnZQovTWVkaWFCb3ggWzAgMCA1OTUgODQxXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA1Nwo+PgpzdHJlYW0KQlQKL0YxMiBUZgovMjQ2IDQyMiBUZAooQm9sZXRvKSBUCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDUKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMTA1IDAwMDAwIG4gCjAwMDAwMDAxODEgMDAwMDAgbiAKMDAwMDAwMDM0MiAwMDAwMCBuIAowMDAwMDAwNDIwIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1Jvb3QgMSAwIFIKL1NpemUgNQo+PgpzdGFydHhyZWYKNDk2CiUlRU9GCg==';

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

const DownloadCircleIcon: React.FC = () => (
  <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <Circle cx={14} cy={14} r={13} stroke="#1777CF" strokeWidth={1} fill="#FCFCFC" />
    <Path d="M14 8V17M14 17L10.5 13.5M14 17L17.5 13.5" stroke="#1777CF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const DownloadItemIcon: React.FC = () => (
  <Svg width={19} height={20} viewBox="0 0 19 20" fill="none">
    <Path
      d="M18.4556 9.78784C18.1532 9.78784 17.9113 10.0214 17.9113 10.3134V15.0938C17.9113 16.394 16.8145 17.4489 15.4718 17.4489H3.52823C2.18145 17.4489 1.08871 16.3901 1.08871 15.0938V10.2355C1.08871 9.94355 0.846774 9.70998 0.544355 9.70998C0.241935 9.70998 0 9.94355 0 10.2355V15.0938C0 16.974 1.58468 18.5 3.52823 18.5H15.4718C17.4194 18.5 19 16.9701 19 15.0938V10.3134C19 10.0253 18.7581 9.78784 18.4556 9.78784Z"
      fill="#1777CF"
    />
    <Path
      d="M9.11694 14.3269C9.22177 14.4281 9.3629 14.4826 9.5 14.4826C9.6371 14.4826 9.77823 14.432 9.88306 14.3269L13.3427 10.9868C13.5565 10.7805 13.5565 10.4496 13.3427 10.2433C13.129 10.037 12.7863 10.037 12.5726 10.2433L10.0444 12.688V2.02553C10.0444 1.73357 9.80242 1.5 9.5 1.5C9.19758 1.5 8.95565 1.73357 8.95565 2.02553V12.688L6.42339 10.2433C6.20968 10.037 5.86694 10.037 5.65323 10.2433C5.43952 10.4496 5.43952 10.7805 5.65323 10.9868L9.11694 14.3269Z"
      fill="#1777CF"
    />
  </Svg>
);

const PaymentFlowBankSlipScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [contractViewerVisible, setContractViewerVisible] = React.useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const [topContentHeight, setTopContentHeight] = React.useState<number>(0);
  const [footerHeight, setFooterHeight] = React.useState<number>(180);
  const [isDownloadingAll, setIsDownloadingAll] = React.useState<boolean>(false);

  const bankSlips: BankSlipItem[] = React.useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i + 1,
        date: buildInstallmentDate(i),
        value: 'R$ 500,00',
      })),
    []
  );

  const wait = React.useCallback((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)), []);

  const buildBoletoFilename = React.useCallback((slip: BankSlipItem) => {
    const id = String(slip.id).padStart(2, '0');
    const safeDate = String(slip.date || '').split('/').join('-');
    return `Boleto-${id}-${safeDate}.pdf`;
  }, []);

  const downloadPdf = React.useCallback(async (filename: string, sourceUri?: string) => {
    try {
      if (Platform.OS === 'web') {
        if (sourceUri) {
          const res = await fetch(sourceUri);
          if (!res.ok) throw new Error('download_failed');
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return;
        }

        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${BOLETO_PDF_BASE64}`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      const dest = `${FileSystem.documentDirectory}${filename}`;
      let uri = dest;
      if (sourceUri) {
        uri = (await FileSystem.downloadAsync(sourceUri, dest)).uri;
      } else {
        await FileSystem.writeAsStringAsync(dest, BOLETO_PDF_BASE64, { encoding: FileSystem.EncodingType.Base64 });
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: filename });
        return;
      }

      await Linking.openURL(uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o boleto.');
    }
  }, []);

  const handleDownloadAll = React.useCallback(async () => {
    if (isDownloadingAll) return;
    setIsDownloadingAll(true);
    try {
      for (const slip of bankSlips) {
        await downloadPdf(buildBoletoFilename(slip), slip.sourceUri);
        if (Platform.OS === 'web') await wait(150);
      }
    } finally {
      setIsDownloadingAll(false);
    }
  }, [bankSlips, buildBoletoFilename, downloadPdf, isDownloadingAll, wait]);

  const handleDownloadItem = React.useCallback(
    async (id: number) => {
      const slip = bankSlips.find((b) => b.id === id);
      if (!slip) return;
      await downloadPdf(buildBoletoFilename(slip), slip.sourceUri);
    },
    [bankSlips, buildBoletoFilename, downloadPdf]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={styles.page}>
        {/* ===== CONTEÚDO FIXO SUPERIOR ===== */}
        <View 
          style={styles.topContent}
          onLayout={(e) => setTopContentHeight(e.nativeEvent.layout.height)}
        >
          {/* Header de navegação */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate(ScreenNames.PaymentFlowHome)}>
              <BackIconBlock />
            </TouchableOpacity>
            <View style={styles.headerSpacer} />
            <View style={styles.headerIcon}>
              <InfoIconBlock />
            </View>
          </View>

          {/* Contrato de venda */}
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

          {/* Seção Boletos */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Boletos</Text>
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

          {/* Baixar todos boletos */}
          <View style={styles.downloadAllArea}>
            <View style={styles.downloadAllWrap}>
              <TouchableOpacity style={styles.downloadAllRow} activeOpacity={0.9} onPress={handleDownloadAll}>
                <View style={styles.downloadAllLeftIcon}>
                  <DownloadItemIcon />
                </View>
                <Text style={styles.downloadAllText}>Baixar todos boletos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ===== LISTA DE BOLETOS COM SCROLL (POSITION ABSOLUTE) ===== */}
        <View 
          style={[
            styles.listContainer,
            { 
              top: topContentHeight,
              bottom: footerHeight,
            }
          ]}
        >
          <FlatList
            data={bankSlips}
            keyExtractor={(b) => String(b.id)}
            renderItem={({ item: b }) => (
              <View style={styles.bankSlipRow}>
                <View style={styles.bankSlipInfoCard}>
                  <View style={styles.bankSlipInfoInner}>
                    <View style={styles.bankSlipInfoLeft}>
                      <Text style={styles.bankSlipInfoTitle}>
                        {String(b.id).padStart(2, '0')} - {b.date}
                      </Text>
                    </View>
                    <View style={styles.bankSlipInfoRight}>
                      <Text style={styles.bankSlipInfoValue}>{b.value}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.bankSlipDownloadCard} activeOpacity={0.9} onPress={() => handleDownloadItem(b.id)}>
                  <DownloadItemIcon />
                </TouchableOpacity>
              </View>
            )}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* ===== FOOTER FIXO ===== */}
        <View
          style={[styles.footerFixed, { paddingBottom: 20 + (insets?.bottom ?? 0) }]}
          onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.rulesCard}>
            <View style={styles.rulesTitleRow}>
              <Text style={styles.rulesTitle}>Regras:</Text>
            </View>
            <View style={styles.rulesTextRow}>
              <Text style={styles.rulesText}>
                Baixe cada um dos boletos acima apresentados e salve para pagamento nas datas estabelecidas. Esta página após baixar os boletos não ficará disponível.
              </Text>
            </View>
          </View>
        </View>

        <SalesContractViewer visible={contractViewerVisible} onClose={() => setContractViewerVisible(false)} title="Contrato de venda" />
      </View>
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
    backgroundColor: '#FFFFFF',
  },
  // ===== CONTEÚDO FIXO SUPERIOR =====
  topContent: {
    backgroundColor: '#FFFFFF',
    zIndex: 2,
  },
  header: {
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
  headerContent: {
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    gap: 20,
  },
  titleRow: {
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
    height: 1,
    backgroundColor: '#D8E0F0',
  },
  section: {
    paddingLeft: 15,
    paddingRight: 15,
    gap: 10,
  },
  sectionTitleRow: {
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
    transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
  },
  productCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  productTitleRow: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productTitle: {
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  productSubRow: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  productSub: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  productPriceRow: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  productPrice: {
    color: '#91929E',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  downloadAllArea: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  downloadAllWrap: {
    marginTop: 20,
    marginBottom: 10,
  },
  downloadAllRow: {
    height: 38,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 8,
  },
  downloadAllLeftIcon: {
    transform: [{ scale: 0.75 }],
  },
  downloadAllText: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // ===== LISTA COM POSITION ABSOLUTE =====
  listContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 15,
  },
  bankSlipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  bankSlipInfoCard: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    backgroundColor: '#FCFCFC',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankSlipInfoInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bankSlipInfoLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankSlipInfoRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bankSlipInfoTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  bankSlipInfoValue: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  bankSlipDownloadCard: {
    width: 35,
    height: 35,
    paddingLeft: 3,
    paddingRight: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#1777CF',
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ===== FOOTER FIXO =====
  footerFixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
    paddingLeft: 15,
    paddingRight: 15,
    gap: 15,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
  },
  rulesCard: {
    padding: 12,
    backgroundColor: '#FFF8E6',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#F6D28B',
    gap: 6,
  },
  rulesTitleRow: {},
  rulesTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  rulesTextRow: {},
  rulesText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default PaymentFlowBankSlipScreen;
