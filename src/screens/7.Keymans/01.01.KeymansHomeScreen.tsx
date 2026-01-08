import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Svg, Path, Rect } from 'react-native-svg';
import Header from '../5.Side Menu/2.Header';
import BottomMenu from '../5.Side Menu/3.BottomMenu';
import ModalSortBy from './01.01.KeymansHomeScreen-Modal-SortBy';
import KeymansOptionsModal from './01.02.KeymansHomeScreen-Modal-Options';
import InformationGroup from './02.00.InformationGroup';

const { height: winHeight } = Dimensions.get('window');

// Altura do BottomMenu (igual ao Layout.bottomMenuHeight do projeto)
const BOTTOM_MENU_HEIGHT = 103;

// Cores do tema
const COLORS = {
  primary: '#1777CF',
  textPrimary: '#3A3F51',
  textSecondary: '#7D8592',
  textTertiary: '#91929E',
  background: '#F4F4F4',
  white: '#FCFCFC',
  border: '#D8E0F0',
  homeIndicator: '#D5D8E2',
};

// Componentes SVG dos ícones
const SearchIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path 
      d="M15 15L11.6556 11.6556M13.4444 7.22222C13.4444 10.6587 10.6587 13.4444 7.22222 13.4444C3.78578 13.4444 1 10.6587 1 7.22222C1 3.78578 3.78578 1 7.22222 1C10.6587 1 13.4444 3.78578 13.4444 7.22222Z" 
      stroke="#7D8592" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </Svg>
);

const ContactsIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M0.245432 14.9997C0.179108 14.9964 0.116629 14.9676 0.0709384 14.9194C0.0252479 14.8712 -0.000152138 14.8073 6.85634e-07 14.7409C-4.55063e-05 13.9258 0.16047 13.1188 0.472379 12.3658C0.784289 11.6128 1.24148 10.9286 1.81785 10.3523C2.39412 9.77596 3.07829 9.31877 3.83129 9.00686C4.58428 8.69495 5.39134 8.53444 6.20638 8.53448H8.7931C12.2211 8.53448 15 11.3134 15 14.7414C15 14.9853 14.7414 15 14.7414 15H0.258621L0.245432 14.9997ZM14.4768 14.4828H0.52319C0.589616 13.0201 1.21739 11.6394 2.27592 10.6278C3.33445 9.61626 4.74223 9.05175 6.20638 9.05172H8.7931C11.8487 9.05172 14.3418 11.4605 14.4768 14.4828ZM7.5 0C5.2875 0 3.49138 1.79612 3.49138 4.00862C3.49138 6.22112 5.2875 8.01724 7.5 8.01724C9.7125 8.01724 11.5086 6.22112 11.5086 4.00862C11.5086 1.79612 9.7125 0 7.5 0ZM7.5 0.517241C9.42698 0.517241 10.9914 2.08164 10.9914 4.00862C10.9914 5.9356 9.42698 7.5 7.5 7.5C5.57302 7.5 4.00862 5.9356 4.00862 4.00862C4.00862 2.08164 5.57302 0.517241 7.5 0.517241Z" 
      fill="#7D8592"
    />
  </Svg>
);

const ConversionsIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path 
      d="M10.0746 6.26099C10.0746 5.38343 9.36313 4.67201 8.48557 4.67201H7.21438C6.33682 4.67201 5.6254 5.38343 5.6254 6.26099C5.6254 7.13856 6.33682 7.84998 7.21438 7.84998H8.48557C9.36313 7.84998 10.0746 8.5614 10.0746 9.43896C10.0746 10.3165 9.36313 11.0279 8.48557 11.0279H7.21438C6.33682 11.0279 5.6254 10.3165 5.6254 9.43896M7.84998 4.67201V2.76523M7.84998 12.9347V11.0279M15.35 7.84998C15.35 11.9921 11.9921 15.35 7.84998 15.35C3.70785 15.35 0.349976 11.9921 0.349976 7.84998C0.349976 3.70785 3.70785 0.349976 7.84998 0.349976C11.9921 0.349976 15.35 3.70785 15.35 7.84998Z" 
      stroke="#7D8592" 
      strokeWidth="0.7" 
      strokeMiterlimit="10"
    />
  </Svg>
);

