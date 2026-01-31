import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  COLORS,
  ProductItem,
  ModuleItem,
  LessonItem,
  LessonStatus,
  BackIcon,
  getContentTypeIcon,
  formatDuration,
  MOCK_PRODUCTS,
  TrainingContentItem,
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import LessonDetailsModal from './09.Training-LessonDetailsModal';

// ========================================
// CONSTANTES DA IMAGEM DO PRODUTO (HEADER)
// ========================================

const PRODUCT_IMAGE_WIDTH = 65; //..........Largura da imagem do produto
const PRODUCT_IMAGE_HEIGHT = 80; //.........Altura da imagem do produto
const PRODUCT_IMAGE_BORDER_RADIUS = 8; //...Arredondamento da imagem do produto

// ========================================
// CONSTANTES DO CARD DE AULA
// ========================================

const LESSON_NUMBER_WIDTH = 45; //..........Largura do container de numero
const LESSON_NUMBER_HEIGHT = 60; //.........Altura do container de numero
const LESSON_NUMBER_BORDER_RADIUS = 8; //...Arredondamento do container de numero
const LESSON_NUMBER_MARGIN_RIGHT = 12; //...Margem direita do container de numero
const LESSON_INFO_MIN_HEIGHT = 50; //.......Altura minima do container de info
const LESSON_CARD_PADDING_TOP = 6; //.......Padding superior do card
const LESSON_CARD_PADDING_BOTTOM = 6; //....Padding inferior do card
const LESSON_CARD_PADDING_LEFT = 6; //......Padding esquerdo do card
const LESSON_CARD_PADDING_RIGHT = 12; //.....Padding direito do card
const LESSON_CARD_MARGIN_BOTTOM = 12; //....Margem inferior entre cards
const LESSON_CARD_BORDER_RADIUS = 12; //....Arredondamento do card

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type ProductDetailNavigationProp = StackNavigationProp<RootStackParamList>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

// ========================================
// CONSTANTES DO MODAL
// ========================================

