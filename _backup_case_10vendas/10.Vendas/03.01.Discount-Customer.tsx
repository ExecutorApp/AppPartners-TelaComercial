import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  SafeAreaView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Colors, BorderRadius, Spacing } from '../../constants/theme';
import { ScreenNames } from '../../types/navigation';

// Interface para os dados do cliente
interface CustomerData {
  // Dados da foto
  photoUri: string;
  // Dados pessoais
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  // Localização
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  // Operação
  valorPatrimonial: string;
  creditoTributario: string;
  planejamentoTributario: string;
}

// Dados mockados do cliente para demonstração
const mockCustomerData: CustomerData = {
  photoUri: '',
  nome: 'Perola Marina Diniz',
  cpf: '385.474.956-25',
  email: 'PerolaDiniz@hotmail.com',
  whatsapp: '17 99246-0025',
  estado: 'São Paulo',
  cep: '15200-000',
  cidade: 'São José do Rio Preto',
  bairro: 'Centro',
  endereco: 'Piratininga',
  numero: '650',
  complemento: 'Sala 207',
  valorPatrimonial: 'R$ 10.000.000,00',
  creditoTributario: 'R$ 200.000,00',
  planejamentoTributario: 'R$ 200.000,00',
};

// Componente principal da tela de visualização do cliente
const HEADER_TOP_HEIGHT = 160;

const DiscountCustomerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  
  // Referência do ScrollView para controle de scroll programático
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Estado para controlar a aba ativa do carrossel (1, 2 ou 3)
  const [activeCarouselTab, setActiveCarouselTab] = useState<number>(1);
  
  // Referência para armazenar a aba ativa atual (evita re-renders desnecessários)
  const activeTabRef = useRef<number>(1);
  
  // Referência para controlar se o scroll é programático (evita conflitos)
  const isScrollingProgrammatically = useRef<boolean>(false);
  
  // Referência para o timeout do debounce
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Estado para armazenar a altura total do conteúdo scrollável
  const [contentHeight, setContentHeight] = useState<number>(0);
  
  // Estado para armazenar a altura visível do ScrollView
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(0);
  
  // Posições Y das seções para navegação do carrossel
  const sectionPositionsRef = useRef<{
    dadosPessoais: number;
    localizacao: number;
    operacao: number;
  }>({
    dadosPessoais: 0,
    localizacao: 0,
    operacao: 0,
  });

  // Função para capturar a posição Y de uma seção
  const handleSectionLayout = (section: 'dadosPessoais' | 'localizacao' | 'operacao') => (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    sectionPositionsRef.current = {
      ...sectionPositionsRef.current,
      [section]: y,
    };
  };

  // Função para capturar a altura total do conteúdo
  const handleContentSizeChange = useCallback((width: number, height: number) => {
    setContentHeight(height);
  }, []);

  // Função para capturar a altura visível do ScrollView
  const handleScrollViewLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  }, []);

  // Função para atualizar a aba ativa de forma controlada
  const updateActiveTab = useCallback((newTab: number) => {
    if (activeTabRef.current !== newTab) {
      activeTabRef.current = newTab;
      setActiveCarouselTab(newTab);
    }
  }, []);

  const formatCardNumber = (n: number) => n.toString().padStart(2, '0');
  const gerenciarBadgeCount = 6;
  const chatBadgeCount = 3;

  // Função para navegar para uma seção específica ao clicar no carrossel
  const handleCarouselTabPress = useCallback((tab: number) => {
    // Marca que o scroll está sendo feito programaticamente
    isScrollingProgrammatically.current = true;
    
    // Atualiza a aba imediatamente
    updateActiveTab(tab);
    
    if (!scrollViewRef.current) return;
    
    switch (tab) {
      case 1:
        // Aba 1: scroll vai para o topo para mostrar dados pessoais com foto
        scrollViewRef.current.scrollTo({
          y: 0,
          animated: true,
        });
        break;
      
      case 2:
        // Aba 2: scroll move para deixar "Localização" no topo
        const localizacaoOffset = sectionPositionsRef.current.localizacao - 10;
        scrollViewRef.current.scrollTo({
          y: Math.max(0, localizacaoOffset),
          animated: true,
        });
        break;
      
      case 3:
        // Aba 3: scroll vai até o final para mostrar Operação
        scrollViewRef.current.scrollToEnd({
          animated: true,
        });
        break;
    }
    
    // Libera o controle após a animação terminar (500ms é suficiente)
    setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 500);
  }, [updateActiveTab]);

  // Função para detectar a seção visível durante o scroll manual
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Ignora eventos de scroll se for programático
    if (isScrollingProgrammatically.current) {
      return;
    }
    
    // Limpa o timeout anterior se existir
    if (scrollDebounceRef.current) {
      clearTimeout(scrollDebounceRef.current);
    }
    
    // Extrai os valores do evento antes do debounce
    const scrollY = event.nativeEvent.contentOffset.y;
    const viewportHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeightFromEvent = event.nativeEvent.contentSize.height;
    
    // Aplica debounce para evitar atualizações excessivas
    scrollDebounceRef.current = setTimeout(() => {
      // Ignora se ainda estiver em scroll programático
      if (isScrollingProgrammatically.current) {
        return;
      }
      
      const sectionPositions = sectionPositionsRef.current;
      
      // Margem de tolerância para detecção
      const tolerance = 50;
      
      // Calcula o máximo de scroll possível
      const maxScroll = contentHeightFromEvent - viewportHeight;
      
      let newTab = activeTabRef.current;
      
      // Verifica se está próximo do final (Operação - aba 3)
      if (scrollY >= maxScroll - tolerance) {
        newTab = 3;
      }
      // Verifica se está na seção de Localização (aba 2)
      else if (scrollY >= sectionPositions.localizacao - tolerance) {
        newTab = 2;
      }
      // Caso contrário, está na seção de Dados Pessoais (aba 1)
      else {
        newTab = 1;
      }
      
      // Atualiza apenas se a aba mudou
      if (newTab !== activeTabRef.current) {
        updateActiveTab(newTab);
      }
    }, 100);
  }, [updateActiveTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header fixo - Seta de voltar, abas e carrossel */}
        <View style={styles.fixedHeader}>
          {/* Linha do header com botão de voltar */}
          <View style={styles.backHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate(ScreenNames.SalesHome as any, { autoOpenDiscount: true } as any)}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              {/* Ícone de seta para voltar */}
              <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <Path
                  d="M10 19L1 10M1 10L10 1M1 10L19 10"
                  stroke="#1777CF"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
        </View>
        <View style={styles.headerDivider} />

          {/* Container das abas de navegação - Cliente, Venda, Gerenciar, Chat */}
          <View style={styles.tabsWrapper}>
            <View style={styles.tabsBox}>
              {/* Aba Cliente - ativa nesta tela */}
              <View style={[styles.tabBtn, styles.tabWCliente, styles.tabBtnActive]}>
                <Text style={[styles.tabText, styles.tabTextActive]}>Cliente</Text>
              </View>
              {/* Aba Venda - navega para tela de vendas */}
              <TouchableOpacity
                style={[styles.tabBtn, styles.tabWVenda]}
                onPress={() => navigation.navigate(ScreenNames.DiscountSales as any)}
              >
                <Text style={styles.tabText}>Venda</Text>
              </TouchableOpacity>
              {/* Aba Gerenciar - com badge */}
              <View style={styles.tabBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.tabBtn, styles.tabWGerenciar]}
                  onPress={() => navigation.navigate(ScreenNames.DiscountManage as any)}
                >
                  <Text style={styles.tabText}>Gerenciar</Text>
                </TouchableOpacity>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{formatCardNumber(gerenciarBadgeCount)}</Text>
                </View>
              </View>
              {/* Aba Chat - com badge */}
              <View style={styles.tabBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.tabBtn, styles.tabWChat]}
                  onPress={() => navigation.navigate(ScreenNames.DiscountChat as any)}
                >
                  <Text style={styles.tabText}>Chat</Text>
                </TouchableOpacity>
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{formatCardNumber(chatBadgeCount)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Carrossel de navegação (01, 02, 03) FIXO no header */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselDigits}>
              <TouchableOpacity
                style={[styles.carouselDigitBtn, activeCarouselTab === 1 && styles.carouselDigitBtnActive]}
                onPress={() => handleCarouselTabPress(1)}
                activeOpacity={0.7}
              >
                <Text style={[styles.carouselDigitText, activeCarouselTab === 1 && styles.carouselDigitTextActive]}>01</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.carouselDigitBtn, activeCarouselTab === 2 && styles.carouselDigitBtnActive]}
                onPress={() => handleCarouselTabPress(2)}
                activeOpacity={0.7}
              >
                <Text style={[styles.carouselDigitText, activeCarouselTab === 2 && styles.carouselDigitTextActive]}>02</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.carouselDigitBtn, activeCarouselTab === 3 && styles.carouselDigitBtnActive]}
                onPress={() => handleCarouselTabPress(3)}
                activeOpacity={0.7}
              >
                <Text style={[styles.carouselDigitText, activeCarouselTab === 3 && styles.carouselDigitTextActive]}>03</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Divisor horizontal ABAIXO do carrossel */}
          <View style={styles.headerDivider} />

      </View>

        {/* Container do conteúdo com scroll - SEPARADO DO HEADER FIXO */}
        <View style={styles.contentContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={Platform.OS === 'android'}
            bounces={Platform.OS === 'ios'}
            onScroll={handleScroll}
            scrollEventThrottle={32}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleScrollViewLayout}
          >
            {/* Container da foto do cliente */}
            <View style={styles.photoContainer}>
              <View style={styles.photoWrapper}>
                <Image
                  source={require('../../../assets/04-Foto.png')}
                  style={styles.customerPhoto}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* Seção de Dados Pessoais */}
            <View
              style={styles.sectionContainer}
              onLayout={handleSectionLayout('dadosPessoais')}
            >
              {/* Título da seção de Dados Pessoais */}
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Dados pessoais:</Text>
              </View>
              
              {/* Campo Nome */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Nome*</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.nome}</Text>
                </View>
              </View>
              
              {/* Campo CPF */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>CPF *</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.cpf}</Text>
                </View>
              </View>
              
              {/* Campo Email */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Email *</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.email}</Text>
                </View>
              </View>
              
              {/* Campo WhatsApp */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>WhatsApp</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.whatsapp}</Text>
                </View>
              </View>
            </View>

            {/* Seção de Localização */}
            <View
              style={styles.sectionContainer}
              onLayout={handleSectionLayout('localizacao')}
            >
              {/* Título da seção de Localização */}
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Localização:</Text>
              </View>
              
              {/* Campo Estado */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Estado</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.estado}</Text>
                </View>
              </View>
              
              {/* Campo CEP */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>CEP</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.cep}</Text>
                </View>
              </View>
              
              {/* Campo Cidade */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Cidade</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.cidade}</Text>
                </View>
              </View>
              
              {/* Campo Bairro */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Bairro</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.bairro}</Text>
                </View>
              </View>
              
              {/* Campo Endereço */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Endereço</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.endereco}</Text>
                </View>
              </View>
              
              {/* Campo Número */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Número</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.numero}</Text>
                </View>
              </View>
              
              {/* Campo Complemento */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Complemento</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.complemento}</Text>
                </View>
              </View>
            </View>

            {/* Seção de Operação */}
            <View
              style={[styles.sectionContainer, styles.sectionContainerLast]}
              onLayout={handleSectionLayout('operacao')}
            >
              {/* Título da seção de Operação */}
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Operação:</Text>
              </View>
              
              {/* Campo Valor Patrimonial */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Valor patrimonial</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.valorPatrimonial}</Text>
                </View>
              </View>
              
              {/* Campo Crédito Tributário */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Crédito tributário</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.creditoTributario}</Text>
                </View>
              </View>
              
              {/* Campo Planejamento Tributário */}
              <View style={styles.fieldContainer}>
                <View style={styles.fieldLabelContainer}>
                  <Text style={styles.fieldLabel}>Planejamento tributário</Text>
                </View>
                <View style={styles.fieldInputContainer}>
                  <Text style={styles.fieldValue}>{mockCustomerData.planejamentoTributario}</Text>
                </View>
              </View>
            </View>

            
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Estilos da tela de visualização do cliente
const styles = StyleSheet.create({
  // Container principal da área segura
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Container principal da tela
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // Header fixo no topo da tela - contém seta, abas e carrossel
  fixedHeader: {
    backgroundColor: Colors.background,
    zIndex: 10,
    height: HEADER_TOP_HEIGHT,
    // Sombra sutil para destacar o header fixo
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
      } as any,
    }),
  },
  // Container da linha do header com botão de voltar
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  // Botão de voltar (seta para esquerda)
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Divisor horizontal abaixo do header
  headerDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  // Container wrapper das abas de navegação
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: Colors.background,
    paddingTop: 18,
  },
  // Container das abas com fundo cinza
  tabsBox: {
    height: 40,
    padding: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  // Estilo base de cada botão de aba
  tabBtn: {
    alignSelf: 'stretch',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Estilo adicional para aba ativa (fundo azul)
  tabBtnActive: {
    backgroundColor: '#1777CF',
  },
  // Texto da aba (cor escura)
  tabText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  // Texto da aba ativa (cor branca)
  tabTextActive: {
    color: '#FCFCFC',
  },
  tabWCliente: { minWidth: 70 },
  tabWVenda: { minWidth: 56 },
  tabWGerenciar: { minWidth: 92 },
  tabWChat: { minWidth: 60 },
  tabBtnWithBadge: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 25,
    height: 25,
    borderRadius: 99,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  tabBadgeText: {
    color: '#1777CF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  // Container do carrossel de navegação - CENTRALIZADO
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
  },
  // Container dos dígitos do carrossel (01, 02, 03) - centralizado
  carouselDigits: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  // Botão de cada dígito do carrossel
  carouselDigitBtn: {
    width: 40,
    height: 35,
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Botão do dígito ativo (fundo azul)
  carouselDigitBtnActive: {
    backgroundColor: '#1777CF',
  },
  // Texto do dígito do carrossel
  carouselDigitText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  // Texto do dígito ativo (cor branca)
  carouselDigitTextActive: {
    color: '#FCFCFC',
  },
  // Container do conteúdo com scroll - OCUPA TODO O ESPAÇO RESTANTE
  contentContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.background,
    ...Platform.select({
      web: {
        overflow: 'hidden',
      } as any,
      default: {},
    }),
  },
  // ScrollView principal do conteúdo
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 25,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      } as any,
      default: {},
    }),
  },
  // Conteúdo interno do ScrollView
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 15,
  },
  // Container da foto do cliente
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  // Wrapper da imagem do cliente com borda arredondada
  photoWrapper: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  // Imagem do cliente
  customerPhoto: {
    width: '100%',
    height: '100%',
  },
  // Container de cada seção (Dados Pessoais, Localização, Operação)
  sectionContainer: {
    gap: 10,
    paddingBottom: 10,
  },
  sectionContainerLast: {
    paddingBottom: 0,
  },
  // Container do título de cada seção
  sectionTitleContainer: {
    paddingHorizontal: 5,
  },
  // Texto do título da seção
  sectionTitle: {
    color: '#0A1629',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  // Container de cada campo (label + input)
  fieldContainer: {
    gap: 6,
    height: 63,
    justifyContent: 'center',
  },
  // Container do label do campo
  fieldLabelContainer: {
    paddingHorizontal: 6,
  },
  // Texto do label do campo
  fieldLabel: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  // Container do valor do campo (input visual)
  fieldInputContainer: {
    height: 35,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  // Texto do valor do campo
  fieldValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  // Espaçador inferior para garantir scroll adequado
  bottomSpacer: {
    height: 50,
  },
});

export default DiscountCustomerScreen;
