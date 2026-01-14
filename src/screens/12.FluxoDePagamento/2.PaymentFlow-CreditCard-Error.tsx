import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

const ErrorIcon: React.FC = () => (
  <View style={styles.iconWrapRed}>
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx={40} cy={40} r={34} fill="#F04438" />
      <Path d="M30 30L50 50M50 30L30 50" stroke="#FCFCFC" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const PaymentFlowCreditCardError: React.FC<Props> = ({ visible, onClose, onRetry }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <ErrorIcon />
          <Text style={styles.title}>ERRO!</Text>
          <Text style={styles.subtitle}>Pagamento não aprovado, tente novamente.</Text>
          {/* Ajuste manual: padding abaixo do botão "Fechar". Altere o valor em styles.buttonBottomPadding conforme desejar. */}
          <View style={styles.buttonBottomPadding}>
            <TouchableOpacity style={styles.primaryButton} onPress={onRetry ?? onClose} activeOpacity={0.9}>
              <Text style={styles.primaryText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: 300,
    height: 295,
    paddingTop: 26,
    paddingBottom: 26,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 18,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
  },
  iconWrapRed: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(240, 68, 56, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    paddingTop: 10,
  },
  subtitle: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 15,
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: '#FCFCFC',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  // Ajuste manual: aumente ou diminua este padding para subir/abaixar visualmente o botão "Fechar"
  buttonBottomPadding: {
    paddingBottom: 20,
    alignSelf: 'stretch',
  },
});

export default PaymentFlowCreditCardError;
