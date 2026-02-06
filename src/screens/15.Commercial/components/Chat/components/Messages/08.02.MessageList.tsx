// ========================================
// Componente MessageList
// Lista de mensagens do chat
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useRef,                                 //......Hook de ref
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useMemo,                                //......Hook de memo
  useEffect,                              //......Hook de efeito
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  FlatList,                               //......Lista performatica
  View,                                   //......Container basico
  StyleSheet,                             //......Estilos
  ListRenderItem,                         //......Tipo render item
  LayoutChangeEvent,                      //......Evento de layout
  NativeSyntheticEvent,                   //......Evento sintetico
  NativeScrollEvent,                      //......Evento de scroll
  Platform,                               //......Plataforma
  Pressable,                              //......Toque
  Animated,                               //......Animacoes
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Icones SVG
// ========================================
import Svg, { Path } from 'react-native-svg';

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Componentes
// ========================================
import MessageBubble from './08.03.MessageBubble';
import TextMessage from './08.04.TextMessage';
import AudioMessage from './08.05.AudioMessage';
import ImageMessage from './08.06.ImageMessage';
import VideoMessage from './08.11.VideoMessage';
import DocumentMessage from './08.07.DocumentMessage';
import DateDivider from './08.09.DateDivider';
import DeletedMessage from './08.10.DeletedMessage';
import SwipeableMessage from './08.13.SwipeableMessage';

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  AudioContent,                           //......Conteudo audio
  ImageContent,                           //......Conteudo imagem
  VideoContent,                           //......Conteudo video
  DocumentContent,                        //......Conteudo documento
} from '../../types/08.types.whatsapp';   //......Arquivo de tipos

// ========================================
// Imports de Tipo TimestampStyle
// ========================================
import { TimestampStyle } from '../../10.00.LeadLolaSwipeContainer';

// ========================================
// Interface de Props
// ========================================
interface MessageListProps {
  messages: WhatsAppMessage[];            //......Lista de mensagens
  onMessageLongPress?: (message: WhatsAppMessage) => void;
  onReplyPress?: (messageId: string) => void;
  onScrollToMessage?: (messageId: string) => void;
  onImagePress?: (imageUrl: string, message?: WhatsAppMessage) => void;
  onVideoPress?: (videoUrl: string, message?: WhatsAppMessage) => void;
  onAudioRetry?: (message: WhatsAppMessage) => Promise<boolean>;
  onForwardPress?: (url: string) => void; //......Handler encaminhar URL
  onSwipeReply?: (message: WhatsAppMessage) => void;
  timestampStyle?: TimestampStyle;        //......Estilo do timestamp
}

// ========================================
// Interface de Item com Divider
// ========================================
interface ListItem {
  type: 'message' | 'divider';            //......Tipo do item
  data: WhatsAppMessage | Date;           //......Dados
  id: string;                             //......ID unico
}

// ========================================
// Funcao para agrupar por data
// ========================================
const groupMessagesByDate = (messages: WhatsAppMessage[]): ListItem[] => {
  const items: ListItem[] = [];           //......Lista de itens
  let lastDate: string | null = null;     //......Ultima data

  // Ordenar por timestamp
  const sorted = [...messages].sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
  );

  sorted.forEach((message) => {
    const dateStr = message.timestamp.toDateString();

    // Adicionar divider se data mudou
    if (dateStr !== lastDate) {
      items.push({
        type: 'divider',                  //......Tipo divider
        data: message.timestamp,          //......Data do divider
        id: `divider-${dateStr}`,         //......ID unico
      });
      lastDate = dateStr;                 //......Atualiza ultima
    }

    // Adicionar mensagem
    items.push({
      type: 'message',                    //......Tipo mensagem
      data: message,                      //......Dados da mensagem
      id: message.id,                     //......ID da mensagem
    });
  });

  return items;                           //......Retorna lista
};

// ========================================
// Type Guard para TextContent
// ========================================
const isTextContent = (content: unknown): content is TextContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'text' in content &&
    typeof (content as TextContent).text === 'string'
  );
};

