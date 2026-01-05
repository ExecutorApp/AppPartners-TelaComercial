import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet as RNStyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Borders } from '../../constants/theme';
import FullFlow from './02.06.NewSale-FullFlow';
import SlideInView from './SlideInView';
import ModalExcludePaymentMethod from './02.05.NewSale-PaymentMethod-DeletePayment';
import CreditCardInstallmentModal from './02.05.NewSale-PaymentMethod-CreditCard';
// DateTime será exibida pelo fluxo principal (CalendarHomeScreen),
// então removemos a abertura interna desta tela.
// Dados mínimos locais para manter filtros e lista funcionando sem ./data.
type Professional = {
  id: string;
  name: string;
  role: string;
  sector: string;
  area: string;
  profile: string;
  profileDisplay?: string;
  photo: any;
};

const sectors: string[] = ['Direção', 'Comercial', 'Operacional'];
const areasBySector: Record<string, string[]> = {
  Direção: ['Estratégica', 'Técnica'],
  Comercial: ['Time Interno', 'Time Externo (Partners)'],
  Operacional: ['Jurídico', 'Administrativo', 'Atendimento ao Cliente'],
};
const profilesByArea: Record<string, string[]> = {
  Estratégica: ['Gestor de Projeto'],
  Técnica: ['Expert'],
  'Time Interno': ['SDR (pré-venda)', 'Closer (Fechador de contrato)', 'Gestor Comercial'],
  'Time Externo (Partners)': ['Partner (Perceiro comercial externo)', 'Gestor Comercial'],
  Jurídico: ['Estagiário', 'Paralegal Júnior', 'Paralegal Pleno', 'Paralegal Sênior', 'Advogado Júnior', 'Advogado Pleno', 'Advogado Sênior', 'Gestor Jurídico'],
  Administrativo: ['Assistente Administrativo', 'Controle de Documentos', 'Gestor Administrativo'],
  'Atendimento ao Cliente': ['Assistente de Relacionamento', 'Suporte ao Cliente', 'Gestor de Atendimento'],
};

const professionalsData: Professional[] = [
  { id: 'p1', name: 'Ana Souza', role: 'Advogada', sector: 'Jurídico', area: 'Cível', profile: 'Advogado', photo: require('../../../assets/01-Foto.png') },
  { id: 'p2', name: 'Bruno Lima', role: 'Analista', sector: 'Operacional', area: 'Jurídico', profile: 'Analista', photo: require('../../../assets/02-Foto.png') },
  { id: 'p3', name: 'Carla Mendes', role: 'Coordenadora', sector: 'Operacional', area: 'Financeiro', profile: 'Coordenador', photo: require('../../../assets/03-Foto.png') },
  { id: 'p4', name: 'Diego Alves', role: 'Advogado', sector: 'Jurídico', area: 'Trabalhista', profile: 'Advogado', photo: require('../../../assets/04-Foto.png') },
];

// ---------- Geração de 30 profissionais (mesma lógica do modal de filtros) ----------
const namesPool = [
  'Joaquim Aparecido Bernardo', 'Ana Luiza Martins', 'Bruno César Azevedo', 'Carla Nunes', 'Diego Almeida',
  'Rafaela Souza', 'Marcos Vinicius', 'Paula Ferreira', 'Renato Gomes', 'Camila Rodrigues',
  'Felipe Santos', 'Larissa Teixeira', 'Gustavo Silva', 'Patrícia Moreira', 'Thiago Ribeiro',
  'Juliana Costa', 'Lucas Monteiro', 'Fernanda Oliveira', 'André Pereira', 'Beatriz Santos',
  'Sérgio Carvalho', 'Aline Dias', 'Daniel Albuquerque', 'Marta Figueiredo', 'Ricardo Lopes',
  'Isabela Rocha', 'Hugo Fernandes', 'Letícia Barreto', 'Eduardo Campos', 'Natália Pires'
];

const photosPool = [
  require('../../../assets/01-Foto.png'),
  require('../../../assets/02-Foto.png'),
  require('../../../assets/03-Foto.png'),
  require('../../../assets/04-Foto.png'),
  require('../../../assets/05-Foto.png'),
];

const profileVariants: Record<string, string[]> = {
  Advogado: ['Advogado Júnior', 'Advogado Pleno', 'Advogado Sênior'],
  Analista: ['Analista Júnior', 'Analista Pleno', 'Analista Sênior'],
  Coordenador: ['Coordenador', 'Coordenador de Projetos', 'Coordenador Administrativo'],
  'SDR (pré-venda)': ['SDR (pré-venda)'],
  'Closer (Fechador de contrato)': ['Closer (Fechador de contrato)'],
  'Gestor Comercial': ['Gestor Comercial'],
  'Partner (Perceiro comercial externo)': ['Partner (Perceiro comercial externo)'],
  'Gestor Jurídico': ['Gestor Jurídico'],
  'Assistente Administrativo': ['Assistente Administrativo'],
  'Controle de Documentos': ['Controle de Documentos'],
  'Gestor Administrativo': ['Gestor Administrativo'],
  'Assistente de Relacionamento': ['Assistente de Relacionamento'],
  'Suporte ao Cliente': ['Suporte ao Cliente'],
  'Gestor de Atendimento': ['Gestor de Atendimento'],
  'Gestor de Projeto': ['Gestor de Projeto'],
  Expert: ['Expert'],
};

function generate30Professionals(
  sectors: string[],
  areasBySector: Record<string, string[]>,
  profilesByArea: Record<string, string[]>
): Professional[] {
  const baseCombos: Array<{ sector: string; area: string; profile: string; variants: string[] }> = [];
  sectors.forEach((sector) => {
    (areasBySector[sector] ?? []).forEach((area) => {
      (profilesByArea[area] ?? []).forEach((profile) => {
        const variants = profileVariants[profile] ?? [profile];
        variants.forEach((pv) => baseCombos.push({ sector, area, profile, variants: [pv] }));
      });
    });
  });

  const targetComboCount = 10;
  const combos: Array<{ sector: string; area: string; profile: string; display: string }> = [];
  let ci = 0;
  while (combos.length < targetComboCount && baseCombos.length > 0) {
    const bc = baseCombos[ci % baseCombos.length];
    const display = bc.variants[0];
    combos.push({ sector: bc.sector, area: bc.area, profile: bc.profile, display });
    ci++;
  }

  const out: Professional[] = [];
  let nIdx = 0;
  let pIdx = 0;
  combos.forEach((c, comboIndex) => {
    for (let k = 0; k < 3; k++) {
      const id = `pro-${comboIndex + 1}-${k + 1}`;
      out.push({
        id,
        name: namesPool[nIdx++ % namesPool.length],
        role: c.profile,
        photo: photosPool[pIdx++ % photosPool.length],
        sector: c.sector,
        area: c.area,
        profile: c.profile,
        profileDisplay: c.display,
      });
    }
  });
  return out.slice(0, 30);
}

interface NewAppointmentProfessionalsProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  onNext?: (professionalId?: string | null) => void;
  onSelectProfessional?: (professionalId: string | null) => void;
  summaries?: Partial<Record<number, string>>;
  onSelectStep?: (index: number) => void;
  onUpdateSummary?: (step: number, value: string) => void;
  maxAccessibleStep?: number;
  transitionDirection?: 'forward' | 'backward';
  embedded?: boolean;
  registerNextHandler?: (handler: () => void) => void;
  onCanProceedChange?: (canProceed: boolean) => void;
}

