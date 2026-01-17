// ============================================================================
// Componente de Reprodutor de Áudio para Chat de Desconto
// Implementa player profissional estilo WhatsApp com controle de velocidade,
// ondas sincronizadas, arraste do marcador e reprodução em tempo real
// Inclui captação de áudio em tempo real via WebAudio API
// Suporte a auto-player para sequências de áudio
// ============================================================================
// Imports principais de bibliotecas e módulos
import React, { useState, useRef, useEffect, useCallback, memo, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
  Alert,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Platform,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Audio, AVPlaybackStatus } from 'expo-av';

// ============================================================================
// Tipos e Interfaces
// ============================================================================

// Estado possível do componente de áudio
type AudioState = 'idle' | 'recording' | 'paused' | 'playing';

// Velocidades de reprodução disponíveis
type PlaybackSpeed = 1 | 1.5 | 2;

// Interface para mensagem de áudio recebida/enviada
interface AudioMessage {
  id?: string;
  audioDuration?: string;
  timestamp: string;
  audioUri?: string;
  sender?: 'user' | 'contact';
}

// Interface para métodos expostos via ref
export interface MessageAudioPlayerRef {
  play: () => void;
  stop: () => void;
}

// Resultado do hook de níveis de microfone
type LevelsResult = {
  levels: number[];
  elapsedMs: number;
  amplitude: number;
};

// ============================================================================
// Hook: useWebMicrophoneLevels
// Captura níveis de áudio via WebAudio API no ambiente web
// Não grava arquivo; serve para visualização (ondas em tempo real)
// ============================================================================
function useWebMicrophoneLevels(running: boolean, barCount = 40, sessionId: number = 0): LevelsResult {
  const [levels, setLevels] = useState<number[]>(Array(barCount).fill(0));
  const [elapsedMs, setElapsedMs] = useState(0);
  const [amplitude, setAmplitude] = useState(0);

  const startRef = useRef<number>(0);
  const accRef = useRef<number>(0);
  const streamRef = useRef<any>(null);
  const audioCtxRef = useRef<any>(null);
  const analyserRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);
  const amplitudeRef = useRef<number>(0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await (navigator as any).mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
        const ctx = new AC();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        analyserRef.current = analyser;
        source.connect(analyser);

        const bufFreq = new Uint8Array(analyser.frequencyBinCount);
        const bufTime = new Uint8Array(analyser.fftSize);
        startRef.current = Date.now();

        const loop = () => {
          if (cancelled) return;

          analyser.getByteFrequencyData(bufFreq);
          const step = Math.max(1, Math.floor(bufFreq.length / barCount));
          const vals: number[] = [];
          for (let i = 0; i < barCount; i++) {
            const idx = i * step;
            vals.push((bufFreq[idx] ?? 0) / 255);
          }
          setLevels(vals);

          analyser.getByteTimeDomainData(bufTime);
          let sum = 0;
          for (let i = 0; i < bufTime.length; i++) {
            const v = bufTime[i] - 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / bufTime.length) / 128;
          const prev = amplitudeRef.current;
          const smooth = prev * 0.8 + rms * 0.2;
          amplitudeRef.current = Math.max(0, Math.min(1, smooth));
          setAmplitude(amplitudeRef.current);

          const now = Date.now();
          setElapsedMs(accRef.current + (startRef.current ? (now - startRef.current) : 0));
          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
      } catch (err) {
        console.warn('[useWebMicrophoneLevels] getUserMedia falhou', err);
      }
    };

    const stop = () => {
      if (startRef.current) {
        try { accRef.current += Date.now() - startRef.current; } catch {}
      }
      startRef.current = 0;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (analyserRef.current) analyserRef.current.disconnect();
      analyserRef.current = null;
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
      if (streamRef.current) {
        try { streamRef.current.getTracks().forEach((t: any) => t.stop()); } catch {}
        streamRef.current = null;
      }
    };

    if (running) start();
    else stop();

    return () => { cancelled = true; stop(); };
  }, [running, barCount, sessionId]);

  useEffect(() => {
    accRef.current = 0;
    startRef.current = 0;
    setElapsedMs(0);
  }, [sessionId]);

  return { levels, elapsedMs, amplitude };
}

// ============================================================================
// Ícones SVG Memoizados - Conforme Figma
// ============================================================================

// Ícone de microfone (botão principal no input) - Figma padrão de áudio centralizado
const MicIcon = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect width={40} height={40} rx={6} fill="#1777CF" />
    <Path
      d="M18.3672 21.5474H20.7345C22.2121 21.5474 23.4143 20.3453 23.4143 18.8676V12.9298C23.4143 11.4522 22.2121 10.25 20.7345 10.25H18.3672C16.8895 10.25 15.6873 11.4522 15.6873 12.9298V18.8677C15.6874 20.3452 16.8895 21.5474 18.3672 21.5474ZM16.3124 12.9298C16.3124 11.7968 17.2341 10.875 18.3672 10.875H20.7345C21.8675 10.875 22.7893 11.7968 22.7893 12.9298V18.8677C22.7893 20.0007 21.8675 20.9225 20.7345 20.9225H18.3672C17.2342 20.9225 16.3124 20.0007 16.3124 18.8677V12.9298ZM25.3516 19.0237V19.311C25.3516 21.561 23.5211 23.3915 21.271 23.3915H19.8633V27.8281H25.0391C25.1219 27.8281 25.2014 27.861 25.26 27.9197C25.3186 27.9783 25.3516 28.0577 25.3516 28.1406C25.3516 28.2235 25.3186 28.303 25.26 28.3616C25.2014 28.4202 25.1219 28.4531 25.0391 28.4531H14.0625C13.9796 28.4531 13.9001 28.4202 13.8415 28.3616C13.7829 28.303 13.75 28.2235 13.75 28.1406C13.75 28.0577 13.7829 27.9783 13.8415 27.9197C13.9001 27.861 13.9796 27.8281 14.0625 27.8281H19.2383V23.3916H17.8306C15.5805 23.3916 13.75 21.5611 13.75 19.311V19.0238C13.75 18.9409 13.7829 18.8614 13.8415 18.8028C13.9001 18.7442 13.9796 18.7113 14.0625 18.7113C14.1454 18.7113 14.2249 18.7442 14.2835 18.8028C14.3421 18.8614 14.375 18.9409 14.375 19.0238V19.311C14.375 21.2164 15.9252 22.7666 17.8306 22.7666H21.271C23.1764 22.7666 24.7266 21.2164 24.7266 19.311V19.0238C24.7266 18.9409 24.7595 18.8614 24.8181 18.8028C24.8767 18.7442 24.9562 18.7112 25.039 18.7112C25.1219 18.7112 25.2014 18.7441 25.26 18.8028C25.3186 18.8614 25.3516 18.9408 25.3516 19.0237Z"
      fill="white"
      stroke="white"
      strokeWidth={0.5}
    />
  </Svg>
));

