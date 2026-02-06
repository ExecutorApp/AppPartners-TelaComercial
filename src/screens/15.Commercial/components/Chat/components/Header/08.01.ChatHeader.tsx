// ========================================
// Componente ChatHeader
// Header do chat com info do lead
// ========================================

// ========================================
// Imports React e React Native
// ========================================
import React from 'react';                //......React core
import {                                  //......Componentes RN
  View,                                   //......Container basico
  Text,                                   //......Texto
  StyleSheet,                             //......Estilos
  Pressable,                              //......Toque
  Image,                                  //......Imagem
} from 'react-native';                    //......Biblioteca RN
import Svg, {                             //......SVG core
  Path,                                   //......Path SVG
} from 'react-native-svg';                //......Biblioteca SVG

// ========================================
// Imports de Cores
// ========================================
import { ChatColors } from '../../styles/08.ChatColors';

// ========================================
// Imports de Tipos
// ========================================
import { ChatInfo } from '../../types/08.types.whatsapp';

// ========================================
// Import do Contexto da Lola
// ========================================
import { useLolaAvatar } from '../../../../contexts/LolaAvatarContext';

// ========================================
// Interface de Props
// ========================================
interface ChatHeaderProps {
  chatInfo: ChatInfo;                     //......Info do chat
  activeScreen?: 'lead' | 'lola';         //......Tela ativa
  onBackPress: () => void;                //......Handler voltar
  onProfilePress?: () => void;            //......Handler perfil
  onMenuPress?: () => void;               //......Handler menu
}

// ========================================
// Icone de Voltar
// ========================================
const BackIcon: React.FC<{ color: string; size: number }> = ({
  color,                                  //......Cor
  size,                                   //......Tamanho
}) => (
  <Svg                                    //......SVG container
    width={size}                          //......Largura
    height={size}                         //......Altura
    viewBox="0 0 24 24"                   //......ViewBox
    fill="none"                           //......Sem preenchimento
  >
    <Path                                 //......Seta voltar
      d="M15 18L9 12L15 6"                //......Desenho seta
      stroke={color}                      //......Cor da linha
      strokeWidth={2}                     //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
      strokeLinejoin="round"              //......Junção arredondada
    />
  </Svg>
);

// ========================================
// Icone de Menu (3 pontos)
// ========================================
const MenuIcon: React.FC<{ color: string; size: number }> = ({
  color,                                  //......Cor
  size,                                   //......Tamanho
}) => (
  <Svg                                    //......SVG container
    width={size}                          //......Largura
    height={size}                         //......Altura
    viewBox="0 0 24 24"                   //......ViewBox
    fill="none"                           //......Sem preenchimento
  >
    <Path                                 //......Ponto 1
      d="M12 5V5.01"                      //......Desenho ponto
      stroke={color}                      //......Cor da linha
      strokeWidth={3}                     //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
    <Path                                 //......Ponto 2
      d="M12 12V12.01"                    //......Desenho ponto
      stroke={color}                      //......Cor da linha
      strokeWidth={3}                     //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
    <Path                                 //......Ponto 3
      d="M12 19V19.01"                    //......Desenho ponto
      stroke={color}                      //......Cor da linha
      strokeWidth={3}                     //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
  </Svg>
);

