import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { Svg, Path } from 'react-native-svg';

// Cores do tema
const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
};

// Ícone de contatos
const ContactsIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.745432 15.4997C0.679108 15.4964 0.616629 15.4676 0.570938 15.4194C0.525248 15.3712 0.499848 15.3073 0.500001 15.2409C0.499954 14.4258 0.66047 13.6188 0.972379 12.8658C1.28429 12.1128 1.74148 11.4286 2.31785 10.8523C2.89412 10.276 3.57829 9.81877 4.33129 9.50686C5.08428 9.19495 5.89134 9.03444 6.70638 9.03448H9.2931C12.7211 9.03448 15.5 11.8134 15.5 15.2414C15.5 15.4853 15.2414 15.5 15.2414 15.5H0.758621L0.745432 15.4997ZM14.9768 14.9828H1.02319C1.08962 13.5201 1.71739 12.1394 2.77592 11.1278C3.83445 10.1163 5.24223 9.55175 6.70638 9.55172H9.2931C12.3487 9.55172 14.8418 11.9605 14.9768 14.9828ZM8 0.5C5.7875 0.5 3.99138 2.29612 3.99138 4.50862C3.99138 6.72112 5.7875 8.51724 8 8.51724C10.2125 8.51724 12.0086 6.72112 12.0086 4.50862C12.0086 2.29612 10.2125 0.5 8 0.5ZM8 1.01724C9.92698 1.01724 11.4914 2.58164 11.4914 4.50862C11.4914 6.4356 9.92698 8 8 8C6.07302 8 4.50862 6.4356 4.50862 4.50862C4.50862 2.58164 6.07302 1.01724 8 1.01724Z"
      fill={COLORS.textSecondary}
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
  </Svg>
);

// Ícone de conversões
const ConversionsIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M10.2246 6.41102C10.2246 5.53345 9.51316 4.82203 8.63559 4.82203H7.36441C6.48684 4.82203 5.77542 5.53345 5.77542 6.41102C5.77542 7.28858 6.48684 8 7.36441 8H8.63559C9.51316 8 10.2246 8.71142 10.2246 9.58898C10.2246 10.4665 9.51316 11.178 8.63559 11.178H7.36441C6.48684 11.178 5.77542 10.4665 5.77542 9.58898M8 4.82203V2.91525M8 13.0847V11.178M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85787 15.5 0.5 12.1421 0.5 8C0.5 3.85787 3.85787 0.5 8 0.5C12.1421 0.5 15.5 3.85787 15.5 8Z"
      stroke={COLORS.textSecondary}
      strokeMiterlimit="10"
    />
  </Svg>
);

