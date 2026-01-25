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
  CATEGORY_LABELS,
  STATUS_LABELS,
  TimeIcon,
  CheckIcon,
  formatDuration,
} from './02.Training-Types';

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface CourseCardProps {
  training: TrainingItem; //......Dados do treinamento
  onPress: () => void; //.........Callback ao clicar
}

// ========================================
// COMPONENTE COURSE CARD
// ========================================

const CourseCard: React.FC<CourseCardProps> = ({
  training,
  onPress,
}) => {
  // Cor do status baseado no estado
  const getStatusColor = () => {
    switch (training.status) {
      case 'completed':
        return COLORS.success;
      case 'in_progress':
        return COLORS.warning;
      default:
        return COLORS.textSecondary;
    }
  };

  // Cor de fundo do status
  const getStatusBackgroundColor = () => {
    switch (training.status) {
      case 'completed':
        return 'rgba(27, 136, 60, 0.1)';
      case 'in_progress':
        return 'rgba(245, 166, 35, 0.1)';
      default:
        return 'rgba(125, 133, 146, 0.1)';
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Thumbnail Placeholder */}
      <View style={styles.thumbnail}>
        <View style={styles.thumbnailPlaceholder}>
          <Text style={styles.thumbnailText}>
            {training.title.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Conteudo do Card */}
      <View style={styles.content}>
        {/* Titulo */}
        <Text style={styles.title} numberOfLines={2}>
          {training.title}
        </Text>

        {/* Categoria e Duracao */}
        <View style={styles.metaRow}>
          {/* Categoria */}
          <Text style={styles.category}>
            {CATEGORY_LABELS[training.category]}
          </Text>

          {/* Separador */}
          <View style={styles.separator} />

          {/* Duracao */}
          <View style={styles.durationContainer}>
            <TimeIcon color={COLORS.textSecondary} />
            <Text style={styles.duration}>
              {formatDuration(training.estimatedMinutes)}
            </Text>
          </View>
        </View>

        {/* Status e Progresso */}
        <View style={styles.statusRow}>
          {/* Badge de Status */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusBackgroundColor() },
            ]}
          >
            {training.status === 'completed' && (
              <CheckIcon color={COLORS.success} />
            )}
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor() },
              ]}
            >
              {STATUS_LABELS[training.status]}
            </Text>
          </View>

          {/* Barra de Progresso (se em andamento) */}
          {training.status === 'in_progress' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${training.progress}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{training.progress}%</Text>
            </View>
          )}
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
    flexDirection: 'row', //.......Layout horizontal
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 12, //............Bordas arredondadas
    borderWidth: 1, //..............Largura da borda
    borderColor: COLORS.border, //..Cor da borda
    padding: 12, //................Padding interno
    marginBottom: 12, //............Margem inferior
  },

  // Thumbnail
  thumbnail: {
    width: 64, //..................Largura
    height: 64, //.................Altura
    marginRight: 12, //.............Margem direita
  },

  // Placeholder da Thumbnail
  thumbnailPlaceholder: {
    width: '100%', //...............Largura total
    height: '100%', //..............Altura total
    backgroundColor: COLORS.primary, //..Fundo azul
    borderRadius: 8, //.............Bordas arredondadas
    justifyContent: 'center', //....Centraliza verticalmente
    alignItems: 'center', //.......Centraliza horizontalmente
  },

  // Texto da Thumbnail
  thumbnailText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 24, //...................Tamanho da fonte
    color: COLORS.white, //............Cor branca
  },

  // Conteudo do Card
  content: {
    flex: 1, //.....................Ocupa espaco disponivel
    justifyContent: 'space-between', //..Distribui verticalmente
  },

  // Titulo do Treinamento
  title: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    lineHeight: 18, //.................Altura da linha
  },

  // Linha de Metadados
  metaRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    marginTop: 4, //.................Margem superior
  },

  // Categoria
  category: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.primary, //..........Cor azul
  },

  // Separador
  separator: {
    width: 4, //.....................Largura
    height: 4, //....................Altura
    borderRadius: 2, //...............Bordas arredondadas
    backgroundColor: COLORS.border, //..Cor cinza
    marginHorizontal: 8, //...........Margem horizontal
  },

  // Container da Duracao
  durationContainer: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 4, //.......................Espaco entre elementos
  },

  // Duracao
  duration: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },

  // Linha de Status
  statusRow: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    justifyContent: 'space-between', //..Distribui horizontalmente
    marginTop: 8, //.................Margem superior
  },

  // Badge de Status
  statusBadge: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    paddingHorizontal: 8, //.........Padding horizontal
    paddingVertical: 4, //...........Padding vertical
    borderRadius: 4, //..............Bordas arredondadas
    gap: 4, //.......................Espaco entre elementos
  },

  // Texto do Status
  statusText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 11, //...................Tamanho da fonte
  },

  // Container do Progresso
  progressContainer: {
    flexDirection: 'row', //.........Layout horizontal
    alignItems: 'center', //.........Centraliza verticalmente
    gap: 8, //.......................Espaco entre elementos
  },

  // Fundo da Barra de Progresso
  progressBackground: {
    width: 60, //...................Largura fixa
    height: 4, //....................Altura
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 2, //...............Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Barra de Progresso
  progressBar: {
    height: '100%', //................Altura total
    backgroundColor: COLORS.warning, //..Cor amarela
    borderRadius: 2, //................Bordas arredondadas
  },

  // Texto do Progresso
  progressText: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 11, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },
});

export default CourseCard;
