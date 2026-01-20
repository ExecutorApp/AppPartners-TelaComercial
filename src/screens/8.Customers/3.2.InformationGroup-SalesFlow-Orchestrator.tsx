import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import CustomersInformationGroupSalesFlowProducts from './3.2.InformationGroup-SalesFlow-Product';
import CustomersInformationGroupSalesFlowPhases from './3.2.InformationGroup-SalesFlow-Phases';
import CustomersInformationGroupSalesFlowActivities from './3.2.InformationGroup-SalesFlow-Activities';
import { CustomerInfoProps } from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution';

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textDisabled: '#B0B7C3', // cor para texto/icone desabilitado
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

// ========================================
// TIPOS DE DADOS COMPARTILHADOS
// ========================================

export type ProductItem = {
  id: string;
  title: string;
  status: 'clock' | 'check' | 'question';
};

export type PhaseItem = {
  id: string;
  title: string;
  status: 'clock' | 'check' | 'question';
  productId: string; // relaciona fase ao produto
};

// Quatro status principais (macro) da atividade
export type ActivityItem = {
  id: string;
  title: string;
  status: 'null' | 'not_started' | 'started' | 'completed';
  messageStatus: 'active' | 'inactive';
  phaseId: string; // relaciona atividade a fase
};

// ========================================
// DADOS MOCKADOS (HIERARQUIA: PRODUTO -> FASE -> ATIVIDADE)
// ========================================

export const PRODUCTS_DATA: ProductItem[] = [
  { id: '1', title: 'Holding Patrimonial', status: 'clock' },
  { id: '2', title: 'Ativos Fundiarios', status: 'check' },
  { id: '3', title: 'Planejamento Tributario', status: 'question' },
];

export const PHASES_DATA: PhaseItem[] = [
  // Fases do Produto 1 (Holding Patrimonial)
  { id: '1', title: 'Keymans', status: 'check', productId: '1' },
  { id: '2', title: 'Prospeccao', status: 'clock', productId: '1' },
  { id: '3', title: 'Cadastro cliente', status: 'clock', productId: '1' },
  { id: '4', title: 'Teste de maturidade', status: 'clock', productId: '1' },
  { id: '5', title: 'Reuniao gratuita', status: 'clock', productId: '1' },
  { id: '6', title: 'Pre Diagnostico', status: 'clock', productId: '1' },
  { id: '7', title: 'Reuniao gratuita', status: 'clock', productId: '1' },
  // Fases do Produto 2 (Ativos Fundiarios)
  { id: '8', title: 'Analise inicial', status: 'check', productId: '2' },
  { id: '9', title: 'Documentacao', status: 'clock', productId: '2' },
  // Fases do Produto 3 (Planejamento Tributario)
  { id: '10', title: 'Levantamento fiscal', status: 'question', productId: '3' },
];

export const ACTIVITIES_DATA: ActivityItem[] = [
  // Atividades da Fase 1 (Keymans)
  { id: '1', title: 'Upload lista de Keymans', status: 'completed', messageStatus: 'active', phaseId: '1' },
  { id: '2', title: 'Reuniao semanal Keymans', status: 'started', messageStatus: 'inactive', phaseId: '1' },
  { id: '3', title: 'Geracao de evento (Grupo)', status: 'started', messageStatus: 'active', phaseId: '1' },
  { id: '4', title: '3 Indicacoes Keymans', status: 'not_started', messageStatus: 'inactive', phaseId: '1' },
  { id: '5', title: '3 Clientes Keymans', status: 'not_started', messageStatus: 'inactive', phaseId: '1' },
  { id: '6', title: 'Audio 1', status: 'null', messageStatus: 'inactive', phaseId: '1' },
  // Atividades da Fase 2 (Prospeccao)
  { id: '7', title: 'Contato inicial', status: 'not_started', messageStatus: 'inactive', phaseId: '2' },
  { id: '8', title: 'Envio de material', status: 'not_started', messageStatus: 'inactive', phaseId: '2' },
];

// ========================================
// CONTAINER: ABAS DE FLUXO DE VENDAS
// Icones e titulos das abas Produtos, Fases e Atividades
// ========================================

// Icone Produtos
const ICON_SIZE_PRODUTOS = 18;        // ajusta tamanho do icone de Produtos
const ICON_GAP_PRODUTOS = 5;          // ajusta espacamento entre icone e titulo Produtos

