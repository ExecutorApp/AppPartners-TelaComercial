// ===== BLOCO: IMPORTAÇÕES =====
// Importações essenciais do componente de desconto: React, componentes RN, SVG e navegação
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Linking, Modal, ScrollView } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { ScreenNames } from '../../types/navigation';
import DiscountSystemModal, { EXEMPLO_DESCONTO } from './03.02.Discount-Sales-DiscountSystem';
import DiscountModalRequest from './03.03.Discount-Manage-Request';
import DiscountModalCondition from './03.03.Discount-Manage-Condition';
import DiscountManageScreen, { solicitacoesData, novasCondicoesData } from './03.03.Discount-Manage';

// ===== BLOCO: TIPOS / PROPS =====
// Tipagem das propriedades do componente de desconto
interface Props {
  visible?: boolean;
  onApply?: (payload: { mode: 'percent' | 'currency'; value: number } | null) => void;
  onClose?: () => void;
  summaries?: Partial<Record<number, string>>;
  onNavigateToDiscountSales?: () => void;
  initialSelectedOption?: 'none' | 'system' | 'manager';
  initialManagerStep?: number;
}

// ===== BLOCO: ÍCONES SVG =====
// Ícones utilizados na interface deste modal (WhatsApp, Porcentagem, Ir, Rádio)
// Ícone: WhatsApp (abre conversa com o gestor)
const WhatsAppIcon: React.FC = () => (
  <Svg width={17} height={17} viewBox="0 0 17 17" fill="none">
    <Path d="M8.49121 0.0498047C10.739 0.0506959 12.8509 0.922379 14.4385 2.50391C16.0485 4.10809 16.9343 6.21201 16.9336 8.42773L16.9229 8.84473C16.8192 10.9203 15.9495 12.8604 14.4473 14.3467C12.8489 15.9281 10.7336 16.7988 8.49121 16.7988H8.48828C7.17104 16.7983 5.86473 16.4873 4.69434 15.8975L4.67871 15.8896L4.66113 15.8936L0.0888672 16.9326L1.08301 12.415L1.08691 12.3965L1.07812 12.3799C0.404793 11.1365 0.0501382 9.77486 0.0498047 8.42578V8.4209C0.0519866 6.19069 0.9343 4.08584 2.53516 2.50195C4.13325 0.920626 6.24854 0.0498624 8.49121 0.0498047ZM8.49121 1.27637C4.51587 1.27637 1.2789 4.48454 1.27637 8.42383C1.27637 9.64159 1.61989 10.8752 2.26758 11.9922L2.38574 12.1982L1.71973 15.2314L1.70312 15.3086L1.7793 15.291L4.85254 14.5918L5.05566 14.7021C6.1033 15.2709 7.29032 15.5717 8.48828 15.5723H8.49121C12.4676 15.5723 15.7053 12.3679 15.707 8.42773C15.7077 6.54001 14.9494 4.74446 13.5732 3.37305C12.217 2.02209 10.4117 1.27718 8.49121 1.27637ZM6.18066 4.75977C6.249 4.7626 6.30982 4.76742 6.37109 4.80371C6.43288 4.84036 6.50194 4.91448 6.57227 5.07031C6.65814 5.26065 6.79415 5.5942 6.91504 5.89355C7.03488 6.19033 7.14131 6.4575 7.16699 6.50879C7.21235 6.59925 7.23789 6.69416 7.18359 6.80273C7.11668 6.93605 7.09282 7.00915 7.00098 7.11621C6.90536 7.22737 6.78844 7.34405 6.70117 7.43066C6.65382 7.47765 6.59516 7.53592 6.56738 7.61035C6.53795 7.68947 6.54503 7.77988 6.60742 7.88672C6.7215 8.08168 7.12548 8.74214 7.70898 9.26074C8.457 9.92545 9.08512 10.1374 9.27539 10.2324C9.37579 10.2825 9.46378 10.3077 9.54492 10.2979C9.62815 10.2877 9.69543 10.242 9.75684 10.1719C9.86982 10.0431 10.253 9.59321 10.3848 9.39648C10.4442 9.3076 10.4979 9.2784 10.5498 9.27246C10.6071 9.26602 10.6733 9.28566 10.7637 9.31836C10.8497 9.34969 11.1292 9.48313 11.415 9.62305C11.6993 9.76217 11.9859 9.90563 12.083 9.9541C12.1827 10.0037 12.2595 10.0385 12.3213 10.0723C12.3831 10.106 12.4176 10.133 12.4346 10.1611C12.4402 10.1709 12.4489 10.2003 12.4531 10.2539C12.4571 10.3053 12.4561 10.3727 12.4492 10.4521C12.4354 10.6114 12.3958 10.8173 12.3164 11.0391C12.2411 11.2488 12.0146 11.4629 11.7539 11.6309C11.4937 11.7985 11.2142 11.9107 11.0479 11.9258C10.8663 11.9423 10.7015 11.9819 10.376 11.9385C10.0487 11.8947 9.55897 11.7671 8.74023 11.4453C6.78286 10.6759 5.54603 8.67447 5.44434 8.53906C5.39633 8.47506 5.19975 8.21575 5.01562 7.85449C4.83114 7.49245 4.6612 7.03226 4.66113 6.56738C4.66113 5.63612 5.1491 5.17998 5.32715 4.98633C5.49399 4.80476 5.69042 4.76075 5.80859 4.76074L6.18066 4.75977Z" fill="#3A3F51" stroke="#FCFCFC" strokeWidth={0.1} />
  </Svg>
);

