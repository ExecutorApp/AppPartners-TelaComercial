import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { COLORS } from './02.Training-Types';

// ========================================
// CONSTANTES DO PLAYER
// ========================================

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); //..Dimensoes da tela
export const VIDEO_HEIGHT = (SCREEN_WIDTH * 9) / 16; //...............Proporcao 16:9
const PROGRESS_BAR_HEIGHT = 4; //....................................Altura da barra de progresso
const CONTROLS_PADDING = 16; //.......................................Padding dos controles

// Constantes do Mini Player (PiP) - 3 Tamanhos
export const MINI_PLAYER_WIDTH_SMALL = 200; //.......................Largura pequeno (tamanho 1)
export const MINI_PLAYER_HEIGHT_SMALL = 112; //......................Altura pequeno (16:9)
export const MINI_PLAYER_WIDTH_MEDIUM = 280; //......................Largura medio (tamanho 2)
export const MINI_PLAYER_HEIGHT_MEDIUM = 158; //.....................Altura medio (16:9)
export const MINI_PLAYER_MARGIN_RIGHT = 15; //.......................Margem da direita (15px)
export const MINI_PLAYER_MARGIN_BOTTOM = 15; //......................Margem de baixo (15px)

// ========================================
// AJUSTES MANUAIS - ESTADO NORMAL (Player no topo)
// ========================================
export const NORMAL_TIME_BADGE_BOTTOM = 20; //.........Distancia do fundo (ALTERAR AQUI)
export const NORMAL_TIME_BADGE_LEFT = 15; //...........Distancia da esquerda (ALTERAR AQUI)
export const NORMAL_FULLSCREEN_BTN_BOTTOM = 20; //....Distancia do fundo (ALTERAR AQUI)
export const NORMAL_FULLSCREEN_BTN_RIGHT = 20; //......Distancia da direita (ALTERAR AQUI)

// ========================================
// AJUSTES MANUAIS - ESTADO FULLSCREEN (Expandido)
// ========================================
export const FULLSCREEN_TIME_BADGE_BOTTOM = 25; //.....Distancia do fundo (ALTERAR AQUI)
export const FULLSCREEN_TIME_BADGE_LEFT = 15; //.......Distancia da esquerda (ALTERAR AQUI)
export const FULLSCREEN_BTN_BOTTOM = 25; //............Distancia do fundo (ALTERAR AQUI)
export const FULLSCREEN_BTN_RIGHT = 20; //.............Distancia da direita (ALTERAR AQUI)

// ========================================
// AJUSTES MANUAIS - ESTADO LANDSCAPE (Celular virado)
// ========================================
export const LANDSCAPE_TIME_BADGE_BOTTOM = 25; //......Distancia do fundo (ALTERAR AQUI)
export const LANDSCAPE_TIME_BADGE_LEFT = 15; //........Distancia da esquerda (ALTERAR AQUI)
export const LANDSCAPE_FULLSCREEN_BTN_BOTTOM = 25; //..Distancia do fundo (ALTERAR AQUI)
export const LANDSCAPE_FULLSCREEN_BTN_RIGHT = 20; //...Distancia da direita (ALTERAR AQUI)

// ========================================
// ESTILOS DO PLAYER
// ========================================

