import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import SlideInView from './SlideInView';
import NewSaleSalesContractSuccess from './02.06.NewSale-SalesContract-Success';
import NewSaleSalesContractPDF from './02.06.NewSale-SalesContract-PDF';

type SendStatus = 'loading' | 'success' | 'error';
type SendChannel = 'whatsapp' | 'email' | 'finalize';

const WHATSAPP_NUMBER = '+5517992460986';
const EMAIL_ADDRESS = 'linkonethais@hotmail.com';
const CLIENT_NAME = 'Antônio Bizerra do Nascimento';
const CONTRACT_TITLE = 'Contrato de venda de produto e serviços';
const PAYMENT_LINK = 'https://partners.app/pagamento/abc123xyz';

const SendIcon: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} fill="#F4F4F4" />
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      d="M19.995 0.377773C19.9963 0.369971 19.9987 0.362169 19.9993 0.354367C20.0009 0.330048 19.9998 0.305637 19.996 0.281549C19.9953 0.275372 19.9963 0.269521 19.9953 0.263344C19.9892 0.230551 19.978 0.198867 19.962 0.169396C19.9594 0.164195 19.9557 0.159319 19.9527 0.154117C19.952 0.153467 19.952 0.152492 19.9517 0.151517C19.9514 0.150866 19.9504 0.150542 19.95 0.149566L19.9434 0.138839C19.9232 0.110185 19.8983 0.0849328 19.8698 0.0640699C19.8635 0.0595188 19.8561 0.0569182 19.8495 0.0526922C19.8252 0.0366592 19.7987 0.0239701 19.7709 0.0149828C19.7586 0.0110818 19.7463 0.00913146 19.7336 0.00685589C19.6964 -0.000864814 19.658 -0.00207575 19.6204 0.0032798C19.6117 0.00458012 19.6034 0.00327997 19.5947 0.00523045L0.26589 3.9049C0.19868 3.9184 0.137383 3.95183 0.0903827 4.00064C0.0433822 4.04944 0.0129733 4.11123 0.00331529 4.17755C-0.00634273 4.24387 0.0052217 4.31149 0.0364269 4.37115C0.067632 4.4308 0.116954 4.4796 0.177647 4.51085L5.71597 7.36278L6.68731 12.6249C6.68664 12.6288 6.68764 12.633 6.68731 12.6369C6.68192 12.6753 6.68407 12.7143 6.69363 12.752C6.70129 12.7828 6.71361 12.8118 6.73026 12.8391C6.73359 12.8443 6.73359 12.8505 6.73726 12.8557C6.73826 12.8573 6.73992 12.8586 6.74125 12.8599C6.74558 12.8661 6.75157 12.8709 6.75657 12.8771C6.77222 12.896 6.78854 12.9132 6.80718 12.9278C6.81018 12.9301 6.81218 12.9337 6.81551 12.936C6.8205 12.9395 6.82616 12.9405 6.83116 12.9438C6.85147 12.9568 6.87245 12.9675 6.89476 12.9759C6.90375 12.9792 6.91208 12.9831 6.9214 12.9857C6.95137 12.9941 6.98234 13 7.01364 13H7.01464L7.01863 12.9994C7.06598 13.0012 7.11317 12.993 7.157 12.9754C7.20084 12.9579 7.2403 12.9313 7.27271 12.8976L10.9619 10.4966L14.8246 12.9477C14.8666 12.9741 14.9141 12.9911 14.9637 12.9972C15.0132 13.0034 15.0636 12.9987 15.111 12.9834C15.1585 12.968 15.2018 12.9424 15.2377 12.9084C15.2736 12.8744 15.3012 12.8329 15.3185 12.7871L19.979 0.437588C19.9834 0.426435 19.987 0.415037 19.99 0.403454C19.9913 0.398578 19.9917 0.393702 19.9927 0.38915L19.995 0.377773ZM16.1383 2.45276L8.14881 8.18751C8.13582 8.19694 8.1255 8.20864 8.11418 8.21969C8.10985 8.22359 8.10552 8.22684 8.10186 8.23107C8.09495 8.23847 8.0884 8.24617 8.08221 8.25415C8.07622 8.26195 8.07155 8.27008 8.06623 8.2782C8.05391 8.29771 8.04358 8.31787 8.03559 8.33932C8.03393 8.34355 8.03126 8.3468 8.02993 8.35102C8.0296 8.35232 8.02827 8.35297 8.02793 8.35427L7.1122 11.2595L6.38662 7.32897L16.1383 2.45276ZM7.62834 11.885L8.53608 8.95795L9.9493 9.85485L10.3535 10.1113L8.98029 11.005L7.62834 11.885ZM17.3304 1.12611L6.01766 6.78283L1.30915 4.35838L17.3304 1.12611ZM14.838 12.1808L9.70821 8.92609L8.93134 8.43294L18.9724 1.22526L14.838 12.1808Z"
      fill="#3A3F51"
      transform="translate(7.5, 11)"
    />
  </Svg>
);

