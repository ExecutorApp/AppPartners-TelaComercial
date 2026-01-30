import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { TrainingContentItem, COLORS } from './02.Training-Types';
import { VIDEO_HEIGHT } from './07.Training-PlayerStyles';
import { useMiniPlayer } from '../../context/MiniPlayerContext';

// ========================================
// ICONE DE RELOGIO (CLOCK)
// ========================================

interface ClockIconProps {
  color?: string; //..Cor do icone
  size?: number; //...Tamanho do icone
}

const ClockIcon: React.FC<ClockIconProps> = ({ color = '#FFFFFF', size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
      fill={color}
    />
  </Svg>
);

// ========================================
// CONSTANTES DO MODAL
// ========================================

const { height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Altura da tela

// Calcula altura do modal para ficar 10px abaixo da divisoria
// Video + Descricao (~65px) + Divisoria (1px) + Margem (10px) = VIDEO_HEIGHT + 76
const MODAL_TOP_OFFSET = VIDEO_HEIGHT + 76; //..................Distancia do topo ate o modal
const MODAL_HEIGHT = SCREEN_HEIGHT - MODAL_TOP_OFFSET; //.......Altura do modal

// ========================================
// TIPOS E INTERFACES
// ========================================

// Props do modal de detalhes da aula
interface LessonDetailsModalProps {
  visible: boolean; //..................Visibilidade do modal
  onClose: () => void; //...............Callback ao fechar
  lesson: TrainingContentItem | null; //..Dados da aula
  lessonIndex: number; //................Indice da aula (para exibir numero)
  lessonImage?: any; //..................Imagem da aula (opcional)
}

// ========================================
// COMPONENTE MODAL DETALHES DA AULA
// ========================================

const LessonDetailsModal: React.FC<LessonDetailsModalProps> = ({
  visible,
  onClose,
  lesson,
  lessonIndex,
  lessonImage,
}) => {
  // Contexto do mini player (para acessar progresso real)
  const { getRealProgress, getCurrentLessonProgress, videoDuration, formatVideoTime } = useMiniPlayer();

  // Estado para controlar visualizacao (description ou timeline)
  const [viewMode, setViewMode] = useState<'description' | 'timeline'>('description');

  // Valor animado para posicao do modal
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  // Anima entrada e saida do modal
  useEffect(() => {
    if (visible) {
      // Modal entrando - sobe de baixo
      Animated.timing(slideAnim, {
        toValue: 0, //..................Posicao final (visivel)
        duration: 300, //...............Duracao da animacao
        useNativeDriver: true, //.......Usa driver nativo para performance
      }).start();
    } else {
      // Modal saindo - desce para baixo
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT, //.......Posicao inicial (fora da tela)
        duration: 250, //...............Duracao da animacao
        useNativeDriver: true, //.......Usa driver nativo para performance
      }).start();
    }
  }, [visible, slideAnim]);

  // Formata numero da aula com 2 digitos
  const lessonNumber = String(lessonIndex + 1).padStart(2, '0');

  // Se nao tem aula, nao renderiza
  if (!lesson) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      {/* Overlay - area clicavel para fechar */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* Previne cliques no modal de fechar */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Barra de Arrasto (Handle) - sobre a imagem */}
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>

              {/* Imagem no Topo (ocupa toda a largura) */}
              {lessonImage && (
                <View style={styles.imageContainer}>
                  <Image
                    source={lessonImage}
                    style={styles.image}
                    resizeMode="cover"
                  />

                  {/* Botao de Toggle Timeline - canto inferior direito da imagem */}
                  <TouchableOpacity
                    style={styles.timelineToggleButton}
                    onPress={() => setViewMode(prev => prev === 'description' ? 'timeline' : 'description')}
                    activeOpacity={0.7}
                  >
                    <ClockIcon color={COLORS.white} size={20} />
                  </TouchableOpacity>
                </View>
              )}

              {/* Conteudo do Modal (titulo e descricao OU timeline) */}
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
              >
                {/* Titulo da Aula */}
                <Text style={styles.title}>
                  Aula {lessonNumber}: {lesson.title}
                </Text>

                {viewMode === 'description' ? (
                  /* Descricao Completa */
                  <Text style={styles.description}>
                    {lesson.description || 'Aprenda os conceitos fundamentais desta aula e aplique o conhecimento adquirido. Esta aula foi desenvolvida para proporcionar uma compreensao clara e objetiva do conteudo apresentado, permitindo que voce desenvolva suas habilidades de forma pratica e eficiente.\n\nNeste modulo, voce tera acesso a uma serie de recursos didaticos que facilitarao seu aprendizado. Os materiais foram cuidadosamente selecionados por especialistas na area, garantindo qualidade e relevancia para sua formacao profissional.\n\nAo longo das licoes, voce podera interagir com exercicios praticos que reforcarao os conceitos aprendidos. Cada atividade foi pensada para simular situacoes reais do dia a dia, preparando voce para os desafios do mercado de trabalho.\n\nAlem disso, disponibilizamos materiais complementares como PDFs, infograficos e links para artigos relevantes. Esses recursos adicionais ampliarao seu conhecimento e oferecerão diferentes perspectivas sobre o tema abordado.\n\nRecomendamos que voce assista a cada aula com atencao, fazendo anotacoes dos pontos principais. Ao final de cada modulo, revise suas anotacoes e tente aplicar os conceitos em projetos pessoais ou profissionais.\n\nCaso tenha duvidas durante o processo de aprendizagem, utilize a area de comentarios ou entre em contato com nosso suporte. Estamos aqui para ajuda-lo em sua jornada de desenvolvimento.\n\nLembre-se: o conhecimento so se consolida com a pratica constante. Dedique tempo para revisar o conteudo e realizar os exercicios propostos. Sua evolucao depende do seu comprometimento com o processo de aprendizagem.'}
                  </Text>
                ) : (
                  /* Timeline de Progresso */
                  <View style={styles.timelineContainer}>
                    {/* Informacoes de Duracao */}
                    <View style={styles.timelineInfo}>
                      <View style={styles.timelineInfoRow}>
                        <Text style={styles.timelineInfoLabel}>Duração total:</Text>
                        <Text style={styles.timelineInfoValue}>{formatVideoTime(videoDuration)}</Text>
                      </View>

                      <View style={styles.timelineInfoRow}>
                        <Text style={styles.timelineInfoLabel}>Progresso real:</Text>
                        <Text style={styles.timelineInfoValue}>
                          {lesson?.id ? getRealProgress(lesson.id).toFixed(1) : '0.0'}%
                        </Text>
                      </View>
                    </View>

                    {/* Visualizacao das Faixas Assistidas */}
                    <View style={styles.timelineVisualization}>
                      <Text style={styles.timelineVisualizationTitle}>Faixas assistidas:</Text>

                      {/* Barra de Progresso Visual */}
                      <View style={styles.timelineBar}>
                        {/* Fundo da barra (nao assistido) */}
                        <View style={styles.timelineBarBackground} />

                        {/* Faixas assistidas (overlay) */}
                        {getCurrentLessonProgress()?.watchedRanges.map((range, index) => {
                          const startPercent = videoDuration > 0 ? (range.start / videoDuration) * 100 : 0;
                          const widthPercent = videoDuration > 0 ? ((range.end - range.start) / videoDuration) * 100 : 0;

                          return (
                            <View
                              key={index}
                              style={[
                                styles.timelineBarSegment,
                                {
                                  left: `${startPercent}%`,
                                  width: `${widthPercent}%`,
                                },
                              ]}
                            />
                          );
                        })}
                      </View>

                      {/* Lista de Faixas */}
                      <View style={styles.timelineRangesList}>
                        {getCurrentLessonProgress()?.watchedRanges.length ? (
                          getCurrentLessonProgress()?.watchedRanges.map((range, index) => (
                            <View key={index} style={styles.timelineRangeItem}>
                              <Text style={styles.timelineRangeText}>
                                Faixa {index + 1}: {formatVideoTime(range.start)} - {formatVideoTime(range.end)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.timelineEmptyText}>
                            Nenhuma faixa assistida ainda. Comece a assistir a aula para ver seu progresso aqui.
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ========================================
// ESTILOS DO MODAL
// ========================================

const styles = StyleSheet.create({
  // Overlay Semi-transparente
  overlay: {
    flex: 1, //.........................Ocupa tela inteira
    backgroundColor: 'rgba(0,0,0,0.5)', //..Fundo escuro semi-transparente
    justifyContent: 'flex-end', //......Alinha modal na parte inferior
  },

  // Container do Modal
  modalContainer: {
    height: MODAL_HEIGHT, //............Altura calculada ate a divisoria
    backgroundColor: '#000000', //.....Fundo preto escuro
    borderTopLeftRadius: 24, //........Arredondamento superior esquerdo
    borderTopRightRadius: 24, //.......Arredondamento superior direito
    overflow: 'hidden', //.............Esconde conteudo fora das bordas
  },

  // Container da Barra de Arrasto (posicionado sobre a imagem)
  handleContainer: {
    position: 'absolute', //............Posicao absoluta
    top: 0, //..........................No topo do modal
    left: 0, //.........................Esquerda
    right: 0, //........................Direita
    paddingVertical: 12, //.............Espaco vertical
    alignItems: 'center', //............Centraliza handle
    zIndex: 10, //.....................Acima da imagem
  },

  // Barra de Arrasto (Handle)
  handle: {
    width: 40, //......................Largura da barra
    height: 4, //......................Altura da barra
    backgroundColor: 'rgba(255,255,255,0.5)', //..Cor branca semi-transparente
    borderRadius: 2, //................Cantos arredondados
  },

  // Container da Imagem (ocupa topo inteiro)
  imageContainer: {
    width: '100%', //...................Largura total
    height: 200, //....................Altura da imagem
    overflow: 'hidden', //.............Esconde overflow
  },

  // Imagem da Aula
  image: {
    width: '100%', //...................Largura total
    height: '100%', //..................Altura total
  },

  // Conteudo do Modal (titulo e descricao)
  content: {
    flex: 1, //.........................Ocupa espaco disponivel
    paddingHorizontal: 20, //...........Padding horizontal
    paddingTop: 16, //..................Espaco acima do titulo
    backgroundColor: COLORS.white, //...Fundo branco
  },

  // Titulo da Aula
  title: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta padrao
    marginBottom: 12, //................Margem inferior
  },

  // Descricao da Aula
  description: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza escuro padrao
    lineHeight: 22, //..................Altura da linha
    paddingBottom: 20, //...............Padding inferior
  },

  // Botao de Toggle Timeline - sobre a imagem
  timelineToggleButton: {
    position: 'absolute', //............Posicao absoluta
    bottom: 12, //......................Distancia do fundo da imagem
    right: 12, //.......................Distancia da direita da imagem
    width: 40, //.......................Largura do botao
    height: 40, //......................Altura do botao
    borderRadius: 20, //................Circular
    backgroundColor: 'rgba(0,0,0,0.6)', //..Fundo escuro semi-transparente
    justifyContent: 'center', //........Centraliza verticalmente
    alignItems: 'center', //............Centraliza horizontalmente
    zIndex: 5, //.......................Acima da imagem
  },

  // Container da Timeline
  timelineContainer: {
    paddingBottom: 20, //...............Padding inferior
  },

  // Informacoes de Duracao e Progresso
  timelineInfo: {
    backgroundColor: COLORS.background, //..Fundo cinza claro
    borderRadius: 12, //....................Bordas arredondadas
    padding: 16, //.........................Padding interno
    marginBottom: 20, //....................Margem inferior
  },

  // Linha de Informacao
  timelineInfoRow: {
    flexDirection: 'row', //..............Layout horizontal
    justifyContent: 'space-between', //...Espaco entre label e valor
    alignItems: 'center', //..............Alinha verticalmente
    marginBottom: 8, //....................Margem inferior
  },

  // Label da Informacao
  timelineInfoLabel: {
    fontFamily: 'Inter_500Medium', //.....Fonte medium
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.textSecondary, //.........Cor cinza escuro
  },

  // Valor da Informacao
  timelineInfoValue: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.textPrimary, //...........Cor preta
  },

  // Visualizacao da Timeline
  timelineVisualization: {
    marginBottom: 20, //....................Margem inferior
  },

  // Titulo da Visualizacao
  timelineVisualizationTitle: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    fontSize: 15, //........................Tamanho da fonte
    color: COLORS.textPrimary, //...........Cor preta
    marginBottom: 12, //....................Margem inferior
  },

  // Barra de Progresso Visual
  timelineBar: {
    position: 'relative', //...............Posicao relativa para filhos absolutos
    height: 30, //..........................Altura da barra
    borderRadius: 15, //....................Bordas arredondadas
    overflow: 'hidden', //..................Esconde overflow
    marginBottom: 16, //....................Margem inferior
  },

  // Fundo da Barra (nao assistido)
  timelineBarBackground: {
    position: 'absolute', //................Posicao absoluta
    top: 0, //..............................Topo
    left: 0, //.............................Esquerda
    right: 0, //............................Direita
    bottom: 0, //.........................Fundo
    backgroundColor: COLORS.background, //..Cor cinza claro
  },

  // Segmento Assistido da Barra
  timelineBarSegment: {
    position: 'absolute', //.................Posicao absoluta
    top: 0, //...............................Topo
    height: '100%', //.......................Altura total
    backgroundColor: COLORS.primary, //.......Cor azul
    opacity: 0.8, //.........................Semi-transparente para ver sobreposicoes
  },

  // Lista de Faixas Assistidas
  timelineRangesList: {
    gap: 8, //..............................Espaco entre items
  },

  // Item de Faixa Assistida
  timelineRangeItem: {
    paddingVertical: 8, //..................Padding vertical
    paddingHorizontal: 12, //...............Padding horizontal
    backgroundColor: COLORS.background, //..Fundo cinza claro
    borderRadius: 8, //.....................Bordas arredondadas
    marginBottom: 8, //.....................Margem inferior
  },

  // Texto de Faixa Assistida
  timelineRangeText: {
    fontFamily: 'Inter_400Regular', //......Fonte regular
    fontSize: 13, //........................Tamanho da fonte
    color: COLORS.textSecondary, //.........Cor cinza escuro
  },

  // Texto de Lista Vazia
  timelineEmptyText: {
    fontFamily: 'Inter_400Regular', //......Fonte regular
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.textSecondary, //.........Cor cinza escuro
    textAlign: 'center', //.................Centralizado
    paddingVertical: 20, //.................Padding vertical
    fontStyle: 'italic', //.................Italico
  },
});

export default LessonDetailsModal;
