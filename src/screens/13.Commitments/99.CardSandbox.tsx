import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { COLORS } from './02.DailyCommitment-Types';

// ========================================
// TELA SANDBOX - APENAS PARA TESTES VISUAIS
// PODE SER DELETADA A QUALQUER MOMENTO
// ========================================

// ========================================
// ICONES
// ========================================

// Icone Voltar
const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={COLORS.textPrimary}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Tempo (relogio)
const TimeIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={9}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 7V12L15 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// DADOS MOCK - 6 CARDS
// ========================================

const MOCK_CARDS = [
  {
    number: '01',
    category: 'Comercial',
    subcategory: 'Prospecção',
    title: 'Prospecção de leads',
    startTime: '08:00',
    endTime: '08:30',
    duration: '30min',
    daysBalance: 5,
    isPositive: true,
  },
  {
    number: '02',
    category: 'Comercial',
    subcategory: 'Negociação',
    title: 'Follow-up João Silva',
    startTime: '08:30',
    endTime: '09:00',
    duration: '30min',
    daysBalance: 3,
    isPositive: false,
  },
  {
    number: '03',
    category: 'Clientes',
    subcategory: 'Reunião',
    title: 'Reunião cliente ABC',
    startTime: '09:00',
    endTime: '10:00',
    duration: '1h',
    daysBalance: 12,
    isPositive: true,
  },
  {
    number: '04',
    category: 'Rotina',
    subcategory: 'Treinamento',
    title: 'Treinamento diário',
    startTime: '10:00',
    endTime: '10:30',
    duration: '30min',
    daysBalance: 8,
    isPositive: true,
  },
  {
    number: '05',
    category: 'Comercial',
    subcategory: 'Relacionamento',
    title: 'Contato pós-venda Maria',
    startTime: '10:30',
    endTime: '11:00',
    duration: '30min',
    daysBalance: 2,
    isPositive: false,
  },
  {
    number: '06',
    category: 'Clientes',
    subcategory: 'Atividade',
    title: 'Cadastrar keymans',
    startTime: '11:00',
    endTime: '11:30',
    duration: '30min',
    daysBalance: 15,
    isPositive: true,
  },
];

// ========================================
// HELPERS
// ========================================

