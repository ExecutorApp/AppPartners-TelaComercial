/**
 * ----------------------------------------===================================
 * 3.2.InformationGroup-SalesFlow-Activities-Chat-Menu.tsx
 * ----------------------------------------===================================
 * Menu lateral de atividades do chat.
 * Exibe produto/fase atual e lista de atividades para navegacao.
 * ----------------------------------------===================================
 */

import React, { memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

// ----------------------------------------===================================
// Constantes de Layout
// ----------------------------------------===================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const MENU_WIDTH = SCREEN_WIDTH * 0.75; // 75% da largura da tela

// ----------------------------------------===================================
// Interfaces
// ----------------------------------------===================================

export type ActivityStatus = 'null' | 'not_started' | 'started' | 'completed';

export type Activity = {
  id: string;
  number: string;
  title: string;
  status: ActivityStatus;
  hasInteraction: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  productName: string;
  phaseName: string;
  activities: Activity[];
  selectedActivityId: string;
  onSelectActivity: (activityId: string) => void;
};

// ----------------------------------------===================================
// Icones SVG
// ----------------------------------------===================================

// Icone de Produto (pasta/livro)
const ProductIcon = memo(() => (
  <Svg width={18} height={15} viewBox="0 0 18 15" fill="none">
    <Path
      d="M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365ZM0.77984 12.9566V3.39879C0.77984 3.14166 0.990597 2.9319 1.24895 2.9319L4.20635 2.93528V8.35873V13.4234L1.24895 13.4201C0.990597 13.4234 0.77984 13.2137 0.77984 12.9566ZM4.20635 13.4234V8.35873V2.93528H3.86642V13.4234H4.20635ZM13.3301 13.4234V2.93528H12.9902V13.4234H13.3301ZM16.4167 12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902V2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566Z"
      fill="#7D8592"
    />
    <Path
      d="M4.20635 2.93528L1.24895 2.9319C0.990597 2.9319 0.77984 3.14166 0.77984 3.39879V12.9566C0.77984 13.2137 0.990597 13.4234 1.24895 13.4201L4.20635 13.4234M4.20635 2.93528H3.86642V13.4234H4.20635M4.20635 2.93528V8.35873V13.4234M12.9902 2.93528H13.3301V13.4234H12.9902M12.9902 2.93528V13.4234M12.9902 2.93528H15.9476C16.206 2.93528 16.4167 3.14505 16.4167 3.40218V12.9566C16.4167 13.2137 16.206 13.4234 15.9476 13.4234H12.9902M15.951 2.25863H14.4349H12.9902H12.0282V1.24365C12.0282 0.614356 11.5149 0.100098 10.8792 0.100098H6.31733C5.68506 0.100098 5.16836 0.610972 5.16836 1.24365V2.25863H4.20635H2.76164H1.24895C0.613273 2.25863 0.0999756 2.7695 0.0999756 3.39879V12.9566C0.0999756 13.5858 0.613273 14.1001 1.24895 14.1001H2.76504H4.20975H12.9902H14.4349H15.951C16.5833 14.1001 17.1 13.5892 17.1 12.9566V3.39879C17.0966 2.7695 16.5833 2.25863 15.951 2.25863ZM5.51169 2.93528H11.6883H12.6503V13.4234H4.54629V2.93528H5.51169ZM5.85163 1.24365C5.85163 0.986516 6.06238 0.776753 6.32073 0.776753H10.8826C11.141 0.776753 11.3517 0.986516 11.3517 1.24365V2.25863H5.85163V1.24365Z"
      stroke="#7D8592"
      strokeWidth={0.2}
    />
  </Svg>
));

// Icone de Fase (escada)
const PhaseIcon = memo(() => (
  <Svg width={17} height={15} viewBox="0 0 17 15" fill="none">
    <Path
      d="M15.8834 0.149902H13.5719H7.31721C7.16995 0.149902 7.05055 0.266243 7.05055 0.409735V2.99829H5.51565C5.36838 2.99829 5.24898 3.11463 5.24898 3.25812V5.41621H3.71396C3.56669 5.41621 3.44729 5.53255 3.44729 5.67604V8.36393H2.32034C2.17307 8.36393 2.05367 8.48028 2.05367 8.62377V11.0468H0.416691C0.269425 11.0468 0.150024 11.1631 0.150024 11.3066V13.8901C0.150024 14.0336 0.269425 14.1499 0.416691 14.1499H15.8834C16.0306 14.1499 16.15 14.0336 16.15 13.8901V0.409735C16.15 0.266243 16.0306 0.149902 15.8834 0.149902ZM13.3052 0.669567V2.99829H11.7702H7.58388V0.669567H13.3052ZM7.31721 3.51796H11.5035V5.41621H9.96865H5.78232V3.51796H7.31721ZM5.51565 5.93587H9.70198V8.36393H8.57489H3.98062V5.93587H5.51565ZM3.71396 8.8836H8.30823V11.0468H6.67138H2.587V8.8836H3.71396ZM0.683358 11.5664H2.32034H6.40471V13.6302H0.683358V11.5664ZM15.6167 13.6302H6.93805V11.5664H8.57489C8.72216 11.5664 8.84156 11.4501 8.84156 11.3066V8.8836H9.96865C10.1159 8.8836 10.2353 8.76726 10.2353 8.62377V5.93587H11.7702C11.9175 5.93587 12.0369 5.81953 12.0369 5.67604V3.51796H13.5719C13.7192 3.51796 13.8386 3.40162 13.8386 3.25812V0.669567H15.6167V13.6302Z"
      fill="#7D8592"
      stroke="#7D8592"
      strokeWidth={0.3}
    />
  </Svg>
));

// Icone de Atividade Concluida (circulo com check azul)
const CheckCircleBlueIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5ZM8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.5312 6.53125C11.825 6.2375 11.825 5.7625 11.5312 5.47188C11.2375 5.18125 10.7625 5.17813 10.4719 5.47188L7.00313 8.94063L5.53438 7.47188C5.24063 7.17813 4.76562 7.17813 4.475 7.47188C4.18437 7.76563 4.18125 8.24063 4.475 8.53125L6.475 10.5312C6.76875 10.825 7.24375 10.825 7.53438 10.5312L11.5312 6.53125Z"
      fill="#1777CF"
    />
  </Svg>
));

