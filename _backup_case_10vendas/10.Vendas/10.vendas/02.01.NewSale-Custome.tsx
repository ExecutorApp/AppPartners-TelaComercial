import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { Asset } from 'expo-asset';
import CreateContact, { CreateContactRef } from './02.01.NewSale-Custome-CreateContact';
import type { CreateContactPayload } from './02.01.NewSale-Custome-CreateContact';
import EditProfileModal from './02.01.NewSale-Custome-EditProfile';
import FullFlow from './02.06.NewSale-FullFlow';
import SlideInView from './SlideInView';
import { isValidCPF, isValidEmail, UF_LIST, isValidCEP, onlyDigits } from '../../utils/validators';

interface NewAppointment01Props {
  visible: boolean;
  onClose: () => void;
  onSelectClient?: (client: { id: string; photoKey?: string; photoUri?: string | null } | null) => void;
  onCreateContact?: () => void;
  onNext?: () => void;
  summaries?: Partial<Record<number, string>>;
  onSelectStep?: (step: number) => void;
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

const LikePositiveIcon: React.FC = () => (
  <Svg width={39} height={39} viewBox="0 0 39 39" fill="none">
    <Rect x={0.25} y={0.25} width={38} height={38} rx={8} stroke="#D8E0F0" strokeWidth={0.5} />
    <Path d="M29.2488 21.5942C29.2264 20.9976 28.9265 20.4913 28.4371 20.1722C28.8082 19.7955 28.901 19.3045 28.8354 18.8846C28.7114 18.0896 27.9796 17.2443 26.8672 17.2443H22.4468C22.3205 17.2443 22.3045 17.2027 22.2949 17.1803C22.2133 16.9803 22.3757 16.4285 22.9915 15.8303C23.9208 14.929 24.0456 13.7469 24.0456 12.7088C24.0456 11.43 23.3154 10.3543 22.2685 10.092C21.907 10.0016 21.5559 10.068 21.2512 10.2839C20.625 10.7262 20.3235 11.7083 20.2499 12.4801C20.1651 13.3702 19.3278 14.1084 18.436 14.773C17.4411 15.5128 16.7397 16.7444 16.2271 17.6433L16.1543 17.7705C15.7544 18.4735 15.1666 18.8446 14.454 18.8446C14.2333 18.8446 14.0541 19.0237 14.0541 19.2445C14.0541 19.4652 14.2333 19.6444 14.454 19.6444C15.4561 19.6444 16.3063 19.1197 16.8493 18.1673L16.9221 18.0393C17.3987 17.202 18.053 16.0543 18.9135 15.4145C19.954 14.6387 20.9313 13.7558 21.0465 12.5554C21.1152 11.8308 21.3896 11.1654 21.7127 10.9366C21.8278 10.8542 21.9382 10.8335 22.075 10.8671C22.7635 11.0406 23.2458 11.7972 23.2458 12.7089C23.2458 13.623 23.1475 14.5643 22.4341 15.2561C21.6567 16.0103 21.3104 16.8837 21.5527 17.4811C21.6959 17.8338 22.0294 18.0441 22.4461 18.0441H26.8655C27.5093 18.0441 27.97 18.5343 28.0436 19.0078C28.106 19.4109 27.8844 19.7148 27.4182 19.8635C27.2438 19.9203 27.1287 20.0875 27.1407 20.2706C27.1519 20.4538 27.287 20.6049 27.4678 20.6385C28.0636 20.7465 28.4299 21.1152 28.4475 21.623C28.4627 22.0421 28.2187 22.5324 27.6397 22.6827C27.4782 22.7251 27.359 22.8626 27.3422 23.0282C27.3238 23.1937 27.411 23.3529 27.5605 23.4281C28.0404 23.668 28.1467 24.2487 27.9724 24.6709C27.8893 24.8741 27.6181 25.3235 26.9151 25.0916C26.7176 25.0228 26.5065 25.122 26.4241 25.3107C26.3417 25.5003 26.4161 25.721 26.5968 25.821C27.2102 26.16 27.3262 26.6727 27.2391 27.0086C27.1359 27.4085 26.7632 27.6468 26.2418 27.6468H16.052C14.9243 27.6468 14.8555 26.6455 14.8531 26.4432C14.8524 26.2241 14.6732 26.0457 14.4533 26.0457C14.2326 26.0457 14.0534 26.2248 14.0534 26.4456C14.0534 27.1374 14.4709 28.4466 16.052 28.4466H26.2417C27.1239 28.4466 27.8197 27.9612 28.0148 27.2094C28.134 26.7503 28.0452 26.2769 27.7916 25.8706C28.2315 25.7171 28.5514 25.3707 28.7138 24.9756C28.9465 24.4102 28.8897 23.6816 28.477 23.1618C28.9721 22.8082 29.2712 22.23 29.2488 21.5942Z" fill="#7D8592" />
    <Path d="M13.6487 18.0448H10.4497C9.78825 18.0448 9.25 18.5831 9.25 19.2445V27.2421C9.25 27.9035 9.78825 28.4417 10.4497 28.4417H13.6487C14.3101 28.4417 14.8483 27.9035 14.8483 27.2421V19.2445C14.8483 18.5831 14.3101 18.0448 13.6487 18.0448ZM14.0486 27.2421C14.0486 27.462 13.8695 27.642 13.6487 27.642H10.4497C10.2289 27.642 10.0498 27.462 10.0498 27.2421V19.2445C10.0498 19.0237 10.2289 18.8446 10.4497 18.8446H13.6487C13.8694 18.8446 14.0486 19.0237 14.0486 19.2445V27.2421Z" fill="#7D8592" />
    <Path d="M12.0492 24.4429C11.3878 24.4429 10.8495 24.9812 10.8495 25.6426C10.8495 26.304 11.3878 26.8422 12.0492 26.8422C12.7106 26.8422 13.2488 26.304 13.2488 25.6426C13.2488 24.9812 12.7106 24.4429 12.0492 24.4429ZM12.0492 26.0424C11.8284 26.0424 11.6493 25.8625 11.6493 25.6425C11.6493 25.4226 11.8284 25.2426 12.0492 25.2426C12.2699 25.2426 12.449 25.4226 12.449 25.6426C12.449 25.8625 12.2699 26.0424 12.0492 26.0424Z" fill="#7D8592" />
  </Svg>
);

const LikeNegativeIcon: React.FC = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#FF0004" fillOpacity={0.05} />
    <Path d="M9.00117 16.6558C9.02355 17.2524 9.32346 17.7587 9.81292 18.0778C9.44185 18.4545 9.34904 18.9455 9.41462 19.3654C9.5386 20.1604 10.2704 21.0057 11.3828 21.0057H15.8032C15.9295 21.0057 15.9455 21.0473 15.9551 21.0697C16.0367 21.2697 15.8743 21.8215 15.2585 22.4197C14.3292 23.321 14.2044 24.5031 14.2044 25.5412C14.2044 26.82 14.9346 27.8957 15.9815 28.158C16.343 28.2484 16.6941 28.182 16.9988 27.9661C17.625 27.5238 17.9265 26.5417 18.0001 25.7699C18.0849 24.8798 18.9222 24.1416 19.814 23.477C20.8089 22.7372 21.5103 21.5056 22.0229 20.6067L22.0957 20.4795C22.4956 19.7765 23.0834 19.4054 23.796 19.4054C24.0167 19.4054 24.1959 19.2263 24.1959 19.0055C24.1959 18.7848 24.0167 18.6056 23.796 18.6056C22.7939 18.6056 21.9437 19.1303 21.4007 20.0827L21.3279 20.2107C20.8513 21.048 20.197 22.1957 19.3365 22.8355C18.296 23.6113 17.3187 24.4942 17.2035 25.6946C17.1348 26.4192 16.8604 27.0846 16.5373 27.3134C16.4222 27.3958 16.3118 27.4165 16.175 27.3829C15.4865 27.2094 15.0042 26.4528 15.0042 25.5411C15.0042 24.627 15.1025 23.6857 15.8159 22.9939C16.5933 22.2397 16.9396 21.3663 16.6973 20.7689C16.5541 20.4162 16.2206 20.2059 15.8039 20.2059H11.3845C10.7407 20.2059 10.28 19.7157 10.2064 19.2422C10.144 18.8391 10.3656 18.5352 10.8318 18.3865C11.0062 18.3297 11.1213 18.1625 11.1093 17.9794C11.0981 17.7962 10.963 17.6451 10.7822 17.6115C10.1864 17.5035 9.82011 17.1348 9.80253 16.627C9.78734 16.2079 10.0313 15.7176 10.6103 15.5673C10.7718 15.5249 10.891 15.3874 10.9078 15.2218C10.9262 15.0563 10.839 14.8971 10.6895 14.8219C10.2096 14.582 10.1033 14.0013 10.2776 13.5791C10.3607 13.3759 10.6319 12.9265 11.3349 13.1584C11.5324 13.2272 11.7435 13.128 11.8259 12.9393C11.9083 12.7497 11.8339 12.529 11.6532 12.429C11.0398 12.09 10.9238 11.5773 11.0109 11.2414C11.1141 10.8415 11.4868 10.6032 12.0082 10.6032H22.198C23.3257 10.6032 23.3945 11.6045 23.3969 11.8068C23.3976 12.0259 23.5768 12.2043 23.7967 12.2043C24.0174 12.2043 24.1966 12.0252 24.1966 11.8044C24.1966 11.1126 23.7791 9.80338 22.198 9.80338H12.0083C11.1261 9.80338 10.4303 10.2888 10.2352 11.0406C10.116 11.4997 10.2048 11.9731 10.4584 12.3794C10.0185 12.5329 9.69859 12.8793 9.53622 13.2744C9.3035 13.8398 9.36025 14.5684 9.77296 15.0882C9.27787 15.4418 8.97879 16.02 9.00117 16.6558Z" fill="#C1253A" />
    <Path d="M24.6013 20.2052H27.8003C28.4618 20.2052 29 19.6669 29 19.0055V11.0079C29 10.3465 28.4618 9.80827 27.8003 9.80827H24.6013C23.9399 9.80827 23.4017 10.3465 23.4017 11.0079V19.0055C23.4017 19.6669 23.9399 20.2052 24.6013 20.2052ZM24.2014 11.0079C24.2014 10.788 24.3805 10.608 24.6013 10.608H27.8003C28.0211 10.608 28.2002 10.788 28.2002 11.0079V19.0055C28.2002 19.2263 28.0211 19.4054 27.8003 19.4054H24.6013C24.3806 19.4054 24.2014 19.2263 24.2014 19.0055V11.0079Z" fill="#C1253A" />
    <Path d="M26.2008 13.8071C26.8622 13.8071 27.4005 13.2688 27.4005 12.6074C27.4005 11.946 26.8622 11.4078 26.2008 11.4078C25.5394 11.4078 25.0012 11.946 25.0012 12.6074C25.0012 13.2688 25.5394 13.8071 26.2008 13.8071ZM26.2008 12.2076C26.4216 12.2076 26.6007 12.3875 26.6007 12.6075C26.6007 12.8274 26.4216 13.0074 26.2008 13.0074C25.9801 13.0074 25.801 12.8274 25.801 12.6074C25.801 12.3875 25.9801 12.2076 26.2008 12.2076Z" fill="#C1253A" />
  </Svg>
);

