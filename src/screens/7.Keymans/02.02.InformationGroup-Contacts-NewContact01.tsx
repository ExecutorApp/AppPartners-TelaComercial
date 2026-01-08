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

type ModalMode = 'criar' | 'editar' | 'visualizar';

interface NewContactModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ModalMode;
  contactData?: Partial<ProfileFormData>;
  onSave?: (data: ProfileFormData) => void;
  onImportExcel?: () => void;
}

const InformationGroupContactsNewContact: React.FC<NewContactModalProps> = ({
  visible,
  onClose,
  mode,
  contactData,
  onImportExcel,
  onSave,
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

  const updateFormField = (field: keyof ProfileFormData, value: string) => {
    setFormDataByTab((prev) => ({ ...prev, [activeTab]: { ...(prev[activeTab] ?? createEmptyFormData()), [field]: value } }));
  };

  useEffect(() => {
    if (!visible) return;

    setTabs([1]);
    setActiveTab(1);
    setPersonTypeByTab({ 1: 'fisica' });

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

  const handleSave = () => {
    onSave?.(formData);
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
                <HeaderActions onImportExcel={readOnly ? () => {} : handleImportExcel} onAddTab={readOnly ? () => {} : handleAddTab} />
                <View style={styles.headerDivider} />
                <Stepper
                  tabs={tabs}
                  activeTab={activeTab}
                  canGoLeft={canGoLeft}
                  canGoRight={canGoRight}
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
                onChangeText={(value) => updateFormField('nome', value)}
                required={true}
                placeholder={activePersonType === 'juridica' ? 'Digite a razão social' : 'Digite o nome completo'}
                editable={!readOnly}
              />
              <InputField
                label={activePersonType === 'fisica' ? 'CPF' : 'CNPJ'}
                value={formData.cpfCnpj}
                onChangeText={(value) => updateFormField('cpfCnpj', value)}
                required={true}
                placeholder={activePersonType === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                editable={!readOnly}
              />
              {activePersonType === 'juridica' ? (
                <>
                  <InputField
                    label="Nome do Responsável"
                    value={formData.responsavelNome ?? ''}
                    onChangeText={(value) => updateFormField('responsavelNome', value)}
                    placeholder="Digite o nome do responsável"
                    editable={!readOnly}
                  />
                  <InputField
                    label="CPF do Responsável"
                    value={formData.responsavelCpf ?? ''}
                    onChangeText={(value) => updateFormField('responsavelCpf', value)}
                    placeholder="000.000.000-00"
                    editable={!readOnly}
                  />
                </>
              ) : null}
              <InputField
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormField('email', value)}
                required={true}
                placeholder="seuemail@aqui.com.br"
                editable={!readOnly}
              />
              <InputField
                label="WhatsApp"
                value={formData.whatsapp}
                onChangeText={(value) => updateFormField('whatsapp', value)}
                placeholder="(00) 90000-0000"
                editable={!readOnly}
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
                onChangeText={(value) => updateFormField('cep', value)}
                placeholder="00000-000"
                editable={!readOnly}
              />
              <InputField
                label="Cidade"
                value={formData.cidade}
                onChangeText={(value) => updateFormField('cidade', value)}
                placeholder="Ex: São José do Rio Preto"
                editable={!readOnly}
              />
              <InputField
                label="Bairro"
                value={formData.bairro}
                onChangeText={(value) => updateFormField('bairro', value)}
                placeholder="Ex: Centro"
                editable={!readOnly}
              />
              <InputField
                label="Endereço"
                value={formData.endereco}
                onChangeText={(value) => updateFormField('endereco', value)}
                placeholder="Ex: Rua Piratininga"
                editable={!readOnly}
              />
              <InputField
                label="Número"
                value={formData.numero}
                onChangeText={(value) => updateFormField('numero', value)}
                placeholder="Ex: 650"
                editable={!readOnly}
              />
              <InputField
                label="Complemento"
                value={formData.complemento}
                onChangeText={(value) => updateFormField('complemento', value)}
                placeholder="Ex: Sala 207"
                editable={!readOnly}
              />
            </View>
          </ScrollView>

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
