import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type CardMenuProps = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onViewDetails: () => void;
  onSendWhatsApp: () => void;
  onSendEmail: () => void;
  anchorTop?: number;
  anchorRight?: number;
};

// Dimensões e offset conforme Figma 17
const MODAL_WIDTH = 260;
const MODAL_HEIGHT = 198;
const OFFSET_X = 8;
const OFFSET_Y = 8;
const EDGE = 8;

// Ícones originais do Figma (conforme especificação)
const EditIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2443 0.664045L4.75573 7.15258C4.614 7.29431 4.53438 7.48653 4.53438 7.68697V10.7099C4.53438 11.1273 4.87273 11.4656 5.29011 11.4656H8.31303C8.51347 11.4656 8.70569 11.386 8.84742 11.2443L15.336 4.75573C16.2213 3.87034 16.2213 2.43483 15.336 1.54944L14.4506 0.664045C13.5652 -0.221348 12.1297 -0.221348 11.2443 0.664045ZM14.2672 2.6182L14.3301 2.6894C14.5606 2.98586 14.5396 3.41454 14.2672 3.68697L7.99865 9.95416H6.04584V7.99984L12.313 1.73281C12.6082 1.43768 13.0867 1.43768 13.3818 1.73281L14.2672 2.6182Z"
      fill="#3A3F51"
    />
    <Path d="M7.58059 1.64112C7.58059 1.22375 7.24224 0.885393 6.82486 0.885393H3.77865L3.61474 0.888884C1.60389 0.974707 0 2.63207 0 4.66404V12.2213L0.00349111 12.3853C0.0893136 14.3961 1.74668 16 3.77865 16H11.336L11.4999 15.9965C13.5107 15.9107 15.1146 14.2533 15.1146 12.2213V8.50443L15.1095 8.41629C15.0659 8.04044 14.7464 7.7487 14.3589 7.7487C13.9415 7.7487 13.6031 8.08705 13.6031 8.50443V12.2213L13.5993 12.3546C13.5303 13.5447 12.5434 14.4885 11.336 14.4885H3.77865L3.64544 14.4847C2.45531 14.4157 1.51146 13.4288 1.51146 12.2213V4.66404L1.51531 4.53083C1.58427 3.3407 2.57124 2.39685 3.77865 2.39685H6.82486L6.91299 2.39177C7.28885 2.34811 7.58059 2.02869 7.58059 1.64112Z" fill="#3A3F51"/>
  </Svg>
);

const EyeIcon: React.FC = () => (
  <Svg width={23} height={14} viewBox="0 0 23 14" fill="none">
    <Path d="M11.5 0C5.46878 0 0.364891 6.3 0.149234 6.573C0.0524697 6.6954 0 6.84553 0 7C0 7.15447 0.0524697 7.3046 0.149234 7.427C0.364891 7.7 5.46878 14 11.5 14C17.5312 14 22.6351 7.7 22.8508 7.427C22.9475 7.3046 23 7.15447 23 7C23 6.84553 22.9475 6.6954 22.8508 6.573C22.6351 6.3 17.5312 0 11.5 0ZM11.5 12.6C7.02152 12.6 2.87371 8.4 1.65165 7C2.87371 5.6 7.01433 1.4 11.5 1.4C15.9857 1.4 20.1263 5.6 21.3484 7C20.1263 8.4 15.9857 12.6 11.5 12.6Z" fill="#3A3F51"/>
    <Path d="M15.0943 6.3C15.2129 6.29991 15.3297 6.27122 15.4342 6.21649C15.5387 6.16176 15.6277 6.0827 15.6932 5.98635C15.7586 5.89001 15.7986 5.77937 15.8095 5.66433C15.8204 5.54928 15.8019 5.43339 15.7556 5.327C15.3602 4.56023 14.7517 3.9169 13.9994 3.47018C13.2471 3.02345 12.3811 2.79126 11.5 2.8C10.3561 2.8 9.25902 3.2425 8.45014 4.03015C7.64127 4.8178 7.18685 5.88609 7.18685 7C7.18685 8.11391 7.64127 9.1822 8.45014 9.96985C9.25902 10.7575 10.3561 11.2 11.5 11.2C12.3811 11.2087 13.2471 10.9765 13.9994 10.5298C14.7517 10.0831 15.3602 9.43977 15.7556 8.673C15.8019 8.56661 15.8204 8.45072 15.8095 8.33568C15.7986 8.22063 15.7586 8.11 15.6932 8.01365C15.6277 7.9173 15.5387 7.83824 15.4342 7.78351C15.3297 7.72879 15.2129 7.7001 15.0943 7.7C14.9974 7.7099 14.8994 7.6986 14.8076 7.66692C14.7158 7.63525 14.6324 7.58399 14.5635 7.51691C14.4946 7.44982 14.4419 7.36859 14.4094 7.27916C14.3769 7.18973 14.3653 7.09436 14.3754 7C14.3653 6.90564 14.3769 6.81027 14.4094 6.72084C14.4419 6.63141 14.4946 6.55018 14.5635 6.48309C14.6324 6.41601 14.7158 6.36475 14.8076 6.33308C14.8994 6.3014 14.9974 6.2901 15.0943 6.3Z" fill="#3A3F51"/>
  </Svg>
);

