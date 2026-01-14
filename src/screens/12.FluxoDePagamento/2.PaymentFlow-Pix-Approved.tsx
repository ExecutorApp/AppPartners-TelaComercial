import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const CARD_HEIGHT = 270;
const CARD_PADDING_BOTTOM = 20;

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinalize?: () => void;
  title?: string;
  subtitle?: string;
  primaryText?: string;
  buttonBottomPadding?: number;
}

const ApprovedIcon: React.FC = () => (
  <View style={styles.iconWrap}>
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx={40} cy={40} r={34} fill="#1777CF" />
      <Path d="M28 40.5L36 48.5L52 32.5" stroke="#FCFCFC" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  </View>
);

const PaymentFlowPixApproved: React.FC<Props> = ({
  visible,
  onClose,
  onFinalize,
  title = 'APROVADO!',
  subtitle = 'Pagamento realizado com sucesso.',
  primaryText = 'Finalizar',
  buttonBottomPadding = 0,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            buttonBottomPadding
              ? {
                  height: CARD_HEIGHT + buttonBottomPadding,
                  paddingBottom: CARD_PADDING_BOTTOM + buttonBottomPadding,
                }
              : null,
          ]}
          onPress={() => {}}
        >
          <ApprovedIcon />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          {/* Ajuste manual: padding acima do botão "Finalizar". Altere o valor em styles.buttonTopPadding conforme desejar. */}
          <View style={styles.buttonTopPadding}>
            <TouchableOpacity style={styles.primaryButton} onPress={onFinalize ?? onClose} activeOpacity={0.9}>
              <Text style={styles.primaryText}>{primaryText}</Text>
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
    height: CARD_HEIGHT,
    paddingTop: 26,
    paddingBottom: CARD_PADDING_BOTTOM,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 18,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 15,
  },
  iconWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(23, 119, 207, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
  },
  primaryButton: {
    alignSelf: 'stretch',
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  primaryText: {
    color: '#FCFCFC',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  // Ajuste manual: aumente ou diminua este padding para descer/subir o botão "Finalizar"
  buttonTopPadding: {
    paddingTop: 15,
    alignSelf: 'stretch',
  },
});

export default PaymentFlowPixApproved;
