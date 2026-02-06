// Componente MessageBubble
// Container da bolha de mensagem com botao de encaminhar

// React e React Native
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

// Bibliotecas externas
import Svg, { Path } from 'react-native-svg';

// Tipos
import { MessageDirection, MessageStatus as StatusType, ReplyInfo } from '../../types/08.types.whatsapp';

// Componentes
import MessageStatus from './08.08.MessageStatus';

// Estilos
import { ChatColors } from '../../styles/08.ChatColors';

// Funcoes
import { formatMessageTime } from '../../data/08.mockMessages';

// Interface de Props do MessageBubble
interface MessageBubbleProps {
  direction: MessageDirection;             //...Incoming ou outgoing
  status: StatusType;                      //...Status da mensagem
  timestamp: Date;                         //...Data hora
  replyTo?: ReplyInfo;                     //...Reply info
  senderName?: string;                     //...Nome do remetente
  showSenderName?: boolean;                //...Mostrar nome
  onLongPress?: () => void;                //...Long press handler
  onReplyPress?: () => void;               //...Press no reply
  children: React.ReactNode;               //...Conteudo da mensagem
  isTextMessage?: boolean;                 //...Se e mensagem de texto
  forceMaxWidth?: boolean;                 //...Forca largura maxima (audio)
  hideFooter?: boolean;                    //...Esconde footer (audio)
  highlighted?: boolean;                   //...Destaque ao scroll para reply
  contentFixedWidth?: number;              //...Largura fixa para link preview
  timestampStyle?: string;                 //...Estilo do timestamp
  showForwardButton?: boolean;             //...Mostrar botao encaminhar
  forwardUrl?: string;                     //...URL para compartilhar
  onForwardPress?: (url: string) => void;  //...Handler encaminhar URL
}

// Icone de encaminhar (compartilhar original do sistema)
const ForwardIcon: React.FC = () => (
  <Svg width={14} height={12} viewBox="0 0 24 20">
    <Path
      d="M13.9996 5.00365V0.752138C13.9987 0.604446 14.0416 0.459812 14.1229 0.336474C14.2041 0.213135 14.3201 0.116614 14.4561 0.0590801C14.5922 0.00154609 14.7422 -0.0144249 14.8873 0.0131808C15.0324 0.0407865 15.1661 0.110733 15.2715 0.214201L23.7712 8.46325C23.8436 8.53293 23.9011 8.61648 23.9404 8.70891C23.9797 8.80134 24 8.90075 24 9.00118C24 9.10162 23.9797 9.20103 23.9404 9.29346C23.9011 9.38589 23.8436 9.46944 23.7712 9.53912L15.2715 17.7882C15.0545 17.9981 14.7325 18.0571 14.4575 17.9411C14.3219 17.8835 14.2062 17.7873 14.1247 17.6645C14.0433 17.5417 13.9998 17.3976 13.9996 17.2502V13.0007H12.5816C7.94575 13.0007 3.67188 15.5204 1.42896 19.572L1.40796 19.61C1.32801 19.7561 1.20169 19.8715 1.04891 19.9379C0.89613 20.0042 0.72559 20.0179 0.564198 19.9766C0.402803 19.9354 0.259743 19.8415 0.157583 19.71C0.0554237 19.5784 -1.90735e-05 19.4166 0 19.25C0 11.4769 6.2568 5.13763 13.9996 5.00365Z"
      fill="#FFFFFF"             //...Cor branca
    />
  </Svg>
);

