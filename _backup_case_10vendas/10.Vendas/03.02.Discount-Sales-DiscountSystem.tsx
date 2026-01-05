import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import Svg, { Path, Rect, G } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type DiscountData = {
  // Prolabore
  prolaboreTotal: number;
  prolaborePixValue: number;
  prolaborePixDiscountPercent: number;
  prolaborePixDiscountValue: number;
  prolaboreCreditValue: number;
  prolaboreCreditInstallments: string;
  prolaboreCreditInterest: number;
  prolaboreCreditDiscountPercent: number;
  prolaboreCreditDiscountValue: number;
  prolaboreBoletoValue: number;
  prolaboreBoletoInstallments: string;
  prolaboreBoletoInterest: number;
  prolaboreBoletoDiscountPercent: number;
  prolaboreBoletoDiscountValue: number;
  prolaboreTotalDiscountPercent: number;
  prolaboreTotalDiscountValue: number;
  // Êxito
  exitoTotal: number;
  exitoPixValue: number;
  exitoPixDiscountPercent: number;
  exitoPixDiscountValue: number;
  exitoCreditValue: number;
  exitoCreditInstallments: string;
  exitoCreditInterest: number;
  exitoCreditDiscountPercent: number;
  exitoCreditDiscountValue: number;
  exitoTotalDiscountPercent: number;
  exitoTotalDiscountValue: number;
  // Desconto total
  grandProlaboreDiscountPercent: number;
  grandProlaboreDiscountValue: number;
  grandExitoDiscountPercent: number;
  grandExitoDiscountValue: number;
  grandTotalDiscountPercent: number;
  grandTotalDiscountValue: number;
  // Valor do produto
  productValue: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
  data: DiscountData;
};

// ============================================================
// VALORES FICTÍCIOS PARA EXEMPLO DE CÁLCULO
// Prolabore: 3,5% (Pix 0,5% + Crédito 1,5% + Boleto 1,5%)
// Êxito: 2% (Pix 0,5% + Crédito 1,5%)
// Total: 5,5%
// ============================================================
export const EXEMPLO_DESCONTO = {
  // Prolabore - Total: R$ 50.000,00
  prolaborePixDiscountPercent: 0.5,        // 0,5%
  prolaborePixDiscountValue: 125,          // R$ 125,00
  prolaboreCreditDiscountPercent: 1.5,     // 1,5%
  prolaboreCreditDiscountValue: 225,       // R$ 225,00
  prolaboreBoletoDiscountPercent: 1.5,     // 1,5%
  prolaboreBoletoDiscountValue: 150,       // R$ 150,00
  prolaboreTotalDiscountPercent: 3.5,      // 3,5%
  prolaboreTotalDiscountValue: 500,        // R$ 500,00 (125 + 225 + 150)

  // Êxito - Total: R$ 70.000,00
  exitoPixDiscountPercent: 0.5,            // 0,5%
  exitoPixDiscountValue: 125,              // R$ 125,00
  exitoCreditDiscountPercent: 1.5,         // 1,5%
  exitoCreditDiscountValue: 675,           // R$ 675,00
  exitoTotalDiscountPercent: 2,            // 2%
  exitoTotalDiscountValue: 800,            // R$ 800,00 (125 + 675)

  // Desconto Total
  grandProlaboreDiscountPercent: 3.5,      // 3,5%
  grandProlaboreDiscountValue: 500,        // R$ 500,00
  grandExitoDiscountPercent: 2,            // 2%
  grandExitoDiscountValue: 800,            // R$ 800,00
  grandTotalDiscountPercent: 5.5,          // 5,5%
  grandTotalDiscountValue: 1300,           // R$ 1.300,00 (500 + 800)
};

