// ========================================
// Componente VideoMessage
// Mensagem de video seguindo padrao WhatsApp
// Usa HTML5 video na web e expo-av no mobile
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useRef,                                 //......Hook de referencia
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
  ActivityIndicator,                      //......Loading
  useWindowDimensions,                    //......Dimensoes da tela
  Platform,                               //......Plataforma
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import {
  VideoContent,                           //......Conteudo video
  MessageStatus as MessageStatusType,     //......Tipo status
} from '../../types/08.types.whatsapp';   //......Arquivo tipos

// ========================================
// Imports de Componentes
// ========================================
import MessageStatus from './08.08.MessageStatus';

// ========================================
// Imports de Icones
// ========================================
import { Ionicons } from '@expo/vector-icons';

// ========================================
// Imports de Tipo TimestampStyle
// ========================================
import { TimestampStyle } from '../../10.00.LeadLolaSwipeContainer';

// ========================================
// Interface de Props
// ========================================
interface VideoMessageProps {
  content: VideoContent;                  //......Conteudo do video
  isOutgoing: boolean;                    //......Se e enviada
  timestamp?: Date;                       //......Hora de envio
  status?: MessageStatusType;             //......Status da mensagem
  reaction?: string;                      //......Reacao (emoji)
  timestampStyle?: TimestampStyle;        //......Estilo do timestamp
  onPress?: () => void;                   //......Handler press
}

// ========================================
// Constantes de Layout (Padrao WhatsApp)
// ========================================

// Porcentagem da largura do chat para video
const WIDTH_PERCENTAGE = 0.68;            //......68% da largura do chat

// Porcentagem maxima da altura da tela
const MAX_HEIGHT_PERCENTAGE = 0.55;       //......55% da altura da tela

// Largura minima do video
const MIN_WIDTH = 150;                    //......Largura minima

// Altura minima do video
const MIN_HEIGHT = 100;                   //......Altura minima

// Configuracoes de borda
const BORDER_WIDTH_OUTGOING = 1;          //......Borda normal (outgoing)
const BORDER_WIDTH_INCOMING = 1;          //......Borda fina (incoming)
const BORDER_RADIUS = 12;                 //......Raio das bordas

// Cores do badge de tempo
const BADGE_COLOR_OUTGOING = 'rgba(23, 119, 207, 0.5)';
const BADGE_COLOR_INCOMING = '#D8D8D8';   //......Badge cinza claro (incoming)
const BADGE_COLOR_ERROR = '#E53935';      //......Badge vermelho (erro)

