import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS, CommitmentItem } from './02.DailyCommitment-Types';
import { CommitmentType } from './05.NewCommitment-TypeModal';

// ========================================
// TIPOS
// ========================================

interface FormModalProps {
  visible: boolean; //..................Visibilidade do modal
  commitmentType: CommitmentType; //....Tipo selecionado
  existingCommitments: CommitmentItem[]; //..Compromissos existentes
  onClose: () => void; //...............Callback de fechamento
  onSave: (data: NewCommitmentData) => void; //..Callback de salvar
}

export interface NewCommitmentData {
  name: string; //......................Nome do compromisso
  type: CommitmentType; //..............Tipo
  date: Date; //.........................Data selecionada
  duration: number; //...................Duracao em minutos
  startTime: string; //..................Horario de inicio
  endTime: string; //....................Horario de fim
  isRecurrent: boolean; //...............Se e recorrente
}

type FrequencyOption = 'unico' | 'recorrente';

// ========================================
// CONSTANTES
// ========================================

// Horario de trabalho
const WORK_START = 8; //................Inicio do expediente (08:00)
const WORK_END = 18; //.................Fim do expediente (18:00)
const LUNCH_START = 12; //..............Inicio do almoco (12:00)
const LUNCH_END = 14; //.................Fim do almoco (14:00)

// Opcoes de duracao
const DURATION_OPTIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
  { value: 90, label: '1h30' },
  { value: 120, label: '2 horas' },
];

// Nomes dos meses
const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

// Labels dos tipos
const TYPE_LABELS: Record<CommitmentType, string> = {
  agenda: 'Agenda',
  rotina: 'Rotina',
  tarefa: 'Tarefa',
  lembrete: 'Lembrete',
};

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

// ========================================
// FUNCOES AUXILIARES
// ========================================

// Formata minutos para string de horario
const formatTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Converte string de horario para minutos
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Verifica se um slot esta no horario de almoco
const isLunchTime = (startMinutes: number, endMinutes: number): boolean => {
  const lunchStartMinutes = LUNCH_START * 60;
  const lunchEndMinutes = LUNCH_END * 60;
  return (startMinutes < lunchEndMinutes && endMinutes > lunchStartMinutes);
};

// Calcula slots disponiveis para uma data e duracao
const calculateAvailableSlots = (
  date: Date,
  duration: number,
  existingCommitments: CommitmentItem[]
): { startTime: string; endTime: string }[] => {
  const slots: { startTime: string; endTime: string }[] = [];
  const workStartMinutes = WORK_START * 60;
  const workEndMinutes = WORK_END * 60;

  // Filtra compromissos da data selecionada
  const dateStr = date.toISOString().split('T')[0];
  const dayCommitments = existingCommitments.filter(() => {
    // TODO: Implementar filtro por data quando tiver campo de data no CommitmentItem
    return true;
  });

  // Cria lista de periodos ocupados
  const occupiedPeriods = dayCommitments.map(c => ({
    start: timeToMinutes(c.startTime),
    end: timeToMinutes(c.endTime),
  }));

  // Adiciona horario de almoco como ocupado
  occupiedPeriods.push({
    start: LUNCH_START * 60,
    end: LUNCH_END * 60,
  });

  // Ordena por horario de inicio
  occupiedPeriods.sort((a, b) => a.start - b.start);

  // Itera pelos slots possiveis
  for (let startMinutes = workStartMinutes; startMinutes + duration <= workEndMinutes; startMinutes += 30) {
    const endMinutes = startMinutes + duration;

    // Verifica se o slot nao conflita com nenhum periodo ocupado
    const hasConflict = occupiedPeriods.some(period =>
      (startMinutes < period.end && endMinutes > period.start)
    );

    if (!hasConflict) {
      slots.push({
        startTime: formatTime(startMinutes),
        endTime: formatTime(endMinutes),
      });
    }
  }

  return slots;
};

// ========================================
// COMPONENTE
// ========================================