// Ícone de fechar (X)
const CloseIcon: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path d="M25.155 13.2479C24.7959 12.9179 24.2339 12.9173 23.874 13.2466L19 17.7065L14.126 13.2466C13.7661 12.9173 13.2041 12.9179 12.845 13.2479L12.7916 13.297C12.4022 13.6549 12.4029 14.257 12.7931 14.614L17.5863 19L12.7931 23.386C12.4029 23.743 12.4022 24.3451 12.7916 24.703L12.845 24.7521C13.2041 25.0821 13.7661 25.0827 14.126 24.7534L19 20.2935L23.874 24.7534C24.2339 25.0827 24.7959 25.0821 25.155 24.7521L25.2084 24.703C25.5978 24.3451 25.5971 23.743 25.2069 23.386L20.4137 19L25.2069 14.614C25.5971 14.257 25.5978 13.6549 25.2084 13.297L25.155 13.2479Z" fill="#3A3F51" />
  </Svg>
);

// Ícone do produto (maleta)
const ProductIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect x={0.25} y={0.25} width={45.5} height={45.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path d="M33.3779 16.0836H31.2376H29.198H27.8398V14.6336C27.8398 13.7347 27.1152 13 26.2178 13H19.7774C18.8848 13 18.1554 13.7298 18.1554 14.6336V16.0836H16.7972H14.7576H12.6221C11.7247 16.0836 11 16.8134 11 17.7124V31.3664C11 32.2653 11.7247 33 12.6221 33H14.7624H16.802H29.198H31.2376H33.3779C34.2705 33 35 32.2702 35 31.3664V17.7124C34.9952 16.8134 34.2705 16.0836 33.3779 16.0836ZM18.6401 17.0503H27.3599H28.7181V32.0333H17.2771V17.0503H18.6401ZM19.12 14.6336C19.12 14.2663 19.4175 13.9667 19.7822 13.9667H26.2226C26.5873 13.9667 26.8848 14.2663 26.8848 14.6336V16.0836H19.12V14.6336ZM11.9598 31.3664V17.7124C11.9598 17.3451 12.2573 17.0454 12.6221 17.0454L16.7972 17.0503V24.798V32.0333L12.6221 32.0285C12.2573 32.0334 11.9598 31.7337 11.9598 31.3664ZM16.7972 32.0333V24.798V17.0503H16.3173V32.0333H16.7972ZM29.6779 32.0333V17.0503H29.198V32.0333H29.6779ZM34.0354 31.3664C34.0354 31.7337 33.7379 32.0333 33.3731 32.0333H29.198V17.0503H33.3731C33.7379 17.0503 34.0354 17.3499 34.0354 17.7173V31.3664Z" fill="#3A3F51" />
  </Svg>
);

