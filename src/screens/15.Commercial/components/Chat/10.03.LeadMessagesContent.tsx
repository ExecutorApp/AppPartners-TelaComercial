// ========================================
// Conteudo de Mensagens do Lead
// Apenas area de mensagens (sem header/input)
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React from 'react';
import {
  View,                                   //......Container basico
  StyleSheet,                             //......Estilos
  Dimensions,                             //......Dimensoes da tela
  Image,                                  //......Imagem
  Platform,                               //......Plataforma
} from 'react-native';

// ========================================
// Imports de Componentes
// ========================================
import MessageList from './components/Messages/08.02.MessageList';

// ========================================
// Imports de Tipos
// ========================================
import { WhatsAppMessage } from './types/08.types.whatsapp';

// ========================================
// Imports de Assets
// ========================================
import chatBackgroundImage from './assets/chat-background.png';
import { chatBackgroundBase64 } from './assets/chatBackgroundBase64';

// ========================================
// Constantes
// ========================================
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ========================================
// Interface de Props
// ========================================
interface LeadMessagesContentProps {
  messages: WhatsAppMessage[];            //......Lista de mensagens
  onMessageLongPress: (message: WhatsAppMessage) => void;
  onImagePress: (imageUrl: string, message?: WhatsAppMessage) => void;
  onAudioRetry: (message: WhatsAppMessage) => Promise<boolean>;
}

// ========================================
// Componente Principal
// ========================================
const LeadMessagesContent: React.FC<LeadMessagesContentProps> = ({
  messages,
  onMessageLongPress,
  onImagePress,
  onAudioRetry,
}) => {
  // ========================================
  // Render Principal
  // ========================================
  return (
    <View style={styles.container}>
      {/* Imagem de Fundo */}
      {Platform.OS === 'web' ? (
        <img
          src={chatBackgroundBase64}
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <Image
          source={chatBackgroundImage}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}

      {/* Lista de Mensagens */}
      <View style={styles.messagesContent}>
        <MessageList
          messages={messages}
          onMessageLongPress={onMessageLongPress}
          onImagePress={onImagePress}
          onAudioRetry={onAudioRetry}
        />
      </View>
    </View>
  );
};

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,                              //......Ocupa todo espaco
    width: SCREEN_WIDTH,                  //......Largura da tela
    position: 'relative',                 //......Posicao relativa
  },

  // Imagem de fundo
  backgroundImage: {
    position: 'absolute',                 //......Posicao absoluta
    top: 0,                               //......Topo
    left: 0,                              //......Esquerda
    right: 0,                             //......Direita
    bottom: 0,                            //......Fundo
    width: '100%',                        //......Largura total
    height: '100%',                       //......Altura total
    zIndex: 0,                            //......Atras de tudo
  },

  // Conteudo das mensagens
  messagesContent: {
    flex: 1,                              //......Ocupa espaco
    backgroundColor: 'transparent',       //......Fundo transparente
    zIndex: 1,                            //......Acima do fundo
  },
});

// ========================================
// Export
// ========================================
export default LeadMessagesContent;
