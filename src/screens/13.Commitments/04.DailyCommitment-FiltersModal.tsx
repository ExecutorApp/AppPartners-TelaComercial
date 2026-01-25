import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  ScrollView,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, CommitmentCategory } from './02.DailyCommitment-Types';

// ========================================
// TIPOS
// ========================================

type FilterTab = 'data' | 'categoria' | 'tipos';

interface FiltersModalProps {
  visible: boolean; //...............Visibilidade do modal
  onClose: () => void; //............Callback de fechamento
  onApply?: (selection: FiltersSelection) => void; //..Callback de aplicar
}

interface FiltersSelection {
  periodsLabel: string; //...........Label do periodo selecionado
  startDate?: Date | null; //........Data inicial
  endDate?: Date | null; //..........Data final
  quickLabel?: 'none' | '15 dias' | '30 dias' | '60 dias'; //..Atalho selecionado
  categories?: string[]; //..........Categorias selecionadas
  types?: string[]; //...............Tipos selecionados
}

// ========================================
// CONSTANTES
// ========================================

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

// Categorias disponiveis
const FILTER_CATEGORIES: { key: CommitmentCategory | 'todas'; label: string }[] = [
  { key: 'todas', label: 'Todas' },
  { key: 'agenda', label: 'Agenda' },
  { key: 'comercial', label: 'Comercial' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'rotina', label: 'Rotina' },
  { key: 'pendencias', label: 'Pendências' },
];

// Tipos de compromisso disponiveis
const FILTER_TYPES: { key: string; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'reuniao', label: 'Reunião' },
  { key: 'ligacao', label: 'Ligação' },
  { key: 'mensagem', label: 'Enviar mensagem' },
  { key: 'visita', label: 'Visita presencial' },
  { key: 'followup', label: 'Follow-up' },
  { key: 'proposta', label: 'Enviar proposta' },
  { key: 'treinamento', label: 'Treinamento' },
  { key: 'outros', label: 'Outros' },
];

// ========================================
// ICONES
// ========================================

