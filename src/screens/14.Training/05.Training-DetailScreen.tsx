import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  COLORS,
  TrainingItem,
  TrainingContentItem,
  CATEGORY_LABELS,
  STATUS_LABELS,
  BackIcon,
  TimeIcon,
  CheckIcon,
  getContentTypeIcon,
  formatDuration,
  MOCK_TRAININGS,
} from './02.Training-Types';
import { RootStackParamList, ScreenNames } from '../../types/navigation';

// ========================================
// TIPOS DE NAVEGACAO
// ========================================

type TrainingDetailNavigationProp = StackNavigationProp<RootStackParamList>;
type TrainingDetailRouteProp = RouteProp<RootStackParamList, 'TrainingDetail'>;

// ========================================
// COMPONENTE CONTENT ITEM
// ========================================

interface ContentItemProps {
  item: TrainingContentItem; //......Item de conteudo
  index: number; //..................Indice do item
  onToggle: () => void; //...........Callback ao marcar
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  index,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={styles.contentItem}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* Checkbox */}
      <View
        style={[
          styles.checkbox,
          item.completed && styles.checkboxCompleted,
        ]}
      >
        {item.completed && <CheckIcon color={COLORS.white} />}
      </View>

      {/* Conteudo */}
      <View style={styles.contentInfo}>
        {/* Numero e Titulo */}
        <View style={styles.contentTitleRow}>
          <Text
            style={[
              styles.contentIndex,
              item.completed && styles.contentTextCompleted,
            ]}
          >
            {index + 1}.
          </Text>
          <Text
            style={[
              styles.contentTitle,
              item.completed && styles.contentTextCompleted,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </View>

        {/* Tipo e Duracao */}
        <View style={styles.contentMetaRow}>
          {/* Icone do Tipo */}
          {getContentTypeIcon(item.type, COLORS.textSecondary)}

          {/* Duracao */}
          {item.duration && (
            <Text style={styles.contentDuration}>
              {formatDuration(item.duration)}
            </Text>
          )}
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

  // Alterna estado de conclusao do item
  const handleToggleContent = useCallback((itemId: string) => {
    setContents(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }, []);

  // Continua para proximo conteudo nao concluido
  const handleContinue = useCallback(() => {
    const nextContent = contents.find(c => !c.completed);
    if (nextContent) {
      // Aqui navegaria para o player de video ou conteudo
      console.log('Continuar para:', nextContent.title);
    }
  }, [contents]);

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
          <BackIcon color={COLORS.textPrimary} />
        </TouchableOpacity>

        {/* Titulo */}
        <Text style={styles.headerTitle} numberOfLines={1}>
          Treinamento
        </Text>

        {/* Espaco Vazio */}
        <View style={styles.headerSpacer} />
      </View>

      {/* Conteudo Principal */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Thumbnail / Video Area */}
        <View style={styles.thumbnailContainer}>
          <View style={styles.thumbnailPlaceholder}>
            <Text style={styles.thumbnailText}>
              {training.title.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Informacoes do Treinamento */}
        <View style={styles.infoSection}>
          {/* Titulo */}
          <Text style={styles.trainingTitle}>{training.title}</Text>

          {/* Meta: Categoria, Duracao, Progresso */}
          <View style={styles.metaRow}>
            {/* Categoria */}
            <Text style={styles.categoryText}>
              {CATEGORY_LABELS[training.category]}
            </Text>

            {/* Separador */}
            <View style={styles.metaSeparator} />

            {/* Duracao */}
            <View style={styles.durationContainer}>
              <TimeIcon color={COLORS.textSecondary} />
              <Text style={styles.durationText}>
                {formatDuration(training.estimatedMinutes)}
              </Text>
            </View>

            {/* Separador */}
            <View style={styles.metaSeparator} />

            {/* Progresso */}
            <Text style={styles.progressText}>
              {currentProgress}% concluído
            </Text>
          </View>

          {/* Barra de Progresso */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${currentProgress}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Divisoria */}
        <View style={styles.divider} />

        {/* Secao Sobre */}
        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Sobre este treinamento</Text>
          <Text style={styles.descriptionText}>{training.description}</Text>

          {/* Produto Relacionado */}
          {training.relatedProduct && (
            <View style={styles.relatedItem}>
              <Text style={styles.relatedLabel}>Produto:</Text>
              <Text style={styles.relatedValue}>{training.relatedProduct}</Text>
            </View>
          )}

          {/* Fase Relacionada */}
          {training.relatedPhase && (
            <View style={styles.relatedItem}>
              <Text style={styles.relatedLabel}>Fase:</Text>
              <Text style={styles.relatedValue}>{training.relatedPhase}</Text>
            </View>
          )}

          {/* Atividade Relacionada */}
          {training.relatedActivity && (
            <View style={styles.relatedItem}>
              <Text style={styles.relatedLabel}>Atividade:</Text>
              <Text style={styles.relatedValue}>{training.relatedActivity}</Text>
            </View>
          )}
        </View>

        {/* Divisoria */}
        <View style={styles.divider} />

        {/* Secao de Conteudo */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Conteúdo</Text>

          {/* Lista de Conteudos */}
          {contents.map((item, index) => (
            <ContentItem
              key={item.id}
              item={item}
              index={index}
              onToggle={() => handleToggleContent(item.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Botao Continuar */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            currentProgress === 100 && styles.continueButtonCompleted,
          ]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {currentProgress === 100
              ? 'Treinamento Concluído'
              : 'Continuar Treinamento'}
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'space-between', //..Distribui horizontalmente
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

  // Titulo do Header
  headerTitle: {
    flex: 1, //.....................Ocupa espaco disponivel
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    textAlign: 'center', //..........Centraliza texto
  },

  // Espaco Vazio do Header
  headerSpacer: {
    width: 40, //...................Largura igual ao botao
  },

  // ScrollView
  scrollView: {
    flex: 1, //.....................Ocupa espaco disponivel
  },

  // Conteudo do ScrollView
  scrollContent: {
    paddingBottom: 100, //...........Padding inferior para botao
  },

  // Container da Thumbnail
  thumbnailContainer: {
    width: '100%', //................Largura total
    height: 200, //..................Altura fixa
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Placeholder da Thumbnail
  thumbnailPlaceholder: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Fundo azul
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Texto da Thumbnail
  thumbnailText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 64, //.................Tamanho grande
    color: COLORS.white, //..........Cor branca
  },

  // Secao de Informacoes
  infoSection: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 16, //.........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo do Treinamento
  trainingTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 20, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 12, //.............Margem inferior
  },

  // Linha de Metadados
  metaRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    flexWrap: 'wrap', //.............Quebra linha se necessario
    marginBottom: 12, //.............Margem inferior
  },

  // Texto da Categoria
  categoryText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.primary, //........Cor azul
  },

  // Separador de Meta
  metaSeparator: {
    width: 4, //....................Largura
    height: 4, //...................Altura
    borderRadius: 2, //..............Bordas arredondadas
    backgroundColor: COLORS.border, //..Cor cinza
    marginHorizontal: 8, //..........Margem horizontal
  },

  // Container da Duracao
  durationContainer: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 4, //......................Espaco entre elementos
  },

  // Texto da Duracao
  durationText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
  },

  // Texto do Progresso
  progressText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.success, //........Cor verde
  },

  // Container da Barra de Progresso
  progressBarContainer: {
    width: '100%', //................Largura total
  },

  // Fundo da Barra de Progresso
  progressBarBackground: {
    width: '100%', //................Largura total
    height: 6, //...................Altura
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 3, //..............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow
  },

  // Preenchimento da Barra de Progresso
  progressBarFill: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.success, //..Cor verde
    borderRadius: 3, //..............Bordas arredondadas
  },

  // Divisoria
  divider: {
    height: 8, //...................Altura
    backgroundColor: COLORS.background, //..Fundo cinza
  },

  // Secao Sobre
  aboutSection: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 16, //.........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 12, //.............Margem inferior
  },

  // Texto da Descricao
  descriptionText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
    lineHeight: 22, //...............Altura da linha
  },

  // Item Relacionado
  relatedItem: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    marginTop: 8, //.................Margem superior
  },

  // Label do Item Relacionado
  relatedLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
    marginRight: 4, //...............Margem direita
  },

  // Valor do Item Relacionado
  relatedValue: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //.................Tamanho da fonte
    color: COLORS.primary, //........Cor azul
  },

  // Secao de Conteudo
  contentSection: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 16, //.........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Item de Conteudo
  contentItem: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'flex-start', //.....Alinha no topo
    paddingVertical: 12, //.........Padding vertical
    borderBottomWidth: 1, //.........Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
  },

  // Checkbox
  checkbox: {
    width: 24, //...................Largura
    height: 24, //..................Altura
    borderRadius: 12, //.............Bordas arredondadas
    borderWidth: 2, //...............Largura da borda
    borderColor: COLORS.border, //...Cor da borda
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    marginRight: 12, //.............Margem direita
  },

  // Checkbox Completo
  checkboxCompleted: {
    backgroundColor: COLORS.success, //..Fundo verde
    borderColor: COLORS.success, //..Borda verde
  },

  // Info do Conteudo
  contentInfo: {
    flex: 1, //.....................Ocupa espaco disponivel
  },

  // Linha do Titulo do Conteudo
  contentTitleRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'flex-start', //.....Alinha no topo
  },

  // Indice do Conteudo
  contentIndex: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginRight: 4, //...............Margem direita
  },

  // Titulo do Conteudo
  contentTitle: {
    flex: 1, //.....................Ocupa espaco disponivel
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    lineHeight: 20, //...............Altura da linha
  },

  // Texto de Conteudo Completo
  contentTextCompleted: {
    color: COLORS.textSecondary, //..Cor secundaria
    textDecorationLine: 'line-through', //..Riscado
  },

  // Linha de Meta do Conteudo
  contentMetaRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    marginTop: 4, //.................Margem superior
    gap: 6, //......................Espaco entre elementos
  },

  // Duracao do Conteudo
  contentDuration: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
  },

  // Container Inferior
  bottomContainer: {
    position: 'absolute', //.........Posicao absoluta
    bottom: 0, //...................Fixo no fundo
    left: 0, //.....................Esquerda
    right: 0, //....................Direita
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 16, //.........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
    borderTopWidth: 1, //............Borda superior
    borderTopColor: COLORS.border, //..Cor da borda
  },

  // Botao Continuar
  continueButton: {
    width: '100%', //................Largura total
    height: 48, //..................Altura
    backgroundColor: COLORS.primary, //..Fundo azul
    borderRadius: 8, //..............Bordas arredondadas
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Continuar Completo
  continueButtonCompleted: {
    backgroundColor: COLORS.success, //..Fundo verde
  },

  // Texto do Botao Continuar
  continueButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.white, //..........Cor branca
  },
});

export default TrainingDetailScreen;