const RankIcon: React.FC<{ size?: number }> = ({ size = 15 }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path 
      d="M7.50015 8.91965C5.1572 8.92795 3.19808 7.48863 2.99549 5.61021L2.50633 0.621433C2.47208 0.307016 2.76103 0.0297632 3.15174 0.00219905C3.17247 0.000723193 3.19328 -1.05108e-05 3.21409 1.13743e-07H11.7859C12.1785 0.000123998 12.4965 0.256285 12.4964 0.572127C12.4964 0.588573 12.4955 0.605019 12.4937 0.621402L12.0048 5.60761C11.8037 7.48702 9.84417 8.92773 7.50015 8.91965ZM3.21409 0.428577C3.1894 0.42862 3.165 0.432791 3.14242 0.440826C3.11984 0.448861 3.09959 0.460584 3.08294 0.475252C3.06629 0.48992 3.05361 0.507212 3.0457 0.526032C3.0378 0.544852 3.03484 0.564789 3.03702 0.584578L3.52617 5.57401C3.72892 7.34016 5.67245 8.63961 7.86711 8.47645C9.78225 8.33408 11.2987 7.11271 11.4741 5.57144L11.963 0.584578C11.9653 0.564773 11.9624 0.544806 11.9545 0.525955C11.9466 0.507104 11.9339 0.489782 11.9173 0.475099C11.9006 0.460417 11.8803 0.448695 11.8577 0.440684C11.8351 0.432673 11.8106 0.42855 11.7859 0.428577H3.21409ZM12.5675 15H2.4488V13.3648C2.45041 12.2565 3.56643 11.3585 4.94357 11.3572H10.0727C11.4498 11.3585 12.5658 12.2566 12.5674 13.3648L12.5675 15ZM2.98137 14.5715H12.0349V13.3648C12.0336 12.4932 11.1558 11.7868 10.0727 11.7857H4.94357C3.86042 11.7868 2.98267 12.4931 2.98133 13.3648L2.98137 14.5715Z" 
      fill="#7D8592"
    />
    <Path 
      d="M9.95794 11.7857H5.04236V11.1577C5.04775 10.6705 5.54291 10.279 6.14833 10.2833C6.17227 10.2835 6.19621 10.2843 6.22011 10.2857H8.77988C9.38365 10.2494 9.90971 10.6138 9.9549 11.0997C9.9567 11.119 9.9577 11.1383 9.9579 11.1577L9.95794 11.7857ZM5.57493 11.3572H9.42537V11.1576C9.4144 10.9022 9.14812 10.7022 8.83068 10.7111C8.81371 10.7115 8.79678 10.7126 8.77992 10.7143H6.22015C5.90487 10.683 5.6178 10.8633 5.57893 11.117C5.57685 11.1305 5.57555 11.1441 5.57497 11.1576L5.57493 11.3572Z" 
      fill="#7D8592"
    />
    <Path 
      d="M8.30697 8.58278H8.83954V10.5004H8.30697V8.58278ZM6.17673 8.5873H6.7093V10.5004H6.17673V8.5873ZM2.71508 13.2857H12.3012V13.7143H2.71508V13.2857ZM13.64 5.36059H11.7846V4.93201H13.1384L13.3211 2.44628H12.0687V2.01773H13.8861L13.64 5.36059Z" 
      fill="#7D8592"
    />
    <Path 
      d="M13.6539 6.25713H11.6509V5.82856H13.6539C13.9546 5.82862 14.2032 5.64004 14.2208 5.39849L14.466 2.03569C14.4871 1.78467 14.2512 1.56744 13.9393 1.5505C13.9258 1.54976 13.9123 1.54942 13.8988 1.54948H12.1549V1.12093H13.8988C14.0493 1.12095 14.1982 1.14566 14.3364 1.19356C14.4747 1.24146 14.5993 1.31154 14.7027 1.39952C14.8059 1.48741 14.8853 1.59153 14.9361 1.70534C14.9868 1.81915 15.0077 1.94018 14.9975 2.06081L14.7525 5.42253C14.719 5.89103 14.2371 6.25713 13.6539 6.25713ZM3.21544 5.36059H1.35999L1.11395 2.01773H2.93157V2.44628H1.67896L1.86193 4.93201H3.21544V5.36059Z" 
      fill="#7D8592"
    />
    <Path 
      d="M3.3491 6.25713H1.34641C0.763308 6.25726 0.281311 5.89137 0.247482 5.42293L0.00248039 2.06056C-0.00764769 1.94014 0.0133127 1.81933 0.0640422 1.70575C0.114772 1.59216 0.194172 1.48825 0.297244 1.40057C0.400641 1.31257 0.525267 1.24247 0.663493 1.19457C0.80172 1.14667 0.950639 1.12197 1.10114 1.12199H2.84501V1.55056H1.10114C0.788632 1.54945 0.534163 1.7524 0.532778 2.00389C0.532701 2.01442 0.533124 2.02498 0.533971 2.03551L0.779203 5.39979C0.797638 5.64093 1.04618 5.8288 1.34637 5.82859H3.34906L3.3491 6.25713Z" 
      fill="#7D8592"
    />
  </Svg>
);

