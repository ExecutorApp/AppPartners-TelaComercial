import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS } from './02.Training-Types';
import {
  TRAINING_IMAGE_WIDTH,
  TRAINING_IMAGE_HEIGHT,
  TRAINING_IMAGE_BORDER_RADIUS,
  MODULE_CARD_WIDTH,
  MODULE_CARD_HEIGHT,
  MODULE_CARD_MARGIN_RIGHT,
  MODULE_CARD_BORDER_RADIUS,
  LESSON_NUMBER_WIDTH,
  LESSON_NUMBER_HEIGHT,
  LESSON_NUMBER_BORDER_RADIUS,
  LESSON_NUMBER_MARGIN_RIGHT,
  LESSON_INFO_MIN_HEIGHT,
  LESSON_CARD_PADDING_TOP,
  LESSON_CARD_PADDING_BOTTOM,
  LESSON_CARD_PADDING_LEFT,
  LESSON_CARD_PADDING_RIGHT,
  LESSON_CARD_MARGIN_BOTTOM,
  LESSON_CARD_BORDER_RADIUS,
} from './05.Training-DetailScreen01';

// ========================================
// ESTILOS
// ========================================

export const createStyles = () => StyleSheet.create({
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

  // Secao de Modulos
  modulesSection: {
    paddingVertical: 16, //..........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Carrossel de Modulos
  modulesCarousel: {
    paddingHorizontal: 16, //........Padding horizontal
    gap: MODULE_CARD_MARGIN_RIGHT, //..Espaco entre cards
  },

  // Card de Modulo
  moduleCard: {
    width: MODULE_CARD_WIDTH, //.........Largura fixa
    height: MODULE_CARD_HEIGHT, //........Altura fixa
    paddingHorizontal: 12, //...........Padding horizontal
    paddingVertical: 10, //.............Padding vertical
    borderRadius: MODULE_CARD_BORDER_RADIUS, //..Bordas arredondadas
    backgroundColor: COLORS.background, //..Fundo cinza claro
    borderWidth: 2, //..................Borda
    borderColor: 'transparent', //......Transparente por padrao
    justifyContent: 'center', //........Centraliza conteudo
  },

  // Card de Modulo Ativo
  moduleCardActive: {
    backgroundColor: COLORS.primary, //..Fundo azul quando ativo
    borderColor: COLORS.primary, //....Borda azul quando ativo
  },

  // Titulo do Card de Modulo
  moduleCardTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor preta
    marginBottom: 6, //................Margem inferior
  },

  // Titulo do Card de Modulo Ativo
  moduleCardTitleActive: {
    color: COLORS.white, //............Cor branca quando ativo
  },

  // Descricao do Card de Modulo
  moduleCardDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 11, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor cinza
    lineHeight: 14, //.................Altura da linha
  },

  // Descricao do Card de Modulo Ativo
  moduleCardDescriptionActive: {
    color: 'rgba(255,255,255,0.8)', //..Cor branca semi-transparente quando ativo
  },

  // Secao do Header do Modulo (Nome e Abas)
  moduleHeaderSection: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingTop: 16, //...............Padding superior
    paddingBottom: 0, //..............Padding inferior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Nome do Modulo
  moduleName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 16, //................Margem inferior
  },

  // Container das Abas
  tabsContainer: {
    flexDirection: 'row', //............Layout horizontal
    borderBottomWidth: 1, //............Linha inferior
    borderBottomColor: COLORS.border, //..Cor da borda
    marginBottom: 0, //..................Margem inferior
  },

  // Aba Individual
  tab: {
    paddingVertical: 12, //.............Padding vertical
    paddingHorizontal: 16, //...........Padding horizontal
    marginRight: 8, //..................Margem direita
    borderBottomWidth: 2, //............Linha inferior da aba
    borderBottomColor: 'transparent', //..Transparente por padrao
  },

  // Aba Ativa
  tabActive: {
    borderBottomColor: COLORS.primary, //..Linha azul quando ativa
  },

  // Texto da Aba
  tabText: {
    fontFamily: 'Inter_500Medium', //.....Fonte media
    fontSize: 14, //........................Tamanho da fonte
    color: COLORS.textSecondary, //..........Cor cinza
  },

  // Texto da Aba Ativa
  tabTextActive: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    color: COLORS.primary, //...............Cor azul quando ativa
  },

  // Secao do Conteudo da Aba
  tabContentSection: {
    flex: 1, //........................Ocupa espaco disponivel
    backgroundColor: COLORS.white, //....Fundo branco
  },

  // Scroll da Descricao
  descriptionScroll: {
    flex: 1, //......................Ocupa espaco disponivel
  },

  // Conteudo da Descricao
  descriptionContent: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingTop: 16, //...............Padding superior
    paddingBottom: 16, //............Padding inferior
  },

  // Descricao Completa do Modulo
  fullModuleDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor cinza
    lineHeight: 22, //..................Altura da linha
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
    paddingHorizontal: 16, //........Padding horizontal
    paddingTop: 16, //...............Padding superior
    paddingBottom: 16, //............Padding inferior
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
