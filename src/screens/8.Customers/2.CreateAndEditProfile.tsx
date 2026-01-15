import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Platform,
  findNodeHandle,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import InformationGroupProfile, {
  type ProfileFormData,
  type PersonType,
  type ScreenMode,
} from '../7.Keymans/02.01.InformationGroup-Profile';
import { UF_LIST, isValidCPF, isValidCNPJ, isValidEmail, validateWhatsApp, isValidCEP, onlyDigits } from '../../utils/validators';
import { Stepper } from '../7.Keymans/02.02.InformationGroup-Contacts-NewContact05';

type CreateEditProfilePayload = ProfileFormData & {
  personType: PersonType;
  operationAsset: string;
  operationTaxCredit: string;
  operationTaxPlanning: string;
};

interface CreateAndEditProfileProps {
  visible: boolean;
  onClose: () => void;
  mode?: ScreenMode;
  initialData?: Partial<CreateEditProfilePayload>;
  onSave?: (data: CreateEditProfilePayload) => void;
}

const NO_KEYMAN_OPTION = 'Sem indicação';

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  white: '#FCFCFC',
  border: '#D8E0F0',
  background: '#F4F4F4',
};

// Ajuste aqui para aumentar/diminuir o espaçamento extra abaixo do container "Operação" (10px)
const OPERATION_BOTTOM_SPACING_PX = 10;

const FOOTER_BAR_HEIGHT_PX = 68;

const CloseIcon = () => (
  <Svg width={38} height={38} viewBox="0 0 38 38" fill="none">
    <Rect width={38} height={38} rx={8} fill="#F4F4F4" />
    <Rect width={38} height={38} rx={8} stroke="#EDF2F6" />
    <Path d="M25.155 13.2479C24.7959 12.9179 24.2339 12.9173 23.874 13.2466L19 17.7065L14.126 13.2466C13.7661 12.9173 13.2041 12.9179 12.845 13.2479L12.7916 13.297C12.4022 13.6549 12.4029 14.257 12.7931 14.614L17.5863 19L12.7931 23.386C12.4029 23.743 12.4022 24.3451 12.7916 24.703L12.845 24.7521C13.2041 25.0821 13.7661 25.0827 14.126 24.7534L19 20.2935L23.874 24.7534C24.2339 25.0827 24.7959 25.0821 25.155 24.7521L25.2084 24.703C25.5978 24.3451 25.5971 23.743 25.2069 23.386L20.4137 19L25.2069 14.614C25.5971 14.257 25.5978 13.6549 25.2084 13.297L25.155 13.2479Z" fill={COLORS.textPrimary} />
  </Svg>
);

const ChevronDownIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M7 10l5 5 5-5" stroke="#7D8592" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ClearSearchIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#7D8592" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const RadioSelectedIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
      fill={COLORS.primary}
    />
    <Rect x={5} y={5} width={10} height={10} rx={5} fill={COLORS.primary} />
  </Svg>
);

const RadioUnselectedIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20C15.5228 20 20 15.5228 20 10ZM2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10Z"
      fill="#6F7DA0"
      stroke={COLORS.white}
    />
  </Svg>
);

const maskCurrencyBRL = (text: string, maxDigits: number = 15): string => {
  const d = onlyDigits(text).slice(0, maxDigits);
  if (!d) return 'R$ 0,00';
  if (d.length === 1) return `R$ 0,0${d}`;
  if (d.length === 2) return `R$ 0,${d}`;
  const whole = d.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const cents = d.slice(-2);
  return `R$ ${whole},${cents}`;
};

const currencyNoPrefix = (s: string): string => (s || '').replace(/^R\$\s?/, '');
const parseCurrencyInput = (s: string): number => {
  const cleaned = (s || '').replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
};

const sanitizeOperationTyping = (text: string, maxDigits: number = 15): string => {
  return onlyDigits(text).slice(0, maxDigits);
};

