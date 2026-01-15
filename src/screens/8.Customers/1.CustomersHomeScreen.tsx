import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import Header from '../5.Side Menu/2.Header';
import BottomMenu from '../5.Side Menu/3.BottomMenu';
import SideMenuScreen from '../5.Side Menu/1.SideMenuScreen';
import { Layout } from '../../constants/theme';
import CustomersHomeScreenOptions from './1.CustomersHomeScreen-Options';
import CreateAndEditProfile from './2.CreateAndEditProfile';
import CustomersInformationGroupOrchestrator from './3.0.InformationGroup-Orchestrator';

type CustomerCard = {
  id: string;
  name: string;
  productDate: string;
  productName: string;
  phaseDate: string;
  phaseName: string;
  activitiesProgress: string;
  whatsapp: string;
  keyman: string;
  active?: boolean;
  statusId: 1 | 2 | 3 | 4 | 5 | 6;
};

const SearchIcon = () => (
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

const CloseXIcon: React.FC = () => (
  <Svg width={13} height={12} viewBox="0 0 13 12" fill="none">
    <Path
      d="M12.655 0.247926C12.2959 -0.0821192 11.7339 -0.0827124 11.374 0.246573L6.5 4.70646L1.62595 0.246573C1.26609 -0.0827126 0.704125 -0.0821187 0.344999 0.247926L0.291597 0.297004C-0.0977822 0.654853 -0.0971065 1.25701 0.293074 1.61404L5.08634 6L0.293074 10.386C-0.0971063 10.743 -0.0977808 11.3451 0.291598 11.703L0.345 11.7521C0.704126 12.0821 1.26609 12.0827 1.62595 11.7534L6.5 7.29354L11.374 11.7534C11.7339 12.0827 12.2959 12.0821 12.655 11.7521L12.7084 11.703C13.0978 11.3451 13.0971 10.743 12.7069 10.386L7.91366 6L12.7069 1.61404C13.0971 1.25701 13.0978 0.654853 12.7084 0.297004L12.655 0.247926Z"
      fill="#7D8592"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={8} height={15} viewBox="0 0 8 15" fill="none">
    <Path
      d="M7.45454 6.27274H4.72726V3.54546C4.72726 3.24436 4.4829 3 4.18181 3H3.81819C3.5171 3 3.27274 3.24436 3.27274 3.54546V6.27274H0.545456C0.244363 6.27274 0 6.5171 0 6.81819V7.18181C0 7.4829 0.244363 7.72726 0.545456 7.72726H3.27274V10.4545C3.27274 10.7556 3.5171 11 3.81819 11H4.18181C4.4829 11 4.72726 10.7556 4.72726 10.4545V7.72726H7.45454C7.75564 7.72726 8 7.4829 8 7.18181V6.81819C8 6.5171 7.75564 6.27274 7.45454 6.27274Z"
      fill="#FCFCFC"
    />
  </Svg>
);

const FilterButtonIcon: React.FC<{ color?: string }> = ({ color = '#7D8592' }) => (
  <Svg width={18} height={23} viewBox="0 0 18 23" fill="none">
    <Path
      d="M4.73036 10.2573C6.71398 10.2573 8.31443 8.63248 8.31443 6.62944C8.31443 4.62405 6.71473 3 4.73036 3C2.75602 3 1.15632 4.62405 1.15632 6.62944C1.15632 8.63168 2.75606 10.2573 4.73036 10.2573ZM7.6023 10.8477H1.86466C0.840406 10.8477 0 11.8022 0 12.9713V18.8121C0 18.8763 0.0301155 18.935 0.0363105 19H9.43218C9.43605 18.935 9.46617 18.8763 9.46617 18.8121V12.9713C9.46617 11.8022 8.62884 10.8477 7.6023 10.8477ZM18 6.87687C17.9961 4.74697 16.0767 3.03133 13.7269 3.03681C11.3663 3.04073 9.4623 4.77049 9.46538 6.89488C9.46924 8.57295 10.6642 9.99262 12.3234 10.5149L12.3458 17.8678L13.7308 18.8779L15.1706 17.8591L15.1682 16.8834H14.5032L14.5001 15.9273H15.1667L15.1605 14.8702H14.4986L14.4955 13.9157H15.1605L15.1575 12.9604H14.4932L14.4908 12.0051L15.1582 12.0043L15.1474 10.5102C16.8089 9.98166 18 8.5565 18 6.87687ZM13.7292 4.69375C14.2583 4.69375 14.6924 5.13303 14.6924 5.66866C14.6963 6.21133 14.2622 6.64905 13.7315 6.64905C13.1978 6.64905 12.7668 6.21757 12.7668 5.67338C12.7637 5.13539 13.1955 4.69531 13.7292 4.69375Z"
      fill={color}
    />
  </Svg>
);

const KebabIcon = () => (
  <Svg width={4} height={18} viewBox="0 0 4 18" fill="none">
    <Path d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z" fill="#7D8592" />
    <Path d="M4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9Z" fill="#7D8592" />
    <Path d="M2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.895431 14 0 14.8954 0 16C0 17.1046 0.895431 18 2 18Z" fill="#7D8592" />
  </Svg>
);

const StatusIcon: React.FC<{ statusId: CustomerCard['statusId'] }> = ({ statusId }) => {
  if (statusId === 1) {
    return (
      <Svg width={30} height={30} viewBox="0 0 32 32" fill="none">
        <Path
          d="M15.6499 30.6499C23.9342 30.6499 30.6499 23.9342 30.6499 15.6499C30.6499 7.36563 23.9342 0.649902 15.6499 0.649902C7.36563 0.649902 0.649902 7.36563 0.649902 15.6499C0.649902 23.9342 7.36563 30.6499 15.6499 30.6499Z"
          stroke="#6F7DA0"
          strokeWidth={1.3}
        />
      </Svg>
    );
  }

  if (statusId === 2) {
    return (
      <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
        <Path
          d="M15 0.349609C18.8854 0.349609 22.612 1.89322 25.3594 4.64062C28.1068 7.38803 29.6504 11.1146 29.6504 15C29.6504 18.8854 28.1068 22.612 25.3594 25.3594C22.612 28.1068 18.8854 29.6504 15 29.6504C11.1146 29.6504 7.38803 28.1068 4.64062 25.3594C1.89322 22.612 0.349609 18.8854 0.349609 15C0.349609 11.1146 1.89322 7.38803 4.64062 4.64062C7.38803 1.89322 11.1146 0.349609 15 0.349609ZM15 2.46289C11.6748 2.46289 8.486 3.78353 6.13477 6.13477C3.78353 8.486 2.46289 11.6748 2.46289 15C2.46289 18.3252 3.78353 21.514 6.13477 23.8652C8.486 26.2165 11.6748 27.5371 15 27.5371C18.3252 27.5371 21.514 26.2165 23.8652 23.8652C26.2165 21.514 27.5371 18.3252 27.5371 15C27.5371 11.6748 26.2165 8.486 23.8652 6.13477C21.514 3.78353 18.3252 2.46289 15 2.46289ZM19.8838 10.5059C20.2894 10.0961 20.9582 10.0964 21.375 10.5088C21.7865 10.916 21.7888 11.5842 21.374 11.999H21.373L13.8789 19.499L13.8779 19.5C13.4707 19.9115 12.8025 19.9138 12.3877 19.499L8.6377 15.749L8.63672 15.7471C8.22694 15.3415 8.22728 14.6727 8.63965 14.2559C9.04688 13.8444 9.7151 13.8421 10.1299 14.2568L12.8838 17.0107L13.1309 17.2588L13.3779 17.0107L19.8818 10.5068L19.8838 10.5059Z"
          fill="#7D8592"
          stroke="#FCFCFC"
          strokeWidth={0.7}
        />
      </Svg>
    );
  }

  if (statusId === 3) {
    return (
      <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
        <Rect x={0.3} y={0.3} width={29.4} height={29.4} stroke="#FCFCFC" strokeWidth={0.6} />
        <Path
          d="M15 0.299805C18.8987 0.299805 22.6377 1.84868 25.3945 4.60547C28.1513 7.36225 29.7002 11.1013 29.7002 15C29.7002 18.8987 28.1513 22.6377 25.3945 25.3945C22.6377 28.1513 18.8987 29.7002 15 29.7002C11.1013 29.7002 7.36225 28.1513 4.60547 25.3945C1.84868 22.6377 0.299805 18.8987 0.299805 15C0.299805 11.1013 1.84868 7.36225 4.60547 4.60547C7.36225 1.84868 11.1013 0.299805 15 0.299805ZM15 2.5127C11.6881 2.5127 8.51178 3.82806 6.16992 6.16992C3.82806 8.51178 2.5127 11.6881 2.5127 15C2.5127 18.3119 3.82806 21.4882 6.16992 23.8301C8.51178 26.1719 11.6881 27.4873 15 27.4873C18.3119 27.4873 21.4882 26.1719 23.8301 23.8301C26.1719 21.4882 27.4873 18.3119 27.4873 15C27.4873 11.6881 26.1719 8.51178 23.8301 6.16992C21.4882 3.82806 18.3119 2.5127 15 2.5127ZM15 19.0498C15.4177 19.0498 15.8179 19.2163 16.1133 19.5117C16.4087 19.8071 16.5752 20.2073 16.5752 20.625C16.5752 21.0427 16.4087 21.4429 16.1133 21.7383C15.8179 22.0337 15.4177 22.2002 15 22.2002C14.5823 22.2002 14.1821 22.0337 13.8867 21.7383C13.5913 21.4429 13.4248 21.0427 13.4248 20.625C13.4248 20.2073 13.5913 19.8071 13.8867 19.5117C14.1821 19.2163 14.5823 19.0498 15 19.0498ZM13.043 7.7998H16.459C18.3379 7.7998 19.8564 9.32358 19.8564 11.1973C19.8564 12.4137 19.2048 13.5387 18.1494 14.1475L16.2568 15.2314L16.1094 15.3164L16.1064 15.4873C16.0972 16.0854 15.6034 16.5752 15 16.5752C14.3864 16.5752 13.8936 16.0824 13.8936 15.4688V14.6777C13.8936 14.2822 14.1052 13.9187 14.4521 13.7197L17.0479 12.2314V12.2305C17.4159 12.019 17.6436 11.6273 17.6436 11.2031C17.6436 10.544 17.1097 10.0186 16.459 10.0186H13.043C12.7186 10.0186 12.4264 10.2199 12.3193 10.5312V10.5342L12.2969 10.5996C12.0945 11.1743 11.4589 11.4741 10.8877 11.2715C10.3167 11.0689 10.0127 10.4321 10.2148 9.8623L10.2158 9.85645L10.2393 9.78613L10.2793 9.66699C10.7313 8.54631 11.8242 7.7998 13.043 7.7998Z"
          fill="#EC8938"
          stroke="#FCFCFC"
          strokeWidth={0.6}
        />
      </Svg>
    );
  }

  if (statusId === 4) {
    return (
      <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
        <Path
          d="M29.4336 2.30762L26.1914 5.5498L25.9385 5.80371L26.1631 6.08301C30.6535 11.6816 30.3107 19.8924 25.1016 25.1016C19.882 30.3213 11.6715 30.6454 6.08301 26.1631L5.80371 25.9385L5.5498 26.1914L2.30762 29.4336L0.566406 27.6924L3.80859 24.4502L4.06152 24.1963L3.83691 23.917C-0.653279 18.3184 -0.310791 10.1077 4.89844 4.89844C10.1182 -0.321255 18.3282 -0.645384 23.917 3.83691L24.1963 4.06152L24.4502 3.80859L27.6924 0.566406L29.4336 2.30762ZM7.5498 24.1924L7.91797 24.4688C12.5226 27.9273 19.1252 27.5936 23.3594 23.3594C27.5976 19.1213 27.9244 12.519 24.4688 7.91797L24.1924 7.5498L7.5498 24.1924ZM15 3.17773C8.46528 3.17776 3.17776 8.46631 3.17773 15C3.17773 17.5865 4.00382 20.0484 5.53125 22.082L5.80762 22.4502L22.4502 5.80762L22.082 5.53125C20.0484 4.00393 17.5865 3.17773 15 3.17773Z"
          fill="#EF4444"
          stroke="#FCFCFC"
          strokeWidth={0.8}
        />
      </Svg>
    );
  }

  if (statusId === 5) {
    return (
      <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
        <Path
          d="M15 0.299805C18.8987 0.299805 22.6377 1.84868 25.3945 4.60547C28.1513 7.36225 29.7002 11.1013 29.7002 15C29.7002 18.8987 28.1513 22.6377 25.3945 25.3945C22.6377 28.1513 18.8987 29.7002 15 29.7002C11.1013 29.7002 7.36225 28.1513 4.60547 25.3945C1.84868 22.6377 0.299805 18.8987 0.299805 15C0.299805 11.1013 1.84868 7.36225 4.60547 4.60547C7.36225 1.84868 11.1013 0.299805 15 0.299805ZM15 2.5127C11.6881 2.5127 8.51178 3.82806 6.16992 6.16992C3.82806 8.51178 2.5127 11.6881 2.5127 15C2.5127 18.3119 3.82806 21.4882 6.16992 23.8301C8.51178 26.1719 11.6881 27.4873 15 27.4873C18.3119 27.4873 21.4882 26.1719 23.8301 23.8301C26.1719 21.4882 27.4873 18.3119 27.4873 15C27.4873 11.6881 26.1719 8.51178 23.8301 6.16992C21.4882 3.82806 18.3119 2.5127 15 2.5127ZM10.4668 10.4648C10.8937 10.0334 11.5941 10.0316 12.0283 10.4658L14.9941 13.4316L17.9609 10.4648C18.3864 10.0349 19.0874 10.0356 19.5234 10.4668C19.9549 10.8937 19.9567 11.5941 19.5225 12.0283L16.5566 14.9941L19.5234 17.9609C19.9534 18.3864 19.9527 19.0874 19.5215 19.5234C19.0946 19.9549 18.3942 19.9567 17.96 19.5225L14.9941 16.5566L12.0273 19.5234C11.6019 19.9534 10.9008 19.9527 10.4648 19.5215C10.0334 19.0946 10.0316 18.3942 10.4658 17.96L13.4316 14.9941L10.4648 12.0273L10.3887 11.9443C10.0345 11.5141 10.0587 10.873 10.4658 10.4658L10.4668 10.4648Z"
          fill="#EF4444"
          stroke="#FCFCFC"
          strokeWidth={0.6}
        />
      </Svg>
    );
  }

  return (
    <Svg width={30} height={30} viewBox="0 0 30 30" fill="none">
      <Path
        d="M15 0.299805C18.8987 0.299805 22.6377 1.84868 25.3945 4.60547C28.1513 7.36225 29.7002 11.1013 29.7002 15C29.7002 18.8987 28.1513 22.6377 25.3945 25.3945C22.6377 28.1513 18.8987 29.7002 15 29.7002C11.1013 29.7002 7.36225 28.1513 4.60547 25.3945C1.84868 22.6377 0.299805 18.8987 0.299805 15C0.299805 11.1013 1.84868 7.36225 4.60547 4.60547C7.36225 1.84868 11.1013 0.299805 15 0.299805ZM15 2.5127C11.6881 2.5127 8.51178 3.82806 6.16992 6.16992C3.82806 8.51178 2.5127 11.6881 2.5127 15C2.5127 18.3119 3.82806 21.4882 6.16992 23.8301C8.51178 26.1719 11.6881 27.4873 15 27.4873C18.3119 27.4873 21.4882 26.1719 23.8301 23.8301C26.1719 21.4882 27.4873 18.3119 27.4873 15C27.4873 11.6881 26.1719 8.51178 23.8301 6.16992C21.4882 3.82806 18.3119 2.5127 15 2.5127ZM19.8477 10.4707C20.2731 10.0407 20.9742 10.0415 21.4102 10.4727C21.8416 10.8995 21.8434 11.5999 21.4092 12.0342L13.915 19.5342L13.9141 19.5352C13.4872 19.9666 12.7868 19.9684 12.3525 19.5342L8.60156 15.7832L8.52637 15.7002C8.1735 15.2711 8.19919 14.6295 8.60352 14.2207C9.0304 13.7892 9.73078 13.7874 10.165 14.2217L13.1309 17.1875L19.8477 10.4707Z"
        fill="#1777CF"
        stroke="#FCFCFC"
        strokeWidth={0.6}
      />
    </Svg>
  );
};

const getStatusLabel = (statusId: CustomerCard['statusId']) => {
  switch (statusId) {
    case 1:
      return 'Atividade não iniciada';
    case 2:
      return 'Atividade iniciada';
    case 3:
      return 'Atividade pendente';
    case 4:
      return 'Fase ou atividade Nula';
    case 5:
      return 'Atividade em atraso';
    default:
      return 'Atividade concluída';
  }
};

const CustomersHomeScreen: React.FC = () => {
  const [sideMenuVisible, setSideMenuVisible] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [statusValue, setStatusValue] = useState<string>('Todos');
  const [productsValue, setProductsValue] = useState<string>('Todos');
  const [phasesValue, setPhasesValue] = useState<string>('Todas');
  const [activitiesValue, setActivitiesValue] = useState<string>('Todas');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isKeymanMode, setIsKeymanMode] = useState<boolean>(false);
  const [optionsModalVisible, setOptionsModalVisible] = useState<boolean>(false);
  const [optionsAnchorPosition, setOptionsAnchorPosition] = useState<{ x: number; y: number } | null>(null);
  const [createEditVisible, setCreateEditVisible] = useState<boolean>(false);
  // Controla qual cliente foi usado para abrir o modal de opções (ex.: Editar Perfil)
  const [optionsCustomerId, setOptionsCustomerId] = useState<string | null>(null);
  // Controla o modo do modal de perfil (criar/editar)
  const [createEditMode, setCreateEditMode] = useState<'criar' | 'editar'>('criar');
  // Guarda o cliente que está sendo editado (usado para salvar alterações no card correto)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  // Dados iniciais do modal de perfil (reutiliza o tipo do próprio componente para manter consistência)
  const [createEditInitialData, setCreateEditInitialData] = useState<React.ComponentProps<typeof CreateAndEditProfile>['initialData']>(undefined);
  const [infoGroupVisible, setInfoGroupVisible] = useState<boolean>(false);

  const [customers, setCustomers] = useState<CustomerCard[]>(() => [
      {
        id: '1',
        name: 'Camila Betanea',
        productDate: '01/02',
        productName: 'Holding Patrimonial',
        phaseDate: '01/15',
        phaseName: 'Contrato Social',
        activitiesProgress: '02/20',
        whatsapp: '(11) 99999-9999',
        keyman: 'João Fernando',
        active: true,
        statusId: 1,
      },
      {
        id: '2',
        name: 'Maria Madalena dos santos',
        productDate: '01/02',
        productName: 'Holding Patrimonial',
        phaseDate: '01/15',
        phaseName: 'Contrato Social',
        activitiesProgress: '02/20',
        whatsapp: '(11) 98888-8888',
        keyman: 'Camila Betanea',
        statusId: 3,
      },
      {
        id: '3',
        name: 'João Henrique',
        productDate: '01/02',
        productName: 'Holding Patrimonial',
        phaseDate: '01/15',
        phaseName: 'Contrato Social',
        activitiesProgress: '02/20',
        whatsapp: '(11) 97777-7777',
        keyman: 'Maria Madalena',
        statusId: 6,
      },
    ]);

  const filteredCustomers = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) => c.name.toLowerCase().includes(q));
  }, [customers, searchText]);
  
  React.useEffect(() => {
    if (filteredCustomers.length === 0) {
      setSelectedCustomerId(null);
      return;
    }
    if (selectedCustomerId == null) {
      setSelectedCustomerId(filteredCustomers[0].id);
      return;
    }
    if (!filteredCustomers.some((c) => c.id === selectedCustomerId)) {
      setSelectedCustomerId(filteredCustomers[0].id);
    }
  }, [filteredCustomers, selectedCustomerId]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Clientes" notificationCount={6} onMenuPress={() => setSideMenuVisible(true)} />

      <View style={styles.fixedHeader}>
        <View style={styles.headerDividerWrapper}>
          <View style={styles.headerDivider} />
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.newCustomerButton}
            onPress={() => {
              // Abertura do modal em modo "criar" (Novo Cliente)
              setCreateEditMode('criar');
              setEditingCustomerId(null);
              setCreateEditInitialData(undefined);
              setCreateEditVisible(true);
            }}
            activeOpacity={0.7}
          >
            <View style={styles.newCustomerIcon}>
              <PlusIcon />
            </View>
            <Text style={styles.newCustomerText}>Novo Cliente</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersBlock}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => setStatusValue((v) => (v === 'Todos' ? 'Ativos' : 'Todos'))}
              activeOpacity={0.7}
            >
              <Text style={styles.filterLabel}>Status</Text>
              <Text style={styles.filterValue}>{statusValue}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => setProductsValue((v) => (v === 'Todos' ? 'Holding' : 'Todos'))}
              activeOpacity={0.7}
            >
              <Text style={styles.filterLabel}>Produtos</Text>
              <Text style={styles.filterValue}>{productsValue}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterCard}
              onPress={() => setPhasesValue((v) => (v === 'Todas' ? 'Contrato' : 'Todas'))}
              activeOpacity={0.7}
            >
              <Text style={styles.filterLabel}>Fases</Text>
              <Text style={styles.filterValue}>{phasesValue}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterCardWide}
              onPress={() => setActivitiesValue((v) => (v === 'Todas' ? 'Concluídas' : 'Todas'))}
              activeOpacity={0.7}
            >
              <Text style={styles.filterLabel}>Atividades Concluidas</Text>
              <Text style={styles.filterValue}>{activitiesValue}</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.searchAndFilterRow}>
            <View style={styles.searchContainer}>
              <View style={styles.searchIconWrap}>
                <SearchIcon />
              </View>
              <TextInput
                style={[styles.searchInput, Platform.select({ web: { outlineStyle: 'none', outlineWidth: 0 } }) as any]}
                placeholder="pesquise aqui"
                placeholderTextColor="#91929E"
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.trim().length > 0 ? (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => setSearchText('')}
                  accessibilityRole="button"
                  accessibilityLabel="Limpar busca"
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  activeOpacity={0.7}
                >
                  <CloseXIcon />
                </TouchableOpacity>
              ) : null}
            </View>
            <TouchableOpacity
              style={[styles.squareButton, isKeymanMode ? styles.squareButtonActive : null]}
              onPress={() => {
                setIsKeymanMode((prev) => !prev);
              }}
              activeOpacity={0.7}
            >
              <FilterButtonIcon color={isKeymanMode ? '#FCFCFC' : '#7D8592'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.cardsContainer}>
            {filteredCustomers.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.customerCard, c.id === selectedCustomerId ? styles.customerCardActive : null]}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedCustomerId(c.id);
                  setInfoGroupVisible(true);
                }}
              >
                <View style={styles.cardLeft}>
                  <View style={styles.leftColumnContainer}>
                    <View style={styles.photoOuter}>
                      <Image
                        source={require('../../../assets/AvatarPlaceholder02.png')}
                        style={styles.photo}
                        resizeMode="cover"
                      />
                    </View>
                    <View style={styles.statusBox}>
                      <StatusIcon statusId={c.statusId} />
                    </View>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.customerName} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation?.();
                        const { pageX, pageY } = e.nativeEvent as any;
                        if (typeof pageX === 'number' && typeof pageY === 'number') {
                          setOptionsAnchorPosition({ x: pageX, y: pageY });
                        } else {
                          setOptionsAnchorPosition(null);
                        }
                        // Mantém referência do card que abriu o menu de opções (3 pontinhos)
                        setOptionsCustomerId(c.id);
                        setOptionsModalVisible(true);
                      }}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      activeOpacity={0.7}
                    >
                      <KebabIcon />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.divider} />

                  {isKeymanMode ? (
                    <>
                      <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Whatsapp</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>
                          {c.whatsapp}
                        </Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Keyman</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>
                          {c.keyman}
                        </Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Status</Text>
                        <Text style={styles.fieldValue} numberOfLines={1}>
                          {getStatusLabel(c.statusId)}
                        </Text>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.fieldBlock}>
                        <View style={styles.fieldTitleRow}>
                          <Text style={styles.fieldTitle}>Produto</Text>
                          <Text style={styles.fieldTitleRight}>{c.productDate}</Text>
                        </View>
                        <Text style={styles.fieldValue}>{c.productName}</Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.fieldBlock}>
                        <View style={styles.fieldTitleRow}>
                          <Text style={styles.fieldTitle}>Fase</Text>
                          <Text style={styles.fieldTitleRight}>{c.phaseDate}</Text>
                        </View>
                        <Text style={styles.fieldValue}>{c.phaseName}</Text>
                      </View>

                      <View style={styles.divider} />

                      <View style={styles.fieldBlock}>
                        <Text style={styles.fieldTitle}>Atividades concluídas</Text>
                        <Text style={styles.fieldValue}>{c.activitiesProgress}</Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {infoGroupVisible && (
        <View style={styles.fullScreenOverlay}>
          <CustomersInformationGroupOrchestrator
            visible={infoGroupVisible}
            onClose={() => setInfoGroupVisible(false)}
            initialTab="perfil"
            customerName={customers.find((x) => x.id === selectedCustomerId)?.name}
            initialData={{
              whatsapp: customers.find((x) => x.id === selectedCustomerId)?.whatsapp || '',
              estado: 'São Paulo',
              cep: '15200-000',
              cidade: 'São José do Rio Preto',
              bairro: 'Centro',
              endereco: 'Piratininga',
              numero: '650',
              complemento: 'Sala 207',
            }}
          />
        </View>
      )}

      <CustomersHomeScreenOptions
        visible={optionsModalVisible}
        anchorPosition={optionsAnchorPosition ?? undefined}
        onClose={() => setOptionsModalVisible(false)}
        onEditProfile={() => {
          // Abre o modal de perfil no modo "editar" ao clicar em "Editar Perfil"
          const id = optionsCustomerId;
          if (!id) return;
          const customer = customers.find((c) => c.id === id);
          if (!customer) return;
          setCreateEditMode('editar');
          setEditingCustomerId(id);
          setCreateEditInitialData({
            personType: 'fisica',
            nome: customer.name,
            whatsapp: customer.whatsapp,
          });
          setCreateEditVisible(true);
        }}
      />
      <CreateAndEditProfile
        visible={createEditVisible}
        mode={createEditMode}
        initialData={createEditInitialData}
        onClose={() => {
          // Limpa estado do modal ao fechar (evita reaproveitar dados de edição em futuras aberturas)
          setCreateEditVisible(false);
          setCreateEditMode('criar');
          setEditingCustomerId(null);
          setCreateEditInitialData(undefined);
        }}
        onSave={(payload) => {
          if (createEditMode === 'editar') {
            // Salva alterações do perfil no card existente (modo edição)
            const id = editingCustomerId;
            if (!id) return;
            const name = (payload?.nome || '').trim() || 'Editar perfil';
            setCustomers((prev) =>
              prev.map((c) =>
                c.id === id
                  ? { ...c, name, whatsapp: payload?.whatsapp || c.whatsapp }
                  : c
              )
            );
            return;
          }
          // Cria novo cliente (modo criação)
          const id = `${Date.now()}`;
          const name = (payload?.nome || '').trim() || 'Novo cliente';
          const newCustomer: CustomerCard = {
            id,
            name,
            productDate: '—',
            productName: '—',
            phaseDate: '—',
            phaseName: '—',
            activitiesProgress: '00/00',
            whatsapp: payload?.whatsapp || '',
            keyman: 'Sem indicação',
            statusId: 1,
          };
          setCustomers((prev) => [newCustomer, ...prev]);
          setSelectedCustomerId(id);
        }}
      />
      {!infoGroupVisible ? <BottomMenu activeScreen="Clients" /> : null}
      <SideMenuScreen isVisible={sideMenuVisible} onClose={() => setSideMenuVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  fixedHeader: {
    backgroundColor: '#FCFCFC',
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#FCFCFC',
    ...Platform.select({
      web: {
        overflow: 'hidden',
      } as any,
      default: {},
    }),
  },
  scrollView: {
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: Layout.bottomMenuHeight,
        overflowY: 'auto',
        overflowX: 'hidden',
      } as any,
      default: {
        flex: 1,
      },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 0 : Layout.bottomMenuHeight,
  },
  headerDividerWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerDivider: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
    width: '100%',
    alignSelf: 'stretch',
  },
  actionsRow: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'flex-end',
    backgroundColor: '#FCFCFC',
  },
  newCustomerButton: {
    height: 38,
    backgroundColor: '#1777CF',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 5,
  },
  newCustomerIcon: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCustomerText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FCFCFC',
  },
  filtersBlock: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: '#FCFCFC',
    gap: 15,
  },
  filtersRow: {
    gap: 10,
  },
  filterCard: {
    width: 100,
    padding: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    gap: 6,
  },
  filterCardWide: {
    padding: 10,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7D8592',
  },
  filterValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  searchAndFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E0F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 10,
    gap: 10,
    backgroundColor: '#FCFCFC',
  },
  searchIconWrap: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareButton: {
    width: 42,
    height: 42,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareButtonActive: {
    backgroundColor: '#1777CF',
    borderColor: '#1777CF',
  },
  cardsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 8,
  },
  customerCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 12,
    paddingVertical: 5,
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    backgroundColor: '#FCFCFC',
  },
  customerCardActive: {
    borderColor: '#1777CF',
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
  },
  cardLeft: {
    width: 79,
    justifyContent: 'flex-start',
  },
  leftColumnContainer: {
    flex: 1,
    borderRadius: 8,
    padding: 5,
    gap: 5,
    backgroundColor: '#F4F4F4',
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
  },
  photoOuter: {
    height: 102,
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  statusBox: {
    height: 60,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    backgroundColor: '#FCFCFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRight: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 0,
    gap: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  customerName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#3A3F51',
  },
  divider: {
    height: 1,
    backgroundColor: '#D8E0F0',
    opacity: 0.5,
  },
  fieldBlock: {
    gap: 3,
  },
  fieldTitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7D8592',
  },
  fieldTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  fieldTitleRight: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7D8592',
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FCFCFC',
    zIndex: 1000,
    ...(Platform.OS !== 'web' ? { elevation: 100 } : {}),
  },
});

export default CustomersHomeScreen;
