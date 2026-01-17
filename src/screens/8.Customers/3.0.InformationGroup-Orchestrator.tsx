import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import CustomersInformationGroupProfile, { type ProfileFormData } from './3.1.InformationGroup-Profile';
import CustomersInformationGroupSalesFlowOrchestrator, { type SalesFlowTab } from './3.2.InformationGroup-SalesFlow-Orchestrator';

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 19L1 10M1 10L10 1M1 10L19 10"
      stroke={COLORS.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

type TabType = 'perfil' | 'fluxo' | 'documentos' | 'rank';

interface OrchestratorProps {
  visible?: boolean;
  initialTab?: TabType;
  onClose: () => void;
  customerName?: string;
  customerPhoto?: any;
  initialData?: Partial<ProfileFormData>;
}

const CustomersInformationGroupOrchestrator: React.FC<OrchestratorProps> = ({
  visible = true,
  initialTab = 'perfil',
  onClose,
  customerName,
  customerPhoto,
  initialData,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // ========================================
  // ESTADO DO FLUXO DE VENDAS (persiste entre mudancas de aba)
  // ========================================
  const [salesFlowProductId, setSalesFlowProductId] = useState<string | null>(null);
  const [salesFlowPhaseId, setSalesFlowPhaseId] = useState<string | null>(null);
  const [salesFlowActiveTab, setSalesFlowActiveTab] = useState<SalesFlowTab>('produtos');

  // Callback para selecao de produto (limpa fase ao mudar produto)
  const handleSalesFlowProductSelect = useCallback((productId: string) => {
    setSalesFlowProductId(productId);
    setSalesFlowPhaseId(null); // Ao mudar de produto, limpa a fase selecionada
  }, []);

  // Callback para selecao de fase
  const handleSalesFlowPhaseSelect = useCallback((phaseId: string) => {
    setSalesFlowPhaseId(phaseId);
  }, []);

  // Callback para mudanca de aba no fluxo de vendas
  const handleSalesFlowTabChange = useCallback((tab: SalesFlowTab) => {
    setSalesFlowActiveTab(tab);
  }, []);

  const formData = useMemo<ProfileFormData>(
    () => ({
      nome: initialData?.nome ?? (customerName || 'Perola Marina Diniz'),
      cpfCnpj: initialData?.cpfCnpj ?? '385.474.956-25',
      responsavelNome: initialData?.responsavelNome ?? '',
      responsavelCpf: initialData?.responsavelCpf ?? '',
      email: initialData?.email ?? 'PerolaDiniz@hotmail.com',
      whatsapp: initialData?.whatsapp ?? '17 99246-0025',
      estado: initialData?.estado ?? 'São Paulo',
      cep: initialData?.cep ?? '15200-000',
      cidade: initialData?.cidade ?? 'São José do Rio Preto',
      bairro: initialData?.bairro ?? 'Centro',
      endereco: initialData?.endereco ?? 'Piratininga',
      numero: initialData?.numero ?? '650',
      complemento: initialData?.complemento ?? 'Sala 207',
      keymanPhoto: initialData?.keymanPhoto ?? customerPhoto,
      operationAsset: initialData?.operationAsset ?? 'R$ 10.000.000,00',
      operationTaxCredit: initialData?.operationTaxCredit ?? 'R$ 200.000,00',
      operationTaxPlanning: initialData?.operationTaxPlanning ?? 'R$ 200.000,00',
    }),
    [initialData, customerName, customerPhoto]
  );

  if (!visible) return null;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.systemDivider} />
        <View style={styles.tabSelectorContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'perfil' && styles.tabActive]}
              onPress={() => setActiveTab('perfil')}
            >
              <Text style={[styles.tabText, activeTab === 'perfil' && styles.tabTextActive]}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'fluxo' && styles.tabActive]}
              onPress={() => setActiveTab('fluxo')}
            >
              <Text style={[styles.tabText, activeTab === 'fluxo' && styles.tabTextActive]}>Fluxo vendas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'documentos' && styles.tabActive]}
              onPress={() => setActiveTab('documentos')}
            >
              <Text style={[styles.tabText, activeTab === 'documentos' && styles.tabTextActive]}>Documentos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'rank' && styles.tabActive]}
              onPress={() => setActiveTab('rank')}
            >
              <Text style={[styles.tabText, activeTab === 'rank' && styles.tabTextActive]}>Rank</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'perfil' && <CustomersInformationGroupProfile formData={formData} keymanLabel="Sem indicação..." />}
        {activeTab === 'fluxo' && (
          <CustomersInformationGroupSalesFlowOrchestrator
            selectedProductId={salesFlowProductId}
            selectedPhaseId={salesFlowPhaseId}
            activeTab={salesFlowActiveTab}
            onProductSelect={handleSalesFlowProductSelect}
            onPhaseSelect={handleSalesFlowPhaseSelect}
            onTabChange={handleSalesFlowTabChange}
          />
        )}
        {activeTab === 'documentos' && <View style={styles.placeholder} />}
        {activeTab === 'rank' && <View style={styles.placeholder} />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  systemDivider: {
    height: 0.5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLORS.border,
    alignSelf: 'stretch',
  },
  tabSelectorContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 6,
    padding: 4,
    borderWidth: 0.3,
    borderColor: COLORS.border,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  placeholder: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
});

export default CustomersInformationGroupOrchestrator;