// Icone de Atividade Iniciada (circulo com check cinza)
const CheckCircleGrayIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Path
      d="M8 1.5C9.72391 1.5 11.3772 2.18482 12.5962 3.40381C13.8152 4.62279 14.5 6.27609 14.5 8C14.5 9.72391 13.8152 11.3772 12.5962 12.5962C11.3772 13.8152 9.72391 14.5 8 14.5C6.27609 14.5 4.62279 13.8152 3.40381 12.5962C2.18482 11.3772 1.5 9.72391 1.5 8C1.5 6.27609 2.18482 4.62279 3.40381 3.40381C4.62279 2.18482 6.27609 1.5 8 1.5ZM8 16C10.1217 16 12.1566 15.1571 13.6569 13.6569C15.1571 12.1566 16 10.1217 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0C5.87827 0 3.84344 0.842855 2.34315 2.34315C0.842855 3.84344 0 5.87827 0 8C0 10.1217 0.842855 12.1566 2.34315 13.6569C3.84344 15.1571 5.87827 16 8 16ZM11.5312 6.53125C11.825 6.2375 11.825 5.7625 11.5312 5.47188C11.2375 5.18125 10.7625 5.17813 10.4719 5.47188L7.00313 8.94063L5.53438 7.47188C5.24063 7.17813 4.76562 7.17813 4.475 7.47188C4.18437 7.76563 4.18125 8.24063 4.475 8.53125L6.475 10.5312C6.76875 10.825 7.24375 10.825 7.53438 10.5312L11.5312 6.53125Z"
      fill="#7D8592"
    />
  </Svg>
));

