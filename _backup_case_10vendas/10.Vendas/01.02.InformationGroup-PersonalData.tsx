import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Colors } from '../../constants/theme';

interface CustomerData {
  photoUri: string;
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  valorPatrimonial: string;
  creditoTributario: string;
  planejamentoTributario: string;
}

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

const SchedulingDetailsPersonalData: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeCarouselTab, setActiveCarouselTab] = useState<number>(1);
  const activeTabRef = useRef<number>(1);
  const isScrollingProgrammatically = useRef<boolean>(false);
  const scrollDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [scrollViewHeight, setScrollViewHeight] = useState<number>(0);
  const sectionPositionsRef = useRef<{ dadosPessoais: number; localizacao: number; operacao: number }>({
    dadosPessoais: 0,
    localizacao: 0,
    operacao: 0,
  });

  const handleSectionLayout =
    (section: 'dadosPessoais' | 'localizacao' | 'operacao') =>
    (event: any) => {
      const { y } = event.nativeEvent.layout;
      sectionPositionsRef.current = { ...sectionPositionsRef.current, [section]: y };
    };

  const handleContentSizeChange = useCallback((_: number, height: number) => {
    setContentHeight(height);
  }, []);

  const handleScrollViewLayout = useCallback((event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  }, []);

  const updateActiveTab = useCallback((newTab: number) => {
    if (activeTabRef.current !== newTab) {
      activeTabRef.current = newTab;
      setActiveCarouselTab(newTab);
    }
  }, []);

  const handleCarouselTabPress = useCallback(
    (tab: number) => {
      isScrollingProgrammatically.current = true;
      updateActiveTab(tab);
      if (!scrollViewRef.current) return;
      switch (tab) {
        case 1:
          scrollViewRef.current.scrollTo({ y: 0, animated: true });
          break;
        case 2: {
          const localizacaoOffset = sectionPositionsRef.current.localizacao - 10;
          scrollViewRef.current.scrollTo({ y: Math.max(0, localizacaoOffset), animated: true });
          break;
        }
        case 3:
          scrollViewRef.current.scrollToEnd({ animated: true });
          break;
      }
      setTimeout(() => {
        isScrollingProgrammatically.current = false;
      }, 500);
    },
    [updateActiveTab],
  );

  const handleScroll = useCallback(
    (event: any) => {
      if (isScrollingProgrammatically.current) return;
      if (scrollDebounceRef.current) clearTimeout(scrollDebounceRef.current);
      const scrollY = event.nativeEvent.contentOffset.y;
      const viewportHeight = event.nativeEvent.layoutMeasurement.height;
      const contentHeightFromEvent = event.nativeEvent.contentSize.height;
      scrollDebounceRef.current = setTimeout(() => {
        if (isScrollingProgrammatically.current) return;
        const tolerance = 50;
        const maxScroll = contentHeightFromEvent - viewportHeight;
        let newTab = activeTabRef.current;
        if (scrollY >= maxScroll - tolerance) {
          newTab = 3;
        } else if (scrollY >= sectionPositionsRef.current.localizacao - tolerance) {
          newTab = 2;
        } else {
          newTab = 1;
        }
        if (newTab !== activeTabRef.current) {
          updateActiveTab(newTab);
        }
      }, 100);
    },
    [updateActiveTab],
  );

  return (
    <View style={styles.outerContainer}>
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
          <View style={styles.photoContainer}>
            <View style={styles.photoWrapper}>
              <Image source={require('../../../assets/04-Foto.png')} style={styles.customerPhoto} resizeMode="cover" />
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.sectionContainerTight]} onLayout={handleSectionLayout('dadosPessoais')}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Dados pessoais:</Text>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Nome*</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.nome}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>CPF *</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.cpf}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Email *</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.email}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>WhatsApp</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.whatsapp}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.sectionContainerTight]} onLayout={handleSectionLayout('localizacao')}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Localização:</Text>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Estado</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.estado}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>CEP</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.cep}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Cidade</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.cidade}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Bairro</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.bairro}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Endereço</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.endereco}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Número</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.numero}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Complemento</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.complemento}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.sectionContainerLast]} onLayout={handleSectionLayout('operacao')}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Operação:</Text>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Valor patrimonial</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.valorPatrimonial}</Text>
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <View style={styles.fieldLabelContainer}>
                <Text style={styles.fieldLabel}>Crédito tributário</Text>
              </View>
              <View style={styles.fieldInputContainer}>
                <Text style={styles.fieldValue}>{mockCustomerData.creditoTributario}</Text>
              </View>
            </View>
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
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: Colors.background,
  },
  carouselDigits: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
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
  carouselDigitBtnActive: {
    backgroundColor: '#1777CF',
  },
  carouselDigitText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  carouselDigitTextActive: {
    color: '#FCFCFC',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    width: '100%',
    ...Platform.select({
      web: {
        overflow: 'hidden',
      } as any,
      default: {},
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      } as any,
      default: {},
    }),
  },
  scrollContent: {
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 15,
    gap: 15,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  photoWrapper: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  customerPhoto: {
    width: '100%',
    height: '100%',
  },
  sectionContainer: {
    gap: 10,
    paddingBottom: 10,
  },
  sectionContainerTight: {
    gap: 8,
    paddingBottom: 6,
  },
  sectionContainerLast: {
    paddingBottom: 0,
  },
  sectionTitleContainer: {
    paddingHorizontal: 5,
  },
  sectionTitle: {
    color: '#0A1629',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  fieldContainer: {
    gap: 6,
    height: 63,
    justifyContent: 'center',
  },
  fieldLabelContainer: {
    paddingHorizontal: 6,
  },
  fieldLabel: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  fieldInputContainer: {
    height: 35,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  fieldValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default SchedulingDetailsPersonalData;
