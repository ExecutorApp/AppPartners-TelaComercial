import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import Header from '../5.Side Menu/2.Header';
import SideMenuScreen from '../5.Side Menu/1.SideMenuScreen';
import TimelineCard from './03.DailyCommitment-TimelineCard';
import FiltersModal from './04.DailyCommitment-FiltersModal';
import ConfirmModal from './05.DailyCommitment-ConfirmModal';
import NewCommitmentTypeModal, { CommitmentType } from './05.NewCommitment-TypeModal';
import NewCommitmentFormModal, { NewCommitmentData } from './06.NewCommitment-FormModal';
import {
  COLORS,
  CommitmentItem,
  MOCK_COMMITMENTS,
  EyeIcon,
  EyeOffIcon,
} from './02.DailyCommitment-Types';

// ========================================
// ICONES
// ========================================

// Icone Filtro
const FilterIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 64 64" fill="none">
    <Path
      d="M27 59a2 2 0 0 1-2-2V37.77L6.46 17.38A5.61 5.61 0 0 1 10.61 8h42.78a5.61 5.61 0 0 1 4.15 9.38L39 37.77V49a2 2 0 0 1-.75 1.56l-10 8A2 2 0 0 1 27 59zM10.61 12a1.61 1.61 0 0 0-1.19 2.69l19.06 21A2 2 0 0 1 29 37v15.84L35 48V37a2 2 0 0 1 .52-1.35l19.06-21A1.61 1.61 0 0 0 53.39 12z"
      fill={COLORS.textSecondary}
    />
  </Svg>
);

// Icone Plus (adicionar)
const PlusIcon = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1V15M1 8H15"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// CONSTANTES
// ========================================

// Filtros de periodo (simplificados)
type PeriodFilter = 'hoje' | 'semana';

