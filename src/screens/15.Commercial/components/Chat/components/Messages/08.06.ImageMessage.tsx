// ========================================
// Componente ImageMessage
// Mensagem de imagem seguindo padrao WhatsApp
// Container branco padronizado para horario e check
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useEffect,                              //......Hook de efeito
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  Image,                                  //......Imagem
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
  ActivityIndicator,                      //......Loading
  useWindowDimensions,                    //......Dimensoes da tela
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import {
  ImageContent,                           //......Conteudo imagem
  MessageStatus as MessageStatusType,     //......Tipo status
} from '../../types/08.types.whatsapp';   //......Arquivo tipos

// ========================================
// Imports de Componentes
// ========================================
import MessageStatus from './08.08.MessageStatus';

// ========================================
// Interface de Props
// ========================================
interface ImageMessageProps {
  content: ImageContent;                  //......Conteudo da imagem
  isOutgoing: boolean;                    //......Se e enviada
  timestamp?: Date;                       //......Hora de envio
  status?: MessageStatusType;             //......Status da mensagem
  reaction?: string;                      //......Reacao (emoji)
  onPress?: () => void;                   //......Handler press
}

// ========================================
// Constantes de Layout (Padrao WhatsApp)
// ========================================

// Porcentagem da largura do chat para imagem
const WIDTH_PERCENTAGE = 0.68;            //......68% da largura do chat

// Porcentagem maxima da altura da tela
const MAX_HEIGHT_PERCENTAGE = 0.55;       //......55% da altura da tela

// Largura minima da imagem
const MIN_WIDTH = 150;                    //......Largura minima

// Altura minima da imagem
const MIN_HEIGHT = 100;                   //......Altura minima

// Configuracoes de borda
const BORDER_WIDTH = 2;                   //......Largura da borda em pixels
const BORDER_RADIUS = 12;                 //......Raio das bordas

// Cores do badge de tempo
const BADGE_COLOR_OUTGOING = '#1777CF';   //......Badge azul (outgoing)
const BADGE_COLOR_INCOMING = '#3A3F51';   //......Badge cinza (incoming)
const BADGE_COLOR_ERROR = '#E53935';      //......Badge vermelho (erro)

