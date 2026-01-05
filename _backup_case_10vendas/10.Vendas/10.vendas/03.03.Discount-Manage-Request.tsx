import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
  Image,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

// ============================================
// TIPAGENS E INTERFACES
// ============================================

// Tipo para os status possíveis de uma solicitação
type StatusType = 'aguardando' | 'aprovado' | 'reprovado';

// Interface para dados de método de pagamento
interface MetodoPagamentoData {
  nome: string;
  valor: string;
  parcelas?: string;
  juros?: string;
  descontoPercentOriginal?: string;
  descontoValorOriginal?: string;
  descontoPercentNovo?: string;
  descontoValorNovo?: string;
  reducaoPercentOriginal?: string;
  reducaoValorOriginal?: string;
  reducaoPercentNovo?: string;
  reducaoValorNovo?: string;
}

// Interface para dados de um tipo de honorário (Prolabore ou Êxito)
interface HonorarioData {
  tipo: 'prolabore' | 'exito';
  valor: string;
  metodos: MetodoPagamentoData[];
  totalDescontoPercentOriginal?: string;
  totalDescontoValorOriginal?: string;
  totalDescontoPercentNovo?: string;
  totalDescontoValorNovo?: string;
  totalReducaoPercentOriginal?: string;
  totalReducaoValorOriginal?: string;
  totalReducaoPercentNovo?: string;
  totalReducaoValorNovo?: string;
}

// Interface para dados de detalhes da venda
interface DetalhesVendaData {
  produto: string;
  servico: string;
  tipoHonorarios: string;
  imagemUrl?: string;
}

// Interface para dados completos de uma solicitação
interface SolicitacaoData {
  id: string;
  numero: number;
  total: number;
  status: StatusType;
  statusLabel: string;
  valorProduto: string;
  detalhesVenda: DetalhesVendaData;
  honorarios: HonorarioData[];
  descontoTotalCliente: {
    prolaborePercent: string;
    prolaboreValor: string;
    exitoPercent: string;
    exitoValor: string;
    totalPercent: string;
    totalValor: string;
  };
  reducaoTotalPremiacao: {
    prolaborePercent: string;
    prolaboreValor: string;
    exitoPercent: string;
    exitoValor: string;
    totalPercent: string;
    totalValor: string;
  };
}

// Props do componente Modal
interface DiscountModalRequestProps {
  visible: boolean;
  onClose: () => void;
  onApply?: (solicitacao: SolicitacaoData) => void;
  initialPage?: number;
}

// ============================================
// DADOS MOCKADOS DAS SOLICITAÇÕES
// ============================================