const PaperIcon: React.FC = () => (
  <Svg width={20} height={13} viewBox="0 0 20 13" fill="none">
  <Path d="M19.995 0.377773C19.9963 0.369971 19.9987 0.362169 19.9993 0.354367C20.0009 0.330048 19.9998 0.305637 19.996 0.281549C19.9953 0.275372 19.9963 0.269521 19.9953 0.263344C19.9892 0.230551 19.978 0.198867 19.962 0.169396C19.9594 0.164195 19.9557 0.159319 19.9527 0.154117C19.952 0.153467 19.952 0.152492 19.9517 0.151517C19.9514 0.150866 19.9504 0.150542 19.95 0.149566L19.9434 0.138839C19.9232 0.110185 19.8983 0.0849328 19.8698 0.0640699C19.8635 0.0595188 19.8561 0.0569182 19.8495 0.0526922C19.8252 0.0366592 19.7987 0.0239701 19.7709 0.0149828C19.7586 0.0110818 19.7463 0.00913146 19.7336 0.00685589C19.6964 -0.000864814 19.658 -0.00207575 19.6204 0.0032798C19.6117 0.00458012 19.6034 0.00327997 19.5947 0.00523045L0.26589 3.9049C0.19868 3.9184 0.137383 3.95183 0.0903827 4.00064C0.0433822 4.04944 0.0129733 4.11123 0.00331529 4.17755C-0.00634273 4.24387 0.0052217 4.31149 0.0364269 4.37115C0.067632 4.4308 0.116954 4.4796 0.177647 4.51085L5.71597 7.36278L6.68731 12.6249C6.68664 12.6288 6.68764 12.633 6.68731 12.6369C6.68192 12.6753 6.68407 12.7143 6.69363 12.752C6.70129 12.7828 6.71361 12.8118 6.73026 12.8391C6.73359 12.8443 6.73359 12.8505 6.73726 12.8557C6.73826 12.8573 6.73992 12.8586 6.74125 12.8599C6.74558 12.8661 6.75157 12.8709 6.75657 12.8771C6.77222 12.896 6.78854 12.9132 6.80718 12.9278C6.81018 12.9301 6.81218 12.9337 6.81551 12.936C6.8205 12.9395 6.82616 12.9405 6.83116 12.9438C6.85147 12.9568 6.87245 12.9675 6.89476 12.9759C6.90375 12.9792 6.91208 12.9831 6.9214 12.9857C6.95137 12.9941 6.98234 13 7.01364 13H7.01464L7.01863 12.9994C7.06598 13.0012 7.11317 12.993 7.157 12.9754C7.20084 12.9579 7.2403 12.9313 7.27271 12.8976L10.9619 10.4966L14.8246 12.9477C14.8666 12.9741 14.9141 12.9911 14.9637 12.9972C15.0132 13.0034 15.0636 12.9987 15.111 12.9834C15.1585 12.968 15.2018 12.9424 15.2377 12.9084C15.2736 12.8744 15.3012 12.8329 15.3185 12.7871L19.979 0.437588C19.9834 0.426435 19.987 0.415037 19.99 0.403454C19.9913 0.398578 19.9917 0.393702 19.9927 0.38915L19.995 0.377773ZM16.1383 2.45276L8.14881 8.18751C8.13582 8.19694 8.1255 8.20864 8.11418 8.21969C8.10985 8.22359 8.10552 8.22684 8.10186 8.23107C8.09495 8.23847 8.0884 8.24617 8.08221 8.25415C8.07622 8.26195 8.07155 8.27008 8.06623 8.2782C8.05391 8.29771 8.04358 8.31787 8.03559 8.33932C8.03393 8.34355 8.03126 8.3468 8.02993 8.35102C8.0296 8.35232 8.02827 8.35297 8.02793 8.35427L7.1122 11.2595L6.38662 7.32897L16.1383 2.45276ZM7.62834 11.885L8.53608 8.95795L9.9493 9.85485L10.3535 10.1113L8.98029 11.005L7.62834 11.885ZM17.3304 1.12611L6.01766 6.78283L1.30915 4.35838L17.3304 1.12611ZM14.838 12.1808L9.70821 8.92609L8.93134 8.43294L18.9724 1.22526L14.838 12.1808Z" fill="#3A3F51"/>
</Svg>
);

