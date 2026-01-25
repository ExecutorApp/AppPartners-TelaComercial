import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { COLORS } from './02.Training-Types';

// ========================================
// ICONES SVG
// ========================================

// Icone de Play
const PlayIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 5.14v13.72c0 .86.98 1.36 1.68.86l9.02-6.86c.58-.44.58-1.28 0-1.72l-9.02-6.86c-.7-.5-1.68 0-1.68.86z"
      fill={color}
    />
  </Svg>
);

// Icone de Pause
const PauseIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
      fill={color}
    />
  </Svg>
);

// Icone de Replay
const ReplayIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
      fill={color}
    />
  </Svg>
);

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface VideoPlayerProps {
  url?: string; //..................URL do video
  thumbnail?: string; //.............Thumbnail do video
  duration: number; //...............Duracao em minutos
  onComplete: () => void; //.........Callback ao completar
  onProgress: (progress: number) => void; //..Callback de progresso
}

// ========================================
// COMPONENTE VIDEO PLAYER
// ========================================

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  duration,
  onComplete,
  onProgress,
}) => {
  // Estados
  const [isPlaying, setIsPlaying] = useState(false); //..Se esta tocando
  const [progress, setProgress] = useState(0); //........Progresso atual
  const [currentTime, setCurrentTime] = useState(0); //..Tempo atual em segundos

  // Duracao total em segundos
  const totalSeconds = duration * 60;

  // Formata tempo em MM:SS
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Toggle play/pause
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Reinicia video
  const handleReplay = useCallback(() => {
    setProgress(0);
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  // Simula progresso (em producao, usar eventos do video)
  const handleSeek = useCallback((newProgress: number) => {
    setProgress(newProgress);
    setCurrentTime((newProgress / 100) * totalSeconds);
    onProgress(newProgress);

    if (newProgress >= 100) {
      setIsPlaying(false);
      onComplete();
    }
  }, [totalSeconds, onProgress, onComplete]);

  // Verifica se video completou
  const isCompleted = progress >= 100;

  return (
    <View style={styles.container}>
      {/* Area do Video */}
      <View style={styles.videoArea}>
        {/* Placeholder do Video */}
        <View style={styles.videoPlaceholder}>
          <Text style={styles.placeholderText}>Video Player</Text>
          <Text style={styles.placeholderSubtext}>
            {isPlaying ? 'Reproduzindo...' : 'Pausado'}
          </Text>
        </View>

        {/* Overlay de Controles */}
        <View style={styles.controlsOverlay}>
          {/* Botao Central */}
          <TouchableOpacity
            style={styles.centerButton}
            onPress={isCompleted ? handleReplay : handlePlayPause}
            activeOpacity={0.8}
          >
            {isCompleted ? (
              <ReplayIcon color={COLORS.white} />
            ) : isPlaying ? (
              <PauseIcon color={COLORS.white} />
            ) : (
              <PlayIcon color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressSection}>
        {/* Tempo Atual */}
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

        {/* Barra */}
        <TouchableOpacity
          style={styles.progressBarContainer}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            const width = 200; // Largura aproximada da barra
            const newProgress = Math.min(100, Math.max(0, (locationX / width) * 100));
            handleSeek(newProgress);
          }}
          activeOpacity={1}
        >
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>
        </TouchableOpacity>

        {/* Tempo Total */}
        <Text style={styles.timeText}>{formatTime(totalSeconds)}</Text>
      </View>
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    width: '100%', //................Largura total
    backgroundColor: COLORS.textPrimary, //..Fundo escuro
    borderRadius: 8, //..............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow
  },

  // Area do Video
  videoArea: {
    width: '100%', //................Largura total
    aspectRatio: 16 / 9, //..........Proporcao 16:9
    position: 'relative', //.........Posicao relativa
  },

  // Placeholder do Video
  videoPlaceholder: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
    backgroundColor: '#1A1A2E', //...Fundo escuro
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Texto do Placeholder
  placeholderText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //.................Tamanho da fonte
    color: COLORS.white, //..........Cor branca
    marginBottom: 4, //..............Margem inferior
  },

  // Subtexto do Placeholder
  placeholderSubtext: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: 'rgba(255, 255, 255, 0.6)', //..Branco transparente
  },

  // Overlay de Controles
  controlsOverlay: {
    position: 'absolute', //.........Posicao absoluta
    top: 0, //......................Topo
    left: 0, //.....................Esquerda
    right: 0, //....................Direita
    bottom: 0, //...................Fundo
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Central
  centerButton: {
    width: 64, //...................Largura
    height: 64, //..................Altura
    borderRadius: 32, //.............Arredondamento completo
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Secao de Progresso
  progressSection: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    paddingHorizontal: 12, //........Padding horizontal
    paddingVertical: 8, //...........Padding vertical
    gap: 8, //......................Espaco entre elementos
    backgroundColor: '#16213E', //...Fundo escuro
  },

  // Texto de Tempo
  timeText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.white, //..........Cor branca
    width: 40, //...................Largura fixa
    textAlign: 'center', //..........Centraliza texto
  },

  // Container da Barra de Progresso
  progressBarContainer: {
    flex: 1, //.....................Ocupa espaco disponivel
    height: 24, //..................Altura para area de toque
    justifyContent: 'center', //....Centraliza verticalmente
  },

  // Fundo da Barra de Progresso
  progressBarBackground: {
    width: '100%', //................Largura total
    height: 4, //...................Altura
    backgroundColor: 'rgba(255, 255, 255, 0.3)', //..Fundo transparente
    borderRadius: 2, //..............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow
  },

  // Preenchimento da Barra de Progresso
  progressBarFill: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Cor azul
    borderRadius: 2, //..............Bordas arredondadas
  },
});

export default VideoPlayer;
