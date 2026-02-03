// ========================================
// Componente AudioMessage
// Mensagem de audio com player estilo WhatsApp
// Com avatar, velocidade e waveform
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
  useRef,                                 //......Hook de ref
  useEffect,                              //......Hook de efeito
  useMemo,                                //......Hook de memo
  memo,                                   //......Memoizacao
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  StyleSheet,                             //......Estilos
  TouchableOpacity,                       //......Toque
  Pressable,                              //......Pressable
  Image,                                  //......Imagem
  Dimensions,                             //......Dimensoes da tela
  ActivityIndicator,                      //......Indicador de carregamento
} from 'react-native';                    //......Biblioteca RN
import Svg, {                             //......SVG core
  Path,                                   //......Path SVG
  Rect,                                   //......Retangulo SVG
} from 'react-native-svg';                //......Biblioteca SVG
import { Audio } from 'expo-av';          //......Audio Expo

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import { AudioContent } from '../../types/08.types.whatsapp';

// ========================================
// Imports de Funcoes
// ========================================
import { formatAudioDuration } from '../../data/08.mockMessages';

// ========================================
// Imports de Tipos Adicionais
// ========================================
import { MessageStatus as StatusType } from '../../types/08.types.whatsapp';

// ========================================
// Imports de Componentes
// ========================================
import MessageStatus from './08.08.MessageStatus';

// ========================================
// Interface de Props
// ========================================
interface AudioMessageProps {
  content: AudioContent;                  //......Conteudo do audio
  isOutgoing: boolean;                    //......Se e enviada
  timestamp?: Date;                       //......Hora de envio
  status?: StatusType;                    //......Status da mensagem
  onRetry?: () => Promise<boolean>;       //......Callback de retry (retorna true se sucesso)
}

// ========================================
// Tipos de Velocidade
// ========================================
type PlaybackSpeed = 1 | 1.5 | 2;

// ========================================
// Constantes de Configuracao
// ========================================

// Alturas das barras de onda de audio (padrao base ciclico)
const WAVE_HEIGHTS_PATTERN = [
  3, 3.5, 4, 3, 10, 8, 9, 18, 18, 14,
  11, 8, 18, 14, 10, 7, 11, 15, 18, 14,
  11, 14, 18, 14, 10, 7, 6, 4, 4, 4,
  11, 14, 18, 14, 10, 7, 11, 15,
];

// Largura de cada barra em pixels
const BAR_WIDTH = 1.5;

// Espaco entre barras em pixels
const BAR_GAP = 2;

// Margem direita da waveform (antes da borda do container)
// Ajuste este valor para controlar o espaco entre as barras e a borda
const WAVE_RIGHT_MARGIN = 20;

// ========================================
// Calcula largura do waveContainer baseado na tela
// ========================================
const calculateInitialWaveWidth = (): number => {
  const screenWidth = Dimensions.get('window').width;
  // Padding horizontal do container de mensagens
  const messageAreaPadding = 24;
  // Largura da area de mensagens
  const messageAreaWidth = screenWidth - messageAreaPadding;
  // Largura da bolha (80% da area)
  const bubbleWidth = messageAreaWidth * 0.8;
  // Padding interno da bolha
  const bubblePadding = 16;
  // Largura do conteudo da bolha
  const bubbleContentWidth = bubbleWidth - bubblePadding;
  // Avatar (45px) + gap (15px)
  const leftColWidth = 60;
  // Botao play (24px) + gap (10px)
  const playButtonWidth = 34;
  // Largura do waveContainer
  const waveWidth = bubbleContentWidth - leftColWidth - playButtonWidth;
  return Math.max(0, waveWidth);
};

