// ========================================
// Tela LeadChatScreen
// Interface de chat WhatsApp Clone
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useEffect,                              //......Hook de efeito
  useMemo,                                //......Hook de memo
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  StyleSheet,                             //......Estilos
  KeyboardAvoidingView,                   //......Evitar teclado
  Platform,                               //......Plataforma
  Clipboard,                              //......Area de transferencia
  LayoutChangeEvent,                      //......Evento de layout
  Dimensions,                             //......Dimensoes da tela
  Image,                                  //......Imagem
  Pressable,                              //......Pressionavel
} from 'react-native';                    //......Biblioteca RN
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from './styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos do chat
  ChatInfo,                               //......Info do chat
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  ReplyInfo,                              //......Info reply
} from './types/08.types.whatsapp';       //......Arquivo de tipos

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
// Componente Principal LeadChatScreen
// ========================================
const LeadChatScreen: React.FC = () => {
  // ========================================
  // Navegacao e Rota
  // ========================================
  const navigation = useNavigation();     //......Navegacao
  const route = useRoute<RouteProp<LeadChatRouteParams, 'LeadChatScreen'>>();
  const { leadId, leadName, leadPhone, leadPhoto } = route.params || {
    leadId: 'lead-1',                     //......Default
    leadName: 'Lead',                     //......Default
    leadPhone: '',                        //......Default
  };

  // ========================================
  // Hook de Mensagens
  // ========================================
  const {
    messages,                             //......Lista mensagens
    replyingTo,                           //......Reply info
    isSending,                            //......Estado de envio
    instanceName,                         //......Nome da instancia
    sendTextMessage,                      //......Envia texto
    sendAudioMessage,                     //......Envia audio
    sendImageMessage,                     //......Envia imagem
    setReplyTo,                           //......Define reply
    deleteMessage,                        //......Deleta mensagem
    updateMessageReaction,                //......Atualiza reacao
    retryAudioMessage,                    //......Retry audio
  } = useMessages({ leadId, leadPhone, leadName });

  // ========================================
  // Hook de Gravacao
  // ========================================
  const {
    isRecording,                          //......Se esta gravando
    recordingDuration,                    //......Duracao gravacao
    recordingUri,                         //......URI do audio
    startRecording,                       //......Inicia gravacao
    stopRecording,                        //......Para gravacao
    cancelRecording,                      //......Cancela gravacao
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
    leadId,                               //......ID do lead
    leadName,                             //......Nome do lead
    leadPhone,                            //......Telefone
    leadPhoto,                            //......Foto
    isOnline: false,                      //......Status offline inicial
    lastSeen: new Date(),                 //......Ultima vez visto
    isTyping: false,                      //......Nao esta digitando
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
    navigation.goBack();                  //......Volta
  }, [navigation]);

  // ========================================
  // Handler de Perfil
  // ========================================
  const handleProfile = useCallback(() => {
    // TODO: Navegar para perfil do lead
    console.log('Abrir perfil do lead');
  }, []);

  // ========================================
  // Handler de Menu
  // ========================================
  const handleMenu = useCallback(() => {
    // TODO: Abrir menu do chat
    console.log('Abrir menu do chat');
  }, []);

  // ========================================
  // Handler de Enviar Mensagem
  // ========================================
  const handleSendMessage = useCallback((text: string) => {
    sendTextMessage(text);                //......Envia texto
  }, [sendTextMessage]);

  // ========================================
  // Handler de Enviar Audio (do InputBar)
  // ========================================
  const handleSendAudio = useCallback((durationSec: number, uri?: string | null) => {
    console.log('[LeadChatScreen] handleSendAudio chamado:', { durationSec, uri });

    // Valida se tem URI do audio
    if (!uri) {
      console.warn('[LeadChatScreen] URI do audio esta vazio');
      return;
    }

    // Chama sendAudioMessage do hook
    sendAudioMessage(uri, durationSec);   //......Envia audio
  }, [sendAudioMessage]);

  // ========================================
  // Handlers de Voz
  // ========================================
  const handleVoiceStart = useCallback(() => {
    startRecording();                     //......Inicia gravacao
  }, [startRecording]);

  const handleVoiceEnd = useCallback(() => {
    // Nao faz nada - gravacao continua
    // Usuario deve usar os botoes da RecordingBar
  }, []);

  const handleRecordingCancel = useCallback(() => {
    cancelRecording();                    //......Cancela gravacao
  }, [cancelRecording]);

  const handleRecordingSend = useCallback(() => {
    stopRecording();                      //......Para e envia
  }, [stopRecording]);

  // ========================================
  // Handler de Emoji
  // ========================================
  const handleEmojiPress = useCallback(() => {
    setShowEmojiPicker(true);             //......Abre picker
  }, []);

  const handleEmojiSelect = useCallback((emoji: string) => {
    // TODO: Inserir emoji no input
    console.log('Emoji selecionado:', emoji);
  }, []);

  // ========================================
  // Handler de Anexo
  // ========================================
  const handleAttachPress = useCallback(() => {
    setShowAttachMenu((prev) => !prev);   //......Toggle menu
  }, []);

  const handleCloseAttachMenu = useCallback(() => {
    setShowAttachMenu(false);             //......Fecha menu
  }, []);

  const handleSelectCamera = useCallback(() => {
    // TODO: Abrir camera
    console.log('Abrir camera');
  }, []);

  const handleSelectGallery = useCallback(async () => {
    console.log('[LeadChatScreen] Abrindo galeria de fotos...');

    // Solicita permissao para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      console.warn('[LeadChatScreen] Permissao negada para acessar galeria');
      return;
    }

    // Abre a galeria de fotos
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],             //......Apenas imagens
      allowsEditing: false,               //......Sem edicao
      quality: 0.8,                        //......Qualidade 80%
      allowsMultipleSelection: false,     //......Uma imagem por vez
    });

    console.log('[LeadChatScreen] Resultado ImagePicker:', result);

    // Verifica se usuario selecionou imagem
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      console.log('[LeadChatScreen] Imagem selecionada:', {
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      });

      // Envia imagem via sendImageMessage
      sendImageMessage(asset.uri, asset.width || 0, asset.height || 0);
    }
  }, [sendImageMessage]);

  const handleSelectDocument = useCallback(() => {
    // TODO: Abrir documentos
    console.log('Abrir documentos');
  }, []);

  const handleSelectContact = useCallback(() => {
    // TODO: Selecionar contato
    console.log('Selecionar contato');
  }, []);

  const handleSelectLocation = useCallback(() => {
    // TODO: Selecionar localizacao
    console.log('Selecionar localizacao');
  }, []);

  // ========================================
  // Handler de Long Press na Mensagem
  // ========================================
  const handleMessageLongPress = useCallback((message: WhatsAppMessage) => {
    setSelectedMessage(message);          //......Seleciona mensagem
    setShowMessageOptions(true);          //......Abre opcoes
  }, []);

  // ========================================
  // Handler de Abrir Imagem no Viewer
  // ========================================
  const handleImagePress = useCallback((imageUrl: string, message?: WhatsAppMessage) => {
    console.log('[LeadChatScreen] Abrindo imagem no viewer:', imageUrl);
    setViewerImage(imageUrl);             //......Define imagem
    setSelectedMessage(message || null);  //......Salva mensagem para acoes
    setShowImageViewer(true);             //......Abre viewer
  }, []);

  // ========================================
  // Handler de Download Imagem
  // ========================================
  const handleImageDownload = useCallback(async () => {
    if (!viewerImage) return;

    console.log('[LeadChatScreen] Iniciando download da imagem:', viewerImage);

    try {
      if (Platform.OS === 'web') {
        // Download para Web
        // Gera nome unico para o arquivo
        const timestamp = Date.now();
        const fileName = `imagem_${timestamp}.jpg`;

        // Se for blob URL ou data URL, faz download direto
        if (viewerImage.startsWith('blob:') || viewerImage.startsWith('data:')) {
          const link = document.createElement('a');
          link.href = viewerImage;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          // Se for URL externa, faz fetch primeiro
          const response = await fetch(viewerImage);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Libera a URL do blob
          URL.revokeObjectURL(blobUrl);
        }

        console.log('[LeadChatScreen] Download concluido (Web)');
      } else {
        // Download para Mobile (iOS/Android)
        const timestamp = Date.now();
        const fileName = `imagem_${timestamp}.jpg`;
        const fileUri = FileSystem.documentDirectory + fileName;

        // Faz download do arquivo
        const downloadResult = await FileSystem.downloadAsync(
          viewerImage,
          fileUri
        );

        console.log('[LeadChatScreen] Arquivo baixado para:', downloadResult.uri);

        // Verifica se sharing esta disponivel
        const isSharingAvailable = await Sharing.isAvailableAsync();

        if (isSharingAvailable) {
          // Abre dialogo para salvar/compartilhar
          await Sharing.shareAsync(downloadResult.uri);
          console.log('[LeadChatScreen] Download concluido (Mobile)');
        } else {
          console.log('[LeadChatScreen] Arquivo salvo em:', downloadResult.uri);
        }
      }
    } catch (error) {
      console.error('[LeadChatScreen] Erro ao baixar imagem:', error);
    }
  }, [viewerImage]);

  // ========================================
  // Handler de Compartilhar Imagem
  // ========================================
  const handleImageShare = useCallback(() => {
    console.log('[LeadChatScreen] Abrindo modal de compartilhar:', viewerImage);
    setShowShareModal(true);              //......Abre modal share
  }, [viewerImage]);

  // ========================================
  // Handler de Encaminhar para Contatos
  // ========================================
  const handleShareForward = useCallback(async (contactIds: string[], message: string) => {
    console.log('[LeadChatScreen] Encaminhar imagem para contatos:', contactIds);
    console.log('[LeadChatScreen] Mensagem:', message);
    console.log('[LeadChatScreen] Imagem:', viewerImage);
    console.log('[LeadChatScreen] Instance:', instanceName);

    // Fecha modais primeiro para feedback visual
    setShowShareModal(false);             //......Fecha modal share
    setShowImageViewer(false);            //......Fecha viewer
    setSelectedMessage(null);             //......Limpa selecao

    // Verificacoes
    if (!instanceName) {
      console.error('[LeadChatScreen] Erro: instanceName nao definido');
      return;
    }

    if (!viewerImage) {
      console.error('[LeadChatScreen] Erro: viewerImage nao definido');
      return;
    }

    try {
      // Converter blob URL para base64 se necessario
      let imageData = viewerImage;
      if (viewerImage.startsWith('blob:')) {
        console.log('[LeadChatScreen] Convertendo blob URL para base64...');
        const response = await fetch(viewerImage);
        const blob = await response.blob();
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            const base64 = reader.result as string;
            // Remove o prefixo data:image/...;base64,
            const pureBase64 = base64.split(',')[1] || base64;
            resolve(pureBase64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
        console.log('[LeadChatScreen] Base64 gerado, tamanho:', imageData.length);
      }

      // Envia para cada contato selecionado
      for (const contactId of contactIds) {
        // Extrai o numero do telefone do contactId
        // Formato: whatsapp_5517991396062@s.whatsapp.net_694
        // Ou: phone_xxxx_0
        let phoneNumber = '';

        if (contactId.startsWith('whatsapp_')) {
          // Extrai o JID: 5517991396062@s.whatsapp.net
          const jidMatch = contactId.match(/whatsapp_(\d+)@/);
          if (jidMatch) {
            phoneNumber = jidMatch[1];    //......Apenas os numeros
          }
        } else if (contactId.startsWith('phone_')) {
          // Contato da agenda - extrai o numero do meio
          const parts = contactId.split('_');
          if (parts.length >= 2) {
            phoneNumber = parts[1];       //......ID do contato
          }
        }

        if (!phoneNumber) {
          console.warn('[LeadChatScreen] Nao foi possivel extrair numero de:', contactId);
          continue;
        }

        console.log('[LeadChatScreen] Enviando para:', phoneNumber);

        // Envia a imagem via Evolution API
        const result = await evolutionService.sendImage(
          instanceName,
          phoneNumber,
          imageData,
          message || undefined            //......Caption (mensagem)
        );

        if (result.error) {
          console.error('[LeadChatScreen] Erro ao enviar para', phoneNumber, ':', result.error);
        } else {
          console.log('[LeadChatScreen] Enviado com sucesso para:', phoneNumber);
        }
      }

      console.log('[LeadChatScreen] Encaminhamento concluido para todos os contatos');

    } catch (error) {
      console.error('[LeadChatScreen] Erro no encaminhamento:', error);
    }
  }, [viewerImage, instanceName]);

  // ========================================
  // Handler de Responder Imagem (comportamento antigo)
  // ========================================
  const handleImageReply = useCallback(() => {
    if (!selectedMessage) return;

    // Criar reply info para imagem
    const replyInfo: ReplyInfo = {
      messageId: selectedMessage.id,      //......ID da mensagem
      senderName: selectedMessage.senderName || 'Você',
      content: '',                         //......Sem texto
      type: 'image',                       //......Tipo imagem
    };

    setReplyTo(replyInfo);                //......Define reply
    setShowImageViewer(false);            //......Fecha viewer
    setSelectedMessage(null);             //......Limpa selecao
  }, [selectedMessage, setReplyTo]);

  // ========================================
  // Handler de Enviar Resposta do ImageViewer
  // ========================================
  const handleImageViewerSendReply = useCallback(async (text: string) => {
    if (!text.trim() || !instanceName || !leadPhone) {
      console.log('[LeadChatScreen] Dados insuficientes para envio');
      return;
    }

    console.log('[LeadChatScreen] Enviando resposta do ImageViewer:', text);

    try {
      // Formata numero para envio
      let phoneNumber = leadPhone.replace(/\D/g, '');
      if (!phoneNumber.startsWith('55') && phoneNumber.length <= 11) {
        phoneNumber = '55' + phoneNumber;
      }

      // Envia texto via Evolution API
      const result = await evolutionService.sendText(
        instanceName,                     //......Nome da instancia
        phoneNumber,                      //......Numero destino
        text.trim()                       //......Texto da mensagem
      );

      console.log('[LeadChatScreen] Resposta enviada com sucesso:', result);

    } catch (error) {
      console.error('[LeadChatScreen] Erro ao enviar resposta:', error);
      throw error;
    }
  }, [instanceName, leadPhone]);

  // ========================================
  // Handler de Excluir Imagem
  // ========================================
  const handleImageDelete = useCallback(() => {
    if (!selectedMessage) return;

    deleteMessage(selectedMessage.id);    //......Deleta mensagem
    setShowImageViewer(false);            //......Fecha viewer
    setSelectedMessage(null);             //......Limpa selecao
  }, [selectedMessage, deleteMessage]);

  // ========================================
  // Handler de Reacao na Imagem
  // ========================================
  const handleImageReaction = useCallback(async (
    reaction: string | null,
    previousEmoji?: string
  ) => {
    if (!selectedMessage) return;

    console.log('[LeadChatScreen] Atualizando reacao:', {
      messageId: selectedMessage.id,
      messageKey: selectedMessage.messageKey,
      previousEmoji,
      newReaction: reaction,
    });

    // Atualiza localmente primeiro (feedback imediato)
    updateMessageReaction(selectedMessage.id, reaction);

    // Envia reacao para o WhatsApp via Evolution API
    if (selectedMessage.messageKey && instanceName) {
      try {
        // Evolution API v2.x: string vazia "" remove a reacao
        const emojiToSend = reaction ?? '';

        console.log('[LeadChatScreen] Enviando reacao para WhatsApp:', emojiToSend || '(vazio para remover)');
        console.log('[LeadChatScreen] Modo:', reaction ? 'adicionar' : 'remover');

        const result = await evolutionService.sendReaction(
          instanceName,
          selectedMessage.messageKey,
          emojiToSend
        );
        console.log('[LeadChatScreen] Resultado sendReaction:', result);

        if (result.error) {
          console.error('[LeadChatScreen] Erro ao enviar reacao:', result.error);
        } else {
          console.log('[LeadChatScreen] Reacao enviada com sucesso!');
        }
      } catch (error) {
        console.error('[LeadChatScreen] Excecao ao enviar reacao:', error);
      }
    } else if (!selectedMessage.messageKey) {
      console.warn('[LeadChatScreen] messageKey nao disponivel para reacao');
    }
  }, [selectedMessage, updateMessageReaction, instanceName]);

  // ========================================
  // Handler de Reply
  // ========================================
  const handleReply = useCallback(() => {
    if (!selectedMessage) return;

    // Criar reply info
    const replyInfo: ReplyInfo = {
      messageId: selectedMessage.id,      //......ID da mensagem
      senderName: selectedMessage.senderName || 'Você',
      content: selectedMessage.type === 'text'
        ? (selectedMessage.content as TextContent).text
        : '',
      type: selectedMessage.type,         //......Tipo
    };

    setReplyTo(replyInfo);                //......Define reply
    setShowMessageOptions(false);         //......Fecha opcoes
    setSelectedMessage(null);             //......Limpa selecao
  }, [selectedMessage, setReplyTo]);

  // ========================================
  // Handler de Copiar
  // ========================================
  const handleCopy = useCallback(() => {
    if (!selectedMessage || selectedMessage.type !== 'text') return;

    const content = selectedMessage.content as TextContent;
    Clipboard.setString(content.text);    //......Copia texto
    setShowMessageOptions(false);         //......Fecha opcoes
    setSelectedMessage(null);             //......Limpa selecao
  }, [selectedMessage]);

  // ========================================
  // Handler de Encaminhar
  // ========================================
  const handleForward = useCallback(() => {
    // TODO: Implementar encaminhar
    console.log('Encaminhar mensagem');
    setShowMessageOptions(false);         //......Fecha opcoes
    setSelectedMessage(null);             //......Limpa selecao
  }, []);

  // ========================================
  // Handler de Excluir
  // ========================================
  const handleDelete = useCallback(() => {
    if (!selectedMessage) return;

    deleteMessage(selectedMessage.id);    //......Deleta mensagem
    setShowMessageOptions(false);         //......Fecha opcoes
    setSelectedMessage(null);             //......Limpa selecao
  }, [selectedMessage, deleteMessage]);

  // ========================================
  // Handler de Cancelar Reply
  // ========================================
  const handleCancelReply = useCallback(() => {
    setReplyTo(null);                     //......Limpa reply
  }, [setReplyTo]);

  // ========================================
  // DEBUG: Log inicial
  // ========================================
  useEffect(() => {
    console.log('[LeadChatScreen] MONTADO');
    console.log('[LeadChatScreen] Platform:', Platform.OS);
    console.log('[LeadChatScreen] messages count:', messages.length);
  }, [messages.length]);

  // ========================================
  // DEBUG: Handlers de Layout
  // ========================================
  const handleSafeAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[LeadChatScreen] ScreenContainer layout:', { x, y, width, height });
    console.log('[LeadChatScreen] Viewport height:', Dimensions.get('window').height);
  }, []);

  const handleMessagesAreaLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[LeadChatScreen] MessagesWrapper layout:', { x, y, width, height });
  }, []);

  const handleInputContainerLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[LeadChatScreen] InputWrapper layout:', { x, y, width, height });
    console.log('[LeadChatScreen] Input bottom position:', y + height);
  }, []);

  // ========================================
  // Render Principal
  // ========================================
  // Log antes do render
  console.log('[LeadChatScreen] RENDER - isRecording:', isRecording);

  return (
    <View
      style={styles.screenContainer}
      onLayout={handleSafeAreaLayout}     //......Debug layout
    >
      {/* Imagem de Fundo - Camada Fixa Absoluta */}
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

      {/* Header Fixo no Topo */}
      <View style={styles.headerWrapper}>
        <ChatHeader
          chatInfo={chatInfo}             //......Info do chat
          onBackPress={handleBack}        //......Handler voltar
          onProfilePress={handleProfile}  //......Handler perfil
          onMenuPress={handleMenu}        //......Handler menu
        />
      </View>

      {/* Area de Mensagens - Flex 1 com Overflow Scroll */}
      <View
        testID="messages-wrapper"
        style={styles.messagesWrapper}
        onLayout={handleMessagesAreaLayout}
      >
        {/* Lista de Mensagens */}
        <View style={styles.messagesContent}>
          <MessageList
            messages={messages}           //......Mensagens
            onMessageLongPress={handleMessageLongPress}
            onImagePress={handleImagePress}
            onAudioRetry={retryAudioMessage}
          />
        </View>
      </View>

      {/* Input Fixo no Bottom - Altura Auto */}
      <View
        style={styles.inputWrapper}
        onLayout={handleInputContainerLayout}
      >
        {console.log('[LeadChatScreen] Renderizando InputContainer')}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={styles.keyboardAvoiding}
        >
          {/* Input ou RecordingBar */}
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
              replyingTo={replyingTo}     //......Reply info
              onCancelReply={handleCancelReply}
              onSendAudio={handleSendAudio}
            />
          )}

          {/* Painel de Anexos (inline, abaixo do input) */}
          <AttachmentMenu
            visible={showAttachMenu}      //......Visibilidade
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

      {/* Overlay para fechar AttachmentMenu ao tocar fora */}
      {showAttachMenu && (
        <Pressable
          style={styles.attachMenuOverlay}
          onPress={handleCloseAttachMenu}
        />
      )}

      {/* Modais */}
      <EmojiPicker
        visible={showEmojiPicker}         //......Visibilidade
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleEmojiSelect}      //......Handler selecionar
      />

      <ImageViewer
        visible={showImageViewer}         //......Visibilidade
        imageUrl={viewerImage}            //......URL da imagem
        instanceName={instanceName}       //......Nome da instancia
        remoteJid={leadPhone}             //......Telefone do lead
        currentReaction={selectedMessage?.reaction || null}
        onClose={() => {
          setShowImageViewer(false);
          setSelectedMessage(null);
        }}
        onDownload={handleImageDownload}  //......Handler download
        onShare={handleImageShare}        //......Handler compartilhar
        onReply={handleImageReply}        //......Handler responder
        onDelete={handleImageDelete}      //......Handler excluir
        onReaction={handleImageReaction}  //......Handler reacao
        onSendReply={handleImageViewerSendReply}
      />

      <MessageOptions
        visible={showMessageOptions}      //......Visibilidade
        message={selectedMessage}         //......Mensagem
        onClose={() => {
          setShowMessageOptions(false);
          setSelectedMessage(null);
        }}
        onReply={handleReply}             //......Handler reply
        onCopy={handleCopy}               //......Handler copiar
        onForward={handleForward}         //......Handler encaminhar
        onDelete={handleDelete}           //......Handler excluir
      />

      <ShareModal
        visible={showShareModal}          //......Visibilidade
        imageUrl={viewerImage}            //......URL da imagem
        instanceName={instanceName}       //......Nome da instancia
        onClose={() => setShowShareModal(false)}
        onForward={handleShareForward}    //......Handler encaminhar
      />
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default LeadChatScreen;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal da tela
  screenContainer: {
    flex: 1,                              //......Ocupa todo espaco
    display: 'flex',                      //......Display flex
    flexDirection: 'column',              //......Direcao vertical
    height: '100%',                       //......Altura total
    maxHeight: '100vh',                   //......Altura maxima viewport
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
    minHeight: 0,                         //......Permite encolher abaixo conteudo
    position: 'relative',                 //......Posicao relativa
    zIndex: 1,                            //......Acima do fundo
    backgroundColor: 'transparent',       //......Fundo transparente
  },

  // Estilo da imagem de fundo (camada fixa)
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

  // Overlay transparente para fechar AttachmentMenu
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
