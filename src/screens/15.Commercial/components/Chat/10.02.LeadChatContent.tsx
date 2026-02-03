// ========================================
// Conteudo do Chat Lead
// Versao do chat que recebe props
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useEffect,                              //......Hook de efeito
} from 'react';
import {
  View,                                   //......Container basico
  StyleSheet,                             //......Estilos
  KeyboardAvoidingView,                   //......Evitar teclado
  Platform,                               //......Plataforma
  Clipboard,                              //......Area de transferencia
  LayoutChangeEvent,                      //......Evento de layout
  Dimensions,                             //......Dimensoes da tela
  Image,                                  //......Imagem
  Pressable,                              //......Pressionavel
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from './styles/08.ChatColors';

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
// Imports de Utilitarios
// ========================================
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ========================================
// Imports de Componentes
// ========================================
import ChatHeader from './components/Header/08.01.ChatHeader';
import MessageList from './components/Messages/08.02.MessageList';
import InputBar from './components/Input/08.10.InputBar';
import RecordingBar from './components/Input/08.14.RecordingBar';
import EmojiPicker from './components/Modals/08.15.EmojiPicker';
import AttachmentMenu from './components/Modals/08.16.AttachmentMenu';
import ImageViewer from './components/Modals/08.17.ImageViewer';
import MessageOptions from './components/Modals/08.18.MessageOptions';
import ShareModal from './components/Modals/08.19.ShareModal';

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
interface LeadChatContentProps {
  leadId: string;                         //......ID do lead
  leadName: string;                       //......Nome do lead
  leadPhone: string;                      //......Telefone do lead
  leadPhoto?: string;                     //......Foto do lead
}

// ========================================
// Componente Principal
// ========================================
const LeadChatContent: React.FC<LeadChatContentProps> = ({
  leadId,
  leadName,
  leadPhone,
  leadPhoto,
}) => {
  // ========================================
  // Navegacao
  // ========================================
  const navigation = useNavigation();

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
  // Handler de Perfil
  // ========================================
  const handleProfile = useCallback(() => {
    console.log('Abrir perfil do lead');
  }, []);

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
  // Render Principal
  // ========================================
  return (
    <View style={styles.screenContainer}>
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

      {/* Header */}
      <View style={styles.headerWrapper}>
        <ChatHeader
          chatInfo={chatInfo}
          onBackPress={handleBack}
          onProfilePress={handleProfile}
          onMenuPress={handleMenu}
        />
      </View>

      {/* Area de Mensagens */}
      <View style={styles.messagesWrapper}>
        <View style={styles.messagesContent}>
          <MessageList
            messages={messages}
            onMessageLongPress={handleMessageLongPress}
            onImagePress={handleImagePress}
            onAudioRetry={retryAudioMessage}
          />
        </View>
      </View>

      {/* Input */}
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
              onSendMessage={handleSendMessage}
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
  );
};

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  screenContainer: {
    flex: 1,                              //......Ocupa todo espaco
    display: 'flex',                      //......Display flex
    flexDirection: 'column',              //......Direcao vertical
    height: '100%',                       //......Altura total
    width: SCREEN_WIDTH,                  //......Largura da tela
    backgroundColor: ChatColors.chatBackground,
  },

  // Wrapper do header
  headerWrapper: {
    flexShrink: 0,                        //......Nao encolhe
    flexGrow: 0,                          //......Nao cresce
    zIndex: 2,                            //......Acima do fundo
  },

  // Wrapper das mensagens
  messagesWrapper: {
    flex: 1,                              //......Ocupa espaco restante
    minHeight: 0,                         //......Permite encolher
    position: 'relative',                 //......Posicao relativa
    zIndex: 1,                            //......Acima do fundo
    backgroundColor: 'transparent',       //......Fundo transparente
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
  },

  // Wrapper do input
  inputWrapper: {
    flexShrink: 0,                        //......Nao encolhe
    flexGrow: 0,                          //......Nao cresce
    backgroundColor: ChatColors.inputBackground,
    zIndex: 20,                           //......Acima do overlay
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
    zIndex: 10,                           //......Acima do conteudo
  },
});

// ========================================
// Export
// ========================================
export default LeadChatContent;
