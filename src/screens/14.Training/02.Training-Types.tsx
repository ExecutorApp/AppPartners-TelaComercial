import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { Svg, Path, Circle, Rect, G, Defs, ClipPath } from 'react-native-svg';

// ========================================
// CORES DO TEMA
// ========================================

export const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  background: '#F4F4F4', //.....Cor de fundo
  white: '#FFFFFF', //..........Cor branca
  border: '#E8E8E8', //.........Cor da borda
  success: '#1B883C', //........Cor de sucesso (verde)
  warning: '#F5A623', //........Cor de alerta (amarelo)
  red: '#E53935', //............Cor de erro (vermelho)
};

// ========================================
// STATUS DO TREINAMENTO
// ========================================

export type TrainingStatus =
  | 'not_started' //..Nao iniciado
  | 'in_progress' //..Em andamento
  | 'completed'; //....Concluido

// ========================================
// TIPO DE CONTEUDO
// ========================================

export type ContentType =
  | 'video' //.......Video explicativo
  | 'text' //........Texto orientativo
  | 'checklist' //...Checklist pratico
  | 'material' //....Material de apoio
  | 'tip'; //.........Dica rapida

// ========================================
// CATEGORIAS DE TREINAMENTO
// ========================================

export type TrainingCategory =
  | 'aplicativo' //.....Treinamento do Aplicativo
  | 'produto' //........Treinamento de Produto
  | 'comercial' //.....Treinamento Comercial
  | 'operacional' //....Treinamento Operacional
  | 'desenvolvimento'; //..Desenvolvimento Pessoal

// ========================================
// SUBCATEGORIAS COMERCIAIS
// ========================================

export type CommercialSubcategory =
  | 'prospeccao' //..........Abordagem inicial
  | 'negociacao' //..........Conducao de reunioes
  | 'relacionamento_lead' //..Manutencao de relacionamento
  | 'relacionamento_time'; //..Alinhamento interno

// ========================================
// INTERFACE DO ITEM DE CONTEUDO
// ========================================

export interface TrainingContentItem {
  id: string; //..............ID unico
  type: ContentType; //.......Tipo do conteudo
  title: string; //...........Titulo do conteudo
  duration?: number; //......Duracao em minutos
  url?: string; //............URL do conteudo
  description?: string; //....Descricao do conteudo
  completed: boolean; //......Se foi concluido
}

// ========================================
// INTERFACE DO TREINAMENTO
// ========================================

export interface TrainingItem {
  id: string; //..................ID unico
  title: string; //...............Titulo do treinamento
  category: TrainingCategory; //..Categoria principal
  subcategory?: CommercialSubcategory; //..Subcategoria (comercial)
  description: string; //........Descricao do treinamento
  status: TrainingStatus; //......Status atual
  progress: number; //............Progresso 0-100
  estimatedMinutes: number; //....Duracao estimada
  contents: TrainingContentItem[]; //..Lista de conteudos
  relatedProduct?: string; //.....Produto relacionado
  relatedPhase?: string; //......Fase relacionada
  relatedActivity?: string; //....Atividade relacionada
  thumbnail?: string; //..........URL da thumbnail
}

// ========================================
// INTERFACE DA CATEGORIA
// ========================================

export interface CategoryItem {
  key: TrainingCategory; //......Chave da categoria
  title: string; //..............Titulo da categoria
  description: string; //........Descricao da categoria
  totalCourses: number; //.......Total de cursos
  completedCourses: number; //...Cursos concluidos
}

// ========================================
// STATUS DA AULA
// ========================================

export type LessonStatus =
  | 'not_started' //..Nao iniciada
  | 'in_progress' //..Em andamento
  | 'completed'; //....Concluida

// ========================================
// INTERFACE DA AULA (LESSON)
// ========================================

export interface LessonItem {
  id: string; //................ID unico da aula
  title: string; //.............Titulo da aula
  type: ContentType; //.........Tipo do conteudo
  duration: number; //..........Duracao em minutos
  status: LessonStatus; //.......Status da aula
  completed: boolean; //........Se foi concluida
}

// ========================================
// INTERFACE DO MODULO
// ========================================

export interface ModuleItem {
  id: string; //................ID unico do modulo
  title: string; //.............Titulo do modulo
  description: string; //.......Descricao do modulo
  lessons: LessonItem[]; //.....Lista de aulas
}

// ========================================
// INTERFACE DO PRODUTO
// ========================================

export interface ProductItem {
  id: string; //..................ID unico do produto
  name: string; //................Nome do produto
  description: string; //........Descricao do produto
  image?: ImageSourcePropType; //..Imagem do produto (opcional)
  modules: ModuleItem[]; //.......Lista de modulos
  totalModules: number; //........Total de modulos
  totalLessons: number; //.......Total de aulas
  totalDuration: number; //.......Duracao total em minutos
  completedLessons: number; //....Aulas concluidas
  progress: number; //............Progresso 0-100
}

// ========================================
// LABELS DAS CATEGORIAS
// ========================================

export const CATEGORY_LABELS: Record<TrainingCategory, string> = {
  aplicativo: 'Aplicativo',
  produto: 'Produto',
  comercial: 'Comercial',
  operacional: 'Operacional',
  desenvolvimento: 'Desenvolvimento',
};

// ========================================
// LABELS DAS SUBCATEGORIAS COMERCIAIS
// ========================================

export const COMMERCIAL_SUBCATEGORY_LABELS: Record<CommercialSubcategory, string> = {
  prospeccao: 'Prospecção',
  negociacao: 'Negociação',
  relacionamento_lead: 'Relacionamento com Lead',
  relacionamento_time: 'Relacionamento com Time',
};

// ========================================
// LABELS DOS STATUS
// ========================================

export const STATUS_LABELS: Record<TrainingStatus, string> = {
  not_started: 'Não iniciado',
  in_progress: 'Em andamento',
  completed: 'Concluído',
};

// ========================================
// LABELS DOS STATUS DAS AULAS
// ========================================

export const LESSON_STATUS_LABELS: Record<LessonStatus, string> = {
  not_started: 'Não iniciada',
  in_progress: 'Em andamento',
  completed: 'Concluída',
};

// ========================================
// LABELS DOS TIPOS DE CONTEUDO
// ========================================

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  video: 'Vídeo',
  text: 'Texto',
  checklist: 'Checklist',
  material: 'Material',
  tip: 'Dica',
};

// ========================================
// ICONES SVG
// ========================================

// Tamanho do Icone de Produto (LINHA 217)
const PRODUCT_ICON_SIZE = 28; //..............Tamanho do icone de produto

