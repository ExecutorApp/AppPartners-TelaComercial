import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { COLORS } from './02.DailyCommitment-Types';

// ========================================
// TIPOS
// ========================================

export type CommitmentType = 'agenda' | 'rotina' | 'tarefa' | 'lembrete';

interface TypeModalProps {
  visible: boolean; //.................Visibilidade do modal
  onClose: () => void; //..............Callback de fechamento
  onSelect: (type: CommitmentType) => void; //..Callback de selecao
}

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

// Icone Calendario (Agenda)
const CalendarIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M16 2V6M8 2V6M3 10H21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Rotina (Relogio com setas)
const RoutineIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Tarefa (Check em quadrado)
const TaskIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 11L12 14L22 4"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Lembrete (Sino)
const ReminderIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4 17.4 4.9 16.2 3.8C15.1 2.6 13.6 2 12 2C10.4 2 8.9 2.6 7.8 3.8C6.6 4.9 6 6.4 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.7 21C13.5 21.3 13.3 21.6 12.9 21.8C12.6 21.9 12.3 22 12 22C11.7 22 11.4 21.9 11.1 21.8C10.7 21.6 10.5 21.3 10.3 21"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// OPCOES DE TIPO
// ========================================

const TYPE_OPTIONS: { key: CommitmentType; label: string; description: string; icon: React.FC<{ color?: string }> }[] = [
  {
    key: 'agenda',
    label: 'Agenda',
    description: 'Compromisso com horario fixo',
    icon: CalendarIcon,
  },
  {
    key: 'rotina',
    label: 'Rotina',
    description: 'Atividade recorrente do dia a dia',
    icon: RoutineIcon,
  },
  {
    key: 'tarefa',
    label: 'Tarefa',
    description: 'Acao pontual a ser realizada',
    icon: TaskIcon,
  },
  {
    key: 'lembrete',
    label: 'Lembrete',
    description: 'Nota para nao esquecer',
    icon: ReminderIcon,
  },
];

// ========================================
// COMPONENTE
// ========================================

const NewCommitmentTypeModal: React.FC<TypeModalProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Overlay */}
      <View style={styles.overlay} />

      {/* Wrapper do Modal */}
      <View style={styles.modalWrapper}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Novo Compromisso</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Subtitulo */}
          <Text style={styles.subtitle}>Selecione o tipo de compromisso</Text>

          {/* Lista de Opcoes */}
          <View style={styles.optionsList}>
            {TYPE_OPTIONS.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={styles.optionItem}
                  onPress={() => onSelect(option.key)}
                  activeOpacity={0.7}
                >
                  {/* Icone */}
                  <View style={styles.optionIcon}>
                    <IconComponent color={COLORS.primary} />
                  </View>

                  {/* Textos */}
                  <View style={styles.optionTexts}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>

                  {/* Seta */}
                  <View style={styles.optionArrow}>
                    <Svg width={8} height={14} viewBox="0 0 8 14" fill="none">
                      <Path
                        d="M1 1L7 7L1 13"
                        stroke={COLORS.textSecondary}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
              );
            })}
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

  // Subtitulo
  subtitle: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho
    color: COLORS.textSecondary, //......Cor secundaria
    paddingHorizontal: 16, //............Margem horizontal
    paddingTop: 12, //..................Margem superior
    paddingBottom: 8, //.................Margem inferior
  },

  // Lista de Opcoes
  optionsList: {
    paddingHorizontal: 16, //..........Margem horizontal
    paddingBottom: 16, //..............Margem inferior
  },

  // Item de Opcao
  optionItem: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza vertical
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Borda
    borderColor: COLORS.border, //......Cor da borda
    padding: 12, //....................Padding interno
    marginBottom: 8, //................Margem inferior
  },

  // Icone da Opcao
  optionIcon: {
    width: 40, //......................Largura
    height: 40, //.....................Altura
    borderRadius: 8, //................Bordas arredondadas
    backgroundColor: 'rgba(23, 119, 207, 0.1)', //..Fundo azul claro
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },

  // Textos da Opcao
  optionTexts: {
    flex: 1, //........................Ocupa espaco
    marginLeft: 12, //..................Margem esquerda
  },

  // Label da Opcao
  optionLabel: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //....................Tamanho
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Descricao da Opcao
  optionDescription: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //....................Tamanho
    color: COLORS.textSecondary, //......Cor secundaria
    marginTop: 2, //....................Margem superior
  },

  // Seta da Opcao
  optionArrow: {
    width: 24, //......................Largura
    height: 24, //.....................Altura
    justifyContent: 'center', //.......Centraliza
    alignItems: 'center', //...........Centraliza
  },
});

export default NewCommitmentTypeModal;