const { height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Altura da tela
const MODAL_TOP_OFFSET = 76; //..................................Distancia do topo ate o modal
const MODAL_HEIGHT = SCREEN_HEIGHT - MODAL_TOP_OFFSET; //.......Altura do modal

// ========================================
// COMPONENTE MODAL DE INFORMACOES DO PRODUTO
// ========================================

interface ProductInfoModalProps {
  visible: boolean; //..................Visibilidade do modal
  onClose: () => void; //...............Callback ao fechar
  product: ProductItem; //..............Dados do produto
  modules: ModuleItem[]; //.............Lista de modulos
}

const ProductInfoModal: React.FC<ProductInfoModalProps> = ({
  visible,
  onClose,
  product,
  modules,
}) => {
  // ========================================
  // NIVEL 1: Produto (Descricao / Modulos)
  // ========================================
  const [mainTab, setMainTab] = useState<'description' | 'modules'>('description');

  // ========================================
  // NIVEL 2: Modulo (Descricao / Aulas)
  // ========================================
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);
  const [moduleTab, setModuleTab] = useState<'description' | 'lessons'>('description');

  // ========================================
  // NIVEL 3: Aula selecionada
  // ========================================
  const [selectedLessonIdx, setSelectedLessonIdx] = useState(0);

  // Valor animado para posicao do modal
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;

  // Anima entrada e saida do modal
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: MODAL_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // Modulo selecionado atualmente
  const currentModule = modules[selectedModuleIdx];

  // Aula selecionada atualmente
  const currentLesson = currentModule?.lessons?.[selectedLessonIdx];

  // Handler para selecionar modulo
  const handleSelectModule = (index: number) => {
    setSelectedModuleIdx(index);
    setSelectedLessonIdx(0);
    setModuleTab('description');
  };

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
        <View style={modalStyles.overlay}>
          {/* Previne cliques no modal de fechar */}
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                modalStyles.modalContainer,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              {/* Barra de Arrasto (Handle) - Toque para fechar */}
              <TouchableOpacity
                style={modalStyles.handleContainer}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <View style={modalStyles.handle} />
              </TouchableOpacity>

              {/* Imagem/Letra no Topo */}
              <View style={modalStyles.imageContainer}>
                {product?.image ? (
                  <Image
                    source={product.image}
                    style={modalStyles.productImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={modalStyles.letterText}>
                    {product?.name?.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>

              {/* Conteudo do Modal */}
              <View style={modalStyles.content}>
                {/* Titulo do Produto */}
                <Text style={modalStyles.title}>{product?.name}</Text>

                {/* ========================================
                    NIVEL 1: Abas do Produto (Descricao / Modulos)
                    ======================================== */}
                <View style={modalStyles.mainTabsContainer}>
                  <TouchableOpacity
                    style={[
                      modalStyles.mainTab,
                      mainTab === 'description' && modalStyles.mainTabActive,
                    ]}
                    onPress={() => setMainTab('description')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        modalStyles.mainTabText,
                        mainTab === 'description' && modalStyles.mainTabTextActive,
                      ]}
                    >
                      Descrição
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      modalStyles.mainTab,
                      mainTab === 'modules' && modalStyles.mainTabActive,
                    ]}
                    onPress={() => setMainTab('modules')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        modalStyles.mainTabText,
                        mainTab === 'modules' && modalStyles.mainTabTextActive,
                      ]}
                    >
                      Módulos
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Conteudo baseado na aba principal selecionada */}
                <ScrollView
                  style={modalStyles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={mainTab === 'modules' && moduleTab === 'lessons' ? { flexGrow: 1 } : undefined}
                >
                  {mainTab === 'description' ? (
                    /* ========================================
                       NIVEL 1 - DESCRICAO: Descricao do Produto
                       ======================================== */
                    <View style={modalStyles.productDescription}>
                      <Text style={modalStyles.productDescriptionText}>
                        {product?.description || 'Descrição do produto não disponível.'}
                      </Text>
                    </View>
                  ) : (
                    /* ========================================
                       NIVEL 1 - MODULOS: Botoes de Modulos
                       ======================================== */
                    <View style={modalStyles.modulesSection}>
                      {/* Botoes de Modulos */}
                      <View style={modalStyles.moduleButtonsContainer}>
                        {modules.map((module, index) => (
                          <TouchableOpacity
                            key={module.id}
                            style={[
                              modalStyles.moduleButton,
                              selectedModuleIdx === index && modalStyles.moduleButtonActive,
                            ]}
                            onPress={() => handleSelectModule(index)}
                            activeOpacity={0.7}
                          >
                            <Text
                              style={[
                                modalStyles.moduleButtonText,
                                selectedModuleIdx === index && modalStyles.moduleButtonTextActive,
                              ]}
                            >
                              Módulo {String(index + 1).padStart(2, '0')}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>

                      {/* Divisoria abaixo dos modulos */}
                      <View style={modalStyles.sectionDivider} />

                      {/* ========================================
                          NIVEL 2: Abas do Modulo (Descricao / Aulas)
                          ======================================== */}
                      <View style={modalStyles.moduleTabsContainer}>
                        <TouchableOpacity
                          style={[
                            modalStyles.moduleTab,
                            moduleTab === 'description' && modalStyles.moduleTabActive,
                          ]}
                          onPress={() => setModuleTab('description')}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              modalStyles.moduleTabText,
                              moduleTab === 'description' && modalStyles.moduleTabTextActive,
                            ]}
                          >
                            Descrição
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            modalStyles.moduleTab,
                            moduleTab === 'lessons' && modalStyles.moduleTabActive,
                          ]}
                          onPress={() => setModuleTab('lessons')}
                          activeOpacity={0.7}
                        >
                          <Text
                            style={[
                              modalStyles.moduleTabText,
                              moduleTab === 'lessons' && modalStyles.moduleTabTextActive,
                            ]}
                          >
                            Aulas
                          </Text>
                        </TouchableOpacity>
                      </View>

                      {/* Divisoria abaixo do toggle */}
                      <View style={modalStyles.sectionDivider} />

                      {moduleTab === 'description' ? (
                        /* ========================================
                           NIVEL 2 - DESCRICAO: Descricao do Modulo
                           ======================================== */
                        <View style={modalStyles.moduleContent}>
                          <Text style={modalStyles.moduleTitle}>
                            {currentModule?.title}
                          </Text>
                          <Text style={modalStyles.moduleDescription}>
                            {currentModule?.description || 'Descrição do módulo não disponível.'}
                          </Text>
                        </View>
                      ) : (
                        /* ========================================
                           NIVEL 2 - AULAS: Tabs Verticais + Detalhes
                           ======================================== */
                        <View style={modalStyles.lessonsContent}>
                          {/* Container de Navegacao Vertical */}
                          <View style={modalStyles.lessonNavVertical}>
                            {/* Seta para Cima */}
                            <TouchableOpacity
                              style={[
                                modalStyles.lessonNavArrow,
                                selectedLessonIdx === 0 && modalStyles.lessonNavArrowDisabled,
                              ]}
                              onPress={() => selectedLessonIdx > 0 && setSelectedLessonIdx(selectedLessonIdx - 1)}
                              disabled={selectedLessonIdx === 0}
                              activeOpacity={0.7}
                            >
                              <Text style={modalStyles.lessonNavArrowText}>‹</Text>
                            </TouchableOpacity>

                            {/* Tabs Numericas */}
                            <ScrollView
                              style={modalStyles.lessonTabsVertical}
                              showsVerticalScrollIndicator={false}
                            >
                              {currentModule?.lessons?.map((lesson, idx) => (
                                <TouchableOpacity
                                  key={lesson.id}
                                  style={[
                                    modalStyles.lessonTabVertical,
                                    selectedLessonIdx === idx && modalStyles.lessonTabVerticalActive,
                                  ]}
                                  onPress={() => setSelectedLessonIdx(idx)}
                                  activeOpacity={0.7}
                                >
                                  <Text
                                    style={[
                                      modalStyles.lessonTabVerticalText,
                                      selectedLessonIdx === idx && modalStyles.lessonTabVerticalTextActive,
                                    ]}
                                  >
                                    {String(idx + 1).padStart(2, '0')}
                                  </Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>

                            {/* Seta para Baixo */}
                            <TouchableOpacity
                              style={[
                                modalStyles.lessonNavArrow,
                                selectedLessonIdx === (currentModule?.lessons?.length || 1) - 1 && modalStyles.lessonNavArrowDisabled,
                              ]}
                              onPress={() => selectedLessonIdx < (currentModule?.lessons?.length || 1) - 1 && setSelectedLessonIdx(selectedLessonIdx + 1)}
                              disabled={selectedLessonIdx === (currentModule?.lessons?.length || 1) - 1}
                              activeOpacity={0.7}
                            >
                              <Text style={modalStyles.lessonNavArrowText}>›</Text>
                            </TouchableOpacity>
                          </View>

                          {/* Detalhes da Aula */}
                          <View style={modalStyles.lessonDetailsContainer}>
                            {/* Linha com Numero da Aula e Duracao */}
                            <View style={modalStyles.lessonDetailsHeaderRow}>
                              <Text style={modalStyles.lessonDetailsNumber}>
                                Aula {String(selectedLessonIdx + 1).padStart(2, '0')}
                              </Text>
                              <Text style={modalStyles.lessonDetailsDuration}>
                                {currentLesson?.duration ? `${currentLesson.duration}min` : ''}
                              </Text>
                            </View>

                            {/* Nome da Aula */}
                            <Text style={modalStyles.lessonDetailsName}>
                              {currentLesson?.title}
                            </Text>

                            {/* Divisoria */}
                            <View style={modalStyles.lessonDetailsDivider} />

                            {/* Descricao da Aula */}
                            <Text style={modalStyles.lessonDetailsDescription}>
                              {currentLesson?.description || 'Nesta aula você aprenderá de forma prática e objetiva todos os conceitos necessários para dominar este conteúdo.'}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
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

// Estilos do Modal
const modalStyles = StyleSheet.create({
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

  // Container da Barra de Arrasto
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

  // Container da Imagem
  imageContainer: {
    width: '100%', //...................Largura total
    height: 200, //....................Altura da imagem
    justifyContent: 'center', //........Centraliza verticalmente
    alignItems: 'center', //............Centraliza horizontalmente
    backgroundColor: '#021632', //....Fundo azul escuro
  },

  // Imagem do Produto
  productImage: {
    width: '100%', //...................Largura total
    height: '100%', //..................Altura total
  },

  // Texto da Letra
  letterText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 48, //...................Tamanho grande da fonte
    color: '#FCFCFC', //...............Cor branca
  },

  // Conteudo do Modal
  content: {
    flex: 1, //.........................Ocupa espaco disponivel
    paddingHorizontal: 15, //...........Padding horizontal
    paddingTop: 16, //..................Espaco acima do titulo
    backgroundColor: COLORS.white, //...Fundo branco
  },

  // Titulo do Produto
  title: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta padrao
    marginBottom: 16, //................Margem inferior
  },

  // Container das Abas Principais
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

  // Container das Abas de Modulos (Toggle Switch)
  moduleTabsContainer: {
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'center', //............Centraliza verticalmente
    alignSelf: 'center', //............Centraliza no meio da tela
    height: 40, //.....................Altura fixa
    padding: 4, //.....................Padding interno
    gap: 5, //..........................Espaco entre abas
    backgroundColor: '#F4F4F4', //.....Fundo cinza claro
    borderRadius: 6, //................Bordas arredondadas
    borderWidth: 0.3, //...............Borda fina
    borderColor: '#D8E0F0', //.........Cor da borda
  },

  // Aba de Modulo Individual (Toggle Button)
  moduleTab: {
    flex: 1, //........................Largura igual para ambas abas
    alignSelf: 'stretch', //...........Estica para altura total
    paddingHorizontal: 16, //..........Padding horizontal com respiro
    borderRadius: 4, //................Bordas arredondadas internas
    justifyContent: 'center', //.......Centraliza verticalmente
    alignItems: 'center', //...........Centraliza horizontalmente
    backgroundColor: 'transparent', //..Transparente por padrao
  },

  // Aba de Modulo Ativa (Toggle Button Active)
  moduleTabActive: {
    backgroundColor: COLORS.primary, //..Fundo azul quando ativa
  },

  // Texto da Aba de Modulo
  moduleTabText: {
    fontFamily: 'Inter_400Regular', //...Fonte regular
    fontSize: 14, //.....................Tamanho da fonte
    color: '#3A3F51', //..................Cor cinza escuro
  },

  // Texto da Aba de Modulo Ativa
  moduleTabTextActive: {
    color: '#FCFCFC', //..................Cor branca quando ativa
  },

  // Conteudo Scrollavel
  scrollContent: {
    flex: 1, //..........................Ocupa espaco disponivel
  },

  // ========================================
  // NIVEL 1: Descricao do Produto
  // ========================================

  // Container da Descricao do Produto
  productDescription: {
    paddingBottom: 20, //................Padding inferior
  },

  // Texto da Descricao do Produto
  productDescriptionText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza
    lineHeight: 22, //..................Altura da linha
  },

  // ========================================
  // NIVEL 1: Secao de Modulos
  // ========================================

  // Secao de Modulos (dentro do modal)
  modulesSection: {
    flex: 1, //..........................Ocupa espaco disponivel verticalmente
    minHeight: 350, //...................Altura minima para garantir espaco
  },

  // Container dos Botoes de Modulos
  moduleButtonsContainer: {
    flexDirection: 'row', //............Layout horizontal
    flexWrap: 'wrap', //................Quebra linha se necessario
    gap: 8, //..........................Espaco entre botoes
  },

  // Botao de Modulo
  moduleButton: {
    paddingVertical: 10, //..............Padding vertical
    paddingHorizontal: 16, //...........Padding horizontal
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.background, //..Fundo cinza
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //.....Cor da borda
  },

  // Botao de Modulo Ativo
  moduleButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //.....Borda azul
  },

  // Texto do Botao de Modulo
  moduleButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 13, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza
  },

  // Texto do Botao de Modulo Ativo
  moduleButtonTextActive: {
    color: COLORS.white, //............Cor branca
  },

  // Divisoria entre Secoes
  sectionDivider: {
    height: 1, //......................Altura fina
    backgroundColor: COLORS.border, //..Cor da borda
    marginVertical: 16, //..............Margem vertical
  },

  // ========================================
  // NIVEL 2: Conteudo do Modulo
  // ========================================

  // Conteudo do Modulo (Descricao)
  moduleContent: {
    flex: 1, //..........................Ocupa espaco disponivel
    paddingBottom: 20, //................Padding inferior
  },

  // Titulo do Modulo
  moduleTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta
    marginBottom: 8, //................Margem inferior
  },

  // Descricao do Modulo
  moduleDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza
    lineHeight: 22, //..................Altura da linha
  },

  // Conteudo de Aulas (Layout Horizontal)
  lessonsContent: {
    flex: 1, //..........................Ocupa espaco disponivel
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'stretch', //...........Estica itens na vertical
    marginLeft: -5, //...................Margem esquerda (ajuste aqui se necessario)
  },

  // Container de Navegacao Vertical (Setas + Tabs)
  lessonNavVertical: {
    width: 56, //......................Largura fixa
    marginRight: 12, //................Margem direita
    marginBottom: 15, //...............Margem inferior da tela
    alignItems: 'center', //...........Centraliza horizontalmente
    alignSelf: 'stretch', //...........Ocupa altura maxima disponivel
    justifyContent: 'space-between', //..Seta superior no topo, seta inferior no fundo
  },

  // Seta de Navegacao
  lessonNavArrow: {
    width: 46, //......................Largura
    height: 34, //.....................Altura
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //................Borda fina
    borderColor: COLORS.border, //.....Cor cinza da borda
  },

  // Seta de Navegacao Desabilitada
  lessonNavArrowDisabled: {
    opacity: 0.4, //....................Opacidade reduzida
  },

  // Texto da Seta de Navegacao
  lessonNavArrowText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular (mais fina)
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.primary, //...........Cor azul
    transform: [{ rotate: '90deg' }], //..Rotaciona para vertical
  },

  // Container de Tabs Verticais
  lessonTabsVertical: {
    flex: 1, //........................Ocupa espaco disponivel
    marginVertical: 6, //..............Margem vertical
  },

  // Tab Vertical Individual
  lessonTabVertical: {
    width: 46, //......................Largura fixa
    height: 42, //.....................Altura fixa
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //..................Borda fina
    borderColor: COLORS.border, //.....Cor cinza da borda
    marginBottom: 8, //................Margem inferior
  },

  // Tab Vertical Ativa
  lessonTabVerticalActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //.....Borda azul
  },

  // Texto da Tab Vertical
  lessonTabVerticalText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza
  },

  // Texto da Tab Vertical Ativa
  lessonTabVerticalTextActive: {
    color: COLORS.white, //............Cor branca
  },

  // Container de Detalhes da Aula
  lessonDetailsContainer: {
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Linha com Numero da Aula e Duracao
  lessonDetailsHeaderRow: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //...........Centraliza verticalmente
    marginBottom: 4, //................Margem inferior
  },

  // Numero da Aula (Aula 01)
  lessonDetailsNumber: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho da fonte maior
    color: COLORS.textPrimary, //.......Cor preta
  },

  // Duracao da Aula
  lessonDetailsDuration: {
    fontFamily: 'Inter_500Medium', //..Fonte medium
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.primary, //...........Cor azul
  },

  // Nome da Aula
  lessonDetailsName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor preta
    marginBottom: 12, //................Margem inferior
  },

  // Divisoria
  lessonDetailsDivider: {
    height: 1, //......................Altura fina
    backgroundColor: COLORS.border, //..Cor da borda
    marginBottom: 12, //................Margem inferior
  },

  // Descricao da Aula
  lessonDetailsDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor cinza
    lineHeight: 22, //..................Altura da linha
  },
});

