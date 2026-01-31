import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  COLORS,
  TrainingItem,
  formatDuration,
} from './02.Training-Types';

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface CourseCardProps {
  training: TrainingItem; //......Dados do treinamento
  onPress: () => void; //.........Callback ao clicar no card
  onImagePress?: () => void; //...Callback ao clicar na imagem (opcional)
  useBlueProgress?: boolean; //...Usa cor azul na porcentagem
  useBorderedProgress?: boolean; //..Usa fundo branco com borda cinza
  useInlineProgress?: boolean; //....Exibe porcentagem inline na terceira linha
}

// ========================================
// CONSTANTES DO CARD (LINHA 26)
// ========================================

const CARD_PADDING_TOP = 6; //.........Padding superior do card
const CARD_PADDING_BOTTOM = 6; //......Padding inferior do card
const CARD_PADDING_LEFT = 6; //........Padding esquerdo do card
const CARD_PADDING_RIGHT = 12; //......Padding direito do card

const IMAGE_WIDTH = 70; //.............Largura da imagem
const IMAGE_HEIGHT = 92; //............Altura da imagem
const IMAGE_MARGIN_RIGHT = 12; //......Margem direita da imagem
const IMAGE_BORDER_RADIUS = 8; //......Arredondamento da imagem

// ========================================
// COMPONENTE COURSE CARD
// ========================================

