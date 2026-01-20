import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import CommercialExecutionModal, { CustomerInfoProps } from './3.2.InformationGroup-SalesFlow-Activities-Commercial-Execution';

// ========================================
// CONFIGURACAO DE POSICAO DO POPUP MENU
// Altere os valores abaixo para ajustar a posicao do popup
// ========================================
const POPUP_POSITION_CONFIG = {
  offsetX: -230, //...Deslocamento horizontal (valores negativos = esquerda, positivos = direita)
  offsetY: 0, //....Deslocamento vertical (valores negativos = acima, positivos = abaixo)
};

// ========================================
// CORES DO TEMA
// ========================================
const COLORS = {
  primary: '#1777CF', //........Cor principal (azul)
  textPrimary: '#3A3F51', //....Cor do texto principal
  textSecondary: '#7D8592', //..Cor do texto secundario
  background: '#F4F4F4', //....Cor de fundo
  white: '#FCFCFC', //.........Cor branca
  border: '#D8E0F0', //........Cor da borda
  orange: '#FF8A00', //........Cor laranja
  red: '#F44336', //...........Cor vermelha
  blue: '#1E88E5', //..........Cor azul
};

// ========================================
// ICONES SVG
// ========================================

// Icone de Status Circulo Vazio
const StatusCircleIcon = ({ size = 16 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Path
      d="M7.64999 14.6499C11.516 14.6499 14.65 11.5159 14.65 7.6499C14.65 3.78391 11.516 0.649902 7.64999 0.649902C3.784 0.649902 0.649994 3.78391 0.649994 7.6499C0.649994 11.5159 3.784 14.6499 7.64999 14.6499Z"
      stroke="#6F7DA0"
      strokeWidth={1.3}
    />
  </Svg>
);

// Icone de Status Check Preenchido
const StatusFilledCheckIcon = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <Circle cx={8} cy={8} r={6.5} fill={color} />
    <Path
      d="M5.2 8.1L7.2 10.1L10.8 6.3"
      stroke={COLORS.white}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone de 3 Pontos Verticais (Menu de Execucao)
const ExecutionMenuIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={4} height={size} viewBox="0 0 4 18" fill="none">
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
  </Svg>
);

// Icone Play (Executar Atividade)
const PlayIcon = () => (
  <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
    <Path
      d="M2.18945 0C2.33705 1.19912e-05 2.47301 0.0460257 2.58514 0.122442C2.58672 0.123517 2.58852 0.124219 2.59041 0.124487C2.59216 0.124667 2.59385 0.125218 2.59538 0.126103L15.1431 7.41895C15.3551 7.53264 15.5 7.74892 15.5 8C15.5 8.25085 15.3548 8.4668 15.1431 8.58057L2.59573 15.8737C2.59411 15.8746 2.59226 15.8751 2.5904 15.875C2.58841 15.8751 2.58649 15.8757 2.58485 15.8768C2.47271 15.9533 2.33712 16 2.18945 16C1.80871 16 1.5 15.7012 1.5 15.333V0.666992C1.5 0.298802 1.80871 0 2.18945 0Z"
      fill={COLORS.textSecondary}
    />
  </Svg>
);

// Icone Chat (Chat Time Operacional)
const ChatIcon = () => (
  <Svg width={17} height={16} viewBox="0 0 17 16" fill="none">
    <Path
      d="M8.5 0C3.8131 0 0 3.39988 0 7.579C0 9.03978 0.466367 10.4548 1.35093 11.6784C1.18348 13.5134 0.734683 14.8756 0.0830167 15.5209C0.0410596 15.5626 0.0133622 15.6162 0.00383647 15.6743C-0.00568924 15.7323 0.00343822 15.7919 0.0299296 15.8445C0.0564211 15.8972 0.0989376 15.9403 0.151474 15.9677C0.20401 15.9951 0.263911 16.0054 0.322717 15.9973C0.437467 15.9813 3.10307 15.6012 5.03115 14.4986C6.12595 14.9362 7.29215 15.158 8.5 15.158C13.1869 15.158 17 11.7581 17 7.579C17 3.39988 13.1869 0 8.5 0ZM4.53333 8.70181C3.9083 8.70181 3.4 8.19823 3.4 7.579C3.4 6.95977 3.9083 6.45618 4.53333 6.45618C5.15837 6.45618 5.66667 6.95977 5.66667 7.579C5.66667 8.19823 5.15837 8.70181 4.53333 8.70181ZM8.5 8.70181C7.87497 8.70181 7.36667 8.19823 7.36667 7.579C7.36667 6.95977 7.87497 6.45618 8.5 6.45618C9.12503 6.45618 9.63333 6.95977 9.63333 7.579C9.63333 8.19823 9.12503 8.70181 8.5 8.70181ZM12.4667 8.70181C11.8416 8.70181 11.3333 8.19823 11.3333 7.579C11.3333 6.95977 11.8416 6.45618 12.4667 6.45618C13.0917 6.45618 13.6 6.95977 13.6 7.579C13.6 8.19823 13.0917 8.70181 12.4667 8.70181Z"
      fill="#91929E"
    />
  </Svg>
);