// Componente ReplyPreview
// Preview da mensagem citada dentro do bubble (com thumbnail lateral estilo WhatsApp)
const ReplyPreview: React.FC<{
  replyTo: ReplyInfo;       //...Info do reply
  isOutgoing: boolean;      //...Se e enviada
  onPress?: () => void;     //...Handler press
}> = ({ replyTo, isOutgoing, onPress }) => {
  // Estado da thumbnail (API base64 ou buscada do cache/Microlink)
  const [thumbUri, setThumbUri] = useState<string | null>(replyTo.thumbnail || null);

  // Buscar thumbnail quando linkUrl existe mas thumbnail nao veio da API
  useEffect(() => {
    if (replyTo.thumbnail || !replyTo.linkUrl) return; //...Ja tem thumb ou sem URL

    // Tentar cache localStorage (mesmo formato do LinkPreviewCard)
    try {
      let hash = 0;                                    //...Hash inicial
      for (let i = 0; i < replyTo.linkUrl.length; i++) {
        hash = ((hash << 5) - hash) + replyTo.linkUrl.charCodeAt(i);
        hash |= 0;                                    //...Inteiro 32-bit
      }
      const key = `lp_${Math.abs(hash).toString(36)}`; //...Chave do cache
      const stored = localStorage.getItem(key);         //...Busca cache
      if (stored) {
        const parsed = JSON.parse(stored);              //...Parseia cache
        if (parsed.data?.thumbnail) {
          setThumbUri(parsed.data.thumbnail);           //...Usa cache
          return;
        }
      }
    } catch { /* Cache indisponivel */ }

    // Fallback: buscar via Microlink API
    const fetchThumb = async () => {
      try {
        const encoded = encodeURIComponent(replyTo.linkUrl!);
        const resp = await fetch(`https://api.microlink.io/?url=${encoded}`);
        const json = await resp.json();                //...Parseia resposta
        if (json.status === 'success' && json.data?.image?.url) {
          setThumbUri(json.data.image.url);            //...Usa imagem OG
        }
      } catch { /* Falha silenciosa */ }
    };
    fetchThumb();
  }, [replyTo.thumbnail, replyTo.linkUrl]);

  // Render do reply preview
  return (
    <Pressable
      style={[
        styles.replyContainer,                                       //...Estilo base
        isOutgoing ? styles.replyOutgoing : styles.replyIncoming,    //...Cor direcional
      ]}
      onPress={onPress}        //...Handler
    >
      {/* Barra Lateral */}
      <View style={[styles.replyBar, isOutgoing && styles.replyBarOutgoing]} />

      {/* Conteudo do Reply */}
      <View style={styles.replyContent}>
        {/* Nome do Remetente */}
        <Text
          style={[
            styles.replySender,                            //...Estilo nome
            isOutgoing && styles.replySenderOutgoing,      //...Cor outgoing
          ]}
          numberOfLines={1}    //...Uma linha
        >
          {replyTo.senderName}
        </Text>

        {/* Preview do Conteudo */}
        <Text
          style={[
            styles.replyText,                            //...Estilo texto
            isOutgoing && styles.replyTextOutgoing,      //...Cor outgoing
          ]}
          numberOfLines={3}    //...Tres linhas para URL
        >
          {replyTo.type === 'image' && '📷 Foto'}
          {replyTo.type === 'audio' && '🎤 Áudio'}
          {replyTo.type === 'document' && '📄 Documento'}
          {replyTo.type === 'text' && replyTo.content}
        </Text>
      </View>

      {/* Thumbnail do link preview (lado direito) */}
      {thumbUri && (
        <Image
          source={{ uri: thumbUri }}   //...URI da thumbnail
          style={styles.replyThumbnail}         //...Estilo thumbnail
          resizeMode="cover"                    //...Preenche area
        />
      )}
    </Pressable>
  );
};

