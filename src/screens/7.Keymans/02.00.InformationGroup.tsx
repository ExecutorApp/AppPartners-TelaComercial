import React, { useEffect, useMemo, useState } from 'react';
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
import InformationGroupRankContent from './02.03.InformationGroup-Rank';

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

type TabType = 'perfil' | 'contatos' | 'rank';

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
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const initialFormData = useMemo<ProfileFormData>(
    () => ({
      nome: keymanName || 'Perola Marina Diniz',
      cpfCnpj: '385.474.956-25',
      email: 'PerolaDiniz@hotmail.com',
      whatsapp: '17 99246-0025',
      estado: 'São Paulo',
      cep: '15200-000',
      cidade: 'São José do Rio Preto',
      bairro: 'Centro',
      endereco: 'Piratininga',
      numero: '650',
      complemento: 'Sala 207',
      keymanPhoto: keymanPhoto,
    }),
    [keymanName, keymanPhoto]
  );

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [personType, setPersonType] = useState<PersonType>('fisica');
  const [formData, setFormData] = useState<ProfileFormData>(initialFormData);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showNewContactModal, setShowNewContactModal] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setActiveTab(initialTab);
    setPersonType('fisica');
    setFormData(initialFormData);
    setShowNewContactModal(false);
  }, [visible, initialTab, initialFormData, keymanId, mode]);

  const handleCancel = () => {
    setShowCancelModal(true);
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

  const handleSaveNewContact = (data: ProfileFormData) => {
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

  const handleSaveNewContacts = (items: ProfileFormData[]) => {
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
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
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
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
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
            <Text style={styles.modalTitle}>Deseja cancelar?</Text>
            <Text style={styles.modalMessage}>Todas as alterações não salvas serão perdidas.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowCancelModal(false)}
              >
                <Text style={styles.modalCancelText}>Não</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={handleConfirmCancel}>
                <Text style={styles.modalConfirmText}>Sim, cancelar</Text>
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
    paddingHorizontal: 20,
  },
  // Containers
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 350,
    gap: 10,
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
