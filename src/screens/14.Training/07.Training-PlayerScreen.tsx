import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Animated,
  PanResponder,
  useWindowDimensions,
  Image,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  COLORS,
  TrainingContentItem,
  getContentTypeIcon,
  formatDuration,
  MOCK_TRAININGS,
} from './02.Training-Types';
import { RootStackParamList } from '../../types/navigation';

// Importa icones do arquivo separado
import {
  PlayIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  CheckCircleIcon,
  CloseIcon,
  ChevronDownIcon,
  BackArrowIcon,
  AutoplayIcon,
  SettingsIcon,
  FullscreenIcon,
  ExpandIcon,
} from './07.Training-PlayerIcons';

// Importa estilos do arquivo separado
import {
  styles,
  VIDEO_HEIGHT,
  MINI_PLAYER_WIDTH_SMALL,
  MINI_PLAYER_HEIGHT_SMALL,
  MINI_PLAYER_WIDTH_MEDIUM,
  MINI_PLAYER_HEIGHT_MEDIUM,
  // Estado Normal
  NORMAL_TIME_BADGE_BOTTOM,
  NORMAL_TIME_BADGE_LEFT,
  NORMAL_FULLSCREEN_BTN_BOTTOM,
  NORMAL_FULLSCREEN_BTN_RIGHT,
  // Estado Fullscreen
  FULLSCREEN_TIME_BADGE_BOTTOM,
  FULLSCREEN_TIME_BADGE_LEFT,
  FULLSCREEN_BTN_BOTTOM,
  FULLSCREEN_BTN_RIGHT,
  // Estado Landscape
  LANDSCAPE_TIME_BADGE_BOTTOM,
  LANDSCAPE_TIME_BADGE_LEFT,
  LANDSCAPE_FULLSCREEN_BTN_BOTTOM,
  LANDSCAPE_FULLSCREEN_BTN_RIGHT,
  // Barra de Progresso (Modo Expandido)
  PROGRESS_BAR_EXPANDED_BOTTOM,
  PROGRESS_BAR_EXPANDED_LEFT,
  PROGRESS_BAR_EXPANDED_RIGHT,
} from './07.Training-PlayerStyles';

// Importa modal de configuracoes do player
import VideoSettingsModal from './08.Training-VideoSettingsModal';

// Importa modal de detalhes da aula
import LessonDetailsModal from './09.Training-LessonDetailsModal';

// Importa contexto do Mini Player global
import { useMiniPlayer } from '../../context/MiniPlayerContext';

// Importa Video apenas para mobile
let Video: any = null;
let ResizeMode: any = null;
if (Platform.OS !== 'web') {
  const ExpoAV = require('expo-av');
  Video = ExpoAV.Video;
  ResizeMode = ExpoAV.ResizeMode;
}

// ========================================
// CONSTANTES DO PLAYER
// ========================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Dimensoes da tela

// URLs dos videos locais da pasta public/
const VIDEO_URLS = [
  '/Video01.mp4', //..............Video 1
  '/Video02.mp4', //..............Video 2
  '/Video03.mp4', //..............Video 3
  '/Video04.mp4', //..............Video 4
  '/Video05.mp4', //..............Video 5
];

// Funcao para obter URL do video baseado no indice
const getVideoUrl = (index: number) => VIDEO_URLS[index % VIDEO_URLS.length];

// Imagens de capa das aulas (exibidas quando mini player esta ativo)
const LESSON_COVERS = [
  require('../../../assets/Aula01.jpg'), //..Capa Aula 1
  require('../../../assets/Aula02.jpg'), //..Capa Aula 2
  require('../../../assets/Aula03.jpg'), //..Capa Aula 3
  require('../../../assets/Aula04.jpg'), //..Capa Aula 4
];

// Funcao para obter capa da aula baseado no indice
const getLessonCover = (index: number) => LESSON_COVERS[index % LESSON_COVERS.length];

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type PlayerNavigationProp = StackNavigationProp<RootStackParamList>;
type PlayerRouteProp = RouteProp<RootStackParamList, 'TrainingPlayer'>;

// ========================================
// COMPONENTE LESSON CARD ITEM (padrao do sistema)
// ========================================

interface LessonCardItemProps {
  item: TrainingContentItem; //...Dados da aula
  index: number; //...............Indice da aula
  isActive: boolean; //...........Se esta ativa (borda azul)
  onPress: () => void; //.........Callback ao clicar no card (seleciona aula)
  onDetailsPress: () => void; //..Callback ao clicar no numero (abre detalhes)
}

