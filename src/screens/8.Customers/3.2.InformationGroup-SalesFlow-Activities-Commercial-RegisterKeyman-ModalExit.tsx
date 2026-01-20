import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// ========================================
// TIPOS
// ========================================

type Props = {
  visible: boolean; //........Visibilidade do modal
  onCancel: () => void; //....Callback ao cancelar
  onConfirm: () => void; //...Callback ao confirmar saida
};

// ========================================
// ICONE SVG
// ========================================

// Icone de alerta (azul #1777CF)
const AlertIcon: React.FC = () => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Path
      d="M28.876 18.072C28.876 11.7858 23.7727 6.67149 17.5 6.67149C11.2273 6.67149 6.12404 11.7858 6.12404 18.072V27.0533H28.8759V18.072H28.876ZM17.506 23.1138C16.6974 23.1138 16.1301 22.5453 16.1301 21.8438C16.1301 21.1301 16.6974 20.5979 17.506 20.5979C18.3147 20.5979 18.8699 21.1301 18.8699 21.8438C18.8699 22.5453 18.3147 23.1138 17.506 23.1138ZM18.4113 19.2355H16.5888L16.1422 13.853H18.8699L18.4113 19.2355ZM16.4746 0H18.5254V3.63088H16.4746V0ZM26.5719 6.97478L29.1334 4.40775L30.5833 5.86078L28.0218 8.42781L26.5719 6.97478ZM4.41164 5.85845L5.86154 4.40542L8.42304 6.97245L6.97314 8.42548L4.41164 5.85845ZM31.377 14.3065H35V16.3618H31.377V14.3065ZM0 14.3065H3.62305V16.3618H0V14.3065ZM29.1885 29.04H5.8115C3.7208 29.04 2.01988 30.7446 2.01988 32.8398V35H32.9801V32.8398C32.9801 30.7446 31.2792 29.04 29.1885 29.04Z"
      fill="#1777CF"
    />
  </Svg>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const ModalAlertLeaveKeyman: React.FC<Props> = ({ visible, onCancel, onConfirm }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay escurecido */}
      <View style={styles.overlay}>
        {/* Card do modal */}
        <View style={styles.card}>
          {/* Container do icone */}
          <View style={styles.iconBox}>
            <AlertIcon />
          </View>

          {/* Bloco de texto */}
          <View style={styles.textBlock}>
            <Text style={styles.title}>Deseja realmente sair?</Text>
            <Text style={styles.subtitle}>
              Ao sair, seu cadastro não será salvo. Confirmar saída?
            </Text>
          </View>

          {/* Botoes de acao */}
          <View style={styles.actions}>
            {/* Botao Cancelar */}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancelar"
            >
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Botao Sair */}
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel="Sair"
            >
              <Text style={styles.leaveText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Overlay escurecido
  overlay: {
    flex: 1, //............................Ocupa tela inteira
    backgroundColor: 'rgba(0,0,0,0.25)', //.Fundo semi-transparente
    justifyContent: 'center', //...........Centraliza verticalmente
    alignItems: 'center', //...............Centraliza horizontalmente
  },

  // Card do modal
  card: {
    display: 'flex', //.............Layout flex
    flexDirection: 'column', //....Direcao vertical
    alignItems: 'center', //.......Centraliza itens
    rowGap: 25, //..................Espaco entre elementos
    borderRadius: 18, //............Bordas arredondadas
    backgroundColor: '#FCFCFC', //..Fundo branco
    paddingTop: 30, //..............Espaco superior
    paddingHorizontal: 15, //......Espaco horizontal
    paddingBottom: 20, //..........Espaco inferior
    width: 300, //..................Largura fixa
    minHeight: 240, //..............Altura minima
    shadowColor: '#000', //........Cor da sombra
    shadowOpacity: Platform.OS === 'web' ? 0.12 : 0.15, //..Opacidade da sombra
    shadowRadius: 12, //...........Raio da sombra
    shadowOffset: { width: 0, height: 8 }, //..Offset da sombra
  },

  // Container do icone
  iconBox: {
    width: 80, //..................Largura fixa
    height: 80, //.................Altura fixa
    borderRadius: 12, //...........Bordas arredondadas
    alignItems: 'center', //.......Centraliza horizontalmente
    justifyContent: 'center', //...Centraliza verticalmente
    backgroundColor: '#F4F4F4', //..Fundo cinza claro
  },

  // Bloco de texto
  textBlock: {
    alignSelf: 'stretch', //.......Ocupa largura total
    width: 270, //..................Largura fixa
    alignItems: 'center', //.......Centraliza texto
  },

  // Titulo do modal
  title: {
    textAlign: 'center', //........Texto centralizado
    color: '#3A3F51', //...........Cor do texto
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...............Tamanho da fonte
    marginBottom: 6, //............Espaco inferior
  },

  // Subtitulo do modal
  subtitle: {
    textAlign: 'center', //........Texto centralizado
    color: '#7D8592', //...........Cor do texto secundario
    fontFamily: 'Inter_500Medium', //..Fonte medium
    fontSize: 14, //...............Tamanho da fonte
    lineHeight: 20, //.............Altura da linha
  },

  // Container dos botoes
  actions: {
    flexDirection: 'row', //........Layout horizontal
    alignItems: 'center', //.......Alinha verticalmente
    alignSelf: 'stretch', //.......Ocupa largura total
    columnGap: 10, //...............Espaco entre botoes
    width: 270, //..................Largura fixa
  },

  // Botao Cancelar
  cancelButton: {
    flex: 1, //....................Ocupa metade do espaco
    height: 42, //.................Altura fixa
    borderRadius: 10, //...........Bordas arredondadas
    backgroundColor: '#F4F4F4', //..Fundo cinza
    borderWidth: 1, //.............Largura da borda
    borderColor: '#D8E0F0', //....Cor da borda
    alignItems: 'center', //.......Centraliza horizontalmente
    justifyContent: 'center', //...Centraliza verticalmente
  },

  // Botao Sair
  leaveButton: {
    flex: 1, //....................Ocupa metade do espaco
    height: 42, //.................Altura fixa
    borderRadius: 10, //...........Bordas arredondadas
    backgroundColor: '#1777CF', //..Fundo azul
    alignItems: 'center', //.......Centraliza horizontalmente
    justifyContent: 'center', //...Centraliza verticalmente
  },

  // Texto do botao Cancelar
  cancelText: {
    color: '#3A3F51', //...........Cor do texto
    fontSize: 16, //...............Tamanho da fonte
    fontFamily: 'Inter_500Medium', //..Fonte medium
  },

  // Texto do botao Sair
  leaveText: {
    color: '#FCFCFC', //...........Cor branca
    fontSize: 16, //...............Tamanho da fonte
    fontFamily: 'Inter_500Medium', //..Fonte medium
  },
});

export default ModalAlertLeaveKeyman;