// Formata dias como 2 digitos
const formatDays = (days: number): string => {
  return String(Math.abs(days)).padStart(2, '0');
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const CardSandbox: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Estado da aba ativa
  const [activeTab, setActiveTab] = useState<'01' | '02' | '03' | '04'>('01');

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack?.()} activeOpacity={0.7}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sandbox - Cards Reduzidos</Text>
      </View>

      {/* Tabs Header */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabsRow}>
          {/* Botao Aba 01 */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === '01' && styles.tabButtonActive]}
            onPress={() => setActiveTab('01')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === '01' && styles.tabButtonTextActive]}>01</Text>
          </TouchableOpacity>

          {/* Botao Aba 02 */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === '02' && styles.tabButtonActive]}
            onPress={() => setActiveTab('02')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === '02' && styles.tabButtonTextActive]}>02</Text>
          </TouchableOpacity>

          {/* Botao Aba 03 */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === '03' && styles.tabButtonActive]}
            onPress={() => setActiveTab('03')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === '03' && styles.tabButtonTextActive]}>03</Text>
          </TouchableOpacity>

          {/* Botao Aba 04 */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === '04' && styles.tabButtonActive]}
            onPress={() => setActiveTab('04')}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabButtonText, activeTab === '04' && styles.tabButtonTextActive]}>04</Text>
          </TouchableOpacity>
        </View>

        {/* Titulo da Aba */}
        <Text style={styles.tabTitle}>
          {activeTab === '01' ? 'Entalhe (Original)' : activeTab === '02' ? 'Entalhe (Maior)' : activeTab === '03' ? 'Reto (Linha Sólida)' : 'Reto (Linha Tracejada)'}
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ================================================================
            ABA 01 - MODELO ORIGINAL
            ================================================================ */}
        {activeTab === '01' && (
          <View style={styles.timelineContainer}>
            {MOCK_CARDS.map((card, index) => (
              <View key={card.number} style={styles.timelineItem}>
                {/* Linha Vertical (exceto ultimo) */}
                {index < MOCK_CARDS.length - 1 && (
                  <View style={styles.timelineLine} />
                )}

                {/* Número colado ao card */}
                <View style={styles.numberCircle}>
                  <Text style={styles.numberText}>{card.number}</Text>
                </View>

                {/* Card com entalhe */}
                <View style={styles.cardFlex}>
                  <View style={styles.card}>
                    {/* Entalhe visual */}
                    <View style={styles.notchContainer}>
                      <View style={styles.notch} />
                    </View>

                    <View style={styles.cardContent}>
                      {/* Bloco Esquerdo */}
                      <View style={styles.leftBlock}>
                        <Text style={[styles.daysText, card.isPositive ? styles.daysPositive : styles.daysNegative]}>
                          {formatDays(card.daysBalance)}
                        </Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.startTime}</Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.endTime}</Text>
                      </View>

                      {/* Divisória Vertical */}
                      <View style={styles.verticalDivider} />

                      {/* Bloco Direito */}
                      <View style={styles.rightBlock}>
                        <View style={styles.categoryRow}>
                          <Text style={styles.textBlue}>{card.category}</Text>
                          <View style={styles.timeContainer}>
                            <TimeIcon color={COLORS.textSecondary} />
                            <Text style={styles.timeValue}>{card.duration}</Text>
                          </View>
                        </View>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlue}>{card.subcategory}</Text>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlack} numberOfLines={1}>{card.title}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================================================================
            ABA 02 - MODELO COM NÚMERO MAIOR
            ================================================================ */}
        {activeTab === '02' && (
          <View style={styles.timelineContainer}>
            {MOCK_CARDS.map((card, index) => (
              <View key={card.number} style={styles.timelineItemV2}>
                {/* Linha Vertical (exceto ultimo) */}
                {index < MOCK_CARDS.length - 1 && (
                  <View style={styles.timelineLineV2} />
                )}

                {/* Número MAIOR colado ao card */}
                <View style={styles.numberCircleV2}>
                  <Text style={styles.numberTextV2}>{card.number}</Text>
                </View>

                {/* Card com entalhe */}
                <View style={styles.cardFlexV2}>
                  <View style={styles.cardV2}>
                    {/* Entalhe visual MAIOR */}
                    <View style={styles.notchContainerV2}>
                      <View style={styles.notchV2} />
                    </View>

                    <View style={styles.cardContentV2}>
                      {/* Bloco Esquerdo */}
                      <View style={styles.leftBlock}>
                        <Text style={[styles.daysText, card.isPositive ? styles.daysPositive : styles.daysNegative]}>
                          {formatDays(card.daysBalance)}
                        </Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.startTime}</Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.endTime}</Text>
                      </View>

                      {/* Divisória Vertical */}
                      <View style={styles.verticalDivider} />

                      {/* Bloco Direito */}
                      <View style={styles.rightBlock}>
                        <View style={styles.categoryRow}>
                          <Text style={styles.textBlue}>{card.category}</Text>
                          <View style={styles.timeContainer}>
                            <TimeIcon color={COLORS.textSecondary} />
                            <Text style={styles.timeValue}>{card.duration}</Text>
                          </View>
                        </View>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlue}>{card.subcategory}</Text>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlack} numberOfLines={1}>{card.title}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================================================================
            ABA 03 - MODELO SEM ENTALHE (RETO)
            ================================================================ */}
        {activeTab === '03' && (
          <View style={styles.timelineContainer}>
            {MOCK_CARDS.map((card, index) => (
              <View key={card.number} style={styles.timelineItemV3}>
                {/* Linha Vertical (exceto ultimo) */}
                {index < MOCK_CARDS.length - 1 && (
                  <View style={styles.timelineLineV3} />
                )}

                {/* Número */}
                <View style={styles.numberCircleV3}>
                  <Text style={styles.numberTextV3}>{card.number}</Text>
                </View>

                {/* Card SEM entalhe (borda reta) */}
                <View style={styles.cardFlexV3}>
                  <View style={styles.cardV3}>
                    <View style={styles.cardContentV3}>
                      {/* Bloco Esquerdo */}
                      <View style={styles.leftBlock}>
                        <Text style={[styles.daysText, card.isPositive ? styles.daysPositive : styles.daysNegative]}>
                          {formatDays(card.daysBalance)}
                        </Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.startTime}</Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.endTime}</Text>
                      </View>

                      {/* Divisória Vertical */}
                      <View style={styles.verticalDivider} />

                      {/* Bloco Direito */}
                      <View style={styles.rightBlock}>
                        <View style={styles.categoryRow}>
                          <Text style={styles.textBlue}>{card.category}</Text>
                          <View style={styles.timeContainer}>
                            <TimeIcon color={COLORS.textSecondary} />
                            <Text style={styles.timeValue}>{card.duration}</Text>
                          </View>
                        </View>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlue}>{card.subcategory}</Text>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlack} numberOfLines={1}>{card.title}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ================================================================
            ABA 04 - MODELO SEM ENTALHE (LINHA TRACEJADA)
            ================================================================ */}
        {activeTab === '04' && (
          <View style={styles.timelineContainer}>
            {MOCK_CARDS.map((card, index) => (
              <View key={card.number} style={styles.timelineItemV4}>
                {/* Linha Tracejada Vertical (exceto ultimo) */}
                {index < MOCK_CARDS.length - 1 && (
                  <View style={styles.dashedLineContainer}>
                    {[...Array(8)].map((_, i) => (
                      <View key={i} style={styles.dashSegment} />
                    ))}
                  </View>
                )}

                {/* Número */}
                <View style={styles.numberCircleV4}>
                  <Text style={styles.numberTextV4}>{card.number}</Text>
                </View>

                {/* Card SEM entalhe (borda reta) */}
                <View style={styles.cardFlexV4}>
                  <View style={styles.cardV4}>
                    <View style={styles.cardContentV4}>
                      {/* Bloco Esquerdo */}
                      <View style={styles.leftBlock}>
                        <Text style={[styles.daysText, card.isPositive ? styles.daysPositive : styles.daysNegative]}>
                          {formatDays(card.daysBalance)}
                        </Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.startTime}</Text>
                        <View style={styles.leftDivider} />
                        <Text style={styles.timeText}>{card.endTime}</Text>
                      </View>

                      {/* Divisória Vertical */}
                      <View style={styles.verticalDivider} />

                      {/* Bloco Direito */}
                      <View style={styles.rightBlock}>
                        <View style={styles.categoryRow}>
                          <Text style={styles.textBlue}>{card.category}</Text>
                          <View style={styles.timeContainer}>
                            <TimeIcon color={COLORS.textSecondary} />
                            <Text style={styles.timeValue}>{card.duration}</Text>
                          </View>
                        </View>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlue}>{card.subcategory}</Text>
                        <View style={styles.rightDivider} />
                        <Text style={styles.textBlack} numberOfLines={1}>{card.title}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // ========================================
  // CONTAINER E HEADER
  // ========================================

  // Container Principal
  container: {
    flex: 1, //........................Ocupa toda altura disponivel
    backgroundColor: COLORS.background, //...Cor de fundo
    overflow: 'hidden', //..............Esconde overflow para scroll web
  },

  // Header
  header: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    backgroundColor: COLORS.white, //....Fundo branco
    paddingTop: Platform.OS === 'web' ? 16 : 50, //..Padding topo
    paddingBottom: 16, //................Padding inferior
    paddingHorizontal: 16, //............Padding horizontal
    borderBottomWidth: 1, //.............Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
  },

  // Botao Voltar
  backButton: {
    width: 40, //......................Largura
    height: 40, //.....................Altura
    justifyContent: 'center', //........Centraliza icone
    alignItems: 'center', //............Centraliza icone
  },

  // Titulo Header
  headerTitle: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
    marginLeft: 8, //...................Margem esquerda
  },

  // ========================================
  // TABS
  // ========================================

  // Container Tabs
  tabsContainer: {
    backgroundColor: COLORS.white, //....Fundo branco
    paddingVertical: 12, //..............Padding vertical
    paddingHorizontal: 16, //............Padding horizontal
    borderBottomWidth: 1, //.............Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
    alignItems: 'center', //.............Centraliza conteudo
  },

  // Row das Tabs
  tabsRow: {
    flexDirection: 'row', //.............Layout horizontal
    gap: 8, //...........................Espaco entre botoes
  },

  // Botao Tab
  tabButton: {
    paddingHorizontal: 24, //............Padding horizontal
    paddingVertical: 8, //...............Padding vertical
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.background, //..Fundo cinza
    borderWidth: 1, //....................Borda
    borderColor: COLORS.border, //........Cor da borda
  },

  // Botao Tab Ativo
  tabButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //.....Borda azul
  },

  // Texto Botao Tab
  tabButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //....................Tamanho
    color: COLORS.textSecondary, //......Cor cinza
  },

  // Texto Botao Tab Ativo
  tabButtonTextActive: {
    color: COLORS.white, //..............Cor branca
  },

  // Titulo da Tab
  tabTitle: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 12, //....................Tamanho
    color: COLORS.textSecondary, //......Cor cinza
    marginTop: 8, //....................Margem superior
  },

  // ========================================
  // SCROLL
  // ========================================

  // ScrollView
  scrollView: {
    flex: 1, //.......................Ocupa espaco restante
    ...Platform.select({
      web: {
        position: 'absolute' as const, //...Posicao absoluta no web
        top: 145, //....................Abaixo do header + tabs
        left: 0, //.....................Alinhado a esquerda
        right: 0, //....................Alinhado a direita
        bottom: 0, //..................Alinhado ao fundo
      },
    }),
  },

  // Conteudo ScrollView
  scrollContent: {
    paddingHorizontal: 16, //...........Espaco horizontal
    paddingTop: 16, //.................Espaco topo
    paddingBottom: 50, //..............Espaco inferior
  },

  // ========================================
  // TIMELINE
  // ========================================

  // Container Timeline
  timelineContainer: {
    flex: 1, //.........................Ocupa espaco disponivel
  },

  // ========================================
  // ABA 01 - MODELO ORIGINAL
  // ========================================

  // Item Timeline
  timelineItem: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    marginBottom: 12, //..................Espaco entre cards
    position: 'relative', //.............Para linha vertical
  },

  // Linha Timeline
  timelineLine: {
    position: 'absolute', //.............Posicao absoluta
    left: 15, //........................Centro do numero
    top: 32, //.........................Abaixo do numero
    width: 2, //.........................Largura da linha
    height: 'calc(100% + 12px)' as any, //..Altura ate proximo card
    backgroundColor: COLORS.border, //...Cor da linha
  },

  // Number Circle
  numberCircle: {
    width: 32, //.......................Largura
    height: 32, //......................Altura
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
    zIndex: 2, //.......................Acima da linha
    marginRight: -6, //.................Sobrepoe o card
  },

  // Texto Numero
  numberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //....................Tamanho 12px
    color: COLORS.textPrimary, //........Cor primaria
  },

  // Card Flex
  cardFlex: {
    flex: 1, //.........................Ocupa espaco restante
  },

  // Card
  card: {
    backgroundColor: COLORS.white, //....Fundo branco
    borderRadius: 12, //................Bordas arredondadas
    padding: 12, //.....................Padding interno
    paddingLeft: 18, //.................Padding extra para entalhe
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    position: 'relative', //.............Para entalhe
    overflow: 'visible', //..............Permite entalhe
  },

  // Container do Entalhe
  notchContainer: {
    position: 'absolute', //.............Posicao absoluta
    left: -1, //........................Borda esquerda
    top: '50%', //......................Centro vertical
    marginTop: -20, //..................Ajuste centralizar
    width: 12, //.......................Largura
    height: 40, //.......................Altura
    overflow: 'hidden', //...............Esconde excesso
  },

  // Entalhe
  notch: {
    width: 24, //.......................Largura circulo
    height: 40, //.......................Altura
    backgroundColor: COLORS.background, //..Cor fundo
    borderRadius: 12, //..................Arredondamento
    borderWidth: 1, //....................Borda
    borderColor: COLORS.border, //........Cor borda
    borderLeftWidth: 0, //................Sem borda esquerda
    marginLeft: -12, //..................Desloca semicirculo
  },

  // Card Content
  cardContent: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'stretch', //............Estica verticalmente
  },

  // ========================================
  // ABA 02 - MODELO COM NÚMERO MAIOR
  // ========================================

  // Item Timeline V2
  timelineItemV2: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    marginBottom: 12, //..................Espaco entre cards
    position: 'relative', //.............Para linha vertical
  },

  // Linha Timeline V2
  timelineLineV2: {
    position: 'absolute', //.............Posicao absoluta
    left: 17, //........................Centro do numero MAIOR
    top: 36, //.........................Abaixo do numero MAIOR
    width: 2, //.........................Largura da linha
    height: 'calc(100% + 12px)' as any, //..Altura ate proximo card
    backgroundColor: COLORS.border, //...Cor da linha
  },

  // Number Circle V2 - MAIOR
  numberCircleV2: {
    width: 36, //.......................Largura MAIOR
    height: 36, //......................Altura MAIOR
    borderRadius: 10, //.................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
    zIndex: 2, //.......................Acima da linha
    marginRight: -8, //.................Sobrepoe o card
  },

  // Texto Numero V2 - MAIOR
  numberTextV2: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 13, //....................Tamanho 13px
    color: COLORS.textPrimary, //........Cor primaria
  },

  // Card Flex V2
  cardFlexV2: {
    flex: 1, //.........................Ocupa espaco restante
  },

  // Card V2
  cardV2: {
    backgroundColor: COLORS.white, //....Fundo branco
    borderRadius: 12, //................Bordas arredondadas
    padding: 12, //.....................Padding interno
    paddingLeft: 20, //.................Padding extra para entalhe MAIOR
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    position: 'relative', //.............Para entalhe
    overflow: 'visible', //..............Permite entalhe
  },

  // Container do Entalhe V2 - MAIOR
  notchContainerV2: {
    position: 'absolute', //.............Posicao absoluta
    left: -1, //........................Borda esquerda
    top: '50%', //......................Centro vertical
    marginTop: -22, //..................Ajuste centralizar MAIOR
    width: 14, //.......................Largura MAIOR
    height: 44, //.......................Altura MAIOR
    overflow: 'hidden', //...............Esconde excesso
  },

  // Entalhe V2 - MAIOR
  notchV2: {
    width: 28, //.......................Largura circulo MAIOR
    height: 44, //.......................Altura MAIOR
    backgroundColor: COLORS.background, //..Cor fundo
    borderRadius: 14, //..................Arredondamento MAIOR
    borderWidth: 1, //....................Borda
    borderColor: COLORS.border, //........Cor borda
    borderLeftWidth: 0, //................Sem borda esquerda
    marginLeft: -14, //..................Desloca semicirculo MAIOR
  },

  // Card Content V2
  cardContentV2: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'stretch', //............Estica verticalmente
  },

  // ========================================
  // ABA 03 - MODELO SEM ENTALHE (RETO)
  // ========================================

  // Item Timeline V3
  timelineItemV3: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'flex-start', //..........Alinha ao topo
    marginBottom: 12, //..................Espaco entre cards
    position: 'relative', //.............Para linha vertical
  },

  // Linha Timeline V3
  timelineLineV3: {
    position: 'absolute', //.............Posicao absoluta
    left: 15, //........................Centro do numero
    top: 38, //.........................Abaixo do numero com espaco
    width: 2, //.........................Largura da linha
    height: 'calc(100% - 32px)' as any, //..Altura com espacos em cima e baixo
    backgroundColor: COLORS.border, //...Cor da linha
  },

  // Number Circle V3
  numberCircleV3: {
    width: 32, //.......................Largura
    height: 32, //......................Altura
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
    zIndex: 2, //.......................Acima da linha
    marginRight: 8, //..................Espaco entre numero e card
  },

  // Texto Numero V3
  numberTextV3: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //....................Tamanho 12px
    color: COLORS.textPrimary, //........Cor primaria
  },

  // Card Flex V3
  cardFlexV3: {
    flex: 1, //.........................Ocupa espaco restante
  },

  // Card V3 (sem entalhe - borda reta)
  cardV3: {
    backgroundColor: COLORS.white, //....Fundo branco
    borderRadius: 12, //................Bordas arredondadas
    padding: 12, //.....................Padding interno
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
  },

  // Card Content V3
  cardContentV3: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'stretch', //............Estica verticalmente
  },

  // ========================================
  // ABA 04 - MODELO SEM ENTALHE (LINHA TRACEJADA)
  // ========================================

  // Item Timeline V4
  timelineItemV4: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'flex-start', //..........Alinha ao topo
    marginBottom: 12, //..................Espaco entre cards
    position: 'relative', //.............Para linha vertical
  },

  // Container da Linha Tracejada
  dashedLineContainer: {
    position: 'absolute', //.............Posicao absoluta
    left: 15, //........................Centro do numero
    top: 32, //.........................Abaixo do numero
    width: 2, //.........................Largura da linha
    height: 70, //.......................Altura aproximada
    flexDirection: 'column', //..........Layout vertical
    alignItems: 'center', //.............Centraliza os tracos
    justifyContent: 'space-between', //..Distribui os tracos
  },

  // Segmento do Tracejado
  dashSegment: {
    width: 2, //.........................Largura do traco
    height: 6, //........................Altura do traco
    backgroundColor: COLORS.border, //...Cor do traco
    borderRadius: 1, //..................Bordas arredondadas
  },

  // Number Circle V4
  numberCircleV4: {
    width: 32, //.......................Largura
    height: 32, //......................Altura
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
    zIndex: 2, //.......................Acima da linha
    marginRight: 8, //..................Espaco entre numero e card
  },

  // Texto Numero V4
  numberTextV4: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //....................Tamanho 12px
    color: COLORS.textPrimary, //........Cor primaria
  },

  // Card Flex V4
  cardFlexV4: {
    flex: 1, //.........................Ocupa espaco restante
  },

  // Card V4 (sem entalhe - borda reta)
  cardV4: {
    backgroundColor: COLORS.white, //....Fundo branco
    borderRadius: 12, //................Bordas arredondadas
    padding: 12, //.....................Padding interno
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
  },

  // Card Content V4
  cardContentV4: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'stretch', //............Estica verticalmente
  },

  // ========================================
  // ELEMENTOS COMPARTILHADOS
  // ========================================

  // Bloco Esquerdo
  leftBlock: {
    alignItems: 'center', //.............Centraliza horizontalmente
    justifyContent: 'center', //........Centraliza verticalmente
  },

  // Texto Dias
  daysText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 13, //....................Tamanho 13px
  },

  // Dias Positivo
  daysPositive: {
    color: COLORS.primary, //............Cor azul
  },

  // Dias Negativo
  daysNegative: {
    color: COLORS.red, //................Cor vermelha
  },

  // Divisória Esquerda
  leftDivider: {
    width: '100%', //...................Largura maxima
    height: 1, //........................Altura
    backgroundColor: COLORS.border, //...Cor da borda
    marginVertical: 6, //................Margem vertical
  },

  // Texto Horário
  timeText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 12, //....................Tamanho 12px
    color: COLORS.textSecondary, //......Cor cinza
  },

  // Divisória Vertical
  verticalDivider: {
    width: 1, //.........................Largura
    backgroundColor: COLORS.border, //...Cor da borda
    marginHorizontal: 12, //..............Margem horizontal
  },

  // Bloco Direito
  rightBlock: {
    flex: 1, //.........................Ocupa espaco restante
    justifyContent: 'center', //........Centraliza verticalmente
  },

  // Divisória Direita
  rightDivider: {
    width: '100%', //...................Largura maxima
    height: 1, //........................Altura
    backgroundColor: COLORS.border, //...Cor da borda
    marginVertical: 4, //................Margem vertical
  },

  // Row Categoria
  categoryRow: {
    flexDirection: 'row', //.............Layout horizontal
    justifyContent: 'space-between', //..Espacamento entre itens
    alignItems: 'center', //.............Centraliza verticalmente
  },

  // Container do Tempo
  timeContainer: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    gap: 4, //...........................Espaco entre icone e texto
  },

  // Valor do Tempo
  timeValue: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 12, //....................Tamanho 12px
    color: COLORS.textSecondary, //......Cor cinza
  },

  // Texto Preto
  textBlack: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //....................Tamanho 14px
    color: COLORS.textPrimary, //........Cor preta
  },

  // Texto Azul
  textBlue: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //....................Tamanho 14px
    color: COLORS.primary, //............Cor azul
  },
});

export default CardSandbox;
