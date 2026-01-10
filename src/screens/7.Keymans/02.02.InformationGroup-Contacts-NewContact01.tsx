import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Platform, Modal, Alert, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import styles from './02.02.InformationGroup-Contacts-NewContact04';
import {
  COLORS,
  BRAZIL_STATES,
  UF_NAME_MAP,
  createEmptyFormData,
  createFormDataFromContactData,
  digitsOnly,
  detectPersonTypeFromValue,
  detectPersonTypeFromDocument,
  parseImportedContacts,
} from './02.02.InformationGroup-Contacts-NewContact03';
import type { ProfileFormData, PersonType } from './02.02.InformationGroup-Contacts-NewContact03';
import {
  ImportExcelIcon,
  CloseModalIcon,
  TrashButtonIcon,
  AddButtonIcon,
  CameraIcon,
  AVATAR_PLACEHOLDER,
} from './02.02.InformationGroup-Contacts-NewContact02';
import { DownloadModelIcon } from './02.02.InformationGroup-Contacts-NewContact02';
import { InputField, StateSelector, Stepper, HeaderActions } from './02.02.InformationGroup-Contacts-NewContact05';
import {
  capitalizeFirstLetterLive,
  maskCPF,
  maskWhatsApp,
  validateWhatsApp,
  isValidCPF,
  isValidCNPJ,
  isValidEmail,
  sanitizeEmail,
  maskCEP,
  isValidCEP,
  onlyDigits,
  sanitizeCityNeighborhood,
  sanitizeAddress,
  sanitizeNumberField,
  sanitizeComplement,
} from '../../utils/validators';

type ModalMode = 'criar' | 'editar' | 'visualizar';

interface NewContactModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ModalMode;
  contactData?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  onSaveMany?: (data: ProfileFormData[]) => void;
  onImportExcel?: () => void;
}