// Ícone: Sino (legado - não utilizado no layout atual)
const BellIcon: React.FC = () => (
  <Svg width={22} height={26} viewBox="0 0 22 26" fill="none">
    <Path d="M14.3895 20.1344V21.0575C14.3895 22.0368 14.0067 22.976 13.3254 23.6685C12.644 24.361 11.7198 24.75 10.7562 24.75C9.79263 24.75 8.86849 24.361 8.18711 23.6685C7.50574 22.976 7.12295 22.0368 7.12295 21.0575V20.1344M20.5025 18.2563C19.0446 16.4429 18.0154 15.5198 18.0154 10.5206C18.0154 5.94251 15.715 4.31149 13.8218 3.51934C13.5703 3.41434 13.3335 3.17317 13.2569 2.91066C12.9248 1.76196 11.9938 0.75 10.7562 0.75C9.51858 0.75 8.58699 1.76254 8.25829 2.91182C8.18165 3.17721 7.94492 3.41434 7.69343 3.51934C5.79788 4.31264 3.49982 5.9379 3.49982 10.5206C3.49699 15.5198 2.46775 16.4429 1.00989 18.2563C0.405857 19.0075 0.934954 20.1354 1.99144 20.1354H19.5266C20.5774 20.1354 21.1031 19.004 20.5025 18.2563Z" stroke="#3A3F51" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

// Ícone: Porcentagem (atalho para tela de descontos)
const PercentIcon: React.FC = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M12.6667 10.6667C12.1362 10.6667 11.6275 10.8774 11.2525 11.2525C10.8774 11.6275 10.6667 12.1362 10.6667 12.6667V14C10.6667 14.5304 10.8774 15.0391 11.2525 15.4142C11.6275 15.7893 12.1362 16 12.6667 16C13.1971 16 13.7058 15.7893 14.0809 15.4142C14.456 15.0391 14.6667 14.5304 14.6667 14V12.6667C14.6667 12.1362 14.456 11.6275 14.0809 11.2525C13.7058 10.8774 13.1971 10.6667 12.6667 10.6667ZM13.3333 14C13.3333 14.1768 13.2631 14.3464 13.1381 14.4714C13.0131 14.5964 12.8435 14.6667 12.6667 14.6667C12.4899 14.6667 12.3203 14.5964 12.1953 14.4714C12.0702 14.3464 12 14.1768 12 14V12.6667C12 12.4899 12.0702 12.3203 12.1953 12.1953C12.3203 12.0702 12.4899 12 12.6667 12C12.8435 12 13.0131 12.0702 13.1381 12.1953C13.2631 12.3203 13.3333 12.4899 13.3333 12.6667V14ZM7.33334 4C6.8029 4 6.2942 4.21071 5.91912 4.58579C5.54405 4.96086 5.33334 5.46957 5.33334 6V7.33333C5.33334 7.86376 5.54405 8.37247 5.91912 8.74755C6.2942 9.12262 6.8029 9.33333 7.33334 9.33333C7.86377 9.33333 8.37248 9.12262 8.74755 8.74755C9.12262 8.37247 9.33334 7.86376 9.33334 7.33333V6C9.33334 5.46957 9.12262 4.96086 8.74755 4.58579C8.37248 4.21071 7.86377 4 7.33334 4ZM8 7.33333C8 7.51014 7.92977 7.67971 7.80474 7.80474C7.67972 7.92976 7.51015 8 7.33334 8C7.15653 8 6.98696 7.92976 6.86193 7.80474C6.73691 7.67971 6.66667 7.51014 6.66667 7.33333V6C6.66667 5.82319 6.73691 5.65362 6.86193 5.52859C6.98696 5.40357 7.15653 5.33333 7.33334 5.33333C7.51015 5.33333 7.67972 5.40357 7.80474 5.52859C7.92977 5.65362 8 5.82319 8 6V7.33333ZM13.528 5.528L5.528 13.528C5.46602 13.59 5.41685 13.6636 5.38331 13.7446C5.34976 13.8255 5.33249 13.9123 5.33249 14C5.33249 14.0877 5.34976 14.1745 5.38331 14.2554C5.41685 14.3364 5.46602 14.41 5.528 14.472C5.65319 14.5972 5.82297 14.6675 6 14.6675C6.08766 14.6675 6.17446 14.6502 6.25545 14.6167C6.33643 14.5831 6.41002 14.534 6.472 14.472L14.472 6.472C14.534 6.41002 14.5832 6.33643 14.6167 6.25544C14.6502 6.17446 14.6675 6.08766 14.6675 6C14.6675 5.91234 14.6502 5.82554 14.6167 5.74455C14.5832 5.66357 14.534 5.58998 14.472 5.528C14.41 5.46601 14.3364 5.41685 14.2554 5.3833C14.1745 5.34976 14.0877 5.33249 14 5.33249C13.9123 5.33249 13.8255 5.34976 13.7446 5.3833C13.6636 5.41685 13.59 5.46601 13.528 5.528Z" fill="#FCFCFC"/>
    <Path d="M10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17316C0.00433292 8.00043 -0.1937 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8078C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C19.9972 7.3487 18.9427 4.8068 17.0679 2.93205C15.1932 1.0573 12.6513 0.00282354 10 0ZM10 18.6667C8.2859 18.6667 6.61029 18.1584 5.18506 17.2061C3.75984 16.2538 2.64901 14.9002 1.99305 13.3166C1.33709 11.733 1.16546 9.99038 1.49986 8.30922C1.83427 6.62805 2.65969 5.0838 3.87174 3.87174C5.0838 2.65969 6.62805 1.83427 8.30922 1.49986C9.99039 1.16546 11.733 1.33708 13.3166 1.99304C14.9002 2.649 16.2538 3.75983 17.2061 5.18506C18.1584 6.61028 18.6667 8.28589 18.6667 10C18.6638 12.2977 17.7498 14.5004 16.1251 16.1251C14.5004 17.7498 12.2977 18.6638 10 18.6667Z" fill="#FCFCFC"/>
  </Svg>
);