// Ícone de microfone pequeno (usado no estado pausado) - Figma padrão de áudio
const MicSmallIcon = memo(() => (
  <Svg width={13} height={19} viewBox="0 0 13 19" fill="none">
    <Path
      d="M4.86715 11.5474H7.23445C8.71207 11.5474 9.91426 10.3453 9.91426 8.86762V2.9298C9.91426 1.45215 8.71207 0.25 7.23445 0.25H4.86715C3.38949 0.25 2.18734 1.45215 2.18734 2.9298V8.86766C2.18738 10.3452 3.38953 11.5474 4.86715 11.5474ZM2.81238 2.9298C2.81238 1.7968 3.73414 0.875 4.86719 0.875H7.23449C8.3675 0.875 9.2893 1.7968 9.2893 2.9298V8.86766C9.2893 10.0007 8.3675 10.9225 7.23449 10.9225H4.86719C3.73418 10.9225 2.81238 10.0007 2.81238 8.86766V2.9298ZM11.8516 9.02371V9.31098C11.8516 11.561 10.0211 13.3915 7.77102 13.3915H6.36328V17.8281H11.5391C11.6219 17.8281 11.7014 17.861 11.76 17.9197C11.8186 17.9783 11.8516 18.0577 11.8516 18.1406C11.8516 18.2235 11.8186 18.303 11.76 18.3616C11.7014 18.4202 11.6219 18.4531 11.5391 18.4531H0.5625C0.47962 18.4531 0.400134 18.4202 0.341529 18.3616C0.282924 18.303 0.25 18.2235 0.25 18.1406C0.25 18.0577 0.282924 17.9783 0.341529 17.9197C0.400134 17.861 0.47962 17.8281 0.5625 17.8281H5.73828V13.3916H4.33055C2.08051 13.3916 0.25 11.5611 0.25 9.31102V9.02375C0.25 8.94087 0.282924 8.86138 0.341529 8.80278C0.400134 8.74417 0.47962 8.71125 0.5625 8.71125C0.64538 8.71125 0.724866 8.74417 0.783471 8.80278C0.842076 8.86138 0.875 8.94087 0.875 9.02375V9.31102C0.875 11.2164 2.42516 12.7666 4.33055 12.7666H7.77102C9.67641 12.7666 11.2266 11.2164 11.2266 9.31102V9.02375C11.2266 8.94087 11.2595 8.86138 11.3181 8.80277C11.3767 8.74416 11.4562 8.71124 11.539 8.71123C11.6219 8.71123 11.7014 8.74414 11.76 8.80275C11.8186 8.86135 11.8516 8.94083 11.8516 9.02371Z"
      fill="#3A3F51"
      stroke="#3A3F51"
      strokeWidth={0.5}
    />
  </Svg>
));

// Ícone de enviar mensagem (botão azul com seta) - Figma
const SendBtnIcon = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect width={40} height={40} rx={6} fill="#1777CF" />
    <Path
      d="M27.4876 18.9668L13.9647 12.3624C13.7993 12.2791 13.6153 12.241 13.4309 12.2518C13.2464 12.2626 13.068 12.322 12.9133 12.424C12.7047 12.5572 12.534 12.7429 12.4178 12.9628C12.3016 13.1828 12.244 13.4295 12.2505 13.6787V26.849C12.2454 27.0914 12.3006 27.3312 12.4111 27.5464C12.5215 27.7616 12.6838 27.9453 12.8828 28.0806C13.0557 28.1922 13.2567 28.251 13.4619 28.25C13.6251 28.2483 13.7861 28.2116 13.9342 28.1422L27.4876 21.5378C27.7226 21.4191 27.9191 21.2351 28.0541 21.0073C28.1891 20.7796 28.2569 20.5177 28.2495 20.2523C28.2569 19.987 28.1891 19.725 28.0541 19.4973C27.9191 19.2696 27.7226 19.0855 27.4876 18.9668ZM27.1306 20.845C27.1359 20.845 27.1376 20.8523 27.1328 20.8546L13.6371 27.4418C13.589 27.4717 13.5336 27.4876 13.4771 27.4876C13.4206 27.4876 13.3652 27.4717 13.3171 27.4418C13.2194 27.3785 13.1399 27.2905 13.0864 27.1865C13.0329 27.0825 13.0074 26.9661 13.0124 26.849V13.6787C13.008 13.5682 13.0308 13.4584 13.0786 13.359C13.1265 13.2597 13.1979 13.1738 13.2866 13.1091C13.3186 13.0866 13.3544 13.0708 13.392 13.0623C13.4376 13.0521 13.4849 13.0479 13.5317 13.0476C13.5818 13.0472 13.6294 13.0663 13.6744 13.0883L26.8021 19.507C27.0099 19.6086 27.2353 19.712 27.3429 19.9169C27.3971 20.0202 27.4255 20.1354 27.4255 20.2523C27.4255 20.3693 27.3971 20.4845 27.3429 20.5878C27.2912 20.6863 27.2174 20.7711 27.1276 20.8357C27.1236 20.8386 27.1256 20.845 27.1306 20.845Z"
      fill="#FCFCFC"
      stroke="#FCFCFC"
      strokeWidth={0.5}
    />
  </Svg>
));