const CardMenu: React.FC<CardMenuProps> = ({
  visible,
  onClose,
  onEdit,
  onViewDetails,
  onSendWhatsApp,
  onSendEmail,
  anchorTop,
  anchorRight,
}) => {
  React.useEffect(() => {
    if (visible) {
      console.log('[CardMenu] aberto – rótulo esperado: "Editar agendamento"');
    }
  }, [visible]);
  const [computedTop, setComputedTop] = React.useState<number>(anchorTop ?? 160);
  const [computedRight, setComputedRight] = React.useState<number>(anchorRight ?? 16);
  const lastClickRef = React.useRef<{ x: number; y: number } | null>(null);

  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const handler = (e: any) => {
        if (e && typeof e.clientX === 'number' && typeof e.clientY === 'number') {
          lastClickRef.current = { x: e.clientX, y: e.clientY };
        }
      };
      document.addEventListener('click', handler, true);
      return () => document.removeEventListener('click', handler, true);
    }
  }, []);

  React.useEffect(() => {
    if (!visible) return;
    if (Platform.OS === 'web' && typeof document !== 'undefined' && typeof window !== 'undefined') {
      const activeEl = document.activeElement as any;
      let rect: DOMRect | null = null;
      if (activeEl && typeof activeEl.getBoundingClientRect === 'function') {
        rect = activeEl.getBoundingClientRect();
      }

      let nextTop = anchorTop ?? 160;
      let nextRight = anchorRight ?? 16;
      const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

      if (rect) {
        const winH = (window as any).innerHeight;
        const winW = (window as any).innerWidth;
        nextTop = clamp(rect.top - OFFSET_Y, EDGE, winH - MODAL_HEIGHT - EDGE);
        nextRight = clamp(winW - rect.right + OFFSET_X, EDGE, winW - EDGE);
      } else if (lastClickRef.current) {
        const winH = (window as any).innerHeight;
        const winW = (window as any).innerWidth;
        nextTop = clamp(lastClickRef.current.y - MODAL_HEIGHT * 0.5, EDGE, winH - MODAL_HEIGHT - EDGE);
        nextRight = clamp(winW - lastClickRef.current.x + OFFSET_X, EDGE, winW - EDGE);
      }

      setComputedTop(nextTop);
      setComputedRight(nextRight);
    } else {
      setComputedTop(anchorTop ?? computedTop);
      setComputedRight(anchorRight ?? computedRight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, anchorTop, anchorRight]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={[styles.container, { top: computedTop, right: computedRight }]}
              accessibilityRole="menu" accessibilityLabel="Menu do agendamento">
          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => { onEdit(); onClose(); }}
            accessibilityRole="menuitem" accessibilityLabel="Editar Fluxo de vendas">
            <EditIcon />
            <Text style={styles.text}>Editar Fluxo de vendas</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => { onViewDetails(); onClose(); }}
            accessibilityRole="menuitem" accessibilityLabel="Visualizar detalhes da venda">
            <EyeIcon />
            <Text style={styles.text}>Visualizar detalhes da venda</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => { onSendWhatsApp(); onClose(); }}
            accessibilityRole="menuitem" accessibilityLabel="Enviar fluxo de pagamento no WhatsApp">
            <PaperIcon />
            <Text style={styles.text}>Enviar fluxo de pagamento{'\n'}no  WhatsApp</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.row} activeOpacity={0.8} onPress={() => { onSendEmail(); onClose(); }}
            accessibilityRole="menuitem" accessibilityLabel="Enviar fluxo de pagamento no e-mail">
            <PaperIcon />
            <Text style={styles.text}>Enviar fluxo de pagamento{'\n'}no  e-mail</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  container: {
    position: 'absolute',
    width: MODAL_WIDTH,
    minHeight: MODAL_HEIGHT,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    rowGap: 15,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  row: {
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  text: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 17,
  },
  separator: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
    width: MODAL_WIDTH - 30,
  },
});

export default CardMenu;
