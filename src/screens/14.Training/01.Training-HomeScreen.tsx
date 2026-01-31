import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../5.Side Menu/2.Header';
import SideMenuScreen from '../5.Side Menu/1.SideMenuScreen';
import CategoryCard from './03.Training-CategoryCard';
import CourseCard from './04.Training-CourseCard';
import ProductCard from './05.Training-ProductCard';
import TrainingInfoModal from './10.Training-InfoModal';
import { ProductInfoModal } from './06.Training-ProductDetailScreen';
import {
  COLORS,
  TrainingCategory,
  TrainingItem,
  CategoryItem,
  ProductItem,
  MOCK_CATEGORIES,
  MOCK_TRAININGS,
  MOCK_PRODUCTS,
  calculateOverallProgress,
  countByStatus,
  filterByCategory,
} from './02.Training-Types';
import { useTrainingProgress } from './04.Training-useProgress';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type TrainingNavigationProp = StackNavigationProp<RootStackParamList>;

// ========================================
// TITULOS PERSONALIZADOS POR CATEGORIA
// ========================================

const CATEGORY_SECTION_TITLES: Record<TrainingCategory, string> = {
  aplicativo: 'Tudo sobre o nosso aplicativo', //..Titulo da categoria aplicativo
  produto: 'Tudo sobre nossos produtos', //.......Titulo da categoria produto
  comercial: 'Tudo sobre vendas', //...............Titulo da categoria comercial
  operacional: 'Tudo sobre processos', //..........Titulo da categoria operacional
  desenvolvimento: 'Tudo sobre desenvolvimento pessoal & prof.', //..Titulo da categoria desenvolvimento
};

// ========================================
// AJUSTES MANUAIS - TELA DE TREINAMENTOS
// ========================================

const PROGRESS_BAR_MARGIN_BOTTOM = 0; //............Margem inferior da barra de progresso (LINHA 51)
const COUNTERS_CONTAINER_MARGIN_LEFT = -1; //......Margem esquerda do container (LINHA 52)
const COUNTERS_CONTAINER_MARGIN_RIGHT = -1; //.....Margem direita do container (LINHA 53)

// Largura de cada contador
const COUNTER_WIDTH_TOTAL = 50; //...........Largura do contador Total (LINHA 56)
const COUNTER_WIDTH_EM_ANDAMENTO = 85; //....Largura do contador Em andamento (LINHA 57)
const COUNTER_WIDTH_CONCLUIDOS = 70; //.......Largura do contador Concluidos (LINHA 58)
const COUNTER_WIDTH_NAO_INICIADOS = 90; //...Largura do contador Nao iniciados (LINHA 59)

// Padding esquerdo de cada contador
const COUNTER_PADDING_LEFT_TOTAL = 10; //............Padding esquerdo do contador Total (LINHA 62)
const COUNTER_PADDING_LEFT_EM_ANDAMENTO = 0; //.....Padding esquerdo do contador Em andamento (LINHA 63)
const COUNTER_PADDING_LEFT_CONCLUIDOS = 0; //........Padding esquerdo do contador Concluidos (LINHA 64)
const COUNTER_PADDING_LEFT_NAO_INICIADOS = 0; //....Padding esquerdo do contador Nao iniciados (LINHA 65)

// Padding direito de cada contador
const COUNTER_PADDING_RIGHT_TOTAL = 0; //...........Padding direito do contador Total (LINHA 68)
const COUNTER_PADDING_RIGHT_EM_ANDAMENTO = 0; //....Padding direito do contador Em andamento (LINHA 69)
const COUNTER_PADDING_RIGHT_CONCLUIDOS = 0; //.......Padding direito do contador Concluidos (LINHA 70)
const COUNTER_PADDING_RIGHT_NAO_INICIADOS = 5; //...Padding direito do contador Nao iniciados (LINHA 71)