// Ícone Prolabore (cifrão)
const ProlaboreIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect width={46} height={46} rx={6} fill="#1777CF" />
    <Path d="M23 18.7143C23.5198 18.6724 24.0353 18.8359 24.4359 19.1697C24.8365 19.5036 25.0903 19.9812 25.1429 20.5C25.1429 20.6894 25.2181 20.8711 25.3521 21.0051C25.486 21.139 25.6677 21.2143 25.8571 21.2143C26.0466 21.2143 26.2283 21.139 26.3622 21.0051C26.4962 20.8711 26.5714 20.6894 26.5714 20.5C26.5375 19.7241 26.2333 18.9845 25.7115 18.4092C25.1897 17.834 24.4832 17.4593 23.7143 17.35V16.5714C23.7143 16.382 23.639 16.2003 23.5051 16.0664C23.3711 15.9324 23.1894 15.8571 23 15.8571C22.8106 15.8571 22.6289 15.9324 22.4949 16.0664C22.361 16.2003 22.2857 16.382 22.2857 16.5714V17.35C21.5168 17.4593 20.8103 17.834 20.2885 18.4092C19.7667 18.9845 19.4625 19.7241 19.4286 20.5C19.4286 22.7 21.9643 23.4429 22.8 23.6857C25.0429 24.3429 25.1429 24.7357 25.1429 25.5C25.0903 26.0188 24.8365 26.4964 24.4359 26.8303C24.0353 27.1641 23.5198 27.3276 23 27.2857C22.4802 27.3276 21.9647 27.1641 21.5641 26.8303C21.1635 26.4964 20.9097 26.0188 20.8571 25.5C20.8571 25.3106 20.7819 25.1289 20.6479 24.9949C20.514 24.861 20.3323 24.7857 20.1429 24.7857C19.9534 24.7857 19.7717 24.861 19.6378 24.9949C19.5038 25.1289 19.4286 25.3106 19.4286 25.5C19.4625 26.2759 19.7667 27.0155 20.2885 27.5908C20.8103 28.166 21.5168 28.5407 22.2857 28.65V29.4286C22.2857 29.618 22.361 29.7997 22.4949 29.9336C22.6289 30.0676 22.8106 30.1429 23 30.1429C23.1894 30.1429 23.3711 30.0676 23.5051 29.9336C23.639 29.7997 23.7143 29.618 23.7143 29.4286V28.65C24.4832 28.5407 25.1897 28.166 25.7115 27.5908C26.2333 27.0155 26.5375 26.2759 26.5714 25.5C26.5714 23.4571 25.1429 22.8714 23.2 22.2857C21.1 21.7 20.8571 20.9857 20.8571 20.5C20.9097 19.9812 21.1635 19.5036 21.5641 19.1697C21.9647 18.8359 22.4802 18.6724 23 18.7143Z" fill="#FCFCFC" />
    <Path d="M23 13C21.0222 13 19.0888 13.5865 17.4443 14.6853C15.7998 15.7841 14.5181 17.3459 13.7612 19.1732C13.0043 21.0004 12.8063 23.0111 13.1922 24.9509C13.578 26.8907 14.5304 28.6725 15.9289 30.0711C17.3275 31.4696 19.1093 32.422 21.0491 32.8078C22.9889 33.1937 24.9996 32.9957 26.8268 32.2388C28.6541 31.4819 30.2159 30.2002 31.3147 28.5557C32.4135 26.9112 33 24.9778 33 23C33 20.3478 31.9464 17.8043 30.0711 15.9289C28.1957 14.0536 25.6522 13 23 13ZM23 31.5714C21.3047 31.5714 19.6475 31.0687 18.238 30.1269C16.8284 29.185 15.7298 27.8464 15.081 26.2801C14.4323 24.7139 14.2625 22.9905 14.5933 21.3278C14.924 19.6651 15.7404 18.1378 16.9391 16.9391C18.1378 15.7403 19.6651 14.924 21.3278 14.5933C22.9905 14.2625 24.7139 14.4323 26.2801 15.081C27.8464 15.7298 29.185 16.8284 30.1269 18.238C31.0687 19.6475 31.5714 21.3047 31.5714 23C31.5714 25.2733 30.6684 27.4535 29.0609 29.0609C27.4535 30.6684 25.2733 31.5714 23 31.5714Z" fill="#FCFCFC" />
  </Svg>
);

