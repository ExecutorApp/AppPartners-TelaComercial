import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Svg, Path, Rect, G, Defs, ClipPath } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import {
  UF_LIST,
  formatNameInput,
  maskCPF,
  isValidCPF,
  isValidCNPJ,
  sanitizeEmail,
  isValidEmail,
  maskWhatsApp,
  validateWhatsApp,
  maskCEP,
  isValidCEP,
  sanitizeCityNeighborhood,
  sanitizeAddress,
  sanitizeNumberField,
  sanitizeComplement,
  capitalizeFirstLetterLive,
  formatNameFirstWordOnly,
} from '../../utils/validators';
import { useKeyman } from '../../context/KeymanContext';
import ModalAlertLeaveKeyman from './3.2.InformationGroup-SalesFlow-Activities-Commercial-RegisterKeyman-ModalExit';

// ========================================
// CORES DO TEMA
// ========================================
const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  textTertiary: '#91929E', //...Cor do texto terciario
  labelText: '#64748B', //......Cor do label
  background: '#F4F4F4', //....Cor de fundo
  white: '#FCFCFC', //.........Cor branca
  border: '#D8E0F0', //........Cor da borda
  inputBorder: '#CBD5E1', //...Cor da borda do input
};

// Avatar padrao
const DEFAULT_AVATAR = require('../../../assets/AvatarPlaceholder02.png');

// ========================================
// ICONES SVG
// ========================================

// Icone Fechar (X)
const CloseIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <Path
      d="M1 1L13 13M13 1L1 13"
      stroke={COLORS.textSecondary}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

// Icone Chevron Down (Dropdown)
const ChevronDownIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 10l5 5 5-5"
      stroke="#7D8592"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Limpar (X pequeno)
const ClearIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke="#7D8592"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Camera (Foto)
const CameraIcon = () => (
  <Svg width="25" height="24" viewBox="0 0 26 24" fill="none">
    <Rect x="0" y="0" width="26" height="24" rx="12" fill={COLORS.border} />
    <Rect
      x="0.1"
      y="0.1"
      width="25.8"
      height="23.8"
      rx="11.9"
      stroke={COLORS.border}
      strokeWidth="0.2"
    />
    <G transform="translate(-4 -4)">
      <Path
        d="M24.0455 11.0571H21.5255C21.4057 11.0571 21.2878 11.0292 21.1823 10.9759C21.0767 10.9226 20.9868 10.8456 20.9204 10.7517L20.1135 9.61063C19.9806 9.42279 19.8007 9.26878 19.5896 9.16226C19.3784 9.05574 19.1427 9 18.9033 9H16.0967C15.8573 9 15.6216 9.05574 15.4104 9.16226C15.1993 9.26878 15.0194 9.42279 14.8865 9.61063L14.0796 10.7517C14.0132 10.8456 13.9233 10.9226 13.8177 10.9759C13.7122 11.0292 13.5943 11.0571 13.4745 11.0571H13.1364V10.7143C13.1364 10.6234 13.0981 10.5361 13.0299 10.4718C12.9617 10.4076 12.8692 10.3714 12.7727 10.3714H11.6818C11.5854 10.3714 11.4929 10.4076 11.4247 10.4718C11.3565 10.5361 11.3182 10.6234 11.3182 10.7143V11.0571H10.9545C10.5688 11.0571 10.1988 11.2016 9.92603 11.4588C9.65325 11.716 9.5 12.0648 9.5 12.4286V19.6286C9.5 19.9923 9.65325 20.3411 9.92603 20.5983C10.1988 20.8555 10.5688 21 10.9545 21H24.0455C24.4312 21 24.8012 20.8555 25.074 20.5983C25.3468 20.3411 25.5 19.9923 25.5 19.6286V12.4286C25.5 12.0648 25.3468 11.716 25.074 11.4588C24.8012 11.2016 24.4312 11.0571 24.0455 11.0571ZM17.5 19.6286C16.6729 19.6286 15.8644 19.3973 15.1767 18.9641C14.489 18.5308 13.953 17.915 13.6365 17.1946C13.32 16.4741 13.2372 15.6813 13.3985 14.9165C13.5599 14.1517 13.9582 13.4491 14.543 12.8977C15.1278 12.3463 15.873 11.9708 16.6842 11.8186C17.4954 11.6665 18.3362 11.7446 19.1003 12.043C19.8644 12.3414 20.5176 12.8468 20.9771 13.4952C21.4366 14.1436 21.6818 14.9059 21.6818 15.6857C21.6818 16.7314 21.2412 17.7343 20.457 18.4737C19.6727 19.2132 18.6091 19.6286 17.5 19.6286Z"
        fill={COLORS.textPrimary}
      />
      <Path
        d="M17.5 13.1143C16.9606 13.1143 16.4333 13.2651 15.9848 13.5476C15.5363 13.8302 15.1867 14.2318 14.9803 14.7017C14.7739 15.1715 14.7199 15.6886 14.8251 16.1874C14.9304 16.6862 15.1901 17.1444 15.5715 17.504C15.9529 17.8636 16.4389 18.1085 16.9679 18.2077C17.497 18.307 18.0453 18.256 18.5437 18.0614C19.042 17.8668 19.468 17.5372 19.7676 17.1143C20.0673 16.6915 20.2273 16.1943 20.2273 15.6857C20.2273 15.0037 19.9399 14.3497 19.4285 13.8674C18.917 13.3852 18.2233 13.1143 17.5 13.1143ZM17.5 17.2286C17.0662 17.2281 16.6502 17.0654 16.3434 16.7762C16.0367 16.4869 15.8641 16.0948 15.8636 15.6857C15.8636 15.5948 15.9019 15.5076 15.9701 15.4433C16.0383 15.379 16.1308 15.3429 16.2273 15.3429C16.3237 15.3429 16.4162 15.379 16.4844 15.4433C16.5526 15.5076 16.5909 15.5948 16.5909 15.6857C16.5909 15.913 16.6867 16.1311 16.8572 16.2918C17.0277 16.4526 17.2589 16.5429 17.5 16.5429C17.5964 16.5429 17.6889 16.579 17.7571 16.6433C17.8253 16.7076 17.8636 16.7948 17.8636 16.8857C17.8636 16.9766 17.8253 17.0639 17.7571 17.1282C17.6889 17.1924 17.5964 17.2286 17.5 17.2286Z"
        fill={COLORS.textPrimary}
      />
    </G>
  </Svg>
);