// Icone de Atividade Nao Iniciada (circulo vazio cinza)
const EmptyCircleIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7.25} stroke="#6F7DA0" strokeWidth={1.5} />
  </Svg>
));

// Icone de Atividade Nula (X no circulo)
const NullCircleIcon = memo(() => (
  <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={7.25} stroke="#6F7DA0" strokeWidth={1.5} />
    <Path
      d="M5 5L11 11M11 5L5 11"
      stroke="#6F7DA0"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
));

// Icone de Mensagem (balao de chat) - mesmo icone usado na aba Atividades
const MessageIcon = memo(({ color }: { color: string }) => (
  <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
    <Path
      d="M8.5 0C3.8131 0 0 3.39988 0 7.579C0 9.03978 0.466367 10.4548 1.35093 11.6784C1.18348 13.5134 0.734683 14.8756 0.0830167 15.5209C0.0410596 15.5626 0.0133622 15.6162 0.00383647 15.6743C-0.00568924 15.7323 0.00343822 15.7919 0.0299296 15.8445C0.0564211 15.8972 0.0989376 15.9403 0.151474 15.9677C0.20401 15.9951 0.263911 16.0054 0.322717 15.9973C0.437467 15.9813 3.10307 15.6012 5.03115 14.4986C6.12595 14.9362 7.29215 15.158 8.5 15.158C13.1869 15.158 17 11.7581 17 7.579C17 3.39988 13.1869 0 8.5 0ZM4.53333 8.70181C3.9083 8.70181 3.4 8.19823 3.4 7.579C3.4 6.95976 3.9083 6.45618 4.53333 6.45618C5.15837 6.45618 5.66667 6.95976 5.66667 7.579C5.66667 8.19823 5.15837 8.70181 4.53333 8.70181ZM8.5 8.70181C7.87497 8.70181 7.36667 8.19823 7.36667 7.579C7.36667 6.95976 7.87497 6.45618 8.5 6.45618C9.12503 6.45618 9.63333 6.95976 9.63333 7.579C9.63333 8.19823 9.12503 8.70181 8.5 8.70181ZM12.4667 8.70181C11.8416 8.70181 11.3333 8.19823 11.3333 7.579C11.3333 6.95976 11.8416 6.45618 12.4667 6.45618C13.0917 6.45618 13.6 6.95976 13.6 7.579C13.6 8.19823 13.0917 8.70181 12.4667 8.70181Z"
      fill={color}
    />
  </Svg>
));

// ----------------------------------------===================================
// Linha Tracejada (SVG)
// Configuracao padronizada igual as abas Fases e Atividades
// ----------------------------------------===================================

const DASHED_LINE_CONFIG = {
  dashLength: 3,        // altura de cada traco (pedaco) da linha tracejada
  dashGap: 2,           // espacamento entre cada traco da linha tracejada
  strokeWidth: 3,       // largura de cada traco da linha tracejada
  lineWidth: 10,        // largura do container SVG
  strokeColor: '#5F758B', // cor da linha tracejada
  strokeOpacity: 0.5,   // opacidade da linha tracejada
};

// Linha tracejada vertical
const DashedLine = memo(({ height = 15 }: { height?: number }) => (
  <Svg
    width={DASHED_LINE_CONFIG.lineWidth}
    height={height}
    viewBox={`0 0 ${DASHED_LINE_CONFIG.lineWidth} ${height}`}
    fill="none"
  >
    <Path
      d={`M${DASHED_LINE_CONFIG.lineWidth / 2} 0V${height}`}
      stroke={DASHED_LINE_CONFIG.strokeColor}
      strokeOpacity={DASHED_LINE_CONFIG.strokeOpacity}
      strokeWidth={DASHED_LINE_CONFIG.strokeWidth}
      strokeDasharray={`${DASHED_LINE_CONFIG.dashLength} ${DASHED_LINE_CONFIG.dashGap}`}
    />
  </Svg>
));

