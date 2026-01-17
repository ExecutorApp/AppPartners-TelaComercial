import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type Props = {
  visible: boolean;
  onClose: () => void;
  anchor?: { x: number; y: number; width: number; height: number };
};

const AudioIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M18.7495 14.2266V16.9362C18.7505 17.1878 18.6988 17.4368 18.5979 17.6673C18.4969 17.8977 18.3488 18.1046 18.1631 18.2747C17.9774 18.4448 17.7581 18.5742 17.5194 18.6548C17.2806 18.7354 17.0276 18.7653 16.7766 18.7427C13.9917 18.4401 11.3168 17.4897 8.96677 15.9679C6.78032 14.5812 4.92657 12.731 3.53717 10.5487C2.00713 8.19235 1.05474 5.50942 0.75718 2.71727C0.734833 2.46761 0.764787 2.21604 0.845135 1.97857C0.925483 1.74109 1.05447 1.5229 1.22388 1.33788C1.3933 1.15285 1.59944 1.00504 1.8292 0.903851C2.05895 0.802659 2.30729 0.750297 2.55842 0.750097H5.27322C5.7126 0.745559 6.13863 0.900719 6.47183 1.18663C6.80502 1.47254 7.02263 1.86967 7.08405 2.30393C7.19868 3.17121 7.41125 4.02275 7.71769 4.84232C7.83945 5.16564 7.86579 5.51702 7.79358 5.85483C7.72137 6.19263 7.55365 6.50269 7.31028 6.74826L6.15994 7.89641C7.4482 10.1576 9.32403 12.0299 11.5895 13.3157L12.7399 12.1676C12.9859 11.9246 13.2966 11.7572 13.635 11.6852C13.9735 11.6131 14.3255 11.6394 14.6494 11.7609C15.4706 12.0668 16.3237 12.2789 17.1927 12.3934C17.6322 12.4552 18.0337 12.6761 18.3208 13.0141C18.6078 13.3521 18.7604 13.7836 18.7495 14.2266V14.2266Z" stroke="#3A3F51" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const VideoIcon = () => (
  <Svg width={23} height={15} viewBox="0 0 23 15" fill="none">
    <Path d="M21.586 2.644L14.956 7.379L21.586 12.114V2.644Z" stroke="#3A3F51" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2.644 0.75H13.062C13.3107 0.75 13.557 0.79899 13.7868 0.894172C14.0166 0.989355 14.2254 1.12887 14.4013 1.30474C14.5771 1.48061 14.7166 1.68941 14.8118 1.9192C14.907 2.14899 14.956 2.39528 14.956 2.644V12.115C14.956 12.3637 14.907 12.61 14.8118 12.8398C14.7166 13.0696 14.5771 13.2784 14.4013 13.4543C14.2254 13.6301 14.0166 13.7696 13.7868 13.8648C13.557 13.96 13.3107 14.009 13.062 14.009H2.644C2.39528 14.009 2.14899 13.96 1.9192 13.8648C1.68941 13.7696 1.48061 13.6301 1.30474 13.4543C0.949546 13.0991 0.75 12.6173 0.75 12.115V2.644C0.75 2.14168 0.949546 1.65993 1.30474 1.30474C1.65993 0.949546 2.14168 0.75 2.644 0.75Z" stroke="#3A3F51" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function DiscountChatCallModal({ visible, onClose, anchor }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableWithoutFeedback>
          <View style={[styles.container, anchor ? { position: 'absolute', top: anchor.y + anchor.height - 35, left: Math.max(10, anchor.x - 245 + 10) } : null]}>
            <View style={styles.row}>
              <AudioIcon />
              <Text style={styles.text}>Chamada de áudio</Text>
            </View>
            <View style={styles.dividerWrapper}>
              <View style={styles.divider} />
            </View>
            <View style={styles.row}>
              <VideoIcon />
              <Text style={styles.text}>Chamada de vídeo</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: 223,
    padding: 15,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    ...Platform.select({
      ios: {
        shadowColor: '#676E76',
        shadowOpacity: 0.08,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
      default: {},
    }),
  },
  row: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  text: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  dividerWrapper: {
    alignSelf: 'stretch',
    height: 20,
    paddingTop: 1,
    paddingBottom: 1,
    justifyContent: 'center',
  },
  divider: {
    height: 0,
    borderTopWidth: 0.5,
    borderColor: '#D8E0F0',
  },
});