// ========================================
// COMPONENTE MODULE CARD (CARROSSEL)
// ========================================

interface ModuleCardProps {
  module: ModuleItem; //...............Dados do modulo
  index: number; //....................Indice do modulo
  isSelected: boolean; //..............Se esta selecionado
  onPress: () => void; //..............Callback ao clicar
  completedLessons: number; //.........Aulas concluidas
  totalLessons: number; //.............Total de aulas
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  index,
  isSelected,
  onPress,
  completedLessons,
  totalLessons,
}) => {
  // Calcula progresso do modulo
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <TouchableOpacity
      style={[
        styles.moduleCard,
        isSelected && styles.moduleCardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Numero do Modulo */}
      <View style={[styles.moduleNumber, isSelected && styles.moduleNumberSelected]}>
        <Text style={[styles.moduleNumberText, isSelected && styles.moduleNumberTextSelected]}>
          {String(index + 1).padStart(2, '0')}
        </Text>
      </View>

      {/* Titulo do Modulo */}
      <Text style={styles.moduleTitle} numberOfLines={2}>
        {module.title}
      </Text>

      {/* Container da Barra de Progresso e Contador */}
      <View style={styles.moduleProgressRow}>
        {/* Barra de Progresso */}
        <View style={styles.moduleProgressContainer}>
          <View style={[styles.moduleProgressBar, { width: `${progress}%` }]} />
        </View>

        {/* Contador de Aulas */}
        <Text style={styles.moduleCounter}>
          {String(completedLessons).padStart(2, '0')}/{String(totalLessons).padStart(2, '0')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ========================================
// COMPONENTE LESSON ITEM
// ========================================

interface LessonItemProps {
  lesson: LessonItem; //...............Dados da aula
  index: number; //....................Indice da aula
  onToggle: () => void; //.............Callback ao marcar
  onNumberPress: () => void; //........Callback ao clicar no numero
}

const LessonItemComponent: React.FC<LessonItemProps> = ({
  lesson,
  index,
  onToggle,
  onNumberPress,
}) => {
  // Formata numero da aula com 2 digitos
  const lessonNumber = String(index + 1).padStart(2, '0');

  // Determina cor do indicador de status
  const getStatusColor = () => {
    switch (lesson.status) {
      case 'completed':
        return COLORS.primary;
      case 'in_progress':
        return COLORS.textPrimary;
      default:
        return COLORS.textSecondary;
    }
  };

  // Calcula porcentagem da aula baseado no status
  const getLessonProgress = () => {
    switch (lesson.status) {
      case 'completed':
        return '100%';
      case 'in_progress':
        return '50%';
      default:
        return '00%';
    }
  };

  return (
    <View style={styles.lessonCard}>
      {/* Container do Numero da Aula - Clicavel */}
      <TouchableOpacity
        style={styles.lessonNumberContainer}
        onPress={onNumberPress}
        activeOpacity={0.7}
      >
        <Text style={styles.lessonNumberText}>
          {lessonNumber}
        </Text>
      </TouchableOpacity>

      {/* Container de Informacoes */}
      <TouchableOpacity
        style={styles.lessonInfoContainer}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        {/* Titulo da Aula */}
        <Text style={styles.lessonTitle} numberOfLines={1}>
          {lesson.title}
        </Text>

        {/* Divisoria */}
        <View style={styles.lessonDivider} />

        {/* Linha de Execucao */}
        <View style={styles.lessonExecutionRow}>
          {/* Icone e Duracao */}
          <View style={styles.lessonDurationContainer}>
            {/* Icone Play */}
            {getContentTypeIcon(lesson.type, COLORS.textSecondary)}

            {/* Duracao */}
            <Text style={styles.lessonDuration}>
              {formatDuration(lesson.duration)}
            </Text>
          </View>

          {/* Porcentagem da Aula */}
          <Text style={[styles.lessonProgress, { color: getStatusColor() }]}>
            {getLessonProgress()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ========================================
// COMPONENTE PRODUCT DETAIL SCREEN
// ========================================

const ProductDetailScreen: React.FC = () => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Navegacao
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();

  // Obtem ID do produto da rota
  const { productId } = route.params;

  // Busca produto pelo ID
  const product = useMemo(() => {
    return MOCK_PRODUCTS.find(p => p.id === productId);
  }, [productId]);

  // Estado do modulo selecionado
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  // Estado das aulas (copia local para permitir toggle)
  const [modules, setModules] = useState<ModuleItem[]>(product?.modules || []);

  // Estado do modal de informacoes do produto
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  // Estado do modal de detalhes da aula
  const [lessonDetailsModalVisible, setLessonDetailsModalVisible] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Modulo atualmente selecionado
  const selectedModule = modules[selectedModuleIndex];

  // Calcula progresso geral do produto
  const overallProgress = useMemo(() => {
    const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
    const completedLessons = modules.reduce(
      (sum, m) => sum + m.lessons.filter(l => l.completed).length,
      0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }, [modules]);

  // Volta para tela anterior
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Abre modal de informacoes do produto
  const handleProductImagePress = useCallback(() => {
    console.log('[ProductDetail] ========== CLIQUE NA IMAGEM ==========');
    console.log('[ProductDetail] Produto:', product?.name, '(ID:', product?.id + ')');
    console.log('[ProductDetail] Abrindo modal...');
    setInfoModalVisible(true);
  }, [product]);

  // Fecha modal de informacoes do produto
  const handleCloseInfoModal = useCallback(() => {
    console.log('[ProductDetail] Fechando modal...');
    setInfoModalVisible(false);
  }, []);

  // Abre modal de detalhes da aula
  const handleLessonNumberPress = useCallback((lessonIndex: number) => {
    setSelectedLessonIndex(lessonIndex);
    setLessonDetailsModalVisible(true);
  }, []);

  // Fecha modal de detalhes da aula
  const handleCloseLessonDetailsModal = useCallback(() => {
    setLessonDetailsModalVisible(false);
  }, []);

  // Mapeia imagens das aulas baseado no indice
  const getLessonImage = useCallback((index: number) => {
    const images = [
      require('../../../assets/Aula01.jpg'),
      require('../../../assets/Aula02.jpg'),
      require('../../../assets/Aula03.jpg'),
      require('../../../assets/Aula04.jpg'),
    ];
    return images[index % images.length] || images[0];
  }, []);

  // Converte LessonItem para TrainingContentItem (para o modal)
  const convertToTrainingContent = useCallback((lesson: LessonItem): TrainingContentItem => {
    return {
      id: lesson.id,
      title: lesson.title,
      type: lesson.type,
      duration: lesson.duration,
      completed: lesson.completed,
    };
  }, []);

  // Seleciona modulo
  const handleSelectModule = useCallback((index: number) => {
    setSelectedModuleIndex(index);
  }, []);

  // Alterna estado de conclusao da aula
  const handleToggleLesson = useCallback((lessonId: string) => {
    setModules(prev =>
      prev.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          if (lesson.id !== lessonId) return lesson;

          // Determina novo status baseado no status atual
          let newStatus: LessonStatus;
          let newCompleted: boolean;

          switch (lesson.status) {
            case 'not_started':
              newStatus = 'in_progress';
              newCompleted = false;
              break;
            case 'in_progress':
              newStatus = 'completed';
              newCompleted = true;
              break;
            case 'completed':
              newStatus = 'not_started';
              newCompleted = false;
              break;
            default:
              newStatus = 'not_started';
              newCompleted = false;
          }

          return {
            ...lesson,
            status: newStatus,
            completed: newCompleted,
          };
        }),
      }))
    );
  }, []);

  // Calcula aulas concluidas por modulo
  const getModuleStats = useCallback((module: ModuleItem) => {
    const completedLessons = module.lessons.filter(l => l.completed).length;
    return { completedLessons, totalLessons: module.lessons.length };
  }, []);

  // Se fontes nao carregaram ou produto nao existe
  if (!fontsLoaded || !product) return null;

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        {/* Botao Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <BackIcon color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Informacoes do Produto */}
      <View style={styles.productInfoSection}>
        {/* Imagem ou Letra - Clicavel */}
        <TouchableOpacity
          style={styles.productImageWrapper}
          onPress={handleProductImagePress}
          activeOpacity={0.7}
        >
          {product.image ? (
            <Image
              source={product.image}
              style={styles.productImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.productLetterContainer}>
              <Text style={styles.productLetterText}>
                {product.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Info do Produto */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {product.description}
          </Text>

          {/* Barra de Progresso */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{overallProgress}%</Text>
          </View>
        </View>
      </View>

      {/* Divisoria */}
      <View style={styles.divider} />

      {/* Secao de Modulos (Carrossel) - Apenas se houver mais de 1 modulo */}
      {modules.length > 1 && (
        <>
          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>Módulos</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modulesList}
            >
              {modules.map((module, index) => {
                const stats = getModuleStats(module);
                return (
                  <ModuleCard
                    key={module.id}
                    module={module}
                    index={index}
                    isSelected={selectedModuleIndex === index}
                    onPress={() => handleSelectModule(index)}
                    completedLessons={stats.completedLessons}
                    totalLessons={stats.totalLessons}
                  />
                );
              })}
            </ScrollView>
          </View>

          {/* Divisoria */}
          <View style={styles.divider} />
        </>
      )}

      {/* Secao de Aulas */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionTitle}>
          {modules.length > 1 ? `Aulas - ${selectedModule?.title}` : 'Aulas'}
        </Text>

        <ScrollView
          style={styles.lessonsList}
          showsVerticalScrollIndicator={false}
        >
          {selectedModule?.lessons.map((lesson, index) => (
            <LessonItemComponent
              key={lesson.id}
              lesson={lesson}
              index={index}
              onToggle={() => handleToggleLesson(lesson.id)}
              onNumberPress={() => handleLessonNumberPress(index)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Modal de Informacoes do Produto */}
      <ProductInfoModal
        visible={infoModalVisible}
        onClose={handleCloseInfoModal}
        product={product}
        modules={modules}
      />

      {/* Modal de Detalhes da Aula */}
      <LessonDetailsModal
        visible={lessonDetailsModalVisible}
        onClose={handleCloseLessonDetailsModal}
        lesson={selectedModule?.lessons[selectedLessonIndex] ? convertToTrainingContent(selectedModule.lessons[selectedLessonIndex]) : null}
        lessonIndex={selectedLessonIndex}
        lessonImage={getLessonImage(selectedLessonIndex)}
      />
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1, //......................Ocupa tela inteira
    backgroundColor: COLORS.background, //..Fundo cinza
    paddingTop: Platform.OS === 'web' ? 0 : StatusBar.currentHeight || 0, //..Padding status bar
  },

  // Header
  header: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 12, //..........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
    borderBottomWidth: 1, //.........Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
  },

  // Botao Voltar
  backButton: {
    width: 40, //...................Largura
    height: 40, //..................Altura
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Secao de Informacoes do Produto
  productInfoSection: {
    flexDirection: 'row', //.........Layout horizontal
    padding: 16, //..................Padding
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Wrapper da Imagem do Produto
  productImageWrapper: {
    marginRight: 12, //..............Margem direita
  },

  // Imagem do Produto
  productImage: {
    width: PRODUCT_IMAGE_WIDTH, //...........Largura da imagem
    height: PRODUCT_IMAGE_HEIGHT, //..........Altura da imagem
    borderRadius: PRODUCT_IMAGE_BORDER_RADIUS, //..Bordas arredondadas
  },

  // Container da Letra do Produto
  productLetterContainer: {
    width: PRODUCT_IMAGE_WIDTH, //...........Largura do container
    height: PRODUCT_IMAGE_HEIGHT, //..........Altura do container
    borderRadius: PRODUCT_IMAGE_BORDER_RADIUS, //..Bordas arredondadas
    backgroundColor: '#021632', //...........Fundo escuro
    justifyContent: 'center', //............Centraliza verticalmente
    alignItems: 'center', //................Centraliza horizontalmente
  },

  // Texto da Letra do Produto
  productLetterText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 32, //.................Tamanho da fonte
    color: '#FCFCFC', //.............Cor clara
  },

  // Info do Produto
  productInfo: {
    flex: 1, //......................Ocupa espaco disponivel
    justifyContent: 'center', //.....Centraliza verticalmente
  },

  // Nome do Produto
  productName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 4, //..............Margem inferior
  },

  // Descricao do Produto
  productDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
    marginBottom: 8, //..............Margem inferior
  },

  // Linha de Progresso
  progressRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 8, //......................Espaco entre elementos
  },

  // Container da Barra de Progresso
  progressBarContainer: {
    flex: 1, //......................Ocupa espaco disponivel
    height: 6, //...................Altura
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 3, //..............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow
  },

  // Preenchimento da Barra de Progresso
  progressBarFill: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Cor azul
    borderRadius: 3, //..............Bordas arredondadas
  },

  // Texto do Progresso
  progressText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.primary, //........Cor azul
    width: 40, //....................Largura fixa
    textAlign: 'right', //...........Alinha direita
  },

  // Divisoria
  divider: {
    height: 1, //...................Altura fina
    backgroundColor: COLORS.border, //..Cor da borda
  },

  // Secao de Modulos
  modulesSection: {
    paddingTop: 16, //...............Padding superior
    paddingBottom: 8, //.............Padding inferior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 12, //.............Margem inferior
    marginLeft: 16, //...............Margem esquerda
  },

  // Lista de Modulos
  modulesList: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingBottom: 8, //.............Padding inferior
  },

  // Card do Modulo
  moduleCard: {
    width: 140, //..................Largura fixa
    padding: 12, //..................Padding interno
    marginRight: 12, //..............Margem direita
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 12, //..............Bordas arredondadas
    borderWidth: 1, //...............Largura da borda
    borderColor: COLORS.border, //...Cor da borda
  },

  // Card do Modulo Selecionado
  moduleCardSelected: {
    borderColor: COLORS.primary, //..Borda azul
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Numero do Modulo
  moduleNumber: {
    width: 32, //...................Largura
    height: 32, //..................Altura
    borderRadius: 16, //.............Bordas arredondadas
    backgroundColor: COLORS.border, //..Fundo cinza
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    marginBottom: 8, //..............Margem inferior
  },

  // Numero do Modulo Selecionado
  moduleNumberSelected: {
    backgroundColor: COLORS.primary, //..Fundo azul
  },

  // Texto do Numero do Modulo
  moduleNumberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
  },

  // Texto do Numero do Modulo Selecionado
  moduleNumberTextSelected: {
    color: COLORS.white, //..........Cor branca
  },

  // Titulo do Modulo
  moduleTitle: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 4, //..............Margem inferior
    height: 32, //...................Altura fixa para 2 linhas
  },

  // Container da Linha de Progresso e Contador
  moduleProgressRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    width: '100%', //..................Largura total
    gap: 6, //........................Espaco entre barra e contador
  },

  // Contador do Modulo
  moduleCounter: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
  },

  // Container da Barra de Progresso do Modulo
  moduleProgressContainer: {
    flex: 1, //......................Ocupa espaco disponivel
    height: 4, //...................Altura
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 2, //..............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow
  },

  // Barra de Progresso do Modulo
  moduleProgressBar: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Cor azul
    borderRadius: 2, //..............Bordas arredondadas
  },

  // Secao de Aulas
  lessonsSection: {
    flex: 1, //......................Ocupa espaco disponivel
    paddingHorizontal: 16, //........Padding horizontal
    paddingTop: 16, //...............Padding superior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Lista de Aulas
  lessonsList: {
    flex: 1, //......................Ocupa espaco disponivel
  },

  // Card de Aula (Container Pai)
  lessonCard: {
    flexDirection: 'row', //...............Layout horizontal
    alignItems: 'stretch', //..............Estica itens na vertical
    paddingTop: LESSON_CARD_PADDING_TOP, //..Padding superior
    paddingBottom: LESSON_CARD_PADDING_BOTTOM, //..Padding inferior
    paddingLeft: LESSON_CARD_PADDING_LEFT, //..Padding esquerdo
    paddingRight: LESSON_CARD_PADDING_RIGHT, //..Padding direito
    marginBottom: LESSON_CARD_MARGIN_BOTTOM, //..Margem inferior entre cards
    borderWidth: 0, //.....................Sem borda (zero pixels)
    borderRadius: LESSON_CARD_BORDER_RADIUS, //..Bordas arredondadas
    backgroundColor: COLORS.white, //......Fundo branco
  },

  // Container do Numero da Aula
  lessonNumberContainer: {
    width: LESSON_NUMBER_WIDTH, //...........Largura fixa
    height: LESSON_NUMBER_HEIGHT, //.........Altura fixa
    borderRadius: LESSON_NUMBER_BORDER_RADIUS, //..Bordas arredondadas
    backgroundColor: '#021632', //...........Fundo azul escuro padrao
    justifyContent: 'center', //.............Centraliza verticalmente
    alignItems: 'center', //.................Centraliza horizontalmente
    marginRight: LESSON_NUMBER_MARGIN_RIGHT, //..Margem direita
  },

  // Texto do Numero da Aula
  lessonNumberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.white, //............Cor branca
  },

  // Container de Informacoes da Aula
  lessonInfoContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    minHeight: LESSON_INFO_MIN_HEIGHT, //..Altura minima
    justifyContent: 'center', //.......Centraliza verticalmente
  },

  // Titulo da Aula
  lessonTitle: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Divisoria da Aula
  lessonDivider: {
    height: 1, //....................Altura fina
    backgroundColor: COLORS.border, //..Cor cinza
    marginVertical: 8, //.............Margem vertical
  },

  // Linha de Execucao
  lessonExecutionRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    justifyContent: 'space-between', //..Espaco entre elementos
  },

  // Container de Duracao
  lessonDurationContainer: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 6, //......................Espaco entre elementos
  },

  // Duracao da Aula
  lessonDuration: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Progresso da Aula
  lessonProgress: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //...................Tamanho da fonte
  },
});

export default ProductDetailScreen;

// Exporta ProductInfoModal para uso em outras telas
export { ProductInfoModal };

