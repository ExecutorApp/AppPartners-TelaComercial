import { StyleSheet } from 'react-native';
import { COLORS } from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution01';

// ========================================
// ESTILOS
// ========================================

export const styles = StyleSheet.create({
  // Overlay escurecido
  overlay: {
    flex: 1, //........................Ocupa tela inteira
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //..Fundo semi-transparente
    padding: 10, //...................Margem de respiro
  },

  // Container do Modal
  modalContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 16, //...............Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Header
  header: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    justifyContent: 'space-between', //.Espaco entre elementos
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 12, //............Margem vertical
  },

  // Linha de Navegacao e Cliente
  navigationRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    justifyContent: 'space-between', //.Espaco entre elementos
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 8, //.............Margem vertical
  },

  // Container de Navegacao
  navigationContainer: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 5, //........................Espaco entre elementos
  },

  // Container do Contador
  navCounterBox: {
    width: 70, //......................Largura fixa
    height: 35, //.....................Altura fixa
    borderRadius: 4, //................Bordas arredondadas
    borderWidth: 0.5, //...............Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Contador de Navegacao
  navCounter: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    textAlign: 'center', //.............Texto centralizado
  },

  // Acoes do Header (Play e Fechar)
  headerActions: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 10, //.......................Espaco entre elementos
  },

  // Botao Info Cliente
  customerInfoButton: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 5, //........................Espaco entre icone e texto
    height: 35, //....................Altura fixa
    paddingHorizontal: 12, //.........Padding horizontal
    backgroundColor: COLORS.background, //.Fundo cinza
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Largura da borda
    borderColor: '#EDF2F6', //.........Cor da borda
  },

  // Texto do Botao Info Cliente
  customerInfoButtonText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.primary, //.........Cor azul
  },

  // Container Info do Cliente
  customerInfoContainer: {
    paddingLeft: 10, //.................Margem esquerda reduzida
    paddingRight: 16, //................Margem direita
    paddingVertical: 10, //.............Margem vertical
    backgroundColor: COLORS.background, //..Fundo cinza
    marginHorizontal: 16, //............Margem horizontal
    marginBottom: 8, //.................Margem inferior
    borderRadius: 8, //................Bordas arredondadas
  },

  // Linha Info do Cliente
  customerInfoRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'stretch', //..........Estica para mesma altura
    gap: 12, //.......................Espaco entre foto e texto
  },

  // Container Foto do Cliente - QUADRADO com cantos arredondados
  customerPhotoContainer: {
    width: 80, //........................Largura fixa
    height: 120, //......................Altura fixa 
    borderRadius: 8, //..................Bordas levemente arredondadas
    backgroundColor: COLORS.border, //...Cor de fundo placeholder
    overflow: 'hidden', //...............Esconde overflow
  },

  // Foto do Cliente
  customerPhoto: {
    width: '100%', //..................Largura total
    height: '100%', //.................Altura total
    resizeMode: 'cover', //.............Cobre o container
  },

  // Container Texto Info do Cliente
  customerInfoTextContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    justifyContent: 'space-between', //..Distribui campos igualmente
  },

  // Nome do Cliente (sem label, fonte maior)
  customerInfoName: {
    fontFamily: 'Inter_500Medium', //.Fonte semi-bold
    fontSize: 15, //...................Tamanho maior
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Campo de Informacao (Label + Valor)
  customerInfoField: {
    paddingVertical: 2, //.............Margem vertical
  },

  // Linha do Label (Label + Contador)
  customerInfoLabelRow: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'space-between', //.Espaco entre label e contador
    alignItems: 'center', //...........Alinha verticalmente
    marginBottom: 2, //.................Espaco inferior
  },

  // Label do Campo
  customerInfoLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 11, //...................Tamanho pequeno
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Contador do Campo (ex: 01/03)
  customerInfoCounter: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 11, //...................Tamanho pequeno
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Valor do Campo
  customerInfoValue: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 13, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Divisoria entre campos
  customerInfoDivider: {
    height: 1, //......................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
    marginVertical: 4, //...............Margem vertical
  },

  // Botao Instrucoes (Play + Texto com fundo cinza)
  instructionsButton: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 5, //........................Espaco entre icone e texto
    height: 35, //....................Altura fixa
    paddingHorizontal: 12, //.........Padding horizontal
    backgroundColor: COLORS.background, //.Fundo cinza
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Largura da borda
    borderColor: '#EDF2F6', //.........Cor da borda
  },

  // Texto do Botao Instrucoes
  instructionsText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.primary, //.........Cor azul
  },

  // Secao Atividade
  activitySection: {
    paddingHorizontal: 16, //..........Margem horizontal
    paddingTop: 8, //..................Margem superior
    paddingBottom: 12, //...............Margem inferior
  },

  // Label da Secao
  sectionLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 8, //.................Margem inferior
  },

  // Linha da Atividade
  activityRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 8, //........................Espaco entre elementos
    paddingVertical: 8, //.............Margem vertical
    paddingHorizontal: 12, //..........Margem horizontal
    backgroundColor: COLORS.background, //..Fundo cinza
    borderRadius: 6, //................Bordas arredondadas
  },

  // Titulo da Atividade
  activityTitle: {
    flex: 1, //........................Ocupa espaco disponivel
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Divisor de Secao
  sectionDivider: {
    height: 1, //......................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
    marginHorizontal: 16, //............Margem horizontal
    marginVertical: 8, //...............Margem vertical
  },

  // Titulo de Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Secao Agenda
  scheduleSection: {
    flexDirection: 'row', //...........Layout horizontal
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 10, //.............Margem vertical
  },

  // Coluna Esquerda da Agenda (icones e linha)
  scheduleLeftColumn: {
    alignItems: 'center', //...........Centraliza horizontalmente
    marginRight: 10, //................Margem direita
    width: 16, //......................Largura fixa
  },

  // Linha Vertical da Agenda
  scheduleVerticalLine: {
    width: 2, //.......................Largura da linha
    height: 16, //.....................Altura fixa (aumentada para acompanhar margem)
    backgroundColor: COLORS.border, //..Cor da linha
    marginTop: 2, //...................Margem superior
    marginBottom: 2, //................Margem inferior
  },

  // Coluna Direita da Agenda (conteudo)
  scheduleRightColumn: {
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Linha de Conteudo da Agenda
  scheduleContentRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 8, //........................Espaco entre elementos
    height: 16, //.....................Altura igual ao icone
  },

  // Divisoria Interna da Agenda
  scheduleInnerDivider: {
    height: 1, //......................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
    marginTop: 10, //...................Margem superior (respiro)
    marginBottom: 8, //................Margem inferior (respiro)
  },

  // Label da Agenda
  scheduleLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
    marginRight: 8, //..................Margem direita
  },

  // Valor da Agenda
  scheduleValue: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Container Timeline
  timelineContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    paddingHorizontal: 16, //..........Margem horizontal
    paddingTop: 8, //..................Margem superior
  },

  // Scroll da Timeline
  timelineScroll: {
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Item Timeline
  timelineItem: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'flex-start', //.......Alinha no topo
  },

  // Coluna Esquerda Timeline
  timelineLeft: {
    alignItems: 'center', //...........Centraliza horizontalmente
    marginRight: 12, //................Margem direita
  },

  // Circulo Timeline
  timelineCircle: {
    width: 28, //......................Largura fixa
    height: 28, //.....................Altura fixa
    borderRadius: 14, //...............Bordas arredondadas
    borderWidth: 2, //.................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Circulo Concluido
  timelineCircleCompleted: {
    backgroundColor: COLORS.primary, //.Fundo azul
    borderColor: COLORS.primary, //....Borda azul
  },

  // Circulo Atual
  timelineCircleCurrent: {
    borderColor: COLORS.primary, //....Borda azul
    borderWidth: 1, //.................Borda fina
  },

  // Linha Conectora
  timelineLine: {
    width: 2, //.......................Largura fixa
    flex: 1, //........................Ocupa espaco disponivel
    minHeight: 20, //..................Altura minima
    backgroundColor: COLORS.border, //..Cor da linha
    marginVertical: 4, //...............Margem vertical
  },

  // Linha Concluida
  timelineLineCompleted: {
    backgroundColor: COLORS.primary, //.Cor azul
  },

  // Numero da Etapa
  timelineNumber: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 11, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Numero Atual
  timelineNumberCurrent: {
    color: COLORS.primary, //..........Cor azul
  },

  // Numero Concluido
  timelineNumberCompleted: {
    color: COLORS.white, //............Cor branca
  },

  // Titulo da Etapa
  timelineTitle: {
    flex: 1, //........................Ocupa espaco disponivel
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    paddingTop: 4, //..................Margem superior
    paddingBottom: 8, //................Margem inferior
  },

  // Titulo Concluido
  timelineTitleCompleted: {
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Container Checklist
  checklistContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    paddingHorizontal: 16, //..........Margem horizontal
    paddingTop: 8, //..................Margem superior
  },

  // Header do Checklist
  checklistHeader: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'space-between', //.Espaco entre elementos
    alignItems: 'center', //...........Alinha verticalmente
    marginBottom: 12, //................Margem inferior
  },

  // Botao Ocultar Checklist
  hideChecklistButton: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 6, //........................Espaco entre elementos
    paddingVertical: 4, //.............Margem vertical
    paddingHorizontal: 10, //..........Margem horizontal
    backgroundColor: COLORS.background, //.Fundo cinza
    borderRadius: 6, //................Bordas arredondadas
    borderWidth: 1, //.................Largura da borda
    borderColor: COLORS.border, //.....Cor da borda
  },

  // Texto Ocultar Checklist
  hideChecklistText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Botao Mostrar Checklist
  showChecklistButton: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'center', //.......Centraliza horizontalmente
    alignItems: 'center', //...........Alinha verticalmente
    paddingVertical: 12, //.............Margem vertical
    paddingHorizontal: 16, //...........Margem horizontal
    gap: 8, //..........................Espaco entre elementos
  },

  // Texto Mostrar Checklist (Cinza)
  showChecklistText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Texto Mostrar Checklist (Azul)
  showChecklistTextBlue: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.primary, //.........Cor azul
  },

  // Scroll do Checklist
  checklistScroll: {
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Item Checklist
  checklistItem: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    paddingVertical: 10, //.............Margem vertical
    borderBottomWidth: 0.5, //.........Borda inferior
    borderBottomColor: COLORS.border, //.Cor da borda
  },

  // Titulo Checklist
  checklistTitle: {
    flex: 1, //........................Ocupa espaco disponivel
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    marginLeft: 12, //.................Margem esquerda
  },

  // Titulo Concluido Checklist
  checklistTitleCompleted: {
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Data Checklist
  checklistDate: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.primary, //..........Cor azul
  },
});
