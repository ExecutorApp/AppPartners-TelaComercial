import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  COLORS,
  TrainingContentItem,
  getContentTypeIcon,
  formatDuration,
} from './02.Training-Types';

// ========================================
// CONSTANTES DA IMAGEM DO TREINAMENTO (HEADER)
// ========================================

export const TRAINING_IMAGE_WIDTH = 65; //..........Largura da imagem do treinamento
export const TRAINING_IMAGE_HEIGHT = 80; //.........Altura da imagem do treinamento
export const TRAINING_IMAGE_BORDER_RADIUS = 8; //...Arredondamento da imagem

// ========================================
// CONSTANTES DO CARD DE MODULO
// ========================================

export const MODULE_CARD_WIDTH = 120; //...........Largura do card de modulo
export const MODULE_CARD_HEIGHT = 90; //.........Altura do card de modulo
export const MODULE_CARD_MARGIN_RIGHT = 12; //.....Margem direita entre cards
export const MODULE_CARD_BORDER_RADIUS = 12; //....Arredondamento do card

// ========================================
// CONSTANTES DO CARD DE AULA
// ========================================

export const LESSON_NUMBER_WIDTH = 45; //..........Largura do container de numero
export const LESSON_NUMBER_HEIGHT = 60; //.........Altura do container de numero
export const LESSON_NUMBER_BORDER_RADIUS = 8; //...Arredondamento do container de numero
export const LESSON_NUMBER_MARGIN_RIGHT = 12; //...Margem direita do container de numero
export const LESSON_INFO_MIN_HEIGHT = 50; //.......Altura minima do container de info
export const LESSON_CARD_PADDING_TOP = 6; //.......Padding superior do card
export const LESSON_CARD_PADDING_BOTTOM = 6; //....Padding inferior do card
export const LESSON_CARD_PADDING_LEFT = 6; //......Padding esquerdo do card
export const LESSON_CARD_PADDING_RIGHT = 12; //.....Padding direito do card
export const LESSON_CARD_MARGIN_BOTTOM = 12; //....Margem inferior entre cards
export const LESSON_CARD_BORDER_RADIUS = 12; //....Arredondamento do card

// ========================================
// DADOS MOCKADOS DE MODULOS
// ========================================

// Interface do modulo mockado
export interface MockModule {
  id: number; //.................ID do modulo
  title: string; //..............Titulo do modulo
  description: string; //.......Descricao do modulo
  lessons: Array<{
    title: string; //............Titulo da aula
    description: string; //.....Descricao da aula
    duration: number; //........Duracao em minutos
    type: string; //............Tipo da aula
  }>;
}