// ----------------------------------------===================================
// Funcoes Auxiliares
// ----------------------------------------===================================

const getStatusLabel = (status: ActivityStatus): string => {
  switch (status) {
    case 'completed':
      return 'Atividade concluida';
    case 'started':
      return 'Atividade iniciada';
    case 'not_started':
      return 'Atividade nao iniciada';
    case 'null':
      return 'Nulo';
    default:
      return '';
  }
};

const getStatusIcon = (status: ActivityStatus) => {
  switch (status) {
    case 'completed':
      return <CheckCircleBlueIcon />;
    case 'started':
      return <CheckCircleGrayIcon />;
    case 'not_started':
      return <EmptyCircleIcon />;
    case 'null':
      return <NullCircleIcon />;
    default:
      return null;
  }
};

// ----------------------------------------===================================
// Componente Principal
// ----------------------------------------===================================

const ActivitiesChatMenu: React.FC<Props> = ({
  visible,
  onClose,
  productName,
  phaseName,
  activities,
  selectedActivityId,
  onSelectActivity,
}) => {
  const insets = useSafeAreaInsets();

  const handleSelectActivity = (activityId: string) => {
    onSelectActivity(activityId);
    // Menu permanece aberto - fecha apenas ao clicar fora (overlay)
  };

  // Funcao para exibir tooltip com titulo completo
  const showTitleTooltip = (title: string) => {
    Alert.alert('Atividade', title);
  };

  // Renderiza um card de atividade
  const renderActivityCard = (activity: Activity, index: number) => {
    const isSelected = activity.id === selectedActivityId;

    return (
      <View key={activity.id}>
        {/* Linha tracejada entre cards */}
        {index > 0 && (
          <View style={styles.dashedLineContainer}>
            <DashedLine height={18} />
          </View>
        )}

        <TouchableOpacity
          style={[
            styles.activityCard,
            isSelected && styles.activityCardSelected,
          ]}
          onPress={() => handleSelectActivity(activity.id)}
          activeOpacity={0.7}
        >
          {/* Coluna esquerda: Numero + Icone de status */}
          <View
            style={[
              styles.activityNumberCol,
              isSelected && styles.activityNumberColSelected,
            ]}
          >
            <View style={styles.activityNumberContainer}>
              <Text style={styles.activityNumber}>{activity.number}</Text>
            </View>
            <View style={styles.activityDivider} />
            <View style={styles.activityIconContainer}>
              {getStatusIcon(activity.status)}
            </View>
          </View>

          {/* Coluna direita: Titulo + Status */}
          <View
            style={[
              styles.activityContentCol,
              isSelected && styles.activityContentColSelected,
            ]}
          >
            <View style={styles.activityTitleRow}>
              <View style={styles.activityTitleContainer}>
                <Text
                  style={styles.activityTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {activity.title}
                </Text>
              </View>
              <View style={styles.activityMessageIconContainer}>
                <MessageIcon color={activity.hasInteraction ? '#1777CF' : '#91929E'} />
              </View>
            </View>
            <View style={styles.activityStatusDivider} />
            <View style={styles.activityStatusContainer}>
              <Text style={styles.activityStatusText}>
                {getStatusLabel(activity.status)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.menuContainer, { paddingTop: insets.top + 20 }]}>
              {/* Card Produto/Fase */}
              <View style={styles.productPhaseCard}>
                {/* Produto */}
                <View style={styles.productRow}>
                  <ProductIcon />
                  <View style={styles.productTextContainer}>
                    <Text style={styles.productText}>{productName}</Text>
                  </View>
                </View>

                {/* Linha tracejada entre produto e fase */}
                <View style={styles.productPhaseDashedContainer}>
                  <DashedLine height={25} />
                </View>

                {/* Divisor horizontal */}
                <View style={styles.productPhaseDivider} />

                {/* Fase */}
                <View style={styles.phaseRow}>
                  <PhaseIcon />
                  <View style={styles.phaseTextContainer}>
                    <Text style={styles.phaseText}>{phaseName}</Text>
                  </View>
                </View>
              </View>

              {/* Titulo Atividades */}
              <View style={styles.activitiesTitleContainer}>
                <View style={styles.activitiesTitleWrapper}>
                  <Text style={styles.activitiesTitle}>Atividades</Text>
                </View>
                <View style={styles.activitiesTitleDivider} />
              </View>

              {/* Lista de Atividades */}
              <ScrollView
                style={styles.activitiesList}
                contentContainerStyle={styles.activitiesListContent}
                showsVerticalScrollIndicator={false}
              >
                {activities.map((activity, index) =>
                  renderActivityCard(activity, index)
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ----------------------------------------===================================
// Estilos
// ----------------------------------------===================================

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: MENU_WIDTH,
    height: '100%',
    backgroundColor: '#FCFCFC',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderRightWidth: 1,
    borderRightColor: '#D8E0F0',
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  // ----------------------------------------
  // Card Produto/Fase
  // ----------------------------------------
  productPhaseCard: {
    alignSelf: 'stretch',
    paddingHorizontal: 10,
    paddingVertical: 15, // 10px original + 5px de respiro (total: 15px acima e 15px abaixo)
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    position: 'relative',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 17,
  },
  productTextContainer: {
    flex: 1,
  },
  productText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  productPhaseDashedContainer: {
    position: 'absolute',
    left: 14, // ajustado para centralizar linha mais larga (width 10)
    top: 31,  // ajustado: 26 original + 5px do padding extra
  },
  productPhaseDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
    marginLeft: 27,
    marginVertical: 10, // 5px original + 5px extra (total: 10px acima e 10px abaixo)
  },
  phaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  phaseTextContainer: {
    flex: 1,
  },
  phaseText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },

  // ----------------------------------------
  // Titulo Atividades
  // ----------------------------------------
  activitiesTitleContainer: {
    alignSelf: 'stretch',
    marginTop: 15,
    gap: 5,
  },
  activitiesTitleWrapper: {
    width: 235,
    borderRadius: 10,
  },
  activitiesTitle: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#3A3F51',
  },
  activitiesTitleDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },

  // ----------------------------------------
  // Lista de Atividades
  // ----------------------------------------
  activitiesList: {
    flex: 1,
    marginTop: 15,
  },
  activitiesListContent: {
    gap: 0,
    paddingBottom: 20,
  },
  dashedLineContainer: {
    alignItems: 'center',
    paddingLeft: 14, // ajustado para centralizar linha mais larga (width 10)
    alignSelf: 'flex-start',
  },

  // ----------------------------------------
  // Card de Atividade
  // ----------------------------------------
  activityCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D8E0F0',
    overflow: 'hidden',
  },
  activityCardSelected: {
    borderColor: '#1777CF',
    borderWidth: 1,
  },

  // Coluna do numero
  activityNumberCol: {
    width: 38,
    height: 66,
    backgroundColor: '#F4F4F4',
    borderRightWidth: 0.5,
    borderRightColor: '#D8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityNumberColSelected: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
    borderRightColor: '#1777CF',
  },
  activityNumberContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 3,
  },
  activityNumber: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#3A3F51',
  },
  activityDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  activityIconContainer: {
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Coluna do conteudo
  activityContentCol: {
    flex: 1,
    padding: 10,
    // Divisoria interna: apenas borderRight na coluna esquerda (evita borda dupla)
    justifyContent: 'center',
    gap: 5,
  },
  activityContentColSelected: {
    backgroundColor: 'rgba(23, 119, 207, 0.03)',
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  activityTitleContainer: {
    flex: 1,
  },
  activityMessageIconContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#3A3F51',
  },
  activityStatusDivider: {
    alignSelf: 'stretch',
    height: 0.5,
    backgroundColor: '#D8E0F0',
  },
  activityStatusContainer: {
    alignSelf: 'stretch',
  },
  activityStatusText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#7D8592',
  },
});

export default ActivitiesChatMenu;
