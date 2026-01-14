import React, { useState, useRef } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import Svg, { Path, Rect } from 'react-native-svg';
import { SalesContractViewer, downloadSalesContract } from './2.SalesContract';
import PaymentFlowCreditCardAwaitingApproval from './2.PaymentFlow-CreditCard-AwaitingApproval';
import PaymentFlowPixApproved from './2.PaymentFlow-Pix-Approved';
import PaymentFlowCreditCardError from './2.PaymentFlow-CreditCard-Error';

const ProductCover = require('../../../assets/00001.png');

type Nav = StackNavigationProp<RootStackParamList, 'PaymentFlowCreditCard'>;

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

const CardIcon21x18: React.FC = () => (
  <Svg width={21} height={18} viewBox="0 0 21 18" fill="none">
    <Path d="M0.5 5.5H20.5M4.5 13.5H6.5M9 13.5H13M4.94 0.5H16.05C19.61 0.5 20.5 1.38 20.5 4.89V13.1C20.5 16.61 19.61 17.49 16.06 17.49H4.94C1.39 17.5 0.5 16.62 0.5 13.11V4.89C0.5 1.38 1.39 0.5 4.94 0.5Z" stroke="#7D8592" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

type CardBrand = 'visa' | 'mastercard' | 'amex' | 'elo' | 'hipercard';

const toCardDigits = (value: string) => value.replace(/\D/g, '');

const isBetween = (value: number, min: number, max: number) => value >= min && value <= max;

const matchesAnyPrefixRange = (valueDigits: string, ranges: Array<[number, number]>, prefixLength: number) => {
  if (valueDigits.length < prefixLength) return false;
  const prefix = Number(valueDigits.slice(0, prefixLength));
  return ranges.some(([min, max]) => isBetween(prefix, min, max));
};

const detectCardBrand = (value: string): CardBrand | null => {
  const digits = toCardDigits(value);
  if (!digits) return null;

  if (digits.startsWith('4')) return 'visa';

  if (digits.length >= 2) {
    const prefix2 = Number(digits.slice(0, 2));
    if (isBetween(prefix2, 51, 55)) return 'mastercard';
  }

  if (digits.length >= 4) {
    const prefix4 = Number(digits.slice(0, 4));
    if (isBetween(prefix4, 2221, 2720)) return 'mastercard';
  }

  if (digits.startsWith('34') || digits.startsWith('37')) return 'amex';

  if (digits.startsWith('606282') || digits.startsWith('3841')) return 'hipercard';

  const eloRanges6: Array<[number, number]> = [
    [401178, 401179],
    [431274, 431274],
    [438935, 438935],
    [451416, 451416],
    [457393, 457393],
    [457631, 457632],
    [504175, 504175],
    [506699, 506778],
    [509000, 509999],
    [627780, 627780],
    [636297, 636297],
    [636368, 636368],
    [650031, 650033],
    [650035, 650051],
    [650405, 650439],
    [650485, 650538],
    [650541, 650598],
    [650700, 650718],
    [650720, 650727],
    [650901, 650978],
    [651652, 651679],
    [655000, 655019],
  ];

  if (matchesAnyPrefixRange(digits, eloRanges6, 6)) return 'elo';

  return null;
};

const CardBrandIcon: React.FC<{ brand: CardBrand }> = ({ brand }) => {
  const label = brand === 'mastercard' ? 'MC' : brand.toUpperCase();
  return (
    <View style={[styles.brandBadge, brand === 'visa' && styles.brandBadgeVisa, brand === 'mastercard' && styles.brandBadgeMastercard, brand === 'amex' && styles.brandBadgeAmex, brand === 'elo' && styles.brandBadgeElo, brand === 'hipercard' && styles.brandBadgeHipercard]}>
      <Text style={[styles.brandBadgeText, brand === 'visa' && styles.brandBadgeTextVisa, brand === 'mastercard' && styles.brandBadgeTextMastercard, brand === 'amex' && styles.brandBadgeTextAmex, brand === 'elo' && styles.brandBadgeTextElo, brand === 'hipercard' && styles.brandBadgeTextHipercard]}>
        {label}
      </Text>
    </View>
  );
};

type CreditCardFieldKey = 'number' | 'expiry' | 'cvv' | 'holder' | 'installments';

const isValidLuhn = (digits: string) => {
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let n = Number(digits.charAt(i));
    if (Number.isNaN(n)) return false;
    if (shouldDouble) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
};

const validateCardNumber = (value: string) => {
  const digits = toCardDigits(value);
  if (!digits) return 'Número do cartão é obrigatório.';
  if (digits.length < 13 || digits.length > 19) return 'Número do cartão inválido.';
  if (!isValidLuhn(digits)) return 'Número do cartão inválido.';
  return undefined;
};

const validateExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'Validade é obrigatória.';
  if (digits.length !== 4) return 'Validade inválida.';
  const mm = Number(digits.slice(0, 2));
  const yy = Number(digits.slice(2, 4));
  if (!Number.isFinite(mm) || !Number.isFinite(yy)) return 'Validade inválida.';
  if (mm < 1 || mm > 12) return 'Validade inválida.';

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const fullYear = 2000 + yy;
  if (fullYear < currentYear) return 'Cartão vencido.';
  if (fullYear === currentYear && mm < currentMonth) return 'Cartão vencido.';
  return undefined;
};