// Ícone de mapa/estados
const MapIcon = () => (
  <Svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <Path
      d="M16.978 3.59964C16.9059 3.59964 16.8367 3.57098 16.7857 3.51997C16.7347 3.46896 16.706 3.39978 16.706 3.32764V3.18474C16.706 3.1126 16.7347 3.04341 16.7857 2.9924C16.8367 2.94139 16.9059 2.91273 16.978 2.91273C17.0501 2.91273 17.1193 2.94139 17.1703 2.9924C17.2213 3.04341 17.25 3.1126 17.25 3.18474V3.32764C17.25 3.39978 17.2213 3.46896 17.1703 3.51997C17.1193 3.57098 17.0501 3.59964 16.978 3.59964Z"
      fill={COLORS.textSecondary}
    />
    <Path
      d="M16.978 2.77102C17.0501 2.77102 17.1193 2.74237 17.1703 2.69136C17.2213 2.64035 17.25 2.57116 17.25 2.49902V1.38529C17.25 1.21729 17.0921 1.0866 16.927 1.11811L12.0322 2.05305L5.81403 0.255737L0.477358 1.11696C0.413832 1.12753 0.356118 1.1603 0.314486 1.20944C0.272853 1.25857 0.250003 1.32088 0.25 1.38529V12.3362C0.25 12.5017 0.403272 12.6317 0.566642 12.6046L5.72471 11.746L12.064 13.4333L17.0228 12.6045C17.0863 12.5939 17.144 12.5612 17.1856 12.512C17.2272 12.4629 17.25 12.4006 17.25 12.3362V4.10991C17.25 4.03777 17.2213 3.96859 17.1703 3.91758C17.1193 3.86657 17.0501 3.83791 16.978 3.83791C16.9059 3.83791 16.8367 3.86657 16.7857 3.91758C16.7347 3.96859 16.706 4.03777 16.706 4.10991V12.106L12.2912 12.8438V2.55744L16.706 1.71417V2.49902C16.706 2.57116 16.7347 2.64035 16.7857 2.69136C16.8367 2.74237 16.9059 2.77102 16.978 2.77102ZM0.794 1.61574L5.46652 0.838021V11.2375L0.794 12.0152V1.61574ZM6.01052 0.878787L11.7472 2.53697V12.8098L6.01052 11.2598V0.878787Z"
      fill={COLORS.textSecondary}
    />
    <Path
      d="M16.978 3.59964C16.9059 3.59964 16.8367 3.57098 16.7857 3.51997C16.7347 3.46896 16.706 3.39978 16.706 3.32764V3.18474C16.706 3.1126 16.7347 3.04341 16.7857 2.9924C16.8367 2.94139 16.9059 2.91273 16.978 2.91273C17.0501 2.91273 17.1193 2.94139 17.1703 2.9924C17.2213 3.04341 17.25 3.1126 17.25 3.18474V3.32764C17.25 3.39978 17.2213 3.46896 17.1703 3.51997C17.1193 3.57098 17.0501 3.59964 16.978 3.59964Z"
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
    <Path
      d="M16.978 2.77102C17.0501 2.77102 17.1193 2.74237 17.1703 2.69136C17.2213 2.64035 17.25 2.57116 17.25 2.49902V1.38529C17.25 1.21729 17.0921 1.0866 16.927 1.11811L12.0322 2.05305L5.81403 0.255737L0.477358 1.11696C0.413832 1.12753 0.356118 1.1603 0.314486 1.20944C0.272853 1.25857 0.250003 1.32088 0.25 1.38529V12.3362C0.25 12.5017 0.403272 12.6317 0.566642 12.6046L5.72471 11.746L12.064 13.4333L17.0228 12.6045C17.0863 12.5939 17.144 12.5612 17.1856 12.512C17.2272 12.4629 17.25 12.4006 17.25 12.3362V4.10991C17.25 4.03777 17.2213 3.96859 17.1703 3.91758C17.1193 3.86657 17.0501 3.83791 16.978 3.83791C16.9059 3.83791 16.8367 3.86657 16.7857 3.91758C16.7347 3.96859 16.706 4.03777 16.706 4.10991V12.106L12.2912 12.8438V2.55744L16.706 1.71417V2.49902C16.706 2.57116 16.7347 2.64035 16.7857 2.69136C16.8367 2.74237 16.9059 2.77102 16.978 2.77102ZM0.794 1.61574L5.46652 0.838021V11.2375L0.794 12.0152V1.61574ZM6.01052 0.878787L11.7472 2.53697V12.8098L6.01052 11.2598V0.878787Z"
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
  </Svg>
);

// Ícone de busca
const SearchIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 17 17" fill="none">
    <Path
      d="M16 16L12.4167 12.4167M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
      stroke={COLORS.textSecondary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Dados fake dos estados brasileiros
const brazilianStates = [
  { uf: 'AC', name: 'Acre', count: 1 },
  { uf: 'AL', name: 'Alagoas', count: 0 },
  { uf: 'AP', name: 'Amapá', count: 0 },
  { uf: 'AM', name: 'Amazonas', count: 0 },
  { uf: 'BA', name: 'Bahia', count: 25 },
  { uf: 'CE', name: 'Ceará', count: 32 },
  { uf: 'DF', name: 'Distrito Federal', count: 5 },
  { uf: 'ES', name: 'Espírito Santo', count: 3 },
  { uf: 'GO', name: 'Goiás', count: 8 },
  { uf: 'MA', name: 'Maranhão', count: 2 },
  { uf: 'MT', name: 'Mato Grosso', count: 4 },
  { uf: 'MS', name: 'Mato Grosso do Sul', count: 1 },
  { uf: 'MG', name: 'Minas Gerais', count: 45 },
  { uf: 'PA', name: 'Pará', count: 6 },
  { uf: 'PB', name: 'Paraíba', count: 3 },
  { uf: 'PR', name: 'Paraná', count: 18 },
  { uf: 'PE', name: 'Pernambuco', count: 12 },
  { uf: 'PI', name: 'Piauí', count: 1 },
  { uf: 'RJ', name: 'Rio de Janeiro', count: 38 },
  { uf: 'RN', name: 'Rio Grande do Norte', count: 4 },
  { uf: 'RS', name: 'Rio Grande do Sul', count: 22 },
  { uf: 'RO', name: 'Rondônia', count: 1 },
  { uf: 'RR', name: 'Roraima', count: 0 },
  { uf: 'SC', name: 'Santa Catarina', count: 15 },
  { uf: 'SP', name: 'São Paulo', count: 85 },
  { uf: 'SE', name: 'Sergipe', count: 2 },
  { uf: 'TO', name: 'Tocantins', count: 1 },
];

type ContactFilterType = 'todos';
type ConversionFilterType = 'convertidos' | 'nao_convertidos' | null;
type StateFilterType = string | null;

interface ContactsSortByModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    contactFilter: ContactFilterType;
    conversionFilter: ConversionFilterType;
    stateFilter: StateFilterType;
  }) => void;
  initialContactFilter?: ContactFilterType;
  initialConversionFilter?: ConversionFilterType;
  initialStateFilter?: StateFilterType;
}

