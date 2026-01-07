import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Svg, Path, Rect, G, ClipPath, Defs } from 'react-native-svg';

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


// Ícone de busca
const SearchIcon = () => (
  <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <Path
      d="M16 16L12.4167 12.4167M14.3333 7.66667C14.3333 11.3486 11.3486 14.3333 7.66667 14.3333C3.98477 14.3333 1 11.3486 1 7.66667C1 3.98477 3.98477 1 7.66667 1C11.3486 1 14.3333 3.98477 14.3333 7.66667Z"
      stroke={COLORS.textSecondary}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de contatos para o filtro
const ContactsFilterIcon = () => (
  <Svg width="37" height="37" viewBox="0 0 37 37" fill="none">
    <Rect x="0.25" y="0.25" width="36.5" height="36.5" rx="3.75" fill="#F4F4F4" />
    <Rect x="0.25" y="0.25" width="36.5" height="36.5" rx="3.75" stroke={COLORS.border} strokeWidth="0.5" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.82724 28.4997C8.73881 28.4951 8.65551 28.4568 8.59458 28.3925C8.53366 28.3283 8.4998 28.243 8.5 28.1545C8.49994 27.0678 8.71396 25.9917 9.12984 24.9877C9.54572 23.9837 10.1553 23.0715 10.9238 22.3031C11.6922 21.5346 12.6044 20.925 13.6084 20.5091C14.6124 20.0933 15.6885 19.8792 16.7752 19.8793H20.2241C24.7948 19.8793 28.5 23.5845 28.5 28.1552C28.5 28.4803 28.1552 28.5 28.1552 28.5H8.84483L8.82724 28.4997ZM27.8024 27.8103H9.19759C9.28615 25.8602 10.1232 24.0192 11.5346 22.6704C12.9459 21.3217 14.823 20.569 16.7752 20.569H20.2241C24.2983 20.569 27.6224 23.7807 27.8024 27.8103ZM18.5 8.5C15.55 8.5 13.1552 10.8948 13.1552 13.8448C13.1552 16.7948 15.55 19.1897 18.5 19.1897C21.45 19.1897 23.8448 16.7948 23.8448 13.8448C23.8448 10.8948 21.45 8.5 18.5 8.5ZM18.5 9.18966C21.0693 9.18966 23.1552 11.2755 23.1552 13.8448C23.1552 16.4141 21.0693 18.5 18.5 18.5C15.9307 18.5 13.8448 16.4141 13.8448 13.8448C13.8448 11.2755 15.9307 9.18966 18.5 9.18966Z"
      fill={COLORS.textSecondary}
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
  </Svg>
);

// Ícone “Mais” padrão
const PlusBtn = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#FCFCFC" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// Ícone WhatsApp
const WhatsAppIcon = () => (
  <Svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <Path
      d="M8.49121 0.0498047C10.739 0.0506959 12.8509 0.922379 14.4385 2.50391C16.0485 4.10809 16.9343 6.21201 16.9336 8.42773L16.9229 8.84473C16.8192 10.9203 15.9495 12.8604 14.4473 14.3467C12.8489 15.9281 10.7336 16.7988 8.49121 16.7988H8.48828C7.17104 16.7983 5.86473 16.4873 4.69434 15.8975L4.67871 15.8896L4.66113 15.8936L0.0888672 16.9326L1.08301 12.415L1.08691 12.3965L1.07812 12.3799C0.404793 11.1365 0.0501382 9.77486 0.0498047 8.42578V8.4209C0.0519866 6.19069 0.9343 4.08584 2.53516 2.50195C4.13325 0.920626 6.24854 0.0498624 8.49121 0.0498047ZM8.49121 1.27637C4.51587 1.27637 1.2789 4.48454 1.27637 8.42383C1.27637 9.64159 1.61989 10.8752 2.26758 11.9922L2.38574 12.1982L1.71973 15.2314L1.70312 15.3086L1.7793 15.291L4.85254 14.5918L5.05566 14.7021C6.1033 15.2709 7.29032 15.5717 8.48828 15.5723H8.49121C12.4676 15.5723 15.7053 12.3679 15.707 8.42773C15.7077 6.54001 14.9494 4.74446 13.5732 3.37305C12.217 2.02209 10.4117 1.27718 8.49121 1.27637ZM6.18066 4.75977C6.249 4.7626 6.30982 4.76742 6.37109 4.80371C6.43288 4.84036 6.50194 4.91448 6.57227 5.07031C6.65814 5.26065 6.79415 5.5942 6.91504 5.89355C7.03488 6.19033 7.14131 6.4575 7.16699 6.50879C7.21235 6.59925 7.23789 6.69416 7.18359 6.80273C7.11668 6.93605 7.09282 7.00915 7.00098 7.11621C6.90536 7.22737 6.78844 7.34405 6.70117 7.43066C6.65382 7.47765 6.59516 7.53592 6.56738 7.61035C6.53795 7.68947 6.54503 7.77988 6.60742 7.88672C6.7215 8.08168 7.12548 8.74214 7.70898 9.26074C8.457 9.92545 9.08512 10.1374 9.27539 10.2324C9.37579 10.2825 9.46378 10.3077 9.54492 10.2979C9.62815 10.2877 9.69543 10.242 9.75684 10.1719C9.86982 10.0431 10.253 9.59321 10.3848 9.39648C10.4442 9.3076 10.4979 9.2784 10.5498 9.27246C10.6071 9.26602 10.6733 9.28566 10.7637 9.31836C10.8497 9.34969 11.1292 9.48313 11.415 9.62305C11.6993 9.76217 11.9859 9.90563 12.083 9.9541C12.1827 10.0037 12.2595 10.0385 12.3213 10.0723C12.3831 10.106 12.4176 10.133 12.4346 10.1611C12.4402 10.1709 12.4489 10.2003 12.4531 10.2539C12.4571 10.3053 12.4561 10.3727 12.4492 10.4521C12.4354 10.6114 12.3958 10.8173 12.3164 11.0391C12.2411 11.2488 12.0146 11.4629 11.7539 11.6309C11.4937 11.7985 11.2142 11.9107 11.0479 11.9258C10.8663 11.9423 10.7015 11.9819 10.376 11.9385C10.0487 11.8947 9.55897 11.7671 8.74023 11.4453C6.78286 10.6759 5.54603 8.67447 5.44434 8.53906C5.39633 8.47506 5.19975 8.21575 5.01562 7.85449C4.83114 7.49245 4.6612 7.03226 4.66113 6.56738C4.66113 5.63612 5.1491 5.17998 5.32715 4.98633C5.49399 4.80476 5.69042 4.76075 5.80859 4.76074L6.18066 4.75977Z"
      fill={COLORS.textSecondary}
      stroke={COLORS.white}
      strokeWidth="0.1"
    />
  </Svg>
);

// Ícone Mapa/Estado
const MapIcon = () => (
  <Svg width="18" height="14" viewBox="0 0 18 14" fill="none">
    <Path
      d="M16.978 3.59976C16.9059 3.59976 16.8367 3.5711 16.7857 3.52009C16.7347 3.46908 16.706 3.3999 16.706 3.32776V3.18486C16.706 3.11272 16.7347 3.04353 16.7857 2.99252C16.8367 2.94151 16.9059 2.91286 16.978 2.91286C17.0501 2.91286 17.1193 2.94151 17.1703 2.99252C17.2213 3.04353 17.25 3.11272 17.25 3.18486V3.32776C17.25 3.3999 17.2213 3.46908 17.1703 3.52009C17.1193 3.5711 17.0501 3.59976 16.978 3.59976Z"
      fill={COLORS.textSecondary}
    />
    <Path
      d="M16.978 2.77115C17.0501 2.77115 17.1193 2.74249 17.1703 2.69148C17.2213 2.64047 17.25 2.57128 17.25 2.49915V1.38541C17.25 1.21741 17.0921 1.08672 16.927 1.11824L12.0322 2.05317L5.81403 0.255859L0.477358 1.11708C0.413832 1.12766 0.356118 1.16043 0.314486 1.20956C0.272853 1.2587 0.250003 1.32101 0.25 1.38541V12.3364C0.25 12.5018 0.403272 12.6319 0.566642 12.6047L5.72471 11.7462L12.064 13.4334L17.0228 12.6047C17.0863 12.5941 17.144 12.5613 17.1856 12.5121C17.2272 12.463 17.25 12.4007 17.25 12.3364V4.11003C17.25 4.03789 17.2213 3.96871 17.1703 3.9177C17.1193 3.86669 17.0501 3.83803 16.978 3.83803C16.9059 3.83803 16.8367 3.86669 16.7857 3.9177C16.7347 3.96871 16.706 4.03789 16.706 4.11003V12.1061L12.2912 12.844V2.55756L16.706 1.71429V2.49915C16.706 2.57128 16.7347 2.64047 16.7857 2.69148C16.8367 2.74249 16.9059 2.77115 16.978 2.77115ZM0.794 1.61586L5.46652 0.838143V11.2377L0.794 12.0154V1.61586ZM6.01052 0.878909L11.7472 2.53709V12.8099L6.01052 11.2599V0.878909Z"
      fill={COLORS.textSecondary}
    />
    <Path
      d="M16.978 3.59976C16.9059 3.59976 16.8367 3.5711 16.7857 3.52009C16.7347 3.46908 16.706 3.3999 16.706 3.32776V3.18486C16.706 3.11272 16.7347 3.04353 16.7857 2.99252C16.8367 2.94151 16.9059 2.91286 16.978 2.91286C17.0501 2.91286 17.1193 2.94151 17.1703 2.99252C17.2213 3.04353 17.25 3.11272 17.25 3.18486V3.32776C17.25 3.3999 17.2213 3.46908 17.1703 3.52009C17.1193 3.5711 17.0501 3.59976 16.978 3.59976Z"
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
    <Path
      d="M16.978 2.77115C17.0501 2.77115 17.1193 2.74249 17.1703 2.69148C17.2213 2.64047 17.25 2.57128 17.25 2.49915V1.38541C17.25 1.21741 17.0921 1.08672 16.927 1.11824L12.0322 2.05317L5.81403 0.255859L0.477358 1.11708C0.413832 1.12766 0.356118 1.16043 0.314486 1.20956C0.272853 1.2587 0.250003 1.32101 0.25 1.38541V12.3364C0.25 12.5018 0.403272 12.6319 0.566642 12.6047L5.72471 11.7462L12.064 13.4334L17.0228 12.6047C17.0863 12.5941 17.144 12.5613 17.1856 12.5121C17.2272 12.463 17.25 12.4007 17.25 12.3364V4.11003C17.25 4.03789 17.2213 3.96871 17.1703 3.9177C17.1193 3.86669 17.0501 3.83803 16.978 3.83803C16.9059 3.83803 16.8367 3.86669 16.7857 3.9177C16.7347 3.96871 16.706 4.03789 16.706 4.11003V12.1061L12.2912 12.844V2.55756L16.706 1.71429V2.49915C16.706 2.57128 16.7347 2.64047 16.7857 2.69148C16.8367 2.74249 16.9059 2.77115 16.978 2.77115ZM0.794 1.61586L5.46652 0.838143V11.2377L0.794 12.0154V1.61586ZM6.01052 0.878909L11.7472 2.53709V12.8099L6.01052 11.2599V0.878909Z"
      stroke={COLORS.textSecondary}
      strokeWidth="0.5"
    />
  </Svg>
);

// Ícone de 3 pontos verticais
const MoreIcon = () => (
  <Svg width="4" height="18" viewBox="0 0 4 18" fill="none">
    <G clipPath="url(#clip0)">
      <Path
        d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z"
        fill={COLORS.textSecondary}
      />
      <Path
        d="M4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9Z"
        fill={COLORS.textSecondary}
      />
      <Path
        d="M2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.895431 14 0 14.8954 0 16C0 17.1046 0.895431 18 2 18Z"
        fill={COLORS.textSecondary}
      />
    </G>
    <Defs>
      <ClipPath id="clip0">
        <Rect width="4" height="18" rx="2" fill="white" />
      </ClipPath>
    </Defs>
  </Svg>
);

// Dados fake de contatos
const contactsData = [
  {
    id: 1,
    name: 'Kamila dos santos',
    whatsapp: '17 99246-0563',
    state: 'São Paulo',
    photo: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Ruan de Londres 10',
    whatsapp: '17 99246-0563',
    state: 'São Paulo',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 3,
    name: 'Betina do Nascimento',
    whatsapp: '17 98880-9978',
    state: 'São Paulo',
    photo: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
];

interface ContactsScreenProps {
  onOpenSortModal?: () => void;
  onOpenNewContact?: () => void;
  onEditContact?: (contactId: number) => void;
  onViewContact?: (contactId: number) => void;
  onDeleteContact?: (contactId: number) => void;
}

const InformationGroupContacts: React.FC<ContactsScreenProps> = ({
  onOpenSortModal,
  onOpenNewContact,
  onEditContact,
  onViewContact,
  onDeleteContact,
}) => {
  const [searchText, setSearchText] = useState('');
  const [sortFilter, setSortFilter] = useState('Todos');
  const [contactMenuVisible, setContactMenuVisible] = useState<number | null>(null);

  // Lista filtrada
  const filteredContacts = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    return contactsData.filter(
      (c) => term.length === 0 || c.name.toLowerCase().includes(term)
    );
  }, [searchText]);

  const handleOpenContactMenu = (contactId: number) => {
    setContactMenuVisible(contactId);
  };

  const handleCloseContactMenu = () => {
    setContactMenuVisible(null);
  };

  const handleEditContact = (contactId: number) => {
    handleCloseContactMenu();
    if (onEditContact) {
      onEditContact(contactId);
    }
  };

  const handleViewContact = (contactId: number) => {
    handleCloseContactMenu();
    if (onViewContact) {
      onViewContact(contactId);
    }
  };

  const handleDeletePress = (contactId: number) => {
    handleCloseContactMenu();
    onDeleteContact?.(contactId);
  };

  const renderContactCard = (contact: typeof contactsData[0]) => (
    <View key={contact.id} style={styles.contactCard}>
      <Image source={{ uri: contact.photo }} style={styles.contactPhoto} />
      <View style={styles.contactInfo}>
        <View style={styles.contactHeader}>
          <View style={styles.contactNameContainer}>
            <Text style={styles.contactName}>{contact.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => handleOpenContactMenu(contact.id)}
          >
            <MoreIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.contactDivider} />

        <View style={styles.contactRow}>
          <WhatsAppIcon />
          <Text style={styles.contactValue}>{contact.whatsapp}</Text>
        </View>

        <View style={styles.contactDivider} />

        <View style={styles.contactRow}>
          <MapIcon />
          <Text style={styles.contactValue}>{contact.state}</Text>
        </View>
      </View>

      {/* Menu de opções do contato */}
      {contactMenuVisible === contact.id && (
        <View style={styles.contactMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleEditContact(contact.id)}
          >
            <Text style={styles.menuItemText}>Editar</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleViewContact(contact.id)}
          >
            <Text style={styles.menuItemText}>Visualizar</Text>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleDeletePress(contact.id)}
          >
            <Text style={[styles.menuItemText, styles.menuItemDelete]}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.contactsContainer}>
      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={onOpenNewContact}>
          <PlusBtn />
          <Text style={styles.addButtonText}>Contato</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>Ordenar por</Text>
        <TouchableOpacity style={styles.sortDropdown} onPress={onOpenSortModal}>
          <ContactsFilterIcon />
          <View style={styles.sortContent}>
            <Text style={styles.sortTitle}>Contatos:</Text>
            <Text style={styles.sortValue}>{sortFilter}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon />
        <TextInput
          style={styles.searchInput}
          placeholder="pesquise aqui"
          placeholderTextColor={COLORS.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView
        style={styles.contactsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contactsListContent}
      >
        {filteredContacts.map((contact) => renderContactCard(contact))}
      </ScrollView>

      {contactMenuVisible !== null && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={handleCloseContactMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
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
  tabText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  contactsContainer: {
    flex: 1,
    paddingHorizontal: 15,
    gap: 10,
  },
  addButtonContainer: {
    alignItems: 'flex-end',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 32,
    gap: 5,
  },
  addButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
  },
  sortSection: {
    gap: 5,
  },
  sortLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    paddingHorizontal: 5,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.6,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  sortContent: {
    flex: 1,
    gap: 5,
  },
  sortTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  sortValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 14,
    height: 36,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textPrimary,
    paddingVertical: 0,
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0, outlineColor: 'transparent' } as any)
      : {}),
  },
  contactsList: {
    flex: 1,
    marginTop: 5,
  },
  contactsListContent: {
    gap: 10,
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    borderWidth: 0.6,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 5,
    paddingRight: 10,
    gap: 12,
    position: 'relative',
  },
  contactPhoto: {
    width: 75,
    height: 103,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactInfo: {
    flex: 1,
    paddingVertical: 5,
    gap: 10,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
  },
  contactNameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  moreButton: {
    padding: 4,
  },
  contactDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 16,
    gap: 10,
  },
  contactValue: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactMenu: {
    position: 'absolute',
    right: 10,
    top: 30,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
    minWidth: 120,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  menuItemDelete: {
    color: '#E53935',
  },
  menuDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  modalTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  modalMessage: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
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
  modalCancelText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  modalConfirmButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#E53935',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConfirmText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: COLORS.white,
  },
});

export default InformationGroupContacts;