const WhatsAppIcon: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} fill="#F4F4F4" />
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      d="M17.5 8.65039C19.8567 8.65145 22.0701 9.56427 23.7344 11.2207C25.4228 12.9015 26.3503 15.1045 26.3496 17.4238C26.3485 19.7605 25.4241 21.9616 23.7441 23.6221C22.0683 25.2786 19.8509 26.1904 17.5 26.1904H17.4961C16.1153 26.1899 14.7463 25.8637 13.5195 25.2461L13.4707 25.2217L13.418 25.2344L8.72168 26.3008L9.74316 21.666L9.75488 21.6113L9.72852 21.5625C9.02198 20.2592 8.65067 18.8326 8.65039 17.4209V17.417C8.65257 15.0817 9.57657 12.8778 11.2549 11.2188C12.9306 9.56222 15.1486 8.65039 17.5 8.65039ZM17.499 9.75488C13.2334 9.75501 9.75876 13.1937 9.75586 17.4189V17.4199C9.75594 18.7274 10.1249 20.0507 10.8193 21.2471L10.9258 21.4326L10.2275 24.6064L10.1768 24.8379L10.4072 24.7852L13.6289 24.0527L13.8115 24.1523C14.9361 24.7623 16.2104 25.0853 17.4961 25.0859H17.5C21.7668 25.0857 25.2415 21.6494 25.2432 17.4229C25.2438 15.3974 24.4294 13.4726 22.9531 12.0029C21.4975 10.5544 19.56 9.75574 17.499 9.75488ZM14.6562 13.6377H15.0449L15.1348 13.6455C15.1601 13.6502 15.1817 13.6572 15.2031 13.6699C15.2454 13.695 15.3072 13.7537 15.377 13.9082C15.467 14.1076 15.6108 14.4595 15.7393 14.7773C15.8646 15.0874 15.9804 15.377 16.0098 15.4355C16.0516 15.5191 16.0639 15.5841 16.0264 15.6592C15.9515 15.8083 15.9329 15.8691 15.8457 15.9707C15.7472 16.0852 15.6267 16.2071 15.5342 16.2988C15.4867 16.3459 15.4083 16.4216 15.3701 16.5234C15.3266 16.6399 15.342 16.7662 15.4199 16.8994C15.5422 17.1082 15.9762 17.8184 16.6064 18.3779C17.4114 19.0926 18.0938 19.3245 18.2871 19.4209H18.2881C18.4009 19.4771 18.5141 19.5138 18.6279 19.5C18.748 19.4854 18.8387 19.4189 18.9131 19.334C19.0318 19.1989 19.4431 18.7174 19.5869 18.5029C19.639 18.4251 19.673 18.4172 19.6914 18.415C19.7262 18.4111 19.7757 18.4215 19.874 18.457V18.458C19.9587 18.4888 20.2487 18.6267 20.5547 18.7764C20.8556 18.9235 21.1596 19.0756 21.2627 19.127C21.3741 19.1824 21.4488 19.2152 21.5127 19.25C21.5442 19.2672 21.5639 19.2804 21.5762 19.29L21.5957 19.3086C21.5891 19.2976 21.5972 19.3081 21.6016 19.3643C21.6053 19.4122 21.6046 19.4783 21.5977 19.5586C21.5837 19.719 21.5442 19.9285 21.4629 20.1553C21.3945 20.346 21.1773 20.5582 20.9053 20.7334C20.6351 20.9074 20.3539 21.0174 20.2002 21.0312C20.0006 21.0494 19.841 21.0881 19.5098 21.0439C19.1741 20.9991 18.6634 20.8678 17.7988 20.5283C15.7573 19.7266 14.4644 17.6391 14.3477 17.4834C14.2977 17.4169 14.0936 17.1473 13.9023 16.7725C13.7099 16.3953 13.5371 15.9235 13.5371 15.4531C13.5372 14.5078 14.0296 14.0502 14.2178 13.8457C14.3731 13.6768 14.5531 13.6377 14.6562 13.6377Z"
      fill="#3A3F51"
      stroke="#FCFCFC"
      strokeWidth={0.3}
    />
  </Svg>
);

