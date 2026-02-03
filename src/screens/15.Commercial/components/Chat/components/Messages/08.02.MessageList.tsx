// ========================================
// Componente MessageList
// Lista de mensagens do chat
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useRef,                                 //......Hook de ref
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
} from 'react-native';                    //......Biblioteca RN

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
import DocumentMessage from './08.07.DocumentMessage';
import DateDivider from './08.09.DateDivider';
import DeletedMessage from './08.10.DeletedMessage';

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos
  WhatsAppMessage,                        //......Interface mensagem
  TextContent,                            //......Conteudo texto
  AudioContent,                           //......Conteudo audio
  ImageContent,                           //......Conteudo imagem
  DocumentContent,                        //......Conteudo documento
} from '../../types/08.types.whatsapp';   //......Arquivo de tipos

// ========================================
// Interface de Props
// ========================================
interface MessageListProps {
  messages: WhatsAppMessage[];            //......Lista de mensagens
  onMessageLongPress?: (message: WhatsAppMessage) => void;
  onReplyPress?: (messageId: string) => void;
  onScrollToMessage?: (messageId: string) => void;
  onImagePress?: (imageUrl: string, message?: WhatsAppMessage) => void;
  onAudioRetry?: (message: WhatsAppMessage) => Promise<boolean>;
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
// ========================================
const isImageContent = (content: unknown): content is ImageContent => {
  return (
    typeof content === 'object' &&
    content !== null &&
    'url' in content &&
    'width' in content &&
    'height' in content
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
  onAudioRetry,                           //......Audio retry handler
}) => {
  // ========================================
  // Refs
  // ========================================
  const flatListRef = useRef<FlatList>(null);

  // ========================================
  // DEBUG: Log quando monta
  // ========================================
  useEffect(() => {
    console.log('[MessageList] MONTADO');
    console.log('[MessageList] messages count:', messages.length);
    return () => {
      console.log('[MessageList] DESMONTADO');
    };
  }, []);

  // ========================================
  // DEBUG: Handler de Layout
  // ========================================
  const handleFlatListLayout = useCallback((event: LayoutChangeEvent) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[MessageList] FlatList layout:', { x, y, width, height });
  }, []);

  // ========================================
  // Agrupar mensagens por data
  // ========================================
  const listItems = useMemo(() => {
    return groupMessagesByDate(messages);
  }, [messages]);

  // ========================================
  // Handler de Long Press
  // ========================================
  const handleLongPress = useCallback((message: WhatsAppMessage) => {
    onMessageLongPress?.(message);        //......Chama callback
  }, [onMessageLongPress]);

  // ========================================
  // Handler de Reply Press
  // ========================================
  const handleReplyPress = useCallback((messageId: string) => {
    onReplyPress?.(messageId);            //......Chama callback
  }, [onReplyPress]);

  // ========================================
  // Handler de Image Press
  // ========================================
  const handleImagePress = useCallback((imageUrl: string, message?: WhatsAppMessage) => {
    onImagePress?.(imageUrl, message);    //......Chama callback
  }, [onImagePress]);

  // ========================================
  // Render Item
  // ========================================
  const renderItem: ListRenderItem<ListItem> = useCallback(({ item }) => {
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

    // Imagens renderizadas diretamente sem MessageBubble
    if (message.type === 'image' && isImageContent(message.content)) {
      const imageUrl = message.content.thumbnail || message.content.url;
      return (
        <View
          style={[
            styles.imageContainer,        //......Container da imagem
            isOutgoing ? styles.imageContainerOutgoing : styles.imageContainerIncoming,
          ]}
        >
          <ImageMessage
            content={message.content}     //......Conteudo
            isOutgoing={isOutgoing}       //......Direcao
            timestamp={message.timestamp} //......Hora de envio
            status={message.status}       //......Status da mensagem
            reaction={message.reaction}   //......Reacao (emoji)
            onPress={() => handleImagePress(imageUrl, message)}
          />
        </View>
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

    return (
      <MessageBubble
        direction={message.direction}     //......Direcao
        status={message.status}           //......Status
        timestamp={message.timestamp}     //......Timestamp
        replyTo={message.replyTo}         //......Reply info
        senderName={message.senderName}   //......Nome remetente
        forceMaxWidth={message.type === 'audio'}
        hideFooter={message.type === 'audio'}
        onLongPress={() => handleLongPress(message)}
        onReplyPress={() => {
          if (message.replyTo) {
            handleReplyPress(message.replyTo.messageId);
          }
        }}
      >
        {renderContent()}
      </MessageBubble>
    );
  }, [handleLongPress, handleReplyPress, handleImagePress, onAudioRetry]);

  // ========================================
  // Key Extractor
  // ========================================
  const keyExtractor = useCallback((item: ListItem) => {
    return item.id;                       //......Retorna ID
  }, []);

  // ========================================
  // Scroll to End
  // ========================================
  const scrollToEnd = useCallback(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, []);

  // ========================================
  // Render Principal
  // ========================================
  console.log('[MessageList] RENDER - items:', listItems.length);

  return (
    <FlatList
      ref={flatListRef}                   //......Referencia
      style={styles.container}            //......Estilo container
      data={listItems}                    //......Dados
      renderItem={renderItem}             //......Render item
      keyExtractor={keyExtractor}         //......Key extractor
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={true} //......Mostra indicador
      initialNumToRender={15}             //......Render inicial
      maxToRenderPerBatch={10}            //......Max por batch
      windowSize={10}                     //......Tamanho janela
      removeClippedSubviews={false}       //......Nao remove
      onContentSizeChange={scrollToEnd}   //......Scroll ao mudar
      keyboardShouldPersistTaps="handled" //......Taps com teclado
      keyboardDismissMode="on-drag"       //......Fecha teclado ao arrastar
      overScrollMode="always"             //......Permite over scroll
      onLayout={handleFlatListLayout}     //......Debug layout
    />
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
  // Container principal
  container: {
    flex: 1,                              //......Ocupa todo espaco
    backgroundColor: 'transparent',       //......Fundo transparente para mostrar imagem
  },

  // Conteudo da lista
  listContent: {
    paddingVertical: 8,                   //......Padding vertical
    paddingHorizontal: 8,                 //......Padding horizontal
  },

  // Container da imagem (sem MessageBubble)
  imageContainer: {
    flexDirection: 'row',                 //......Layout horizontal
    marginVertical: 2,                    //......Margem vertical
    marginBottom: 12,                     //......Espaco para reacao
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
});