// ========================================
// Componente Principal ImageMessage
// ========================================
const ImageMessage: React.FC<ImageMessageProps> = ({
  content,                                //......Conteudo
  isOutgoing,                             //......Direcao
  timestamp,                              //......Hora
  status,                                 //......Status
  reaction,                               //......Reacao
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
  const [aspectRatio, setAspectRatio] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);

  // ========================================
  // Calcular dimensoes do container de chat
  // ========================================
  const chatWidth = screenWidth - 24;     //......Largura util do chat

  // ========================================
  // Calcular largura maxima da imagem
  // ========================================
  const maxImageWidth = Math.max(
    chatWidth * WIDTH_PERCENTAGE,         //......68% da largura do chat
    MIN_WIDTH                             //......Minimo 150px
  );

  // ========================================
  // Calcular altura maxima da imagem
  // ========================================
  const maxImageHeight = Math.max(
    screenHeight * MAX_HEIGHT_PERCENTAGE, //......55% da altura da tela
    MIN_HEIGHT                            //......Minimo 100px
  );

  // ========================================
  // Detectar aspect ratio da imagem
  // ========================================
  useEffect(() => {
    const imageUri = content.thumbnail || content.url;
    if (imageUri) {
      Image.getSize(
        imageUri,
        (width, height) => {
          if (height > 0) {
            setAspectRatio(width / height); //......Calcula aspect ratio
          }
          setImageLoaded(true);            //......Marca como carregado
        },
        () => {
          setAspectRatio(1);               //......Padrao 1:1 em erro
          setImageLoaded(true);            //......Marca como carregado
        }
      );
    }
  }, [content.thumbnail, content.url]);

  // ========================================
  // Calcular dimensoes finais da imagem
  // ========================================
  const calculateDimensions = useCallback(() => {
    const finalWidth = maxImageWidth;
    let finalHeight = finalWidth / aspectRatio;

    if (finalHeight > maxImageHeight) {
      finalHeight = maxImageHeight;
    }

    if (finalHeight < MIN_HEIGHT) {
      finalHeight = MIN_HEIGHT;
    }

    return {
      width: finalWidth,                  //......Largura final
      height: finalHeight,                //......Altura final
    };
  }, [maxImageWidth, maxImageHeight, aspectRatio]);

  const dimensions = calculateDimensions();

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
    setIsLoading(false);                  //......Remove loading
  }, []);

  // ========================================
  // Handler de Erro
  // ========================================
  const handleError = useCallback(() => {
    setIsLoading(false);                  //......Remove loading
    setHasError(true);                    //......Marca erro
  }, []);

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
            width: dimensions.width,
            height: dimensions.height,
          },
        ]}
      >
        <Text style={styles.errorText}>
          Erro ao carregar imagem
        </Text>
      </View>
    );
  }

  // ========================================
  // Render Principal
  // ========================================
  return (
    <View style={styles.wrapper}>
      {/* Container da Imagem */}
      <Pressable
        style={[
          styles.container,
          {
            borderColor: themeColor,
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

        {/* Imagem */}
        <Image
          source={{ uri: content.thumbnail || content.url }}
          style={styles.image}
          resizeMode="cover"
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Container padronizado de Horario + Status (canto inferior direito) */}
        <View style={styles.timeContainer}>
          {/* Hora */}
          <Text style={styles.timeText}>
            {formattedTime}
          </Text>

          {/* Status (checks) - apenas para outgoing */}
          {isOutgoing && status && (
            <View style={styles.checkWrapper}>
              <MessageStatus
                status={status}
                isOutgoing={true}
                size={13}
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
export default ImageMessage;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Wrapper externo para badge de reacao
  wrapper: {
    position: 'relative',                 //......Posicao relativa
  },

  // Container principal da imagem
  container: {
    borderRadius: BORDER_RADIUS,          //......Borda arredondada
    borderWidth: BORDER_WIDTH,            //......Largura da borda
    position: 'relative',                 //......Posicao relativa
    overflow: 'hidden',                   //......Clip do conteudo
  },

  // Container de erro
  errorContainer: {
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    backgroundColor: ChatColors.chatBackground,
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
    backgroundColor: ChatColors.divider,  //......Fundo
    zIndex: 1,                            //......Acima da imagem
  },

  // Imagem que preenche o container
  image: {
    width: '100%',                        //......Largura total
    height: '100%',                       //......Altura total
  },

  // Container padronizado de Horario + Status (canto inferior direito)
  // AJUSTE MANUAL: Altere paddingTop/paddingBottom para centralizar verticalmente
  timeContainer: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 0,                            //......Alinha na base
    right: 0,                             //......Alinha na direita
    paddingTop: 6,                        //......AJUSTE: Padding superior
    paddingBottom: 2,                     //......AJUSTE: Padding inferior
    paddingHorizontal: 10,                //......Padding horizontal
    backgroundColor: 'rgba(252, 252, 252, 0.8)', //..Fundo branco 80%
    borderTopLeftRadius: 12,              //......Arredonda canto superior esquerdo
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    gap: 2,                               //......Espaco entre hora e check
  },

  // Texto do tempo (preto sobre fundo branco)
  // AJUSTE MANUAL: Altere lineHeight para alinhar verticalmente
  timeText: {
    color: '#3A3F51',                     //......Cor preta
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontWeight: '400' as any,             //......Peso regular
    lineHeight: 12,                       //......AJUSTE: Altura linha = tamanho fonte
  },

  // Wrapper do icone de check para ajuste vertical independente
  // AJUSTE MANUAL: Altere marginTop para subir/descer o icone
  checkWrapper: {
    marginTop: -2,                        //......AJUSTE: Negativo = sobe | Positivo = desce
  },

  // Badge de Reacao no canto inferior direito
  reactionBadge: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: -20,                          //......Abaixo do container
    right: 10,                            //......Alinha direita
    backgroundColor: '#FFFFFF',           //......Fundo branco
    borderRadius: 8,                      //......Bordas arredondadas
    paddingHorizontal: 6,                 //......Padding horizontal
    paddingVertical: 2,                   //......Padding vertical
    shadowColor: '#000',                  //......Cor sombra
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,                   //......Opacidade sombra
    shadowRadius: 2,                      //......Raio sombra
    elevation: 3,                         //......Elevacao Android
    zIndex: 10,                           //......Camada superior
  },

  // Texto do Emoji de Reacao
  reactionText: {
    fontSize: 16,                         //......Tamanho emoji
  },
});
