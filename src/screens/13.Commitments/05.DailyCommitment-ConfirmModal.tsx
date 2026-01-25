import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { COLORS, CommitmentItem } from './02.DailyCommitment-Types';

// ========================================
// ICONE CHECK (CONFIRMACAO)
// ========================================

const CheckIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={10}
      fill="#1B883C"
    />
    <Path
      d="M8 12L11 15L16 9"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface ConfirmModalProps {
  visible: boolean; //....................Visibilidade do modal
  item: CommitmentItem | null; //.........Item selecionado
  onConfirm: () => void; //...............Callback ao confirmar
  onCancel: () => void; //................Callback ao cancelar
}

// ========================================
// COMPONENTE CONFIRM MODAL
// ========================================

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  item,
  onConfirm,
  onCancel,
}) => {
  // Se nao tiver item, nao renderiza
  if (!item) return null;

  // Obtem data e hora atual formatadas
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      {/* Overlay escuro */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          {/* Card do Modal */}
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Icone de Check */}
              <View style={styles.iconContainer}>
                <CheckIcon />
              </View>

              {/* Titulo */}
              <Text style={styles.title}>Confirmar conclusão</Text>

              {/* Bloco Atividade (alinhado a esquerda) */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Atividade</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>

              {/* Linha divisoria */}
              <View style={styles.dividerLine} />

              {/* Bloco Data e Horario (alinhado a esquerda) */}
              <View style={styles.infoBlock}>
                <Text style={styles.infoLabel}>Data e horário</Text>
                <Text style={styles.infoValue}>{formattedDate}  |  {formattedTime}</Text>
              </View>

              {/* Container dos Botoes */}
              <View style={styles.buttonsContainer}>
                {/* Botao Confirmar */}
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={onConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>

                {/* Botao Cancelar */}
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onCancel}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Overlay escuro
  overlay: {
    flex: 1, //............................Ocupa tela inteira
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //..Fundo escuro semi-transparente
    justifyContent: 'center', //...........Centraliza verticalmente
    alignItems: 'center', //...............Centraliza horizontalmente
    paddingHorizontal: 20, //..............Margem lateral
  },

  // Card do Modal
  modalCard: {
    width: 340, //........................Largura fixa
    maxWidth: '100%', //..................Largura maxima
    backgroundColor: COLORS.white, //......Fundo branco
    borderRadius: 16, //...................Bordas arredondadas
    padding: 24, //........................Padding interno
    alignItems: 'center', //...............Centraliza conteudo
  },

  // Container do Icone
  iconContainer: {
    marginBottom: 16, //...................Espaco inferior
  },

  // Titulo do Modal
  title: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    fontSize: 18, //.......................Tamanho da fonte
    color: COLORS.textPrimary, //..........Cor do texto
    textAlign: 'center', //................Centraliza texto
    marginBottom: 16, //..................Espaco inferior
  },

  // Bloco de informacao (alinhado a esquerda)
  infoBlock: {
    width: '100%', //......................Largura total
    alignItems: 'flex-start', //...........Alinha a esquerda
  },

  // Label de informacao
  infoLabel: {
    fontFamily: 'Inter_400Regular', //.....Fonte regular
    fontSize: 12, //.......................Tamanho da fonte
    color: COLORS.textSecondary, //........Cor cinza
    marginBottom: 4, //....................Espaco inferior
  },

  // Valor de informacao
  infoValue: {
    fontFamily: 'Inter_500Medium', //......Fonte media
    fontSize: 14, //.......................Tamanho da fonte
    color: COLORS.textPrimary, //..........Cor preta
    lineHeight: 20, //.....................Altura da linha
  },

  // Linha divisoria
  dividerLine: {
    width: '100%', //......................Largura total
    height: 1, //..........................Altura da linha
    backgroundColor: COLORS.border, //.....Cor da borda
    marginVertical: 12, //.................Espaco vertical
  },

  // Container dos Botoes
  buttonsContainer: {
    width: '100%', //......................Largura total
    marginTop: 20, //.....................Espaco superior
    gap: 12, //...........................Espaco entre botoes
  },

  // Botao Confirmar
  confirmButton: {
    width: '100%', //......................Largura total
    height: 48, //........................Altura fixa
    backgroundColor: COLORS.primary, //.....Fundo azul
    borderRadius: 8, //....................Bordas arredondadas
    justifyContent: 'center', //...........Centraliza verticalmente
    alignItems: 'center', //...............Centraliza horizontalmente
  },

  // Texto Botao Confirmar
  confirmButtonText: {
    fontFamily: 'Inter_600SemiBold', //....Fonte semi-bold
    fontSize: 16, //.......................Tamanho da fonte
    color: COLORS.white, //................Cor branca
  },

  // Botao Cancelar
  cancelButton: {
    width: '100%', //......................Largura total
    height: 48, //........................Altura fixa
    backgroundColor: COLORS.white, //......Fundo branco
    borderRadius: 8, //....................Bordas arredondadas
    borderWidth: 1, //.....................Largura da borda
    borderColor: COLORS.border, //.........Cor da borda
    justifyContent: 'center', //...........Centraliza verticalmente
    alignItems: 'center', //...............Centraliza horizontalmente
  },

  // Texto Botao Cancelar
  cancelButtonText: {
    fontFamily: 'Inter_500Medium', //.....Fonte media
    fontSize: 16, //.......................Tamanho da fonte
    color: COLORS.textSecondary, //........Cor cinza
  },
});

export default ConfirmModal;