// Icone de Produto (catalogo/livro)
export const ProductIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg
    width={PRODUCT_ICON_SIZE}
    height={PRODUCT_ICON_SIZE * (15 / 18)}
    viewBox="0 0 18 15"
    fill="none"
  >
    {/* Forma Principal do Catalogo */}
    <Path
      d="M15.9511 2.25854H14.435H12.9903H12.0283V1.24355C12.0283 0.614264 11.515 0.100006 10.8793 0.100006H6.31745C5.68518 0.100006 5.16848 0.610881 5.16848 1.24355V2.25854H4.20648H2.76177H1.24907C0.613395 2.25854 0.100098 2.76941 0.100098 3.3987V12.9565C0.100098 13.5857 0.613395 14.1 1.24907 14.1H2.76516H4.20988H12.9903H14.435H15.9511C16.5834 14.1 17.1001 13.5891 17.1001 12.9565V3.3987C17.0967 2.76941 16.5834 2.25854 15.9511 2.25854ZM5.51182 2.93519H11.6884H12.6504V13.4234H4.54641V2.93519H5.51182ZM5.85175 1.24355C5.85175 0.986424 6.0625 0.776662 6.32085 0.776662H10.8827C11.1411 0.776662 11.3518 0.986424 11.3518 1.24355V2.25854H5.85175V1.24355ZM0.779962 12.9565V3.3987C0.779962 3.14157 0.99072 2.93181 1.24907 2.93181L4.20648 2.93519V8.35864V13.4234L1.24907 13.42C0.99072 13.4234 0.779962 13.2136 0.779962 12.9565ZM4.20648 13.4234V8.35864V2.93519H3.86654V13.4234H4.20648ZM13.3303 13.4234V2.93519H12.9903V13.4234H13.3303ZM16.4168 12.9565C16.4168 13.2136 16.2061 13.4234 15.9477 13.4234H12.9903V2.93519H15.9477C16.2061 2.93519 16.4168 3.14496 16.4168 3.40208V12.9565Z"
      fill={color}
    />
    {/* Contorno do Catalogo */}
    <Path
      d="M4.20648 2.93519L1.24907 2.93181C0.99072 2.93181 0.779962 3.14157 0.779962 3.3987V12.9565C0.779962 13.2136 0.99072 13.4234 1.24907 13.42L4.20648 13.4234M4.20648 2.93519H3.86654V13.4234H4.20648M4.20648 2.93519V8.35864V13.4234M12.9903 2.93519H13.3303V13.4234H12.9903M12.9903 2.93519V13.4234M12.9903 2.93519H15.9477C16.2061 2.93519 16.4168 3.14496 16.4168 3.40208V12.9565C16.4168 13.2136 16.2061 13.4234 15.9477 13.4234H12.9903M15.9511 2.25854H14.435H12.9903H12.0283V1.24355C12.0283 0.614264 11.515 0.100006 10.8793 0.100006H6.31745C5.68518 0.100006 5.16848 0.610881 5.16848 1.24355V2.25854H4.20648H2.76177H1.24907C0.613395 2.25854 0.100098 2.76941 0.100098 3.3987V12.9565C0.100098 13.5857 0.613395 14.1 1.24907 14.1H2.76516H4.20988H12.9903H14.435H15.9511C16.5834 14.1 17.1001 13.5891 17.1001 12.9565V3.3987C17.0967 2.76941 16.5834 2.25854 15.9511 2.25854ZM5.51182 2.93519H11.6884H12.6504V13.4234H4.54641V2.93519H5.51182ZM5.85175 1.24355C5.85175 0.986424 6.0625 0.776662 6.32085 0.776662H10.8827C11.1411 0.776662 11.3518 0.986424 11.3518 1.24355V2.25854H5.85175V1.24355Z"
      stroke={color}
      strokeWidth={0.2}
    />
  </Svg>
);

// Icone Operacional (engrenagem)
export const OperationalIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={3}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Comercial (grafico)
export const CommercialIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 20V10M12 20V4M6 20v-6"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Sistema (monitor)
export const SystemIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Rect
      x={2}
      y={3}
      width={20}
      height={14}
      rx={2}
      ry={2}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M8 21h8M12 17v4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tamanho do Icone de Desenvolvimento (LINHA 298)
const DEVELOPMENT_ICON_SIZE = 35; //..............Tamanho do icone de desenvolvimento

// Icone Desenvolvimento (cerebro/mente)
export const DevelopmentIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg
    width={DEVELOPMENT_ICON_SIZE}
    height={DEVELOPMENT_ICON_SIZE}
    viewBox="0 0 64 64"
    fill="none"
  >
    {/* Forma Principal do Cerebro */}
    <Path
      d="M57.908 35.427c5.452-6.478-.493-13.499-8.72-20.432-10.35-8.975-23.941-6.181-29.973-2.49-5.83-.28-10.484 5.676-10.979 10.97-5.414 5.895-5.599 10.88-.591 16.123a6.48 6.48 0 0 0 4.68 2.093 18.086 18.086 0 0 0 5.513-1.552 7.48 7.48 0 0 0 3.204 4.066c3.169 1.956 7.395 1.556 9.19 1.07a1.562 1.562 0 0 1 1.399.314 9.634 9.634 0 0 0 4.136 2.099 2.584 2.584 0 0 1 1.632 1.017l4.175 5.978a1.001 1.001 0 0 0 .82.427h3.486a1 1 0 0 0 1-1v-4.074c8.373-1.975 13.84-5.918 10.846-13.428a1.08 1.08 0 0 1 .182-1.18zm-1.883 7.237c-1.279 2.52-4.857 4.452-10.347 5.586a1 1 0 0 0-.798.98v3.88h-1.964l-3.876-5.55c-1.68-2.345-3.654-1.305-6.143-3.52a3.573 3.573 0 0 0-3.189-.695c-2.49.762-8.926.553-10.036-4.103 3.135-1.54 5.217-4.91 3.712-7.49a1 1 0 0 0-1.723 1.015c.97 2.714-2.005 5.027-8.286 6.783a4.34 4.34 0 0 1-4.284-1.334c-3.88-4.064-4.098-7.55-.578-11.994.979 3.635 6.075 4.897 6.442 4.828a1 1 0 0 0 .273-1.981c-4.13-.715-6.832-3.914-3.578-9.688 2.43-4.73 8.38-6.795 12.384-2.55a1 1 0 0 0 1.4-1.428 10.61 10.61 0 0 0-3.2-2.216 24.877 24.877 0 0 1 14.683-1.944c-2.342 2.528-4.678 6.995-2.148 11.867a1 1 0 0 0 1.775-.922c-2.651-5.105 1.398-9.257 2.672-10.388a25.564 25.564 0 0 1 9.328 5.266 5.24 5.24 0 0 1-3.854 3.778 1 1 0 0 0 .522 1.93 7.128 7.128 0 0 0 4.964-4.3c4.965 4.448 7.589 8.278 7.81 11.406a5.396 5.396 0 0 1-1.55 4.194 3.075 3.075 0 0 0-.53 3.363 5.964 5.964 0 0 1 .12 5.227z"
      fill={color}
    />
    {/* Detalhes Internos */}
    <Path
      d="M32.327 28.607a1 1 0 0 0-.314-1.976 3.805 3.805 0 0 1-2.987-.562 4.5 4.5 0 0 1-1.507-2.475 8.618 8.618 0 0 0 1.658-2.89 1 1 0 0 0-1.913-.581 6.098 6.098 0 0 1-2.71 3.305 5.478 5.478 0 0 1-4.38-.004 1 1 0 0 0-.674 1.883 7.396 7.396 0 0 0 5.97-.1c.138-.07 1.324 1.684 2.342 2.45a5.8 5.8 0 0 0 4.515.95zM42.269 34.692c1.552-2.87 2.318-8.175-1.987-10.092a1 1 0 0 0-.886 1.793c3.16 1.32 2.117 5.5 1.06 7.45-4.582-1.477-9.206 1.405-9.404 1.53a1 1 0 0 0 1.074 1.688c.04-.026 4.094-2.566 7.833-1.283 2.234.768 3.95 2.787 5.095 6.003a1 1 0 1 0 1.884-.672 11.886 11.886 0 0 0-4.669-6.417zM52.28 27.69l-4.066.93a1.002 1.002 0 0 0 .222 1.974.975.975 0 0 0 .223-.025l4.067-.93a1 1 0 0 0-.446-1.95z"
      fill={color}
    />
  </Svg>
);