// ========================================
// Icone de IA (Lola)
// ========================================
const AIIcon: React.FC<{ color: string; size: number }> = ({
  color,                                  //......Cor
  size,                                   //......Tamanho
}) => (
  <Svg                                    //......SVG container
    width={size}                          //......Largura
    height={size}                         //......Altura
    viewBox="0 0 24 24"                   //......ViewBox
    fill="none"                           //......Sem preenchimento
  >
    <Path                                 //......Cabeca do robo
      d="M12 2C10.9 2 10 2.9 10 4V5H8C6.9 5 6 5.9 6 7V9C4.9 9 4 9.9 4 11V13C4 14.1 4.9 15 6 15V17C6 18.1 6.9 19 8 19H16C17.1 19 18 18.1 18 17V15C19.1 15 20 14.1 20 13V11C20 9.9 19.1 9 18 9V7C18 5.9 17.1 5 16 5H14V4C14 2.9 13.1 2 12 2Z"
      stroke={color}                      //......Cor da linha
      strokeWidth={1.5}                   //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
      strokeLinejoin="round"              //......Juncao arredondada
    />
    <Path                                 //......Olho esquerdo
      d="M9 11H9.01"                      //......Ponto
      stroke={color}                      //......Cor
      strokeWidth={2.5}                   //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
    <Path                                 //......Olho direito
      d="M15 11H15.01"                    //......Ponto
      stroke={color}                      //......Cor
      strokeWidth={2.5}                   //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
    <Path                                 //......Boca
      d="M9 15H15"                        //......Linha
      stroke={color}                      //......Cor
      strokeWidth={1.5}                   //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
    <Path                                 //......Antena
      d="M12 2V0"                         //......Linha
      stroke={color}                      //......Cor
      strokeWidth={1.5}                   //......Espessura
      strokeLinecap="round"               //......Ponta arredondada
    />
  </Svg>
);

// ========================================
// Componente Avatar
// ========================================
const Avatar: React.FC<{
  photo?: string;                         //......URL da foto
  name: string;                           //......Nome para iniciais
  isOnline: boolean;                      //......Se esta online
}> = ({ photo, name, isOnline }) => {
  // Obter iniciais do nome
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0]?.substring(0, 2).toUpperCase() || '??';
  };

  return (
    <View style={styles.avatarContainer}>
      {/* Imagem ou Iniciais */}
      {photo ? (
        <Image                            //......Foto do lead
          source={{ uri: photo }}         //......URL
          style={styles.avatarImage}      //......Estilo
        />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {/* Indicador Online */}
      {isOnline && (
        <View style={styles.onlineIndicator} />
      )}
    </View>
  );
};

// ========================================
// Componente Principal ChatHeader
// ========================================
const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatInfo,                               //......Info do chat
  activeScreen = 'lead',                  //......Tela ativa (padrao: lead)
  onBackPress,                            //......Handler voltar
  onProfilePress,                         //......Handler perfil
  onMenuPress,                            //......Handler menu
}) => {
  // ========================================
  // Contexto da Lola
  // ========================================
  const { state: lolaState, handleTap: handleLolaExpand } = useLolaAvatar();

  // ========================================
  // Avatar da Lola visivel apenas no estado header (em ambas as telas)
  // ========================================
  const showLolaInHeader = lolaState === 'header';

  // ========================================
  // Verificar se esta na tela da Lola
  // ========================================
  const isLolaScreen = activeScreen === 'lola';

  // ========================================
  // Formatar Status
  // ========================================
  const getStatusText = (): string => {
    // Se estiver na tela da Lola, mostra status fixo
    if (isLolaScreen) {
      return 'Assistente Pessoal';        //......Status Lola
    }

    if (chatInfo.isTyping) {
      return 'digitando...';              //......Digitando
    }
    if (chatInfo.isOnline) {
      return 'online';                    //......Online
    }
    if (chatInfo.lastSeen) {
      const lastSeenDate = new Date(chatInfo.lastSeen);
      const now = new Date();
      const diffMs = now.getTime() - lastSeenDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        return 'visto agora';             //......Agora
      }
      if (diffMins < 60) {
        return `visto há ${diffMins} min`; //......Minutos
      }
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) {
        return `visto há ${diffHours}h`;  //......Horas
      }
      return `visto ${lastSeenDate.toLocaleDateString('pt-BR')}`;
    }
    return '';                            //......Vazio
  };

  // ========================================
  // Render Principal
  // ========================================
  return (
    <View style={styles.container}>
      {/* Botao Voltar */}
      <Pressable
        style={styles.backButton}         //......Estilo botao
        onPress={onBackPress}             //......Handler
        hitSlop={12}                      //......Area de toque
      >
        <BackIcon
          color={ChatColors.headerIcon}   //......Cor branca
          size={24}                        //......Tamanho
        />
      </Pressable>

      {/* Area do Perfil */}
      <Pressable
        style={styles.profileArea}        //......Estilo area
        onPress={onProfilePress}          //......Handler
      >
        {/* Avatar - Lola ou Lead */}
        {isLolaScreen ? (
          <View style={styles.lolaAvatarContainer}>
            <Image
              source={require('../../../../../../assets/lola-visemes/lola-rest.png')}
              style={styles.lolaAvatarImage}
            />
          </View>
        ) : (
          <Avatar
            photo={chatInfo.leadPhoto}    //......Foto
            name={chatInfo.leadName}      //......Nome
            isOnline={chatInfo.isOnline}  //......Online
          />
        )}

        {/* Info do Lead ou Lola */}
        <View style={styles.infoContainer}>
          {/* Nome */}
          <Text
            style={styles.nameText}       //......Estilo nome
            numberOfLines={1}             //......Uma linha
          >
            {isLolaScreen ? 'Lola' : chatInfo.leadName}
          </Text>

          {/* Status */}
          <Text
            style={[
              styles.statusText,          //......Estilo status
              chatInfo.isTyping && !isLolaScreen && styles.typingText,
            ]}
            numberOfLines={1}             //......Uma linha
          >
            {getStatusText()}
          </Text>
        </View>
      </Pressable>

      {/* Botao IA (Lola) - Foto circular */}
      {/* Visivel apenas quando Lola esta no estado header */}
      {showLolaInHeader && (
        <Pressable
          style={styles.aiButton}         //......Estilo botao
          onPress={handleLolaExpand}      //......Expande avatar flutuante
          hitSlop={8}                     //......Area de toque
        >
          <Image
            source={require('../../../../../../assets/lola-visemes/lola-rest.png')}
            style={styles.aiAvatar}       //......Estilo avatar
          />
        </Pressable>
      )}

      {/* Botao Menu */}
      <Pressable
        style={styles.menuButton}         //......Estilo botao
        onPress={onMenuPress}             //......Handler
        hitSlop={12}                      //......Area de toque
      >
        <MenuIcon
          color={ChatColors.headerIcon}   //......Cor branca
          size={24}                        //......Tamanho
        />
      </Pressable>
    </View>
  );
};

