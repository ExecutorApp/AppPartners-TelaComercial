// ===== BLOCO: IMPORTS =====
import React, { useCallback, useState } from 'react';
import { Alert, Image, Linking, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

// ===== BLOCO: ASSETS =====
const Logo = require('../../../assets/07 - Foto.png');
const ResponsibleImage = require('../../../assets/01-Foto.png');

// ===== BLOCO: ÍCONES =====
// Ícone: Badge do WhatsApp com borda verde
const WhatsAppBadgeIcon: React.FC = () => (
  <View style={styles.whatsappIconContainer}>
    <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
      <Rect width={40} height={40} rx={12} fill="#ECFDF5" />
      <Rect
        x={0.25}
        y={0.25}
        width={39.5}
        height={39.5}
        rx={11.75}
        stroke="#1B883C"
        strokeOpacity={0.3}
        strokeWidth={0.5}
      />
      <Path
        d="M24.9031 15.0344C23.5938 13.7219 21.85 13 19.9969 13C16.1719 13 13.0594 16.1125 13.0594 19.9375C13.0594 21.1594 13.3781 22.3531 13.9844 23.4062L13 27L16.6781 26.0344C17.6906 26.5875 18.8313 26.8781 19.9938 26.8781H19.9969C23.8188 26.8781 27 23.7656 27 19.9406C27 18.0875 26.2125 16.3469 24.9031 15.0344ZM19.9969 25.7094C18.9594 25.7094 17.9437 25.4312 17.0594 24.9062L16.85 24.7812L14.6688 25.3531L15.25 23.225L15.1125 23.0063C14.5344 22.0875 14.2313 21.0281 14.2313 19.9375C14.2313 16.7594 16.8187 14.1719 20 14.1719C21.5406 14.1719 22.9875 14.7719 24.075 15.8625C25.1625 16.9531 25.8313 18.4 25.8281 19.9406C25.8281 23.1219 23.175 25.7094 19.9969 25.7094ZM23.1594 21.3906C22.9875 21.3031 22.1344 20.8844 21.975 20.8281C21.8156 20.7688 21.7 20.7406 21.5844 20.9156C21.4688 21.0906 21.1375 21.4781 21.0344 21.5969C20.9344 21.7125 20.8313 21.7281 20.6594 21.6406C19.6406 21.1313 18.9719 20.7312 18.3 19.5781C18.1219 19.2719 18.4781 19.2937 18.8094 18.6312C18.8656 18.5156 18.8375 18.4156 18.7937 18.3281C18.75 18.2406 18.4031 17.3875 18.2594 17.0406C18.1188 16.7031 17.975 16.75 17.8688 16.7438C17.7688 16.7375 17.6531 16.7375 17.5375 16.7375C17.4219 16.7375 17.2344 16.7812 17.075 16.9531C16.9156 17.1281 16.4688 17.5469 16.4688 18.4C16.4688 19.2531 17.0906 20.0781 17.175 20.1937C17.2625 20.3094 18.3969 22.0594 20.1375 22.8125C21.2375 23.2875 21.6687 23.3281 22.2188 23.2469C22.5531 23.1969 23.2437 22.8281 23.3875 22.4219C23.5312 22.0156 23.5312 21.6687 23.4875 21.5969C23.4469 21.5188 23.3313 21.475 23.1594 21.3906Z"
        fill="#059669"
      />
    </Svg>
  </View>
);

// Ícone: Chat branco (botão)
const ChatWhiteIcon: React.FC = () => (
  <Svg width={22} height={14} viewBox="0 0 22 14" fill="none">
    <Path
      d="M11.9031 2.03438C10.5938 0.721875 8.85 0 6.99688 0C3.17188 0 0.059375 3.1125 0.059375 6.9375C0.059375 8.15938 0.378125 9.35313 0.984375 10.4062L0 14L3.67813 13.0344C4.69063 13.5875 5.83125 13.8781 6.99375 13.8781H6.99688C10.8188 13.8781 14 10.7656 14 6.94063C14 5.0875 13.2125 3.34688 11.9031 2.03438ZM6.99688 12.7094C5.95938 12.7094 4.94375 12.4313 4.05938 11.9062L3.85 11.7812L1.66875 12.3531L2.25 10.225L2.1125 10.0063C1.53438 9.0875 1.23125 8.02812 1.23125 6.9375C1.23125 3.75938 3.81875 1.17188 7 1.17188C8.54063 1.17188 9.9875 1.77187 11.075 2.8625C12.1625 3.95312 12.8313 5.4 12.8281 6.94063C12.8281 10.1219 10.175 12.7094 6.99688 12.7094ZM10.1594 8.39062C9.9875 8.30313 9.13437 7.88438 8.975 7.82812C8.81563 7.76875 8.7 7.74063 8.58438 7.91563C8.46875 8.09063 8.1375 8.47813 8.03438 8.59688C7.93438 8.7125 7.83125 8.72813 7.65938 8.64062C6.64062 8.13125 5.97188 7.73125 5.3 6.57812C5.12187 6.27188 5.47813 6.29375 5.80938 5.63125C5.86563 5.51562 5.8375 5.41563 5.79375 5.32812C5.75 5.24063 5.40313 4.3875 5.25938 4.04063C5.11875 3.70312 4.975 3.75 4.86875 3.74375C4.76875 3.7375 4.65313 3.7375 4.5375 3.7375C4.42188 3.7375 4.23438 3.78125 4.075 3.95312C3.91563 4.12813 3.46875 4.54688 3.46875 5.4C3.46875 6.25313 4.09062 7.07812 4.175 7.19375C4.2625 7.30937 5.39688 9.05937 7.1375 9.8125C8.2375 10.2875 8.66875 10.3281 9.21875 10.2469C9.55313 10.1969 10.2438 9.82812 10.3875 9.42188C10.5312 9.01562 10.5312 8.66875 10.4875 8.59688C10.4469 8.51875 10.3313 8.475 10.1594 8.39062Z"
      fill="white"
    />
  </Svg>
);

// Ícone: Seta à direita branca (CTA)
const ArrowRightWhiteIcon: React.FC = () => (
  <Svg width={14} height={12} viewBox="0 0 14 12" fill="none">
    <Path
      d="M13.7063 6.70859C14.0969 6.31797 14.0969 5.68359 13.7063 5.29297L8.70625 0.292969C8.31563 -0.0976562 7.68125 -0.0976562 7.29063 0.292969C6.9 0.683594 6.9 1.31797 7.29063 1.70859L10.5875 5.00234H1C0.446875 5.00234 0 5.44922 0 6.00234C0 6.55547 0.446875 7.00234 1 7.00234H10.5844L7.29375 10.2961C6.90312 10.6867 6.90312 11.3211 7.29375 11.7117C7.68437 12.1023 8.31875 12.1023 8.70938 11.7117L13.7094 6.71172L13.7063 6.70859Z"
      fill="white"
    />
  </Svg>
);

// Ícone: Escudo dourado (segurança)
const ShieldIcon: React.FC = () => (
  <Svg width={20} height={12} viewBox="0 0 20 12" fill="none">
    <Path
      d="M5.62501 0C5.73282 0 5.84064 0.0234375 5.93907 0.0679687L10.3524 1.94062C10.868 2.15859 11.2524 2.66719 11.25 3.28125C11.2383 5.60625 10.282 9.86016 6.24376 11.7937C5.85235 11.9812 5.39767 11.9812 5.00626 11.7937C0.967979 9.86016 0.0117294 5.60625 1.06605e-05 3.28125C-0.00233309 2.66719 0.382042 2.15859 0.897667 1.94062L5.31329 0.0679687C5.40939 0.0234375 5.5172 0 5.62501 0ZM5.62501 1.56562V10.425C8.85939 8.85938 9.72892 5.39297 9.75001 3.31406L5.62501 1.56562Z"
      fill="#C9A961"
    />
  </Svg>
);

// ===== BLOCO: CONSTANTES =====
const WHATSAPP_NUMBER = '+5517992460986';

// ===== BLOCO: TELA =====
export const HomeScreenPaymentFlow: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'credit' | 'boleto' | 'ted'>('pix');
  // Ação: Abrir WhatsApp (app) com fallback para web
  const handleWhatsAppPress = useCallback(async () => {
    const message = encodeURIComponent('Olá!');
    const appUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    try {
      const canOpen = await Linking.canOpenURL(appUrl);
      if (canOpen) {
        await Linking.openURL(appUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {
      await Linking.openURL(webUrl);
    }
  }, []);

  const handleStartPayment = useCallback(() => {
    if (selectedPaymentMethod === 'pix') {
      navigation.navigate(ScreenNames.PaymentFlowPix);
      return;
    }
    if (selectedPaymentMethod === 'credit') {
      navigation.navigate(ScreenNames.PaymentFlowCreditCard);
      return;
    }
    if (selectedPaymentMethod === 'boleto') {
      navigation.navigate(ScreenNames.PaymentFlowBankSlip);
      return;
    }
    if (selectedPaymentMethod === 'ted') {
      navigation.navigate(ScreenNames.PaymentFlowTed);
      return;
    }
    Alert.alert('Em breve', 'Esta forma de pagamento está em desenvolvimento.');
  }, [navigation, selectedPaymentMethod]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={styles.page}>
        {/* ===== BLOCO: HEADER ===== */}
        <View style={styles.headerWrap}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Image
              source={Logo}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>
          {/* Título */}
          <View style={styles.titleWrap}>
            <Text style={styles.titleText}>Bem-vindo ao Fluxo de{'\n'}Pagamento</Text>
          </View>
        </View>

        {/* ===== BLOCO: CARD PRINCIPAL ===== */}
        <View style={styles.card}>
          {/* Dados principais da venda */}
          <View style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Dados principais da venda</Text>
            </View>
            <View style={styles.separator} />

            <View style={styles.row}>
              <View style={styles.rowCol}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Produto</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.value}>Holding Patrimonial</Text>
                </View>
              </View>
            </View>
            <View style={styles.separator} />
            <View style={styles.row}>
              <View style={styles.rowCol}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Número do pedido</Text>
                </View>
                <View style={styles.valueRow}>
                  <Text style={styles.value}>0000000000</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contato de suporte */}
          <View style={[styles.section, styles.sectionFill]}>
            <View style={styles.sectionTitleWrapLeft}>
              <Text style={styles.sectionTitleLeft}>Contato de suporte</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.paragraphWrap}>
              <Text style={styles.paragraph}>
                Em caso de dúvidas entre em contato com o responsável pelo seu atendimento.
              </Text>
            </View>

            {/* Responsável */}
            <View style={styles.responsibleCard}>
              <View style={styles.responsibleRow}>
                <View style={styles.responsibleAvatarWrap}>
                  <Image
                    source={ResponsibleImage}
                    style={styles.responsibleAvatar}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.responsibleInfoWrap}>
                  <View style={styles.responsibleLabelWrap}>
                    <Text style={styles.responsibleLabel}>Responsável</Text>
                  </View>
                  <View style={styles.responsibleNameWrap}>
                    <Text style={styles.responsibleName}>Carlos Mendes</Text>
                  </View>
                </View>
              </View>
              <View style={styles.innerSeparatorWrap}>
                <View style={styles.separator} />
              </View>
            </View>

            {/* WhatsApp */}
            <View style={styles.whatsWrap}>
              <View style={styles.whatsRow}>
                <WhatsAppBadgeIcon />
                <View style={styles.whatsTextCol}>
                  <View style={styles.whatsLabelWrap}>
                    <Text style={styles.whatsLabel}>WhatsApp</Text>
                  </View>
                  <View style={styles.whatsValueWrap}>
                    <Text style={styles.whatsValue}>(11) 97654-3210</Text>
                  </View>
                </View>
              </View>
              <View style={styles.whatsActionsWrap}>
                <TouchableOpacity
                  style={styles.whatsButton}
                  activeOpacity={0.9}
                  onPress={handleWhatsAppPress}
                >
                  <ChatWhiteIcon />
                  <Text style={styles.whatsButtonText}>Conversar no WhatsApp</Text>
                </TouchableOpacity>

                <View style={styles.whatsDivider} />

                <View style={styles.paymentOptionsRow}>
                  <TouchableOpacity
                    style={[styles.paymentOptionButton, selectedPaymentMethod === 'pix' && styles.paymentOptionButtonActive]}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPaymentMethod('pix')}
                  >
                    <Text style={[styles.paymentOptionText, selectedPaymentMethod === 'pix' && styles.paymentOptionTextActive]}>Pix</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.paymentOptionButton, selectedPaymentMethod === 'credit' && styles.paymentOptionButtonActive]}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPaymentMethod('credit')}
                  >
                    <Text style={[styles.paymentOptionText, selectedPaymentMethod === 'credit' && styles.paymentOptionTextActive]}>Crédito</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.paymentOptionButton, selectedPaymentMethod === 'boleto' && styles.paymentOptionButtonActive]}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPaymentMethod('boleto')}
                  >
                    <Text style={[styles.paymentOptionText, selectedPaymentMethod === 'boleto' && styles.paymentOptionTextActive]}>Boleto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.paymentOptionButton, selectedPaymentMethod === 'ted' && styles.paymentOptionButtonActive]}
                    activeOpacity={0.9}
                    onPress={() => setSelectedPaymentMethod('ted')}
                  >
                    <Text style={[styles.paymentOptionText, selectedPaymentMethod === 'ted' && styles.paymentOptionTextActive]}>TED</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ===== BLOCO: RODAPÉ ===== */}
        <View style={styles.footerCard}>
          <TouchableOpacity
            style={styles.payButton}
            activeOpacity={0.9}
            onPress={handleStartPayment}
          >
            <Text style={styles.payButtonText}>Iniciar Pagamento</Text>
            <ArrowRightWhiteIcon />
          </TouchableOpacity>
          <View style={styles.secureRow}>
            <ShieldIcon />
            <View style={styles.secureTextWrap}>
              <Text style={styles.secureText}>Ambiente 100% seguro e protegido</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// ===== BLOCO: ESTILOS =====
