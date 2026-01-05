import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import BottomMenu from '../5.Side Menu/3.BottomMenu';
import SideMenuScreen from '../5.Side Menu/1.SideMenuScreen';
import { RootStackParamList } from '../../types/navigation';
import { Layout } from '../../constants/theme';

const { width } = Dimensions.get('window');

// =====================================================
// ÍCONES SVG
// =====================================================

// Ícone de Sino (Notificação)
const NotificationIcon: React.FC = () => (
  <Svg width="22" height="26" viewBox="0 0 22 26" fill="none">
    <Path
      d="M14.3895 20.1344V21.0575C14.3895 22.0368 14.0067 22.976 13.3254 23.6685C12.644 24.361 11.7198 24.75 10.7562 24.75C9.79263 24.75 8.86849 24.361 8.18711 23.6685C7.50574 22.976 7.12295 22.0368 7.12295 21.0575V20.1344M20.5025 18.2563C19.0446 16.4429 18.0154 15.5198 18.0154 10.5206C18.0154 5.94251 15.715 4.31149 13.8218 3.51934C13.5703 3.41434 13.3335 3.17317 13.2569 2.91066C12.9248 1.76196 11.9938 0.75 10.7562 0.75C9.51858 0.75 8.58699 1.76254 8.25829 2.91182C8.18165 3.17721 7.94492 3.41434 7.69343 3.51934C5.79788 4.31264 3.49982 5.9379 3.49982 10.5206C3.49699 15.5198 2.46775 16.4429 1.00989 18.2563C0.405857 19.0075 0.934954 20.1354 1.99144 20.1354H19.5266C20.5774 20.1354 21.1031 19.004 20.5025 18.2563Z"
      stroke="#3A3F51"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de Menu Hamburguer
const MenuIcon: React.FC = () => (
  <Svg width="18" height="31" viewBox="0 0 18 31" fill="none">
    <Path d="M17.5 31H0V0H17.5V31Z" stroke="#E5E7EB" />
    <Path
      d="M0 9.25C0 8.55859 0.558594 8 1.25 8H16.25C16.9414 8 17.5 8.55859 17.5 9.25C17.5 9.94141 16.9414 10.5 16.25 10.5H1.25C0.558594 10.5 0 9.94141 0 9.25ZM0 15.5C0 14.8086 0.558594 14.25 1.25 14.25H16.25C16.9414 14.25 17.5 14.8086 17.5 15.5C17.5 16.1914 16.9414 16.75 16.25 16.75H1.25C0.558594 16.75 0 16.1914 0 15.5ZM17.5 21.75C17.5 22.4414 16.9414 23 16.25 23H1.25C0.558594 23 0 22.4414 0 21.75C0 21.0586 0.558594 20.5 1.25 20.5H16.25C16.9414 20.5 17.5 21.0586 17.5 21.75Z"
      fill="#3A3F51"
    />
  </Svg>
);

// Ícone de Pesquisa
const SearchIcon: React.FC = () => (
  <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <Path
      d="M15 15L11.6556 11.6556M13.4444 7.22222C13.4444 10.6587 10.6587 13.4444 7.22222 13.4444C3.78578 13.4444 1 10.6587 1 7.22222C1 3.78578 3.78578 1 7.22222 1C10.6587 1 13.4444 3.78578 13.4444 7.22222Z"
      stroke="#7D8592"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de Cofrinho
const PiggyBankIcon: React.FC = () => (
  <Svg width="50" height="50" viewBox="0 0 50 50" fill="none">
    <Rect width={50} height={50} rx={25} fill="#1777CF" />
    <Path
      d="M25.8625 28.3189H24.3984C23.8659 28.3189 23.4347 27.8811 23.4347 27.3405C23.4347 26.8 23.8659 26.3622 24.3984 26.3622H26.9753C27.3267 26.3622 27.6142 26.0703 27.6142 25.7135C27.6142 25.3568 27.3267 25.0649 26.9753 25.0649H25.7667V24.1622C25.7667 23.8054 25.4792 23.5135 25.1278 23.5135C24.7764 23.5135 24.4889 23.8054 24.4889 24.1622V25.0649H24.3984C23.1631 25.0649 22.1568 26.0865 22.1568 27.3405C22.1568 28.5946 23.1631 29.6162 24.3984 29.6162H25.8625C26.395 29.6162 26.8262 30.0541 26.8262 30.5946C26.8262 31.1351 26.395 31.573 25.8625 31.573H23.2377C22.8863 31.573 22.5987 31.8649 22.5987 32.2216C22.5987 32.5784 22.8863 32.8703 23.2377 32.8703H24.4942V33.7946C24.4942 34.1514 24.7817 34.4432 25.1331 34.4432C25.4845 34.4432 25.772 34.1514 25.772 33.7946V32.8703H25.8945C27.1191 32.8541 28.1041 31.8378 28.1041 30.5946C28.1041 29.3405 27.0978 28.3189 25.8625 28.3189Z"
      fill="#FCFCFC"
    />
    <Path
      d="M34.7328 26.8486C34.062 25.2811 33.1355 23.7622 31.9642 22.3405C30.5479 20.6108 29.137 19.4541 28.4182 18.9189L31.1336 13.8054C31.2667 13.5514 31.2241 13.2378 31.0165 13.0378C30.3137 12.3405 29.5682 12 28.7377 12C27.9763 12 27.2788 12.2919 26.6718 12.5514C26.1926 12.7514 25.7401 12.9459 25.3727 12.9459C25.2609 12.9459 25.1651 12.9297 25.0692 12.8919C23.802 12.4216 22.8277 12.1297 21.8853 12.1297C20.6926 12.1297 19.6757 12.6162 18.6801 13.6541C18.4724 13.8703 18.4405 14.2108 18.6055 14.4649L21.5339 18.9568C20.8098 19.5027 19.4255 20.6486 18.0358 22.3405C16.8698 23.7622 15.938 25.2811 15.2672 26.8486C14.4259 28.8216 14 30.8811 14 32.9676C14 35.7405 16.2256 38 18.9569 38H31.0431C33.7744 38 36 35.7405 36 32.9676C36 30.8811 35.5741 28.8216 34.7328 26.8486ZM19.9685 14.1946C20.5862 13.6541 21.1772 13.4162 21.8853 13.4162C22.6413 13.4162 23.4932 13.6757 24.6273 14.1027C24.8616 14.1892 25.1118 14.2324 25.3674 14.2324C25.9903 14.2324 26.5866 13.9838 27.1563 13.7405C27.7047 13.5081 28.2265 13.2865 28.7323 13.2865C28.9773 13.2865 29.3233 13.3297 29.7599 13.6432L27.2043 18.4649H22.7531L19.9685 14.1946ZM31.0431 36.7027H18.9569C16.9284 36.7027 15.2778 35.027 15.2778 32.9676C15.2778 29.5027 16.529 26.2162 18.9889 23.2C20.5436 21.2919 22.1249 20.1081 22.6041 19.7622H27.3853C27.8698 20.1027 29.4458 21.2919 31.0005 23.2C33.4656 26.2162 34.7115 29.4973 34.7115 32.9676C34.7222 35.027 33.0716 36.7027 31.0431 36.7027Z"
      fill="#FCFCFC"
    />
  </Svg>
);

// Ícone de Relógio
const ClockIcon: React.FC = () => (
  <Svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <Path
      d="M6.84596 3.18003C6.8113 2.88162 6.5577 2.65 6.25 2.65C5.91863 2.65 5.65 2.91863 5.65 3.25V6.4L5.65514 6.47849C5.68231 6.68484 5.81538 6.86476 6.00951 6.94969L8.40951 7.99969L8.47523 8.02404C8.76251 8.1119 9.07636 7.97239 9.19969 7.69049L9.22404 7.62477C9.3119 7.33749 9.17239 7.02364 8.89049 6.90031L6.85 6.0076V3.25L6.84596 3.18003Z"
      fill="#91929E"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.25 0.25C2.93629 0.25 0.25 2.93629 0.25 6.25C0.25 9.56371 2.93629 12.25 6.25 12.25C9.56371 12.25 12.25 9.56371 12.25 6.25C12.25 2.93629 9.56371 0.25 6.25 0.25ZM6.25 1.45C8.90097 1.45 11.05 3.59903 11.05 6.25C11.05 8.90097 8.90097 11.05 6.25 11.05C3.59903 11.05 1.45 8.90097 1.45 6.25C1.45 3.59903 3.59903 1.45 6.25 1.45Z"
      fill="#91929E"
    />
    <Path
      d="M6.84596 3.18003C6.8113 2.88162 6.5577 2.65 6.25 2.65C5.91863 2.65 5.65 2.91863 5.65 3.25V6.4L5.65514 6.47849C5.68231 6.68484 5.81538 6.86476 6.00951 6.94969L8.40951 7.99969L8.47523 8.02404C8.76251 8.1119 9.07636 7.97239 9.19969 7.69049L9.22404 7.62477C9.3119 7.33749 9.17239 7.02364 8.89049 6.90031L6.85 6.0076V3.25L6.84596 3.18003Z"
      stroke="#FCFCFC"
      strokeWidth={0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.25 0.25C2.93629 0.25 0.25 2.93629 0.25 6.25C0.25 9.56371 2.93629 12.25 6.25 12.25C9.56371 12.25 12.25 9.56371 12.25 6.25C12.25 2.93629 9.56371 0.25 6.25 0.25ZM6.25 1.45C8.90097 1.45 11.05 3.59903 11.05 6.25C11.05 8.90097 8.90097 11.05 6.25 11.05C3.59903 11.05 1.45 8.90097 1.45 6.25C1.45 3.59903 3.59903 1.45 6.25 1.45Z"
      stroke="#FCFCFC"
      strokeWidth={0.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// =====================================================
// INTERFACE DE DADOS
// =====================================================

interface CommissionItem {
  id: string;
  clientName: string;
  clientPhoto: string | null;
  date: string;
  time: string;
  product: string;
  sale: string;
  commissionValue: string;
}

// =====================================================
// COMPONENTE PRINCIPAL
// =====================================================

const CommissionsHomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Estados
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedPeriod] = useState('Esse mês');
  const [selectedStatus] = useState('Recebidos');
  const [selectedCardId, setSelectedCardId] = useState<string>('1');

  // Dados mock de comissões
  const totalCommission = 'R$ 9.170,30';

  const commissionItems: CommissionItem[] = [
    {
      id: '1',
      clientName: 'João Pedro do Nascimento',
      clientPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '10/11/25',
      time: '09:51',
      product: 'Holding Patrimonial',
      sale: 'Reunião inicial',
      commissionValue: 'R$ 800,00',
    },
    {
      id: '2',
      clientName: 'Joaquim Aparecido Bernardo',
      clientPhoto: null,
      date: '10/11/25',
      time: '09:51',
      product: 'Holding Patrimonial',
      sale: 'Produto completo',
      commissionValue: 'R$ 8.200,00',
    },
  ];

  // Funções
  const handleOpenMenu = () => {
    setMenuVisible(true);
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  const handleCardPress = (id: string) => {
    setSelectedCardId(id);
  };

  // Renderiza um card de comissão
  const renderCommissionCard = (item: CommissionItem) => {
    const isSelected = selectedCardId === item.id;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.commissionCard,
          isSelected && styles.commissionCardSelected,
        ]}
        activeOpacity={0.7}
        onPress={() => handleCardPress(item.id)}
      >
        {/* Coluna da esquerda - Foto e data/hora */}
        <View style={styles.cardLeftColumn}>
          <View style={styles.photoContainer}>
            {/* Foto do cliente */}
            <View style={styles.photoWrapper}>
              {item.clientPhoto ? (
                <Image
                  source={{ uri: item.clientPhoto }}
                  style={styles.clientPhoto}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <View style={styles.avatarHead} />
                  <View style={styles.avatarBody} />
                </View>
              )}
            </View>
            {/* Data e Hora */}
            <View style={styles.dateTimeContainer}>
              <View style={styles.dateRow}>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.dividerThin} />
              <View style={styles.timeRow}>
                <ClockIcon />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Coluna da direita - Informações */}
        <View style={styles.cardRightColumn}>
          {/* Nome do cliente */}
          <View style={styles.clientNameContainer}>
            <Text style={styles.clientName} numberOfLines={1}>
              {item.clientName}
            </Text>
          </View>

          <View style={styles.infoSeparator} />

          {/* Produto */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Produto</Text>
            <Text style={styles.infoValue}>{item.product}</Text>
          </View>

          <View style={styles.infoSeparator} />

          {/* Venda */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Venda</Text>
            <Text style={styles.infoValue}>{item.sale}</Text>
          </View>

          <View style={styles.infoSeparator} />

          {/* Comissão */}
          <View style={styles.commissionRow}>
            <Text style={styles.commissionLabel}>Comissão:</Text>
            <Text style={styles.commissionValue}>{item.commissionValue}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Customizado */}
      <View style={styles.headerWrapper}>
        {/* Status Bar Space */}
        <View style={styles.statusBarSpace} />

        {/* Header Content */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Comissões</Text>
          <View style={styles.headerIcons}>
            {/* Notificação */}
            <TouchableOpacity style={styles.notificationButton}>
              <NotificationIcon />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>6</Text>
              </View>
            </TouchableOpacity>
            {/* Menu */}
            <TouchableOpacity onPress={handleOpenMenu}>
              <MenuIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Linha divisória */}
      <View style={styles.headerDivider} />

      {/* Conteúdo Principal */}
      <View style={styles.mainContent}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Filtros */}
          <View style={styles.filtersRow}>
            {/* Filtro de Períodos */}
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Text style={styles.filterLabel}>Períodos</Text>
              <Text style={styles.filterValue}>{selectedPeriod}</Text>
            </TouchableOpacity>

            {/* Filtro de Status */}
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Text style={styles.filterLabel}>Status</Text>
              <Text style={styles.filterValue}>{selectedStatus}</Text>
            </TouchableOpacity>
          </View>

          {/* Campo de Pesquisa */}
          <View style={styles.searchContainer}>
            <SearchIcon />
            <TextInput
              style={styles.searchInput}
              placeholder="pesquise aqui"
              placeholderTextColor="#91929E"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Card de Comissão Total */}
          <View style={styles.totalCommissionCard}>
            <View style={styles.totalCommissionInfo}>
              <Text style={styles.totalCommissionLabel}>Comissão total</Text>
              <Text style={styles.totalCommissionValue}>{totalCommission}</Text>
            </View>
            <PiggyBankIcon />
          </View>

          {/* Lista de Comissões */}
          <View style={styles.commissionsList}>
            {commissionItems.map(renderCommissionCard)}
          </View>

          {/* Espaço extra para o BottomMenu */}
          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* Menu Inferior */}
      <BottomMenu />

      {/* Menu Lateral */}
      <SideMenuScreen isVisible={menuVisible} onClose={handleCloseMenu} />
    </View>
  );
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },

  // Header
  headerWrapper: {
    backgroundColor: 'rgba(252, 252, 252, 0.80)',
    paddingTop: 1,
    paddingBottom: 1,
  },
  statusBarSpace: {
    height: Platform.OS === 'ios' ? 44 : 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#3A3F51',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  notificationButton: {
    position: 'relative',
    width: 22,
    height: 26,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#1777CF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#FCFCFC',
  },
  headerDivider: {
    height: 0,
    backgroundColor: 'transparent',
  },

  // Main Content
  mainContent: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
  },

  // Filtros
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    gap: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7D8592',
  },
  filterValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },

  // Campo de Pesquisa
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    paddingLeft: 15,
    borderRadius: 8,
    borderWidth: 0.7,
    borderColor: '#D8E0F0',
    gap: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },

  // Card de Comissão Total
  totalCommissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginBottom: 15,
  },
  totalCommissionInfo: {
    gap: 3,
  },
  totalCommissionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#91929E',
  },
  totalCommissionValue: {
    fontSize: 22,
    fontFamily: 'Inter_500Medium',
    color: '#3A3F51',
  },

  // Lista de Comissões
  commissionsList: {
    gap: 11,
  },

  // Card de Comissão
  commissionCard: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 10,
    borderRadius: 8,
    borderWidth: 0.6,
    borderColor: '#D8E0F0',
    gap: 12,
  },
  commissionCardSelected: {
    borderColor: '#1777CF',
    backgroundColor: 'rgba(0, 148, 255, 0.03)',
  },

  // Coluna da esquerda
  cardLeftColumn: {
    width: 79,
  },
  photoContainer: {
    flex: 1,
    padding: 3,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    gap: 3,
  },
  photoWrapper: {
    flex: 1,
    borderRadius: 6,
    overflow: 'hidden',
    minHeight: 112,
  },
  clientPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E8EDF2',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarHead: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#C4CDD5',
    marginTop: 20,
  },
  avatarBody: {
    width: 50,
    height: 40,
    backgroundColor: '#C4CDD5',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 5,
  },
  dateTimeContainer: {
    backgroundColor: '#FCFCFC',
    borderRadius: 8,
  },
  dateRow: {
    paddingVertical: 5,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
    textAlign: 'center',
  },
  dividerThin: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    gap: 5,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#91929E',
    textAlign: 'center',
  },

  // Coluna da direita
  cardRightColumn: {
    flex: 1,
    paddingVertical: 5,
    gap: 10,
  },
  clientNameContainer: {
    height: 17,
    justifyContent: 'center',
  },
  clientName: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#3A3F51',
  },
  infoSeparator: {
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  infoRow: {
    gap: 0,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#7D8592',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  commissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commissionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  commissionValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1777CF',
    textAlign: 'right',
  },
});

export default CommissionsHomeScreen;