const NewCommitmentFormModal: React.FC<FormModalProps> = ({
  visible,
  commitmentType,
  existingCommitments,
  onClose,
  onSave,
}) => {
  // Estados do formulario
  const [name, setName] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [duration, setDuration] = React.useState(30);
  const [frequency, setFrequency] = React.useState<FrequencyOption>('unico');
  const [selectedSlot, setSelectedSlot] = React.useState<{ startTime: string; endTime: string } | null>(null);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Calcula slots disponiveis
  const availableSlots = React.useMemo(() => {
    return calculateAvailableSlots(selectedDate, duration, existingCommitments);
  }, [selectedDate, duration, existingCommitments]);

  // Reset quando modal abre
  React.useEffect(() => {
    if (visible) {
      setName('');
      setSelectedDate(new Date());
      setDuration(30);
      setFrequency('unico');
      setSelectedSlot(null);
      setCurrentMonth(new Date());
    }
  }, [visible]);

  // Limpa slot selecionado quando duracao muda
  React.useEffect(() => {
    setSelectedSlot(null);
  }, [duration, selectedDate]);

  // Navegacao do calendario
  const goPrevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    setCurrentMonth(d);
  };

  const goNextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  // Construir calendario
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = `${MONTH_NAMES[month]} - ${year}`;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells: { day: number; inMonth: boolean; date: Date }[] = [];

  // Dias do mes anterior
  for (let i = 0; i < firstDay; i++) {
    const num = daysInPrevMonth - firstDay + 1 + i;
    calendarCells.push({ day: num, inMonth: false, date: new Date(year, month - 1, num) });
  }

  // Dias do mes atual
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push({ day: i, inMonth: true, date: new Date(year, month, i) });
  }

  // Dias do proximo mes (completar 42 celulas)
  for (let i = 1; calendarCells.length < 42; i++) {
    calendarCells.push({ day: i, inMonth: false, date: new Date(year, month + 1, i) });
  }

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const today = new Date();

  // Verifica se uma data e a selecionada
  const isSelectedDate = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Verifica se uma data e hoje
  const isToday = (date: Date): boolean => {
    return date.toDateString() === today.toDateString();
  };

  // Handler de salvar
  const handleSave = () => {
    if (!name.trim() || !selectedSlot) return;

    onSave({
      name: name.trim(),
      type: commitmentType,
      date: selectedDate,
      duration,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      isRecurrent: frequency === 'recorrente',
    });
  };

  // Verifica se pode salvar
  const canSave = name.trim().length > 0 && selectedSlot !== null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Wrapper do Modal */}
      <View style={styles.modalWrapper}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Nova {TYPE_LABELS[commitmentType]}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Conteudo com Scroll */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Campo Nome */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Nome do compromisso</Text>
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome..."
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            {/* Frequencia */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Frequencia</Text>
              <View style={styles.frequencyRow}>
                <TouchableOpacity
                  style={[styles.frequencyButton, frequency === 'unico' && styles.frequencyButtonActive]}
                  onPress={() => setFrequency('unico')}
                >
                  <Text style={[styles.frequencyText, frequency === 'unico' && styles.frequencyTextActive]}>
                    Unico
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.frequencyButton, frequency === 'recorrente' && styles.frequencyButtonActive]}
                  onPress={() => setFrequency('recorrente')}
                >
                  <Text style={[styles.frequencyText, frequency === 'recorrente' && styles.frequencyTextActive]}>
                    Recorrente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendario */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Data</Text>

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
                {weekDays.map((day) => (
                  <View key={day} style={styles.weekCell}>
                    <Text style={styles.weekLabel}>{day}</Text>
                  </View>
                ))}
              </View>

              {/* Grid de Dias */}
              <View style={styles.daysGrid}>
                {calendarCells.map((cell, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.dayCell,
                      !cell.inMonth && styles.dayCellOut,
                      isSelectedDate(cell.date) && styles.dayCellSelected,
                    ]}
                    onPress={() => setSelectedDate(cell.date)}
                  >
                    <Text style={[
                      styles.dayText,
                      !cell.inMonth && styles.dayTextOut,
                      isSelectedDate(cell.date) && styles.dayTextSelected,
                    ]}>
                      {String(cell.day).padStart(2, '0')}
                    </Text>
                    {isToday(cell.date) && <View style={styles.todayDot} />}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Duracao */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Duracao</Text>
              <View style={styles.durationGrid}>
                {DURATION_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.durationButton, duration === opt.value && styles.durationButtonActive]}
                    onPress={() => setDuration(opt.value)}
                  >
                    <Text style={[styles.durationText, duration === opt.value && styles.durationTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Horarios Disponiveis */}
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Horarios disponiveis</Text>
              {availableSlots.length === 0 ? (
                <View style={styles.noSlotsContainer}>
                  <Text style={styles.noSlotsText}>
                    Nenhum horario disponivel para esta data e duracao
                  </Text>
                </View>
              ) : (
                <View style={styles.slotsGrid}>
                  {availableSlots.map((slot, idx) => {
                    const isSelected = selectedSlot?.startTime === slot.startTime;
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[styles.slotButton, isSelected && styles.slotButtonActive]}
                        onPress={() => setSelectedSlot(slot)}
                      >
                        <Text style={[styles.slotText, isSelected && styles.slotTextActive]}>
                          {slot.startTime}-{slot.endTime}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
                Salvar
              </Text>
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
    maxHeight: '90%', //..............Altura maxima
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

  // Conteudo
  content: {
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 12, //............Margem vertical
  },

  // Container de Campo
  fieldContainer: {
    marginBottom: 16, //...............Margem inferior
  },

  // Label do Campo
  fieldLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
    marginBottom: 8, //..................Margem inferior
  },

  // Input de Texto
  textInput: {
    height: 44, //.....................Altura
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    borderRadius: 8, //..................Bordas arredondadas
    paddingHorizontal: 12, //............Padding horizontal
    fontFamily: 'Inter_400Regular', //...Fonte regular
    fontSize: 14, //.....................Tamanho
    color: COLORS.textPrimary, //..........Cor do texto
    backgroundColor: COLORS.white, //.....Fundo branco
  },

  // Linha de Frequencia
  frequencyRow: {
    flexDirection: 'row', //...........Layout horizontal
    gap: 8, //.........................Espaco entre
  },

  // Botao de Frequencia
  frequencyButton: {
    flex: 1, //........................Ocupa espaco
    height: 40, //.....................Altura
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    borderRadius: 8, //..................Bordas arredondadas
    justifyContent: 'center', //........Centraliza
    alignItems: 'center', //.............Centraliza
    backgroundColor: COLORS.white, //....Fundo branco
  },

  // Botao de Frequencia Ativo
  frequencyButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto de Frequencia
  frequencyText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto de Frequencia Ativo
  frequencyTextActive: {
    color: COLORS.white, //..............Cor branca
  },

  // Navegacao do Mes
  monthNav: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza
    justifyContent: 'center', //.......Centraliza
    marginBottom: 10, //...............Margem inferior
    gap: 8, //.........................Espaco
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
    marginBottom: 6, //................Margem inferior
  },

  // Celula da Semana
  weekCell: {
    width: 40, //......................Largura
    marginHorizontal: 2, //.............Margem horizontal
    alignItems: 'center', //...........Centraliza
  },

  // Label da Semana
  weekLabel: {
    fontFamily: 'Inter_500Medium', //...Fonte media
    fontSize: 11, //....................Tamanho
    color: COLORS.textSecondary, //......Cor secundaria
  },

  // Grid de Dias
  daysGrid: {
    flexDirection: 'row', //...........Layout horizontal
    flexWrap: 'wrap', //...............Quebra linha
    justifyContent: 'center', //.......Centraliza
  },

  // Celula do Dia
  dayCell: {
    width: 40, //......................Largura
    height: 32, //.....................Altura
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
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto do Dia
  dayText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto Fora do Mes
  dayTextOut: {
    color: COLORS.textSecondary, //......Cor secundaria
    opacity: 0.4, //.....................Transparencia
  },

  // Texto Selecionado
  dayTextSelected: {
    color: COLORS.white, //..............Cor branca
  },

  // Bolinha do Dia Atual
  todayDot: {
    position: 'absolute', //..............Posicao absoluta
    top: -3, //.........................Posicao superior
    right: -3, //........................Posicao direita
    width: 8, //.........................Largura
    height: 8, //........................Altura
    borderRadius: 99, //..................Circular
    backgroundColor: COLORS.primary, //...Cor azul
  },

  // Grid de Duracao
  durationGrid: {
    flexDirection: 'row', //...........Layout horizontal
    flexWrap: 'wrap', //...............Quebra linha
    gap: 8, //.........................Espaco
  },

  // Botao de Duracao
  durationButton: {
    paddingHorizontal: 12, //..........Padding horizontal
    paddingVertical: 8, //..............Padding vertical
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
  },

  // Botao de Duracao Ativo
  durationButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto de Duracao
  durationText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto de Duracao Ativo
  durationTextActive: {
    color: COLORS.white, //..............Cor branca
  },

  // Container Sem Slots
  noSlotsContainer: {
    paddingVertical: 20, //............Padding vertical
    alignItems: 'center', //...........Centraliza
  },

  // Texto Sem Slots
  noSlotsText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textSecondary, //......Cor secundaria
    textAlign: 'center', //.............Centraliza texto
  },

  // Grid de Slots
  slotsGrid: {
    flexDirection: 'row', //...........Layout horizontal
    flexWrap: 'wrap', //...............Quebra linha
    gap: 8, //.........................Espaco
  },

  // Botao de Slot
  slotButton: {
    paddingHorizontal: 10, //..........Padding horizontal
    paddingVertical: 8, //..............Padding vertical
    borderWidth: 1, //..................Borda
    borderColor: COLORS.border, //......Cor da borda
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
  },

  // Botao de Slot Ativo
  slotButtonActive: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto de Slot
  slotText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto de Slot Ativo
  slotTextActive: {
    color: COLORS.white, //..............Cor branca
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

  // Botao Salvar
  saveButton: {
    flex: 1, //........................Ocupa espaco
    backgroundColor: COLORS.primary, //..Fundo azul
    borderRadius: 8, //................Bordas arredondadas
    paddingVertical: 10, //............Margem vertical
    alignItems: 'center', //...........Centraliza
    marginLeft: 8, //..................Margem esquerda
  },

  // Botao Salvar Desabilitado
  saveButtonDisabled: {
    backgroundColor: COLORS.border, //..Fundo cinza
  },

  // Texto Botao Salvar
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //....................Tamanho
    color: COLORS.white, //..............Cor branca
  },

  // Texto Botao Salvar Desabilitado
  saveButtonTextDisabled: {
    color: COLORS.textSecondary, //......Cor secundaria
  },
});

export default NewCommitmentFormModal;