const styles = StyleSheet.create({
  // Containers
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    gap: 15,
    backgroundColor: '#FCFCFC',
  },
  // Containers (Header)
  headerWrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
    gap: 16,
  },
  logoWrap: {
    width: 335,
    paddingTop: 35,
    alignItems: 'center',
    gap: 15,
  },
  logo: {
    width: 177,
    height: 48,
    borderRadius: 8,
  },
  titleWrap: {
    alignItems: 'center',
  },
  // Textos
  titleText: {
    width: 254.52,
    textAlign: 'center',
    color: '#1A1A1A',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  // Containers (Card principal)
  card: {
    alignSelf: 'stretch',
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 25,
    paddingBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    gap: 16,
  },
  section: {
    gap: 10,
  },
  sectionFill: {
    flex: 1,
  },
  sectionTitleRow: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  // Textos
  sectionTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // Containers
  separator: {
    height: 1,
    backgroundColor: '#D8E0F0',
  },
  row: {
    alignItems: 'flex-start',
    gap: 10,
  },
  rowCol: {
    flexDirection: 'column',
    gap: 5,
    alignSelf: 'stretch',
    flex: 1,
  },
  labelRow: {
    alignItems: 'flex-start',
  },
  // Textos
  label: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  valueRow: {
    alignItems: 'flex-start',
  },
  // Textos
  value: {
    color: '#1A1A1A',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  sectionTitleWrapLeft: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 30,
  },
  // Textos
  sectionTitleLeft: {
    width: 254.52,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  paragraphWrap: {
    alignItems: 'flex-start',
  },
  // Textos
  paragraph: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  // Containers (Responsável)
  responsibleCard: {
    borderRadius: 12,
    gap: 20,
    paddingTop: 5,
  },
  responsibleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  responsibleAvatarWrap: {
    width: 55,
    height: 55,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  responsibleAvatar: {
    width: '100%',
    height: '100%',
  },
  responsibleInfoWrap: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  responsibleLabelWrap: {
    height: 16,
    justifyContent: 'center',
  },
  // Textos
  responsibleLabel: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  responsibleNameWrap: {},
  // Textos
  responsibleName: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  innerSeparatorWrap: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  // Containers (WhatsApp)
  whatsWrap: {
    flex: 1,
    gap: 20,
  },
  whatsActionsWrap: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  whatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whatsappIconContainer: {},
  whatsTextCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 5,
  },
  whatsLabelWrap: {},
  // Textos
  whatsLabel: {
    color: '#64748B',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
  },
  whatsValueWrap: {},
  // Textos
  whatsValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  // Botões
  whatsButton: {
    height: 40,
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#10B981',
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  // Textos
  whatsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  whatsDivider: {
    height: 1,
    backgroundColor: '#D8E0F0',
    marginTop: 15,
    marginBottom: 15,
  },
  paymentOptionsRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  paymentOptionButton: {
    flex: 1,
    height: 31,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionButtonActive: {
    backgroundColor: '#1777CF',
  },
  paymentOptionText: {
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  paymentOptionTextActive: {
    color: '#FCFCFC',
  },
  // Containers
  footerCard: {
    alignSelf: 'stretch',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    shadowColor: '#1777CF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    gap: 20,
  },
  // Botões
  payButton: {
    height: 45,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#1777CF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  // Containers
  secureRow: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    flexDirection: 'row',
  },
  secureTextWrap: {},
  // Textos
  secureText: {
    color: '#4A4A4A',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});

// ===== BLOCO: EXPORT =====
export default HomeScreenPaymentFlow;