// Espacamento da barra de progresso
const PROGRESS_BAR_MARGIN_TOP = 10; //..............Margem superior da barra de progresso (LINHA 74)
const PROGRESS_BAR_MARGIN_LEFT = 2; //..............Margem esquerda da barra de progresso (LINHA 75)
const PROGRESS_BAR_MARGIN_RIGHT = 5; //.............Margem direita da barra de progresso (LINHA 76)

// Espacamento da secao de categorias
const CATEGORIES_SECTION_PADDING_TOP = 15; //......Espacamento superior da secao de categorias (LINHA 79)
const CATEGORIES_SECTION_PADDING_BOTTOM = 8; //....Espacamento inferior da secao de categorias (LINHA 80)

// ========================================
// COMPONENTE TRAINING HOME SCREEN
// ========================================

const TrainingHomeScreen: React.FC = () => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Navegacao
  const navigation = useNavigation<TrainingNavigationProp>();

  // Hook de progresso
  const { getTrainingsWithProgress } = useTrainingProgress();

  // Estados
  const [sideMenuVisible, setSideMenuVisible] = useState(false); //......Menu lateral
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory>('aplicativo'); //..Categoria selecionada
  const [categories] = useState<CategoryItem[]>(MOCK_CATEGORIES); //....Lista de categorias
  const [products] = useState<ProductItem[]>(MOCK_PRODUCTS); //..........Lista de produtos
  const [infoModalVisible, setInfoModalVisible] = useState(false); //....Modal de informacoes do treinamento
  const [selectedTraining, setSelectedTraining] = useState<TrainingItem | null>(null); //..Treinamento selecionado para info
  const [productInfoModalVisible, setProductInfoModalVisible] = useState(false); //..Modal de informacoes do produto
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null); //..Produto selecionado para info

  // Lista de treinamentos com progresso aplicado
  const trainings = useMemo(() => getTrainingsWithProgress(MOCK_TRAININGS), [getTrainingsWithProgress]);

  // Progresso geral calculado
  const overallProgress = useMemo(() => calculateOverallProgress(trainings), [trainings]);

  // Contadores de status
  const totalCount = trainings.length; //.............................Total de treinamentos
  const completedCount = useMemo(() => countByStatus(trainings, 'completed'), [trainings]);
  const inProgressCount = useMemo(() => countByStatus(trainings, 'in_progress'), [trainings]);
  const notStartedCount = useMemo(() => countByStatus(trainings, 'not_started'), [trainings]);

  // Treinamentos filtrados por categoria
  const filteredTrainings = useMemo(
    () => filterByCategory(trainings, selectedCategory),
    [trainings, selectedCategory]
  );

  // Abre menu lateral
  const openSideMenu = useCallback(() => {
    setSideMenuVisible(true);
  }, []);

  // Fecha menu lateral
  const closeSideMenu = useCallback(() => {
    setSideMenuVisible(false);
  }, []);

  // Seleciona categoria
  const handleCategoryPress = useCallback((category: TrainingCategory) => {
    setSelectedCategory(category);
  }, []);

  // Navega para detalhes do treinamento
  const handleTrainingPress = useCallback((training: TrainingItem) => {
    navigation.navigate(ScreenNames.TrainingDetail, { trainingId: training.id });
  }, [navigation]);

  // Navega para detalhes do produto
  const handleProductPress = useCallback((product: ProductItem) => {
    navigation.navigate(ScreenNames.ProductDetail, { productId: product.id });
  }, [navigation]);

  // Abre modal de informacoes do treinamento
  const handleTrainingImagePress = useCallback((training: TrainingItem) => {
    setSelectedTraining(training);
    setInfoModalVisible(true);
  }, []);

  // Fecha modal de informacoes
  const handleCloseInfoModal = useCallback(() => {
    setInfoModalVisible(false);
  }, []);

  // Abre modal de informacoes do produto (se tiver modulos)
  const handleProductImagePress = useCallback((product: ProductItem) => {
    if (product.modules && product.modules.length > 0) {
      setSelectedProduct(product);
      setProductInfoModalVisible(true);
    }
  }, []);

  // Fecha modal de informacoes do produto
  const handleCloseProductInfoModal = useCallback(() => {
    setProductInfoModalVisible(false);
  }, []);

  // Se fontes nao carregaram, nao renderiza
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <Header
        title="Treinamentos"
        onMenuPress={openSideMenu}
        notificationCount={inProgressCount}
      />

      {/* Divisoria do Header */}
      <View style={styles.headerDivider} />

      {/* Container de Progresso Geral */}
      <View style={styles.progressSection}>
        {/* Titulo Progresso Geral */}
        <Text style={styles.progressTitle}>Progresso Geral</Text>

        {/* Container com Borda dos Contadores */}
        <View style={styles.statusCountersBorderedContainer}>
          {/* Total (LARGURA: LINHA 56 | PADDING: LINHAS 62 e 68) */}
          <View style={[styles.statusCounterItemFixed, { width: COUNTER_WIDTH_TOTAL, paddingLeft: COUNTER_PADDING_LEFT_TOTAL, paddingRight: COUNTER_PADDING_RIGHT_TOTAL }]}>
            <Text style={styles.statusCounterNumber}>
              {String(totalCount).padStart(2, '0')}
            </Text>
            <Text style={styles.statusCounterLabel}>Total</Text>
          </View>

          {/* Divisoria */}
          <View style={styles.statusCounterDivider} />

          {/* Em andamento (LARGURA: LINHA 57 | PADDING: LINHAS 63 e 69) */}
          <View style={[styles.statusCounterItemFixed, { width: COUNTER_WIDTH_EM_ANDAMENTO, paddingLeft: COUNTER_PADDING_LEFT_EM_ANDAMENTO, paddingRight: COUNTER_PADDING_RIGHT_EM_ANDAMENTO }]}>
            <Text style={styles.statusCounterNumber}>
              {String(inProgressCount).padStart(2, '0')}
            </Text>
            <Text style={styles.statusCounterLabel}>Em andamento</Text>
          </View>

          {/* Divisoria */}
          <View style={styles.statusCounterDivider} />

          {/* Concluidos (LARGURA: LINHA 58 | PADDING: LINHAS 64 e 70) */}
          <View style={[styles.statusCounterItemFixed, { width: COUNTER_WIDTH_CONCLUIDOS, paddingLeft: COUNTER_PADDING_LEFT_CONCLUIDOS, paddingRight: COUNTER_PADDING_RIGHT_CONCLUIDOS }]}>
            <Text style={[styles.statusCounterNumber, { color: COLORS.primary }]}>
              {String(completedCount).padStart(2, '0')}
            </Text>
            <Text style={styles.statusCounterLabel}>Concluídos</Text>
          </View>

          {/* Divisoria */}
          <View style={styles.statusCounterDivider} />

          {/* Nao iniciados (LARGURA: LINHA 59 | PADDING: LINHAS 65 e 71) */}
          <View style={[styles.statusCounterItemFixed, { width: COUNTER_WIDTH_NAO_INICIADOS, paddingLeft: COUNTER_PADDING_LEFT_NAO_INICIADOS, paddingRight: COUNTER_PADDING_RIGHT_NAO_INICIADOS }]}>
            <Text style={[styles.statusCounterNumber, styles.statusCounterSecondary]}>
              {String(notStartedCount).padStart(2, '0')}
            </Text>
            <Text style={styles.statusCounterLabel}>Não iniciados</Text>
          </View>
        </View>

        {/* Barra de Progresso */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${overallProgress}%`, backgroundColor: COLORS.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressPercentage, { color: COLORS.primary }]}>{overallProgress}%</Text>
        </View>
      </View>

      {/* Divisoria Superior das Categorias */}
      <View style={styles.sectionDivider} />

      {/* Secao de Categorias */}
      <View style={styles.categoriesSection}>
        {/* Titulo */}
        <Text style={[styles.sectionTitle, styles.categoriesTitle]}>Categorias</Text>

        {/* Lista Horizontal de Categorias */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.key}
              category={category}
              isSelected={selectedCategory === category.key}
              onPress={() => handleCategoryPress(category.key)}
              hideSelectedBackground={true}
              useBlueProgress={true}
            />
          ))}
        </ScrollView>
      </View>

      {/* Divisoria Inferior das Categorias */}
      <View style={styles.sectionDivider} />

      {/* Wrapper do Scroll */}
      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Secao de Treinamentos ou Produtos */}
          <View style={styles.trainingsSection}>
            {/* Titulo */}
            <Text style={styles.sectionTitle}>
              {CATEGORY_SECTION_TITLES[selectedCategory]}
            </Text>

            {/* Lista de Produtos (quando categoria for produto) */}
            {selectedCategory === 'produto' ? (
              products.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Nenhum produto encontrado
                  </Text>
                </View>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onPress={() => handleProductPress(product)}
                    onImagePress={() => handleProductImagePress(product)}
                    useBlueProgress={true}
                    useInlineProgress={true}
                  />
                ))
              )
            ) : (
              /* Lista de Treinamentos (demais categorias) */
              filteredTrainings.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Nenhum treinamento encontrado
                  </Text>
                </View>
              ) : (
                filteredTrainings.map((training) => (
                  <CourseCard
                    key={training.id}
                    training={training}
                    onPress={() => handleTrainingPress(training)}
                    onImagePress={() => handleTrainingImagePress(training)}
                    useBlueProgress={true}
                    useInlineProgress={true}
                  />
                ))
              )
            )}
          </View>
        </ScrollView>
      </View>

      {/* Modal de Informacoes do Treinamento */}
      <TrainingInfoModal
        visible={infoModalVisible}
        onClose={handleCloseInfoModal}
        training={selectedTraining}
      />

      {/* Modal de Informacoes do Produto */}
      {selectedProduct && (
        <ProductInfoModal
          visible={productInfoModalVisible}
          onClose={handleCloseProductInfoModal}
          product={selectedProduct}
          modules={selectedProduct.modules || []}
        />
      )}

      {/* Menu Lateral */}
      <SideMenuScreen isVisible={sideMenuVisible} onClose={closeSideMenu} />
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

  // Divisoria do Header
  headerDivider: {
    height: 1, //....................Altura da divisoria
    backgroundColor: COLORS.border, //..Cor cinza da borda
  },

  // Wrapper do Scroll
  scrollWrapper: {
    flex: 1, //......................Ocupa espaco disponivel
    position: 'relative', //.........Posicao relativa para filho absolute
    backgroundColor: COLORS.white, //..Fundo branco
    ...Platform.select({
      web: {
        overflow: 'hidden', //........Esconde overflow no web
      } as any,
      default: {},
    }),
  },

  // ScrollView
  scrollView: {
    backgroundColor: COLORS.white, //..Fundo branco
    ...Platform.select({
      web: {
        position: 'absolute', //......Posicao absoluta no web
        top: 0, //....................Topo
        left: 0, //...................Esquerda
        right: 0, //..................Direita
        bottom: 0, //.................Fundo
        overflowY: 'auto', //..........Scroll vertical
        overflowX: 'hidden', //........Sem scroll horizontal
      } as any,
      default: {
        flex: 1, //...................Ocupa espaco disponivel
      },
    }),
  },

  // Conteudo do ScrollView
  scrollContent: {
    paddingBottom: 24, //............Padding inferior
    flexGrow: 1, //..................Cresce para ocupar espaco
  },

  // Secao de Progresso Geral
  progressSection: {
    paddingHorizontal: 16, //.......Padding horizontal
    paddingVertical: 16, //..........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo Progresso Geral
  progressTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 12, //...............Margem inferior
    marginLeft: 5, //..................Margem esquerda de respiro
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 12, //...............Margem inferior
    marginLeft: 5, //..................Margem esquerda
  },

  // Titulo da Secao de Categorias
  categoriesTitle: {
    marginLeft: 20, //................Margem esquerda de respiro
  },

  // Container com Borda dos Contadores
  statusCountersBorderedContainer: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    justifyContent: 'space-between', //..Distribui contadores horizontalmente
    borderWidth: 1, //................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    borderRadius: 8, //...............Bordas arredondadas
    paddingVertical: 10, //...........Padding vertical
    paddingHorizontal: 4, //..........Padding horizontal
    backgroundColor: 'transparent', //..Fundo transparente
    marginLeft: COUNTERS_CONTAINER_MARGIN_LEFT, //..Margem esquerda (LINHA 52)
    marginRight: COUNTERS_CONTAINER_MARGIN_RIGHT, //..Margem direita (LINHA 53)
  },

  // Item do Contador de Status
  statusCounterItemFixed: {
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Numero do Contador de Status
  statusCounterNumber: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 2, //................Margem inferior
  },

  // Numero Secondary (Nao iniciados)
  statusCounterSecondary: {
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Label do Contador de Status
  statusCounterLabel: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Divisoria entre Contadores
  statusCounterDivider: {
    width: 1, //......................Largura
    height: 28, //...................Altura
    backgroundColor: COLORS.border, //..Cor cinza
  },

  // Container da Barra de Progresso
  // ESPACAMENTOS: LINHAS 51, 74, 75 e 76
  progressBarContainer: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 12, //......................Espaco entre elementos
    marginTop: PROGRESS_BAR_MARGIN_TOP, //......Margem superior (LINHA 74)
    marginBottom: PROGRESS_BAR_MARGIN_BOTTOM, //..Margem inferior (LINHA 51)
    marginLeft: PROGRESS_BAR_MARGIN_LEFT, //....Margem esquerda (LINHA 75)
    marginRight: PROGRESS_BAR_MARGIN_RIGHT, //..Margem direita (LINHA 76)
  },

  // Fundo da Barra de Progresso
  progressBarBackground: {
    flex: 1, //.......................Ocupa espaco disponivel
    height: 8, //.....................Altura
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 4, //................Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Preenchimento da Barra de Progresso
  progressBarFill: {
    height: '100%', //................Altura total
    backgroundColor: COLORS.success, //..Cor verde
    borderRadius: 4, //................Bordas arredondadas
  },

  // Porcentagem do Progresso
  progressPercentage: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.success, //..........Cor verde
    width: 40, //......................Largura fixa
    textAlign: 'right', //.............Alinha a direita
  },

  // Divisoria Fina Largura Total
  sectionDivider: {
    height: 1, //.....................Altura fina
    backgroundColor: COLORS.border, //..Cor cinza da borda
  },

  // Secao de Categorias (ESPACAMENTOS: LINHAS 79 e 80)
  categoriesSection: {
    paddingTop: CATEGORIES_SECTION_PADDING_TOP, //......Padding superior (LINHA 79)
    paddingBottom: CATEGORIES_SECTION_PADDING_BOTTOM, //..Padding inferior (LINHA 80)
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Lista de Categorias
  categoriesList: {
    paddingHorizontal: 15, //.........Padding horizontal de respiro
    paddingBottom: 8, //..............Padding inferior
  },

  // Secao de Treinamentos
  trainingsSection: {
    paddingHorizontal: 16, //.........Padding horizontal
    paddingTop: 16, //................Padding superior
    paddingBottom: 16, //.............Padding inferior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Container Vazio
  emptyContainer: {
    paddingVertical: 40, //...........Padding vertical
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Texto Vazio
  emptyText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },
});

export default TrainingHomeScreen;