// Dados mockados para demonstração das 3 abas
const solicitacoesMock: SolicitacaoData[] = [
  {
    id: '102030',
    numero: 1,
    total: 3,
    status: 'aguardando',
    statusLabel: 'Aguardando aprovação',
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
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentNovo: '2%',
            descontoValorNovo: 'R$ 500,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 15.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '2%',
            descontoValorNovo: 'R$ 300,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Boleto',
            valor: 'R$ 10.000,00',
            parcelas: '5 × 2.000,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '2%',
            descontoValorNovo: 'R$ 200,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
        ],
        totalDescontoPercentNovo: '2%',
        totalDescontoValorNovo: 'R$ 1.000,00',
        totalReducaoPercentNovo: '0%',
        totalReducaoValorNovo: 'R$ 0,00',
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentNovo: '2%',
            descontoValorNovo: 'R$ 500,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 45.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '2%',
            descontoValorNovo: 'R$ 900,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
        ],
        totalDescontoPercentNovo: '2%',
        totalDescontoValorNovo: 'R$ 1.400,00',
        totalReducaoPercentNovo: '0%',
        totalReducaoValorNovo: 'R$ 0,00',
      },
    ],
    descontoTotalCliente: {
      prolaborePercent: '2%',
      prolaboreValor: 'R$ 1.000,00',
      exitoPercent: '2%',
      exitoValor: 'R$ 1.400,00',
      totalPercent: '2%',
      totalValor: 'R$ 2.400,00',
    },
    reducaoTotalPremiacao: {
      prolaborePercent: '0%',
      prolaboreValor: 'R$ 0,00',
      exitoPercent: '0%',
      exitoValor: 'R$ 0,00',
      totalPercent: '0%',
      totalValor: 'R$ 0,00',
    },
  },
  {
    id: '203040',
    numero: 2,
    total: 3,
    status: 'aprovado',
    statusLabel: 'Aprovado - 50%',
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
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentOriginal: '2%',
            descontoValorOriginal: 'R$ 500,00',
            descontoPercentNovo: '5%',
            descontoValorNovo: 'R$ 1.250,00',
            reducaoPercentOriginal: '0%',
            reducaoValorOriginal: 'R$ 0,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 15.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentOriginal: '2%',
            descontoValorOriginal: 'R$ 300,00',
            descontoPercentNovo: '5%',
            descontoValorNovo: 'R$ 750,00',
            reducaoPercentOriginal: '0%',
            reducaoValorOriginal: 'R$ 0,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Boleto',
            valor: 'R$ 10.000,00',
            parcelas: '5 × 2.000,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentOriginal: '2%',
            descontoValorOriginal: 'R$ 200,00',
            descontoPercentNovo: '5%',
            descontoValorNovo: 'R$ 500,00',
            reducaoPercentOriginal: '0%',
            reducaoValorOriginal: 'R$ 0,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
        ],
        totalDescontoPercentOriginal: '2%',
        totalDescontoValorOriginal: 'R$ 1.000,00',
        totalDescontoPercentNovo: '5%',
        totalDescontoValorNovo: 'R$ 2.500,00',
        totalReducaoPercentOriginal: '0%',
        totalReducaoValorOriginal: 'R$ 0,00',
        totalReducaoPercentNovo: '0%',
        totalReducaoValorNovo: 'R$ 0,00',
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentOriginal: '2%',
            descontoValorOriginal: 'R$ 500,00',
            descontoPercentNovo: '5%',
            descontoValorNovo: 'R$ 1.250,00',
            reducaoPercentOriginal: '0%',
            reducaoValorOriginal: 'R$ 0,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 45.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentOriginal: '2%',
            descontoValorOriginal: 'R$ 900,00',
            descontoPercentNovo: '5%',
            descontoValorNovo: 'R$ 2.250,00',
            reducaoPercentOriginal: '0%',
            reducaoValorOriginal: 'R$ 0,00',
            reducaoPercentNovo: '0%',
            reducaoValorNovo: 'R$ 0,00',
          },
        ],
        totalDescontoPercentOriginal: '2%',
        totalDescontoValorOriginal: 'R$ 1.400,00',
        totalDescontoPercentNovo: '5%',
        totalDescontoValorNovo: 'R$ 3.500,00',
        totalReducaoPercentOriginal: '0%',
        totalReducaoValorOriginal: 'R$ 0,00',
        totalReducaoPercentNovo: '0%',
        totalReducaoValorNovo: 'R$ 0,00',
      },
    ],
    descontoTotalCliente: {
      prolaborePercent: '5%',
      prolaboreValor: 'R$ 2.500,00',
      exitoPercent: '5%',
      exitoValor: 'R$ 3.500,00',
      totalPercent: '5%',
      totalValor: 'R$ 6.000,00',
    },
    reducaoTotalPremiacao: {
      prolaborePercent: '0%',
      prolaboreValor: 'R$ 0,00',
      exitoPercent: '0%',
      exitoValor: 'R$ 0,00',
      totalPercent: '0%',
      totalValor: 'R$ 0,00',
    },
  },
  {
    id: '304050',
    numero: 3,
    total: 3,
    status: 'reprovado',
    statusLabel: 'Reprovado',
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
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentNovo: '8%',
            descontoValorNovo: 'R$ 2.000,00',
            reducaoPercentNovo: '5%',
            reducaoValorNovo: 'R$ 2.500,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 15.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '8%',
            descontoValorNovo: 'R$ 1.200,00',
            reducaoPercentNovo: '5%',
            reducaoValorNovo: 'R$ 2.500,00',
          },
          {
            nome: 'Boleto',
            valor: 'R$ 10.000,00',
            parcelas: '5 × 2.000,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '8%',
            descontoValorNovo: 'R$ 800,00',
            reducaoPercentNovo: '5%',
            reducaoValorNovo: 'R$ 2.500,00',
          },
        ],
        totalDescontoPercentNovo: '8%',
        totalDescontoValorNovo: 'R$ 4.000,00',
        totalReducaoPercentNovo: '5%',
        totalReducaoValorNovo: 'R$ 2.500,00',
      },
      {
        tipo: 'exito',
        valor: 'R$ 70.000,00',
        metodos: [
          {
            nome: 'Pix',
            valor: 'R$ 25.000,00',
            descontoPercentNovo: '8%',
            descontoValorNovo: 'R$ 2.000,00',
            reducaoPercentNovo: '5%',
            reducaoValorNovo: 'R$ 3.500,00',
          },
          {
            nome: 'Crédito',
            valor: 'R$ 45.000,00',
            parcelas: '10 × 1.500,00',
            juros: 'Juros: R$ 00,00',
            descontoPercentNovo: '8%',
            descontoValorNovo: 'R$ 3.600,00',
            reducaoPercentNovo: '5%',
            reducaoValorNovo: 'R$ 3.500,00',
          },
        ],
        totalDescontoPercentNovo: '8%',
        totalDescontoValorNovo: 'R$ 5.600,00',
        totalReducaoPercentNovo: '5%',
        totalReducaoValorNovo: 'R$ 3.500,00',
      },
    ],
    descontoTotalCliente: {
      prolaborePercent: '8%',
      prolaboreValor: 'R$ 4.000,00',
      exitoPercent: '8%',
      exitoValor: 'R$ 5.600,00',
      totalPercent: '8%',
      totalValor: 'R$ 9.600,00',
    },
    reducaoTotalPremiacao: {
      prolaborePercent: '5%',
      prolaboreValor: 'R$ 2.500,00',
      exitoPercent: '5%',
      exitoValor: 'R$ 3.500,00',
      totalPercent: '5%',
      totalValor: 'R$ 6.000,00',
    },
  },
];

// ============================================
// COMPONENTES DE ÍCONES SVG
// ============================================

// Ícone de fechar (X) do modal
const CloseIcon: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Path
      d="M24.5 13.5L13.5 24.5M13.5 13.5L24.5 24.5"
      stroke="#3A3F51"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de seta para esquerda (navegação)
