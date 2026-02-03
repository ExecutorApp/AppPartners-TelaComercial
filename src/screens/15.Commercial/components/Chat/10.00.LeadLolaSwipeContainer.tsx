// ========================================
// Container de Swipe Lead <-> Lola
// Header e input fixos, apenas conteudo swipa
// ========================================

// ========================================
// Imports React
// ========================================
import React, {
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useEffect,                              //......Hook de efeito
  useMemo,                                //......Valor memoizado
} from 'react';

// ========================================
// Imports React Native
// ========================================
import {
  View,                                   //......Container
  Animated,                               //......Animacoes
  StyleSheet,                             //......Estilos
  Dimensions,                             //......Dimensoes
  KeyboardAvoidingView,                   //......Evitar teclado
  Platform,                               //......Plataforma
  Image,                                  //......Imagem
  Pressable,                              //......Pressionavel
  Clipboard,                              //......Area de transferencia
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ========================================
// Imports de Componentes Header e Input
// ========================================
import ChatHeader from './components/Header/08.01.ChatHeader';
import InputBar from './components/Input/08.10.InputBar';
import RecordingBar from './components/Input/08.14.RecordingBar';
import PageIndicator from './10.01.PageIndicator';

// ========================================
// Imports de Componentes de Conteudo
// ========================================
import LeadMessagesContent from './10.03.LeadMessagesContent';
import LolaConversationContent from '../Lola/11.01.LolaConversationContent';

// ========================================
// Imports de Modais
// ========================================
import EmojiPicker from './components/Modals/08.15.EmojiPicker';
import AttachmentMenu from './components/Modals/08.16.AttachmentMenu';
import ImageViewer from './components/Modals/08.17.ImageViewer';
import MessageOptions from './components/Modals/08.18.MessageOptions';
import ShareModal from './components/Modals/08.19.ShareModal';

// ========================================
// Imports de Contexto
// ========================================
import { LeadLolaProvider, useLeadLola } from '../../contexts/LeadLolaContext';
import { LolaAvatarProvider } from '../../contexts/LolaAvatarContext';

// ========================================
// Imports de Hooks
// ========================================
import { useMessages } from './hooks/08.useMessages';
import { useVoiceRecorder } from './hooks/08.useVoiceRecorder';

// ========================================
// Imports de Servicos
// ========================================
import { evolutionService } from '../../services/evolutionService';

// ========================================
// Imports de Tipos
// ========================================
import {
  ChatInfo,                               //......Info do chat
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  ReplyInfo,                              //......Info reply
} from './types/08.types.whatsapp';

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from './styles/08.ChatColors';

// ========================================
// Imports de Componentes Lola
// ========================================
import LolaFloatingAvatar from '../Lola/12.00.LolaFloatingAvatar';

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
// Tipos de Navegacao
// ========================================
type LeadChatRouteParams = {
  LeadChatScreen: {
    leadId: string;                       //......ID do lead
    leadName: string;                     //......Nome do lead
    leadPhone: string;                    //......Telefone do lead
    leadPhoto?: string;                   //......Foto do lead
  };
};

// ========================================
// Componente Interno com Swipe
// ========================================
const SwipeContent: React.FC<{
  leadId: string;
  leadName: string;
  leadPhone: string;
  leadPhoto?: string;
}> = ({ leadId, leadName, leadPhone, leadPhoto }) => {
  // ========================================
  // Navegacao
  // ========================================
  const navigation = useNavigation();

  // ========================================
  // Contexto de Navegacao Swipe
  // ========================================
  const { translateX, panResponder, activeScreen, toggleScreen } = useLeadLola();

  // ========================================
  // Hook de Mensagens
  // ========================================
  const {
    messages,
    replyingTo,
    isSending,
    instanceName,
    sendTextMessage,
    sendAudioMessage,
    sendImageMessage,
    setReplyTo,
    deleteMessage,
    updateMessageReaction,
    retryAudioMessage,
  } = useMessages({ leadId, leadPhone, leadName });

  // ========================================
  // Hook de Gravacao
  // ========================================
  const {
    isRecording,
    recordingDuration,
    recordingUri,
    startRecording,
    stopRecording,
    cancelRecording,
  } = useVoiceRecorder();

  // ========================================
  // Estados dos Modais
  // ========================================
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [showMessageOptions, setShowMessageOptions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null);
  const [viewerImage, setViewerImage] = useState<string>('');

  // ========================================
  // Info do Chat
  // ========================================
  const [chatInfo] = useState<ChatInfo>({
    leadId,
    leadName,
    leadPhone,
    leadPhoto,
    isOnline: false,
    lastSeen: new Date(),
    isTyping: false,
  });

  // ========================================
  // Contexto do Lead para Lola
  // ========================================
  const leadContext = useMemo(() => ({
    leadId,
    name: leadName,
    phone: leadPhone,
    phase: 'Prospeccao',
    lastInteraction: new Date(),
    channel: 'WhatsApp',
  }), [leadId, leadName, leadPhone]);

  // ========================================
  // Enviar audio quando gravacao termina
  // ========================================
  useEffect(() => {
    if (recordingUri && recordingDuration > 0) {
      sendAudioMessage(recordingUri, recordingDuration);
    }
  }, [recordingUri, recordingDuration, sendAudioMessage]);

  // ========================================
  // Handler de Voltar
  // ========================================
  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // ========================================
  // Handler de Perfil (Toggle Tela)
  // ========================================
  const handleProfile = useCallback(() => {
    toggleScreen();
  }, [toggleScreen]);

  // ========================================
  // Handler de Menu
  // ========================================
  const handleMenu = useCallback(() => {
    console.log('Abrir menu do chat');
  }, []);

  // ========================================
  // Handler de Enviar Mensagem
  // ========================================
  const handleSendMessage = useCallback((text: string) => {
    sendTextMessage(text);
  }, [sendTextMessage]);

  // ========================================
  // Handler de Enviar Audio
  // ========================================
  const handleSendAudio = useCallback((durationSec: number, uri?: string | null) => {
    if (!uri) return;
    sendAudioMessage(uri, durationSec);
  }, [sendAudioMessage]);

  // ========================================
  // Handlers de Voz
  // ========================================
  const handleVoiceStart = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleVoiceEnd = useCallback(() => {
    // Nao faz nada
  }, []);

  const handleRecordingCancel = useCallback(() => {
    cancelRecording();
  }, [cancelRecording]);

  const handleRecordingSend = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // ========================================
  // Handler de Emoji
  // ========================================
  const handleEmojiPress = useCallback(() => {
    setShowEmojiPicker(true);
  }, []);

  const handleEmojiSelect = useCallback((emoji: string) => {
    console.log('Emoji selecionado:', emoji);
  }, []);

  // ========================================
  // Handler de Anexo
  // ========================================
  const handleAttachPress = useCallback(() => {
    setShowAttachMenu((prev) => !prev);
  }, []);

  const handleCloseAttachMenu = useCallback(() => {
    setShowAttachMenu(false);
  }, []);

  const handleSelectCamera = useCallback(() => {
    console.log('Abrir camera');
  }, []);

  const handleSelectGallery = useCallback(async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      sendImageMessage(asset.uri, asset.width || 0, asset.height || 0);
    }
  }, [sendImageMessage]);

  const handleSelectDocument = useCallback(() => {
    console.log('Abrir documentos');
  }, []);

  const handleSelectContact = useCallback(() => {
    console.log('Selecionar contato');
  }, []);

  const handleSelectLocation = useCallback(() => {
    console.log('Selecionar localizacao');
  }, []);

  // ========================================
  // Handler de Long Press na Mensagem
  // ========================================
  const handleMessageLongPress = useCallback((message: WhatsAppMessage) => {
    setSelectedMessage(message);
    setShowMessageOptions(true);
  }, []);

  // ========================================
  // Handler de Abrir Imagem no Viewer
  // ========================================
  const handleImagePress = useCallback((imageUrl: string, message?: WhatsAppMessage) => {
    setViewerImage(imageUrl);
    setSelectedMessage(message || null);
    setShowImageViewer(true);
  }, []);

  // ========================================
  // Handler de Download Imagem
  // ========================================
  const handleImageDownload = useCallback(async () => {
    if (!viewerImage) return;

    try {
      if (Platform.OS === 'web') {
        const timestamp = Date.now();
        const fileName = `imagem_${timestamp}.jpg`;

        if (viewerImage.startsWith('blob:') || viewerImage.startsWith('data:')) {
          const link = document.createElement('a');
          link.href = viewerImage;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const response = await fetch(viewerImage);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }
      } else {
        const timestamp = Date.now();
        const fileName = `imagem_${timestamp}.jpg`;
        const fileUri = FileSystem.documentDirectory + fileName;
        const downloadResult = await FileSystem.downloadAsync(viewerImage, fileUri);
        const isSharingAvailable = await Sharing.isAvailableAsync();
        if (isSharingAvailable) {
          await Sharing.shareAsync(downloadResult.uri);
        }
      }
    } catch (error) {
      console.error('Erro ao baixar imagem:', error);
    }
  }, [viewerImage]);

  // ========================================
  // Handler de Compartilhar Imagem
  // ========================================
  const handleImageShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  // ========================================
  // Handler de Encaminhar para Contatos
  // ========================================
  const handleShareForward = useCallback(async (contactIds: string[], message: string) => {
    setShowShareModal(false);
    setShowImageViewer(false);
    setSelectedMessage(null);

    if (!instanceName || !viewerImage) return;

    try {
      let imageData = viewerImage;
      if (viewerImage.startsWith('blob:')) {
        const response = await fetch(viewerImage);
        const blob = await response.blob();
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            const pureBase64 = base64.split(',')[1] || base64;
            resolve(pureBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      for (const contactId of contactIds) {
        let phoneNumber = '';
        if (contactId.startsWith('whatsapp_')) {
          const jidMatch = contactId.match(/whatsapp_(\d+)@/);
          if (jidMatch) phoneNumber = jidMatch[1];
        } else if (contactId.startsWith('phone_')) {
          const parts = contactId.split('_');
          if (parts.length >= 2) phoneNumber = parts[1];
        }
        if (!phoneNumber) continue;

        await evolutionService.sendImage(instanceName, phoneNumber, imageData, message || undefined);
      }
    } catch (error) {
      console.error('Erro no encaminhamento:', error);
    }
  }, [viewerImage, instanceName]);

  // ========================================
  // Handler de Responder Imagem
  // ========================================
  const handleImageReply = useCallback(() => {
    if (!selectedMessage) return;
    const replyInfo: ReplyInfo = {
      messageId: selectedMessage.id,
      senderName: selectedMessage.senderName || 'Voce',
      content: '',
      type: 'image',
    };
    setReplyTo(replyInfo);
    setShowImageViewer(false);
    setSelectedMessage(null);
  }, [selectedMessage, setReplyTo]);

  // ========================================
  // Handler de Enviar Resposta do ImageViewer
  // ========================================
  const handleImageViewerSendReply = useCallback(async (text: string) => {
    if (!text.trim() || !instanceName || !leadPhone) return;

    try {
      let phoneNumber = leadPhone.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55') && phoneNumber.length <= 11) {
        phoneNumber = '55' + phoneNumber;
      }
      await evolutionService.sendText(instanceName, phoneNumber, text.trim());
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      throw error;
    }
  }, [instanceName, leadPhone]);

  // ========================================
  // Handler de Excluir Imagem
  // ========================================
  const handleImageDelete = useCallback(() => {
    if (!selectedMessage) return;
    deleteMessage(selectedMessage.id);
    setShowImageViewer(false);
    setSelectedMessage(null);
  }, [selectedMessage, deleteMessage]);

  // ========================================
  // Handler de Reacao na Imagem
  // ========================================
  const handleImageReaction = useCallback(async (
    reaction: string | null,
    previousEmoji?: string
  ) => {
    if (!selectedMessage) return;
    updateMessageReaction(selectedMessage.id, reaction);

    if (selectedMessage.messageKey && instanceName) {
      try {
        const emojiToSend = reaction ?? '';
        await evolutionService.sendReaction(instanceName, selectedMessage.messageKey, emojiToSend);
      } catch (error) {
        console.error('Erro ao enviar reacao:', error);
      }
    }
  }, [selectedMessage, updateMessageReaction, instanceName]);

  // ========================================
  // Handler de Reply
  // ========================================
  const handleReply = useCallback(() => {
    if (!selectedMessage) return;
    const replyInfo: ReplyInfo = {
      messageId: selectedMessage.id,
      senderName: selectedMessage.senderName || 'Voce',
      content: selectedMessage.type === 'text' ? (selectedMessage.content as TextContent).text : '',
      type: selectedMessage.type,
    };
    setReplyTo(replyInfo);
    setShowMessageOptions(false);
    setSelectedMessage(null);
  }, [selectedMessage, setReplyTo]);

  // ========================================
  // Handler de Copiar
  // ========================================
  const handleCopy = useCallback(() => {
    if (!selectedMessage || selectedMessage.type !== 'text') return;
    const content = selectedMessage.content as TextContent;
    Clipboard.setString(content.text);
    setShowMessageOptions(false);
    setSelectedMessage(null);
  }, [selectedMessage]);

  // ========================================
  // Handler de Encaminhar
  // ========================================
  const handleForward = useCallback(() => {
    console.log('Encaminhar mensagem');
    setShowMessageOptions(false);
    setSelectedMessage(null);
  }, []);

  // ========================================
  // Handler de Excluir
  // ========================================
  const handleDelete = useCallback(() => {
    if (!selectedMessage) return;
    deleteMessage(selectedMessage.id);
    setShowMessageOptions(false);
    setSelectedMessage(null);
  }, [selectedMessage, deleteMessage]);

  // ========================================
  // Handler de Cancelar Reply
  // ========================================
  const handleCancelReply = useCallback(() => {
    setReplyTo(null);
  }, [setReplyTo]);

  // ========================================
  // Handler de Envio da Lola
  // ========================================
  const handleLolaSendMessage = useCallback((text: string) => {
    // TODO: Implementar envio de mensagem na conversa com Lola
    console.log('Mensagem para Lola:', text);
  }, []);

  // ========================================
  // Render
  // ========================================
  return (
    <LolaAvatarProvider>
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

        {/* Header Fixo Compartilhado */}
        <View style={styles.headerWrapper}>
          <ChatHeader
            chatInfo={chatInfo}
            onBackPress={handleBack}
            onProfilePress={handleProfile}
            onMenuPress={handleMenu}
          />
        </View>

        {/* Area de Swipe (Apenas Conteudo) */}
        <View style={styles.swipeWrapper}>
          <Animated.View
            style={[
              styles.swipeContainer,
              {
                transform: [{ translateX }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Conteudo Lead (Mensagens) */}
            <View style={styles.screen}>
              <LeadMessagesContent
                messages={messages}
                onMessageLongPress={handleMessageLongPress}
                onImagePress={handleImagePress}
                onAudioRetry={retryAudioMessage}
              />
            </View>

            {/* Conteudo Lola (Conversa IA) */}
            <View style={styles.screen}>
              <LolaConversationContent
                leadId={leadId}
                leadName={leadName}
                leadPhone={leadPhone}
                onSendMessage={handleLolaSendMessage}
              />
            </View>
          </Animated.View>
        </View>

        {/* Indicador de Pagina */}
        <View style={styles.indicatorContainer}>
          <PageIndicator activePage={activeScreen} />
        </View>

        {/* Input Fixo Compartilhado */}
        <View style={styles.inputWrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.keyboardAvoiding}
          >
            {isRecording ? (
              <RecordingBar
                duration={recordingDuration}
                onCancel={handleRecordingCancel}
                onSend={handleRecordingSend}
              />
            ) : (
              <InputBar
                onSendMessage={activeScreen === 'lead' ? handleSendMessage : handleLolaSendMessage}
                onVoiceStart={handleVoiceStart}
                onVoiceEnd={handleVoiceEnd}
                onEmojiPress={handleEmojiPress}
                onAttachPress={handleAttachPress}
                replyingTo={replyingTo}
                onCancelReply={handleCancelReply}
                onSendAudio={handleSendAudio}
              />
            )}

            <AttachmentMenu
              visible={showAttachMenu}
              onClose={() => setShowAttachMenu(false)}
              onSelectCamera={handleSelectCamera}
              onSelectGallery={handleSelectGallery}
              onSelectDocument={handleSelectDocument}
              onSelectContact={handleSelectContact}
              onSelectLocation={handleSelectLocation}
              onSelectEmoji={handleEmojiPress}
            />
          </KeyboardAvoidingView>
        </View>

        {/* Overlay para fechar AttachmentMenu */}
        {showAttachMenu && (
          <Pressable
            style={styles.attachMenuOverlay}
            onPress={handleCloseAttachMenu}
          />
        )}

        {/* Avatar Flutuante da Lola */}
        <LolaFloatingAvatar />

        {/* Modais */}
        <EmojiPicker
          visible={showEmojiPicker}
          onClose={() => setShowEmojiPicker(false)}
          onSelect={handleEmojiSelect}
        />

        <ImageViewer
          visible={showImageViewer}
          imageUrl={viewerImage}
          instanceName={instanceName}
          remoteJid={leadPhone}
          currentReaction={selectedMessage?.reaction || null}
          onClose={() => {
            setShowImageViewer(false);
            setSelectedMessage(null);
          }}
          onDownload={handleImageDownload}
          onShare={handleImageShare}
          onReply={handleImageReply}
          onDelete={handleImageDelete}
          onReaction={handleImageReaction}
          onSendReply={handleImageViewerSendReply}
        />

        <MessageOptions
          visible={showMessageOptions}
          message={selectedMessage}
          onClose={() => {
            setShowMessageOptions(false);
            setSelectedMessage(null);
          }}
          onReply={handleReply}
          onCopy={handleCopy}
          onForward={handleForward}
          onDelete={handleDelete}
        />

        <ShareModal
          visible={showShareModal}
          imageUrl={viewerImage}
          instanceName={instanceName}
          onClose={() => setShowShareModal(false)}
          onForward={handleShareForward}
        />
      </View>
    </LolaAvatarProvider>
  );
};

// ========================================
// Componente Principal com Provider
// ========================================
const LeadLolaSwipeContainer: React.FC = () => {
  // ========================================
  // Rota
  // ========================================
  const route = useRoute<RouteProp<LeadChatRouteParams, 'LeadChatScreen'>>();
  const { leadId, leadName, leadPhone, leadPhoto } = route.params;

  // ========================================
  // Render
  // ========================================
  return (
    <LeadLolaProvider>
      <SwipeContent
        leadId={leadId}
        leadName={leadName}
        leadPhone={leadPhone}
        leadPhoto={leadPhoto}
      />
    </LeadLolaProvider>
  );
};

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,                              //......Ocupa tudo
    backgroundColor: ChatColors.chatBackground,
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

  // Wrapper do header
  headerWrapper: {
    flexShrink: 0,                        //......Nao encolhe
    flexGrow: 0,                          //......Nao cresce
    zIndex: 10,                           //......Acima de tudo
  },

  // Wrapper da area de swipe
  swipeWrapper: {
    flex: 1,                              //......Ocupa espaco restante
    overflow: 'hidden',                   //......Esconde overflow
    zIndex: 1,                            //......Abaixo do header
  },

  // Container do swipe
  swipeContainer: {
    flex: 1,                              //......Ocupa tudo
    flexDirection: 'row',                 //......Layout horizontal
    width: SCREEN_WIDTH * 2,              //......Largura = 2 telas
  },

  // Tela individual
  screen: {
    width: SCREEN_WIDTH,                  //......Largura da tela
    flex: 1,                              //......Ocupa altura
  },

  // Container do indicador
  indicatorContainer: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 80,                           //......Acima do input
    left: 0,                              //......Esquerda
    right: 0,                             //......Direita
    alignItems: 'center',                 //......Centraliza
    pointerEvents: 'none',                //......Nao captura toques
    zIndex: 5,                            //......Acima do conteudo
  },

  // Wrapper do input
  inputWrapper: {
    flexShrink: 0,                        //......Nao encolhe
    flexGrow: 0,                          //......Nao cresce
    backgroundColor: ChatColors.inputBackground,
    zIndex: 20,                           //......Acima de tudo
  },

  // KeyboardAvoidingView
  keyboardAvoiding: {
    width: '100%',                        //......Largura total
  },

  // Overlay
  attachMenuOverlay: {
    position: 'absolute',                 //......Posicao absoluta
    top: 0,                               //......Topo
    left: 0,                              //......Esquerda
    right: 0,                             //......Direita
    bottom: 0,                            //......Fundo
    backgroundColor: 'transparent',       //......Fundo transparente
    zIndex: 15,                           //......Acima do conteudo
  },
});

// ========================================
// Export
// ========================================
export default LeadLolaSwipeContainer;
