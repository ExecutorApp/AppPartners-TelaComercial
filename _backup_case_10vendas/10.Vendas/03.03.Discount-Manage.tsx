import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import NewSaleDiscount from './02.05.NewSale-PaymentMethod-Discount';
import { ScreenNames } from '../../types/navigation';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import DiscountModalRequest from './03.03.Discount-Manage-Request';
import DiscountModalCondition from './03.03.Discount-Manage-Condition';

// Tipagem para o status de cada solicitação
type StatusType = 'aguardando' | 'aprovado' | 'reprovado';

// Interface para os dados de cada solicitação
interface SolicitacaoData {
  id: number;
  status: StatusType;
  statusLabel: string;
  vendaId: string;
  produto: string;
  servico: string;
  total: string;
  honorarios: string;
  descontoPercentual: string;
  descontoValor: string;
  seuLucroPercentual: string;
  seuLucroValor: string;
}

// Interface para os dados de cada nova condição
interface CondicaoData {
  id: number;
  condicaoId: string;
  produto: string;
  servico: string;
  total: string;
  honorarios: string;
  descontoPercentual: string;
  descontoValor: string;
  seuLucroPercentual: string;
  seuLucroValor: string;
}

// Tipagens e dados base para cálculo das condições (espelhando o modal de Condições)
interface MetodoPagamentoCalc {
  nome: string;
  valor: string;
  parcelas?: string;
  juros?: string;
  descontoPercentNovo?: string;
}

interface HonorarioCalc {
  tipo: 'prolabore' | 'exito';
  valor: string;
  metodos: MetodoPagamentoCalc[];
}

interface DetalhesVendaCalc {
  produto: string;
  servico: string;
  tipoHonorarios: string;
}

interface CondicaoCalc {
  id: string;
  numero: number;
  total: number;
  valorProduto: string;
  detalhesVenda: DetalhesVendaCalc;
  honorarios: HonorarioCalc[];
}

const condicoesOrigem: CondicaoCalc[] = [
  {
    id: '10050232',
    numero: 1,
    total: 3,
    valorProduto: 'R$ 120.000,00',
    detalhesVenda: {
      produto: 'Holding Patrimonial',
      servico: 'Reunião estratégica',
      tipoHonorarios: 'Prolabore + Êxito',
    },
    honorarios: [
      {
        tipo: 'prolabore',
        valor: 'R$ 50.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '5,5%' },
          { nome: 'Crédito', valor: 'R$ 15.000,00', parcelas: '10 × 1.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '5,5%' },
          { nome: 'Boleto', valor: 'R$ 10.000,00', parcelas: '5 × 2.000,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '5,5%' },
        ],
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '5,5%' },
          { nome: 'Crédito', valor: 'R$ 45.000,00', parcelas: '10 × 4.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '5,5%' },
        ],
      },
    ],
  },
  {
    id: '20050232',
    numero: 2,
    total: 3,
    valorProduto: 'R$ 120.000,00',
    detalhesVenda: {
      produto: 'Holding Patrimonial',
      servico: 'Reunião estratégica',
      tipoHonorarios: 'Prolabore + Êxito',
    },
    honorarios: [
      {
        tipo: 'prolabore',
        valor: 'R$ 50.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '6%' },
          { nome: 'Crédito', valor: 'R$ 15.000,00', parcelas: '10 × 1.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '6%' },
          { nome: 'Boleto', valor: 'R$ 10.000,00', parcelas: '5 × 2.000,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '6%' },
        ],
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '6%' },
          { nome: 'Crédito', valor: 'R$ 45.000,00', parcelas: '10 × 4.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '6%' },
        ],
      },
    ],
  },
  {
    id: '30050232',
    numero: 3,
    total: 3,
    valorProduto: 'R$ 120.000,00',
    detalhesVenda: {
      produto: 'Holding Patrimonial',
      servico: 'Reunião estratégica',
      tipoHonorarios: 'Prolabore + Êxito',
    },
    honorarios: [
      {
        tipo: 'prolabore',
        valor: 'R$ 50.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '7,5%' },
          { nome: 'Crédito', valor: 'R$ 15.000,00', parcelas: '10 × 1.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '7,5%' },
          { nome: 'Boleto', valor: 'R$ 10.000,00', parcelas: '5 × 2.000,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '7,5%' },
        ],
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          { nome: 'Pix', valor: 'R$ 25.000,00', descontoPercentNovo: '7,5%' },
          { nome: 'Crédito', valor: 'R$ 45.000,00', parcelas: '10 × 4.500,00', juros: 'Juros: R$ 00,00', descontoPercentNovo: '7,5%' },
        ],
      },
    ],
  },
];

