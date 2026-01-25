import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  COLORS,
  CategoryItem,
  getCategoryIcon,
} from './02.Training-Types';

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface CategoryCardProps {
  category: CategoryItem; //......Dados da categoria
  isSelected: boolean; //.........Se esta selecionada
  onPress: () => void; //..........Callback ao clicar
}

// ========================================
// COMPONENTE CATEGORY CARD
// ========================================

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  // Calcula progresso da categoria
  const progress = category.totalCourses > 0
    ? (category.completedCourses / category.totalCourses) * 100
    : 0;

  // Cor do icone e borda baseado na selecao
  const iconColor = isSelected ? COLORS.white : COLORS.primary;
  const borderColor = isSelected ? COLORS.primary : COLORS.border;
  const backgroundColor = isSelected ? COLORS.primary : COLORS.white;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor, backgroundColor },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icone da Categoria */}
      <View style={styles.iconContainer}>
        {getCategoryIcon(category.key, iconColor)}
      </View>

      {/* Titulo da Categoria */}
      <Text
        style={[
          styles.title,
          isSelected && styles.titleSelected,
        ]}
        numberOfLines={1}
      >
        {category.title}
      </Text>

      {/* Contador de Cursos */}
      <Text
        style={[
          styles.counter,
          isSelected && styles.counterSelected,
        ]}
      >
        {category.completedCourses}/{category.totalCourses}
      </Text>

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%` },
            isSelected && styles.progressBarSelected,
          ]}
        />
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
    width: 100, //.................Largura fixa
    height: 110, //................Altura fixa
    borderRadius: 12, //...........Bordas arredondadas
    borderWidth: 1, //.............Largura da borda
    padding: 12, //................Padding interno
    marginRight: 12, //............Margem direita
    alignItems: 'center', //.......Centraliza conteudo
    justifyContent: 'space-between', //..Distribui verticalmente
  },

  // Container do Icone
  iconContainer: {
    width: 32, //..................Largura
    height: 32, //.................Altura
    justifyContent: 'center', //...Centraliza verticalmente
    alignItems: 'center', //.......Centraliza horizontalmente
  },

  // Titulo da Categoria
  title: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    textAlign: 'center', //............Centraliza texto
  },

  // Titulo Selecionado
  titleSelected: {
    color: COLORS.white, //............Cor branca
  },

  // Contador de Cursos
  counter: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 11, //....................Tamanho da fonte
    color: COLORS.textSecondary, //.....Cor secundaria
  },

  // Contador Selecionado
  counterSelected: {
    color: 'rgba(255, 255, 255, 0.8)', //..Branco transparente
  },

  // Container da Barra de Progresso
  progressContainer: {
    width: '100%', //..................Largura total
    height: 4, //......................Altura da barra
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 2, //................Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Barra de Progresso
  progressBar: {
    height: '100%', //................Altura total
    backgroundColor: COLORS.success, //..Cor verde
    borderRadius: 2, //................Bordas arredondadas
  },

  // Barra de Progresso Selecionada
  progressBarSelected: {
    backgroundColor: COLORS.white, //..Cor branca
  },
});

export default CategoryCard;
