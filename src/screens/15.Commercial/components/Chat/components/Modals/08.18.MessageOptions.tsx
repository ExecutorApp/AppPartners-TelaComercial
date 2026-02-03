// ========================================
// Componente MessageOptions
// Menu de opcoes da mensagem (long press)
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useCallback,                            //......Hook de callback
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  Modal,                                  //......Modal nativo
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
} from 'react-native';                    //......Biblioteca RN
import Svg, {                             //......SVG core
  Path,                                   //......Path SVG
} from 'react-native-svg';                //......Biblioteca SVG

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import { WhatsAppMessage } from '../../types/08.types.whatsapp';

// ========================================
// Interface de Props
// ========================================
interface MessageOptionsProps {
  visible: boolean;                       //......Visibilidade
  message: WhatsAppMessage | null;        //......Mensagem selecionada
  onClose: () => void;                    //......Handler fechar
  onReply: () => void;                    //......Handler responder
  onCopy: () => void;                     //......Handler copiar
  onForward: () => void;                  //......Handler encaminhar
  onDelete: () => void;                   //......Handler excluir
}

// ========================================
// Icone de Responder
// ========================================
const ReplyIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 17L4 12L9 7"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M20 18V15C20 13.9391 19.5786 12.9217 18.8284 12.1716C18.0783 11.4214 17.0609 11 16 11H4"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// Icone de Copiar
// ========================================
const CopyIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 9H11C9.89543 9 9 9.89543 9 11V20C9 21.1046 9.89543 22 11 22H20C21.1046 22 22 21.1046 22 20V11C22 9.89543 21.1046 9 20 9Z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M5 15H4C3.46957 15 2.96086 14.7893 2.58579 14.4142C2.21071 14.0391 2 13.5304 2 13V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H13C13.5304 2 14.0391 2.21071 14.4142 2.58579C14.7893 2.96086 15 3.46957 15 4V5"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// Icone de Encaminhar
// ========================================
const ForwardIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 7L20 12L15 17"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M4 18V15C4 13.9391 4.42143 12.9217 5.17157 12.1716C5.92172 11.4214 6.93913 11 8 11H20"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// Icone de Excluir
// ========================================
const DeleteIcon: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H5H21"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path
      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
    />
    <Path d="M10 11V17" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Path d="M14 11V17" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

// ========================================
// Configuracao dos Itens
// ========================================
const MESSAGE_OPTIONS = [
  { id: 'reply', label: 'Responder', icon: ReplyIcon, color: ChatColors.voiceButton },
  { id: 'copy', label: 'Copiar', icon: CopyIcon, color: ChatColors.attachButton },
  { id: 'forward', label: 'Encaminhar', icon: ForwardIcon, color: ChatColors.voiceButton },
  { id: 'delete', label: 'Excluir', icon: DeleteIcon, color: ChatColors.error },
];

// ========================================
// Componente Principal MessageOptions
// ========================================
const MessageOptions: React.FC<MessageOptionsProps> = ({
  visible,                                //......Visibilidade
  message,                                //......Mensagem
  onClose,                                //......Handler fechar
  onReply,                                //......Handler responder
  onCopy,                                 //......Handler copiar
  onForward,                              //......Handler encaminhar
  onDelete,                               //......Handler excluir
}) => {
  // ========================================
  // Handler de Selecao
  // ========================================
  const handleSelect = useCallback((id: string) => {
    switch (id) {
      case 'reply':                       //......Responder
        onReply();                        //......Chama callback
        break;
      case 'copy':                        //......Copiar
        onCopy();                         //......Chama callback
        break;
      case 'forward':                     //......Encaminhar
        onForward();                      //......Chama callback
        break;
      case 'delete':                      //......Excluir
        onDelete();                       //......Chama callback
        break;
    }
    onClose();                            //......Fecha menu
  }, [onClose, onReply, onCopy, onForward, onDelete]);

  // ========================================
  // Verificar se pode copiar
  // ========================================
  const canCopy = message?.type === 'text';

  // ========================================
  // Render Principal
  // ========================================
  return (
    <Modal
      visible={visible}                   //......Visibilidade
      transparent                         //......Fundo transparente
      animationType="fade"                //......Animacao fade
      onRequestClose={onClose}            //......Handler fechar
    >
      {/* Overlay */}
      <Pressable
        style={styles.overlay}            //......Estilo overlay
        onPress={onClose}                 //......Handler fechar
      />

      {/* Container do Menu */}
      <View style={styles.container}>
        {/* Lista de Opcoes */}
        <View style={styles.optionsContainer}>
          {MESSAGE_OPTIONS.map((option) => {
            // Pular copiar se nao for texto
            if (option.id === 'copy' && !canCopy) {
              return null;
            }

            const IconComponent = option.icon;
            return (
              <Pressable
                key={option.id}           //......Chave unica
                style={({ pressed }) => [
                  styles.optionButton,    //......Estilo base
                  pressed && styles.optionButtonPressed,
                ]}
                onPress={() => handleSelect(option.id)}
              >
                {/* Icone */}
                <IconComponent
                  color={option.color}    //......Cor
                  size={22}               //......Tamanho
                />

                {/* Label */}
                <Text
                  style={[
                    styles.optionLabel,   //......Estilo base
                    option.id === 'delete' && styles.deleteLabel,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Botao Cancelar */}
        <Pressable
          style={styles.cancelButton}     //......Estilo botao
          onPress={onClose}               //......Handler fechar
        >
          <Text style={styles.cancelText}>
            Cancelar
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// ========================================
// Export Default
// ========================================
export default MessageOptions;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1,                              //......Ocupa espaco
    backgroundColor: ChatColors.modalBackground,
    justifyContent: 'flex-end',           //......Alinha embaixo
  },

  // Container principal
  container: {
    paddingHorizontal: 12,                //......Padding horizontal
    paddingBottom: 32,                    //......Padding inferior
  },

  // Container das opcoes
  optionsContainer: {
    backgroundColor: ChatColors.white,    //......Fundo branco
    borderRadius: 16,                     //......Bordas
    overflow: 'hidden',                   //......Corta overflow
  },

  // Botao de opcao
  optionButton: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    paddingVertical: 16,                  //......Padding vertical
    paddingHorizontal: 20,                //......Padding horizontal
    gap: 16,                              //......Espaco entre
    borderBottomWidth: 1,                 //......Borda inferior
    borderBottomColor: ChatColors.divider, //....Cor borda
  },

  // Botao pressionado
  optionButtonPressed: {
    backgroundColor: ChatColors.chatBackground,
  },

  // Label da opcao
  optionLabel: {
    fontFamily: 'Inter_500Medium',        //......Fonte media
    fontSize: 16,                         //......Tamanho fonte
    color: ChatColors.incomingText,       //......Cor texto
  },

  // Label de delete
  deleteLabel: {
    color: ChatColors.error,              //......Cor vermelha
  },

  // Botao cancelar
  cancelButton: {
    marginTop: 8,                         //......Margem superior
    paddingVertical: 16,                  //......Padding vertical
    backgroundColor: ChatColors.white,    //......Fundo branco
    borderRadius: 16,                     //......Bordas
    alignItems: 'center',                 //......Centraliza
  },

  // Texto cancelar
  cancelText: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte bold
    fontSize: 16,                         //......Tamanho fonte
    color: ChatColors.voiceButton,        //......Cor azul
  },
});