const CopyIcon: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} fill="#F4F4F4" />
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      d="M10.8433 21.4475C10.5875 21.3021 10.3747 21.0916 10.2266 20.8374C10.0785 20.5832 10.0003 20.2942 10 20V11.6667C10 10.75 10.75 10 11.6667 10H20C20.625 10 20.965 10.3208 21.25 10.8333M13.3333 15.5558C13.3333 14.9664 13.5675 14.4011 13.9843 13.9843C14.4011 13.5675 14.9664 13.3333 15.5558 13.3333H22.7775C23.0694 13.3333 23.3584 13.3908 23.628 13.5025C23.8977 13.6142 24.1427 13.7779 24.349 13.9843C24.5554 14.1907 24.7191 14.4357 24.8308 14.7053C24.9425 14.975 25 15.264 25 15.5558V22.7775C25 23.0694 24.9425 23.3584 24.8308 23.628C24.7191 23.8977 24.5554 24.1427 24.349 24.349C24.1427 24.5554 23.8977 24.7191 23.628 24.8308C23.3584 24.9425 23.0694 25 22.7775 25H15.5558C15.264 25 14.975 24.9425 14.7053 24.8308C14.4357 24.7191 14.1907 24.5554 13.9843 24.349C13.7779 24.1427 13.6142 23.8977 13.5025 23.628C13.3908 23.3584 13.3333 23.0694 13.3333 22.7775V15.5558Z"
      stroke="#3A3F51"
      strokeWidth={0.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const InformationGroupContract: React.FC = () => {
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>('loading');
  const [sendChannel, setSendChannel] = useState<SendChannel>('whatsapp');
  const [modalMessage, setModalMessage] = useState<string>('');

  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);

  const [showManualSendButton, setShowManualSendButton] = useState(false);
  const [manualSendConfirmed, setManualSendConfirmed] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const linkCopiedTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (linkCopiedTimerRef.current) {
        clearTimeout(linkCopiedTimerRef.current);
      }
    };
  }, []);

  const sendWhatsAppMessage = useCallback(async (): Promise<boolean> => {
    try {
      const message = encodeURIComponent(`Olá! Segue o link para pagamento: ${PAYMENT_LINK}`);
      const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${message}`;
      const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
        return true;
      } else {
        await Linking.openURL(webUrl);
        return true;
      }
    } catch {
      return false;
    }
  }, []);

  const sendEmail = useCallback(async (): Promise<boolean> => {
    try {
      const subject = encodeURIComponent('Link de Pagamento - Partners');
      const body = encodeURIComponent(`Olá!\n\nSegue o link para pagamento:\n${PAYMENT_LINK}\n\nAtenciosamente,\nEquipe Partners`);
      const emailUrl = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const handleWhatsApp = useCallback(async () => {
    setSendChannel('whatsapp');
    setSendStatus('loading');
    setModalMessage('');
    setIsSuccessModalVisible(true);
    setTimeout(async () => {
      const success = await sendWhatsAppMessage();
      if (success) {
        setSendStatus('success');
      } else {
        setSendStatus('error');
        setShowManualSendButton(true);
      }
    }, 2000);
  }, [sendWhatsAppMessage]);

  const handleEmail = useCallback(async () => {
    setSendChannel('email');
    setSendStatus('loading');
    setModalMessage('');
    setIsSuccessModalVisible(true);
    setTimeout(async () => {
      const success = await sendEmail();
      if (success) {
        setSendStatus('success');
      } else {
        setSendStatus('error');
        setShowManualSendButton(true);
      }
    }, 2000);
  }, [sendEmail]);

  const handleCloseSuccessModal = useCallback(() => {
    setIsSuccessModalVisible(false);
    setSendStatus('loading');
    setModalMessage('');
  }, []);

  const handleLegalTeam = useCallback(async () => {
    const message = encodeURIComponent('Olá, gostaria de falar com o time jurídico.');
    const whatsappUrl = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${message}`;
    const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    try {
      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        await Linking.openURL(webUrl);
      }
    } catch {}
  }, []);

  const handleCopyLink = useCallback(async () => {
    try {
      if (Platform.OS === 'web' && (navigator as any)?.clipboard?.writeText) {
        await (navigator as any).clipboard.writeText(PAYMENT_LINK);
        setLinkCopied(true);
        setShowManualSendButton(true);
        if (linkCopiedTimerRef.current) {
          clearTimeout(linkCopiedTimerRef.current);
        }
        linkCopiedTimerRef.current = setTimeout(() => {
          setLinkCopied(false);
        }, 3000);
        return;
      }
      setLinkCopied(true);
      setShowManualSendButton(true);
      if (linkCopiedTimerRef.current) {
        clearTimeout(linkCopiedTimerRef.current);
      }
      linkCopiedTimerRef.current = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch {}
  }, []);

  const handleManualSend = useCallback(() => {
    setManualSendConfirmed(true);
  }, []);

  const handleOpenPDF = useCallback(() => {
    setIsPDFModalVisible(true);
  }, []);

  const handleClosePDF = useCallback(() => {
    setIsPDFModalVisible(false);
  }, []);

  return (
    <SlideInView visible direction="forward" style={{ alignSelf: 'stretch', flex: 1 }}>
      <View style={styles.contentFlex}>
        <View style={styles.mainContentWrapper}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
            <TouchableOpacity
              style={styles.contractCard}
              onPress={handleOpenPDF}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Visualizar contrato"
            >
              <View style={styles.contractCardInner}>
                <View style={styles.contractContent}>
                  <Text style={styles.contractTitle}>{CONTRACT_TITLE}</Text>
                  <Text style={styles.contractText}>
                    Vendedora: Lima Neto Advogados, CNPJ nº 12.345.678/0001-99, com sede na Av. Anísio Haddad, 8001 - Jardim Aclimacao, São José do Rio
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.actionsContainer}>
              <View style={styles.actionRow}>
                <View style={styles.actionInputBox}>
                  <Text style={styles.actionText}>Enviar por WhatsApp</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={handleWhatsApp}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar por WhatsApp"
                >
                  <SendIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.actionRow}>
                <View style={styles.actionInputBox}>
                  <Text style={styles.actionText}>Enviar por e-mail</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={handleEmail}
                  accessibilityRole="button"
                  accessibilityLabel="Enviar por e-mail"
                >
                  <SendIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.actionRow}>
                <View style={styles.actionInputBox}>
                  <Text style={styles.actionText}>Falar com time Jurídico</Text>
                </View>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={handleLegalTeam}
                  accessibilityRole="button"
                  accessibilityLabel="Falar com time Jurídico"
                >
                  <WhatsAppIcon />
                </TouchableOpacity>
              </View>
              <View style={styles.actionRow}>
                <View style={styles.actionInputBox}>
                  <Text style={[styles.actionText, linkCopied && styles.actionTextSuccess]}>
                    {linkCopied ? 'Link copiado!' : 'Copiar link do fluxo de pagamento'}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionIconButton}
                  onPress={handleCopyLink}
                  accessibilityRole="button"
                  accessibilityLabel="Copiar link do fluxo de pagamento"
                >
                  <CopyIcon />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
      <NewSaleSalesContractSuccess
        visible={isSuccessModalVisible}
        onClose={handleCloseSuccessModal}
        status={sendStatus}
        channel={sendChannel}
        clientName={CLIENT_NAME}
        errorMessage={modalMessage || undefined}
      />
      <NewSaleSalesContractPDF
        visible={isPDFModalVisible}
        onClose={handleClosePDF}
        title={CONTRACT_TITLE}
        totalPages={23}
      />
    </SlideInView>
  );
};

