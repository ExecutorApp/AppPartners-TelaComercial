import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// ============================================================================
// TIPOS
// ============================================================================

// Tipos de status do modal
type SendStatus = 'loading' | 'success' | 'error';

// Tipos de canal de envio
type SendChannel = 'whatsapp' | 'email' | 'finalize';

interface NewSaleSalesContractSuccessProps {
  visible: boolean;
  onClose: () => void;
  status: SendStatus;
  channel: SendChannel;
  clientName?: string;
  errorMessage?: string;
}

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de sucesso (check) - Original do Figma
const SuccessIcon: React.FC = () => (
  <Svg width={40} height={28} viewBox="0 0 40 28" fill="none">
    <Path
      d="M2.33325 13.9997L13.9999 25.6663L37.3333 2.33301"
      stroke="white"
      strokeWidth={4.66667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de erro (X)
const ErrorIcon: React.FC = () => (
  <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
    <Path
      d="M24 8L8 24M8 8L24 24"
      stroke="white"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const NewSaleSalesContractSuccess: React.FC<NewSaleSalesContractSuccessProps> = ({
  visible,
  onClose,
  status,
  channel,
  clientName = 'Cliente',
  errorMessage,
}) => {
  // Determina se o botão de fechar está habilitado
  const canClose = status !== 'loading';

  // Obtém o nome do canal para exibição
  const channelName = channel === 'whatsapp' ? 'WhatsApp' : 'e-mail';

  // Handler do botão fechar
  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  // Renderiza o conteúdo baseado no status
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            {/* Indicador de carregamento */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircleOuter}>
                <View style={styles.iconCircleLoading}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              </View>
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>AGUARDE...</Text>
              <Text style={styles.messageText}>
                Enviando contrato{'\n'}via "{channelName}".
              </Text>
            </View>
          </>
        );

      case 'success':
        return (
          <>
            {/* Ícone de sucesso */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircleOuter}>
                <View style={styles.iconCircleSuccess}>
                  <SuccessIcon />
                </View>
              </View>
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={styles.titleText}>SUCESSO!</Text>
              <Text style={styles.messageText}>
                Contrato enviado com sucesso{'\n'}via "{channelName}" para o cliente{'\n'}"{clientName}".
              </Text>
            </View>
          </>
        );

      case 'error':
        return (
          <>
            {/* Ícone de erro */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircleOuter}>
                <View style={styles.iconCircleError}>
                  <ErrorIcon />
                </View>
              </View>
            </View>

            {/* Textos */}
            <View style={styles.textContainer}>
              <Text style={styles.titleTextError}>ERRO!</Text>
              <Text style={styles.messageText}>
                {errorMessage || `Não foi possível enviar o contrato\nvia "${channelName}".\nTente novamente.`}
              </Text>
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {renderContent()}

          {/* Botão Fechar */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              !canClose && styles.closeButtonDisabled,
            ]}
            onPress={handleClose}
            disabled={!canClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <Text style={[styles.closeButtonText, !canClose && styles.closeButtonTextDisabled]}>
              Fechar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  modalContainer: {
    width: 300,
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#FCFCFC',
    borderRadius: 18,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F4F4F4',
    borderRadius: 99,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleOuter: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleSuccess: {
    width: 70,
    height: 70,
    backgroundColor: '#1777CF',
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#EFF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleError: {
    width: 70,
    height: 70,
    backgroundColor: '#E74C3C',
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#FDEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleLoading: {
    width: 70,
    height: 70,
    backgroundColor: '#1777CF',
    borderRadius: 80,
    borderWidth: 6,
    borderColor: '#EFF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleText: {
    width: 270,
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 21,
  },
  titleTextError: {
    width: 270,
    textAlign: 'center',
    color: '#E74C3C',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 21,
  },
  messageText: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 21,
  },
  closeButton: {
    width: 270,
    height: 40,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 11,
    paddingBottom: 11,
    backgroundColor: '#1777CF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonDisabled: {
    backgroundColor: '#B0B0B0',
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  closeButtonTextDisabled: {
    color: '#E0E0E0',
  },
});

export default NewSaleSalesContractSuccess;