export const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1, //......................Ocupa tela inteira
    backgroundColor: COLORS.background, //..Fundo cinza
    paddingTop: Platform.OS === 'web' ? 0 : StatusBar.currentHeight || 0, //..Padding status bar
    position: 'relative', //.........Referencia para filhos absolutos
    overflow: 'hidden', //...........Impede que filhos afetem layout externo
  },

  // Container do Video
  videoContainer: {
    width: '100%', //................Largura total
    height: VIDEO_HEIGHT, //.........Altura proporcional 16:9
    backgroundColor: '#000000', //...Fundo preto
    position: 'relative', //.........Posicao relativa para controles
    zIndex: 1, //...................Fica acima de outros elementos
    overflow: 'visible', //.........Permite barra visivel fora do container
  },

  // Container do Video em Tela Cheia
  videoContainerFullscreen: {
    position: 'absolute', //.........Posicao absoluta
    top: 0, //......................Topo da tela
    left: 0, //.....................Esquerda da tela
    right: 0, //....................Direita da tela
    bottom: 0, //...................Fundo da tela
    width: SCREEN_WIDTH, //.........Largura total da tela
    height: SCREEN_HEIGHT, //........Altura total da tela
    zIndex: 100, //..................Fica acima de tudo
  },

  // Video
  video: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
  },

  // Container de Loading
  loadingContainer: {
    position: 'absolute', //.........Posicao absoluta
    top: 0, //......................Topo
    left: 0, //.....................Esquerda
    right: 0, //....................Direita
    bottom: 0, //...................Fundo
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo semi-transparente
  },

  // Controles Centrais do Video
  videoCenterControls: {
    position: 'absolute', //.........Posicao absoluta
    top: 0, //......................Topo
    left: 0, //.....................Esquerda
    right: 0, //....................Direita
    bottom: 0, //...................Cobre toda a area do player
    flexDirection: 'row', //.........Layout horizontal
    justifyContent: 'center', //....Centraliza horizontalmente
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 40, //......................Espaco entre botoes
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo semi-transparente
  },

  // Botao Skip (Anterior/Proximo)
  skipButton: {
    width: 25, //...................Largura
    height: 25, //..................Altura
    borderRadius: 12.5, //..........Circular
    backgroundColor: 'rgba(0,0,0,0.2)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Skip Desabilitado
  skipButtonDisabled: {
    opacity: 0.5, //................Transparencia
  },

  // Botao Play/Pause
  playButton: {
    width: 50, //...................Largura maior
    height: 50, //..................Altura maior
    borderRadius: 25, //.............Circular
    backgroundColor: 'rgba(0,0,0,0.2)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Container da Barra de Progresso
  progressBarContainer: {
    position: 'absolute', //.........Posicao absoluta
    bottom: 0, //...................Grudado no limite inferior do player
    left: 0, //.....................Sem margem esquerda
    right: 0, //....................Sem margem direita
    height: 20, //..................Altura maior para area de toque
    zIndex: 10, //..................Fica por cima de tudo
  },

  // Fundo da Barra de Progresso (vai de ponta a ponta)
  progressBarBackground: {
    position: 'absolute', //.........Posicao absoluta
    left: 0, //.....................Encosta na borda esquerda
    right: 0, //....................Encosta na borda direita
    bottom: 0, //...................Na base do container
    height: 6, //...................Mais grossa para visibilidade
    backgroundColor: 'rgba(255,255,255,0.3)', //..Fundo branco transparente
  },

  // Preenchimento da Barra de Progresso
  progressBarFill: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Cor azul
  },

  // Track da Bolinha (com margem nas laterais)
  progressBarTrack: {
    position: 'absolute', //.........Posicao absoluta
    left: 7, //.....................Margem esquerda (raio da bolinha)
    right: 7, //....................Margem direita (raio da bolinha)
    bottom: 0, //...................Alinhado com a base
    height: 6, //...................Mesma altura da barra
  },

  // Controles Inferiores do Video
  videoBottomControls: {
    position: 'absolute', //.........Posicao absoluta
    bottom: 8, //....................Distancia do fundo
    left: CONTROLS_PADDING, //......Margem esquerda
    right: CONTROLS_PADDING, //.....Margem direita
    flexDirection: 'row', //.........Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //.........Centraliza verticalmente
  },

  // Tempo do Video
  videoTime: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.white, //..........Cor branca
  },

  // Badge de Tempo (posicao controlada no PlayerScreen por estado)
  timeBadge: {
    position: 'absolute', //.........Posicao absoluta
    paddingHorizontal: 5, //........Padding horizontal
    paddingVertical: 2, //..........Padding vertical
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo semi-transparente
    borderRadius: 6, //..............Cantos arredondados
    zIndex: 10, //..................Fica por cima de tudo
  },

  // Texto do Badge de Tempo
  timeBadgeText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: '#FCFCFC', //.............Cor branca
  },

  // Container Controles Superiores (Autoplay/Settings)
  topControlsContainer: {
    position: 'absolute', //.........Posicao absoluta
    top: 6, //......................Distancia do topo
    right: 8, //....................Distancia da direita
    height: 25, //..................Altura
    paddingHorizontal: 10, //........Padding horizontal
    backgroundColor: 'rgba(0,0,0,0.15)', //..Fundo semi-transparente
    borderRadius: 6, //..............Cantos arredondados
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //........Centraliza verticalmente
    gap: 15, //.....................Espaco entre elementos
    zIndex: 20, //..................Fica por cima dos controles centrais
  },

  // Container Botoes Esquerda (Voltar + Minimizar)
  leftButtonsContainer: {
    position: 'absolute', //.........Posicao absoluta
    top: 10, //.....................Distancia do topo
    left: 16, //....................Distancia da esquerda
    flexDirection: 'column', //.....Layout vertical
    gap: 8, //......................Espaco entre botoes
    zIndex: 20, //..................Fica por cima dos controles centrais
  },

  // Botao Voltar (Seta para tela anterior) - ACIMA
  backArrowButton: {
    width: 25, //...................Largura
    height: 25, //..................Altura
    borderRadius: 8, //..............Cantos arredondados
    backgroundColor: 'rgba(0,0,0,0.2)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Minimizar (Seta para baixo) - ABAIXO
  backButton: {
    width: 25, //...................Largura
    height: 25, //..................Altura
    borderRadius: 8, //..............Cantos arredondados
    backgroundColor: 'rgba(0,0,0,0.2)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Controles Superiores Direita
  topRightControls: {
    position: 'absolute', //.........Posicao absoluta
    top: 8, //......................Distancia do topo
    right: 8, //....................Distancia da direita
    flexDirection: 'row', //.........Layout horizontal
    gap: 8, //......................Espaco entre botoes
  },

  // Botao de Controle Superior
  topControlButton: {
    width: 40, //...................Largura
    height: 40, //..................Altura
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Tela Cheia
  fullscreenButton: {
    width: 25, //...................Largura
    height: 25, //..................Altura
    borderRadius: 12.5, //..........Circular
    backgroundColor: 'rgba(0,0,0,0.2)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Container do Botao Fullscreen (posicao controlada no PlayerScreen por estado)
  fullscreenButtonContainer: {
    position: 'absolute', //.........Posicao absoluta
    zIndex: 20, //..................Fica por cima dos controles centrais
  },

  // Indicador de Progresso (bolinha)
  progressIndicator: {
    position: 'absolute', //.........Posicao absoluta
    bottom: -4, //..................Centralizado na barra (barra 6px, bolinha 14px)
    width: 14, //...................Largura
    height: 14, //..................Altura
    borderRadius: 7, //..............Circular
    backgroundColor: COLORS.primary, //..Cor azul
    marginLeft: -7, //...............Centraliza na posicao (metade da largura)
  },

  // Container da Imagem Estatica (quando minimizado)
  staticImageContainer: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
    backgroundColor: '#1A1A1A', //...Fundo escuro
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //.........Centraliza horizontalmente
  },

  // Overlay da Imagem Estatica
  staticImageOverlay: {
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //.........Centraliza horizontalmente
    gap: 12, //......................Espaco entre elementos
  },

  // Texto da Imagem Estatica
  staticImageText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //.................Tamanho da fonte
    color: 'rgba(255,255,255,0.7)', //..Cor branca transparente
  },

  // Container da Capa da Aula (quando mini player ativo)
  lessonCoverContainer: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
    backgroundColor: '#000000', //...Fundo preto (combina com bordas da imagem)
    justifyContent: 'center', //....Centraliza imagem verticalmente
    alignItems: 'center', //........Centraliza imagem horizontalmente
  },

  // Imagem de Capa da Aula
  lessonCoverImage: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
  },

  // Botao Voltar na Capa da Aula
  lessonCoverBackButton: {
    position: 'absolute', //.........Posicao absoluta
    top: 10, //......................Distancia do topo
    left: 16, //.....................Distancia da esquerda
    width: 25, //...................Largura
    height: 25, //..................Altura
    borderRadius: 8, //..............Cantos arredondados
    backgroundColor: 'rgba(0,0,0,0.4)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    zIndex: 10, //..................Fica por cima da imagem
  },

  // Container da Descricao
  descriptionContainer: {
    paddingHorizontal: 16, //........Padding horizontal
    paddingVertical: 12, //.........Padding vertical
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Texto da Descricao
  descriptionText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
    lineHeight: 20, //...............Altura da linha
  },

  // Divisoria Fina
  thinDivider: {
    height: 1, //...................Altura
    backgroundColor: COLORS.border, //..Cor da borda
  },

  // Container da Lista de Aulas
  lessonsContainer: {
    flex: 1, //......................Ocupa espaco disponivel
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Lista de Aulas
  lessonsList: {
    flex: 1, //......................Ocupa espaco disponivel
    padding: 16, //..................Padding
  },

  // Card de Aula
  lessonCard: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'stretch', //........Estica verticalmente
    paddingTop: 6, //................Padding superior
    paddingBottom: 6, //.............Padding inferior
    paddingLeft: 6, //...............Padding esquerdo
    paddingRight: 12, //.............Padding direito
    marginBottom: 12, //.............Margem inferior
    borderWidth: 1, //...............Largura da borda
    borderColor: COLORS.border, //...Cor da borda
    borderRadius: 12, //.............Bordas arredondadas
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Card de Aula Ativo (borda azul)
  lessonCardActive: {
    borderColor: COLORS.primary, //..Borda azul
    borderWidth: 1, //...............Borda fina
  },

  // Container do Numero da Aula
  lessonNumberContainer: {
    width: 45, //...................Largura
    height: 60, //..................Altura
    borderRadius: 8, //..............Cantos arredondados
    backgroundColor: '#021632', //...Fundo azul escuro
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    marginRight: 12, //.............Margem direita
  },

  // Texto do Numero da Aula
  lessonNumberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //.................Tamanho da fonte
    color: COLORS.white, //..........Cor branca
  },

  // Container Info da Aula
  lessonInfoContainer: {
    flex: 1, //......................Ocupa espaco disponivel
    minHeight: 50, //................Altura minima
    justifyContent: 'center', //....Centraliza verticalmente
  },

  // Titulo da Aula
  lessonTitle: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //.................Tamanho da fonte
    color: COLORS.textPrimary, //....Cor do texto
    marginBottom: 6, //..............Margem inferior
  },

  // Divisor da Aula
  lessonDivider: {
    height: 1, //...................Altura
    backgroundColor: COLORS.border, //..Cor da borda
    marginBottom: 6, //..............Margem inferior
  },

  // Linha de Execucao da Aula
  lessonExecutionRow: {
    flexDirection: 'row', //.........Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //........Centraliza verticalmente
  },

  // Container Duracao da Aula
  lessonDurationContainer: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //........Centraliza verticalmente
    gap: 6, //......................Espaco entre elementos
  },

  // Duracao da Aula
  lessonDuration: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //.................Tamanho da fonte
    color: COLORS.textSecondary, //..Cor secundaria
  },

  // Progresso da Aula
  lessonProgress: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //.................Tamanho da fonte
  },

  // Container do Mini Player (livre para mover, sem afetar layout)
  miniPlayerContainer: {
    position: 'absolute', //.........Posicao absoluta (nao afeta layout)
    top: 0, //........................Ponto de referencia no topo
    left: 0, //.......................Ponto de referencia na esquerda
    borderRadius: 12, //.............Bordas arredondadas
    zIndex: 9999, //..................Acima de todos os elementos
    elevation: 9999, //...............Elevacao Android (acima de tudo)
  },

  // Video do Mini Player (preenche todo o container)
  miniPlayerVideo: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
    borderRadius: 12, //.............Bordas arredondadas
    overflow: 'hidden', //...........Esconde overflow do video
  },

  // Video Mini
  miniVideo: {
    width: '100%', //................Largura total
    height: '100%', //...............Altura total
  },

  // Botao Fechar (X) - canto SUPERIOR direito
  miniPlayerCloseButton: {
    position: 'absolute', //.........Posicao absoluta
    top: 6, //......................Distancia do topo
    right: 6, //....................Distancia da direita
    width: 22, //...................Largura
    height: 22, //..................Altura
    borderRadius: 11, //.............Circular
    backgroundColor: 'rgba(0,0,0,0.5)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    zIndex: 10, //..................Fica por cima de tudo
  },

  // Botao Expandir - canto SUPERIOR esquerdo
  miniPlayerExpandButton: {
    position: 'absolute', //.........Posicao absoluta
    top: 6, //......................Distancia do topo
    left: 6, //.....................Distancia da esquerda
    width: 22, //...................Largura
    height: 22, //..................Altura
    borderRadius: 11, //.............Circular
    backgroundColor: 'rgba(0,0,0,0.5)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
    zIndex: 10, //..................Fica por cima de tudo
  },

  // Controles Centrais do Mini Player
  miniPlayerCenterControls: {
    position: 'absolute', //.........Posicao absoluta
    top: 0, //......................Topo
    left: 0, //.....................Esquerda
    right: 0, //....................Direita
    bottom: 0, //...................Fundo
    flexDirection: 'row', //.........Layout horizontal
    justifyContent: 'center', //....Centraliza horizontalmente
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 16, //......................Espaco entre botoes
  },

  // Botao Skip do Mini Player (anterior/proximo) - COM FUNDO
  miniPlayerSkipButton: {
    width: 28, //...................Largura
    height: 28, //..................Altura
    borderRadius: 14, //.............Circular
    backgroundColor: 'rgba(0,0,0,0.4)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Botao Play/Pause do Mini Player (central)
  miniPlayerPlayButton: {
    width: 36, //...................Largura
    height: 36, //..................Altura
    borderRadius: 18, //.............Circular
    backgroundColor: 'rgba(0,0,0,0.4)', //..Fundo semi-transparente
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //........Centraliza horizontalmente
  },

  // Container da Barra de Progresso do Mini Player (com margens laterais 15px)
  miniPlayerProgressContainer: {
    position: 'absolute', //.........Posicao absoluta
    bottom: 0, //...................Na base do video
    left: 15, //....................Margem esquerda 15px
    right: 15, //...................Margem direita 15px
    height: 20, //..................Area de toque maior
    zIndex: 10, //..................Fica por cima de tudo
  },

  // Barra de Progresso do Mini Player (mais larga e visivel)
  miniPlayerProgressBar: {
    position: 'absolute', //.........Posicao absoluta
    left: 0, //.....................Encosta na margem
    right: 0, //....................Encosta na margem
    bottom: 10, //...................Distancia do fundo
    height: 5, //...................Altura maior (era 3)
    backgroundColor: 'rgba(255,255,255,0.4)', //..Fundo mais visivel
    borderRadius: 3, //..............Cantos arredondados
  },

  // Preenchimento da Barra do Mini Player
  miniPlayerProgressFill: {
    height: '100%', //...............Altura total
    backgroundColor: COLORS.primary, //..Cor azul
    borderRadius: 3, //..............Cantos arredondados
  },

  // Bolinha indicadora do Mini Player (maior)
  miniPlayerProgressIndicator: {
    position: 'absolute', //.........Posicao absoluta
    bottom: 5, //...................Centralizado na barra
    width: 14, //...................Largura maior (era 10)
    height: 14, //..................Altura maior (era 10)
    borderRadius: 7, //..............Circular
    backgroundColor: COLORS.primary, //..Cor azul
    marginLeft: -7, //...............Centraliza na posicao
  },
});