// Ícone Êxito (ampulheta)
const ExitoIcon: React.FC = () => (
  <Svg width={46} height={46} viewBox="0 0 46 46" fill="none">
    <Rect width={46} height={46} rx={6} fill="#1777CF" />
    <G transform="translate(15.385,13) scale(1)">
      <Path d="M11.286 4.37973C11.2925 4.37269 11.2991 4.3657 11.3055 4.35871C11.7008 3.93355 11.3978 3.24219 10.8171 3.24219H4.41727C3.83656 3.24219 3.53359 3.93355 3.92875 4.35871L3.94832 4.37973C4.54254 5.015 6.77918 6.90234 6.80797 6.92703C7.27367 7.32645 7.96066 7.32645 8.42633 6.92703C8.45516 6.90231 10.6918 5.015 11.286 4.37973Z" fill="#FCFCFC" />
      <Path d="M10.669 9.41027C10.8552 9.24828 11.0682 9.06926 11.2937 8.87969C12.9568 7.48172 15.2344 5.56715 15.2344 3.55469V2.34375C15.2344 1.05141 14.183 0 12.8906 0H2.34375C1.05141 0 0 1.05141 0 2.34375V3.55469C0 5.56715 2.27762 7.48172 3.94066 8.87969C4.16613 9.06926 4.3791 9.24828 4.56531 9.41023C4.74227 9.56422 4.84375 9.77914 4.84375 10C4.84375 10.2209 4.74227 10.4358 4.56535 10.5897C4.37914 10.7517 4.16613 10.9307 3.94066 11.1203C2.27762 12.5183 0 14.4329 0 16.4453V17.6562C0 18.9486 1.05141 20 2.34375 20H12.8906C14.183 20 15.2344 18.9486 15.2344 17.6562C15.2344 17.2248 14.8846 16.875 14.4531 16.875C14.0216 16.875 13.6719 17.2248 13.6719 17.6562C13.6719 18.087 13.3214 18.4375 12.8906 18.4375H2.34375C1.91297 18.4375 1.5625 18.087 1.5625 17.6562V16.4453C1.5625 15.1606 3.68059 13.3802 4.94609 12.3163C5.17676 12.1224 5.39473 11.9392 5.5909 11.7685C6.1091 11.3177 6.40625 10.6731 6.40625 10C6.40625 9.32691 6.1091 8.68234 5.5909 8.23145C5.39469 8.06074 5.17676 7.87758 4.94609 7.68363C3.68059 6.61984 1.5625 4.83938 1.5625 3.55469V2.34375C1.5625 1.91297 1.91297 1.5625 2.34375 1.5625H12.8906C13.3214 1.5625 13.6719 1.91297 13.6719 2.34375V3.55469C13.6719 4.83938 11.5538 6.61984 10.2883 7.68367C10.0576 7.87758 9.83965 8.06078 9.64344 8.23152C9.12527 8.68234 8.82812 9.32695 8.82812 10C8.82812 10.6732 9.12527 11.3177 9.64348 11.7685C9.84797 11.9464 10.0758 12.1371 10.3171 12.3391C11.0771 12.9752 11.9386 13.6963 12.6185 14.4635C12.9046 14.7864 13.3984 14.8161 13.7213 14.53C14.0442 14.2438 14.074 13.75 13.7878 13.4271C13.0307 12.5729 12.0821 11.7789 11.32 11.1409C11.0846 10.9439 10.8623 10.7579 10.669 10.5897C10.4921 10.4358 10.3906 10.2209 10.3906 10C10.3906 9.77914 10.4921 9.56418 10.669 9.41027Z" fill="#FCFCFC" />
    </G>
  </Svg>
);

// Funções de formatação
const formatBRL = (value: number): string => {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const int = Math.floor(abs);
  const frac = Math.round((abs - int) * 100);
  const intStr = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const fracStr = frac.toString().padStart(2, '0');
  return `R$ ${sign}${intStr},${fracStr}`;
};

const formatPercent = (value: number): string => {
  const rounded = Math.round(value * 100) / 100;
  const s = rounded.toFixed(rounded % 1 === 0 ? 0 : 2).replace('.', ',');
  return `${s}%`;
};

const formatPercentUpTo6 = (value: number): string => {
  const rounded = Math.round(value * 1000000) / 1000000;
  let s = rounded.toFixed(6).replace('.', ',');
  s = s.replace(/,?0+$/, '');
  return `${s}%`;
};

