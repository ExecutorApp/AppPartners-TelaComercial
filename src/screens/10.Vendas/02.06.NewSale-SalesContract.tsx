import React, { useEffect, useState, useRef, useCallback } from 'react';
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

// ============================================================================
// TIPOS
// ============================================================================

interface NewSaleSalesContractProps {
  visible: boolean;
  onClose: () => void;
  onCloseImmediate?: () => void;
  onBack?: () => void;
  onNext?: () => void;
  summaries?: Partial<Record<number, string>>;
  onSelectStep?: (step: number) => void;
  onUpdateSummary?: (step: number, value: string) => void;
  maxAccessibleStep?: number;
  transitionDirection?: 'forward' | 'backward';
  embedded?: boolean;
  registerNextHandler?: (handler: () => void) => void;
  onCanProceedChange?: (canProceed: boolean) => void;
  navigation?: any;
  onSaveSale?: (saleData?: any) => void;
}

// Tipos de status do envio
type SendStatus = 'loading' | 'success' | 'error';

// Tipos de canal de envio
type SendChannel = 'whatsapp' | 'email' | 'finalize';

// ============================================================================
// CONSTANTES
// ============================================================================

// Número do WhatsApp para contato
const WHATSAPP_NUMBER = '+5517992460986';

// E-mail para envio
const EMAIL_ADDRESS = 'linkonethais@hotmail.com';

// Nome do cliente (simulado - viria dos dados da venda)
const CLIENT_NAME = 'Antônio Bizerra do Nascimento';

// Título do contrato
const CONTRACT_TITLE = 'Contrato de venda de produto e serviços';