const parseBRL = (s: string | undefined): number => {
  if (!s) return 0;
  const cleaned = s.replace(/[^0-9,.-]/g, '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const parsePercent = (s: string | undefined): number => {
  if (!s) return 0;
  const cleaned = s.replace('%', '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const formatBRL = (value: number): string => {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const fixed = abs.toFixed(2);
  const [whole, dec] = fixed.split('.');
  const intStr = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${sign}${intStr},${dec}`;
};

const formatPercentUpTo6 = (value: number): string => {
  const rounded = Math.round(value * 1000000) / 1000000;
  let s = rounded.toFixed(6).replace('.', ',');
  s = s.replace(/,?0+$/, '');
  return `${s}%`;
};

type CondicaoResumo = {
  detalhesVenda: DetalhesVendaCalc;
  descontoTotalCliente: { totalPercent: string; totalValor: string };
  reducaoTotalPremiacao: { totalPercent: string; totalValor: string };
};

const calculateCondicaoResumo = (input: CondicaoCalc): CondicaoResumo => {
  const produtoValor = parseBRL(input.valorProduto);
  const honorarios = input.honorarios.map((h) => {
    const hTotal = parseBRL(h.valor);
    let descontoTotal = 0;
    h.metodos.forEach((m) => {
      const v = parseBRL(m.valor);
      const p = parsePercent(m.descontoPercentNovo);
      descontoTotal += (v * p) / 100;
    });
    return { tipo: h.tipo, total: hTotal, descontoTotal };
  });
  const pro = honorarios.find((x) => x.tipo === 'prolabore');
  const ex = honorarios.find((x) => x.tipo === 'exito');
  const proDesc = pro ? pro.descontoTotal : 0;
  const exDesc = ex ? ex.descontoTotal : 0;
  const descontoGeral = proDesc + exDesc;
  const descontoPercentGeral = produtoValor > 0 ? (descontoGeral / produtoValor) * 100 : 0;

  let reducaoPercent = 0;
  if (descontoPercentGeral > 5) {
    reducaoPercent = Math.min(((descontoPercentGeral - 5) / 3) * 5, 5);
  }
  const reducaoValor = (produtoValor * reducaoPercent) / 100;

  return {
    detalhesVenda: input.detalhesVenda,
    descontoTotalCliente: {
      totalPercent: formatPercentUpTo6(descontoPercentGeral),
      totalValor: formatBRL(descontoGeral),
    },
    reducaoTotalPremiacao: {
      totalPercent: formatPercentUpTo6(reducaoPercent),
      totalValor: formatBRL(reducaoValor),
    },
  };
};

const getCondicaoResumoById = (id: string): CondicaoResumo | undefined => {
  const base = condicoesOrigem.find((c) => c.id === id);
  if (!base) return undefined;
  return calculateCondicaoResumo(base);
};

// Dados mockados das solicitações para demonstração
export const solicitacoesData: SolicitacaoData[] = [
  {
    id: 1,
    status: 'aguardando',
    statusLabel: 'Aguardando aprovação',
    vendaId: '102030',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore + Êxito',
    descontoPercentual: '2%',
    descontoValor: 'R$ 2.400,00',
    seuLucroPercentual: '0%',
    seuLucroValor: 'R$ 0,00',
  },
  {
    id: 2,
    status: 'aprovado',
    statusLabel: 'Aprovado - 50%',
    vendaId: '203040',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore + Êxito',
    descontoPercentual: '5%',
    descontoValor: 'R$ 6.000,00',
    seuLucroPercentual: '0%',
    seuLucroValor: 'R$ 0,00',
  },
  {
    id: 3,
    status: 'reprovado',
    statusLabel: 'Reprovado',
    vendaId: '304050',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore + Êxito',
    descontoPercentual: '8%',
    descontoValor: 'R$ 9.600,00',
    seuLucroPercentual: '5%',
    seuLucroValor: 'R$ 6.000,00',
  },
];

// Dados mockados das novas condições cadastradas pelo gestor
export const novasCondicoesData: CondicaoData[] = [
  {
    id: 1,
    condicaoId: '10050232',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore',
    descontoPercentual: '5%',
    descontoValor: 'R$ 1.000,00',
    seuLucroPercentual: '0%',
    seuLucroValor: 'R$ 00,00',
  },
  {
    id: 2,
    condicaoId: '20050232',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore',
    descontoPercentual: '8%',
    descontoValor: 'R$ 1.300,00',
    seuLucroPercentual: '0%',
    seuLucroValor: 'R$ 00,00',
  },
  {
    id: 3,
    condicaoId: '30050232',
    produto: 'Holding Patrimonial',
    servico: 'Aquisição da Holding',
    total: 'R$ 120.000,00',
    honorarios: 'Prolabore',
    descontoPercentual: '10%',
    descontoValor: 'R$ 1.500,00',
    seuLucroPercentual: '2%',
    seuLucroValor: 'R$ 600,00',
  },
];

// Dados vazios para demonstrar o estado vazio na aba "Novas condições"
const novasCondicoesVazio: CondicaoData[] = [];

const HEADER_TOP_HEIGHT = 250;

const DiscountManageScreen: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Estado responsável por controlar qual aba está ativa
  const [activeTab, setActiveTab] = React.useState<'solicitacoes' | 'condicoes'>('solicitacoes');

  // Estado responsável por controlar a visibilidade do modal de solicitação
  const [requestModalVisible, setRequestModalVisible] = React.useState<boolean>(false);
  const [conditionModalVisible, setConditionModalVisible] = React.useState<boolean>(false);
  const [requestInitialPage, setRequestInitialPage] = React.useState<number>(0);
  const [conditionInitialPage, setConditionInitialPage] = React.useState<number>(0);

  // Estado para alternar entre mostrar dados ou estado vazio na aba condições
  // Altere para 'true' para ver o estado vazio, 'false' para ver os cards
  const [mostrarCondicoesVazio] = React.useState<boolean>(false);

  const [discountModalVisible, setDiscountModalVisible] = React.useState<boolean>(false);
  const [discountInitialSelectedOption, setDiscountInitialSelectedOption] = React.useState<'none' | 'system' | 'manager'>('none');
  const [discountInitialManagerStep, setDiscountInitialManagerStep] = React.useState<number>(0);

  // Função que retorna a cor de fundo do card baseado no status
  const getCardBackgroundColor = (status: StatusType): string => {
    switch (status) {
      case 'aguardando':
        return 'rgba(23, 119, 207, 0.1)';
      case 'aprovado':
        return '#DEFBE6';
      case 'reprovado':
        return 'rgba(255, 0, 4, 0.05)';
      default:
        return 'rgba(23, 119, 207, 0.1)';
    }
  };

  // Função que retorna a cor do badge numérico baseado no status
  const getBadgeBackgroundColor = (status: StatusType): string => {
    switch (status) {
      case 'aguardando':
        return '#1777CF';
      case 'aprovado':
        return '#1B883C';
      case 'reprovado':
        return '#C1253A';
      default:
        return '#1777CF';
    }
  };

  // Função que retorna a cor do texto do status baseado no status
  const getStatusTextColor = (status: StatusType): string => {
    switch (status) {
      case 'aguardando':
        return '#3A3F51';
      case 'aprovado':
        return '#1B883C';
      case 'reprovado':
        return '#C1253A';
      default:
        return '#3A3F51';
    }
  };

  // Cor do fundo do botão Aplicar por status
  const getAplicarButtonBackground = (status: StatusType): string => {
    switch (status) {
      case 'aguardando':
        return '#1777CF';
      case 'aprovado':
        return '#1B883C';
      case 'reprovado':
        return '#C1253A';
      default:
        return '#1777CF';
    }
  };

  // Opacidade do botão Aplicar por status
  const getAplicarButtonOpacity = (status: StatusType): number => {
    return status === 'aprovado' ? 1 : 0.4;
  };

  // Função que verifica se o botão Aplicar está habilitado
  const isAplicarEnabled = (status: StatusType): boolean => {
    return status === 'aprovado';
  };

  // Função para formatar o número do card com zero à esquerda
  const formatCardNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Função para abrir o modal de solicitação
  const openRequestModalFor = (cardId: number) => {
    const page = Math.max(0, Math.min(2, (cardId ?? 1) - 1));
    setRequestInitialPage(page);
    setRequestModalVisible(true);
  };

  // Função para fechar o modal de solicitação
  const closeRequestModal = () => {
    setRequestModalVisible(false);
  };

  const openConditionModalFor = (cardId: number) => {
    const page = Math.max(0, Math.min(2, (cardId ?? 1) - 1));
    setConditionInitialPage(page);
    setConditionModalVisible(true);
  };

  const closeConditionModal = () => {
    setConditionModalVisible(false);
  };

  // Função callback quando o usuário clica em Aplicar no modal
  const handleApplyRequest = (solicitacao: any) => {
    closeRequestModal();
    if (solicitacao?.numero === 2) {
      setDiscountInitialSelectedOption('manager');
      setDiscountInitialManagerStep(0);
      setDiscountModalVisible(true);
    }
  };

  const handleApplyCondition = (condicao: any) => {
    closeConditionModal();
    const n = condicao?.numero ?? 1;
    if (n === 1 || n === 2 || n === 3) {
      setDiscountInitialSelectedOption('manager');
      setDiscountInitialManagerStep(n);
      setDiscountModalVisible(true);
    }
  };

  // Componente do ícone de olho (eye icon) - agora clicável
  const EyeIcon: React.FC<{ onPress: () => void }> = ({ onPress }) => (
    <TouchableOpacity
      style={styles.eyeIconContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
        <Rect width={35} height={35} rx={6} fill="#F4F4F4" />
        <Path d="M17.5 10.5C11.4688 10.5 6.36489 16.8 6.14923 17.073C6.05247 17.1954 6 17.3455 6 17.5C6 17.6545 6.05247 17.8046 6.14923 17.927C6.36489 18.2 11.4688 24.5 17.5 24.5C23.5312 24.5 28.6351 18.2 28.8508 17.927C28.9475 17.8046 29 17.6545 29 17.5C29 17.3455 28.9475 17.1954 28.8508 17.073C28.6351 16.8 23.5312 10.5 17.5 10.5ZM17.5 23.1C13.0215 23.1 8.87371 18.9 7.65165 17.5C8.87371 16.1 13.0143 11.9 17.5 11.9C21.9857 11.9 26.1263 16.1 27.3484 17.5C26.1263 18.9 21.9857 23.1 17.5 23.1Z" fill="#3A3F51" />
        <Path d="M21.0943 16.8C21.2129 16.7999 21.3297 16.7712 21.4342 16.7165C21.5387 16.6618 21.6277 16.5827 21.6932 16.4864C21.7586 16.39 21.7986 16.2794 21.8095 16.1643C21.8204 16.0493 21.8019 15.9334 21.7556 15.827C21.3602 15.0602 20.7517 14.4169 19.9994 13.9702C19.2471 13.5235 18.3811 13.2913 17.5 13.3C16.3561 13.3 15.259 13.7425 14.4501 14.5302C13.6413 15.3178 13.1869 16.3861 13.1869 17.5C13.1869 18.6139 13.6413 19.6822 14.4501 20.4698C15.259 21.2575 16.3561 21.7 17.5 21.7C18.3811 21.7087 19.2471 21.4765 19.9994 21.0298C20.7517 20.5831 21.3602 19.9398 21.7556 19.173C21.8019 19.0666 21.8204 18.9507 21.8095 18.8357C21.7986 18.7206 21.7586 18.61 21.6932 18.5136C21.6277 18.4173 21.5387 18.3382 21.4342 18.2835C21.3297 18.2288 21.2129 18.2001 21.0943 18.2C20.9974 18.2099 20.8994 18.1986 20.8076 18.1669C20.7158 18.1352 20.6324 18.084 20.5635 18.0169C20.4946 17.9498 20.4419 17.8686 20.4094 17.7792C20.3769 17.6897 20.3653 17.5944 20.3754 17.5C20.3653 17.4056 20.3769 17.3103 20.4094 17.2208C20.4419 17.1314 20.4946 17.0502 20.5635 16.9831C20.6324 16.916 20.7158 16.8648 20.8076 16.8331C20.8994 16.8014 20.9974 16.7901 21.0943 16.8Z" fill="#3A3F51" />
      </Svg>
    </TouchableOpacity>
  );

  // Componente de linha de informação do resumo da venda
  const InfoRow: React.FC<{
    label: string;
    value: string;
    showDivider?: boolean;
  }> = ({ label, value, showDivider = true }) => (
    <>
      {/* Container da linha de informação */}
      <View style={styles.infoRow}>
        {/* Label da informação */}
        <View style={styles.infoLabelContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
        </View>
        {/* Valor da informação */}
        <View style={styles.infoValueContainer}>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      {/* Divisor pontilhado entre linhas */}
      {showDivider && <View style={styles.infoDivider} />}
    </>
  );

  // Componente do card de solicitação (aba "Suas solicitações")
  const SolicitacaoCard: React.FC<{ data: SolicitacaoData }> = ({ data }) => (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: getCardBackgroundColor(data.status) },
      ]}
    >
      {/* Header do card com número, status e botão Aplicar */}
      <View style={styles.cardHeader}>
        {/* Container interno do header com borda branca */}
        <View style={styles.cardHeaderInner}>
          {/* Badge numérico do card */}
          <View
            style={[
              styles.cardBadge,
              { backgroundColor: getBadgeBackgroundColor(data.status) },
            ]}
          >
            <Text style={styles.cardBadgeText}>{formatCardNumber(data.id)}</Text>
          </View>

          {/* Container do status */}
          <View style={styles.cardStatusContainer}>
            {/* Label "Status" */}
            <View style={styles.cardStatusLabelRow}>
              <Text style={styles.cardStatusLabel}>Status</Text>
            </View>
            {/* Linha pontilhada decorativa */}
            <View style={styles.statusDottedLine} />
            {/* Valor do status */}
            <View style={styles.cardStatusValueRow}>
              <Text
                style={[
                  styles.cardStatusValue,
                  { color: getStatusTextColor(data.status) },
                ]}
              >
                {data.statusLabel}
              </Text>
            </View>
          </View>

        {/* Botão Aplicar */}
        <TouchableOpacity
          style={[
            styles.aplicarButton,
            { backgroundColor: getAplicarButtonBackground(data.status), opacity: getAplicarButtonOpacity(data.status) },
          ]}
          disabled={!isAplicarEnabled(data.status)}
          activeOpacity={0.7}
          onPress={() => {
            if (!isAplicarEnabled(data.status)) return;
            const fromRouteName = (route as any)?.params?.fromRouteName;
            const target = fromRouteName || ScreenNames.SalesHome;
            const params: any = { discountReturn: { selectedOption: 'manager', managerStep: 0 } };
            if (target === ScreenNames.SalesHome) params.autoOpenDiscount = true;
            navigation.navigate(target as any, params);
          }}
        >
          <Text style={styles.aplicarButtonText}>Aplicar</Text>
        </TouchableOpacity>
        </View>
      </View>

      {/* Seção Resumo da Venda */}
      <View style={styles.resumoContainer}>
        {/* Header do resumo com título, ID e ícone de olho */}
        <View style={styles.resumoHeaderRow}>
          {/* Coluna com título e ID */}
          <View style={styles.resumoTitleColumn}>
            {/* Título da seção */}
            <View style={styles.resumoTitleRow}>
              <Text style={styles.resumoTitle}>Resumo da venda</Text>
            </View>
            {/* ID da venda */}
            <View style={styles.resumoIdRow}>
              <Text style={styles.resumoIdText}>ID: {data.vendaId}</Text>
            </View>
          </View>
          <EyeIcon onPress={() => openRequestModalFor(data.id)} />
        </View>

        {/* Divisor após o header */}
        <View style={styles.infoDivider} />

        {/* Linhas de informação */}
        <View style={styles.resumoContent}>
          <InfoRow label="Produto" value={data.produto} />
          <InfoRow label="Serviço" value={data.servico} />
          <InfoRow label="Total" value={data.total} />
          <InfoRow label="Honorários" value={data.honorarios} showDivider={false} />
        </View>
      </View>

      {/* Seção Desconto e Redução de Premiação */}
      <View style={styles.descontoReducaoContainer}>
        {/* Desconto: título superior e valores inferiores */}
        <View style={styles.descontoRow}>
          <View style={styles.descontoTitleRow}>
            <Text style={styles.descontoLabel}>Desconto</Text>
          </View>
          <View style={styles.descontoValuesRow}>
            <View style={styles.descontoPercentLeft}>
              <Text style={styles.descontoValue}>{data.descontoPercentual}</Text>
            </View>
            <View style={styles.descontoMoneyRight}>
              <Text style={styles.descontoValue}>{data.descontoValor}</Text>
            </View>
          </View>
        </View>

        {/* Divisor entre blocos */}
        <View style={styles.descontoDivider} />

        {/* Redução de premiação: título superior e valores inferiores */}
        <View style={styles.reducaoBlock}>
          <View style={styles.reducaoTitleRow}>
            <Text style={styles.reducaoTitle}>Redução de premiação</Text>
          </View>
          <View style={styles.reducaoValuesRow}>
            <View style={styles.reducaoPercentLeft}>
              <Text style={styles.seuLucroValue}>{data.seuLucroPercentual}</Text>
            </View>
            <View style={styles.reducaoMoneyRight}>
              <Text style={styles.seuLucroValue}>{data.seuLucroValor}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // Componente do card de condição (aba "Novas condições")
  const CondicaoCard: React.FC<{ data: CondicaoData }> = ({ data }) => {
    const resumo = getCondicaoResumoById(data.condicaoId);
    return (
    <View
      style={[
        styles.cardContainer,
        { backgroundColor: 'rgba(23, 119, 207, 0.1)' },
      ]}
    >
      {/* Header do card com número, condição ID e botão Aplicar */}
      <View style={styles.cardHeader}>
        {/* Container interno do header com borda branca */}
        <View style={styles.cardHeaderInner}>
          {/* Badge numérico do card */}
          <View
            style={[
              styles.cardBadge,
              { backgroundColor: '#1777CF' },
            ]}
          >
            <Text style={styles.cardBadgeText}>{formatCardNumber(data.id)}</Text>
          </View>

          {/* Container da condição (substituindo o status) */}
          <View style={styles.cardStatusContainer}>
            {/* Label "Condição" */}
            <View style={styles.cardStatusLabelRow}>
              <Text style={styles.cardStatusLabel}>Condição</Text>
            </View>
            {/* Linha pontilhada decorativa */}
            <View style={styles.statusDottedLine} />
            {/* ID da condição (no lugar do valor do status) */}
            <View style={styles.cardStatusValueRow}>
              <Text
                style={[
                  styles.cardStatusValue,
                  { color: '#3A3F51' },
                ]}
              >
                ID: {data.condicaoId}
              </Text>
            </View>
          </View>

          {/* Botão Aplicar - sempre azul e habilitado */}
          <TouchableOpacity
            style={[
              styles.aplicarButton,
              { backgroundColor: '#1777CF', opacity: 1 },
            ]}
            activeOpacity={0.7}
            onPress={() => {
              const fromRouteName = (route as any)?.params?.fromRouteName;
              const target = fromRouteName || ScreenNames.SalesHome;
              const step = data.condicaoId === '10050232' || data.id === 1 ? 1 : data.condicaoId === '20050232' || data.id === 2 ? 2 : data.condicaoId === '30050232' || data.id === 3 ? 3 : 0;
              const params: any = { discountReturn: { selectedOption: 'manager', managerStep: step } };
              if (target === ScreenNames.SalesHome) params.autoOpenDiscount = true;
              navigation.navigate(target as any, params);
            }}
          >
            <Text style={styles.aplicarButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Seção Resumo da Venda */}
      <View style={styles.resumoContainer}>
        {/* Header do resumo com título e ícone de olho (sem ID abaixo) */}
        <View style={styles.resumoHeaderRow}>
          {/* Coluna com apenas título (sem ID) */}
          <View style={styles.resumoTitleColumn}>
            {/* Título da seção */}
            <View style={styles.resumoTitleRow}>
              <Text style={styles.resumoTitle}>Resumo da venda</Text>
            </View>
          </View>
          {/* Ícone de olho clicável para abrir o modal de condições */}
          <EyeIcon onPress={() => openConditionModalFor(data.id)} />
        </View>

        {/* Divisor após o header */}
        <View style={styles.infoDivider} />

        {/* Linhas de informação */}
        <View style={styles.resumoContent}>
          <InfoRow label="Produto" value={data.produto} />
          <InfoRow label="Serviço" value={data.servico} />
          <InfoRow label="Total" value={data.total} />
          <InfoRow label="Honorários" value={resumo?.detalhesVenda.tipoHonorarios ?? data.honorarios} showDivider={false} />
        </View>
      </View>

      {/* Seção Desconto e Redução de Premiação */}
      <View style={styles.descontoReducaoContainer}>
        {/* Desconto: título superior e valores inferiores */}
        <View style={styles.descontoRow}>
          <View style={styles.descontoTitleRow}>
            <Text style={styles.descontoLabel}>Desconto</Text>
          </View>
          <View style={styles.descontoValuesRow}>
            <View style={styles.descontoPercentLeft}>
              <Text style={styles.descontoValue}>{resumo?.descontoTotalCliente.totalPercent ?? data.descontoPercentual}</Text>
            </View>
            <View style={styles.descontoMoneyRight}>
              <Text style={styles.descontoValue}>{resumo?.descontoTotalCliente.totalValor ?? data.descontoValor}</Text>
            </View>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.descontoDivider} />

        {/* Redução de premiação: título superior e valores inferiores */}
        <View style={styles.reducaoBlock}>
          <View style={styles.reducaoTitleRow}>
            <Text style={styles.reducaoTitle}>Redução de premiação</Text>
          </View>
          <View style={styles.reducaoValuesRow}>
            <View style={styles.reducaoPercentLeft}>
              <Text style={styles.seuLucroValue}>{resumo?.reducaoTotalPremiacao.totalPercent ?? data.seuLucroPercentual}</Text>
            </View>
            <View style={styles.reducaoMoneyRight}>
              <Text style={styles.seuLucroValue}>{resumo?.reducaoTotalPremiacao.totalValor ?? data.seuLucroValor}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  }

  // Componente do estado vazio
  const EmptyState: React.FC<{ type: 'solicitacoes' | 'condicoes' }> = ({ type }) => (
    <View style={styles.emptyStateContainer}>
      <View style={styles.emptyIllustrationWrapper}>
        <Image
          source={require('../../../Ilustração - Gerenciar.svg')}
          style={styles.emptyIllustration}
          resizeMode="contain"
        />
      </View>
      <View style={styles.emptyTextWrapper}>
        <Text style={styles.emptyTitle}>
          {type === 'solicitacoes'
            ? 'Nenhuma solicitação\nencontrada!'
            : 'Nenhuma condição\nencontrada!'}
        </Text>
      </View>
      <View style={styles.emptyDescWrapper}>
        <Text style={styles.emptyDescription}>
          {type === 'solicitacoes'
            ? 'Você ainda não enviou nenhuma solicitação para o gestor. Quando enviar, elas aparecerão aqui.'
            : 'O gestor ainda não cadastrou novas condições. Elas aparecerão aqui assim que forem criadas.'}
        </Text>
      </View>
    </View>
  );

  // Dados das condições com base no estado (vazio ou com cards)
  const condicoesParaExibir = mostrarCondicoesVazio ? novasCondicoesVazio : novasCondicoesData;

  // Contagem de solicitações e novas condições para os badges
  const solicitacoesCount = solicitacoesData.length;
  const condicoesCount = condicoesParaExibir.length;
  const chatBadgeCount = 3;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* ============================================= */}
        {/* SEÇÃO FIXA - Header e Abas (não rola) */}
        {/* ============================================= */}
        <View style={styles.fixedHeader}>
          {/* Container do botão de voltar */}
          <View style={styles.backHeader}>
            {/* Botão de voltar para a tela anterior */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              const fromRouteName = (route as any)?.params?.fromRouteName;
              const target = fromRouteName || ScreenNames.SalesHome;
              const params: any = {};
              if (target === ScreenNames.SalesHome) params.autoOpenDiscount = true;
              if (onClose) onClose();
              else navigation.navigate(target as any, params);
            }}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
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

          {/* Divisor fixo abaixo do botão de voltar */}
          <View style={styles.headerDivider} />

          {/* Abas principais - Cliente, Venda, Gerenciar, Chat */}
          <View style={styles.tabsWrapper}>
            {/* Container das abas principais com fundo cinza (48px altura, 4px padding) */}
            <View style={styles.tabsBox}>
              {/* Aba Cliente */}
              <TouchableOpacity
                style={[styles.tabBtn, styles.tabWCliente]}
                onPress={() => navigation.navigate(ScreenNames.DiscountCustomer as any)}
              >
                <Text style={styles.tabText}>Cliente</Text>
              </TouchableOpacity>

              {/* Aba Venda */}
              <TouchableOpacity
                style={[styles.tabBtn, styles.tabWVenda]}
                onPress={() => navigation.navigate(ScreenNames.DiscountSales as any)}
              >
                <Text style={styles.tabText}>Venda</Text>
              </TouchableOpacity>

              {/* Aba Gerenciar (ativa) com badge de contagem */}
              <View style={styles.tabBtnWithBadge}>
                {/* Botão ativo com 40px de altura */}
                <View style={[styles.tabBtn, styles.tabWGerenciar, styles.tabBtnActive]}>
                  <Text style={[styles.tabText, styles.tabTextActive]}>Gerenciar</Text>
                </View>
                {/* Badge de contagem total */}
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>
                    {formatCardNumber(solicitacoesCount + condicoesCount)}
                  </Text>
                </View>
              </View>

              {/* Aba Chat com badge */}
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
          <View style={styles.sectionDividerTop} />
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Gerenciar descontos</Text>
          </View>
          <View style={styles.sectionDividerBottom} />
          <View style={styles.toggleWrapper}>
            <View style={styles.toggleBox}>
              <View style={styles.toggleBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.toggleBtn, activeTab === 'solicitacoes' && styles.toggleBtnActive]}
                  onPress={() => setActiveTab('solicitacoes')}
                  accessibilityRole="button"
                >
                  <Text style={[styles.toggleText, activeTab === 'solicitacoes' && styles.toggleTextActive]}>Suas solicitações</Text>
                </TouchableOpacity>
                <View style={styles.toggleBadge}>
                  <Text style={styles.toggleBadgeText}>
                    {formatCardNumber(solicitacoesCount)}
                  </Text>
                </View>
              </View>
              <View style={styles.toggleBtnWithBadge}>
                <TouchableOpacity
                  style={[styles.toggleBtn, activeTab === 'condicoes' && styles.toggleBtnActive]}
                  onPress={() => setActiveTab('condicoes')}
                  accessibilityRole="button"
                >
                  <Text style={[styles.toggleText, activeTab === 'condicoes' && styles.toggleTextActive]}>Novas condições</Text>
                </TouchableOpacity>
                <View style={styles.toggleBadge}>
                  <Text style={styles.toggleBadgeText}>
                    {formatCardNumber(condicoesCount || 3)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

        </View>

        {/* ============================================= */}
        {/* SEÇÃO SCROLLÁVEL - Lista de cards */}
        {/* Container com position relative e overflow hidden na web */}
        {/* ============================================= */}
        <View style={styles.contentContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={Platform.OS === 'android'}
            bounces={Platform.OS === 'ios'}
          >
            <View style={styles.cardsContainer}>
              {activeTab === 'solicitacoes' ? (
                // Renderização da aba "Suas solicitações"
                solicitacoesData.length > 0 ? (
                  solicitacoesData.map((item) => (
                    <SolicitacaoCard key={item.id} data={item} />
                  ))
                ) : (
                  <EmptyState type="solicitacoes" />
                )
              ) : (
                // Renderização da aba "Novas condições"
                condicoesParaExibir.length > 0 ? (
                  condicoesParaExibir.map((item) => (
                    <CondicaoCard key={item.id} data={item} />
                  ))
                ) : (
                  <EmptyState type="condicoes" />
                )
              )}
            </View>
          </ScrollView>
        </View>

        {/* ============================================= */}
        {/* MODAL DE SOLICITAÇÃO */}
        {/* ============================================= */}
      <DiscountModalRequest
        visible={requestModalVisible}
        onClose={closeRequestModal}
        onApply={handleApplyRequest}
        initialPage={requestInitialPage}
      />
      <DiscountModalCondition
        visible={conditionModalVisible}
        onClose={closeConditionModal}
        onApply={handleApplyCondition}
        initialPage={conditionInitialPage}
      />
      <NewSaleDiscount
        visible={discountModalVisible}
        onClose={() => setDiscountModalVisible(false)}
        initialSelectedOption={discountInitialSelectedOption}
        initialManagerStep={discountInitialManagerStep}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Container principal da SafeAreaView
  safeArea: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },

  // Container principal da tela
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },

  // ============================================
  // SEÇÃO FIXA (Header, Abas, Título, Toggle)
  // ============================================

  // Container da seção fixa que não rola
  fixedHeader: {
    backgroundColor: '#FCFCFC',
    zIndex: 10,
    height: HEADER_TOP_HEIGHT,
  },

  // Container do botão de voltar
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  // Estilos do botão de voltar
  backButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Divisor horizontal abaixo do header
  headerDivider: {
    height: 1,
    backgroundColor: '#D8E0F0',
  },

  // ============================================
  // ABAS PRINCIPAIS (Cliente, Venda, Gerenciar, Chat)
  // ============================================

  // Wrapper das abas principais centralizado
  tabsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    paddingTop: 18,
    backgroundColor: '#FCFCFC',
  },

  // Container das abas principais com fundo cinza
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

  // Estilos de cada botão de aba
  tabBtn: {
    alignSelf: 'stretch',
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Wrapper do botão de aba com badge
  tabBtnWithBadge: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },

  // Estilos da aba ativa (fundo azul)
  tabBtnActive: {
    backgroundColor: '#1777CF',
    height: 32,
  },

  // Texto das abas (cor padrão)
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

  // Badge de contagem na aba principal
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

  // Texto do badge da aba principal
  tabBadgeText: {
    color: '#1777CF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  // ============================================
  // TÍTULO DA SEÇÃO
  // ============================================

  // Divisor superior da seção de título
  sectionDividerTop: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 5,
  },

  // Container do título da seção
  sectionTitleRow: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  // Título "Gerenciar descontos"
  sectionTitle: {
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },

  // Divisor inferior da seção de título
  sectionDividerBottom: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginHorizontal: 16,
    marginTop: 5,
    marginBottom: 10,
  },

  // ============================================
  // TOGGLE (Suas solicitações / Novas condições)
  // ============================================

  // Wrapper centralizado do toggle de abas
  toggleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    marginTop: 10,
    paddingHorizontal: 16,
  },

  // Container do toggle com fundo cinza
  toggleBox: {
    flexDirection: 'row',
    height: 42,
    padding: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    gap: 4,
  },

  // Wrapper do botão do toggle com badge
  toggleBtnWithBadge: {
    position: 'relative',
  },

  // Estilos de cada botão do toggle
  toggleBtn: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Estilos do botão do toggle ativo (fundo branco)
  toggleBtnActive: {
    backgroundColor: '#1777CF',
  },

  // Texto do toggle (cor padrão)
  toggleText: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Texto do toggle ativo (cor escura)
  toggleTextActive: {
    color: '#FCFCFC',
    fontFamily: 'Inter_500Medium',
  },

  // Badge de contagem no toggle
  toggleBadge: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 25,
    height: 25,
    borderRadius: 99,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
    backgroundColor: '#FCFCFC',
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
  },

  // Badge ativo (quando a aba está selecionada)
  toggleBadgeActive: {},
  toggleBadgeInactive: {},

  // Texto do badge do toggle
  toggleBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#1777CF',
  },

  // Texto do badge quando aba está selecionada (branco)
  toggleBadgeTextInactive: {},
  toggleBadgeTextActive: {},

  // ============================================
  // SEÇÃO SCROLLÁVEL (Lista de cards)
  // ============================================

  // Container do conteúdo scrollável
  contentContainer: {
    flex: 1,
    position: 'relative',
    ...(Platform.OS === 'web' ? { overflow: 'hidden' } : {}),
  },

  // ScrollView
  scrollView: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'scroll',
        }
      : {}),
  },

  // Conteúdo do scroll
  scrollContent: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 5,
  },

  // Container dos cards
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 15,
  },

  // ============================================
  // CARD DE SOLICITAÇÃO
  // ============================================

  // Container principal do card
  cardContainer: {
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 5,
    gap: 5,
  },

  // Header do card
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Container interno do header com borda
  cardHeaderInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 10,
  },

  // Badge numérico do card
  cardBadge: {
    width: 40,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto do badge numérico
  cardBadgeText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // Container do status
  cardStatusContainer: {
    flex: 1,
  },

  // Linha do label Status
  cardStatusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Label Status
  cardStatusLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Linha pontilhada decorativa do status
  statusDottedLine: {
    height: 1,
    backgroundColor: '#D8E0F0',
    marginVertical: 5,
  },

  // Linha do valor do status
  cardStatusValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Valor do status
  cardStatusValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Botão Aplicar
  aplicarButton: {
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Botão Aplicar desabilitado
  aplicarButtonDisabled: {
    backgroundColor: '#D8E0F0',
  },

  // Texto do botão Aplicar
  aplicarButtonText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // ============================================
  // SEÇÃO RESUMO DA VENDA
  // ============================================

  // Container do resumo da venda
  resumoContainer: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 10,
  },

  // Header do resumo (título + ID + ícone olho)
  resumoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },

  // Coluna com título e ID
  resumoTitleColumn: {
    flex: 1,
    gap: 5,
  },

  // Linha do título "Resumo da venda"
  resumoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Título "Resumo da venda"
  resumoTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Linha do ID da venda
  resumoIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Texto do ID da venda
  resumoIdText: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },

  // Container do ícone de olho
  eyeIconContainer: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Container do conteúdo do resumo
  resumoContent: {
    gap: 5,
  },

  // Linha de informação (label + valor)
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Container do label da informação
  infoLabelContainer: {
    width: 80,
  },

  // Label da informação (ex: "Produto", "Serviço")
  infoLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Container do valor da informação
  infoValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // Valor da informação
  infoValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textAlign: 'right',
  },

  // Divisor entre linhas de informação
  infoDivider: {
    height: 1,
    backgroundColor: '#D8E0F0',
    marginVertical: 5,
  },

  // ============================================
  // SEÇÃO DESCONTO E REDUÇÃO DE PREMIAÇÃO
  // ============================================

  // Container da seção de desconto e redução
  descontoReducaoContainer: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 10,
  },

  // Bloco do Desconto (duas camadas)
  descontoRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  descontoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Container do label "Desconto"
  descontoLabelContainer: {
    flex: 1,
  },

  // Label "Desconto"
  descontoLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Linha de valores do desconto (inferior)
  descontoValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  descontoPercentLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  descontoMoneyRight: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // Container do percentual do desconto
  descontoPercentContainer: {
    width: 75,
    alignItems: 'flex-end',
  },

  // Container do valor monetário do desconto
  descontoMoneyContainer: {
    width: 165,
    alignItems: 'flex-end',
  },

  // Valor do desconto (percentual e monetário)
  descontoValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Divisor após desconto
  descontoDivider: {
    height: 1,
    backgroundColor: '#D8E0F0',
  },

  // Linha do título "Redução de premiação"
  reducaoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reducaoBlock: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  reducaoValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  reducaoPercentLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  reducaoMoneyRight: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // Título "Redução de premiação"
  reducaoTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Divisor pontilhado após título da redução
  reducaoDottedDivider: {
    height: 2,
    backgroundColor: '#D8E0F0',
  },

  // Linha do "Seu lucro"
  seuLucroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Container do label "Seu lucro"
  seuLucroLabelContainer: {
    flex: 1,
  },

  // Label "Seu lucro"
  seuLucroLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Container dos valores do lucro
  seuLucroValuesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  // Container do percentual do lucro
  seuLucroPercentContainer: {
    width: 75,
    alignItems: 'flex-end',
  },

  // Container do valor monetário do lucro
  seuLucroMoneyContainer: {
    width: 165,
    alignItems: 'flex-end',
  },

  // Valor do lucro (percentual e monetário)
  seuLucroValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // ============================================
  // ESTADO VAZIO (Empty State)
  // ============================================

  // Container do estado vazio (quando não há solicitações)
  emptyStateContainer: {
    flex: 1,
    marginHorizontal: 0,
    marginBottom: 0,
    paddingHorizontal: 30,
    paddingVertical: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },

  // Wrapper da ilustração do estado vazio
  emptyIllustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  // Estilos da ilustração do estado vazio
  emptyIllustration: {
    width: 160,
    height: 240,
  },

  // Wrapper do título do empty state
  emptyTextWrapper: {
    paddingHorizontal: 16,
  },

  // Título do empty state
  emptyTitle: {
    textAlign: 'center',
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },

  // Wrapper da descrição do empty state
  emptyDescWrapper: {
    paddingHorizontal: 5,
  },

  // Descrição do empty state
  emptyDescription: {
    textAlign: 'center',
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    lineHeight: 20,
  },
});

export default DiscountManageScreen;