const formatOperationBRLFromDigits = (digits: string): string => {
  const clean = sanitizeOperationTyping(digits);
  if (!clean) return '';
  const n = parseInt(clean, 10);
  if (!isFinite(n) || isNaN(n)) return '';
  const whole = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${whole},00`;
};

const operationDigitsFromFormatted = (formatted: string): string => {
  if (!formatted) return '';
  const n = parseCurrencyInput(currencyNoPrefix(formatted));
  if (!isFinite(n) || isNaN(n)) return '';
  const int = Math.max(0, Math.trunc(n));
  return int.toString();
};

const CreateAndEditProfile: React.FC<CreateAndEditProfileProps> = ({
  visible,
  onClose,
  mode = 'criar',
  initialData,
  onSave,
}) => {
  const [personType, setPersonType] = useState<PersonType>(initialData?.personType ?? 'fisica');
  const [formData, setFormData] = useState<ProfileFormData>({
    nome: initialData?.nome ?? '',
    cpfCnpj: initialData?.cpfCnpj ?? '',
    responsavelNome: initialData?.responsavelNome ?? '',
    responsavelCpf: initialData?.responsavelCpf ?? '',
    email: initialData?.email ?? '',
    whatsapp: initialData?.whatsapp ?? '',
    estado: initialData?.estado ?? '',
    cep: initialData?.cep ?? '',
    cidade: initialData?.cidade ?? '',
    bairro: initialData?.bairro ?? '',
    endereco: initialData?.endereco ?? '',
    numero: initialData?.numero ?? '',
    complemento: initialData?.complemento ?? '',
    keymanPhoto: initialData?.keymanPhoto ?? undefined,
  });
  const [opAsset, setOpAsset] = useState<string>(initialData?.operationAsset ?? '');
  const [opCredit, setOpCredit] = useState<string>(initialData?.operationTaxCredit ?? '');
  const [opPlanning, setOpPlanning] = useState<string>(initialData?.operationTaxPlanning ?? '');
  const [focusedOperationField, setFocusedOperationField] = useState<'asset' | 'credit' | 'planning' | null>(null);
  const [opAssetInput, setOpAssetInput] = useState<string>('');
  const [opCreditInput, setOpCreditInput] = useState<string>('');
  const [opPlanningInput, setOpPlanningInput] = useState<string>('');
  const opAssetRef = useRef<TextInput | null>(null);
  const opCreditRef = useRef<TextInput | null>(null);
  const opPlanningRef = useRef<TextInput | null>(null);

  // Abas e âncoras
  const [activeTab, setActiveTab] = useState<number>(1);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const localizacaoSectionRef = useRef<View | null>(null);
  const anchorsRef = useRef<{ start: number; operacao: number }>({ start: 0, operacao: 0 });
  // Ajuste aqui para subir/descer a posição final da seção "Localização:" ao clicar na aba 02
  const LOCATION_TAB_SCROLL_OFFSET_PX = 15;
  const scrollToLocalizacao = useCallback(() => {
    const sv = scrollViewRef.current;
    const localizacaoNode = localizacaoSectionRef.current as any;
    if (!sv || !localizacaoNode?.measureLayout) return;

    const innerNode =
      (sv as any).getInnerViewNode?.() ??
      findNodeHandle(sv as any);
    if (!innerNode) return;

    localizacaoNode.measureLayout(
      innerNode,
      (_x: number, y: number) => {
        sv.scrollTo({ y: Math.max(0, y - LOCATION_TAB_SCROLL_OFFSET_PX), animated: true });
      },
      () => {}
    );
  }, [LOCATION_TAB_SCROLL_OFFSET_PX]);
  const handleTabSelect = useCallback((tab: number) => {
    setActiveTab(tab);
    const sv = scrollViewRef.current;
    if (!sv) return;
    if (tab === 1) {
      sv.scrollTo({ y: Math.max(0, anchorsRef.current.start), animated: true });
    } else if (tab === 2) {
      setTimeout(scrollToLocalizacao, 0);
    } else if (tab === 3) {
      sv.scrollTo({ y: Math.max(0, anchorsRef.current.operacao), animated: true });
    }
  }, [scrollToLocalizacao]);
  const onStepLeft = () => handleTabSelect(Math.max(1, activeTab - 1));
  const onStepRight = () => handleTabSelect(Math.min(3, activeTab + 1));
  const canGoLeft = activeTab > 1;
  const canGoRight = activeTab < 3;

  const clearOperationField = useCallback((field: 'asset' | 'credit' | 'planning') => {
    if (field === 'asset') {
      setFocusedOperationField('asset');
      setOpAsset('');
      setOpAssetInput('');
      setTimeout(() => opAssetRef.current?.focus(), 0);
      return;
    }
    if (field === 'credit') {
      setFocusedOperationField('credit');
      setOpCredit('');
      setOpCreditInput('');
      setTimeout(() => opCreditRef.current?.focus(), 0);
      return;
    }
    setFocusedOperationField('planning');
    setOpPlanning('');
    setOpPlanningInput('');
    setTimeout(() => opPlanningRef.current?.focus(), 0);
  }, []);

  // Keyman seleção
  const KEYMAN_OPTIONS = useMemo(() => [
    'João Fernando',
    'Maria Silva',
    'Carlos Oliveira',
    'Ana Pereira',
    'Luís Costa',
    'Sofia Rodrigues',
    'Pedro Almeida',
    'Beatriz Santos',
    'Rafael Mendes',
    'Gabriela Fernandes',
  ], []);
  const [selectedKeyman, setSelectedKeyman] = useState<string>(NO_KEYMAN_OPTION);
  const [keymanModalOpen, setKeymanModalOpen] = useState<boolean>(false);
  const [keymanSearch, setKeymanSearch] = useState<string>('');
  const keymanSearchInputRef = useRef<TextInput | null>(null);
  const filteredKeymans = useMemo(
    () => KEYMAN_OPTIONS.filter(n => (n || '').toLowerCase().includes((keymanSearch || '').toLowerCase().trim())),
    [KEYMAN_OPTIONS, keymanSearch]
  );

  useEffect(() => {
    if (!visible) return;
    setPersonType(initialData?.personType ?? 'fisica');
    setFormData({
      nome: initialData?.nome ?? '',
      cpfCnpj: initialData?.cpfCnpj ?? '',
      responsavelNome: initialData?.responsavelNome ?? '',
      responsavelCpf: initialData?.responsavelCpf ?? '',
      email: initialData?.email ?? '',
      whatsapp: initialData?.whatsapp ?? '',
      estado: initialData?.estado ?? '',
      cep: initialData?.cep ?? '',
      cidade: initialData?.cidade ?? '',
      bairro: initialData?.bairro ?? '',
      endereco: initialData?.endereco ?? '',
      numero: initialData?.numero ?? '',
      complemento: initialData?.complemento ?? '',
      keymanPhoto: initialData?.keymanPhoto ?? undefined,
    });
    setOpAsset(initialData?.operationAsset ?? '');
    setOpCredit(initialData?.operationTaxCredit ?? '');
    setOpPlanning(initialData?.operationTaxPlanning ?? '');
    setFocusedOperationField(null);
    setOpAssetInput('');
    setOpCreditInput('');
    setOpPlanningInput('');
    setSelectedKeyman(NO_KEYMAN_OPTION);
    setKeymanModalOpen(false);
    setKeymanSearch('');
  }, [visible, initialData]);

  const onUpdateFormField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isCreateValid = () => {
    const parts = formData.nome.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return false;

    if (personType === 'fisica') {
      if (!isValidCPF(formData.cpfCnpj)) return false;
    } else {
      if (!isValidCNPJ(formData.cpfCnpj)) return false;
    }

    if (!isValidEmail(formData.email)) return false;

    const wDigits = validateWhatsApp(formData.whatsapp);
    if (formData.whatsapp && !wDigits.valid) return false;

    if (formData.estado && !UF_LIST.includes(formData.estado)) return false;

    if (onlyDigits(formData.cep).length > 0 && !isValidCEP(formData.cep)) return false;

    return true;
  };

  const handleSave = () => {
    if (!isCreateValid()) return;
    const payload: CreateEditProfilePayload = {
      ...formData,
      personType,
      operationAsset: opAsset || 'R$ 0,00',
      operationTaxCredit: opCredit || 'R$ 0,00',
      operationTaxPlanning: opPlanning || 'R$ 0,00',
    };
    onSave?.(payload);
    onClose();
  };

  const closeKeymanModal = useCallback(() => {
    setKeymanModalOpen(false);
    setKeymanSearch('');
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerRow}>
            {/* Ajusta o título conforme o modo do modal (criar/editar) */}
            <Text style={styles.headerTitle}>{mode === 'editar' ? 'Editar Perfil' : 'Novo cliente'}</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={onClose} accessibilityRole="button" accessibilityLabel="Fechar">
                <CloseIcon />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabsFixedBlock}>
            <Stepper
              tabs={[1, 2, 3]}
              activeTab={activeTab}
              canGoLeft={canGoLeft}
              canGoRight={canGoRight}
              onStepLeft={onStepLeft}
              onStepRight={onStepRight}
              onSelectTab={handleTabSelect}
              showArrows={false}
            />
            <View style={styles.dividerThin} />
          </View>

          <ScrollView
            ref={scrollViewRef}
            style={styles.content}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
          >
            {/* Seleção de QMEI/Keyman */}
            <View style={styles.keymanSection}>
              <View style={styles.keymanHeaderRow}>
                <View style={styles.keymanLabelWrap}>
                  <Text style={styles.keymanLabel}>Keyman</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.keymanSelectRow}
                activeOpacity={0.8}
                onPress={() => setKeymanModalOpen(true)}
                accessibilityLabel="Selecionar Keyman"
              >
                <Text style={styles.keymanSelectText}>{selectedKeyman}</Text>
                <ChevronDownIcon />
              </TouchableOpacity>
            </View>

            {/* Modal de seleção de Keyman */}
            {keymanModalOpen ? (
              <Modal
                visible={keymanModalOpen}
                transparent
                animationType="fade"
                onRequestClose={closeKeymanModal}
              >
                {/* Fecha o modal ao tocar fora do container (comportamento padrão esperado) */}
                <TouchableWithoutFeedback onPress={closeKeymanModal}>
                  <View style={styles.dropdownModalContainer}>
                    <View style={styles.dropdownBackdrop} />
                    <TouchableWithoutFeedback onPress={noop}>
                      <View style={styles.dropdownContainer}>
                        <Text style={styles.dropdownTitle}>Selecionar Keyman</Text>
                        <View style={styles.dropdownSearchRow}>
                          <View style={styles.dropdownSearchInputWrap}>
                            <TextInput
                              ref={keymanSearchInputRef}
                              style={styles.dropdownSearchInput}
                              placeholder="Buscar"
                              placeholderTextColor={COLORS.textTertiary}
                              value={keymanSearch}
                              onChangeText={setKeymanSearch}
                              selectionColor={COLORS.primary}
                              cursorColor={COLORS.primary}
                            />
                            {keymanSearch.trim().length ? (
                              <TouchableOpacity
                                style={styles.dropdownSearchClearButton}
                                activeOpacity={0.8}
                                onPress={() => {
                                  setKeymanSearch('');
                                  setTimeout(() => keymanSearchInputRef.current?.focus(), 0);
                                }}
                                accessibilityRole="button"
                                accessibilityLabel="Limpar busca"
                              >
                                <ClearSearchIcon />
                              </TouchableOpacity>
                            ) : null}
                          </View>
                        </View>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedKeyman(NO_KEYMAN_OPTION);
                            setKeymanModalOpen(false);
                            setKeymanSearch('');
                          }}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              selectedKeyman === NO_KEYMAN_OPTION ? styles.dropdownItemTextSelected : null,
                            ]}
                          >
                            {NO_KEYMAN_OPTION}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.dropdownItemDivider} />
                        {/* Espaçamento entre as opções do dropdown (15px), mantendo as divisórias */}
                        <View style={styles.dropdownItemSpacing} />
                        <ScrollView style={styles.dropdownList}>
                          {filteredKeymans.map((n, index) => (
                            <View key={n}>
                              <TouchableOpacity
                                style={styles.dropdownItem}
                                onPress={() => {
                                  setSelectedKeyman(n);
                                  setKeymanModalOpen(false);
                                  setKeymanSearch('');
                                }}
                                activeOpacity={0.8}
                              >
                                <Text
                                  style={[
                                    styles.dropdownItemText,
                                    selectedKeyman === n ? styles.dropdownItemTextSelected : null,
                                  ]}
                                >
                                  {n}
                                </Text>
                              </TouchableOpacity>
                              <View style={styles.dropdownItemDivider} />
                              {/* Espaçamento entre as opções do dropdown (15px), mantendo as divisórias */}
                              {index < filteredKeymans.length - 1 ? <View style={styles.dropdownItemSpacing} /> : null}
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            ) : null}

            <View style={styles.profileWrapper}>
              <InformationGroupProfile
                mode={mode}
                formData={formData}
                onUpdateFormField={onUpdateFormField}
                personType={personType}
                onSetPersonType={setPersonType}
                localizacaoSectionRef={localizacaoSectionRef}
                // Posição aproximada da seção de Localização: usar início do grupo
                // O componente interno usa ScrollView próprio; aqui ancoramos ao topo dele
                // para manter navegação simples e consistente
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Operação</Text>
            </View>
            <View
              style={{ height: 0 }}
              onLayout={(e) => {
                anchorsRef.current.operacao = e.nativeEvent.layout.y;
              }}
            />

            <View style={styles.inputGroup}>
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>Valor patrimonial</Text>
              </View>
              <View style={[styles.inputContainer, focusedOperationField === 'asset' ? styles.inputContainerFocused : null]}>
                <TextInput
                  ref={opAssetRef}
                  style={[styles.input, styles.webNoOutline, styles.inputWithClear]}
                  value={focusedOperationField === 'asset' ? opAssetInput : opAsset}
                  onChangeText={(t) => setOpAssetInput(sanitizeOperationTyping(t))}
                  keyboardType="numeric"
                  placeholder="R$ 0,00"
                  placeholderTextColor={COLORS.textTertiary}
                  onFocus={() => {
                    setFocusedOperationField('asset');
                    setOpAssetInput(operationDigitsFromFormatted(opAsset));
                  }}
                  onBlur={() => {
                    const formatted = formatOperationBRLFromDigits(opAssetInput);
                    setOpAsset(formatted);
                    setFocusedOperationField((prev) => (prev === 'asset' ? null : prev));
                  }}
                  onSubmitEditing={() => {
                    const formatted = formatOperationBRLFromDigits(opAssetInput);
                    setOpAsset(formatted);
                    setFocusedOperationField((prev) => (prev === 'asset' ? null : prev));
                  }}
                  blurOnSubmit
                  returnKeyType="done"
                  selectionColor={COLORS.primary}
                  cursorColor={COLORS.primary}
                />
                {(focusedOperationField === 'asset' ? opAssetInput : opAsset) ? (
                  <TouchableOpacity
                    style={styles.inputClearButton}
                    activeOpacity={0.8}
                    onPress={() => clearOperationField('asset')}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar campo Valor patrimonial"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <ClearSearchIcon />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Espaçamento entre os containers dos campos de Operação (10px) */}
            <View style={[styles.inputGroup, styles.operationInputGroupSpacing]}>
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>Crédito tributário</Text>
              </View>
              <View style={[styles.inputContainer, focusedOperationField === 'credit' ? styles.inputContainerFocused : null]}>
                <TextInput
                  ref={opCreditRef}
                  style={[styles.input, styles.webNoOutline, styles.inputWithClear]}
                  value={focusedOperationField === 'credit' ? opCreditInput : opCredit}
                  onChangeText={(t) => setOpCreditInput(sanitizeOperationTyping(t))}
                  keyboardType="numeric"
                  placeholder="R$ 0,00"
                  placeholderTextColor={COLORS.textTertiary}
                  onFocus={() => {
                    setFocusedOperationField('credit');
                    setOpCreditInput(operationDigitsFromFormatted(opCredit));
                  }}
                  onBlur={() => {
                    const formatted = formatOperationBRLFromDigits(opCreditInput);
                    setOpCredit(formatted);
                    setFocusedOperationField((prev) => (prev === 'credit' ? null : prev));
                  }}
                  onSubmitEditing={() => {
                    const formatted = formatOperationBRLFromDigits(opCreditInput);
                    setOpCredit(formatted);
                    setFocusedOperationField((prev) => (prev === 'credit' ? null : prev));
                  }}
                  blurOnSubmit
                  returnKeyType="done"
                  selectionColor={COLORS.primary}
                  cursorColor={COLORS.primary}
                />
                {(focusedOperationField === 'credit' ? opCreditInput : opCredit) ? (
                  <TouchableOpacity
                    style={styles.inputClearButton}
                    activeOpacity={0.8}
                    onPress={() => clearOperationField('credit')}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar campo Crédito tributário"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <ClearSearchIcon />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {/* Espaçamento entre os containers dos campos de Operação (10px) */}
            <View style={[styles.inputGroup, styles.operationInputGroupSpacing]}>
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>Planejamento tributário</Text>
              </View>
              <View style={[styles.inputContainer, focusedOperationField === 'planning' ? styles.inputContainerFocused : null]}>
                <TextInput
                  ref={opPlanningRef}
                  style={[styles.input, styles.webNoOutline, styles.inputWithClear]}
                  value={focusedOperationField === 'planning' ? opPlanningInput : opPlanning}
                  onChangeText={(t) => setOpPlanningInput(sanitizeOperationTyping(t))}
                  keyboardType="numeric"
                  placeholder="R$ 0,00"
                  placeholderTextColor={COLORS.textTertiary}
                  onFocus={() => {
                    setFocusedOperationField('planning');
                    setOpPlanningInput(operationDigitsFromFormatted(opPlanning));
                  }}
                  onBlur={() => {
                    const formatted = formatOperationBRLFromDigits(opPlanningInput);
                    setOpPlanning(formatted);
                    setFocusedOperationField((prev) => (prev === 'planning' ? null : prev));
                  }}
                  onSubmitEditing={() => {
                    const formatted = formatOperationBRLFromDigits(opPlanningInput);
                    setOpPlanning(formatted);
                    setFocusedOperationField((prev) => (prev === 'planning' ? null : prev));
                  }}
                  blurOnSubmit
                  returnKeyType="done"
                  selectionColor={COLORS.primary}
                  cursorColor={COLORS.primary}
                />
                {(focusedOperationField === 'planning' ? opPlanningInput : opPlanning) ? (
                  <TouchableOpacity
                    style={styles.inputClearButton}
                    activeOpacity={0.8}
                    onPress={() => clearOperationField('planning')}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar campo Planejamento tributário"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <ClearSearchIcon />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footerBar}>
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.footerButtonSecondary} onPress={onClose} activeOpacity={0.8}>
                <Text style={[styles.footerButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButtonPrimary, !isCreateValid() ? styles.footerButtonDisabled : null]}
                onPress={handleSave}
                activeOpacity={0.8}
              >
                {/* Ajusta o rótulo do botão conforme o modo do modal (criar/editar) */}
                <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>{mode === 'editar' ? 'Salvar' : 'Criar'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#676E76',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
  },
  headerRow: {
    // Ajuste aqui para aumentar/diminuir o padding acima do título e do botão de fechar
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: COLORS.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: FOOTER_BAR_HEIGHT_PX + OPERATION_BOTTOM_SPACING_PX,
  },
  // Container Dados pessoais/Localização - margem lateral interna (5px)
  profileWrapper: {
    marginHorizontal: -15,
    // Ajuste aqui para aumentar/diminuir o espaço entre o dropdown ("Sem indicação") e o container da foto/avatar
    marginTop: 15,
    paddingHorizontal: 5,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioLabel: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    flex: 1,
  },
  dividerThin: {
    height: 0.5,
    backgroundColor: COLORS.border,
    opacity: 0.6,
    alignSelf: 'stretch',
  },
  tabsFixedBlock: {
    gap: 10,
    paddingHorizontal: 15,
    // Ajuste aqui para aumentar/diminuir o espaço entre a divisória das abas e o título "Keyman"
    paddingBottom: 0,
  },
  sectionHeader: {
    paddingHorizontal: 5,
    paddingTop: 10,
    paddingBottom: 5,
    // Ajuste aqui para aumentar/diminuir o espaço entre "Operação" e "Valor patrimonial"
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#0A1629',
  },
  inputGroup: {
    gap: 6,
    // Espaçamento entre campos da seção Operação é controlado via operationInputGroupSpacing
    marginBottom: 0,
    paddingHorizontal: 5,
  },
  operationInputGroupSpacing: {
    // Espaçamento entre os containers dos campos de Operação (Valor/Crédito/Planejamento)
    marginTop: 20,
  },
  labelContainer: {
    paddingHorizontal: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#7D8592',
  },
  inputContainer: {
    height: 35,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  inputWithClear: {
    paddingRight: 28,
  },
  inputClearButton: {
    position: 'absolute',
    right: 6,
    top: 0,
    bottom: 0,
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webNoOutline: Platform.select({
    web: {
      outlineStyle: 'none',
      outlineWidth: 0,
      outlineColor: 'transparent',
    } as any,
    default: {},
  }),
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#EF4444',
  },
  footerBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 15,
    paddingTop: 10,
    // Controla o espaçamento inferior abaixo dos botões "Cancelar" e "Criar" (ajuste este valor para aumentar/diminuir o espaço)
    paddingBottom: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  footerButtonPrimary: {
    flex: 1,
    minWidth: 0,
    height: 38,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerButtonSecondary: {
    flex: 1,
    minWidth: 0,
    height: 38,
    borderRadius: 6,
    backgroundColor: '#F4F4F4',
    borderColor: COLORS.border,
    borderWidth: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  footerButtonTextPrimary: {
    color: COLORS.white,
    fontFamily: 'Inter_500Medium',
  },
  // Container Keyman - margem lateral interna (5px)
  keymanSection: {
    flexDirection: 'column',
    // Ajuste aqui para aumentar/diminuir o espaço entre a divisória das abas e o título "Keyman"
    paddingTop: 0,
    // Ajuste aqui para aumentar/diminuir o espaço entre o título "Keyman" e o dropdown ("Sem indicação")
    gap: 0,
    paddingHorizontal: 5,
  },
  keymanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  keymanLabelWrap: {
    flex: 1,
    paddingHorizontal: 5,
    minHeight: 35,
    justifyContent: 'center',
  },
  keymanLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#7D8592',
  },
  keymanSelectRow: {
    height: 35,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keymanSelectText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  // Dropdown modal
  dropdownBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  dropdownModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: '90%',
    maxWidth: 420,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 12,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  dropdownTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  dropdownSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  dropdownSearchInputWrap: {
    flex: 1,
    position: 'relative',
    // Ajuste aqui para aumentar/diminuir a altura da barra de pesquisa ("Buscar")
    height: 35,
  },
  dropdownSearchInput: {
    flex: 1,
    // Ajuste aqui para aumentar/diminuir a altura do input da barra de pesquisa ("Buscar")
    height: 35,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingRight: 36,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web'
      ? ({
          outlineStyle: 'none',
          outlineWidth: 0,
          outlineColor: 'transparent',
        } as any)
      : {}),
  },
  dropdownSearchClearButton: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    width: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    height: 260,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: COLORS.textPrimary,
  },
  dropdownItemTextSelected: {
    color: COLORS.primary,
  },
  dropdownItemDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    opacity: 0.6,
  },
  dropdownItemSpacing: {
    height: 15,
  },
});

export default CreateAndEditProfile;
