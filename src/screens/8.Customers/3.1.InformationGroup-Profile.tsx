import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stepper } from '../7.Keymans/02.02.InformationGroup-Contacts-NewContact05';

export type PersonType = 'fisica' | 'juridica';

export type ProfileFormData = {
  nome: string;
  cpfCnpj: string;
  responsavelNome: string;
  responsavelCpf: string;
  email: string;
  whatsapp: string;
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
  keymanPhoto?: any;
  operationAsset?: string;
  operationTaxCredit?: string;
  operationTaxPlanning?: string;
};

type ProfileViewProps = {
  formData: ProfileFormData;
  keymanLabel?: string;
};

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  border: '#D8E0F0',
  white: '#FCFCFC',
  bg: '#F4F4F4',
};

const CustomersInformationGroupProfile: React.FC<ProfileViewProps> = ({ formData, keymanLabel = 'Sem indicação...' }) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const tabs = useMemo(() => [1, 2, 3], []);
  const [activeTab, setActiveTab] = useState<number>(1);
  const activeTabRef = useRef<number>(1);
  const isScrollingProgrammaticallyRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const sectionPositionsRef = useRef<{ dadosPessoais: number; localizacao: number; operacao: number }>({
    dadosPessoais: 0,
    localizacao: 0,
    operacao: 0,
  });

  const scrollToSectionY = useCallback((y: number) => {
    const sv = scrollViewRef.current;
    if (!sv) return;
    isScrollingProgrammaticallyRef.current = true;
    sv.scrollTo({ y: Math.max(0, y), animated: true });
    setTimeout(() => {
      isScrollingProgrammaticallyRef.current = false;
    }, 450);
  }, []);

  const handleTabSelect = useCallback(
    (tab: number) => {
      setActiveTab(tab);
      activeTabRef.current = tab;
      if (tab === 1) scrollToSectionY(sectionPositionsRef.current.dadosPessoais);
      if (tab === 2) scrollToSectionY(sectionPositionsRef.current.localizacao);
      if (tab === 3) scrollToSectionY(sectionPositionsRef.current.operacao);
    },
    [scrollToSectionY]
  );

  const onStepLeft = useCallback(() => handleTabSelect(Math.max(1, activeTabRef.current - 1)), [handleTabSelect]);
  const onStepRight = useCallback(() => handleTabSelect(Math.min(3, activeTabRef.current + 1)), [handleTabSelect]);
  const canGoLeft = activeTab > 1;
  const canGoRight = activeTab < 3;

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (isScrollingProgrammaticallyRef.current) return;
      const y = e.nativeEvent.contentOffset.y;
      const { localizacao, operacao } = sectionPositionsRef.current;

      const nextTab = y >= operacao - 20 ? 3 : y >= localizacao - 20 ? 2 : 1;
      if (activeTabRef.current !== nextTab) {
        activeTabRef.current = nextTab;
        setActiveTab(nextTab);
      }
    },
    []
  );

  if (!fontsLoaded) return null;

  const getPhotoSource = () => {
    const photo = formData?.keymanPhoto;
    if (photo) {
      if (typeof photo === 'number') return photo;
      if (typeof photo === 'object' && typeof (photo as any)?.uri === 'string' && String((photo as any).uri).trim()) return photo;
    }
    return require('../../../assets/AvatarPlaceholder02.png');
  };

  const hasCustomPhoto = (() => {
    const photo = formData?.keymanPhoto;
    if (!photo) return false;
    if (typeof photo === 'number') return true;
    if (typeof photo === 'object' && typeof (photo as any)?.uri === 'string' && String((photo as any).uri).trim()) return true;
    return false;
  })();

  const Field = ({ label, value }: { label: string; value?: string | null }) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldLabelContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <View style={styles.fieldInputContainer}>
        <Text style={styles.fieldValue}>{(value ?? '').trim() ? value : '—'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabsFixedBlock}>
        <Stepper
          tabs={tabs}
          activeTab={activeTab}
          canGoLeft={canGoLeft}
          canGoRight={canGoRight}
          onStepLeft={onStepLeft}
          onStepRight={onStepRight}
          onSelectTab={handleTabSelect}
          showArrows={false}
        />
        <View style={styles.dividerThin} />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={32}
      >
        <View style={styles.card}>
          <View style={styles.photoContainer}>
            <View style={styles.photoWrapper}>
              <Image source={getPhotoSource()} style={styles.customerPhoto} resizeMode={hasCustomPhoto ? 'cover' : 'contain'} />
            </View>
          </View>
          <View style={styles.sectionContainerTight}>
            <Text style={styles.sectionTitle}>Keyman</Text>
            <View style={styles.fieldInputContainer}>
              <Text style={styles.fieldValue}>{keymanLabel}</Text>
            </View>
          </View>
        </View>

        <View
          style={styles.card}
          onLayout={(e) => {
            sectionPositionsRef.current.dadosPessoais = Math.max(0, e.nativeEvent.layout.y - 10);
          }}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Dados pessoais:</Text>
          </View>
          <Field label={formData.responsavelNome ? 'Razão social*' : 'Nome*'} value={formData.nome} />
          <Field label={formData.responsavelNome ? 'CNPJ*' : 'CPF*'} value={formData.cpfCnpj} />
          <Field label="Email*" value={formData.email} />
          <Field label="WhatsApp" value={formData.whatsapp} />
        </View>

        <View
          style={styles.card}
          onLayout={(e) => {
            sectionPositionsRef.current.localizacao = Math.max(0, e.nativeEvent.layout.y - 10);
          }}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Localização:</Text>
          </View>
          <Field label="Estado" value={formData.estado} />
          <Field label="CEP" value={formData.cep} />
          <Field label="Cidade" value={formData.cidade} />
          <Field label="Bairro" value={formData.bairro} />
          <Field label="Endereço" value={formData.endereco} />
          <Field label="Número" value={formData.numero} />
          <Field label="Complemento" value={formData.complemento} />
        </View>

        <View
          style={[styles.card, styles.operationCard]}
          onLayout={(e) => {
            sectionPositionsRef.current.operacao = Math.max(0, e.nativeEvent.layout.y - 10);
          }}
        >
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Operação:</Text>
          </View>
          <Field label="Valor patrimonial" value={formData.operationAsset ?? 'R$ 10.000.000,00'} />
          <Field label="Crédito tributário" value={formData.operationTaxCredit ?? 'R$ 200.000,00'} />
          <Field label="Planejamento tributário" value={formData.operationTaxPlanning ?? 'R$ 200.000,00'} />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  tabsFixedBlock: {
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingBottom: 12,
  },
  dividerThin: {
    height: 0.5,
    backgroundColor: COLORS.border,
    marginTop: 10,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 15,
    paddingRight: 15,
    paddingBottom: 0,
    paddingLeft: 15,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 6,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  operationCard: {
    marginBottom: 0,
  },
  // Ajuste aqui para aumentar/diminuir o espaçamento abaixo do container "Operação" (10px)
  bottomSpacer: {
    height: 10,
  },
  photoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    marginBottom: 10,
  },
  photoWrapper: {
    width: '100%',
    height: 170,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    backgroundColor: COLORS.bg,
  },
  customerPhoto: {
    width: '100%',
    height: '100%',
  },
  sectionTitleContainer: {
    paddingHorizontal: 0,
    marginBottom: 10,
  },
  sectionContainerTight: {
    gap: 5,
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
    paddingHorizontal: 0,
  },
  fieldLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  fieldInputContainer: {
    height: 35,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: -10,
    paddingTop: 0,
    marginBottom: 0,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fieldValue: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
});

export default CustomersInformationGroupProfile;
