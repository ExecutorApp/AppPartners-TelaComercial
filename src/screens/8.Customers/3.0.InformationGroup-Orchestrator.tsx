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

// Icone de Voltar
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

// Icone Olho Aberto
const EyeOpenIcon = () => (
  <Svg width={23} height={14} viewBox="0 0 23 14" fill="none">
    <Path d="M11.5 0C5.46878 0 0.364891 6.3 0.149234 6.573C0.0524697 6.6954 0 6.84553 0 7C0 7.15447 0.0524697 7.3046 0.149234 7.427C0.364891 7.7 5.46878 14 11.5 14C17.5312 14 22.6351 7.7 22.8508 7.427C22.9475 7.3046 23 7.15447 23 7C23 6.84553 22.9475 6.6954 22.8508 6.573C22.6351 6.3 17.5312 0 11.5 0ZM11.5 12.6C7.02152 12.6 2.87371 8.4 1.65165 7C2.87371 5.6 7.01433 1.4 11.5 1.4C15.9857 1.4 20.1263 5.6 21.3484 7C20.1263 8.4 15.9857 12.6 11.5 12.6Z" fill={COLORS.textPrimary}/>
    <Path d="M15.0943 6.3C15.2129 6.29991 15.3297 6.27122 15.4342 6.21649C15.5387 6.16176 15.6277 6.0827 15.6932 5.98635C15.7586 5.89001 15.7986 5.77937 15.8095 5.66433C15.8204 5.54928 15.8019 5.43339 15.7556 5.327C15.3602 4.56023 14.7517 3.9169 13.9994 3.47018C13.2471 3.02345 12.3811 2.79126 11.5 2.8C10.3561 2.8 9.25902 3.2425 8.45014 4.03015C7.64127 4.8178 7.18685 5.88609 7.18685 7C7.18685 8.11391 7.64127 9.1822 8.45014 9.96985C9.25902 10.7575 10.3561 11.2 11.5 11.2C12.3811 11.2087 13.2471 10.9765 13.9994 10.5298C14.7517 10.0831 15.3602 9.43977 15.7556 8.673C15.8019 8.56661 15.8204 8.45072 15.8095 8.33568C15.7986 8.22063 15.7586 8.11 15.6932 8.01365C15.6277 7.9173 15.5387 7.83824 15.4342 7.78351C15.3297 7.72879 15.2129 7.7001 15.0943 7.7C14.9974 7.7099 14.8994 7.6986 14.8076 7.66692C14.7158 7.63525 14.6324 7.58399 14.5635 7.51691C14.4946 7.44982 14.4419 7.36859 14.4094 7.27916C14.3769 7.18973 14.3653 7.09436 14.3754 7C14.3653 6.90564 14.3769 6.81027 14.4094 6.72084C14.4419 6.63141 14.4946 6.55018 14.5635 6.48309C14.6324 6.41601 14.7158 6.36475 14.8076 6.33308C14.8994 6.3014 14.9974 6.2901 15.0943 6.3Z" fill={COLORS.textPrimary}/>
  </Svg>
);

