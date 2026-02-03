// ========================================
// Componente EmojiPicker
// Seletor de emojis em grid
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React, {                           //......React core
  useState,                               //......Hook de estado
  useCallback,                            //......Hook de callback
} from 'react';                           //......Biblioteca React
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  Modal,                                  //......Modal nativo
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
  FlatList,                               //......Lista performatica
  ScrollView,                             //......Scroll
} from 'react-native';                    //......Biblioteca RN

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Interface de Props
// ========================================
interface EmojiPickerProps {
  visible: boolean;                       //......Visibilidade
  onClose: () => void;                    //......Handler fechar
  onSelect: (emoji: string) => void;      //......Handler selecionar
}

// ========================================
// Categorias de Emojis
// ========================================
const EMOJI_CATEGORIES = [
  { id: 'recent', name: 'Recentes', icon: '🕐' },
  { id: 'smileys', name: 'Carinhas', icon: '😀' },
  { id: 'gestures', name: 'Gestos', icon: '👋' },
  { id: 'hearts', name: 'Corações', icon: '❤️' },
  { id: 'objects', name: 'Objetos', icon: '📦' },
];

// ========================================
// Emojis por Categoria
// ========================================
const EMOJIS: Record<string, string[]> = {
  recent: ['👍', '❤️', '😊', '🙏', '😂', '🔥', '👏', '💯'],
  smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🙂', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗',
    '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗',
    '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶',
    '😏', '😒', '🙄', '😬', '😮', '🤯', '😳', '🥺',
    '😢', '😭', '😤', '😠', '😡', '🤬', '😈', '👿',
  ],
  gestures: [
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
    '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',
  ],
  hearts: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '♥️', '🫶', '💑', '💏', '👩‍❤️‍👨',
  ],
  objects: [
    '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '📷', '📸',
    '📹', '🎥', '📞', '☎️', '📺', '📻', '⏰', '⏱️',
    '🔋', '🔌', '💡', '🔦', '🕯️', '🧯', '🛢️', '💰',
    '💵', '💴', '💶', '💷', '💳', '💎', '🔧', '🔨',
  ],
};

// ========================================
// Componente Principal EmojiPicker
// ========================================
const EmojiPicker: React.FC<EmojiPickerProps> = ({
  visible,                                //......Visibilidade
  onClose,                                //......Handler fechar
  onSelect,                               //......Handler selecionar
}) => {
  // ========================================
  // Estado da Categoria
  // ========================================
  const [activeCategory, setActiveCategory] = useState('smileys');

  // ========================================
  // Handler de Selecao
  // ========================================
  const handleSelect = useCallback((emoji: string) => {
    onSelect(emoji);                      //......Chama callback
    onClose();                            //......Fecha picker
  }, [onSelect, onClose]);

  // ========================================
  // Render Item do Grid
  // ========================================
  const renderEmoji = useCallback(({ item }: { item: string }) => (
    <Pressable
      style={styles.emojiButton}          //......Estilo botao
      onPress={() => handleSelect(item)}  //......Handler
    >
      <Text style={styles.emojiText}>
        {item}
      </Text>
    </Pressable>
  ), [handleSelect]);

  // ========================================
  // Render Principal
  // ========================================
  return (
    <Modal
      visible={visible}                   //......Visibilidade
      transparent                         //......Fundo transparente
      animationType="slide"               //......Animacao slide
      onRequestClose={onClose}            //......Handler fechar
    >
      {/* Overlay */}
      <Pressable
        style={styles.overlay}            //......Estilo overlay
        onPress={onClose}                 //......Handler fechar
      />

      {/* Container do Picker */}
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Titulo */}
          <Text style={styles.title}>
            Emojis
          </Text>
        </View>

        {/* Tabs de Categorias */}
        <ScrollView
          horizontal                      //......Scroll horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {EMOJI_CATEGORIES.map((category) => (
            <Pressable
              key={category.id}           //......Chave unica
              style={[
                styles.categoryTab,       //......Estilo tab
                activeCategory === category.id && styles.categoryTabActive,
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>
                {category.icon}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Grid de Emojis */}
        <FlatList
          data={EMOJIS[activeCategory] || []}
          renderItem={renderEmoji}        //......Render item
          keyExtractor={(item, index) => `${item}-${index}`}
          numColumns={8}                  //......8 colunas
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

// ========================================
// Export Default
// ========================================
export default EmojiPicker;

// ========================================
// Estilos
// ========================================
const styles = StyleSheet.create({
  // Overlay
  overlay: {
    flex: 1,                              //......Ocupa espaco
    backgroundColor: ChatColors.modalBackground,
  },

  // Container principal
  container: {
    backgroundColor: ChatColors.white,    //......Fundo branco
    borderTopLeftRadius: 20,              //......Borda TL
    borderTopRightRadius: 20,             //......Borda TR
    maxHeight: '50%',                     //......Altura maxima
  },

  // Header
  header: {
    alignItems: 'center',                 //......Centraliza
    paddingVertical: 12,                  //......Padding vertical
    borderBottomWidth: 1,                 //......Borda inferior
    borderBottomColor: ChatColors.divider, //....Cor borda
  },

  // Drag handle
  dragHandle: {
    width: 40,                            //......Largura
    height: 4,                            //......Altura
    backgroundColor: ChatColors.divider,  //......Cor
    borderRadius: 2,                      //......Bordas
    marginBottom: 8,                      //......Margem inferior
  },

  // Titulo
  title: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte bold
    fontSize: 16,                         //......Tamanho fonte
    color: ChatColors.incomingText,       //......Cor texto
  },

  // Container das categorias
  categoriesContainer: {
    paddingHorizontal: 8,                 //......Padding horizontal
    paddingVertical: 8,                   //......Padding vertical
    gap: 4,                               //......Espaco entre
  },

  // Tab de categoria
  categoryTab: {
    width: 44,                            //......Largura
    height: 44,                           //......Altura
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    borderRadius: 12,                     //......Bordas
  },

  // Tab ativa
  categoryTabActive: {
    backgroundColor: ChatColors.dateBadge, //....Fundo azul claro
  },

  // Icone da categoria
  categoryIcon: {
    fontSize: 24,                         //......Tamanho emoji
  },

  // Container do grid
  gridContainer: {
    padding: 8,                           //......Padding
  },

  // Botao do emoji
  emojiButton: {
    flex: 1,                              //......Ocupa espaco
    aspectRatio: 1,                       //......Quadrado
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    maxWidth: '12.5%',                    //...... 8 colunas
  },

  // Texto do emoji
  emojiText: {
    fontSize: 28,                         //......Tamanho emoji
  },
});