// Ícone de play (reproduzir áudio) - Figma
const PlayIcon = memo(() => (
  <Svg width={12} height={14} viewBox="0 0 12 14" fill="none">
    <Path
      d="M8.41016 7L2.3457 10.6172V3.38184L8.41016 7Z"
      fill="#3A3F51"
      stroke="#3A3F51"
      strokeWidth={4.69182}
    />
  </Svg>
));

// Ícone de pause (pausar áudio) - Figma
const PauseIcon = memo(() => (
  <Svg width={9} height={12} viewBox="0 0 9 12" fill="none">
    <Path
      d="M0 1.13364C0 0.507549 0.662619 0 1.48 0C2.29738 0 2.96 0.507549 2.96 1.13364V10.2388C2.96 10.8649 2.29738 11.3724 1.48 11.3724C0.662619 11.3724 0 10.8649 0 10.2388V1.13364Z"
      fill="#3A3F51"
    />
    <Path
      d="M5.92001 1.13364C5.92001 0.507549 6.58263 0 7.40001 0C8.21739 0 8.88001 0.507549 8.88001 1.13364V10.2388C8.88001 10.8649 8.21739 11.3724 7.40001 11.3724C6.58263 11.3724 5.92001 10.8649 5.92001 10.2388V1.13364Z"
      fill="#3A3F51"
    />
  </Svg>
));

// Ícone de lixeira (deletar gravação) - Figma
const TrashIcon = memo(() => (
  <Svg width={13} height={15} viewBox="0 0 13 15" fill="none">
    <Path
      d="M5.2 6.13636C5.53334 6.13636 5.80808 6.39957 5.84563 6.73867L5.85 6.81818V10.9091C5.85 11.2856 5.55899 11.5909 5.2 11.5909C4.86666 11.5909 4.59192 11.3277 4.55437 10.9886L4.55 10.9091V6.81818C4.55 6.44162 4.84101 6.13636 5.2 6.13636Z"
      fill="#3A3F51"
    />
    <Path
      d="M8.44563 6.73867C8.40808 6.39957 8.13334 6.13636 7.8 6.13636C7.44101 6.13636 7.15 6.44162 7.15 6.81818V10.9091L7.15437 10.9886C7.19192 11.3277 7.46666 11.5909 7.8 11.5909C8.15899 11.5909 8.45 11.2856 8.45 10.9091V6.81818L8.44563 6.73867Z"
      fill="#3A3F51"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.8 0C8.83849 0 9.68738 0.851536 9.74669 1.92527L9.75 2.04545V2.72727H12.35C12.709 2.72727 13 3.03253 13 3.40909C13 3.75875 12.7491 4.04694 12.4258 4.08632L12.35 4.09091H11.7V12.9545C11.7 14.0439 10.8882 14.9343 9.86458 14.9965L9.75 15H3.25C2.21151 15 1.36262 14.1485 1.30331 13.0747L1.3 12.9545V4.09091H0.65C0.291015 4.09091 0 3.78565 0 3.40909C0 3.05943 0.250926 2.77125 0.574196 2.73186L0.65 2.72727H3.25V2.04545C3.25 0.956127 4.0618 0.0656858 5.08542 0.00347229L5.2 0H7.8ZM2.6 4.09091V12.9545C2.6 13.3042 2.85093 13.5924 3.1742 13.6318L3.25 13.6364H9.75C10.0833 13.6364 10.3581 13.3732 10.3956 13.0341L10.4 12.9545V4.09091H2.6ZM8.45 2.72727H4.55V2.04545L4.55437 1.96594C4.59192 1.62685 4.86666 1.36364 5.2 1.36364H7.8L7.8758 1.36822C8.19907 1.40761 8.45 1.69579 8.45 2.04545V2.72727Z"
      fill="#3A3F51"
    />
  </Svg>
));

// Ícone de REC (gravando) - Bolinha vermelha - Figma
const RecIcon = memo(() => (
  <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
    <Path
      d="M6.14321 0.00538225C2.83348 -0.139593 0.0635569 2.66417 0.000852033 5.99859C-0.0482214 8.46043 2.02377 12 5.89239 12C9.33298 12 11.8439 9.53816 11.9938 6.00406C12.1383 2.62587 9.72556 0.161299 6.14321 0.00538225Z"
      fill="#C1253A"
    />
  </Svg>
));

