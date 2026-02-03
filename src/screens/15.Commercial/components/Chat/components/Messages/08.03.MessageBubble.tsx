// ========================================
// Componente MessageBubble
// Container da bolha de mensagem
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React from 'react';                //......React core
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Componentes
// ========================================
import MessageStatus from './08.08.MessageStatus';

// ========================================
// Imports de Tipos
// ========================================
import {                                  //......Tipos da mensagem
  WhatsAppMessage,                        //......Interface mensagem
  MessageDirection,                       //......Direcao
  MessageStatus as StatusType,            //......Status
  ReplyInfo,                              //......Info reply
} from '../../types/08.types.whatsapp';   //......Arquivo de tipos

// ========================================
// Imports de Funcoes
// ========================================
import { formatMessageTime } from '../../data/08.mockMessages';

// ========================================
// Interface de Props
// ========================================
interface MessageBubbleProps {
  direction: MessageDirection;            //......Incoming ou outgoing
  status: StatusType;                     //......Status da mensagem
  timestamp: Date;                        //......Data hora
  replyTo?: ReplyInfo;                    //......Reply info
  senderName?: string;                    //......Nome do remetente
  showSenderName?: boolean;               //......Mostrar nome
  onLongPress?: () => void;               //......Long press handler
  onReplyPress?: () => void;              //......Press no reply
  children: React.ReactNode;              //......Conteudo da mensagem
  isTextMessage?: boolean;                //......Se e mensagem de texto
  forceMaxWidth?: boolean;                //......Forca largura maxima (audio)
  hideFooter?: boolean;                   //......Esconde footer (audio)
}

// ========================================
// Componente ReplyPreview
// ========================================
const ReplyPreview: React.FC<{
  replyTo: ReplyInfo;                     //......Info do reply
  isOutgoing: boolean;                    //......Se e enviada
  onPress?: () => void;                   //......Handler press
}> = ({ replyTo, isOutgoing, onPress }) => (
  <Pressable                              //......Pressable container
    style={[
      styles.replyContainer,              //......Estilo base
      isOutgoing ? styles.replyOutgoing : styles.replyIncoming,
    ]}
    onPress={onPress}                     //......Handler
  >
    {/* Barra Lateral */}
    <View style={styles.replyBar} />

    {/* Conteudo do Reply */}
    <View style={styles.replyContent}>
      {/* Nome do Remetente */}
      <Text
        style={[
          styles.replySender,             //......Estilo nome
          isOutgoing && styles.replySenderOutgoing,
        ]}
        numberOfLines={1}                 //......Uma linha
      >
        {replyTo.senderName}
      </Text>

      {/* Preview do Conteudo */}
      <Text
        style={[
          styles.replyText,               //......Estilo texto
          isOutgoing && styles.replyTextOutgoing,
        ]}
        numberOfLines={1}                 //......Uma linha
      >
        {replyTo.type === 'image' && '📷 Foto'}
        {replyTo.type === 'audio' && '🎤 Áudio'}
        {replyTo.type === 'document' && '📄 Documento'}
        {replyTo.type === 'text' && replyTo.content}
      </Text>
    </View>
  </Pressable>
);