const PlusIcon = () => (
  <Svg width="8" height="8" viewBox="0 0 8 8" fill="none">
    <Path d="M4 0V8M0 4H8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const MoreIcon = () => (
  <Svg width="4" height="18" viewBox="0 0 4 18" fill="none">
    <Path d="M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z" fill="#7D8592"/>
    <Path d="M4 9C4 10.1046 3.10457 11 2 11C0.895431 11 0 10.1046 0 9C0 7.89543 0.895431 7 2 7C3.10457 7 4 7.89543 4 9Z" fill="#7D8592"/>
    <Path d="M2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.895431 14 0 14.8954 0 16C0 17.1046 0.895431 18 2 18Z" fill="#7D8592"/>
  </Svg>
);

// Dados dos keymans
const keymansData = [
  {
    id: 1,
    name: 'Camila Betanea',
    photo: require('../../../assets/0000001.png'),
    contacts: 85,
    conversions: 4,
    rank: 1,
  },
  {
    id: 2,
    name: 'Ruan de Londres',
    photo: require('../../../assets/0000002.png'),
    contacts: 120,
    conversions: 1,
    rank: 2,
  },
  {
    id: 3,
    name: 'Gabriela de Assis',
    photo: require('../../../assets/0000003.png'),
    contacts: 96,
    conversions: 1,
    rank: 3,
  },
];

const KeymansScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [newKeymanModalVisible, setNewKeymanModalVisible] = useState(false);
  
  // Estado para controlar a ordenação selecionada
  const [selectedCategory, setSelectedCategory] = useState<'contacts' | 'conversions' | 'rank'>('contacts');
  const [selectedOrder, setSelectedOrder] = useState<'asc' | 'desc'>('desc');
  
  // Estado para controlar qual card está selecionado (apenas 1 por vez)
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  
  // Estados para novos modais
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [profileMode, setProfileMode] = useState<'criar' | 'editar'>('editar');
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);
  const [informationGroupInitialTab, setInformationGroupInitialTab] = useState<'perfil' | 'contatos' | 'rank'>('perfil');
  const [selectedKeyman, setSelectedKeyman] = useState<{
    id: number;
    name: string;
    photo: any;
    contacts: number;
    rank: number;
  } | null>(null);

  // Lista derivada filtrada e ordenada (sempre chamada, antes de qualquer retorno condicional)
  const displayedKeymans = useMemo(() => {
    const term = searchText.trim().toLowerCase();
    const base = keymansData.filter(k =>
      term.length === 0 ? true : k.name.toLowerCase().includes(term)
    );

    const key: 'contacts' | 'conversions' | 'rank' = selectedCategory;

    return base.slice().sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (selectedOrder === 'asc') {
        return aVal - bVal;
      }
      return bVal - aVal;
    });
  }, [searchText, selectedCategory, selectedOrder]);
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // Função para mapear categoria para ícone correspondente
  const getCategoryIcon = (category: 'contacts' | 'conversions' | 'rank') => {
    switch (category) {
      case 'contacts':
        return <ContactsIcon size={20} />;
      case 'conversions':
        return <ConversionsIcon size={20} />;
      case 'rank':
        return <RankIcon size={20} />;
      default:
        return <ContactsIcon size={20} />;
    }
  };

  // Função para mapear categoria para texto de categoria
  const getCategoryText = (category: 'contacts' | 'conversions' | 'rank') => {
    switch (category) {
      case 'contacts':
        return 'Base de contatos';
      case 'conversions':
        return 'Conversões';
      case 'rank':
        return 'Rank';
      default:
        return 'Base de contatos';
    }
  };

  // Função para mapear categoria e ordem para texto de ordenação
  const getOrderText = (category: 'contacts' | 'conversions' | 'rank', order: 'asc' | 'desc') => {
    if (category === 'rank') {
      return order === 'asc' ? 'Primeiro para o último' : 'Último para o primeiro';
    } else {
      return order === 'desc' ? 'Maior para o menor' : 'Menor para o maior';
    }
  };

  const handleOpenSortModal = () => {
    setSortModalVisible(true);
  };

  const handleCloseSortModal = () => {
    setSortModalVisible(false);
  };

  const handleSortSelect = (
    category: 'contacts' | 'conversions' | 'rank',
    order: 'asc' | 'desc'
  ) => {
    setSelectedCategory(category);
    setSelectedOrder(order);
  };

  const handleOpenNewKeymanModal = () => {
    // Abre Profile em modo CRIAR
    setSelectedKeyman(null);
    setProfileMode('criar');
    setInformationGroupInitialTab('perfil');
    setProfileModalVisible(true);
  };

  const handleCloseProfileModal = () => {
    setProfileModalVisible(false);
    setSelectedKeyman(null);
  };

  const handleSaveProfile = (data: any) => {
    // Aqui você pode implementar a lógica para salvar o keyman
    setProfileModalVisible(false);
    setSelectedKeyman(null);
  };

  // Handlers para Modal de Opções
  const handleOpenOptionsModal = (keyman: typeof keymansData[0]) => {
    console.log('[Keymans][Home] abrir options', { keymanId: keyman.id, keymanName: keyman.name });
    setSelectedKeyman({
      id: keyman.id,
      name: keyman.name,
      photo: keyman.photo,
      contacts: keyman.contacts,
      rank: keyman.rank,
    });
    setOptionsModalVisible(true);
  };

  const handleCloseOptionsModal = () => {
    console.log('[Keymans][Home] fechar options');
    setOptionsModalVisible(false);
  };

  // Handler para editar perfil via modal de opções
  const handleEditProfile = () => {
    console.log('[Keymans][Home] option editar perfil', { keymanId: selectedKeyman?.id });
    setOptionsModalVisible(false);
    setProfileMode('editar');
    setInformationGroupInitialTab('perfil');
    setProfileModalVisible(true);
  };

  // Handlers para navegar para Contatos
  const handleOpenContacts = () => {
    console.log('[Keymans][Home] option ver contatos', { keymanId: selectedKeyman?.id });
    setOptionsModalVisible(false);
    setProfileMode('editar');
    setInformationGroupInitialTab('contatos');
    setProfileModalVisible(true);
  };

  // Handlers para navegar para Rank
  const handleOpenRank = () => {
    console.log('[Keymans][Home] option ver rank', { keymanId: selectedKeyman?.id });
    setOptionsModalVisible(false);
    setProfileMode('editar');
    setInformationGroupInitialTab('rank');
    setProfileModalVisible(true);
  };

  // Handler para excluir keyman
  const handleDeleteKeyman = () => {
    console.log('[Keymans][Home] confirm excluir', { keymanId: selectedKeyman?.id });
    // Implementar lógica de exclusão
    setOptionsModalVisible(false);
    setSelectedKeyman(null);
  };

  // Função para navegar ao clicar no card (abre Profile em modo EDITAR)
  const handleCardPress = (keyman: typeof keymansData[0]) => {
    setSelectedKeyman({
      id: keyman.id,
      name: keyman.name,
      photo: keyman.photo,
      contacts: keyman.contacts,
      rank: keyman.rank,
    });
    setProfileMode('editar');
    setInformationGroupInitialTab('perfil');
    setProfileModalVisible(true);
  };

  // Função para selecionar/desselecionar card visualmente
  const handleCardSelect = (cardId: number) => {
    setSelectedCardId(prevId => prevId === cardId ? null : cardId);
  };

  const renderKeymanCard = (keyman: typeof keymansData[0], isSelected: boolean = false) => (
    <TouchableOpacity 
      key={keyman.id} 
      activeOpacity={0.7}
      onPress={() => handleCardPress(keyman)}
      style={[
        styles.keymanCard,
        isSelected && styles.keymanCardHighlighted
      ]}
    >
      <Image source={keyman.photo} style={styles.keymanPhoto} />
      <View style={styles.keymanInfo}>
        <View style={styles.keymanHeader}>
          <Text style={styles.keymanName}>{keyman.name}</Text>
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={(e) => {
              e.stopPropagation();
              handleOpenOptionsModal(keyman);
            }}
          >
            <MoreIcon />
          </TouchableOpacity>
        </View>
        
        <View style={styles.metricDivider} />
        
        <View style={styles.statRow}>
          <ContactsIcon />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Base de contatos</Text>
            <Text style={styles.statValue}>{keyman.contacts}</Text>
          </View>
        </View>
        
        <View style={styles.metricDivider} />
        
        <View style={styles.statRow}>
          <ConversionsIcon />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Conversões</Text>
            <Text style={styles.statValue}>{keyman.conversions.toString().padStart(2, '0')}</Text>
          </View>
        </View>
        
        <View style={styles.metricDivider} />
        
        <View style={styles.statRow}>
          <RankIcon />
          <View style={styles.statContent}>
            <Text style={styles.statLabel}>Rank</Text>
            <Text style={styles.statValue}>{keyman.rank.toString().padStart(2, '0')}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header padrão */}
      <Header 
        title={"Keymans (22)"}
        notificationCount={6}
        onMenuPress={() => setSideMenuVisible(true)}
        showBackButton={false}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Controls Section - ÁREA FIXA (fora do scroll) */}
        <View style={styles.controlsSection}>
          {/* Add KeyMan Button */}
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handleOpenNewKeymanModal}>
              <PlusIcon />
              <Text style={styles.addButtonText}>KeyMan</Text>
            </TouchableOpacity>
          </View>
          
          {/* Sort Dropdown */}
          <View style={styles.sortSection}>
            <Text style={styles.sortLabel}>Ordenar por</Text>
            <TouchableOpacity style={styles.sortDropdown} onPress={handleOpenSortModal}>
              <View style={styles.iconContainer}>
                {getCategoryIcon(selectedCategory)}
              </View>
              <View style={styles.sortContent}>
                <Text style={styles.sortTitle}>{getCategoryText(selectedCategory)}:</Text>
                <Text style={styles.sortValue}>{getOrderText(selectedCategory, selectedOrder)}</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
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
        </View>

        {/* ÁREA SCROLLÁVEL: Wrapper do Scroll - A CHAVE PARA FUNCIONAR NO WEB */}
        <View style={styles.scrollWrapper}>
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {displayedKeymans.map((keyman) => (
              <View key={keyman.id} style={styles.cardWrapper}>
                {renderKeymanCard(keyman, selectedCardId === keyman.id)}
              </View>
            ))}
            
            {/* Espaçador final para o BottomMenu */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </View>

      {/* Menu inferior padrão */}
      <BottomMenu activeScreen="Clients" />

      {/* Modal de Ordenação */}
      <ModalSortBy
        visible={sortModalVisible}
        onClose={handleCloseSortModal}
        onSortSelect={handleSortSelect}
      />

      {/* Modal de Perfil do Keyman (criar/editar) */}
      {profileModalVisible && (
        <View style={styles.fullScreenOverlay}>
          <InformationGroup
            visible={profileModalVisible}
            initialTab={informationGroupInitialTab}
            onClose={handleCloseProfileModal}
            mode={profileMode}
            keymanName={selectedKeyman?.name || ''}
            keymanId={selectedKeyman?.id}
            keymanPhoto={
              selectedKeyman?.photo ??
              keymansData.find(k => k.id === selectedKeyman?.id)?.photo
            }
            onSave={handleSaveProfile}
          />
        </View>
      )}

      {/* Modal de Opções do Keyman */}
      <KeymansOptionsModal
        visible={optionsModalVisible}
        onClose={handleCloseOptionsModal}
        keymanId={selectedKeyman?.id ?? 0}
        keymanName={selectedKeyman?.name || ''}
        contactsCount={selectedKeyman?.contacts || 0}
        rankPosition={selectedKeyman?.rank || 0}
        onEditProfile={handleEditProfile}
        onViewContacts={handleOpenContacts}
        onViewRank={handleOpenRank}
        onDelete={handleDeleteKeyman}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: 2,
  },
  controlsSection: {
    paddingHorizontal: 15,
    paddingTop: 15,
    gap: 17,
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
    paddingHorizontal: 15,
    marginBottom: -15,
    gap: 10,
    height: 32,
  },
  addButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.white,
    lineHeight: 17,
  },
  sortSection: {
    gap: 5,
  },
  sortLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 15,
    paddingHorizontal: 5,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 9,
    gap: 10,
  },
  iconContainer: {
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 37,
    height: 37,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortContent: {
    flex: 1,
    gap: 5,
  },
  sortTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  sortValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 17,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingLeft: 14,
    height: 35,
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
  // WRAPPER DO SCROLL - A CHAVE PARA FUNCIONAR NO WEB
  // Usa position relative para que o filho absolute funcione
  scrollWrapper: {
    flex: 1,
    position: 'relative',
    marginTop: 10,
    // overflow hidden garante que os cards desapareçam antes de encostar na barra de pesquisa
    overflow: 'hidden',
  },
  // SCROLLVIEW - No web usa position absolute para ter altura definida
  scrollView: {
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      } as any,
      default: {
        flex: 1,
      },
    }),
  },
  // CONTENT do scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: BOTTOM_MENU_HEIGHT + 20,
    flexGrow: 1,
  },
  // Espaçador no final para não ficar atrás do BottomMenu
  bottomSpacer: {
    height: 0,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  keymanCard: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: COLORS.border,
    gap: 12,
  },
  keymanCardHighlighted: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderColor: COLORS.primary,
  },
  keymanPhoto: {
    width: 78,
    height: 141,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  keymanInfo: {
    flex: 1,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'center',
    gap: 10,
  },
  keymanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 17,
  },
  keymanName: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  moreButton: {
    padding: 4,
  },
  metricDivider: {
    height: 0.5,
    backgroundColor: COLORS.border,
    alignSelf: 'stretch',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 17,
    gap: 10,
  },
  statContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statValue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 15,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 1000,
    ...(Platform.OS !== 'web' ? { elevation: 100 } : {}),
  },
});

export default KeymansScreen;