// Icone Fases
const ICON_SIZE_FASES = 18;           // ajusta tamanho do icone de Fases
const ICON_GAP_FASES = 5;             // ajusta espacamento entre icone e titulo Fases

// Icone Atividades
const ICON_SIZE_ATIVIDADES = 18;      // ajusta tamanho do icone de Atividades
const ICON_GAP_ATIVIDADES = 5;        // ajusta espacamento entre icone e titulo Atividades

const ACTIVITIES_ICON_PATH_D =
  'M2.75199 6.14177C2.97762 5.69102 3.22339 5.25675 3.48929 4.83897C3.75569 4.42118 4.04925 4.01284 4.36999 3.61396L3.25274 3.38641C3.17802 3.3675 3.10572 3.36993 3.03585 3.39367C2.96597 3.41742 2.90289 3.45692 2.84661 3.51218L1.08085 5.27663C1.05271 5.30425 1.04325 5.33673 1.05247 5.37405C1.06169 5.41137 1.08498 5.43948 1.12234 5.45838L2.75199 6.14177ZM11.0887 0.710287C9.96882 0.790258 8.98259 1.03623 8.13004 1.4482C7.27749 1.86017 6.47565 2.44129 5.72451 3.19157C5.18785 3.72858 4.71935 4.2879 4.31904 4.8695C3.91872 5.45111 3.58877 6.02908 3.32917 6.60342L5.3897 8.65722C5.9647 8.39792 6.54552 8.06834 7.13216 7.66848C7.71881 7.26863 8.28119 6.80019 8.81931 6.26318C9.57045 5.5129 10.1522 4.71513 10.5647 3.86987C10.9771 3.0246 11.2234 2.04265 11.3035 0.924028C11.3035 0.894463 11.3013 0.867079 11.2969 0.841876C11.2925 0.816673 11.277 0.790501 11.2503 0.763359C11.2236 0.736217 11.197' +
  '4 0.720708 11.1717 0.71683C11.146 0.712953 11.1186 0.710529 11.0895 0.70956M7.1984 4.80698C6.9849 4.59324 6.87815 4.33709 6.87815 4.03853C6.87815 3.73997 6.9849 3.48382 7.1984 3.27008C7.4119 3.05634 7.66907 2.94972 7.96992 2.9502C8.27076 2.95068 8.52769 3.05731 8.74071 3.27008C8.95372 3.48285 9.06047 3.739 9.06096 4.03853C9.06144 4.33806 8.95469 4.59397 8.74071 4.80625C8.52672 5.01854 8.26955 5.12517 7.96919 5.12614C7.66883 5.12711 7.41166 5.02048 7.19767 4.80625M5.85116 9.24682L6.53606 10.879C6.55498 10.9158 6.58288 10.9366 6.61976 10.9415C6.65664 10.9463 6.68939 10.9347 6.71802 10.9066L8.4845 9.15594C8.5403 9.10021 8.57985 9.0372 8.60314 8.96692C8.62692 8.89713 8.62934 8.82515 8.61042 8.751L8.3826 7.63504C7.98326 7.9559 7.57445 8.24839 7.15618 8.51254C6.73792 8.77669 6.30242 9.02145 5.85116 9.24682ZM12 0.604144C11.9942 1.81582 11.7642 2.93348 11.31 3.95711C10.8558 4.98073 10.1782 5.942' +
  '32 9.27713 6.84188C9.23055 6.8884 9.18615 6.93033 9.14393 6.96765C9.10172 7.00497 9.05756 7.04689 9.01146 7.09342L9.31934 8.59978C9.35816 8.79559 9.34846 8.98534 9.29023 9.16903C9.23152 9.35223 9.13107 9.5146 8.9889 9.65612L6.96185 11.6808C6.81725 11.8253 6.64087 11.8786 6.4327 11.8408C6.22503 11.8035 6.08188 11.6869 6.00327 11.4911L5.13132 9.43729L2.55183 6.84624L0.495663 5.97528C0.29963 5.89725 0.184388 5.75427 0.149936 5.54635C0.115485 5.33842 0.170559 5.16224 0.315157 5.01781L2.34148 2.99309C2.48317 2.85157 2.64669 2.75391 2.83205 2.70011C3.01692 2.64583 3.20738 2.63831 3.40341 2.67757L4.91078 2.9851C4.95736 2.93857 4.99715 2.89664 5.03015 2.85932C5.06266 2.822 5.1022 2.78008 5.14878 2.73355C6.04937 1.834 7.01207 1.15497 8.03688 0.696474C9.06169 0.237974 10.1809 0.00581607 11.3944 0C11.4726 0.00290803 11.5485 0.0184176 11.6222 0.0465286C11.696 0.0746396 11.7647 0.120684 11.8282 0.184' +
  '66C11.8918 0.248637 11.9355 0.314795 11.9592 0.383133C11.983 0.451472 11.9961 0.525142 11.9985 0.604144M1.01462 8.91676C1.29945 8.63274 1.64542 8.49218 2.05253 8.49509C2.45964 8.498 2.8056 8.64195 3.09043 8.92694C3.37527 9.21192 3.51695 9.55749 3.5155 9.96365C3.51404 10.3708 3.3709 10.7163 3.08607 11.0004C2.68139 11.4046 2.20537 11.659 1.65803 11.7637C1.11069 11.8679 0.558015 11.9467 0 12C0.0533754 11.4329 0.134652 10.8785 0.243829 10.3366C0.353005 9.79474 0.60945 9.32146 1.01462 8.91676ZM1.5343 9.44529C1.31837 9.66097 1.16868 9.91421 1.08522 10.205C1.00176 10.4958 0.940377 10.7973 0.901074 11.1094C1.21405 11.0702 1.5161 11.0071 1.80724 10.9204C2.09838 10.8336 2.35167 10.6827 2.56711 10.4675C2.71268 10.3221 2.78692 10.1488 2.78983 9.94765C2.79226 9.74603 2.72069 9.57252 2.57512 9.42712C2.42955 9.28171 2.25608 9.21216 2.05471 9.21847C1.85334 9.22428 1.67987 9.29989 1.5343 9.44529Z';

