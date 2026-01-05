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
  Modal,
} from 'react-native';
import { Svg, Path, Rect, G, Defs, ClipPath, Circle } from 'react-native-svg';

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
  inputBorder: '#CBD5E1',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Ícone de voltar
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

// Ícone de pesquisa
const SearchIcon = () => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path
      d="M16.5 16.5L12.875 12.875M14.8333 8.16667C14.8333 11.8486 11.8486 14.8333 8.16667 14.8333C4.48477 14.8333 1.5 11.8486 1.5 8.16667C1.5 4.48477 4.48477 1.5 8.16667 1.5C11.8486 1.5 14.8333 4.48477 14.8333 8.16667Z"
      stroke={COLORS.textTertiary}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Ícone de troféu conforme Rank.txt (usado para 1º, 2º e 3º)
const TrophyIcon = () => (
  <Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
    <Path d="M3.87327 0.78125C3.87327 0.57405 3.95558 0.375336 4.1021 0.228823C4.24861 0.08231 4.44732 0 4.65452 0L20.2795 0C20.4867 0 20.6854 0.08231 20.832 0.228823C20.9785 0.375336 21.0608 0.57405 21.0608 0.78125C21.0608 1.62187 21.042 2.42188 21.0076 3.18125C21.625 3.28349 22.2157 3.50831 22.7448 3.84247C23.274 4.17663 23.7308 4.61335 24.0885 5.12689C24.4461 5.64042 24.6973 6.22038 24.8272 6.83254C24.9572 7.44471 24.9632 8.07669 24.845 8.69123C24.7268 9.30577 24.4867 9.89041 24.1389 10.4107C23.7912 10.931 23.3427 11.3763 22.8201 11.7205C22.2975 12.0647 21.7112 12.3008 21.0959 12.4148C20.4805 12.5288 19.8486 12.5185 19.2373 12.3844C18.003 15.2984 16.303 16.7234 14.8108 17.0891V20.4844L17.0373 21.0406C17.3405 21.1156 17.6264 21.2516 17.8764 21.4391L20.7483 23.5938C20.8794 23.6921 20.9763 23.8293 21.0252 23.9858C21.0741 24.1423 21.0725 24.3102 21.0207 24.4658C20.9688 24.6214 20.8693 24.7567 20.7363 24.8525C20.6033 24.9484 20.4435 25 20.2795 25H4.65452C4.49055 25 4.33074 24.9484 4.19772 24.8525C4.0647 24.7567 3.96522 24.6214 3.91336 24.4658C3.86151 24.3102 3.85992 24.1423 3.90881 23.9858C3.9577 23.8293 4.0546 23.6921 4.18577 23.5938L7.05765 21.4391C7.30765 21.2516 7.59359 21.1156 7.89671 21.0406L10.1233 20.4844V17.0891C8.63109 16.7234 6.93109 15.2984 5.69671 12.3828C5.08513 12.5176 4.45273 12.5286 3.83685 12.4149C3.22098 12.3013 2.63413 12.0654 2.11095 11.7211C1.58777 11.3769 1.13888 10.9313 0.790783 10.4107C0.442687 9.89005 0.202444 9.30496 0.0842445 8.68994C-0.0339554 8.07493 -0.027716 7.44246 0.102594 6.8299C0.232904 6.21734 0.484643 5.63709 0.842943 5.12345C1.20124 4.6098 1.65884 4.17315 2.18871 3.8393C2.71857 3.50545 3.30997 3.28117 3.92796 3.17969C3.89118 2.38074 3.87294 1.58104 3.87327 0.78125ZM4.02796 4.75C3.21263 4.89918 2.48995 5.36615 2.01891 6.04817C1.54787 6.73018 1.36706 7.57138 1.51624 8.38672C1.66543 9.20205 2.13239 9.92473 2.81441 10.3958C3.49642 10.8668 4.33763 11.0476 5.15296 10.8984C4.63265 9.25781 4.23421 7.23281 4.02796 4.75ZM19.7826 10.8984C20.598 11.0476 21.4392 10.8668 22.1212 10.3958C22.8032 9.92473 23.2702 9.20205 23.4194 8.38672C23.5686 7.57138 23.3877 6.73018 22.9167 6.04817C22.4457 5.36615 21.723 4.89918 20.9076 4.75C20.6998 7.23438 20.3014 9.25781 19.7826 10.8984Z" fill={COLORS.primary} />
  </Svg>
);

// Interface para dados de ranking
interface RankingItem {
  id: string;
  position: number;
  name: string;
  points: number;
  photo?: string;
}

// Props do componente
interface InformationGroupRankProps {
  visible: boolean;
  onClose: () => void;
  keymanId?: string;
  keymanName?: string;
  onNavigateToProfile?: () => void;
  onNavigateToContacts?: () => void;
}