const ArrowLeftIcon: React.FC = () => (
  <Svg width={40} height={35} viewBox="0 0 40 35" fill="none">
    <Rect width={40} height={35} rx={6} fill="#1777CF" />
    <Path
      d="M22 12L15 17.5L22 23"
      stroke="#FCFCFC"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de seta para direita (navegação)
const ArrowRightIcon: React.FC = () => (
  <Svg width={40} height={35} viewBox="0 0 40 35" fill="none">
    <Rect width={40} height={35} rx={6} fill="#1777CF" />
    <Path
      d="M18 12L25 17.5L18 23"
      stroke="#FCFCFC"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone do container "Valor do produto"
const ValorProdutoIcon: React.FC = () => (
  <Svg width={24} height={20} viewBox="0 0 24 20" fill="none">
    <Path
      d="M22.3779 3.08362H20.2376H18.198H16.8398V1.63364C16.8398 0.734654 16.1152 0 15.2178 0H8.77745C7.88482 0 7.15537 0.729821 7.15537 1.63364V3.08362H5.79724H3.75765H1.62208C0.724655 3.08362 0 3.81344 0 4.71242V18.3664C0 19.2653 0.724655 20 1.62208 20H3.76245H5.80204H18.198H20.2376H22.3779C23.2705 20 24 19.2702 24 18.3664V4.71242C23.9952 3.81344 23.2705 3.08362 22.3779 3.08362ZM7.64007 4.05027H16.3599H17.7181V19.0333H6.27714V4.05027H7.64007ZM8.11998 1.63364C8.11998 1.26631 8.41752 0.966651 8.78224 0.966651H15.2226C15.5873 0.966651 15.8848 1.26631 15.8848 1.63364V3.08362H8.11998V1.63364ZM0.959808 18.3664V4.71242C0.959808 4.34509 1.25735 4.04543 1.62208 4.04543L5.79724 4.05027V11.798V19.0333L1.62208 19.0285C1.25735 19.0333 0.959808 18.7337 0.959808 18.3664ZM5.79724 19.0333V11.798V4.05027H5.31734V19.0333H5.79724ZM18.6779 19.0333V4.05027H18.198V19.0333H18.6779ZM23.0354 18.3664C23.0354 18.7337 22.7379 19.0333 22.3731 19.0333H18.198V4.05027H22.3731C22.7379 4.05027 23.0354 4.34993 23.0354 4.71725V18.3664Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Ícone do container "Prolabore"
const ProlaboreIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 5.71428C10.5198 5.67238 11.0353 5.8359 11.4359 6.16974C11.8365 6.50359 12.0903 6.98116 12.1429 7.5C12.1429 7.68944 12.2181 7.87112 12.3521 8.00507C12.486 8.13903 12.6677 8.21428 12.8571 8.21428C13.0466 8.21428 13.2283 8.13903 13.3622 8.00507C13.4962 7.87112 13.5714 7.68944 13.5714 7.5C13.5375 6.72409 13.2333 5.98448 12.7115 5.40921C12.1897 4.83395 11.4832 4.45925 10.7143 4.35V3.57143C10.7143 3.38199 10.639 3.20031 10.5051 3.06635C10.3711 2.9324 10.1894 2.85714 10 2.85714C9.81056 2.85714 9.62888 2.9324 9.49493 3.06635C9.36097 3.20031 9.28572 3.38199 9.28572 3.57143V4.35C8.51679 4.45925 7.81028 4.83395 7.28849 5.40921C6.76671 5.98448 6.46252 6.72409 6.42857 7.5C6.42857 9.7 8.96429 10.4429 9.8 10.6857C12.0429 11.3429 12.1429 11.7357 12.1429 12.5C12.0903 13.0188 11.8365 13.4964 11.4359 13.8303C11.0353 14.1641 10.5198 14.3276 10 14.2857C9.4802 14.3276 8.96469 14.1641 8.56407 13.8303C8.16346 13.4964 7.90966 13.0188 7.85715 12.5C7.85715 12.3106 7.78189 12.1289 7.64794 11.9949C7.51398 11.861 7.3323 11.7857 7.14286 11.7857C6.95342 11.7857 6.77174 11.861 6.63778 11.9949C6.50383 12.1289 6.42857 12.3106 6.42857 12.5C6.46252 13.2759 6.76671 14.0155 7.28849 14.5908C7.81028 15.166 8.51679 15.5407 9.28572 15.65V16.4286C9.28572 16.618 9.36097 16.7997 9.49493 16.9336C9.62888 17.0676 9.81056 17.1429 10 17.1429C10.1894 17.1429 10.3711 17.0676 10.5051 16.9336C10.639 16.7997 10.7143 16.618 10.7143 16.4286V15.65C11.4832 15.5407 12.1897 15.166 12.7115 14.5908C13.2333 14.0155 13.5375 13.2759 13.5714 12.5C13.5714 10.4571 12.1429 9.87143 10.2 9.28571C8.1 8.7 7.85715 7.98571 7.85715 7.5C7.90966 6.98116 8.16346 6.50359 8.56407 6.16974C8.96469 5.8359 9.4802 5.67238 10 5.71428Z"
      fill="#FCFCFC"
    />
    <Path
      d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433288 8.00043 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 7.34783 18.9464 4.80429 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0ZM10 18.5714C8.30473 18.5714 6.64754 18.0687 5.23797 17.1269C3.82841 16.185 2.72979 14.8464 2.08104 13.2801C1.43229 11.7139 1.26254 9.99049 1.59327 8.3278C1.924 6.6651 2.74035 5.13782 3.93909 3.93908C5.13782 2.74035 6.66511 1.924 8.3278 1.59327C9.99049 1.26254 11.7139 1.43228 13.2801 2.08103C14.8464 2.72978 16.185 3.8284 17.1269 5.23797C18.0687 6.64753 18.5714 8.30473 18.5714 10C18.5714 12.2733 17.6684 14.4535 16.0609 16.0609C14.4535 17.6684 12.2733 18.5714 10 18.5714Z"
      fill="#FCFCFC"
    />
  </Svg>
);

// Ícone do container "Êxito"
const ExitoIcon: React.FC = () => (
  <Svg width={16} height={20} viewBox="0 0 16 20" fill="none">
    <Path
      d="M11.286 4.37973C11.2925 4.37269 11.2991 4.3657 11.3055 4.35871C11.7008 3.93355 11.3978 3.24219 10.8171 3.24219H4.41727C3.83656 3.24219 3.53359 3.93355 3.92875 4.35871L3.94832 4.37973C4.54254 5.015 6.77918 6.90234 6.80797 6.92703C7.27367 7.32645 7.96066 7.32645 8.42633 6.92703C8.45516 6.90231 10.6918 5.015 11.286 4.37973Z"
      fill="#FCFCFC"
    />
    <Path
      d="M10.669 9.41027C10.8552 9.24828 11.0682 9.06926 11.2937 8.87969C12.9568 7.48172 15.2344 5.56715 15.2344 3.55469V2.34375C15.2344 1.05141 14.183 0 12.8906 0H2.34375C1.05141 0 0 1.05141 0 2.34375V3.55469C0 5.56715 2.27762 7.48172 3.94066 8.87969C4.16613 9.06926 4.3791 9.24828 4.56531 9.41023C4.74227 9.56422 4.84375 9.77914 4.84375 10C4.84375 10.2209 4.74227 10.4358 4.56535 10.5897C4.37914 10.7517 4.16613 10.9307 3.94066 11.1203C2.27762 12.5183 0 14.4329 0 16.4453V17.6562C0 18.9486 1.05141 20 2.34375 20H12.8906C14.183 20 15.2344 18.9486 15.2344 17.6562C15.2344 17.2248 14.8846 16.875 14.4531 16.875C14.0216 16.875 13.6719 17.2248 13.6719 17.6562C13.6719 18.087 13.3214 18.4375 12.8906 18.4375H2.34375C1.91297 18.4375 1.5625 18.087 1.5625 17.6562V16.4453C1.5625 15.1606 3.68059 13.3802 4.94609 12.3163C5.17676 12.1224 5.39473 11.9392 5.5909 11.7685C6.1091 11.3177 6.40625 10.6731 6.40625 10C6.40625 9.32691 6.1091 8.68234 5.5909 8.23145C5.39469 8.06074 5.17676 7.87758 4.94609 7.68363C3.68059 6.61984 1.5625 4.83938 1.5625 3.55469V2.34375C1.5625 1.91297 1.91297 1.5625 2.34375 1.5625H12.8906C13.3214 1.5625 13.6719 1.91297 13.6719 2.34375V3.55469C13.6719 4.83938 11.5538 6.61984 10.2883 7.68367C10.0576 7.87758 9.83965 8.06078 9.64344 8.23152C9.12527 8.68234 8.82812 9.32695 8.82812 10C8.82812 10.6732 9.12527 11.3177 9.64348 11.7685C9.84797 11.9464 10.0758 12.1371 10.3171 12.3391C11.0771 12.9752 11.9386 13.6963 12.6185 14.4635C12.9046 14.7864 13.3984 14.8161 13.7213 14.53C14.0442 14.2438 14.074 13.75 13.7878 13.4271C13.0307 12.5729 12.0821 11.7789 11.32 11.1409C11.0846 10.9439 10.8623 10.7579 10.669 10.5897C10.4921 10.4358 10.3906 10.2209 10.3906 10C10.3906 9.77914 10.4921 9.56418 10.669 9.41027Z"
      fill="#FCFCFC"
    />
  </Svg>
);

// Ícone de escudo para o container "Detalhes da venda"
const ShieldIcon: React.FC = () => (
  <Svg width={50} height={60} viewBox="0 0 50 60" fill="none">
    <Path
      d="M25 0L0 10V27.5C0 42.75 10.67 57.05 25 60C39.33 57.05 50 42.75 50 27.5V10L25 0Z"
      fill="#1A365D"
    />
    <Path
      d="M25 5L5 13V27.5C5 40.25 13.83 52.05 25 55C36.17 52.05 45 40.25 45 27.5V13L25 5Z"
      fill="#2B4F7F"
    />
    <Path
      d="M35 22L23 34L17 28"
      stroke="#F5A623"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ============================================
// COMPONENTE PRINCIPAL DO MODAL
// ============================================

const DiscountModalRequest: React.FC<DiscountModalRequestProps> = (props) => {
  const { visible, onClose, onApply, initialPage } = props;
  // Estado para controlar qual página está sendo exibida (0, 1 ou 2)
  const [currentPage, setCurrentPage] = React.useState<number>(initialPage ?? 0);
  React.useEffect(() => {
    if (visible) setCurrentPage(initialPage ?? 0);
  }, [visible, initialPage]);

  // Estado para controlar a expansão do container Prolabore
  const [prolaboreExpandido, setProlaboreExpandido] = React.useState<boolean>(true);

  // Estado para controlar a expansão do container Êxito
  const [exitoExpandido, setExitoExpandido] = React.useState<boolean>(true);

  // Obtém a altura da tela para calcular a altura máxima do modal
  const screenHeight = Dimensions.get('window').height;

  // Dados da solicitação atual baseado na página selecionada
  const currentSolicitacao = solicitacoesMock[currentPage];

  // Função para retornar a cor de fundo do container de status
  const getStatusBackgroundColor = (status: StatusType): string => {
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

  // Função para retornar a cor do texto do status
  const getStatusTextColor = (status: StatusType): string => {
    switch (status) {
      case 'aguardando':
        return '#3A3F51';
      case 'aprovado':
        return '#0FA33B';
      case 'reprovado':
        return '#DC3545';
      default:
        return '#3A3F51';
    }
  };

  const getAplicarBackgroundColor = (status: StatusType): string => {
    return '#FCFCFC';
  };

  const getAplicarTextColor = (status: StatusType): string => {
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

  const getAplicarOpacity = (status: StatusType): number => {
    return status === 'aprovado' ? 1 : 0.4;
  };

  // Função para verificar se o botão Aplicar deve estar habilitado
  const isAplicarEnabled = (status: StatusType): boolean => {
    return status === 'aprovado';
  };

  // Função para verificar se deve mostrar valores riscados
  const shouldShowStrikethrough = (status: StatusType): boolean => {
    return status === 'aprovado';
  };

  // Função para formatar número com dois dígitos
  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  // Função para navegar para a página anterior
  const goToPreviousPage = (): void => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Função para navegar para a próxima página
  const goToNextPage = (): void => {
    if (currentPage < solicitacoesMock.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Função para alternar a expansão do container Prolabore
  const toggleProlabore = (): void => {
    setProlaboreExpandido(!prolaboreExpandido);
  };

  // Função para alternar a expansão do container Êxito
  const toggleExito = (): void => {
    setExitoExpandido(!exitoExpandido);
  };

  // ============================================
  // COMPONENTE DE DETALHES DA VENDA
  // ============================================

  // Componente para renderizar os detalhes da venda
  const DetalhesVendaSection: React.FC<{
    detalhes: DetalhesVendaData;
  }> = ({ detalhes }) => (
    <View style={styles.detalhesVendaContainer}>
      {/* Coluna de conteúdo */}
      <View style={styles.detalhesVendaContent}>
        {/* Título */}
        <View style={styles.detalhesVendaTitleRow}>
          <Text style={styles.detalhesVendaTitle}>Detalhes da venda</Text>
        </View>

        {/* Divisor abaixo do título */}
        <View style={styles.detalhesVendaDivider} />

        {/* Conteúdo com imagem e informações */}
        <View style={styles.detalhesVendaBody}>
          {/* Imagem/Ícone do produto */}
          <View style={styles.detalhesVendaImageBox}>
            <Image
              source={require('../../../assets/00001.png')}
              style={styles.detalhesVendaImage}
            />
          </View>

          {/* Informações do produto */}
          <View style={styles.detalhesVendaInfo}>
            {/* Produto */}
            <View style={styles.detalhesVendaInfoItem}>
              <View style={styles.detalhesVendaLabelRow}>
                <Text style={styles.detalhesVendaLabel}>Produto</Text>
              </View>
              <View style={styles.detalhesVendaValueRow}>
                <Text style={styles.detalhesVendaValue}>{detalhes.produto}</Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.detalhesVendaInfoDivider} />

            {/* Serviço */}
            <View style={styles.detalhesVendaInfoItem}>
              <View style={styles.detalhesVendaLabelRow}>
                <Text style={styles.detalhesVendaLabel}>Serviço</Text>
              </View>
              <View style={styles.detalhesVendaValueRow}>
                <Text style={styles.detalhesVendaValue}>{detalhes.servico}</Text>
              </View>
            </View>

            {/* Divisor */}
            <View style={styles.detalhesVendaInfoDivider} />

            {/* Tipo de Honorários */}
            <View style={styles.detalhesVendaInfoItem}>
              <View style={styles.detalhesVendaLabelRow}>
                <Text style={styles.detalhesVendaLabel}>Tipo de Honorários</Text>
              </View>
              <View style={styles.detalhesVendaValueRow}>
                <Text style={styles.detalhesVendaValue}>{detalhes.tipoHonorarios}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // ============================================
  // COMPONENTE DE LINHA DE VALOR COM TEXTO RISCADO
  // ============================================

  // Componente para renderizar linha com valor original riscado e valor novo
  const ValueLineWithStrike: React.FC<{
    label: string;
    originalPercent?: string;
    originalValue?: string;
    newPercent: string;
    newValue: string;
    showStrike: boolean;
  }> = ({ label, originalPercent, originalValue, newPercent, newValue, showStrike }) => {
    const hasOriginal = showStrike && originalPercent && originalValue;

    return (
      <View style={styles.valueSection}>
        {/* Label da seção */}
        <View style={styles.valueLabelRow}>
          <Text style={styles.valueLabel}>{label}</Text>
        </View>

        {/* Linha com valor original riscado (se existir) */}
        {hasOriginal && (
          <View style={styles.valueRow}>
            {/* Percentual original riscado */}
            <View style={styles.valuePercentContainer}>
              <Text style={styles.valueTextStrike}>{originalPercent}</Text>
            </View>
            {/* Valor monetário original riscado */}
            <View style={styles.valueMoneyContainer}>
              <Text style={styles.valueTextStrike}>{originalValue}</Text>
            </View>
          </View>
        )}

        {/* Linha com valor novo */}
        <View style={styles.valueRow}>
          {/* Percentual novo */}
          <View style={styles.valuePercentContainer}>
            <Text style={styles.valueText}>{newPercent}</Text>
          </View>
          {/* Valor monetário novo */}
          <View style={styles.valueMoneyContainer}>
            <Text style={styles.valueText}>{newValue}</Text>
          </View>
        </View>
      </View>
    );
  };

  // ============================================
  // COMPONENTE DE MÉTODO DE PAGAMENTO
  // ============================================

  // Componente para renderizar um método de pagamento (Pix, Crédito, Boleto)
  const MetodoPagamentoCard: React.FC<{
    metodo: MetodoPagamentoData;
    showStrike: boolean;
  }> = ({ metodo, showStrike }) => (
    <View style={styles.metodoPagamentoCard}>
      {/* Nome do método e valor */}
      <View style={styles.metodoHeaderSection}>
        {/* Nome do método (Pix, Crédito, Boleto) */}
        <View style={styles.metodoNomeRow}>
          <Text style={styles.metodoNome}>{metodo.nome}</Text>
        </View>

        {/* Valor do método */}
        <View style={styles.metodoValorRow}>
          <Text style={styles.metodoValor}>{metodo.valor}</Text>
        </View>

        {/* Parcelas e juros (se existir) */}
        {metodo.parcelas && (
          <>
            {/* Divisor */}
            <View style={styles.metodoDivider} />

            {/* Linha de parcelas */}
            <View style={styles.metodoParcelasRow}>
              <View style={styles.metodoParcelasLeft}>
                <Text style={styles.metodoParcelasText}>{metodo.parcelas}</Text>
              </View>
              <View style={styles.metodoParcelasRight}>
                <Text style={styles.metodoJurosText}>{metodo.juros}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Divisor antes do desconto */}
      <View style={styles.metodoDivider} />

      {/* Seção de Desconto */}
      <ValueLineWithStrike
        label="Desconto"
        originalPercent={metodo.descontoPercentOriginal}
        originalValue={metodo.descontoValorOriginal}
        newPercent={metodo.descontoPercentNovo || '0%'}
        newValue={metodo.descontoValorNovo || 'R$ 00,00'}
        showStrike={showStrike}
      />

      {/* Divisor antes da redução */}
      <View style={styles.metodoDividerDashed} />

      {/* Seção de Redução de premiação */}
      <ValueLineWithStrike
        label="Redução de premiação"
        originalPercent={metodo.reducaoPercentOriginal}
        originalValue={metodo.reducaoValorOriginal}
        newPercent={metodo.reducaoPercentNovo || '0%'}
        newValue={metodo.reducaoValorNovo || 'R$ 00,00'}
        showStrike={showStrike}
      />
    </View>
  );

  // ============================================
  // COMPONENTE DE TOTAL DO HONORÁRIO
  // ============================================

  // Componente para renderizar o total de um honorário
  const TotalHonorarioCard: React.FC<{
    honorario: HonorarioData;
    showStrike: boolean;
  }> = ({ honorario, showStrike }) => (
    <View style={styles.totalHonorarioCard}>
      {/* Título Total */}
      <View style={styles.totalTitleRow}>
        <Text style={styles.totalTitle}>Total</Text>
      </View>

      {/* Divisor */}
      <View style={styles.metodoDividerDashed} />

      {/* Seção de Desconto */}
      <ValueLineWithStrike
        label="Desconto"
        originalPercent={honorario.totalDescontoPercentOriginal}
        originalValue={honorario.totalDescontoValorOriginal}
        newPercent={honorario.totalDescontoPercentNovo || '0%'}
        newValue={honorario.totalDescontoValorNovo || 'R$ 00,00'}
        showStrike={showStrike}
      />

      {/* Divisor */}
      <View style={styles.metodoDividerDashed} />

      {/* Seção de Redução de premiação */}
      <ValueLineWithStrike
        label="Redução de premiação"
        originalPercent={honorario.totalReducaoPercentOriginal}
        originalValue={honorario.totalReducaoValorOriginal}
        newPercent={honorario.totalReducaoPercentNovo || '0%'}
        newValue={honorario.totalReducaoValorNovo || 'R$ 00,00'}
        showStrike={showStrike}
      />
    </View>
  );

  // ============================================
  // COMPONENTE DE HONORÁRIO (Prolabore ou Êxito)
  // ============================================

  // Componente para renderizar um honorário completo com botão expandir/ocultar
  const HonorarioSection: React.FC<{
    honorario: HonorarioData;
    showStrike: boolean;
    isExpanded: boolean;
    onToggle: () => void;
  }> = ({ honorario, showStrike, isExpanded, onToggle }) => (
    <View style={styles.honorarioSection}>
      {/* Header do honorário com botão expandir/ocultar */}
      <View style={styles.honorarioHeader}>
        {/* Container do ícone */}
        <View style={styles.honorarioIconBox}>
          {honorario.tipo === 'prolabore' ? <ProlaboreIcon /> : <ExitoIcon />}
        </View>

        {/* Detalhes do honorário */}
        <View style={styles.honorarioDetails}>
          {/* Nome do honorário */}
          <View style={styles.honorarioNomeRow}>
            <Text style={styles.honorarioNome}>
              {honorario.tipo === 'prolabore' ? 'Prolabore' : 'Êxito'}
            </Text>
          </View>

          {/* Divisor */}
          <View style={styles.honorarioDivider} />

          {/* Valor do honorário */}
          <View style={styles.honorarioValorRow}>
            <Text style={styles.honorarioValor}>{honorario.valor}</Text>
          </View>
        </View>

        {/* Botão de expandir/ocultar */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleButtonText}>
            {isExpanded ? '-' : '+'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo expandível - Cards de métodos de pagamento */}
      {isExpanded && (
        <>
          {/* Cards de métodos de pagamento */}
          {honorario.metodos.map((metodo, index) => (
            <MetodoPagamentoCard
              key={`${honorario.tipo}-${metodo.nome}-${index}`}
              metodo={metodo}
              showStrike={showStrike}
            />
          ))}

          {/* Card de Total */}
          <TotalHonorarioCard honorario={honorario} showStrike={showStrike} />
        </>
      )}
    </View>
  );

  // ============================================
  // COMPONENTE DE DESCONTO TOTAL
  // ============================================

  // Componente para renderizar a seção de desconto total
  const DescontoTotalSection: React.FC<{
    solicitacao: SolicitacaoData;
  }> = ({ solicitacao }) => (
    <View style={styles.descontoTotalSection}>
      {/* Header do desconto total */}
      <View style={styles.descontoTotalHeader}>
        <Text style={styles.descontoTotalTitle}>Desconto total</Text>
      </View>

      {/* Container do desconto total */}
      <View style={styles.descontoTotalContent}>
        {/* Seção Desconto cliente */}
        <View style={styles.descontoClienteSection}>
          <Text style={styles.descontoClienteTitle}>Desconto cliente</Text>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Pró-labore */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Pró-labore</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.prolaborePercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.prolaboreValor}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Êxito */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Êxito</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.exitoPercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.exitoValor}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Total */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Total</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.totalPercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.descontoTotalCliente.totalValor}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Divisor maior entre seções */}
        <View style={styles.descontoTotalSectionDivider} />

        {/* Seção Redução de Premiação */}
        <View style={styles.descontoClienteSection}>
          <Text style={styles.descontoClienteTitle}>Redução de Premiação</Text>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Pró-labore */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Pró-labore</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.prolaborePercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.prolaboreValor}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Êxito */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Êxito</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.exitoPercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.exitoValor}
                </Text>
              </View>
            </View>
          </View>

          {/* Divisor */}
          <View style={styles.descontoTotalDivider} />

          {/* Linha Total */}
          <View style={styles.descontoTotalRow}>
            <View style={styles.descontoTotalTitleRow}>
              <Text style={styles.descontoTotalLabel}>Total</Text>
            </View>
            <View style={styles.descontoTotalValuesRow}>
              <View style={styles.descontoTotalPercentLeft}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.totalPercent}
                </Text>
              </View>
              <View style={styles.descontoTotalMoneyRight}>
                <Text style={styles.descontoTotalValue}>
                  {solicitacao.reducaoTotalPremiacao.totalValor}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  React.useEffect(() => {
    if (visible) {
      setProlaboreExpandido(true);
      setExitoExpandido(true);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Overlay escuro do modal */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        {/* Container principal do modal com altura máxima ajustada */}
        <TouchableOpacity
          style={[
            styles.modalContainer,
            { maxHeight: screenHeight - 20 },
          ]}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* Header do modal com título, ID e botão de fechar */}
          <View style={styles.modalHeader}>
            {/* Coluna com título e ID */}
            <View style={styles.headerTitleColumn}>
              {/* Título da solicitação */}
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>
                  Solicitação {formatNumber(currentSolicitacao.numero)}/
                  {formatNumber(currentSolicitacao.total)}
                </Text>
              </View>

              {/* ID da solicitação */}
              <View style={styles.headerIdRow}>
                <Text style={styles.headerId}>ID: {currentSolicitacao.id}</Text>
              </View>
            </View>

            {/* Botão de fechar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Navegação entre páginas */}
          <View style={styles.paginationContainer}>
            {/* Seta esquerda */}
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={goToPreviousPage}
              disabled={currentPage === 0}
              activeOpacity={0.7}
            >
              <View style={{ opacity: currentPage === 0 ? 0.4 : 1 }}>
                <ArrowLeftIcon />
              </View>
            </TouchableOpacity>

            {/* Números das páginas */}
            <View style={styles.pageNumbersContainer}>
              {solicitacoesMock.map((_, index) => (
                <TouchableOpacity
                  key={`page-${index}`}
                  style={[
                    styles.pageNumberBox,
                    index === currentPage && styles.pageNumberBoxActive,
                  ]}
                  onPress={() => setCurrentPage(index)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pageNumberText,
                      index === currentPage && styles.pageNumberTextActive,
                    ]}
                  >
                    {formatNumber(index + 1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Seta direita */}
            <TouchableOpacity
              style={styles.arrowButton}
              onPress={goToNextPage}
              disabled={currentPage === solicitacoesMock.length - 1}
              activeOpacity={0.7}
            >
              <View
                style={{
                  opacity: currentPage === solicitacoesMock.length - 1 ? 0.4 : 1,
                }}
              >
                <ArrowRightIcon />
              </View>
            </TouchableOpacity>
          </View>

          {/* Área scrollável com conteúdo */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={Platform.OS === 'ios'}
          >
            {/* Container de Detalhes da venda - NOVO CONTAINER */}
            <DetalhesVendaSection detalhes={currentSolicitacao.detalhesVenda} />

            {/* Container de Valor do produto */}
            <View style={styles.valorProdutoContainer}>
              {/* Ícone */}
              <View style={styles.valorProdutoIconBox}>
                <ValorProdutoIcon />
              </View>

              {/* Detalhes */}
              <View style={styles.valorProdutoDetails}>
                {/* Label */}
                <View style={styles.valorProdutoLabelRow}>
                  <Text style={styles.valorProdutoLabel}>Valor do produto</Text>
                </View>

                {/* Divisor */}
                <View style={styles.valorProdutoDivider} />

                {/* Valor */}
                <View style={styles.valorProdutoValueRow}>
                  <Text style={styles.valorProdutoValue}>
                    {currentSolicitacao.valorProduto}
                  </Text>
                </View>
              </View>
            </View>

            {/* Container de Forma de pagamento */}
            <View style={styles.formaPagamentoContainer}>
              {/* Conteúdo agrupado com borda */}
              <View style={styles.formaPagamentoInnerBorder}>
                {/* Título dentro do contêiner pai */}
                <View style={styles.formaPagamentoTitleRow}>
                  <Text style={styles.formaPagamentoTitle}>Forma de pagamento</Text>
                </View>
                {/* Seções de honorários com controle de expansão individual */}
                {currentSolicitacao.honorarios.map((honorario, index) => (
                  <HonorarioSection
                    key={`honorario-${honorario.tipo}-${index}`}
                    honorario={honorario}
                    showStrike={shouldShowStrikethrough(currentSolicitacao.status)}
                    isExpanded={honorario.tipo === 'prolabore' ? prolaboreExpandido : exitoExpandido}
                    onToggle={honorario.tipo === 'prolabore' ? toggleProlabore : toggleExito}
                  />
                ))}

                {/* Seção de Desconto Total */}
                <DescontoTotalSection solicitacao={currentSolicitacao} />
              </View>
            </View>
          </ScrollView>

          {/* Container de Status com botão Aplicar - FIXO NO RODAPÉ */}
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: getStatusBackgroundColor(currentSolicitacao.status) },
            ]}
          >
            {/* Coluna com label e valor do status */}
            <View style={styles.statusColumn}>
              {/* Label Status */}
              <View style={styles.statusLabelRow}>
                <Text style={[styles.statusLabel, { color: '#FCFCFC' }]}>Status</Text>
              </View>

              {/* Divisor pontilhado */}
              <View style={styles.statusDivider} />

              {/* Valor do status */}
              <View style={styles.statusValueRow}>
                <Text
                  style={[
                    styles.statusValue,
                    { color: '#FCFCFC' },
                  ]}
                >
                  {currentSolicitacao.statusLabel}
                </Text>
              </View>
            </View>

            {/* Botão Aplicar */}
            <TouchableOpacity
              style={[
                styles.aplicarButton,
                {
                  backgroundColor: getAplicarBackgroundColor(currentSolicitacao.status),
                  opacity: getAplicarOpacity(currentSolicitacao.status),
                },
              ]}
              disabled={!isAplicarEnabled(currentSolicitacao.status)}
              onPress={() => onApply && onApply(currentSolicitacao)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.aplicarButtonText,
                  { color: getAplicarTextColor(currentSolicitacao.status) },
                ]}
              >
                Aplicar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

// ============================================
// ESTILOS DO COMPONENTE
// ============================================

const styles = StyleSheet.create({
  // Overlay escuro do modal com espaçamento de 10px superior e inferior
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  // Container principal do modal com altura ajustada
  modalContainer: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FCFCFC',
    borderRadius: 12,
    overflow: 'hidden',
  },

  // ============================================
  // HEADER DO MODAL
  // ============================================

  // Container do header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 10,
    gap: 13,
  },

  // Coluna com título e ID
  headerTitleColumn: {
    flex: 1,
    gap: 10,
  },

  // Linha do título
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Título da solicitação
  headerTitle: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },

  // Linha do ID
  headerIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ID da solicitação
  headerId: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Botão de fechar
  closeButton: {
    width: 38,
    height: 38,
  },

  // ============================================
  // NAVEGAÇÃO / PAGINAÇÃO
  // ============================================

  // Container da paginação
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 5,
    gap: 10,
  },

  // Botão de seta
  arrowButton: {
    width: 40,
    height: 35,
  },

  // Container dos números de página
  pageNumbersContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },

  // Box do número de página
  pageNumberBox: {
    width: 40,
    height: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Box do número de página ativo
  pageNumberBoxActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },

  // Texto do número de página
  pageNumberText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Texto do número de página ativo
  pageNumberTextActive: {
    color: '#FCFCFC',
  },

  // ============================================
  // ÁREA SCROLLÁVEL
  // ============================================

  // ScrollView
  scrollView: {
    flex: 1,
  },

  // Conteúdo do ScrollView
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 1,
    paddingBottom: 1,
    gap: 10,
  },

  // ============================================
  // CONTAINER DE DETALHES DA VENDA
  // ============================================

  // Container principal dos detalhes da venda
  detalhesVendaContainer: {
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
  },

  // Conteúdo dos detalhes da venda
  detalhesVendaContent: {
    gap: 10,
  },

  // Linha do título dos detalhes da venda
  detalhesVendaTitleRow: {
    paddingHorizontal: 5,
  },

  // Título dos detalhes da venda
  detalhesVendaTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  // Divisor abaixo do título dos detalhes da venda
  detalhesVendaDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },

  // Corpo dos detalhes da venda com imagem e informações
  detalhesVendaBody: {
    flexDirection: 'row',
    gap: 10,
  },

  // Box da imagem/ícone do produto
  detalhesVendaImageBox: {
    width: 80,
    height: 160,
    backgroundColor: '#1A365D',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  detalhesVendaImage: {
    width: '100%',
    height: '100%',
  },

  // Container das informações do produto
  detalhesVendaInfo: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },

  // Item de informação do produto
  detalhesVendaInfoItem: {
    gap: 5,
  },

  // Linha do label de informação
  detalhesVendaLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Label de informação
  detalhesVendaLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Linha do valor de informação
  detalhesVendaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Valor de informação
  detalhesVendaValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Divisor entre informações
  detalhesVendaInfoDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },

  // ============================================
  // CONTAINER DE VALOR DO PRODUTO
  // ============================================

  // Container do valor do produto
  valorProdutoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    gap: 10,
  },

  // Box do ícone do valor do produto
  valorProdutoIconBox: {
    width: 46,
    height: 46,
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Detalhes do valor do produto
  valorProdutoDetails: {
    flex: 1,
    gap: 5,
  },

  // Linha do label do valor do produto
  valorProdutoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Label do valor do produto
  valorProdutoLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Divisor do valor do produto
  valorProdutoDivider: {
    height: 0.5,
    backgroundColor: 'rgba(33, 85, 163, 0.16)',
  },

  // Linha do valor do produto
  valorProdutoValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Valor do produto
  valorProdutoValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // ============================================
  // CONTAINER DE FORMA DE PAGAMENTO
  // ============================================

  // Container de forma de pagamento
  formaPagamentoContainer: {
    gap: 10,
  },

  formaPagamentoInnerBorder: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 10,
  },

  // Linha do título de forma de pagamento
  formaPagamentoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  // Título de forma de pagamento
  formaPagamentoTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    paddingLeft: 5,
  },

  // ============================================
  // SEÇÃO DE HONORÁRIO (Prolabore ou Êxito)
  // ============================================

  // Seção do honorário
  honorarioSection: {
    gap: 10,
  },

  // Header do honorário com botão expandir/ocultar
  honorarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.1)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33, 85, 163, 0.16)',
    gap: 10,
  },

  // Box do ícone do honorário
  honorarioIconBox: {
    width: 46,
    height: 46,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Container dos detalhes do honorário
  honorarioDetails: {
    flex: 1,
    gap: 5,
  },

  // Linha do nome do honorário
  honorarioNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Nome do honorário
  honorarioNome: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Divisor do honorário
  honorarioDivider: {
    height: 0.5,
    backgroundColor: 'rgba(33, 85, 163, 0.16)',
  },

  // Linha do valor do honorário
  honorarioValorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Valor do honorário
  honorarioValor: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Botão de expandir/ocultar
  toggleButton: {
    width: 35,
    height: 35,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Texto do botão de expandir/ocultar
  toggleButtonText: {
    color: '#1777CF',
    fontSize: 20,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // ============================================
  // CARD DE MÉTODO DE PAGAMENTO
  // ============================================

  // Card do método
  metodoPagamentoCard: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 5,
  },

  // Seção do header do método
  metodoHeaderSection: {
    gap: 12,
  },

  // Linha do nome do método
  metodoNomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Nome do método
  metodoNome: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  // Linha do valor do método
  metodoValorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 17,
  },

  // Valor do método
  metodoValor: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Divisor do método
  metodoDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginVertical: 5,
  },

  // Divisor pontilhado do método
  metodoDividerDashed: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginVertical: 5,
  },

  // Linha de parcelas
  metodoParcelasRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 17,
    gap: 5,
  },

  // Container esquerdo das parcelas
  metodoParcelasLeft: {
    flex: 1,
  },

  // Texto das parcelas
  metodoParcelasText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Container direito dos juros
  metodoParcelasRight: {
    alignItems: 'flex-end',
  },

  // Texto dos juros
  metodoJurosText: {
    color: '#7D8592',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  // ============================================
  // SEÇÃO DE VALORES (Desconto/Redução)
  // ============================================

  // Seção de valor
  valueSection: {
    gap: 5,
  },

  // Linha do label
  valueLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Label do valor
  valueLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Linha do valor
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  // Container do percentual
  valuePercentContainer: {
    flex: 1,
  },

  // Container do valor monetário
  valueMoneyContainer: {
    width: 110,
    alignItems: 'flex-end',
  },

  // Texto do valor normal
  valueText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // Texto do valor riscado
  valueTextStrike: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textDecorationLine: 'line-through',
  },

  // ============================================
  // CARD DE TOTAL DO HONORÁRIO
  // ============================================

  // Card do total
  totalHonorarioCard: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 5,
  },

  // Linha do título Total
  totalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Título Total
  totalTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },

  // ============================================
  // SEÇÃO DE DESCONTO TOTAL
  // ============================================

  // Seção de desconto total
  descontoTotalSection: {
    gap: 10,
  },

  // Header do desconto total
  descontoTotalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(23, 119, 207, 0.1)',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(33, 85, 163, 0.16)',
  },

  // Título do desconto total
  descontoTotalTitle: {
    color: '#1777CF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Conteúdo do desconto total
  descontoTotalContent: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    padding: 10,
    gap: 15,
  },

  // Seção de desconto cliente
  descontoClienteSection: {
    gap: 10,
  },

  // Título do desconto cliente
  descontoClienteTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Divisor do desconto total
  descontoTotalDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginVertical: 2,
  },
  // Divisor maior entre seções
  descontoTotalSectionDivider: {
    height: 8,
  },

  // Linha do desconto total
  descontoTotalRow: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },

  // Linha superior (título)
  descontoTotalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Linha inferior (percentual e valor)
  descontoTotalValuesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },

  // Container do label
  descontoTotalLabelContainer: {
    width: 75,
  },

  // Label
  descontoTotalLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Container do percentual
  descontoTotalPercentContainer: {
    width: 65,
    alignItems: 'flex-end',
  },

  // Percentual à esquerda na linha inferior
  descontoTotalPercentLeft: {
    flex: 1,
  },

  // Container do valor monetário
  descontoTotalMoneyContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },

  // Valor monetário à direita na linha inferior
  descontoTotalMoneyRight: {
    width: 110,
    alignItems: 'flex-end',
  },

  // Valor
  descontoTotalValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  // ============================================
  // CONTAINER DE STATUS - FIXO NO RODAPÉ
  // ============================================

  // Container de status fixo no rodapé
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 17,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap:10,
  },

  // Coluna do status
  statusColumn: {
    flex: 1,
    gap: 5,
  },

  // Linha do label do status
  statusLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Label do status
  statusLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Divisor do status
  statusDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },

  // Linha do valor do status
  statusValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Valor do status
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },

  // Botão Aplicar
  aplicarButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
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
  },
});

export default DiscountModalRequest;