// Ícone: Ir (navegação secundária para gerenciar)
const GoIcon: React.FC = () => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path d="M13.8182 16H2.18182C1.60316 16 1.04821 15.7701 0.63904 15.361C0.229869 14.9518 0 14.3968 0 13.8182V2.18182C0 1.60316 0.229869 1.04821 0.63904 0.63904C1.04821 0.229869 1.60316 0 2.18182 0H6.54545C6.73834 0 6.92332 0.0766231 7.05971 0.213013C7.1961 0.349403 7.27273 0.534388 7.27273 0.727273C7.27273 0.920157 7.1961 1.10514 7.05971 1.24153C6.92332 1.37792 6.73834 1.45455 6.54545 1.45455H2.18182C1.98893 1.45455 1.80395 1.53117 1.66756 1.66756C1.53117 1.80395 1.45455 1.98893 1.45455 2.18182V13.8182C1.45455 14.0111 1.53117 14.1961 1.66756 14.3324C1.80395 14.4688 1.98893 14.5455 2.18182 14.5455H13.8182C14.0111 14.5455 14.1961 14.4688 14.3324 14.3324C14.4688 14.1961 14.5455 14.0111 14.5455 13.8182V9.45455C14.5455 9.26166 14.6221 9.07668 14.7585 8.94029C14.8949 8.8039 15.0798 8.72727 15.2727 8.72727C15.4656 8.72727 15.6506 8.8039 15.787 8.94029C15.9234 9.07668 16 9.26166 16 9.45455V13.8182C16 14.3968 15.7701 14.9518 15.361 15.361C14.9518 15.7701 14.3968 16 13.8182 16ZM6.54545 10.1818C6.44974 10.1824 6.35486 10.164 6.26625 10.1278C6.17764 10.0916 6.09705 10.0383 6.02909 9.97091C5.96092 9.9033 5.90682 9.82286 5.8699 9.73424C5.83297 9.64561 5.81397 9.55055 5.81397 9.45455C5.81397 9.35854 5.83297 9.26348 5.8699 9.17485C5.90682 9.08623 5.96092 9.00579 6.02909 8.93818L13.52 1.45455H10.9091C10.7162 1.45455 10.5312 1.37792 10.3948 1.24153C10.2584 1.10514 10.1818 0.920157 10.1818 0.727273C10.1818 0.534388 10.2584 0.349403 10.3948 0.213013C10.5312 0.0766231 10.7162 0 10.9091 0H15.2727C15.4656 0 15.6506 0.0766231 15.787 0.213013C15.9234 0.349403 16 0.534388 16 0.727273V5.09091C16 5.28379 15.9234 5.46878 15.787 5.60517C15.6506 5.74156 15.4656 5.81818 15.2727 5.81818C15.0798 5.81818 14.8949 5.74156 14.7585 5.60517C14.6221 5.46878 14.5455 5.28379 14.5455 5.09091V2.48L7.06182 9.97091C6.99386 10.0383 6.91327 10.0916 6.82466 10.1278C6.73605 10.164 6.64117 10.1824 6.54545 10.1818Z" fill="#1777CF" />
  </Svg>
);

// Ícone: Rádio (estado selecionado/não selecionado)
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
      <Circle cx={10} cy={10} r={8} stroke="#6F7DA0" strokeWidth={1.5} fill="none" />
    )}
  </Svg>
);

// ===== BLOCO: UTILITÁRIOS =====
// formatBRL: formata número em moeda BRL, com fallback manual
const formatBRL = (value: number) => {
  try { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value); }
  catch {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const int = Math.floor(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const cents = Math.round((abs % 1) * 100).toString().padStart(2, '0');
    return `${sign}R$ ${int},${cents}`;
  }
};

