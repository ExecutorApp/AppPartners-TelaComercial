import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import Svg, { Path, Rect } from 'react-native-svg';

// ========================================
// CORES DO TEMA
// ========================================
const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  background: '#F4F4F4', //....Cor de fundo
  white: '#FCFCFC', //.........Cor branca
  border: '#D8E0F0', //........Cor da borda
};

// ========================================
// DIMENSOES
// ========================================
const { width: screenWidth } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(screenWidth * 0.9, 400); //..Largura do modal
const VIDEO_HEIGHT = MODAL_WIDTH * 0.5625; //............Proporcao 16:9

// ========================================
// VELOCIDADES DE REPRODUCAO
// ========================================
const PLAYBACK_RATES = [1.0, 1.25, 1.5, 2.0]; //..Velocidades disponiveis

// ========================================
// ICONES SVG
// ========================================

// Icone Fechar
const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Play Grande
const PlayIconLarge = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Path
      d="M19 15L33 24L19 33V15Z"
      fill={COLORS.white}
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Pause
const PauseIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 48 48" fill="none">
    <Rect x={16} y={14} width={5} height={20} rx={1} fill={COLORS.white} />
    <Rect x={27} y={14} width={5} height={20} rx={1} fill={COLORS.white} />
  </Svg>
);

// Icone Fullscreen (expandir)
const FullscreenIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
    <Path
      d="M2 6V3C2 2.44772 2.44772 2 3 2H6M12 2H15C15.5523 2 16 2.44772 16 3V6M16 12V15C16 15.5523 15.5523 16 15 16H12M6 16H3C2.44772 16 2 15.5523 2 15V12"
      stroke={COLORS.white}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// TIPOS
// ========================================

// Props do componente
export interface InstructionVideoProps {
  visible: boolean; //.............Visibilidade do modal
  onClose: () => void; //..........Callback de fechamento
  videoUri?: string; //............URI do video
  videoTitle?: string; //..........Titulo do video
}

