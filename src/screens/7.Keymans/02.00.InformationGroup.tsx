import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Modal } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import InformationGroupProfileContent, {
  PersonType,
  ProfileFormData,
  ScreenMode,
} from './02.01.InformationGroup-Profile';
import InformationGroupContactsContent, { type Contact } from './02.02.InformationGroup-Contacts';
import InformationGroupContactsNewContact from './02.02.InformationGroup-Contacts-NewContact01';
import type { ProfileFormData as ContactFormData } from './02.02.InformationGroup-Contacts-NewContact03';
import InformationGroupRankContent from './02.03.InformationGroup-Rank';
import { useKeyman } from '../../context/KeymanContext';

const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

const BackIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 19L1 10M1 10L10 1M1 10L19 10"
      stroke={COLORS.primary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AlertIcon = () => (
  <Svg width="35" height="35" viewBox="0 0 35 35" fill="none">
    <Path
      d="M28.876 18.072C28.876 11.7858 23.7727 6.67149 17.5 6.67149C11.2273 6.67149 6.12404 11.7858 6.12404 18.072V27.0533H28.8759V18.072H28.876ZM17.506 23.1138C16.6974 23.1138 16.1301 22.5453 16.1301 21.8438C16.1301 21.1301 16.6974 20.5979 17.506 20.5979C18.3147 20.5979 18.8699 21.1301 18.8699 21.8438C18.8699 22.5453 18.3147 23.1138 17.506 23.1138ZM18.4113 19.2355H16.5888L16.1422 13.853H18.8699L18.4113 19.2355ZM16.4746 0H18.5254V3.63088H16.4746V0ZM26.5719 6.97478L29.1334 4.40775L30.5833 5.86078L28.0218 8.42781L26.5719 6.97478ZM4.41164 5.85845L5.86154 4.40542L8.42304 6.97245L6.97313 8.42548L4.41164 5.85845ZM31.377 14.3065H35V16.3618H31.377V14.3065ZM0 14.3065H3.62305V16.3618H0V14.3065ZM29.1885 29.04H5.8115C3.7208 29.04 2.01988 30.7446 2.01988 32.8398V35H32.9801V32.8398C32.9801 30.7446 31.2792 29.04 29.1885 29.04Z"
      fill="#1777CF"
    />
  </Svg>
);

type TabType = 'perfil' | 'contatos' | 'rank';

type ConfirmContext = 'sair' | 'cancelar';

type ProfileSnapshot = {
  personType: PersonType;
  formData: {
    nome: string;
    cpfCnpj: string;
    responsavelNome: string;
    responsavelCpf: string;
    email: string;
    whatsapp: string;
    estado: string;
    cep: string;
    cidade: string;
    bairro: string;
    endereco: string;
    numero: string;
    complemento: string;
    keymanPhotoToken: string;
  };
};

const normalizePhotoToken = (photo: any): string => {
  if (!photo) return '';
  if (typeof photo === 'number') return `asset:${photo}`;
  if (typeof photo === 'string') return `str:${photo}`;
  if (typeof photo?.uri === 'string') return `uri:${photo.uri}`;
  return 'other';
};

const buildProfileSnapshot = (formData: ProfileFormData, personType: PersonType): ProfileSnapshot => ({
  personType,
  formData: {
    nome: String(formData.nome ?? ''),
    cpfCnpj: String(formData.cpfCnpj ?? ''),
    responsavelNome: String(formData.responsavelNome ?? ''),
    responsavelCpf: String(formData.responsavelCpf ?? ''),
    email: String(formData.email ?? ''),
    whatsapp: String(formData.whatsapp ?? ''),
    estado: String(formData.estado ?? ''),
    cep: String(formData.cep ?? ''),
    cidade: String(formData.cidade ?? ''),
    bairro: String(formData.bairro ?? ''),
    endereco: String(formData.endereco ?? ''),
    numero: String(formData.numero ?? ''),
    complemento: String(formData.complemento ?? ''),
    keymanPhotoToken: normalizePhotoToken((formData as any)?.keymanPhoto),
  },
});

const isSameProfileSnapshot = (a: ProfileSnapshot, b: ProfileSnapshot): boolean => {
  if (a.personType !== b.personType) return false;
  return (
    a.formData.nome === b.formData.nome &&
    a.formData.cpfCnpj === b.formData.cpfCnpj &&
    a.formData.responsavelNome === b.formData.responsavelNome &&
    a.formData.responsavelCpf === b.formData.responsavelCpf &&
    a.formData.email === b.formData.email &&
    a.formData.whatsapp === b.formData.whatsapp &&
    a.formData.estado === b.formData.estado &&
    a.formData.cep === b.formData.cep &&
    a.formData.cidade === b.formData.cidade &&
    a.formData.bairro === b.formData.bairro &&
    a.formData.endereco === b.formData.endereco &&
    a.formData.numero === b.formData.numero &&
    a.formData.complemento === b.formData.complemento &&
    a.formData.keymanPhotoToken === b.formData.keymanPhotoToken
  );
};

interface InformationGroupProps {
  visible?: boolean;
  initialTab?: TabType;
  mode: ScreenMode;
  keymanName?: string;
  keymanId?: number;
  keymanPhoto?: any;
  onClose: () => void;
  onSave?: (data: ProfileFormData) => void;
  onOpenSortModal?: () => void;
  onOpenNewContact?: () => void;
  onEditContact?: (contactId: number) => void;
  onViewContact?: (contactId: number) => void;
  onDeleteContact?: (contactId: number) => void;
}

const InformationGroup: React.FC<InformationGroupProps> = ({
  visible = true,
  initialTab = 'perfil',
  mode,
  keymanName,
  keymanId,
  keymanPhoto,
  onClose,
  onSave,
  onOpenSortModal,
  onOpenNewContact,
  onEditContact,
  onViewContact,
  onDeleteContact,
}) => {
  // Hook de fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Hook do contexto global de Keymans
  const { keymans } = useKeyman();

  // Busca o keyman pelo ID no contexto global
  const currentKeyman = useMemo(() => {
    if (!keymanId) return null; //...........Retorna nulo se nao ha ID
    return keymans.find(k => k.id === keymanId) || null; //...Busca pelo ID
  }, [keymans, keymanId]);

  // Dados iniciais do formulario (usa dados reais do contexto)
  const initialFormData = useMemo<ProfileFormData>(
    () => ({
      nome: mode === 'criar' ? '' : (currentKeyman?.name || keymanName || ''), //.........Nome do keyman
      cpfCnpj: mode === 'criar' ? '' : (currentKeyman?.cpfCnpj || ''), //..................CPF ou CNPJ
      responsavelNome: currentKeyman?.nomeResponsavel || '', //...........................Nome do responsavel
      responsavelCpf: currentKeyman?.cpfResponsavel || '', //............................CPF do responsavel
      email: mode === 'criar' ? '' : (currentKeyman?.email || ''), //.....................Email
      whatsapp: mode === 'criar' ? '' : (currentKeyman?.whatsapp || ''), //...............WhatsApp
      estado: mode === 'criar' ? '' : (currentKeyman?.estado || ''), //..................Estado
      cep: mode === 'criar' ? '' : (currentKeyman?.cep || ''), //........................CEP
      cidade: mode === 'criar' ? '' : (currentKeyman?.cidade || ''), //..................Cidade
      bairro: mode === 'criar' ? '' : (currentKeyman?.bairro || ''), //..................Bairro
      endereco: mode === 'criar' ? '' : (currentKeyman?.endereco || ''), //..............Endereco
      numero: mode === 'criar' ? '' : (currentKeyman?.numero || ''), //..................Numero
      complemento: mode === 'criar' ? '' : (currentKeyman?.complemento || ''), //........Complemento
      keymanPhoto: mode === 'criar' ? undefined : (currentKeyman?.photo ? { uri: currentKeyman.photo } : keymanPhoto), //...Foto
    }),
    [keymanName, keymanPhoto, mode, currentKeyman]
  );

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [personType, setPersonType] = useState<PersonType>('fisica');
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmContext, setConfirmContext] = useState<ConfirmContext>('cancelar');
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const initialProfileSnapshotRef = useRef<ProfileSnapshot>(buildProfileSnapshot(initialFormData, 'fisica'));

  useEffect(() => {
    if (!visible) return;
    setActiveTab(initialTab);
    setPersonType('fisica');
    setFormData(initialFormData);
    setShowNewContactModal(false);
    if (mode === 'criar') setContacts([]);
    initialProfileSnapshotRef.current = buildProfileSnapshot(initialFormData, 'fisica');
  }, [visible, initialTab, initialFormData, keymanId, mode]);

  const isProfileDirty = useMemo(() => {
    const current = buildProfileSnapshot(formData, personType);
    return !isSameProfileSnapshot(current, initialProfileSnapshotRef.current);
  }, [formData, personType]);

  const openConfirmModal = (context: ConfirmContext) => {
    setConfirmContext(context);
    setShowCancelModal(true);
  };

  const handleBackPress = () => {
    if (activeTab === 'perfil' && isProfileDirty) {
      openConfirmModal('sair');
      return;
    }
    onClose();
  };

  const handleCancelPress = () => {
    if (activeTab === 'perfil' && isProfileDirty) {
      openConfirmModal('cancelar');
      return;
    }
    onClose();
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    onClose();
  };

  const handleSave = () => {
    onSave?.(formData);
    onClose();
  };

  const handleOpenNewContact = () => {
    setShowNewContactModal(true);
    onOpenNewContact?.();
  };

  const handleCloseNewContact = () => {
    setShowNewContactModal(false);
  };

  const handleSaveNewContact = (data: ContactFormData) => {
    const name = String(data.nome ?? '').trim();
    const whatsapp = String(data.whatsapp ?? '').trim();
    const state = String(data.estado ?? '').trim();
    const photo =
      typeof (data as any)?.keymanPhoto?.uri === 'string' ? String((data as any).keymanPhoto.uri) : '';
    const id = Date.now() + Math.floor(Math.random() * 1000);

    setContacts((prev) => [
      ...prev,
      {
        id,
        name: name.length ? name : 'Sem nome',
        whatsapp,
        state,
        photo,
      },
    ]);
  };

  const handleSaveNewContacts = (items: ContactFormData[]) => {
    const now = Date.now();
    setContacts((prev) => [
      ...prev,
      ...items.map((data, idx) => {
        const name = String(data.nome ?? '').trim();
        const whatsapp = String(data.whatsapp ?? '').trim();
        const state = String(data.estado ?? '').trim();
        const photo =
          typeof (data as any)?.keymanPhoto?.uri === 'string' ? String((data as any).keymanPhoto.uri) : '';
        return {
          id: now + idx + Math.floor(Math.random() * 1000),
          name: name.length ? name : 'Sem nome',
          whatsapp,
          state,
          photo,
        };
      }),
    ]);
  };

  const updateFormField = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const primaryActionLabel = activeTab === 'perfil' ? 'Salvar' : 'Fechar';
  const handlePrimaryAction = activeTab === 'perfil' ? handleSave : onClose;

  if (!visible) return null;
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* ===== Header ===== */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.systemDivider} />
        <View style={styles.tabSelectorContainer}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'perfil' && styles.tabActive]}
              onPress={() => setActiveTab('perfil')}
            >
              <Text style={[styles.tabText, activeTab === 'perfil' && styles.tabTextActive]}>
                Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'contatos' && styles.tabActive]}
              onPress={() => setActiveTab('contatos')}
            >
              <Text style={[styles.tabText, activeTab === 'contatos' && styles.tabTextActive]}>
                Contatos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'rank' && styles.tabActive]}
              onPress={() => setActiveTab('rank')}
            >
              <Text style={[styles.tabText, activeTab === 'rank' && styles.tabTextActive]}>
                Rank
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ===== Content ===== */}
      <View style={styles.content}>
        {activeTab === 'perfil' && (
          <InformationGroupProfileContent
            mode={mode}
            formData={formData}
            onUpdateFormField={updateFormField}
            personType={personType}
            onSetPersonType={setPersonType}
          />
        )}
        {activeTab === 'contatos' && (
          <InformationGroupContactsContent
            onOpenNewContact={handleOpenNewContact}
            onOpenSortModal={onOpenSortModal}
            onEditContact={onEditContact}
            onViewContact={onViewContact}
            onDeleteContact={onDeleteContact}
            contacts={contacts}
            onContactsChange={setContacts}
          />
        )}
        {activeTab === 'rank' && <InformationGroupRankContent />}
      </View>

      {/* ===== Footer ===== */}
      <View style={styles.footerContainer}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handlePrimaryAction}>
            <Text style={styles.saveButtonText}>{primaryActionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ===== Cancel Modal ===== */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIconBox}>
              <AlertIcon />
            </View>
            <Text style={styles.modalTitle}>{confirmContext === 'sair' ? 'Deseja sair' : 'Deseja cancelar'}</Text>
            <Text style={styles.modalMessage}>Todas as alterações não salvas serão perdidas.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmCancel}>
                <Text style={styles.modalConfirmText}>Sim</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <InformationGroupContactsNewContact
        visible={showNewContactModal}
        onClose={handleCloseNewContact}
        mode="criar"
        onSave={handleSaveNewContact}
        onSaveMany={handleSaveNewContacts}
      />
    </SafeAreaView>
  );
};

// ===== BLOCO: ESTILOS =====
const styles = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
  // Botão de voltar
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  // Estilo da divisória entre voltar e tabs
  systemDivider: {
    height: 0.5,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: COLORS.border,
    alignSelf: 'stretch',
  },
  // Grupos e listas
  tabSelectorContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 14,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 6,
    padding: 4,
    borderWidth: 0.3,
    borderColor: COLORS.border,
  },
  // Botões
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  // Textos
  tabText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  // Containers
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  // Containers
  footerContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 16,
    borderTopWidth: 0,
    borderTopColor: COLORS.border,
  },
  // Grupos e listas
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  // Botões
  cancelButton: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Textos
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  // Botões
  saveButton: {
    flex: 1,
    height: 44,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Textos
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
  // Containers
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  // Containers
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 265,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalIconBox: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: 'rgba(23, 119, 207, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  // Textos
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  // Textos
  modalMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Grupos e listas
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  // Botões
  modalCancelButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Textos
  modalCancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  // Botões
  modalConfirmButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Textos
  modalConfirmText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});

export default InformationGroup;