const PERIOD_FILTERS: { key: PeriodFilter; label: string }[] = [
  { key: 'hoje', label: 'Hoje' },
  { key: 'semana', label: 'Essa semana' },
];

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const DailyCommitmentHomeScreen: React.FC = () => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Estados
  const [sideMenuVisible, setSideMenuVisible] = useState(false); //........Menu lateral
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('hoje'); //..Filtro periodo
  const [isExpanded, setIsExpanded] = useState(false); //..................Olhinho ativo
  const [commitments, setCommitments] = useState<CommitmentItem[]>(MOCK_COMMITMENTS); //..Lista de compromissos
  const [filtersModalVisible, setFiltersModalVisible] = useState(false); //..Modal de filtros
  const [typeModalVisible, setTypeModalVisible] = useState(false); //.......Modal de tipo
  const [formModalVisible, setFormModalVisible] = useState(false); //.......Modal de formulario
  const [selectedType, setSelectedType] = useState<CommitmentType>('tarefa'); //..Tipo selecionado
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); //..Modal de confirmacao
  const [selectedItem, setSelectedItem] = useState<CommitmentItem | null>(null); //..Item selecionado

  // Contadores de status (calculados)
  const totalCommitments = useMemo(() => commitments.length, [commitments]);
  const completedCount = useMemo(() => commitments.filter(c => c.status === 'completed').length, [commitments]);
  const notCompletedCount = useMemo(() => totalCommitments - completedCount, [totalCommitments, completedCount]);
  const delayedCount = useMemo(() => commitments.filter(c => c.timeBalance !== undefined && c.timeBalance < 0).length, [commitments]);

  // Abre menu lateral
  const openSideMenu = useCallback(() => {
    setSideMenuVisible(true);
  }, []);

  // Fecha menu lateral
  const closeSideMenu = useCallback(() => {
    setSideMenuVisible(false);
  }, []);

  // Alterna olhinho (expandir/enxugar)
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Callback ao clicar em um card
  const handleCardPress = useCallback((item: CommitmentItem) => {
    // TODO: Navegar para tela de execucao correspondente
    console.log('Card pressed:', item.id, item.title);
  }, []);

  // Callback ao clicar no numero ou swipe para confirmar
  const handleConfirmPress = useCallback((item: CommitmentItem) => {
    setSelectedItem(item);
    setConfirmModalVisible(true);
  }, []);

  // Callback ao confirmar conclusao
  const handleConfirmComplete = useCallback(() => {
    if (selectedItem) {
      // Atualiza status para concluido
      setCommitments(prev =>
        prev.map(c =>
          c.id === selectedItem.id
            ? { ...c, status: 'completed' as const, timeBalance: 0 }
            : c
        )
      );
      console.log('Atividade concluida:', selectedItem.id, selectedItem.title);
    }
    setConfirmModalVisible(false);
    setSelectedItem(null);
  }, [selectedItem]);

  // Abre modal de tipo de compromisso
  const openNewCommitment = useCallback(() => {
    setTypeModalVisible(true);
  }, []);

  // Callback ao selecionar tipo
  const handleSelectType = useCallback((type: CommitmentType) => {
    setSelectedType(type);
    setTypeModalVisible(false);
    setFormModalVisible(true);
  }, []);

  // Callback ao salvar novo compromisso
  const handleSaveCommitment = useCallback((data: NewCommitmentData) => {
    // Cria novo item de compromisso
    const newItem: CommitmentItem = {
      id: String(Date.now()),
      number: String(commitments.length + 1).padStart(2, '0'),
      title: data.name,
      category: data.type === 'agenda' ? 'agenda' : data.type === 'rotina' ? 'rotina' : 'comercial',
      status: 'not_started',
      startTime: data.startTime,
      endTime: data.endTime,
      estimatedMinutes: data.duration,
      isFixed: data.type === 'agenda',
      timeBalance: data.duration,
    };

    // Adiciona na lista
    setCommitments(prev => [...prev, newItem]);
    setFormModalVisible(false);
    console.log('Novo compromisso criado:', data);
  }, [commitments.length]);

  // Renderiza item da lista
  const renderItem = useCallback((item: CommitmentItem, index: number) => {
    const isLast = index === commitments.length - 1;

    // Verifica se e o primeiro item fora do expediente
    const isFirstAfterHours = item.isAfterHours &&
      (index === 0 || !commitments[index - 1]?.isAfterHours);

    return (
      <View key={item.id}>
        {/* Linha divisoria para compromissos fora do expediente */}
        {isFirstAfterHours && (
          <View style={styles.afterHoursDivider}>
            <View style={styles.afterHoursLine} />
            <Text style={styles.afterHoursText}>Fora do expediente</Text>
            <View style={styles.afterHoursLine} />
          </View>
        )}
        <TimelineCard
          item={item}
          isLast={isLast}
          isExpanded={isExpanded}
          onPress={() => handleCardPress(item)}
          onConfirmPress={() => handleConfirmPress(item)}
        />
      </View>
    );
  }, [commitments, isExpanded, handleCardPress, handleConfirmPress]);

  // Aguarda fontes
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header Padrao do Sistema */}
      <Header
        title="Compromissos"
        notificationCount={6}
        onMenuPress={openSideMenu}
      />

      {/* Divisoria */}
      <View style={styles.headerDivider} />

      {/* Filtros de Periodo + Botao Filtro */}
      <View style={styles.filtersSection}>
        {/* Lado Esquerdo: Filtros Rapidos */}
        <View style={styles.filtersLeft}>
          {PERIOD_FILTERS.map((filter) => {
            const isActive = periodFilter === filter.key;
            return (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  isActive ? styles.filterButtonActive : styles.filterButtonInactive,
                ]}
                onPress={() => setPeriodFilter(filter.key)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lado Direito: Botao Filtro + Olhinho + Adicionar */}
        <View style={styles.filtersRight}>
          {/* Botao de Filtros Avancados */}
          <TouchableOpacity
            style={styles.filterIconButton}
            onPress={() => setFiltersModalVisible(true)}
            activeOpacity={0.7}
          >
            <FilterIcon />
          </TouchableOpacity>

          {/* Botao Olhinho */}
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={toggleExpanded}
            activeOpacity={0.7}
          >
            {isExpanded ? <EyeIcon active /> : <EyeOffIcon />}
          </TouchableOpacity>

          {/* Botao Adicionar Novo Compromisso */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={openNewCommitment}
            activeOpacity={0.7}
          >
            <PlusIcon />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divisoria Superior do Status */}
      <View style={styles.statusDividerLine} />

      {/* Container de Status */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Text style={styles.statusValue}>{String(totalCommitments).padStart(2, '0')}</Text>
          <Text style={styles.statusLabel}>Total</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusValue, styles.statusValueCompleted]}>{String(completedCount).padStart(2, '0')}</Text>
          <Text style={styles.statusLabel}>Concluídos</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusValue, styles.statusValueNotCompleted]}>{String(notCompletedCount).padStart(2, '0')}</Text>
          <Text style={styles.statusLabel}>Não concluídos</Text>
        </View>
        <View style={styles.statusDivider} />
        <View style={styles.statusItem}>
          <Text style={[styles.statusValue, styles.statusValueDelayed]}>{String(delayedCount).padStart(2, '0')}</Text>
          <Text style={styles.statusLabel}>Em atraso</Text>
        </View>
      </View>

      {/* Divisoria Inferior do Status */}
      <View style={styles.statusDividerLine} />

      {/* Lista de Compromissos */}
      <View style={styles.scrollWrapper}>
        {commitments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum compromisso para este período
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
          >
            {commitments.map((item, index) => renderItem(item, index))}
          </ScrollView>
        )}
      </View>

      {/* Menu Lateral */}
      <SideMenuScreen isVisible={sideMenuVisible} onClose={closeSideMenu} />

      {/* Modal de Filtros Avancados */}
      <FiltersModal
        visible={filtersModalVisible}
        onClose={() => setFiltersModalVisible(false)}
        onApply={(selection: { periodsLabel: string }) => {
          console.log('Filtros aplicados:', selection);
          setFiltersModalVisible(false);
        }}
      />

      {/* Modal de Selecao de Tipo */}
      <NewCommitmentTypeModal
        visible={typeModalVisible}
        onClose={() => setTypeModalVisible(false)}
        onSelect={handleSelectType}
      />

      {/* Modal de Formulario */}
      <NewCommitmentFormModal
        visible={formModalVisible}
        commitmentType={selectedType}
        existingCommitments={commitments}
        onClose={() => setFormModalVisible(false)}
        onSave={handleSaveCommitment}
      />

      {/* Modal de Confirmacao de Conclusao */}
      <ConfirmModal
        visible={confirmModalVisible}
        item={selectedItem}
        onConfirm={handleConfirmComplete}
        onCancel={() => {
          setConfirmModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flex: 1, //........................Ocupa tela inteira
    backgroundColor: COLORS.background, //..Cor de fundo
  },

  // Divisoria do Header
  headerDivider: {
    height: 1, //......................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
  },

  // Secao de Filtros
  filtersSection: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    justifyContent: 'space-between', //..Espaco entre elementos
    backgroundColor: COLORS.white, //..Fundo branco
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 12, //............Margem vertical
  },

  // Container Filtros Esquerda
  filtersLeft: {
    flexDirection: 'row', //...........Layout horizontal
    gap: 8, //.........................Espaco entre filtros
  },

  // Container Filtros Direita
  filtersRight: {
    flexDirection: 'row', //...........Layout horizontal
    gap: 8, //.........................Espaco entre filtros
  },

  // Botao Filtro (quadrado com cantos arredondados)
  filterButton: {
    paddingHorizontal: 16, //..........Padding horizontal
    paddingVertical: 10, //............Padding vertical
    borderRadius: 8, //................Bordas arredondadas
    justifyContent: 'center', //.......Centraliza vertical
    alignItems: 'center', //...........Centraliza horizontal
  },

  // Botao Filtro Inativo
  filterButtonInactive: {
    backgroundColor: COLORS.white, //..Fundo branco
    borderWidth: StyleSheet.hairlineWidth, //..Borda fina
    borderColor: COLORS.border, //.....Cor da borda
  },

  // Botao Filtro Ativo
  filterButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
  },

  // Texto Filtro
  filterText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Texto Filtro Ativo
  filterTextActive: {
    color: COLORS.white, //............Cor branca
  },

  // Botao Icone de Filtro
  filterIconButton: {
    width: 40, //......................Largura fixa
    height: 40, //.....................Altura fixa
    borderRadius: 8, //................Bordas arredondadas
    backgroundColor: COLORS.white, //..Fundo branco
    borderWidth: StyleSheet.hairlineWidth, //..Borda fina
    borderColor: COLORS.border, //.....Cor da borda
    justifyContent: 'center', //.......Centraliza icone
    alignItems: 'center', //...........Centraliza icone
  },

  // Botao Olhinho
  eyeButton: {
    width: 40, //.....................Largura do botao
    height: 40, //....................Altura do botao
    borderRadius: 8, //................Bordas arredondadas
    backgroundColor: COLORS.white, //..Fundo branco
    borderWidth: StyleSheet.hairlineWidth, //..Borda fina
    borderColor: COLORS.border, //.....Cor da borda
    justifyContent: 'center', //.......Centraliza icone
    alignItems: 'center', //...........Centraliza icone
  },

  // Botao Adicionar
  addButton: {
    width: 40, //.....................Largura do botao
    height: 40, //....................Altura do botao
    borderRadius: 8, //................Bordas arredondadas
    backgroundColor: COLORS.primary, //..Fundo azul
    justifyContent: 'center', //.......Centraliza icone
    alignItems: 'center', //...........Centraliza icone
  },

  // Container de Status
  statusContainer: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    justifyContent: 'center', //.......Centraliza horizontalmente
    backgroundColor: COLORS.white, //..Fundo branco
    paddingVertical: 12, //............Margem vertical
    paddingHorizontal: 16, //..........Margem horizontal
    gap: 16, //.......................Espaco entre itens
  },

  // Item de Status
  statusItem: {
    alignItems: 'center', //...........Centraliza horizontalmente
    minWidth: 60, //...................Largura minima
  },

  // Valor do Status
  statusValue: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 18, //....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Valor Concluido
  statusValueCompleted: {
    color: COLORS.primary, //..............Cor azul principal
  },

  // Valor Nao Concluido
  statusValueNotCompleted: {
    color: COLORS.textSecondary, //........Cor cinza
  },

  // Valor Em Atraso
  statusValueDelayed: {
    color: COLORS.red, //..................Cor vermelha
  },

  // Label do Status
  statusLabel: {
    fontFamily: 'Inter_400Regular', //...Fonte regular
    fontSize: 12, //....................Tamanho da fonte
    color: COLORS.textSecondary, //......Cor secundaria
    marginTop: 2, //....................Margem superior
  },

  // Divisor do Status
  statusDivider: {
    width: 1, //........................Largura da linha
    height: 30, //......................Altura da linha
    backgroundColor: COLORS.border, //...Cor da borda
  },

  // Linha Divisoria do Status (horizontal)
  statusDividerLine: {
    height: StyleSheet.hairlineWidth, //..Altura fina
    backgroundColor: COLORS.border, //....Cor da borda
    marginHorizontal: 16, //..............Margem lateral
  },

  // Wrapper do Scroll (necessario para web)
  scrollWrapper: {
    flex: 1, //........................Ocupa espaco disponivel
    position: 'relative', //...........Posicao relativa para filho absolute
    backgroundColor: COLORS.white, //..Fundo branco
    ...Platform.select({
      web: {
        overflow: 'hidden', //..........Esconde overflow no web
      } as any,
      default: {},
    }),
  },

  // Lista de Compromissos (ScrollView)
  list: {
    backgroundColor: COLORS.white, //..Fundo branco
    ...Platform.select({
      web: {
        position: 'absolute', //........Posicao absoluta no web
        top: 0, //......................Topo
        left: 0, //.....................Esquerda
        right: 0, //....................Direita
        bottom: 0, //...................Fundo
        overflowY: 'auto', //.............Scroll vertical
        overflowX: 'hidden', //...........Sem scroll horizontal
      } as any,
      default: {
        flex: 1, //.....................Ocupa espaco disponivel
      },
    }),
  },

  // Conteudo da Lista
  listContent: {
    paddingTop: 16, //.................Espaco superior
    paddingBottom: 24, //..............Espaco inferior
    flexGrow: 1, //...................Cresce para ocupar espaco
  },

  // Container Vazio
  emptyContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    justifyContent: 'center', //.......Centraliza verticalmente
    alignItems: 'center', //...........Centraliza horizontalmente
    paddingVertical: 48, //............Margem vertical
  },

  // Texto Vazio
  emptyText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //..................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Divisor Fora do Expediente
  afterHoursDivider: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    marginHorizontal: 16, //...........Margem horizontal
    marginVertical: 16, //.............Margem vertical
    gap: 12, //.......................Espaco entre elementos
  },

  // Linha do Divisor
  afterHoursLine: {
    flex: 1, //........................Ocupa espaco disponivel
    height: 1, //......................Altura da linha
    backgroundColor: COLORS.border, //..Cor da linha
  },

  // Texto do Divisor
  afterHoursText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },
});

export default DailyCommitmentHomeScreen;