// Icone Radio Selecionado
const RadioSelectedIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip0)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
        fill={COLORS.primary}
      />
      <Rect x="5" y="5" width="10" height="10" rx="5" fill={COLORS.primary} />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width="20" height="20" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

// Icone Radio Nao Selecionado
const RadioUnselectedIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <G clipPath="url(#clip1)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
        fill="#6F7DA0"
        stroke={COLORS.white}
      />
    </G>
    <Defs>
      <ClipPath id="clip1">
        <Rect width="20" height="20" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

// ========================================
// TIPOS
// ========================================

// Tipo de pessoa
type PersonType = 'fisica' | 'juridica';

// Dados do formulario
interface KeymanFormData {
  nome: string; //..............Nome completo ou Razao Social
  cpfCnpj: string; //..........CPF ou CNPJ
  nomeResponsavel: string; //..Nome do responsavel (juridica)
  cpfResponsavel: string; //...CPF do responsavel (juridica)
  email: string; //............Email
  whatsapp: string; //.........WhatsApp
  estado: string; //...........Estado
  cep: string; //...............CEP
  cidade: string; //...........Cidade
  bairro: string; //...........Bairro
  endereco: string; //.........Endereco
  numero: string; //...........Numero
  complemento: string; //......Complemento
}

// Props do componente
type Props = {
  visible: boolean; //..................Visibilidade do modal
  onClose: () => void; //...............Callback de fechamento
  onSave: (data: KeymanFormData) => void; //..Callback de salvar
};

// ========================================
// FUNCOES AUXILIARES
// ========================================

// Mascara CNPJ
function maskCNPJ(input: string): string {
  const digits = (input || '').replace(/\D+/g, '').slice(0, 14);
  const p1 = digits.slice(0, 2);
  const p2 = digits.slice(2, 5);
  const p3 = digits.slice(5, 8);
  const p4 = digits.slice(8, 12);
  const p5 = digits.slice(12, 14);
  let out = p1;
  if (p2) out += (out ? '.' : '') + p2;
  if (p3) out += (out ? '.' : '') + p3;
  if (p4) out += '/' + p4;
  if (p5) out += '-' + p5;
  return out;
}

