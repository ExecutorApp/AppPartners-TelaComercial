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
import {
  COLORS,
  TrainingCategory,
  TrainingItem,
  CategoryItem,
  MOCK_CATEGORIES,
  MOCK_TRAININGS,
  calculateOverallProgress,
  countByStatus,
  filterByCategory,
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type TrainingNavigationProp = StackNavigationProp<RootStackParamList>;

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

  // Estados
  const [sideMenuVisible, setSideMenuVisible] = useState(false); //......Menu lateral
  const [selectedCategory, setSelectedCategory] = useState<TrainingCategory | null>(null); //..Categoria selecionada
  const [trainings] = useState<TrainingItem[]>(MOCK_TRAININGS); //......Lista de treinamentos
  const [categories] = useState<CategoryItem[]>(MOCK_CATEGORIES); //....Lista de categorias

  // Progresso geral calculado
  const overallProgress = useMemo(() => calculateOverallProgress(trainings), [trainings]);

  // Contadores de status
  const completedCount = useMemo(() => countByStatus(trainings, 'completed'), [trainings]);
  const inProgressCount = useMemo(() => countByStatus(trainings, 'in_progress'), [trainings]);

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

  // Seleciona ou deseleciona categoria
  const handleCategoryPress = useCallback((category: TrainingCategory) => {
    setSelectedCategory(prev => prev === category ? null : category);
  }, []);

  // Navega para detalhes do treinamento
  const handleTrainingPress = useCallback((training: TrainingItem) => {
    navigation.navigate(ScreenNames.TrainingDetail, { trainingId: training.id });
  }, [navigation]);

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

      {/* Conteudo Principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Container de Progresso Geral */}
        <View style={styles.progressSection}>
          {/* Titulo */}
          <Text style={styles.sectionTitle}>Progresso Geral</Text>

          {/* Barra de Progresso */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${overallProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressPercentage}>{overallProgress}%</Text>
          </View>

          {/* Contadores */}
          <View style={styles.countersRow}>
            <Text style={styles.counterText}>
              <Text style={styles.counterValue}>{completedCount}</Text> concluídos
            </Text>
            <View style={styles.counterSeparator} />
            <Text style={styles.counterText}>
              <Text style={styles.counterValueWarning}>{inProgressCount}</Text> em andamento
            </Text>
          </View>
        </View>

        {/* Divisoria */}
        <View style={styles.divider} />

        {/* Secao de Categorias */}
        <View style={styles.categoriesSection}>
          {/* Titulo */}
          <Text style={styles.sectionTitle}>Categorias</Text>

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
              />
            ))}
          </ScrollView>
        </View>

        {/* Divisoria */}
        <View style={styles.divider} />

        {/* Secao de Treinamentos */}
        <View style={styles.trainingsSection}>
          {/* Titulo */}
          <Text style={styles.sectionTitle}>
            {selectedCategory
              ? `Treinamentos de ${categories.find(c => c.key === selectedCategory)?.title || ''}`
              : 'Todos os Treinamentos'}
          </Text>

          {/* Lista de Treinamentos */}
          {filteredTrainings.length === 0 ? (
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
              />
            ))
          )}
        </View>
      </ScrollView>

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

  // ScrollView
  scrollView: {
    flex: 1, //......................Ocupa espaco disponivel
  },

  // Conteudo do ScrollView
  scrollContent: {
    paddingBottom: 24, //............Padding inferior
  },

  // Secao de Progresso Geral
  progressSection: {
    paddingHorizontal: 16, //.......Padding horizontal
    paddingVertical: 16, //..........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 12, //...............Margem inferior
  },

  // Container da Barra de Progresso
  progressBarContainer: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 12, //......................Espaco entre elementos
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

  // Linha de Contadores
  countersRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    marginTop: 12, //.................Margem superior
  },

  // Texto do Contador
  counterText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Valor do Contador
  counterValue: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    color: COLORS.success, //..........Cor verde
  },

  // Valor do Contador (Warning)
  counterValueWarning: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    color: COLORS.warning, //..........Cor amarela
  },

  // Separador entre Contadores
  counterSeparator: {
    width: 1, //......................Largura
    height: 12, //...................Altura
    backgroundColor: COLORS.border, //..Cor cinza
    marginHorizontal: 12, //..........Margem horizontal
  },

  // Divisoria
  divider: {
    height: 8, //.....................Altura
    backgroundColor: COLORS.background, //..Fundo cinza
  },

  // Secao de Categorias
  categoriesSection: {
    paddingTop: 16, //................Padding superior
    paddingBottom: 8, //..............Padding inferior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Lista de Categorias
  categoriesList: {
    paddingHorizontal: 16, //.........Padding horizontal
    paddingBottom: 8, //..............Padding inferior
  },

  // Secao de Treinamentos
  trainingsSection: {
    paddingHorizontal: 16, //.........Padding horizontal
    paddingTop: 16, //................Padding superior
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