// Icone Video (play)
export const VideoIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 3l14 9-14 9V3z"
      fill={color}
    />
  </Svg>
);

// Icone Texto (documento)
export const TextIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Checklist (lista)
export const ChecklistIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 11l3 3L22 4"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Tempo (relogio)
export const TimeIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={10}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Check (concluido)
export const CheckIcon = ({ color = COLORS.success }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 6L9 17l-5-5"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta Voltar
export const BackIcon = ({ color = COLORS.textPrimary }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 12H5M12 19l-7-7 7-7"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Tamanho do Icone de Aplicativo
const APP_ICON_SIZE = 35; //..............Tamanho do icone de aplicativo

// Espacamento entre Quadrados do Icone (LINHA 392)
const APP_ICON_GAP = 2.5; //.................Espacamento entre os quadrados

// Icone Aplicativo (grid de quadrados)
export const AppIcon = ({ color = COLORS.primary }: { color?: string }) => {
  // Calcula posicoes baseado no gap
  const margin = 3; //....................Margem externa
  const squareSize = (24 - 2 * margin - APP_ICON_GAP) / 2; //..Tamanho do quadrado
  const secondPos = margin + squareSize + APP_ICON_GAP; //......Posicao do segundo quadrado

  return (
    <Svg width={APP_ICON_SIZE} height={APP_ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <G>
        {/* Quadrado Superior Esquerdo */}
        <Rect
          x={margin}
          y={margin}
          width={squareSize}
          height={squareSize}
          rx={2}
          stroke={color}
          strokeWidth={1}
          fill="none"
        />
        {/* Quadrado Superior Direito */}
        <Rect
          x={secondPos}
          y={margin}
          width={squareSize}
          height={squareSize}
          rx={2}
          stroke={color}
          strokeWidth={1}
          fill="none"
        />
        {/* Quadrado Inferior Esquerdo */}
        <Rect
          x={margin}
          y={secondPos}
          width={squareSize}
          height={squareSize}
          rx={2}
          stroke={color}
          strokeWidth={1}
          fill="none"
        />
        {/* Quadrado Inferior Direito (Solido) */}
        <Rect
          x={secondPos}
          y={secondPos}
          width={squareSize}
          height={squareSize}
          rx={1}
          fill={color}
        />
      </G>
    </Svg>
  );
};

// ========================================
// FUNCAO PARA OBTER ICONE DA CATEGORIA
// ========================================

export const getCategoryIcon = (category: TrainingCategory, color?: string) => {
  switch (category) {
    case 'aplicativo':
      return <AppIcon color={color} />;
    case 'produto':
      return <ProductIcon color={color} />;
    case 'comercial':
      return <CommercialIcon color={color} />;
    case 'operacional':
      return <OperationalIcon color={color} />;
    case 'desenvolvimento':
      return <DevelopmentIcon color={color} />;
    default:
      return <ProductIcon color={color} />;
  }
};

// ========================================
// FUNCAO PARA OBTER ICONE DO TIPO DE CONTEUDO
// ========================================

export const getContentTypeIcon = (type: ContentType, color?: string) => {
  switch (type) {
    case 'video':
      return <VideoIcon color={color} />;
    case 'text':
    case 'material':
      return <TextIcon color={color} />;
    case 'checklist':
    case 'tip':
      return <ChecklistIcon color={color} />;
    default:
      return <TextIcon color={color} />;
  }
};

// ========================================
// MOCK DATA - CATEGORIAS
// ========================================

export const MOCK_CATEGORIES: CategoryItem[] = [
  {
    key: 'aplicativo',
    title: 'Aplicativo',
    description: 'Uso completo do aplicativo',
    totalCourses: 11,
    completedCourses: 2,
  },
  {
    key: 'produto',
    title: 'Produto',
    description: 'Conheca os produtos vendidos e entregues',
    totalCourses: 12,
    completedCourses: 4,
  },
  {
    key: 'comercial',
    title: 'Comercial',
    description: 'Performance comercial do Partner',
    totalCourses: 15,
    completedCourses: 6,
  },
  {
    key: 'operacional',
    title: 'Operacional',
    description: 'Como executar atividades corretamente',
    totalCourses: 8,
    completedCourses: 2,
  },
  {
    key: 'desenvolvimento',
    title: 'Desenvolvimento',
    description: 'Evolucao pessoal e profissional',
    totalCourses: 6,
    completedCourses: 1,
  },
];

// ========================================
// MOCK DATA - TREINAMENTOS
// ========================================

export const MOCK_TRAININGS: TrainingItem[] = [
  // Treinamentos de Produto
  {
    id: '1',
    title: 'Introdução ao Consórcio Premium',
    category: 'produto',
    description: 'Visão geral completa do produto Consórcio Premium, incluindo benefícios, diferenciais e expectativas do cliente.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 30,
    relatedProduct: 'Consórcio Premium',
    contents: [
      { id: '1-1', type: 'video', title: 'Visão geral do produto', duration: 10, completed: true },
      { id: '1-2', type: 'text', title: 'Benefícios e diferenciais', duration: 8, completed: true },
      { id: '1-3', type: 'checklist', title: 'Pontos-chave para apresentação', duration: 5, completed: true },
      { id: '1-4', type: 'tip', title: 'Dicas de abordagem', duration: 7, completed: true },
    ],
  },
  {
    id: '2',
    title: 'Holding Patrimonial - Planejamento',
    category: 'produto',
    description: 'Entenda a fase de planejamento da Holding Patrimonial e como conduzir reuniões estratégicas.',
    status: 'in_progress',
    progress: 45,
    estimatedMinutes: 45,
    relatedProduct: 'Holding Patrimonial',
    relatedPhase: 'Planejamento',
    contents: [
      { id: '2-1', type: 'video', title: 'Objetivo da Holding', duration: 12, completed: true },
      { id: '2-2', type: 'video', title: 'Reunião estratégica', duration: 15, completed: true },
      { id: '2-3', type: 'text', title: 'O que abordar na reunião', duration: 8, completed: false },
      { id: '2-4', type: 'checklist', title: 'Erros comuns a evitar', duration: 10, completed: false },
    ],
  },
  // Treinamentos Comerciais - 01. Técnicas de Prospecção
  {
    id: 'com-01',
    title: 'Técnicas de Prospecção',
    category: 'comercial',
    subcategory: 'prospeccao',
    description: 'Aprenda abordagens eficazes para prospectar novos clientes por diversos canais de comunicação.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 35,
    contents: [
      { id: 'com-01-1', type: 'video', title: 'Fundamentos da prospecção', duration: 8, completed: true },
      { id: 'com-01-2', type: 'video', title: 'Canais de prospecção', duration: 10, completed: true },
      { id: 'com-01-3', type: 'text', title: 'Scripts e abordagens', duration: 10, completed: true },
      { id: 'com-01-4', type: 'checklist', title: 'Checklist de prospecção', duration: 7, completed: true },
    ],
  },
  // Treinamentos Comerciais - 02. Qualificação de Leads
  {
    id: 'com-02',
    title: 'Qualificação de Leads',
    category: 'comercial',
    subcategory: 'prospeccao',
    description: 'Identifique e qualifique leads com potencial real de conversão usando técnicas comprovadas.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 30,
    contents: [
      { id: 'com-02-1', type: 'video', title: 'O que é qualificação', duration: 6, completed: true },
      { id: 'com-02-2', type: 'video', title: 'Critérios de qualificação', duration: 8, completed: true },
      { id: 'com-02-3', type: 'text', title: 'Perguntas estratégicas', duration: 8, completed: true },
      { id: 'com-02-4', type: 'tip', title: 'Dicas de identificação', duration: 8, completed: true },
    ],
  },
  // Treinamentos Comerciais - 03. Abordagem por Indicação
  {
    id: 'com-03',
    title: 'Abordagem por Indicação',
    category: 'comercial',
    subcategory: 'prospeccao',
    description: 'Aprenda a gerar e trabalhar indicações de clientes satisfeitos para expandir sua carteira.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 25,
    contents: [
      { id: 'com-03-1', type: 'video', title: 'Poder das indicações', duration: 6, completed: true },
      { id: 'com-03-2', type: 'video', title: 'Como pedir indicações', duration: 7, completed: true },
      { id: 'com-03-3', type: 'text', title: 'Abordando indicados', duration: 6, completed: true },
      { id: 'com-03-4', type: 'checklist', title: 'Processo de indicação', duration: 6, completed: true },
    ],
  },
  // Treinamentos Comerciais - 04. Comunicação Comercial
  {
    id: 'com-04',
    title: 'Comunicação Comercial',
    category: 'comercial',
    subcategory: 'relacionamento_lead',
    description: 'Domine técnicas de comunicação verbal e escrita para se conectar melhor com clientes.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 40,
    contents: [
      { id: 'com-04-1', type: 'video', title: 'Comunicação eficaz', duration: 10, completed: true },
      { id: 'com-04-2', type: 'video', title: 'Linguagem persuasiva', duration: 12, completed: true },
      { id: 'com-04-3', type: 'text', title: 'Escrita comercial', duration: 10, completed: true },
      { id: 'com-04-4', type: 'tip', title: 'Dicas de comunicação', duration: 8, completed: true },
    ],
  },
  // Treinamentos Comerciais - 05. Rapport e Conexão
  {
    id: 'com-05',
    title: 'Rapport e Conexão',
    category: 'comercial',
    subcategory: 'relacionamento_lead',
    description: 'Construa conexões genuínas com clientes através de técnicas de rapport e empatia.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 30,
    contents: [
      { id: 'com-05-1', type: 'video', title: 'O que é rapport', duration: 7, completed: true },
      { id: 'com-05-2', type: 'video', title: 'Técnicas de espelhamento', duration: 8, completed: true },
      { id: 'com-05-3', type: 'text', title: 'Escuta ativa', duration: 8, completed: true },
      { id: 'com-05-4', type: 'checklist', title: 'Checklist de conexão', duration: 7, completed: true },
    ],
  },
  // Treinamentos Comerciais - 06. Follow-up Estratégico
  {
    id: 'com-06',
    title: 'Follow-up Estratégico',
    category: 'comercial',
    subcategory: 'relacionamento_lead',
    description: 'Aprenda a fazer follow-up eficiente sem ser invasivo, mantendo o lead engajado.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 28,
    contents: [
      { id: 'com-06-1', type: 'video', title: 'Importância do follow-up', duration: 6, completed: true },
      { id: 'com-06-2', type: 'video', title: 'Frequência e timing', duration: 8, completed: true },
      { id: 'com-06-3', type: 'text', title: 'Modelos de mensagens', duration: 8, completed: true },
      { id: 'com-06-4', type: 'tip', title: 'Dicas de persistência', duration: 6, completed: true },
    ],
  },
  // Treinamentos Comerciais - 07. Negociação e Fechamento
  {
    id: 'com-07',
    title: 'Negociação e Fechamento',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Domine técnicas de negociação e fechamento para converter mais propostas em vendas.',
    status: 'in_progress',
    progress: 50,
    estimatedMinutes: 45,
    contents: [
      { id: 'com-07-1', type: 'video', title: 'Fundamentos da negociação', duration: 10, completed: true },
      { id: 'com-07-2', type: 'video', title: 'Técnicas de fechamento', duration: 12, completed: true },
      { id: 'com-07-3', type: 'text', title: 'Sinais de compra', duration: 12, completed: false },
      { id: 'com-07-4', type: 'checklist', title: 'Checklist de fechamento', duration: 11, completed: false },
    ],
  },
  // Treinamentos Comerciais - 08. Tratamento de Objeções
  {
    id: 'com-08',
    title: 'Tratamento de Objeções',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Aprenda a identificar, entender e contornar as principais objeções dos clientes.',
    status: 'in_progress',
    progress: 25,
    estimatedMinutes: 40,
    contents: [
      { id: 'com-08-1', type: 'video', title: 'Tipos de objeções', duration: 10, completed: true },
      { id: 'com-08-2', type: 'video', title: 'Técnica do espelho', duration: 10, completed: false },
      { id: 'com-08-3', type: 'text', title: 'Respostas para objeções', duration: 12, completed: false },
      { id: 'com-08-4', type: 'tip', title: 'Dicas de contorno', duration: 8, completed: false },
    ],
  },
  // Treinamentos Comerciais - 09. Técnicas de Urgência
  {
    id: 'com-09',
    title: 'Técnicas de Urgência',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Use técnicas éticas de urgência e escassez para acelerar a decisão do cliente.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 25,
    contents: [
      { id: 'com-09-1', type: 'video', title: 'Urgência vs manipulação', duration: 6, completed: false },
      { id: 'com-09-2', type: 'video', title: 'Gatilhos mentais', duration: 7, completed: false },
      { id: 'com-09-3', type: 'text', title: 'Escassez real', duration: 6, completed: false },
      { id: 'com-09-4', type: 'checklist', title: 'Aplicação ética', duration: 6, completed: false },
    ],
  },
  // Treinamentos Comerciais - 10. Apresentação de Propostas
  {
    id: 'com-10',
    title: 'Apresentação de Propostas',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Aprenda a estruturar e apresentar propostas comerciais que convertem.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: 'com-10-1', type: 'video', title: 'Estrutura da proposta', duration: 8, completed: false },
      { id: 'com-10-2', type: 'video', title: 'Apresentação visual', duration: 10, completed: false },
      { id: 'com-10-3', type: 'text', title: 'Precificação estratégica', duration: 10, completed: false },
      { id: 'com-10-4', type: 'tip', title: 'Dicas de apresentação', duration: 7, completed: false },
    ],
  },
  // Treinamentos Comerciais - 11. Reuniões de Vendas
  {
    id: 'com-11',
    title: 'Reuniões de Vendas',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Conduza reuniões de vendas presenciais e online com maestria e resultados.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 40,
    contents: [
      { id: 'com-11-1', type: 'video', title: 'Preparação da reunião', duration: 10, completed: false },
      { id: 'com-11-2', type: 'video', title: 'Condução presencial', duration: 10, completed: false },
      { id: 'com-11-3', type: 'video', title: 'Reuniões online', duration: 10, completed: false },
      { id: 'com-11-4', type: 'checklist', title: 'Checklist de reunião', duration: 10, completed: false },
    ],
  },
  // Treinamentos Comerciais - 12. Fechamento Consultivo
  {
    id: 'com-12',
    title: 'Fechamento Consultivo',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Aprenda a fechar vendas através de uma abordagem consultiva focada no cliente.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: 'com-12-1', type: 'video', title: 'Venda consultiva', duration: 8, completed: false },
      { id: 'com-12-2', type: 'video', title: 'Diagnóstico do cliente', duration: 10, completed: false },
      { id: 'com-12-3', type: 'text', title: 'Solução personalizada', duration: 10, completed: false },
      { id: 'com-12-4', type: 'tip', title: 'Dicas de consultoria', duration: 7, completed: false },
    ],
  },
  // Treinamentos Comerciais - 13. Pós-venda e Acompanhamento
  {
    id: 'com-13',
    title: 'Pós-venda e Acompanhamento',
    category: 'comercial',
    subcategory: 'relacionamento_lead',
    description: 'Fidelize clientes através de um pós-venda estruturado e acompanhamento contínuo.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 30,
    contents: [
      { id: 'com-13-1', type: 'video', title: 'Importância do pós-venda', duration: 7, completed: false },
      { id: 'com-13-2', type: 'video', title: 'Processo de onboarding', duration: 8, completed: false },
      { id: 'com-13-3', type: 'text', title: 'Acompanhamento contínuo', duration: 8, completed: false },
      { id: 'com-13-4', type: 'checklist', title: 'Checklist pós-venda', duration: 7, completed: false },
    ],
  },
  // Treinamentos Comerciais - 14. Upsell e Cross-sell
  {
    id: 'com-14',
    title: 'Upsell e Cross-sell',
    category: 'comercial',
    subcategory: 'negociacao',
    description: 'Aumente o ticket médio através de técnicas de upsell e cross-sell com clientes ativos.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 28,
    contents: [
      { id: 'com-14-1', type: 'video', title: 'Diferença upsell vs cross-sell', duration: 6, completed: false },
      { id: 'com-14-2', type: 'video', title: 'Identificando oportunidades', duration: 8, completed: false },
      { id: 'com-14-3', type: 'text', title: 'Abordagem natural', duration: 8, completed: false },
      { id: 'com-14-4', type: 'tip', title: 'Dicas de expansão', duration: 6, completed: false },
    ],
  },
  // Treinamentos Comerciais - 15. Construção de Carteira
  {
    id: 'com-15',
    title: 'Construção de Carteira',
    category: 'comercial',
    subcategory: 'relacionamento_time',
    description: 'Estratégias para construir e manter uma carteira de clientes sólida e rentável.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: 'com-15-1', type: 'video', title: 'Gestão de carteira', duration: 8, completed: false },
      { id: 'com-15-2', type: 'video', title: 'Segmentação de clientes', duration: 10, completed: false },
      { id: 'com-15-3', type: 'text', title: 'Estratégias de retenção', duration: 10, completed: false },
      { id: 'com-15-4', type: 'checklist', title: 'Checklist de carteira', duration: 7, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 01. Perfil
  {
    id: 'app-01',
    title: 'Perfil',
    category: 'aplicativo',
    description: 'Aprenda tudo sobre a área de perfil do usuário: como editar informações, atualizar foto e gerenciar dados pessoais.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 15,
    contents: [
      { id: 'app-01-1', type: 'video', title: 'Visão geral do perfil', duration: 4, completed: true },
      { id: 'app-01-2', type: 'video', title: 'Editando informações pessoais', duration: 5, completed: true },
      { id: 'app-01-3', type: 'text', title: 'Atualizando foto e dados', duration: 3, completed: true },
      { id: 'app-01-4', type: 'tip', title: 'Dicas de uso', duration: 3, completed: true },
    ],
  },
  // Treinamentos do Aplicativo - 02. Dashboard
  {
    id: 'app-02',
    title: 'Dashboard',
    category: 'aplicativo',
    description: 'Entenda como usar o dashboard para acompanhar seus indicadores, metas e desempenho comercial.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 20,
    contents: [
      { id: 'app-02-1', type: 'video', title: 'Visão geral do dashboard', duration: 5, completed: true },
      { id: 'app-02-2', type: 'video', title: 'Indicadores e métricas', duration: 6, completed: true },
      { id: 'app-02-3', type: 'text', title: 'Interpretando os dados', duration: 5, completed: true },
      { id: 'app-02-4', type: 'checklist', title: 'Checklist de acompanhamento', duration: 4, completed: true },
    ],
  },
  // Treinamentos do Aplicativo - 03. Compromissos
  {
    id: 'app-03',
    title: 'Compromissos',
    category: 'aplicativo',
    description: 'Aprenda a gerenciar seus compromissos: criar, editar, filtrar e acompanhar todas as suas atividades.',
    status: 'in_progress',
    progress: 50,
    estimatedMinutes: 25,
    contents: [
      { id: 'app-03-1', type: 'video', title: 'Criando compromissos', duration: 6, completed: true },
      { id: 'app-03-2', type: 'video', title: 'Tipos de compromissos', duration: 7, completed: true },
      { id: 'app-03-3', type: 'text', title: 'Filtros e visualizações', duration: 6, completed: false },
      { id: 'app-03-4', type: 'checklist', title: 'Boas práticas de gestão', duration: 6, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 04. Produtos
  {
    id: 'app-04',
    title: 'Produtos',
    category: 'aplicativo',
    description: 'Conheça a tela de produtos: como visualizar o catálogo, detalhes e informações de cada produto.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 18,
    contents: [
      { id: 'app-04-1', type: 'video', title: 'Navegando pelo catálogo', duration: 5, completed: false },
      { id: 'app-04-2', type: 'video', title: 'Detalhes do produto', duration: 5, completed: false },
      { id: 'app-04-3', type: 'text', title: 'Informações e materiais', duration: 4, completed: false },
      { id: 'app-04-4', type: 'tip', title: 'Dicas de apresentação', duration: 4, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 05. Keymans
  {
    id: 'app-05',
    title: 'Keymans',
    category: 'aplicativo',
    description: 'Entenda como funciona a tela de Keymans: cadastro, gestão e acompanhamento de parceiros estratégicos.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 20,
    contents: [
      { id: 'app-05-1', type: 'video', title: 'O que são Keymans', duration: 5, completed: false },
      { id: 'app-05-2', type: 'video', title: 'Cadastrando Keymans', duration: 6, completed: false },
      { id: 'app-05-3', type: 'text', title: 'Gestão de relacionamento', duration: 5, completed: false },
      { id: 'app-05-4', type: 'checklist', title: 'Checklist de cadastro', duration: 4, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 06. Clientes
  {
    id: 'app-06',
    title: 'Clientes',
    category: 'aplicativo',
    description: 'Aprenda a usar a tela de clientes: cadastro, busca, filtros e gestão completa da carteira.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 30,
    contents: [
      { id: 'app-06-1', type: 'video', title: 'Cadastrando clientes', duration: 8, completed: false },
      { id: 'app-06-2', type: 'video', title: 'Buscando e filtrando', duration: 7, completed: false },
      { id: 'app-06-3', type: 'text', title: 'Detalhes do cliente', duration: 8, completed: false },
      { id: 'app-06-4', type: 'checklist', title: 'Gestão da carteira', duration: 7, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 07. Agenda
  {
    id: 'app-07',
    title: 'Agenda',
    category: 'aplicativo',
    description: 'Domine a agenda do aplicativo: visualização por dia, semana, mês e sincronização de eventos.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 22,
    contents: [
      { id: 'app-07-1', type: 'video', title: 'Visão geral da agenda', duration: 5, completed: false },
      { id: 'app-07-2', type: 'video', title: 'Criando eventos', duration: 6, completed: false },
      { id: 'app-07-3', type: 'text', title: 'Visualizações e filtros', duration: 6, completed: false },
      { id: 'app-07-4', type: 'tip', title: 'Dicas de organização', duration: 5, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 08. Vendas
  {
    id: 'app-08',
    title: 'Vendas',
    category: 'aplicativo',
    description: 'Conheça o módulo de vendas: funil, pipeline, propostas e acompanhamento de negociações.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: 'app-08-1', type: 'video', title: 'Visão geral de vendas', duration: 8, completed: false },
      { id: 'app-08-2', type: 'video', title: 'Funil e pipeline', duration: 10, completed: false },
      { id: 'app-08-3', type: 'text', title: 'Criando propostas', duration: 9, completed: false },
      { id: 'app-08-4', type: 'checklist', title: 'Acompanhamento de vendas', duration: 8, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 09. Comissões
  {
    id: 'app-09',
    title: 'Comissões',
    category: 'aplicativo',
    description: 'Entenda como acompanhar suas comissões: histórico, previsões e detalhamento de valores.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 18,
    contents: [
      { id: 'app-09-1', type: 'video', title: 'Visão geral de comissões', duration: 5, completed: false },
      { id: 'app-09-2', type: 'video', title: 'Histórico e extratos', duration: 5, completed: false },
      { id: 'app-09-3', type: 'text', title: 'Previsões e cálculos', duration: 4, completed: false },
      { id: 'app-09-4', type: 'tip', title: 'Dicas de acompanhamento', duration: 4, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 10. Treinamentos
  {
    id: 'app-10',
    title: 'Treinamentos',
    category: 'aplicativo',
    description: 'Aprenda a usar a área de treinamentos: categorias, cursos, progresso e certificações.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 15,
    contents: [
      { id: 'app-10-1', type: 'video', title: 'Navegando pelos treinamentos', duration: 4, completed: false },
      { id: 'app-10-2', type: 'video', title: 'Acompanhando progresso', duration: 4, completed: false },
      { id: 'app-10-3', type: 'text', title: 'Categorias e cursos', duration: 4, completed: false },
      { id: 'app-10-4', type: 'tip', title: 'Dicas de aprendizado', duration: 3, completed: false },
    ],
  },
  // Treinamentos do Aplicativo - 11. Configurações
  {
    id: 'app-11',
    title: 'Configurações',
    category: 'aplicativo',
    description: 'Domine as configurações do aplicativo: notificações, preferências, segurança e personalização.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 20,
    contents: [
      { id: 'app-11-1', type: 'video', title: 'Visão geral das configurações', duration: 5, completed: false },
      { id: 'app-11-2', type: 'video', title: 'Notificações e alertas', duration: 5, completed: false },
      { id: 'app-11-3', type: 'text', title: 'Segurança e privacidade', duration: 5, completed: false },
      { id: 'app-11-4', type: 'checklist', title: 'Configurações recomendadas', duration: 5, completed: false },
    ],
  },
  // Treinamentos Operacionais - 01. Execução de Atividades
  {
    id: 'ope-01',
    title: 'Execução de Atividades',
    category: 'operacional',
    description: 'Aprenda a executar corretamente cada tipo de atividade no sistema Partner.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 30,
    contents: [
      { id: 'ope-01-1', type: 'video', title: 'Tipos de atividades', duration: 8, completed: true },
      { id: 'ope-01-2', type: 'video', title: 'Fluxos de execução', duration: 8, completed: true },
      { id: 'ope-01-3', type: 'text', title: 'Registro de informações', duration: 7, completed: true },
      { id: 'ope-01-4', type: 'checklist', title: 'Checklist de execução', duration: 7, completed: true },
    ],
  },
  // Treinamentos Operacionais - 02. Fluxo de Atendimento
  {
    id: 'ope-02',
    title: 'Fluxo de Atendimento',
    category: 'operacional',
    description: 'Domine o fluxo completo de atendimento ao cliente do início ao fim.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 35,
    contents: [
      { id: 'ope-02-1', type: 'video', title: 'Etapas do atendimento', duration: 10, completed: true },
      { id: 'ope-02-2', type: 'video', title: 'Primeiro contato', duration: 8, completed: true },
      { id: 'ope-02-3', type: 'text', title: 'Acompanhamento do processo', duration: 9, completed: true },
      { id: 'ope-02-4', type: 'checklist', title: 'Checklist de atendimento', duration: 8, completed: true },
    ],
  },
  // Treinamentos Operacionais - 03. Registro de Interações
  {
    id: 'ope-03',
    title: 'Registro de Interações',
    category: 'operacional',
    description: 'Aprenda a registrar corretamente todas as interações com clientes e leads.',
    status: 'in_progress',
    progress: 50,
    estimatedMinutes: 25,
    contents: [
      { id: 'ope-03-1', type: 'video', title: 'Importância do registro', duration: 6, completed: true },
      { id: 'ope-03-2', type: 'video', title: 'O que registrar', duration: 7, completed: true },
      { id: 'ope-03-3', type: 'text', title: 'Boas práticas de registro', duration: 6, completed: false },
      { id: 'ope-03-4', type: 'tip', title: 'Dicas de organização', duration: 6, completed: false },
    ],
  },
  // Treinamentos Operacionais - 04. Gestão de Documentos
  {
    id: 'ope-04',
    title: 'Gestão de Documentos',
    category: 'operacional',
    description: 'Organize e gerencie documentos de clientes e processos de forma eficiente.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 28,
    contents: [
      { id: 'ope-04-1', type: 'video', title: 'Tipos de documentos', duration: 7, completed: false },
      { id: 'ope-04-2', type: 'video', title: 'Organização digital', duration: 8, completed: false },
      { id: 'ope-04-3', type: 'text', title: 'Nomenclatura padrão', duration: 6, completed: false },
      { id: 'ope-04-4', type: 'checklist', title: 'Checklist de documentação', duration: 7, completed: false },
    ],
  },
  // Treinamentos Operacionais - 05. Rotina Diária do Partner
  {
    id: 'ope-05',
    title: 'Rotina Diária do Partner',
    category: 'operacional',
    description: 'Estruture sua rotina diária para maximizar resultados como Partner.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 30,
    contents: [
      { id: 'ope-05-1', type: 'video', title: 'Estrutura do dia ideal', duration: 8, completed: false },
      { id: 'ope-05-2', type: 'video', title: 'Priorização de tarefas', duration: 8, completed: false },
      { id: 'ope-05-3', type: 'text', title: 'Blocos de tempo', duration: 7, completed: false },
      { id: 'ope-05-4', type: 'checklist', title: 'Checklist diário', duration: 7, completed: false },
    ],
  },
  // Treinamentos Operacionais - 06. Gestão de Pendências
  {
    id: 'ope-06',
    title: 'Gestão de Pendências',
    category: 'operacional',
    description: 'Aprenda a gerenciar e resolver pendências de forma eficiente e organizada.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 25,
    contents: [
      { id: 'ope-06-1', type: 'video', title: 'Identificando pendências', duration: 6, completed: false },
      { id: 'ope-06-2', type: 'video', title: 'Priorização de pendências', duration: 7, completed: false },
      { id: 'ope-06-3', type: 'text', title: 'Resolução sistemática', duration: 6, completed: false },
      { id: 'ope-06-4', type: 'tip', title: 'Dicas de gestão', duration: 6, completed: false },
    ],
  },
  // Treinamentos Operacionais - 07. Relatórios e Indicadores
  {
    id: 'ope-07',
    title: 'Relatórios e Indicadores',
    category: 'operacional',
    description: 'Entenda e utilize relatórios e indicadores para melhorar seu desempenho.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 32,
    contents: [
      { id: 'ope-07-1', type: 'video', title: 'Principais indicadores', duration: 8, completed: false },
      { id: 'ope-07-2', type: 'video', title: 'Leitura de relatórios', duration: 9, completed: false },
      { id: 'ope-07-3', type: 'text', title: 'Tomada de decisão', duration: 8, completed: false },
      { id: 'ope-07-4', type: 'checklist', title: 'Análise semanal', duration: 7, completed: false },
    ],
  },
  // Treinamentos Operacionais - 08. Boas Práticas Operacionais
  {
    id: 'ope-08',
    title: 'Boas Práticas Operacionais',
    category: 'operacional',
    description: 'Conheça as melhores práticas operacionais para excelência no trabalho.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 28,
    contents: [
      { id: 'ope-08-1', type: 'video', title: 'Padrões de qualidade', duration: 7, completed: false },
      { id: 'ope-08-2', type: 'video', title: 'Erros comuns a evitar', duration: 8, completed: false },
      { id: 'ope-08-3', type: 'text', title: 'Melhoria contínua', duration: 7, completed: false },
      { id: 'ope-08-4', type: 'tip', title: 'Dicas de excelência', duration: 6, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento - 01. Gestão de Tempo
  {
    id: 'dev-01',
    title: 'Gestão de Tempo',
    category: 'desenvolvimento',
    description: 'Domine técnicas de gestão de tempo para aumentar sua produtividade.',
    status: 'completed',
    progress: 100,
    estimatedMinutes: 28,
    contents: [
      { id: 'dev-01-1', type: 'video', title: 'Princípios de gestão de tempo', duration: 7, completed: true },
      { id: 'dev-01-2', type: 'video', title: 'Técnicas práticas', duration: 8, completed: true },
      { id: 'dev-01-3', type: 'text', title: 'Ferramentas de produtividade', duration: 7, completed: true },
      { id: 'dev-01-4', type: 'checklist', title: 'Rotina ideal', duration: 6, completed: true },
    ],
  },
  // Treinamentos de Desenvolvimento - 02. Organização Pessoal
  {
    id: 'dev-02',
    title: 'Organização Pessoal',
    category: 'desenvolvimento',
    description: 'Desenvolva hábitos de organização pessoal para maior eficiência.',
    status: 'in_progress',
    progress: 50,
    estimatedMinutes: 25,
    contents: [
      { id: 'dev-02-1', type: 'video', title: 'Fundamentos da organização', duration: 6, completed: true },
      { id: 'dev-02-2', type: 'video', title: 'Organização digital', duration: 7, completed: true },
      { id: 'dev-02-3', type: 'text', title: 'Ambiente de trabalho', duration: 6, completed: false },
      { id: 'dev-02-4', type: 'tip', title: 'Dicas de organização', duration: 6, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento - 03. Foco e Produtividade
  {
    id: 'dev-03',
    title: 'Foco e Produtividade',
    category: 'desenvolvimento',
    description: 'Aprenda a manter o foco e aumentar sua produtividade no dia a dia.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 30,
    contents: [
      { id: 'dev-03-1', type: 'video', title: 'Ciência do foco', duration: 8, completed: false },
      { id: 'dev-03-2', type: 'video', title: 'Eliminando distrações', duration: 8, completed: false },
      { id: 'dev-03-3', type: 'text', title: 'Técnica Pomodoro', duration: 7, completed: false },
      { id: 'dev-03-4', type: 'checklist', title: 'Checklist de foco', duration: 7, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento - 04. Inteligência Emocional
  {
    id: 'dev-04',
    title: 'Inteligência Emocional',
    category: 'desenvolvimento',
    description: 'Desenvolva sua inteligência emocional para melhores relacionamentos.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 35,
    contents: [
      { id: 'dev-04-1', type: 'video', title: 'O que é inteligência emocional', duration: 8, completed: false },
      { id: 'dev-04-2', type: 'video', title: 'Autoconhecimento', duration: 10, completed: false },
      { id: 'dev-04-3', type: 'text', title: 'Gestão das emoções', duration: 9, completed: false },
      { id: 'dev-04-4', type: 'tip', title: 'Dicas práticas', duration: 8, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento - 05. Comunicação Assertiva
  {
    id: 'dev-05',
    title: 'Comunicação Assertiva',
    category: 'desenvolvimento',
    description: 'Aprenda a se comunicar de forma clara, assertiva e respeitosa.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 32,
    contents: [
      { id: 'dev-05-1', type: 'video', title: 'Fundamentos da assertividade', duration: 8, completed: false },
      { id: 'dev-05-2', type: 'video', title: 'Comunicação não-violenta', duration: 9, completed: false },
      { id: 'dev-05-3', type: 'text', title: 'Expressando opiniões', duration: 8, completed: false },
      { id: 'dev-05-4', type: 'checklist', title: 'Checklist de comunicação', duration: 7, completed: false },
    ],
  },
  // Treinamentos de Desenvolvimento - 06. Mindset de Crescimento
  {
    id: 'dev-06',
    title: 'Mindset de Crescimento',
    category: 'desenvolvimento',
    description: 'Desenvolva uma mentalidade de crescimento para evoluir continuamente.',
    status: 'not_started',
    progress: 0,
    estimatedMinutes: 30,
    contents: [
      { id: 'dev-06-1', type: 'video', title: 'Mindset fixo vs crescimento', duration: 8, completed: false },
      { id: 'dev-06-2', type: 'video', title: 'Aprendendo com erros', duration: 8, completed: false },
      { id: 'dev-06-3', type: 'text', title: 'Desafios como oportunidades', duration: 7, completed: false },
      { id: 'dev-06-4', type: 'tip', title: 'Dicas de desenvolvimento', duration: 7, completed: false },
    ],
  },
];

// ========================================
// MOCK DATA - PRODUTOS
// ========================================

export const MOCK_PRODUCTS: ProductItem[] = [
  // Holding Patrimonial (com imagem)
  {
    id: 'p1',
    name: 'Holding Patrimonial',
    description: 'Estruturação de holding para proteção e gestão de patrimônio familiar',
    image: require('../../../assets/00001.png'),
    totalModules: 3,
    totalLessons: 12,
    totalDuration: 150,
    completedLessons: 5,
    progress: 42,
    modules: [
      {
        id: 'p1-m1',
        title: 'Introdução à Holding',
        description: 'Conceitos básicos e benefícios',
        lessons: [
          { id: 'p1-m1-l1', title: 'O que é uma Holding', type: 'video', duration: 12, status: 'completed', completed: true },
          { id: 'p1-m1-l2', title: 'Benefícios da Holding', type: 'video', duration: 10, status: 'completed', completed: true },
          { id: 'p1-m1-l3', title: 'Tipos de Holding', type: 'text', duration: 8, status: 'completed', completed: true },
          { id: 'p1-m1-l4', title: 'Quiz de fixação', type: 'checklist', duration: 5, status: 'completed', completed: true },
        ],
      },
      {
        id: 'p1-m2',
        title: 'Planejamento Estratégico',
        description: 'Como estruturar a holding do cliente',
        lessons: [
          { id: 'p1-m2-l1', title: 'Análise do patrimônio', type: 'video', duration: 15, status: 'completed', completed: true },
          { id: 'p1-m2-l2', title: 'Definição da estrutura', type: 'video', duration: 12, status: 'in_progress', completed: false },
          { id: 'p1-m2-l3', title: 'Documentação necessária', type: 'text', duration: 10, status: 'not_started', completed: false },
          { id: 'p1-m2-l4', title: 'Checklist de planejamento', type: 'checklist', duration: 8, status: 'not_started', completed: false },
        ],
      },
      {
        id: 'p1-m3',
        title: 'Execução e Manutenção',
        description: 'Processo de constituição e gestão',
        lessons: [
          { id: 'p1-m3-l1', title: 'Constituição da holding', type: 'video', duration: 20, status: 'not_started', completed: false },
          { id: 'p1-m3-l2', title: 'Transferência de bens', type: 'video', duration: 18, status: 'not_started', completed: false },
          { id: 'p1-m3-l3', title: 'Manutenção contábil', type: 'text', duration: 15, status: 'not_started', completed: false },
          { id: 'p1-m3-l4', title: 'Dicas práticas', type: 'tip', duration: 10, status: 'not_started', completed: false },
        ],
      },
    ],
  },
  // Ativos Fundiários (com imagem)
  {
    id: 'p2',
    name: 'Ativos Fundiários',
    description: 'Investimento em terras e propriedades rurais para diversificação patrimonial',
    image: require('../../../assets/00002.png'),
    totalModules: 2,
    totalLessons: 8,
    totalDuration: 90,
    completedLessons: 8,
    progress: 100,
    modules: [
      {
        id: 'p2-m1',
        title: 'Fundamentos de Ativos Fundiários',
        description: 'Conceitos e oportunidades',
        lessons: [
          { id: 'p2-m1-l1', title: 'O que são ativos fundiários', type: 'video', duration: 10, status: 'completed', completed: true },
          { id: 'p2-m1-l2', title: 'Tipos de investimento', type: 'video', duration: 12, status: 'completed', completed: true },
          { id: 'p2-m1-l3', title: 'Análise de mercado', type: 'text', duration: 8, status: 'completed', completed: true },
          { id: 'p2-m1-l4', title: 'Perfil do investidor', type: 'tip', duration: 5, status: 'completed', completed: true },
        ],
      },
      {
        id: 'p2-m2',
        title: 'Estratégias de Investimento',
        description: 'Como apresentar e vender',
        lessons: [
          { id: 'p2-m2-l1', title: 'Abordagem comercial', type: 'video', duration: 15, status: 'completed', completed: true },
          { id: 'p2-m2-l2', title: 'Análise de rentabilidade', type: 'video', duration: 12, status: 'completed', completed: true },
          { id: 'p2-m2-l3', title: 'Due diligence', type: 'text', duration: 10, status: 'completed', completed: true },
          { id: 'p2-m2-l4', title: 'Fechamento de negócios', type: 'checklist', duration: 8, status: 'completed', completed: true },
        ],
      },
    ],
  },
  // Planejamento Tributário (sem imagem - apenas letra)
  {
    id: 'p3',
    name: 'Planejamento Tributário',
    description: 'Estratégias legais para otimização da carga tributária',
    totalModules: 2,
    totalLessons: 7,
    totalDuration: 75,
    completedLessons: 0,
    progress: 0,
    modules: [
      {
        id: 'p3-m1',
        title: 'Fundamentos Tributários',
        description: 'Entendendo o sistema tributário',
        lessons: [
          { id: 'p3-m1-l1', title: 'Sistema tributário brasileiro', type: 'video', duration: 12, status: 'not_started', completed: false },
          { id: 'p3-m1-l2', title: 'Tipos de tributos', type: 'video', duration: 10, status: 'not_started', completed: false },
          { id: 'p3-m1-l3', title: 'Regimes de tributação', type: 'text', duration: 8, status: 'not_started', completed: false },
        ],
      },
      {
        id: 'p3-m2',
        title: 'Estratégias de Planejamento',
        description: 'Técnicas de otimização fiscal',
        lessons: [
          { id: 'p3-m2-l1', title: 'Elisão fiscal', type: 'video', duration: 10, status: 'not_started', completed: false },
          { id: 'p3-m2-l2', title: 'Estruturação societária', type: 'video', duration: 15, status: 'not_started', completed: false },
          { id: 'p3-m2-l3', title: 'Casos práticos', type: 'text', duration: 12, status: 'not_started', completed: false },
          { id: 'p3-m2-l4', title: 'Dicas de apresentação', type: 'tip', duration: 8, status: 'not_started', completed: false },
        ],
      },
    ],
  },
  // Consórcio Contemplado (produto simples - 1 módulo apenas)
  {
    id: 'p4',
    name: 'Consórcio Contemplado',
    description: 'Entenda como funciona e como vender consórcios já contemplados',
    image: undefined,
    totalModules: 1,
    totalLessons: 4,
    totalDuration: 35,
    completedLessons: 2,
    progress: 50,
    modules: [
      {
        id: 'p4-m1',
        title: 'Consórcio Contemplado',
        description: 'Tudo sobre consórcios contemplados',
        lessons: [
          { id: 'p4-m1-l1', title: 'O que é consórcio contemplado', type: 'video', duration: 10, status: 'completed', completed: true },
          { id: 'p4-m1-l2', title: 'Vantagens para o cliente', type: 'video', duration: 8, status: 'completed', completed: true },
          { id: 'p4-m1-l3', title: 'Como apresentar a proposta', type: 'text', duration: 10, status: 'not_started', completed: false },
          { id: 'p4-m1-l4', title: 'Objeções comuns', type: 'tip', duration: 7, status: 'not_started', completed: false },
        ],
      },
    ],
  },
];

// ========================================
// FUNCAO PARA CALCULAR PROGRESSO GERAL
// ========================================

export const calculateOverallProgress = (trainings: TrainingItem[]): number => {
  if (trainings.length === 0) return 0;
  const totalProgress = trainings.reduce((sum, t) => sum + t.progress, 0);
  return Math.round(totalProgress / trainings.length);
};

// ========================================
// FUNCAO PARA CONTAR POR STATUS
// ========================================

export const countByStatus = (trainings: TrainingItem[], status: TrainingStatus): number => {
  return trainings.filter(t => t.status === status).length;
};

// ========================================
// FUNCAO PARA FILTRAR POR CATEGORIA
// ========================================

export const filterByCategory = (
  trainings: TrainingItem[],
  category: TrainingCategory | null
): TrainingItem[] => {
  if (!category) return trainings;
  return trainings.filter(t => t.category === category);
};

// ========================================
// FUNCAO PARA FORMATAR DURACAO
// ========================================

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};