// ========================================
// Componente Principal VideoMessage
// ========================================
const VideoMessage: React.FC<VideoMessageProps> = ({
  content,                                //......Conteudo
  isOutgoing,                             //......Direcao
  timestamp,                              //......Hora
  status,                                 //......Status
  reaction,                               //......Reacao
  timestampStyle = 'container',           //......Estilo do timestamp
  onPress,                                //......Handler
}) => {
  // ========================================
  // Dimensoes da Tela
  // ========================================
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  // ========================================
  // Estados
  // ========================================
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(content.duration || 0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // ========================================
  // Calcular dimensoes do container de chat
  // ========================================
  const chatWidth = screenWidth - 24;     //......Largura util do chat

  // ========================================
  // Calcular largura maxima do video
  // ========================================
  const maxVideoWidth = Math.max(
    chatWidth * WIDTH_PERCENTAGE,         //......68% da largura do chat
    MIN_WIDTH                             //......Minimo 150px
  );

  // ========================================
  // Calcular altura maxima do video
  // ========================================
  const maxVideoHeight = Math.max(
    screenHeight * MAX_HEIGHT_PERCENTAGE, //......55% da altura da tela
    MIN_HEIGHT                            //......Minimo 100px
  );

  // ========================================
  // Calcular aspect ratio do video
  // ========================================
  const aspectRatio = content.width && content.height
    ? content.width / content.height
    : 16 / 9;                             //......Padrao 16:9

  // ========================================
  // Calcular dimensoes finais do video
  // ========================================
  const calculateDimensions = useCallback(() => {
    const finalWidth = maxVideoWidth;
    let finalHeight = finalWidth / aspectRatio;

    if (finalHeight > maxVideoHeight) {
      finalHeight = maxVideoHeight;
    }

    if (finalHeight < MIN_HEIGHT) {
      finalHeight = MIN_HEIGHT;
    }

    return {
      width: finalWidth,                  //......Largura final
      height: finalHeight,                //......Altura final
    };
  }, [maxVideoWidth, maxVideoHeight, aspectRatio]);

  const dimensions = calculateDimensions();

  // ========================================
  // Formatar duracao do video (MM:SS)
  // ========================================
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);   //......Minutos
    const secs = Math.floor(seconds % 60);   //......Segundos
    return `${mins}:${secs.toString().padStart(2, '0')}`; //......Formato M:SS
  }, []);

  // ========================================
  // Handler de Metadata carregada (captura duracao)
  // ========================================
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      const dur = videoRef.current.duration; //......Duracao em segundos
      if (dur && isFinite(dur) && dur > 0) {
        setVideoDuration(dur);               //......Atualiza estado
      }
    }
  }, []);

  // ========================================
  // Formatar hora
  // ========================================
  const formattedTime = timestamp
    ? timestamp.toLocaleTimeString('pt-BR', {
        hour: '2-digit',                  //......Hora 2 digitos
        minute: '2-digit',                //......Minuto 2 digitos
      })
    : '';

  // ========================================
  // Handler de Load
  // ========================================
  const handleLoad = useCallback(() => {
    console.log('[VideoMessage] Video carregado');
    setIsLoading(false);                  //......Remove loading
  }, []);

  // ========================================
  // Handler de Erro
  // ========================================
  const handleError = useCallback((e: any) => {
    console.error('[VideoMessage] Erro ao carregar video:', e);
    setIsLoading(false);                  //......Remove loading
    setHasError(true);                    //......Marca erro
  }, []);

  // ========================================
  // Handler de Play/Pause
  // ========================================
  const handlePlayPause = useCallback(async () => {
    console.log('[VideoMessage] handlePlayPause chamado, isPlaying:', isPlaying);
    if (Platform.OS === 'web' && videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('[VideoMessage] Erro ao play/pause:', error);
      }
    }
  }, [isPlaying]);

  // ========================================
  // Cor da borda baseada na direcao e status
  // ========================================
  const getThemeColor = () => {
    if (status === 'failed') {
      return BADGE_COLOR_ERROR;           //......Vermelho para erro
    }
    return isOutgoing
      ? BADGE_COLOR_OUTGOING              //......Azul para enviadas
      : BADGE_COLOR_INCOMING;             //......Cinza para recebidas
  };
  const themeColor = getThemeColor();

  // ========================================
  // Render de Erro
  // ========================================
  if (hasError) {
    return (
      <View
        style={[
          styles.container,
          styles.errorContainer,
          {
            borderColor: themeColor,
            borderWidth: isOutgoing ? BORDER_WIDTH_OUTGOING : BORDER_WIDTH_INCOMING,
            width: dimensions.width,
            height: dimensions.height,
          },
        ]}
      >
        <Ionicons
          name="videocam-off"
          size={32}
          color={ChatColors.timestamp}
        />
        <Text style={styles.errorText}>
          Erro ao carregar video
        </Text>
      </View>
    );
  }

  // ========================================
  // Render Principal
  // ========================================
  return (
    <View style={[styles.wrapper, reaction && styles.wrapperWithReaction]}>
      {/* Container do Video */}
      <Pressable
        style={[
          styles.container,
          {
            borderColor: themeColor,
            borderWidth: isOutgoing ? BORDER_WIDTH_OUTGOING : BORDER_WIDTH_INCOMING,
            width: dimensions.width,
            height: dimensions.height,
          },
        ]}
        onPress={onPress}
      >
        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color={isOutgoing ? ChatColors.white : ChatColors.voiceButton}
            />
          </View>
        )}

        {/* Video - Usando HTML5 video para Web */}
        {Platform.OS === 'web' ? (
          <video
            ref={videoRef}
            src={content.url}
            style={{
              width: '100%',              //......Largura total
              height: '100%',             //......Altura total
              objectFit: 'cover',         //......Preenche o container
              borderRadius: BORDER_RADIUS,
              pointerEvents: 'none',      //......Nao captura cliques
            }}
            controls={false}
            playsInline
            preload="auto"
            onLoadedData={handleLoad}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleLoad}
            onError={handleError}
            onPlay={() => {
              console.log('[VideoMessage] Video iniciou');
              setIsPlaying(true);
            }}
            onPause={() => {
              console.log('[VideoMessage] Video pausado');
              setIsPlaying(false);
            }}
            onEnded={() => {
              console.log('[VideoMessage] Video terminou');
              setIsPlaying(false);
            }}
          />
        ) : (
          // Mobile: Placeholder - implementar expo-av se necessario
          <View style={styles.videoPlaceholder}>
            <Ionicons name="videocam" size={32} color="#FFFFFF" />
          </View>
        )}

        {/* Botao Play (quando nao esta tocando) - Abre o VideoViewer */}
        {!isPlaying && !isLoading && (
          <Pressable
            style={styles.playOverlay}
            onPress={() => {
              console.log('[VideoMessage] Play button pressed, onPress:', !!onPress);
              if (onPress) {
                onPress();
              }
            }}
          >
            <View style={styles.playButton}>
              <Ionicons
                name="play"
                size={24}
                color="#3A3F51"
              />
            </View>
          </Pressable>
        )}

        {/* Badge de duracao do video (canto inferior esquerdo) */}
        {videoDuration > 0 && !isPlaying && !isLoading && (
          <View style={styles.durationBadge} pointerEvents="none">
            <Text style={styles.durationText}>
              {formatDuration(videoDuration)}
            </Text>
          </View>
        )}

        {/* Container padronizado de Horario + Status (canto inferior direito) */}
        <View
          style={timestampStyle === 'container' ? styles.timeContainer : styles.timeContainerBlue}
          pointerEvents="none"
        >
          {/* Hora */}
          <Text style={
            timestampStyle === 'container'
              ? styles.timeText
              : styles.timeTextWhite
          }>
            {formattedTime}
          </Text>

          {/* Status (checks) - apenas outgoing (padrao WhatsApp) */}
          {isOutgoing && status && (
            <View style={styles.checkWrapper}>
              <MessageStatus
                status={status}
                isOutgoing={true}
                size={11}                 //......Tamanho do check
                iconColor={timestampStyle === 'transparent' ? '#FFFFFF' : undefined}
              />
            </View>
          )}
        </View>
      </Pressable>

      {/* Badge de Reacao fora do container */}
      {reaction && (
        <View style={styles.reactionBadge}>
          <Text style={styles.reactionText}>{reaction}</Text>
        </View>
      )}
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default VideoMessage;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Wrapper externo para badge de reacao
  wrapper: {
    position: 'relative',                 //......Posicao relativa
  },

  // Wrapper com margem extra quando tem reacao
  wrapperWithReaction: {
    marginBottom: 25,                     //......Margem inferior para reacao
  },

  // Container principal do video
  container: {
    borderRadius: BORDER_RADIUS,          //......Borda arredondada
    position: 'relative',                 //......Posicao relativa
    overflow: 'hidden',                   //......Clip do conteudo
  },

  // Container de erro
  errorContainer: {
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    backgroundColor: ChatColors.chatBackground,
    gap: 8,                               //......Espaco entre icone e texto
  },

  // Texto de erro
  errorText: {
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontSize: 12,                         //......Tamanho fonte
    color: ChatColors.timestamp,          //......Cor cinza
    textAlign: 'center',                  //......Alinhamento centro
  },

  // Container de loading
  loadingContainer: {
    position: 'absolute',                 //......Posicao absoluta
    top: 0,                               //......Alinha topo
    left: 0,                              //......Alinha esquerda
    right: 0,                             //......Alinha direita
    bottom: 0,                            //......Alinha baixo
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    backgroundColor: 'rgba(237, 239, 243, 0.8)', //..Fundo cinza claro
    zIndex: 1,                            //......Acima do video
  },

  // Placeholder para mobile
  videoPlaceholder: {
    width: '100%',                        //......Largura total
    height: '100%',                       //......Altura total
    backgroundColor: '#EDEFF3',           //......Fundo cinza claro
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },

  // Badge de duracao do video (inferior esquerdo)
  durationBadge: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 6,                            //......Distancia do fundo
    left: 6,                              //......Distancia da esquerda
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //....Fundo escuro semitransparente
    borderRadius: 5,                      //......Bordas arredondadas
    paddingHorizontal: 7,                 //......Padding horizontal
    paddingVertical: 4,                   //......Padding vertical
    zIndex: 5,                            //......Acima do video
  },

  // Texto da duracao do video
  durationText: {
    fontFamily: 'Inter_500Medium',        //......Fonte medium
    fontSize: 12,                         //......Tamanho fonte
    color: '#FFFFFF',                     //......Cor branca
    lineHeight: 14,                       //......Altura linha
  },

  // Overlay do botao play - Sem fundo escuro
  playOverlay: {
    position: 'absolute',                 //......Posicao absoluta
    top: 0,                               //......Alinha topo
    left: 0,                              //......Alinha esquerda
    right: 0,                             //......Alinha direita
    bottom: 0,                            //......Alinha baixo
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    zIndex: 10,                           //......Acima de outros elementos
  },

  // Botao play circular - Fundo branco, icone preto
  playButton: {
    width: 50,                            //......Largura do botao
    height: 50,                           //......Altura do botao
    borderRadius: 25,                     //......Circular
    backgroundColor: '#FFFFFF',           //......Fundo branco
    justifyContent: 'center',             //......Centraliza icone
    alignItems: 'center',                 //......Centraliza icone
    paddingLeft: 3,                       //......Ajuste visual do icone play
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 5,
        }),
  },

  // Container padronizado de Horario + Status
  timeContainer: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 0.6,                            //......AJUSTE: Subir = aumentar | Descer = diminuir
    right: 0,                             //......AJUSTE: Esquerda = aumentar | Direita = diminuir
    paddingTop: 6,                        //......Padding superior
    paddingBottom: 4,                     //......Padding inferior
    paddingLeft: 10,                      //......Padding esquerdo
    paddingRight: 6,                      //......Padding direito
    backgroundColor: 'rgba(252, 252, 252, 0.8)',
    borderTopLeftRadius: 12,              //......Arredonda canto
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    gap: 2,                               //......Espaco entre hora e check
  },

  // Texto do tempo (preto sobre fundo branco)
  timeText: {
    color: '#3A3F51',                     //......Cor preta
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_300Light',         //......Fonte light
    lineHeight: 12,                       //......Altura linha
  },

  // Texto do tempo branco (modo transparente)
  timeTextWhite: {
    color: '#FFFFFF',                     //......Cor branca
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_300Light',         //......Fonte light
    lineHeight: 12,                       //......Altura linha
  },

  // Container AZUL de Horario + Status
  timeContainerBlue: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 0.6,                            //......AJUSTE: Subir = aumentar | Descer = diminuir
    right: 0,                             //......AJUSTE: Esquerda = aumentar | Direita = diminuir
    paddingTop: 6,                        //......Padding superior
    paddingBottom: 4,                     //......Padding inferior
    paddingLeft: 10,                      //......Padding esquerdo
    paddingRight: 6,                      //......Padding direito
    backgroundColor: '#1777CF',           //......Fundo AZUL
    borderTopLeftRadius: 12,              //......Arredonda canto
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    gap: 2,                               //......Espaco entre hora e check
  },

  // Wrapper do icone de check
  checkWrapper: {
    marginTop: -2,                        //......Ajuste vertical
  },

  // Badge de Reacao
  reactionBadge: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: -20,                          //......Abaixo do container
    right: 10,                            //......Alinha direita
    backgroundColor: '#FFFFFF',           //......Fundo branco
    borderRadius: 8,                      //......Bordas arredondadas
    paddingHorizontal: 6,                 //......Padding horizontal
    paddingVertical: 2,                   //......Padding vertical
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.2)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 3,
        }),
    zIndex: 10,                           //......Camada superior
  },

  // Texto do Emoji de Reacao
  reactionText: {
    fontSize: 16,                         //......Tamanho emoji
  },
});