// ========================================
// Componente Principal MessageBubble
// ========================================
const MessageBubble: React.FC<MessageBubbleProps> = ({
  direction,                              //......Direcao
  status,                                 //......Status
  timestamp,                              //......Data hora
  replyTo,                                //......Reply opcional
  senderName,                             //......Nome remetente
  showSenderName = false,                 //......Mostrar nome
  onLongPress,                            //......Long press
  onReplyPress,                           //......Press reply
  children,                               //......Conteudo
  isTextMessage = true,                   //......E texto por padrao
  forceMaxWidth = false,                  //......Forca largura maxima
  hideFooter = false,                     //......Esconde footer
}) => {
  // ========================================
  // Calcular se e outgoing
  // ========================================
  const isOutgoing = direction === 'outgoing';

  // ========================================
  // Formatar hora
  // ========================================
  const formattedTime = formatMessageTime(timestamp);

  // ========================================
  // Render Principal
  // ========================================
  return (
    <View
      style={[
        styles.container,                 //......Container base
        isOutgoing ? styles.containerOutgoing : styles.containerIncoming,
      ]}
    >
      {/* Bolha */}
      <Pressable
        style={[
          styles.bubble,                  //......Bolha base
          isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,
          forceMaxWidth && { width: '80%' },
        ]}
        onLongPress={onLongPress}         //......Long press
      >
        {/* Nome do Remetente (Grupo) */}
        {showSenderName && senderName && !isOutgoing && (
          <Text style={styles.senderName}>
            {senderName}
          </Text>
        )}

        {/* Reply Preview */}
        {replyTo && (
          <ReplyPreview
            replyTo={replyTo}             //......Info reply
            isOutgoing={isOutgoing}       //......Direcao
            onPress={onReplyPress}        //......Handler
          />
        )}

        {/* Container Interno com FlexWrap para Horario Inteligente */}
        <View style={styles.innerWrapper}>
          {/* Conteudo da Mensagem */}
          <View style={styles.contentContainer}>
            {children}
          </View>

          {/* Spacer: Cria espaco minimo e empurra footer para direita */}
          {!hideFooter && <View style={styles.footerSpacer} />}

          {/* Footer: Container padronizado com Hora + Status */}
          {!hideFooter && (
            <View style={[
              styles.footer,
              { borderColor: isOutgoing ? '#1777CF' : '#3A3F51' },
            ]}>
              {/* Hora */}
              <Text style={styles.timestamp}>
                {formattedTime}
              </Text>

              {/* Status (apenas outgoing) */}
              {isOutgoing && (
                <MessageStatus
                  status={status}             //......Status
                  isOutgoing={isOutgoing}     //......Direcao
                  size={13}                   //......Tamanho
                />
              )}
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default MessageBubble;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  container: {
    flexDirection: 'row',                 //......Layout horizontal
    marginVertical: 2,                    //......Margem vertical
    paddingHorizontal: 12,                //......Padding horizontal
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Container mensagem recebida
  containerIncoming: {
    justifyContent: 'flex-start',         //......Alinha esquerda
  },

  // Container mensagem enviada
  containerOutgoing: {
    justifyContent: 'flex-end',           //......Alinha direita
  },

  // Bolha base
  bubble: {
    maxWidth: '80%',                      //......Largura maxima
    minWidth: 80,                         //......Largura minima
    paddingVertical: 6,                   //......Padding vertical
    paddingHorizontal: 8,                 //......Padding horizontal
    borderRadius: 8,                      //......Arredondamento uniforme
    borderWidth: 2,                       //......Largura da borda
    overflow: 'visible',                  //......Permite conteudo alem dos limites
    shadowColor: ChatColors.shadow,       //......Cor sombra
    shadowOffset: {                       //......Offset sombra
      width: 0,                           //......Offset X
      height: 1,                          //......Offset Y
    },
    shadowOpacity: 0.1,                   //......Opacidade sombra
    shadowRadius: 2,                      //......Raio sombra
    elevation: 1,                         //......Elevacao Android
  },

  // Bolha mensagem recebida
  bubbleIncoming: {
    backgroundColor: ChatColors.incomingBubble,
    borderColor: '#3A3F51',               //......Borda cinza escuro
  },

  // Bolha mensagem enviada
  bubbleOutgoing: {
    backgroundColor: ChatColors.outgoingBubble,
    borderColor: '#1777CF',               //......Borda azul
  },

  // Nome do remetente
  senderName: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte semi bold
    fontSize: 13,                         //......Tamanho fonte
    color: ChatColors.link,               //......Cor azul
    marginBottom: 4,                      //......Margem inferior
  },

  // Wrapper interno com flexWrap
  innerWrapper: {
    flexDirection: 'row',                 //......Layout horizontal
    flexWrap: 'wrap',                     //......Permite quebra
    alignItems: 'flex-end',               //......Alinha na base
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Container do conteudo
  contentContainer: {
    flexShrink: 1,                        //......Permite encolher
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Spacer entre conteudo e footer
  // Cria espaco minimo de 25px para mensagens de uma linha
  // E empurra o footer para direita em mensagens multi-linha
  footerSpacer: {
    flexGrow: 1,                          //......Empurra footer para direita
    minWidth: 25,                         //......Espaco minimo de 25px
  },

  // Footer: Container branco padronizado com hora e status
  // ========================================
  // AJUSTES MANUAIS DO CONTAINER DE HORARIO:
  // height: Altura do container (aumentar = mais alto)
  // marginTop: Posicao vertical (aumentar = desce | diminuir = sobe)
  // marginBottom: Quanto desce na borda (mais negativo = mais para baixo)
  // marginLeft: Espaco entre texto e horario
  // ========================================
  footer: {
    height: 20,                           //......AJUSTE: Altura do container
    paddingHorizontal: 10,                //......Padding horizontal
    paddingTop: 2,                        //......AJUSTE: Padding superior
    backgroundColor: 'rgba(252, 252, 252, 0.5)', //..TESTE: Fundo branco 50%
    borderTopLeftRadius: 12,              //......Arredonda canto superior esquerdo
    borderBottomRightRadius: 6,           //......Arredonda igual ao bubble
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    gap: 5,                               //......Espaco entre hora e check
    marginLeft: 'auto',                    //......Empurra para extrema direita
    marginTop: 4,                         //......AJUSTE: Sobe/desce o container (+ = desce)
    marginRight: -10,                     //......Estende alem da borda do bubble
    marginBottom: -8,                     //......AJUSTE: Encaixe na borda inferior
    borderRightWidth: 2,                  //......Borda direita continua do bubble
    borderBottomWidth: 2,                 //......Borda inferior continua do bubble
  },

  // Timestamp (preto sobre fundo branco)
  timestamp: {
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontSize: 12,                         //......Tamanho fonte
    color: '#3A3F51',                     //......Cor preta
  },

  // Container do reply
  replyContainer: {
    flexDirection: 'row',                 //......Layout horizontal
    borderRadius: 8,                      //......Borda arredondada
    marginBottom: 8,                      //......Margem inferior
    overflow: 'hidden',                   //......Corta overflow
  },

  // Reply mensagem recebida
  replyIncoming: {
    backgroundColor: ChatColors.replyBackground,
  },

  // Reply mensagem enviada
  replyOutgoing: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Barra lateral do reply
  replyBar: {
    width: 4,                             //......Largura barra
    backgroundColor: ChatColors.replyBorder,
  },

  // Conteudo do reply
  replyContent: {
    flex: 1,                              //......Ocupa espaco
    padding: 8,                           //......Padding
  },

  // Nome remetente reply
  replySender: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte bold
    fontSize: 12,                         //......Tamanho fonte
    color: ChatColors.replyBorder,        //......Cor azul
    marginBottom: 2,                      //......Margem inferior
  },

  // Nome remetente reply outgoing
  replySenderOutgoing: {
    color: ChatColors.white,              //......Cor branca
  },

  // Texto do reply
  replyText: {
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontSize: 12,                         //......Tamanho fonte
    color: ChatColors.replyText,          //......Cor texto
  },

  // Texto reply outgoing
  replyTextOutgoing: {
    color: ChatColors.replyTextOutgoing,  //......Cor clara
  },
});