// ========================================
// Type Guard para AudioContent
// ========================================
const isAudioContent = (content: unknown): content is AudioContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'duration' in content &&
    typeof (content as AudioContent).duration === 'number'
  );
};

// ========================================
// Type Guard para ImageContent
// Imagem nao tem mimeType (diferente de video)
// ========================================
const isImageContent = (content: unknown): content is ImageContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'url' in content &&
    'width' in content &&
    'height' in content &&
    !('mimeType' in content) &&           //......Nao tem mimeType (diferencia de video)
    !('fileName' in content)              //......Nao e documento
  );
};

// ========================================
// Type Guard para VideoContent
// Video sempre tem mimeType quando enviado
// ========================================
const isVideoContent = (content: unknown): content is VideoContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'url' in content &&
    'width' in content &&
    'height' in content &&
    'mimeType' in content &&              //......Tem mimeType (video)
    !('fileName' in content)              //......Nao e documento
  );
};

// ========================================
// Type Guard para DocumentContent
// ========================================
const isDocumentContent = (content: unknown): content is DocumentContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'fileName' in content &&
    'fileSize' in content
  );
};

// ========================================
// Componente Principal MessageList
// ========================================
const MessageList: React.FC<MessageListProps> = ({
  messages,                               //......Lista mensagens
  onMessageLongPress,                     //......Long press handler
  onReplyPress,                           //......Reply press handler
  onScrollToMessage,                      //......Scroll to handler
  onImagePress,                           //......Image press handler
  onVideoPress,                           //......Video press handler
  onAudioRetry,                           //......Audio retry handler
  onForwardPress,                         //......Forward press handler
  onSwipeReply,                           //......Swipe reply handler
  timestampStyle = 'container',           //......Estilo do timestamp
}) => {
  // ========================================
  // Refs
  // ========================================
  const flatListRef = useRef<FlatList>(null);
  const isNearBottom = useRef(true);       //......Controle de auto-scroll
  const isInitialLoad = useRef(true);      //......Flag primeiro carregamento
  const lastContentHeight = useRef(0);     //......Ultima altura do conteudo

  // ========================================
  // State de highlight para scroll ao reply
  // ========================================
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  // ========================================
  // State e animacao do botao scroll-to-bottom
  // ========================================
  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollButtonOpacity = useRef(new Animated.Value(0)).current;

  // ========================================
  // DEBUG: Log quando monta
  // ========================================
  useEffect(() => {
    console.log('[MessageList] ========================================');
    console.log('[MessageList] MONTADO');
    console.log('[MessageList] messages count:', messages.length);
    console.log('[MessageList] ========================================');
    return () => {
      console.log('[MessageList] DESMONTADO');
    };
  }, []);

  // ========================================
  // DEBUG: Log quando messages mudam
  // ========================================
  useEffect(() => {
    console.log('[MessageList] Messages ALTERADAS:', messages.length);

    // Verificar duplicatas
    const ids = messages.map(m => m.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error('[MessageList] ERRO: IDs DUPLICADOS DETECTADOS!');
      const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
      console.error('[MessageList] IDs duplicados:', duplicates);
    }
  }, [messages]);

  // ========================================
  // DEBUG: Handler de Layout
  // ========================================
  const handleFlatListLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[MessageList] FlatList LAYOUT:', { x, y, width, height });
  }, []);

  // ========================================
  // Handler de ContentSizeChange (para debug)
  // Com inverted={true}, nao precisa de scroll manual
  // ========================================
  const handleContentSizeChange = useCallback((w: number, h: number) => {
    // Evita log desnecessario se altura nao mudou
    if (h === lastContentHeight.current) return;
    lastContentHeight.current = h;         //......Atualiza altura
    // Lista invertida: scroll automatico para o final (topo invertido)
  }, []);

  // ========================================
  // Animacao do botao scroll-to-bottom
  // ========================================
  useEffect(() => {
    Animated.timing(scrollButtonOpacity, {
      toValue: showScrollButton ? 1 : 0,  //......Fade in/out
      duration: 200,                       //......Duracao da animacao
      useNativeDriver: true,               //......Driver nativo
    }).start();
  }, [showScrollButton]);

  // ========================================
  // Handler de Scroll
  // Rastreia posicao para controlar botao scroll-to-bottom
  // Com inverted={true}, "fundo" é o topo (offset 0)
  // ========================================
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset } = event.nativeEvent;
    // Com lista invertida, "fundo" é quando offset está perto de 0
    const nearBottom = contentOffset.y < 100;        //......Threshold de 100px
    isNearBottom.current = nearBottom;               //......Atualiza ref
    setShowScrollButton(!nearBottom);                //......Mostra botao quando longe do fundo
  }, []);

  // ========================================
  // Agrupar mensagens por data e inverter para lista invertida
  // ========================================
  const listItems = useMemo(() => {
    const grouped = groupMessagesByDate(messages);
    // Inverter para lista invertida (mais recentes primeiro)
    return grouped.reverse();
  }, [messages]);

  // ========================================
  // Handler de Long Press
  // ========================================
  const handleLongPress = useCallback((message: WhatsAppMessage) => {
    onMessageLongPress?.(message);        //......Chama callback
  }, [onMessageLongPress]);

  // ========================================
  // Handler de Reply Press
  // Scroll automatico ate a mensagem citada com highlight temporario
  // ========================================
  const handleReplyPress = useCallback((messageId: string) => {
    console.log('[🟢 SCROLL_DEBUG] 2. handleReplyPress CHAMADO');
    console.log('[🟢 SCROLL_DEBUG] 2.1 messageId (stanzaId) procurado:', messageId);

    // Buscar por messageKey.id (WhatsApp key) pois replyTo.messageId vem do stanzaId
    const targetIndex = listItems.findIndex((item) => {
      if (item.type !== 'message') return false;
      const msg = item.data as WhatsAppMessage;
      return msg.messageKey?.id === messageId;
    });

    console.log('[🟢 SCROLL_DEBUG] 2.2 targetIndex encontrado:', targetIndex);

    if (targetIndex !== -1 && flatListRef.current) {
      const targetMsg = listItems[targetIndex].data as WhatsAppMessage;
      console.log('[🟢 SCROLL_DEBUG] 3. Scroll para mensagem:', targetMsg.id);

      try {
        flatListRef.current.scrollToIndex({
          index: targetIndex,              //......Indice da mensagem alvo
          animated: true,                  //......Scroll suave
          viewPosition: 0.3,              //......Posiciona a 30% do topo
        });
      } catch (error) {
        console.error('[🟢 SCROLL_DEBUG] 3.1 ERRO no scrollToIndex:', error);
      }

      // Highlight temporario na mensagem alvo (usar ID interno)
      // 6s = 5s pulsacao + 0.4s fade out + buffer
      setHighlightedMessageId(targetMsg.id);
      setTimeout(() => setHighlightedMessageId(null), 6000);
    } else {
      console.warn('[🟢 SCROLL_DEBUG] 2.3 Mensagem nao encontrada na lista');
    }

    onReplyPress?.(messageId);           //......Chama callback externo
  }, [onReplyPress, listItems]);

  // ========================================
  // Handler de Image Press
  // ========================================
  const handleImagePress = useCallback((imageUrl: string, message?: WhatsAppMessage) => {
    onImagePress?.(imageUrl, message);    //......Chama callback
  }, [onImagePress]);

  // ========================================
  // Handler de Video Press
  // ========================================
  const handleVideoPress = useCallback((videoUrl: string, message?: WhatsAppMessage) => {
    console.log('[MessageList] handleVideoPress chamado, videoUrl:', videoUrl);
    console.log('[MessageList] onVideoPress existe:', !!onVideoPress);
    onVideoPress?.(videoUrl, message);    //......Chama callback
  }, [onVideoPress]);

  // ========================================
  // Constantes de Espacamento
  // AJUSTE-ESPACAMENTO: Altere os valores para ajustar espacamento entre mensagens
  // ========================================
  const SPACING_SAME_SENDER = 5;          //......Espacamento mesmo remetente (5px)
  const SPACING_DIFFERENT_SENDER = 10;    //......Espacamento remetente diferente (10px)

  // ========================================
  // Render Item
  // ========================================
  const renderItem: ListRenderItem<ListItem> = useCallback(({ item, index }) => {
    // Render Divider
    if (item.type === 'divider') {
      return (
        <DateDivider
          date={item.data as Date}        //......Data do divider
        />
      );
    }

    // Render Message
    const message = item.data as WhatsAppMessage;
    const isOutgoing = message.direction === 'outgoing';

    // Calcular espacamento baseado na mensagem acima (com inverted, é index + 1)
    let marginBottom = SPACING_SAME_SENDER; //......Padrao: mesmo remetente
    if (index < listItems.length - 1) {
      const nextItem = listItems[index + 1];
      if (nextItem.type === 'message') {
        const nextMessage = nextItem.data as WhatsAppMessage;
        const isSameSender = nextMessage.direction === message.direction;
        marginBottom = isSameSender ? SPACING_SAME_SENDER : SPACING_DIFFERENT_SENDER;
      }
    }

    // Imagens renderizadas diretamente sem MessageBubble
    if (message.type === 'image' && isImageContent(message.content)) {
      const imageUrl = message.content.thumbnail || message.content.url;
      return (
        <SwipeableMessage onSwipeReply={() => onSwipeReply?.(message)}>
          <View
            style={[
              styles.imageContainer,        //......Container da imagem
              isOutgoing ? styles.imageContainerOutgoing : styles.imageContainerIncoming,
              { marginBottom },                //......Espacamento condicional
            ]}
          >
            <ImageMessage
              content={message.content}     //......Conteudo
              isOutgoing={isOutgoing}       //......Direcao
              timestamp={message.timestamp} //......Hora de envio
              status={message.status}       //......Status da mensagem
              reaction={message.reaction}   //......Reacao (emoji)
              timestampStyle={timestampStyle}
              onPress={() => handleImagePress(imageUrl, message)}
            />
          </View>
        </SwipeableMessage>
      );
    }

    // Videos renderizados diretamente sem MessageBubble
    if (message.type === 'video' && isVideoContent(message.content)) {
      const videoUrl = message.content.url;
      return (
        <SwipeableMessage onSwipeReply={() => onSwipeReply?.(message)}>
        <View
          style={[
            styles.imageContainer,        //......Container do video (mesmo estilo de imagem)
            isOutgoing ? styles.imageContainerOutgoing : styles.imageContainerIncoming,
            { marginBottom },                //......Espacamento condicional
          ]}
        >
          {/* Botao compartilhar (esquerda para outgoing) */}
          {isOutgoing && onForwardPress && (
            <Pressable
              style={styles.videoForwardButton}
              onPress={() => onForwardPress(videoUrl)}
              hitSlop={8}
            >
              <Svg width={14} height={12} viewBox="0 0 24 20">
                <Path d="M13.9996 5.00365V0.752138C13.9987 0.604446 14.0416 0.459812 14.1229 0.336474C14.2041 0.213135 14.3201 0.116614 14.4561 0.0590801C14.5922 0.00154609 14.7422 -0.0144249 14.8873 0.0131808C15.0324 0.0407865 15.1661 0.110733 15.2715 0.214201L23.7712 8.46325C23.8436 8.53293 23.9011 8.61648 23.9404 8.70891C23.9797 8.80134 24 8.90075 24 9.00118C24 9.10162 23.9797 9.20103 23.9404 9.29346C23.9011 9.38589 23.8436 9.46944 23.7712 9.53912L15.2715 17.7882C15.0545 17.9981 14.7325 18.0571 14.4575 17.9411C14.3219 17.8835 14.2062 17.7873 14.1247 17.6645C14.0433 17.5417 13.9998 17.3976 13.9996 17.2502V13.0007H12.5816C7.94575 13.0007 3.67188 15.5204 1.42896 19.572L1.40796 19.61C1.32801 19.7561 1.20169 19.8715 1.04891 19.9379C0.89613 20.0042 0.72559 20.0179 0.564198 19.9766C0.402803 19.9354 0.259743 19.8415 0.157583 19.71C0.0554237 19.5784 -1.90735e-05 19.4166 0 19.25C0 11.4769 6.2568 5.13763 13.9996 5.00365Z" fill="#FFFFFF" />
              </Svg>
            </Pressable>
          )}

          <VideoMessage
            content={message.content}     //......Conteudo
            isOutgoing={isOutgoing}       //......Direcao
            timestamp={message.timestamp} //......Hora de envio
            status={message.status}       //......Status da mensagem
            reaction={message.reaction}   //......Reacao (emoji)
            timestampStyle={timestampStyle}
            onPress={() => handleVideoPress(videoUrl, message)}
          />

          {/* Botao compartilhar (direita para incoming) */}
          {!isOutgoing && onForwardPress && (
            <Pressable
              style={styles.videoForwardButton}
              onPress={() => onForwardPress(videoUrl)}
              hitSlop={8}
            >
              <Svg width={14} height={12} viewBox="0 0 24 20">
                <Path d="M13.9996 5.00365V0.752138C13.9987 0.604446 14.0416 0.459812 14.1229 0.336474C14.2041 0.213135 14.3201 0.116614 14.4561 0.0590801C14.5922 0.00154609 14.7422 -0.0144249 14.8873 0.0131808C15.0324 0.0407865 15.1661 0.110733 15.2715 0.214201L23.7712 8.46325C23.8436 8.53293 23.9011 8.61648 23.9404 8.70891C23.9797 8.80134 24 8.90075 24 9.00118C24 9.10162 23.9797 9.20103 23.9404 9.29346C23.9011 9.38589 23.8436 9.46944 23.7712 9.53912L15.2715 17.7882C15.0545 17.9981 14.7325 18.0571 14.4575 17.9411C14.3219 17.8835 14.2062 17.7873 14.1247 17.6645C14.0433 17.5417 13.9998 17.3976 13.9996 17.2502V13.0007H12.5816C7.94575 13.0007 3.67188 15.5204 1.42896 19.572L1.40796 19.61C1.32801 19.7561 1.20169 19.8715 1.04891 19.9379C0.89613 20.0042 0.72559 20.0179 0.564198 19.9766C0.402803 19.9354 0.259743 19.8415 0.157583 19.71C0.0554237 19.5784 -1.90735e-05 19.4166 0 19.25C0 11.4769 6.2568 5.13763 13.9996 5.00365Z" fill="#FFFFFF" />
              </Svg>
            </Pressable>
          )}
        </View>
        </SwipeableMessage>
      );
    }

    // Renderizar conteudo por tipo
    const renderContent = () => {
      switch (message.type) {
        case 'text':                      //......Mensagem texto
          if (isTextContent(message.content)) {
            return (
              <TextMessage
                content={message.content} //......Conteudo
                isOutgoing={isOutgoing}
              />
            );
          }
          return null;

        case 'audio':                     //......Mensagem audio
          if (isAudioContent(message.content)) {
            return (
              <AudioMessage
                content={message.content} //......Conteudo
                isOutgoing={isOutgoing}
                timestamp={message.timestamp}
                status={message.status}
                timestampStyle={timestampStyle}
                onRetry={onAudioRetry ? () => onAudioRetry(message) : undefined}
              />
            );
          }
          return null;

        case 'document':                  //......Mensagem documento
          if (isDocumentContent(message.content)) {
            return (
              <DocumentMessage
                content={message.content} //......Conteudo
                isOutgoing={isOutgoing}
              />
            );
          }
          return null;

        case 'deleted':                   //......Mensagem apagada
          return (
            <DeletedMessage
              isOutgoing={isOutgoing}     //......Direcao
            />
          );

        default:                          //......Padrao
          return null;
      }
    };

    // Detectar link preview para ajustar largura do conteudo
    const hasLinkPreview = message.type === 'text' && isTextContent(message.content) && !!message.content.linkPreview;

    return (
      <SwipeableMessage onSwipeReply={() => onSwipeReply?.(message)}>
      <View style={{ marginBottom }}>
        <MessageBubble
          direction={message.direction}     //......Direcao
          status={message.status}           //......Status
          timestamp={message.timestamp}     //......Timestamp
          replyTo={message.replyTo}         //......Reply info
          senderName={message.senderName}   //......Nome remetente
          highlighted={message.id === highlightedMessageId}
          forceMaxWidth={message.type === 'audio'}
          hideFooter={message.type === 'audio'}
          contentFixedWidth={hasLinkPreview ? 190 : undefined}
          timestampStyle={timestampStyle}
          showForwardButton={hasLinkPreview}
          forwardUrl={hasLinkPreview ? (message.content as TextContent).linkPreview?.url : undefined}
          onForwardPress={onForwardPress}
          onLongPress={() => handleLongPress(message)}
          onReplyPress={() => {
            console.log('[🟢 SCROLL_DEBUG] 1.5 onReplyPress do MessageBubble disparado');
            console.log('[🟢 SCROLL_DEBUG] 1.5.1 message.replyTo:', JSON.stringify(message.replyTo));
            if (message.replyTo) {
              handleReplyPress(message.replyTo.messageId);
            } else {
              console.warn('[🟢 SCROLL_DEBUG] 1.5.2 message.replyTo NAO EXISTE');
            }
          }}
        >
          {renderContent()}
        </MessageBubble>
      </View>
      </SwipeableMessage>
    );
  }, [handleLongPress, handleReplyPress, handleImagePress, handleVideoPress, onAudioRetry, onForwardPress, onSwipeReply, timestampStyle, listItems, highlightedMessageId]);

  // ========================================
  // Key Extractor
  // ========================================
  const keyExtractor = useCallback((item: ListItem) => {
    return item.id;                       //......Retorna ID
  }, []);

  // ========================================
  // Scroll to End (com inverted, offset 0 é o final)
  // ========================================
  const scrollToEnd = useCallback(() => {
    flatListRef.current?.scrollToOffset({
      offset: 0,                          //......Com inverted, 0 é o final
      animated: true,                     //......Scroll suave
    });
  }, []);

  // ========================================
  // Render Principal
  // ========================================
  console.log('[MessageList] RENDER - items:', listItems.length);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}                   //......Referencia
        style={styles.container}            //......Estilo container
        data={listItems}                    //......Dados (invertidos)
        renderItem={renderItem}             //......Render item
        keyExtractor={keyExtractor}         //......Key extractor
        contentContainerStyle={styles.listContent}
        inverted={true}                     //......Lista invertida (abre no final)
        showsVerticalScrollIndicator={true} //......Mostra indicador
        initialNumToRender={20}             //......Render inicial (mais para cobrir tela)
        maxToRenderPerBatch={10}            //......Max por batch
        windowSize={10}                     //......Tamanho janela
        removeClippedSubviews={false}       //......Nao remove
        onContentSizeChange={handleContentSizeChange}
        onScroll={handleScroll}             //......Rastreia posicao scroll
        scrollEventThrottle={100}           //......Intervalo evento scroll
        keyboardShouldPersistTaps="handled" //......Taps com teclado
        keyboardDismissMode="on-drag"       //......Fecha teclado ao arrastar
        overScrollMode="always"             //......Permite over scroll
        onLayout={handleFlatListLayout}     //......Debug layout
        nestedScrollEnabled={true}          //......Permite scroll aninhado
        onScrollToIndexFailed={(info) => {
          console.warn('[🟢 SCROLL_DEBUG] 4. onScrollToIndexFailed disparado!');
          console.warn('[🟢 SCROLL_DEBUG] 4.1 info:', JSON.stringify(info));
          flatListRef.current?.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,                //......Scroll estimado
          });
          setTimeout(() => {
            console.log('[🟢 SCROLL_DEBUG] 4.2 Retry scrollToIndex, index:', info.index);
            flatListRef.current?.scrollToIndex({
              index: info.index,           //......Retry scroll exato
              animated: true,              //......Scroll suave
              viewPosition: 0.3,           //......Posiciona a 30% do topo
            });
          }, 300);
        }}
      />

      {/* Botao flutuante scroll-to-bottom (estilo WhatsApp) */}
      {showScrollButton && (
        <Animated.View
          style={[
            styles.scrollToBottomButton,
            { opacity: scrollButtonOpacity },
          ]}
          pointerEvents={showScrollButton ? 'auto' : 'none'}
        >
          <Pressable
            onPress={scrollToEnd}
            style={styles.scrollToBottomPressable}
            hitSlop={8}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 9L12 15L18 9"
                stroke="#8696A0"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default MessageList;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Wrapper que envolve FlatList e botao flutuante
  wrapper: {
    flex: 1,                              //......Ocupa todo espaco
    minHeight: 0,                         //......FIX: Permite flex shrink na web
    position: 'relative' as any,          //......Referencia para posicionamento absoluto
  },

  // Container principal (FlatList)
  container: {
    flex: 1,                              //......Ocupa todo espaco
    minHeight: 0,                         //......FIX: Permite flex shrink na web
    backgroundColor: 'transparent',       //......Fundo transparente para mostrar imagem
    ...(Platform.OS === 'web' ? {
      position: 'absolute' as any,        //......Posicao absoluta na web
      top: 0,                             //......Topo
      left: 0,                            //......Esquerda
      right: 0,                           //......Direita
      bottom: 0,                          //......Fundo
      width: '100%',                      //......FIX: Largura 100% do pai
      maxWidth: '100%',                   //......FIX: Limita largura maxima
      overflow: 'auto' as any,            //......Scroll na web
    } : {}),
  },

  // Conteudo da lista
  listContent: {
    paddingVertical: 8,                   //......Padding vertical
    paddingHorizontal: 8,                 //......Padding horizontal
    ...(Platform.OS === 'web' ? {
      flexGrow: 0,                        //......Nao cresce na web
    } : {}),
  },

  // Container da imagem (sem MessageBubble)
  // marginBottom aplicado dinamicamente via renderItem (lista invertida)
  imageContainer: {
    flexDirection: 'row',                 //......Layout horizontal
    paddingHorizontal: 12,                //......Padding horizontal
  },

  // Container imagem incoming (esquerda)
  imageContainerIncoming: {
    justifyContent: 'flex-start',         //......Alinha esquerda
  },

  // Container imagem outgoing (direita)
  imageContainerOutgoing: {
    justifyContent: 'flex-end',           //......Alinha direita
  },

  // Botao de compartilhar video (circulo com seta)
  videoForwardButton: {
    width: 28,                            //......Largura do botao
    height: 28,                           //......Altura do botao
    borderRadius: 14,                     //......Circulo perfeito
    backgroundColor: 'rgba(0,0,0,0.35)',  //......Fundo escuro translucido
    justifyContent: 'center',             //......Centraliza icone vertical
    alignItems: 'center',                 //......Centraliza icone horizontal
    alignSelf: 'center',                  //......Centraliza vertical com o video
    marginHorizontal: 6,                  //......Espaco lateral do video
  },

  // Botao flutuante scroll-to-bottom (estilo WhatsApp)
  scrollToBottomButton: {
    position: 'absolute',                 //......Posicao absoluta sobre a lista
    bottom: 16,                           //......Distancia do fundo
    right: 12,                            //......Distancia da direita
    zIndex: 20,                           //......Acima da lista
  },

  // Area tocavel do botao scroll-to-bottom
  scrollToBottomPressable: {
    width: 40,                            //......Largura do botao
    height: 40,                           //......Altura do botao
    borderRadius: 20,                     //......Circulo perfeito
    backgroundColor: '#FFFFFF',           //......Fundo branco
    justifyContent: 'center',             //......Centraliza icone vertical
    alignItems: 'center',                 //......Centraliza icone horizontal
    elevation: 4,                         //......Sombra Android
    shadowColor: '#000000',               //......Cor sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,                   //......Opacidade sombra
    shadowRadius: 4,                      //......Raio sombra
  },
});