const LessonCardItem: React.FC<LessonCardItemProps> = ({
  item,
  index,
  isActive,
  onPress,
  onDetailsPress,
}) => {
  // Contexto do mini player para obter progresso real
  const { getRealProgress } = useMiniPlayer();

  // Formata numero da aula com 2 digitos
  const lessonNumber = String(index + 1).padStart(2, '0');

  // Obtem o progresso real da aula
  const realProgress = getRealProgress(item.id);

  // Determina cor do indicador de status baseado no progresso real
  const getStatusColor = () => {
    if (realProgress >= 100) {
      return COLORS.success; //.........Verde quando completo
    } else if (realProgress > 0) {
      return COLORS.primary; //.........Azul quando em progresso
    }
    return COLORS.textSecondary; //.....Cinza quando nao iniciado
  };

  // Retorna porcentagem da aula baseado no progresso real
  const getLessonProgress = () => {
    return `${Math.floor(realProgress)}%`;
  };

  return (
    <TouchableOpacity
      style={[styles.lessonCard, isActive && styles.lessonCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Container do Numero da Aula - Clicavel para abrir detalhes */}
      <TouchableOpacity
        style={styles.lessonNumberContainer}
        onPress={onDetailsPress}
        activeOpacity={0.7}
      >
        <Text style={styles.lessonNumberText}>
          {lessonNumber}
        </Text>
      </TouchableOpacity>

      {/* Container de Informacoes */}
      <View style={styles.lessonInfoContainer}>
        {/* Titulo da Aula */}
        <Text style={styles.lessonTitle} numberOfLines={1}>
          {item.title}
        </Text>

        {/* Divisoria */}
        <View style={styles.lessonDivider} />

        {/* Linha de Execucao */}
        <View style={styles.lessonExecutionRow}>
          {/* Icone e Duracao */}
          <View style={styles.lessonDurationContainer}>
            {/* Icone do Tipo */}
            {getContentTypeIcon(item.type, COLORS.textSecondary)}

            {/* Duracao */}
            {item.duration && (
              <Text style={styles.lessonDuration}>
                {formatDuration(item.duration)}
              </Text>
            )}
          </View>

          {/* Porcentagem */}
          <Text style={[styles.lessonProgress, { color: getStatusColor() }]}>
            {getLessonProgress()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ========================================
// COMPONENTE PLAYER SCREEN
// ========================================

const TrainingPlayerScreen: React.FC = () => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Navegacao
  const navigation = useNavigation<PlayerNavigationProp>();
  const route = useRoute<PlayerRouteProp>();

  // Contexto do Mini Player global
  const miniPlayerContext = useMiniPlayer();

  // Dimensoes da tela (reativo a mudancas de orientacao)
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight; //..............Detecta orientacao landscape

  // Obtem parametros da rota
  const { trainingId, lessonIndex: initialLessonIndex } = route.params;

  // Busca treinamento pelo ID
  const training = useMemo(() => {
    return MOCK_TRAININGS.find(t => t.id === trainingId);
  }, [trainingId]);

  // Estado das aulas
  const [contents, setContents] = useState<TrainingContentItem[]>(
    training?.contents || []
  );

  // Referencia do video principal (usa a ref do contexto para compartilhar com GlobalMiniPlayer)
  const videoRef = miniPlayerContext.videoRef;

  // Ref para container de video (para capturar layout e informar ao contexto)
  const videoContainerRef = useRef<View>(null);

  // Estado do player
  const [currentLessonIndex, setCurrentLessonIndex] = useState(initialLessonIndex || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPosition, setVideoPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);

  // Estado do Mini Player (PiP)
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true); //...............Autoplay ativado por padrao
  const shouldAutoStartRef = useRef(true); //......................Ref para auto-iniciar video apos troca de aula
  const [isFullscreen, setIsFullscreen] = useState(false); //.....Modo tela cheia
  const [showMiniControls, setShowMiniControls] = useState(true); //.......Visibilidade dos controles do mini player

  // Usa posicao do contexto global (sincronizado com GlobalMiniPlayer)
  const panPosition = miniPlayerContext.panPosition;

  // Estado do Modal de Configuracoes
  const [showSettingsModal, setShowSettingsModal] = useState(false); //....Visibilidade do modal
  const [playbackRate, setPlaybackRate] = useState(1.0); //................Velocidade de reproducao
  const [captionsEnabled, setCaptionsEnabled] = useState(true); //.........Legendas ativadas
  const [repeatEnabled, setRepeatEnabled] = useState(false); //............Modo repeticao

  // Estado do Modal de Detalhes da Aula
  const [showLessonDetailsModal, setShowLessonDetailsModal] = useState(false); //..Visibilidade do modal
  const [selectedLessonForDetails, setSelectedLessonForDetails] = useState<number>(0); //..Indice da aula selecionada

  // Calcula dimensoes do mini player baseado no tamanho do contexto global
  const getMiniPlayerDimensions = useCallback(() => {
    switch (miniPlayerContext.miniPlayerSize) {
      case 1: //..Tamanho pequeno (padrao)
        return { width: MINI_PLAYER_WIDTH_SMALL, height: MINI_PLAYER_HEIGHT_SMALL };
      case 2: //..Tamanho medio
        return { width: MINI_PLAYER_WIDTH_MEDIUM, height: MINI_PLAYER_HEIGHT_MEDIUM };
      case 3: //..Tamanho grande (largura maxima com margem de 10px)
        const largeWidth = SCREEN_WIDTH - 20; //..10px de cada lado
        const largeHeight = (largeWidth * 9) / 16;
        return { width: largeWidth, height: largeHeight };
      default:
        return { width: MINI_PLAYER_WIDTH_SMALL, height: MINI_PLAYER_HEIGHT_SMALL };
    }
  }, [miniPlayerContext.miniPlayerSize]);

  // Estado e refs para seek na barra de progresso
  const [progressBarWidth, setProgressBarWidth] = useState(0); //..Largura da barra de progresso
  const [isSeeking, setIsSeeking] = useState(false); //............Se esta fazendo seek
  const isSeekingRef = useRef(false); //...........................Ref sincrona para seek
  const lastSeekTimestampRef = useRef(0); //.......................Timestamp do ultimo seek (debounce)
  const progressBarRef = useRef<View>(null); //...................Ref da barra de progresso
  const progressBarWidthRef = useRef(0); //.......................Ref largura (para PanResponder)
  const videoDurationRef = useRef(0); //..........................Ref duracao (para PanResponder)

  // Estado local para progresso do mini player durante seeking (evita sobrescrita pelo timeUpdate)
  const [localMiniProgress, setLocalMiniProgress] = useState(0);

  // Atualiza progresso local do mini player quando nao esta seeking
  useEffect(() => {
    if (!isSeeking) {
      console.log('[SYNC_DEBUG] Syncing localMiniProgress from videoProgress:', videoProgress);
      setLocalMiniProgress(videoProgress);
    } else {
      console.log('[SYNC_DEBUG] Skipping sync - isSeeking is true');
    }
  }, [videoProgress, isSeeking]);

  // LOG: Monitora TODAS as mudancas de videoProgress para debug
  useEffect(() => {
    console.log('[PROGRESS_DEBUG] ★★★ videoProgress MUDOU ★★★');
    console.log('[PROGRESS_DEBUG] Novo valor:', videoProgress);
    console.log('[PROGRESS_DEBUG] isSeeking:', isSeeking);
    console.log('[PROGRESS_DEBUG] isSeekingRef.current:', isSeekingRef.current);
    console.log('[PROGRESS_DEBUG] Stack trace:', new Error().stack);
  }, [videoProgress]);

  // Aula atual
  const currentLesson = contents[currentLessonIndex];

  // Ref para evitar restauracao multipla
  const hasRestoredFromContextRef = useRef(false);

  // Ativa o contexto quando o PlayerScreen monta (para CSS positioning funcionar)
  useEffect(() => {
    console.log('[DEBUG_ACTIVATION] ========================================');
    console.log('[DEBUG_ACTIVATION] PlayerScreen montou!');
    console.log('[DEBUG_ACTIVATION] Estado atual do contexto:', {
      isActive: miniPlayerContext.isActive,
      isMinimized: miniPlayerContext.isMinimized,
      expandedVideoLayout: miniPlayerContext.expandedVideoLayout,
    });
    console.log('[DEBUG_ACTIVATION] Dados do player:', {
      trainingId,
      currentLessonIndex,
      contentsLength: contents.length,
    });

    // Se contexto nao esta ativo, ativa
    if (!miniPlayerContext.isActive) {
      const simpleLessonsList = contents.map((c) => ({ id: c.id, title: c.title }));
      console.log('[DEBUG_ACTIVATION] ❌ Contexto NAO esta ativo, ativando...');
      console.log('[DEBUG_ACTIVATION] Chamando activate() com:', {
        trainingId,
        currentLessonIndex,
        lessonsCount: simpleLessonsList.length,
        lessons: simpleLessonsList,
      });
      miniPlayerContext.activate(trainingId, currentLessonIndex, simpleLessonsList);
      console.log('[DEBUG_ACTIVATION] ✅ activate() chamado!');

      // Marca para auto-iniciar o video
      shouldAutoStartRef.current = true;

      // Aguarda video carregar e inicia automaticamente
      setTimeout(() => {
        console.log('[DEBUG_ACTIVATION] Verificando apos activate:', {
          isActive: miniPlayerContext.isActive,
          isMinimized: miniPlayerContext.isMinimized,
        });

        // Inicia o video automaticamente
        console.log('[AUTO_START_FIRST_LOAD] Iniciando video automaticamente apos ativar contexto');
        if (videoRef.current) {
          if (Platform.OS === 'web') {
            videoRef.current.play().catch((error: any) => {
              console.log('[AUTO_START_FIRST_LOAD] Erro ao iniciar video:', error);
            });
          } else {
            videoRef.current.playAsync().catch((error: any) => {
              console.log('[AUTO_START_FIRST_LOAD] Erro ao iniciar video (mobile):', error);
            });
          }
          // Atualiza estado local e contexto para mostrar icone de pause
          setIsPlaying(true);
          miniPlayerContext.updateVideoState({ isPlaying: true });
          console.log('[AUTO_START_FIRST_LOAD] Video iniciado com sucesso e estado atualizado');
        } else {
          console.log('[AUTO_START_FIRST_LOAD] ERRO: videoRef.current e null');
        }
      }, 1000); // Aguarda 1 segundo para o video carregar
    } else {
      console.log('[DEBUG_ACTIVATION] ✅ Contexto JA esta ativo');
    }

    // Se contexto esta ativo mas minimizado, expande (usuario abriu o PlayerScreen)
    if (miniPlayerContext.isActive && miniPlayerContext.isMinimized) {
      console.log('[DEBUG_ACTIVATION] Contexto esta minimizado, expandindo...');
      miniPlayerContext.expand();

      // Marca para auto-iniciar o video
      shouldAutoStartRef.current = true;

      // Aguarda um pouco e inicia o video
      setTimeout(() => {
        console.log('[AUTO_START_EXPAND] Iniciando video automaticamente apos expandir');
        if (videoRef.current) {
          if (Platform.OS === 'web') {
            videoRef.current.play().catch((error: any) => {
              console.log('[AUTO_START_EXPAND] Erro ao iniciar video:', error);
            });
          } else {
            videoRef.current.playAsync().catch((error: any) => {
              console.log('[AUTO_START_EXPAND] Erro ao iniciar video (mobile):', error);
            });
          }
          // Atualiza estado local e contexto para mostrar icone de pause
          setIsPlaying(true);
          miniPlayerContext.updateVideoState({ isPlaying: true });
          console.log('[AUTO_START_EXPAND] Video iniciado com sucesso e estado atualizado');
        } else {
          console.log('[AUTO_START_EXPAND] ERRO: videoRef.current e null');
        }
      }, 800); // Aguarda 800ms para garantir que o video esta pronto
    }
    console.log('[DEBUG_ACTIVATION] ========================================');
  }, []); // Roda apenas uma vez ao montar

  // Informa ao contexto quando o PlayerScreen esta ativo/inativo
  useEffect(() => {
    console.log('[PLAYER_SCREEN_STATUS] ==================== PlayerScreen MONTOU ====================');
    console.log('[PLAYER_SCREEN_STATUS] Informando ao contexto que tela principal esta ativa');
    miniPlayerContext.setPlayerScreenActive(true);

    return () => {
      console.log('[PLAYER_SCREEN_STATUS] ==================== PlayerScreen DESMONTOU ====================');
      console.log('[PLAYER_SCREEN_STATUS] Informando ao contexto que tela principal esta inativa');
      miniPlayerContext.setPlayerScreenActive(false);
    };
  }, []); // Roda ao montar e desmontar

  // Mostra controles quando video e expandido (usuario fecha mini player na tela principal)
  useEffect(() => {
    // Detecta quando video foi expandido (isMinimized mudou de true para false)
    if (miniPlayerContext.isActive && !miniPlayerContext.isMinimized) {
      console.log('[SHOW_CONTROLS] ==================== VIDEO EXPANDIDO ====================');
      console.log('[SHOW_CONTROLS] Mostrando controles automaticamente');
      setShowControls(true);
      setShowMiniControls(true);
      console.log('[SHOW_CONTROLS] ================================================================');
    }
  }, [miniPlayerContext.isMinimized, miniPlayerContext.isActive]); // Dispara quando isMinimized muda

  // Sincroniza currentLessonIndex do contexto para o estado local
  // Garante que quando o usuario trocar de aula no mini player, o card selecionado tambem atualize
  useEffect(() => {
    if (miniPlayerContext.currentLessonIndex !== currentLessonIndex) {
      console.log('[SYNC_LESSON_INDEX] ==================== SINCRONIZANDO INDICE ====================');
      console.log('[SYNC_LESSON_INDEX] Estado local:', currentLessonIndex);
      console.log('[SYNC_LESSON_INDEX] Contexto:', miniPlayerContext.currentLessonIndex);
      console.log('[SYNC_LESSON_INDEX] Atualizando estado local para:', miniPlayerContext.currentLessonIndex);
      setCurrentLessonIndex(miniPlayerContext.currentLessonIndex);
      console.log('[SYNC_LESSON_INDEX] ================================================================');
    }
  }, [miniPlayerContext.currentLessonIndex]); // Dispara quando currentLessonIndex do contexto muda

  // Detecta quando video terminou e dispara autoplay
  // Como o video esta no GlobalMiniPlayer, precisamos monitorar o contexto
  useEffect(() => {
    const videoProgress = miniPlayerContext.videoProgress;
    const contextIsPlaying = miniPlayerContext.isPlaying;
    const videoDuration = miniPlayerContext.videoDuration;

    // Detecta fim do video: progresso >= 99% E nao esta mais tocando E tem duracao valida
    const videoHasEnded = videoProgress >= 99 && !contextIsPlaying && videoDuration > 0;

    if (videoHasEnded) {
      console.log('[AUTOPLAY_DETECTION] ==================== VIDEO TERMINOU ====================');
      console.log('[AUTOPLAY_DETECTION] videoProgress:', videoProgress);
      console.log('[AUTOPLAY_DETECTION] contextIsPlaying:', contextIsPlaying);
      console.log('[AUTOPLAY_DETECTION] videoDuration:', videoDuration);
      console.log('[AUTOPLAY_DETECTION] autoPlay:', autoPlay);
      console.log('[AUTOPLAY_DETECTION] currentLessonIndex:', currentLessonIndex);
      console.log('[AUTOPLAY_DETECTION] contents.length:', contents.length);

      // Se autoplay esta ativado E nao e a ultima aula, avanca
      if (autoPlay && currentLessonIndex < contents.length - 1) {
        console.log('[AUTOPLAY_DETECTION] Avancando para proxima aula...');
        shouldAutoStartRef.current = true; //..Marca para auto-iniciar
        setTimeout(() => {
          const newIndex = currentLessonIndex + 1;
          setCurrentLessonIndex(newIndex); //..Atualiza estado local
          miniPlayerContext.nextLesson(); //..Avanca no contexto
          console.log('[AUTOPLAY_DETECTION] Aula avancada para indice:', newIndex);

          // Aguarda video carregar e inicia automaticamente
          setTimeout(() => {
            console.log('[AUTOPLAY_START] Iniciando video automaticamente apos trocar de aula');
            if (videoRef.current) {
              if (Platform.OS === 'web') {
                videoRef.current.play().catch((error: any) => {
                  console.log('[AUTOPLAY_START] Erro ao iniciar video:', error);
                });
              } else {
                videoRef.current.playAsync().catch((error: any) => {
                  console.log('[AUTOPLAY_START] Erro ao iniciar video (mobile):', error);
                });
              }
              // Atualiza estado local e contexto para mostrar icone de pause
              setIsPlaying(true);
              miniPlayerContext.updateVideoState({ isPlaying: true });
              console.log('[AUTOPLAY_START] Video iniciado com sucesso e estado atualizado');
            } else {
              console.log('[AUTOPLAY_START] ERRO: videoRef.current e null');
            }
          }, 800); // Aguarda 800ms para o video carregar
        }, 500); // Delay de 500ms antes de avancar
      } else {
        console.log('[AUTOPLAY_DETECTION] Nao avancando - autoPlay:', autoPlay, 'isLastLesson:', currentLessonIndex === contents.length - 1);

        // Se nao avanca para proxima aula, verifica se deve reiniciar o video
        console.log('[VIDEO_RESTART] ==================== VERIFICANDO REINICIO ====================');
        console.log('[VIDEO_RESTART] repeatEnabled:', repeatEnabled);

        if (repeatEnabled) {
          // Repetir ativado: reinicia e toca automaticamente
          console.log('[VIDEO_RESTART] Repetir ATIVADO - reiniciando video e tocando automaticamente');
          setTimeout(() => {
            if (videoRef.current) {
              if (Platform.OS === 'web') {
                videoRef.current.currentTime = 0; // Reinicia para o início
                videoRef.current.play().catch((error: any) => {
                  console.log('[VIDEO_RESTART] Erro ao tocar video:', error);
                });
              } else {
                videoRef.current.setPositionAsync(0).then(() => {
                  videoRef.current.playAsync().catch((error: any) => {
                    console.log('[VIDEO_RESTART] Erro ao tocar video (mobile):', error);
                  });
                });
              }
              // Atualiza estado local e contexto para mostrar icone de pause
              setIsPlaying(true);
              miniPlayerContext.updateVideoState({
                progress: 0,
                position: 0,
                isPlaying: true,
              });
              console.log('[VIDEO_RESTART] Video reiniciado e tocando com estado atualizado');
            } else {
              console.log('[VIDEO_RESTART] ERRO: videoRef.current e null');
            }
          }, 300);
        } else {
          // Repetir desativado: reinicia mas mantém pausado
          console.log('[VIDEO_RESTART] Repetir DESATIVADO - reiniciando video mas mantendo pausado');
          setTimeout(() => {
            if (videoRef.current) {
              if (Platform.OS === 'web') {
                videoRef.current.currentTime = 0; // Reinicia para o início
                videoRef.current.pause(); // Garante que fica pausado
              } else {
                videoRef.current.setPositionAsync(0).then(() => {
                  videoRef.current.pauseAsync();
                });
              }
              // Atualiza estado local e contexto com progresso zerado e pausado
              setIsPlaying(false);
              miniPlayerContext.updateVideoState({
                progress: 0,
                position: 0,
                isPlaying: false,
              });
              console.log('[VIDEO_RESTART] Video reiniciado e pausado com estado atualizado');
            } else {
              console.log('[VIDEO_RESTART] ERRO: videoRef.current e null');
            }
          }, 300);
        }
        console.log('[VIDEO_RESTART] ================================================================');
      }
      console.log('[AUTOPLAY_DETECTION] ================================================================');
    }
  }, [
    miniPlayerContext.videoProgress,
    miniPlayerContext.isPlaying,
    miniPlayerContext.videoDuration,
    autoPlay,
    repeatEnabled,
    currentLessonIndex,
    contents.length,
    miniPlayerContext,
    videoRef,
  ]); // Monitora progresso, isPlaying, duracao e configuracoes de repeat

  // Restaura estado do video quando voltando do mini player global (expand)
  useEffect(() => {
    // Verifica se esta voltando do mini player global (contexto ativo, nao minimizado)
    if (
      miniPlayerContext.isActive &&
      !miniPlayerContext.isMinimized &&
      !hasRestoredFromContextRef.current &&
      miniPlayerContext.videoDuration > 0
    ) {
      hasRestoredFromContextRef.current = true;

      // Reseta isMinimized LOCAL para mostrar o player expandido (nao a capa)
      setIsMinimized(false);

      // Restaura estado do video do contexto global
      setVideoProgress(miniPlayerContext.videoProgress);
      setVideoDuration(miniPlayerContext.videoDuration);
      setVideoPosition(miniPlayerContext.videoPosition);
      setIsPlaying(miniPlayerContext.isPlaying);
      setIsLoading(false);

      // Aplica seek no video para a posicao correta apos o video carregar
      const restorePosition = () => {
        if (videoRef.current && miniPlayerContext.videoPosition > 0) {
          if (Platform.OS === 'web') {
            videoRef.current.currentTime = miniPlayerContext.videoPosition / 1000;
            if (miniPlayerContext.isPlaying) {
              videoRef.current.play().catch(() => {});
            }
          } else {
            videoRef.current.setPositionAsync(miniPlayerContext.videoPosition).then(() => {
              if (miniPlayerContext.isPlaying) {
                videoRef.current.playAsync().catch(() => {});
              }
            });
          }
        }
      };

      // Aguarda video carregar antes de restaurar posicao
      const timeout = setTimeout(restorePosition, 300);
      return () => clearTimeout(timeout);
    }
  }, [
    miniPlayerContext.isActive,
    miniPlayerContext.isMinimized,
    miniPlayerContext.videoProgress,
    miniPlayerContext.videoDuration,
    miniPlayerContext.videoPosition,
    miniPlayerContext.isPlaying,
    miniPlayerContext.miniPlayerSize,
  ]);


  // Sincroniza videoRef com o contexto global (para mini player controlar o video)
  useEffect(() => {
    console.log('[TRANSITION_DEBUG] Sincronizando videoRef com contexto global');
    if (videoRef.current) {
      miniPlayerContext.videoRef.current = videoRef.current;
      console.log('[TRANSITION_DEBUG] videoRef sincronizada com sucesso');
    } else {
      console.log('[TRANSITION_DEBUG] videoRef.current e NULL, nao sincronizou');
    }
  }, [videoRef.current, miniPlayerContext.videoRef]);


  // Atualiza estado do video no contexto global quando valores mudam
  // IMPORTANTE: NAO atualiza progress/position/duration aqui, pois GlobalMiniPlayer
  // ja atualiza esses valores diretamente do video element via timeupdate.
  // Atualizar aqui causaria conflito e flickering na UI.
  useEffect(() => {
    if (miniPlayerContext.isActive) {
      miniPlayerContext.updateVideoState({
        isPlaying,
        isLoading,
        // progress, position, duration removidos - GlobalMiniPlayer gerencia
      });
    }
  }, [
    isPlaying,
    isLoading,
    miniPlayerContext.isActive,
    miniPlayerContext.updateVideoState,
  ]);

  // Mantem refs sincronizadas com estados (para PanResponder acessar valores atuais)
  useEffect(() => {
    progressBarWidthRef.current = progressBarWidth;
  }, [progressBarWidth]);

  useEffect(() => {
    videoDurationRef.current = videoDuration;
  }, [videoDuration]);

  // Ajusta posicao do mini player quando tamanho muda (mantendo margem de 10px)
  useEffect(() => {
    if (isMinimized && miniPlayerContext.miniPlayerSize > 1) {
      const { width, height } = getMiniPlayerDimensions();
      const currentX = (panPosition.x as any)._value;
      const currentY = (panPosition.y as any)._value;

      // Limites com margem de 10px - mini player nunca fica oculto
      const minX = 10; //................................10px da borda esquerda
      const maxX = SCREEN_WIDTH - width - 10; //........10px da borda direita
      const minY = 10; //................................10px do topo
      const maxY = SCREEN_HEIGHT - height - 10; //......10px do fundo

      // Ajusta se necessario
      const boundedX = Math.max(minX, Math.min(currentX, maxX));
      const boundedY = Math.max(minY, Math.min(currentY, maxY));

      // Tolerancia para evitar ajustes desnecessarios (diferenca minima de 2px)
      const diffX = Math.abs(boundedX - currentX);
      const diffY = Math.abs(boundedY - currentY);

      // Ajusta apenas se a diferenca for significativa (mais de 2px)
      if (diffX > 2 || diffY > 2) {
        panPosition.setValue({ x: boundedX, y: boundedY }); //..Define valor direto
      }
    }
  }, [miniPlayerContext.miniPlayerSize, isMinimized, getMiniPlayerDimensions, panPosition]);

  // Ref para largura da barra de progresso do mini player
  const miniProgressBarWidthRef = useRef(0);

  // Refs para dimensoes do mini player (para PanResponder acessar valores atuais)
  const miniPlayerWidthRef = useRef(MINI_PLAYER_WIDTH_SMALL);
  const miniPlayerHeightRef = useRef(MINI_PLAYER_HEIGHT_SMALL);

  // Ref para rastrear se o gesto comecou na barra de progresso
  const isGestureOnProgressBarRef = useRef(false);

  // Ref para rastrear se o mini player esta sendo arrastado
  const isDraggingMiniPlayerRef = useRef(false);

  // Atualiza refs de dimensoes quando tamanho do mini player muda
  useEffect(() => {
    const { width, height } = getMiniPlayerDimensions();
    miniPlayerWidthRef.current = width;
    miniPlayerHeightRef.current = height;
  }, [miniPlayerContext.miniPlayerSize, getMiniPlayerDimensions]);

  // PanResponder para arrastar o mini player (nao responde na barra de progresso)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Verifica se o toque esta na regiao da barra de progresso (30px do fundo)
        const touchY = evt.nativeEvent.locationY;
        const isInProgressArea = touchY > miniPlayerHeightRef.current - 30;
        // Salva na ref se o gesto comecou na barra
        isGestureOnProgressBarRef.current = isInProgressArea;
        return !isInProgressArea; //......................Nao responde se estiver na barra
      },
      onMoveShouldSetPanResponder: () => {
        // Se o gesto comecou na barra, nao responde ao movimento
        return !isGestureOnProgressBarRef.current;
      },
      onStartShouldSetPanResponderCapture: (evt) => {
        // Captura eventos fora da barra de progresso para evitar scroll
        const touchY = evt.nativeEvent.locationY;
        const isInProgressArea = touchY > miniPlayerHeightRef.current - 30;
        return !isInProgressArea; //..Captura se nao estiver na barra
      },
      onMoveShouldSetPanResponderCapture: () => {
        // Sempre captura movimento se estiver arrastando ou nao estiver na barra
        return isDraggingMiniPlayerRef.current || !isGestureOnProgressBarRef.current;
      },
      onPanResponderTerminationRequest: () => {
        // Nunca permite interrupcao enquanto estiver arrastando
        return !isDraggingMiniPlayerRef.current && isGestureOnProgressBarRef.current;
      },
      onPanResponderGrant: () => {
        // Marca que estamos arrastando
        isDraggingMiniPlayerRef.current = true;
        // Mostra controles ao tocar fora da barra de progresso
        setShowMiniControls(true);
        // Salva posicao atual antes de comecar o arrasto
        panPosition.setOffset({
          x: (panPosition.x as any)._value, //..............Offset X atual
          y: (panPosition.y as any)._value, //..............Offset Y atual
        });
        panPosition.setValue({ x: 0, y: 0 }); //............Reseta valor
      },
      onPanResponderMove: Animated.event(
        [null, { dx: panPosition.x, dy: panPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        // Marca que nao estamos mais arrastando
        isDraggingMiniPlayerRef.current = false;

        panPosition.flattenOffset(); //....................Aplica offset ao valor
        const currentX = (panPosition.x as any)._value;
        const currentY = (panPosition.y as any)._value;

        // Usa refs para obter dimensoes atuais (PanResponder nao atualiza closures)
        const width = miniPlayerWidthRef.current;
        const height = miniPlayerHeightRef.current;

        // Limites com margem de 10px - mini player nunca fica oculto
        const minX = 10; //................................10px da borda esquerda
        const maxX = SCREEN_WIDTH - width - 10; //........10px da borda direita
        const minY = 10; //................................10px do topo
        const maxY = SCREEN_HEIGHT - height - 10; //......10px do fundo

        const boundedX = Math.max(minX, Math.min(currentX, maxX));
        const boundedY = Math.max(minY, Math.min(currentY, maxY));

        // Ajusta posicao apenas se necessario (sem animacao spring)
        if (boundedX !== currentX || boundedY !== currentY) {
          panPosition.setValue({ x: boundedX, y: boundedY });
        }
      },
    })
  ).current;

  // PanResponder para arrastar a barra de progresso (seek)
  // Obtem duracao DIRETAMENTE do video para funcionar apos hard refresh
  const progressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, //..........Inicia resposta ao toque
      onMoveShouldSetPanResponder: () => true, //...........Continua respondendo ao movimento
      onPanResponderGrant: (evt) => {
        // Toque inicial - calcula e aplica seek
        console.log('[SEEK_DEBUG] ========== onPanResponderGrant ==========');
        isSeekingRef.current = true; //..Sincrono - bloqueia updates imediatamente
        setIsSeeking(true);
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        console.log('[SEEK_DEBUG] Grant - locationX:', locationX, 'barWidth:', barWidth, 'percentage:', percentage);
        // Atualiza UI imediatamente
        setVideoProgress(percentage);
        // Obtem duracao do video diretamente (funciona apos hard refresh)
        const video = videoRef.current;
        if (video && Platform.OS === 'web') {
          const durationSec = video.duration;
          console.log('[SEEK_DEBUG] Grant - video.duration:', durationSec, 'video.currentTime:', video.currentTime);
          if (durationSec && durationSec > 0 && isFinite(durationSec)) {
            setVideoPosition((percentage / 100) * durationSec * 1000);
          }
        }
        // Aplica seek no video
        console.log('[SEEK_DEBUG] Grant - chamando applySeekFromPercentage');
        applySeekFromPercentage(percentage);
      },
      onPanResponderMove: (evt) => {
        // Arrastando - atualiza posicao em tempo real
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        console.log('[SEEK_DEBUG] Move - locationX:', locationX, 'percentage:', percentage);
        // Atualiza UI imediatamente
        setVideoProgress(percentage);
        // Obtem duracao do video diretamente (funciona apos hard refresh)
        const video = videoRef.current;
        if (video && Platform.OS === 'web') {
          const durationSec = video.duration;
          if (durationSec && durationSec > 0 && isFinite(durationSec)) {
            setVideoPosition((percentage / 100) * durationSec * 1000);
            console.log('[SEEK_DEBUG] Move - video.currentTime BEFORE seek:', video.currentTime);
          }
        }
        // Aplica seek no video durante arrasto
        console.log('[SEEK_DEBUG] Move - chamando applySeekFromPercentage');
        applySeekFromPercentage(percentage);
      },
      onPanResponderRelease: (evt) => {
        // Soltou - finaliza seek no video
        console.log('[SEEK_DEBUG] ========== onPanResponderRelease ==========');
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        console.log('[SEEK_DEBUG] Release - locationX:', locationX, 'percentage:', percentage);
        // Aplica seek final
        console.log('[SEEK_DEBUG] Release - chamando applySeekFromPercentage');
        applySeekFromPercentage(percentage);
        console.log('[SEEK_DEBUG] Release - liberando isSeeking');
        isSeekingRef.current = false; //..Sincrono - libera updates
        setIsSeeking(false);
      },
    })
  ).current;

  // Funcao auxiliar para aplicar seek (usada pelo PanResponder)
  // Obtem duracao DIRETAMENTE do elemento video para funcionar apos hard refresh
  const applySeekFromPercentage = async (percentage: number) => {
    console.log('[SEEK_DEBUG] --- applySeekFromPercentage INICIOU ---');
    console.log('[SEEK_DEBUG] percentage recebido:', percentage);

    // USA videoRef DIRETAMENTE ao inves de videoRefForSeek
    const video = videoRef.current;
    if (!video) {
      console.log('[SEEK_DEBUG] ERRO: video ref e NULL!');
      return;
    }
    console.log('[SEEK_DEBUG] video ref existe:', video);

    // Atualiza timestamp do seek para debounce no timeUpdate
    lastSeekTimestampRef.current = Date.now();
    console.log('[SEEK_DEBUG] timestamp atualizado:', lastSeekTimestampRef.current);

    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    console.log('[SEEK_DEBUG] clampedPercentage:', clampedPercentage);

    if (Platform.OS === 'web') {
      console.log('[SEEK_DEBUG] Platform: WEB');
      // Web: obtem duracao diretamente do video (em segundos)
      const videoDurationSeconds = video.duration;
      console.log('[SEEK_DEBUG] video.duration:', videoDurationSeconds);
      console.log('[SEEK_DEBUG] video.currentTime ANTES do seek:', video.currentTime);
      console.log('[SEEK_DEBUG] video.paused:', video.paused);
      console.log('[SEEK_DEBUG] video.readyState:', video.readyState);

      if (videoDurationSeconds && videoDurationSeconds > 0 && isFinite(videoDurationSeconds)) {
        const durationMs = videoDurationSeconds * 1000;
        const newPositionSeconds = (clampedPercentage / 100) * videoDurationSeconds;
        console.log('[SEEK_DEBUG] newPositionSeconds calculado:', newPositionSeconds);
        console.log('[SEEK_DEBUG] APLICANDO SEEK: video.currentTime =', newPositionSeconds);

        video.currentTime = newPositionSeconds;

        console.log('[SEEK_DEBUG] video.currentTime APOS o seek:', video.currentTime);
        setVideoPosition(newPositionSeconds * 1000);
        setVideoProgress(clampedPercentage);
        setVideoDuration(durationMs);
        videoDurationRef.current = durationMs;
        console.log('[SEEK_DEBUG] Estados atualizados com sucesso');
      } else {
        console.log('[SEEK_DEBUG] ERRO: duracao invalida!', {
          videoDurationSeconds,
          isValid: videoDurationSeconds && videoDurationSeconds > 0 && isFinite(videoDurationSeconds),
        });
      }
    } else {
      console.log('[SEEK_DEBUG] Platform: MOBILE');
      // Mobile: usa ref/estado
      const duration = videoDurationRef.current;
      if (duration > 0) {
        const newPosition = (clampedPercentage / 100) * duration;
        console.log('[SEEK_DEBUG] MOBILE - newPosition:', newPosition);
        await video.setPositionAsync(newPosition);
        setVideoPosition(newPosition);
        setVideoProgress(clampedPercentage);
      } else {
        console.log('[SEEK_DEBUG] MOBILE ERRO: duracao invalida:', duration);
      }
    }
    console.log('[SEEK_DEBUG] --- applySeekFromPercentage FINALIZOU ---');
  };


  // Callback para capturar largura da barra de progresso do mini player
  const handleMiniProgressBarLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    miniProgressBarWidthRef.current = width;
  }, []);

  // Funcao para calcular e aplicar seek baseado na posicao X do toque (mini player LOCAL)
  // Retorna o percentual calculado para uso no handleEnd
  const applyMiniSeekFromX = useCallback((clientX: number, rect: DOMRect, isFinalSeek: boolean = false) => {
    const barWidth = rect.width;
    const touchX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (touchX / barWidth) * 100));

    console.log('[MINI_SEEK_DEBUG] applyMiniSeekFromX called:', {
      clientX,
      rectLeft: rect.left,
      barWidth,
      touchX,
      percentage,
      isFinalSeek,
    });

    // Atualiza progresso local imediatamente (visual)
    setLocalMiniProgress(percentage);
    console.log('[MINI_SEEK_DEBUG] setLocalMiniProgress called with:', percentage);

    // Aplica seek no video principal - obtem duracao DIRETAMENTE do elemento video
    // Usa videoRef diretamente (videoRefForSeek pode nao estar sincronizada)
    const video = videoRef.current;
    console.log('[MINI_SEEK_DEBUG] videoRef.current:', video ? 'EXISTS' : 'NULL');

    if (video && Platform.OS === 'web') {
      // Obtem duracao diretamente do video (em segundos), nao da ref/estado
      const videoDurationSeconds = video.duration;
      console.log('[MINI_SEEK_DEBUG] video.duration:', videoDurationSeconds);

      if (videoDurationSeconds && videoDurationSeconds > 0 && isFinite(videoDurationSeconds)) {
        const durationMs = videoDurationSeconds * 1000;
        const newPositionSeconds = (percentage / 100) * videoDurationSeconds;

        console.log('[MINI_SEEK_DEBUG] Seeking video:', {
          newPositionSeconds,
          currentTimeBefore: video.currentTime,
        });

        video.currentTime = newPositionSeconds;

        // Marca timestamp do seek para debounce no timeupdate
        lastSeekTimestampRef.current = Date.now();

        console.log('[MINI_SEEK_DEBUG] After seek:', {
          currentTimeAfter: video.currentTime,
          lastSeekTimestamp: lastSeekTimestampRef.current,
        });

        // Atualiza refs
        setVideoDuration(durationMs);
        videoDurationRef.current = durationMs;

        // Se e o seek final, atualiza tambem videoProgress e videoPosition
        if (isFinalSeek) {
          console.log('[MINI_SEEK_DEBUG] isFinalSeek - updating videoProgress to:', percentage);
          setVideoProgress(percentage);
          setVideoPosition(newPositionSeconds * 1000);
        }
      } else {
        console.log('[MINI_SEEK_DEBUG] ERROR: Invalid video duration!');
      }
    } else {
      console.log('[MINI_SEEK_DEBUG] ERROR: No video ref or not web platform!');
    }

    return percentage;
  }, []);

  // Ref para container da barra de progresso do mini player
  const miniProgressContainerRef = useRef<View>(null);

  // Ref para armazenar o elemento DOM da barra de progresso do mini player
  const miniProgressDomElementRef = useRef<HTMLDivElement | null>(null);

  // Efeito para adicionar event listeners nativos do DOM na barra de progresso do mini player LOCAL
  // Isso e necessario porque React Native Web nao mapeia onMouseDown etc. para Views
  useEffect(() => {
    console.log('[MINI_PROGRESS_DEBUG] useEffect triggered:', {
      platform: Platform.OS,
      isMinimized,
      showMiniControls,
      miniPlayerContextIsActive: miniPlayerContext.isActive,
      miniPlayerContextIsMinimized: miniPlayerContext.isMinimized,
    });

    if (Platform.OS !== 'web' || !isMinimized || !showMiniControls) {
      console.log('[MINI_PROGRESS_DEBUG] Early return - conditions not met');
      return;
    }

    // Se o mini player global estiver ativo, nao renderiza o local
    if (miniPlayerContext.isActive && miniPlayerContext.isMinimized) {
      console.log('[MINI_PROGRESS_DEBUG] Early return - global mini player is active');
      return;
    }

    // Variavel para armazenar o elemento alvo para cleanup
    let targetElement: HTMLDivElement | null = null;
    // Handlers para cleanup
    let handleStart: ((e: MouseEvent | TouchEvent) => void) | null = null;
    let handleMove: ((e: MouseEvent | TouchEvent) => void) | null = null;
    let handleEnd: ((e: MouseEvent | TouchEvent) => void) | null = null;

    // Aguarda proximo frame para garantir que DOM esta renderizado
    const timeoutId = setTimeout(() => {
      console.log('[MINI_PROGRESS_DEBUG] setTimeout callback executed');

      // Obtem o elemento DOM da ref do React Native Web
      const element = miniProgressContainerRef.current;
      console.log('[MINI_PROGRESS_DEBUG] miniProgressContainerRef.current:', element);

      if (!element) {
        console.log('[MINI_PROGRESS_DEBUG] ERROR: element is null!');
        return;
      }

      // No React Native Web, a ref pode ser um objeto com _nativeTag ou o proprio elemento
      const nativeTag = (element as any)._nativeTag;
      console.log('[MINI_PROGRESS_DEBUG] element._nativeTag:', nativeTag);

      const domElement = nativeTag
        ? document.querySelector(`[data-rnw-element-id="${nativeTag}"]`)
        : (element as unknown as HTMLDivElement);

      console.log('[MINI_PROGRESS_DEBUG] domElement found:', domElement);

      // Se ainda nao encontrou, tenta pelo ref diretamente (RNW pode variar)
      targetElement = (domElement || element) as HTMLDivElement;
      console.log('[MINI_PROGRESS_DEBUG] targetElement:', targetElement);
      console.log('[MINI_PROGRESS_DEBUG] targetElement.addEventListener exists:', typeof targetElement.addEventListener === 'function');

      if (!targetElement || typeof targetElement.addEventListener !== 'function') {
        console.log('[MINI_PROGRESS_DEBUG] ERROR: targetElement invalid or no addEventListener!');
        return;
      }

      miniProgressDomElementRef.current = targetElement;
      console.log('[MINI_PROGRESS_DEBUG] SUCCESS: Event listeners will be added to:', targetElement);

      // Handler para mousedown/touchstart
      handleStart = (e: MouseEvent | TouchEvent) => {
        const touchEvent = e as TouchEvent; //.........Cast para TouchEvent
        const mouseEvent = e as MouseEvent; //.........Cast para MouseEvent
        console.log('[MINI_PROGRESS_DEBUG] handleStart called!', {
          type: e.type,
          clientX: 'touches' in e ? touchEvent.touches[0]?.clientX : mouseEvent.clientX,
        });

        e.stopPropagation();
        e.preventDefault();

        isSeekingRef.current = true;
        setIsSeeking(true);

        const rect = targetElement!.getBoundingClientRect();
        const clientX = 'touches' in e ? touchEvent.touches[0].clientX : mouseEvent.clientX;
        console.log('[MINI_PROGRESS_DEBUG] handleStart - rect:', rect, 'clientX:', clientX);
        applyMiniSeekFromX(clientX, rect);
      };

      // Handler para mousemove/touchmove
      handleMove = (e: MouseEvent | TouchEvent) => {
        if (!isSeekingRef.current) return;

        const touchEventMove = e as TouchEvent; //......Cast para TouchEvent
        const mouseEventMove = e as MouseEvent; //......Cast para MouseEvent

        e.stopPropagation();
        e.preventDefault();

        const rect = targetElement!.getBoundingClientRect();
        let clientX = 0;
        if ('touches' in e && touchEventMove.touches.length > 0) {
          clientX = touchEventMove.touches[0].clientX;
        } else if ('clientX' in e) {
          clientX = mouseEventMove.clientX;
        }
        console.log('[MINI_PROGRESS_DEBUG] handleMove - clientX:', clientX);
        applyMiniSeekFromX(clientX, rect);
      };

      // Handler para mouseup/touchend/mouseleave
      handleEnd = (e: MouseEvent | TouchEvent) => {
        if (!isSeekingRef.current) return;

        const touchEventEnd = e as TouchEvent; //......Cast para TouchEvent
        const mouseEventEnd = e as MouseEvent; //......Cast para MouseEvent

        console.log('[MINI_PROGRESS_DEBUG] handleEnd called!', { type: e.type });

        e.stopPropagation();
        e.preventDefault();

        const rect = targetElement!.getBoundingClientRect();
        const clientX = 'changedTouches' in e
          ? touchEventEnd.changedTouches[0].clientX
          : 'touches' in e
            ? touchEventEnd.touches[0]?.clientX || 0
            : mouseEventEnd.clientX;

        console.log('[MINI_PROGRESS_DEBUG] handleEnd - clientX:', clientX, 'rect:', rect);

        // Passa true para indicar seek final (atualiza videoProgress)
        const percentage = applyMiniSeekFromX(clientX, rect, true);
        console.log('[MINI_PROGRESS_DEBUG] handleEnd - percentage:', percentage);

        // Sincroniza com contexto global se ativo
        if (miniPlayerContext.isActive) {
          const video = videoRef.current;
          if (video && Platform.OS === 'web') {
            const videoDurationSeconds = video.duration;
            if (videoDurationSeconds && videoDurationSeconds > 0 && isFinite(videoDurationSeconds)) {
              const durationMs = videoDurationSeconds * 1000;
              console.log('[MINI_PROGRESS_DEBUG] handleEnd - syncing with context:', {
                percentage,
                durationMs,
              });
              miniPlayerContext.updateVideoState({
                position: (percentage / 100) * durationMs,
                progress: percentage,
                duration: durationMs,
              });
            }
          }
        }

        isSeekingRef.current = false;
        setIsSeeking(false);
      };

      // Adiciona event listeners com capture para garantir que recebemos o evento
      console.log('[MINI_PROGRESS_DEBUG] Adding event listeners to targetElement');
      targetElement.addEventListener('mousedown', handleStart, { capture: true });
      targetElement.addEventListener('touchstart', handleStart, { capture: true, passive: false });

      // Move e end listeners no document para capturar mesmo quando mouse sai do elemento
      document.addEventListener('mousemove', handleMove, { capture: true });
      document.addEventListener('touchmove', handleMove, { capture: true, passive: false });
      document.addEventListener('mouseup', handleEnd, { capture: true });
      document.addEventListener('touchend', handleEnd, { capture: true });
      targetElement.addEventListener('mouseleave', handleEnd, { capture: true });
      console.log('[MINI_PROGRESS_DEBUG] All event listeners added successfully!');
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (targetElement && handleStart && handleMove && handleEnd) {
        targetElement.removeEventListener('mousedown', handleStart, { capture: true } as any);
        targetElement.removeEventListener('touchstart', handleStart, { capture: true } as any);
        document.removeEventListener('mousemove', handleMove, { capture: true } as any);
        document.removeEventListener('touchmove', handleMove, { capture: true } as any);
        document.removeEventListener('mouseup', handleEnd, { capture: true } as any);
        document.removeEventListener('touchend', handleEnd, { capture: true } as any);
        targetElement.removeEventListener('mouseleave', handleEnd, { capture: true } as any);
      }
    };
  }, [isMinimized, showMiniControls, applyMiniSeekFromX, miniPlayerContext.isActive, miniPlayerContext.isMinimized, miniPlayerContext.updateVideoState]);

  // Esconde controles apos alguns segundos
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isPlaying, showControls]);

  // Esconde controles do mini player apos 3 segundos
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isMinimized && isPlaying && showMiniControls) {
      timeout = setTimeout(() => {
        setShowMiniControls(false);
      }, 3000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isMinimized, isPlaying, showMiniControls]);


  // Reseta video ao mudar de aula
  // Pula reset se estiver restaurando do contexto global
  useEffect(() => {
    // Se acabou de restaurar do contexto global, nao reseta
    if (hasRestoredFromContextRef.current) {
      hasRestoredFromContextRef.current = false; //..Limpa flag apos primeira execucao
      return;
    }

    setVideoProgress(0);
    setVideoPosition(0);
    setIsPlaying(false);
    setIsLoading(true);
    // Reseta video
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.currentTime = 0;
      } else {
        videoRef.current.setPositionAsync(0);
      }
    }
  }, [currentLessonIndex]);

  // Aplica velocidade de reproducao ao video quando muda
  useEffect(() => {
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.playbackRate = playbackRate;
      } else {
        // Mobile: usa setRateAsync com shouldCorrectPitch = true
        videoRef.current.setRateAsync(playbackRate, true).catch(() => {});
      }
    }
  }, [playbackRate]);

  // Callback de status do video (mobile)
  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setVideoDuration(status.durationMillis || 0);
      // Auto-start: inicia video automaticamente se marcado
      if (shouldAutoStartRef.current && videoRef.current && !status.isPlaying) {
        shouldAutoStartRef.current = false; //..Reseta flag
        videoRef.current.playAsync().catch(() => {}); //..Inicia reproducao
      }
      // Ignora atualizacoes de posicao durante o seek (usa ref sincrona)
      if (!isSeekingRef.current) {
        setVideoPosition(status.positionMillis || 0);
        if (status.durationMillis && status.durationMillis > 0) {
          setVideoProgress((status.positionMillis / status.durationMillis) * 100);
        }
      }
      // Video terminou
      if (status.didJustFinish) {
        setIsPlaying(false);
        setShowControls(true);
        // Autoplay: avanca para proxima aula se ativado
        if (autoPlay && currentLessonIndex < contents.length - 1) {
          shouldAutoStartRef.current = true; //..Marca para iniciar automaticamente
          setTimeout(() => {
            setCurrentLessonIndex(prev => prev + 1);
          }, 500);
        } else {
          // Reseta video para o inicio (pausado)
          setVideoProgress(0);
          setVideoPosition(0);
          if (videoRef.current) {
            videoRef.current.setPositionAsync(0);
          }
        }
      }
    }
  }, [autoPlay, currentLessonIndex, contents.length]);

  // Handler para capturar duracao do video quando carrega (loadedmetadata)
  const handleWebLoadedMetadata = useCallback(() => {
    if (videoRef.current && Platform.OS === 'web') {
      const video = videoRef.current;
      const duration = video.duration * 1000;
      if (duration > 0) {
        setVideoDuration(duration);
        videoDurationRef.current = duration;
      }
    }
  }, []);

  // Handlers para web
  const handleWebTimeUpdate = useCallback(() => {
    console.log('[TIMEUPDATE_DEBUG] handleWebTimeUpdate disparado');
    console.log('[TIMEUPDATE_DEBUG] isSeekingRef.current:', isSeekingRef.current);

    // Ignora atualizacoes durante o seek (usa ref sincrona)
    if (isSeekingRef.current) {
      console.log('[TIMEUPDATE_DEBUG] IGNORANDO - isSeeking = true');
      return;
    }

    // Ignora atualizacoes por 300ms apos o ultimo seek (debounce)
    const timeSinceLastSeek = Date.now() - lastSeekTimestampRef.current;
    console.log('[TIMEUPDATE_DEBUG] timeSinceLastSeek:', timeSinceLastSeek, 'ms');
    console.log('[TIMEUPDATE_DEBUG] lastSeekTimestamp:', lastSeekTimestampRef.current);

    if (timeSinceLastSeek < 300) {
      console.log('[TIMEUPDATE_DEBUG] IGNORANDO - muito proximo do ultimo seek:', timeSinceLastSeek, 'ms');
      return;
    }

    if (videoRef.current && Platform.OS === 'web') {
      const video = videoRef.current;
      const newPosition = video.currentTime * 1000;
      const newDuration = video.duration * 1000;
      const newProgress = video.duration > 0 ? (video.currentTime / video.duration) * 100 : 0;

      console.log('[TIMEUPDATE_DEBUG] ATUALIZANDO ESTADOS:', {
        currentTime: video.currentTime,
        duration: video.duration,
        newPosition,
        newProgress,
      });

      setVideoPosition(newPosition);
      setVideoDuration(newDuration);
      if (video.duration > 0) {
        setVideoProgress(newProgress);
      }
    }
  }, []);

  const handleWebLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Evento adicional para garantir que loading seja removido e auto-start
  const handleWebCanPlay = useCallback(() => {
    setIsLoading(false);
    // Auto-start: inicia video automaticamente se marcado
    if (shouldAutoStartRef.current && videoRef.current) {
      shouldAutoStartRef.current = false; //..Reseta flag
      videoRef.current.play().catch(() => {}); //..Inicia reproducao
    }
  }, []);

  const handleWebEnded = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
    // Autoplay: avanca para proxima aula se ativado
    if (autoPlay && currentLessonIndex < contents.length - 1) {
      shouldAutoStartRef.current = true; //..Marca para iniciar automaticamente
      setTimeout(() => {
        setCurrentLessonIndex(prev => prev + 1);
      }, 500);
    } else {
      // Reseta video para o inicio (pausado)
      setVideoProgress(0);
      setVideoPosition(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0; //..Volta para o inicio
      }
    }
  }, [autoPlay, currentLessonIndex, contents.length]);

  const handleWebPlay = useCallback(() => {
    console.log('[TRANSITION_DEBUG] ========== VIDEO LOCAL: PLAY EVENT ==========');
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('[TRANSITION_DEBUG] Video LOCAL play:', {
        currentTime: video.currentTime,
        paused: video.paused,
        muted: video.muted,
        volume: video.volume,
      });
    }
    setIsPlaying(true);
  }, []);

  const handleWebPause = useCallback(() => {
    console.log('[TRANSITION_DEBUG] ========== VIDEO LOCAL: PAUSE EVENT ==========');
    if (videoRef.current) {
      const video = videoRef.current;
      console.log('[TRANSITION_DEBUG] Video LOCAL pause:', {
        currentTime: video.currentTime,
        paused: video.paused,
        muted: video.muted,
      });
    }
    setIsPlaying(false);
  }, []);

  // Volta para tela anterior (minimiza o player se estiver ativo)
  const handleGoBack = useCallback(() => {
    console.log('[TRANSITION_DEBUG] handleGoBack INICIOU');

    // Se o contexto global ja esta ativo e minimizado, apenas volta
    if (miniPlayerContext.isActive && miniPlayerContext.isMinimized) {
      console.log('[TRANSITION_DEBUG] Context already minimized, just go back');
      navigation.goBack();
      return;
    }

    // Se o contexto global ja esta ativo (mas nao minimizado), minimiza
    if (miniPlayerContext.isActive && !miniPlayerContext.isMinimized) {
      console.log('[TRANSITION_DEBUG] Context active, minimizing...');

      // Atualiza estado no contexto
      miniPlayerContext.updateVideoState({
        isPlaying,
        progress: videoProgress,
        duration: videoDuration,
        position: videoPosition,
        isLoading,
      });

      // Minimiza (isso move o video para GlobalMiniPlayer)
      miniPlayerContext.minimize();

      // Navega de volta
      setTimeout(() => {
        navigation.goBack();
      }, 50); // Delay minimo para garantir render
      return;
    }

    // Contexto NAO esta ativo - ativa e minimiza
    console.log('[TRANSITION_DEBUG] Activating and minimizing...');

    const simpleLessonsList = contents.map(c => ({ id: c.id, title: c.title }));

    // Ativa o contexto
    miniPlayerContext.activate(trainingId, currentLessonIndex, simpleLessonsList);

    // Atualiza estado
    miniPlayerContext.updateVideoState({
      isPlaying,
      progress: videoProgress,
      duration: videoDuration,
      position: videoPosition,
      isLoading,
    });

    // Minimiza (isso move o video para GlobalMiniPlayer)
    miniPlayerContext.minimize();

    // Navega de volta
    setTimeout(() => {
      navigation.goBack();
    }, 50);
  }, [
    navigation,
    contents,
    trainingId,
    currentLessonIndex,
    isPlaying,
    videoProgress,
    videoDuration,
    videoPosition,
    isLoading,
    miniPlayerContext,
  ]);

  // Captura layout da barra de progresso
  const handleProgressBarLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
  }, []);

  // Alterna play/pause - usa sempre o mesmo video
  const handlePlayPause = useCallback(async () => {
    console.log('[PLAYER_HANDLE_PLAY_PAUSE] ==================== CHAMADO ====================');
    console.log('[PLAYER_HANDLE_PLAY_PAUSE] isPlaying ANTES:', isPlaying);
    console.log('[PLAYER_HANDLE_PLAY_PAUSE] isMinimized:', miniPlayerContext.isMinimized);
    console.log('[PLAYER_HANDLE_PLAY_PAUSE] isActive:', miniPlayerContext.isActive);

    const newIsPlaying = !isPlaying; //...Calcula novo estado

    if (videoRef.current) {
      if (Platform.OS === 'web') {
        // Web: usa metodos nativos do HTMLVideoElement
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          videoRef.current.play();
        }
      } else {
        // Mobile: usa metodos do expo-av
        if (isPlaying) {
          await videoRef.current.pauseAsync();
        } else {
          await videoRef.current.playAsync();
        }
      }
    }

    // Atualiza estado local E contexto simultaneamente
    setIsPlaying(newIsPlaying);
    miniPlayerContext.updateVideoState({ isPlaying: newIsPlaying });

    setShowControls(true); //.........Mostra controles do player principal
    setShowMiniControls(true); //.....Mostra controles do mini player

    console.log('[PLAYER_HANDLE_PLAY_PAUSE] isPlaying DEPOIS:', newIsPlaying);
    console.log('[PLAYER_HANDLE_PLAY_PAUSE] ================================================================');
  }, [isPlaying, miniPlayerContext]);

  // Mostra controles ao tocar no video
  const handleVideoPress = useCallback(() => {
    setShowControls(true);
  }, []);

  // Captura layout do container de video e informa ao contexto (para CSS positioning)
  const handleVideoContainerLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log('[DEBUG_LAYOUT] onLayout chamado:', { x, y, width, height });

    // Captura coordenadas absolutas na tela
    if (videoContainerRef.current && Platform.OS === 'web') {
      // Web: usa getBoundingClientRect
      const element = videoContainerRef.current as any;
      const rect = element.getBoundingClientRect?.();
      if (rect) {
        console.log('[DEBUG_LAYOUT] getBoundingClientRect:', {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
        miniPlayerContext.setExpandedVideoLayout({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    } else if (videoContainerRef.current) {
      // Mobile: usa measureInWindow
      videoContainerRef.current.measureInWindow((fx: number, fy: number, fwidth: number, fheight: number) => {
        console.log('[DEBUG_LAYOUT] measureInWindow:', {
          top: fy,
          left: fx,
          width: fwidth,
          height: fheight,
        });
        miniPlayerContext.setExpandedVideoLayout({
          top: fy,
          left: fx,
          width: fwidth,
          height: fheight,
        });
      });
    }
  }, [miniPlayerContext]);

  // Mostra controles ao tocar no mini player
  const handleMiniPlayerPress = useCallback(() => {
    setShowMiniControls(true);
  }, []);

  // Vai para aula anterior
  const handlePrevious = useCallback(() => {
    if (currentLessonIndex > 0) {
      const newIndex = currentLessonIndex - 1;
      setCurrentLessonIndex(newIndex); //..Atualiza estado local (card selecionado)
      miniPlayerContext.previousLesson(); //..Atualiza contexto (troca video)
    }
  }, [currentLessonIndex, miniPlayerContext]);

  // Vai para proxima aula
  const handleNext = useCallback(() => {
    if (currentLessonIndex < contents.length - 1) {
      const newIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(newIndex); //..Atualiza estado local (card selecionado)
      miniPlayerContext.nextLesson(); //..Atualiza contexto (troca video)
    }
  }, [currentLessonIndex, contents.length, miniPlayerContext]);

  // Seleciona aula da lista
  const handleSelectLesson = useCallback((index: number) => {
    setCurrentLessonIndex(index); //..Atualiza estado local (card selecionado)
    miniPlayerContext.selectLesson(index); //..Atualiza contexto (troca video)
  }, [miniPlayerContext]);

  // Alterna autoplay
  const handleToggleAutoplay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  // Abre modal de detalhes da aula
  const handleOpenLessonDetails = useCallback((index: number) => {
    setSelectedLessonForDetails(index);
    setShowLessonDetailsModal(true);
  }, []);

  // Fecha modal de detalhes da aula
  const handleCloseLessonDetails = useCallback(() => {
    setShowLessonDetailsModal(false);
  }, []);

  // Alterna modo tela cheia
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    setShowControls(true);
  }, []);

  // Cicla entre os 3 tamanhos do mini player (1 -> 2 -> 3 -> 1)
  // Usa contexto global como unica fonte de verdade
  const handleExpandSize = useCallback(() => {
    miniPlayerContext.cycleMiniPlayerSize();
  }, [miniPlayerContext]);

  // Fecha o mini player e volta ao estado inicial (player no topo)
  // Video unico - nao precisa de sincronizacao, apenas muda estado
  // NAO reseta o tamanho para preservar preferencia do usuario
  const handleCloseMiniPlayer = useCallback(() => {
    // Volta ao estado inicial (player no topo)
    setIsMinimized(false);
    setShowControls(true);
  }, []);

  // Minimiza o player principal para o mini player flutuante
  const handleMinimize = useCallback(() => {
    // Se contexto nao esta ativo, ativa
    if (!miniPlayerContext.isActive) {
      const simpleLessonsList = contents.map(c => ({ id: c.id, title: c.title }));
      miniPlayerContext.activate(trainingId, currentLessonIndex, simpleLessonsList);
    }

    // Atualiza estado
    miniPlayerContext.updateVideoState({
      isPlaying,
      progress: videoProgress,
      duration: videoDuration,
      position: videoPosition,
      isLoading,
    });

    // Minimiza (move video para global)
    miniPlayerContext.minimize();

    // Marca estado local
    setIsMinimized(true);
  }, [
    miniPlayerContext,
    contents,
    trainingId,
    currentLessonIndex,
    isPlaying,
    videoProgress,
    videoDuration,
    videoPosition,
    isLoading,
  ]);

  // Formata tempo do video em mm:ss
  const formatVideoTime = (milliseconds: number) => {
    // Valida entrada para evitar NaN
    if (!milliseconds || isNaN(milliseconds) || !isFinite(milliseconds)) {
      return '0:00';
    }
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  // Se fontes nao carregaram ou treinamento nao existe
  if (!fontsLoaded || !training || !currentLesson) return null;

  // Verifica se deve mostrar imagem de capa (quando video esta minimizado)
  const shouldShowCover = miniPlayerContext.isMinimized;

  // Progresso a exibir no mini player LOCAL (local durante seeking, do estado quando nao seeking)
  const displayMiniProgress = isSeeking ? localMiniProgress : videoProgress;

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Area do Video ou Imagem Estatica */}
      <TouchableOpacity
        ref={videoContainerRef}
        style={[
          styles.videoContainer,
          (isFullscreen || isLandscape) && styles.videoContainerFullscreen,
          isLandscape && { width: windowWidth, height: windowHeight },
        ]}
        onPress={handleVideoPress}
        onLayout={handleVideoContainerLayout}
        activeOpacity={1}
      >
        {/* VIDEO NAO E MAIS RENDERIZADO AQUI! */}
        {/* Video esta sempre no GlobalMiniPlayer com CSS positioning */}
        {/* Aqui e apenas um placeholder vazio */}

        {/* Capa da Aula (visivel quando mini player local OU global esta ativo) */}
        {shouldShowCover && (
          <>
            <View style={[styles.lessonCoverContainer, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }]}>
              <Image
                source={getLessonCover(currentLessonIndex)}
                style={styles.lessonCoverImage}
                resizeMode="contain"
              />
            </View>
            {/* Botao Voltar - canto superior esquerdo */}
            <TouchableOpacity
              style={styles.lessonCoverBackButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <BackArrowIcon color={COLORS.white} />
            </TouchableOpacity>
          </>
        )}

        {/* Loading Indicator */}
        {isLoading && !shouldShowCover && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {/* Controles (visiveis quando showControls = true e NAO mostrando capa) */}
        {/* OCULTOS quando wrapper fixed esta ativo (para evitar duplicacao) */}
        {showControls && !shouldShowCover && !(miniPlayerContext.isActive && !miniPlayerContext.isMinimized && Platform.OS === 'web') && (
          <>
            {/* Container Botoes Esquerda (Voltar + Minimizar) */}
            <View style={styles.leftButtonsContainer}>
              {/* Botao Voltar (Seta para tela anterior) - ACIMA */}
              <TouchableOpacity
                style={styles.backArrowButton}
                onPress={handleGoBack}
                activeOpacity={0.7}
              >
                <BackArrowIcon color={COLORS.white} />
              </TouchableOpacity>

              {/* Botao Minimizar (Seta para baixo) - ABAIXO */}
              {/* Sempre ativa o mini player (sai do fullscreen se necessario) */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false); //..Sai do fullscreen
                  }
                  handleMinimize(); //..Ativa o mini player
                }}
                activeOpacity={0.7}
              >
                <ChevronDownIcon color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Controles Superiores Direita (Autoplay + Settings) */}
            <View style={styles.topControlsContainer}>
              {/* Toggle Autoplay */}
              <TouchableOpacity
                onPress={handleToggleAutoplay}
                activeOpacity={0.7}
              >
                <AutoplayIcon color={COLORS.white} active={autoPlay} />
              </TouchableOpacity>

              {/* Botao Configuracoes */}
              <TouchableOpacity
                onPress={() => setShowSettingsModal(true)}
                activeOpacity={0.7}
              >
                <SettingsIcon color={COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Controles Centrais */}
            <View style={styles.videoCenterControls}>
              {/* Botao Anterior */}
              <TouchableOpacity
                style={[styles.skipButton, currentLessonIndex === 0 && styles.skipButtonDisabled]}
                onPress={handlePrevious}
                disabled={currentLessonIndex === 0}
                activeOpacity={0.7}
              >
                <PreviousIcon color={currentLessonIndex === 0 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
              </TouchableOpacity>

              {/* Botao Play/Pause */}
              <TouchableOpacity
                style={styles.playButton}
                onPress={handlePlayPause}
                activeOpacity={0.7}
              >
                {isPlaying ? (
                  <PauseIcon color={COLORS.white} size={33} />
                ) : (
                  <PlayIcon color={COLORS.white} size={33} />
                )}
              </TouchableOpacity>

              {/* Botao Proximo */}
              <TouchableOpacity
                style={[styles.skipButton, currentLessonIndex === contents.length - 1 && styles.skipButtonDisabled]}
                onPress={handleNext}
                disabled={currentLessonIndex === contents.length - 1}
                activeOpacity={0.7}
              >
                <NextIcon color={currentLessonIndex === contents.length - 1 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
              </TouchableOpacity>
            </View>

            {/* Barra de Progresso com Indicador (interativa com drag) */}
            <View
              ref={progressBarRef}
              style={[
                styles.progressBarContainer,
                (isLandscape || isFullscreen) && {
                  bottom: PROGRESS_BAR_EXPANDED_BOTTOM,
                  left: PROGRESS_BAR_EXPANDED_LEFT,
                  right: PROGRESS_BAR_EXPANDED_RIGHT,
                },
              ]}
              onLayout={handleProgressBarLayout}
              {...progressPanResponder.panHandlers}
            >
              {/* Barra visual (cinza + azul) - vai de ponta a ponta */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${miniPlayerContext.videoProgress}%` }]} />
              </View>
              {/* Track da bolinha - com margem para nao cortar */}
              <View style={styles.progressBarTrack} pointerEvents="none">
                <View style={[styles.progressIndicator, { left: `${miniPlayerContext.videoProgress}%` }]} />
              </View>
            </View>

            {/* Badge de Tempo - estilos por estado */}
            <View style={[
              styles.timeBadge,
              // Estado Landscape (celular virado)
              isLandscape && {
                bottom: LANDSCAPE_TIME_BADGE_BOTTOM,
                left: LANDSCAPE_TIME_BADGE_LEFT,
              },
              // Estado Fullscreen (expandido, mas nao landscape)
              !isLandscape && isFullscreen && {
                bottom: FULLSCREEN_TIME_BADGE_BOTTOM,
                left: FULLSCREEN_TIME_BADGE_LEFT,
              },
              // Estado Normal (padrao)
              !isLandscape && !isFullscreen && {
                bottom: NORMAL_TIME_BADGE_BOTTOM,
                left: NORMAL_TIME_BADGE_LEFT,
              },
            ]}>
              <Text style={styles.timeBadgeText}>
                {formatVideoTime(miniPlayerContext.videoPosition)}/{formatVideoTime(miniPlayerContext.videoDuration)}
              </Text>
            </View>

            {/* Botao Tela Cheia - estilos por estado */}
            <View style={[
              styles.fullscreenButtonContainer,
              // Estado Landscape (celular virado)
              isLandscape && {
                bottom: LANDSCAPE_FULLSCREEN_BTN_BOTTOM,
                right: LANDSCAPE_FULLSCREEN_BTN_RIGHT,
              },
              // Estado Fullscreen (expandido, mas nao landscape)
              !isLandscape && isFullscreen && {
                bottom: FULLSCREEN_BTN_BOTTOM,
                right: FULLSCREEN_BTN_RIGHT,
              },
              // Estado Normal (padrao)
              !isLandscape && !isFullscreen && {
                bottom: NORMAL_FULLSCREEN_BTN_BOTTOM,
                right: NORMAL_FULLSCREEN_BTN_RIGHT,
              },
            ]}>
              <TouchableOpacity
                style={styles.fullscreenButton}
                onPress={handleToggleFullscreen}
                activeOpacity={0.7}
              >
                <FullscreenIcon color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </>
        )}
      </TouchableOpacity>

      {/* WRAPPER FIXED PARA CONTROLES (usando React Portal para renderizar no body) */}
      {/* Renderizado APENAS quando video esta expandido */}
      {(() => {
        const shouldRenderWrapper = miniPlayerContext.isActive && !miniPlayerContext.isMinimized && miniPlayerContext.expandedVideoLayout && Platform.OS === 'web';
        console.log('[DEBUG_WRAPPER] ========================================');
        console.log('[DEBUG_WRAPPER] Checando se deve renderizar wrapper:', {
          shouldRender: shouldRenderWrapper,
          isActive: miniPlayerContext.isActive,
          isMinimized: miniPlayerContext.isMinimized,
          hasLayout: !!miniPlayerContext.expandedVideoLayout,
          layout: miniPlayerContext.expandedVideoLayout,
          platform: Platform.OS,
          showControls,
          shouldShowCover,
        });
        console.log('[DEBUG_WRAPPER] ========================================');

        if (!shouldRenderWrapper || typeof document === 'undefined') {
          return null;
        }

        const wrapperContent = (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              console.log('[WRAPPER_CLICK] Wrapper clicado! showControls:', showControls);
              if (!showControls) {
                console.log('[WRAPPER_CLICK] Mostrando controles');
                setShowControls(true);
                setShowMiniControls(true);
              }
            }}
            style={(() => {
              const style = {
                position: 'fixed' as any,
                top: miniPlayerContext.expandedVideoLayout?.top || 0,
                left: miniPlayerContext.expandedVideoLayout?.left || 0,
                width: miniPlayerContext.expandedVideoLayout?.width || SCREEN_WIDTH,
                height: miniPlayerContext.expandedVideoLayout?.height || VIDEO_HEIGHT,
                zIndex: 2147483647, //..........zIndex maximo (32-bit integer max)
                pointerEvents: 'auto' as any, //..Permite cliques no wrapper para mostrar controles
              };
              return style;
            })()}
          >
          {/* Controles (visiveis quando showControls = true e NAO mostrando capa) */}
          {(() => {
            const shouldRenderControls = showControls && !shouldShowCover;
            console.log('[DEBUG_CONTROLS_WRAPPER] Renderizando controles no wrapper?', {
              shouldRender: shouldRenderControls,
              showControls,
              shouldShowCover,
            });
            return shouldRenderControls;
          })() && (() => {
            console.log('[DEBUG_BUTTONS] ========== Renderizando botoes no wrapper fixed! ==========');
            return (
            <>
              {/* Container Botoes Esquerda (Voltar + Minimizar) */}
              <View style={[styles.leftButtonsContainer, { pointerEvents: 'auto' as any, zIndex: 1000000 }]}>
                {/* Botao Voltar (Seta para tela anterior) - ACIMA */}
                <TouchableOpacity
                  style={styles.backArrowButton}
                  onPress={() => {
                    console.log('[CLICK_TEST] Botao VOLTAR clicado!');
                    handleGoBack();
                  }}
                  activeOpacity={0.7}
                >
                  <BackArrowIcon color={COLORS.white} />
                </TouchableOpacity>

                {/* Botao Minimizar (Seta para baixo) - ABAIXO */}
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    console.log('[CLICK_TEST] Botao MINIMIZAR clicado!');
                    if (isFullscreen) {
                      setIsFullscreen(false);
                    }
                    handleMinimize();
                  }}
                  activeOpacity={0.7}
                >
                  <ChevronDownIcon color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Controles Superiores Direita (Autoplay + Settings) */}
              <View style={[styles.topControlsContainer, { pointerEvents: 'auto' as any, zIndex: 1000000 }]}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('[CLICK_TEST] Botao AUTOPLAY clicado!');
                    handleToggleAutoplay();
                  }}
                  activeOpacity={0.7}
                >
                  <AutoplayIcon color={COLORS.white} active={autoPlay} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    console.log('[CLICK_TEST] Botao SETTINGS clicado!');
                    setShowSettingsModal(true);
                  }}
                  activeOpacity={0.7}
                >
                  <SettingsIcon color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Controles Centrais */}
              <View style={[styles.videoCenterControls, { pointerEvents: 'auto' as any }]}>
                <TouchableOpacity
                  style={[styles.skipButton, currentLessonIndex === 0 && styles.skipButtonDisabled]}
                  onPress={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  activeOpacity={0.7}
                >
                  <PreviousIcon color={currentLessonIndex === 0 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.playButton}
                  onPress={handlePlayPause}
                  activeOpacity={0.7}
                >
                  {isPlaying ? (
                    <PauseIcon color={COLORS.white} size={33} />
                  ) : (
                    <PlayIcon color={COLORS.white} size={33} />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.skipButton, currentLessonIndex === contents.length - 1 && styles.skipButtonDisabled]}
                  onPress={handleNext}
                  disabled={currentLessonIndex === contents.length - 1}
                  activeOpacity={0.7}
                >
                  <NextIcon color={currentLessonIndex === contents.length - 1 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Barra de Progresso */}
              <View
                ref={progressBarRef}
                style={[
                  styles.progressBarContainer,
                  (isLandscape || isFullscreen) && {
                    bottom: PROGRESS_BAR_EXPANDED_BOTTOM,
                    left: PROGRESS_BAR_EXPANDED_LEFT,
                    right: PROGRESS_BAR_EXPANDED_RIGHT,
                  },
                  { pointerEvents: 'auto' as any },
                ]}
                onLayout={handleProgressBarLayout}
                {...progressPanResponder.panHandlers}
              >
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${miniPlayerContext.videoProgress}%` }]} />
                </View>
                <View style={styles.progressBarTrack} pointerEvents="none">
                  <View style={[styles.progressIndicator, { left: `${miniPlayerContext.videoProgress}%` }]} />
                </View>
              </View>

              {/* Badge de Tempo */}
              <View style={[
                styles.timeBadge,
                isLandscape && {
                  bottom: LANDSCAPE_TIME_BADGE_BOTTOM,
                  left: LANDSCAPE_TIME_BADGE_LEFT,
                },
                !isLandscape && isFullscreen && {
                  bottom: FULLSCREEN_TIME_BADGE_BOTTOM,
                  left: FULLSCREEN_TIME_BADGE_LEFT,
                },
                !isLandscape && !isFullscreen && {
                  bottom: NORMAL_TIME_BADGE_BOTTOM,
                  left: NORMAL_TIME_BADGE_LEFT,
                },
                { pointerEvents: 'none' as any },
              ]}>
                <Text style={styles.timeBadgeText}>
                  {formatVideoTime(miniPlayerContext.videoPosition)}/{formatVideoTime(miniPlayerContext.videoDuration)}
                </Text>
              </View>

              {/* Botao Tela Cheia */}
              <View style={[
                styles.fullscreenButtonContainer,
                isLandscape && {
                  bottom: LANDSCAPE_FULLSCREEN_BTN_BOTTOM,
                  right: LANDSCAPE_FULLSCREEN_BTN_RIGHT,
                },
                !isLandscape && isFullscreen && {
                  bottom: FULLSCREEN_BTN_BOTTOM,
                  right: FULLSCREEN_BTN_RIGHT,
                },
                !isLandscape && !isFullscreen && {
                  bottom: NORMAL_FULLSCREEN_BTN_BOTTOM,
                  right: NORMAL_FULLSCREEN_BTN_RIGHT,
                },
                { pointerEvents: 'auto' as any },
              ]}>
                <TouchableOpacity
                  style={styles.fullscreenButton}
                  onPress={handleToggleFullscreen}
                  activeOpacity={0.7}
                >
                  <FullscreenIcon color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </>
            );
          })()}
          </TouchableOpacity>
        );

        // Usa React Portal para renderizar diretamente no body
        return ReactDOM.createPortal(wrapperContent, document.body);
      })()}

      {/* Descricao da Aula (oculta em fullscreen e landscape) - Clicavel para abrir modal */}
      {!isFullscreen && !isLandscape && (
        <TouchableOpacity
          style={styles.descriptionContainer}
          onPress={() => handleOpenLessonDetails(currentLessonIndex)}
          activeOpacity={0.7}
        >
          <Text style={styles.descriptionText} numberOfLines={3}>
            {currentLesson.description || 'Aprenda os conceitos fundamentais desta aula e aplique o conhecimento adquirido.'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Divisoria Fina (oculta em fullscreen e landscape) */}
      {!isFullscreen && !isLandscape && <View style={styles.thinDivider} />}

      {/* Lista de Todas as Aulas (oculta em fullscreen e landscape) */}
      {!isFullscreen && !isLandscape && (
        <View style={styles.lessonsContainer}>
          <ScrollView
            style={styles.lessonsList}
            showsVerticalScrollIndicator={false}
          >
            {contents.map((item, idx) => (
              <LessonCardItem
                key={item.id}
                item={item}
                index={idx}
                isActive={idx === currentLessonIndex}
                onPress={() => handleSelectLesson(idx)}
                onDetailsPress={() => handleOpenLessonDetails(idx)}
              />
            ))}
          </ScrollView>
        </View>
      )}


      {/* Modal de Configuracoes do Player */}
      <VideoSettingsModal
        visible={showSettingsModal}
        onRequestClose={() => setShowSettingsModal(false)}
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
        captionsEnabled={captionsEnabled}
        setCaptionsEnabled={setCaptionsEnabled}
        repeatEnabled={repeatEnabled}
        setRepeatEnabled={setRepeatEnabled}
      />

      {/* Modal de Detalhes da Aula */}
      <LessonDetailsModal
        visible={showLessonDetailsModal}
        onClose={handleCloseLessonDetails}
        lesson={contents[selectedLessonForDetails] || null}
        lessonIndex={selectedLessonForDetails}
        lessonImage={getLessonCover(selectedLessonForDetails)}
      />
    </View>
  );
};

export default TrainingPlayerScreen;