// ========================================
// COMPONENTE PRINCIPAL
// ========================================
const InstructionVideoModal: React.FC<InstructionVideoProps> = ({
  visible,
  onClose,
  videoUri = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  videoTitle = 'Instruções',
}) => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Refs
  const videoRef = useRef<Video>(null); //.................Ref do video (Mobile)
  const webVideoRef = useRef<HTMLVideoElement>(null); //...Ref do video (Web)
  const progressValue = useRef(new Animated.Value(0)).current; //..Valor do progresso

  // Estados
  const [isPlaying, setIsPlaying] = useState(false); //........Video tocando
  const [currentTime, setCurrentTime] = useState(0); //........Tempo atual
  const [duration, setDuration] = useState(0); //..............Duracao total
  const [showControls, setShowControls] = useState(true); //...Controles visiveis
  const [playbackRate, setPlaybackRate] = useState(1.0); //....Velocidade de reproducao

  // Formata tempo em MM:SS
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000); //..Converte para segundos
    const minutes = Math.floor(totalSeconds / 60); //........Calcula minutos
    const seconds = totalSeconds % 60; //....................Calcula segundos
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; //..Formata string
  };

  // Toggle play/pause
  const togglePlayPause = async () => {
    // Web: usa elemento HTML5 video
    if (Platform.OS === 'web') {
      const el = webVideoRef.current;
      if (el) {
        if (isPlaying) {
          el.pause(); //........Pausa o video
          setIsPlaying(false); //..Atualiza estado
        } else {
          await el.play(); //......Inicia reproducao
          setIsPlaying(true); //...Atualiza estado
        }
      }
    // Mobile: usa expo-av
    } else if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync(); //..Pausa o video
        setIsPlaying(false); //.................Atualiza estado
      } else {
        await videoRef.current.playAsync(); //...Inicia reproducao
        setIsPlaying(true); //..................Atualiza estado
      }
    }
  };

  // Alterna velocidade de reproducao
  const togglePlaybackRate = async () => {
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate); //..Indice atual
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length; //..Proximo indice
    const newRate = PLAYBACK_RATES[nextIndex]; //..................Nova velocidade
    setPlaybackRate(newRate); //...................................Atualiza estado

    // Web: usa elemento HTML5 video
    if (Platform.OS === 'web') {
      const el = webVideoRef.current;
      if (el) {
        el.playbackRate = newRate; //..Define velocidade
      }
    // Mobile: usa expo-av
    } else if (videoRef.current) {
      await videoRef.current.setRateAsync(newRate, true); //..Define velocidade
    }
  };

  // Alterna tela inteira
  const toggleFullscreen = async () => {
    // Web: usa Fullscreen API
    if (Platform.OS === 'web') {
      const el = webVideoRef.current;
      if (el) {
        try {
          if (!document.fullscreenElement) {
            await el.requestFullscreen(); //..Entra em tela inteira
          } else {
            await document.exitFullscreen(); //..Sai de tela inteira
          }
        } catch (error) {
          console.log('Fullscreen nao suportado:', error);
        }
      }
    // Mobile: usa expo-screen-orientation
    } else {
      try {
        const orientation = await ScreenOrientation.getOrientationAsync(); //..Orientacao atual
        // Se retrato, muda para paisagem
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP ||
            orientation === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        // Se paisagem, muda para retrato
        } else {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
        }
      } catch (error) {
        console.log('Orientacao nao suportada:', error);
      }
    }
  };

  // Callback de status (Mobile)
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    // Verifica se o video esta carregado
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0); //.....Atualiza tempo atual
      setDuration(status.durationMillis || 0); //........Atualiza duracao
      setIsPlaying(status.isPlaying); //.................Atualiza estado de reproducao
      // Atualiza barra de progresso
      if (status.durationMillis && status.positionMillis) {
        progressValue.setValue(status.positionMillis / status.durationMillis);
      }
    }
  };

  // Seek na barra de progresso
  const handleProgressPress = async (event: any) => {
    const { locationX } = event.nativeEvent; //..........Posicao do toque
    const progressBarWidth = MODAL_WIDTH - 32 - 80 - 72; //..Largura da barra (descontando padding, textos e botoes)
    const progress = Math.max(0, Math.min(1, locationX / progressBarWidth)); //..Calcula progresso
    const newPosition = progress * duration; //..........Nova posicao em ms

    // Web: usa elemento HTML5 video
    if (Platform.OS === 'web') {
      const el = webVideoRef.current;
      if (el) {
        el.currentTime = newPosition / 1000; //..Define posicao em segundos
      }
    // Mobile: usa expo-av
    } else if (videoRef.current) {
      await videoRef.current.setPositionAsync(newPosition); //..Define posicao em ms
    }
  };

  // Reset ao fechar
  const handleClose = async () => {
    // Web: pausa e reseta
    if (Platform.OS === 'web') {
      const el = webVideoRef.current;
      if (el) {
        el.pause(); //.........Pausa o video
        el.currentTime = 0; //..Reseta para o inicio
        el.playbackRate = 1.0; //..Reseta velocidade
      }
    // Mobile: pausa e reseta
    } else if (videoRef.current) {
      await videoRef.current.pauseAsync(); //........Pausa o video
      await videoRef.current.setPositionAsync(0); //..Reseta para o inicio
      await videoRef.current.setRateAsync(1.0, true); //..Reseta velocidade
      // Volta para retrato ao fechar
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      } catch {}
    }
    setIsPlaying(false); //.......Atualiza estado
    setCurrentTime(0); //..........Reseta tempo
    setPlaybackRate(1.0); //.......Reseta velocidade
    progressValue.setValue(0); //..Reseta barra de progresso
    onClose(); //.................Chama callback de fechamento
  };

  // Aguarda fontes carregarem
  if (!fontsLoaded) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      {/* Overlay escuro */}
      <View style={styles.overlay}>
        {/* Container do Modal */}
        <View style={styles.modalContainer}>
          {/* Header com titulo e fechar */}
          <View style={styles.header}>
            {/* Titulo */}
            <Text style={styles.title}>{videoTitle}</Text>
            {/* Botao fechar */}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Container do Video */}
          <TouchableOpacity
            style={styles.videoWrapper}
            onPress={() => setShowControls(!showControls)}
            activeOpacity={1}
          >
            {/* Video Web (HTML5) */}
            {Platform.OS === 'web' ? (
              <video
                ref={(el: any) => { webVideoRef.current = el; }}
                style={styles.webVideo as any}
                src={videoUri}
                controls={false}
                playsInline
                onTimeUpdate={(e: any) => {
                  const video = e.target;
                  setCurrentTime(video.currentTime * 1000); //..Converte para ms
                  if (video.duration) {
                    setDuration(video.duration * 1000); //......Converte para ms
                    progressValue.setValue(video.currentTime / video.duration);
                  }
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              /* Video Mobile (expo-av) */
              <Video
                ref={videoRef}
                style={styles.video}
                source={{ uri: videoUri }}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={onPlaybackStatusUpdate}
              />
            )}

            {/* Controles overlay */}
            {showControls && (
              <View style={styles.controlsOverlay}>
                {/* Botao play/pause central */}
                <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
                  {isPlaying ? <PauseIcon /> : <PlayIconLarge />}
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>

          {/* Barra de controles inferior */}
          <View style={styles.controlsBar}>
            {/* Tempo atual */}
            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

            {/* Barra de progresso */}
            <TouchableOpacity
              style={styles.progressBar}
              onPress={handleProgressPress}
              activeOpacity={1}
            >
              {/* Fundo da barra */}
              <View style={styles.progressBackground} />
              {/* Preenchimento */}
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </TouchableOpacity>

            {/* Tempo total */}
            <Text style={styles.timeText}>{formatTime(duration)}</Text>

            {/* Botao Velocidade */}
            <TouchableOpacity onPress={togglePlaybackRate} style={styles.controlButton}>
              <Text style={styles.speedText}>{playbackRate}x</Text>
            </TouchableOpacity>

            {/* Botao Fullscreen */}
            <TouchableOpacity onPress={toggleFullscreen} style={styles.controlButton}>
              <FullscreenIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ========================================
// ESTILOS
// ========================================
const styles = StyleSheet.create({
  // Overlay escuro
  overlay: {
    flex: 1, //............................Ocupa toda a tela
    backgroundColor: 'rgba(0, 0, 0, 0.8)', //..Fundo escuro semi-transparente
    justifyContent: 'center', //...........Centraliza verticalmente
    alignItems: 'center', //...............Centraliza horizontalmente
  },

  // Container do modal
  modalContainer: {
    width: MODAL_WIDTH, //..........Largura do modal
    backgroundColor: '#1A1A1A', //..Fundo escuro
    borderRadius: 12, //............Bordas arredondadas
    overflow: 'hidden', //..........Esconde overflow
  },

  // Header
  header: {
    flexDirection: 'row', //............Layout horizontal
    justifyContent: 'space-between', //..Espaco entre titulo e botao
    alignItems: 'center', //............Alinha verticalmente
    paddingHorizontal: 16, //...........Padding horizontal
    paddingVertical: 12, //.............Padding vertical
  },

  // Titulo
  title: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.white, //.............Cor branca
  },

  // Botao fechar
  closeButton: {
    width: 32, //................................Largura
    height: 32, //...............................Altura
    borderRadius: 16, //........................Circular
    backgroundColor: 'rgba(255, 255, 255, 0.1)', //..Fundo semi-transparente
    justifyContent: 'center', //................Centraliza icone
    alignItems: 'center', //....................Centraliza icone
  },

  // Container do video
  videoWrapper: {
    width: MODAL_WIDTH, //......Largura total
    height: VIDEO_HEIGHT, //....Altura proporcional (16:9)
    backgroundColor: '#000', //..Fundo preto
  },

  // Video (Mobile)
  video: {
    width: '100%', //..Largura total
    height: '100%', //..Altura total
  },

  // Video (Web)
  webVideo: {
    width: '100%', //.............Largura total
    height: '100%', //............Altura total
    objectFit: 'contain', //......Mantem proporcao
    backgroundColor: '#000', //...Fundo preto
  },

  // Overlay de controles
  controlsOverlay: {
    position: 'absolute', //.................Posicao absoluta
    top: 0, //..............................Topo
    left: 0, //.............................Esquerda
    right: 0, //............................Direita
    bottom: 0, //...........................Inferior
    justifyContent: 'center', //............Centraliza verticalmente
    alignItems: 'center', //................Centraliza horizontalmente
    backgroundColor: 'rgba(0, 0, 0, 0.3)', //..Fundo semi-transparente
  },

  // Botao play central
  playButton: {
    width: 72, //................................Largura
    height: 72, //...............................Altura
    borderRadius: 36, //........................Circular
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //...Fundo semi-transparente
    justifyContent: 'center', //................Centraliza icone
    alignItems: 'center', //....................Centraliza icone
  },

  // Barra de controles inferior
  controlsBar: {
    flexDirection: 'row', //..Layout horizontal
    alignItems: 'center', //..Alinha verticalmente
    paddingHorizontal: 12, //..Padding horizontal
    paddingVertical: 10, //....Padding vertical
    gap: 8, //.................Espaco entre elementos
  },

  // Texto de tempo
  timeText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //....................Tamanho da fonte
    color: COLORS.white, //.............Cor branca
    minWidth: 36, //....................Largura minima
    textAlign: 'center', //.............Alinha texto
  },

  // Barra de progresso
  progressBar: {
    flex: 1, //.............Ocupa espaco disponivel
    height: 4, //...........Altura da barra
    position: 'relative', //..Posicao relativa
  },

  // Fundo da barra
  progressBackground: {
    position: 'absolute', //.......................Posicao absoluta
    top: 0, //....................................Topo
    left: 0, //...................................Esquerda
    right: 0, //..................................Direita
    height: 4, //..................................Altura
    backgroundColor: 'rgba(255, 255, 255, 0.3)', //..Fundo semi-transparente
    borderRadius: 2, //...........................Bordas arredondadas
  },

  // Preenchimento da barra
  progressFill: {
    position: 'absolute', //......Posicao absoluta
    top: 0, //....................Topo
    left: 0, //...................Esquerda
    height: 4, //.................Altura
    backgroundColor: COLORS.primary, //..Cor primaria (azul)
    borderRadius: 2, //...........Bordas arredondadas
  },

  // Botao de controle (velocidade/fullscreen)
  controlButton: {
    width: 32, //................................Largura
    height: 32, //...............................Altura
    borderRadius: 6, //..........................Bordas arredondadas
    backgroundColor: 'rgba(255, 255, 255, 0.15)', //..Fundo semi-transparente
    justifyContent: 'center', //................Centraliza conteudo
    alignItems: 'center', //....................Centraliza conteudo
  },

  // Texto de velocidade
  speedText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 11, //...................Tamanho da fonte
    color: COLORS.white, //.............Cor branca
  },
});

export default InstructionVideoModal;
