import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { Platform, Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ========================================
// CONSTANTES DO MINI PLAYER
// ========================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Dimensoes da tela

// Dimensoes do Mini Player (sincronizado com PlayerStyles)
const MINI_PLAYER_WIDTH_SMALL = 200; //..........Largura pequena (tamanho 1)
const MINI_PLAYER_HEIGHT_SMALL = 112; //.........Altura pequena (16:9)
const MINI_PLAYER_MARGIN_RIGHT = 10; //..........Margem direita (sincronizado com limites)
const MINI_PLAYER_MARGIN_BOTTOM = 10; //.........Margem inferior (sincronizado com limites)

// Posicao inicial do Mini Player
const MINI_PLAYER_INITIAL_X = SCREEN_WIDTH - MINI_PLAYER_WIDTH_SMALL - MINI_PLAYER_MARGIN_RIGHT;
const MINI_PLAYER_INITIAL_Y = SCREEN_HEIGHT - MINI_PLAYER_HEIGHT_SMALL - MINI_PLAYER_MARGIN_BOTTOM;

// URLs dos videos locais
const VIDEO_URLS = [
  '/Video01.mp4', //..............Video 1
  '/Video02.mp4', //..............Video 2
  '/Video03.mp4', //..............Video 3
  '/Video04.mp4', //..............Video 4
  '/Video05.mp4', //..............Video 5
];

// Funcao para obter URL do video baseado no indice
const getVideoUrl = (index: number) => VIDEO_URLS[index % VIDEO_URLS.length];

// Chave do AsyncStorage para progresso das aulas
const LESSONS_PROGRESS_STORAGE_KEY = '@Partners:LessonsProgress_v2';

// ========================================
// TIPOS E INTERFACES
// ========================================

// Tipo simplificado para aula
interface SimpleLessonItem {
  id: string; //.......ID da aula
  title: string; //....Titulo da aula
}

// Tipo para representar uma faixa assistida
interface WatchedRange {
  start: number; //....Inicio da faixa (em ms)
  end: number; //......Fim da faixa (em ms)
}

// Tipo para armazenar progresso real de uma aula
interface LessonProgress {
  lessonId: string; //............ID da aula
  watchedRanges: WatchedRange[]; //.....Faixas assistidas
  totalWatched: number; //..........Soma total assistida (em ms)
  realProgress: number; //..........Progresso real em porcentagem (0-100)
}

// Valor do contexto do Mini Player
interface MiniPlayerContextValue {
  // Estado de ativacao
  isActive: boolean; //...................Se o mini player esta ativo
  isMinimized: boolean; //................Se esta minimizado (mini player visivel)
  isPlayerScreenActive: boolean; //.......Se a tela TrainingPlayerScreen esta montada

  // Coordenadas da area de video expandido (informado pelo PlayerScreen)
  expandedVideoLayout: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
  setExpandedVideoLayout: (layout: { top: number; left: number; width: number; height: number }) => void;
  setPlayerScreenActive: (active: boolean) => void; //..Informa se TrainingPlayerScreen esta ativo

  // Dados do treinamento
  trainingId: string | null; //...........ID do treinamento atual
  contents: SimpleLessonItem[]; //.......Lista de aulas (simplificada)
  currentLessonIndex: number; //..........Indice da aula atual

  // Estado do video
  isPlaying: boolean; //..................Se esta tocando
  videoProgress: number; //...............Progresso em porcentagem (0-100)
  videoDuration: number; //...............Duracao total em ms
  videoPosition: number; //...............Posicao atual em ms
  isLoading: boolean; //.................Se esta carregando

  // Estado de exibicao
  autoPlay: boolean; //...................Autoplay ativado
  playbackRate: number; //................Velocidade de reproducao
  repeatEnabled: boolean; //..............Modo repeticao
  captionsEnabled: boolean; //............Legendas ativadas
  miniPlayerSize: 1 | 2 | 3; //...........Tamanho do mini player
  showMiniControls: boolean; //...........Visibilidade dos controles

  // Posicao animada
  panPosition: Animated.ValueXY; //.......Posicao do mini player

  // Refs do video (apenas uma ref - video unico)
  videoRef: React.MutableRefObject<any>; //..Ref do video principal (unico)

  // Funcoes de controle
  activate: (trainingId: string, lessonIndex: number, lessonsList: SimpleLessonItem[]) => void;
  deactivate: () => void; //...................................Desativa o player
  minimize: () => void; //.....................................Minimiza o player
  expand: () => void; //.......................................Expande o player
  closeMiniPlayer: () => void; //..............................Fecha o mini player

  // Controles de reproducao
  playPause: () => void; //....................................Alterna play/pause
  seekTo: (percentage: number) => void; //.....................Seek para posicao
  nextLesson: () => void; //...................................Proxima aula
  previousLesson: () => void; //...............................Aula anterior
  selectLesson: (index: number) => void; //....................Seleciona aula

  // Configuracoes
  toggleAutoPlay: () => void; //..............................Alterna autoplay
  setPlaybackRateValue: (rate: number) => void; //.............Define velocidade
  toggleRepeat: () => void; //.................................Alterna repeticao
  toggleCaptions: () => void; //...............................Alterna legendas
  cycleMiniPlayerSize: () => void; //..........................Cicla tamanho
  setMiniPlayerSizeValue: (size: 1 | 2 | 3) => void; //........Define tamanho especifico
  setShowMiniControls: (show: boolean) => void; //.............Define visibilidade controles

  // Atualizacao de estado do video (usado pelo player)
  updateVideoState: (state: {
    isPlaying?: boolean;
    progress?: number;
    duration?: number;
    position?: number;
    isLoading?: boolean;
  }) => void;

  // Sistema de progresso real
  lessonsProgress: Map<string, LessonProgress>; //........Progresso de todas as aulas
  getCurrentLessonProgress: () => LessonProgress | null; //.......Progresso da aula atual
  updateWatchedRange: (start: number, end: number) => void; //....Atualiza faixa assistida
  getRealProgress: (lessonId: string) => number; //...............Obtem progresso real de uma aula

  // Utilitarios
  getVideoUrl: (index: number) => string; //.........Obtem URL do video
  formatVideoTime: (ms: number) => string; //........Formata tempo
}

// ========================================
// CONTEXTO
// ========================================

const MiniPlayerContext = createContext<MiniPlayerContextValue | null>(null);

// ========================================
// PROVIDER
// ========================================

interface MiniPlayerProviderProps {
  children: React.ReactNode; //..Componentes filhos
}

export const MiniPlayerProvider: React.FC<MiniPlayerProviderProps> = ({ children }) => {
  // Estado de ativacao
  const [isActive, setIsActive] = useState(false); //..........Se o player esta ativo
  const [isMinimized, setIsMinimized] = useState(false); //....Se esta minimizado
  const [isPlayerScreenActive, setIsPlayerScreenActive] = useState(false); //..Se TrainingPlayerScreen esta montado

  // Coordenadas da area de video expandido (informado pelo PlayerScreen)
  const [expandedVideoLayout, setExpandedVideoLayout] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Dados do treinamento
  const [trainingId, setTrainingId] = useState<string | null>(null); //..ID do treinamento
  const [contents, setContents] = useState<SimpleLessonItem[]>([]); //..Lista de aulas
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0); //.....Indice atual

  // Estado do video
  const [isPlaying, setIsPlaying] = useState(false); //........Se esta tocando
  const [videoProgress, setVideoProgress] = useState(0); //....Progresso (0-100)
  const [videoDuration, setVideoDuration] = useState(0); //....Duracao em ms
  const [videoPosition, setVideoPosition] = useState(0); //....Posicao em ms
  const [isLoading, setIsLoading] = useState(true); //.........Se esta carregando

  // Estado de exibicao
  const [autoPlay, setAutoPlay] = useState(true); //...........Autoplay ativado
  const [playbackRate, setPlaybackRate] = useState(1.0); //....Velocidade
  const [repeatEnabled, setRepeatEnabled] = useState(false); //..Repeticao
  const [captionsEnabled, setCaptionsEnabled] = useState(true); //..Legendas
  const [miniPlayerSize, setMiniPlayerSize] = useState<1 | 2 | 3>(1); //..Tamanho
  const [showMiniControls, setShowMiniControls] = useState(true); //......Controles

  // Sistema de progresso real
  const [lessonsProgress, setLessonsProgress] = useState<Map<string, LessonProgress>>(new Map()); //.....Progresso de todas as aulas

  // Posicao animada do mini player
  const panPosition = useRef(new Animated.ValueXY({
    x: MINI_PLAYER_INITIAL_X,
    y: MINI_PLAYER_INITIAL_Y,
  })).current;

  // Refs do video (apenas uma ref agora - video unico)
  const videoRef = useRef<any>(null); //.......Video principal (unico)

  // Refs para valores sincronos (usados em callbacks)
  const isPlayingRef = useRef(isPlaying);
  const videoDurationRef = useRef(videoDuration);
  const currentLessonIndexRef = useRef(currentLessonIndex);
  const contentsRef = useRef(contents);
  const autoPlayRef = useRef(autoPlay);

  // Sincroniza refs com estados
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { videoDurationRef.current = videoDuration; }, [videoDuration]);
  useEffect(() => { currentLessonIndexRef.current = currentLessonIndex; }, [currentLessonIndex]);
  useEffect(() => { contentsRef.current = contents; }, [contents]);
  useEffect(() => { autoPlayRef.current = autoPlay; }, [autoPlay]);

  // Logs de mudancas de estado criticas
  useEffect(() => {
    console.log('[CONTEXT_STATE] ==================== isActive MUDOU ====================');
    console.log('[CONTEXT_STATE] isActive:', isActive);
    console.log('[CONTEXT_STATE] isMinimized:', isMinimized);
    console.log('[CONTEXT_STATE] trainingId:', trainingId);
    console.log('[CONTEXT_STATE] ================================================================');
  }, [isActive]);

  useEffect(() => {
    console.log('[CONTEXT_STATE] ==================== isMinimized MUDOU ====================');
    console.log('[CONTEXT_STATE] isActive:', isActive);
    console.log('[CONTEXT_STATE] isMinimized:', isMinimized);
    console.log('[CONTEXT_STATE] expandedVideoLayout:', expandedVideoLayout);
    console.log('[CONTEXT_STATE] ================================================================');
  }, [isMinimized]);

  useEffect(() => {
    console.log('[CONTEXT_STATE] ==================== expandedVideoLayout MUDOU ====================');
    console.log('[CONTEXT_STATE] expandedVideoLayout:', expandedVideoLayout);
    console.log('[CONTEXT_STATE] isActive:', isActive);
    console.log('[CONTEXT_STATE] isMinimized:', isMinimized);
    console.log('[CONTEXT_STATE] ================================================================');
  }, [expandedVideoLayout]);

  useEffect(() => {
    console.log('[CONTEXT_STATE] ==================== isPlaying MUDOU (CONTEXT) ====================');
    console.log('[CONTEXT_STATE] isPlaying:', isPlaying);
    console.log('[CONTEXT_STATE] videoRef.current exists:', !!videoRef.current);
    console.log('[CONTEXT_STATE] ================================================================');
  }, [isPlaying]);

  // Carrega progresso do storage quando o provider monta
  useEffect(() => {
    const loadProgress = async () => {
      const loadedProgress = await loadProgressFromStorage();
      setLessonsProgress(loadedProgress);
    };

    loadProgress();
  }, [loadProgressFromStorage]);

  // Salva progresso no storage sempre que mudar
  useEffect(() => {
    // Evita salvar no primeiro render (quando esta carregando)
    if (lessonsProgress.size > 0) {
      saveProgressToStorage(lessonsProgress);
    }
  }, [lessonsProgress, saveProgressToStorage]);

  // ========================================
  // FUNCOES AUXILIARES DE PROGRESSO REAL
  // ========================================

  // Mescla faixas sobrepostas ou adjacentes
  const mergeWatchedRanges = useCallback((ranges: WatchedRange[]): WatchedRange[] => {
    if (ranges.length === 0) return [];

    // Ordena por inicio
    const sorted = [...ranges].sort((a, b) => a.start - b.start);

    const merged: WatchedRange[] = [];
    let current = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      const next = sorted[i];

      // Se a proxima faixa sobrepoe ou e adjacente a atual, mescla
      if (next.start <= current.end) {
        current = {
          start: current.start,
          end: Math.max(current.end, next.end),
        };
      } else {
        // Caso contrario, adiciona a atual e move para a proxima
        merged.push(current);
        current = next;
      }
    }

    // Adiciona a ultima faixa
    merged.push(current);

    return merged;
  }, []);

  // Calcula o total assistido somando todas as faixas
  const calculateTotalWatched = useCallback((ranges: WatchedRange[]): number => {
    return ranges.reduce((total, range) => {
      return total + (range.end - range.start);
    }, 0);
  }, []);

  // Calcula o progresso real em porcentagem
  const calculateRealProgress = useCallback((totalWatched: number, duration: number): number => {
    if (duration <= 0) return 0;
    return Math.min(100, (totalWatched / duration) * 100);
  }, []);

  // ========================================
  // FUNCOES DE PERSISTENCIA
  // ========================================

  // Salva o progresso no AsyncStorage
  const saveProgressToStorage = useCallback(async (progressMap: Map<string, LessonProgress>) => {
    try {
      // Converte Map para objeto serializavel
      const progressObject: Record<string, LessonProgress> = {};
      progressMap.forEach((value, key) => {
        progressObject[key] = value;
      });

      const jsonValue = JSON.stringify(progressObject);
      await AsyncStorage.setItem(LESSONS_PROGRESS_STORAGE_KEY, jsonValue);

      console.log('[PROGRESS_STORAGE] Progresso salvo com sucesso:', Object.keys(progressObject).length, 'aulas');
    } catch (error) {
      console.error('[PROGRESS_STORAGE] Erro ao salvar progresso:', error);
    }
  }, []);

  // Carrega o progresso do AsyncStorage
  const loadProgressFromStorage = useCallback(async (): Promise<Map<string, LessonProgress>> => {
    try {
      const jsonValue = await AsyncStorage.getItem(LESSONS_PROGRESS_STORAGE_KEY);

      if (jsonValue !== null) {
        const progressObject: Record<string, LessonProgress> = JSON.parse(jsonValue);
        const progressMap = new Map<string, LessonProgress>();

        // Converte objeto de volta para Map
        Object.entries(progressObject).forEach(([key, value]) => {
          progressMap.set(key, value);
        });

        console.log('[PROGRESS_STORAGE] Progresso carregado com sucesso:', progressMap.size, 'aulas');
        return progressMap;
      }

      console.log('[PROGRESS_STORAGE] Nenhum progresso salvo encontrado');
      return new Map();
    } catch (error) {
      console.error('[PROGRESS_STORAGE] Erro ao carregar progresso:', error);
      return new Map();
    }
  }, []);

  // ========================================
  // FUNCOES DE ATIVACAO
  // ========================================

  // Ativa o player com um treinamento
  const activate = useCallback((
    newTrainingId: string,
    lessonIndex: number,
    lessonsList: SimpleLessonItem[]
  ) => {
    console.log('[CONTEXT_ACTIVATE] ==================== ACTIVATE CHAMADO ====================');
    console.log('[CONTEXT_ACTIVATE] newTrainingId:', newTrainingId);
    console.log('[CONTEXT_ACTIVATE] lessonIndex:', lessonIndex);
    console.log('[CONTEXT_ACTIVATE] lessonsList length:', lessonsList.length);

    // Define dados do treinamento
    setTrainingId(newTrainingId);
    setContents(lessonsList);
    setCurrentLessonIndex(lessonIndex);

    // Ativa o player
    setIsActive(true);

    console.log('[CONTEXT_ACTIVATE] ✅ activate() concluido - setIsActive(true) chamado');
    console.log('[CONTEXT_ACTIVATE] ================================================================');
  }, []);

  // Desativa o player completamente
  const deactivate = useCallback(() => {
    // Pausa o video
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.pause?.();
      } else {
        videoRef.current.pauseAsync?.();
      }
    }

    // Reseta todos os estados
    setIsActive(false);
    setIsMinimized(false);
    setTrainingId(null);
    setContents([]);
    setCurrentLessonIndex(0);
    setVideoProgress(0);
    setVideoPosition(0);
    setIsPlaying(false);
    setIsLoading(true);
    // NAO reseta o tamanho para preservar preferencia do usuario

    // Reseta posicao do mini player
    panPosition.setValue({
      x: MINI_PLAYER_INITIAL_X,
      y: MINI_PLAYER_INITIAL_Y,
    });
  }, [panPosition]);

  // Minimiza o player (ativa o mini player flutuante)
  const minimize = useCallback(() => {
    console.log('[CONTEXT_MINIMIZE] ==================== MINIMIZE CHAMADO ====================');
    console.log('[CONTEXT_MINIMIZE] Estado ANTES: isMinimized =', isMinimized);
    setIsMinimized(true);
    console.log('[CONTEXT_MINIMIZE] ✅ setIsMinimized(true) chamado');
    console.log('[CONTEXT_MINIMIZE] ================================================================');
    // Video sempre no GlobalMiniPlayer - apenas muda estilo CSS
  }, [isMinimized]);

  // Expande o player (volta ao modo normal)
  // Nao reseta o tamanho do mini player para preservar preferencia do usuario
  const expand = useCallback(() => {
    console.log('[CONTEXT_EXPAND] ==================== EXPAND CHAMADO ====================');
    console.log('[CONTEXT_EXPAND] Estado ANTES: isMinimized =', isMinimized);
    setIsMinimized(false);
    console.log('[CONTEXT_EXPAND] ✅ setIsMinimized(false) chamado');
    console.log('[CONTEXT_EXPAND] ================================================================');
    // Video sempre no GlobalMiniPlayer - apenas muda estilo CSS
  }, [isMinimized]);

  // Fecha o mini player (volta ao estado normal sem sair da tela)
  // Nao reseta o tamanho do mini player para preservar preferencia do usuario
  const closeMiniPlayer = useCallback(() => {
    setIsMinimized(false);
  }, []);

  // ========================================
  // CONTROLES DE REPRODUCAO
  // ========================================

  // Alterna play/pause (controla o video unico diretamente)
  const playPause = useCallback(() => {
    console.log('[CONTEXT_PLAYPAUSE] ==================== CHAMADO ====================');
    console.log('[CONTEXT_PLAYPAUSE] Estado ANTES:', {
      isActive,
      isMinimized,
      isPlaying: isPlayingRef.current,
    });

    if (!videoRef.current) {
      console.log('[CONTEXT_PLAYPAUSE] ❌ videoRef.current is null!');
      return;
    }

    if (Platform.OS === 'web') {
      const video = videoRef.current;
      console.log('[CONTEXT_PLAYPAUSE] Video web state:', {
        'video.paused': video.paused,
        'video.currentTime': video.currentTime,
        'video.readyState': video.readyState,
        'contextIsPlaying': isPlayingRef.current,
      });

      if (video.paused) {
        console.log('[CONTEXT_PLAYPAUSE] ▶️ Video is paused, calling play()');
        video.play().catch((err) => {
          console.error('[CONTEXT_PLAYPAUSE] ❌ Error calling play():', err);
        });
        setIsPlaying(true);
        console.log('[CONTEXT_PLAYPAUSE] ✅ setIsPlaying(true) chamado');
      } else {
        console.log('[CONTEXT_PLAYPAUSE] ⏸️ Video is playing, calling pause()');
        video.pause();
        setIsPlaying(false);
        console.log('[CONTEXT_PLAYPAUSE] ✅ setIsPlaying(false) chamado');
      }
    } else {
      if (isPlayingRef.current) {
        videoRef.current.pauseAsync?.();
        setIsPlaying(false);
      } else {
        videoRef.current.playAsync?.();
        setIsPlaying(true);
      }
    }

    console.log('[CONTEXT_PLAYPAUSE] Estado DEPOIS:', {
      isActive,
      isMinimized,
    });
    console.log('[CONTEXT_PLAYPAUSE] ⚠️ IMPORTANTE: isActive e isMinimized NÃO devem mudar!');
    console.log('[CONTEXT_PLAYPAUSE] ================================================================');
  }, [isActive, isMinimized]);

  // Seek para posicao em porcentagem
  const seekTo = useCallback(async (percentage: number) => {
    if (!videoRef.current) return;

    const duration = videoDurationRef.current;
    if (duration <= 0) return;

    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    const newPosition = (clampedPercentage / 100) * duration;

    if (Platform.OS === 'web') {
      videoRef.current.currentTime = newPosition / 1000;
    } else {
      await videoRef.current.setPositionAsync?.(newPosition);
    }

    setVideoPosition(newPosition);
    setVideoProgress(clampedPercentage);
  }, []);

  // Proxima aula
  const nextLesson = useCallback(() => {
    const currentContents = contentsRef.current;
    const currentIndex = currentLessonIndexRef.current;

    if (currentIndex < currentContents.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
      setVideoProgress(0);
      setVideoPosition(0);
      setIsLoading(true);
    }
  }, []);

  // Aula anterior
  const previousLesson = useCallback(() => {
    const currentIndex = currentLessonIndexRef.current;

    if (currentIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
      setVideoProgress(0);
      setVideoPosition(0);
      setIsLoading(true);
    }
  }, []);

  // Seleciona aula especifica
  const selectLesson = useCallback((index: number) => {
    setCurrentLessonIndex(index);
    setVideoProgress(0);
    setVideoPosition(0);
    setIsLoading(true);
  }, []);

  // ========================================
  // CONFIGURACOES
  // ========================================

  // Alterna autoplay
  const toggleAutoPlay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  // Define velocidade de reproducao
  const setPlaybackRateValue = useCallback((rate: number) => {
    setPlaybackRate(rate);

    // Aplica ao video
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.playbackRate = rate;
      } else {
        videoRef.current.setRateAsync?.(rate, true);
      }
    }
  }, []);

  // Alterna repeticao
  const toggleRepeat = useCallback(() => {
    setRepeatEnabled(prev => !prev);
  }, []);

  // Alterna legendas
  const toggleCaptions = useCallback(() => {
    setCaptionsEnabled(prev => !prev);
  }, []);

  // Cicla tamanho do mini player (1 -> 2 -> 3 -> 1)
  const cycleMiniPlayerSize = useCallback(() => {
    setMiniPlayerSize(prev => {
      const nextSize = prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3);
      return nextSize;
    });
  }, []);

  // Define tamanho especifico do mini player
  const setMiniPlayerSizeValue = useCallback((size: 1 | 2 | 3) => {
    setMiniPlayerSize(size);
  }, []);

  // ========================================
  // ATUALIZACAO DE ESTADO DO VIDEO
  // ========================================

  // Atualiza estado do video (chamado pelo componente de video)
  const updateVideoState = useCallback((state: {
    isPlaying?: boolean;
    progress?: number;
    duration?: number;
    position?: number;
    isLoading?: boolean;
  }) => {
    if (state.isPlaying !== undefined) setIsPlaying(state.isPlaying);
    if (state.progress !== undefined) setVideoProgress(state.progress);
    if (state.duration !== undefined) setVideoDuration(state.duration);
    if (state.position !== undefined) setVideoPosition(state.position);
    if (state.isLoading !== undefined) setIsLoading(state.isLoading);
  }, []);

  // ========================================
  // FUNCOES PUBLICAS DE PROGRESSO REAL
  // ========================================

  // Obtem o progresso da aula atual
  const getCurrentLessonProgress = useCallback((): LessonProgress | null => {
    if (contents.length === 0 || currentLessonIndex < 0) return null;

    const currentLesson = contents[currentLessonIndex];
    if (!currentLesson) return null;

    return lessonsProgress.get(currentLesson.id) || null;
  }, [contents, currentLessonIndex, lessonsProgress]);

  // Atualiza uma faixa assistida da aula atual
  const updateWatchedRange = useCallback((start: number, end: number) => {
    if (contents.length === 0 || currentLessonIndex < 0) return;

    const currentLesson = contents[currentLessonIndex];
    if (!currentLesson) return;

    const duration = videoDurationRef.current;
    if (duration <= 0) return;

    setLessonsProgress(prev => {
      const newMap = new Map(prev);

      // Obtem progresso atual da aula ou cria novo
      const existing = newMap.get(currentLesson.id);
      const currentRanges = existing?.watchedRanges || [];

      // Adiciona a nova faixa
      const updatedRanges = [...currentRanges, { start, end }];

      // Mescla faixas sobrepostas
      const mergedRanges = mergeWatchedRanges(updatedRanges);

      // Calcula totais
      const totalWatched = calculateTotalWatched(mergedRanges);
      const realProgress = calculateRealProgress(totalWatched, duration);

      // Atualiza o mapa
      newMap.set(currentLesson.id, {
        lessonId: currentLesson.id,
        watchedRanges: mergedRanges,
        totalWatched,
        realProgress,
      });

      return newMap;
    });
  }, [contents, currentLessonIndex, mergeWatchedRanges, calculateTotalWatched, calculateRealProgress]);

  // Obtem o progresso real de uma aula especifica
  const getRealProgress = useCallback((lessonId: string): number => {
    const progress = lessonsProgress.get(lessonId);
    return progress?.realProgress || 0;
  }, [lessonsProgress]);

  // ========================================
  // UTILITARIOS
  // ========================================

  // Formata tempo do video em mm:ss
  const formatVideoTime = useCallback((milliseconds: number) => {
    if (!milliseconds || isNaN(milliseconds) || !isFinite(milliseconds)) {
      return '0:00';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  }, []);

  // ========================================
  // VALOR DO CONTEXTO
  // ========================================

  const value: MiniPlayerContextValue = {
    // Estado de ativacao
    isActive,
    isMinimized,
    isPlayerScreenActive,

    // Coordenadas da area de video expandido (informado pelo PlayerScreen)
    expandedVideoLayout,
    setExpandedVideoLayout,
    setPlayerScreenActive: setIsPlayerScreenActive,

    // Dados do treinamento
    trainingId,
    contents,
    currentLessonIndex,

    // Estado do video
    isPlaying,
    videoProgress,
    videoDuration,
    videoPosition,
    isLoading,

    // Estado de exibicao
    autoPlay,
    playbackRate,
    repeatEnabled,
    captionsEnabled,
    miniPlayerSize,
    showMiniControls,

    // Posicao animada
    panPosition,

    // Refs do video (apenas uma ref agora)
    videoRef,

    // Funcoes de controle
    activate,
    deactivate,
    minimize,
    expand,
    closeMiniPlayer,

    // Controles de reproducao
    playPause,
    seekTo,
    nextLesson,
    previousLesson,
    selectLesson,

    // Configuracoes
    toggleAutoPlay,
    setPlaybackRateValue,
    toggleRepeat,
    toggleCaptions,
    cycleMiniPlayerSize,
    setMiniPlayerSizeValue,
    setShowMiniControls,

    // Atualizacao de estado
    updateVideoState,

    // Sistema de progresso real
    lessonsProgress,
    getCurrentLessonProgress,
    updateWatchedRange,
    getRealProgress,

    // Utilitarios
    getVideoUrl,
    formatVideoTime,
  };

  return (
    <MiniPlayerContext.Provider value={value}>
      {children}
    </MiniPlayerContext.Provider>
  );
};

// ========================================
// HOOK DE USO
// ========================================

export const useMiniPlayer = () => {
  const context = useContext(MiniPlayerContext);
  if (!context) {
    throw new Error('useMiniPlayer deve ser usado dentro de MiniPlayerProvider');
  }
  return context;
};

export default MiniPlayerContext;