// ========================================
// Export Default
// ========================================
export default ChatHeader;

// ========================================
// Estilos
// ========================================

// ========================================
// AJUSTE MANUAL DA ALTURA DO HEADER AZUL
// Modifique os valores abaixo para alterar a altura
// ========================================
const HEADER_PADDING_TOP = 15;            //......Padding superior (era 12, aumentado 3px)
const HEADER_PADDING_BOTTOM = 15;         //......Padding inferior

const styles = StyleSheet.create({
  // Container principal
  container: {
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    backgroundColor: ChatColors.headerBackground,
    paddingTop: HEADER_PADDING_TOP,       //......Padding superior (ajuste acima)
    paddingBottom: HEADER_PADDING_BOTTOM, //......Padding inferior (ajuste acima)
    paddingHorizontal: 8,                 //......Padding horizontal
    overflow: 'visible',                  //......Permite elementos filhos sairem do container
    zIndex: 10,                           //......Garante que header fique acima
  },

  // Botao voltar
  backButton: {
    width: 40,                            //......Largura
    height: 40,                           //......Altura
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },

  // Area do perfil
  profileArea: {
    flex: 1,                              //......Ocupa espaco
    flexDirection: 'row',                 //......Layout horizontal
    alignItems: 'center',                 //......Centraliza vertical
    paddingHorizontal: 4,                 //......Padding horizontal
  },

  // Container do avatar
  avatarContainer: {
    width: 44,                            //......Largura
    height: 44,                           //......Altura
    position: 'relative',                 //......Posicao relativa
  },

  // Imagem do avatar (quadrado com bordas arredondadas)
  avatarImage: {
    width: 44,                            //......Largura
    height: 44,                           //......Altura
    borderRadius: 8,                      //......Bordas levemente arredondadas
  },

  // Container do avatar da Lola (mesmo padrao do lead)
  lolaAvatarContainer: {
    width: 44,                            //......Largura (igual ao lead)
    height: 44,                           //......Altura (igual ao lead)
    borderRadius: 8,                      //......Bordas arredondadas (igual ao lead)
    borderWidth: 1,                       //......Borda slim
    borderColor: '#FFFFFF',               //......Borda branca clean
    backgroundColor: '#FFFFFF',           //......Fundo branco clean
    overflow: 'hidden',                   //......Esconde overflow
    position: 'relative',                 //......Posicao relativa
  },

  // Imagem do avatar da Lola (apenas rosto, ajustado no container)
  lolaAvatarImage: {
    width: 55,                            //......Largura reduzida para mostrar cabeca completa
    height: 75,                           //......Altura reduzida para mostrar cabeca completa
    marginTop: -5,                        //......Ajuste vertical para centralizar rosto
    marginLeft: -6,                       //......Ajuste horizontal para centralizar rosto
  },

  // Placeholder do avatar (quadrado com bordas arredondadas)
  avatarPlaceholder: {
    width: 44,                            //......Largura
    height: 44,                           //......Altura
    borderRadius: 8,                      //......Bordas levemente arredondadas
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },

  // Iniciais do avatar
  avatarInitials: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte bold
    fontSize: 16,                         //......Tamanho fonte
    color: ChatColors.headerText,         //......Cor branca
  },

  // Indicador online
  onlineIndicator: {
    position: 'absolute',                 //......Posicao absoluta
    bottom: 0,                            //......Alinha embaixo
    right: 0,                             //......Alinha direita
    width: 14,                            //......Largura
    height: 14,                           //......Altura
    borderRadius: 7,                      //......Circular
    backgroundColor: ChatColors.online,   //......Verde
    borderWidth: 2,                       //......Borda
    borderColor: ChatColors.headerBackground,
  },

  // Container das infos
  infoContainer: {
    flex: 1,                              //......Ocupa espaco
    marginLeft: 12,                       //......Margem esquerda
  },

  // Texto do nome
  nameText: {
    fontFamily: 'Inter_600SemiBold',      //......Fonte bold
    fontSize: 16,                         //......Tamanho fonte
    color: ChatColors.headerText,         //......Cor branca
  },

  // Texto do status
  statusText: {
    fontFamily: 'Inter_400Regular',       //......Fonte regular
    fontSize: 13,                         //......Tamanho fonte
    color: 'rgba(255,255,255,0.7)',       //......Cor clara
    marginTop: 2,                         //......Margem superior
  },

  // Texto digitando
  typingText: {
    color: ChatColors.white,              //......Cor branca
    fontFamily: 'Inter_500Medium',        //......Fonte media
  },

  // ========================================
  // CONFIGURACAO DO AVATAR DA IA (LOLA)
  // Ajuste os valores abaixo para posicionar
  // ========================================

  // Container do botao IA (Lola)
  aiButton: {
    position: 'relative',                 //......Posicao relativa
    width: 60,                            //......Largura do container
    height: '100%',                       //......Altura do header
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
    overflow: 'visible',                  //......NAO CORTA a imagem
    zIndex: 100,                          //......Acima de tudo
  },

  // Avatar da IA (foto da Lola) - AJUSTE AQUI
  aiAvatar: {
    position: 'absolute',                 //......Posicao absoluta (sai do fluxo)
    width: 45,                            //......TAMANHO: Largura da imagem
    height: 65,                           //......TAMANHO: Altura da imagem
    bottom: -15,                          //......VERTICAL: Negativo = desce, Positivo = sobe
    right: 10,                            //......HORIZONTAL: Negativo = direita, Positivo = esquerda
    zIndex: 999,                          //......CAMADA: Acima de todos elementos
  },

  // Botao menu
  menuButton: {
    width: 40,                            //......Largura
    height: 40,                           //......Altura
    justifyContent: 'center',             //......Centraliza vertical
    alignItems: 'center',                 //......Centraliza horizontal
  },
});