// Ícone Olho (visualização) – original do Figma com fill #3A3F51
const EyeIcon: React.FC = () => (
  <Svg width={23} height={14} viewBox="0 0 23 14" fill="none">
    <Path d="M11.5 0C5.46878 0 0.364891 6.3 0.149234 6.573C0.0524697 6.6954 0 6.84553 0 7C0 7.15447 0.0524697 7.3046 0.149234 7.427C0.364891 7.7 5.46878 14 11.5 14C17.5312 14 22.6351 7.7 22.8508 7.427C22.9475 7.3046 23 7.15447 23 7C23 6.84553 22.9475 6.6954 22.8508 6.573C22.6351 6.3 17.5312 0 11.5 0ZM11.5 12.6C7.02152 12.6 2.87371 8.4 1.65165 7C2.87371 5.6 7.01433 1.4 11.5 1.4C15.9857 1.4 20.1263 5.6 21.3484 7C20.1263 8.4 15.9857 12.6 11.5 12.6Z" fill="#3A3F51"/>
    <Path d="M15.0943 6.3C15.2129 6.29991 15.3297 6.27122 15.4342 6.21649C15.5387 6.16176 15.6277 6.0827 15.6932 5.98635C15.7586 5.89001 15.7986 5.77937 15.8095 5.66433C15.8204 5.54928 15.8019 5.43339 15.7556 5.327C15.3602 4.56023 14.7517 3.9169 13.9994 3.47018C13.2471 3.02345 12.3811 2.79126 11.5 2.8C10.3561 2.8 9.25902 3.2425 8.45014 4.03015C7.64127 4.8178 7.18685 5.88609 7.18685 7C7.18685 8.11391 7.64127 9.1822 8.45014 9.96985C9.25902 10.7575 10.3561 11.2 11.5 11.2C12.3811 11.2087 13.2471 10.9765 13.9994 10.5298C14.7517 10.0831 15.3602 9.43977 15.7556 8.673C15.8019 8.56661 15.8204 8.45072 15.8095 8.33568C15.7986 8.22063 15.7586 8.11 15.6932 8.01365C15.6277 7.9173 15.5387 7.83824 15.4342 7.78351C15.3297 7.72879 15.2129 7.7001 15.0943 7.7C14.9974 7.7099 14.8994 7.6986 14.8076 7.66692C14.7158 7.63525 14.6324 7.58399 14.5635 7.51691C14.4946 7.44982 14.4419 7.36859 14.4094 7.27916C14.3769 7.18973 14.3653 7.09436 14.3754 7C14.3653 6.90564 14.3769 6.81027 14.4094 6.72084C14.4419 6.63141 14.4946 6.55018 14.5635 6.48309C14.6324 6.41601 14.7158 6.36475 14.8076 6.33308C14.8994 6.3014 14.9974 6.2901 15.0943 6.3Z" fill="#3A3F51"/>
  </Svg>
);

// Ícone X (fechar) – original do Figma com fill #3A3F51
const CloseIcon: React.FC = () => (
  <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
    <Path d="M12.655 0.247926C12.2959 -0.0821192 11.7339 -0.0827124 11.374 0.246573L6.5 4.70646L1.62595 0.246573C1.26609 -0.0827126 0.704125 -0.0821187 0.344999 0.247926L0.291597 0.297004C-0.0977822 0.654853 -0.0971065 1.25701 0.293074 1.61404L5.08634 6L0.293074 10.386C-0.0971063 10.743 -0.0977808 11.3451 0.291598 11.703L0.345 11.7521C0.704126 12.0821 1.26609 12.0827 1.62595 11.7534L6.5 7.29354L11.374 11.7534C11.7339 12.0827 12.2959 12.0821 12.655 11.7521L12.7084 11.703C13.0978 11.3451 13.0971 10.743 12.7069 10.386L7.91366 6L12.7069 1.61404C13.0971 1.25701 13.0978 0.654853 12.7084 0.297004L12.655 0.247926Z" fill="#3A3F51"/>
  </Svg>
);

const PlusSquareIcon: React.FC = () => (
  <Svg width={40} height={35} viewBox="0 0 40 35" fill="none">
    <Rect x={0.25} y={0.25} width={39.5} height={34.5} rx={5.75} fill="#1777CF" />
    <Rect x={0.25} y={0.25} width={39.5} height={34.5} rx={5.75} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path d="M25.1818 16.4091H21.0909V12.3182C21.0909 11.8665 20.7244 11.5 20.2727 11.5H19.7273C19.2756 11.5 18.9091 11.8665 18.9091 12.3182V16.4091H14.8182C14.3665 16.4091 14 16.7756 14 17.2273V17.7727C14 18.2244 14.3665 18.5909 14.8182 18.5909H18.9091V22.6818C18.9091 23.1335 19.2756 23.5 19.7273 23.5H20.2727C20.7244 23.5 21.0909 23.1335 21.0909 22.6818V18.5909H25.1818C25.6335 18.5909 26 18.2244 26 17.7727V17.2273C26 16.7756 25.6335 16.4091 25.1818 16.4091Z" fill="#FCFCFC" />
  </Svg>
);

const TrashSquareIcon: React.FC = () => (
  <Svg width={40} height={35} viewBox="0 0 40 35" fill="none">
    <Rect width={40} height={35} rx={4} fill="#FF0004" fillOpacity={0.05} />
    <Rect width={40} height={35} rx={4} stroke="#EDF2F6" />
    <Path d="M18.7 16.1364C19.0333 16.1364 19.3081 16.3996 19.3456 16.7387L19.35 16.8182V20.9091C19.35 21.2856 19.059 21.5909 18.7 21.5909C18.3667 21.5909 18.0919 21.3277 18.0544 20.9886L18.05 20.9091V16.8182C18.05 16.4416 18.341 16.1364 18.7 16.1364Z" fill="#EF4444" />
    <Path d="M21.9456 16.7387C21.9081 16.3996 21.6333 16.1364 21.3 16.1364C20.941 16.1364 20.65 16.4416 20.65 16.8182V20.9091L20.6544 20.9886C20.6919 21.3277 20.9667 21.5909 21.3 21.5909C21.659 21.5909 21.95 21.2856 21.95 20.9091V16.8182L21.9456 16.7387Z" fill="#EF4444" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M21.3 10C22.3385 10 23.1874 10.8515 23.2467 11.9253L23.25 12.0455V12.7273H25.85C26.209 12.7273 26.5 13.0325 26.5 13.4091C26.5 13.7588 26.2491 14.0469 25.9258 14.0863L25.85 14.0909H25.2V22.9545C25.2 24.0439 24.3882 24.9343 23.3646 24.9965L23.25 25H16.75C15.7115 25 14.8626 24.1485 14.8033 23.0747L14.8 22.9545V14.0909H14.15C13.791 14.0909 13.5 13.7856 13.5 13.4091C13.5 13.0594 13.7509 12.7712 14.0742 12.7319L14.15 12.7273H16.75V12.0455C16.75 10.9561 17.5618 10.0657 18.5854 10.0035L18.7 10H21.3ZM16.1 14.0909V22.9545C16.1 23.3042 16.3509 23.5924 16.6742 23.6318L16.75 23.6364H23.25C23.5833 23.6364 23.8581 23.3732 23.8956 23.0341L23.9 22.9545V14.0909H16.1ZM21.95 12.7273H18.05V12.0455L18.0544 11.9659C18.0919 11.6268 18.3667 11.3636 18.7 11.3636H21.3L21.3758 11.3682C21.6991 11.4076 21.95 11.6958 21.95 12.0455V12.7273Z" fill="#EF4444" />
  </Svg>
);

// Ícone de busca (SVG fornecido)
const SearchIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M15 15L11.6556 11.6556M13.4444 7.22222C13.4444 10.6587 10.6587 13.4444 7.22222 13.4444C3.78578 13.4444 1 10.6587 1 7.22222C1 3.78578 3.78578 1 7.22222 1C10.6587 1 13.4444 3.78578 13.4444 7.22222Z"
      stroke="#7D8592"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Formata para deixar a primeira letra da primeira palavra em maiúscula
const capitalizeFirstLetter = (s: string) => {
  if (!s) return s;
  return s.replace(/^(\s*)([a-zA-ZÀ-ÖØ-öø-ÿ])/u, (_, spaces: string, letter: string) => spaces + letter.toUpperCase());
};

// Radio – padrão visual
const RadioIcon = ({ selected }: { selected: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
      fill={selected ? '#1777CF' : '#6F7DA0'}
      stroke="#FCFCFC"
    />
    {selected ? <Path d="M10 5a5 5 0 100 10 5 5 0 000-10z" fill="#1777CF"/> : null}
  </Svg>
);

const RadioDot: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    {selected ? (
      <>
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
          fill="#1777CF"
        />
        <Path d="M5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10C15 12.7614 12.7614 15 10 15C7.23858 15 5 12.7614 5 10Z" fill="#1777CF" />
      </>
    ) : (
      // borda inativa mais encorpada, sem stroke branco
      <Circle cx={10} cy={10} r={8} stroke="#6F7DA0" strokeWidth={1.5} fill="none" />
    )}
  </Svg>
);

