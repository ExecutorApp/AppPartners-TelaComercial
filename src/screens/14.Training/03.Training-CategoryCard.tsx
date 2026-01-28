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
// AJUSTES MANUAIS - CATEGORY CARD
// ========================================

const CARD_HEIGHT = 90; //...........Altura do card (LINHA 18)
const CARD_PADDING_TOP = 5; //........Padding superior interno do card (LINHA 19)
const CARD_PADDING_BOTTOM = 5; //.....Padding inferior interno do card (LINHA 20)
const CARD_PADDING_LEFT = 12; //......Padding esquerdo interno do card (LINHA 21)
const CARD_PADDING_RIGHT = 12; //.....Padding direito interno do card (LINHA 22)
const TITLE_MARGIN_TOP = -0; //........Espacamento acima do titulo (LINHA 23)
const TITLE_MARGIN_BOTTOM = 0; //.....Espacamento abaixo do titulo (LINHA 24)
const COUNTER_FONT_SIZE = 12; //......Tamanho da fonte do contador (LINHA 25)

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface CategoryCardProps {
  category: CategoryItem; //......Dados da categoria
  isSelected: boolean; //.........Se esta selecionada
  onPress: () => void; //..........Callback ao clicar
  hideSelectedBackground?: boolean; //..Esconde fundo azul quando selecionado
  useBlueProgress?: boolean; //...Usa cor azul na barra de progresso
}

// ========================================
// COMPONENTE CATEGORY CARD
// ========================================

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected,
  onPress,
  hideSelectedBackground = false,
  useBlueProgress = false,
}) => {
  // Calcula progresso da categoria
  const progress = category.totalCourses > 0
    ? (category.completedCourses / category.totalCourses) * 100
    : 0;

  // Cor do icone e borda baseado na selecao
  const iconColor = COLORS.primary; //..........Icone sempre azul
  const borderColor = isSelected ? COLORS.primary : COLORS.border; //..Borda azul quando selecionado
  const backgroundColor = (isSelected && !hideSelectedBackground) ? 'rgba(23, 119, 207, 0.08)' : COLORS.white; //..Fundo azul claro quando selecionado (se permitido)

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
      <Text style={styles.title} numberOfLines={1}>
        {category.title}
      </Text>

      {/* Container da Barra de Progresso e Contador */}
      <View style={styles.progressRow}>
        {/* Barra de Progresso */}
        <View
          style={[
            styles.progressContainer,
            isSelected && styles.progressContainerSelected,
          ]}
        >
          <View style={[
            styles.progressBar,
            { width: `${progress}%` },
            useBlueProgress && { backgroundColor: COLORS.primary },
          ]} />
        </View>

        {/* Contador de Cursos */}
        <Text style={styles.counter}>
          {String(category.completedCourses).padStart(2, '0')}/{String(category.totalCourses).padStart(2, '0')}
        </Text>
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
    width: 140, //.................Largura fixa (cabe "Desenvolvimento")
    height: CARD_HEIGHT, //........Altura fixa (LINHA 18)
    borderRadius: 12, //...........Bordas arredondadas
    borderWidth: 1, //.............Largura da borda
    paddingTop: CARD_PADDING_TOP, //......Padding superior (LINHA 19)
    paddingBottom: CARD_PADDING_BOTTOM, //..Padding inferior (LINHA 20)
    paddingLeft: CARD_PADDING_LEFT, //....Padding esquerdo (LINHA 21)
    paddingRight: CARD_PADDING_RIGHT, //..Padding direito (LINHA 22)
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
    marginTop: TITLE_MARGIN_TOP, //....Espacamento acima (LINHA 23)
    marginBottom: TITLE_MARGIN_BOTTOM, //..Espacamento abaixo (LINHA 24)
  },

  // Container da Linha de Progresso e Contador
  progressRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    width: '100%', //..................Largura total
    gap: 6, //........................Espaco entre barra e contador
  },

  // Container da Barra de Progresso
  progressContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    height: 4, //......................Altura da barra
    backgroundColor: COLORS.border, //..Fundo cinza
    borderRadius: 2, //................Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Contador de Cursos
  counter: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: COUNTER_FONT_SIZE, //.....Tamanho da fonte (LINHA 25)
    color: COLORS.textSecondary, //.....Cor secundaria
  },

  // Container da Barra de Progresso Selecionado
  progressContainerSelected: {
    backgroundColor: '#D0D0D0', //..Fundo cinza mais escuro para destaque
  },

  // Barra de Progresso
  progressBar: {
    height: '100%', //................Altura total
    backgroundColor: COLORS.success, //..Cor verde
    borderRadius: 2, //................Bordas arredondadas
  },
});

export default CategoryCard;
