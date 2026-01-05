import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

// ============================================================================
// TIPOS
// ============================================================================

interface NewSaleSalesContractPDFProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  uri?: string;
  totalPages?: number;
}

// ============================================================================
// CONFIGURAÇÃO DE PÁGINA
// ============================================================================

const PAGE_CONFIG = {
  TOOLBAR_HEIGHT: 45,
  BOTTOM_BAR_HEIGHT: 45,
  PAGINATION_COLUMN_WIDTH: 50,
  // Altura FIXA da página (IMUTÁVEL - não muda com UI)
  PAGE_HEIGHT: 600,
  PAGE_PADDING_TOP: 20,
  PAGE_PADDING_HORIZONTAL: 20,
  PAGE_PADDING_BOTTOM: 10,
  // Área útil: 560px (wrapper 570 - bottomSpacer 10)
  // O bottomSpacer de 10px GARANTE a margem visual no final
  USABLE_HEIGHT: 560,
  SEPARATOR_HEIGHT: 8,
};

// ============================================================================
// ÍCONES
// ============================================================================

// Ícone de fechar (X)
const CloseIcon: React.FC<{ width?: number; height?: number }> = ({ width = 30, height = 30 }) => (
  <Svg width={width} height={height} viewBox="0 0 30 30" fill="none">
    <Rect width={30} height={30} rx={8} fill="#F4F4F4" />
    <Rect width={30} height={30} rx={8} stroke="#EDF2F6" />
    <Path
      d="M21.155 9.24793C20.7959 8.91788 20.2339 8.91729 19.874 9.24657L15 13.7065L10.126 9.24657C9.76609 8.91729 9.20412 8.91788 8.845 9.24793L8.7916 9.297C8.40222 9.65485 8.40289 10.257 8.79307 10.614L13.5863 15L8.79307 19.386C8.40289 19.743 8.40222 20.3451 8.7916 20.703L8.845 20.7521C9.20413 21.0821 9.76609 21.0827 10.126 20.7534L15 16.2935L19.874 20.7534C20.2339 21.0827 20.7959 21.0821 21.155 20.7521L21.2084 20.703C21.5978 20.3451 21.5971 19.743 21.2069 19.386L16.4137 15L21.2069 10.614C21.5971 10.257 21.5978 9.65485 21.2084 9.297L21.155 9.24793Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Ícone seta para cima
const ArrowRectUpIcon: React.FC<{ width?: number; height?: number }> = ({ width = 30, height = 25 }) => (
  <Svg width={width} height={height} viewBox="0 0 30 25" fill="none">
    <Rect x={0.25} y={0.25} width={29.5} height={24.5} rx={3.75} fill="#1777CF" />
    <Rect x={0.25} y={0.25} width={29.5} height={24.5} rx={3.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.7238 16.2208C20.3655 16.6036 19.7958 16.5912 19.4512 16.1931L15 10.9428L10.5488 16.1931C10.2042 16.5912 9.6345 16.6036 9.2762 16.2208C8.91791 15.838 8.90674 15.205 9.25125 14.8069L14.3513 8.80689C14.5209 8.61081 14.7552 8.5 15 8.5C15.2448 8.5 15.4791 8.61081 15.6487 8.80689L20.7487 14.8069C21.0933 15.205 21.0821 15.838 20.7238 16.2208Z"
      fill="#FCFCFC"
    />
  </Svg>
);

// Ícone seta para baixo
const ArrowRectDownIcon: React.FC<{ width?: number; height?: number }> = ({ width = 30, height = 25 }) => (
  <Svg width={width} height={height} viewBox="0 0 30 25" fill="none">
    <Rect x={0.25} y={0.25} width={29.5} height={24.5} rx={3.75} fill="#1777CF" />
    <Rect x={0.25} y={0.25} width={29.5} height={24.5} rx={3.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.7238 8.77917C20.3655 8.39637 19.7958 8.40879 19.4512 8.80689L15 14.0572L10.5488 8.80689C10.2042 8.40879 9.6345 8.39637 9.2762 8.77917C8.91791 9.16196 8.90674 9.795 9.25125 10.1931L14.3513 16.1931C14.5209 16.3892 14.7552 16.5 15 16.5C15.2448 16.5 15.4791 16.3892 15.6487 16.1931L20.7487 10.1931C21.0933 9.795 21.0821 9.16196 20.7238 8.77917Z"
      fill="#FCFCFC"
    />
  </Svg>
);

// ============================================================================
// COMPONENTE: COLUNA DE PAGINAÇÃO
// ============================================================================

interface PaginationColumnProps {
  currentPage: number;
  totalPages: number;
  onPageSelect: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PaginationColumn: React.FC<PaginationColumnProps> = ({
  currentPage,
  totalPages,
  onPageSelect,
  onPreviousPage,
  onNextPage,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const PAGE_ITEM_HEIGHT = 30;
  const PAGE_ITEM_GAP = 6;
  const lastScrolledPageRef = React.useRef<number>(0);

  // Scroll automático para manter a página atual visível
  React.useEffect(() => {
    if (scrollViewRef.current && currentPage > 0 && currentPage !== lastScrolledPageRef.current) {
      lastScrolledPageRef.current = currentPage;
      const offset = (currentPage - 1) * (PAGE_ITEM_HEIGHT + PAGE_ITEM_GAP);
      scrollViewRef.current.scrollTo({ y: Math.max(0, offset - 60), animated: false });
    }
  }, [currentPage]);

  // Gera array de páginas
  const pages = React.useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageSelect = useCallback((page: number) => {
    if (page !== currentPage) {
      onPageSelect(page);
    }
  }, [currentPage, onPageSelect]);

  return (
    <View style={paginationStyles.container}>
      {/* Botão Superior - Página Anterior */}
      <Pressable
        style={[
          paginationStyles.navButton,
          !canGoPrevious && paginationStyles.navButtonDisabled,
        ]}
        onPress={onPreviousPage}
        disabled={!canGoPrevious}
        accessibilityRole="button"
        accessibilityLabel="Página anterior"
      >
        <ArrowRectUpIcon />
      </Pressable>

      {/* Lista de Páginas */}
      <ScrollView
        ref={scrollViewRef}
        style={paginationStyles.pagesList}
        contentContainerStyle={paginationStyles.pagesListContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        {pages.map((page) => {
          const isActive = page === currentPage;
          return (
            <Pressable
              key={page}
              style={[
                paginationStyles.pageItem,
                isActive && paginationStyles.pageItemActive,
              ]}
              onPress={() => handlePageSelect(page)}
              accessibilityRole="button"
              accessibilityLabel={`Ir para página ${page}`}
            >
              <Text
                style={[
                  paginationStyles.pageItemText,
                  isActive && paginationStyles.pageItemTextActive,
                ]}
              >
                {String(page).padStart(2, '0')}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Botão Inferior - Próxima Página */}
      <Pressable
        style={[
          paginationStyles.navButton,
          !canGoNext && paginationStyles.navButtonDisabled,
        ]}
        onPress={onNextPage}
        disabled={!canGoNext}
        accessibilityRole="button"
        accessibilityLabel="Próxima página"
      >
        <ArrowRectDownIcon />
      </Pressable>
    </View>
  );
};

// Estilos da coluna de paginação
const paginationStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: PAGE_CONFIG.PAGINATION_COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  navButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  pagesList: {
    flex: 1,
    width: '100%',
    marginVertical: 6,
  },
  pagesListContent: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  pageItem: {
    width: 30,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageItemActive: {
    backgroundColor: '#1777CF',
    borderColor: '#FCFCFC',
    borderWidth: 1.5,
  },
  pageItemText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  pageItemTextActive: {
    color: '#FCFCFC',
    fontFamily: 'Inter_500Medium',
  },
});

// ============================================================================
// CONTEÚDO DO CONTRATO EM BLOCOS PAGINADOS
// ============================================================================

// Interface para bloco de conteúdo
interface ContentBlock {
  type: 'title' | 'subtitle' | 'text';
  content: string;
  estimatedHeight: number; // Altura estimada em pixels
}

// Blocos de conteúdo do contrato
// Área útil: 560px (wrapper 570 - bottomSpacer 10)
// O bottomSpacer de 10px no final GARANTE a margem visual de 10px
const CONTRACT_BLOCKS: ContentBlock[] = [
  { type: 'title', content: 'Contrato de venda de produto e serviços', estimatedHeight: 45 },
  { type: 'text', content: 'Contrato de venda de produto e serviços', estimatedHeight: 28 },
  { type: 'text', content: 'Vendedora: Lima Neto Advogados, CNPJ nº 12.345.678/0001-99, com sede na Av. Anísio Haddad, 8001 - Jardim Aclimacao, São José do Rio Preto - SP.', estimatedHeight: 80 },
  { type: 'text', content: 'Comprador: João Pedro do Nascimento, CPF nº 123.456.789-00, residente à Rua das Flores, nº 120, São Paulo – SP.', estimatedHeight: 55 },
  { type: 'subtitle', content: '1. Objeto da Venda', estimatedHeight: 42 },
  { type: 'text', content: 'A Vendedora comercializa ao Comprador o produto "Holding Patrimonial", incluindo serviço de Reunião Estratégica e assessoramento inicial para estruturação patrimonial.', estimatedHeight: 80 },
  { type: 'subtitle', content: '2. Tipo de Honorários', estimatedHeight: 42 },
  { type: 'text', content: 'A contratação é realizada na modalidade: Prolabore + Êxito.', estimatedHeight: 28 },
  { type: 'subtitle', content: '3. Valores da Venda', estimatedHeight: 42 },
  { type: 'text', content: '- Prolabore: R$ 800,00\n- Êxito: R$ 5.000,00\n- Descontos: R$ 0,00\n- Total da Venda: R$ 5.800,00', estimatedHeight: 105 },
  { type: 'subtitle', content: '4. Forma de Pagamento', estimatedHeight: 42 },
  { type: 'text', content: 'Prolabore (R$ 800,00 total):\n- Pix: R$ 350,00 — pago em 16/11/2025 às 08:00\n- Cartão de crédito: R$ 250,00 — pago em 16/11/2025 às 08:00\n- Cartão de débito: R$ 200,00 — pago em 16/11/2025 às 08:00', estimatedHeight: 130 },
  { type: 'text', content: 'Êxito:\n- Pix: R$ 5.000,00 — pago em 16/11/2025 às 08:00', estimatedHeight: 55 },
  { type: 'subtitle', content: '5. Data da Venda', estimatedHeight: 42 },
  { type: 'text', content: 'A venda foi realizada em 16/11/2025 às 08:00.', estimatedHeight: 28 },
  { type: 'subtitle', content: '6. Obrigações da Vendedora', estimatedHeight: 42 },
  { type: 'text', content: 'A Vendedora compromete-se a:\n- Entregar o serviço e orientações referentes ao produto Holding Patrimonial.\n- Realizar a Reunião Estratégica conforme contratação.', estimatedHeight: 80 },
  { type: 'subtitle', content: '7. Obrigações do Comprador', estimatedHeight: 42 },
  { type: 'text', content: 'O Comprador compromete-se a:\n- Fornecer informações necessárias para execução dos serviços.\n- Cumprir com os pagamentos estabelecidos.', estimatedHeight: 80 },
  { type: 'subtitle', content: '8. Conclusão da Venda', estimatedHeight: 42 },
  { type: 'text', content: 'A presente venda é considerada concluída mediante pagamento integral e confirmação dos serviços prestados.', estimatedHeight: 55 },
  { type: 'subtitle', content: '9. Foro', estimatedHeight: 42 },
  { type: 'text', content: 'Fica eleito o foro da Comarca de São Paulo – SP para dirimir quaisquer questões relacionadas a este contrato.', estimatedHeight: 55 },
  { type: 'text', content: 'São Paulo, 16 de novembro de 2025.', estimatedHeight: 28 },
  { type: 'text', content: '__________________________________\nJoão Pedro do Nascimento\nComprador', estimatedHeight: 80 },
  { type: 'text', content: '__________________________________\nLima Neto Advogados\nVendedora', estimatedHeight: 80 },
];

// Função que distribui os blocos entre páginas
// IMPORTANTE: A paginação é FIXA e IMUTÁVEL
// O bottomSpacer de 10px no final de cada página GARANTE a margem visual
const paginateContent = (blocks: ContentBlock[]): ContentBlock[][] => {
  const pages: ContentBlock[][] = [];
  let currentPage: ContentBlock[] = [];
  let currentHeight = 0;
  
  // Usa a CONSTANTE USABLE_HEIGHT = 560px
  // Wrapper tem 570px, bottomSpacer usa 10px = margem de 10px garantida
  const usableHeight = PAGE_CONFIG.USABLE_HEIGHT;
  
  blocks.forEach((block) => {
    // Verifica se o bloco cabe na página atual
    if (currentHeight + block.estimatedHeight <= usableHeight) {
      currentPage.push(block);
      currentHeight += block.estimatedHeight;
    } else {
      // Inicia nova página
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }
      currentPage = [block];
      currentHeight = block.estimatedHeight;
    }
  });
  
  // Adiciona última página
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

// Páginas do contrato (calculadas automaticamente)
const CONTRACT_PAGES = paginateContent(CONTRACT_BLOCKS);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const NewSaleSalesContractPDF: React.FC<NewSaleSalesContractPDFProps> = ({
  visible,
  onClose,
  title = 'Contrato de venda de produto e serviços',
  uri,
}) => {
  // Número real de páginas baseado no conteúdo paginado
  const totalPages = CONTRACT_PAGES.length;
  
  // Estado da página atual
  const [currentPage, setCurrentPage] = useState(1);

  // Estado de visibilidade da UI (toggle ao tocar na tela)
  const [isUIVisible, setIsUIVisible] = useState(true);

  // Referência do ScrollView do conteúdo
  const contentScrollRef = useRef<ScrollView>(null);

  // Flag para ignorar eventos de scroll durante navegação programática
  const isScrollingProgrammaticallyRef = useRef(false);

  // Guarda a página selecionada por clique (para não ser sobrescrita pelo scroll)
  const selectedPageRef = useRef<number | null>(null);

  // Constantes de layout
  const PAGE_HEIGHT = PAGE_CONFIG.PAGE_HEIGHT;
  const SEPARATOR_HEIGHT = PAGE_CONFIG.SEPARATOR_HEIGHT;
  const SLOT_SIZE = PAGE_HEIGHT + SEPARATOR_HEIGHT;

  // Calcula a posição Y do TOPO do separador que vem ANTES da página N
  const getPageScrollOffset = useCallback((page: number): number => {
    if (page <= 1) {
      return 0;
    }
    // Página N: PAGE_HEIGHT + (N-2) * SLOT_SIZE
    return PAGE_HEIGHT + (page - 2) * SLOT_SIZE;
  }, [SLOT_SIZE]);

  // Toggle da UI ao tocar na tela
  const handleToggleUI = useCallback(() => {
    setIsUIVisible((prev) => !prev);
  }, []);

  // Handlers de navegação de página
  const handlePageSelect = useCallback((page: number) => {
    // Guarda a página selecionada para persistência
    selectedPageRef.current = page;
    setCurrentPage(page);
    
    if (contentScrollRef.current) {
      isScrollingProgrammaticallyRef.current = true;
      
      const targetOffset = getPageScrollOffset(page);
      
      contentScrollRef.current.scrollTo({ y: targetOffset, animated: true });
      
      // Reseta a flag após a animação do scroll
      // Mas mantém a página selecionada para a última página
      setTimeout(() => {
        isScrollingProgrammaticallyRef.current = false;
        // Para última página, mantém a referência por mais tempo
        if (page === totalPages) {
          setTimeout(() => {
            selectedPageRef.current = null;
          }, 500);
        } else {
          selectedPageRef.current = null;
        }
      }, 600);
    }
  }, [getPageScrollOffset, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageSelect(currentPage - 1);
    }
  }, [currentPage, handlePageSelect]);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageSelect(currentPage + 1);
    }
  }, [currentPage, totalPages, handlePageSelect]);

  // Callback do scroll manual para atualizar a aba ativa
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Ignora durante scroll programático para evitar conflitos
    if (isScrollingProgrammaticallyRef.current) {
      return;
    }
    
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const offsetY = contentOffset.y;
    
    // ========================================
    // CASO ESPECIAL: Fim do scroll (última página)
    // ========================================
    // Se está próximo do fim do conteúdo, força última página
    const distanceFromEnd = contentSize.height - (offsetY + layoutMeasurement.height);
    const isNearEnd = distanceFromEnd < 100; // Threshold de 100px
    
    if (isNearEnd) {
      if (currentPage !== totalPages) {
        setCurrentPage(totalPages);
      }
      return;
    }
    
    // Se há uma página selecionada por clique pendente, respeita ela
    if (selectedPageRef.current !== null) {
      return;
    }
    
    // ========================================
    // CASO NORMAL: Cálculo baseado na posição
    // ========================================
    let detectedPage = 1;
    
    if (offsetY > 0) {
      // A primeira página vai de 0 até PAGE_HEIGHT (600px)
      if (offsetY < PAGE_HEIGHT) {
        detectedPage = 1;
      } else {
        // Após a primeira página, cada "slot" tem SLOT_SIZE (608px)
        // Offset = 600 + (page - 2) * 608
        // Invertendo: page = floor((offset - 600) / 608) + 2
        const offsetAfterFirstPage = offsetY - PAGE_HEIGHT;
        detectedPage = Math.floor(offsetAfterFirstPage / SLOT_SIZE) + 2;
      }
    }
    
    const boundedPage = Math.min(Math.max(detectedPage, 1), totalPages);
    
    if (boundedPage !== currentPage) {
      setCurrentPage(boundedPage);
    }
  }, [currentPage, totalPages, SLOT_SIZE]);

  // Handler do botão fechar
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Formata o indicador de página
  const pageIndicator = `${String(currentPage).padStart(2, '0')}/${String(totalPages).padStart(2, '0')}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Área de Conteúdo - SEMPRE ocupa tela inteira */}
        <View style={styles.contentArea}>
          {/* Conteúdo do PDF paginado */}
          <Pressable style={styles.pdfContainer} onPress={handleToggleUI}>
            <ScrollView
              ref={contentScrollRef}
              style={styles.pdfScrollView}
              contentContainerStyle={[
                styles.pdfScrollContent,
                // Quando UI visível, adiciona padding para descer abaixo das barras
                isUIVisible && {
                  paddingTop: PAGE_CONFIG.TOOLBAR_HEIGHT,
                  paddingBottom: PAGE_CONFIG.BOTTOM_BAR_HEIGHT,
                }
              ]}
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {/* Renderiza páginas com conteúdo distribuído automaticamente */}
              {CONTRACT_PAGES.map((pageBlocks, pageIndex) => (
                <React.Fragment key={pageIndex}>
                  <View style={styles.pageContainer}>
                    <View style={styles.pageContentWrapper}>
                      {/* Renderiza os blocos de conteúdo desta página */}
                      {pageBlocks.map((block, blockIndex) => {
                        if (block.type === 'title') {
                          return (
                            <Text key={blockIndex} style={styles.pageTitle}>
                              {block.content}
                            </Text>
                          );
                        } else if (block.type === 'subtitle') {
                          return (
                            <Text key={blockIndex} style={styles.pageSubtitle}>
                              {block.content}
                            </Text>
                          );
                        } else {
                          return (
                            <Text key={blockIndex} style={styles.pageText}>
                              {block.content}
                            </Text>
                          );
                        }
                      })}
                      {/* Espaçador FIXO de 10px no final - GARANTE a margem inferior */}
                      <View style={styles.bottomSpacer} />
                    </View>
                  </View>
                  {pageIndex < totalPages - 1 && <View style={styles.pageSeparator} />}
                </React.Fragment>
              ))}
            </ScrollView>
          </Pressable>

          {/* Coluna de Paginação - OVERLAY */}
          {isUIVisible && (
            <View style={styles.paginationWrapper}>
              <PaginationColumn
                currentPage={currentPage}
                totalPages={totalPages}
                onPageSelect={handlePageSelect}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </View>
          )}
        </View>

        {/* Barra Superior - OVERLAY absoluto */}
        {isUIVisible && (
          <View style={styles.topBar}>
            <View style={styles.topBarContent}>
              <Text style={styles.topBarTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>
        )}

        {/* Barra Inferior - OVERLAY absoluto */}
        {isUIVisible && (
          <View style={styles.bottomBar}>
            <View style={styles.pageIndicatorContainer}>
              <Text style={styles.pageIndicatorText}>{pageIndicator}</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

// ============================================================================
// ESTILOS
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  topBar: {
    // OVERLAY absoluto no topo
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: PAGE_CONFIG.TOOLBAR_HEIGHT,
    paddingLeft: 15,
    paddingRight: 10,
    backgroundColor: '#1777CF',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  topBarContent: {
    flex: 1,
    justifyContent: 'center',
  },
  topBarTitle: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  closeButton: {
    padding: 4,
  },
  contentArea: {
    // Ocupa TODA a tela - as barras são overlays
    flex: 1,
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  pdfScrollView: {
    flex: 1,
  },
  pdfScrollContent: {
    paddingVertical: 0,
  },
  pageContainer: {
    height: 600,
    backgroundColor: '#FCFCFC',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#91929E',
  },
  pageContentWrapper: {
    // Altura FIXA: 570px (600 - 20 top - 10 bottom)
    // O bottomSpacer dentro garante os 10px de margem visual
    height: 570,
    marginTop: 20,
    marginHorizontal: 20,
  },
  bottomSpacer: {
    // Espaçador FIXO de 10px - GARANTE margem inferior visível
    // Este View vazio força 10px de espaço no final do conteúdo
    height: 10,
    minHeight: 10,
    flexShrink: 0,
  },
  pageTitle: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 10,
  },
  pageSubtitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
    marginBottom: 4,
  },
  pageText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 22,
  },
  pageSeparator: {
    height: 8,
    backgroundColor: '#E0E0E0',
  },
  paginationWrapper: {
    // OVERLAY absoluto à direita
    position: 'absolute',
    top: PAGE_CONFIG.TOOLBAR_HEIGHT,
    right: 0,
    bottom: PAGE_CONFIG.BOTTOM_BAR_HEIGHT,
    width: PAGE_CONFIG.PAGINATION_COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 5,
  },
  bottomBar: {
    // OVERLAY absoluto no fundo
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PAGE_CONFIG.BOTTOM_BAR_HEIGHT,
    paddingLeft: 15,
    paddingRight: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.90)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      default: {
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
      },
    }),
  },
  pageIndicatorContainer: {
    height: 30,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#F4F4F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageIndicatorText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});

export default NewSaleSalesContractPDF;