// Componente Principal MessageBubble
const MessageBubble: React.FC<MessageBubbleProps> = ({
  direction,                               //...Direcao
  status,                                  //...Status
  timestamp,                               //...Data hora
  replyTo,                                 //...Reply opcional
  senderName,                              //...Nome remetente
  showSenderName = false,                  //...Mostrar nome
  onLongPress,                             //...Long press
  onReplyPress,                            //...Press reply
  children,                                //...Conteudo
  isTextMessage = true,                    //...E texto por padrao
  forceMaxWidth = false,                   //...Forca largura maxima
  hideFooter = false,                      //...Esconde footer
  highlighted = false,                     //...Destaque reply
  contentFixedWidth,                       //...Largura fixa
  timestampStyle,                          //...Estilo timestamp
  showForwardButton = false,               //...Botao encaminhar
  forwardUrl,                              //...URL compartilhar
  onForwardPress,                          //...Handler encaminhar
}) => {
  // Calcular direcao
  const isOutgoing = direction === 'outgoing'; //...Se e enviada
  const formattedTime = formatMessageTime(timestamp); //...Hora formatada

  // Handler para compartilhar URL via modal interno
  const handleForward = () => {
    if (!forwardUrl) return;                   //...Sem URL
    if (onForwardPress) {
      onForwardPress(forwardUrl);              //...Abre modal share
    }
  };

  // Botao de encaminhar (renderizado fora do bubble)
  const forwardButton = showForwardButton && forwardUrl ? (
    <Pressable
      style={styles.forwardButton}       //...Estilo botao
      onPress={handleForward}            //...Handler compartilhar
      hitSlop={8}                        //...Area de toque extra
    >
      <ForwardIcon />
    </Pressable>
  ) : null;

  // Render Principal
  return (
    <View
      style={[
        styles.container,                                                    //...Container base
        isOutgoing ? styles.containerOutgoing : styles.containerIncoming,    //...Alinhamento
      ]}
    >
      {/* Botao encaminhar (esquerda para outgoing) */}
      {isOutgoing && forwardButton}

      {/* Bolha */}
      <Pressable
        style={[
          styles.bubble,                                                     //...Bolha base
          isOutgoing ? styles.bubbleOutgoing : styles.bubbleIncoming,        //...Cor direcional
          forceMaxWidth && { width: '80%' },                                 //...Largura forcada
          contentFixedWidth ? { maxWidth: contentFixedWidth + 20, borderWidth: 0 } : undefined,
          highlighted && styles.bubbleHighlighted,                           //...Destaque
        ]}
        onLongPress={onLongPress}        //...Long press
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
            replyTo={replyTo}            //...Info reply
            isOutgoing={isOutgoing}      //...Direcao
            onPress={onReplyPress}       //...Handler
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
              { borderColor: isOutgoing ? 'transparent' : '#D0D0D0' },
              isOutgoing && styles.footerOutgoing,
              contentFixedWidth ? styles.footerLinkPreview : undefined,
            ]}>
              {/* Hora */}
              <Text style={[
                styles.timestamp,
                isOutgoing && styles.timestampOutgoing,
              ]}>
                {formattedTime}
              </Text>

              {/* Status (apenas outgoing) */}
              {isOutgoing && (
                <View style={styles.checkWrapper}>
                  <MessageStatus
                    status={status}            //...Status
                    isOutgoing={isOutgoing}    //...Direcao
                    size={13}                  //...Tamanho
                    iconColor={'#FFFFFF'}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </Pressable>

      {/* Botao encaminhar (direita para incoming) */}
      {!isOutgoing && forwardButton}
    </View>
  );
};

// Export default
export default MessageBubble;

