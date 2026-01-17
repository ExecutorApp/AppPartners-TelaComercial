// src/screens/10.Vendas/12.04.Discount-Chat-Image.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback, Modal, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

/**
 * Componente responsável por renderizar a imagem com badge de tempo
 * dentro do chat de desconto, seguindo especificações do Figma
 */
export type ChatImageMessageProps = {
  uri: string;
  timestamp: string;
  isUser?: boolean;
};

export const ChatImageMessage: React.FC<ChatImageMessageProps> = ({ uri, timestamp, isUser = true }) => {
  const [open, setOpen] = useState(false);
  const [bars, setBars] = useState(true);
  const insets = useSafeAreaInsets();
  const { width: screenW, height: screenH } = Dimensions.get('window');
  const [ratio, setRatio] = useState<number | null>(null); // h/w

  useEffect(() => {
    if (open) {
      Image.getSize(
        uri,
        (w, h) => setRatio(h / w),
        () => setRatio(null)
      );
    }
  }, [open, uri]);

  const containerStyle = [styles.imageContainer, { borderColor: isUser ? '#1777CF' : '#D8E0F0' }];
  const timeStyle = [styles.timeBadge, { backgroundColor: isUser ? '#1777CF' : '#3A3F51' }];

  return (
    <>
      <TouchableOpacity activeOpacity={0.8} onPress={() => { setOpen(true); setBars(true); }}>
        <View style={containerStyle}>
          <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          <View style={timeStyle}>
            <Text style={styles.timeText}>{timestamp}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={open} transparent={false} animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.viewerRoot}>
          <TouchableWithoutFeedback onPress={() => setBars(prev => !prev)}>
            <Image
              source={{ uri }}
              style={
                ratio
                  ? [styles.viewerImage, { width: screenW, height: Math.round(screenW * ratio) }]
                  : [styles.viewerImage, { width: screenW, height: screenH }]
              }
              resizeMode={ratio ? 'cover' : 'contain'}
            />
          </TouchableWithoutFeedback>

          {bars && (
            <View style={[styles.topBar, { paddingTop: insets.top }]}>
              <View style={styles.topBarRow}>
                <TouchableOpacity style={styles.topBtnBox} onPress={() => setOpen(false)} activeOpacity={0.8}>
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path d="M8 15L1 8M1 8L8 1M1 8L15 8" stroke="#FCFCFC" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                  <Text style={styles.topBtnText}>Voltar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.topBtnBox} onPress={() => Alert.alert('Baixar', 'Funcionalidade de download')} activeOpacity={0.8}>
                  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                    <Path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.69166 14.3093V11.4107C1.69166 10.9443 1.31299 10.5654 0.846533 10.5654C0.379549 10.5654 0 10.9434 0 11.4107V14.3497C0 15.2603 0.74063 16 1.65097 16H14.3504C15.2602 16 16 15.2593 16 14.3497V11.4107C16 10.9443 15.6213 10.5654 15.1549 10.5654C14.6884 10.5654 14.3097 10.9443 14.3097 11.4107V14.3093H1.69166ZM7.15556 9.01737V0.845438C7.15556 0.378875 7.53408 0 8.00069 0C8.4673 0 8.84581 0.378875 8.84581 0.845438V9.01741L11.4586 6.40428C11.7885 6.07437 12.3245 6.07447 12.6545 6.40413C12.9845 6.73375 12.9844 7.27013 12.6546 7.59991L8.5987 11.6559C8.44002 11.8146 8.22509 11.9036 8.00069 11.9036C7.77629 11.9036 7.56139 11.8146 7.40268 11.6559L3.34673 7.59984C3.01711 7.27019 3.0173 6.73453 3.34638 6.40456C3.67603 6.07403 4.21276 6.07422 4.54275 6.40422L7.15556 9.01737Z"
                      fill="#FCFCFC"
                    />
                  </Svg>
                  <Text style={styles.topBtnText}>Baixar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBox} onPress={() => setOpen(false)} activeOpacity={0.8}>
                  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
                    <Rect width={35} height={35} rx={8} fill="#F4F4F4" />
                    <Rect width={35} height={35} rx={8} stroke="#EDF2F6" />
                    <Path d="M23.655 11.7479C23.2959 11.4179 22.7339 11.4173 22.374 11.7466L17.5 16.2065L12.626 11.7466C12.2661 11.4173 11.7041 11.4179 11.345 11.7479L11.2916 11.797C10.9022 12.1549 10.9029 12.757 11.2931 13.114L16.0863 17.5L11.2931 21.886C10.9029 22.243 10.9022 22.8451 11.2916 23.203L11.345 23.2521C11.7041 23.5821 12.2661 23.5827 12.626 23.2534L17.5 18.7935L22.374 23.2534C22.7339 23.5827 23.2959 23.5821 23.655 23.2521L23.7084 23.203C24.0978 22.8451 24.0971 22.243 23.7069 21.886L18.9137 17.5L23.7069 13.114C24.0971 12.757 24.0978 12.1549 23.7084 11.797L23.655 11.7479Z" fill="#3A3F51" />
                  </Svg>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {bars && (
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom }]} />
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  viewerRoot: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewerImage: {
    alignSelf: 'center',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1777CF',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    gap: 15,
  },
  topBtnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#FCFCFC',
    flex: 1,
  },
  topBtnText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  closeBox: {
    width: 35,
    height: 35,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: '#1777CF',
  },
  // Container principal da imagem com borda arredondada azul (slim)
  imageContainer: {
    width: 170,
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#1777CF',
    position: 'relative',
    overflow: 'hidden',
  },

  // Estilos da imagem que preenche o container
  image: {
    width: '100%',
    height: '100%',
  },

  // Badge azul com o tempo no canto inferior direito
  timeBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1777CF',
    borderTopLeftRadius: 12,
    paddingHorizontal: 10,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto do tempo exibido dentro do badge
  timeText: {
    color: '#FCFCFC',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
});
