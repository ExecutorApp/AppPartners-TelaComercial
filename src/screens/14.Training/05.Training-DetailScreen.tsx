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
  TrainingContentItem,
  BackIcon,
  getContentTypeIcon,
  formatDuration,
  MOCK_TRAININGS,
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

// ========================================
// CONSTANTES DA IMAGEM DO TREINAMENTO (HEADER)
// ========================================

const TRAINING_IMAGE_WIDTH = 65; //..........Largura da imagem do treinamento
const TRAINING_IMAGE_HEIGHT = 80; //.........Altura da imagem do treinamento
const TRAINING_IMAGE_BORDER_RADIUS = 8; //...Arredondamento da imagem

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

type TrainingDetailNavigationProp = StackNavigationProp<RootStackParamList>;
type TrainingDetailRouteProp = RouteProp<RootStackParamList, 'TrainingDetail'>;

// ========================================
// COMPONENTE LESSON ITEM
// ========================================

interface LessonItemProps {
  item: TrainingContentItem; //...............Dados da aula
  index: number; //....................Indice da aula
  onPress: () => void; //..............Callback ao clicar
}

const LessonItemComponent: React.FC<LessonItemProps> = ({
  item,
  index,
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
      style={styles.lessonCard}
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
        {/* Imagem ou Letra */}
        <View style={styles.trainingImageWrapper}>
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
        </View>

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
            <Text style={styles.progressText}>{currentProgress}%</Text>
          </View>
        </View>
      </View>

      {/* Divisoria */}
      <View style={styles.divider} />

      {/* Secao de Aulas */}
      <View style={styles.lessonsSection}>
        <Text style={styles.sectionTitle}>Aulas</Text>

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

  // Secao de Informacoes do Treinamento
  trainingInfoSection: {
    flexDirection: 'row', //.........Layout horizontal
    padding: 16, //..................Padding
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Wrapper da Imagem do Treinamento
  trainingImageWrapper: {
    marginRight: 12, //..............Margem direita
  },

  // Imagem do Treinamento
  trainingImage: {
    width: TRAINING_IMAGE_WIDTH, //...........Largura da imagem
    height: TRAINING_IMAGE_HEIGHT, //..........Altura da imagem
    borderRadius: TRAINING_IMAGE_BORDER_RADIUS, //..Bordas arredondadas
  },

  // Container da Letra do Treinamento
  trainingLetterContainer: {
    width: TRAINING_IMAGE_WIDTH, //...........Largura do container
    height: TRAINING_IMAGE_HEIGHT, //..........Altura do container
    borderRadius: TRAINING_IMAGE_BORDER_RADIUS, //..Bordas arredondadas
    backgroundColor: '#021632', //...........Fundo escuro
    justifyContent: 'center', //............Centraliza verticalmente
    alignItems: 'center', //................Centraliza horizontalmente
  },

  // Texto da Letra do Treinamento
  trainingLetterText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 32, //.................Tamanho da fonte
    color: '#FCFCFC', //.............Cor clara
  },

  // Info do Treinamento
  trainingInfo: {
    flex: 1, //......................Ocupa espaco disponivel
    justifyContent: 'center', //.....Centraliza verticalmente
  },

  // Nome do Treinamento
  trainingName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 4, //..............Margem inferior
  },

  // Descricao do Treinamento
  trainingDescription: {
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

  // Secao de Aulas
  lessonsSection: {
    flex: 1, //......................Ocupa espaco disponivel
    paddingHorizontal: 16, //........Padding horizontal
    paddingTop: 16, //...............Padding superior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 12, //.............Margem inferior
  },

  // Lista de Aulas
  lessonsList: {
    flex: 1, //......................Ocupa espaco disponivel
  },

  // Conteudo da Lista de Aulas
  lessonsListContent: {
    paddingBottom: 16, //...........Padding inferior
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

export default TrainingDetailScreen;