const DiscountSystemModal: React.FC<Props> = ({ visible, onClose, onApply, data }) => {
  const [prolaboreExpanded, setProlaboreExpanded] = React.useState<boolean>(false);
  const [exitoExpanded, setExitoExpanded] = React.useState<boolean>(false);

  const prolaborePixDiscountValue = (data.prolaborePixValue * data.prolaborePixDiscountPercent) / 100;
  const prolaboreCreditDiscountValue = (data.prolaboreCreditValue * data.prolaboreCreditDiscountPercent) / 100;
  const prolaboreBoletoDiscountValue = (data.prolaboreBoletoValue * data.prolaboreBoletoDiscountPercent) / 100;
  const prolaboreTotalDiscountValue = prolaborePixDiscountValue + prolaboreCreditDiscountValue + prolaboreBoletoDiscountValue;
  const prolaboreTotalDiscountPercent = data.prolaboreTotal > 0 ? (prolaboreTotalDiscountValue / data.prolaboreTotal) * 100 : 0;

  const exitoPixDiscountValue = (data.exitoPixValue * data.exitoPixDiscountPercent) / 100;
  const exitoCreditDiscountValue = (data.exitoCreditValue * data.exitoCreditDiscountPercent) / 100;
  const exitoTotalDiscountValue = exitoPixDiscountValue + exitoCreditDiscountValue;
  const exitoTotalDiscountPercent = data.exitoTotal > 0 ? (exitoTotalDiscountValue / data.exitoTotal) * 100 : 0;

  const grandProlaboreDiscountValue = prolaboreTotalDiscountValue;
  const grandProlaboreDiscountPercent = prolaboreTotalDiscountPercent;
  const grandExitoDiscountValue = exitoTotalDiscountValue;
  const grandExitoDiscountPercent = exitoTotalDiscountPercent;
  const grandTotalDiscountValue = grandProlaboreDiscountValue + grandExitoDiscountValue;
  const grandTotalDiscountPercent = data.productValue > 0 ? (grandTotalDiscountValue / data.productValue) * 100 : 0;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Desconto / Sistema</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar modal"
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Área com scroll */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={Platform.OS === 'ios'}
          >
            {/* Card - Valor do produto */}
            <View style={styles.productValueCard}>
              <View style={styles.productIconBox}>
                <ProductIcon />
              </View>
              <View style={styles.productValueDetails}>
                <Text style={styles.productValueLabel}>Valor do produto</Text>
                <View style={styles.thinDivider} />
                <Text style={styles.productValueText}>{formatBRL(data.productValue)}</Text>
              </View>
            </View>

            {/* Card - Forma de pagamento */}
            <View style={styles.paymentCard}>
              <Text style={styles.paymentCardTitle}>Forma de pagamento</Text>
              <View style={styles.cardDivider} />

              {/* Container interno com flex para alinhar Prolabore/Êxito no topo e Desconto total no final */}
              <View style={styles.paymentCardInner}>
                {/* Seções superiores (Prolabore e Êxito) */}
                <View style={styles.topSections}>
                  {/* Prolabore Header */}
                  <View style={styles.sectionHeader}>
                    <ProlaboreIcon />
                    <View style={styles.sectionHeaderDetails}>
                      <Text style={styles.sectionHeaderTitle}>Prolabore</Text>
                      <View style={styles.sectionHeaderDivider} />
                      <Text style={styles.sectionHeaderValue}>{formatBRL(data.prolaboreTotal)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setProlaboreExpanded((v) => !v)}
                      accessibilityRole="button"
                      accessibilityLabel="Expandir/ocultar Prolabore"
                    >
                      <Text style={styles.toggleButtonText}>{prolaboreExpanded ? '-' : '+'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Prolabore Content */}
                  {prolaboreExpanded && (
                    <>
                      {/* Pix */}
                      <View style={styles.paymentItemCard}>
                        <Text style={styles.paymentItemTitle}>Pix</Text>
                        <Text style={styles.paymentItemValue}>{formatBRL(data.prolaborePixValue)}</Text>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercent(data.prolaborePixDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(prolaborePixDiscountValue)}</Text>
                        </View>
                      </View>

                      {/* Crédito */}
                      <View style={styles.paymentItemCard}>
                        <Text style={styles.paymentItemTitle}>Crédito</Text>
                        <Text style={styles.paymentItemValue}>{formatBRL(data.prolaboreCreditValue)}</Text>
                        <View style={styles.itemDivider} />
                        <View style={styles.installmentsRow}>
                          <Text style={styles.installmentsText}>{data.prolaboreCreditInstallments}</Text>
                          <Text style={styles.interestText}>Juros: {formatBRL(data.prolaboreCreditInterest)}</Text>
                        </View>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercent(data.prolaboreCreditDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(prolaboreCreditDiscountValue)}</Text>
                        </View>
                      </View>

                      {/* Boleto */}
                      <View style={styles.paymentItemCard}>
                        <Text style={styles.paymentItemTitle}>Boleto</Text>
                        <Text style={styles.paymentItemValue}>{formatBRL(data.prolaboreBoletoValue)}</Text>
                        <View style={styles.itemDivider} />
                        <View style={styles.installmentsRow}>
                          <Text style={styles.installmentsText}>{data.prolaboreBoletoInstallments}</Text>
                          <Text style={styles.interestText}>Juros: {formatBRL(data.prolaboreBoletoInterest)}</Text>
                        </View>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercent(data.prolaboreBoletoDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(prolaboreBoletoDiscountValue)}</Text>
                        </View>
                      </View>

                      {/* Total Prolabore */}
                      <View style={styles.totalItemCard}>
                        <Text style={styles.totalItemTitle}>Total</Text>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercentUpTo6(prolaboreTotalDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(prolaboreTotalDiscountValue)}</Text>
                        </View>
                      </View>
                    </>
                  )}

                  {/* Êxito Header */}
                  <View style={styles.sectionHeader}>
                    <ExitoIcon />
                    <View style={styles.sectionHeaderDetails}>
                      <Text style={styles.sectionHeaderTitle}>Êxito</Text>
                      <View style={styles.sectionHeaderDivider} />
                      <Text style={styles.sectionHeaderValue}>{formatBRL(data.exitoTotal)}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.toggleButton}
                      onPress={() => setExitoExpanded((v) => !v)}
                      accessibilityRole="button"
                      accessibilityLabel="Expandir/ocultar Êxito"
                    >
                      <Text style={styles.toggleButtonText}>{exitoExpanded ? '-' : '+'}</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Êxito Content */}
                  {exitoExpanded && (
                    <>
                      {/* Pix */}
                      <View style={styles.paymentItemCard}>
                        <Text style={styles.paymentItemTitle}>Pix</Text>
                        <Text style={styles.paymentItemValue}>{formatBRL(data.exitoPixValue)}</Text>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercent(data.exitoPixDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(exitoPixDiscountValue)}</Text>
                        </View>
                      </View>

                      {/* Crédito */}
                      <View style={styles.paymentItemCard}>
                        <Text style={styles.paymentItemTitle}>Crédito</Text>
                        <Text style={styles.paymentItemValue}>{formatBRL(data.exitoCreditValue)}</Text>
                        <View style={styles.itemDivider} />
                        <View style={styles.installmentsRow}>
                          <Text style={styles.installmentsText}>{data.exitoCreditInstallments}</Text>
                          <Text style={styles.interestText}>Juros: {formatBRL(data.exitoCreditInterest)}</Text>
                        </View>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercent(data.exitoCreditDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(exitoCreditDiscountValue)}</Text>
                        </View>
                      </View>

                      {/* Total Êxito */}
                      <View style={styles.totalItemCard}>
                        <Text style={styles.totalItemTitle}>Total</Text>
                        <View style={styles.itemDivider} />
                        <Text style={styles.discountLabel}>Desconto</Text>
                        <View style={styles.discountRow}>
                          <Text style={styles.discountPercent}>{formatPercentUpTo6(exitoTotalDiscountPercent)}</Text>
                          <Text style={styles.discountValue}>{formatBRL(exitoTotalDiscountValue)}</Text>
                        </View>
                      </View>
                    </>
                  )}
                </View>

                {/* Desconto total - Dividido em dois containers */}
                <View style={styles.grandTotalWrapper}>
                  {/* Container superior - Título */}
                  <View style={styles.grandTotalHeader}>
                    <Text style={styles.grandTotalTitle}>Desconto total</Text>
                  </View>

                  {/* Container inferior - Linhas de informação */}
                  <View style={styles.grandTotalContent}>
                    <View style={styles.grandTotalRow}>
                      <View style={styles.grandTotalLabelContainer}>
                        <Text style={styles.grandTotalLabel}>Pró-labore</Text>
                      </View>
                      <View style={styles.grandTotalSubRow}>
                        <View style={styles.grandTotalPercentContainerLeft}>
                          <Text style={styles.grandTotalPercentLeft}>{formatPercentUpTo6(grandProlaboreDiscountPercent)}</Text>
                        </View>
                        <View style={styles.grandTotalValueContainer}>
                          <Text style={styles.grandTotalValue}>{formatBRL(grandProlaboreDiscountValue)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Divisor */}
                    <View style={styles.grandTotalDividerWrap}>
                      <View style={styles.grandTotalDividerLine} />
                    </View>

                    <View style={styles.grandTotalRow}>
                      <View style={styles.grandTotalLabelContainer}>
                        <Text style={styles.grandTotalLabel}>Êxito</Text>
                      </View>
                      <View style={styles.grandTotalSubRow}>
                        <View style={styles.grandTotalPercentContainerLeft}>
                          <Text style={styles.grandTotalPercentLeft}>{formatPercentUpTo6(grandExitoDiscountPercent)}</Text>
                        </View>
                        <View style={styles.grandTotalValueContainer}>
                          <Text style={styles.grandTotalValue}>{formatBRL(grandExitoDiscountValue)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Divisor */}
                    <View style={styles.grandTotalDividerWrap}>
                      <View style={styles.grandTotalDividerLine} />
                    </View>

                    <View style={styles.grandTotalRow}>
                      <View style={styles.grandTotalLabelContainer}>
                        <Text style={styles.grandTotalLabel}>Total</Text>
                      </View>
                      <View style={styles.grandTotalSubRow}>
                        <View style={styles.grandTotalPercentContainerLeft}>
                          <Text style={styles.grandTotalPercentLeft}>{formatPercentUpTo6(grandTotalDiscountPercent)}</Text>
                        </View>
                        <View style={styles.grandTotalValueContainer}>
                          <Text style={styles.grandTotalValue}>{formatBRL(grandTotalDiscountValue)}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Botão Aplicar desconto - FIXO na parte inferior */}
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={onApply}
              accessibilityRole="button"
              accessibilityLabel="Aplicar desconto"
            >
              <Text style={styles.applyButtonText}>Aplicar desconto</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalContainer: {
    width: SCREEN_WIDTH - 20,
    maxWidth: SCREEN_WIDTH - 20,
    height: SCREEN_HEIGHT - 20,
    maxHeight: SCREEN_HEIGHT - 20,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#FCFCFC',
  },
  headerTitle: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    paddingLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    gap: 15,
    flexGrow: 1,
  },
  productValueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33, 85, 163, 0.16)',
    backgroundColor: '#1777CF08',
    gap: 10,
  },
  productIconBox: {
    width: 46,
    height: 46,
    borderRadius: 6,
    backgroundColor: '#1777CF08',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productValueDetails: {
    flex: 1,
    gap: 5,

  },
  productValueLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  thinDivider: {
    height: 0.5,
    backgroundColor: 'rgba(33, 85, 163, 0.16)',
  },
  productValueText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  paymentCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 10,
  },
  paymentCardTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 5,
  },
  cardDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginTop: 5,
    marginBottom: 5,
  },
  paymentCardInner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSections: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.10)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33, 85, 163, 0.16)',
    gap: 10,
  },
  sectionHeaderDetails: {
    flex: 1,
    gap: 5,
  },
  sectionHeaderTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  sectionHeaderDivider: {
    height: 0.5,
    backgroundColor: 'rgba(33, 85, 163, 0.16)',
  },
  sectionHeaderValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  toggleButton: {
    width: 35,
    height: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#1777CF',
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  paymentItemCard: {
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap: 10,
  },
  paymentItemTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  paymentItemValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  itemDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginVertical: 5,
  },
  installmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installmentsText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  interestText: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  discountLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  discountPercent: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  discountValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  totalItemCard: {
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap: 5,
  },
  totalItemTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // Desconto Total - Wrapper
  grandTotalWrapper: {
    gap: 10,
    marginTop: 10,
  },
  // Desconto Total - Header (título)
  grandTotalHeader: {
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.10)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33, 85, 163, 0.16)',
  },
  grandTotalTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  // Desconto Total - Content (linhas)
  grandTotalContent: {
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 15,
  },
  grandTotalRow: {
    flexDirection: 'column',
  },
  grandTotalLabelContainer: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  grandTotalLabel: {
    flex: 1,
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  grandTotalSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  grandTotalPercentContainerLeft: {
    width: 65,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  grandTotalPercentLeft: {
    textAlign: 'left',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  grandTotalPercentContainer: {
    width: 65,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  grandTotalPercent: {
    textAlign: 'right',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  grandTotalValueContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  grandTotalValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  grandTotalDividerWrap: {
    paddingTop: 1,
    paddingBottom: 1,
  },
  grandTotalDividerLine: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  footerButtonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 15,
    backgroundColor: '#FCFCFC',
    borderTopWidth: 0,
  },
  applyButton: {
    height: 40,
    paddingHorizontal: 14,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    textAlign: 'center',
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});

export default DiscountSystemModal;