// Ícone de mais (anexar arquivos)
const PlusBtn = memo(() => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#7D8592" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

// ============================================================================
// Constantes de Configuração
// ============================================================================

// Alturas das barras de onda de áudio (padrão base)
const WAVE_HEIGHTS = [
  3, 3.5, 4, 3, 10, 8, 9, 18, 18, 14,
  11, 8, 18, 14, 10, 7, 11, 15, 18, 14,
  11, 14, 18, 14, 10, 7, 6, 4, 4, 4,
  11, 14, 18, 14, 10, 7, 11, 15,
];

// Quantidade de barras para captação em tempo real
const LIVE_BAR_COUNT = 38;

// Altura mínima e máxima das barras de gravação
const MIN_BAR_HEIGHT = 3;
const MAX_BAR_HEIGHT = 18;

// Largura total da área de ondas em pixels
const WAVE_AREA_WIDTH = 100;

// ============================================================================
// Componente Principal: MessageAudioPlayer
// Reprodutor de áudio para mensagens no chat estilo WhatsApp
// Com suporte a auto-player para sequências de áudio via ref
// ============================================================================
// Exporta o componente de reprodução de áudio para mensagens do chat
export const MessageAudioPlayer = memo(forwardRef<MessageAudioPlayerRef, {
  message: AudioMessage;
  isUser: boolean;
  onFinished?: () => void;
  insideCard?: boolean;
}>(({
  message,
  isUser,
  onFinished,
  insideCard = false,
}, ref) => {
  // Estados do Componente
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [progress, setProgress] = useState(0);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSilent, setIsSilent] = useState(false);

  // Refs para Controle de Áudio
  const soundRef = useRef<Audio.Sound | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const waveAreaRef = useRef<number>(WAVE_AREA_WIDTH);
  const dragStartXRef = useRef<number>(0);
  const dragStartProgressRef = useRef<number>(0);
  const speedHideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasFinishedRef = useRef(false);
  const onFinishedRef = useRef(onFinished);

  // Atualiza ref do callback quando mudar
  useEffect(() => {
    onFinishedRef.current = onFinished;
  }, [onFinished]);

  // Efeito de Limpeza ao Desmontar
  useEffect(() => {
    return () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
      if (speedHideTimerRef.current) {
        clearTimeout(speedHideTimerRef.current);
        speedHideTimerRef.current = null;
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  // Efeito para Carregar Áudio
  useEffect(() => {
    const loadAudio = async () => {
      if (!message.audioUri) {
        setIsSilent(true);
        if (message.audioDuration) {
          const parts = message.audioDuration.split(':');
          if (parts.length === 2) {
            const mins = parseInt(parts[0], 10) || 0;
            const secs = parseInt(parts[1], 10) || 0;
            setDurationMs((mins * 60 + secs) * 1000);
          }
        }
        setIsLoaded(true);
        return;
      }

      try {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: message.audioUri },
          { shouldPlay: false, isLooping: false }
        );
        soundRef.current = sound;

        // Listener para detectar quando o áudio termina
        sound.setOnPlaybackStatusUpdate((playbackStatus) => {
          if (!playbackStatus.isLoaded) return;
          if (playbackStatus.didJustFinish && !hasFinishedRef.current) {
            hasFinishedRef.current = true;
            if (progressTimerRef.current) {
              clearInterval(progressTimerRef.current);
              progressTimerRef.current = null;
            }
            setIsPlaying(false);
            setProgress(0);
            setCurrentTimeMs(0);
            sound.setPositionAsync(0).catch(() => {});

            // Chama callback de término para auto-play
            if (onFinishedRef.current) {
              setTimeout(() => {
                onFinishedRef.current?.();
              }, 300);
            }
          }
        });

        if (status.isLoaded && status.durationMillis) {
          setDurationMs(status.durationMillis);
        }
        setIsLoaded(true);
        setIsSilent(false);
      } catch (error) {
        console.warn('Erro ao carregar áudio:', error);
        setIsSilent(true);
        setIsLoaded(true);
      }
    };
    loadAudio();
  }, [message.audioUri, message.audioDuration]);

  // Formata tempo em mm:ss
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Inicia Timer de Atualização de Progresso
  const startProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
    progressTimerRef.current = setInterval(async () => {
      if (hasFinishedRef.current) {
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
          progressTimerRef.current = null;
        }
        return;
      }
      if (soundRef.current && !isDragging) {
        try {
          const status = await soundRef.current.getStatusAsync();
          if (status.isLoaded) {
            const currentPos = status.positionMillis || 0;
            const duration = status.durationMillis || durationMs || 1;
            setCurrentTimeMs(currentPos);
            setProgress(currentPos / duration);
          }
        } catch (error) {}
      }
    }, 50);
  }, [isDragging, durationMs]);

  // Para Timer de Progresso
  const stopProgressTimer = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  // Inicia timer para esconder o container de velocidade após 3 segundos
  const startSpeedHideTimer = useCallback(() => {
    if (speedHideTimerRef.current) {
      clearTimeout(speedHideTimerRef.current);
    }
    speedHideTimerRef.current = setTimeout(() => {
      setShowSpeedControl(false);
      speedHideTimerRef.current = null;
    }, 3000);
  }, []);

  // Mostra o container de velocidade e inicia timer
  const showSpeedAndStartTimer = useCallback(() => {
    setShowSpeedControl(true);
    startSpeedHideTimer();
  }, [startSpeedHideTimer]);

  // Função para iniciar reprodução (usado por ref e toggle)
  const startPlayback = useCallback(async () => {
    showSpeedAndStartTimer();

    if (isSilent) {
      hasFinishedRef.current = false;
      setIsPlaying(true);
      setProgress(0);
      setCurrentTimeMs(0);
      const duration = durationMs || 195000;
      const startTime = Date.now();
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      progressTimerRef.current = setInterval(() => {
        if (hasFinishedRef.current) return;
        const elapsed = (Date.now() - startTime) * playbackSpeed;
        const newProgress = elapsed / duration;
        if (newProgress >= 1) {
          hasFinishedRef.current = true;
          setProgress(0);
          setCurrentTimeMs(0);
          setIsPlaying(false);
          if (progressTimerRef.current) {
            clearInterval(progressTimerRef.current);
            progressTimerRef.current = null;
          }
          // Chama callback de término para auto-play
          if (onFinishedRef.current) {
            setTimeout(() => {
              onFinishedRef.current?.();
            }, 300);
          }
        } else {
          setProgress(newProgress);
          setCurrentTimeMs(newProgress * duration);
        }
      }, 50);
      return;
    }

    if (!soundRef.current) return;

    try {
      hasFinishedRef.current = false;
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.setRateAsync(playbackSpeed, true);
      await soundRef.current.playAsync();
      setIsPlaying(true);
      setProgress(0);
      setCurrentTimeMs(0);
      startProgressTimer();
    } catch (error) {
      console.warn('Erro ao iniciar reprodução:', error);
    }
  }, [isSilent, playbackSpeed, durationMs, showSpeedAndStartTimer, startProgressTimer]);

  // Função para parar reprodução
  const stopPlayback = useCallback(async () => {
    if (isSilent) {
      setIsPlaying(false);
      stopProgressTimer();
      return;
    }

    if (soundRef.current) {
      try {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        stopProgressTimer();
      } catch (error) {
        console.warn('Erro ao parar reprodução:', error);
      }
    }
  }, [isSilent, stopProgressTimer]);

  // Expõe métodos via ref para controle externo (auto-play)
  useImperativeHandle(ref, () => ({
    play: startPlayback,
    stop: stopPlayback,
  }), [startPlayback, stopPlayback]);

  // Toggle Play/Pause
  const togglePlayback = useCallback(async () => {
    showSpeedAndStartTimer();

    if (isSilent) {
      if (isPlaying) {
        setIsPlaying(false);
        stopProgressTimer();
      } else {
        hasFinishedRef.current = false;
        setIsPlaying(true);
        const duration = durationMs || 195000;
        const startTime = Date.now();
        const startProgress = progress;
        if (progressTimerRef.current) {
          clearInterval(progressTimerRef.current);
        }
        progressTimerRef.current = setInterval(() => {
          if (hasFinishedRef.current) return;
          const elapsed = (Date.now() - startTime) * playbackSpeed;
          const newProgress = startProgress + (elapsed / duration);
          if (newProgress >= 1) {
            hasFinishedRef.current = true;
            setProgress(0);
            setCurrentTimeMs(0);
            setIsPlaying(false);
            if (progressTimerRef.current) {
              clearInterval(progressTimerRef.current);
              progressTimerRef.current = null;
            }
            // Chama callback de término para auto-play
            if (onFinishedRef.current) {
              setTimeout(() => {
                onFinishedRef.current?.();
              }, 300);
            }
          } else {
            setProgress(newProgress);
            setCurrentTimeMs(newProgress * duration);
          }
        }, 50);
      }
      return;
    }
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
        stopProgressTimer();
      } else {
        hasFinishedRef.current = false;
        await soundRef.current.setRateAsync(playbackSpeed, true);
        await soundRef.current.playAsync();
        setIsPlaying(true);
        startProgressTimer();
      }
    } catch (error) {
      console.warn('Erro ao controlar reprodução:', error);
    }
  }, [isPlaying, isSilent, playbackSpeed, progress, durationMs, startProgressTimer, stopProgressTimer, showSpeedAndStartTimer]);

  // Cicla Velocidade: 1x → 1.5x → 2x → 1x (estilo WhatsApp)
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

    if (soundRef.current && isPlaying) {
      try {
        await soundRef.current.setRateAsync(newSpeed, true);
      } catch (error) {
        console.warn('Erro ao alterar velocidade:', error);
      }
    }
  }, [showSpeedControl, playbackSpeed, isPlaying, startSpeedHideTimer, showSpeedAndStartTimer]);

  // Busca Posição no Áudio
  const seekToPosition = useCallback(async (newProgress: number) => {
    const clampedProgress = Math.max(0, Math.min(1, newProgress));
    setProgress(clampedProgress);
    const newTimeMs = clampedProgress * (durationMs || 195000);
    setCurrentTimeMs(newTimeMs);
    if (soundRef.current && !isSilent) {
      try {
        await soundRef.current.setPositionAsync(newTimeMs);
      } catch (error) {
        console.warn('Erro ao buscar posição:', error);
      }
    }
  }, [durationMs, isSilent]);

  // PanResponder para Arrastar Marcador
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        setIsDragging(true);
        dragStartXRef.current = evt.nativeEvent.locationX;
        dragStartProgressRef.current = progress;
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const deltaX = gestureState.dx;
        const progressDelta = deltaX / waveAreaRef.current;
        const newProgress = dragStartProgressRef.current + progressDelta;
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        setProgress(clampedProgress);
        setCurrentTimeMs(clampedProgress * (durationMs || 195000));
      },
      onPanResponderRelease: async (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setIsDragging(false);
        const deltaX = gestureState.dx;
        const progressDelta = deltaX / waveAreaRef.current;
        const newProgress = dragStartProgressRef.current + progressDelta;
        await seekToPosition(newProgress);
        if (isPlaying && !isSilent) {
          startProgressTimer();
        }
      },
      onPanResponderTerminate: () => {
        setIsDragging(false);
      },
    })
  ).current;

  // Toque na Área de Ondas para Buscar
  const handleWaveAreaPress = useCallback(async (evt: GestureResponderEvent) => {
    const touchX = evt.nativeEvent.locationX;
    const newProgress = touchX / waveAreaRef.current;
    await seekToPosition(newProgress);
  }, [seekToPosition]);

  // Calcula Posição do Marcador
  const markerPosition = progress * (waveAreaRef.current - 9);

  // Determina Texto de Tempo a Exibir
  const displayTime = isPlaying || currentTimeMs > 0
    ? formatTime(currentTimeMs)
    : message.audioDuration || '0:00';

  // Fonte da Imagem do Avatar
  const avatarSource = isUser
    ? require('../../../assets/02-Foto.png')
    : require('../../../assets/01-Foto.png');

  // Formata texto da velocidade para exibição
  const getSpeedText = useCallback((): string => {
    if (playbackSpeed === 1) return '1x';
    if (playbackSpeed === 1.5) return '1,5x';
    return '2x';
  }, [playbackSpeed]);

  // Renderiza Ondas de Áudio
  const renderWaveform = () => {
    if (isSilent) {
      return (
        <View style={stylesMsg.waveRow}>
          <View
            style={[
              stylesMsg.dot,
              { left: Math.max(0, Math.min(markerPosition, waveAreaRef.current - 9)) },
            ]}
          />
          {Array.from({ length: WAVE_HEIGHTS.length }).map((_, i) => {
            const barProgress = i / WAVE_HEIGHTS.length;
            const isPlayed = barProgress <= progress;
            const color = isPlayed
              ? (isUser ? '#FCFCFC' : '#7D8592')
              : (isUser ? 'rgba(252,252,252,0.4)' : 'rgba(125,133,146,0.4)');
            return (
              <View key={i} style={[stylesMsg.bar, { height: 3, backgroundColor: color }]} />
            );
          })}
        </View>
      );
    }
    return (
      <View style={stylesMsg.waveRow}>
        <View
          style={[
            stylesMsg.dot,
            { left: Math.max(0, Math.min(markerPosition, waveAreaRef.current - 9)) },
          ]}
        />
        {WAVE_HEIGHTS.map((height, i) => {
          const barProgress = i / WAVE_HEIGHTS.length;
          const isPlayed = barProgress <= progress;
          const color = isPlayed
            ? (isUser ? '#FCFCFC' : '#7D8592')
            : (isUser ? 'rgba(252,252,252,0.4)' : 'rgba(125,133,146,0.4)');
          return (
            <View key={i} style={[stylesMsg.bar, { height: Math.max(3, height), backgroundColor: color }]} />
          );
        })}
      </View>
    );
  };

  // Renderização do Componente
  // Quando insideCard=true, nao aplica o estilo de fundo (transparente)
  const containerStyle = insideCard
    ? [stylesMsg.cardContainer, stylesMsg.bubbleInsideCard]
    : [stylesMsg.cardContainer, isUser ? stylesMsg.bubbleU : stylesMsg.bubbleC];

  return (
    <View style={containerStyle}>
      <View style={insideCard ? stylesMsg.rowNoAvatar : stylesMsg.row}>
        {/* Coluna esquerda: Avatar ou Container de Velocidade (oculto quando insideCard) */}
        {!insideCard && (
          <View style={stylesMsg.leftCol}>
            {showSpeedControl ? (
              <TouchableOpacity
                onPress={cycleSpeed}
                style={[
                  stylesMsg.speedContainer,
                  isUser ? stylesMsg.speedContainerUser : stylesMsg.speedContainerContact,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    stylesMsg.speedText,
                    isUser ? stylesMsg.speedTextUser : stylesMsg.speedTextContact,
                  ]}
                >
                  {getSpeedText()}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={cycleSpeed} activeOpacity={0.7}>
                <Image source={avatarSource} style={stylesMsg.avatarRect} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Coluna direita: Controles e Ondas */}
        <View style={stylesMsg.rightCol}>
          <View style={stylesMsg.rightTop}>
            {/* Botão Play/Pause */}
            <TouchableOpacity onPress={togglePlayback} activeOpacity={0.7} style={stylesMsg.playButton}>
              {isPlaying ? (
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <Rect x={3} y={2} width={4} height={14} rx={1} fill="#FCFCFC" />
                  <Rect x={11} y={2} width={4} height={14} rx={1} fill="#FCFCFC" />
                </Svg>
              ) : (
                <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                  <Path
                    d="M16.3409 7.86187L2.97916 0.176171C2.77851 0.0607592 2.55091 0 2.31922 0C2.08753 0 1.85993 0.0607592 1.65928 0.176171C1.4588 0.291678 1.29235 0.457692 1.17663 0.657549C1.06091 0.857406 0.999994 1.08407 1 1.3148V16.6859C0.999935 16.8585 1.03401 17.0294 1.10029 17.1889C1.16657 17.3484 1.26374 17.4933 1.38625 17.6153C1.50877 17.7373 1.65423 17.8341 1.81431 17.9001C1.97439 17.9662 2.14597 18.0001 2.31922 18C2.55075 18.0002 2.77822 17.9394 2.97866 17.824L16.3404 10.1385C16.541 10.0232 16.7075 9.85727 16.8233 9.65747C16.9391 9.45768 17 9.23104 17 9.00033C17.0002 8.76961 16.9394 8.54289 16.8237 8.34303C16.708 8.14316 16.5415 7.9772 16.3409 7.86187Z"
                    fill="#FCFCFC"
                  />
                </Svg>
              )}
            </TouchableOpacity>

            {/* Área de ondas com suporte a arraste */}
            <View
              style={stylesMsg.waveContainer}
              onLayout={(e) => { waveAreaRef.current = e.nativeEvent.layout.width; }}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity activeOpacity={1} onPress={handleWaveAreaPress} style={stylesMsg.waveAreaTouchable}>
                {renderWaveform()}
              </TouchableOpacity>
            </View>
          </View>

          {/* Linha inferior: Tempo e Timestamp (timestamp oculto quando insideCard) */}
          <View style={stylesMsg.rightBottom}>
            <Text style={isUser ? stylesMsg.timeTextLight : stylesMsg.timeTextDark}>{displayTime}</Text>
            {!insideCard && (
              <Text style={isUser ? stylesMsg.timeTextLight : stylesMsg.timeTextDark}>{message.timestamp}</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}));

// ============================================================================
// Estilos do MessageAudioPlayer
// ============================================================================
const stylesMsg = StyleSheet.create({
  bubbleU: {
    backgroundColor: '#1777CF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 0,
  },
  bubbleC: {
    backgroundColor: '#F4F4F4',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },
  bubbleInsideCard: {
    backgroundColor: 'transparent',
    borderRadius: 0,
  },
  cardContainer: {
    maxWidth: '85%',
    paddingLeft: 10,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  rowNoAvatar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 0,
  },
  leftCol: {
    paddingBottom: 5,
  },
  avatarRect: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  speedContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedContainerUser: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  speedContainerContact: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  speedText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  speedTextUser: {
    color: '#FCFCFC',
  },
  speedTextContact: {
    color: '#7D8592',
  },
  rightCol: {
    flex: 1,
  },
  rightTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 8,
  },
  playButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveContainer: {
    flex: 1,
    height: 24,
    overflow: 'visible',
  },
  waveAreaTouchable: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    position: 'relative',
    height: 18,
    overflow: 'visible',
  },
  bar: {
    width: 1.5,
    borderRadius: 0.5,
  },
  dot: {
    position: 'absolute',
    top: 4.5,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FCFCFC',
    zIndex: 100,
    elevation: 5,
  },
  rightBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 15,
    marginTop: 5,
    paddingLeft: 35,
  },
  timeTextLight: {
    color: 'rgba(252,252,252,0.9)',
    fontSize: 12,
    fontFamily: 'Inter_300Light',
  },
  timeTextDark: {
    color: '#91929E',
    fontSize: 12,
    fontFamily: 'Inter_300Light',
  },
});