const validateCvv = (value: string, brand: CardBrand | null) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return 'CVV é obrigatório.';
  if (brand === 'amex') {
    if (digits.length !== 4) return 'CVV inválido.';
    return undefined;
  }
  if (digits.length !== 3) return 'CVV inválido.';
  return undefined;
};

const validateHolderName = (value: string) => {
  const cleaned = value.trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'Nome do titular é obrigatório.';
  const words = cleaned.split(' ').filter(Boolean);
  if (words.length < 2) return 'Informe o nome completo (mínimo duas palavras).';
  const hasLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]/.test(cleaned);
  if (!hasLetters) return 'Nome do titular inválido.';
  return undefined;
};

const validateInstallments = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return 'Parcelas são obrigatórias.';
  const looksLikeInstallments = /^\d+\s*x\s*de\s*R\$\s*[\d.,]+$/i.test(cleaned);
  if (!looksLikeInstallments) return 'Parcelas inválidas.';
  return undefined;
};

const PaymentFlowCreditCardScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [contractViewerVisible, setContractViewerVisible] = useState<boolean>(false);
  const [cvvTooltipVisible, setCvvTooltipVisible] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<'number' | 'expiry' | 'cvv' | 'holder' | null>(null);
  const [touched, setTouched] = useState<Record<CreditCardFieldKey, boolean>>({
    number: false,
    expiry: false,
    cvv: false,
    holder: false,
    installments: false,
  });
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvv, setCardCvv] = useState<string>('');
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [installments] = useState<string>('12 x de R$ 75,00');
  const cardBrand = detectCardBrand(cardNumber);
  const numberError = validateCardNumber(cardNumber);
  const expiryError = validateExpiry(cardExpiry);
  const cvvError = validateCvv(cardCvv, cardBrand);
  const holderError = validateHolderName(cardHolderName);
  const installmentsError = validateInstallments(installments);
  const isFormValid = !numberError && !expiryError && !cvvError && !holderError && !installmentsError;
  const [awaitingVisible, setAwaitingVisible] = useState<boolean>(false);
  const [approvedVisible, setApprovedVisible] = useState<boolean>(false);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [paymentAttempts, setPaymentAttempts] = useState<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paymentRunIdRef = useRef<number>(0);

  const formatCardNumber = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 19);
    return clean.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (digits: string) => {
    const clean = digits.replace(/\D/g, '').slice(0, 4);
    if (clean.length <= 2) return clean;
    return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  };

  const normalizeHolderName = (value: string) => {
    const noNumbers = value.replace(/\d+/g, '');
    const idx = noNumbers.search(/[A-Za-zÀ-ÖØ-öø-ÿ]/);
    if (idx < 0) return noNumbers;
    return `${noNumbers.slice(0, idx)}${noNumbers.charAt(idx).toUpperCase()}${noNumbers.slice(idx + 1)}`;
  };
  
  const clearPaymentTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const invalidatePaymentRun = () => {
    paymentRunIdRef.current += 1;
  };

  const handleAwaitingClose = () => {
    invalidatePaymentRun();
    clearPaymentTimer();
    setAwaitingVisible(false);
  };

  const handleApprovedClose = () => {
    invalidatePaymentRun();
    clearPaymentTimer();
    setApprovedVisible(false);
  };

  const handleErrorClose = () => {
    invalidatePaymentRun();
    clearPaymentTimer();
    setErrorVisible(false);
  };

  const handlePaymentPress = () => {
    if (!isFormValid) return;
    invalidatePaymentRun();
    const runId = paymentRunIdRef.current;

    clearPaymentTimer();
    setApprovedVisible(false);
    setErrorVisible(false);
    setAwaitingVisible(true);

    const nextModal = paymentAttempts === 0 ? 'approved' : 'error';
    if (paymentAttempts === 0) setPaymentAttempts(1);

    timerRef.current = setTimeout(() => {
      if (paymentRunIdRef.current !== runId) return;
      timerRef.current = null;
      setAwaitingVisible(false);
      if (nextModal === 'approved') setApprovedVisible(true);
      else setErrorVisible(true);
    }, 5000);
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
              <Text style={styles.sectionTitle}>Cartão de crédito</Text>
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

          <View style={styles.creditForm}>
            <View style={styles.creditFormFields}>
              <View style={[styles.fieldGroup, styles.firstFieldGroup]}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, numberError && touched.number ? styles.fieldLabelError : null]}>Número do cartão</Text>
                </View>
                <View style={[styles.fieldInput, focusedField === 'number' && styles.fieldInputFocused]}>
                  <TextInput
                    value={cardNumber}
                    onChangeText={(txt) => setCardNumber(formatCardNumber(txt))}
                    style={styles.fieldTextInput}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor="#91929E"
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    onFocus={() => setFocusedField('number')}
                    onBlur={() => {
                      setFocusedField((prev) => (prev === 'number' ? null : prev));
                      setTouched((prev) => ({ ...prev, number: true }));
                    }}
                  />
                  <View style={styles.cardNumberRightIcon}>
                    {cardBrand ? <CardBrandIcon brand={cardBrand} /> : <CardIcon21x18 />}
                  </View>
                </View>
                {numberError && touched.number ? <Text style={styles.fieldErrorText}>{numberError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, expiryError && touched.expiry ? styles.fieldLabelError : null]}>Validade</Text>
                </View>
                <View style={[styles.fieldInput, focusedField === 'expiry' && styles.fieldInputFocused]}>
                  <TextInput
                    value={cardExpiry}
                    onChangeText={(txt) => setCardExpiry(formatExpiry(txt))}
                    style={styles.fieldTextInput}
                    placeholder="MM/AA"
                    placeholderTextColor="#91929E"
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    maxLength={5}
                    onFocus={() => setFocusedField('expiry')}
                    onBlur={() => {
                      setFocusedField((prev) => (prev === 'expiry' ? null : prev));
                      setTouched((prev) => ({ ...prev, expiry: true }));
                    }}
                  />
                </View>
                {expiryError && touched.expiry ? <Text style={styles.fieldErrorText}>{expiryError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.cvvLabelRow}>
                  <Text style={[styles.fieldLabel, cvvError && touched.cvv ? styles.fieldLabelError : null]}>CVV</Text>
                  <TouchableOpacity
                    style={styles.cvvHelp}
                    activeOpacity={0.9}
                    onPress={() => setCvvTooltipVisible((v) => !v)}
                  >
                    <Text style={styles.cvvHelpText}>?</Text>
                  </TouchableOpacity>
                </View>
                {cvvTooltipVisible ? (
                  <View style={styles.cvvTooltip}>
                    <Text style={styles.cvvTooltipText}>
                      O CVV é o código de segurança do cartão. Geralmente são 3 dígitos (ou 4 no Amex) e fica no verso do cartão.
                    </Text>
                  </View>
                ) : null}
                <View style={[styles.fieldInput, focusedField === 'cvv' && styles.fieldInputFocused]}>
                  <TextInput
                    value={cardCvv}
                    onChangeText={(txt) => setCardCvv(txt.replace(/\D/g, '').slice(0, 4))}
                    style={styles.fieldTextInput}
                    placeholder="3 ou 4 dígitos"
                    placeholderTextColor="#91929E"
                    keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
                    maxLength={4}
                    onFocus={() => setFocusedField('cvv')}
                    onBlur={() => {
                      setFocusedField((prev) => (prev === 'cvv' ? null : prev));
                      setTouched((prev) => ({ ...prev, cvv: true }));
                    }}
                  />
                </View>
                {cvvError && touched.cvv ? <Text style={styles.fieldErrorText}>{cvvError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, holderError && touched.holder ? styles.fieldLabelError : null]}>Nome do títular</Text>
                </View>
                <View style={[styles.fieldInput, focusedField === 'holder' && styles.fieldInputFocused]}>
                  <TextInput
                    value={cardHolderName}
                    onChangeText={(txt) => setCardHolderName(normalizeHolderName(txt))}
                    style={styles.fieldTextInput}
                    placeholder="Digite o nome impresso no cartão"
                    placeholderTextColor="#91929E"
                    keyboardType="default"
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('holder')}
                    onBlur={() => {
                      setFocusedField((prev) => (prev === 'holder' ? null : prev));
                      setTouched((prev) => ({ ...prev, holder: true }));
                    }}
                  />
                </View>
                {holderError && touched.holder ? <Text style={styles.fieldErrorText}>{holderError}</Text> : null}
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.fieldLabelRow}>
                  <Text style={[styles.fieldLabel, installmentsError && touched.installments ? styles.fieldLabelError : null]}>Parcelas</Text>
                </View>
                <View style={styles.installmentsInput}>
                  <TextInput
                    value={installments}
                    style={styles.installmentsTextInput}
                    placeholder="12 x de R$ 75,00"
                    placeholderTextColor="#91929E"
                    editable={false}
                    caretHidden
                    selectTextOnFocus={false}
                    showSoftInputOnFocus={false}
                    onFocus={() => setTouched((prev) => ({ ...prev, installments: true }))}
                  />
                </View>
                {installmentsError && touched.installments ? <Text style={styles.fieldErrorText}>{installmentsError}</Text> : null}
              </View>
            </View>

            <View style={styles.payButtonRow}>
              <TouchableOpacity
                style={[styles.payButton, isFormValid ? styles.payButtonEnabled : null]}
                activeOpacity={0.9}
                disabled={!isFormValid}
                onPress={handlePaymentPress}
              >
                <Text style={styles.payButtonText}>Realizar pagamento</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <PaymentFlowCreditCardAwaitingApproval visible={awaitingVisible} onClose={handleAwaitingClose} />
        <PaymentFlowPixApproved visible={approvedVisible} onClose={handleApprovedClose} />
        <PaymentFlowCreditCardError visible={errorVisible} onClose={handleErrorClose} />
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
    flex: 1,
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
    transform: [{ translateX: 0 }, { translateY: 0 }, { scale: 1 }],
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
  creditForm: {
    alignSelf: 'stretch',
    paddingTop: 0,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 0,
    gap: 15,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  creditFormFields: {
    // Ajuste aplicado: espaçamento entre campos pode ser ajustado manualmente, se necessário.
    gap: 20,
  },
  firstFieldGroup: {
    // Ajuste aplicado: espaçamento até o início do formulário (20px) pode ser ajustado manualmente, se necessário.
    marginTop: 25,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabelRow: {
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 0,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  fieldLabel: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'none',
  },
  fieldLabelError: {
    color: '#D82B2B',
  },
  fieldInput: {
    alignSelf: 'stretch',
    // Ajuste aplicado: altura dos inputs pode ser ajustada manualmente, se necessário.
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  fieldInputFocused: {
    borderColor: '#1777CF',
  },
  fieldTextInput: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },
  fieldErrorText: {
    color: '#D82B2B',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    paddingLeft: 5,
  },
  cardNumberRightIcon: {
    height: 20,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  brandBadge: {
    height: 20,
    minWidth: 44,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.6,
  },
  brandBadgeVisa: {},
  brandBadgeMastercard: {},
  brandBadgeAmex: {},
  brandBadgeElo: {},
  brandBadgeHipercard: {},
  brandBadgeTextVisa: { color: '#1A1F71' },
  brandBadgeTextMastercard: { color: '#EB001B' },
  brandBadgeTextAmex: { color: '#0077A6' },
  brandBadgeTextElo: { color: '#111827' },
  brandBadgeTextHipercard: { color: '#C1253A' },
  cvvLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 0,
  },
  cvvHelp: {
    width: 18,
    height: 18,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#7D8592',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cvvHelpText: {
    textAlign: 'center',
    color: '#91929E',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  cvvTooltip: {
    alignSelf: 'stretch',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    padding: 10,
  },
  cvvTooltipText: {
    color: '#3A3F51',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  installmentsInput: {
    alignSelf: 'stretch',
    // Ajuste aplicado: altura dos inputs pode ser ajustada manualmente, se necessário.
    height: 40,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
  },
  installmentsInputFocused: {
    borderColor: '#1777CF',
  },
  installmentsTextInput: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
    outlineWidth: 0,
    outlineStyle: 'solid',
    outlineColor: 'transparent',
  },
  payButtonRow: {
    alignSelf: 'stretch',
    justifyContent: 'flex-end',
    alignItems: 'stretch',
    paddingBottom: 20,
    marginTop: 'auto',
  },
  payButton: {
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(23, 119, 207, 0.40)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(23, 119, 207, 0.40)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  payButtonEnabled: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  payButtonText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});

export default PaymentFlowCreditCardScreen;