const NewAppointmentProfessionals: React.FC<NewAppointmentProfessionalsProps> = ({ visible, transitionDirection = 'forward', onClose, onBack, onNext, onSelectProfessional, summaries, onSelectStep, onUpdateSummary, maxAccessibleStep = 1, embedded = false, registerNextHandler, onCanProceedChange }) => {
  const professionals: Professional[] = useMemo(() => professionalsData, []);

  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [fullFlowVisible, setFullFlowVisible] = useState<boolean>(false);
  // A DateTime será aberta pelo fluxo principal (etapa 7)
  const [selectedSector, setSelectedSector] = useState<string>('Todos');
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [selectedProfile, setSelectedProfile] = useState<string>('Todos');

  const availableAreas = useMemo(() => (
    selectedSector && selectedSector !== 'Todos'
      ? (areasBySector[selectedSector] || [])
      : Object.values(areasBySector).flat()
  ), [selectedSector]);

  const availableProfiles = useMemo(() => (
    selectedArea && selectedArea !== 'Todas'
      ? (profilesByArea[selectedArea] || [])
      : Object.values(profilesByArea).flat()
  ), [selectedArea]);

  const cycleSector = () => {
    const list = ['Todos', ...sectors];
    const idx = list.indexOf(selectedSector);
    const next = list[(idx + 1) % list.length];
    setSelectedSector(next);
    setSelectedArea('Todas');
    setSelectedProfile('Todos');
  };

  const cycleArea = () => {
    const list = ['Todas', ...availableAreas];
    const idx = list.indexOf(selectedArea);
    const next = list[(idx + 1) % list.length];
    setSelectedArea(next);
    setSelectedProfile('Todos');
  };

  const cycleProfile = () => {
    const list = ['Todos', ...availableProfiles];
    const idx = list.indexOf(selectedProfile);
    const next = list[(idx + 1) % list.length];
    setSelectedProfile(next);
  };

  const isBackDisabled = false; // Na referência, botão Voltar aparece ativo
  const isNextDisabled = useMemo(() => selectedProfessional === null, [selectedProfessional]);
  // Notifica rodapé unificado sobre possibilidade de prosseguir
  useEffect(() => {
    onCanProceedChange?.(!isNextDisabled);
  }, [isNextDisabled, onCanProceedChange]);
  // Registra handler do botão "Próximo" quando em modo embed
  useEffect(() => {
    if (!embedded || !registerNextHandler) return;
    registerNextHandler(() => {
      if (!isNextDisabled) {
        onNext?.(selectedProfessional);
      }
    });
  }, [embedded, registerNextHandler, isNextDisabled, selectedProfessional, onNext]);

  // Seleção padrão: Nenhum (ao abrir a etapa)
  useEffect(() => {
    if (visible) {
      setSelectedProfessional(null);
      onSelectProfessional?.(null);
      onUpdateSummary?.(6, 'Nenhum');
      console.log('[Professionals] Tela visível: resumo(6) -> Nenhum');
    }
  }, [visible]);

  // Normalização para busca: remove acentos e compara em minúsculas
  const normalizeText = (str: string) => str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  const enrichedProfessionals = useMemo(() => {
    const base = Array.isArray(professionals) ? professionals : [];
    if (base.length >= 30) return base;
    try {
      return generate30Professionals(sectors, areasBySector, profilesByArea);
    } catch {
      return base; // fallback seguro
    }
  }, [professionals]);

  const filteredProfessionals = useMemo(() => {
    const sText = normalizeText(search);
    let base = enrichedProfessionals;
    if (selectedSector && selectedSector !== 'Todos') base = base.filter((p) => p.sector === selectedSector);
    if (selectedArea && selectedArea !== 'Todas') base = base.filter((p) => p.area === selectedArea);
    if (selectedProfile && selectedProfile !== 'Todos') base = base.filter((p) => p.profile === selectedProfile);
    if (!sText) return base;
    return base.filter((p) => {
      const nameNorm = normalizeText(p.name);
      const roleNorm = normalizeText(p.role);
      const profileNorm = normalizeText(p.profileDisplay ?? p.profile);
      return nameNorm.includes(sText) || roleNorm.includes(sText) || profileNorm.includes(sText);
    });
  }, [search, enrichedProfessionals, selectedSector, selectedArea, selectedProfile]);

  const handleSelectNone = () => {
    setSelectedProfessional(null);
    onSelectProfessional?.(null);
    onUpdateSummary?.(6, 'Nenhum');
    console.log('[Professionals] Selecionado: Nenhum');
  };

  const handleSelectProfessional = (id: string) => {
    setSelectedProfessional(id);
    onSelectProfessional?.(id);
    const item = enrichedProfessionals.find((p) => p.id === id);
    onUpdateSummary?.(6, item?.name ?? id);
    console.log('[Professionals] Selecionado:', id, '->', item?.name ?? id);
  };

  // Renderização apenas do conteúdo central quando embed=true (sem cabeçalho/rodapé)
  if (embedded) {
    return (
      <>
      <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
        <View style={styles.contentFlex}>
          {/* Bloco introdutório */}
          <View style={styles.introContainer}>
            <View style={styles.centerBlock}>
              <Text style={styles.sectionTitle}>Profissionais</Text>
              <Text style={styles.sectionSubtitle}>Selecione um profissional para continuar</Text>
            </View>

            {/* Indicador de passos (7 passos, 1–6 ativos) */}
            <View style={styles.stepsRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.stepDot, i < 5 ? styles.stepDotActive : styles.stepDotInactive]} />
              ))}
            </View>
          </View>

          {/* Filtros (carrossel horizontal: Setores, Áreas, Perfis) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Setores" onPress={cycleSector}>
              <Text style={styles.filterLabel}>Setores</Text>
              <Text style={styles.filterValue}>{selectedSector}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Áreas" onPress={cycleArea}>
              <Text style={styles.filterLabel}>Áreas</Text>
              <Text style={styles.filterValue}>{selectedArea}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Perfis" onPress={cycleProfile}>
              <Text style={styles.filterLabel}>Perfis</Text>
              <Text style={styles.filterValue}>{selectedProfile ?? 'Todos'}</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Busca */}
          <View style={styles.searchRow}>
            <View style={styles.searchIconWrap}><SearchIcon /></View>
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={(text) => setSearch(capitalizeFirstLetter(text))}
              placeholder="pesquise aqui"
              placeholderTextColor="#91929E"
              cursorColor="#1777CF"
              selectionColor="#1777CF"
            />
          </View>

          {/* Nenhum */}
          <TouchableOpacity style={styles.noneRow} onPress={handleSelectNone} accessibilityRole="button" accessibilityLabel="Selecionar nenhum">
            <RadioIcon selected={selectedProfessional === null} />
            <Text style={styles.noneLabel}>Nenhum</Text>
          </TouchableOpacity>
          <View style={styles.listDivider} />

          {/* Lista de profissionais (Card conforme snippet) */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filteredProfessionals.map((p) => (
              <View key={p.id} style={styles.cardContainer}>
                {/* Coluna esquerda da foto */}
                <View style={styles.leftColumn}>
                  <View style={styles.leftImageBox}>
                    <Image source={p.photo} style={styles.leftImage} resizeMode="cover" />
                  </View>
                  {/* Overlay rádio (mesmo comportamento do modal) */}
                  <TouchableOpacity
                    style={styles.leftOverlay}
                    activeOpacity={1}
                    onPress={() => {
                      if (selectedProfessional === p.id) {
                        handleSelectNone();
                      } else {
                        handleSelectProfessional(p.id);
                      }
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`Selecionar ${p.name}`}
                  >
                    <View style={{ position: 'absolute', left: 30, top: 10 }}>
                      <RadioDot selected={selectedProfessional === p.id} />
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Coluna direita com info */}
                <TouchableOpacity style={styles.rightColumn} onPress={() => handleSelectProfessional(p.id)} accessibilityRole="button" accessibilityLabel={`Selecionar ${p.name}`}>
                  <View style={styles.nameRow}><Text style={styles.nameText}>{p.name}</Text></View>
                  <View style={styles.thinLine} />
                  <View style={styles.infoGroup}>
                    <View style={styles.labelRow}><Text style={styles.labelText}>Setor:</Text></View>
                    <View style={styles.valueRow}><Text style={styles.valueText}>{p.sector}</Text></View>
                  </View>
                  <View style={styles.thinLine} />
                  <View style={styles.infoGroup}>
                    <View style={styles.labelRow}><Text style={styles.labelText}>Área:</Text></View>
                    <View style={styles.valueRow}><Text style={styles.valueText}>{p.area}</Text></View>
                  </View>
                  <View style={styles.thinLine} />
                  <View style={styles.infoGroup}>
                    <View style={styles.labelRow}><Text style={styles.labelText}>Perfil:</Text></View>
                    <View style={styles.valueRow}><Text style={styles.valueText}>{p.profileDisplay ?? p.profile}</Text></View>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      </SlideInView>
      
      </>
    );
  }

  return (
    <>
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Cabeçalho */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>Nova venda</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => setFullFlowVisible(true)} accessibilityRole="button" accessibilityLabel="Visualizar">
                <EyeIcon />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
                <CloseIcon />
              </TouchableOpacity>
            </View>
          </View>

          {/* Conteúdo central */}
        <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
          <View style={styles.contentFlex}>
            {/* Bloco introdutório */}
            <View style={styles.introContainer}>
              <View style={styles.centerBlock}>
                <Text style={styles.sectionTitle}>Profissionais</Text>
                <Text style={styles.sectionSubtitle}>Selecione um profissional para continuar</Text>
              </View>

              {/* Indicador de passos (7 passos, 1–6 ativos) */}
              <View style={styles.stepsRow}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={[styles.stepDot, i < 5 ? styles.stepDotActive : styles.stepDotInactive]} />
                ))}
              </View>
            </View>

            {/* Filtros (carrossel horizontal: Setores, Áreas, Perfis) */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filtersRow}
            >
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Setores" onPress={cycleSector}>
              <Text style={styles.filterLabel}>Setores</Text>
              <Text style={styles.filterValue}>{selectedSector}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Áreas" onPress={cycleArea}>
              <Text style={styles.filterLabel}>Áreas</Text>
              <Text style={styles.filterValue}>{selectedArea}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterCard} accessibilityRole="button" accessibilityLabel="Filtro Perfis" onPress={cycleProfile}>
              <Text style={styles.filterLabel}>Perfis</Text>
              <Text style={styles.filterValue}>{selectedProfile ?? 'Todos'}</Text>
            </TouchableOpacity>
            </ScrollView>

            {/* Busca */}
            <View style={styles.searchRow}>
              <View style={styles.searchIconWrap}><SearchIcon /></View>
              <TextInput
                style={styles.searchInput}
                value={search}
                onChangeText={(text) => setSearch(capitalizeFirstLetter(text))}
                placeholder="pesquise aqui"
                placeholderTextColor="#91929E"
                cursorColor="#1777CF"
                selectionColor="#1777CF"
              />
            </View>

            {/* Nenhum */}
            <TouchableOpacity style={styles.noneRow} onPress={handleSelectNone} accessibilityRole="button" accessibilityLabel="Selecionar nenhum">
              <RadioIcon selected={selectedProfessional === null} />
              <Text style={styles.noneLabel}>Nenhum</Text>
            </TouchableOpacity>
            <View style={styles.listDivider} />

            {/* Lista de profissionais (Card conforme snippet) */}
            <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
              {filteredProfessionals.map((p) => (
                <View key={p.id} style={styles.cardContainer}>
                  {/* Coluna esquerda da foto */}
                  <View style={styles.leftColumn}>
                    <View style={styles.leftImageBox}>
                      <Image source={p.photo} style={styles.leftImage} resizeMode="cover" />
                    </View>
                    {/* Overlay rádio (mesmo comportamento do modal) */}
                    <TouchableOpacity
                      style={styles.leftOverlay}
                      activeOpacity={1}
                      onPress={() => {
                        if (selectedProfessional === p.id) {
                          handleSelectNone();
                        } else {
                          handleSelectProfessional(p.id);
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar ${p.name}`}
                    >
                      <View style={{ position: 'absolute', left: 30, top: 10 }}>
                        <RadioDot selected={selectedProfessional === p.id} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  {/* Coluna direita com info */}
                  <TouchableOpacity style={styles.rightColumn} onPress={() => handleSelectProfessional(p.id)} accessibilityRole="button" accessibilityLabel={`Selecionar ${p.name}`}>
                    <View style={styles.nameRow}><Text style={styles.nameText}>{p.name}</Text></View>
                    <View style={styles.thinLine} />
                    <View style={styles.infoGroup}>
                      <View style={styles.labelRow}><Text style={styles.labelText}>Setor:</Text></View>
                      <View style={styles.valueRow}><Text style={styles.valueText}>{p.sector}</Text></View>
                    </View>
                    <View style={styles.thinLine} />
                    <View style={styles.infoGroup}>
                      <View style={styles.labelRow}><Text style={styles.labelText}>Área:</Text></View>
                      <View style={styles.valueRow}><Text style={styles.valueText}>{p.area}</Text></View>
                    </View>
                    <View style={styles.thinLine} />
                    <View style={styles.infoGroup}>
                      <View style={styles.labelRow}><Text style={styles.labelText}>Perfil:</Text></View>
                      <View style={styles.valueRow}><Text style={styles.valueText}>{p.profileDisplay ?? p.profile}</Text></View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
          </SlideInView>

          {/* Rodapé */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.footerButton, isBackDisabled && styles.footerButtonDisabled]}
              onPress={onBack ?? onClose}
              disabled={isBackDisabled}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              accessibilityState={{ disabled: isBackDisabled }}
            >
              <Text style={styles.footerButtonText}>Voltar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonPrimary, isNextDisabled && styles.footerButtonDisabled]}
              disabled={isNextDisabled}
              accessibilityRole="button"
              accessibilityLabel="Próximo"
              accessibilityState={{ disabled: isNextDisabled }}
              onPress={() => {
                if (selectedProfessional !== null) {
                  onNext?.(selectedProfessional);
                }
              }}
            >
              <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <FullFlow visible={fullFlowVisible} onClose={() => setFullFlowVisible(false)} currentStep={6} summaries={summaries} onSelectStep={onSelectStep} maxAccessibleStep={maxAccessibleStep} />
    </>
  );
};

const styles = RNStyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 15,
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'web' ? 0.12 : 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    color: '#3A3F51',
    fontFamily: 'Inter_700Bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#7D8592',
    fontFamily: 'Inter_400Regular',
    marginTop: 6,
  },
  stepsRow: {
    flexDirection: 'row',
    columnGap: 8,
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    marginTop: 14,
  },
  introContainer: {
    alignSelf: 'stretch',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepDot: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    minWidth: 24,
  },
  stepDotActive: {
    backgroundColor: '#1777CF',
  },
  stepDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  // Filtros
  filtersRow: {
    flexDirection: 'row',
    columnGap: 12,
    alignSelf: 'stretch',
    marginTop: 14,
    paddingRight: 4,
    // Garante que os filtros fiquem acima de elementos seguintes
    position: 'relative',
  },
  filterCard: {
    flex: 0,
    minWidth: 140,
    height: 62,
    flexShrink: 0,
    backgroundColor: '#F4F4F4',
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterLabel: {
    fontSize: 12,
    color: '#7D8592',
    fontFamily: 'Inter_500Medium',
  },
  filterValue: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
    marginTop: 6,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // Evita sobrepor os filtros; mantém espaçamento natural
    marginTop: -410,
  },
  searchIconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as any)
      : {}),
  },
  noneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 20,
    marginBottom: 5,
  },
  noneLabel: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  listDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    alignSelf: 'stretch',
    marginVertical: 10,
  },
  list: {
    flex: 1,
  },
  contentFlex: {
    flex: 1,
    alignSelf: 'stretch',
  },
  // Card conforme snippet (mesmo conjunto de estilos do filtro)
  cardContainer: {
    width: '100%',
    alignSelf: 'stretch',
    height: 170,
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    backgroundColor: '#FCFCFC',
    marginBottom: 12,
  },
  leftColumn: {
    width: 79,
    height: 170,
    paddingTop: 5,
    paddingBottom: 5,
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  leftImageBox: { flex: 1, borderRadius: 8, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  leftImage: { width: '100%', height: '100%' },
  leftOverlay: {
    position: 'absolute',
    left: 0,
    top: 125,
    width: 79,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(252,252,252,0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  rightColumn: { flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' },
  nameRow: { height: 17, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', columnGap: 9 },
  nameText: { flex: 1, color: '#3A3F51', fontSize: 14, fontFamily: 'Inter_500Medium' },
  thinLine: { height: 0.5, backgroundColor: '#D8E0F0', alignSelf: 'stretch', marginVertical: 5 },
  infoGroup: { alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' },
  labelRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center' },
  labelText: { flex: 1, color: '#7D8592', fontSize: 12, fontFamily: 'Inter_500Medium' },
  valueRow: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  valueText: { flex: 1, color: '#7D8592', fontSize: 14, fontFamily: 'Inter_400Regular' },
  footerRow: {
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonDisabled: {
    opacity: 0.5,
    ...(Platform.OS === 'web' ? ({ cursor: 'not-allowed' } as any) : {}),
  },
  footerButtonPrimary: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  footerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#3A3F51',
  },
  footerButtonTextPrimary: {
    color: '#FCFCFC',
  },
});
const formatBRL = (value: number) => {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  } catch (e) {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const int = Math.floor(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const cents = Math.round((abs % 1) * 100).toString().padStart(2, '0');
    return `${sign}R$ ${int},${cents}`;
  }
};

const formatNumberNoCurrency = (value: number) => {
  try {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  } catch (e) {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const int = Math.floor(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const cents = Math.round((abs % 1) * 100).toString().padStart(2, '0');
    return `${sign}${int},${cents}`;
  }
};

const parsePtNumber = (text: string): number => {
  const cleaned = String(text || '').replace(/[^0-9.,]/g, '');
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
};

const NewSaleFeeDetails: React.FC<NewAppointmentProfessionalsProps> = ({
  visible,
  transitionDirection = 'forward',
  summaries,
  embedded = false,
  registerNextHandler,
  onCanProceedChange,
  onNext,
  onUpdateSummary,
}) => {
  const selectedLabelRaw = (summaries?.[5] ?? '');
  const selectedLabel = selectedLabelRaw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const selectedId = selectedLabel.includes('prolabore') && (selectedLabel.includes('exito'))
    ? 'prolabore_success'
    : selectedLabel.includes('prolabore')
      ? 'prolabore'
      : (selectedLabel.includes('exito'))
        ? 'success'
        : 'none';
  const displayLabel = (summaries?.[5] ?? '');
  const isDualMode = selectedId === 'prolabore_success';
  const TYPE_TOTALS_MAP: Record<string, number> = { prolabore: 120000, success: 160000 };
  const DEFAULT_PROLABORE = 40000;
  const DEFAULT_EXITO = 95000;
  const normalize = (s: string) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const personalizeSummary = normalize(summaries?.[6] ?? '');
  const proMatch = personalizeSummary.match(/prolabore\s*:\s*R\$\s*([0-9\.,]+)/i);
  const exMatch = personalizeSummary.match(/exito\s*:\s*R\$\s*([0-9\.,]+)/i);
  const prolaboreTotal = isDualMode ? (proMatch ? parsePtNumber(proMatch[1]) : DEFAULT_PROLABORE) : TYPE_TOTALS_MAP['prolabore'];
  const exitoTotal = isDualMode ? (exMatch ? parsePtNumber(exMatch[1]) : DEFAULT_EXITO) : TYPE_TOTALS_MAP['success'];
  const [activeTopTab, setActiveTopTab] = useState<'prolabore' | 'exito'>('prolabore');
  const [tabsVisible, setTabsVisible] = useState<boolean>(true);
  const [paymentTabs, setPaymentTabs] = useState<PaymentTab[]>([{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }]);
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [prolaborePaymentTabs, setProlaborePaymentTabs] = useState<PaymentTab[]>([{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }]);
  const [exitoPaymentTabs, setExitoPaymentTabs] = useState<PaymentTab[]>([{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }]);
  const [prolaboreActiveTabId, setProlaboreActiveTabId] = useState<number | null>(1);
  const [exitoActiveTabId, setExitoActiveTabId] = useState<number | null>(1);
  const displayValue = isDualMode ? (activeTopTab === 'prolabore' ? prolaboreTotal : exitoTotal) : (TYPE_TOTALS_MAP[selectedId] ?? 0);
  type PaymentMethod = 'pix' | 'credito' | 'boleto' | 'ted' | 'doc';
  type PaymentTab = { id: number; method: PaymentMethod; mode: 'total' | 'parcial'; partialDigits: string; installments: number; firstDueDate?: Date; active?: boolean };
  const sumPaidFor = (tabs: PaymentTab[], typeTotal: number) => {
    const anyTotal = tabs.some((t) => t.active && t.mode === 'total');
    if (anyTotal) return typeTotal;
    return tabs.reduce((acc, t) => {
      if (!t.active) return acc;
      return acc + parsePtNumber(t.partialDigits);
    }, 0);
  };
  const currentTabs = isDualMode ? (activeTopTab === 'prolabore' ? prolaborePaymentTabs : exitoPaymentTabs) : paymentTabs;
  const currentActiveTabId = isDualMode ? (activeTopTab === 'prolabore' ? prolaboreActiveTabId : exitoActiveTabId) : activeTabId;
  const activeTab = useMemo(() => currentTabs.find(t => t.id === currentActiveTabId) ?? null, [currentTabs, currentActiveTabId]);
  const activeMethod: PaymentMethod = activeTab?.method ?? 'pix';
  const activeMode: 'total' | 'parcial' = activeTab?.mode ?? 'total';
  const activePartialDigits: string = activeTab?.partialDigits ?? '';
  const [isPartialFocused, setIsPartialFocused] = useState<boolean>(false);
  const [prolaborePartialFocused, setProlaborePartialFocused] = useState<boolean>(false);
  const [exitoPartialFocused, setExitoPartialFocused] = useState<boolean>(false);
  const currentPartialFocused = isDualMode ? (activeTopTab === 'prolabore' ? prolaborePartialFocused : exitoPartialFocused) : isPartialFocused;
  const [excludeModalVisible, setExcludeModalVisible] = useState<boolean>(false);
  const [installmentModalVisible, setInstallmentModalVisible] = useState<boolean>(false);

  const handleAddPaymentTab = () => {
    setTabsVisible(true);
    if (isDualMode) {
      if (activeTopTab === 'prolabore') {
        setProlaborePaymentTabs(prev => {
          if (prev.length === 1) {
            const nextId = 2;
            setProlaboreActiveTabId(nextId);
            return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }];
          }
          const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
          setProlaboreActiveTabId(nextId);
          return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }];
        });
      } else {
        setExitoPaymentTabs(prev => {
          if (prev.length === 1) {
            const nextId = 2;
            setExitoActiveTabId(nextId);
            return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }];
          }
          const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
          setExitoActiveTabId(nextId);
          return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }];
        });
      }
    } else {
      setPaymentTabs(prev => {
        if (prev.length === 1) {
          const nextId = 2;
          setActiveTabId(nextId);
          return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: true }];
        }
        const nextId = prev.length ? Math.max(...prev.map(t => t.id)) + 1 : 1;
        setActiveTabId(nextId);
        return [...prev, { id: nextId, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: false }];
      });
    }
  };

  const updateActiveTab = (patch: Partial<PaymentTab>) => {
    if (isDualMode) {
      if (activeTopTab === 'prolabore') {
        if (prolaboreActiveTabId === null) return;
        setProlaborePaymentTabs(prev => prev.map(t => (t.id === prolaboreActiveTabId ? { ...t, ...patch } : t)));
      } else {
        if (exitoActiveTabId === null) return;
        setExitoPaymentTabs(prev => prev.map(t => (t.id === exitoActiveTabId ? { ...t, ...patch } : t)));
      }
    } else {
      if (activeTabId === null) return;
      setPaymentTabs(prev => prev.map(t => (t.id === activeTabId ? { ...t, ...patch } : t)));
    }
  };

  const handlePrevTab = () => {
    if (isDualMode) {
      if (activeTopTab === 'prolabore') {
        if (prolaboreActiveTabId === null) return;
        const ids = prolaborePaymentTabs.map(t => t.id).sort((a, b) => a - b);
        const idx = ids.indexOf(prolaboreActiveTabId);
        if (idx > 0) setProlaboreActiveTabId(ids[idx - 1]);
      } else {
        if (exitoActiveTabId === null) return;
        const ids = exitoPaymentTabs.map(t => t.id).sort((a, b) => a - b);
        const idx = ids.indexOf(exitoActiveTabId);
        if (idx > 0) setExitoActiveTabId(ids[idx - 1]);
      }
    } else {
      if (activeTabId === null) return;
      const ids = paymentTabs.map(t => t.id).sort((a, b) => a - b);
      const idx = ids.indexOf(activeTabId);
      if (idx > 0) setActiveTabId(ids[idx - 1]);
    }
  };

  const handleNextTab = () => {
    if (isDualMode) {
      if (activeTopTab === 'prolabore') {
        if (prolaboreActiveTabId === null) return;
        const ids = prolaborePaymentTabs.map(t => t.id).sort((a, b) => a - b);
        const idx = ids.indexOf(prolaboreActiveTabId);
        if (idx < ids.length - 1) setProlaboreActiveTabId(ids[idx + 1]);
      } else {
        if (exitoActiveTabId === null) return;
        const ids = exitoPaymentTabs.map(t => t.id).sort((a, b) => a - b);
        const idx = ids.indexOf(exitoActiveTabId);
        if (idx < ids.length - 1) setExitoActiveTabId(ids[idx + 1]);
      }
    } else {
      if (activeTabId === null) return;
      const ids = paymentTabs.map(t => t.id).sort((a, b) => a - b);
      const idx = ids.indexOf(activeTabId);
      if (idx < ids.length - 1) setActiveTabId(ids[idx + 1]);
    }
  };

  const handleDeleteActiveTab = () => {
    if (isDualMode) {
      if (activeTopTab === 'prolabore') {
        if (prolaboreActiveTabId === null) return;
        if (prolaboreActiveTabId === 1) return;
        setProlaborePaymentTabs(prev => {
          const next = prev.filter(t => t.id !== prolaboreActiveTabId);
          const ids = next.map(t => t.id).sort((a, b) => a - b);
          const prevId = ids.filter(id => id < (prolaboreActiveTabId as number)).pop();
          const fallback = ids[0] ?? 1;
          setProlaboreActiveTabId(prevId ?? fallback);
          return next.length ? next : [{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: false }];
        });
      } else {
        if (exitoActiveTabId === null) return;
        if (exitoActiveTabId === 1) return;
        setExitoPaymentTabs(prev => {
          const next = prev.filter(t => t.id !== exitoActiveTabId);
          const ids = next.map(t => t.id).sort((a, b) => a - b);
          const prevId = ids.filter(id => id < (exitoActiveTabId as number)).pop();
          const fallback = ids[0] ?? 1;
          setExitoActiveTabId(prevId ?? fallback);
          return next.length ? next : [{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: false }];
        });
      }
    } else {
      if (activeTabId === null) return;
      if (activeTabId === 1) return;
      setPaymentTabs(prev => {
        const next = prev.filter(t => t.id !== activeTabId);
        const ids = next.map(t => t.id).sort((a, b) => a - b);
        const prevId = ids.filter(id => id < activeTabId).pop();
        const fallback = ids[0] ?? 1;
        setActiveTabId(prevId ?? fallback);
        return next.length ? next : [{ id: 1, method: 'pix', mode: 'total', partialDigits: '', installments: 1, firstDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), active: false }];
      });
    }
  };

  const partialValue = useMemo(() => parsePtNumber(activePartialDigits), [activePartialDigits]);
  const paidTotalSimple = useMemo(() => sumPaidFor(paymentTabs, displayValue), [paymentTabs, displayValue]);
  const remainingValue = displayValue - paidTotalSimple;
  const prolaborePaidTotal = useMemo(() => sumPaidFor(prolaborePaymentTabs, prolaboreTotal), [prolaborePaymentTabs, prolaboreTotal]);
  const exitoPaidTotal = useMemo(() => sumPaidFor(exitoPaymentTabs, exitoTotal), [exitoPaymentTabs, exitoTotal]);
  const prolaboreRemaining = prolaboreTotal - prolaborePaidTotal;
  const exitoRemaining = exitoTotal - exitoPaidTotal;
  const selectedInstallments = activeTab?.installments ?? 1;
  const firstDueDateStr = (() => {
    const d = activeTab?.firstDueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = String(d.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  })();
  const baseCreditAmount = activeMode === 'total' ? displayValue : Math.max(0, partialValue);

  React.useEffect(() => {
    if (isDualMode) {
      onCanProceedChange?.(prolaboreRemaining === 0 && exitoRemaining === 0);
    } else {
      onCanProceedChange?.(remainingValue === 0);
    }
  }, [onCanProceedChange, isDualMode, remainingValue, prolaboreRemaining, exitoRemaining]);

  React.useEffect(() => {
    if (!embedded || !registerNextHandler) return;
    registerNextHandler(() => {
      onNext?.(null);
    });
  }, [embedded, registerNextHandler, onNext]);

  React.useEffect(() => {
    const map: Record<PaymentMethod, string> = { pix: 'Pix', credito: 'Crédito', boleto: 'Boleto', ted: 'TED', doc: 'DOC' };
    const set = new Set<string>();
    const collect = (tabs: PaymentTab[]) => {
      tabs.forEach(t => { if (t.active) set.add(map[t.method]); });
    };
    if (isDualMode) {
      collect(prolaborePaymentTabs);
      collect(exitoPaymentTabs);
    } else {
      collect(paymentTabs);
    }
    const txt = Array.from(set).join(', ') || 'Pix';
    const stepIdx = isDualMode ? 7 : 6;
    onUpdateSummary?.(stepIdx, txt);
  }, [isDualMode, paymentTabs, prolaborePaymentTabs, exitoPaymentTabs, onUpdateSummary, visible]);

  return (
    <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
      <View style={styles.contentFlex}>
        <View style={styles.introContainer}>
          <View style={styles.centerBlock}>
            <Text style={styles.sectionTitle}>Forma de pagamento</Text>
            <Text style={styles.sectionSubtitle}>Determine as formas de pagamento</Text>
          </View>
          <View style={styles.stepsRow}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={[styles.stepDot, i < 5 ? styles.stepDotActive : styles.stepDotInactive]} />
            ))}
          </View>
        </View>
        {isDualMode ? (
          <View style={feeStyles.topTabsOuter}>
            <View style={feeStyles.topTabsInner}>
              <TouchableOpacity
                style={[feeStyles.topTabItem, activeTopTab === 'prolabore' ? feeStyles.topTabItemActive : null]}
                onPress={() => setActiveTopTab('prolabore')}
                accessibilityRole="button"
                accessibilityLabel="Prolabore"
              >
                <Text style={activeTopTab === 'prolabore' ? feeStyles.topTabTextActive : feeStyles.topTabTextInactive}>Prolabore</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[feeStyles.topTabItem, activeTopTab === 'exito' ? feeStyles.topTabItemActive : feeStyles.topTabItemInactive]}
                onPress={() => setActiveTopTab('exito')}
                accessibilityRole="button"
                accessibilityLabel="Êxito"
              >
                <Text style={activeTopTab === 'exito' ? feeStyles.topTabTextActive : feeStyles.topTabTextInactive}>Êxito</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={feeStyles.summaryRow}>
          <View style={feeStyles.summaryCard}>
            <Text style={feeStyles.summaryTitle}>Total:</Text>
            <Text style={feeStyles.summaryValue}>{formatBRL(displayValue)}</Text>
          </View>
          <View style={feeStyles.summaryCard}>
            <Text style={feeStyles.summaryTitle}>Restante:</Text>
            <Text style={feeStyles.summaryValue}>{formatBRL(isDualMode ? (activeTopTab === 'prolabore' ? prolaboreRemaining : exitoRemaining) : remainingValue)}</Text>
          </View>
        </View>

        <View style={feeStyles.controlsGroup}>
          <View style={feeStyles.tabsRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={feeStyles.tabNumbersRow}>
              {(isDualMode ? currentTabs : paymentTabs).map(tab => {
                  const active = tab.id === currentActiveTabId;
                  const boxStyle = [feeStyles.tabNumberBox, active ? feeStyles.tabNumberBoxActive : feeStyles.tabNumberBoxInactive];
                  const textStyle = [feeStyles.tabNumberText, active ? feeStyles.tabNumberTextActive : feeStyles.tabNumberTextInactive];
                  const label = String(tab.id).padStart(2, '0');
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      style={boxStyle}
                      onPress={() => {
                        if (isDualMode) {
                          if (activeTopTab === 'prolabore') setProlaboreActiveTabId(tab.id);
                          else setExitoActiveTabId(tab.id);
                        } else {
                          setActiveTabId(tab.id);
                        }
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Aba ${label}`}
                    >
                      <Text style={textStyle}>{label}</Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
            <View style={feeStyles.tabActionsRow}>
              {(tabsVisible && (isDualMode ? currentTabs.length > 1 : paymentTabs.length > 1) && (currentActiveTabId ?? 0) > 1) ? (
                <TouchableOpacity style={feeStyles.tabActionButton} onPress={() => setExcludeModalVisible(true)} accessibilityRole="button" accessibilityLabel="Excluir forma de pagamento">
                  <TrashSquareIcon />
                </TouchableOpacity>
              ) : (
                <View style={feeStyles.tabActionPlaceholder} />
              )}
              <TouchableOpacity style={feeStyles.tabActionButton} onPress={handleAddPaymentTab} accessibilityRole="button" accessibilityLabel="Adicionar forma de pagamento">
                <PlusSquareIcon />
              </TouchableOpacity>
            </View>
          </View>
          <View style={feeStyles.tabsDivider} />
          <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={feeStyles.paymentOptionsScroller}
          contentContainerStyle={feeStyles.paymentOptionsContent}
          >
          <TouchableOpacity
            style={[feeStyles.segmentedItem, activeMethod === 'pix' ? feeStyles.segmentedItemActive : null]}
            onPress={() => updateActiveTab({ method: 'pix' })}
            accessibilityRole="button"
            accessibilityLabel="Pix"
          >
            <Text style={activeMethod === 'pix' ? feeStyles.segmentedTextActive : feeStyles.segmentedTextInactive}>Pix</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[feeStyles.segmentedItem, activeMethod === 'credito' ? feeStyles.segmentedItemActive : null]}
            onPress={() => updateActiveTab({ method: 'credito' })}
            accessibilityRole="button"
            accessibilityLabel="Crédito"
          >
            <Text style={activeMethod === 'credito' ? feeStyles.segmentedTextActive : feeStyles.segmentedTextInactive}>Crédito</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[feeStyles.segmentedItem, activeMethod === 'boleto' ? feeStyles.segmentedItemActive : null]}
            onPress={() => updateActiveTab({ method: 'boleto' })}
            accessibilityRole="button"
            accessibilityLabel="Boleto"
          >
            <Text style={activeMethod === 'boleto' ? feeStyles.segmentedTextActive : feeStyles.segmentedTextInactive}>Boleto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[feeStyles.segmentedItem, activeMethod === 'ted' ? feeStyles.segmentedItemActive : null]}
            onPress={() => updateActiveTab({ method: 'ted' })}
            accessibilityRole="button"
            accessibilityLabel="TED"
          >
            <Text style={activeMethod === 'ted' ? feeStyles.segmentedTextActive : feeStyles.segmentedTextInactive}>TED</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[feeStyles.segmentedItem, activeMethod === 'doc' ? feeStyles.segmentedItemActive : null]}
            onPress={() => updateActiveTab({ method: 'doc' })}
            accessibilityRole="button"
            accessibilityLabel="DOC"
          >
            <Text style={activeMethod === 'doc' ? feeStyles.segmentedTextActive : feeStyles.segmentedTextInactive}>DOC</Text>
          </TouchableOpacity>
          </ScrollView>

          <View style={feeStyles.radioGroup}>
          <TouchableOpacity style={feeStyles.radioRow} onPress={() => updateActiveTab({ mode: 'total', active: true })} accessibilityRole="button" accessibilityLabel="Valor total">
            <RadioIcon selected={activeMode === 'total'} />
            <Text style={feeStyles.radioLabel}>Valor total</Text>
          </TouchableOpacity>
          <View style={feeStyles.radioDivider} />
          <TouchableOpacity style={feeStyles.radioRow} onPress={() => updateActiveTab({ mode: 'parcial', active: false, partialDigits: '' })} accessibilityRole="button" accessibilityLabel="Valor desejado">
            <RadioIcon selected={activeMode === 'parcial'} />
            <Text style={feeStyles.radioLabel}>Valor desejado</Text>
          </TouchableOpacity>
          {activeMode === 'parcial' ? (
            <>
            <View style={feeStyles.partialInputGroup}>
              <View style={feeStyles.partialInputContainer}>
                <TextInput
                  style={feeStyles.partialInput}
                  placeholder="00"
                  placeholderTextColor="#91929E"
                  value={currentPartialFocused
                    ? activePartialDigits
                    : (activePartialDigits ? `R$ ${formatNumberNoCurrency(partialValue)}` : '')}
                  onChangeText={(t) => {
                    const raw = t.replace(/[^0-9.,]/g, '');
                    const val = parsePtNumber(raw);
                    updateActiveTab({ partialDigits: raw, active: val > 0 });
                  }}
                  onFocus={() => {
                    if (isDualMode) {
                      if (activeTopTab === 'prolabore') setProlaborePartialFocused(true);
                      else setExitoPartialFocused(true);
                    } else {
                      setIsPartialFocused(true);
                    }
                  }}
                  onBlur={() => {
                    if (isDualMode) {
                      if (activeTopTab === 'prolabore') setProlaborePartialFocused(false);
                      else setExitoPartialFocused(false);
                    } else {
                      setIsPartialFocused(false);
                    }
                  }}
                  cursorColor="#1777CF"
                  selectionColor="#1777CF"
                  keyboardType="default"
                />
              </View>
            </View>
            </>
          ) : null}
          </View>
        </View>
        {activeMethod === 'credito' ? (
          <View style={[feeStyles.dueGroup, activeMode === 'total' ? feeStyles.dueTopMargin : null]}>
            <View style={feeStyles.dueCard}>
              <View style={feeStyles.dueHeaderRow}>
                <View style={feeStyles.dueHeaderLeft}>
                  <Text style={feeStyles.dueTitle}>Defina o vencimento e parcelas</Text>
                </View>
                <TouchableOpacity
                  style={feeStyles.dueHeaderIconTouch}
                  onPress={() => setInstallmentModalVisible(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Editar vencimento e parcelas"
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                    <Path d="M15.5455 18H2.45455C1.80356 18 1.17924 17.7414 0.71892 17.2811C0.258603 16.8208 0 16.1964 0 15.5455V2.45455C0 1.80356 0.258603 1.17924 0.71892 0.71892C1.17924 0.258603 1.80356 0 2.45455 0H7.36364C7.58063 0 7.78874 0.086201 7.94218 0.23964C8.09562 0.393079 8.18182 0.601187 8.18182 0.818182C8.18182 1.03518 8.09562 1.24328 7.94218 1.39672C7.78874 1.55016 7.58063 1.63636 7.36364 1.63636H2.45455C2.23755 1.63636 2.02944 1.72256 1.876 1.876C1.72256 2.02944 1.63636 2.23755 1.63636 2.45455V15.5455C1.63636 15.7625 1.72256 15.9706 1.876 16.124C2.02944 16.2774 2.23755 16.3636 2.45455 16.3636H15.5455C15.7625 16.3636 15.9706 16.2774 16.124 16.124C16.2774 15.9706 16.3636 15.7625 16.3636 15.5455V10.6364C16.3636 10.4194 16.4498 10.2113 16.6033 10.0578C16.7567 9.90438 16.9648 9.81818 17.1818 9.81818C17.3988 9.81818 17.6069 9.90438 17.7604 10.0578C17.9138 10.2113 18 10.4194 18 10.6364V15.5455C18 16.1964 17.7414 16.8208 17.2811 17.2811C16.8208 17.7414 16.1964 18 15.5455 18ZM7.36364 11.4545C7.25596 11.4552 7.14922 11.4345 7.04953 11.3938C6.94985 11.3531 6.85918 11.2931 6.78273 11.2173C6.70604 11.1412 6.64517 11.0507 6.60363 10.951C6.5621 10.8513 6.54071 10.7444 6.54071 10.6364C6.54071 10.5284 6.5621 10.4214 6.60363 10.3217C6.64517 10.222 6.70604 10.1315 6.78273 10.0555L15.21 1.63636H12.2727C12.0557 1.63636 11.8476 1.55016 11.6942 1.39672C11.5407 1.24328 11.4545 1.03518 11.4545 0.818182C11.4545 0.601187 11.5407 0.393079 11.6942 0.23964C11.8476 0.086201 12.0557 0 12.2727 0H17.1818C17.3988 0 17.6069 0.086201 17.7604 0.23964C17.9138 0.393079 18 0.601187 18 0.818182V5.72727C18 5.94427 17.9138 6.15238 17.7604 6.30581C17.6069 6.45925 17.3988 6.54545 17.1818 6.54545C16.9648 6.54545 16.7567 6.45925 16.6033 6.30581C16.4498 6.15238 16.3636 5.94427 16.3636 5.72727V2.79L7.94455 11.2173C7.86809 11.2931 7.77743 11.3531 7.67774 11.3938C7.57806 11.4345 7.47131 11.4552 7.36364 11.4545Z" fill="#1777CF" />
                  </Svg>
                </TouchableOpacity>
              </View>
              <View style={feeStyles.dueThinDivider} />
              <TouchableOpacity
                style={feeStyles.dueDetailsCard}
                onPress={() => setInstallmentModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Editar vencimento e parcelas"
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <View style={feeStyles.dueDetailsTopRow}>
                  <Text style={feeStyles.dueDetailsLeftText}>{`${selectedInstallments}x`}</Text>
                  <Text style={feeStyles.dueDetailsRightText}>{formatBRL(selectedInstallments > 0 && baseCreditAmount > 0 ? Math.round((baseCreditAmount / selectedInstallments) * 100) / 100 : 0)}</Text>
                </View>
                <View style={feeStyles.dueThinDivider} />
                <View style={feeStyles.dueDetailsBottomRow}>
                  <Text style={feeStyles.dueDetailsBottomLeftText}>Vencimento da primeira parcela</Text>
                  <Text style={feeStyles.dueDetailsBottomRightText}>{firstDueDateStr}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
          <CreditCardInstallmentModal
            visible={installmentModalVisible}
            baseAmount={baseCreditAmount}
            selected={selectedInstallments}
            onCancel={() => setInstallmentModalVisible(false)}
            onSave={(n, d) => { updateActiveTab({ installments: n, firstDueDate: d }); setInstallmentModalVisible(false); }}
          />
          <ModalExcludePaymentMethod
            visible={excludeModalVisible}
            tabLabel={(currentActiveTabId ?? undefined) as any}
            onCancel={() => setExcludeModalVisible(false)}
            onConfirm={() => { setExcludeModalVisible(false); handleDeleteActiveTab(); }}
          />
      </View>
    </SlideInView>
  );
};

const feeStyles = RNStyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    columnGap: 6,
    marginTop: 20,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    borderRadius: 6,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#7D8592',
    fontFamily: 'Inter_500Medium',
  },
  summaryValue: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
  controlsGroup: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    // spacing handled by child margins
  },
  tabsRow: {
    alignSelf: 'stretch',
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 15,
  },
  tabActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    flexShrink: 0,
  },
  tabActionButton: { width: 40, height: 35 },
  tabActionPlaceholder: { width: 40, height: 35, marginRight: 0 },
  paymentOptionsScroller: {
    alignSelf: 'stretch',
    marginTop: 0,
    marginBottom: 20,
  },
  paymentOptionsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingRight: 4,
  },
  tabsWrap: {
    alignSelf: 'stretch',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  tabArrowButton: { width: 40, height: 35 },
  tabArrowButtonRight: { width: 40, height: 35 },
  tabNumbersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
    overflow: 'hidden',
  },
  tabNumberBox: {
    width: 40,
    height: 35,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: '#FCFCFC',
    borderRadius: 4,
    borderWidth: Borders.width(0.5),
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabNumberBoxInactive: {
    backgroundColor: '#FCFCFC',
    borderColor: '#D8E0F0',
  },
  tabNumberBoxActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  tabNumberText: {
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  tabNumberTextInactive: { color: '#3A3F51' },
  tabNumberTextActive: { color: '#FCFCFC' },
  tabsDivider: { alignSelf: 'stretch', height: 1, backgroundColor: '#D8E0F0', marginVertical: 20 },
  segmentedItem: {
    flexShrink: 0,
    paddingHorizontal: 15,
    height: 35,
    borderRadius: 6,
    borderWidth: Borders.width(0.5),
    borderColor: '#D8E0F0',
    backgroundColor: '#F4F4F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedItemActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  segmentedTextInactive: {
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  segmentedTextActive: {
    color: '#FCFCFC',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  topTabsOuter: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 25,
  },
  topTabsInner: {
    padding: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: Borders.width(0.3),
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 4,
  },
  topTabItem: {
    width: 115,
    height: 35,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  topTabItemActive: {
    backgroundColor: '#1777CF',
  },
  topTabItemInactive: {
    backgroundColor: 'transparent',
  },
  topTabTextActive: {
    color: '#FCFCFC',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  topTabTextInactive: {
    color: '#3A3F51',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  radioGroup: {
    alignSelf: 'stretch',
    marginTop: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 0,
    paddingLeft: 6,
  },
  radioLabel: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  radioDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    alignSelf: 'stretch',
    marginVertical: 20,
  },
  listDivider: { alignSelf: 'stretch', height: 0.5, backgroundColor: '#D8E0F0' },
  partialInputGroup: {
    alignSelf: 'stretch',
    height: 80,
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 0,
    // spacing handled by child margins
  },
  partialInputContainer: {
    alignSelf: 'stretch',
    height: 40,
    marginTop: 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FCFCFC',
  },
  partialInput: {
    flex: 1,
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    ...(Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : {}),
  },
  installmentRow: {
    alignSelf: 'stretch',
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  installmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  installmentLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  installmentValue: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  installmentsScroll: {
    alignSelf: 'stretch',
    flex: 1,
    marginTop: 25,
    paddingTop: 0,
    ...Platform.select({ web: ({ overflowY: 'auto' } as any), default: {} }),
  },
  installmentsContainer: {
    alignSelf: 'stretch',
    marginTop: -10,
    paddingTop: 0,
  },
  installmentsBottomSpacer: { height: 15 },
  installmentButtonGroup: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 6,
  },
  installmentButtonLabelRow: {
    alignSelf: 'stretch',
    paddingLeft: 6,
    paddingRight: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  installmentButtonLabelText: {
    flex: 1,
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  installmentButton: {
    alignSelf: 'stretch',
    height: 35,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: 'rgba(23, 119, 207, 0.05)',
    borderRadius: 8,
    borderWidth: Borders.width(),
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  installmentButtonLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  installmentButtonLeftText: {
    flex: 1,
    textAlign: 'left',
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  installmentButtonRight: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  installmentButtonRightText: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  dueGroup: {
    alignSelf: 'stretch',
    overflow: 'hidden',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    rowGap: 6,
  },
  dueTopMargin: { marginTop: 20 },
  dueCard: {
    alignSelf: 'stretch',
    padding: 10,
    borderRadius: 8,
    borderWidth: Borders.width(0.6),
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  dueHeaderRow: {
    alignSelf: 'stretch',
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 6,
    justifyContent: 'flex-start',
    alignItems: 'center',
    columnGap: 10,
    flexDirection: 'row',
  },
  dueHeaderLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 10,
  },
  dueTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  dueHeaderIconTouch: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dueThinDivider: {
    alignSelf: 'stretch',
    height: 0,
    borderTopWidth: Borders.width(0.5),
    borderTopColor: '#D8E0F0',
  },
  dueDetailsCard: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: Borders.width(0.5),
    borderColor: '#D8E0F0',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    rowGap: 10,
  },
  dueDetailsTopRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDetailsLeftText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  dueDetailsRightText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  dueDetailsBottomRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dueDetailsBottomLeftText: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  dueDetailsBottomRightText: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});

export default NewSaleFeeDetails;
export { NewAppointmentProfessionals };