// Dados fake de ranking
const FAKE_RANKING: RankingItem[] = [
  { id: '1', position: 1, name: 'Courtney Henry', points: 5075 },
  { id: '2', position: 2, name: 'Savannah Nguyen', points: 4000 },
  { id: '3', position: 3, name: 'Darlene Robertson', points: 3000 },
  { id: '4', position: 4, name: 'Ronald Richards', points: 2000 },
  { id: '5', position: 5, name: 'Devon Lane', points: 1000 },
  { id: '6', position: 6, name: 'Arlene McCoy', points: 900 },
  { id: '7', position: 7, name: 'Ralph Edwards', points: 800 },
  { id: '8', position: 8, name: 'Brooklyn Simmons', points: 700 },
  { id: '9', position: 9, name: 'Jacob Jones', points: 650 },
  { id: '10', position: 10, name: 'Jenny Wilson', points: 600 },
];

const InformationGroupRank: React.FC<InformationGroupRankProps> = ({
  visible,
  onClose,
  keymanId,
  keymanName = '',
  onNavigateToProfile,
  onNavigateToContacts,
}) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<'Perfil' | 'Contatos' | 'Rank'>('Rank');

  // Filtrar ranking por busca
  const filteredRanking = useMemo(() => {
    if (!searchText.trim()) return FAKE_RANKING;
    const lowerSearch = searchText.toLowerCase();
    return FAKE_RANKING.filter(item =>
      item.name.toLowerCase().includes(lowerSearch)
    );
  }, [searchText]);

  // Fontes de foto fallback (garante imagem em todos os cards)
  const photoSources = useMemo(() => ([
    require('../../../assets/01-Foto.png'),
    require('../../../assets/02-Foto.png'),
    require('../../../assets/03-Foto.png'),
    require('../../../assets/04-Foto.png'),
    require('../../../assets/05-Foto.png'),
  ]), []);

  // Renderizar ícone de posição
  const renderPositionIcon = (position: number) => {
    if (position <= 3) {
      return (
        <View style={styles.trophyWrapper}>
          <TrophyIcon />
          <View style={styles.trophyNumberBox}>
            <Text style={styles.trophyNumber}>{position}</Text>
          </View>
        </View>
      );
    }
    return <Text style={styles.positionNumber}>{position}</Text>;
  };

  // Renderizar item do ranking
  const renderRankingItem = (item: RankingItem, index: number) => {
    const source = item.photo ? ({ uri: item.photo } as any) : photoSources[index % photoSources.length];
    return (
      <View key={item.id} style={styles.rankingItem}>
        {/* Posição */}
        <View style={styles.positionContainer}>
          {renderPositionIcon(item.position)}
        </View>

        {/* Foto */}
        <View style={styles.photoContainer}>
          <Image source={source} style={styles.photo} />
        </View>

        {/* Nome */}
        <View style={styles.nameContainer}>
          <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
        </View>

        {/* Pontos */}
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{item.points}</Text>
        </View>
      </View>
    );
  };

  // Navegação entre abas
  const handleTabPress = (tab: 'Perfil' | 'Contatos' | 'Rank') => {
    if (tab === 'Perfil' && onNavigateToProfile) {
      onNavigateToProfile();
    } else if (tab === 'Contatos' && onNavigateToContacts) {
      onNavigateToContacts();
    } else {
      setActiveTab(tab);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          {/* Botão Voltar */}
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <BackIcon />
          </TouchableOpacity>

          {/* Tab Selector */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Perfil' && styles.tabActive]}
              onPress={() => handleTabPress('Perfil')}
            >
              <Text style={[styles.tabText, activeTab === 'Perfil' && styles.tabTextActive]}>
                Perfil
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Contatos' && styles.tabActive]}
              onPress={() => handleTabPress('Contatos')}
            >
              <Text style={[styles.tabText, activeTab === 'Contatos' && styles.tabTextActive]}>
                Contatos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'Rank' && styles.tabActive]}
              onPress={() => handleTabPress('Rank')}
            >
              <Text style={[styles.tabText, activeTab === 'Rank' && styles.tabTextActive]}>
                Rank
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <SearchIcon />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquise aqui"
              placeholderTextColor={COLORS.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.headerPosition}>
              <Text style={styles.headerText}>Lugar</Text>
            </View>
            <View style={styles.headerName}>
              <Text style={styles.headerText}>Nome</Text>
            </View>
            <View style={styles.headerPoints}>
              <Text style={styles.headerText}>Pontos</Text>
            </View>
          </View>

          {/* Ranking List */}
          <View style={styles.scrollWrapper}>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {filteredRanking.map((item, index) => renderRankingItem(item, index))}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
    gap: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  tabContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 10,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
        outlineColor: 'transparent',
      } as any,
      default: {},
    }),
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerPosition: {
    width: 50,
  },
  headerName: {
    flex: 1,
    paddingLeft: 50,
  },
  headerPoints: {
    width: 60,
    alignItems: 'flex-end',
  },
  headerText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    flexGrow: 1,
    gap: 10,
  },
  bottomSpacer: {
    height: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    gap: 10,
  },
  positionContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyWrapper: {
    width: 25,
    height: 25,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  trophyNumberBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  positionNumber: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  positionNumberSmall: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  trophyNumber: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 16,
    color: COLORS.white,
  },
  photoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  pointsContainer: {
    width: 60,
    alignItems: 'flex-end',
  },
  pointsText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});

export default InformationGroupRank;