// Estilos do componente MessageBubble
const styles = StyleSheet.create({
  // Container principal
  container: {
    flexDirection: 'row',                 //...Layout horizontal
    marginVertical: 2,                    //...Margem vertical
    paddingHorizontal: 12,                //...Padding horizontal
    overflow: 'visible',                  //...Permite conteudo alem dos limites
    alignItems: 'flex-end',               //...Alinha botao na base do bubble
  },

  // Container mensagem recebida
  containerIncoming: {
    justifyContent: 'flex-start',         //...Alinha esquerda
  },

  // Container mensagem enviada
  containerOutgoing: {
    justifyContent: 'flex-end',           //...Alinha direita
  },

  // Bolha base
  bubble: {
    maxWidth: '80%',                      //...Largura maxima
    minWidth: 80,                         //...Largura minima
    paddingVertical: 6,                   //...Padding vertical
    paddingHorizontal: 8,                 //...Padding horizontal
    borderRadius: 8,                      //...Arredondamento uniforme
    borderWidth: 1,                       //...Borda slim
    overflow: 'visible',                  //...Permite conteudo alem dos limites
    shadowColor: ChatColors.shadow,       //...Cor sombra
    shadowOffset: {                       //...Offset sombra
      width: 0,                           //...Offset X
      height: 1,                          //...Offset Y
    },
    shadowOpacity: 0.1,                   //...Opacidade sombra
    shadowRadius: 2,                      //...Raio sombra
    elevation: 1,                         //...Elevacao Android
  },

  // Bolha mensagem recebida
  bubbleIncoming: {
    backgroundColor: ChatColors.incomingBubble, //...Cor fundo incoming
    borderColor: '#E0E0E0',                     //...Borda cinza suave
    borderWidth: 0.5,                            //...Borda ultrafina
  },

  // Bolha mensagem enviada
  bubbleOutgoing: {
    backgroundColor: ChatColors.outgoingBubble, //...Cor fundo outgoing
    borderWidth: 0,                              //...Sem borda no azul
  },

  // Bolha destacada (scroll para reply)
  bubbleHighlighted: {
    backgroundColor: 'rgba(23,119,207,0.2)', //...Destaque azul claro
  },

  // Nome do remetente
  senderName: {
    fontFamily: 'Inter_600SemiBold',      //...Fonte semi bold
    fontSize: 13,                         //...Tamanho fonte
    color: ChatColors.link,               //...Cor azul
    marginBottom: 4,                      //...Margem inferior
  },

  // Wrapper interno com flexWrap
  innerWrapper: {
    flexDirection: 'row',                 //...Layout horizontal
    flexWrap: 'wrap',                     //...Permite quebra
    alignItems: 'flex-end',               //...Alinha na base
    overflow: 'visible',                  //...Permite conteudo alem dos limites
  },

  // Container do conteudo
  contentContainer: {
    flexShrink: 1,                        //...Permite encolher
    overflow: 'visible',                  //...Permite conteudo alem dos limites
  },

  // Spacer entre conteudo e footer
  footerSpacer: {
    flexGrow: 1,                          //...Empurra footer para direita
    minWidth: 25,                         //...Espaco minimo de 25px
  },

  // Footer: Container com hora e status
  footer: {
    minHeight: 20,                        //...Altura minima do container
    paddingHorizontal: 10,                //...Padding horizontal
    paddingTop: 2,                        //...Padding superior
    backgroundColor: 'rgba(252, 252, 252, 0.5)', //...Fundo branco translucido
    borderTopLeftRadius: 12,              //...Arredonda canto superior esquerdo
    borderBottomRightRadius: 6,           //...Arredonda igual ao bubble
    flexDirection: 'row',                 //...Layout horizontal
    alignItems: 'center',                 //...Centraliza vertical
    justifyContent: 'center',             //...Centraliza horizontal
    gap: 2,                               //...Espaco entre hora e check
    marginLeft: 'auto',                   //...Empurra para extrema direita
    marginTop: 4,                         //...Distancia do conteudo
    marginRight: -10,                     //...Estende alem da borda do bubble
    marginBottom: 0,                     //...Encaixe na borda inferior
    borderRightWidth: 1,                  //...Borda direita continua do bubble
    borderBottomWidth: 0,                 //...Sem borda inferior
  },

  // Footer transparente para mensagens outgoing (sem fundo branco)
  footerOutgoing: {
    backgroundColor: 'transparent',       //...Sem fundo branco
    borderRightWidth: 0,                  //...Sem borda direita
    borderBottomWidth: 0,                 //...Sem borda inferior
    marginRight: -8,                      //...Ajuste margem sem borda
    marginBottom: 0,                      //...Ajuste margem sem borda
    paddingBottom: 0,                     //...Espaco abaixo do check
  },

  // Footer dos cards Instagram (posicao independente dos cards de mensagem)
  footerLinkPreview: {
    marginTop: -1,     
    marginBottom: 4,                     //...Ajuste vertical timestamp Instagram
  },

  // Timestamp
  timestamp: {
    fontFamily: 'Inter_400Regular',       //...Fonte regular
    fontSize: 12,                         //...Tamanho fonte
    color: '#3A3F51',                     //...Cor preta
  },

  // Timestamp outgoing (posicao vertical independente)
  timestampOutgoing: {
    color: '#FFFFFF',                     //...Cor branca
    marginBottom: -3,                      //...Ajuste vertical do horario
  },

  // Wrapper do check icon (posicao vertical independente)
  checkWrapper: {
    marginBottom: 1,                      //...Ajuste vertical do check
  },

  // Botao de encaminhar (circulo com seta)
  forwardButton: {
    width: 28,                            //...Largura do botao
    height: 28,                           //...Altura do botao
    borderRadius: 14,                     //...Circulo perfeito
    backgroundColor: 'rgba(0,0,0,0.35)',  //...Fundo escuro translucido
    justifyContent: 'center',             //...Centraliza icone vertical
    alignItems: 'center',                 //...Centraliza icone horizontal
    alignSelf: 'center',                  //...Centraliza vertical com o card
    marginHorizontal: 10,                 //...10px de espaco do card
  },

  // Container do reply
  replyContainer: {
    flexDirection: 'row',                 //...Layout horizontal
    borderRadius: 8,                      //...Borda arredondada
    marginBottom: 8,                      //...Margem inferior
    overflow: 'hidden',                   //...Corta overflow
  },

  // Reply mensagem recebida
  replyIncoming: {
    backgroundColor: ChatColors.replyBackground, //...Cor fundo reply
  },

  // Reply mensagem enviada (fundo azul escuro para destaque)
  replyOutgoing: {
    backgroundColor: 'rgba(0,0,0,0.2)',       //...Escurece o azul do bubble
  },

  // Barra lateral do reply
  replyBar: {
    width: 4,                             //...Largura barra
    backgroundColor: ChatColors.replyBorder, //...Cor borda reply
  },

  // Barra lateral do reply em outgoing (azul claro destaque)
  replyBarOutgoing: {
    backgroundColor: '#A0D2F0',           //...Azul claro da familia primaria
  },

  // Conteudo do reply
  replyContent: {
    flex: 1,                              //...Ocupa espaco
    padding: 8,                           //...Padding
    paddingRight: 10,                     //...10px antes da thumbnail
  },

  // Nome remetente reply
  replySender: {
    fontFamily: 'Inter_600SemiBold',      //...Fonte bold
    fontSize: 12,                         //...Tamanho fonte
    color: ChatColors.replyBorder,        //...Cor azul
    marginBottom: 2,                      //...Margem inferior
  },

  // Nome remetente reply outgoing
  replySenderOutgoing: {
    color: '#A0D2F0',                     //...Azul claro da familia primaria
  },

  // Texto do reply
  replyText: {
    fontFamily: 'Inter_400Regular',       //...Fonte regular
    fontSize: 12,                         //...Tamanho fonte
    color: ChatColors.replyText,          //...Cor texto
  },

  // Texto reply outgoing
  replyTextOutgoing: {
    color: '#FFFFFF',                     //...Branco total
  },

  // Thumbnail do reply (miniatura lado direito estilo WhatsApp)
  replyThumbnail: {
    width: 52,                            //...Largura da miniatura
    alignSelf: 'stretch',                 //...Altura maxima do container
    borderTopRightRadius: 6,              //...Arredondamento superior direito
    borderBottomRightRadius: 6,           //...Arredondamento inferior direito
  },
});