const InformationGroupContactsNewContact: React.FC<NewContactModalProps> = ({
  visible,
  onClose,
  mode,
  contactData,
  onImportExcel,
  onSave,
  onSaveMany,
}) => {
  const [tabs, setTabs] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState(1);
  const [personTypeByTab, setPersonTypeByTab] = useState<Record<number, PersonType>>({ 1: 'fisica' });
  const [formDataByTab, setFormDataByTab] = useState<Record<number, ProfileFormData>>(() => {
    if (mode === 'criar') return { 1: createEmptyFormData() };
    return { 1: createFormDataFromContactData(contactData) };
  });

  const activePersonType = personTypeByTab[activeTab] ?? 'fisica';
  const formData = formDataByTab[activeTab] ?? createEmptyFormData();

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [photoErrorByTab, setPhotoErrorByTab] = useState<Record<number, boolean>>({});
  const [tabErrors, setTabErrors] = useState<Record<number, string[]>>({});
  const [fieldErrorsByTab, setFieldErrorsByTab] = useState<Record<number, Partial<Record<keyof ProfileFormData, string>>>>({});
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    setFocusedField(null);
  }, [activeTab, visible]);

  useEffect(() => {
    setPhotoErrorByTab((prev) => ({ ...prev, [activeTab]: false }));
  }, [activeTab, formData.keymanPhoto]);

  const getProfilePhotoSource = () => {
    const photo = formData.keymanPhoto;
    if (photo && !photoErrorByTab[activeTab]) {
      if (typeof photo === 'number') return photo;
      if (typeof photo === 'object' && typeof (photo as any)?.uri === 'string' && String((photo as any).uri).trim()) return photo;
    }
    return null;
  };

  const handleDownloadModel = async () => {
    try {
      const headers = [
        'Nome',
        'Tipo de pessoa',
        'CPF/CNPJ',
        'Email',
        'WhatsApp',
        'Estado',
        'CEP',
        'Cidade',
        'Bairro',
        'Endereço',
        'Número',
        'Complemento',
      ];

      const ws = XLSX.utils.aoa_to_sheet([headers]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contatos');
      const filename = 'Importar contatos.xlsx';

      if (Platform.OS === 'web') {
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      const base64 = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
      const dir = (FileSystem as any).cacheDirectory ?? (FileSystem as any).documentDirectory;
      if (!dir) throw new Error('Diretório indisponível');
      const uri = `${dir}${filename}`;
      await FileSystem.writeAsStringAsync(uri, base64, { encoding: 'base64' as any });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Baixar modelo - Planilha do Excel',
        });
        return;
      }

      await Linking.openURL(uri);
    } catch {
      Alert.alert('Erro', 'Não foi possível baixar o modelo da planilha.');
    }
  };

  const handleImportExcel = async () => {
    const applyWorkbook = (workbook: XLSX.WorkBook) => {
      const firstSheetName = workbook.SheetNames?.[0];
      if (!firstSheetName) {
        Alert.alert('Importação', 'A planilha selecionada não possui abas.');
        return;
      }

      const sheet = workbook.Sheets[firstSheetName];
      const decoded = XLSX.utils.decode_range((sheet as any)?.['!ref'] ?? 'A1');
      decoded.s.c = 0;
      decoded.s.r = 0;
      const rows = (XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false, range: decoded }) as unknown[][]) ?? [];
      const contacts = parseImportedContacts(rows);

      if (!contacts.length) {
        Alert.alert('Importação', 'Nenhum contato válido foi encontrado na planilha.');
        return;
      }

      try {
        console.log('[Importacao][Contacts] total=', contacts.length, 'primeiro=', contacts[0]);
      } catch {}

      // Limpa qualquer estado anterior para evitar resíduos na aba 01
      setTabs([]);
      setFormDataByTab({});
      setPersonTypeByTab({});

      const tabIndexes = contacts.map((_, idx) => idx + 1);
      const formMap: Record<number, ProfileFormData> = {};
      const personMap: Record<number, PersonType> = {};
      contacts.forEach((c, idx) => {
        const tab = idx + 1;
        formMap[tab] = c.data;
        personMap[tab] = c.personType;
      });
      if (contacts.length && !formMap[1]) {
        formMap[1] = contacts[0].data;
        personMap[1] = contacts[0].personType;
      }
      setTabs(tabIndexes);
      setFormDataByTab(formMap);
      setPersonTypeByTab(personMap);
      setActiveTab(1);
      try {
        console.log('[Importacao][Tabs]', tabIndexes);
        console.log('[Importacao][Tab1]', formMap[1], personMap[1]);
      } catch {}
      onImportExcel?.();
    };

    if (Platform.OS === 'web') {
      try {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/octet-stream';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.onchange = async () => {
          try {
            const file = input.files?.[0];
            if (!file) return;
            const buffer = await file.arrayBuffer();
            const workbook = XLSX.read(buffer, { type: 'array' });
            applyWorkbook(workbook);
          } catch {
            Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
          } finally {
            document.body.removeChild(input);
          }
        };

        input.click();
      } catch {
        Alert.alert('Importação', 'Não foi possível abrir o seletor de arquivos.');
      }
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: false,
        copyToCacheDirectory: true,
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'application/octet-stream',
        ],
      });

      if ((result as any)?.canceled) return;
      const asset = (result as any)?.assets?.[0];
      if (!asset?.uri) return;

      const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' as any });
      const workbook = XLSX.read(base64, { type: 'base64' });
      applyWorkbook(workbook);
    } catch {
      Alert.alert('Importação', 'Não foi possível importar a planilha selecionada.');
    }
  };

  const onPickProfilePhoto = async () => {
    try {
      if (Platform.OS !== 'web') {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      setFormDataByTab((prev) => ({ ...prev, [activeTab]: { ...(prev[activeTab] ?? createEmptyFormData()), keymanPhoto: { uri: asset.uri } } }));
    } catch {
      return;
    }
  };

  const maskCNPJ = (input: string): string => {
    const digits = onlyDigits(input).slice(0, 14);
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
  };

  const areAllDigitsEqual = (digits: string): boolean => {
    if (!digits) return false;
    return new Set(digits.split('')).size === 1;
  };

  const updateFormField = (field: keyof ProfileFormData, value: string) => {
    setFormDataByTab((prev) => ({ ...prev, [activeTab]: { ...(prev[activeTab] ?? createEmptyFormData()), [field]: value } }));
    setFieldErrorsByTab((prev) => {
      const current = prev[activeTab];
      if (!current || !current[field]) return prev;
      const nextTabErrors = { ...current };
      delete (nextTabErrors as any)[field];
      return { ...prev, [activeTab]: nextTabErrors };
    });
  };

  const setFieldError = (tab: number, field: keyof ProfileFormData, error?: string) => {
    setFieldErrorsByTab((prev) => {
      const current = prev[tab] ?? {};
      if (!error) {
        if (!current[field]) return prev;
        const nextTabErrors = { ...current };
        delete (nextTabErrors as any)[field];
        return { ...prev, [tab]: nextTabErrors };
      }
      if (current[field] === error) return prev;
      return { ...prev, [tab]: { ...current, [field]: error } };
    });
  };

  useEffect(() => {
    if (!visible) return;

    setTabs([1]);
    setActiveTab(1);
    setPersonTypeByTab({ 1: 'fisica' });
    setTabErrors({});
    setFieldErrorsByTab({});

    if (mode === 'criar') {
      setFormDataByTab({ 1: createEmptyFormData() });
      return;
    }

    setFormDataByTab({
      1: createFormDataFromContactData(contactData),
    });
  }, [visible, mode, contactData]);

  const activeTabIndex = useMemo(() => tabs.findIndex((t) => t === activeTab), [tabs, activeTab]);
  const canGoLeft = tabs.length > 1 && activeTabIndex > 0;
  const canGoRight = tabs.length > 1 && activeTabIndex >= 0 && activeTabIndex < tabs.length - 1;

  const handleAddTab = () => {
    const next = tabs.length + 1;
    setTabs((prev) => [...prev, next]);
    setFormDataByTab((prev) => ({ ...prev, [next]: createEmptyFormData() }));
    setPersonTypeByTab((prev) => ({ ...prev, [next]: 'fisica' }));
    setActiveTab(next);
  };

  const clearTabData = (tab: number) => {
    setFormDataByTab((prev) => ({ ...prev, [tab]: createEmptyFormData() }));
    setPersonTypeByTab((prev) => ({ ...prev, [tab]: 'fisica' }));
    setPhotoErrorByTab((prev) => ({ ...prev, [tab]: false }));
    setTabErrors((prev) => {
      if (!prev[tab]) return prev;
      const next = { ...prev };
      delete next[tab];
      return next;
    });
    setFieldErrorsByTab((prev) => {
      if (!prev[tab]) return prev;
      const next = { ...prev };
      delete next[tab];
      return next;
    });
  };

  const deleteCurrentTab = () => {
    if (activeTab === 1) {
      clearTabData(1);
      return;
    }

    const deletedIndex = tabs.findIndex((t) => t === activeTab);
    const remaining = tabs.filter((t) => t !== activeTab);
    const newTabs = remaining.map((_, idx) => idx + 1);

    const newFormMap: Record<number, ProfileFormData> = {};
    const newPersonMap: Record<number, PersonType> = {};
    const newPhotoErrMap: Record<number, boolean> = {};
    const newTabErrorsMap: Record<number, string[]> = {};
    const newFieldErrorsMap: Record<number, Partial<Record<keyof ProfileFormData, string>>> = {};

    remaining.forEach((oldTab, idx) => {
      const newTab = idx + 1;
      newFormMap[newTab] = formDataByTab[oldTab] ?? createEmptyFormData();
      newPersonMap[newTab] = personTypeByTab[oldTab] ?? 'fisica';
      newPhotoErrMap[newTab] = photoErrorByTab[oldTab] ?? false;
      if (tabErrors[oldTab]?.length) newTabErrorsMap[newTab] = tabErrors[oldTab];
      if (fieldErrorsByTab[oldTab]) newFieldErrorsMap[newTab] = fieldErrorsByTab[oldTab];
    });

    setTabs(newTabs);
    setFormDataByTab(newFormMap);
    setPersonTypeByTab(newPersonMap);
    setPhotoErrorByTab(newPhotoErrMap);
    setTabErrors(newTabErrorsMap);
    setFieldErrorsByTab(newFieldErrorsMap);

    const nextActiveIndex = Math.max(0, deletedIndex - 1);
    setActiveTab(newTabs[nextActiveIndex] ?? 1);
  };

  const validateContactForm = (data: ProfileFormData, personType: PersonType) => {
    const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};

    const name = String(data.nome ?? '').trim();
    if (!name) {
      fieldErrors.nome = personType === 'juridica' ? 'Razão social é obrigatória.' : 'Nome é obrigatório.';
    }

    const whatsappDigits = digitsOnly(String(data.whatsapp ?? ''));
    if (!whatsappDigits) {
      fieldErrors.whatsapp = 'WhatsApp é obrigatório.';
    } else if (whatsappDigits.length < 10) {
      fieldErrors.whatsapp = 'WhatsApp inválido (DDD e comprimento).';
    } else if (areAllDigitsEqual(whatsappDigits)) {
      fieldErrors.whatsapp = 'Número inválido';
    } else if (!validateWhatsApp(String(data.whatsapp ?? '')).valid) {
      fieldErrors.whatsapp = 'WhatsApp inválido (DDD e comprimento).';
    }

    const docDigits = digitsOnly(String(data.cpfCnpj ?? ''));
    if (docDigits) {
      if (personType === 'juridica') {
        if (!isValidCNPJ(docDigits)) fieldErrors.cpfCnpj = 'CNPJ inválido.';
      } else {
        if (!isValidCPF(docDigits)) fieldErrors.cpfCnpj = 'CPF inválido.';
      }
    }

    const email = String(data.email ?? '').trim();
    if (email && !isValidEmail(email)) fieldErrors.email = 'Email inválido.';

    const cepDigits = digitsOnly(String(data.cep ?? ''));
    if (cepDigits && !isValidCEP(String(data.cep ?? ''))) fieldErrors.cep = 'CEP inválido.';

    const responsibleCpfDigits = digitsOnly(String(data.responsavelCpf ?? ''));
    if (responsibleCpfDigits && !isValidCPF(String(data.responsavelCpf ?? ''))) {
      fieldErrors.responsavelCpf = 'CPF do responsável inválido.';
    }

    const messages = Object.values(fieldErrors).filter(Boolean) as string[];
    return { fieldErrors, messages };
  };

  const tabsWithErrors = useMemo(() => {
    return Object.keys(tabErrors)
      .map((k) => Number(k))
      .filter((k) => Array.isArray(tabErrors[k]) && tabErrors[k].length > 0);
  }, [tabErrors]);

  const handleSave = () => {
    if (mode !== 'criar') {
      onSave?.(formData);
      onClose();
      return;
    }

    const errorsByTab: Record<number, string[]> = {};
    const fieldErrorsMap: Record<number, Partial<Record<keyof ProfileFormData, string>>> = {};
    const payload: ProfileFormData[] = [];

    tabs.forEach((tab) => {
      const data = formDataByTab[tab] ?? createEmptyFormData();
      const personType = personTypeByTab[tab] ?? 'fisica';
      const { fieldErrors, messages } = validateContactForm(data, personType);
      fieldErrorsMap[tab] = fieldErrors;
      if (messages.length) errorsByTab[tab] = messages;
      payload.push(data);
    });

    setTabErrors(errorsByTab);
    setFieldErrorsByTab(fieldErrorsMap);

    const firstInvalidTab = tabs.find((t) => (errorsByTab[t]?.length ?? 0) > 0);
    if (firstInvalidTab != null) {
      setActiveTab(firstInvalidTab);
      Alert.alert(
        `Aba ${String(firstInvalidTab).padStart(2, '0')} com erro`,
        errorsByTab[firstInvalidTab].join('\n')
      );
      return;
    }

    if (payload.length > 1) onSaveMany?.(payload);
    else onSave?.(payload[0]);
    onClose();
  };

  const renderRadio = (selected: boolean) => (
    <View style={[styles.radioOuter, selected ? styles.radioOuterSelected : null]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
  );

  const readOnly = mode === 'visualizar';
  const disablePersonTypeToggle = mode !== 'criar';

  const titleLabel = mode === 'editar' ? 'Editar contato' : mode === 'visualizar' ? 'Visualizar contato' : 'Criar contato';

  if (!visible) return null;
  const profilePhotoSource = getProfilePhotoSource();

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerTopRow}>
              <View style={styles.headerTitleContainer}>
                <Text style={styles.headerTitle}>{titleLabel}</Text>
              </View>
              <TouchableOpacity onPress={onClose} activeOpacity={0.8}>
                <CloseModalIcon />
              </TouchableOpacity>
            </View>

            {mode === 'criar' && (
              <>
                <TouchableOpacity style={styles.downloadModelContainer} activeOpacity={0.8} onPress={readOnly ? undefined : handleDownloadModel}>
                  <DownloadModelIcon />
                  <Text style={styles.downloadModelText}>Baixar modelo - Planilha do Excel</Text>
                </TouchableOpacity>
                <HeaderActions
                  onImportExcel={readOnly ? () => {} : handleImportExcel}
                  onDeleteTab={
                    readOnly
                      ? () => {}
                      : () => {
                          setDeleteConfirmVisible(true);
                        }
                  }
                  onAddTab={readOnly ? () => {} : handleAddTab}
                />
                <View style={styles.headerDivider} />
                <Stepper
                  tabs={tabs}
                  activeTab={activeTab}
                  canGoLeft={canGoLeft}
                  canGoRight={canGoRight}
                  tabsWithErrors={tabsWithErrors}
                  onStepLeft={() => {
                    if (!canGoLeft) return;
                    setActiveTab(tabs[activeTabIndex - 1]);
                  }}
                  onStepRight={() => {
                    if (!canGoRight) return;
                    setActiveTab(tabs[activeTabIndex + 1]);
                  }}
                  onSelectTab={(step) => setActiveTab(step)}
                />
                <View style={styles.headerDivider} />
              </>
            )}
          </View>

          <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.formContent}>
              <View style={styles.photoTypeSection}>
                <View style={styles.photoContainer}>
                  {profilePhotoSource ? (
                    <Image
                      source={profilePhotoSource}
                      style={styles.profilePhoto}
                      onError={() => setPhotoErrorByTab((prev) => ({ ...prev, [activeTab]: true }))}
                    />
                  ) : (
                    <View style={styles.profilePhotoPlaceholder}>
                      <Image source={AVATAR_PLACEHOLDER} style={styles.avatarPlaceholderImage} resizeMode="contain" />
                    </View>
                  )}
                  {!readOnly ? (
                    <TouchableOpacity
                      style={styles.cameraButton}
                      onPress={onPickProfilePhoto}
                      activeOpacity={0.8}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <CameraIcon />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <View style={styles.personTypeContainer}>
                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={disablePersonTypeToggle ? undefined : () => setPersonTypeByTab((prev) => ({ ...prev, [activeTab]: 'fisica' }))}
                  >
                    {renderRadio(activePersonType === 'fisica')}
                    <Text style={styles.radioLabel}>Fisica</Text>
                  </TouchableOpacity>

                  <View style={styles.radioOptionDivider} />

                  <TouchableOpacity
                    style={styles.radioOption}
                    onPress={disablePersonTypeToggle ? undefined : () => setPersonTypeByTab((prev) => ({ ...prev, [activeTab]: 'juridica' }))}
                  >
                    {renderRadio(activePersonType === 'juridica')}
                    <Text style={styles.radioLabel}>Jurídica</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[styles.sectionContainer, styles.sectionTopSpacing]}>
              <Text style={styles.sectionTitle}>Dados pessoais:</Text>

              <InputField
                label={activePersonType === 'juridica' ? 'Razão social' : 'Nome'}
                value={formData.nome}
                onChangeText={(value) => updateFormField('nome', capitalizeFirstLetterLive(value))}
                required={true}
                placeholder={activePersonType === 'juridica' ? 'Digite a razão social' : 'Digite o nome completo'}
                editable={!readOnly}
                error={fieldErrorsByTab[activeTab]?.nome}
              />
              <InputField
                label={activePersonType === 'fisica' ? 'CPF' : 'CNPJ'}
                value={formData.cpfCnpj}
                onChangeText={(value) => {
                  const masked = activePersonType === 'fisica' ? maskCPF(value) : maskCNPJ(value);
                  updateFormField('cpfCnpj', masked);
                  const digits = digitsOnly(masked);
                  const expectedLen = activePersonType === 'juridica' ? 14 : 11;
                  if (digits.length >= expectedLen) {
                    if (activePersonType === 'juridica') {
                      setFieldError(activeTab, 'cpfCnpj', isValidCNPJ(digits) ? undefined : 'CNPJ inválido.');
                    } else {
                      setFieldError(activeTab, 'cpfCnpj', isValidCPF(digits) ? undefined : 'CPF inválido.');
                    }
                  } else {
                    setFieldError(activeTab, 'cpfCnpj', undefined);
                  }
                }}
                placeholder={activePersonType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                editable={!readOnly}
                error={fieldErrorsByTab[activeTab]?.cpfCnpj}
              />
              {activePersonType === 'juridica' ? (
                <>
                  <InputField
                    label="Nome do Responsável"
                    value={formData.responsavelNome ?? ''}
                    onChangeText={(value) => updateFormField('responsavelNome', capitalizeFirstLetterLive(value))}
                    placeholder="Digite o nome do responsável"
                    editable={!readOnly}
                    error={fieldErrorsByTab[activeTab]?.responsavelNome}
                  />
                  <InputField
                    label="CPF do Responsável"
                    value={formData.responsavelCpf ?? ''}
                    onChangeText={(value) => {
                      const masked = maskCPF(value);
                      updateFormField('responsavelCpf', masked);
                      const digits = digitsOnly(masked);
                      if (digits.length >= 11) {
                        setFieldError(activeTab, 'responsavelCpf', isValidCPF(digits) ? undefined : 'CPF do responsável inválido.');
                      } else {
                        setFieldError(activeTab, 'responsavelCpf', undefined);
                      }
                    }}
                    placeholder="000.000.000-00"
                    editable={!readOnly}
                    error={fieldErrorsByTab[activeTab]?.responsavelCpf}
                  />
                </>
              ) : null}
              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(value) => {
                  const sanitized = sanitizeEmail(value);
                  updateFormField('email', sanitized);
                  if (!sanitized) {
                    setFieldError(activeTab, 'email', undefined);
                    return;
                  }
                  setFieldError(activeTab, 'email', isValidEmail(sanitized) ? undefined : 'Email inválido.');
                }}
                placeholder="seuemail@aqui.com.br"
                editable={!readOnly}
                error={fieldErrorsByTab[activeTab]?.email}
              />
              <InputField
                label="WhatsApp"
                value={formData.whatsapp}
                onChangeText={(value) => {
                  const masked = maskWhatsApp(value);
                  updateFormField('whatsapp', masked);
                  const digits = digitsOnly(masked);
                  if (!digits) {
                    setFieldError(activeTab, 'whatsapp', undefined);
                    return;
                  }
                  if (digits.length >= 10) {
                    if (areAllDigitsEqual(digits)) {
                      setFieldError(activeTab, 'whatsapp', 'Número inválido');
                    } else {
                      setFieldError(activeTab, 'whatsapp', validateWhatsApp(masked).valid ? undefined : 'WhatsApp inválido (DDD e comprimento).');
                    }
                  } else {
                    setFieldError(activeTab, 'whatsapp', undefined);
                  }
                }}
                placeholder="(00) 90000-0000"
                editable={!readOnly}
                required={true}
                error={fieldErrorsByTab[activeTab]?.whatsapp}
              />
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Localização:</Text>
              <StateSelector
                value={formData.estado}
                onChange={(uf) => updateFormField('estado', uf)}
                disabled={readOnly}
              />
              <InputField
                label="CEP"
                value={formData.cep}
                onChangeText={(value) => {
                  const masked = maskCEP(value);
                  updateFormField('cep', masked);
                  const digits = digitsOnly(masked);
                  if (digits.length >= 8) {
                    setFieldError(activeTab, 'cep', isValidCEP(masked) ? undefined : 'CEP inválido.');
                  } else {
                    setFieldError(activeTab, 'cep', undefined);
                  }
                }}
                placeholder="00000-000"
                editable={!readOnly}
                error={fieldErrorsByTab[activeTab]?.cep}
              />
              <InputField
                label="Cidade"
                value={formData.cidade}
                onChangeText={(value) => updateFormField('cidade', capitalizeFirstLetterLive(sanitizeCityNeighborhood(value)))}
                placeholder="Ex: São José do Rio Preto"
                editable={!readOnly}
              />
              <InputField
                label="Bairro"
                value={formData.bairro}
                onChangeText={(value) => updateFormField('bairro', capitalizeFirstLetterLive(sanitizeCityNeighborhood(value)))}
                placeholder="Ex: Centro"
                editable={!readOnly}
              />
              <InputField
                label="Endereço"
                value={formData.endereco}
                onChangeText={(value) => updateFormField('endereco', capitalizeFirstLetterLive(sanitizeAddress(value)))}
                placeholder="Ex: Rua Piratininga"
                editable={!readOnly}
              />
              <InputField
                label="Número"
                value={formData.numero}
                onChangeText={(value) => updateFormField('numero', sanitizeNumberField(value))}
                placeholder="Ex: 650"
                editable={!readOnly}
              />
              <InputField
                label="Complemento"
                value={formData.complemento}
                onChangeText={(value) => updateFormField('complemento', sanitizeComplement(value))}
                placeholder="Ex: Sala 207"
                editable={!readOnly}
              />
            </View>
          </ScrollView>

          {deleteConfirmVisible ? (
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10,
                zIndex: 20000,
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  borderRadius: 12,
                  padding: 20,
                  width: '100%',
                  maxWidth: 265,
                  gap: 10,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 8,
                    backgroundColor: 'rgba(229, 57, 53, 0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: 20,
                  }}
                >
                  <TrashButtonIcon />
                </View>
                <View style={{ alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: COLORS.textPrimary, textAlign: 'center' }}>
                    Deseja excluir este contato?
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' }}>
                    Essa ação não pode ser desfeita.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      height: 40,
                      backgroundColor: COLORS.background,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => setDeleteConfirmVisible(false)}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.textPrimary }}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      height: 40,
                      backgroundColor: '#E53935',
                      borderRadius: 6,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setDeleteConfirmVisible(false);
                      deleteCurrentTab();
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: COLORS.white }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}

          {readOnly ? null : (
            <View style={styles.footerContainer}>
              <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.footerCancelButton} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.footerCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerSaveButton} onPress={handleSave} activeOpacity={0.8}>
                  <Text style={styles.footerSaveText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default InformationGroupContactsNewContact;