// ========================================
// Componente Principal AudioMessage
// ========================================
const AudioMessage: React.FC<AudioMessageProps> = ({
  content,                                //......Conteudo
  isOutgoing,                             //......Direcao
  timestamp,                              //......Hora de envio
  status,                                 //......Status da mensagem
  onRetry,                                //......Callback de retry
}) => {
  // ========================================
  // Estados do Componente
  // ========================================
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [progress, setProgress] = useState(0);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // ========================================
  // Estados de Retry
  // ========================================
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);

  // ========================================
  // Refs para Controle de Audio
  // ========================================
  const soundRef = useRef<Audio.Sound | null>(null);
  const speedHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ========================================
  // Duracao em milissegundos
  // ========================================
  const durationMs = content.duration * 1000;

  // ========================================
  // Largura da area de ondas (calculada via Dimensions)
  // ========================================
  const waveAreaWidth = useMemo(() => calculateInitialWaveWidth(), []);

  // ========================================
  // Calcula numero de barras baseado na largura disponivel
  // ========================================
  const waveBarCount = useMemo(() => {
    if (waveAreaWidth <= 0) return 0;
    // Subtrai margem direita (10px aplicada via marginRight no estilo)
    const availableWidth = waveAreaWidth - WAVE_RIGHT_MARGIN;
    // Numero de barras que cabem
    const count = Math.floor((availableWidth + BAR_GAP) / (BAR_WIDTH + BAR_GAP));
    return Math.max(0, count);
  }, [waveAreaWidth]);

  // ========================================
  // Gera alturas das barras ciclicamente
  // ========================================
  const waveHeights = useMemo(() => {
    const heights: number[] = [];
    for (let i = 0; i < waveBarCount; i++) {
      heights.push(WAVE_HEIGHTS_PATTERN[i % WAVE_HEIGHTS_PATTERN.length]);
    }
    return heights;
  }, [waveBarCount]);

  // ========================================
  // Efeito de Limpeza ao Desmontar
  // ========================================
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (speedHideTimerRef.current) {
        clearTimeout(speedHideTimerRef.current);
        speedHideTimerRef.current = null;
      }
    };
  }, []);

  // ========================================
  // Callback de Status do Audio
  // ========================================
  const onPlaybackStatusUpdate = useCallback((status: any) => {
    if (!status.isLoaded) return;

    // Atualiza progresso
    if (status.durationMillis && status.positionMillis !== undefined) {
      const newProgress = status.positionMillis / status.durationMillis;
      setProgress(newProgress);
      setCurrentTimeMs(status.positionMillis);
    }

    // Atualiza estado de reproducao
    setIsPlaying(status.isPlaying);

    // Quando termina de tocar
    if (status.didJustFinish) {
      setProgress(0);
      setCurrentTimeMs(0);
      setIsPlaying(false);
    }
  }, []);

  // ========================================
  // Carrega Audio
  // ========================================
  const loadSound = useCallback(async () => {
    if (isLoaded || !content.url) return;

    try {
      console.log('[AudioMessage] Carregando audio:', content.url);

      const { sound } = await Audio.Sound.createAsync(
        { uri: content.url },              //......URI do audio
        { shouldPlay: false },             //......Nao tocar automatico
        onPlaybackStatusUpdate             //......Callback de status
      );

      soundRef.current = sound;
      setIsLoaded(true);
      console.log('[AudioMessage] Audio carregado com sucesso');
    } catch (error) {
      console.error('[AudioMessage] Erro ao carregar audio:', error);
    }
  }, [content.url, isLoaded, onPlaybackStatusUpdate]);

  // ========================================
  // Formata tempo em mm:ss
  // ========================================
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // ========================================
  // Inicia timer para esconder velocidade
  // ========================================
  const startSpeedHideTimer = useCallback(() => {
    if (speedHideTimerRef.current) {
      clearTimeout(speedHideTimerRef.current);
    }
    speedHideTimerRef.current = setTimeout(() => {
      setShowSpeedControl(false);
      speedHideTimerRef.current = null;
    }, 3000);
  }, []);

  // ========================================
  // Mostra velocidade e inicia timer
  // ========================================
  const showSpeedAndStartTimer = useCallback(() => {
    setShowSpeedControl(true);
    startSpeedHideTimer();
  }, [startSpeedHideTimer]);

  // ========================================
  // Toggle Play/Pause
  // ========================================
  const togglePlayback = useCallback(async () => {
    showSpeedAndStartTimer();

    try {
      // Carrega audio se ainda nao carregado
      if (!isLoaded) {
        await loadSound();
      }

      if (!soundRef.current) {
        console.warn('[AudioMessage] Sound nao disponivel');
        return;
      }

      if (isPlaying) {
        // Pausar
        console.log('[AudioMessage] Pausando audio');
        await soundRef.current.pauseAsync();
      } else {
        // Tocar
        console.log('[AudioMessage] Tocando audio');

        // Aplica velocidade atual
        await soundRef.current.setRateAsync(playbackSpeed, true);

        // Verifica se precisa reiniciar do inicio
        const status = await soundRef.current.getStatusAsync();
        if (status.isLoaded && status.positionMillis >= status.durationMillis! - 100) {
          await soundRef.current.setPositionAsync(0);
        }

        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error('[AudioMessage] Erro ao toggle playback:', error);
    }
  }, [isPlaying, playbackSpeed, isLoaded, loadSound, showSpeedAndStartTimer]);

  // ========================================
  // Cicla Velocidade: 1x → 1.5x → 2x → 1x
  // ========================================
  const cycleSpeed = useCallback(async () => {
    if (!showSpeedControl) {
      showSpeedAndStartTimer();
      return;
    }

    let newSpeed: PlaybackSpeed;
    if (playbackSpeed === 1) {
      newSpeed = 1.5;
    } else if (playbackSpeed === 1.5) {
      newSpeed = 2;
    } else {
      newSpeed = 1;
    }
    setPlaybackSpeed(newSpeed);
    startSpeedHideTimer();

    // Aplica velocidade ao audio se estiver tocando
    if (soundRef.current && isPlaying) {
      try {
        await soundRef.current.setRateAsync(newSpeed, true);
      } catch (error) {
        console.error('[AudioMessage] Erro ao mudar velocidade:', error);
      }
    }
  }, [showSpeedControl, playbackSpeed, isPlaying, startSpeedHideTimer, showSpeedAndStartTimer]);

  // ========================================
  // Formata texto da velocidade
  // ========================================
  const getSpeedText = useCallback((): string => {
    if (playbackSpeed === 1) return '1x';
    if (playbackSpeed === 1.5) return '1,5x';
    return '2x';
  }, [playbackSpeed]);

  // ========================================
  // Handler de Retry
  // ========================================
  const handleRetry = useCallback(async () => {
    // So permite retry se status for failed e callback existir
    if (status !== 'failed' || !onRetry) return;

    // Reseta estado de falha e inicia retry
    setRetryFailed(false);
    setIsRetrying(true);

    try {
      // Chama callback de retry
      const success = await onRetry();

      if (!success) {
        // Retry falhou
        setRetryFailed(true);
      }
      // Se sucesso, a mensagem sera atualizada pelo pai
    } catch (error) {
      console.error('[AudioMessage] Erro no retry:', error);
      setRetryFailed(true);
    } finally {
      setIsRetrying(false);
    }
  }, [status, onRetry]);

  // ========================================
  // Calcula largura total da waveform
  // ========================================
  const waveformWidth = waveBarCount > 0
    ? (waveBarCount * BAR_WIDTH) + ((waveBarCount - 1) * BAR_GAP)
    : 0;

  // ========================================
  // Calcula Posicao do Marcador
  // ========================================
  const markerPosition = progress * Math.max(0, waveformWidth - 9);

  // ========================================
  // Determina Texto de Tempo a Exibir
  // ========================================
  const displayTime = isPlaying || currentTimeMs > 0
    ? formatTime(currentTimeMs)
    : formatAudioDuration(content.duration);

  // ========================================
  // Fonte da Imagem do Avatar
  // ========================================
  const avatarSource = isOutgoing
    ? require('../../../../../../../assets/02-Foto.png')
    : require('../../../../../../../assets/01-Foto.png');

  // ========================================
  // Renderiza Ondas de Audio
  // ========================================
  const renderWaveform = () => {
    if (waveHeights.length === 0) return null;

    return (
      <View style={styles.waveRow}>
        {/* Marcador de Progresso */}
        <View
          style={[
            styles.dot,
            {
              left: Math.max(0, Math.min(markerPosition, waveformWidth - 9)),
              backgroundColor: isOutgoing ? '#FCFCFC' : '#1777CF',
            },
          ]}
        />
        {/* Barras de Onda */}
        {waveHeights.map((height, i) => {
          const barProgress = i / waveHeights.length;
          const isPlayed = barProgress <= progress;
          const color = isPlayed
            ? (isOutgoing ? '#FCFCFC' : '#7D8592')
            : (isOutgoing ? 'rgba(252,252,252,0.4)' : 'rgba(125,133,146,0.4)');
          return (
            <View
              key={i}                       //......Chave unica
              style={[
                styles.bar,                 //......Estilo base
                {
                  height: Math.max(3, height),
                  backgroundColor: color,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // ========================================
  // Render Principal
  // ========================================
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Coluna esquerda: Avatar ou Container de Velocidade */}
        <View style={styles.leftCol}>
          {showSpeedControl ? (
            <TouchableOpacity
              onPress={cycleSpeed}
              style={[
                styles.speedContainer,
                isOutgoing ? styles.speedContainerUser : styles.speedContainerContact,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.speedText,
                  isOutgoing ? styles.speedTextUser : styles.speedTextContact,
                ]}
              >
                {getSpeedText()}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={cycleSpeed} activeOpacity={0.7}>
              <Image source={avatarSource} style={styles.avatarRect} />
            </TouchableOpacity>
          )}
        </View>

        {/* Coluna direita: Controles e Ondas */}
        <View style={styles.rightCol}>
          <View style={styles.rightTop}>
            {/* Botao Play/Pause */}
            <TouchableOpacity
              onPress={togglePlayback}
              activeOpacity={0.7}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <Rect
                    x={3}
                    y={2}
                    width={4}
                    height={14}
                    rx={1}
                    fill={isOutgoing ? '#FCFCFC' : '#3A3F51'}
                  />
                  <Rect
                    x={11}
                    y={2}
                    width={4}
                    height={14}
                    rx={1}
                    fill={isOutgoing ? '#FCFCFC' : '#3A3F51'}
                  />
                </Svg>
              ) : (
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <Path
                    d="M16.3409 7.86187L2.97916 0.176171C2.77851 0.0607592 2.55091 0 2.31922 0C2.08753 0 1.85993 0.0607592 1.65928 0.176171C1.4588 0.291678 1.29235 0.457692 1.17663 0.657549C1.06091 0.857406 0.999994 1.08407 1 1.3148V16.6859C0.999935 16.8585 1.03401 17.0294 1.10029 17.1889C1.16657 17.3484 1.26374 17.4933 1.38625 17.6153C1.50877 17.7373 1.65423 17.8341 1.81431 17.9001C1.97439 17.9662 2.14597 18.0001 2.31922 18C2.55075 18.0002 2.77822 17.9394 2.97866 17.824L16.3404 10.1385C16.541 10.0232 16.7075 9.85727 16.8233 9.65747C16.9391 9.45768 17 9.23104 17 9.00033C17.0002 8.76961 16.9394 8.54289 16.8237 8.34303C16.708 8.14316 16.5415 7.9772 16.3409 7.86187Z"
                    fill={isOutgoing ? '#FCFCFC' : '#3A3F51'}
                  />
                </Svg>
              )}
            </TouchableOpacity>

            {/* Area de Ondas */}
            <View style={styles.waveContainer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={togglePlayback}
                style={styles.waveAreaTouchable}
              >
                {renderWaveform()}
              </TouchableOpacity>
            </View>
          </View>

          {/* Linha inferior: Tempo do Audio */}
          <View style={styles.rightBottom}>
            {/* Tempo do audio */}
            <Text style={isOutgoing ? styles.timeTextLight : styles.timeTextDark}>
              {displayTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Container padronizado: Hora de envio + Status (posicao absoluta) */}
      {timestamp && (
        <Pressable
          style={[
            styles.timestampContainer,
            { borderColor: isOutgoing ? '#1777CF' : '#3A3F51' },
          ]}
          onPress={status === 'failed' ? handleRetry : undefined}
          disabled={status !== 'failed' || isRetrying}
        >
          <Text style={styles.timestampText}>
            {timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isOutgoing && status && (
            <MessageStatus
              status={isRetrying ? 'pending' : status}
              isOutgoing={isOutgoing}
              size={13}
            />
          )}
        </Pressable>
      )}

      {/* Area de Retry (abaixo do card de audio) */}
      {status === 'failed' && (isRetrying || retryFailed) && (
        <View style={styles.retryContainer}>
          {isRetrying ? (
            <>
              <ActivityIndicator size="small" color="#7D8592" />
              <Text style={styles.retryText}>Tentando enviar novamente...</Text>
            </>
          ) : retryFailed ? (
            <Pressable onPress={handleRetry} style={styles.retryButton}>
              <Text style={styles.retryFailedText}>
                Não foi possível enviar. Toque para tentar novamente.
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default memo(AudioMessage);

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Container principal
  container: {
    width: '100%',                        //......Ocupa todo espaco do MessageBubble (80% da tela)
    minWidth: 200,                        //......Largura minima
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Linha principal
  row: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'flex-start',             //......Alinha no topo
    gap: 15,                              //......Espaco entre colunas
    width: '100%',                        //......Ocupa largura total
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Coluna esquerda (avatar/velocidade)
  leftCol: {
    paddingBottom: 5,                     //......Padding inferior
  },

  // Avatar retangular
  avatarRect: {
    width: 45,                            //......Largura
    height: 45,                           //......Altura
    borderRadius: 10,                     //......Bordas arredondadas
  },

  // Container de velocidade
  speedContainer: {
    width: 45,                            //......Largura
    height: 45,                           //......Altura
    borderRadius: 10,                     //......Bordas arredondadas
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },

  // Velocidade usuario (outgoing)
  speedContainerUser: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },

  // Velocidade contato (incoming)
  speedContainerContact: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },

  // Texto de velocidade
  speedText: {
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_400Regular',       //......Fonte regular
  },

  // Texto velocidade usuario
  speedTextUser: {
    color: '#FCFCFC',                     //......Cor branca
  },

  // Texto velocidade contato
  speedTextContact: {
    color: '#7D8592',                     //......Cor cinza
  },

  // Coluna direita (player)
  rightCol: {
    flex: 1,                              //......Ocupa espaco restante
    width: '100%',                        //......Ocupa largura total
    overflow: 'visible',                  //......Permite conteudo alem dos limites
  },

  // Parte superior direita
  rightTop: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    gap: 10,                              //......Espaco entre
    paddingTop: 8,                        //......Padding superior
    width: '100%',                        //......Ocupa largura total
  },

  // Botao play/pause
  playButton: {
    width: 24,                            //......Largura
    height: 24,                           //......Altura
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },

  // Container das ondas
  waveContainer: {
    flex: 1,                              //......Ocupa espaco
    height: 24,                           //......Altura fixa
    overflow: 'visible',                  //......Permite overflow
  },

  // Area tocavel das ondas
  waveAreaTouchable: {
    flex: 1,                              //......Ocupa espaco
    width: '100%',                        //......Ocupa largura total
    justifyContent: 'center',             //......Centraliza vertical
    overflow: 'visible',                  //......Permite overflow
  },

  // Linha das ondas
  waveRow: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    gap: 2,                               //......Espaco entre barras
    position: 'relative',                 //......Posicao relativa
    height: 18,                           //......Altura fixa
    overflow: 'visible',                  //......Permite overflow
  },

  // Barra individual da onda
  bar: {
    width: 1.5,                           //......Largura da barra
    borderRadius: 0.5,                    //......Bordas arredondadas
  },

  // Marcador de progresso (dot)
  dot: {
    position: 'absolute',                 //......Posicao absoluta
    top: 4.5,                             //......Posicao vertical
    width: 9,                             //......Largura
    height: 9,                            //......Altura
    borderRadius: 4.5,                    //......Circular
    zIndex: 100,                          //......Acima das barras
    elevation: 5,                         //......Elevacao Android
  },

  // Parte inferior direita (tempo do audio)
  rightBottom: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'flex-start',         //......Alinha esquerda
    marginTop: 5,                         //......Margem superior
    paddingLeft: 35,                      //......Padding esquerdo
  },

  // Texto tempo claro (outgoing)
  timeTextLight: {
    color: 'rgba(252,252,252,0.9)',       //......Cor clara
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_300Light',         //......Fonte light
  },

  // Texto tempo escuro (incoming)
  timeTextDark: {
    color: '#91929E',                     //......Cor cinza
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_300Light',         //......Fonte light
  },

  // Container branco padronizado do timestamp de envio (posicao absoluta)
  // ========================================
  // AJUSTES MANUAIS DO CONTAINER DE HORARIO:
  // bottom: Posicao vertical (0 = na borda | negativo = para baixo)
  // right: Posicao horizontal (0 = na borda | negativo = para direita)
  // height: Altura do container
  // paddingTop/paddingBottom: Centraliza conteudo verticalmente
  // ========================================
  timestampContainer: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: -8,                           //......AJUSTE: Posicao vertical (negativo = desce)
    right: -14,                            //......AJUSTE: Posicao horizontal (negativo = direita)
    height: 20,                           //......AJUSTE: Altura do container
    paddingHorizontal: 10,                //......Padding horizontal
    paddingTop: 2,                        //......AJUSTE: Padding superior
    paddingBottom: 0,                     //......AJUSTE: Padding inferior
    backgroundColor: 'rgba(252, 252, 252, 0.5)', //..TESTE: Fundo branco 50%
    borderTopLeftRadius: 12,              //......AJUSTE: Arredonda canto superior esquerdo
    borderBottomRightRadius: 6,           //......AJUSTE: Arredonda canto inferior direito
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'center',             //......Centraliza horizontal
    gap: 5,                               //......Espaco entre hora e check
    borderRightWidth: 2,                  //......Borda direita continua do bubble
    borderBottomWidth: 2,                 //......Borda inferior continua do bubble
  },

  // Texto do timestamp (preto sobre fundo branco)
  timestampText: {
    color: '#3A3F51',                     //......Cor preta
    fontSize: 12,                         //......Tamanho fonte
    fontFamily: 'Inter_400Regular',       //......Fonte regular
  },

  // Container de Retry (abaixo do card de audio)
  retryContainer: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    justifyContent: 'flex-end',           //......Alinha direita
    gap: 8,                               //......Espaco entre elementos
    marginTop: 4,                         //......Margem superior
    paddingRight: 4,                      //......Padding direito
  },

  // Texto de retry (tentando enviar)
  retryText: {
    color: '#7D8592',                     //......Cor cinza
    fontSize: 11,                         //......Tamanho fonte
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontStyle: 'italic',                  //......Italico
  },

  // Botao de retry
  retryButton: {
    paddingVertical: 4,                   //......Padding vertical
    paddingHorizontal: 8,                 //......Padding horizontal
  },

  // Texto de retry falhou
  retryFailedText: {
    color: '#E53935',                     //......Cor vermelha
    fontSize: 11,                         //......Tamanho fonte
    fontFamily: 'Inter_400Regular',       //......Fonte regular
  },
});
