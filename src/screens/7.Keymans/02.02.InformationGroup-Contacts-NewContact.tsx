import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Svg, Path, Rect, G, Defs, ClipPath } from 'react-native-svg';

// Cores do tema
const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  labelText: '#64748B',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

// Ícone de fechar
const CloseIcon = () => (
  <Svg width="38" height="38" viewBox="0 0 38 38" fill="none">
    <Rect width="38" height="38" rx="8" fill={COLORS.background} />
    <Rect width="38" height="38" rx="8" stroke="#EDF2F6" />
    <Path
      d="M25.155 13.2479C24.7959 12.9179 24.2339 12.9173 23.874 13.2466L19 17.7065L14.126 13.2466C13.7661 12.9173 13.2041 12.9179 12.845 13.2479L12.7916 13.297C12.4022 13.6549 12.4029 14.257 12.7931 14.614L17.5863 19L12.7931 23.386C12.4029 23.743 12.4022 24.3451 12.7916 24.703L12.845 24.7521C13.2041 25.0821 13.7661 25.0827 14.126 24.7534L19 20.2935L23.874 24.7534C24.2339 25.0827 24.7959 25.0821 25.155 24.7521L25.2084 24.703C25.5978 24.3451 25.5971 23.743 25.2069 23.386L20.4137 19L25.2069 14.614C25.5971 14.257 25.5978 13.6549 25.2084 13.297L25.155 13.2479Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

// Ícone de importar Excel
const ImportExcelIcon = () => (
  <Svg width="20" height="27" viewBox="0 0 20 27" fill="none">
    <Path
      d="M19.8267 12.1359C19.2322 10.1359 17.4485 8.63593 15.4666 8.63593H14.2775C13.5838 5.63593 11.1065 3.43593 8.13366 3.03593C5.16084 2.73593 2.28712 4.33593 0.899804 7.03593C-0.289323 9.53593 -0.552131 13.6556 1.68501 16.0548C2.29388 16.3028 3.08479 16.5059 3.99392 16.6673C4.05111 16.3379 4.18999 16.0143 4.41355 15.7252L4.53808 15.5858L8.50183 11.5858C9.21051 10.8707 10.3335 10.8041 11.1188 11.4203L11.1665 11.4602L11.3046 11.5858L15.2684 15.5858C15.6279 15.9486 15.8204 16.4162 15.8459 16.8911C17.4506 16.7009 18.6683 16.416 19.1351 16.0548C20.124 15.322 20.124 13.5359 19.8267 12.1359Z"
      fill={COLORS.primary}
    />
    <Path
      d="M13.8762 18C14.1267 17.9977 14.3765 17.9 14.5677 17.7071C14.9547 17.3166 14.9547 16.6835 14.5677 16.2929L10.6039 12.2929L10.5106 12.2097C10.1218 11.9047 9.55975 11.9324 9.20253 12.2929L5.23878 16.2929L5.15634 16.3871C5.05675 16.5164 4.99296 16.6646 4.96496 16.8182C4.96696 16.8185 4.96896 16.8188 4.97096 16.819C4.91431 17.1313 5.00563 17.4656 5.24493 17.7071L5.33829 17.7903C5.5173 17.9308 5.73308 18.0007 5.94868 18C6.19921 17.9977 6.44902 17.9 6.64018 17.7071L8.91229 15.415V17.1314C8.91434 17.1314 8.9164 17.1315 8.91845 17.1316V22L8.92512 22.1166C8.98236 22.614 9.4012 23 9.90939 23L9.91252 23C10.4555 22.995 10.8942 22.5492 10.8942 22V15.415L12.5924 17.1282C12.5944 17.1281 12.5964 17.1281 12.5984 17.128L13.1724 17.7071L13.2658 17.7903C13.4448 17.9308 13.6606 18.0007 13.8762 18Z"
      fill={COLORS.primary}
    />
  </Svg>
);

// Ícone da câmera para foto
const CameraIcon = () => (
  <Svg width="25" height="24" viewBox="0 0 25 24" fill="none">
    <Rect x="5" y="3" width="25" height="24" rx="12" fill={COLORS.white} />
    <Rect x="5.1" y="3.1" width="24.8" height="23.8" rx="11.9" stroke={COLORS.border} strokeWidth="0.2" />
    <Path
      d="M24.0455 11.0571H21.5255C21.4057 11.0571 21.2878 11.0292 21.1823 10.9759C21.0767 10.9226 20.9868 10.8456 20.9204 10.7517L20.1135 9.61063C19.9806 9.42279 19.8007 9.26878 19.5896 9.16226C19.3784 9.05574 19.1427 9 18.9033 9H16.0967C15.8573 9 15.6216 9.05574 15.4104 9.16226C15.1993 9.26878 15.0194 9.42279 14.8865 9.61063L14.0796 10.7517C14.0132 10.8456 13.9233 10.9226 13.8177 10.9759C13.7122 11.0292 13.5943 11.0571 13.4745 11.0571H13.1364V10.7143C13.1364 10.6234 13.0981 10.5361 13.0299 10.4718C12.9617 10.4076 12.8692 10.3714 12.7727 10.3714H11.6818C11.5854 10.3714 11.4929 10.4076 11.4247 10.4718C11.3565 10.5361 11.3182 10.6234 11.3182 10.7143V11.0571H10.9545C10.5688 11.0571 10.1988 11.2016 9.92603 11.4588C9.65325 11.716 9.5 12.0648 9.5 12.4286V19.6286C9.5 19.9923 9.65325 20.3411 9.92603 20.5983C10.1988 20.8555 10.5688 21 10.9545 21H24.0455C24.4312 21 24.8012 20.8555 25.074 20.5983C25.3468 20.3411 25.5 19.9923 25.5 19.6286V12.4286C25.5 12.0648 25.3468 11.716 25.074 11.4588C24.8012 11.2016 24.4312 11.0571 24.0455 11.0571ZM17.5 19.6286C16.6729 19.6286 15.8644 19.3973 15.1767 18.9641C14.489 18.5308 13.953 17.915 13.6365 17.1946C13.32 16.4741 13.2372 15.6813 13.3985 14.9165C13.5599 14.1517 13.9582 13.4491 14.543 12.8977C15.1278 12.3463 15.873 11.9708 16.6842 11.8186C17.4954 11.6665 18.3362 11.7446 19.1003 12.043C19.8644 12.3414 20.5176 12.8468 20.9771 13.4952C21.4366 14.1436 21.6818 14.9059 21.6818 15.6857C21.6818 16.7314 21.2412 17.7343 20.457 18.4737C19.6727 19.2132 18.6091 19.6286 17.5 19.6286Z"
      fill={COLORS.textPrimary}
    />
    <Path
      d="M17.5 13.1143C16.9606 13.1143 16.4333 13.2651 15.9848 13.5476C15.5363 13.8302 15.1867 14.2318 14.9803 14.7017C14.7739 15.1715 14.7199 15.6886 14.8251 16.1874C14.9304 16.6862 15.1901 17.1444 15.5715 17.504C15.9529 17.8636 16.4389 18.1085 16.9679 18.2077C17.497 18.307 18.0453 18.256 18.5437 18.0614C19.042 17.8668 19.468 17.5372 19.7676 17.1143C20.0673 16.6915 20.2273 16.1943 20.2273 15.6857C20.2273 15.0037 19.9399 14.3497 19.4285 13.8674C18.917 13.3852 18.2233 13.1143 17.5 13.1143ZM17.5 17.2286C17.0662 17.2281 16.6502 17.0654 16.3434 16.7762C16.0367 16.4869 15.8641 16.0948 15.8636 15.6857C15.8636 15.5948 15.9019 15.5076 15.9701 15.4433C16.0383 15.379 16.1308 15.3429 16.2273 15.3429C16.3237 15.3429 16.4162 15.379 16.4844 15.4433C16.5526 15.5076 16.5909 15.5948 16.5909 15.6857C16.5909 15.913 16.6867 16.1311 16.8572 16.2918C17.0277 16.4526 17.2589 16.5429 17.5 16.5429C17.5964 16.5429 17.6889 16.579 17.7571 16.6433C17.8253 16.7076 17.8636 16.7948 17.8636 16.8857C17.8636 16.9766 17.8253 17.0639 17.7571 17.1282C17.6889 17.1924 17.5964 17.2286 17.5 17.2286Z"
      fill={COLORS.textPrimary}
    />
  </Svg>
);

// Ícone Radio selecionado
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

// Ícone Radio não selecionado
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

type ScreenMode = 'criar' | 'editar' | 'visualizar';
type PersonType = 'fisica' | 'juridica';

interface ContactFormData {
  nome: string;
  cpfCnpj: string;
  email: string;
  whatsapp: string;
  estado: string;
  cep: string;
  cidade: string;
  bairro: string;
  endereco: string;
  numero: string;
  complemento: string;
}

interface NewContactModalProps {
  visible: boolean;
  onClose: () => void;
  mode: ScreenMode;
  contactId?: number;
  contactData?: Partial<ContactFormData>;
  onSave?: (data: ContactFormData) => void;
  onImportExcel?: () => void;
}

const InformationGroupContactsNewContact: React.FC<NewContactModalProps> = ({
  visible,
  onClose,
  mode,
  contactId,
  contactData,
  onSave,
  onImportExcel,
}) => {
  const [personType, setPersonType] = useState<PersonType>('fisica');
  const [formData, setFormData] = useState<ContactFormData>({
    nome: contactData?.nome || 'Perola Marina Diniz',
    cpfCnpj: contactData?.cpfCnpj || '385.474.956-25',
    email: contactData?.email || 'PerolaDiniz@hotmail.com',
    whatsapp: contactData?.whatsapp || '17 99246-0025',
    estado: contactData?.estado || 'São Paulo',
    cep: contactData?.cep || '15200-000',
    cidade: contactData?.cidade || 'São José do Rio Preto',
    bairro: contactData?.bairro || 'Centro',
    endereco: contactData?.endereco || 'Piratininga',
    numero: contactData?.numero || '650',
    complemento: contactData?.complemento || 'Sala 207',
  });

  const isViewMode = mode === 'visualizar';

  const getTitle = () => {
    switch (mode) {
      case 'criar':
        return 'Criar contato';
      case 'editar':
        return 'Editar contato';
      case 'visualizar':
        return 'Visualizar contato';
      default:
        return 'Criar contato';
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  const handleImportExcel = () => {
    if (onImportExcel) {
      onImportExcel();
    } else {
      Alert.alert(
        'Importar planilha',
        'Selecione um arquivo .xls ou .xlsx para importar os contatos.',
        [{ text: 'OK' }]
      );
    }
  };

  const updateFormField = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderInputField = (
    label: string,
    field: keyof ContactFormData,
    required: boolean = false
  ) => (
    <View style={styles.inputGroup}>
      <View style={styles.labelContainer}>
        <Text style={styles.inputLabel}>
          {label}
          {required && '*'}
        </Text>
      </View>
      <View style={[styles.inputContainer, isViewMode && styles.inputContainerDisabled]}>
        <TextInput
          style={styles.input}
          value={formData[field]}
          onChangeText={(value) => updateFormField(field, value)}
          placeholderTextColor={COLORS.textTertiary}
          editable={!isViewMode}
        />
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{getTitle()}</Text>
            <TouchableOpacity onPress={onClose}>
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {/* Botão Importar Excel */}
            {mode === 'criar' && (
              <TouchableOpacity
                style={styles.importButton}
                onPress={handleImportExcel}
              >
                <ImportExcelIcon />
                <Text style={styles.importButtonText}>
                  Importar planilha de contatos do Excel
                </Text>
              </TouchableOpacity>
            )}

            {/* Foto e tipo de pessoa */}
            <View style={styles.photoTypeSection}>
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: 'https://placehold.co/65x80' }}
                  style={styles.profilePhoto}
                />
                {!isViewMode && (
                  <View style={styles.cameraButton}>
                    <CameraIcon />
                  </View>
                )}
              </View>

              <View style={styles.personTypeContainer}>
                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => !isViewMode && setPersonType('fisica')}
                  disabled={isViewMode}
                >
                  {personType === 'fisica' ? (
                    <RadioSelectedIcon />
                  ) : (
                    <RadioUnselectedIcon />
                  )}
                  <Text style={styles.radioLabel}>Fisica</Text>
                </TouchableOpacity>

                <View style={styles.radioOptionDivider} />

                <TouchableOpacity
                  style={styles.radioOption}
                  onPress={() => !isViewMode && setPersonType('juridica')}
                  disabled={isViewMode}
                >
                  {personType === 'juridica' ? (
                    <RadioSelectedIcon />
                  ) : (
                    <RadioUnselectedIcon />
                  )}
                  <Text style={styles.radioLabel}>Jurídica</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dados pessoais */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Dados pessoais:</Text>

              {renderInputField('Nome', 'nome', true)}
              {renderInputField(
                personType === 'fisica' ? 'CPF' : 'CNPJ',
                'cpfCnpj',
                true
              )}
              {renderInputField('Email', 'email', true)}
              {renderInputField('WhatsApp', 'whatsapp')}
            </View>

            {/* Localização */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Localização:</Text>

              {renderInputField('Estado', 'estado')}
              {renderInputField('CEP', 'cep')}
              {renderInputField('Cidade', 'cidade')}
              {renderInputField('Bairro', 'bairro')}
              {renderInputField('Endereço', 'endereco')}
              {renderInputField('Número', 'numero')}
              {renderInputField('Complemento', 'complemento')}
            </View>

            {/* Botões */}
            {!isViewMode && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxWidth: 384,
    maxHeight: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 14,
    backgroundColor: 'rgba(252, 252, 252, 0.8)',
  },
  headerTitle: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
    gap: 14,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
    gap: 10,
    padding: 14,
  },
  importButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.primary,
  },
  photoTypeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 3,
    paddingTop: 10,
  },
  photoContainer: {
    position: 'relative',
  },
  profilePhoto: {
    width: 65,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cameraButton: {
    position: 'absolute',
    bottom: -7,
    left: 21,
  },
  personTypeContainer: {
    backgroundColor: COLORS.white,
    gap: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radioOptionDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  radioLabel: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  sectionContainer: {
    gap: 10,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    paddingHorizontal: 5,
  },
  inputGroup: {
    height: 64,
    gap: 6,
  },
  labelContainer: {
    paddingHorizontal: 6,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.labelText,
  },
  inputContainer: {
    height: 36,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as any)
      : {}),
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    height: 36,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  saveButton: {
    flex: 1,
    height: 36,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default InformationGroupContactsNewContact;
