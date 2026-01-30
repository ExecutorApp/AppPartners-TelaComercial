import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Svg, Path, Circle } from 'react-native-svg';
import {
  COLORS,
  CommitmentItem,
  CATEGORY_LABELS,
  SUBCATEGORY_LABELS,
  getCardModel,
} from './02.DailyCommitment-Types';

// ========================================
// PLACEHOLDER PADRAO DO SISTEMA
// ========================================

const DEFAULT_AVATAR = require('../../../assets/AvatarPlaceholder02.png');

// ========================================
// ICONE TEMPO (RELOGIO)
// ========================================

const TimeIcon = ({ color = COLORS.textSecondary }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={9}
      stroke={color}
      strokeWidth={2}
    />
    <Path
      d="M12 7V12L15 15"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// ICONE CHECK (CONCLUIDO)
// ========================================

const CheckIcon = ({ color = COLORS.primary }: { color?: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Circle
      cx={12}
      cy={12}
      r={10}
      fill={color}
    />
    <Path
      d="M8 12L11 15L16 9"
      stroke={COLORS.white}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// FUNCAO PARA FORMATAR TELEFONE
// ========================================

const formatPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 11) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 7)}-${clean.slice(7)}`;
  }
  if (clean.length === 10) {
    return `(${clean.slice(0, 2)}) ${clean.slice(2, 6)}-${clean.slice(6)}`;
  }
  return phone;
};

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface TimelineCardProps {
  item: CommitmentItem; //..............Item do compromisso
  isLast: boolean; //....................Se e o ultimo item
  isExpanded: boolean; //................Se esta expandido (olhinho)
  onPress: () => void; //................Callback ao clicar no card
  onConfirmPress: () => void; //.........Callback ao confirmar conclusao
  onLongPress?: () => void; //...........Callback ao pressionar longo (drag)
  isDragging?: boolean; //...............Se esta sendo arrastado
}

// ========================================
// COMPONENTE TIMELINE CARD
// ========================================

const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  isLast,
  isExpanded,
  onPress,
  onConfirmPress,
  onLongPress,
  isDragging = false,
}) => {
  // Modelo do card (1, 2 ou 3)
  const cardModel = getCardModel(item);

  // Status concluido
  const isCompleted = item.status === 'completed';

  // Status em atraso
  const isDelayed = item.timeBalance !== undefined && item.timeBalance < 0;

  // Formata o tempo restante/atraso (sem sinais, apenas numero)
  const formatTimeBalance = (minutes?: number): string => {
    if (minutes === undefined || minutes === 0) return '--';
    const absMinutes = Math.abs(minutes);
    return absMinutes < 10 ? `0${absMinutes}` : `${absMinutes}`;
  };

  // Formata duracao em minutos para texto legivel
  const formatDuration = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
    }
    return `${minutes}min`;
  };

  // Cor do tempo baseada no status
  const getTimeBalanceColor = (): string => {
    if (item.timeBalance === undefined || item.timeBalance === 0) {
      return COLORS.textSecondary;
    }
    return item.timeBalance > 0 ? COLORS.primary : COLORS.red;
  };

  // Cor do circulo baseada no status
  const getCircleStyle = () => {
    // Fixo/Selecionado: fundo solido azul
    if (item.isFixed) {
      return [styles.numberCircle, styles.numberCircleFixed];
    }
    // Concluido: fundo azul claro
    if (isCompleted) {
      return [styles.numberCircle, styles.numberCircleCompleted];
    }
    // Atrasado: fundo vermelho claro
    if (isDelayed) {
      return [styles.numberCircle, styles.numberCircleDelayed];
    }
    return [styles.numberCircle];
  };

  // Cor do texto do numero baseada no status
  const getNumberTextStyle = () => {
    // Fixo/Selecionado: texto branco
    if (item.isFixed) {
      return [styles.numberText, styles.numberTextFixed];
    }
    // Concluido: texto azul
    if (isCompleted) {
      return [styles.numberText, styles.numberTextCompleted];
    }
    // Atrasado: texto vermelho
    if (isDelayed) {
      return [styles.numberText, styles.numberTextDelayed];
    }
    return [styles.numberText];
  };

  return (
    <View style={[styles.container, isDragging && styles.containerDragging]}>
      {/* Linha Conectora (posicao absoluta) */}
      {!isLast && <View style={styles.connectorLine} />}

      {/* Circulo com Numero - Clique abre modal de confirmacao */}
      <TouchableOpacity
        style={getCircleStyle()}
        onPress={onConfirmPress}
        activeOpacity={0.7}
      >
        <Text style={getNumberTextStyle()}>
          {item.number}
        </Text>
      </TouchableOpacity>

      {/* Card Principal */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            isCompleted && styles.cardCompleted,
            isDelayed && styles.cardDelayed,
            isDragging && styles.cardDragging,
          ]}
          onPress={onPress}
          onLongPress={onLongPress}
          delayLongPress={150}
          activeOpacity={0.9}
        >
          {/* Conteudo do Card (Layout Horizontal) */}
          <View style={styles.cardContent}>
            {/* Bloco Esquerdo: Tempo + Horarios */}
            <View style={styles.leftBlock}>
              <Text style={[
                styles.timeBalanceText,
                { color: getTimeBalanceColor() },
              ]}>
                {formatTimeBalance(item.timeBalance)}
              </Text>
              <View style={styles.leftDivider} />
              <Text style={styles.timeText}>{item.startTime}</Text>
              <View style={styles.leftDivider} />
              <Text style={styles.timeText}>{item.endTime}</Text>
            </View>

            {/* Divisoria Vertical */}
            <View style={styles.verticalDivider} />

            {/* Bloco Direito: Categoria + Subcategoria + Titulo */}
            <View style={styles.rightBlock}>
              {/* Linha Categoria + Duracao + Check */}
              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>{CATEGORY_LABELS[item.category]}</Text>
                <View style={styles.durationCheckContainer}>
                  <View style={styles.durationContainer}>
                    <TimeIcon color={COLORS.textSecondary} />
                    <Text style={styles.durationText}>{formatDuration(item.estimatedMinutes)}</Text>
                  </View>
                  {/* Icone Check - Aparece quando concluido */}
                  {isCompleted && (
                    <View style={styles.checkIconContainer}>
                      <CheckIcon color={COLORS.primary} />
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.rightDivider} />
              {/* Subcategoria */}
              <Text style={styles.subcategoryText}>
                {item.subcategory ? SUBCATEGORY_LABELS[item.subcategory] : '--'}
              </Text>
              <View style={styles.rightDivider} />
              {/* Titulo */}
              <Text style={[
                styles.titleText,
                isCompleted && styles.titleCompleted,
              ]} numberOfLines={1}>
                {item.title}
              </Text>
            </View>
          </View>

          {/* Conteudo Expandido - Modelo 02 (Lead + WhatsApp) */}
          {isExpanded && cardModel === 2 && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />

              {/* Linha com Foto e Informacoes */}
              <View style={styles.expandedRow}>
                {/* Foto do Lead */}
                <View style={styles.clientPhotoContainer}>
                  <Image
                    source={item.clientPhoto ? { uri: item.clientPhoto } : DEFAULT_AVATAR}
                    style={styles.clientPhoto}
                    resizeMode="cover"
                  />
                </View>

                {/* Informacoes do Lead ou Time Operacional */}
                <View style={styles.expandedInfoContainer}>
                  {/* Nome da Pessoa */}
                  {item.clientName && (
                    <Text style={styles.clientName}>{item.clientName}</Text>
                  )}

                  {/* Campo WhatsApp (se for lead) */}
                  {item.whatsapp && (
                    <>
                      <View style={styles.fieldDivider} />
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>WhatsApp</Text>
                        <Text style={styles.fieldValue}>{formatPhone(item.whatsapp)}</Text>
                      </View>
                    </>
                  )}

                  {/* Campo Departamento (se for time operacional) */}
                  {!item.whatsapp && (
                    <>
                      <View style={styles.fieldDivider} />
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Departamento</Text>
                        <Text style={styles.fieldValue}>Time operacional</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Conteudo Expandido - Modelo 03 (Cliente + Produto + Fase) */}
          {isExpanded && cardModel === 3 && (
            <View style={styles.expandedContent}>
              <View style={styles.divider} />

              {/* Linha com Foto e Informacoes */}
              <View style={styles.expandedRow}>
                {/* Foto do Cliente */}
                <View style={styles.clientPhotoContainer}>
                  <Image
                    source={item.clientPhoto ? { uri: item.clientPhoto } : DEFAULT_AVATAR}
                    style={styles.clientPhoto}
                    resizeMode="cover"
                  />
                </View>

                {/* Informacoes do Cliente */}
                <View style={styles.expandedInfoContainer}>
                  {/* Nome do Cliente */}
                  {item.clientName && (
                    <Text style={styles.clientName}>{item.clientName}</Text>
                  )}

                  {/* Produto */}
                  {item.productName && (
                    <>
                      <View style={styles.fieldDivider} />
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Produto</Text>
                        <Text style={styles.fieldValue}>{item.productName}</Text>
                      </View>
                    </>
                  )}

                  {/* Fase */}
                  {item.phaseName && (
                    <>
                      <View style={styles.fieldDivider} />
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Fase</Text>
                        <Text style={styles.fieldValue}>{item.phaseName}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal (posicao relativa para linha absoluta)
  container: {
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'flex-start', //........Alinha ao topo
    marginBottom: 12, //................Espaco entre cards
    paddingLeft: 16, //.................Margem esquerda
    paddingRight: 16, //................Margem direita
    position: 'relative' as const, //...Para linha absoluta
  },

  // Container Durante Arrasto
  containerDragging: {
    opacity: 0.95, //...................Leve transparencia
    transform: [{ scale: 1.02 }], //....Leve aumento
  },

  // Linha Conectora (posicao absoluta)
  connectorLine: {
    position: 'absolute' as const, //...Posicao absoluta
    left: 31, //........................Centro do numero (16 + 32/2 - 1)
    top: 38, //.........................Abaixo do numero com espaco
    width: 2, //.........................Largura da linha
    height: 'calc(100% - 32px)' as any, //..Altura com espacos
    backgroundColor: COLORS.border, //...Cor da linha
  },

  // Circulo com Numero
  numberCircle: {
    width: 32, //........................Largura do circulo
    height: 32, //.......................Altura do circulo
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Largura da borda
    borderColor: COLORS.border, //.......Cor da borda
    justifyContent: 'center', //.........Centraliza verticalmente
    alignItems: 'center', //.............Centraliza horizontalmente
    zIndex: 2, //........................Acima da linha
    marginRight: 8, //...................Espaco entre numero e card
  },

  // Circulo Concluido (fundo claro)
  numberCircleCompleted: {
    backgroundColor: 'rgba(23, 119, 207, 0.1)', //..Fundo azul claro 10%
    borderColor: COLORS.primary, //................Borda azul principal
  },

  // Circulo Atrasado (fundo claro)
  numberCircleDelayed: {
    backgroundColor: 'rgba(229, 57, 53, 0.15)', //..Fundo vermelho claro 15%
    borderColor: COLORS.red, //....................Borda vermelha
  },

  // Circulo Fixo/Selecionado (Agenda - fundo solido)
  numberCircleFixed: {
    backgroundColor: COLORS.primary, //..Fundo azul solido
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto do Numero (padrao)
  numberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto do Numero Concluido (azul)
  numberTextCompleted: {
    color: COLORS.primary, //.............Cor azul
  },

  // Texto do Numero Atrasado (vermelho)
  numberTextDelayed: {
    color: COLORS.red, //..................Cor vermelha
  },

  // Texto do Numero Fixo/Selecionado (branco)
  numberTextFixed: {
    color: COLORS.white, //..............Cor branca
  },

  // Container do Card
  cardContainer: {
    flex: 1, //..........................Ocupa espaco restante
  },

  // Card Principal
  card: {
    backgroundColor: COLORS.white, //....Fundo branco
    borderRadius: 12, //.................Bordas arredondadas
    padding: 12, //......................Padding interno
    borderWidth: 1, //...................Largura da borda
    borderColor: COLORS.border, //.......Cor da borda
  },

  // Card Concluido
  cardCompleted: {
    backgroundColor: 'rgba(23, 119, 207, 0.1)', //..Fundo azul claro 10%
    borderColor: 'rgba(23, 119, 207, 0.5)', //......Borda azul 50%
    borderWidth: StyleSheet.hairlineWidth, //.......Borda mais fina
  },

  // Card em Atraso
  cardDelayed: {
    backgroundColor: 'rgba(229, 57, 53, 0.12)', //..Fundo vermelho claro 12%
    borderColor: 'rgba(229, 57, 53, 0.5)', //.......Borda vermelha 50%
    borderWidth: StyleSheet.hairlineWidth, //.......Borda mais fina
  },

  // Card Durante Arrasto
  cardDragging: {
    borderColor: COLORS.primary, //......Borda azul solida
    borderWidth: 2, //...................Borda mais grossa
    shadowColor: '#000', //..............Cor da sombra
    shadowOffset: { width: 0, height: 4 }, //..Deslocamento da sombra
    shadowOpacity: 0.2, //...............Opacidade da sombra
    shadowRadius: 8, //..................Raio da sombra
    elevation: 8, //.....................Elevacao Android
  },

  // Conteudo do Card (layout horizontal)
  cardContent: {
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'stretch', //.............Estica verticalmente
  },

  // Bloco Esquerdo (tempo + horarios)
  leftBlock: {
    alignItems: 'center', //.............Centraliza horizontalmente
    justifyContent: 'center', //........Centraliza verticalmente
  },

  // Texto do Tempo Restante
  timeBalanceText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 13, //.....................Tamanho da fonte
  },

  // Divisoria Esquerda
  leftDivider: {
    width: '100%' as any, //.............Largura maxima
    height: 1, //........................Altura
    backgroundColor: COLORS.border, //...Cor da borda
    marginVertical: 6, //................Margem vertical
  },

  // Texto Horario
  timeText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 12, //.....................Tamanho da fonte
    color: COLORS.textSecondary, //......Cor cinza
  },

  // Divisoria Vertical
  verticalDivider: {
    width: 1, //.........................Largura
    backgroundColor: COLORS.border, //...Cor da borda
    marginHorizontal: 12, //.............Margem horizontal
  },

  // Bloco Direito (categoria + subcategoria + titulo)
  rightBlock: {
    flex: 1, //..........................Ocupa espaco restante
    justifyContent: 'center', //........Centraliza verticalmente
  },

  // Linha Categoria + Duracao
  categoryRow: {
    flexDirection: 'row', //.............Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //.............Centraliza verticalmente
  },

  // Texto Categoria
  categoryText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.primary, //.............Cor azul
  },

  // Container Duracao + Check
  durationCheckContainer: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    gap: 8, //...........................Espaco entre duracao e check
  },

  // Container Duracao
  durationContainer: {
    flexDirection: 'row', //.............Layout horizontal
    alignItems: 'center', //.............Centraliza verticalmente
    gap: 4, //...........................Espaco entre icone e texto
  },

  // Texto Duracao
  durationText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 12, //.....................Tamanho da fonte
    color: COLORS.textSecondary, //......Cor cinza
  },

  // Container Icone Check
  checkIconContainer: {
    justifyContent: 'center', //........Centraliza verticalmente
    alignItems: 'center', //.............Centraliza horizontalmente
  },

  // Divisoria Direita
  rightDivider: {
    width: '100%' as any, //.............Largura maxima
    height: 1, //........................Altura
    backgroundColor: COLORS.border, //...Cor da borda
    marginVertical: 6, //................Margem vertical
  },

  // Texto Subcategoria
  subcategoryText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.primary, //.............Cor azul
  },

  // Texto Titulo
  titleText: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor preta
  },

  // Titulo Concluido
  titleCompleted: {
    color: COLORS.textPrimary, //..........Cor primaria
  },

  // Conteudo Expandido
  expandedContent: {
    marginTop: 8, //.....................Margem superior
  },

  // Divisor Principal
  divider: {
    height: 1, //........................Altura da linha
    backgroundColor: COLORS.border, //...Cor da linha
    marginBottom: 10, //.................Margem inferior
  },

  // Linha Expandida (Foto + Info)
  expandedRow: {
    flexDirection: 'row', //............Layout horizontal
    alignItems: 'stretch', //.............Estica itens na vertical
    gap: 12, //..........................Espaco entre foto e info
  },

  // Container Foto do Cliente - Ocupa altura maxima do container
  clientPhotoContainer: {
    width: 56, //.........................Largura fixa
    alignSelf: 'stretch', //..............Estica para altura maxima
    borderRadius: 8, //..................Bordas arredondadas
    backgroundColor: COLORS.border, //...Fundo placeholder
    overflow: 'hidden', //...............Esconde overflow
  },

  // Foto do Cliente
  clientPhoto: {
    width: '100%', //...................Largura total
    height: '100%', //..................Altura total
  },

  // Container Info Expandida
  expandedInfoContainer: {
    flex: 1, //..........................Ocupa espaco disponivel
    justifyContent: 'space-between', //..Distribui campos verticalmente
  },

  // Nome do Cliente
  clientName: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Divisoria entre campos
  fieldDivider: {
    height: 1, //........................Altura da linha
    backgroundColor: COLORS.border, //...Cor da borda
    marginVertical: 4, //................Margem vertical
  },

  // Container do Campo (Label + Valor)
  fieldContainer: {
    paddingVertical: 2, //...............Margem vertical
  },

  // Label do Campo
  fieldLabel: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 10, //.....................Tamanho pequeno
    color: COLORS.textSecondary, //......Cor secundaria
    marginBottom: 2, //..................Espaco inferior
  },

  // Valor do Campo
  fieldValue: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },
});

export default TimelineCard;
