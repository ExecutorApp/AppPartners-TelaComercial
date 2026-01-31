import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  COLORS,
  ProductItem,
  formatDuration,
} from './02.Training-Types';

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface ProductCardProps {
  product: ProductItem; //......Dados do produto
  onPress: () => void; //.......Callback ao clicar
  onImagePress?: () => void; //..Callback ao clicar na imagem
  useBlueProgress?: boolean; //..Usa cor azul na porcentagem
  useBorderedProgress?: boolean; //..Usa fundo branco com borda cinza
  useInlineProgress?: boolean; //....Exibe porcentagem inline na terceira linha
}

// ========================================
// COMPONENTE PRODUCT CARD
// ========================================

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onImagePress,
  useBlueProgress = false,
  useBorderedProgress = false,
  useInlineProgress = false,
}) => {
  // Determina cor do progresso baseado no status
  const getProgressColor = () => {
    if (product.progress === 100) return useBlueProgress ? COLORS.primary : COLORS.success;
    if (product.progress > 0) return COLORS.textPrimary;
    return COLORS.textSecondary;
  };

  // Determina cor de fundo do container de progresso
  const getProgressBackgroundColor = () => {
    if (useBorderedProgress) return COLORS.white;
    if (product.progress === 100) return useBlueProgress ? 'rgba(23, 119, 207, 0.1)' : 'rgba(27, 136, 60, 0.1)';
    if (product.progress > 0) return 'rgba(58, 63, 81, 0.1)';
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

  // Pega a primeira letra do nome do produto
  const firstLetter = product.name.charAt(0).toUpperCase();

  // Formata porcentagem com minimo de 2 digitos
  const formattedProgress = String(product.progress).padStart(2, '0');

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Container da Imagem ou Letra - Clicavel */}
      <TouchableOpacity
        style={styles.imageWrapper}
        onPress={onImagePress}
        activeOpacity={onImagePress ? 0.7 : 1}
        disabled={!onImagePress}
      >
        {product.image ? (
          <Image
            source={product.image}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.letterContainer}>
            <Text style={styles.letterText}>{firstLetter}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Coluna Direita - Informacoes */}
      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          {/* Primeira Linha - Nome do Produto */}
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>

          {/* Divisoria abaixo do nome */}
          <View style={styles.divider} />

          {/* Container da Segunda e Terceira Linha com Porcentagem */}
          <View style={styles.bottomRow}>
            {/* Lado Esquerdo - Modulos e Aulas */}
            <View style={[styles.infoColumn, useInlineProgress && { flex: 1 }]}>
              {/* Segunda Linha - Modulos */}
              <Text style={styles.infoText}>
                Módulos: {String(product.totalModules).padStart(2, '0')}
              </Text>

              {/* Divisoria abaixo de Modulos */}
              <View style={styles.divider} />

              {/* Terceira Linha - Aulas e Tempo */}
              {useInlineProgress ? (
                <View style={styles.inlineProgressRow}>
                  <Text style={styles.infoText}>
                    Aulas: {String(product.totalLessons).padStart(2, '0')}   Tempo: {formatDuration(product.totalDuration)}
                  </Text>
                  <Text style={[styles.inlineProgressText, { color: getProgressColor() }]}>
                    {formattedProgress}%
                  </Text>
                </View>
              ) : (
                <Text style={styles.infoText}>
                  Aulas: {String(product.totalLessons).padStart(2, '0')}   Tempo: {formatDuration(product.totalDuration)}
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

// ============================================================
// AJUSTES MANUAIS - CONTAINER DO CARD
// ============================================================

const CARD_PADDING_TOP = 6; //.........Linha 117: Padding superior do card
const CARD_PADDING_BOTTOM = 6; //......Linha 118: Padding inferior do card
const CARD_PADDING_LEFT = 6; //........Linha 119: Padding esquerdo do card
const CARD_PADDING_RIGHT = 12; //......Linha 120: Padding direito do card

// ============================================================
// AJUSTES MANUAIS - CONTAINER DA IMAGEM
// ============================================================

const IMAGE_WIDTH = 70; //.............Linha 125: Largura da imagem
const IMAGE_HEIGHT = 92; //............Linha 126: Altura da imagem
const IMAGE_MARGIN_RIGHT = 12; //......Linha 127: Margem direita da imagem
const IMAGE_BORDER_RADIUS = 8; //......Linha 128: Arredondamento da imagem
const IMAGE_FONT_SIZE = 36; //.........Linha 129: Tamanho da letra

// ============================================================
// AJUSTES MANUAIS - CONTAINER DE INFORMACOES
// ============================================================

const INFO_PADDING_TOP = 0; //.........Linha 134: Padding superior das informacoes
const INFO_PADDING_BOTTOM = 0; //......Linha 135: Padding inferior das informacoes
const INFO_PADDING_LEFT = 0; //........Linha 136: Padding esquerdo das informacoes
const INFO_PADDING_RIGHT = 0; //.......Linha 137: Padding direito das informacoes

// ============================================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'stretch', //.........Estica para altura igual
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 12, //..............Bordas arredondadas
    borderWidth: 1, //................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    paddingTop: CARD_PADDING_TOP, //..Padding superior (LINHA 150)
    paddingBottom: CARD_PADDING_BOTTOM, //..Padding inferior (LINHA 151)
    paddingLeft: CARD_PADDING_LEFT, //..Padding esquerdo (LINHA 152)
    paddingRight: CARD_PADDING_RIGHT, //..Padding direito (LINHA 153)
    marginBottom: 12, //..............Margem inferior
  },

  // Wrapper da Imagem
  imageWrapper: {
    justifyContent: 'center', //.....Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
    marginRight: IMAGE_MARGIN_RIGHT, //..Margem direita (LINHA 161)
  },

  // Imagem do Produto
  productImage: {
    width: IMAGE_WIDTH, //............Largura da imagem
    height: IMAGE_HEIGHT, //..........Altura da imagem
    borderRadius: IMAGE_BORDER_RADIUS, //..Arredondamento
  },

  // Container da Letra (quando nao tem imagem)
  letterContainer: {
    width: IMAGE_WIDTH, //............Largura do container
    height: IMAGE_HEIGHT, //..........Altura do container
    borderRadius: IMAGE_BORDER_RADIUS, //..Arredondamento
    backgroundColor: '#021632', //..Fundo cinza azulado
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
    paddingTop: INFO_PADDING_TOP, //..Padding superior (LINHA 188)
    paddingBottom: INFO_PADDING_BOTTOM, //..Padding inferior (LINHA 189)
    paddingLeft: INFO_PADDING_LEFT, //..Padding esquerdo (LINHA 190)
    paddingRight: INFO_PADDING_RIGHT, //..Padding direito (LINHA 191)
  },

  // Nome do Produto
  productName: {
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

  // Coluna de Informacoes (Modulos e Aulas)
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

export default ProductCard;