const ContactsSortByModal: React.FC<ContactsSortByModalProps> = ({
  visible,
  onClose,
  onApply,
  initialContactFilter = 'todos',
  initialConversionFilter = null,
  initialStateFilter = null,
}) => {
  const [contactFilter, setContactFilter] = useState<ContactFilterType>(initialContactFilter);
  const [conversionFilter, setConversionFilter] = useState<ConversionFilterType>(initialConversionFilter);
  const [stateFilter, setStateFilter] = useState<StateFilterType>(initialStateFilter);
  const [stateSearchText, setStateSearchText] = useState('');

  // Filtrar estados pela busca
  const filteredStates = brazilianStates.filter((state) =>
    state.name.toLowerCase().includes(stateSearchText.toLowerCase()) ||
    state.uf.toLowerCase().includes(stateSearchText.toLowerCase())
  );

  const handleApply = () => {
    onApply({
      contactFilter,
      conversionFilter,
      stateFilter,
    });
    onClose();
  };

  const handleSelectState = (uf: string) => {
    setStateFilter(stateFilter === uf ? null : uf);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.modalTitle}>Ordenar por </Text>
          </View>

          {/* Seção Contatos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ContactsIcon />
              <Text style={styles.sectionTitle}>Contatos:</Text>
            </View>
            <View style={styles.sectionDivider} />
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => setContactFilter('todos')}
            >
              <Text
                style={[
                  styles.optionText,
                  contactFilter === 'todos' && styles.optionTextSelected,
                ]}
              >
                Todos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção Conversões */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ConversionsIcon />
              <Text style={styles.sectionTitle}>Conversões:</Text>
            </View>
            <View style={styles.sectionDivider} />
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() =>
                setConversionFilter(
                  conversionFilter === 'convertidos' ? null : 'convertidos'
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  conversionFilter === 'convertidos' && styles.optionTextSelected,
                ]}
              >
                Convertidos
              </Text>
            </TouchableOpacity>
            <View style={styles.sectionDivider} />
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() =>
                setConversionFilter(
                  conversionFilter === 'nao_convertidos' ? null : 'nao_convertidos'
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  conversionFilter === 'nao_convertidos' && styles.optionTextSelected,
                ]}
              >
                Não convertidos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seção Estados */}
          <View style={styles.statesSection}>
            <View style={styles.statesSectionHeader}>
              <MapIcon />
              <View style={styles.statesTitleContainer}>
                <Text style={styles.sectionTitle}>Estados: </Text>
              </View>
            </View>

            {/* Busca de estados */}
            <View style={styles.stateSearchContainer}>
              <SearchIcon />
              <TextInput
                style={styles.stateSearchInput}
                placeholder="Pesquisar pelo estado"
                placeholderTextColor={COLORS.textTertiary}
                value={stateSearchText}
                onChangeText={setStateSearchText}
              />
            </View>

            {/* Lista de estados */}
            <ScrollView
              style={styles.statesList}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
            >
              {filteredStates.map((state, index) => (
                <View key={state.uf}>
                  <TouchableOpacity
                    style={styles.stateItem}
                    onPress={() => handleSelectState(state.uf)}
                  >
                    <View style={styles.stateNameContainer}>
                      <Text style={styles.stateUf}>{state.uf} - </Text>
                      <Text
                        style={[
                          styles.stateName,
                          stateFilter === state.uf && styles.stateNameSelected,
                        ]}
                      >
                        {state.name}
                      </Text>
                    </View>
                    <Text style={styles.stateCount}>
                      {state.count.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                  {index < filteredStates.length - 1 && (
                    <View style={styles.stateDivider} />
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 343,
    maxHeight: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#676E76',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  titleContainer: {
    paddingHorizontal: 5,
  },
  modalTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  section: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 10,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  sectionDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  optionItem: {
    height: 20,
    justifyContent: 'center',
  },
  optionText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  optionTextSelected: {
    color: COLORS.primary,
  },
  statesSection: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
  },
  statesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 5,
  },
  statesTitleContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  stateSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 10,
    gap: 8,
  },
  stateSearchInput: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.textPrimary,
    paddingVertical: 0,
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as any)
      : {}),
  },
  statesList: {
    maxHeight: 200,
    marginTop: 10,
  },
  stateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  stateNameContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  stateUf: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  stateName: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textPrimary,
  },
  stateNameSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stateCount: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textSecondary,
  },
  stateDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
});

export default ContactsSortByModal;