const ProductsIcon = ({ active, disabled, size = 16 }: { active: boolean; disabled?: boolean; size?: number }) => (
  <Svg width={size} height={size * 0.8125} viewBox="0 0 16 13" fill="none">
    <Path
      d="M14.0862 1.95027H12.7484H11.4737H10.6249V1.08028C10.6249 0.54089 10.172 0.100098 9.61107 0.100098H5.58588C5.02799 0.100098 4.57208 0.53799 4.57208 1.08028V1.95027H3.72325H2.44851H1.11377C0.552885 1.95027 0.0999756 2.38816 0.0999756 2.92755V11.1199C0.0999756 11.6593 0.552885 12.1001 1.11377 12.1001H2.45151H3.72625H11.4737H12.7484H14.0862C14.6441 12.1001 15.1 11.6622 15.1 11.1199V2.92755C15.097 2.38816 14.6441 1.95027 14.0862 1.95027ZM4.87502 2.53026H10.3249H11.1738V11.5201H4.02319V2.53026H4.87502ZM5.17496 1.08028C5.17496 0.859885 5.36092 0.680088 5.58888 0.680088H9.61407C9.84203 0.680088 10.028 0.859885 10.028 1.08028V1.95027H5.17496V1.08028ZM0.699856 11.1199V2.92755C0.699856 2.70715 0.885818 2.52736 1.11377 2.52736L3.72325 2.53026V7.17893V11.5201L1.11377 11.5172C0.885818 11.5201 0.699856 11.3403 0.699856 11.1199ZM3.72325 11.5201V7.17893V2.53026H3.42331V11.5201H3.72325ZM11.7736 11.5201V2.53026H11.4737V11.5201H11.7736ZM14.4971 11.1199C14.4971 11.3403 14.3111 11.5201 14.0832 11.5201H11.4737V2.53026H14.0832C14.3111 2.53026 14.4971 2.71005 14.4971 2.93045V11.1199Z"
      fill={disabled ? COLORS.textDisabled : (active ? COLORS.white : COLORS.textSecondary)}
    />
    <Path
      d="M3.72325 2.53026L1.11377 2.52736C0.885818 2.52736 0.699856 2.70715 0.699856 2.92755V11.1199C0.699856 11.3403 0.885818 11.5201 1.11377 11.5172L3.72325 11.5201M3.72325 2.53026H3.42331V11.5201H3.72325M3.72325 2.53026V7.17892V11.5201M11.4737 2.53026H11.7736V11.5201H11.4737M11.4737 2.53026V11.5201M11.4737 2.53026H14.0832C14.3111 2.53026 14.4971 2.71005 14.4971 2.93045V11.1199C14.4971 11.3403 14.3111 11.5201 14.0832 11.5201H11.4737M14.0862 1.95027H12.7484H11.4737H10.6249V1.08028C10.6249 0.54089 10.172 0.100098 9.61107 0.100098H5.58588C5.02799 0.100098 4.57208 0.53799 4.57208 1.08028V1.95027H3.72325H2.44851H1.11377C0.552885 1.95027 0.0999756 2.38816 0.0999756 2.92755V11.1199C0.0999756 11.6593 0.552885 12.1001 1.11377 12.1001H2.45151H3.72625H11.4737H12.7484H14.0862C14.6441 12.1001 15.1 11.6622 15.1 11.1199V2.92755C15.097 2.38816 14.6441 1.95027 14.0862 1.95027ZM4.87502 2.53026H10.3249H11.1738V11.5201H4.02319V2.53026H4.87502ZM5.17496 1.08028C5.17496 0.859885 5.36092 0.680088 5.58888 0.680088H9.61407C9.84203 0.680088 10.028 0.859885 10.028 1.08028V1.95027H5.17496V1.08028Z"
      stroke={disabled ? COLORS.textDisabled : (active ? COLORS.white : COLORS.textSecondary)}
      strokeWidth={0.2}
    />
  </Svg>
);

