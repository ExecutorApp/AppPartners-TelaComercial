import React, { useEffect, useRef } from 'react';
import { Modal, Pressable, View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle, Rect, Path, G } from 'react-native-svg';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AwaitingIcon: React.FC = () => {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, [spin, pulse]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.05] });
  const opacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

  const rays = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i * 360) / 16;
    const len = 18 + ((i % 4) * 3);
    const alpha = 0.35 + ((i % 4) * 0.12);
    return (
      <Rect key={`ray-${i}`} x={84} y={8} width={2} height={len} rx={1} fill="#1777CF" opacity={alpha} transform={`rotate(${angle} 85 85)`} />
    );
  });

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[styles.raysWrap, { transform: [{ rotate }, { scale }], opacity }]}>
        <Svg width={170} height={170} viewBox="0 0 170 170" fill="none">
          {rays}
        </Svg>
      </Animated.View>
      <View style={styles.centerWrap}>
        <Svg width={170} height={170} viewBox="0 0 170 170" fill="none">
          <Circle cx={85} cy={85} r={45} fill="#1777CF" />
          <G transform="translate(66,63)">
            <Svg width={38} height={40} viewBox="0 0 38 40" fill="none">
              <Path d="M1.61255 21.8482C1.02417 21.2598 1.02417 20.3024 1.61255 19.7144L15.9708 5.35612C16.1997 5.12724 16.1997 4.75614 15.9708 4.52757C15.7419 4.29838 15.3708 4.29868 15.1422 4.52757L0.783693 18.8858C-0.261231 19.9307 -0.261231 21.6315 0.783693 22.6767L4.40034 26.2931C4.51447 26.4072 4.66462 26.4646 4.81446 26.4646C4.96461 26.4646 5.11445 26.4075 5.22889 26.2931C5.45777 26.0642 5.45777 25.6931 5.22889 25.4645L1.61255 21.8482Z" fill="#FCFCFC" />
              <Path d="M13.1309 11.6709L4.26427 20.5375C4.03539 20.7664 4.03539 21.1375 4.26427 21.3663C4.37871 21.4805 4.52855 21.5378 4.6787 21.5378C4.82854 21.5378 4.97838 21.4808 5.09283 21.3663L13.9594 12.4998C14.1883 12.2709 14.1883 11.8998 13.9594 11.6709C13.7308 11.4423 13.3597 11.4423 13.1309 11.6709Z" fill="#FCFCFC" />
              <Path d="M18.4935 10.7326C19.1008 10.7326 19.7081 10.5015 20.1704 10.0392L21.9441 8.26552C22.8688 7.34083 22.8688 5.83631 21.9441 4.91163C21.0194 3.98694 19.5149 3.98694 18.5902 4.91163L16.8165 6.68531C16.3685 7.13331 16.122 7.72871 16.122 8.36226C16.122 8.9955 16.3685 9.5912 16.8165 10.0392C17.2789 10.5015 17.8862 10.7326 18.4935 10.7326ZM17.6451 7.51387L19.4188 5.74018C19.8866 5.27235 20.6477 5.27235 21.1152 5.74018C21.5831 6.20802 21.5831 6.96913 21.1152 7.43666L19.3416 9.21034C18.874 9.67818 18.1129 9.67818 17.6451 9.21034C17.4186 8.9839 17.2938 8.68269 17.2938 8.36226C17.2938 8.04182 17.4186 7.74031 17.6451 7.51387Z" fill="#FCFCFC" />
              <Path d="M34.6234 19.5743H28.9831L33.3288 15.2286C34.374 14.1834 34.374 12.4826 33.3288 11.4374L22.6763 0.785219C22.17 0.278931 21.4968 0 20.7809 0C20.0649 0 19.3917 0.278931 18.8851 0.785219L16.7977 2.87263C16.5691 3.10151 16.5691 3.4723 16.7977 3.70118C17.0266 3.93006 17.3977 3.93006 17.6263 3.70118L19.714 1.61377C19.9987 1.32874 20.3777 1.17188 20.7809 1.17188C21.1837 1.17188 21.5627 1.32874 21.8478 1.61377L32.5 12.266C33.0883 12.8543 33.0883 13.8114 32.5 14.3997L27.3257 19.574H12.5182L16.7773 15.315C17.0061 15.0864 17.0061 14.7153 16.7773 14.4864C16.5484 14.2575 16.1773 14.2575 15.9487 14.4864L10.8611 19.5743H9.02365C7.54538 19.5743 6.34298 20.7767 6.34298 22.2547V37.3194C6.34298 38.7974 7.54538 40.0001 9.02365 40.0001H34.6234C36.1016 40.0001 37.304 38.7974 37.304 37.3194V35.1539C37.304 34.8301 37.0419 34.5679 36.7181 34.5679C36.3946 34.5679 36.1322 34.8301 36.1322 35.1539V37.3194C36.1322 38.1513 35.4556 38.8282 34.6234 38.8282H9.02365C8.19174 38.8282 7.51486 38.1513 7.51486 37.3194V29.0977H36.1322V32.8101C36.1322 33.1336 36.3943 33.3961 36.7181 33.3961C37.0419 33.3961 37.304 33.1336 37.304 32.8101V22.255C37.304 20.7767 36.1016 19.5743 34.6234 19.5743ZM9.02365 20.7462H34.6234C35.4553 20.7462 36.1322 21.4231 36.1322 22.255V24.307H7.51486V22.255C7.51486 21.4231 8.19174 20.7462 9.02365 20.7462ZM7.51486 27.9258V25.4789H36.1322V27.9258H7.51486Z" fill="#FCFCFC" />
              <Path d="M29.7097 33.3957C29.2144 33.3957 28.8113 33.7989 28.8113 34.2942V36.5262C28.8113 37.0219 29.2144 37.4247 29.7097 37.4247H33.2601C33.7554 37.4247 34.1586 37.0219 34.1586 36.5262V34.2942C34.1586 33.7989 33.7554 33.3957 33.2601 33.3957H29.7097ZM32.9867 36.2528H29.9831V34.5676H32.9867V36.2528Z" fill="#FCFCFC" />
              <Path d="M19.0048 33.3957C18.5095 33.3957 18.1063 33.7989 18.1063 34.2942V36.5262C18.1063 37.0219 18.5095 37.4247 19.0048 37.4247H26.5142C27.0095 37.4247 27.4127 37.0219 27.4127 36.5262V34.2942C27.4127 33.7989 27.0095 33.3957 26.5142 33.3957H19.0048ZM26.2408 36.2528H19.2782V34.5676H26.2408V36.2528Z" fill="#FCFCFC" />
              <Path d="M11.8898 36.2541C11.5663 36.2541 11.3038 36.5166 11.3038 36.8401C11.3038 37.1639 11.5663 37.426 11.8898 37.426H15.6312C15.9547 37.426 16.2172 37.1639 16.2172 36.8401C16.2172 36.5166 15.9547 36.2541 15.6312 36.2541H11.8898Z" fill="#FCFCFC" />
            </Svg>
          </G>
        </Svg>
      </View>
    </View>
  );
};

const PaymentFlowCreditCardAwaitingApproval: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.subtitle}>Aguardando aprovação...</Text>
          <AwaitingIcon />
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
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 26,
    paddingBottom: 26,
    borderRadius: 18,
    backgroundColor: '#FCFCFC',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 25,
  },
  subtitle: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  iconWrap: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  raysWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentFlowCreditCardAwaitingApproval;
