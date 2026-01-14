import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

interface Props {
  visible: boolean;
  onClose: () => void;
  onGenerateNewPix?: () => void;
  onFinalize?: () => void;
}

const ErrorIcon: React.FC = () => (
  <View style={styles.iconWrapRed}>
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx={40} cy={40} r={34} fill="#F04438" />
      <Path d="M30 30L50 50M50 30L30 50" stroke="#FCFCFC" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const PaymentFlowPixTimeExceeded: React.FC<Props> = ({ visible, onClose, onGenerateNewPix, onFinalize }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <ErrorIcon />
          <Text style={styles.title}>TEMPO EXCEDIDO!</Text>
          <Text style={styles.subtitle}>O tempo de pagamento expirou, por favor, tente novamente.</Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={onGenerateNewPix ?? onClose} activeOpacity={0.9}>
            <Text style={styles.secondaryText}>Gerar novo pix</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={onFinalize ?? onClose} activeOpacity={0.9}>
            <Text style={styles.primaryText}>Finalizar</Text>
          </TouchableOpacity>
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
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 12,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
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
    paddingTop: 15,
  },
  subtitle: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    paddingTop: 5,
    paddingBottom: 25,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: '#1777CF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryText: {
    color: '#FCFCFC',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default PaymentFlowPixTimeExceeded;
