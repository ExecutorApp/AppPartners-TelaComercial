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
} from 'react-native';
import { COLORS, TrainingItem } from './02.Training-Types';

// ========================================
// CONSTANTES DO MODAL
// ========================================

const { height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Altura da tela

// Calcula altura do modal para ficar 10px abaixo do topo
const MODAL_TOP_OFFSET = 76; //...............Distancia do topo ate o modal
const MODAL_HEIGHT = SCREEN_HEIGHT - MODAL_TOP_OFFSET; //..Altura do modal

// ========================================
// ANCORAS DE AJUSTE: ESPACAMENTO ENTRE TITULOS
//
// INSTRUCOES:
// 1. Altere o valor abaixo para ajustar o espacamento entre "Aula 01" e "Visao Geral do perfil"
// 2. A constante esta aplicada no estilo lessonDetailHeader (procure por "ANCORA: ajustar aqui")
// 3. Valor em pixels
//
// NAVEGACAO RAPIDA:
// - Espaco entre titulo "Aula 01" e nome da aula: LESSON_TITLE_TO_NAME_SPACING
// ========================================

const LESSON_TITLE_TO_NAME_SPACING = 5; //..Espaco entre titulo da aula e nome da aula (em pixels)

// ========================================
// TIPOS E INTERFACES
// ========================================

// Props do modal de informacoes do treinamento
interface TrainingInfoModalProps {
  visible: boolean; //...................Visibilidade do modal
  onClose: () => void; //...............Callback ao fechar
  training: TrainingItem | null; //.....Dados do treinamento
}

// ========================================
// DADOS MOCKADOS
// ========================================

// Modulos mockados por ID de treinamento
// Treinamentos que NAO estao aqui mostram apenas lista de aulas
// NOTA: Somente adicionar IDs de treinamentos que REALMENTE tem modulos no card
// Treinamentos da categoria "Aplicativo" NAO tem modulos (mostram "Modulos: 00")
const MOCK_MODULES_BY_TRAINING: Record<string, any[]> = {
  // Objeto vazio - nenhum treinamento da categoria Aplicativo tem modulos
  // Adicionar aqui apenas treinamentos que mostram "Modulos: XX" no card (XX > 0)
};

// ========================================
// COMPONENTE MODAL INFORMACOES DO TREINAMENTO
// ========================================

const TrainingInfoModal: React.FC<TrainingInfoModalProps> = ({
  visible,
  onClose,
  training,
}) => {
  // Log props recebidas
  console.log('[TrainingInfoModal] ========== RENDER ==========');
  console.log('[TrainingInfoModal] visible:', visible);
  console.log('[TrainingInfoModal] training:', training?.title);

  // Estado para controlar aba selecionada (modulo ou aulas)
  const [selectedTab, setSelectedTab] = useState<'module' | 'lessons'>('module');

  // Estado para controlar modulo selecionado
  const [selectedModule, setSelectedModule] = useState(0);

  // Estado para controlar aula selecionada na aba Aulas
  const [selectedLesson, setSelectedLesson] = useState(0);

  // Referencia para o ScrollView das abas de aulas
  const lessonTabsScrollRef = useRef<ScrollView>(null);

  // Referencia para a posicao atual do scroll
  const currentScrollPosition = useRef(0);

  // Valor animado para posicao do modal
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  // Handler para navegar para aula anterior
  const handlePreviousLesson = () => {
    if (selectedLesson > 0) {
      setSelectedLesson(selectedLesson - 1);
    }
  };

  // Handler para navegar para proxima aula
  const handleNextLesson = () => {
    const totalLessons = hasModules
      ? currentModule?.lessons.length || 0
      : training?.contents.length || 0;
    if (selectedLesson < totalLessons - 1) {
      setSelectedLesson(selectedLesson + 1);
    }
  };

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

  // Reseta abas selecionadas quando modal abre
  useEffect(() => {
    if (visible) {
      setSelectedTab('module');
      setSelectedModule(0);
      setSelectedLesson(0);
    }
  }, [visible]);

  // Faz scroll automatico APENAS se a aba selecionada estiver oculta
  useEffect(() => {
    if (lessonTabsScrollRef.current && selectedTab === 'lessons') {
      // Dimensoes de cada aba
      const tabWidth = 48; //..........Largura minima da aba
      const gap = 8; //................Espaco entre abas
      const totalTabWidth = tabWidth + gap; //..Largura total (aba + gap)
      const borderWidth = 1; //.........Largura da borda da aba
      const safetyMargin = 4; //........Margem de seguranca para nao cortar bordas

      // Largura estimada do container visivel (largura da tela - margens - botoes de seta)
      const containerWidth = Dimensions.get('window').width - 30 - 36 - 36 - 16 - 16; // 30 padding, 2 botoes de 36px, 2 gaps de 8px

      // Pequeno delay para garantir que o layout esta pronto
      setTimeout(() => {
        const currentScroll = currentScrollPosition.current;

        // Calcula posicao da aba selecionada (incluindo bordas)
        const tabStartPosition = selectedLesson * totalTabWidth;
        const tabEndPosition = tabStartPosition + tabWidth + (borderWidth * 2); // Adiciona bordas esquerda e direita

        // Area visivel atual (com margem de seguranca)
        const visibleStart = currentScroll + safetyMargin;
        const visibleEnd = currentScroll + containerWidth - safetyMargin;

        // Verifica se aba esta oculta (fora da area visivel)
        const isHiddenLeft = tabStartPosition < visibleStart;
        const isHiddenRight = tabEndPosition > visibleEnd;

        // So faz scroll se aba estiver oculta
        if (isHiddenLeft) {
          // Aba oculta a esquerda - scroll para mostrar do inicio (com margem)
          const newPosition = Math.max(0, tabStartPosition - safetyMargin);
          currentScrollPosition.current = newPosition;
          lessonTabsScrollRef.current?.scrollTo({
            x: newPosition,
            animated: true,
          });
        } else if (isHiddenRight) {
          // Aba oculta a direita - scroll o minimo para mostrar a aba completa (com margem)
          const newPosition = tabEndPosition - containerWidth + safetyMargin + gap;
          currentScrollPosition.current = newPosition;
          lessonTabsScrollRef.current?.scrollTo({
            x: newPosition,
            animated: true,
          });
        }
        // Se aba esta visivel, nao faz nada
      }, 100);
    }
  }, [selectedLesson, selectedTab]);

  // Se nao tem treinamento, nao renderiza
  if (!training) return null;

  // Verifica se este treinamento tem modulos mockados
  const trainingModules = MOCK_MODULES_BY_TRAINING[training.id];
  const hasModules = trainingModules && trainingModules.length > 0;

  // Dados do modulo selecionado (se tiver modulos)
  const currentModule = hasModules ? trainingModules[selectedModule] : null;

  // ========================================
  // LOGS DE DEBUG
  // ========================================
  console.log('\n========== INFO MODAL DEBUG ==========');
  console.log('[1] Training ID:', training.id);
  console.log('[2] Training Title:', training.title);
  console.log('[3] Has Modules:', hasModules);
  console.log('[4] Training Modules Count:', trainingModules?.length || 0);

  if (hasModules) {
    console.log('[5] All Modules:', trainingModules.map((m, i) => `${i}: ${m.title}`));
    console.log('[6] Selected Module Index:', selectedModule);

    if (currentModule) {
      console.log('[7] Current Module Title:', currentModule.title);
      console.log('[8] Current Module Lessons Count:', currentModule.lessons?.length || 0);
      console.log('[9] Current Module Lessons:', currentModule.lessons?.map((l, i) => `${String(i + 1).padStart(2, '0')}: ${l.name} (${l.time})`));
    }
  }

  console.log('[10] Selected Tab:', selectedTab);
  console.log('[11] Selected Lesson Index:', selectedLesson);
  console.log('======================================\n');

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
              {/* Barra de Arrasto (Handle) - sobre a imagem - Toque para fechar */}
              <TouchableOpacity
                style={styles.handleContainer}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <View style={styles.handle} />
              </TouchableOpacity>

              {/* Imagem/Letra no Topo (ocupa toda a largura) */}
              <View style={styles.imageContainer}>
                <Text style={styles.letterText}>
                  {training.title.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* Conteudo do Modal (abas principais e conteudo) */}
              <View style={styles.content}>
                {/* Titulo do Treinamento */}
                <Text style={styles.title}>{training.title}</Text>

                {/* Abas Principais: Modulo e Aulas */}
                <View style={styles.mainTabsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.mainTab,
                      selectedTab === 'module' && styles.mainTabActive,
                    ]}
                    onPress={() => setSelectedTab('module')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.mainTabText,
                        selectedTab === 'module' && styles.mainTabTextActive,
                      ]}
                    >
                      Módulo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.mainTab,
                      selectedTab === 'lessons' && styles.mainTabActive,
                    ]}
                    onPress={() => setSelectedTab('lessons')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.mainTabText,
                        selectedTab === 'lessons' && styles.mainTabTextActive,
                      ]}
                    >
                      Aulas
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Renderiza Abas de Modulos SE tiver modulos */}
                {hasModules && (
                  <View style={styles.moduleTabsContainer}>
                    {trainingModules.map((module, index) => (
                      <TouchableOpacity
                        key={module.id}
                        style={[
                          styles.moduleTab,
                          selectedModule === index && styles.moduleTabActive,
                        ]}
                        onPress={() => setSelectedModule(index)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.moduleTabText,
                            selectedModule === index && styles.moduleTabTextActive,
                          ]}
                        >
                          {module.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Renderiza Carrossel de Abas Numericas de Aulas SE estiver na aba Aulas */}
                {selectedTab === 'lessons' && (
                  <>
                    <View style={styles.lessonTabsWrapper}>
                      {/* Botao Anterior */}
                      <TouchableOpacity
                        style={[
                          styles.arrowButton,
                          selectedLesson === 0 && styles.arrowButtonDisabled,
                        ]}
                        onPress={handlePreviousLesson}
                        disabled={selectedLesson === 0}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.arrowButtonText,
                          selectedLesson === 0 && styles.arrowButtonTextDisabled,
                        ]}>
                          ‹
                        </Text>
                      </TouchableOpacity>

                      {/* ScrollView com Abas Numericas */}
                      <ScrollView
                        ref={lessonTabsScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.lessonTabsScrollContainer}
                        contentContainerStyle={styles.lessonTabsContainer}
                        onScroll={(event) => {
                          currentScrollPosition.current = event.nativeEvent.contentOffset.x;
                        }}
                        scrollEventThrottle={16}
                      >
                        {hasModules ? (
                          // Com modulos: Abas numericas das aulas do modulo selecionado
                          currentModule.lessons.map((lesson, index) => (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.lessonTab,
                                selectedLesson === index && styles.lessonTabActive,
                              ]}
                              onPress={() => setSelectedLesson(index)}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.lessonTabText,
                                  selectedLesson === index && styles.lessonTabTextActive,
                                ]}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          // Sem modulos: Abas numericas das aulas diretas do treinamento
                          training.contents.map((content, index) => (
                            <TouchableOpacity
                              key={content.id}
                              style={[
                                styles.lessonTab,
                                selectedLesson === index && styles.lessonTabActive,
                              ]}
                              onPress={() => setSelectedLesson(index)}
                              activeOpacity={0.7}
                            >
                              <Text
                                style={[
                                  styles.lessonTabText,
                                  selectedLesson === index && styles.lessonTabTextActive,
                                ]}
                              >
                                {String(index + 1).padStart(2, '0')}
                              </Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>

                      {/* Botao Proximo */}
                      <TouchableOpacity
                        style={[
                          styles.arrowButton,
                          selectedLesson >= (hasModules ? currentModule.lessons.length - 1 : training.contents.length - 1) && styles.arrowButtonDisabled,
                        ]}
                        onPress={handleNextLesson}
                        disabled={selectedLesson >= (hasModules ? currentModule.lessons.length - 1 : training.contents.length - 1)}
                        activeOpacity={0.7}
                      >
                        <Text style={[
                          styles.arrowButtonText,
                          selectedLesson >= (hasModules ? currentModule.lessons.length - 1 : training.contents.length - 1) && styles.arrowButtonTextDisabled,
                        ]}>
                          ›
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Divisoria Slim abaixo das abas */}
                    <View style={styles.lessonTabsDivider} />
                  </>
                )}

                {/* Conteudo baseado na aba selecionada */}
                <ScrollView
                  style={styles.contentScroll}
                  showsVerticalScrollIndicator={false}
                >
                  {selectedTab === 'module' ? (
                    // Aba Modulo: Mostra descricao completa
                    hasModules ? (
                      <Text style={styles.moduleDescription}>
                        {currentModule.description || `${currentModule.title}\n\nNeste módulo você irá aprender os fundamentos essenciais e desenvolver habilidades práticas que serão aplicadas ao longo de todo o treinamento. Cada aula foi cuidadosamente planejada para proporcionar uma experiência de aprendizado progressiva e eficiente.\n\nAo final deste módulo, você estará apto a aplicar os conhecimentos adquiridos em situações reais do dia a dia.`}
                      </Text>
                    ) : (
                      <Text style={styles.moduleDescription}>
                        {training.description}
                        {'\n\n'}
                        Neste treinamento você irá aprender os fundamentos essenciais e desenvolver
                        habilidades práticas. Cada aula foi cuidadosamente planejada para proporcionar
                        uma experiência de aprendizado progressiva e eficiente.
                      </Text>
                    )
                  ) : (
                    // Aba Aulas: Mostra descricao completa da aula selecionada
                    hasModules ? (
                      // Com modulos: Mostra aula do modulo selecionado
                      <View style={styles.lessonDetailContainer}>
                        {/* Header da Aula: Titulo e Tempo */}
                        <View style={styles.lessonDetailHeader}>
                          <Text style={styles.lessonDetailTitle}>
                            Aula {String(selectedLesson + 1).padStart(2, '0')}
                          </Text>
                          <Text style={styles.lessonDetailTime}>
                            {currentModule.lessons[selectedLesson].time}
                          </Text>
                        </View>

                        {/* Nome da Aula */}
                        <Text style={styles.lessonDetailName}>
                          {currentModule.lessons[selectedLesson].name}
                        </Text>

                        {/* Divisoria */}
                        <View style={styles.lessonDetailDivider} />

                        {/* Descricao da Aula */}
                        <Text style={styles.lessonDetailDescription}>
                          {currentModule.lessons[selectedLesson].description}
                        </Text>
                      </View>
                    ) : (
                      // Sem modulos: Mostra aula direta do treinamento
                      <View style={styles.lessonDetailContainer}>
                        {/* Header da Aula: Titulo e Tempo */}
                        <View style={styles.lessonDetailHeader}>
                          <Text style={styles.lessonDetailTitle}>
                            Aula {String(selectedLesson + 1).padStart(2, '0')}
                          </Text>
                          <Text style={styles.lessonDetailTime}>
                            {training.contents[selectedLesson].duration ? `${training.contents[selectedLesson].duration}min` : '15min'}
                          </Text>
                        </View>

                        {/* Nome da Aula */}
                        <Text style={styles.lessonDetailName}>
                          {training.contents[selectedLesson].title}
                        </Text>

                        {/* Divisoria */}
                        <View style={styles.lessonDetailDivider} />

                        {/* Descricao da Aula */}
                        <Text style={styles.lessonDetailDescription}>
                          {training.contents[selectedLesson].description || 'Nesta aula você aprenderá de forma prática e objetiva todos os conceitos necessários para dominar este conteúdo. O material foi desenvolvido para proporcionar uma experiência de aprendizado eficiente e aplicável ao seu dia a dia.'}
                        </Text>
                      </View>
                    )
                  )}
                </ScrollView>
              </View>
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
    zIndex: 9999, //....................Z-index alto para ficar na frente do video
    elevation: 9999, //.................Elevation alto para Android
  },

  // Container do Modal
  modalContainer: {
    height: MODAL_HEIGHT, //............Altura calculada ate o topo
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
    justifyContent: 'center', //........Centraliza verticalmente
    alignItems: 'center', //............Centraliza horizontalmente
    backgroundColor: '#021632', //....Fundo azul escuro
  },

  // Texto da Letra
  letterText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 48, //...................Tamanho grande da fonte
    color: '#FCFCFC', //...............Cor branca
  },

  // Conteudo do Modal (titulo, abas e aulas)
  content: {
    flex: 1, //.........................Ocupa espaco disponivel
    paddingHorizontal: 15, //...........Padding horizontal (margem de respiro)
    paddingTop: 16, //..................Espaco acima do titulo
    backgroundColor: COLORS.white, //...Fundo branco
  },

  // Titulo do Treinamento
  title: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta padrao
    marginBottom: 16, //................Margem inferior
    marginLeft: 0, //...................Sem margem (alinha com divisorias)
  },

  // Container das Abas Principais (Modulo e Aulas)
  mainTabsContainer: {
    flexDirection: 'row', //............Layout horizontal
    marginBottom: 12, //................Margem inferior
    borderBottomWidth: 1, //............Linha inferior
    borderBottomColor: COLORS.border, //..Cor da linha
  },

  // Aba Principal Individual
  mainTab: {
    paddingVertical: 12, //.............Padding vertical
    paddingHorizontal: 20, //...........Padding horizontal
    marginRight: 12, //................Margem direita
    borderBottomWidth: 2, //............Linha inferior
    borderBottomColor: 'transparent', //..Transparente por padrao
  },

  // Aba Principal Ativa
  mainTabActive: {
    borderBottomColor: COLORS.primary, //..Linha azul quando ativa
  },

  // Texto da Aba Principal
  mainTabText: {
    fontFamily: 'Inter_500Medium', //.....Fonte medium
    fontSize: 15, //........................Tamanho da fonte
    color: COLORS.textSecondary, //..........Cor cinza
  },

  // Texto da Aba Principal Ativa
  mainTabTextActive: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    color: COLORS.primary, //...............Cor azul quando ativa
  },

  // Container das Abas de Modulos
  moduleTabsContainer: {
    flexDirection: 'row', //............Layout horizontal
    marginBottom: 12, //................Margem inferior
    paddingBottom: 8, //................Padding inferior
    borderBottomWidth: 1, //............Linha inferior
    borderBottomColor: COLORS.border, //..Cor da linha
  },

  // Aba de Modulo Individual
  moduleTab: {
    paddingVertical: 8, //..............Padding vertical
    paddingHorizontal: 12, //...........Padding horizontal
    marginRight: 8, //..................Margem direita
    borderRadius: 6, //..................Bordas arredondadas
    backgroundColor: 'transparent', //...Transparente por padrao
  },

  // Aba de Modulo Ativa
  moduleTabActive: {
    backgroundColor: COLORS.primary, //..Fundo azul quando ativa
  },

  // Texto da Aba de Modulo
  moduleTabText: {
    fontFamily: 'Inter_500Medium', //.....Fonte medium
    fontSize: 13, //........................Tamanho da fonte
    color: COLORS.textSecondary, //..........Cor cinza
  },

  // Texto da Aba de Modulo Ativa
  moduleTabTextActive: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    color: COLORS.white, //.................Cor branca quando ativa
  },

  // Wrapper das Abas de Aulas com Setas de Navegacao
  lessonTabsWrapper: {
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'center', //............Alinha verticalmente
    marginBottom: 12, //................Margem inferior
    gap: 8, //..........................Espaco entre setas e abas
  },

  // Container Scroll das Abas de Aulas Numericas
  lessonTabsScrollContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    maxHeight: 44, //....................Altura maxima (igual as abas)
  },

  // Container das Abas de Aulas Numericas
  lessonTabsContainer: {
    flexDirection: 'row', //............Layout horizontal
    paddingHorizontal: 5, //............Padding horizontal
    gap: 8, //...........................Espaco entre abas
  },

  // Botao de Seta de Navegacao
  arrowButton: {
    width: 36, //......................Largura do botao
    height: 44, //.......................Altura do botao (igual as abas)
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda cinza
    justifyContent: 'center', //........Centraliza conteudo verticalmente
    alignItems: 'center', //............Centraliza conteudo horizontalmente
  },

  // Botao de Seta Desabilitado
  arrowButtonDisabled: {
    backgroundColor: COLORS.white, //....Mantem fundo branco quando desabilitado
    borderColor: COLORS.border, //......Mantem borda cinza quando desabilitado
  },

  // Texto da Seta
  arrowButtonText: {
    fontSize: 24, //....................Tamanho da fonte
    color: COLORS.primary, //...........Cor azul
    fontWeight: '200', //...............Peso extra leve para seta mais fina
    lineHeight: 44, //...................Altura da linha igual ao container
    textAlign: 'center', //..............Centraliza horizontalmente
    textAlignVertical: 'center', //.....Centraliza verticalmente (Android)
    includeFontPadding: false, //........Remove padding extra (Android)
    marginTop: -6, //....................Ajuste fino para centralizar perfeitamente
  },

  // Texto da Seta Desabilitada
  arrowButtonTextDisabled: {
    color: 'rgba(23, 119, 207, 0.3)', //..Cor azul com opacidade quando desabilitado
  },

  // Divisoria Slim abaixo das abas de aulas
  lessonTabsDivider: {
    height: 0.5, //.......................Altura extremamente fina
    backgroundColor: COLORS.border, //....Cor cinza claro
    marginBottom: 16, //..................Margem inferior
    marginHorizontal: 0, //.................Sem margem horizontal (respeita padding do container)
  },

  // Aba de Aula Individual (Numerica)
  lessonTab: {
    height: 44, //......................Altura fixa (igual aos botoes de seta)
    paddingHorizontal: 16, //...........Padding horizontal
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda cinza
    minWidth: 48, //....................Largura minima
    justifyContent: 'center', //........Centraliza verticalmente
    alignItems: 'center', //............Centraliza horizontalmente
  },

  // Aba de Aula Ativa
  lessonTabActive: {
    backgroundColor: COLORS.primary, //..Fundo azul quando ativa
    borderColor: COLORS.primary, //....Borda azul quando ativa
  },

  // Texto da Aba de Aula
  lessonTabText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.textSecondary, //..........Cor cinza
  },

  // Texto da Aba de Aula Ativa
  lessonTabTextActive: {
    color: COLORS.white, //.................Cor branca quando ativa
  },

  // Container do Conteudo Scrollavel
  contentScroll: {
    flex: 1, //.........................Ocupa espaco disponivel
    paddingBottom: 15, //...............Espaco inferior para nao colar na borda
  },

  // Container da Descricao Completa da Aula
  lessonDetailContainer: {
    paddingHorizontal: 0, //............Sem padding (alinha com divisorias)
  },

  // Header da Aula (Titulo e Tempo)
  // ANCORA: ajustar aqui - Espaco entre "Aula 01" e "Visao Geral do perfil"
  lessonDetailHeader: {
    flexDirection: 'row', //............Layout horizontal
    justifyContent: 'space-between', //..Espaco entre titulo e tempo
    alignItems: 'center', //............Alinha verticalmente
    marginBottom: LESSON_TITLE_TO_NAME_SPACING, //..Margem inferior (ANCORA: ajustar aqui)
  },

  // Titulo da Aula
  lessonDetailTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta
  },

  // Tempo da Aula
  lessonDetailTime: {
    fontFamily: 'Inter_500Medium', //.....Fonte medium
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.primary, //...............Cor azul
  },

  // Nome da Aula (abaixo do titulo)
  lessonDetailName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta
    marginBottom: 12, //................Margem inferior
  },

  // Divisoria entre nome e descricao
  lessonDetailDivider: {
    height: 1, //.......................Altura da linha
    backgroundColor: COLORS.border, //..Cor cinza claro
    marginBottom: 16, //................Margem inferior
  },

  // Descricao Completa da Aula
  lessonDetailDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor cinza escuro
    lineHeight: 22, //..................Altura da linha
  },

  // Descricao do Modulo
  moduleDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor cinza escuro
    lineHeight: 22, //..................Altura da linha
    paddingHorizontal: 0, //............Sem padding (alinha com divisorias)
  },

  // Item de Aula
  lessonItem: {
    paddingVertical: 12, //.............Padding vertical
    paddingHorizontal: 12, //...........Padding horizontal
    backgroundColor: COLORS.background, //..Fundo cinza claro
    borderRadius: 8, //................Bordas arredondadas
    marginBottom: 12, //...............Margem inferior
  },

  // Nome da Aula
  lessonName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 15, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta
    marginBottom: 6, //................Margem inferior
  },

  // Descricao da Aula
  lessonDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza escuro
    lineHeight: 18, //..................Altura da linha
    marginBottom: 6, //................Margem inferior
  },

  // Tempo da Aula
  lessonTime: {
    fontFamily: 'Inter_500Medium', //.....Fonte medium
    fontSize: 12, //........................Tamanho da fonte
    color: COLORS.primary, //...............Cor azul
  },
});

export default TrainingInfoModal;