// formatNumberNoCurrency: formata número sem símbolo de moeda
const formatNumberNoCurrency = (value: number) => {
  try { return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value); }
  catch {
    const sign = value < 0 ? '-' : '';
    const abs = Math.abs(value);
    const int = Math.floor(abs).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const cents = Math.round((abs % 1) * 100).toString().padStart(2, '0');
    return `${sign}${int},${cents}`;
  }
};

// Percentual com até 6 casas decimais e remoção de zeros à direita
const formatPercentUpTo6 = (value: number): string => {
  const rounded = Math.round(value * 1000000) / 1000000;
  let s = rounded.toFixed(6).replace('.', ',');
  s = s.replace(/,?0+$/, '');
  return `${s}%`;
};

// parsePtNumber: converte texto com formato pt-BR em número decimal
const parsePtNumber = (text: string): number => {
  const cleaned = String(text || '').replace(/[^0-9.,]/g, '');
  const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
  const n = parseFloat(normalized);
  return isNaN(n) ? 0 : n;
};

// ===== BLOCO: COMPONENTE PRINCIPAL =====
// Componente do modal de desconto com cálculo, seleção e navegação
const NewSaleDiscount: React.FC<Props> = ({ visible = true, onApply, onClose, summaries, onNavigateToDiscountSales, initialSelectedOption, initialManagerStep }) => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // Valor do produto: fixo conforme solicitado (R$ 120.000,00)
  const baseAmount = useMemo(() => 120000, []);

  // Tipo interno para seleção de desconto
  type DiscountOption = 'none' | 'system' | 'manager';
  // Estados do componente: opção, modo, entradas, passo do gestor e id
  const [selectedOption, setSelectedOption] = useState<DiscountOption>(initialSelectedOption ?? 'none');
  const [mode, setMode] = useState<'percent' | 'currency'>('currency');
  const [percentDigits, setPercentDigits] = useState<string>('');
  const [currencyDigits, setCurrencyDigits] = useState<string>('');
  const systemDiscountValue = EXEMPLO_DESCONTO.grandTotalDiscountValue;
  const managerItems = useMemo(() => {
    const aprovadas = solicitacoesData.filter((s: any) => s.status === 'aprovado');
    const solicitacaoItems = aprovadas.map((s: any) => ({
      kind: 'request',
      id: s.vendaId,
      percent: s.descontoPercentual,
      value: s.descontoValor,
      reducaoPercent: s.seuLucroPercentual,
      reducaoValue: s.seuLucroValor,
    }));
    const condicaoItems = novasCondicoesData.map((c: any) => {
      const overrides: Record<string, { percent: string; value: string; reducaoPercent: string; reducaoValue: string }> = {
        '10050232': { percent: '5,5%', value: 'R$ 6.600,00', reducaoPercent: '0,833333%', reducaoValue: 'R$ 1.000,00' },
        '20050232': { percent: '6%', value: 'R$ 7.200,00', reducaoPercent: '1,666667%', reducaoValue: 'R$ 2.000,00' },
        '30050232': { percent: '7,5%', value: 'R$ 9.000,00', reducaoPercent: '4,166667%', reducaoValue: 'R$ 5.000,00' },
      };
      const ov = overrides[c.condicaoId];
      return {
        kind: 'condition',
        id: c.condicaoId,
        percent: ov?.percent ?? c.descontoPercentual,
        value: ov?.value ?? c.descontoValor,
        reducaoPercent: ov?.reducaoPercent ?? c.seuLucroPercentual,
        reducaoValue: ov?.reducaoValue ?? c.seuLucroValor,
      };
    });
    return [...solicitacaoItems, ...condicaoItems];
  }, []);
  const [managerStep, setManagerStep] = useState<number>(typeof initialManagerStep === 'number' ? initialManagerStep : 0);
  useEffect(() => {
    if (visible) {
      if (initialSelectedOption) setSelectedOption(initialSelectedOption);
      if (typeof initialManagerStep === 'number') setManagerStep(initialManagerStep);
    }
  }, [visible, initialSelectedOption, initialManagerStep]);
  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      const ret = (route as any)?.params?.discountReturn;
      if (ret) {
        if (ret.selectedOption) setSelectedOption(ret.selectedOption);
        if (typeof ret.managerStep === 'number') setManagerStep(ret.managerStep);
        navigation.setParams({ discountReturn: undefined });
      }
    });
    return unsub;
  }, [navigation, route]);
  const selectedManager = managerItems[managerStep];
  const managerId = Number((selectedManager?.id ?? '0').toString().replace(/\D/g, '')) || 102030;
  const [systemModalVisible, setSystemModalVisible] = useState<boolean>(false);
  const [requestModalVisible, setRequestModalVisible] = useState<boolean>(false);
  const [conditionModalVisible, setConditionModalVisible] = useState<boolean>(false);
  const [requestInitialPage, setRequestInitialPage] = useState<number>(0);
  const [conditionInitialPage, setConditionInitialPage] = useState<number>(0);
  const [manageScreenVisible, setManageScreenVisible] = useState<boolean>(false);
  const tabsScrollRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<{ x: number; width: number }[]>([]);
  const handleTabKeyDown = (e: any, idx: number) => {
    const key = e?.key;
    if (key === 'ArrowRight') {
      setManagerStep(Math.min(idx + 1, managerItems.length - 1));
      e.preventDefault?.();
    } else if (key === 'ArrowLeft') {
      setManagerStep(Math.max(idx - 1, 0));
      e.preventDefault?.();
    } else if (key === 'Enter' || key === ' ') {
      setManagerStep(idx);
      e.preventDefault?.();
    }
  };
  useEffect(() => {
    const l = tabLayouts[managerStep];
    const ref = tabsScrollRef.current;
    if (l && ref) {
      const targetX = Math.max(l.x - 8, 0);
      try {
        ref.scrollTo({ x: targetX, animated: true });
      } catch {}
    }
  }, [managerStep, tabLayouts]);
  const systemData = useMemo(() => ({
    prolaboreTotal: 50000,
    prolaborePixValue: 25000,
    prolaborePixDiscountPercent: EXEMPLO_DESCONTO.prolaborePixDiscountPercent,
    prolaborePixDiscountValue: EXEMPLO_DESCONTO.prolaborePixDiscountValue,
    prolaboreCreditValue: 15000,
    prolaboreCreditInstallments: '10 x 1.500,00',
    prolaboreCreditInterest: 0,
    prolaboreCreditDiscountPercent: EXEMPLO_DESCONTO.prolaboreCreditDiscountPercent,
    prolaboreCreditDiscountValue: EXEMPLO_DESCONTO.prolaboreCreditDiscountValue,
    prolaboreBoletoValue: 10000,
    prolaboreBoletoInstallments: '5 x 2.000,00',
    prolaboreBoletoInterest: 0,
    prolaboreBoletoDiscountPercent: EXEMPLO_DESCONTO.prolaboreBoletoDiscountPercent,
    prolaboreBoletoDiscountValue: EXEMPLO_DESCONTO.prolaboreBoletoDiscountValue,
    prolaboreTotalDiscountPercent: EXEMPLO_DESCONTO.prolaboreTotalDiscountPercent,
    prolaboreTotalDiscountValue: EXEMPLO_DESCONTO.prolaboreTotalDiscountValue,
    exitoTotal: 70000,
    exitoPixValue: 25000,
    exitoPixDiscountPercent: EXEMPLO_DESCONTO.exitoPixDiscountPercent,
    exitoPixDiscountValue: EXEMPLO_DESCONTO.exitoPixDiscountValue,
    exitoCreditValue: 45000,
    exitoCreditInstallments: '10 x 1.500,00',
    exitoCreditInterest: 0,
    exitoCreditDiscountPercent: EXEMPLO_DESCONTO.exitoCreditDiscountPercent,
    exitoCreditDiscountValue: EXEMPLO_DESCONTO.exitoCreditDiscountValue,
    exitoTotalDiscountPercent: EXEMPLO_DESCONTO.exitoTotalDiscountPercent,
    exitoTotalDiscountValue: EXEMPLO_DESCONTO.exitoTotalDiscountValue,
    grandProlaboreDiscountPercent: EXEMPLO_DESCONTO.grandProlaboreDiscountPercent,
    grandProlaboreDiscountValue: EXEMPLO_DESCONTO.grandProlaboreDiscountValue,
    grandExitoDiscountPercent: EXEMPLO_DESCONTO.grandExitoDiscountPercent,
    grandExitoDiscountValue: EXEMPLO_DESCONTO.grandExitoDiscountValue,
    grandTotalDiscountPercent: EXEMPLO_DESCONTO.grandTotalDiscountPercent,
    grandTotalDiscountValue: EXEMPLO_DESCONTO.grandTotalDiscountValue,
    productValue: 120000,
  }), []);

  // Memos: valores digitados e cálculo do desconto
  const percentValue = useMemo(() => parsePtNumber(percentDigits), [percentDigits]);
  const currencyValue = useMemo(() => parsePtNumber(currencyDigits), [currencyDigits]);
  const discountValueNumber = useMemo(() => {
    if (selectedOption === 'none') return 0;
    if (selectedOption === 'system') return systemDiscountValue;
    if (selectedOption === 'manager') {
      const valStr = managerItems[managerStep]?.value ?? '0';
      return parsePtNumber(valStr);
    }
    if (mode === 'percent') {
      const raw = (baseAmount * percentValue) / 100;
      return Math.round(raw * 100) / 100;
    }
    return Math.max(currencyValue, 0);
  }, [selectedOption, mode, percentValue, currencyValue, baseAmount, managerItems, managerStep, systemDiscountValue]);

  // Handler: aplica desconto conforme opção e fecha modal
  const handleApply = () => {
    if (selectedOption === 'none') onApply?.(null);
    else if (selectedOption === 'system') onApply?.({ mode: 'currency', value: systemDiscountValue });
    else onApply?.({ mode, value: discountValueNumber });
    onClose?.();
  };

  // Navegação: abre Gerenciar Descontos
  const handleGoToManager = () => {
    onClose?.();
    setTimeout(() => {
      navigation.dispatch(CommonActions.reset({
        index: 1,
        routes: [
          { name: ScreenNames.SalesHome as any, params: {} },
          { name: ScreenNames.DiscountManage as any, params: { fromRouteName: ScreenNames.SalesHome } },
        ],
      }));
    }, 50);
  };

  const handleOpenSystemModal = () => {
    setSystemModalVisible(true);
  };

  const handleOpenSelectedModal = () => {
    const current = managerItems[managerStep];
    if (!current) return;
    const idStr = (current as any).id?.toString?.() ?? '';
    if ((current as any).kind === 'request') {
      // Mapeamento: 203040 -> aba 02 (index 1)
      setRequestInitialPage(idStr === '203040' ? 1 : 0);
      setRequestModalVisible(true);
    } else {
      // Mapeamento condições: 10050232 -> 01 (0), 20050232 -> 02 (1), 30050232 -> 03 (2)
      const page = idStr === '10050232' ? 0 : idStr === '20050232' ? 1 : idStr === '30050232' ? 2 : 0;
      setConditionInitialPage(page);
      setConditionModalVisible(true);
    }
  };

  // Ação: contato via WhatsApp do gestor
  const handleWhatsAppContact = async () => {
    const appUrl = 'whatsapp://send?phone=5517992460986';
    const webUrl = 'https://wa.me/5517992460986';
    try {
      if (Platform.OS !== 'web') {
        const can = await Linking.canOpenURL(appUrl);
        if (can) { await Linking.openURL(appUrl); return; }
      }
      await Linking.openURL(webUrl);
    } catch {
      await Linking.openURL(webUrl);
    }
  };

  // Estado UI: controlar foco de input
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Handler: fechar modal ao clicar no backdrop
  const handleBackdropPress = () => {
    onClose?.();
  };

  // ===== BLOCO: JSX / LAYOUT =====
  // Estrutura do drawer lateral com cabeçalho, grupos de desconto e totais
  return (
    <View>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleBackdropPress}
      statusBarTranslucent
    >
      <View style={styles.modalOverlay}>
        {/* Painel do drawer - à esquerda */}
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Cabeçalho: título e ações */}
            <View style={styles.headerRow}>
              <Text style={styles.title}>Desconto</Text>
              <View style={styles.headerActions}>
                {/* Botão de porcentagem com badge */}
                <TouchableOpacity
                  style={styles.percentBox}
                  onPress={() => {
                    onClose?.();
                    setTimeout(() => {
                      if (onNavigateToDiscountSales) {
                        onNavigateToDiscountSales();
                      } else {
                        navigation.navigate(ScreenNames.DiscountCustomer as any);
                      }
                    }, 50);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Abrir tela de descontos"
                >
                  <PercentIcon />
                  <View style={styles.percentBadge}><Text style={styles.percentBadgeText}>03</Text></View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Container Pai: engloba Nenhum, Sistema, Gestor e Totais */}
            <View style={styles.parentWrapper}>
              {/* Opção: Nenhum desconto */}
              <TouchableOpacity
                style={[styles.noneCard, styles.radioOptionRow]}
                onPress={() => { if (selectedOption !== 'none') setSelectedOption('none'); }}
                accessibilityRole="button"
                accessibilityLabel="Nenhum"
                activeOpacity={1}
              >
                <View style={styles.radioBoxLarge}><RadioDot selected={selectedOption === 'none'} /></View>
                <Text style={styles.radioLabel}>Nenhum</Text>
              </TouchableOpacity>

              {/* Card: Desconto sistema */}
              <View style={styles.radioCard}>
                <View style={[styles.cardHeaderRow, styles.cardHeaderRowBetween]}>
                  <Text style={[styles.sectionTitle, styles.sectionTitleFlex]}>Desconto sistema</Text>
                  <TouchableOpacity
                    style={styles.linkIconButton}
                    onPress={handleOpenSystemModal}
                    accessibilityRole="button"
                    accessibilityLabel="Ir para desconto do sistema"
                  >
                    <GoIcon />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.cardContentRow}
                  onPress={() => { if (selectedOption !== 'system') setSelectedOption('system'); }}
                  accessibilityRole="button"
                  accessibilityLabel="Selecionar desconto sistema"
                  activeOpacity={1}
                >
                  <View style={styles.radioBoxLarge}><RadioDot selected={selectedOption === 'system'} /></View>
                  <View style={styles.cardRightColumn}>
                    <View style={styles.cardValueRow}><Text style={styles.percentLabel}>{formatPercentUpTo6(EXEMPLO_DESCONTO.grandTotalDiscountValue / systemData.productValue * 100)}</Text></View>
                    <View style={styles.cardThinDivider} />
                    <View style={styles.cardValueRow}><Text style={styles.currencyLabel}>{formatBRL(EXEMPLO_DESCONTO.grandTotalDiscountValue)}</Text></View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Card: Desconto gestor com tabs e ID */}
              <View style={styles.radioCard}>
                <View style={[styles.cardHeaderRow, styles.cardHeaderRowBetween]}>
                  <Text style={[styles.sectionTitle, styles.sectionTitleFlex]}>Desconto gestor</Text>
                  <TouchableOpacity
                    style={styles.linkIconButton}
                    onPress={handleGoToManager}
                    accessibilityRole="button"
                    accessibilityLabel="Ir para Gerenciar"
                  >
                    <GoIcon />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.cardContentRow}
                  onPress={() => { if (selectedOption !== 'manager') setSelectedOption('manager'); }}
                  accessibilityRole="button"
                  accessibilityLabel="Selecionar desconto gestor"
                  activeOpacity={1}
                >
                  <View style={styles.radioBoxLarge}><RadioDot selected={selectedOption === 'manager'} /></View>
                  <View style={styles.cardRightColumn}>
                    <View style={styles.cardValueRow}><Text style={styles.percentLabel}>{selectedManager?.percent ?? '0%'}</Text></View>
                    <View style={styles.cardThinDivider} />
                    <View style={styles.cardValueRow}><Text style={styles.currencyLabel}>{selectedManager?.value ?? 'R$ 00,00'}</Text></View>
                  </View>
                </TouchableOpacity>
                <View style={styles.cardThinDivider} />
                <ScrollView
                  horizontal
                  ref={tabsScrollRef}
                  showsHorizontalScrollIndicator={false}
                  style={[
                    styles.miniTabsRow,
                    Platform.OS === 'web' && (styles.miniTabsWeb as any),
                  ]}
                  contentContainerStyle={styles.miniTabsContent}
                >
                  {managerItems.map((_, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.miniTab,
                        Platform.OS === 'web' && (styles.miniTabWeb as any),
                        managerStep === idx && styles.miniTabActive,
                      ]}
                      onPress={() => setManagerStep(idx)}
                      accessibilityRole="button"
                      accessibilityLabel={String(idx + 1).padStart(2, '0')}
                      focusable
                      {...(Platform.OS === 'web' ? ({ tabIndex: 0 } as any) : {})}
                      onKeyDown={(e: any) => handleTabKeyDown(e, idx)}
                      onLayout={(e) => {
                        const { x, width } = e.nativeEvent.layout;
                        setTabLayouts((prev) => {
                          const next = [...prev];
                          next[idx] = { x, width };
                          return next;
                        });
                      }}
                    >
                      <Text style={[styles.miniTabText, managerStep === idx && styles.miniTabTextActive]}>
                        {String(idx + 1).padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.cardThinDivider} />
                <View style={styles.idRow}>
                  <View style={styles.idLeftGroup}>
                    <Text style={styles.idLabel}>ID:</Text>
                    <Text style={styles.idValue}>{selectedManager?.id ?? '102030'}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.linkIconButton}
                    onPress={handleOpenSelectedModal}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir modal da aba selecionada"
                  >
                    <GoIcon />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardThinDivider} />
                <View style={styles.subLabelGroup}>
                  <View style={styles.cardHeaderRow}><Text style={styles.subtleLabel}>Redução de premiação</Text></View>
                  <View style={styles.cardValueRow}><Text style={styles.percentLabel}>{selectedManager?.reducaoPercent ?? '0%'}</Text></View>
                  <View style={styles.reducaoDividerWrap}><View style={styles.reducaoDividerLine} /></View>
                  <View style={styles.cardValueRow}><Text style={styles.currencyLabel}>{selectedManager?.reducaoValue ?? 'R$ 00,00'}</Text></View>
                </View>
              </View>

              {/* Seção: Totais da venda */}
              <View style={styles.totalsWrapper}>
                <View style={styles.totals}>
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Valor do produto</Text>
                    <Text style={styles.totalsValue}>{formatBRL(baseAmount)}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Desconto</Text>
                    <Text style={styles.totalsValue}>{formatBRL(discountValueNumber)}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.totalsRow}>
                    <Text style={styles.totalsLabel}>Total</Text>
                    <Text style={styles.totalsTotal}>{formatBRL(Math.max(baseAmount - discountValueNumber, 0))}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Botão: Aplicar desconto */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            accessibilityRole="button"
            accessibilityLabel="Aplicar"
          >
            <Text style={styles.applyButtonText}>Aplicar</Text>
          </TouchableOpacity>
        </View>

        {/* Backdrop: escurece e fecha ao clicar (pausado quando há modal de sistema visível) */}
        {(!systemModalVisible && !manageScreenVisible && !requestModalVisible && !conditionModalVisible) && (
          <TouchableOpacity
            style={styles.backdrop}
            onPress={handleBackdropPress}
            activeOpacity={1}
            accessibilityRole="button"
            accessibilityLabel="Fechar desconto"
          />
        )}
      </View>
    </Modal>
    <DiscountSystemModal
      visible={systemModalVisible}
      onClose={() => setSystemModalVisible(false)}
      onApply={() => { setSystemModalVisible(false); setSelectedOption('system'); }}
      data={systemData as any}
    />
    <DiscountModalRequest
      visible={requestModalVisible}
      onClose={() => setRequestModalVisible(false)}
      onApply={(solicitacao) => {
        setRequestModalVisible(false);
        setSelectedOption('manager');
        if (solicitacao?.numero === 2) {
          setManagerStep(0);
        }
      }}
      initialPage={requestInitialPage}
    />
    <DiscountModalCondition
      visible={conditionModalVisible}
      onClose={() => setConditionModalVisible(false)}
      onApply={(condicao) => {
        setConditionModalVisible(false);
        setSelectedOption('manager');
        const n = condicao?.numero ?? 1;
        if (n === 1) setManagerStep(1);
        else if (n === 2) setManagerStep(2);
        else if (n === 3) setManagerStep(3);
      }}
      initialPage={conditionInitialPage}
    />
    <Modal
      visible={manageScreenVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setManageScreenVisible(false)}
    >
      <View style={styles.manageOverlay}>
        <View style={styles.manageContainer}>
          <DiscountManageScreen onClose={() => setManageScreenVisible(false)} />
        </View>
        <TouchableOpacity
          style={styles.manageBackdrop}
          onPress={() => setManageScreenVisible(false)}
          accessibilityRole="button"
          accessibilityLabel="Fechar Gerenciar Descontos"
        />
      </View>
    </Modal>
    </View>
  );
};