// Icone Fechar
const CloseIcon = () => (
  <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
    <Path
      d="M12.655 0.247926C12.2959 -0.0821192 11.7339 -0.0827124 11.374 0.246573L6.5 4.70646L1.62595 0.246573C1.26609 -0.0827126 0.704125 -0.0821187 0.344999 0.247926L0.291597 0.297004C-0.0977822 0.654853 -0.0971065 1.25701 0.293074 1.61404L5.08634 6L0.293074 10.386C-0.0971063 10.743 -0.0977808 11.3451 0.291598 11.703L0.345 11.7521C0.704126 12.0821 1.26609 12.0827 1.62595 11.7534L6.5 7.29354L11.374 11.7534C11.7339 12.0827 12.2959 12.0821 12.655 11.7521L12.7084 11.703C13.0978 11.3451 13.0971 10.743 12.7069 10.386L7.91366 6L12.7069 1.61404C13.0971 1.25701 13.0978 0.654853 12.7084 0.297004L12.655 0.247926Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Icone Seta Esquerda
const ArrowLeftIcon = () => (
  <Svg width={7} height={10} viewBox="0 0 7 10" fill="none">
    <Path
      d="M6.18333 1.175L2.35833 5L6.18333 8.825L5 10L0 5L5 0L6.18333 1.175Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Icone Seta Direita
const ArrowRightIcon = () => (
  <Svg width={7} height={10} viewBox="0 0 7 10" fill="none">
    <Path
      d="M0 1.175L3.825 5L0 8.825L1.18333 10L6.18333 5L1.18333 0L0 1.175Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Icone Check (para checkbox)
const CheckIcon = () => (
  <Svg width={10} height={8} viewBox="0 0 10 8" fill="none">
    <Path
      d="M1 4L3.5 6.5L9 1"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// COMPONENTE CHECKBOX
// ========================================

interface CheckboxItemProps {
  label: string; //................Label do item
  checked: boolean; //..............Se esta marcado
  onToggle: () => void; //..........Callback ao clicar
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({ label, checked, onToggle }) => (
  <TouchableOpacity
    style={styles.checkboxRow}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <CheckIcon />}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </TouchableOpacity>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const FiltersModal: React.FC<FiltersModalProps> = ({ visible, onClose, onApply }) => {
  // Estado da aba ativa
  const [activeTab, setActiveTab] = React.useState<FilterTab>('data');

  // Estados de data
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [quickLabel, setQuickLabel] = React.useState<'none' | '15 dias' | '30 dias' | '60 dias'>('none');

  // Estados de categoria
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(['todas']);

  // Estados de tipos
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(['todos']);

  // Estados de selecao de data
  const [selectMode, setSelectMode] = React.useState<'none' | 'start' | 'end' | 'drag'>('none');

  // Referencias para arraste
  const gridLayoutRef = React.useRef<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });
  const cellsRef = React.useRef<Date[]>([]);

  // Helpers de data
  const formatDate = (d?: Date | null) => {
    if (!d) return '00/00/00';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const addDays = (d: Date, n: number) => {
    const r = new Date(d);
    r.setDate(r.getDate() + n);
    return r;
  };

  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const today = React.useMemo(() => new Date(), []);

  // Navegacao do mes
  const goPrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const goNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  // Construir calendario
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = `${monthNames[month]} - ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { label: number; inMonth: boolean; date: Date }[] = [];

  // Dias do mes anterior
  for (let i = 0; i < firstDay; i++) {
    const num = daysInPrevMonth - firstDay + 1 + i;
    cells.push({ label: num, inMonth: false, date: new Date(year, month - 1, num) });
  }

  // Dias do mes atual
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ label: i, inMonth: true, date: new Date(year, month, i) });
  }

  // Dias do proximo mes (sempre 42 celulas = 6 linhas para altura fixa)
  const totalCells = 42;
  for (let i = 1; cells.length < totalCells; i++) {
    cells.push({ label: i, inMonth: false, date: new Date(year, month + 1, i) });
  }

  // Armazena referencia das datas
  cellsRef.current = cells.map(c => c.date);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Dimensoes para calculo do arraste
  const cellWidth = 40;
  const cellHeight = 34;
  const columnW = cellWidth + 4;
  const rowH = cellHeight + 4;

  // PanResponder para arraste
  const panResponder = React.useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: () => selectMode === 'drag',
    onPanResponderMove: (_evt, gestureState) => {
      if (selectMode !== 'drag') return;
      const lx = gestureState.moveX - (gridLayoutRef.current.x || 0);
      const ly = gestureState.moveY - (gridLayoutRef.current.y || 0);
      if (lx < 0 || ly < 0) return;
      const col = Math.min(6, Math.max(0, Math.floor(lx / columnW)));
      const row = Math.max(0, Math.floor(ly / rowH));
      const idx = row * 7 + col;
      const hovered = cellsRef.current[idx];
      if (!hovered) return;
      if (startDate) {
        const s = startDate.getTime();
        const e = hovered.getTime();
        if (e >= s) setEndDate(hovered);
        else {
          setEndDate(startDate);
          setStartDate(hovered);
        }
      }
    },
    onPanResponderRelease: () => {
      if (selectMode === 'drag') setSelectMode('none');
    },
    onPanResponderTerminationRequest: () => true,
  }), [selectMode, startDate]);

  // Toggle categoria
  const toggleCategory = (key: string) => {
    if (key === 'todas') {
      setSelectedCategories(['todas']);
    } else {
      setSelectedCategories(prev => {
        const filtered = prev.filter(k => k !== 'todas');
        if (filtered.includes(key)) {
          const newList = filtered.filter(k => k !== key);
          return newList.length === 0 ? ['todas'] : newList;
        }
        return [...filtered, key];
      });
    }
  };

  // Toggle tipo
  const toggleType = (key: string) => {
    if (key === 'todos') {
      setSelectedTypes(['todos']);
    } else {
      setSelectedTypes(prev => {
        const filtered = prev.filter(k => k !== 'todos');
        if (filtered.includes(key)) {
          const newList = filtered.filter(k => k !== key);
          return newList.length === 0 ? ['todos'] : newList;
        }
        return [...filtered, key];
      });
    }
  };

  // Aplicar filtros
  const handleApply = () => {
    let periodsLabel = 'Todos';
    if (quickLabel === '15 dias') periodsLabel = '15 dias';
    else if (quickLabel === '30 dias') periodsLabel = '30 dias';
    else if (quickLabel === '60 dias') periodsLabel = '60 dias';
    else if (startDate || endDate) periodsLabel = `De ${formatDate(startDate)} à ${formatDate(endDate)}`;

    if (onApply) {
      onApply({
        periodsLabel,
        startDate,
        endDate,
        quickLabel,
        categories: selectedCategories,
        types: selectedTypes,
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Wrapper do Modal */}
      <View style={styles.modalWrapper}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Abas */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'data' && styles.tabButtonActive]}
              onPress={() => setActiveTab('data')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabButtonText, activeTab === 'data' && styles.tabButtonTextActive]}>
                Data
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'categoria' && styles.tabButtonActive]}
              onPress={() => setActiveTab('categoria')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabButtonText, activeTab === 'categoria' && styles.tabButtonTextActive]}>
                Categoria
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'tipos' && styles.tabButtonActive]}
              onPress={() => setActiveTab('tipos')}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabButtonText, activeTab === 'tipos' && styles.tabButtonTextActive]}>
                Tipos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Conteudo da Aba Data */}
          {activeTab === 'data' && (
            <View style={styles.tabContent}>
              {/* Container Data Inicial / Data Final */}
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity
                  style={[
                    styles.dateBox,
                    selectMode === 'start' && styles.dateBoxActive,
                  ]}
                  onPress={() => {
                    setQuickLabel('none');
                    setSelectMode('start');
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <Text style={[
                    styles.dateBoxLabel,
                    selectMode === 'start' && styles.dateBoxLabelActive,
                  ]}>
                    Data Inicial
                  </Text>
                  <Text style={[
                    styles.dateBoxValue,
                    selectMode === 'start' && styles.dateBoxValueActive,
                  ]}>
                    {formatDate(startDate)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.dateBox,
                    selectMode === 'end' && styles.dateBoxActive,
                  ]}
                  onPress={() => {
                    setQuickLabel('none');
                    setSelectMode('end');
                    setEndDate(null);
                  }}
                >
                  <Text style={[
                    styles.dateBoxLabel,
                    selectMode === 'end' && styles.dateBoxLabelActive,
                  ]}>
                    Data Final
                  </Text>
                  <Text style={[
                    styles.dateBoxValue,
                    selectMode === 'end' && styles.dateBoxValueActive,
                  ]}>
                    {formatDate(endDate)}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Atalhos */}
              <View style={styles.shortcutRow}>
                <TouchableOpacity
                  style={[styles.shortcutItem, quickLabel === '15 dias' && styles.shortcutItemActive]}
                  onPress={() => {
                    setQuickLabel('15 dias');
                    setSelectMode('none');
                    setStartDate(startOfDay(today));
                    setEndDate(startOfDay(addDays(today, 14)));
                  }}
                >
                  <Text style={[styles.shortcutText, quickLabel === '15 dias' && styles.shortcutTextActive]}>
                    15 Dias
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.shortcutItem, quickLabel === '30 dias' && styles.shortcutItemActive]}
                  onPress={() => {
                    setQuickLabel('30 dias');
                    setSelectMode('none');
                    setStartDate(startOfDay(today));
                    setEndDate(startOfDay(addDays(today, 29)));
                  }}
                >
                  <Text style={[styles.shortcutText, quickLabel === '30 dias' && styles.shortcutTextActive]}>
                    30 dias
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.shortcutItem, quickLabel === '60 dias' && styles.shortcutItemActive]}
                  onPress={() => {
                    setQuickLabel('60 dias');
                    setSelectMode('none');
                    setStartDate(startOfDay(today));
                    setEndDate(startOfDay(addDays(today, 59)));
                  }}
                >
                  <Text style={[styles.shortcutText, quickLabel === '60 dias' && styles.shortcutTextActive]}>
                    60 dias
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Navegacao do Mes */}
              <View style={styles.monthNav}>
                <TouchableOpacity style={styles.monthButton} onPress={goPrevMonth}>
                  <ArrowLeftIcon />
                </TouchableOpacity>
                <View style={styles.monthCenter}>
                  <Text style={styles.monthText}>{monthName}</Text>
                </View>
                <TouchableOpacity style={styles.monthButton} onPress={goNextMonth}>
                  <ArrowRightIcon />
                </TouchableOpacity>
              </View>

              {/* Dias da Semana */}
              <View style={styles.weekRow}>
                {weekDays.map((name) => (
                  <View key={name} style={styles.weekCell}>
                    <Text style={styles.weekLabel}>{name}</Text>
                  </View>
                ))}
              </View>

              {/* Grid de Dias */}
              <View
                style={styles.daysGrid}
                onLayout={(e) => {
                  const l = e?.nativeEvent?.layout;
                  gridLayoutRef.current = { x: l?.x ?? 0, y: l?.y ?? 0, width: l?.width ?? 0, height: l?.height ?? 0 };
                }}
                {...panResponder.panHandlers}
              >
                {cells.map((c, idx) => {
                  const s = startDate?.getTime();
                  const e = endDate?.getTime();
                  const t = c.date.getTime();
                  const inRange = c.inMonth && s != null && e != null && t >= Math.min(s, e) && t <= Math.max(s, e);
                  const isEdge = c.inMonth && ((s != null && t === s) || (e != null && t === e));
                  const isToday = c.date.getDate() === today.getDate() &&
                    c.date.getMonth() === today.getMonth() &&
                    c.date.getFullYear() === today.getFullYear();

                  return (
                    <TouchableOpacity
                      key={`d-${idx}`}
                      style={[
                        styles.dayCell,
                        !c.inMonth && styles.dayCellOut,
                        isEdge && styles.dayCellSelected,
                        inRange && !isEdge && styles.dayCellInRange,
                      ]}
                      onLongPress={() => {
                        setQuickLabel('none');
                        setSelectMode('drag');
                        setStartDate(c.date);
                        setEndDate(c.date);
                      }}
                      onPress={() => {
                        setQuickLabel('none');
                        if (selectMode === 'start') {
                          setStartDate(c.date);
                        } else if (selectMode === 'end') {
                          setEndDate(c.date);
                        } else {
                          setStartDate(c.date);
                          setEndDate(c.date);
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !c.inMonth && styles.dayTextOut,
                          isEdge && styles.dayTextSelected,
                        ]}
                      >
                        {String(c.label).padStart(2, '0')}
                      </Text>
                      {isToday && <View style={styles.todayDot} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Conteudo da Aba Categoria */}
          {activeTab === 'categoria' && (
            <View style={styles.tabContent}>
              <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.checkboxList}>
                {FILTER_CATEGORIES.map((cat) => (
                  <CheckboxItem
                    key={cat.key}
                    label={cat.label}
                    checked={selectedCategories.includes(cat.key)}
                    onToggle={() => toggleCategory(cat.key)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Conteudo da Aba Tipos */}
          {activeTab === 'tipos' && (
            <View style={styles.tabContent}>
              <ScrollView style={styles.tabContentScroll} contentContainerStyle={styles.checkboxList}>
                {FILTER_TYPES.map((type) => (
                  <CheckboxItem
                    key={type.key}
                    label={type.label}
                    checked={selectedTypes.includes(type.key)}
                    onToggle={() => toggleType(type.key)}
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1, //......................Ocupa tela
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo escuro
  },

  // Wrapper do Modal
  modalWrapper: {
    position: 'absolute', //..........Posicao absoluta
    left: 0, //......................Esquerda
    right: 0, //.....................Direita
    top: 0, //........................Topo
    bottom: 0, //....................Base
    justifyContent: 'center', //......Centraliza vertical
    alignItems: 'center', //..........Centraliza horizontal
  },

  // Card do Modal
  modalCard: {
    width: 340, //....................Largura fixa
    maxHeight: '85%', //..............Altura maxima
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 12, //..............Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Header
  header: {
    flexDirection: 'row', //..........Layout horizontal
    justifyContent: 'space-between', //..Espaco entre
    alignItems: 'center', //...........Centraliza vertical
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 14, //............Margem vertical
    borderBottomWidth: 1, //...........Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
  },

  // Titulo
  title: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 16, //....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Botao Fechar
  closeButton: {
    width: 35, //......................Largura
    height: 35, //.....................Altura
    borderRadius: 8, //................Bordas arredondadas
    backgroundColor: COLORS.background, //..Fundo cinza
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },

  // Container das Abas
  tabsContainer: {
    flexDirection: 'row', //.............Layout horizontal
    height: 42, //.......................Altura fixa
    marginHorizontal: 16, //.............Margem horizontal
    marginVertical: 12, //................Margem vertical
    padding: 4, //........................Padding 4px em todos os lados
    backgroundColor: '#F4F4F4', //........Fundo cinza claro
    borderRadius: 8, //...................Bordas arredondadas
    borderWidth: 0.3, //..................Borda fina
    borderColor: '#D8E0F0', //............Cor da borda
    gap: 6, //............................Espaco entre abas
  },

  // Botao da Aba
  tabButton: {
    flex: 1, //.........................Ocupa espaco igual
    height: 32, //......................Altura fixa
    paddingHorizontal: 10, //............Padding horizontal
    backgroundColor: '#FCFCFC', //........Fundo branco
    borderRadius: 4, //..................Bordas arredondadas
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
  },

  // Botao da Aba Ativo
  tabButtonActive: {
    paddingHorizontal: 15, //............Padding horizontal maior
    backgroundColor: '#1777CF', //........Fundo azul
  },

  // Texto da Aba
  tabButtonText: {
    fontFamily: 'Inter_400Regular', //....Fonte regular
    fontSize: 14, //....................Tamanho
    color: '#3A3F51', //..................Cor do texto
  },

  // Texto da Aba Ativo
  tabButtonTextActive: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    color: '#FCFCFC', //..................Cor branca
  },

  // Conteudo da Aba (altura fixa para todas as abas)
  tabContent: {
    height: 440, //.....................Altura fixa igual para todas abas
    paddingBottom: 8, //................Margem inferior
  },

  // Conteudo da Aba com Scroll
  tabContentScroll: {
    flex: 1, //........................Preenche espaco disponivel
  },

  // Lista de Checkboxes
  checkboxList: {
    paddingHorizontal: 16, //............Margem horizontal
    paddingVertical: 8, //...............Margem vertical
  },

  // Linha do Checkbox
  checkboxRow: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza vertical
    paddingVertical: 12, //.............Margem vertical
    borderBottomWidth: StyleSheet.hairlineWidth, //..Borda fina
    borderBottomColor: COLORS.border, //..Cor da borda
  },

  // Checkbox
  checkbox: {
    width: 22, //.......................Largura
    height: 22, //......................Altura
    borderRadius: 6, //..................Bordas arredondadas
    borderWidth: 2, //...................Borda
    borderColor: COLORS.border, //........Cor da borda
    backgroundColor: COLORS.white, //....Fundo branco
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //............Centraliza
    marginRight: 12, //..................Margem direita
  },

  // Checkbox Marcado
  checkboxChecked: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Label do Checkbox
  checkboxLabel: {
    fontFamily: 'Inter_400Regular', //...Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Container Data Inicial / Data Final
  dateRangeContainer: {
    height: 60, //..........................Altura do container
    padding: 5, //..........................Padding interno
    marginHorizontal: 16, //.................Margem horizontal
    marginTop: 4, //.......................Margem superior
    backgroundColor: COLORS.background, //..Fundo cinza
    borderRadius: 8, //.....................Bordas arredondadas
    borderWidth: 0.6, //....................Borda fina
    borderColor: COLORS.border, //..........Cor da borda
    flexDirection: 'row', //................Layout horizontal
    justifyContent: 'flex-start', //........Alinha inicio
    alignItems: 'center', //................Centraliza vertical
    gap: 5, //.............................Espaco entre boxes
  },

  // Box de Data (Inicial/Final)
  dateBox: {
    flex: 1, //.............................Ocupa espaco igual
    height: '100%', //......................Altura total
    paddingHorizontal: 10, //...............Padding horizontal
    backgroundColor: COLORS.white, //.......Fundo branco
    borderRadius: 4, //.....................Bordas arredondadas
    borderWidth: 0.5, //....................Borda fina
    borderColor: COLORS.border, //..........Cor da borda
    flexDirection: 'column', //.............Layout vertical
    justifyContent: 'center', //............Centraliza vertical
    alignItems: 'center', //................Centraliza horizontal
    gap: 2, //..............................Espaco entre label e valor
  },

  // Box Ativo
  dateBoxActive: {
    backgroundColor: COLORS.primary, //.....Fundo azul
    borderColor: COLORS.primary, //..........Borda azul
  },

  // Label do Box
  dateBoxLabel: {
    fontFamily: 'Inter_400Regular', //......Fonte regular
    fontSize: 14, //........................Tamanho
    color: COLORS.textSecondary, //..........Cor secundaria
    textAlign: 'center', //.................Centraliza texto
  },

  // Label Ativo
  dateBoxLabelActive: {
    color: COLORS.white, //..................Cor branca
  },

  // Valor do Box
  dateBoxValue: {
    fontFamily: 'Inter_400Regular', //......Fonte regular
    fontSize: 14, //........................Tamanho
    color: COLORS.textPrimary, //............Cor primaria
    textAlign: 'center', //.................Centraliza texto
  },

  // Valor Ativo
  dateBoxValueActive: {
    color: COLORS.white, //..................Cor branca
  },

  // Atalhos
  shortcutRow: {
    flexDirection: 'row', //...........Layout horizontal
    gap: 10, //........................Espaco
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 12, //............Margem vertical
  },

  // Item de Atalho
  shortcutItem: {
    flex: 1, //........................Ocupa espaco
    height: 40, //.....................Altura
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },

  // Item de Atalho Ativo
  shortcutItemActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto de Atalho
  shortcutText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto de Atalho Ativo
  shortcutTextActive: {
    color: COLORS.white, //..............Cor branca
  },

  // Navegacao do Mes
  monthNav: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza
    justifyContent: 'center', //.......Centraliza
    paddingHorizontal: 16, //..........Margem horizontal
    marginBottom: 10, //...............Margem inferior
    gap: 10, //........................Espaco
  },

  // Botao do Mes
  monthButton: {
    width: 30, //......................Largura
    height: 30, //.....................Altura
    borderRadius: 4, //................Bordas
    backgroundColor: COLORS.white, //..Fundo
    borderWidth: 1, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },

  // Centro do Mes
  monthCenter: {
    flex: 1, //........................Ocupa espaco
    height: 32, //.....................Altura
    backgroundColor: COLORS.white, //..Fundo
    borderRadius: 4, //................Bordas
    borderWidth: 1, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },

  // Texto do Mes
  monthText: {
    fontFamily: 'Inter_500Medium', //...Fonte media
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Linha da Semana
  weekRow: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'center', //.......Centraliza
    paddingHorizontal: 16, //..........Margem horizontal
    marginBottom: 6, //................Margem inferior
  },

  // Celula da Semana
  weekCell: {
    width: 44, //......................Largura (40 + 4 margem)
    alignItems: 'center', //...........Centraliza
  },

  // Label da Semana
  weekLabel: {
    fontFamily: 'Inter_500Medium', //...Fonte media
    fontSize: 12, //....................Tamanho
    color: COLORS.textSecondary, //......Cor secundaria
  },

  // Grid de Dias
  daysGrid: {
    flexDirection: 'row', //...........Layout horizontal
    flexWrap: 'wrap', //...............Quebra linha
    justifyContent: 'center', //.......Centraliza
    paddingHorizontal: 16, //..........Margem horizontal
    marginBottom: 8, //................Margem inferior
  },

  // Celula do Dia
  dayCell: {
    width: 40, //......................Largura
    height: 34, //.....................Altura
    marginHorizontal: 2, //............Margem horizontal
    marginVertical: 2, //..............Margem vertical
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
    borderRadius: 4, //................Bordas arredondadas
    borderWidth: StyleSheet.hairlineWidth, //..Borda fina
    borderColor: COLORS.border, //.....Cor da borda
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Celula Fora do Mes
  dayCellOut: {
    backgroundColor: 'transparent', //..Sem fundo
    borderWidth: 0, //...................Sem borda
  },

  // Celula Selecionada
  dayCellSelected: {
    backgroundColor: COLORS.primary, //..Fundo azul
  },

  // Celula no Intervalo
  dayCellInRange: {
    backgroundColor: 'rgba(23, 119, 207, 0.1)', //..Fundo azul claro
  },

  // Texto do Dia
  dayText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto Fora do Mes
  dayTextOut: {
    color: COLORS.textSecondary, //......Cor secundaria
    opacity: 0.4, //.....................Transparencia reduzida
  },

  // Texto Selecionado
  dayTextSelected: {
    color: COLORS.white, //..............Cor branca
  },

  // Bolinha do Dia Atual
  todayDot: {
    position: 'absolute', //..............Posicao absoluta
    top: -4, //.........................Posicao superior
    right: -4, //........................Posicao direita
    width: 10, //.........................Largura
    height: 10, //........................Altura
    borderRadius: 99, //..................Circular
    backgroundColor: COLORS.primary, //...Cor azul
    zIndex: 3, //........................Camada superior
  },

  // Footer
  footer: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'space-between', //..Espaco entre
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 12, //............Margem vertical
    borderTopWidth: 1, //..............Borda superior
    borderTopColor: COLORS.border, //...Cor da borda
  },

  // Botao Cancelar
  cancelButton: {
    flex: 1, //........................Ocupa espaco
    borderWidth: 1, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    borderRadius: 8, //................Bordas arredondadas
    paddingVertical: 10, //............Margem vertical
    alignItems: 'center', //...........Centraliza
    marginRight: 8, //................Margem direita
  },

  // Texto Botao Cancelar
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Botao Aplicar
  applyButton: {
    flex: 1, //........................Ocupa espaco
    backgroundColor: COLORS.primary, //..Fundo azul
    borderRadius: 8, //................Bordas arredondadas
    paddingVertical: 10, //............Margem vertical
    alignItems: 'center', //...........Centraliza
    marginLeft: 8, //..................Margem esquerda
  },

  // Texto Botao Aplicar
  applyButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //....................Tamanho
    color: COLORS.white, //..............Cor branca
  },
});

export default FiltersModal;
