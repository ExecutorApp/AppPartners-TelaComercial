import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
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
  MINI_PLAYER_WIDTH_SMALL,
  MINI_PLAYER_HEIGHT_SMALL,
  MINI_PLAYER_WIDTH_MEDIUM,
  MINI_PLAYER_HEIGHT_MEDIUM,
  MINI_PLAYER_MARGIN_RIGHT,
  MINI_PLAYER_MARGIN_BOTTOM,
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
} from './07.Training-PlayerStyles';

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

// Posicao inicial do Mini Player (canto inferior direito - tamanho pequeno)
const MINI_PLAYER_INITIAL_X = SCREEN_WIDTH - MINI_PLAYER_WIDTH_SMALL - MINI_PLAYER_MARGIN_RIGHT; //..15px da direita
const MINI_PLAYER_INITIAL_Y = SCREEN_HEIGHT - MINI_PLAYER_HEIGHT_SMALL - MINI_PLAYER_MARGIN_BOTTOM; //..15px de baixo

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
  require('../../../assets/Aula01.png'), //..Capa Aula 1
  require('../../../assets/Aula02.png'), //..Capa Aula 2
  require('../../../assets/Aula03.png'), //..Capa Aula 3
  require('../../../assets/Aula04.png'), //..Capa Aula 4
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
  onPress: () => void; //.........Callback ao clicar
}