export default InformationGroupContract;

const styles = StyleSheet.create({
  contentFlex: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
  },
  introContainer: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7D8592',
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
  stepsRow: {
    flexDirection: 'row',
    gap: 8,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 14,
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    minWidth: 24,
  },
  stepDotActive: {
    backgroundColor: '#1777CF',
  },
  stepDotInactive: {
    backgroundColor: '#E5E7EA',
  },
  mainContentWrapper: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  contractCard: {
    alignSelf: 'stretch',
    height: 112,
    padding: 5,
    backgroundColor: 'rgba(23, 119, 207, 0.10)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  contractCardInner: {
    flex: 1,
    alignSelf: 'stretch',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  contractContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FCFCFC',
    borderRadius: 6,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
  },
  contractTitle: {
    alignSelf: 'stretch',
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_600SemiBold',
  },
  contractText: {
    alignSelf: 'stretch',
    fontSize: 10,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
  },
  actionsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    gap: 15,
    marginTop: 15,
  },
  actionRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionInputBox: {
    flex: 1,
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  actionText: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
  },
  actionTextSuccess: {
    color: '#1B883C',
  },
  actionIconButton: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  manualSendButton: {
    alignSelf: 'stretch',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.10)',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  manualSendButtonConfirmed: {
    backgroundColor: '#DEFBE6',
    borderColor: '#1B883C',
  },
  manualSendButtonText: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
  },
  manualSendButtonTextConfirmed: {
    color: '#1B883C',
    fontFamily: 'Inter_400Regular',
  },
});
