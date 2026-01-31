import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  COLORS,
  TrainingContentItem,
  BackIcon,
  MOCK_TRAININGS,
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';
import TrainingInfoModal from './10.Training-InfoModal';
import LessonDetailsModal from './09.Training-LessonDetailsModal';
import { LessonItemComponent, MOCK_MODULES_BY_TRAINING } from './05.Training-DetailScreen01';
import { createStyles } from './05.Training-DetailScreen03';

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type TrainingDetailNavigationProp = StackNavigationProp<RootStackParamList>;
type TrainingDetailRouteProp = RouteProp<RootStackParamList, 'TrainingDetail'>;

// ========================================
// COMPONENTE TRAINING DETAIL SCREEN
// ========================================

const TrainingDetailScreen: React.FC = () => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Navegacao
  const navigation = useNavigation<TrainingDetailNavigationProp>();
  const route = useRoute<TrainingDetailRouteProp>();

  // Obtem ID do treinamento da rota
  const { trainingId } = route.params;

  // Busca treinamento pelo ID
  const training = useMemo(() => {
    return MOCK_TRAININGS.find(t => t.id === trainingId);
  }, [trainingId]);

  // Verifica se este treinamento tem modulos
  const trainingModules = MOCK_MODULES_BY_TRAINING[trainingId];
  const hasModules = trainingModules && trainingModules.length > 0;

  // Estado do modulo selecionado
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);

  // Estado da aba selecionada (description ou lessons)
  const [selectedTab, setSelectedTab] = useState<'description' | 'lessons'>('description');

  // Estado dos modais
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [lessonDetailsModalVisible, setLessonDetailsModalVisible] = useState(false);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);

  // Estado dos conteudos
  const [contents, setContents] = useState<TrainingContentItem[]>(
    training?.contents || []
  );

  // Calcula progresso atual
  const currentProgress = useMemo(() => {
    if (contents.length === 0) return 0;
    const completed = contents.filter(c => c.completed).length;
    return Math.round((completed / contents.length) * 100);
  }, [contents]);

  // Modulo selecionado atualmente
  const currentModule = hasModules ? trainingModules[selectedModuleIndex] : null;

  // Volta para tela anterior
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Navega para o player ao clicar em uma aula
  const handleLessonPress = useCallback((lessonIndex: number) => {
    navigation.navigate(ScreenNames.TrainingPlayer, {
      trainingId: trainingId,
      lessonIndex: lessonIndex,
    });
  }, [navigation, trainingId]);

  // Abre modal de informacoes do treinamento
  const handleTrainingImagePress = useCallback(() => {
    console.log('[TrainingDetail] ========== CLIQUE NA IMAGEM ==========');
    console.log('[TrainingDetail] Training:', training?.title, '(ID:', training?.id + ')');
    console.log('[TrainingDetail] infoModalVisible ANTES:', infoModalVisible);
    setInfoModalVisible(true);
    console.log('[TrainingDetail] setInfoModalVisible(true) CHAMADO');
  }, [training, infoModalVisible]);

  // Fecha modal de informacoes do treinamento
  const handleCloseInfoModal = useCallback(() => {
    setInfoModalVisible(false);
  }, []);

  // Abre modal de detalhes da aula
  const handleLessonImagePress = useCallback((lessonIndex: number) => {
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
    // Usa o indice para selecionar a imagem, com fallback para a primeira
    return images[index % images.length] || images[0];
  }, []);

  // Cria estilos
  const styles = useMemo(() => createStyles(), []);

  // Log do estado do modal
  console.log('[TrainingDetail] Render - infoModalVisible:', infoModalVisible);
  console.log('[TrainingDetail] Render - training:', training?.title);

  // Se fontes nao carregaram ou treinamento nao existe
  if (!fontsLoaded || !training) return null;

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

      {/* Informacoes do Treinamento (Novo Layout Compacto) */}
      <View style={styles.trainingInfoSection}>
        {/* Imagem ou Letra - Clicavel */}
        <TouchableOpacity
          style={styles.trainingImageWrapper}
          onPress={handleTrainingImagePress}
          activeOpacity={0.7}
        >
          {training.thumbnail ? (
            <Image
              source={{ uri: training.thumbnail }}
              style={styles.trainingImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.trainingLetterContainer}>
              <Text style={styles.trainingLetterText}>
                {training.title.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Info do Treinamento */}
        <View style={styles.trainingInfo}>
          <Text style={styles.trainingName}>{training.title}</Text>
          <Text style={styles.trainingDescription} numberOfLines={2}>
            {training.description}
          </Text>

          {/* Barra de Progresso */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${currentProgress}%` }]} />
            </View>
            <Text style={styles.progressText}>{String(currentProgress).padStart(2, '0')}%</Text>
          </View>
        </View>
      </View>

      {/* Carrossel de Modulos (Se tiver modulos) */}
      {hasModules && (
        <>
          <View style={styles.divider} />
          <View style={styles.modulesSection}>
            <Text style={styles.sectionTitle}>Módulos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modulesCarousel}
            >
              {trainingModules.map((module, index) => (
                <TouchableOpacity
                  key={module.id}
                  style={[
                    styles.moduleCard,
                    selectedModuleIndex === index && styles.moduleCardActive,
                  ]}
                  onPress={() => setSelectedModuleIndex(index)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.moduleCardTitle,
                    selectedModuleIndex === index && styles.moduleCardTitleActive,
                  ]}>
                    {module.title}
                  </Text>
                  <Text style={[
                    styles.moduleCardDescription,
                    selectedModuleIndex === index && styles.moduleCardDescriptionActive,
                  ]} numberOfLines={2}>
                    {module.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </>
      )}

      {/* Divisoria */}
      <View style={styles.divider} />

      {/* Nome do Modulo e Abas (se houver modulo selecionado) */}
      {hasModules && currentModule && (
        <View style={styles.moduleHeaderSection}>
          {/* Nome do Modulo */}
          <Text style={styles.moduleName}>{currentModule.title}</Text>

          {/* Abas de Navegacao */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'description' && styles.tabActive,
              ]}
              onPress={() => setSelectedTab('description')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'description' && styles.tabTextActive,
              ]}>
                Descrição
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === 'lessons' && styles.tabActive,
              ]}
              onPress={() => setSelectedTab('lessons')}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                selectedTab === 'lessons' && styles.tabTextActive,
              ]}>
                Aulas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Conteudo Baseado na Aba Selecionada */}
      <View style={styles.tabContentSection}>
        {hasModules && currentModule ? (
          <>
            {selectedTab === 'description' ? (
              // Aba de Descricao: Mostra descricao completa do modulo
              <ScrollView
                style={styles.descriptionScroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.descriptionContent}
              >
                <Text style={styles.fullModuleDescription}>
                  {currentModule.description}
                  {'\n\n'}
                  Neste módulo você irá aprender os fundamentos essenciais e desenvolver
                  habilidades práticas que serão aplicadas ao longo de todo o treinamento.
                  Cada aula foi cuidadosamente planejada para proporcionar uma experiência
                  de aprendizado progressiva e eficiente.
                </Text>
              </ScrollView>
            ) : (
              // Aba de Aulas: Mostra cards de aulas
              <ScrollView
                style={styles.lessonsList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.lessonsListContent}
              >
                {contents.map((item, index) => (
                  <LessonItemComponent
                    key={item.id}
                    item={item}
                    index={index}
                    onPress={() => handleLessonPress(index)}
                    onImagePress={() => handleLessonImagePress(index)}
                    styles={styles}
                  />
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          // Sem modulos: Mostra aulas diretamente sem abas
          <ScrollView
            style={styles.lessonsList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.lessonsListContent}
          >
            <Text style={styles.sectionTitle}>Aulas</Text>
            {contents.map((item, index) => (
              <LessonItemComponent
                key={item.id}
                item={item}
                index={index}
                onPress={() => handleLessonPress(index)}
                onImagePress={() => handleLessonImagePress(index)}
                styles={styles}
              />
            ))}
          </ScrollView>
        )}

      </View>

      {/* Modal de Informacoes do Treinamento */}
      <TrainingInfoModal
        visible={infoModalVisible}
        onClose={handleCloseInfoModal}
        training={training}
      />

      {/* Modal de Detalhes da Aula */}
      <LessonDetailsModal
        visible={lessonDetailsModalVisible}
        onClose={handleCloseLessonDetailsModal}
        lesson={contents[selectedLessonIndex]}
        lessonIndex={selectedLessonIndex}
        lessonImage={getLessonImage(selectedLessonIndex)}
      />
    </View>
  );
};

export default TrainingDetailScreen;