const LessonCardItem: React.FC<LessonCardItemProps> = ({
  item,
  index,
  isActive,
  onPress,
}) => {
  // Formata numero da aula com 2 digitos
  const lessonNumber = String(index + 1).padStart(2, '0');

  // Determina cor do indicador de status baseado no estado de conclusao
  const getStatusColor = () => {
    if (item.completed) {
      return COLORS.primary;
    }
    return COLORS.textSecondary;
  };

  // Calcula porcentagem da aula baseado no status
  const getLessonProgress = () => {
    if (item.completed) {
      return '100%';
    }
    return '00%';
  };

  return (
    <TouchableOpacity
      style={[styles.lessonCard, isActive && styles.lessonCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Container do Numero da Aula */}
      <View style={styles.lessonNumberContainer}>
        <Text style={styles.lessonNumberText}>
          {lessonNumber}
        </Text>
      </View>

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

  // Referencia do video (HTMLVideoElement para web, Video para mobile)
  const videoRef = useRef<any>(null);

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
  const [isFullscreen, setIsFullscreen] = useState(false); //.....Modo tela cheia
  const [miniPlayerSize, setMiniPlayerSize] = useState<1 | 2 | 3>(1); //..Tamanho do mini player (1=pequeno, 2=medio, 3=grande)
  const [showMiniControls, setShowMiniControls] = useState(true); //.......Visibilidade dos controles do mini player
  const panPosition = useRef(new Animated.ValueXY({ x: MINI_PLAYER_INITIAL_X, y: MINI_PLAYER_INITIAL_Y })).current;

  // Calcula dimensoes do mini player baseado no tamanho atual
  const getMiniPlayerDimensions = useCallback(() => {
    switch (miniPlayerSize) {
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
  }, [miniPlayerSize]);

  // Estado e refs para seek na barra de progresso
  const [progressBarWidth, setProgressBarWidth] = useState(0); //..Largura da barra de progresso
  const [isSeeking, setIsSeeking] = useState(false); //............Se esta fazendo seek
  const progressBarRef = useRef<View>(null); //...................Ref da barra de progresso
  const progressBarWidthRef = useRef(0); //.......................Ref largura (para PanResponder)
  const videoDurationRef = useRef(0); //..........................Ref duracao (para PanResponder)
  const videoRefForSeek = useRef<any>(null); //...................Ref video (para PanResponder)

  // Aula atual
  const currentLesson = contents[currentLessonIndex];

  // Mantem refs sincronizadas com estados (para PanResponder acessar valores atuais)
  useEffect(() => {
    progressBarWidthRef.current = progressBarWidth;
  }, [progressBarWidth]);

  useEffect(() => {
    videoDurationRef.current = videoDuration;
  }, [videoDuration]);

  useEffect(() => {
    videoRefForSeek.current = videoRef.current;
  }, [videoRef.current]);

  // Ajusta posicao do mini player quando tamanho muda (mantendo margem de 10px)
  useEffect(() => {
    if (isMinimized && miniPlayerSize > 1) {
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
  }, [miniPlayerSize, isMinimized, getMiniPlayerDimensions, panPosition]);

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
  }, [miniPlayerSize, getMiniPlayerDimensions]);

  // PanResponder para arrastar o mini player (nao responde na barra de progresso)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        // Verifica se o toque esta na regiao da barra de progresso (25px do fundo)
        const touchY = evt.nativeEvent.locationY;
        const isInProgressArea = touchY > miniPlayerHeightRef.current - 25;
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
        const isInProgressArea = touchY > miniPlayerHeightRef.current - 25;
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
  const progressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, //..........Inicia resposta ao toque
      onMoveShouldSetPanResponder: () => true, //...........Continua respondendo ao movimento
      onPanResponderGrant: (evt) => {
        // Toque inicial - calcula e aplica seek
        setIsSeeking(true);
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        // Aplica seek imediato
        applySeekFromPercentage(percentage);
      },
      onPanResponderMove: (evt) => {
        // Arrastando - atualiza posicao em tempo real
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        // Atualiza UI imediatamente
        setVideoProgress(percentage);
        const duration = videoDurationRef.current;
        if (duration > 0) {
          setVideoPosition((percentage / 100) * duration);
        }
      },
      onPanResponderRelease: (evt) => {
        // Soltou - finaliza seek no video
        const { locationX } = evt.nativeEvent;
        const barWidth = progressBarWidthRef.current || SCREEN_WIDTH;
        const trackWidth = barWidth - 14; //................Desconta margens da bolinha
        const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
        const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));
        // Aplica seek final
        applySeekFromPercentage(percentage);
        setIsSeeking(false);
      },
    })
  ).current;

  // Funcao auxiliar para aplicar seek (usada pelo PanResponder)
  const applySeekFromPercentage = async (percentage: number) => {
    const video = videoRefForSeek.current;
    const duration = videoDurationRef.current;
    if (video && duration > 0) {
      const clampedPercentage = Math.max(0, Math.min(100, percentage));
      const newPosition = (clampedPercentage / 100) * duration;
      if (Platform.OS === 'web') {
        video.currentTime = newPosition / 1000; //..........Converte ms para segundos
      } else {
        await video.setPositionAsync(newPosition);
      }
      setVideoPosition(newPosition);
      setVideoProgress(clampedPercentage);
    }
  };

  // Funcao reutilizavel para calcular e aplicar seek no mini player
  const handleMiniProgressSeek = (evt: any, applyToVideo: boolean = true) => {
    const { locationX } = evt.nativeEvent;
    const barWidth = miniProgressBarWidthRef.current || MINI_PLAYER_WIDTH_SMALL;
    const trackWidth = barWidth - 14; //................Desconta margens da bolinha
    const touchX = Math.max(0, locationX - 7); //......Posicao relativa ao track
    const percentage = Math.max(0, Math.min(100, (touchX / trackWidth) * 100));

    // Atualiza UI imediatamente
    setVideoProgress(percentage);
    const duration = videoDurationRef.current;
    if (duration > 0) {
      setVideoPosition((percentage / 100) * duration);
    }

    // Aplica seek no video se solicitado
    if (applyToVideo) {
      applySeekFromPercentage(percentage);
    }
  };

  // PanResponder para arrastar barra de progresso do mini player
  const miniProgressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true, //..........Inicia resposta ao toque
      onMoveShouldSetPanResponder: () => true, //...........Continua respondendo ao movimento
      onStartShouldSetPanResponderCapture: () => true, //...Captura eventos antes de propagar
      onMoveShouldSetPanResponderCapture: () => true, //....Captura movimento antes de propagar
      onPanResponderTerminationRequest: () => false, //.....Nao permite interrupcao
      onPanResponderGrant: (evt) => {
        // Toque inicial - marca como seeking e aplica seek
        setIsSeeking(true);
        handleMiniProgressSeek(evt, true);
      },
      onPanResponderStart: (evt) => {
        // Backup - garante que seek seja aplicado no inicio do gesto
        handleMiniProgressSeek(evt, true);
      },
      onPanResponderMove: (evt) => {
        // Arrastando - atualiza UI sem aplicar seek no video (performance)
        handleMiniProgressSeek(evt, false);
      },
      onPanResponderRelease: (evt) => {
        // Soltou - aplica seek final no video
        handleMiniProgressSeek(evt, true);
        setIsSeeking(false);
      },
    })
  ).current;

  // Callback para capturar largura da barra de progresso do mini player
  const handleMiniProgressBarLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    miniProgressBarWidthRef.current = width;
  }, []);

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
  useEffect(() => {
    setVideoProgress(0);
    setVideoPosition(0);
    setIsPlaying(false);
    setIsLoading(true);
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.currentTime = 0;
      } else {
        videoRef.current.setPositionAsync(0);
      }
    }
  }, [currentLessonIndex]);

  // Callback de status do video (mobile)
  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setVideoDuration(status.durationMillis || 0);
      // Ignora atualizacoes de posicao durante o seek
      if (!isSeeking) {
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
          setTimeout(() => {
            setCurrentLessonIndex(prev => prev + 1);
          }, 500);
        }
      }
    }
  }, [autoPlay, currentLessonIndex, contents.length, isSeeking]);

  // Handlers para web
  const handleWebTimeUpdate = useCallback(() => {
    // Ignora atualizacoes durante o seek
    if (isSeeking) return;
    if (videoRef.current && Platform.OS === 'web') {
      const video = videoRef.current;
      setVideoPosition(video.currentTime * 1000);
      setVideoDuration(video.duration * 1000);
      if (video.duration > 0) {
        setVideoProgress((video.currentTime / video.duration) * 100);
      }
    }
  }, [isSeeking]);

  const handleWebLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Evento adicional para garantir que loading seja removido
  const handleWebCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleWebEnded = useCallback(() => {
    setIsPlaying(false);
    setShowControls(true);
    // Autoplay: avanca para proxima aula se ativado
    if (autoPlay && currentLessonIndex < contents.length - 1) {
      setTimeout(() => {
        setCurrentLessonIndex(prev => prev + 1);
      }, 500);
    }
  }, [autoPlay, currentLessonIndex, contents.length]);

  const handleWebPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleWebPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Volta para tela anterior
  const handleGoBack = useCallback(() => {
    // Pausa o video antes de voltar
    if (videoRef.current) {
      if (Platform.OS === 'web') {
        videoRef.current.pause();
      } else {
        videoRef.current.pauseAsync();
      }
    }
    // Navega para tela anterior
    navigation.goBack();
  }, [navigation]);

  // Captura layout da barra de progresso
  const handleProgressBarLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
  }, []);

  // Alterna play/pause
  const handlePlayPause = useCallback(async () => {
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
    setShowControls(true); //.........Mostra controles do player principal
    setShowMiniControls(true); //.....Mostra controles do mini player
  }, [isPlaying]);

  // Mostra controles ao tocar no video
  const handleVideoPress = useCallback(() => {
    setShowControls(true);
  }, []);

  // Mostra controles ao tocar no mini player
  const handleMiniPlayerPress = useCallback(() => {
    setShowMiniControls(true);
  }, []);

  // Vai para aula anterior
  const handlePrevious = useCallback(() => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  }, [currentLessonIndex]);

  // Vai para proxima aula
  const handleNext = useCallback(() => {
    if (currentLessonIndex < contents.length - 1) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  }, [currentLessonIndex, contents.length]);

  // Seleciona aula da lista
  const handleSelectLesson = useCallback((index: number) => {
    setCurrentLessonIndex(index);
  }, []);

  // Alterna autoplay
  const handleToggleAutoplay = useCallback(() => {
    setAutoPlay(prev => !prev);
  }, []);

  // Alterna modo tela cheia
  const handleToggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
    setShowControls(true);
  }, []);

  // Cicla entre os 3 tamanhos do mini player (1 -> 2 -> 3 -> 1)
  const handleExpandSize = useCallback(() => {
    setMiniPlayerSize(prev => {
      const nextSize = prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3);
      return nextSize;
    });
  }, []);

  // Fecha o mini player e volta ao estado inicial (player no topo)
  const handleCloseMiniPlayer = useCallback(() => {
    // Reseta tamanho para pequeno
    setMiniPlayerSize(1);
    // Volta ao estado inicial (player no topo)
    setIsMinimized(false);
    setShowControls(true);
  }, []);

  // Formata tempo do video em mm:ss
  const formatVideoTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  // Se fontes nao carregaram ou treinamento nao existe
  if (!fontsLoaded || !training || !currentLesson) return null;

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Area do Video ou Imagem Estatica */}
      <TouchableOpacity
        style={[
          styles.videoContainer,
          (isFullscreen || isLandscape) && styles.videoContainerFullscreen,
          isLandscape && { width: windowWidth, height: windowHeight },
        ]}
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        {/* Player de Video (visivel quando NAO minimizado) */}
        {!isMinimized ? (
          <>
            {Platform.OS === 'web' ? (
              <video
                ref={videoRef}
                src={getVideoUrl(currentLessonIndex)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#000',
                }}
                onTimeUpdate={handleWebTimeUpdate}
                onLoadedData={handleWebLoadedData}
                onCanPlay={handleWebCanPlay}
                onEnded={handleWebEnded}
                onPlay={handleWebPlay}
                onPause={handleWebPause}
                playsInline
              />
            ) : Video ? (
              <Video
                ref={videoRef}
                source={{ uri: getVideoUrl(currentLessonIndex) }}
                style={styles.video}
                resizeMode={ResizeMode?.CONTAIN}
                shouldPlay={false}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
            ) : null}
          </>
        ) : (
          /* Capa da Aula (visivel quando minimizado) */
          <>
            <View style={styles.lessonCoverContainer}>
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
        {isLoading && !isMinimized && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        )}

        {/* Controles (visiveis quando showControls = true e NAO minimizado) */}
        {showControls && !isMinimized && (
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
              {/* Se em fullscreen: sai do fullscreen. Se normal: vai para mini player */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  if (isFullscreen) {
                    setIsFullscreen(false);
                  } else {
                    setIsMinimized(true);
                  }
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
                (isLandscape || isFullscreen) && { bottom: 6 },
              ]}
              onLayout={handleProgressBarLayout}
              {...progressPanResponder.panHandlers}
            >
              {/* Barra visual (cinza + azul) - vai de ponta a ponta */}
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${videoProgress}%` }]} />
              </View>
              {/* Track da bolinha - com margem para nao cortar */}
              <View style={styles.progressBarTrack} pointerEvents="none">
                <View style={[styles.progressIndicator, { left: `${videoProgress}%` }]} />
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
                {formatVideoTime(videoPosition)}/{formatVideoTime(videoDuration)}
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

      {/* Descricao da Aula (oculta em fullscreen e landscape) */}
      {!isFullscreen && !isLandscape && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText} numberOfLines={3}>
            {currentLesson.description || 'Aprenda os conceitos fundamentais desta aula e aplique o conhecimento adquirido.'}
          </Text>
        </View>
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
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Mini Player Flutuante (PiP) - Acima de todos os elementos */}
      {isMinimized && (
        <Animated.View
          style={[
            styles.miniPlayerContainer,
            {
              width: getMiniPlayerDimensions().width, //.....Largura dinamica
              height: getMiniPlayerDimensions().height, //...Altura dinamica
              transform: [
                { translateX: panPosition.x },
                { translateY: panPosition.y },
              ],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Video no Mini Player */}
          <View style={styles.miniPlayerVideo}>
            {Platform.OS === 'web' ? (
              <video
                ref={videoRef}
                src={getVideoUrl(currentLessonIndex)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 12,
                  pointerEvents: 'none', //..Ignora cliques no video (previne pause automatico)
                }}
                onTimeUpdate={handleWebTimeUpdate}
                onLoadedData={handleWebLoadedData}
                onEnded={handleWebEnded}
                onPlay={handleWebPlay}
                onPause={handleWebPause}
                playsInline
              />
            ) : Video ? (
              <Video
                ref={videoRef}
                source={{ uri: getVideoUrl(currentLessonIndex) }}
                style={styles.miniVideo}
                resizeMode={ResizeMode?.COVER}
                shouldPlay={isPlaying}
                isLooping={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              />
            ) : null}
          </View>

          {/* Controles (visiveis quando showMiniControls = true) */}
          {showMiniControls && (
            <>
              {/* Botao Expandir - canto superior esquerdo (cicla tamanhos) */}
              <TouchableOpacity
                style={styles.miniPlayerExpandButton}
                onPress={handleExpandSize}
                activeOpacity={0.7}
              >
                <ExpandIcon color={COLORS.white} />
              </TouchableOpacity>

              {/* Botao Fechar (X) - canto superior direito */}
              <TouchableOpacity
                style={styles.miniPlayerCloseButton}
                onPress={handleCloseMiniPlayer}
                activeOpacity={0.7}
              >
                <CloseIcon color={COLORS.white} size={12} />
              </TouchableOpacity>

              {/* Controles Centrais (anterior + play + proximo) */}
              <View style={styles.miniPlayerCenterControls}>
                {/* Botao Anterior */}
                <TouchableOpacity
                  style={styles.miniPlayerSkipButton}
                  onPress={handlePrevious}
                  disabled={currentLessonIndex === 0}
                  activeOpacity={0.7}
                >
                  <PreviousIcon color={currentLessonIndex === 0 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
                </TouchableOpacity>

                {/* Botao Play/Pause */}
                <TouchableOpacity
                  style={styles.miniPlayerPlayButton}
                  onPress={handlePlayPause}
                  activeOpacity={0.7}
                >
                  {isPlaying ? (
                    <PauseIcon color={COLORS.white} size={20} />
                  ) : (
                    <PlayIcon color={COLORS.white} size={20} />
                  )}
                </TouchableOpacity>

                {/* Botao Proximo */}
                <TouchableOpacity
                  style={styles.miniPlayerSkipButton}
                  onPress={handleNext}
                  disabled={currentLessonIndex === contents.length - 1}
                  activeOpacity={0.7}
                >
                  <NextIcon color={currentLessonIndex === contents.length - 1 ? 'rgba(255,255,255,0.3)' : COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Barra de Progresso com Bolinha (igual ao player padrao) */}
              <View
                style={styles.miniPlayerProgressContainer}
                onLayout={handleMiniProgressBarLayout}
                {...miniProgressPanResponder.panHandlers}
              >
                <View style={styles.miniPlayerProgressBar}>
                  <View style={[styles.miniPlayerProgressFill, { width: `${videoProgress}%` }]} />
                </View>
                <View style={[styles.miniPlayerProgressIndicator, { left: `${videoProgress}%` }]} />
              </View>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default TrainingPlayerScreen;