// Modulos mockados por ID de treinamento
export const MOCK_MODULES_BY_TRAINING: Record<string, MockModule[]> = {
  // Treinamento 'dashboard' tem 3 modulos
  'dashboard': [
    {
      id: 1,
      title: 'Módulo 01',
      description: 'Fundamentos e configuração inicial',
      lessons: [
        { title: 'Introdução ao Dashboard', description: 'Aprenda os conceitos básicos do painel de controle', duration: 15, type: 'video' },
        { title: 'Configurando preferências', description: 'Personalize seu ambiente de trabalho', duration: 10, type: 'video' },
        { title: 'Navegação básica', description: 'Domine os atalhos e menus principais', duration: 12, type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Módulo 02',
      description: 'Análise de métricas e indicadores',
      lessons: [
        { title: 'KPIs principais', description: 'Entenda os indicadores mais importantes', duration: 20, type: 'video' },
        { title: 'Gráficos e visualizações', description: 'Interprete dados visuais com clareza', duration: 18, type: 'video' },
        { title: 'Relatórios customizados', description: 'Crie seus próprios relatórios', duration: 25, type: 'video' },
      ],
    },
    {
      id: 3,
      title: 'Módulo 03',
      description: 'Avançando no uso do sistema',
      lessons: [
        { title: 'Automações', description: 'Configure processos automáticos', duration: 22, type: 'video' },
        { title: 'Integrações', description: 'Conecte com outras ferramentas', duration: 28, type: 'video' },
        { title: 'Dicas avançadas', description: 'Truques e recursos ocultos', duration: 15, type: 'video' },
      ],
    },
  ],
  // Treinamento Produtos (app-04) tem 3 modulos
  'app-04': [
    {
      id: 1,
      title: 'Módulo 01',
      description: 'Fundamentos sobre produtos e catálogo',
      lessons: [
        { title: 'Introdução ao catálogo', description: 'Conheça a estrutura completa do catálogo de produtos', duration: 12, type: 'video' },
        { title: 'Visualizando produtos', description: 'Aprenda a visualizar todos os detalhes de cada produto', duration: 15, type: 'video' },
        { title: 'Filtros e buscas', description: 'Domine o uso de filtros e buscas avançadas', duration: 10, type: 'video' },
        { title: 'Categorias de produtos', description: 'Entenda como os produtos estão organizados', duration: 8, type: 'video' },
      ],
    },
    {
      id: 2,
      title: 'Módulo 02',
      description: 'Detalhamento técnico e comercial dos produtos',
      lessons: [
        { title: 'Especificações técnicas', description: 'Compreenda as especificações técnicas de cada produto', duration: 18, type: 'video' },
        { title: 'Condições comerciais', description: 'Conheça todas as condições comerciais disponíveis', duration: 20, type: 'video' },
        { title: 'Documentação necessária', description: 'Entenda quais documentos são necessários', duration: 14, type: 'text' },
        { title: 'Materiais de apoio', description: 'Conheça todos os materiais de apoio disponíveis', duration: 12, type: 'text' },
      ],
    },
    {
      id: 3,
      title: 'Módulo 03',
      description: 'Estratégias de apresentação e vendas',
      lessons: [
        { title: 'Técnicas de apresentação', description: 'Aprenda técnicas profissionais para apresentar produtos', duration: 22, type: 'video' },
        { title: 'Identificando necessidades', description: 'Desenvolva habilidades para identificar necessidades reais', duration: 16, type: 'video' },
        { title: 'Cases de sucesso', description: 'Conheça cases reais de vendas bem-sucedidas', duration: 18, type: 'video' },
        { title: 'Aumentando conversão', description: 'Descubra técnicas comprovadas para aumentar conversão', duration: 20, type: 'video' },
      ],
    },
  ],
  // Outros treinamentos podem ser adicionados aqui
};

// ========================================
// COMPONENTE LESSON ITEM
// ========================================

// Props do componente
export interface LessonItemProps {
  item: TrainingContentItem; //...............Dados da aula
  index: number; //....................Indice da aula
  onPress: () => void; //..............Callback ao clicar
  onImagePress?: () => void; //........Callback ao clicar na imagem (opcional)
  styles: any; //......................Estilos do componente
}

export const LessonItemComponent: React.FC<LessonItemProps> = ({
  item,
  index,
  onPress,
  onImagePress,
  styles,
}) => {
  // Formata numero da aula com 2 digitos
  const lessonNumber = String(index + 1).padStart(2, '0');

  // Determina cor do indicador de status baseado no estado de conclusao
  const getStatusColor = () => {
    if (item.completed) {
      return COLORS.primary;
    }
    return COLORS.textSecondary;
  };

  // Calcula porcentagem da aula baseado no status
  const getLessonProgress = () => {
    if (item.completed) {
      return '100%';
    }
    // Retorna sempre com 2 digitos (00%, 25%, 50%, etc.)
    // Por enquanto so temos 0% ou 100%, mas mantemos padrao para futuro
    return '00%';
  };

  return (
    <View style={styles.lessonCard}>
      {/* Container do Numero da Aula - Clicavel se houver onImagePress */}
      {onImagePress ? (
        <TouchableOpacity
          style={styles.lessonNumberContainer}
          onPress={onImagePress}
          activeOpacity={0.7}
        >
          <Text style={styles.lessonNumberText}>
            {lessonNumber}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.lessonNumberContainer}>
          <Text style={styles.lessonNumberText}>
            {lessonNumber}
          </Text>
        </View>
      )}

      {/* Container de Informacoes - Clicavel */}
      <TouchableOpacity
        style={styles.lessonInfoContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* Titulo da Aula */}
        <Text style={styles.lessonTitle} numberOfLines={1}>
          {item.title}
        </Text>

        {/* Divisoria */}
        <View style={styles.lessonDivider} />

        {/* Linha de Execucao */}
        <View style={styles.lessonExecutionRow}>
          {/* Icone e Duracao */}
          <View style={styles.lessonDurationContainer}>
            {/* Icone do Tipo */}
            {getContentTypeIcon(item.type, COLORS.textSecondary)}

            {/* Duracao */}
            {item.duration && (
              <Text style={styles.lessonDuration}>
                {formatDuration(item.duration)}
              </Text>
            )}
          </View>

          {/* Porcentagem */}
          <Text style={[styles.lessonProgress, { color: getStatusColor() }]}>
            {getLessonProgress()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