const PhasesIcon = ({ active, disabled, size = 15 }: { active: boolean; disabled?: boolean; size?: number }) => (
  <Svg width={size} height={size * 0.8667} viewBox="0 0 15 13" fill="none">
    <Path
      d="M13.9167 0.149902H11.8941H6.42128C6.29243 0.149902 6.18795 0.249623 6.18795 0.372616V2.59138H4.84492C4.71606 2.59138 4.61158 2.6911 4.61158 2.81409V4.66388H3.26843C3.13958 4.66388 3.0351 4.7636 3.0351 4.88659V7.1905H2.04902C1.92016 7.1905 1.81568 7.29022 1.81568 7.41321V9.49006H0.383327C0.25447 9.49006 0.149994 9.58978 0.149994 9.71278V11.9272C0.149994 12.0502 0.25447 12.1499 0.383327 12.1499H13.9167C14.0455 12.1499 14.15 12.0502 14.15 11.9272V0.372616C14.15 0.249623 14.0455 0.149902 13.9167 0.149902ZM11.6608 0.59533V2.59138H10.3177H6.65462V0.59533H11.6608ZM6.42128 3.03681H10.0843V4.66388H8.74129H5.07825V3.03681H6.42128ZM4.84492 5.1093H8.50795V7.1905H7.52176H3.50177V5.1093H4.84492ZM3.26843 7.63593H7.28842V9.49006H5.85618H2.28235V7.63593H3.26843ZM0.616661 9.93549H2.04902H5.62285V11.7045H0.616661V9.93549ZM13.6833 11.7045H6.08951V9.93549H7.52176C7.65061 9.93549 7.75509 9.83577 7.75509 9.71278V7.63593H8.74129C8.87014 7.63593 8.97462 7.53621 8.97462 7.41321V5.1093H10.3177C10.4465 5.1093 10.551 5.00958 10.551 4.88659V3.03681H11.8941C12.023 3.03681 12.1275 2.93708 12.1275 2.81409V0.59533H13.6833V11.7045Z"
      fill={disabled ? COLORS.textDisabled : (active ? COLORS.white : COLORS.textSecondary)}
      stroke={disabled ? COLORS.textDisabled : (active ? COLORS.white : COLORS.textSecondary)}
      strokeWidth={0.3}
    />
  </Svg>
);