const LikeNeutralBox: React.FC = () => (
  <Svg width={39} height={39} viewBox="0 0 39 39" fill="none">
    <Rect x={0.25} y={0.25} width={38} height={38} rx={8} stroke="#D8E0F0" strokeWidth={0.5} />
  </Svg>
);

// Formata para deixar a primeira letra da primeira palavra em maiúscula
const capitalizeFirstLetter = (s: string) => {
  if (!s) return s;
  return s.replace(/^(\s*)([a-zA-ZÀ-ÖØ-öø-ÿ])/u, (_, spaces: string, letter: string) => spaces + letter.toUpperCase());
};

// Radio – mesmo padrão visual da tela 3.RegistrationData-Enterprise
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

type Client = {
  id: string;
  name: string;
  phone: string;
  photo: any; // ImageSourcePropType
  photoKey: string;
};

type LikeStatus = 'positive' | 'negative';

type ClientProfile = {
  personType: 'FISICA';
  name: string;
  cpf: string;
  email: string;
  whatsapp: string;
  state: string;
  cep: string;
  city: string;
  neighborhood: string;
  address: string;
  number: string;
  complement: string;
  operationAsset: string;
  operationTaxCredit: string;
  operationTaxPlanning: string;
};

const NewAppointment01: React.FC<NewAppointment01Props> = ({ visible, onClose, onSelectClient, onCreateContact, onNext, summaries, onSelectStep, onUpdateSummary, maxAccessibleStep = 1, transitionDirection = 'forward', embedded = false, registerNextHandler, onCanProceedChange }) => {
  const clients: Client[] = useMemo(() => [
    { id: 'c1', name: 'Antônio da silva', phone: '17 9915-0920', photo: require('../../../assets/01-Foto.png'), photoKey: '01-Foto.png' },
    { id: 'c2', name: 'Joaquim Madaleno', phone: '17 9946-0986', photo: require('../../../assets/02-Foto.png'), photoKey: '02-Foto.png' },
    { id: 'c3', name: 'Fernando Juarez da costa', phone: '17 9946-0986', photo: require('../../../assets/03-Foto.png'), photoKey: '03-Foto.png' },
    { id: 'c4', name: 'Kamilo Tecno brega', phone: '17 9946-0986', photo: require('../../../assets/04-Foto.png'), photoKey: '04-Foto.png' },
    { id: 'c5', name: 'Sebastião de quebrada', phone: '17 9946-0986', photo: require('../../../assets/05-Foto.png'), photoKey: '05-Foto.png' },
    { id: 'c6', name: 'Bruna Ferreira', phone: '11 91234-5678', photo: require('../../../assets/01-Foto.png'), photoKey: '01-Foto.png' },
    { id: 'c7', name: 'Carlos Henrique', phone: '21 99876-5432', photo: require('../../../assets/02-Foto.png'), photoKey: '02-Foto.png' },
    { id: 'c8', name: 'Daniela Souza', phone: '31 99999-0001', photo: require('../../../assets/03-Foto.png'), photoKey: '03-Foto.png' },
    { id: 'c9', name: 'Eduardo Lima', phone: '85 98888-7777', photo: require('../../../assets/04-Foto.png'), photoKey: '04-Foto.png' },
    { id: 'c10', name: 'Fátima Borges', phone: '19 98765-4321', photo: require('../../../assets/05-Foto.png'), photoKey: '05-Foto.png' },
  ], []);

  const initialProfilesById = useMemo<Record<string, ClientProfile>>(() => {
    const map: Record<string, ClientProfile> = {};
    clients.forEach((c) => {
      if (c.id === 'c1') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'antonio.silva@example.com',
          whatsapp: c.phone,
          state: 'SP',
          cep: '01001-000',
          city: 'São Paulo',
          neighborhood: 'Centro',
          address: 'Rua Piratininga',
          number: '650',
          complement: 'Sala 207',
          operationAsset: 'R$ 10.000.000,00',
          operationTaxCredit: 'R$ 200.000,00',
          operationTaxPlanning: 'R$ 200.000,00',
        };
      } else if (c.id === 'c2') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'joaquim.madaleno@example.com',
          whatsapp: c.phone,
          state: 'RJ',
          cep: '20010-000',
          city: 'Rio de Janeiro',
          neighborhood: 'Copacabana',
          address: 'Avenida Atlântica',
          number: '1200',
          complement: 'Apto 305',
          operationAsset: '',
          operationTaxCredit: '',
          operationTaxPlanning: '',
        };
      } else if (c.id === 'c3') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'fernando.juarez@example.com',
          whatsapp: c.phone,
          state: 'MG',
          cep: '30190-060',
          city: 'Belo Horizonte',
          neighborhood: 'Savassi',
          address: 'Rua Rio Grande do Norte',
          number: '500',
          complement: 'Sala 12',
          operationAsset: 'R$ 9.500.000,00',
          operationTaxCredit: 'R$ 180.000,00',
          operationTaxPlanning: 'R$ 150.000,00',
        };
      } else if (c.id === 'c4') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'kamilo.brega@example.com',
          whatsapp: c.phone,
          state: 'PR',
          cep: '80010-000',
          city: 'Curitiba',
          neighborhood: 'Centro',
          address: 'Rua XV de Novembro',
          number: '950',
          complement: 'Conj. 201',
          operationAsset: 'R$ 7.200.000,00',
          operationTaxCredit: 'R$ 120.000,00',
          operationTaxPlanning: 'R$ 110.000,00',
        };
      } else if (c.id === 'c5') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'sebastiao.quebrada@example.com',
          whatsapp: c.phone,
          state: 'BA',
          cep: '40140-060',
          city: 'Salvador',
          neighborhood: 'Barra',
          address: 'Rua Marques de Leão',
          number: '330',
          complement: 'Bloco B',
          operationAsset: 'R$ 4.800.000,00',
          operationTaxCredit: 'R$ 95.000,00',
          operationTaxPlanning: 'R$ 80.000,00',
        };
      } else if (c.id === 'c6') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'bruna.ferreira@example.com',
          whatsapp: c.phone,
          state: 'SP',
          cep: '04001-000',
          city: 'São Paulo',
          neighborhood: 'Vila Mariana',
          address: 'Rua Domingos de Morais',
          number: '2200',
          complement: 'Sala 12',
          operationAsset: 'R$ 6.300.000,00',
          operationTaxCredit: 'R$ 140.000,00',
          operationTaxPlanning: 'R$ 130.000,00',
        };
      } else if (c.id === 'c7') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'carlos.henrique@example.com',
          whatsapp: c.phone,
          state: 'RJ',
          cep: '21031-040',
          city: 'Rio de Janeiro',
          neighborhood: 'Penha',
          address: 'Rua dos Topázios',
          number: '123',
          complement: 'Casa 2',
          operationAsset: '',
          operationTaxCredit: '',
          operationTaxPlanning: '',
        };
      } else if (c.id === 'c8') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'daniela.souza@example.com',
          whatsapp: c.phone,
          state: 'MG',
          cep: '30112-010',
          city: 'Belo Horizonte',
          neighborhood: 'Funcionários',
          address: 'Rua da Bahia',
          number: '120',
          complement: 'Loja 3',
          operationAsset: '',
          operationTaxCredit: '',
          operationTaxPlanning: '',
        };
      } else if (c.id === 'c9') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'eduardo.lima@example.com',
          whatsapp: c.phone,
          state: 'CE',
          cep: '60160-230',
          city: 'Fortaleza',
          neighborhood: 'Meireles',
          address: 'Av. Desembargador Moreira',
          number: '1025',
          complement: 'Sala 5',
          operationAsset: '',
          operationTaxCredit: '',
          operationTaxPlanning: '',
        };
      } else if (c.id === 'c10') {
        map[c.id] = {
          personType: 'FISICA',
          name: c.name,
          cpf: '529.982.247-25',
          email: 'fatima.borges@example.com',
          whatsapp: c.phone,
          state: 'SP',
          cep: '13010-000',
          city: 'Campinas',
          neighborhood: 'Centro',
          address: 'Rua Conceição',
          number: '200',
          complement: 'Sala 2',
          operationAsset: 'R$ 5.000.000,00',
          operationTaxCredit: 'R$ 90.000,00',
          operationTaxPlanning: 'R$ 85.000,00',
        };
      }
    });
    return map;
  }, [clients]);

  const [profilesById, setProfilesById] = useState<Record<string, ClientProfile>>(initialProfilesById);

  const [likeById, setLikeById] = useState<Record<string, LikeStatus>>(() => {
    const obj: Record<string, LikeStatus> = {};
    clients.forEach((c) => {
      obj[c.id] = ['c2', 'c7', 'c8', 'c9'].includes(c.id) ? 'negative' : 'positive';
    });
    return obj;
  });

  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'select' | 'create'>('select');
  const [fullFlowVisible, setFullFlowVisible] = useState<boolean>(false);
  const [editProfileVisible, setEditProfileVisible] = useState<boolean>(false);
  const createContactRef = useRef<CreateContactRef | null>(null);

  const [isCreateValid, setIsCreateValid] = useState(false);

  useEffect(() => {
    try {
      clients.forEach((c) => {
        Asset.fromModule(c.photo).downloadAsync().catch(() => {});
      });
    } catch {}
  }, [clients]);

  const isBackDisabled = true;
  const isNextDisabled = useMemo(
    () => (
      activeTab === 'select'
        ? (selectedClient === null || likeById[selectedClient] !== 'positive')
        : !isCreateValid
    ),
    [activeTab, selectedClient, likeById, isCreateValid]
  );
  // Notifica rodapé unificado sobre possibilidade de prosseguir
  useEffect(() => {
    onCanProceedChange?.(!isNextDisabled);
  }, [isNextDisabled, onCanProceedChange]);
  // Registra handler do botão "Próximo" quando em modo embed
  useEffect(() => {
    if (!embedded || !registerNextHandler) return;
    registerNextHandler(() => {
      if (isNextDisabled) return;
      if (activeTab === 'create') {
        const payload = createContactRef.current?.validateAndGetPayload();
        if (payload) {
          setSelectedClient(payload.id || `new_${Date.now()}`);
          const summaryName = payload.name || payload.companyName || 'Novo contato';
          onUpdateSummary?.(1, summaryName);
          onNext?.();
        }
      } else {
        if (selectedClient !== null) {
          const found = clients.find((c) => c.id === selectedClient);
          if (found) onUpdateSummary?.(1, found.name);
          onNext?.();
        }
      }
    });
  }, [embedded, registerNextHandler, isNextDisabled, activeTab, selectedClient, clients, onNext, onUpdateSummary]);

  // Normalização para busca: remove acentos e compara em minúsculas; números só dígitos
  const normalizeText = (str: string) => str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
  const onlyDigits = (str: string) => str.replace(/\D/g, '');

  const filteredClients = useMemo(() => {
    const sText = normalizeText(search);
    const sDigits = onlyDigits(search);
    if (!sText && !sDigits) return clients;
    return clients.filter((c) => {
      const nameNorm = normalizeText(c.name);
      const phoneDigits = onlyDigits(c.phone);
      return (sText ? nameNorm.includes(sText) : false) || (sDigits ? phoneDigits.includes(sDigits) : false);
    });
  }, [search, clients]);

  const isProfileValid = (data: ClientProfile): boolean => {
    const addressOk = !!data.address && data.address.trim().length > 0;
    const numberOk = !!data.number && data.number.trim().length > 0;
    const parseCurrency = (s: string | null | undefined): number => {
      const cleaned = (s || '').replace(/^R\$\s?/, '').replace(/\./g, '').replace(',', '.');
      const n = parseFloat(cleaned);
      return isNaN(n) ? 0 : n;
    };
    const assetOk = parseCurrency(data.operationAsset) > 0;
    const creditOk = parseCurrency(data.operationTaxCredit) > 0;
    const planningOk = parseCurrency(data.operationTaxPlanning) > 0;
    return addressOk && numberOk && assetOk && creditOk && planningOk;
  };

  // Hidratar seleção do cliente a partir do resumo persistido quando a etapa abrir
  useEffect(() => {
    if (!visible) return;
    const persistedLabel = (summaries?.[1] ?? '').trim();
    if (persistedLabel && persistedLabel.toLowerCase() !== 'nenhum') {
      const found = clients.find((c) => c.name === persistedLabel);
      if (found) {
        setSelectedClient(found.id);
        onSelectClient?.({ id: found.id, photoKey: found.photoKey });
        // Resumo já está persistido pelo host; não reescreve
        return;
      }
    }
    // Fallback apenas quando não há dado persistido
    onSelectClient?.(null);
    onUpdateSummary?.(1, 'Nenhum');
  }, [visible, summaries, clients, onSelectClient, onUpdateSummary]);

  const handleSelectNone = () => {
    setSelectedClient(null);
    onSelectClient?.(null);
    onUpdateSummary?.(1, 'Nenhum');
  };

  const handleSelectClient = (id: string) => {
    setSelectedClient(id);
    const found = clients.find((c) => c.id === id);
    if (found) {
      onSelectClient?.({ id, photoKey: found.photoKey });
      onUpdateSummary?.(1, found.name);
    }
  };

  
  // Renderização apenas do conteúdo central quando embed=true (sem cabeçalho/rodapé)
  if (embedded) {
    return (
      <>
      <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
        <View style={styles.contentFlex}>
          {/* Bloco introdutório (ocupa largura máxima do modal) */}
          <View style={styles.introContainer}>
            {/* Título e subtítulo */}
            <View style={styles.centerBlock}>
              <Text style={styles.sectionTitle}>Clientes</Text>
              <Text style={styles.sectionSubtitle}>Selecione um cliente para continuar</Text>
            </View>

            {/* Indicador de passos (7 passos) */}
            <View style={styles.stepsRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.stepDot, i === 0 ? styles.stepDotActive : styles.stepDotInactive]} />
              ))}
            </View>
          </View>

          {/* Controle segmentado (Selecionar / Criar contato) */}
          <View style={styles.segmentedContainer}>
            <TouchableOpacity
              style={[styles.segmentedItem, styles.segmentedItemSelect, activeTab === 'select' ? styles.segmentedItemActive : styles.segmentedItemInactive, { marginRight: 2 }]}
              onPress={() => setActiveTab('select')}
              accessibilityRole="button"
              accessibilityLabel="Selecionar cliente"
              accessibilityState={{ selected: activeTab === 'select' }}
            >
              <View style={styles.segmentedLabelWrap}>
                <Text style={activeTab === 'select' ? styles.segmentedTextActive : styles.segmentedTextInactive}>Selecionar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentedItem, styles.segmentedItemCreate, activeTab === 'create' ? styles.segmentedItemActive : styles.segmentedItemInactive]}
              onPress={() => { setActiveTab('create'); onCreateContact?.(); }}
              accessibilityRole="button"
              accessibilityLabel="Criar contato"
              accessibilityState={{ selected: activeTab === 'create' }}
            >
              <View style={styles.segmentedLabelWrap}>
                <Text style={activeTab === 'create' ? styles.segmentedTextActive : styles.segmentedTextInactive}>Criar contato</Text>
              </View>
            </TouchableOpacity>
          </View>

          {activeTab === 'create' ? (
            <CreateContact
              ref={createContactRef}
              onSaved={(payload: CreateContactPayload) => {
                const newId = payload.id || `new_${Date.now()}`;
                setSelectedClient(newId);
                onSelectClient?.({ id: newId, photoUri: payload.photoUri ?? null });
              }}
              onValidityChange={(v: boolean) => setIsCreateValid(v)}
            />
          ) : (
            <>
              {/* Busca */}
              <View style={styles.searchRow}>
                <View style={styles.searchIconWrap}><SearchIcon /></View>
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={(text) => setSearch(capitalizeFirstLetter(text))}
                  placeholder="Pesquise por nome ou whatsapp"
                  placeholderTextColor="#91929E"
                  cursorColor="#1777CF"
                  selectionColor="#1777CF"
                />
              </View>

              {/* Nenhum */}
              <TouchableOpacity style={styles.noneRow} onPress={handleSelectNone} accessibilityRole="button" accessibilityLabel="Selecionar nenhum" activeOpacity={1}>
                <RadioIcon selected={selectedClient === null} />
                <Text style={styles.noneLabel}>Nenhum</Text>
              </TouchableOpacity>
              <View style={styles.listDivider} />

              {/* Lista de clientes */}
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                {filteredClients.map((c, idx) => (
                  <View key={c.id}>
                    <TouchableOpacity
                      style={styles.clientRow}
                      onPress={() => handleSelectClient(c.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar ${c.name}`}
                      activeOpacity={1}
                    >
                      <RadioIcon selected={selectedClient === c.id} />
                      <Image
                        source={c.photo}
                        style={styles.clientPhoto}
                        resizeMode="cover"
                        onError={(e) => {
                          try { console.log('[NewAppointment01] image error', c.photoKey || c.id, e?.nativeEvent); } catch {}
                        }}
                        onLoad={() => {
                          try { console.log('[NewAppointment01] image loaded', c.photoKey || c.id); } catch {}
                        }}
                      />
                      <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{c.name}</Text>
                        <Text style={styles.clientPhone}>{c.phone}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.likeContainer}
                        onPress={(e: any) => { e?.preventDefault?.(); e?.stopPropagation?.(); setEditingClientId(c.id); setEditProfileVisible(true); }}
                        accessibilityLabel="Editar perfil"
                      >
                        {likeById[c.id] === 'positive' ? <LikePositiveIcon /> : <LikeNegativeIcon />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {idx < filteredClients.length - 1 ? <View style={styles.listDivider} /> : null}
                  </View>
                ))}
              </ScrollView>
          </>
        )}
        </View>
      </SlideInView>
      <EditProfileModal
        visible={editProfileVisible}
        onClose={() => setEditProfileVisible(false)}
        initialData={editingClientId ? profilesById[editingClientId] : undefined}
        onLikeStatusChange={(status) => {
          if (!editingClientId) return;
          setLikeById((prev) => ({ ...prev, [editingClientId]: status }));
        }}
        onSave={(payload) => {
          if (!editingClientId) return;
          setProfilesById((prev) => ({ ...prev, [editingClientId]: payload as ClientProfile }));
          const valid = isProfileValid(payload as ClientProfile);
          setLikeById((prev) => ({ ...prev, [editingClientId]: valid ? 'positive' : 'negative' }));
        }}
      />
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

          {/* Conteúdo central (ocupa o espaço disponível para manter o footer ancorado ao rodapé) */}
          <SlideInView visible={visible} direction={transitionDirection} style={{ alignSelf: 'stretch', flex: 1 }}>
          <View style={styles.contentFlex}>
          {/* Bloco introdutório (ocupa largura máxima do modal) */}
          <View style={styles.introContainer}>
            {/* Título e subtítulo */}
            <View style={styles.centerBlock}>
              <Text style={styles.sectionTitle}>Clientes</Text>
              <Text style={styles.sectionSubtitle}>Selecione um cliente para continuar</Text>
            </View>

            {/* Indicador de passos (7 passos) */}
            <View style={styles.stepsRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.stepDot, i === 0 ? styles.stepDotActive : styles.stepDotInactive]} />
              ))}
            </View>
          </View>


          {/* Controle segmentado (Selecionar / Criar contato) */}
          <View
            style={styles.segmentedContainer}
            onLayout={(e) => {
              if (__DEV__) {
                const { width } = e.nativeEvent.layout;
                console.log('[NewAppointment01] segmentedContainer width=', width);
              }
            }}
          >
            <TouchableOpacity
              style={[
                styles.segmentedItem,
                styles.segmentedItemSelect,
                activeTab === 'select' ? styles.segmentedItemActive : styles.segmentedItemInactive,
                { marginRight: 2 },
              ]}
              onPress={() => setActiveTab('select')}
              accessibilityRole="button"
              accessibilityLabel="Selecionar cliente"
              accessibilityState={{ selected: activeTab === 'select' }}
              onLayout={(e) => {
                if (__DEV__) {
                  const { width } = e.nativeEvent.layout;
                  console.log('[NewAppointment01] segmentedSelect width=', width);
                }
              }}
            >
              <View style={styles.segmentedLabelWrap}>
                <Text style={activeTab === 'select' ? styles.segmentedTextActive : styles.segmentedTextInactive}>Selecionar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentedItem,
                styles.segmentedItemCreate,
                activeTab === 'create' ? styles.segmentedItemActive : styles.segmentedItemInactive,
              ]}
              onPress={() => { setActiveTab('create'); onCreateContact?.(); }}
              accessibilityRole="button"
              accessibilityLabel="Criar contato"
              accessibilityState={{ selected: activeTab === 'create' }}
              onLayout={(e) => {
                if (__DEV__) {
                  const { width } = e.nativeEvent.layout;
                  console.log('[NewAppointment01] segmentedCreate width=', width);
                }
              }}
            >
              <View style={styles.segmentedLabelWrap}>
                <Text style={activeTab === 'create' ? styles.segmentedTextActive : styles.segmentedTextInactive}>Criar contato</Text>
              </View>
            </TouchableOpacity>
          </View>

          {activeTab === 'create' ? (
            <CreateContact
              ref={createContactRef}
              onSaved={(payload: CreateContactPayload) => {
                setSelectedClient(payload.id || `new_${Date.now()}`);
              }}
              onValidityChange={(v: boolean) => setIsCreateValid(v)}
            />
          ) : (
            <>
              {/* Busca */}
              <View style={styles.searchRow}>
                <View style={styles.searchIconWrap}><SearchIcon /></View>
                <TextInput
                  style={styles.searchInput}
                  value={search}
                  onChangeText={(text) => setSearch(capitalizeFirstLetter(text))}
                  placeholder="Pesquise por nome ou whatsapp"
                  placeholderTextColor="#91929E"
                  cursorColor="#1777CF"
                  selectionColor="#1777CF"
                />
              </View>

              {/* Nenhum */}
              <TouchableOpacity
                style={styles.noneRow}
                onPress={handleSelectNone}
                accessibilityRole="button"
                accessibilityLabel="Selecionar nenhum"
                activeOpacity={1}
              >
                <RadioIcon selected={selectedClient === null} />
                <Text style={styles.noneLabel}>Nenhum</Text>
              </TouchableOpacity>
              <View style={styles.listDivider} />

              {/* Lista de clientes */}
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                {filteredClients.map((c, idx) => (
                  <View key={c.id}>
                    <TouchableOpacity
                      style={styles.clientRow}
                      onPress={() => handleSelectClient(c.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar ${c.name}`}
                      activeOpacity={1}
                    >
                      <RadioIcon selected={selectedClient === c.id} />
                      <Image
                        source={c.photo}
                        style={styles.clientPhoto}
                        resizeMode="cover"
                        onError={(e) => {
                          try { console.log('[NewAppointment01] image error', c.photoKey || c.id, e?.nativeEvent); } catch {}
                        }}
                        onLoad={() => {
                          try { console.log('[NewAppointment01] image loaded', c.photoKey || c.id); } catch {}
                        }}
                      />
                      <View style={styles.clientInfo}>
                        <Text style={styles.clientName}>{c.name}</Text>
                        <Text style={styles.clientPhone}>{c.phone}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.likeContainer}
                        onPress={(e: any) => { e?.preventDefault?.(); e?.stopPropagation?.(); setEditingClientId(c.id); setEditProfileVisible(true); }}
                        accessibilityLabel="Editar perfil"
                      >
                        {likeById[c.id] === 'positive' ? <LikePositiveIcon /> : <LikeNegativeIcon />}
                      </TouchableOpacity>
                    </TouchableOpacity>
                    {idx < filteredClients.length - 1 ? <View style={styles.listDivider} /> : null}
                  </View>
                ))}
              </ScrollView>
            </>
          )}
          </View>
          </SlideInView>

          {/* Rodapé */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={[styles.footerButton, isBackDisabled && styles.footerButtonDisabled]}
              onPress={onClose}
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
                if (activeTab === 'create') {
                  const payload = createContactRef.current?.validateAndGetPayload();
                  if (payload) {
                    setSelectedClient(payload.id || `new_${Date.now()}`);
                    console.log('[NewAppointment01] Próximo (create): válido, avançando para Produtos');
                    const summaryName = payload.name || payload.companyName || 'Novo contato';
                    onUpdateSummary?.(1, summaryName);
                    const newId = payload.id || `new_${Date.now()}`;
                    onSelectClient?.({ id: newId, photoUri: payload.photoUri ?? null });
                    // Avança para a próxima etapa
                    onNext?.();
                  }
                } else {
                  if (selectedClient !== null && likeById[selectedClient] === 'positive') {
                    console.log('[NewAppointment01] Próximo (select): cliente=', selectedClient);
                    const found = clients.find((c) => c.id === selectedClient);
                    if (found) onUpdateSummary?.(1, found.name);
                    if (found) onSelectClient?.({ id: found.id, photoKey: found.photoKey });
                    onNext?.();
                  }
                }
              }}
            >
              <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    <EditProfileModal
      visible={editProfileVisible}
      onClose={() => setEditProfileVisible(false)}
      initialData={editingClientId ? profilesById[editingClientId] : undefined}
      onLikeStatusChange={(status) => {
        if (!editingClientId) return;
        setLikeById((prev) => ({ ...prev, [editingClientId]: status }));
      }}
      onSave={(payload) => {
        if (!editingClientId) return;
        setProfilesById((prev) => ({ ...prev, [editingClientId]: payload as ClientProfile }));
        const valid = isProfileValid(payload as ClientProfile);
        setLikeById((prev) => ({ ...prev, [editingClientId]: valid ? 'positive' : 'negative' }));
        setEditProfileVisible(false);
      }}
    />
    <FullFlow visible={fullFlowVisible} onClose={() => setFullFlowVisible(false)} currentStep={1} summaries={summaries} onSelectStep={onSelectStep} maxAccessibleStep={maxAccessibleStep} />
    </>
  );
};