// ========================================
// TIPOS
// ========================================

// Status da atividade
type ActivityStatus = 'null' | 'not_started' | 'started' | 'completed';

// Item da atividade
export interface CommercialActivityItem {
  id: string; //..............ID unico da atividade
  title: string; //...........Titulo da atividade
  count: string; //...........Contador (ex: "01/06")
  status: ActivityStatus; //..Status da atividade
}

// Props do componente
type Props = {
  activities: CommercialActivityItem[]; //..Lista de atividades
  selectedActivityId: string | null; //.....ID da atividade selecionada
  onActivitySelect: (activityId: string) => void; //..Callback de selecao
  customerInfo?: CustomerInfoProps; //......Informacoes do cliente
};

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

const CommercialMenu: React.FC<Props> = ({
  activities,
  selectedActivityId,
  onActivitySelect,
  customerInfo,
}) => {
  // Carrega fontes
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  // Estado do modal de execucao
  const [executionModalVisible, setExecutionModalVisible] = useState(false);
  const [selectedExecutionActivity, setSelectedExecutionActivity] = useState<CommercialActivityItem | null>(null);

  // Estado do popup menu (3 pontinhos)
  const [popupMenuVisible, setPopupMenuVisible] = useState(false);
  const [popupMenuActivity, setPopupMenuActivity] = useState<CommercialActivityItem | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

  // Renderiza icone de status
  const renderActivityStatusIcon = (status: ActivityStatus) => {
    if (status === 'completed') return <StatusFilledCheckIcon color={COLORS.primary} size={18} />;
    return <StatusCircleIcon size={16} />;
  };

  // Referencias dos botoes de menu (para capturar posicao)
  const buttonRefs = useRef<{ [key: string]: View | null }>({});

  // Abre popup menu (3 pontinhos) e captura posicao do botao
  const openPopupMenu = (activity: CommercialActivityItem) => {
    const buttonRef = buttonRefs.current[activity.id];
    if (buttonRef) {
      // Captura posicao do botao clicado
      buttonRef.measure((_x, _y, _width, _height, pageX, pageY) => {
        setPopupPosition({
          x: pageX + POPUP_POSITION_CONFIG.offsetX,
          y: pageY + POPUP_POSITION_CONFIG.offsetY,
        });
        setPopupMenuActivity(activity);
        setPopupMenuVisible(true);
      });
    } else {
      // Fallback: abre sem posicao especifica
      setPopupMenuActivity(activity);
      setPopupMenuVisible(true);
    }
  };

  // Fecha popup menu
  const closePopupMenu = () => {
    setPopupMenuVisible(false);
    setPopupMenuActivity(null);
  };

  // Abre modal de execucao (a partir do popup)
  const openExecutionModal = () => {
    closePopupMenu();
    if (popupMenuActivity) {
      setSelectedExecutionActivity(popupMenuActivity);
      setExecutionModalVisible(true);
    }
  };

  // Fecha modal de execucao
  const closeExecutionModal = () => {
    setExecutionModalVisible(false);
    setSelectedExecutionActivity(null);
  };

  // Abre chat operacional (a partir do popup)
  const openChatOperacional = () => {
    closePopupMenu();
    // TODO: Implementar abertura do chat operacional
  };

  // Aguarda fontes carregarem
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Lista de Atividades */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activities.map((activity) => {
          const isSelected = activity.id === selectedActivityId;
          return (
            <TouchableOpacity
              key={activity.id}
              style={[styles.activityRow, isSelected && styles.activityRowSelected]}
              onPress={() => onActivitySelect(activity.id)}
              activeOpacity={0.7}
            >
              {/* Coluna Esquerda: Icone de Status */}
              <View style={styles.activityIconContainer}>
                {renderActivityStatusIcon(activity.status)}
              </View>

              {/* Coluna Central: Titulo */}
              <View style={styles.activityContent}>
                <Text
                  style={[styles.activityTitle, isSelected && styles.activityTitleSelected]}
                  numberOfLines={1}
                >
                  {activity.title}
                </Text>
              </View>

              {/* Coluna Direita: Icone de Execucao */}
              <View
                style={styles.activityRight}
                ref={(ref) => { buttonRefs.current[activity.id] = ref; }}
              >
                <TouchableOpacity
                  style={styles.executionButton}
                  onPress={() => openPopupMenu(activity)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <ExecutionMenuIcon />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal Popup Menu (3 pontinhos) */}
      <Modal
        visible={popupMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closePopupMenu}
      >
        <TouchableWithoutFeedback onPress={closePopupMenu}>
          <View style={styles.popupOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.popupContainer, { left: popupPosition.x, top: popupPosition.y }]}>
                {/* Opcao: Executar Atividade */}
                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={openExecutionModal}
                  activeOpacity={0.7}
                >
                  <PlayIcon />
                  <Text style={styles.popupItemText}>Executar Atividade</Text>
                </TouchableOpacity>

                {/* Divisoria */}
                <View style={styles.popupDivider} />

                {/* Opcao: Chat Time Operacional */}
                <TouchableOpacity
                  style={styles.popupItem}
                  onPress={openChatOperacional}
                  activeOpacity={0.7}
                >
                  <ChatIcon />
                  <Text style={styles.popupItemText}>Chat Time Operacional</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de Execucao */}
      <CommercialExecutionModal
        visible={executionModalVisible}
        onClose={closeExecutionModal}
        activity={selectedExecutionActivity}
        customerInfo={customerInfo}
      />
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1, //................Ocupa espaco disponivel
    backgroundColor: COLORS.white, //...Cor de fundo
  },
  // ScrollView
  scrollView: {
    flex: 1, //................Ocupa espaco disponivel
  },
  // Conteudo do ScrollView
  scrollContent: {
    paddingHorizontal: 20, //..Margem horizontal
    paddingVertical: 10, //....Margem vertical
  },
  // Linha de Atividade
  activityRow: {
    flexDirection: 'row', //...Layout horizontal
    alignItems: 'center', //...Alinha verticalmente
    paddingVertical: 12, //....Espacamento vertical
    borderBottomWidth: 0.5, //.Borda inferior
    borderBottomColor: COLORS.border, //..Cor da borda
  },
  // Linha de Atividade Selecionada (sem fundo destacado, apenas titulo muda)
  activityRowSelected: {
    // Sem alteracoes visuais no container
  },
  // Container do Icone de Status
  activityIconContainer: {
    width: 24, //..............Largura fixa
    height: 24, //.............Altura fixa
    justifyContent: 'center', //..Centraliza verticalmente
    alignItems: 'center', //...Centraliza horizontalmente
    marginRight: 12, //........Margem direita
  },
  // Conteudo Central
  activityContent: {
    flex: 1, //................Ocupa espaco disponivel
  },
  // Titulo da Atividade
  activityTitle: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textPrimary, //......Cor do texto
  },
  // Titulo da Atividade Selecionada
  activityTitleSelected: {
    fontFamily: 'Inter_500Medium', //..Fonte media
    color: COLORS.primary, //..........Cor azul
  },
  // Coluna Direita
  activityRight: {
    flexDirection: 'row', //...Layout horizontal
    alignItems: 'center', //...Alinha verticalmente
    marginRight: -10, //......Aproxima icone da borda direita
  },
  // Contador
  activityCount: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //...................Tamanho da fonte
    color: COLORS.textSecondary, //....Cor secundaria
  },
  // Botao de Execucao
  executionButton: {
    width: 24, //..............Largura fixa
    height: 24, //.............Altura fixa
    justifyContent: 'center', //..Centraliza verticalmente
    alignItems: 'center', //...Centraliza horizontalmente
  },
  // ========================================
  // ESTILOS DO POPUP MENU
  // ========================================
  // Overlay do Popup (fundo escuro)
  popupOverlay: {
    flex: 1, //........................Ocupa espaco disponivel
    backgroundColor: 'rgba(0,0,0,0.3)', //..Fundo semi-transparente
  },
  // Container do Popup (posicionado absolutamente)
  popupContainer: {
    position: 'absolute', //........Posicao absoluta (controlada por left/top)
    width: 223, //..................Largura fixa
    paddingHorizontal: 15, //.......Espacamento horizontal
    paddingVertical: 12, //........Espacamento vertical
    backgroundColor: COLORS.white, //..Cor de fundo branca
    borderRadius: 8, //.............Arredondamento das bordas
    borderWidth: 1, //..............Largura da borda
    borderColor: COLORS.border, //..Cor da borda
    shadowColor: '#676E76', //......Cor da sombra
    shadowOffset: { width: 0, height: 2 }, //..Offset da sombra
    shadowOpacity: 0.08, //.........Opacidade da sombra
    shadowRadius: 5, //.............Raio da sombra
    elevation: 3, //................Elevacao (Android)
  },
  // Item do Popup
  popupItem: {
    flexDirection: 'row', //........Layout horizontal
    alignItems: 'center', //........Alinha verticalmente
    height: 20, //..................Altura do item
    gap: 10, //....................Espaco entre icone e texto
  },
  // Texto do Item do Popup
  popupItemText: {
    fontFamily: 'Inter_400Regular', //..Fonte regular
    fontSize: 14, //....................Tamanho da fonte
    color: COLORS.textPrimary, //.......Cor do texto
  },
  // Divisoria do Popup
  popupDivider: {
    height: 0.5, //................Altura da linha
    backgroundColor: COLORS.border, //..Cor da linha
    marginVertical: 10, //.........Espacamento vertical
  },
});

export default CommercialMenu;
