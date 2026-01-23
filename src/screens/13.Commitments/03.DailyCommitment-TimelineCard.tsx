import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, CommitmentItem, CATEGORY_LABELS } from './02.DailyCommitment-Types';

// ========================================
// PLACEHOLDER PADRAO DO SISTEMA
// ========================================

const DEFAULT_AVATAR = require('../../../assets/AvatarPlaceholder02.png');

// ========================================
// PROPS DO COMPONENTE
// ========================================

interface TimelineCardProps {
  item: CommitmentItem; //..............Item do compromisso
  isLast: boolean; //....................Se e o ultimo item
  isExpanded: boolean; //................Se esta expandido (olhinho)
  onPress: () => void; //................Callback ao clicar
}

// ========================================
// COMPONENTE TIMELINE CARD
// ========================================

const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  isLast,
  isExpanded,
  onPress,
}) => {
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

  // Cor do tempo baseada no status
  const getTimeBalanceColor = (): string => {
    if (item.timeBalance === undefined || item.timeBalance === 0) {
      return COLORS.textSecondary;
    }
    return item.timeBalance > 0 ? COLORS.primary : COLORS.red;
  };

  // Cor do circulo baseada no status
  const getCircleStyle = () => {
    if (isCompleted) {
      return [styles.numberCircle, styles.numberCircleCompleted];
    }
    if (item.isFixed) {
      return [styles.numberCircle, styles.numberCircleFixed];
    }
    return [styles.numberCircle];
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Coluna Esquerda: Circulo + Linha */}
      <View style={styles.leftColumn}>
        {/* Circulo com numero */}
        <View style={getCircleStyle()}>
          <Text style={[
            styles.numberText,
            (item.isFixed || isCompleted) && styles.numberTextFixed,
          ]}>
            {item.number}
          </Text>
        </View>
        {/* Linha conectora */}
        {!isLast && <View style={styles.connectorLine} />}
      </View>

      {/* Coluna Direita: Conteudo */}
      <View style={styles.rightColumn}>
        {/* Card Principal */}
        <View style={[
          styles.card,
          isCompleted && styles.cardCompleted,
          isDelayed && styles.cardDelayed,
        ]}>
          {/* Linha Superior: Titulo + Tempo */}
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.title,
                isCompleted && styles.titleCompleted,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <View style={styles.timeBalanceContainer}>
              <Text style={[styles.timeBalance, { color: getTimeBalanceColor() }]}>
                {formatTimeBalance(item.timeBalance)}
              </Text>
            </View>
          </View>

          {/* Divisoria entre linhas */}
          <View style={styles.cardDivider} />

          {/* Linha Inferior: Categoria + Horario */}
          <View style={styles.cardFooter}>
            <Text style={styles.categoryLabel}>
              {CATEGORY_LABELS[item.category]}
            </Text>
            <Text style={styles.timeRange}>
              {item.startTime} - {item.endTime}
            </Text>
          </View>

          {/* Conteudo Expandido (olhinho ativo) */}
          {isExpanded && (
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

                {/* Informacoes em Colunas (Label em cima, Valor embaixo) */}
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

                  {/* Atividade */}
                  {item.activityName && (
                    <>
                      <View style={styles.fieldDivider} />
                      <View style={styles.fieldContainer}>
                        <Text style={styles.fieldLabel}>Atividade</Text>
                        <Text style={styles.fieldValue}>{item.activityName}</Text>
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = StyleSheet.create({
  // Container Principal
  container: {
    flexDirection: 'row', //............Layout horizontal
    paddingLeft: 0, //..................Sem margem esquerda
    paddingRight: 16, //................Margem direita
  },

  // Coluna Esquerda (Circulo + Linha)
  leftColumn: {
    width: 48, //.......................Largura fixa
    alignItems: 'center', //.............Centraliza horizontalmente
    marginRight: 0, //..................Margem direita
    marginLeft: 8, //..................Margem direita
  },

  // Circulo com Numero
  numberCircle: {
    width: 36, //........................Largura do circulo
    height: 36, //.......................Altura do circulo
    borderRadius: 8, //..................Bordas arredondadas (quadrado)
    backgroundColor: COLORS.white, //....Fundo branco
    borderWidth: 1.5, //.................Largura da borda
    borderColor: COLORS.border, //.......Cor da borda
    justifyContent: 'center', //.........Centraliza verticalmente
    alignItems: 'center', //.............Centraliza horizontalmente
  },

  // Circulo Concluido
  numberCircleCompleted: {
    backgroundColor: '#1B883C', //........Fundo verde escuro
    borderColor: '#1B883C', //............Borda verde escuro
  },

  // Circulo Fixo (Agenda)
  numberCircleFixed: {
    backgroundColor: COLORS.primary, //..Fundo azul
    borderColor: COLORS.primary, //......Borda azul
  },

  // Texto do Numero
  numberText: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
  },

  // Texto do Numero Fixo
  numberTextFixed: {
    color: COLORS.white, //..............Cor branca
  },

  // Linha Conectora
  connectorLine: {
    width: 2, //.........................Largura da linha
    flex: 1, //..........................Ocupa espaco restante
    backgroundColor: COLORS.border, //...Cor da linha
    marginVertical: 4, //................Margem vertical
  },

  // Coluna Direita (Conteudo)
  rightColumn: {
    flex: 1, //..........................Ocupa espaco restante
    paddingLeft: 12, //..................Margem esquerda
    paddingBottom: 12, //................Margem inferior
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
    backgroundColor: 'rgba(222, 251, 230, 0.5)', //..Fundo verde claro 50%
    borderColor: 'rgba(27, 136, 60, 0.5)', //.......Borda verde com 50% opacidade
    borderWidth: StyleSheet.hairlineWidth, //.......Borda mais fina
  },

  // Card em Atraso
  cardDelayed: {
    borderColor: 'rgba(220, 53, 69, 0.5)', //..Borda vermelha com 50% opacidade
    borderWidth: StyleSheet.hairlineWidth, //..Borda mais fina
  },

  // Header do Card
  cardHeader: {
    flexDirection: 'row', //............Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //.............Centraliza verticalmente
  },

  // Divisoria do Card
  cardDivider: {
    height: StyleSheet.hairlineWidth, //..Altura fina
    backgroundColor: COLORS.border, //....Cor da borda
    marginVertical: 8, //.................Margem vertical
  },

  // Titulo
  title: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.textPrimary, //........Cor do texto
    flex: 1, //..........................Ocupa espaco disponivel
    marginRight: 8, //...................Margem direita
  },

  // Titulo Concluido
  titleCompleted: {
    color: COLORS.textPrimary, //..........Cor primaria (sem risco)
  },

  // Container do Tempo
  timeBalanceContainer: {
    paddingHorizontal: 8, //.............Padding horizontal
    paddingVertical: 2, //...............Padding vertical
    borderRadius: 4, //..................Bordas arredondadas
    backgroundColor: COLORS.background, //..Fundo cinza
  },

  // Texto do Tempo
  timeBalance: {
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
    fontSize: 12, //.....................Tamanho da fonte
  },

  // Footer do Card
  cardFooter: {
    flexDirection: 'row', //............Layout horizontal
    justifyContent: 'space-between', //..Espaco entre elementos
    alignItems: 'center', //.............Centraliza verticalmente
  },

  // Horario
  timeRange: {
    fontFamily: 'Inter_400Regular', //...Fonte regular
    fontSize: 12, //.....................Tamanho da fonte
    color: COLORS.textSecondary, //......Cor secundaria
  },

  // Categoria do Card
  categoryLabel: {
    fontFamily: 'Inter_500Medium', //....Fonte media
    fontSize: 14, //.....................Tamanho da fonte
    color: COLORS.primary, //.............Cor azul
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

  // Container Foto do Cliente - Quadrado com cantos arredondados
  clientPhotoContainer: {
    width: 70, //........................Largura fixa
    minHeight: 88, //...................Altura minima
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
    justifyContent: 'space-between', //..Distribui campos
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
