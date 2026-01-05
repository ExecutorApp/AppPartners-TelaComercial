import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image, SafeAreaView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, G } from 'react-native-svg';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';
import { ScreenNames } from '../../types/navigation';
import DescontoModalDiscount from './03.02.Discount-Sales-DiscountPercentage';
import DiscountSystemModal from './03.02.Discount-Sales-DiscountSystem';

const HEADER_TOP_HEIGHT = 120;

const DiscountSalesScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [activeDiscount, setActiveDiscount] = React.useState<'pix' | 'credit' | 'boleto' | null>(null);
  const [pixPercentInput, setPixPercentInput] = React.useState<string>('');
  const [creditPercentInput, setCreditPercentInput] = React.useState<string>('');
  const [boletoPercentInput, setBoletoPercentInput] = React.useState<string>('');
  const [discountPickerVisible, setDiscountPickerVisible] = React.useState<boolean>(false);
  const [discountPickerTarget, setDiscountPickerTarget] = React.useState<'pix' | 'credit' | 'boleto' | null>(null);
  const [prolaboreExpanded, setProlaboreExpanded] = React.useState<boolean>(true);
  const [exitoExpanded, setExitoExpanded] = React.useState<boolean>(true);
  const [activeExitoDiscount, setActiveExitoDiscount] = React.useState<'pix' | 'credit' | null>(null);
  const [exitoPixPercentInput, setExitoPixPercentInput] = React.useState<string>('');
  const [exitoCreditPercentInput, setExitoCreditPercentInput] = React.useState<string>('');
  const [exitoPickerVisible, setExitoPickerVisible] = React.useState<boolean>(false);
  const [exitoPickerTarget, setExitoPickerTarget] = React.useState<'pix' | 'credit' | null>(null);
  const [prodServHeight, setProdServHeight] = React.useState<number>(80);
  const [systemDiscountModalVisible, setSystemDiscountModalVisible] = React.useState<boolean>(false);
  
  const parsePercent = (value: string) => {
    const raw = (value || '').replace('%', '').trim().replace(',', '.');
    const n = Number(raw);
    if (!isFinite(n)) return 0;
    return n;
  };
  const formatBRL = (value: number) => {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const int = Math.floor(abs);
    const frac = Math.round((abs - int) * 100);
    const intStr = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const fracStr = frac.toString().padStart(2, '0');
    return `R$ ${sign}${intStr},${fracStr}`;
  };
  const formatPercentStr = (value: number) => {
    const rounded = Math.round(value * 100) / 100;
    const s = rounded.toFixed(rounded % 1 === 0 ? 0 : 2).replace('.', ',');
    return `${s}%`;
  };
  const partnerReductionPercent = (applied: number) => {
    const exceed = applied - 6;
    if (exceed <= 0) return 0;
    return Math.min(exceed * 2.5, 5);
  };
  const pixBase = 25000;
  const creditBase = 15000;
  const boletoBase = 10000;
  const exitoPixBase = 25000;
  const exitoCreditBase = 45000;
  const hasPixPercent = parsePercent(pixPercentInput) > 0;
  const hasCreditPercent = parsePercent(creditPercentInput) > 0;
  const hasBoletoPercent = parsePercent(boletoPercentInput) > 0;
  const hasExitoPixPercent = parsePercent(exitoPixPercentInput) > 0;
  const hasExitoCreditPercent = parsePercent(exitoCreditPercentInput) > 0;
  const pixApplied = parsePercent(pixPercentInput);
  const creditApplied = parsePercent(creditPercentInput);
  const boletoApplied = parsePercent(boletoPercentInput);
  const exitoPixApplied = parsePercent(exitoPixPercentInput);
  const exitoCreditApplied = parsePercent(exitoCreditPercentInput);
  const prolaboreBaseTotal = pixBase + creditBase + boletoBase;
  const totalDiscountValue = (pixBase * pixApplied + creditBase * creditApplied + boletoBase * boletoApplied) / 100;
  const prolaboreAffectedBase = (hasPixPercent ? pixBase : 0) + (hasCreditPercent ? creditBase : 0) + (hasBoletoPercent ? boletoBase : 0);
  const totalDiscountPercent = prolaboreAffectedBase > 0 ? (totalDiscountValue / prolaboreAffectedBase) * 100 : 0;
  const totalReductionValue = (pixBase * partnerReductionPercent(pixApplied) + creditBase * partnerReductionPercent(creditApplied) + boletoBase * partnerReductionPercent(boletoApplied)) / 100;
  const totalReductionPercent = prolaboreAffectedBase > 0 ? (totalReductionValue / prolaboreAffectedBase) * 100 : 0;
  const exitoBaseTotal = exitoPixBase + exitoCreditBase;
  const exitoTotalDiscountValue = (exitoPixBase * exitoPixApplied + exitoCreditBase * exitoCreditApplied) / 100;
  const exitoAffectedBase = (hasExitoPixPercent ? exitoPixBase : 0) + (hasExitoCreditPercent ? exitoCreditBase : 0);
  const exitoTotalDiscountPercent = exitoAffectedBase > 0 ? (exitoTotalDiscountValue / exitoAffectedBase) * 100 : 0;
  const exitoTotalReductionValue = (exitoPixBase * partnerReductionPercent(exitoPixApplied) + exitoCreditBase * partnerReductionPercent(exitoCreditApplied)) / 100;
  const exitoTotalReductionPercent = exitoAffectedBase > 0 ? (exitoTotalReductionValue / exitoAffectedBase) * 100 : 0;

  const formatCardNumber = (n: number) => n.toString().padStart(2, '0');
  const gerenciarBadgeCount = 6;
  const chatBadgeCount = 3;
  const grandTotalDiscountValue = totalDiscountValue + exitoTotalDiscountValue;
  const grandTotalReductionValue = totalReductionValue + exitoTotalReductionValue;
  const grandBaseTotal = prolaboreBaseTotal + exitoBaseTotal;
  const grandTotalDiscountPercent = grandBaseTotal > 0 ? (grandTotalDiscountValue / grandBaseTotal) * 100 : 0;
  const grandTotalReductionPercent = grandBaseTotal > 0 ? (grandTotalReductionValue / grandBaseTotal) * 100 : 0;
  
  const openPicker = (target: 'pix' | 'credit' | 'boleto') => {
    console.log('[DiscountSalesScreen] openPicker', target);
    setDiscountPickerTarget(target);
    setDiscountPickerVisible(true);
  };

  const closePicker = () => {
    console.log('[DiscountSalesScreen] closePicker');
    setDiscountPickerVisible(false);
    setDiscountPickerTarget(null);
  };

  const openExitoPicker = (target: 'pix' | 'credit') => {
    console.log('[DiscountSalesScreen] openExitoPicker', target);
    setExitoPickerTarget(target);
    setExitoPickerVisible(true);
  };

  const closeExitoPicker = () => {
    console.log('[DiscountSalesScreen] closeExitoPicker');
    setExitoPickerVisible(false);
    setExitoPickerTarget(null);
  };

  const getInitialPickerValues = (value: string) => {
    const raw = (value || '').toString().trim();
    if (!raw) return { integer: 0, decimal: 0 };
    const cleaned = raw.replace('%', '').replace('.', ',');
    const parts = cleaned.split(',');
    const integer = Math.max(0, Math.min(99, Number(parts[0]) || 0));
    const decimal = Math.max(0, Math.min(99, Number(parts[1]) || 0));
    const result = { integer, decimal };
    console.log('[DiscountSalesScreen] getInitialPickerValues', value, '=>', result);
    return result;
  };

  const onConfirmPicker = (percentString: string) => {
    const target = discountPickerTarget;
    console.log('[DiscountSalesScreen] onConfirmPicker', { target, percentString });
    if (!target) {
      closePicker();
      return;
    }
    if (target === 'pix') setPixPercentInput(percentString);
    if (target === 'credit') setCreditPercentInput(percentString);
    if (target === 'boleto') setBoletoPercentInput(percentString);
    closePicker();
  };

  const onConfirmExitoPicker = (percentString: string) => {
    const target = exitoPickerTarget;
    console.log('[DiscountSalesScreen] onConfirmExitoPicker', { target, percentString });
    if (!target) {
      closeExitoPicker();
      return;
    }
    if (target === 'pix') setExitoPixPercentInput(percentString);
    if (target === 'credit') setExitoCreditPercentInput(percentString);
    closeExitoPicker();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header fixo - Seta de voltar */}
        <View style={styles.fixedHeader}>
          <View style={styles.backHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate(ScreenNames.SalesHome as any, { autoOpenDiscount: true } as any)}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path d="M10 19L1 10M1 10L10 1M1 10L19 10" stroke="#1777CF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
          </View>

          {/* Divisor fixo */}
          <View style={styles.headerDivider} />

          {/* Abas fixas - Cliente, Venda, Gerenciar, Chat */}
          <View style={styles.tabsWrapper}>
            <View style={styles.tabsBox}>
              <TouchableOpacity
                style={[styles.tabBtn, styles.tabWCliente]}
                onPress={() => navigation.navigate(ScreenNames.DiscountCustomer as any)}
              >
                <Text style={styles.tabText}>Cliente</Text>
              </TouchableOpacity>
              <View style={[styles.tabBtn, styles.tabWVenda, styles.tabBtnActive]}><Text style={[styles.tabText, styles.tabTextActive]}>Venda</Text></View>
              <View style={styles.tabBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.tabBtn, styles.tabWGerenciar]}
                  onPress={() => navigation.navigate(ScreenNames.DiscountManage as any)}
                >
                  <Text style={styles.tabText}>Gerenciar</Text>
                </TouchableOpacity>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{formatCardNumber(gerenciarBadgeCount)}</Text>
                </View>
              </View>
              <View style={styles.tabBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.tabBtn, styles.tabWChat]}
                  onPress={() => navigation.navigate(ScreenNames.DiscountChat as any)}
                >
                  <Text style={styles.tabText}>Chat</Text>
                </TouchableOpacity>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{formatCardNumber(chatBadgeCount)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Container do conteúdo com scroll - define os limites verticais */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={Platform.OS === 'android'}
            bounces={Platform.OS === 'ios'}
          >
            {/* Container - Detalhes da venda */}
            <View style={styles.saleDetailsWrapper}>
              {/* Card superior - Detalhes da venda com imagem e campos */}
              <View style={[styles.card, styles.saleDetailsCard]}>
                <View style={styles.saleDetailsHeaderRow}>
                  <Text style={styles.saleDetailsTitle}>Detalhes da venda</Text>
                </View>
                <View style={styles.saleDetailsDivider} />
                <View style={styles.saleDetailsContentRow}>
                  <View style={styles.saleDetailsImageWrap}>
                    <Image source={require('../../../assets/00001.png')} style={styles.saleDetailsImage} resizeMode="cover" />
                  </View>
                  <View style={styles.saleDetailsFields}>
                    <View
                      style={styles.prodServBlock}
                      onLayout={(e) => {
                        const raw = e.nativeEvent.layout.height;
                        const next = Math.max(80, Math.round(raw));
                        console.log('[SaleDetails] prodServBlock height', raw, '=>', next);
                        setProdServHeight(next);
                      }}
                    >
                      <View style={styles.saleDetailsFieldGroup}>
                        <View style={styles.saleDetailsLabelRow}><Text style={styles.saleDetailsLabel}>Produto</Text></View>
                        <View style={styles.saleDetailsValueRow}><Text style={[styles.saleDetailsValue, { flex: 1 }]}>Holding Patrimonial</Text></View>
                      </View>
                      <View style={styles.saleDetailsThinDivider} />
                      <View style={styles.saleDetailsFieldGroup}>
                        <View style={styles.saleDetailsLabelRow}><Text style={styles.saleDetailsLabel}>Serviço</Text></View>
                        <View style={styles.saleDetailsValueRow}><Text style={[styles.saleDetailsValue, { flex: 1 }]} numberOfLines={2} ellipsizeMode="tail">Reunião estratégica</Text></View>
                      </View>
                      <View style={styles.saleDetailsThinDivider} />
                      <View style={styles.saleDetailsFieldGroup}>
                        <View style={styles.saleDetailsLabelRow}><Text style={styles.saleDetailsLabel}>Tipo de Honorários</Text></View>
                        <View style={styles.saleDetailsValueRow}><Text style={styles.saleDetailsValue}>Prolabore</Text></View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              {/* Card inferior - Valor do produto */}
              <View style={styles.productValueCard}>
                <View style={styles.productValueIconBox}>
                  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
                    <Rect x={0.25} y={0.25} width={45.5} height={45.5} rx={5.75} fill="rgba(23,119,207,0.03)" stroke="#D8E0F0" strokeWidth={0.5} />
                    <Path d="M33.3779 16.0836H31.2376H29.198H27.8398V14.6336C27.8398 13.7347 27.1152 13 26.2178 13H19.7774C18.8848 13 18.1554 13.7298 18.1554 14.6336V16.0836H16.7972H14.7576H12.6221C11.7247 16.0836 11 16.8134 11 17.7124V31.3664C11 32.2653 11.7247 33 12.6221 33H14.7624H16.802H29.198H31.2376H33.3779C34.2705 33 35 32.2702 35 31.3664V17.7124C34.9952 16.8134 34.2705 16.0836 33.3779 16.0836ZM18.6401 17.0503H27.3599H28.7181V32.0333H17.2771V17.0503H18.6401ZM19.12 14.6336C19.12 14.2663 19.4175 13.9667 19.7822 13.9667H26.2226C26.5873 13.9667 26.8848 14.2663 26.8848 14.6336V16.0836H19.12V14.6336ZM11.9598 31.3664V17.7124C11.9598 17.3451 12.2573 17.0454 12.6221 17.0454L16.7972 17.0503V24.798V32.0333L12.6221 32.0285C12.2573 32.0334 11.9598 31.7337 11.9598 31.3664ZM16.7972 32.0333V24.798V17.0503H16.3173V32.0333H16.7972ZM29.6779 32.0333V17.0503H29.198V32.0333H29.6779ZM34.0354 31.3664C34.0354 31.7337 33.7379 32.0333 33.3731 32.0333H29.198V17.0503H33.3731C33.7379 17.0503 34.0354 17.3499 34.0354 17.7173V31.3664Z" fill="#3A3F51" />
                  </Svg>
                </View>
                <View style={styles.productValueDetails}>
                  <View style={styles.productValueLabelRow}>
                    <Text style={styles.productValueLabelText}>Valor do produto</Text>
                  </View>
                  <View style={styles.productValueDivider} />
                  <View style={styles.productValuePriceRow}>
                    <Text style={styles.productValuePriceText}>R$ 120.000,00</Text>
                  </View>
                </View>
              </View>
            </View>

          

          {/* Card - Pretensão de pagamento do cliente */}
          <View style={styles.card}>
            <View style={styles.cardHeader}><Text style={styles.cardTitle}>Forma de pagamento</Text></View>
            <View style={styles.payBlock}>
              <View style={styles.prolaboreModal}>
                <View style={styles.prolaboreIconBox}>
                  <ProlaboreIcon />
                </View>
                <View style={styles.prolaboreDetails}>
                  <View style={styles.prolaboreHeaderRow}>
                    <Text style={styles.prolaboreHeaderText}>Prolabore</Text>
                  </View>
                  <View style={styles.prolaboreSectionDivider} />
                  <View style={styles.prolaborePriceRow}>
                    <Text style={styles.prolaborePriceText}>R$ 50.000,00</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.proToggleSquare}
                  onPress={() => setProlaboreExpanded((v) => !v)}
                  accessibilityRole="button"
                  accessibilityLabel="Expandir/ocultar Prolabore"
                >
                  <Text style={styles.proToggleText}>{prolaboreExpanded ? '-' : '+'}</Text>
                </TouchableOpacity>
              </View>
              {prolaboreExpanded && (
                <>
              <View style={styles.pixModal}>
                <View style={styles.pixDetails}>
                  <View style={styles.pixHeaderRow}>
                    <Text style={styles.pixHeaderText}>Pix</Text>
                  </View>
                  <View style={styles.pixValueRow}>
                    <Text style={styles.pixValueText}>R$ 25.000,00</Text>
                  </View>
                </View>
              <TouchableOpacity
                style={[
                  styles.pixPercentBox,
                  hasPixPercent ? styles.percentBoxActive : styles.percentBoxInactive,
                ]}
                onPress={() => setActiveDiscount((prev) => (prev === 'pix' ? null : 'pix'))}
                accessibilityRole="button"
                accessibilityLabel="Abrir desconto Pix"
              >
                <Text style={hasPixPercent ? styles.percentTextActive : styles.percentTextInactive}>%</Text>
              </TouchableOpacity>
            </View>
            {activeDiscount === 'pix' && (
              <View style={styles.discountModal}>
                <View style={styles.discountHeaderRow}>
                  <TouchableOpacity
                    style={styles.discountPercentPill}
                    onPress={() => openPicker('pix')}
                    accessibilityRole="button"
                    accessibilityLabel="Selecionar desconto Pix"
                  >
                      <TextInput
                        style={styles.percentInput}
                        value={pixPercentInput}
                        editable={false}
                        placeholder="00,00%"
                        placeholderTextColor="#FCFCFC"
                      />
                  </TouchableOpacity>
                  <View style={styles.discountAmountBox}>
                    <Text style={styles.discountAmountText}>{formatBRL(pixBase * parsePercent(pixPercentInput) / 100)}</Text>
                  </View>
                </View>
                <View style={styles.discountSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>Desconto</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionLineRow}>
                      <Text style={styles.sectionLabel}>Mínimo</Text>
                    <View style={styles.sectionLineRight}>
                      <Text style={styles.sectionPercent}>2%</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(pixBase * 0.02)}</Text>
                    </View>
                  </View>
                  <View style={styles.sectionDividerBlue} />
                  <View style={styles.sectionLineRow}>
                    <Text style={styles.sectionLabel}>Máximo</Text>
                    <View style={styles.sectionLineRight}>
                      <Text style={styles.sectionPercent}>8%</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(pixBase * 0.08)}</Text>
                    </View>
                  </View>
                  </View>
                </View>
                <View style={styles.discountSection}>
                  <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeaderText}>Redução de premiação</Text>
                  </View>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionLineRow}>
                      <Text style={styles.sectionLabel}>Seu lucro</Text>
                      <View style={styles.sectionLineRight}>
                        <Text style={styles.sectionPercent}>{formatPercentStr(partnerReductionPercent(parsePercent(pixPercentInput)))}</Text>
                        <Text style={styles.sectionCurrency}>{formatBRL(pixBase * partnerReductionPercent(parsePercent(pixPercentInput)) / 100)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
              <View style={styles.creditModal}>
                <View style={styles.creditDetails}>
                  <View style={styles.creditHeaderRow}>
                    <View style={styles.creditLeftCol}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.creditHeaderText}>Crédito</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.creditValueText}>R$ 15.000,00</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      style={[
                        styles.creditPercentBox,
                        hasCreditPercent ? styles.percentBoxActive : styles.percentBoxInactive,
                      ]}
                      onPress={() => setActiveDiscount((prev) => (prev === 'credit' ? null : 'credit'))}
                      accessibilityRole="button"
                      accessibilityLabel="Abrir desconto Crédito"
                    >
                      <Text style={hasCreditPercent ? styles.percentTextActive : styles.percentTextInactive}>%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.creditDividerWrap}>
                    <View style={styles.creditDividerLine} />
                  </View>
                  <View style={styles.creditInstallmentsRow}>
                    <Text style={styles.creditInstallmentsText}>10 x 1.500,00</Text>
                    <Text style={styles.installmentsSub}>Juros: R$ 00,00</Text>
                  </View>
                </View>
              </View>
              {activeDiscount === 'credit' && (
                <View style={styles.discountModal}>
                  <View style={styles.discountHeaderRow}>
                    <TouchableOpacity
                      style={styles.discountPercentPill}
                      onPress={() => openPicker('credit')}
                      accessibilityRole="button"
                      accessibilityLabel="Selecionar desconto Crédito"
                    >
                      <TextInput
                        style={styles.percentInput}
                        value={creditPercentInput}
                        editable={false}
                        placeholder="00,00%"
                        placeholderTextColor="#FCFCFC"
                      />
                    </TouchableOpacity>
                    <View style={styles.discountAmountBox}>
                      <Text style={styles.discountAmountText}>{formatBRL(creditBase * parsePercent(creditPercentInput) / 100)}</Text>
                    </View>
                  </View>
                  <View style={styles.discountSection}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderText}>Desconto</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Mínimo</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>2%</Text>
                          <Text style={styles.sectionCurrency}>R$ 2.400,00</Text>
                        </View>
                      </View>
                      <View style={styles.sectionDividerBlue} />
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Máximo</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>8%</Text>
                          <Text style={styles.sectionCurrency}>R$ 9.600,00</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.discountSection}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderText}>Redução de premiação</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Seu lucro</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>{formatPercentStr(partnerReductionPercent(parsePercent(creditPercentInput)))}</Text>
                          <Text style={styles.sectionCurrency}>{formatBRL(creditBase * partnerReductionPercent(parsePercent(creditPercentInput)) / 100)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.creditModal}>
                <View style={styles.creditDetails}>
                  <View style={styles.creditHeaderRow}>
                    <View style={styles.creditLeftCol}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.creditHeaderText}>Boleto</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.creditValueText}>R$ 10.000,00</Text>
                      </View>
                    </View>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                      style={[
                        styles.creditPercentBox,
                        hasBoletoPercent ? styles.percentBoxActive : styles.percentBoxInactive,
                      ]}
                      onPress={() => setActiveDiscount((prev) => (prev === 'boleto' ? null : 'boleto'))}
                      accessibilityRole="button"
                      accessibilityLabel="Abrir desconto Boleto"
                    >
                      <Text style={hasBoletoPercent ? styles.percentTextActive : styles.percentTextInactive}>%</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.creditDividerWrap}>
                    <View style={styles.creditDividerLine} />
                  </View>
                  <View style={styles.creditInstallmentsRow}>
                    <Text style={styles.creditInstallmentsText}>5 x 2.100,00</Text>
                    <Text style={styles.installmentsSub}>Juros: R$ 500,00</Text>
                  </View>
                </View>
              </View>
              {activeDiscount === 'boleto' && (
                <View style={styles.discountModal}>
                  <View style={styles.discountHeaderRow}>
                    <TouchableOpacity
                      style={styles.discountPercentPill}
                      onPress={() => openPicker('boleto')}
                      accessibilityRole="button"
                      accessibilityLabel="Selecionar desconto Boleto"
                    >
                      <TextInput
                        style={styles.percentInput}
                        value={boletoPercentInput}
                        editable={false}
                        placeholder="00,00%"
                        placeholderTextColor="#FCFCFC"
                      />
                    </TouchableOpacity>
                    <View style={styles.discountAmountBox}>
                      <Text style={styles.discountAmountText}>{formatBRL(boletoBase * parsePercent(boletoPercentInput) / 100)}</Text>
                    </View>
                  </View>
                  <View style={styles.discountSection}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderText}>Desconto</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Mínimo</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>2%</Text>
                          <Text style={styles.sectionCurrency}>R$ 2.400,00</Text>
                        </View>
                      </View>
                      <View style={styles.sectionDividerBlue} />
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Máximo</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>8%</Text>
                          <Text style={styles.sectionCurrency}>R$ 9.600,00</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={styles.discountSection}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionHeaderText}>Redução de premiação</Text>
                    </View>
                    <View style={styles.sectionContent}>
                      <View style={styles.sectionLineRow}>
                        <Text style={styles.sectionLabel}>Seu lucro</Text>
                        <View style={styles.sectionLineRight}>
                          <Text style={styles.sectionPercent}>{formatPercentStr(partnerReductionPercent(parsePercent(boletoPercentInput)))}</Text>
                          <Text style={styles.sectionCurrency}>{formatBRL(boletoBase * partnerReductionPercent(parsePercent(boletoPercentInput)) / 100)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              <View style={styles.totalModal}>
                <View style={styles.totalHeaderRow}>
                  <Text style={styles.totalHeaderText}>Total</Text>
                </View>
                <View style={styles.totalDividerWrap}><View style={styles.totalDividerLine} /></View>
                <View style={styles.totalSection}>
                  <View style={styles.totalHeaderRow}><Text style={styles.totalSectionLabel}>Desconto</Text></View>
                  <View style={styles.totalLineRow}><Text style={styles.totalLinePercent}>{formatPercentStr(totalDiscountPercent)}</Text><Text style={styles.totalLineCurrency}>{formatBRL(totalDiscountValue)}</Text></View>
                </View>
                <View style={styles.totalDividerWrap}><View style={styles.totalDividerLine} /></View>
                <View style={styles.totalSection}>
                  <View style={styles.totalHeaderRow}><Text style={styles.totalSectionLabel}>Redução de premiação</Text></View>
                  <View style={styles.totalLineRow}><Text style={styles.totalLinePercent}>{formatPercentStr(totalReductionPercent)}</Text><Text style={styles.totalLineCurrency}>{formatBRL(totalReductionValue)}</Text></View>
                </View>
              </View>
                </>
              )}
                <View style={styles.prolaboreModal}>
                  <View style={styles.prolaboreIconBox}>
                    <ExitoIcon />
                  </View>
                  <View style={styles.prolaboreDetails}>
                    <View style={styles.prolaboreHeaderRow}>
                      <Text style={styles.prolaboreHeaderText}>Êxito</Text>
                    </View>
                    <View style={styles.prolaboreSectionDivider} />
                    <View style={styles.prolaborePriceRow}>
                      <Text style={styles.prolaborePriceText}>R$ 70.000,00</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.proToggleSquare}
                    onPress={() => setExitoExpanded((v) => !v)}
                    accessibilityRole="button"
                    accessibilityLabel="Expandir/ocultar Êxito"
                  >
                    <Text style={styles.proToggleText}>{exitoExpanded ? '-' : '+'}</Text>
                  </TouchableOpacity>
                </View>
                {exitoExpanded && (
                  <>
                <View style={styles.pixModal}>
                  <View style={styles.pixDetails}>
                    <View style={styles.pixHeaderRow}>
                      <Text style={styles.pixHeaderText}>Pix</Text>
                    </View>
                    <View style={styles.pixValueRow}>
                      <Text style={styles.pixValueText}>R$ 25.000,00</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.pixPercentBox,
                      hasExitoPixPercent ? styles.percentBoxActive : styles.percentBoxInactive,
                    ]}
                    onPress={() => setActiveExitoDiscount((prev) => (prev === 'pix' ? null : 'pix'))}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir desconto Pix"
                  >
                    <Text style={hasExitoPixPercent ? styles.percentTextActive : styles.percentTextInactive}>%</Text>
                  </TouchableOpacity>
                </View>
                {activeExitoDiscount === 'pix' && (
                  <View style={styles.discountModal}>
                    <View style={styles.discountHeaderRow}>
                      <TouchableOpacity
                        style={styles.discountPercentPill}
                        onPress={() => openExitoPicker('pix')}
                        accessibilityRole="button"
                        accessibilityLabel="Selecionar desconto Pix Êxito"
                      >
                        <TextInput
                          style={styles.percentInput}
                          value={exitoPixPercentInput}
                          editable={false}
                          placeholder="00,00%"
                          placeholderTextColor="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <View style={styles.discountAmountBox}>
                        <Text style={styles.discountAmountText}>{formatBRL(exitoPixBase * parsePercent(exitoPixPercentInput) / 100)}</Text>
                      </View>
                    </View>
                    <View style={styles.discountSection}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeaderText}>Desconto</Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Mínimo</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>2%</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoPixBase * 0.02)}</Text>
                          </View>
                        </View>
                        <View style={styles.sectionDividerBlue} />
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Máximo</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>8%</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoPixBase * 0.08)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.discountSection}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeaderText}>Redução de premiação</Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Seu lucro</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>{formatPercentStr(partnerReductionPercent(parsePercent(exitoPixPercentInput)))}</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoPixBase * partnerReductionPercent(parsePercent(exitoPixPercentInput)) / 100)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.creditModal}>
                  <View style={styles.creditDetails}>
                    <View style={styles.creditHeaderRow}>
                      <View style={styles.creditLeftCol}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.creditHeaderText}>Crédito</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={styles.creditValueText}>R$ 45.000,00</Text>
                        </View>
                      </View>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        style={[
                          styles.creditPercentBox,
                          hasExitoCreditPercent ? styles.percentBoxActive : styles.percentBoxInactive,
                        ]}
                        onPress={() => setActiveExitoDiscount((prev) => (prev === 'credit' ? null : 'credit'))}
                        accessibilityRole="button"
                        accessibilityLabel="Abrir desconto Crédito"
                      >
                        <Text style={hasExitoCreditPercent ? styles.percentTextActive : styles.percentTextInactive}>%</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.creditDividerWrap}>
                      <View style={styles.creditDividerLine} />
                    </View>
                    <View style={styles.creditInstallmentsRow}>
                      <Text style={styles.creditInstallmentsText}>12 x 3.750,00</Text>
                      <Text style={styles.installmentsSub}>Juros: R$ 00,00</Text>
                    </View>
                  </View>
                </View>
                {activeExitoDiscount === 'credit' && (
                  <View style={styles.discountModal}>
                    <View style={styles.discountHeaderRow}>
                      <TouchableOpacity
                        style={styles.discountPercentPill}
                        onPress={() => openExitoPicker('credit')}
                        accessibilityRole="button"
                        accessibilityLabel="Selecionar desconto Crédito Êxito"
                      >
                        <TextInput
                          style={styles.percentInput}
                          value={exitoCreditPercentInput}
                          editable={false}
                          placeholder="00,00%"
                          placeholderTextColor="#FCFCFC"
                        />
                      </TouchableOpacity>
                      <View style={styles.discountAmountBox}>
                        <Text style={styles.discountAmountText}>{formatBRL(exitoCreditBase * parsePercent(exitoCreditPercentInput) / 100)}</Text>
                      </View>
                    </View>
                    <View style={styles.discountSection}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeaderText}>Desconto</Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Mínimo</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>2%</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoCreditBase * 0.02)}</Text>
                          </View>
                        </View>
                        <View style={styles.sectionDividerBlue} />
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Máximo</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>8%</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoCreditBase * 0.08)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.discountSection}>
                      <View style={styles.sectionHeaderRow}>
                        <Text style={styles.sectionHeaderText}>Redução de premiação</Text>
                      </View>
                      <View style={styles.sectionContent}>
                        <View style={styles.sectionLineRow}>
                          <Text style={styles.sectionLabel}>Seu lucro</Text>
                          <View style={styles.sectionLineRight}>
                            <Text style={styles.sectionPercent}>{formatPercentStr(partnerReductionPercent(parsePercent(exitoCreditPercentInput)))}</Text>
                            <Text style={styles.sectionCurrency}>{formatBRL(exitoCreditBase * partnerReductionPercent(parsePercent(exitoCreditPercentInput)) / 100)}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.totalModal}>
                  <View style={styles.totalHeaderRow}>
                    <Text style={styles.totalHeaderText}>Total</Text>
                  </View>
                  <View style={styles.totalDividerWrap}><View style={styles.totalDividerLine} /></View>
                  <View style={styles.totalSection}>
                    <View style={styles.totalHeaderRow}><Text style={styles.totalSectionLabel}>Desconto</Text></View>
                    <View style={styles.totalLineRow}><Text style={styles.totalLinePercent}>{formatPercentStr(exitoTotalDiscountPercent)}</Text><Text style={styles.totalLineCurrency}>{formatBRL(exitoTotalDiscountValue)}</Text></View>
                  </View>
                  <View style={styles.totalDividerWrap}><View style={styles.totalDividerLine} /></View>
                  <View style={styles.totalSection}>
                    <View style={styles.totalHeaderRow}><Text style={styles.totalSectionLabel}>Redução de premiação</Text></View>
                    <View style={styles.totalLineRow}><Text style={styles.totalLinePercent}>{formatPercentStr(exitoTotalReductionPercent)}</Text><Text style={styles.totalLineCurrency}>{formatBRL(exitoTotalReductionValue)}</Text></View>
                  </View>
                </View>
                  </>
                )}
                <View style={styles.overallTotalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' }}>
                    <Text style={styles.prolaboreHeaderText}>Desconto total</Text>
                  </View>
                </View>
                <View style={styles.overallTotalBox}>
                  <View style={styles.summaryBlock}>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Desconto cliente</Text></View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Pró-labore</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(totalDiscountPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(totalDiscountValue)}</Text>
                    </View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Êxito</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(exitoTotalDiscountPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(exitoTotalDiscountValue)}</Text>
                    </View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Total</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(totalDiscountPercent + exitoTotalDiscountPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(grandTotalDiscountValue)}</Text>
                    </View>
                  </View>
                  <View style={styles.summaryBlock}>
                    <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Redução de Premiação</Text></View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Pró-labore</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(totalReductionPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(totalReductionValue)}</Text>
                    </View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Êxito</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(exitoTotalReductionPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(exitoTotalReductionValue)}</Text>
                    </View>
                    <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                    <View style={styles.summaryLine}>
                      <Text style={styles.sectionLabel}>Total</Text>
                      <Text style={styles.sectionPercent}>{formatPercentStr(totalReductionPercent + exitoTotalReductionPercent)}</Text>
                      <Text style={styles.sectionCurrency}>{formatBRL(grandTotalReductionValue)}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.applyButton} accessibilityRole="button" accessibilityLabel="Solicitar desconto">
                    <Text style={styles.applyButtonText}>Solicitar desconto</Text>
                  </TouchableOpacity>
                  <View style={styles.counterBox}>
                    <Text style={styles.counterText}>00</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card - Desconto total */}
            <View style={styles.systemDiscountOuter}>
                <View style={styles.systemHeaderRow}>
                  <Text style={styles.systemTitleText}>Desconto do sistema</Text>
                  <TouchableOpacity
                    onPress={() => setSystemDiscountModalVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Ver detalhes do desconto do sistema"
                  >
                    <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
                      <Rect x={0.4} y={0.4} width={34.2} height={34.2} rx={5.6} fill="#F4F4F4" />
                      <Rect x={0.4} y={0.4} width={34.2} height={34.2} rx={5.6} stroke="#D8E0F0" strokeWidth={0.8} />
                      <Path d="M17.5 10.5C11.4688 10.5 6.36489 16.8 6.14923 17.073C6.05247 17.1954 6 17.3455 6 17.5C6 17.6545 6.05247 17.8046 6.14923 17.927C6.36489 18.2 11.4688 24.5 17.5 24.5C23.5312 24.5 28.6351 18.2 28.8508 17.927C28.9475 17.8046 29 17.6545 29 17.5C29 17.3455 28.9475 17.1954 28.8508 17.073C28.6351 16.8 23.5312 10.5 17.5 10.5ZM17.5 23.1C13.0215 23.1 8.87371 18.9 7.65165 17.5C8.87371 16.1 13.0143 11.9 17.5 11.9C21.9857 11.9 26.1263 16.1 27.3484 17.5C26.1263 18.9 21.9857 23.1 17.5 23.1Z" fill="#3A3F51" />
                      <Path d="M21.0943 16.8C21.2129 16.7999 21.3297 16.7712 21.4342 16.7165C21.5387 16.6618 21.6277 16.5827 21.6932 16.4864C21.7586 16.39 21.7986 16.2794 21.8095 16.1643C21.8204 16.0493 21.8019 15.9334 21.7556 15.827C21.3602 15.0602 20.7517 14.4169 19.9994 13.9702C19.2471 13.5235 18.3811 13.2913 17.5 13.3C16.3561 13.3 15.259 13.7425 14.4501 14.5302C13.6413 15.3178 13.1869 16.3861 13.1869 17.5C13.1869 18.6139 13.6413 19.6822 14.4501 20.4698C15.259 21.2575 16.3561 21.7 17.5 21.7C18.3811 21.7087 19.2471 21.4765 19.9994 21.0298C20.7517 20.5831 21.3602 19.9398 21.7556 19.173C21.8019 19.0666 21.8204 18.9507 21.8095 18.8357C21.7986 18.7206 21.7586 18.61 21.6932 18.5136C21.6277 18.4173 21.5387 18.3382 21.4342 18.2835C21.3297 18.2288 21.2129 18.2001 21.0943 18.2C20.9974 18.2099 20.8994 18.1986 20.8076 18.1669C20.7158 18.1352 20.6324 18.084 20.5635 18.0169C20.4946 17.9498 20.4419 17.8686 20.4094 17.7792C20.3769 17.6897 20.3653 17.5944 20.3754 17.5C20.3653 17.4056 20.3769 17.3103 20.4094 17.2208C20.4419 17.1314 20.4946 17.0502 20.5635 16.9831C20.6324 16.916 20.7158 16.8648 20.8076 16.8331C20.8994 16.8014 20.9974 16.7901 21.0943 16.8Z" fill="#3A3F51" />
                    </Svg>
                  </TouchableOpacity>
                </View>
                <View style={styles.totalDividerWrap}><View style={styles.totalDividerLine} /></View>
                <View style={styles.summaryLine}>
                  <Text style={styles.sectionLabel}>Pró-labore</Text>
                  <Text style={styles.sectionPercent}>{formatPercentStr(totalDiscountPercent)}</Text>
                  <Text style={styles.sectionCurrency}>{formatBRL(totalDiscountValue)}</Text>
                </View>
                <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                <View style={styles.summaryLine}>
                  <Text style={styles.sectionLabel}>Êxito</Text>
                  <Text style={styles.sectionPercent}>{formatPercentStr(exitoTotalDiscountPercent)}</Text>
                  <Text style={styles.sectionCurrency}>{formatBRL(exitoTotalDiscountValue)}</Text>
                </View>
                <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                <View style={styles.summaryLine}>
                  <Text style={styles.sectionLabel}>Total</Text>
                  <Text style={styles.sectionPercent}>{formatPercentStr(grandTotalDiscountPercent)}</Text>
                  <Text style={styles.sectionCurrency}>{formatBRL(grandTotalDiscountValue)}</Text>
                </View>
                <View style={styles.summaryDividerWrap}><View style={styles.summaryDividerLine} /></View>
                <View style={styles.systemFooterRow}>
                  <TouchableOpacity style={styles.applyButtonLarge} accessibilityRole="button" accessibilityLabel="Aplicar desconto do sistema">
                    <Text style={styles.applyButtonLargeText}>Aplicar desconto</Text>
                  </TouchableOpacity>
                </View>
            </View>

            {/* Espaçamento inferior para garantir scroll completo */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>
      <DescontoModalDiscount
        visible={discountPickerVisible}
        onCancel={closePicker}
        onConfirm={(str) => onConfirmPicker(str)}
        initialInteger={(() => {
          const t = discountPickerTarget;
          const v = t === 'pix' ? pixPercentInput : t === 'credit' ? creditPercentInput : t === 'boleto' ? boletoPercentInput : '';
          return getInitialPickerValues(v).integer;
        })()}
        initialDecimal={(() => {
          const t = discountPickerTarget;
          const v = t === 'pix' ? pixPercentInput : t === 'credit' ? creditPercentInput : t === 'boleto' ? boletoPercentInput : '';
          return getInitialPickerValues(v).decimal;
        })()}
      />
      <DescontoModalDiscount
        visible={exitoPickerVisible}
        onCancel={closeExitoPicker}
        onConfirm={(str) => onConfirmExitoPicker(str)}
        initialInteger={(() => {
          const t = exitoPickerTarget;
          const v = t === 'pix' ? exitoPixPercentInput : t === 'credit' ? exitoCreditPercentInput : '';
          return getInitialPickerValues(v).integer;
        })()}
        initialDecimal={(() => {
          const t = exitoPickerTarget;
          const v = t === 'pix' ? exitoPixPercentInput : t === 'credit' ? exitoCreditPercentInput : '';
          return getInitialPickerValues(v).decimal;
        })()}
      />
      <DiscountSystemModal
        visible={systemDiscountModalVisible}
        onClose={() => setSystemDiscountModalVisible(false)}
        onApply={() => {
          setSystemDiscountModalVisible(false);
          // Lógica para aplicar desconto pode ser adicionada aqui
        }}
        data={{
          // Prolabore
          prolaboreTotal: 50000,
          prolaborePixValue: pixBase,
          prolaborePixDiscountPercent: parsePercent(pixPercentInput),
          prolaborePixDiscountValue: pixBase * parsePercent(pixPercentInput) / 100,
          prolaboreCreditValue: creditBase,
          prolaboreCreditInstallments: '10 x 1.500,00',
          prolaboreCreditInterest: 0,
          prolaboreCreditDiscountPercent: parsePercent(creditPercentInput),
          prolaboreCreditDiscountValue: creditBase * parsePercent(creditPercentInput) / 100,
          prolaboreBoletoValue: boletoBase,
          prolaboreBoletoInstallments: '5 x 2.000,00',
          prolaboreBoletoInterest: 0,
          prolaboreBoletoDiscountPercent: parsePercent(boletoPercentInput),
          prolaboreBoletoDiscountValue: boletoBase * parsePercent(boletoPercentInput) / 100,
          prolaboreTotalDiscountPercent: totalDiscountPercent,
          prolaboreTotalDiscountValue: totalDiscountValue,
          // Êxito
          exitoTotal: 70000,
          exitoPixValue: exitoPixBase,
          exitoPixDiscountPercent: parsePercent(exitoPixPercentInput),
          exitoPixDiscountValue: exitoPixBase * parsePercent(exitoPixPercentInput) / 100,
          exitoCreditValue: exitoCreditBase,
          exitoCreditInstallments: '10 x 1.500,00',
          exitoCreditInterest: 0,
          exitoCreditDiscountPercent: parsePercent(exitoCreditPercentInput),
          exitoCreditDiscountValue: exitoCreditBase * parsePercent(exitoCreditPercentInput) / 100,
          exitoTotalDiscountPercent: exitoTotalDiscountPercent,
          exitoTotalDiscountValue: exitoTotalDiscountValue,
          // Desconto total
          grandProlaboreDiscountPercent: totalDiscountPercent,
          grandProlaboreDiscountValue: totalDiscountValue,
          grandExitoDiscountPercent: exitoTotalDiscountPercent,
          grandExitoDiscountValue: exitoTotalDiscountValue,
          grandTotalDiscountPercent: grandTotalDiscountPercent,
          grandTotalDiscountValue: grandTotalDiscountValue,
          // Valor do produto
          productValue: 120000,
        }}
      />
    </SafeAreaView>
  );
};

const ProductValueIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect width={46} height={46} rx={6} fill="#1777CF" />
    <Path d="M33.3779 16.0836H31.2376H29.198H27.8398V14.6336C27.8398 13.7347 27.1152 13 26.2178 13H19.7774C18.8848 13 18.1554 13.7298 18.1554 14.6336V16.0836H16.7972H14.7576H12.6221C11.7247 16.0836 11 16.8134 11 17.7124V31.3664C11 32.2653 11.7247 33 12.6221 33H14.7624H16.802H29.198H31.2376H33.3779C34.2705 33 35 32.2702 35 31.3664V17.7124C34.9952 16.8134 34.2705 16.0836 33.3779 16.0836ZM18.6401 17.0503H27.3599H28.7181V32.0333H17.2771V17.0503H18.6401ZM19.12 14.6336C19.12 14.2663 19.4175 13.9667 19.7822 13.9667H26.2226C26.5873 13.9667 26.8848 14.2663 26.8848 14.6336V16.0836H19.12V14.6336ZM11.9598 31.3664V17.7124C11.9598 17.3451 12.2573 17.0454 12.6221 17.0454L16.7972 17.0503V24.798V32.0333L12.6221 32.0285C12.2573 32.0333 11.9598 31.7337 11.9598 31.3664ZM16.7972 32.0333V24.798V17.0503H16.3173V32.0333H16.7972ZM29.6779 32.0333V17.0503H29.198V32.0333H29.6779ZM34.0354 31.3664C34.0354 31.7337 33.7379 32.0333 33.3731 32.0333H29.198V17.0503H33.3731C33.7379 17.0503 34.0354 17.3499 34.0354 17.7173V31.3664Z" fill="#FCFCFC" />
    <Path d="M16.7972 17.0503L12.6221 17.0454C12.2573 17.0454 11.9598 17.3451 11.9598 17.7124V31.3664C11.9598 31.7337 12.2573 32.0334 12.6221 32.0285L16.7972 32.0333M16.7972 17.0503H16.3173V32.0333H16.7972M16.7972 17.0503V24.798V32.0333M29.198 17.0503H29.6779V32.0333H29.198M29.198 17.0503V32.0333M29.198 17.0503H33.3731C33.7379 17.0503 34.0354 17.3499 34.0354 17.7173V31.3664C34.0354 31.7337 33.7379 32.0333 33.3731 32.0333H29.198M33.3779 16.0836H31.2376H29.198H27.8398V14.6336C27.8398 13.7347 27.1152 13 26.2178 13H19.7774C18.8848 13 18.1554 13.7298 18.1554 14.6336V16.0836H16.7972H14.7576H12.6221C11.7247 16.0836 11 16.8134 11 17.7124V31.3664C11 32.2653 11.7247 33 12.6221 33H14.7624H16.802H29.198H31.2376H33.3779C34.2705 33 35 32.2702 35 31.3664V17.7124C34.9952 16.8134 34.2705 16.0836 33.3779 16.0836ZM18.6401 17.0503H27.3599H28.7181V32.0333H17.2771V17.0503H18.6401ZM19.12 14.6336C19.12 14.2663 19.4175 13.9667 19.7822 13.9667H26.2226C26.5873 13.9667 26.8848 14.2663 26.8848 14.6336V16.0836H19.12V14.6336Z" stroke="#FCFCFC" strokeWidth={0.3} />
  </Svg>
);

const ProlaboreIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect width={46} height={46} rx={6} fill="#1777CF" />
    <Path d="M23 18.7143C23.5198 18.6724 24.0353 18.8359 24.4359 19.1697C24.8365 19.5036 25.0903 19.9812 25.1429 20.5C25.1429 20.6894 25.2181 20.8711 25.3521 21.0051C25.486 21.139 25.6677 21.2143 25.8571 21.2143C26.0466 21.2143 26.2283 21.139 26.3622 21.0051C26.4962 20.8711 26.5714 20.6894 26.5714 20.5C26.5375 19.7241 26.2333 18.9845 25.7115 18.4092C25.1897 17.834 24.4832 17.4593 23.7143 17.35V16.5714C23.7143 16.382 23.639 16.2003 23.5051 16.0664C23.3711 15.9324 23.1894 15.8571 23 15.8571C22.8106 15.8571 22.6289 15.9324 22.4949 16.0664C22.361 16.2003 22.2857 16.382 22.2857 16.5714V17.35C21.5168 17.4593 20.8103 17.834 20.2885 18.4092C19.7667 18.9845 19.4625 19.7241 19.4286 20.5C19.4286 22.7 21.9643 23.4429 22.8 23.6857C25.0429 24.3429 25.1429 24.7357 25.1429 25.5C25.0903 26.0188 24.8365 26.4964 24.4359 26.8303C24.0353 27.1641 23.5198 27.3276 23 27.2857C22.4802 27.3276 21.9647 27.1641 21.5641 26.8303C21.1635 26.4964 20.9097 26.0188 20.8571 25.5C20.8571 25.3106 20.7819 25.1289 20.6479 24.9949C20.514 24.861 20.3323 24.7857 20.1429 24.7857C19.9534 24.7857 19.7717 24.861 19.6378 24.9949C19.5038 25.1289 19.4286 25.3106 19.4286 25.5C19.4625 26.2759 19.7667 27.0155 20.2885 27.5908C20.8103 28.166 21.5168 28.5407 22.2857 28.65V29.4286C22.2857 29.618 22.361 29.7997 22.4949 29.9336C22.6289 30.0676 22.8106 30.1429 23 30.1429C23.1894 30.1429 23.3711 30.0676 23.5051 29.9336C23.639 29.7997 23.7143 29.618 23.7143 29.4286V28.65C24.4832 28.5407 25.1897 28.166 25.7115 27.5908C26.2333 27.0155 26.5375 26.2759 26.5714 25.5C26.5714 23.4571 25.1429 22.8714 23.2 22.2857C21.1 21.7 20.8571 20.9857 20.8571 20.5C20.9097 19.9812 21.1635 19.5036 21.5641 19.1697C21.9647 18.8359 22.4802 18.6724 23 18.7143Z" fill="#FCFCFC" />
    <Path d="M23 13C21.0222 13 19.0888 13.5865 17.4443 14.6853C15.7998 15.7841 14.5181 17.3459 13.7612 19.1732C13.0043 21.0004 12.8063 23.0111 13.1922 24.9509C13.578 26.8907 14.5304 28.6725 15.9289 30.0711C17.3275 31.4696 19.1093 32.422 21.0491 32.8078C22.9889 33.1937 24.9996 32.9957 26.8268 32.2388C28.6541 31.4819 30.2159 30.2002 31.3147 28.5557C32.4135 26.9112 33 24.9778 33 23C33 20.3478 31.9464 17.8043 30.0711 15.9289C28.1957 14.0536 25.6522 13 23 13ZM23 31.5714C21.3047 31.5714 19.6475 31.0687 18.238 30.1269C16.8284 29.185 15.7298 27.8464 15.081 26.2801C14.4323 24.7139 14.2625 22.9905 14.5933 21.3278C14.924 19.6651 15.7404 18.1378 16.9391 16.9391C18.1378 15.7403 19.6651 14.924 21.3278 14.5933C22.9905 14.2625 24.7139 14.4323 26.2801 15.081C27.8464 15.7298 29.185 16.8284 30.1269 18.238C31.0687 19.6475 31.5714 21.3047 31.5714 23C31.5714 25.2733 30.6684 27.4535 29.0609 29.0609C27.4535 30.6684 25.2733 31.5714 23 31.5714Z" fill="#FCFCFC" />
  </Svg>
);

const ExitoIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect width={46} height={46} rx={6} fill="#1777CF" />
    <G transform="translate(15.385,13) scale(1)">
      <Path d="M11.286 4.37973C11.2925 4.37269 11.2991 4.3657 11.3055 4.35871C11.7008 3.93355 11.3978 3.24219 10.8171 3.24219H4.41727C3.83656 3.24219 3.53359 3.93355 3.92875 4.35871L3.94832 4.37973C4.54254 5.015 6.77918 6.90234 6.80797 6.92703C7.27367 7.32645 7.96066 7.32645 8.42633 6.92703C8.45516 6.90231 10.6918 5.015 11.286 4.37973Z" fill="#FCFCFC" />
      <Path d="M10.669 9.41027C10.8552 9.24828 11.0682 9.06926 11.2937 8.87969C12.9568 7.48172 15.2344 5.56715 15.2344 3.55469V2.34375C15.2344 1.05141 14.183 0 12.8906 0H2.34375C1.05141 0 0 1.05141 0 2.34375V3.55469C0 5.56715 2.27762 7.48172 3.94066 8.87969C4.16613 9.06926 4.3791 9.24828 4.56531 9.41023C4.74227 9.56422 4.84375 9.77914 4.84375 10C4.84375 10.2209 4.74227 10.4358 4.56535 10.5897C4.37914 10.7517 4.16613 10.9307 3.94066 11.1203C2.27762 12.5183 0 14.4329 0 16.4453V17.6562C0 18.9486 1.05141 20 2.34375 20H12.8906C14.183 20 15.2344 18.9486 15.2344 17.6562C15.2344 17.2248 14.8846 16.875 14.4531 16.875C14.0216 16.875 13.6719 17.2248 13.6719 17.6562C13.6719 18.087 13.3214 18.4375 12.8906 18.4375H2.34375C1.91297 18.4375 1.5625 18.087 1.5625 17.6562V16.4453C1.5625 15.1606 3.68059 13.3802 4.94609 12.3163C5.17676 12.1224 5.39473 11.9392 5.5909 11.7685C6.1091 11.3177 6.40625 10.6731 6.40625 10C6.40625 9.32691 6.1091 8.68234 5.5909 8.23145C5.39469 8.06074 5.17676 7.87758 4.94609 7.68363C3.68059 6.61984 1.5625 4.83938 1.5625 3.55469V2.34375C1.5625 1.91297 1.91297 1.5625 2.34375 1.5625H12.8906C13.3214 1.5625 13.6719 1.91297 13.6719 2.34375V3.55469C13.6719 4.83938 11.5538 6.61984 10.2883 7.68367C10.0576 7.87758 9.83965 8.06078 9.64344 8.23152C9.12527 8.68234 8.82812 9.32695 8.82812 10C8.82812 10.6732 9.12527 11.3177 9.64348 11.7685C9.84797 11.9464 10.0758 12.1371 10.3171 12.3391C11.0771 12.9752 11.9386 13.6963 12.6185 14.4635C12.9046 14.7864 13.3984 14.8161 13.7213 14.53C14.0442 14.2438 14.074 13.75 13.7878 13.4271C13.0307 12.5729 12.0821 11.7789 11.32 11.1409C11.0846 10.9439 10.8623 10.7579 10.669 10.5897C10.4921 10.4358 10.3906 10.2209 10.3906 10C10.3906 9.77914 10.4921 9.56418 10.669 9.41027Z" fill="#FCFCFC" />
    </G>
  </Svg>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fixedHeader: {
    backgroundColor: Colors.background,
    zIndex: 10,
    height: HEADER_TOP_HEIGHT,
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: Colors.background,
    paddingTop: 18,
  },
  tabsBox: {
    height: 40,
    padding: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabBtn: {
    alignSelf: 'stretch',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: '#1777CF',
  },
  tabText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    
  },
  tabTextActive: {
    color: '#FCFCFC',
  },
  tabWCliente: { minWidth: 70 },
  tabWVenda: { minWidth: 56 },
  tabWGerenciar: { minWidth: 92 },
  tabWChat: { minWidth: 60 },
  tabBtnWithBadge: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 25,
    height: 25,
    borderRadius: 99,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  tabBadgeText: {
    color: '#1777CF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  // Container do conteúdo - define os limites verticais (piso e teto)
  contentContainer: {
    flex: 1,
    position: 'relative',
    ...Platform.select({
      web: {
        overflow: 'hidden',
      } as any,
      default: {},
    }),
  },
  // ScrollView - No web usa position absolute para ter altura definida
  scrollView: {
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      } as any,
      default: {
        flex: 1,
      },
    }),
  },
  scrollContent: {
    paddingTop: 1,
    paddingHorizontal: 15,
    paddingBottom: 0,
    gap: 15,
  },
  card: {
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.containerPadding,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    paddingLeft: 5,
  },
  saleDetailsWrapper: {
    gap: 15,
  },
  saleDetailsCard: {
    padding: Spacing.containerPadding,
    gap: 10,
  },
  saleDetailsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saleDetailsTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  saleDetailsDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  saleDetailsContentRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
  },
  saleDetailsImageWrap: {
    width: 80,
    alignSelf: 'stretch',
    minHeight: 80,
    backgroundColor: '#F4F4F4',
    overflow: 'hidden',
    flexShrink: 0,
    paddingTop: 3,
    paddingBottom: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleDetailsImage: {
    width: '100%',
    height: '100%',
    flex: 1,
    borderRadius: 8,
  },
  saleDetailsFields: {
    flex: 1,
    gap: 10,
  },
  prodServBlock: {
    alignSelf: 'stretch',
    gap: 10,
  },
  saleDetailsFieldGroup: {
    gap: 5,
  },
  saleDetailsLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  saleDetailsLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  saleDetailsValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  saleDetailsValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  saleDetailsThinDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  productValueCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: 'rgba(33,85,163,0.16)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  productValueIconBox: {
    width: 46,
    height: 46,
    borderRadius: 6,
    overflow: 'hidden',
  },
  productValueDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  productValueLabelRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productValueLabelText: {
    flex: 1,
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  productValueDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: 'rgba(33,85,163,0.16)',
    marginTop: 6,
    marginBottom: 6,
  },
  productValuePriceRow: {
    alignSelf: 'stretch',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  productValuePriceText: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsCol: {
    flex: 1,
    gap: 4,
  },
  detailsLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  detailsValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  detailsDivider: {
    width: 1,
    height: '100%',
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  valueText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  payBlock: {
    gap: 10,
  },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  payValue: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  payDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  discountBox: {
    borderWidth: 0.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: 10,
    gap: 8,
  },
  discountLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountPercent: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  discountCurrency: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  subDivider: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  discountDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  subCol: {
    flex: 1,
    gap: 6,
  },
  subTitle: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  subValue: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  subCurrency: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  subDividerVertical: {
    width: 0.5,
    backgroundColor: Colors.border,
  },
  installmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installmentsText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  installmentsSub: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  totalBlock: {
    gap: 8,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  totalLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalSubLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  totalRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  totalPercent: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  totalCurrency: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  actionsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  applyButton: {
    flex: 1,
    height: 40,
    paddingLeft: 14,
    paddingRight: 14,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonSmall: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  applyButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  discountModal: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    paddingTop: 8,
    paddingBottom: 8 ,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(23,119,207,0.20)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 8,
  },
  discountHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  discountPercentPill: {
    width: 90,
    height: 35,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: '#1777CFCC',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountPercentPillText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  percentInput: {
    width: '100%',
    textAlign: 'center',
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as any)
      : {}),
  },
  discountAmountBox: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: 'rgba(252,252,252,0.80)',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  discountAmountText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  discountSection: {
    alignSelf: 'stretch',
    padding: 8,
    backgroundColor: 'rgba(252,252,252,0.80)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 8,
  },
  sectionHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionHeaderText: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  sectionContent: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 5,
  },
  sectionLineRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    width: 75,
    textAlign: 'left',
    flexShrink: 0,
  },
  sectionLineRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-start',
  },
  sectionPercent: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    width: 65,
    flexShrink: 0,
  },
  sectionCurrency: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
    flex: 1,
  },
  sectionDividerBlue: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  pixModal: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  pixDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  pixHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pixHeaderText: {
    flex: 1,
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  pixValueRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pixValueText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  pixPercentBox: {
    width: 35,
    height: 35,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pixPercentText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  percentBoxActive: {
    backgroundColor: '#1777CF',
  },
  percentBoxInactive: {
    backgroundColor: '#F4F4F4',
  },
  percentTextActive: {
    color: '#FCFCFC',
  },
  percentTextInactive: {
    color: '#1777CF',
  },
  totalModal: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap: 5,
  },
  totalHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  totalHeaderText: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  totalDividerWrap: {
    alignSelf: 'stretch',
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  totalDividerLine: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
    width: '100%',
  },
  totalSection: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 5,
  },
  totalSectionLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  totalLineRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
  },
  totalLinePercent: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  totalLineCurrency: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  creditModal: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 5,
  },
  creditDetails: {
    flex: 1,
    flexDirection: 'column',
    gap: 5,
    alignItems: 'stretch',
    width: '100%',
  },
  creditHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    width: '100%',
  },
  creditLeftCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    alignSelf: 'stretch',
    width: '100%',
  },
  creditHeaderText: {
    flex: 1,
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  creditValueText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  creditPercentBox: {
    width: 35,
    height: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditPercentText: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  creditDividerWrap: {
    alignSelf: 'stretch',
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  creditDividerLine: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
    width: '100%',
  },
  creditInstallmentsText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  creditInstallmentsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prolaboreModal: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.10)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33,85,163,0.16)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  prolaboreIconBox: {
    width: 46,
    height: 46,
    borderRadius: 6,
    overflow: 'hidden',
  },
  prolaboreDetails: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 5,
  },
  prolaboreHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  prolaboreHeaderText: {
    flex: 1,
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  proToggleSquare: {
    width: 35,
    height: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  proToggleText: {
    color: '#1777CF',
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
  },
  prolaboreSectionDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: 'rgba(33,85,163,0.16)',
    marginVertical: 2,
  },
  prolaborePriceRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  prolaborePriceText: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  counterBox: {
    width: 45,
    height: 40,
    backgroundColor: Colors.accent,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  summaryBlock: {
    alignSelf: 'stretch',
    width: '100%',
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5,
    marginBottom:0,
  },
  summaryLabel: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  summaryLine: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  summaryDividerWrap: {
    alignSelf: 'stretch',
    paddingTop: 2,
    paddingBottom:2,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  summaryDividerLine: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  summaryItem: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  summaryRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryPercent: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  summaryCurrency: {
    color: Colors.textPrimary,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  overallTotalHeader: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.10)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33,85,163,0.16)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  overallTotalBox: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 30,
  },
  systemDiscountOuter: {
    alignSelf: 'stretch',
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(23,119,207,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 12,
  },
  systemHeaderRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  systemTitleText: {
    flex: 1,
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  systemFooterRow: {
    alignSelf: 'stretch',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  applyButtonLarge: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonLargeText: {
    textAlign: 'center',
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  summaryActions: {
    alignItems: 'flex-start',
  },
  bottomSpacer: {
    height: 0,
  },
});

export default DiscountSalesScreen;
