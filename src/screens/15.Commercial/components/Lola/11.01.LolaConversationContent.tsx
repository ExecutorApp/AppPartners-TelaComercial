// ========================================
// Conteudo da Conversa com Lola
// Apenas area de mensagens (sem header/input)
// ========================================

// ========================================
// Imports React
// ========================================
import React, {
  useState,                               //......Hook de estado
  useEffect,                              //......Hook de efeito
  useRef,                                 //......Hook de referencia
  useCallback,                            //......Hook de callback
} from 'react';

// ========================================
// Imports React Native
// ========================================
import {
  View,                                   //......Container
  ScrollView,                             //......Scroll
  StyleSheet,                             //......Estilos
  Dimensions,                             //......Dimensoes
  Image,                                  //......Imagem
  Platform,                               //......Plataforma
} from 'react-native';
import { Audio } from 'expo-av';          //......Audio Expo

// ========================================
// Imports de Componentes
// ========================================
import LolaAvatar from '../AIAvatar/09.01.LolaAvatar';
import AvatarChatBubbles, { AvatarMessage } from '../AIAvatar/09.03.AvatarChatBubbles';

// ========================================
// Imports de Services
// ========================================
import aiService from '../../services/aiService';
import lipSyncService, { LipSyncCue } from '../../services/lipSyncService';

// ========================================
// Imports de Assets
// ========================================
import chatBackgroundImage from '../Chat/assets/chat-background.png';
import { chatBackgroundBase64 } from '../Chat/assets/chatBackgroundBase64';

// ========================================
// Constantes
// ========================================
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ========================================
// Cores
// ========================================
const COLORS = {
  background: '#F5F7FA',                  //......Fundo cinza claro
};

// ========================================
// Interface de Props
// ========================================
interface LolaConversationContentProps {
  leadId: string;                         //......ID do lead
  leadName: string;                       //......Nome do lead
  leadPhone?: string;                     //......Telefone
  onSendMessage?: (text: string) => void; //......Handler enviar mensagem
}

// ========================================
// Componente Principal
// ========================================
const LolaConversationContent: React.FC<LolaConversationContentProps> = ({
  leadId,
  leadName,
  leadPhone,
  onSendMessage,
}) => {
  // ========================================
  // Estados
  // ========================================
  const [messages, setMessages] = useState<AvatarMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTalking, setIsTalking] = useState(false);

  // Estados de Lip Sync
  const [lipSyncData, setLipSyncData] = useState<LipSyncCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // ========================================
  // Refs
  // ========================================
  const soundRef = useRef<Audio.Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // ========================================
  // Mensagem de Boas-Vindas
  // ========================================
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: AvatarMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Ola! Sou a Lola, sua assistente de vendas. Como posso ajudar com ${leadName}?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [leadName, messages.length]);

  // ========================================
  // Cleanup
  // ========================================
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // ========================================
  // Render
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

      {/* Area do Avatar */}
      <View style={styles.avatarArea}>
        <LolaAvatar
          isListening={isListening}
          isTalking={isTalking}
          lipSyncData={lipSyncData}
          currentTime={currentTime}
          size="large"
        />
      </View>

      {/* Mensagens */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        <AvatarChatBubbles messages={messages} />
      </ScrollView>
    </View>
  );
};

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,                              //......Ocupa tudo
    width: SCREEN_WIDTH,                  //......Largura da tela
    backgroundColor: COLORS.background,   //......Fundo cinza
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

  // Area do avatar
  avatarArea: {
    alignItems: 'center',                 //......Centraliza
    paddingTop: 20,                       //......Padding topo
    paddingBottom: 10,                    //......Padding baixo
    zIndex: 1,                            //......Acima do fundo
  },

  // Container de mensagens
  messagesContainer: {
    flex: 1,                              //......Ocupa espaco
    zIndex: 1,                            //......Acima do fundo
  },

  // Conteudo das mensagens
  messagesContent: {
    padding: 16,                          //......Padding
    paddingBottom: 8,                     //......Padding baixo
  },
});

// ========================================
// Export
// ========================================
export default LolaConversationContent;
