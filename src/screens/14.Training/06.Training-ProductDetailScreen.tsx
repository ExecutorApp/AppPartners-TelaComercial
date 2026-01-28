import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  Image,
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
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

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
}

const LessonItemComponent: React.FC<LessonItemProps> = ({
  lesson,
  index,
  onToggle,
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
    <TouchableOpacity
      style={styles.lessonCard}
      onPress={onToggle}
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
        {/* Imagem ou Letra */}
        <View style={styles.productImageWrapper}>
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
        </View>

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
            />
          ))}
        </ScrollView>
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
    borderWidth: 1, //.....................Borda em volta do card
    borderColor: COLORS.border, //.........Cor cinza claro da borda
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