// Placeholder por campo
const getPlaceholder = (field: keyof KeymanFormData, personType: PersonType): string => {
  if (field === 'nome') return personType === 'fisica' ? 'Nome completo' : 'Razão social';
  if (field === 'cpfCnpj') return personType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00';
  if (field === 'email') return 'Email@teste.com';
  if (field === 'whatsapp') return '(00) 00000-0000';
  if (field === 'estado') return 'Selecione';
  if (field === 'cep') return '00000-000';
  if (field === 'cidade') return 'Digite o nome da sua cidade';
  if (field === 'bairro') return 'Digite o nome do seu bairro';
  if (field === 'endereco') return 'Digite seu endereço';
  if (field === 'numero') return 'Número';
  if (field === 'complemento') return 'Ex: bloco A, sala 10';
  return '';
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const RegisterKeymanModal: React.FC<Props> = ({ visible, onClose, onSave }) => {
  // Hook do contexto global de keymans
  const { addKeyman } = useKeyman();

  // Estado do tipo de pessoa
  const [personType, setPersonType] = useState<PersonType>('fisica');

  // Estado da foto selecionada
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Estado do formulario
  const [formData, setFormData] = useState<KeymanFormData>({
    nome: '',
    cpfCnpj: '',
    nomeResponsavel: '',
    cpfResponsavel: '',
    email: '',
    whatsapp: '',
    estado: '',
    cep: '',
    cidade: '',
    bairro: '',
    endereco: '',
    numero: '',
    complemento: '',
  });

  // Estado de foco
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Estado de erros
  const [errors, setErrors] = useState<Partial<Record<keyof KeymanFormData, string>>>({});

  // Estado de touched
  const [touched, setTouched] = useState<{ [key in keyof KeymanFormData]?: boolean }>({});

  // Referencias dos inputs
  const inputRefs = useRef<Partial<Record<keyof KeymanFormData, TextInput | null>>>({});

  // Estado do dropdown de estado
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  // Estado do modal de confirmacao de saida
  const [confirmExitVisible, setConfirmExitVisible] = useState(false);

  // Lista de estados brasileiros
  const BRAZIL_STATES = useMemo(
    () => [
      'AC - Acre',
      'AL - Alagoas',
      'AP - Amapá',
      'AM - Amazonas',
      'BA - Bahia',
      'CE - Ceará',
      'DF - Distrito Federal',
      'ES - Espírito Santo',
      'GO - Goiás',
      'MA - Maranhão',
      'MT - Mato Grosso',
      'MS - Mato Grosso do Sul',
      'MG - Minas Gerais',
      'PA - Pará',
      'PB - Paraíba',
      'PR - Paraná',
      'PE - Pernambuco',
      'PI - Piauí',
      'RJ - Rio de Janeiro',
      'RN - Rio Grande do Norte',
      'RS - Rio Grande do Sul',
      'RO - Rondônia',
      'RR - Roraima',
      'SC - Santa Catarina',
      'SP - São Paulo',
      'SE - Sergipe',
      'TO - Tocantins',
    ],
    []
  );

  // Mapa UF -> Nome completo
  const UF_NAME_MAP = useMemo(() => {
    return BRAZIL_STATES.reduce(
      (acc, label) => {
        const [uf] = label.split(' - ');
        acc[uf] = label;
        return acc;
      },
      {} as Record<string, string>
    );
  }, [BRAZIL_STATES]);

  // Filtra estados pela busca
  const filteredStates = useMemo(() => {
    const normalizeText = (str: string) =>
      (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    const q = normalizeText(stateSearch);
    return BRAZIL_STATES.filter((s) => normalizeText(s).includes(q));
  }, [BRAZIL_STATES, stateSearch]);

  // Animacao do chevron
  const chevronAnim = useRef(new Animated.Value(0)).current;
  const chevronRotate = chevronAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  // Atualiza animacao do chevron
  useEffect(() => {
    Animated.timing(chevronAnim, {
      toValue: stateDropdownOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [stateDropdownOpen]);

  // Reseta formulario ao fechar
  useEffect(() => {
    if (!visible) {
      setFormData({
        nome: '',
        cpfCnpj: '',
        nomeResponsavel: '',
        cpfResponsavel: '',
        email: '',
        whatsapp: '',
        estado: '',
        cep: '',
        cidade: '',
        bairro: '',
        endereco: '',
        numero: '',
        complemento: '',
      });
      setErrors({});
      setTouched({});
      setPersonType('fisica');
      setSelectedImage(null);
    }
  }, [visible]);

  // Atualiza campo do formulario
  const updateField = (field: keyof KeymanFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Aplica valor formatado ao campo
  const applyFieldValue = (field: keyof KeymanFormData, value: string) => {
    if (field === 'nome') {
      // Remove numeros do nome
      const withoutNumbers = value.replace(/[0-9]/g, '');
      const formatted = formatNameFirstWordOnly(withoutNumbers);
      updateField('nome', formatted);
      const valid = formatted.trim().split(/\s+/).filter(Boolean).length >= 2;
      setErrors({ ...errors, nome: valid ? undefined : 'Informe nome completo.' });
      return;
    }

    if (field === 'nomeResponsavel') {
      // Remove numeros do nome do responsavel
      const withoutNumbers = value.replace(/[0-9]/g, '');
      const formatted = formatNameFirstWordOnly(withoutNumbers);
      updateField('nomeResponsavel', formatted);
      return;
    }

    if (field === 'cpfCnpj') {
      if (personType === 'fisica') {
        const masked = maskCPF(value);
        updateField('cpfCnpj', masked);
        const valid = isValidCPF(masked) || masked.replace(/\D/g, '').length < 11;
        setErrors({ ...errors, cpfCnpj: valid ? undefined : 'CPF inválido.' });
      } else {
        const masked = maskCNPJ(value);
        updateField('cpfCnpj', masked);
        const valid = isValidCNPJ(masked) || masked.replace(/\D/g, '').length < 14;
        setErrors({ ...errors, cpfCnpj: valid ? undefined : 'CNPJ inválido.' });
      }
      return;
    }

    if (field === 'email') {
      const sanitized = sanitizeEmail(value);
      updateField('email', sanitized);
      const valid = isValidEmail(sanitized) || !sanitized;
      setErrors({ ...errors, email: valid ? undefined : 'Email inválido.' });
      return;
    }

    if (field === 'whatsapp') {
      const masked = maskWhatsApp(value);
      updateField('whatsapp', masked);
      const valid = validateWhatsApp(masked).valid || masked.replace(/\D/g, '').length < 11;
      setErrors({ ...errors, whatsapp: valid ? undefined : 'WhatsApp inválido.' });
      return;
    }

    if (field === 'cep') {
      const masked = maskCEP(value);
      updateField('cep', masked);
      const valid = isValidCEP(masked) || masked.length < 9;
      setErrors({ ...errors, cep: valid ? undefined : 'CEP inválido.' });
      return;
    }

    if (field === 'cidade' || field === 'bairro') {
      const sanitized = sanitizeCityNeighborhood(value);
      const cleaned = capitalizeFirstLetterLive(sanitized);
      updateField(field, cleaned);
      return;
    }

    if (field === 'endereco') {
      const sanitized = sanitizeAddress(value);
      const cleaned = capitalizeFirstLetterLive(sanitized);
      updateField(field, cleaned);
      return;
    }

    if (field === 'numero') {
      const cleaned = sanitizeNumberField(value, 6);
      updateField(field, cleaned);
      return;
    }

    if (field === 'complemento') {
      const sanitized = sanitizeComplement(value);
      const cleaned = capitalizeFirstLetterLive(sanitized);
      updateField(field, cleaned);
      return;
    }

    updateField(field, value);
  };

  // Renderiza botao limpar input
  const renderClearButton = (field: keyof KeymanFormData, value: string) => {
    if (!value) return null;
    return (
      <TouchableOpacity
        style={styles.inputClearButton}
        onPress={() => updateField(field, '')}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <ClearIcon />
      </TouchableOpacity>
    );
  };

  // Valida formulario antes de salvar
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof KeymanFormData, string>> = {};

    // Valida nome (obrigatorio e nome completo)
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório.';
    } else if (formData.nome.trim().split(/\s+/).filter(Boolean).length < 2) {
      newErrors.nome = 'Informe nome completo.';
    }

    // Valida CPF/CNPJ (obrigatorio)
    if (!formData.cpfCnpj.trim()) {
      newErrors.cpfCnpj = personType === 'fisica' ? 'CPF é obrigatório.' : 'CNPJ é obrigatório.';
    }

    // Valida Email (obrigatorio)
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório.';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email inválido.';
    }

    // Valida WhatsApp (obrigatorio)
    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório.';
    } else if (!validateWhatsApp(formData.whatsapp).valid) {
      newErrors.whatsapp = 'WhatsApp inválido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salva cadastro
  const handleSave = () => {
    // Marca todos os campos obrigatorios como touched
    setTouched({
      ...touched,
      nome: true,
      cpfCnpj: true,
      email: true,
      whatsapp: true,
    });

    if (validateForm()) {
      // Adiciona keyman ao contexto global
      addKeyman({
        name: formData.nome,
        photo: selectedImage,
        contacts: 0,
        conversions: 0,
        rank: 0,
        cpfCnpj: formData.cpfCnpj,
        email: formData.email,
        whatsapp: formData.whatsapp,
        estado: formData.estado,
        cep: formData.cep,
        cidade: formData.cidade,
        bairro: formData.bairro,
        endereco: formData.endereco,
        numero: formData.numero,
        complemento: formData.complemento,
        personType: personType,
        nomeResponsavel: formData.nomeResponsavel,
        cpfResponsavel: formData.cpfResponsavel,
      });

      // Callback para checklist
      onSave(formData);
      onClose();
    }
  };

  // Abre seletor de imagem
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Handler para confirmar saida
  const handleConfirmExit = () => {
    setConfirmExitVisible(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* Overlay escurecido */}
      <View style={styles.overlay}>
        {/* Container do Modal */}
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            {/* Titulo */}
            <Text style={styles.headerTitle}>Cadastrar Keyman</Text>

            {/* Botao Fechar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setConfirmExitVisible(true)}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Divisor */}
          <View style={styles.headerDivider} />

          {/* Conteudo Scrollavel */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Secao Foto e Tipo de Pessoa */}
            <View style={styles.photoTypeSection}>
              {/* Foto */}
              <View style={styles.photoContainer}>
                <Image
                  source={selectedImage ? { uri: selectedImage } : DEFAULT_AVATAR}
                  style={styles.profilePhoto}
                />
                <TouchableOpacity
                  style={styles.cameraButton}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <CameraIcon />
                </TouchableOpacity>
              </View>

              {/* Tipo de Pessoa */}
              <View style={styles.personTypeContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    setPersonType('fisica');
                    updateField('cpfCnpj', '');
                  }}
                >
                  {personType === 'fisica' ? <RadioSelectedIcon /> : <RadioUnselectedIcon />}
                  <Text style={styles.radioLabel}>Física</Text>
                </TouchableOpacity>

                <View style={styles.radioOptionDivider} />

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => {
                    setPersonType('juridica');
                    updateField('cpfCnpj', '');
                  }}
                >
                  {personType === 'juridica' ? <RadioSelectedIcon /> : <RadioUnselectedIcon />}
                  <Text style={styles.radioLabel}>Jurídica</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Secao Dados Pessoais */}
            <View style={[styles.sectionContainer, styles.sectionDadosPessoais]}>
              <Text style={styles.sectionTitle}>Dados pessoais:</Text>

              {/* Nome */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>
                    {personType === 'fisica' ? 'Nome Completo *' : 'Razão Social *'}
                  </Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'nome' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.nome = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.nome}
                    onChangeText={(value) => applyFieldValue('nome', value)}
                    onFocus={() => setFocusedField('nome')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, nome: true });
                    }}
                    placeholder={getPlaceholder('nome', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('nome', formData.nome)}
                </View>
                {errors.nome && touched.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
              </View>

              {/* CPF/CNPJ */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>
                    {personType === 'fisica' ? 'CPF *' : 'CNPJ *'}
                  </Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'cpfCnpj' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.cpfCnpj = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.cpfCnpj}
                    onChangeText={(value) => applyFieldValue('cpfCnpj', value)}
                    onFocus={() => setFocusedField('cpfCnpj')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, cpfCnpj: true });
                    }}
                    placeholder={getPlaceholder('cpfCnpj', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="numeric"
                    maxLength={personType === 'fisica' ? 14 : 18}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('cpfCnpj', formData.cpfCnpj)}
                </View>
                {errors.cpfCnpj && touched.cpfCnpj && (
                  <Text style={styles.errorText}>{errors.cpfCnpj}</Text>
                )}
              </View>

              {/* Nome do Responsavel - Apenas Juridica */}
              {personType === 'juridica' && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.inputLabel}>Nome do Responsável</Text>
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === 'nomeResponsavel' && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      ref={(r) => {
                        inputRefs.current.nomeResponsavel = r;
                      }}
                      style={[styles.input, styles.inputWithClear]}
                      value={formData.nomeResponsavel}
                      onChangeText={(value) => applyFieldValue('nomeResponsavel', value)}
                      onFocus={() => setFocusedField('nomeResponsavel')}
                      onBlur={() => {
                        setFocusedField(null);
                        setTouched({ ...touched, nomeResponsavel: true });
                      }}
                      placeholder="Nome completo do responsável"
                      placeholderTextColor={COLORS.textTertiary}
                      selectionColor={COLORS.primary}
                      cursorColor={COLORS.primary}
                    />
                    {renderClearButton('nomeResponsavel', formData.nomeResponsavel)}
                  </View>
                </View>
              )}

              {/* CPF do Responsavel - Apenas Juridica */}
              {personType === 'juridica' && (
                <View style={styles.inputGroup}>
                  <View style={styles.labelContainer}>
                    <Text style={styles.inputLabel}>CPF do Responsável</Text>
                  </View>
                  <View
                    style={[
                      styles.inputContainer,
                      focusedField === 'cpfResponsavel' && styles.inputFocused,
                    ]}
                  >
                    <TextInput
                      ref={(r) => {
                        inputRefs.current.cpfResponsavel = r;
                      }}
                      style={[styles.input, styles.inputWithClear]}
                      value={formData.cpfResponsavel}
                      onChangeText={(value) => {
                        const masked = maskCPF(value);
                        updateField('cpfResponsavel', masked);
                      }}
                      onFocus={() => setFocusedField('cpfResponsavel')}
                      onBlur={() => {
                        setFocusedField(null);
                        setTouched({ ...touched, cpfResponsavel: true });
                      }}
                      placeholder="000.000.000-00"
                      placeholderTextColor={COLORS.textTertiary}
                      keyboardType="numeric"
                      maxLength={14}
                      selectionColor={COLORS.primary}
                      cursorColor={COLORS.primary}
                    />
                    {renderClearButton('cpfResponsavel', formData.cpfResponsavel)}
                  </View>
                </View>
              )}

              {/* Email */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Email *</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'email' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.email = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.email}
                    onChangeText={(value) => applyFieldValue('email', value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, email: true });
                    }}
                    placeholder={getPlaceholder('email', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('email', formData.email)}
                </View>
                {errors.email && touched.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* WhatsApp */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>WhatsApp *</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'whatsapp' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.whatsapp = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.whatsapp}
                    onChangeText={(value) => applyFieldValue('whatsapp', value)}
                    onFocus={() => setFocusedField('whatsapp')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, whatsapp: true });
                    }}
                    placeholder={getPlaceholder('whatsapp', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="phone-pad"
                    maxLength={15}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('whatsapp', formData.whatsapp)}
                </View>
                {errors.whatsapp && touched.whatsapp && (
                  <Text style={styles.errorText}>{errors.whatsapp}</Text>
                )}
              </View>
            </View>

            {/* Secao Localizacao */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Localização:</Text>

              {/* Estado */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Estado</Text>
                </View>
                <TouchableOpacity
                  style={[styles.inputContainer, focusedField === 'estado' && styles.inputFocused]}
                  onPress={() => setStateDropdownOpen(true)}
                  activeOpacity={0.7}
                >
                  <View style={styles.stateSelectRow}>
                    <Text
                      style={[
                        styles.dropdownText,
                        !formData.estado && styles.placeholderText,
                      ]}
                    >
                      {formData.estado
                        ? UF_NAME_MAP[formData.estado] || formData.estado
                        : getPlaceholder('estado', personType)}
                    </Text>
                    <Animated.View
                      style={[styles.dropdownChevron, { transform: [{ rotate: chevronRotate }] }]}
                    >
                      <ChevronDownIcon />
                    </Animated.View>
                  </View>
                </TouchableOpacity>
              </View>

              {/* CEP */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>CEP</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'cep' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.cep = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.cep}
                    onChangeText={(value) => applyFieldValue('cep', value)}
                    onFocus={() => setFocusedField('cep')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, cep: true });
                    }}
                    placeholder={getPlaceholder('cep', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="numeric"
                    maxLength={9}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('cep', formData.cep)}
                </View>
                {errors.cep && touched.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
              </View>

              {/* Cidade */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Cidade</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'cidade' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.cidade = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.cidade}
                    onChangeText={(value) => applyFieldValue('cidade', value)}
                    onFocus={() => setFocusedField('cidade')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, cidade: true });
                    }}
                    placeholder={getPlaceholder('cidade', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('cidade', formData.cidade)}
                </View>
              </View>

              {/* Bairro */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Bairro</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'bairro' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.bairro = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.bairro}
                    onChangeText={(value) => applyFieldValue('bairro', value)}
                    onFocus={() => setFocusedField('bairro')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, bairro: true });
                    }}
                    placeholder={getPlaceholder('bairro', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('bairro', formData.bairro)}
                </View>
              </View>

              {/* Endereco */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Endereço</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'endereco' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.endereco = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.endereco}
                    onChangeText={(value) => applyFieldValue('endereco', value)}
                    onFocus={() => setFocusedField('endereco')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, endereco: true });
                    }}
                    placeholder={getPlaceholder('endereco', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('endereco', formData.endereco)}
                </View>
              </View>

              {/* Numero */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Número</Text>
                </View>
                <View
                  style={[styles.inputContainer, focusedField === 'numero' && styles.inputFocused]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.numero = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.numero}
                    onChangeText={(value) => applyFieldValue('numero', value)}
                    onFocus={() => setFocusedField('numero')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, numero: true });
                    }}
                    placeholder={getPlaceholder('numero', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    keyboardType="numeric"
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('numero', formData.numero)}
                </View>
              </View>

              {/* Complemento */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Text style={styles.inputLabel}>Complemento</Text>
                </View>
                <View
                  style={[
                    styles.inputContainer,
                    focusedField === 'complemento' && styles.inputFocused,
                  ]}
                >
                  <TextInput
                    ref={(r) => {
                      inputRefs.current.complemento = r;
                    }}
                    style={[styles.input, styles.inputWithClear]}
                    value={formData.complemento}
                    onChangeText={(value) => applyFieldValue('complemento', value)}
                    onFocus={() => setFocusedField('complemento')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched({ ...touched, complemento: true });
                    }}
                    placeholder={getPlaceholder('complemento', personType)}
                    placeholderTextColor={COLORS.textTertiary}
                    selectionColor={COLORS.primary}
                    cursorColor={COLORS.primary}
                  />
                  {renderClearButton('complemento', formData.complemento)}
                </View>
              </View>
            </View>

            {/* Espacamento inferior */}
            <View style={styles.bottomSpacer} />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Botao Cancelar */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            {/* Botao Salvar */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.7}>
              <Text style={styles.saveButtonText}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal Dropdown Estado */}
      <Modal
        visible={stateDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStateDropdownOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setStateDropdownOpen(false)}>
          <View style={styles.modalBackdrop} />
        </TouchableWithoutFeedback>
        <View style={styles.dropdownModalContainer} pointerEvents="box-none">
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Selecione um estado</Text>
            <View style={styles.searchBar}>
              <TextInput
                style={[
                  styles.input,
                  styles.searchInput,
                  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as any) : null,
                ]}
                placeholder="Buscar estado"
                placeholderTextColor={COLORS.textTertiary}
                value={stateSearch}
                onChangeText={setStateSearch}
                autoCapitalize="none"
                autoCorrect={false}
                selectionColor={COLORS.primary}
                cursorColor={COLORS.primary}
              />
              {stateSearch.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setStateSearch('')}>
                  <ClearIcon />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView style={styles.stateList}>
              {filteredStates.map((label) => (
                <View key={label}>
                  <TouchableOpacity
                    style={[
                      styles.stateItem,
                      UF_NAME_MAP[formData.estado] === label && styles.stateItemSelected,
                    ]}
                    onPress={() => {
                      const uf = label.split(' - ')[0];
                      updateField('estado', uf);
                      setStateSearch('');
                      setStateDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.stateItemText}>{label}</Text>
                  </TouchableOpacity>
                  <View style={styles.stateDivider} />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmacao de Saida */}
      <ModalAlertLeaveKeyman
        visible={confirmExitVisible}
        onCancel={() => setConfirmExitVisible(false)}
        onConfirm={handleConfirmExit}
      />
    </Modal>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Overlay escurecido
  overlay: {
    flex: 1, //........................Ocupa tela inteira
    backgroundColor: 'rgba(0, 0, 0, 0.5)', //..Fundo semi-transparente
    padding: 10, //...................Margem de respiro
  },

  // Container do Modal
  modalContainer: {
    flex: 1, //........................Ocupa espaco disponivel
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 16, //...............Bordas arredondadas
    overflow: 'hidden', //.............Esconde overflow
  },

  // Header
  header: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    justifyContent: 'space-between', //.Espaco entre elementos
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 14, //............Margem vertical
  },

  // Titulo do Header
  headerTitle: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Botao Fechar
  closeButton: {
    width: 36, //.....................Largura fixa
    height: 36, //....................Altura fixa
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Divisor do Header
  headerDivider: {
    height: 0.5, //...................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
  },

  // Conteudo scrollavel
  content: {
    flex: 1, //........................Ocupa espaco disponivel
    paddingHorizontal: 16, //..........Margem horizontal
    paddingTop: 16, //.................Margem superior
  },

  // Secao Foto e Tipo de Pessoa
  photoTypeSection: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 12, //.......................Espaco entre elementos
    marginBottom: 16, //...............Margem inferior
  },

  // Container da Foto
  photoContainer: {
    position: 'relative', //...........Posicao relativa
    overflow: 'visible', //.............Overflow visivel
  },

  // Foto de Perfil
  profilePhoto: {
    width: 65, //......................Largura fixa
    height: 80, //.....................Altura fixa
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
  },

  // Botao Camera
  cameraButton: {
    position: 'absolute', //...........Posicao absoluta
    top: 63, //.......................Posicao vertical
    marginTop: 4, //...................Margem superior
    left: '50%', //...................Posicao horizontal
    marginLeft: -12.5, //..............Margem esquerda
  },

  // Container Tipo de Pessoa
  personTypeContainer: {
    backgroundColor: COLORS.white, //..Fundo branco
    gap: 10, //.......................Espaco entre elementos
  },

  // Opcao Radio
  radioOption: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    gap: 10, //.......................Espaco entre elementos
  },

  // Divisor Radio
  radioOptionDivider: {
    height: 0.5, //...................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
  },

  // Label Radio
  radioLabel: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 16, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Container da Secao
  sectionContainer: {
    gap: 10, //.......................Espaco entre elementos
    paddingBottom: 10, //...............Margem inferior
  },

  // Container Dados Pessoais (espacamento superior)
  sectionDadosPessoais: {
    marginTop: 15, //..................Espacamento superior
  },

  // Titulo da Secao
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 16, //...................Tamanho da fonte
    color: '#0F172A', //...............Cor do texto
    paddingHorizontal: 5, //...........Margem horizontal
  },

  // Grupo de Input
  inputGroup: {
    minHeight: 64, //..................Altura minima
    gap: 6, //........................Espaco entre elementos
  },

  // Grupo de Input Metade
  inputGroupHalf: {
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Linha de Inputs
  rowInputs: {
    flexDirection: 'row', //...........Layout horizontal
    gap: 12, //.......................Espaco entre elementos
  },

  // Container do Label
  labelContainer: {
    paddingHorizontal: 6, //...........Margem horizontal
  },

  // Label do Input
  inputLabel: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 12, //...................Tamanho da fonte
    color: COLORS.labelText, //.......Cor do label
  },

  // Asterisco de campo obrigatorio
  requiredAsterisk: {
    color: '#D94F4F', //...............Cor vermelha
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 12, //...................Tamanho da fonte
  },

  // Container do Input
  inputContainer: {
    height: 36, //.....................Altura fixa
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 0.5, //...............Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    justifyContent: 'center', //......Centraliza verticalmente
    paddingHorizontal: 10, //..........Margem horizontal
    position: 'relative', //...........Posicao relativa
  },

  // Input
  input: {
    flex: 1, //........................Ocupa espaco disponivel
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },

  // Input com Clear
  inputWithClear: {
    paddingRight: 28, //...............Margem direita
  },

  // Botao Clear do Input
  inputClearButton: {
    position: 'absolute', //...........Posicao absoluta
    right: 0, //......................Posicao direita
    top: 0, //........................Posicao topo
    bottom: 0, //.....................Posicao inferior
    width: 28, //.....................Largura fixa
    alignItems: 'center', //...........Centraliza horizontalmente
    justifyContent: 'center', //......Centraliza verticalmente
  },

  // Input Focado
  inputFocused: {
    borderColor: COLORS.primary, //....Borda azul
  },

  // Texto de Erro
  errorText: {
    color: '#D94F4F', //...............Cor vermelha
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 12, //...................Tamanho da fonte
    marginTop: 4, //...................Margem superior
    paddingHorizontal: 6, //...........Margem horizontal
  },

  // Linha de Selecao Estado
  stateSelectRow: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    justifyContent: 'space-between', //.Espaco entre elementos
  },

  // Texto Dropdown
  dropdownText: {
    fontSize: 14, //...................Tamanho da fonte
    fontFamily: 'Inter_400Regular', //..Fonte regular
    color: COLORS.textPrimary, //......Cor do texto
    flex: 1, //........................Ocupa espaco disponivel
  },

  // Texto Placeholder
  placeholderText: {
    color: COLORS.textTertiary, //....Cor terciaria
  },

  // Chevron Dropdown
  dropdownChevron: {
    marginLeft: 8, //...................Margem esquerda
  },

  // Espacamento Inferior
  bottomSpacer: {
    height: 0, //......................Sem espacamento
  },

  // Footer
  footer: {
    paddingHorizontal: 16, //..........Margem horizontal
    paddingVertical: 16, //.............Margem vertical
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Centraliza verticalmente
    gap: 12, //........................Espaco entre botoes
  },

  // Botao Cancelar
  cancelButton: {
    flex: 1, //........................Ocupa metade do espaco
    height: 44, //.....................Altura fixa
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 1, //.................Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //...........Centraliza horizontalmente
  },

  // Texto Botao Cancelar
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Botao Salvar
  saveButton: {
    flex: 1, //........................Ocupa metade do espaco
    height: 44, //.....................Altura fixa
    backgroundColor: COLORS.primary, //.Fundo azul
    borderRadius: 8, //................Bordas arredondadas
    justifyContent: 'center', //......Centraliza verticalmente
    alignItems: 'center', //...........Centraliza horizontalmente
  },

  // Texto Botao Salvar
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.white, //.............Cor branca
  },

  // Modal Backdrop
  modalBackdrop: {
    position: 'absolute', //...........Posicao absoluta
    left: 0, //........................Posicao esquerda
    right: 0, //......................Posicao direita
    top: 0, //........................Posicao topo
    bottom: 0, //.....................Posicao inferior
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo semi-transparente
  },

  // Container Modal Dropdown
  dropdownModalContainer: {
    position: 'absolute', //...........Posicao absoluta
    left: 0, //........................Posicao esquerda
    right: 0, //......................Posicao direita
    top: 0, //........................Posicao topo
    bottom: 0, //.....................Posicao inferior
    alignItems: 'center', //...........Centraliza horizontalmente
    justifyContent: 'center', //......Centraliza verticalmente
  },

  // Container Dropdown
  dropdownContainer: {
    width: '90%', //...................Largura percentual
    maxWidth: 420, //..................Largura maxima
    minWidth: 320, //..................Largura minima
    backgroundColor: COLORS.white, //..Fundo branco
    borderRadius: 8, //................Bordas arredondadas
    borderWidth: 0.5, //...............Largura da borda
    borderColor: COLORS.border, //....Cor da borda
    padding: 10, //...................Margem interna
  },

  // Titulo Dropdown
  dropdownTitle: {
    fontSize: 16, //...................Tamanho da fonte
    fontFamily: 'Inter_600SemiBold', //.Fonte semi-bold
    color: COLORS.textPrimary, //......Cor do texto
    marginBottom: 10, //...............Margem inferior
    paddingHorizontal: 2, //...........Margem horizontal
  },

  // Barra de Busca
  searchBar: {
    flexDirection: 'row', //...........Layout horizontal
    alignItems: 'center', //...........Alinha verticalmente
    borderWidth: 1, //.................Largura da borda
    borderColor: COLORS.inputBorder, //..Cor da borda
    borderRadius: 8, //................Bordas arredondadas
    paddingHorizontal: 10, //..........Margem horizontal
    height: 44, //.....................Altura fixa
    marginBottom: 10, //...............Margem inferior
    backgroundColor: COLORS.white, //..Fundo branco
  },

  // Input de Busca
  searchInput: {
    flex: 1, //........................Ocupa espaco disponivel
    height: '100%', //..................Altura total
    borderWidth: 0, //.................Sem borda
    paddingHorizontal: 0, //...........Sem margem horizontal
    color: COLORS.textPrimary, //......Cor do texto
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    backgroundColor: 'transparent', //.Fundo transparente
  },

  // Botao Limpar Busca
  clearBtn: {
    marginLeft: 8, //...................Margem esquerda
    width: 24, //.....................Largura fixa
    height: 24, //....................Altura fixa
    alignItems: 'center', //...........Centraliza horizontalmente
    justifyContent: 'center', //......Centraliza verticalmente
  },

  // Lista de Estados
  stateList: {
    height: 320, //...................Altura fixa
  },

  // Item Estado
  stateItem: {
    paddingVertical: 8, //.............Margem vertical
    paddingHorizontal: 5, //...........Margem horizontal
  },

  // Item Estado Selecionado
  stateItemSelected: {
    backgroundColor: '#F4F4F4', //....Fundo cinza
    borderRadius: 6, //................Bordas arredondadas
  },

  // Texto Item Estado
  stateItemText: {
    fontSize: 14, //...................Tamanho da fonte
    fontFamily: 'Inter_400Regular', //..Fonte regular
    color: COLORS.textPrimary, //......Cor do texto
  },

  // Divisor Estado
  stateDivider: {
    height: 0.5, //...................Altura da linha
    backgroundColor: COLORS.border, //..Cor da borda
    marginVertical: 4, //...............Margem vertical
  },
});

export default RegisterKeymanModal;