const styles = StyleSheet.create({
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
    gap: 8,
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
    gap: 8,
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
  // Container do controle segmentado: largura total para evitar colapso no web.
  // Notas: RN Web pode ignorar flex dos filhos se o pai não tiver largura explícita.
  segmentedContainer: {
    height: 40,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    alignSelf: 'stretch',
    width: '100%',
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Item do segmento: garantir display flex no web para respeitar flex e centralização.
  segmentedItem: {
    height: 32,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ display: 'flex' } as any) : {}),
  },
  // Wrapper do texto: largura 100% garante que o texto ocupe o centro do botão
  // sem clipping; útil especialmente no React Native Web.
  segmentedLabelWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? ({ display: 'flex' } as any) : {}),
  },
  segmentedItemSelect: {
    flex: 1,
    minWidth: 120,
    paddingHorizontal: 12,
    ...(Platform.OS === 'web' ? ({ width: '50%' } as any) : {}),
  },
  segmentedItemCreate: {
    flex: 1,
    minWidth: 120,
    paddingHorizontal: 12,
    ...(Platform.OS === 'web' ? ({ width: '50%' } as any) : {}),
  },
  segmentedItemActive: {
    backgroundColor: '#1777CF',
  },
  segmentedItemInactive: {
    backgroundColor: 'transparent',
  },
  segmentedTextActive: {
    color: '#FCFCFC',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as any) : {}),
  },
  segmentedTextInactive: {
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    textAlign: 'center',
    ...(Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as any) : {}),
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E0F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 14,
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
    gap: 10,
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
  clientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  clientPhoto: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F4F4F4',
  },
  clientInfo: {
    flex: 1,
  },
  likeContainer: {
    width: 39,
    height: 39,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 14,
    color: '#3A3F51',
    fontFamily: 'Inter_500Medium',
  },
  clientPhone: {
    fontSize: 12,
    color: '#91929E',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginTop: 10,
    
  },
  footerButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F4F4F4',
    borderWidth: 1,
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

export default NewAppointment01;