const ActivitiesIcon = ({ active, disabled, size = 12 }: { active: boolean; disabled?: boolean; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
    <Path d={ACTIVITIES_ICON_PATH_D} fill={disabled ? COLORS.textDisabled : (active ? COLORS.white : COLORS.textSecondary)} />
  </Svg>
);


export type SalesFlowTab = 'produtos' | 'fases' | 'atividades';

// ========================================
// PROPS DO COMPONENTE (estado gerenciado pelo pai)
// ========================================
type Props = {
  selectedProductId: string | null;
  selectedPhaseId: string | null;
  selectedActivityId: string | null;
  activeTab: SalesFlowTab;
  onProductSelect: (productId: string) => void;
  onPhaseSelect: (phaseId: string) => void;
  onActivitySelect: (activityId: string) => void;
  onTabChange: (tab: SalesFlowTab) => void;
  contextCardVisible: boolean;
  customerName?: string; //...............Nome do cliente
  customerPhoto?: any; //................Foto do cliente
};

const CustomersInformationGroupSalesFlowOrchestrator: React.FC<Props> = ({
  selectedProductId,
  selectedPhaseId,
  selectedActivityId,
  activeTab,
  onProductSelect,
  onPhaseSelect,
  onActivitySelect,
  onTabChange,
  contextCardVisible,
  customerName,
  customerPhoto,
}) => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Verifica se a aba Fases deve estar habilitada (somente se produto estiver selecionado)
  const isPhasesTabEnabled = selectedProductId !== null;

  // Verifica se a aba Atividades deve estar habilitada (somente se fase estiver selecionada)
  const isActivitiesTabEnabled = selectedPhaseId !== null;

  // Callback para mudar de aba (com validacao)
  const handleTabChange = useCallback((tabId: SalesFlowTab) => {
    // Se tentar acessar Fases sem produto selecionado, bloqueia
    if (tabId === 'fases' && !isPhasesTabEnabled) {
      return;
    }
    // Se tentar acessar Atividades sem fase selecionada, bloqueia
    if (tabId === 'atividades' && !isActivitiesTabEnabled) {
      return;
    }
    onTabChange(tabId);
  }, [isPhasesTabEnabled, isActivitiesTabEnabled, onTabChange]);

  // Obter dados do produto selecionado
  const selectedProduct = useMemo(() => {
    return PRODUCTS_DATA.find(p => p.id === selectedProductId) || null;
  }, [selectedProductId]);

  // Obter dados da fase selecionada
  const selectedPhase = useMemo(() => {
    return PHASES_DATA.find(p => p.id === selectedPhaseId) || null;
  }, [selectedPhaseId]);

  // Obter fases do produto selecionado
  const phasesForProduct = useMemo(() => {
    if (!selectedProductId) return [];
    return PHASES_DATA.filter(p => p.productId === selectedProductId);
  }, [selectedProductId]);

  // Obter atividades da fase selecionada
  const activitiesForPhase = useMemo(() => {
    if (!selectedPhaseId) return [];
    return ACTIVITIES_DATA.filter(a => a.phaseId === selectedPhaseId);
  }, [selectedPhaseId]);

  // Obter indice do produto selecionado
  const selectedProductIndex = useMemo(() => {
    if (!selectedProductId) return 0;
    const idx = PRODUCTS_DATA.findIndex(p => p.id === selectedProductId);
    return idx >= 0 ? idx + 1 : 0;
  }, [selectedProductId]);

  // Obter indice da fase selecionada (dentro do produto)
  const selectedPhaseIndex = useMemo(() => {
    if (!selectedPhaseId || !selectedProductId) return 0;
    const idx = phasesForProduct.findIndex(p => p.id === selectedPhaseId);
    return idx >= 0 ? idx + 1 : 0;
  }, [selectedPhaseId, selectedProductId, phasesForProduct]);

  // Obter dados da atividade selecionada
  const selectedActivity = useMemo(() => {
    return ACTIVITIES_DATA.find(a => a.id === selectedActivityId) || null;
  }, [selectedActivityId]);

  // Obter indice da atividade selecionada (dentro da fase)
  const selectedActivityIndex = useMemo(() => {
    if (!selectedActivityId || !selectedPhaseId) return 0;
    const idx = activitiesForPhase.findIndex(a => a.id === selectedActivityId);
    return idx >= 0 ? idx + 1 : 0;
  }, [selectedActivityId, selectedPhaseId, activitiesForPhase]);

  // Construir objeto customerInfo com dados do sistema
  const customerInfo: CustomerInfoProps = useMemo(() => ({
    name: customerName, //.................Nome do cliente (vindo do pai)
    photo: customerPhoto, //...............Foto do cliente (vindo do pai)
    productName: selectedProduct?.title, //..Nome do produto selecionado
    phaseName: selectedPhase?.title, //.....Nome da fase selecionada
    productIndex: selectedProductIndex, //...Indice do produto
    totalProducts: PRODUCTS_DATA.length, //..Total de produtos
    phaseIndex: selectedPhaseIndex, //.......Indice da fase
    totalPhases: phasesForProduct.length, //..Total de fases
  }), [customerName, customerPhoto, selectedProduct, selectedPhase, selectedProductIndex, selectedPhaseIndex, phasesForProduct.length]);

  const tabs = useMemo(
    () =>
      [
        { id: 'produtos' as const, label: 'Produtos', icon: ProductsIcon, disabled: false },
        { id: 'fases' as const, label: 'Fases', icon: PhasesIcon, disabled: !isPhasesTabEnabled },
        { id: 'atividades' as const, label: 'Atividades', icon: ActivitiesIcon, disabled: !isActivitiesTabEnabled },
      ] as const,
    [isPhasesTabEnabled, isActivitiesTabEnabled]
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.tabsWrap}>
        <View style={styles.tabsBase}>
          {tabs.map((t) => {
            const isActive = t.id === activeTab;
            const isDisabled = t.disabled;
            const Icon = t.icon;

            let iconSize = ICON_SIZE_PRODUTOS;
            let iconGap = ICON_GAP_PRODUTOS;
            if (t.id === 'fases') {
              iconSize = ICON_SIZE_FASES;
              iconGap = ICON_GAP_FASES;
            } else if (t.id === 'atividades') {
              iconSize = ICON_SIZE_ATIVIDADES;
              iconGap = ICON_GAP_ATIVIDADES;
            }

            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={isDisabled ? 1 : 0.9}
                style={[
                  styles.tabBtn,
                  isActive ? styles.tabBtnActive : null,
                  isDisabled ? styles.tabBtnDisabled : null,
                ]}
                onPress={() => handleTabChange(t.id)}
              >
                <View style={[styles.tabIcon, { width: iconSize, height: iconSize }]}>
                  <Icon active={isActive} disabled={isDisabled} size={iconSize} />
                </View>
                <View style={{ width: iconGap }} />
                <Text style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : null,
                  isDisabled ? styles.tabTextDisabled : null,
                ]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.content}>
        {activeTab === 'produtos' && (
          <CustomersInformationGroupSalesFlowProducts
            products={PRODUCTS_DATA}
            selectedProductId={selectedProductId}
            onProductSelect={onProductSelect}
            contextCardVisible={contextCardVisible}
            selectedProduct={selectedProduct}
            selectedProductIndex={selectedProductIndex}
            totalProducts={PRODUCTS_DATA.length}
            selectedPhase={selectedPhase}
            selectedPhaseIndex={selectedPhaseIndex}
            totalPhases={phasesForProduct.length}
            selectedActivity={selectedActivity}
            selectedActivityIndex={selectedActivityIndex}
            totalActivities={activitiesForPhase.length}
          />
        )}
        {activeTab === 'fases' && (
          <CustomersInformationGroupSalesFlowPhases
            phases={phasesForProduct}
            selectedPhaseId={selectedPhaseId}
            onPhaseSelect={onPhaseSelect}
            selectedProduct={selectedProduct}
            selectedProductIndex={selectedProductIndex}
            totalProducts={PRODUCTS_DATA.length}
            contextCardVisible={contextCardVisible}
            selectedActivity={selectedActivity}
            selectedActivityIndex={selectedActivityIndex}
            totalActivities={activitiesForPhase.length}
          />
        )}
        {activeTab === 'atividades' && (
          <CustomersInformationGroupSalesFlowActivities
            activities={activitiesForPhase}
            selectedActivityId={selectedActivityId}
            onActivitySelect={onActivitySelect}
            selectedProduct={selectedProduct}
            selectedPhase={selectedPhase}
            selectedProductIndex={selectedProductIndex}
            selectedPhaseIndex={selectedPhaseIndex}
            totalProducts={PRODUCTS_DATA.length}
            totalPhases={phasesForProduct.length}
            contextCardVisible={contextCardVisible}
            customerInfo={customerInfo}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabsWrap: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 0,
    backgroundColor: COLORS.white,
  },
  tabsBase: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 6,
    padding: 4,
    borderWidth: 0.3,
    borderColor: COLORS.border,
    gap: 6,
  },
  tabBtn: {
    flex: 1,
    height: 35, // Ajustar Altura das abas Produtos/Fases/Atividades: ajustar aqui (atual: 36px, padrao era 40px)
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabBtnActive: {
    backgroundColor: COLORS.primary,
  },
  tabBtnDisabled: {
    opacity: 0.6, // opacidade para aba desabilitada
  },
  tabIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  tabTextDisabled: {
    color: COLORS.textDisabled,
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

export default CustomersInformationGroupSalesFlowOrchestrator;