// ============================================================================
// Componente: ChatAudioInput
// Componente de entrada de áudio para gravação de mensagens de voz
// Com captação de áudio em tempo real via WebAudio API
// ============================================================================
// Exporta o componente de entrada/gravação de áudio para o chat
export const ChatAudioInput: React.FC<{
  txt: string;
  setTxt: (v: string) => void;
  onSendText: () => void;
  toggleOptions: () => void;
  inputRef?: React.RefObject<TextInput | null>;
  onSendAudio: (durationSec: number, uri?: string | null) => void;
}> = ({
  txt,
  setTxt,
  onSendText,
  toggleOptions,
  inputRef,
  onSendAudio,
}) => {
  // Estados do Componente de Gravação
  const [audioState, setAudioState] = useState<AudioState>('idle');
  const [recTime, setRecTime] = useState(0);
  const [playProgress, setPlayProgress] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState(0);

  // Hook para captura de níveis de áudio em tempo real (web)
  const isRecording = audioState === 'recording';
  const { levels, amplitude } = useWebMicrophoneLevels(isRecording, LIVE_BAR_COUNT, sessionId);

  // Refs para Controle de Gravação
  const recRef = useRef<NodeJS.Timeout | null>(null);
  const playRef = useRef<NodeJS.Timeout | null>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const recDotAnim = useRef(new Animated.Value(1)).current;

  // Efeito de Inicialização e Limpeza
  useEffect(() => {
    const init = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
        });
      } catch {
        setHasPermission(false);
      }
    };
    init();
    return () => {
      if (recRef.current) clearInterval(recRef.current);
      if (playRef.current) clearInterval(playRef.current);
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  // Animação do Ponto Vermelho
  useEffect(() => {
    if (audioState === 'recording') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recDotAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
          Animated.timing(recDotAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ])
      ).start();
    } else {
      recDotAnim.stopAnimation();
      recDotAnim.setValue(1);
    }
  }, [audioState]);

  // Formata Tempo em mm:ss
  const fmt = useCallback((s: number) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Inicia Gravação
  const startRecording = async () => {
    if (!hasPermission) {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') return;
      } catch {
        return;
      }
    }
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      await recording.startAsync();
      recordingRef.current = recording;
      setAudioState('recording');
      setRecTime(0);
      setPlayProgress(0);
      setSessionId((prev) => prev + 1);
      recRef.current = setInterval(() => setRecTime((p) => p + 1), 1000);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  // Pausa Gravação
  const pauseRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.pauseAsync();
        const uri = recordingRef.current.getURI();
        if (uri) setRecordedUri(uri);
      }
      setAudioState('paused');
      if (recRef.current) {
        clearInterval(recRef.current);
        recRef.current = null;
      }
      setPlayProgress(0);
    } catch {}
  };

  // Retoma Gravação
  const resumeRecording = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      if (recordingRef.current) {
        await recordingRef.current.startAsync();
      }
      setAudioState('recording');
      setPlayProgress(0);
      recRef.current = setInterval(() => setRecTime((p) => p + 1), 1000);
    } catch {}
  };

  // Reprodução Prévia do Áudio Gravado
  const playPreview = async () => {
    try {
      if (audioState === 'playing') {
        if (soundRef.current) {
          soundRef.current.setOnPlaybackStatusUpdate(null);
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        if (playRef.current) {
          clearInterval(playRef.current);
          playRef.current = null;
        }
        setAudioState('paused');
        setPlayProgress(0);
        return;
      }

      let uri = recordedUri;
      if (!uri && recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        uri = recordingRef.current.getURI() || null;
        if (uri) setRecordedUri(uri);
      }
      if (!uri) return;

      if (soundRef.current) {
        soundRef.current.setOnPlaybackStatusUpdate(null);
        await soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }

      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, isLooping: false }
      );
      soundRef.current = sound;

      const durationMs = (status as any)?.durationMillis ?? 0;
      const totalBars = LIVE_BAR_COUNT;

      let hasFinished = false;

      const finishPlayback = async () => {
        if (hasFinished) return;
        hasFinished = true;

        if (playRef.current) {
          clearInterval(playRef.current);
          playRef.current = null;
        }

        if (soundRef.current) {
          soundRef.current.setOnPlaybackStatusUpdate(null);
          await soundRef.current.stopAsync().catch(() => {});
          await soundRef.current.unloadAsync().catch(() => {});
          soundRef.current = null;
        }

        setAudioState('paused');
        setPlayProgress(0);
      };

      sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        if (!playbackStatus.isLoaded) return;
        if (playbackStatus.didJustFinish && !hasFinished) {
          finishPlayback();
        }
      });

      await sound.playAsync();
      setAudioState('playing');
      setPlayProgress(0);

      const stepMs = durationMs > 0 ? Math.max(50, durationMs / totalBars) : 100;

      playRef.current = setInterval(() => {
        if (hasFinished) {
          if (playRef.current) {
            clearInterval(playRef.current);
            playRef.current = null;
          }
          return;
        }
        setPlayProgress((p) => {
          if (p >= totalBars - 1) {
            return p;
          }
          return p + 1;
        });
      }, stepMs);
    } catch (error) {
      console.warn('Erro ao reproduzir prévia:', error);
      setAudioState('paused');
      setPlayProgress(0);
    }
  };

  // Envia Áudio
  const sendAudio = async () => {
    try {
      let uri: string | null = recordedUri;
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch {}
        uri = recordingRef.current.getURI();
      }
      if (recTime > 0) {
        onSendAudio(recTime, uri);
      }
      resetAudioState();
    } catch {
      resetAudioState();
    }
  };

  // Deleta Áudio Gravado
  const deleteAudio = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
      }
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
    } catch {}
    resetAudioState();
  };

  // Reseta Estado do Áudio
  const resetAudioState = () => {
    setAudioState('idle');
    setRecTime(0);
    setPlayProgress(0);
    setRecordedUri(null);
    recordingRef.current = null;
    soundRef.current = null;
    if (recRef.current) {
      clearInterval(recRef.current);
      recRef.current = null;
    }
    if (playRef.current) {
      clearInterval(playRef.current);
      playRef.current = null;
    }
  };

  // Calcula alturas das barras baseado nos níveis de áudio em tempo real
  const getLiveBarHeights = useCallback((): number[] => {
    if (audioState === 'recording' && levels.length > 0) {
      return levels.map((lvl) => {
        const clamped = Math.max(0, Math.min(1, lvl));
        const shaped = Math.pow(clamped, 0.7);
        return Math.round(MIN_BAR_HEIGHT + shaped * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
      });
    }
    if (audioState === 'recording' && amplitude > 0) {
      const factor = 0.35 + Math.max(0, Math.min(1, amplitude)) * 0.65;
      return WAVE_HEIGHTS.map((h) => Math.round(MIN_BAR_HEIGHT + (h / 18) * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT) * factor));
    }
    return WAVE_HEIGHTS.map((h) => Math.max(MIN_BAR_HEIGHT, Math.round(h * 0.55)));
  }, [audioState, levels, amplitude]);

  // Renderiza Ondas de Gravação com captação em tempo real
  const renderRecordingWaveform = () => {
    const showProgressDot = audioState === 'paused' || audioState === 'playing';
    const barHeights = getLiveBarHeights();

    return (
      <View style={stylesInput.recWaveContainer}>
        {showProgressDot && (
          <View
            style={[
              stylesInput.progressDotWrapper,
              { left: Math.min(91, Math.max(0, Math.round((playProgress / LIVE_BAR_COUNT) * 94))) },
            ]}
          >
            <View style={stylesInput.progressDot} />
          </View>
        )}
        {barHeights.map((height, index) => {
          let barColor: string;
          if (audioState === 'recording') {
            barColor = '#7D8592';
          } else if (audioState === 'playing') {
            barColor = index <= playProgress ? '#7D8592' : 'rgba(125,133,146,0.5)';
          } else {
            barColor = 'rgba(125,133,146,0.6)';
          }
          return (
            <View
              key={index}
              style={[
                stylesInput.recWaveBar,
                {
                  height: Math.max(MIN_BAR_HEIGHT, height),
                  backgroundColor: barColor,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Estado: Gravando
  if (audioState === 'recording') {
    return (
      <View style={stylesInput.audioInputContainer}>
        <View style={stylesInput.audioInputBox}>
          <TouchableOpacity style={stylesInput.audioIconBtn} onPress={deleteAudio}>
            <TrashIcon />
          </TouchableOpacity>
          <Animated.View style={{ opacity: recDotAnim }}>
            <RecIcon />
          </Animated.View>
          <Text style={stylesInput.recTimeText}>{fmt(recTime)}</Text>
          {renderRecordingWaveform()}
          <TouchableOpacity style={stylesInput.audioIconBtn} onPress={pauseRecording}>
            <PauseIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={stylesInput.sendBtn} onPress={sendAudio}>
          <SendBtnIcon />
        </TouchableOpacity>
      </View>
    );
  }

  // Estado: Pausado ou Reproduzindo prévia
  if (audioState === 'paused' || audioState === 'playing') {
    return (
      <View style={stylesInput.audioInputContainer}>
        <View style={stylesInput.audioInputBox}>
          <TouchableOpacity style={stylesInput.audioIconBtn} onPress={deleteAudio}>
            <TrashIcon />
          </TouchableOpacity>
          <TouchableOpacity style={stylesInput.audioIconBtn} onPress={playPreview}>
            {audioState === 'playing' ? <PauseIcon /> : <PlayIcon />}
          </TouchableOpacity>
          {renderRecordingWaveform()}
          <Text style={stylesInput.recTimeText}>{fmt(recTime)}</Text>
          <TouchableOpacity style={stylesInput.audioIconBtn} onPress={resumeRecording}>
            <MicSmallIcon />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={stylesInput.sendBtn} onPress={sendAudio}>
          <SendBtnIcon />
        </TouchableOpacity>
      </View>
    );
  }

  // Estado: Idle (campo de texto normal)
  const hasContent = txt.trim().length > 0;
  return (
    <View style={stylesInput.inputRow}>
      <View style={stylesInput.inputBox}>
        <TouchableOpacity style={stylesInput.attachBtn} onPress={toggleOptions}>
          <PlusBtn />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={stylesInput.textInput}
          placeholder="Digite sua mensagem..."
          placeholderTextColor="#91929E"
          value={txt}
          onChangeText={setTxt}
          maxLength={1000}
          returnKeyType="send"
          onSubmitEditing={onSendText}
          multiline={false}
        />
      </View>
      {hasContent ? (
        <TouchableOpacity style={stylesInput.actBtn} onPress={onSendText}>
          <SendBtnIcon />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={stylesInput.actBtn} onPress={startRecording}>
          <MicIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

// ============================================================================
// Estilos do ChatAudioInput
// ============================================================================
const stylesInput = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
  },
  attachBtn: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#3A3F51',
    paddingHorizontal: 8,
    height: 40,
    outlineStyle: 'none' as any,
    borderWidth: 0,
  },
  actBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  audioInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    paddingLeft: 10,
    paddingRight: 15,
    height: 40,
    gap: 15,
  },
  audioIconBtn: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recTimeText: {
    fontSize: 14,
    color: '#3A3F51',
    minWidth: 40,
  },
  recWaveContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 2,
    position: 'relative',
    overflow: 'visible',
  },
  recWaveBar: {
    width: 1.5,
    borderRadius: 0.75,
  },
  progressDotWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
  progressDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#1777CF',
  },
  sendBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