// Link fake/placeholder para envio
const PAYMENT_LINK = 'https://partners.app/pagamento/abc123xyz';

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de envio (Paper Plane) - Original do Figma
const SendIcon: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} fill="#F4F4F4" />
    <Rect x={0.25} y={0.25} width={34.5} height={34.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      d="M27.495 11.3778C27.4963 11.37 27.4987 11.3622 27.4993 11.3544C27.5009 11.33 27.4998 11.3056 27.496 11.2815C27.4953 11.2754 27.4963 11.2695 27.4953 11.2633C27.4892 11.2306 27.478 11.1989 27.462 11.1694C27.4594 11.1642 27.4557 11.1593 27.4527 11.1541C27.452 11.1535 27.452 11.1525 27.4517 11.1515C27.4514 11.1509 27.4504 11.1505 27.45 11.1496L27.4434 11.1388C27.4232 11.1102 27.3983 11.0849 27.3698 11.0641C27.3635 11.0595 27.3561 11.0569 27.3495 11.0527C27.3252 11.0367 27.2987 11.024 27.2709 11.015C27.2586 11.0111 27.2463 11.0091 27.2336 11.0069C27.1964 10.9991 27.158 10.9979 27.1204 11.0033C27.1117 11.0046 27.1034 11.0033 27.0947 11.0052L7.76589 14.9049C7.69868 14.9184 7.63738 14.9518 7.59038 15.0006C7.54338 15.0494 7.51297 15.1112 7.50332 15.1776C7.49366 15.2439 7.50522 15.3115 7.53643 15.3711C7.56763 15.4308 7.61695 15.4796 7.67765 15.5108L13.216 18.3628L14.1873 23.6249C14.1866 23.6288 14.1876 23.633 14.1873 23.6369C14.1819 23.6753 14.1841 23.7143 14.1936 23.752C14.2013 23.7828 14.2136 23.8118 14.2303 23.8391C14.2336 23.8443 14.2336 23.8505 14.2373 23.8557C14.2383 23.8573 14.2399 23.8586 14.2413 23.8599C14.2456 23.8661 14.2516 23.8709 14.2566 23.8771C14.2722 23.896 14.2885 23.9132 14.3072 23.9278C14.3102 23.9301 14.3122 23.9337 14.3155 23.936C14.3205 23.9395 14.3262 23.9405 14.3312 23.9438C14.3515 23.9568 14.3725 23.9675 14.3948 23.9759C14.4038 23.9792 14.4121 23.9831 14.4214 23.9857C14.4514 23.9941 14.4823 24 14.5136 24H14.5146L14.5186 23.9994C14.566 24.0012 14.6132 23.993 14.657 23.9754C14.7008 23.9579 14.7403 23.9313 14.7727 23.8976L18.4619 21.4966L22.3246 23.9477C22.3666 23.9741 22.4141 23.9911 22.4637 23.9972C22.5132 24.0034 22.5636 23.9987 22.611 23.9834C22.6585 23.968 22.7018 23.9424 22.7377 23.9084C22.7736 23.8744 22.8012 23.8329 22.8185 23.7871L27.479 11.4376C27.4834 11.4264 27.487 11.415 27.49 11.4035C27.4913 11.3986 27.4917 11.3937 27.4927 11.3892L27.495 11.3778ZM23.6383 13.4528L15.6488 19.1875C15.6358 19.1969 15.6255 19.2086 15.6142 19.2197C15.6098 19.2236 15.6055 19.2268 15.6019 19.2311C15.595 19.2385 15.5884 19.2462 15.5822 19.2541C15.5762 19.262 15.5716 19.2701 15.5662 19.2782C15.5539 19.2977 15.5436 19.3179 15.5356 19.3393C15.5339 19.3435 15.5313 19.3468 15.5299 19.351C15.5296 19.3523 15.5283 19.353 15.5279 19.3543L14.6122 22.2595L13.8866 18.329L23.6383 13.4528ZM15.1283 22.885L16.0361 19.9579L17.4493 20.8548L17.8535 21.1113L16.4803 22.005L15.1283 22.885ZM24.8304 12.1261L13.5177 17.7828L8.80915 15.3584L24.8304 12.1261ZM22.338 23.1808L17.2082 19.9261L16.4313 19.4329L26.4724 12.2253L22.338 23.1808Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Ícone WhatsApp - Original do Figma
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

// Ícone de copiar - Original do Figma
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

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const NewSaleSalesContract: React.FC<NewSaleSalesContractProps> = ({
  visible,
  onClose,
  onBack,
  onNext,
  summaries,
  onSelectStep,
  onUpdateSummary,
  maxAccessibleStep = 1,
  transitionDirection = 'forward',
  embedded = false,
  registerNextHandler,
  onCanProceedChange,
  navigation,
  onSaveSale,
}) => {
  // ============================================================================
  // ESTADOS
  // ============================================================================

  // Modal de status de envio
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [sendStatus, setSendStatus] = useState<SendStatus>('loading');
  const [sendChannel, setSendChannel] = useState<SendChannel>('whatsapp');
  const [modalMessage, setModalMessage] = useState<string>('');

  // Modal de visualização do PDF
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);

  // Controle do botão "Finalizar"
  const [canFinalize, setCanFinalize] = useState(false);

  // Controle de visibilidade do botão "Eu enviei o link manualmente"
  const [showManualSendButton, setShowManualSendButton] = useState(false);

  // Controle de confirmação manual (cor do botão)
  const [manualSendConfirmed, setManualSendConfirmed] = useState(false);

  // Feedback de link copiado
  const [linkCopied, setLinkCopied] = useState(false);

  // Timer ref para cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const linkCopiedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Refs para valores atualizados
  const navigationRef = useRef(navigation);
  const onCloseRef = useRef(onClose);
  const onSaveSaleRef = useRef(onSaveSale);
  const summariesRef = useRef(summaries);

  // ============================================================================
  // LÓGICA DE CONTROLE
  // ============================================================================

  // O botão "Finalizar" está desabilitado até que canFinalize seja true
  const isNextDisabled = !canFinalize;

  const normalize = (s?: string) => (s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  const typeLabel = normalize(summaries?.[5] ?? '');
  const isDualMode = typeLabel.includes('prolabore') && (typeLabel.includes('exito') || typeLabel.includes('êxito'));
  const paymentIndex = isDualMode ? 7 : 6;
  const contractIndex = isDualMode ? 8 : 7;

  // Cleanup dos timers ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (linkCopiedTimerRef.current) {
        clearTimeout(linkCopiedTimerRef.current);
      }
    };
  }, []);

  // Notifica o rodapé unificado sobre possibilidade de prosseguir
  useEffect(() => {
    onCanProceedChange?.(!isNextDisabled);
  }, [isNextDisabled, onCanProceedChange]);

  // Registra handler do botão Finalizar no modo embed
  useEffect(() => {
    if (!embedded || !registerNextHandler) return;
    registerNextHandler(async () => {
      try {
        // Salva a venda usando o callback do Orchestrator
        if (onSaveSaleRef.current) {
          const saleData = {
            client: summariesRef.current?.[1] || null,
            product: summariesRef.current?.[2] || null,
            activity: summariesRef.current?.[4] || null,
            agendaType: summariesRef.current?.[5] || null,
            payment: summariesRef.current?.[paymentIndex] || null,
          };
          onSaveSaleRef.current(saleData);
        }
        // Navega diretamente para SalesHomeScreen (sem chamar onClose para evitar modal de saída)
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'SalesHome' }],
          });
        }
      } catch (error) {
        setSendChannel('finalize');
        setSendStatus('error');
        setModalMessage('Erro ao processar a venda.');
        setIsSuccessModalVisible(true);
      }
    });
  }, [embedded, registerNextHandler]);

  // Atualiza o summary da etapa atual
  useEffect(() => {
    if (visible) {
      onUpdateSummary?.(contractIndex, 'Contrato gerado');
    }
  }, [visible, onUpdateSummary, contractIndex]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  // Envia mensagem real por WhatsApp (em segundo plano)
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
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }, []);

  // Envia e-mail real (em segundo plano)
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
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return false;
    }
  }, []);

  // Atualiza refs a cada render
  onSaveSaleRef.current = onSaveSale;
  summariesRef.current = summaries;

  // Handler do envio por WhatsApp
  const handleWhatsApp = useCallback(async () => {
    setSendChannel('whatsapp');
    setSendStatus('loading');
    setModalMessage('');
    setIsSuccessModalVisible(true);

    // Simula tempo de envio
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

  // Handler do envio por e-mail
  const handleEmail = useCallback(async () => {
    setSendChannel('email');
    setSendStatus('loading');
    setModalMessage('');
    setIsSuccessModalVisible(true);

    // Simula tempo de envio
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

  // Handler do fechamento do modal de sucesso
  const handleCloseSuccessModal = useCallback(() => {
    setIsSuccessModalVisible(false);

    // Se foi sucesso no envio, habilita Finalizar
    if (sendStatus === 'success' && sendChannel !== 'finalize') {
      setCanFinalize(true);
    }

    // Se foi sucesso na finalização, navega para a tela de vendas
    if (sendStatus === 'success' && sendChannel === 'finalize') {
      // Navega para a tela de vendas
      if (navigation) {
        navigation.navigate('SalesHome');
      } else {
        onClose();
      }
    }

    // Reset do status para próximo uso
    setSendStatus('loading');
    setModalMessage('');
  }, [sendStatus, sendChannel, navigation, onClose]);

  // Handler para falar com time jurídico (abre WhatsApp diretamente)
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
    } catch (error) {
      console.error('Erro ao abrir WhatsApp:', error);
    }
  }, []);

  // Handler para copiar link do fluxo de pagamento
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
      // Fallback nativo: sem dependência externa de clipboard, apenas feedback visual e habilita confirmação manual
      setLinkCopied(true);
      setShowManualSendButton(true);
      if (linkCopiedTimerRef.current) {
        clearTimeout(linkCopiedTimerRef.current);
      }
      linkCopiedTimerRef.current = setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
    }
  }, []);

  // Handler para confirmação manual de envio
  const handleManualSend = useCallback(() => {
    setManualSendConfirmed(true);
    setCanFinalize(true);
  }, []);

  // Handler para finalizar a venda (salva e navega diretamente)
  const handleFinalize = useCallback(async () => {
    try {
      // Salva a venda usando o callback do Orchestrator
      if (onSaveSaleRef.current) {
        const saleData = {
          client: summariesRef.current?.[1] || null,
          product: summariesRef.current?.[2] || null,
          activity: summariesRef.current?.[4] || null,
          agendaType: summariesRef.current?.[5] || null,
          payment: summariesRef.current?.[paymentIndex] || null,
        };
        onSaveSaleRef.current(saleData);
      }
      // Sucesso: navega diretamente para a tela de vendas (sem chamar onClose para evitar modal de saída)
      if (navigation) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'SalesHomeScreen' }],
        });
      }
    } catch (error) {
      // Erro: mostra modal de erro
      setSendChannel('finalize');
      setSendStatus('error');
      setModalMessage('Erro ao processar a venda.');
      setIsSuccessModalVisible(true);
    }
  }, [navigation, paymentIndex]);

  // Atualiza refs a cada render
  navigationRef.current = navigation;
  onCloseRef.current = onClose;

  // Handler para abrir o visualizador de PDF
  const handleOpenPDF = useCallback(() => {
    setIsPDFModalVisible(true);
  }, []);

  // Handler para fechar o visualizador de PDF
  const handleClosePDF = useCallback(() => {
    setIsPDFModalVisible(false);
  }, []);

  // ============================================================================
  // RENDERIZAÇÃO
  // ============================================================================

  // Renderização: embed retorna apenas conteúdo central
  if (embedded) {
    return (
      <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
        <View style={styles.contentFlex}>
          {/* Intro */}
          <View style={styles.introContainer}>
            <View style={styles.centerBlock}>
              <Text style={styles.sectionTitle}>Contrato de venda</Text>
              <Text style={styles.sectionSubtitle}>Confirme se está tudo correto</Text>
            </View>
            <View style={styles.stepsRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.stepDot, i < 6 ? styles.stepDotActive : styles.stepDotInactive]} />
              ))}
            </View>
          </View>

          {/* Conteúdo principal com scroll */}
          <View style={styles.mainContentWrapper}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
              {/* Card do contrato (clicável para abrir PDF) */}
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

              {/* Botões de ação */}
              <View style={styles.actionsContainer}>
                {/* Enviar por WhatsApp */}
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

                {/* Enviar por e-mail */}
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

                {/* Falar com time Jurídico */}
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

                {/* Copiar link do fluxo de pagamento */}
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

                {/* Eu enviei o link manualmente (condicional) */}
                {showManualSendButton && (
                  <TouchableOpacity
                    style={[
                      styles.manualSendButton,
                      manualSendConfirmed && styles.manualSendButtonConfirmed,
                    ]}
                    onPress={handleManualSend}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel="Eu enviei o link manualmente"
                  >
                    <Text style={[
                      styles.manualSendButtonText,
                      manualSendConfirmed && styles.manualSendButtonTextConfirmed,
                    ]}>
                      Envio manual concluído
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Modal de status de envio */}
        <NewSaleSalesContractSuccess
          visible={isSuccessModalVisible}
          onClose={handleCloseSuccessModal}
          status={sendStatus}
          channel={sendChannel}
          clientName={CLIENT_NAME}
          errorMessage={modalMessage || undefined}
        />

        {/* Modal de visualização do PDF */}
        <NewSaleSalesContractPDF
          visible={isPDFModalVisible}
          onClose={handleClosePDF}
          title={CONTRACT_TITLE}
          totalPages={23}
        />
      </SlideInView>
    );
  }

  // Modo não-embedded (standalone) - não utilizado neste contexto
  return null;
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  contentFlex: {
    flex: 1,
    alignSelf: 'stretch',
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
    flexDirection: 'column',
  },
  scrollView: {
    flex: 1,
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

export default NewSaleSalesContract;