const CourseCard: React.FC<CourseCardProps> = ({
  training,
  onPress,
  onImagePress,
  useBlueProgress = false,
  useBorderedProgress = false,
  useInlineProgress = false,
}) => {
  // Determina cor do progresso baseado no status
  const getProgressColor = () => {
    if (training.progress === 100) return useBlueProgress ? COLORS.primary : COLORS.success;
    if (training.progress > 0) return COLORS.textPrimary;
    return COLORS.textSecondary;
  };

  // Determina cor de fundo do container de progresso
  const getProgressBackgroundColor = () => {
    if (useBorderedProgress) return COLORS.white;
    if (training.progress === 100) return useBlueProgress ? 'rgba(23, 119, 207, 0.1)' : 'rgba(27, 136, 60, 0.1)';
    if (training.progress > 0) return 'rgba(58, 63, 81, 0.1)';
    return 'rgba(125, 133, 146, 0.1)';
  };

  // Determina estilo de borda do container de progresso
  const getProgressBorderStyle = () => {
    if (useBorderedProgress) {
      return {
        borderWidth: 1,
        borderColor: COLORS.border,
      };
    }
    return {};
  };

  // Pega a primeira letra do titulo do treinamento
  const firstLetter = training.title.charAt(0).toUpperCase();

  // Formata porcentagem com minimo de 2 digitos
  const formattedProgress = String(training.progress).padStart(2, '0');

  // Conta total de conteudos
  const totalContents = training.contents.length;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Container da Imagem ou Letra */}
      <View style={styles.imageWrapper}>
        {onImagePress ? (
          <TouchableOpacity
            style={styles.letterContainer}
            onPress={(e) => {
              e.stopPropagation();
              onImagePress();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.letterText}>{firstLetter}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.letterContainer}>
            <Text style={styles.letterText}>{firstLetter}</Text>
          </View>
        )}
      </View>

      {/* Coluna Direita - Informacoes */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {/* Primeira Linha - Nome do Treinamento */}
          <Text style={styles.trainingName} numberOfLines={1}>
            {training.title}
          </Text>

          {/* Divisoria abaixo do nome */}
          <View style={styles.divider} />

          {/* Container da Segunda e Terceira Linha com Porcentagem */}
          <View style={styles.bottomRow}>
            {/* Lado Esquerdo - Modulos e Aulas */}
            <View style={[styles.infoColumn, useInlineProgress && { flex: 1 }]}>
              {/* Segunda Linha - Modulos */}
              <Text style={styles.infoText}>
                Módulos: 00
              </Text>

              {/* Divisoria abaixo de Modulos */}
              <View style={styles.divider} />

              {/* Terceira Linha - Aulas e Tempo */}
              {useInlineProgress ? (
                <View style={styles.inlineProgressRow}>
                  <Text style={styles.infoText}>
                    Aulas: {String(totalContents).padStart(2, '0')}   Tempo: {formatDuration(training.estimatedMinutes)}
                  </Text>
                  <Text style={[styles.inlineProgressText, { color: getProgressColor() }]}>
                    {formattedProgress}%
                  </Text>
                </View>
              ) : (
                <Text style={styles.infoText}>
                  Aulas: {String(totalContents).padStart(2, '0')}   Tempo: {formatDuration(training.estimatedMinutes)}
                </Text>
              )}
            </View>

            {/* Lado Direito - Porcentagem (apenas quando nao e inline) */}
            {!useInlineProgress && (
              <View
                style={[
                  styles.percentageContainer,
                  { backgroundColor: getProgressBackgroundColor() },
                  getProgressBorderStyle(),
                ]}
              >
                <Text style={[styles.progressText, { color: getProgressColor() }]}>
                  {formattedProgress}%
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'stretch', //.........Estica para altura igual
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 12, //..............Bordas arredondadas
    borderWidth: 1, //................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    paddingTop: CARD_PADDING_TOP, //..Padding superior
    paddingBottom: CARD_PADDING_BOTTOM, //..Padding inferior
    paddingLeft: CARD_PADDING_LEFT, //..Padding esquerdo
    paddingRight: CARD_PADDING_RIGHT, //..Padding direito
    marginBottom: 12, //..............Margem inferior
  },

  // Wrapper da Imagem
  imageWrapper: {
    justifyContent: 'center', //.....Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    marginRight: IMAGE_MARGIN_RIGHT, //..Margem direita
  },

  // Container da Letra
  letterContainer: {
    width: IMAGE_WIDTH, //............Largura do container
    height: IMAGE_HEIGHT, //..........Altura do container
    borderRadius: IMAGE_BORDER_RADIUS, //..Arredondamento
    backgroundColor: '#021632', //....Fundo azul escuro
    justifyContent: 'center', //.....Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Texto da Letra
  letterText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 20, //...................Tamanho da fonte
    color: '#FCFCFC', //...............Cor do texto
  },

  // Wrapper do Conteudo
  contentWrapper: {
    flex: 1, //......................Ocupa espaco disponivel
    justifyContent: 'center', //.....Centraliza verticalmente
  },

  // Conteudo do Card (Informacoes)
  content: {
    paddingTop: 0, //................Padding superior
    paddingBottom: 0, //..............Padding inferior
    paddingLeft: 0, //................Padding esquerdo
    paddingRight: 0, //...............Padding direito
  },

  // Nome do Treinamento
  trainingName: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 15, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Divisoria
  divider: {
    height: 1, //....................Altura da linha
    backgroundColor: COLORS.border, //..Cor da divisoria
    marginVertical: 6, //.............Margem vertical
  },

  // Container da Segunda e Terceira Linha
  bottomRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'stretch', //.........Estica para altura igual
  },

  // Coluna de Informacoes
  infoColumn: {
    flex: 1, //......................Ocupa espaco disponivel
  },

  // Texto de Informacoes
  infoText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 13, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Linha de Progresso Inline
  inlineProgressRow: {
    flexDirection: 'row', //...........Layout horizontal
    justifyContent: 'space-between', //..Distribui espaco
    alignItems: 'center', //...........Centraliza verticalmente
  },

  // Texto de Progresso Inline
  inlineProgressText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 13, //..................Tamanho da fonte
  },

  // Container da Porcentagem
  percentageContainer: {
    width: 50, //....................Largura fixa para caber 100%
    justifyContent: 'center', //.....Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    borderRadius: 6, //...............Bordas arredondadas
    marginLeft: 8, //.................Margem esquerda
  },

  // Texto do Progresso
  progressText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 12, //...................Tamanho da fonte
  },
});

export default CourseCard;