// ===== BLOCO: ESTILOS =====
// Estilos em cascata, agrupados por seções de UI
const styles = StyleSheet.create({
  // Modal: overlay e backdrop
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  manageOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  manageContainer: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  manageBackdrop: {
    flex: 0,
    width: 0,
    height: '100%',
  },
  // Drawer: container e conteúdo
  container: {
    width: 260,
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    padding: 15,
    gap: 10,
    // Sombra para destacar o drawer
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 20,
  },
  content: {
    alignSelf: 'stretch',
    flex: 1,
    gap: 10,
  },
  // Header: linha, título e ações
  headerRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#3A3F51',
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  // Legado: estilos do sino/removidos do layout
  notificationBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#F4F4F4',
    borderWidth: 0,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellWrap: {
    width: 22,
    height: 26,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 6,
  },
  badgeCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FCFCFC',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  // Botão de porcentagem e badge
  percentBox: {
    width: 38,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    width: 25,
    height: 25,
    position: 'absolute',
    top: -11,
    right: -11,
    backgroundColor: '#FCFCFC',
    borderRadius: 99,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadgeText: {
    color: '#1777CF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  // Cards de seleção de desconto
  radioOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    marginTop: 0,
  },
  radioLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  radioCard: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap: 10,
  },
  noneCard: {
    alignSelf: 'stretch',
    padding: 10,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
  },
  parentWrapper: {
    alignSelf: 'stretch',
    padding: 5,
    backgroundColor: '#1777CF1A',
    borderRadius: 8,
    gap: 5,
  },
  // Estrutura interna dos cards
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardHeaderRowBetween: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioBoxLarge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardRightColumn: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  cardValueRow: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardThinDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  reducaoDividerWrap: {
    alignSelf: 'stretch',
    paddingVertical: 0,
  },
  reducaoDividerLine: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  // Tipografia
  percentLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginBottom: 5,
  },
  currencyLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    marginTop: 5,
  },
  subtleLabel: {
    color: '#7D8592',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 5,
  },
  // Tabs do gestor
  subLabelGroup: {
    alignSelf: 'stretch',
    gap: 5,
  },
  subRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subRight: {
    width: 110,
    alignItems: 'flex-end',
  },
  sectionTitle: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  sectionTitleFlex: {
    flex: 1,
  },
  linkIconButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  miniTabsRow: {
    alignSelf: 'stretch',
    maxWidth: '100%',
  },
  miniTabsWeb: {
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    scrollBehavior: 'smooth',
  } as any,
  miniTabsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  miniTab: {
    height: 32,
    minWidth: 46,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
    borderColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniTabWeb: {
    scrollSnapAlign: 'start',
  } as any,
  miniTabActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  miniTabText: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  miniTabTextActive: {
    color: '#FCFCFC',
  },
  // Linha de ID
  idRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  idLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  idLabel: {
    color: '#7D8592',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  idValue: {
    color: '#3A3F51',
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
  // Totais
  totals: {
    alignSelf: 'stretch',
    gap: 15,
  },
  totalsWrapper: {
    alignSelf: 'stretch',
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    borderRadius: 8,
    backgroundColor: '#FCFCFC',
    padding: 10,
  },
  totalsRow: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
  },
  totalsLabel: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  totalsValue: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  totalsTotal: {
    color: '#3A3F51',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  // Botão aplicar
  applyButton: {
    alignSelf: 'stretch',
    height: 40,
    borderRadius: 6,
    backgroundColor: '#1777CF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#FCFCFC',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});

// ===== BLOCO: EXPORT =====
// Exporta o componente principal do modal de desconto
export default NewSaleDiscount;