// Icone Olho Fechado
const EyeClosedIcon = () => (
  <Svg width={23} height={13} viewBox="0 0 23 13" fill="none">
    <Path d="M0.445885 0.115447C0.649436 0.00144289 0.890862 -0.0287316 1.11711 0.0315541C1.34336 0.0918398 1.53592 0.237654 1.65249 0.436955L1.65691 0.444754L1.68168 0.484617C1.85938 0.761543 2.04977 1.03046 2.25225 1.29055C2.80748 2.00249 3.43362 2.65855 4.12142 3.24906C5.78271 4.67201 8.23661 6.06723 11.4999 6.06723C14.7624 6.06723 17.2171 4.67288 18.8784 3.24819C19.5665 2.65773 20.193 2.00166 20.7485 1.28969C20.9507 1.02987 21.1407 0.761235 21.3182 0.484617L21.3429 0.444754L21.3474 0.437821V0.436088C21.464 0.23659 21.6567 0.090641 21.8831 0.0303467C22.1096 -0.0299476 22.3512 0.000351874 22.5549 0.11458C22.7585 0.228808 22.9075 0.417609 22.969 0.639447C23.0306 0.861284 22.9996 1.09799 22.883 1.29748V1.29922L22.8813 1.30095L22.8777 1.30702L22.8671 1.32522C22.8112 1.41946 22.7521 1.51195 22.6902 1.60253C22.569 1.78451 22.3912 2.03756 22.155 2.34087C21.5279 3.14519 20.8205 3.88633 20.0435 4.55329C18.1672 6.16169 15.3143 7.80042 11.4999 7.80042C7.6855 7.80042 4.83265 6.16169 2.95551 4.55329C2.17873 3.88628 1.47169 3.14515 0.844842 2.34087C0.605318 2.03343 0.38039 1.71534 0.170772 1.38761C0.157946 1.3669 0.145267 1.3461 0.132734 1.32522L0.122119 1.30788L0.11858 1.30095L0.117696 1.29922V1.29835C0.0599711 1.19952 0.021808 1.09052 0.00710582 0.977576C-0.00759637 0.864628 0.00056605 0.749951 0.0311268 0.640095C0.0616876 0.53024 0.114047 0.427361 0.185214 0.337339C0.25638 0.247317 0.344958 0.171917 0.445885 0.115447ZM3.27928 7.54651L1.51007 9.2797C1.34323 9.43756 1.11977 9.52491 0.887833 9.52293C0.655892 9.52096 0.434022 9.42982 0.270009 9.26915C0.105995 9.10847 0.0129624 8.89112 0.0109469 8.6639C0.00893135 8.43668 0.0980946 8.21778 0.259233 8.05433L2.02845 6.32114C2.19528 6.16329 2.41874 6.07594 2.65068 6.07791C2.88262 6.07989 3.10449 6.17103 3.2685 6.3317C3.43252 6.49237 3.52555 6.70973 3.52756 6.93695C3.52958 7.16416 3.44042 7.38307 3.27928 7.54651ZM21.4898 9.2797L19.7206 7.54651C19.5594 7.38307 19.4703 7.16416 19.4723 6.93695C19.4743 6.70973 19.5673 6.49237 19.7313 6.3317C19.8954 6.17103 20.1172 6.07989 20.3492 6.07791C20.5811 6.07594 20.8046 6.16329 20.9714 6.32114L22.7406 8.05433C22.9018 8.21778 22.9909 8.43668 22.9889 8.6639C22.9869 8.89112 22.8939 9.10847 22.7298 9.26915C22.5658 9.42982 22.344 9.52096 22.112 9.52293C21.8801 9.52491 21.6566 9.43756 21.4898 9.2797ZM6.5709 11.5883C6.47851 11.794 6.30819 11.9564 6.09587 12.0414C5.88355 12.1264 5.64583 12.1273 5.43286 12.0439C5.21989 11.9605 5.04831 11.7993 4.95432 11.5943C4.86033 11.3894 4.85128 11.1567 4.92907 10.9453L5.81368 8.77881C5.85394 8.6694 5.91628 8.56905 5.99697 8.48374C6.07766 8.39843 6.17505 8.3299 6.28335 8.28224C6.39164 8.23458 6.50862 8.20877 6.62732 8.20633C6.74601 8.20389 6.86399 8.22489 6.97423 8.26806C7.08447 8.31123 7.1847 8.3757 7.26897 8.45763C7.35324 8.53955 7.41981 8.63726 7.46472 8.74492C7.50963 8.85258 7.53196 8.968 7.53037 9.08429C7.52879 9.20058 7.50333 9.31537 7.45551 9.42182L6.5709 11.5883ZM17.5781 12.071C17.4702 12.1133 17.3549 12.1344 17.2387 12.133C17.1225 12.1316 17.0078 12.1078 16.901 12.063C16.7942 12.0182 16.6975 11.9532 16.6163 11.8717C16.5352 11.7903 16.4712 11.694 16.4281 11.5883L15.5435 9.42182C15.4607 9.20929 15.4666 8.97339 15.5598 8.76505C15.653 8.55671 15.8261 8.39263 16.0417 8.30822C16.2574 8.22382 16.4982 8.22586 16.7123 8.3139C16.9265 8.40194 17.0966 8.56892 17.1862 8.77881L18.0708 10.9453C18.1139 11.051 18.1354 11.1639 18.134 11.2777C18.1326 11.3915 18.1084 11.504 18.0626 11.6086C18.0169 11.7132 17.9505 11.8079 17.8674 11.8874C17.7842 11.9669 17.6859 12.0296 17.5781 12.0719V12.071ZM12.3845 12.1334C12.3845 12.3632 12.2913 12.5837 12.1254 12.7462C11.9595 12.9087 11.7345 13 11.4999 13C11.2653 13 11.0403 12.9087 10.8744 12.7462C10.7085 12.5837 10.6153 12.3632 10.6153 12.1334V9.96691C10.6153 9.73708 10.7085 9.51665 10.8744 9.35414C11.0403 9.19162 11.2653 9.10032 11.4999 9.10032C11.7345 9.10032 11.9595 9.19162 12.1254 9.35414C12.2913 9.51665 12.3845 9.73708 12.3845 9.96691V12.1334Z" fill={COLORS.textPrimary}/>
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

  // Estado de visibilidade do container de contexto (olho)
  const [contextCardVisible, setContextCardVisible] = useState(true);

  // ========================================
  // ESTADO DO FLUXO DE VENDAS (persiste entre mudancas de aba)
  // ========================================
  const [salesFlowProductId, setSalesFlowProductId] = useState<string | null>(null);
  const [salesFlowPhaseId, setSalesFlowPhaseId] = useState<string | null>(null);
  const [salesFlowActivityId, setSalesFlowActivityId] = useState<string | null>(null);
  const [salesFlowActiveTab, setSalesFlowActiveTab] = useState<SalesFlowTab>('produtos');

  // Callback para selecao de produto (limpa fase e atividade ao mudar produto)
  const handleSalesFlowProductSelect = useCallback((productId: string) => {
    setSalesFlowProductId(productId);
    setSalesFlowPhaseId(null);     // Ao mudar de produto, limpa a fase selecionada
    setSalesFlowActivityId(null);  // Ao mudar de produto, limpa a atividade selecionada
  }, []);

  // Callback para selecao de fase (limpa atividade ao mudar fase)
  const handleSalesFlowPhaseSelect = useCallback((phaseId: string) => {
    setSalesFlowPhaseId(phaseId);
    setSalesFlowActivityId(null);  // Ao mudar de fase, limpa a atividade selecionada
  }, []);

  // Callback para selecao de atividade
  const handleSalesFlowActivitySelect = useCallback((activityId: string) => {
    setSalesFlowActivityId(activityId);
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
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <BackIcon />
          </TouchableOpacity>
          {activeTab === 'fluxo' && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setContextCardVisible(!contextCardVisible)}
              activeOpacity={0.7}
            >
              {contextCardVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </TouchableOpacity>
          )}
        </View>
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
            selectedActivityId={salesFlowActivityId}
            activeTab={salesFlowActiveTab}
            onProductSelect={handleSalesFlowProductSelect}
            onPhaseSelect={handleSalesFlowPhaseSelect}
            onActivitySelect={handleSalesFlowActivitySelect}
            onTabChange={handleSalesFlowTabChange}
            contextCardVisible={contextCardVisible}
            customerName={customerName}
            customerPhoto={customerPhoto}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  eyeButton: {
    width: 38,
    height: 38,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 0,
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
