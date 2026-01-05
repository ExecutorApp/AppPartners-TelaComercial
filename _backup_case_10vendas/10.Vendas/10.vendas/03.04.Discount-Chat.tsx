/**
 * ===========================================================================
 * 12.04.Discount-Chat.tsx
 * ===========================================================================
 * Tela de chat 1:1 estilo WhatsApp para comunicação entre parceiro e gestor.
 * Container de mais opções com ícones EXATOS do Figma, Emojis e Áudio.
 * Caminho: D:\Downloads\App - Partners\App - Partners 01\Partners01\src\screens\10.Vendas\12.04.Discount-Chat.tsx
 * ===========================================================================
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  memo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  Image,
  Keyboard,
  Dimensions,
  useWindowDimensions,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { ScreenNames } from '../../types/navigation';

// ===========================================================================
// Importação do novo componente de Emojis SVG
// ===========================================================================
import EmojiContainer from './03.04.Discount-Chat-Emoji';

// ===========================================================================
// Importação do componente de renderização de imagem
// ===========================================================================
import { ChatImageMessage } from './03.04.Discount-Chat-Image';
import { MessageAudioPlayer, ChatAudioInput, MessageAudioPlayerRef } from './03.04.Discount-Chat-Audio';
import DiscountChatCallModal from './03.04.Discount-Chat-Call';


// ===========================================================================
// Constantes de Layout
// ===========================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Alturas FIXAS dos elementos (em pixels)
 */
const HEADER_HEIGHT = 120;
const CONTACT_HEIGHT = 120;
const INPUT_HEIGHT = 40;
const BOTTOM_MARGIN = 0;
const OPTIONS_HEIGHT = 90;

/**
 * Espaçamento abaixo do container de input (borda inferior da tela)
 */
const INPUT_BOTTOM_PADDING = 15;

/**
 * Espaçamento entre a área de conversação e o container de input
 */
const CHAT_INPUT_GAP = 10;

/**
 * Espaçamento abaixo do container de mais opções (quando visível)
 */
const OPTIONS_BOTTOM_PADDING = 10;

/**
 * Espaçamento abaixo do container de emojis (quando visível)
 */
const EMOJI_BOTTOM_PADDING = 10;

/**
 * Altura do painel de emojis (5 linhas × 35px + 4 gaps × 20px + padding 40px)
 * Versão final com todas as 5 linhas de emojis
 */
const EMOJI_HEIGHT = 290;

// Removidos: constantes e tipo de áudio (migrados para 12.04.Discount-Chat-Audio.tsx)

/**
 * Estados do painel inferior
 */
type BottomPanelState = 'none' | 'options' | 'emoji';

// ===========================================================================
// Interfaces
// ===========================================================================

interface ChatMessage {
  id: string;
  type: 'text' | 'audio' | 'sticker' | 'image';
  content: string;
  sender: 'user' | 'contact';
  timestamp: string;
  audioDuration?: string;
  stickerEmoji?: string;
  audioUri?: string;
  imageUri?: string;
}

// ===========================================================================
// Dados Iniciais
// ===========================================================================

const INIT_MSGS: ChatMessage[] = [
  { id: '1', type: 'text', content: 'Bom dia meu gestor favorito ^^', sender: 'user', timestamp: '08:15' },
  { id: '2', type: 'text', content: 'Bom dia Antônio, como eu posso ajudar?', sender: 'contact', timestamp: '08:25' },
  { id: '3', type: 'text', content: 'Esse cliente é Top, consegue um desconto de 15%?', sender: 'user', timestamp: '08:28' },
  { id: '4', type: 'text', content: 'Infelizmente, nessas condições eu não consigo.', sender: 'contact', timestamp: '08:32' },
  { id: '5', type: 'text', content: 'Se o valor total do prolabore for No Pix eu consigo.', sender: 'contact', timestamp: '08:32' },
  { id: '6', type: 'text', content: 'Boa, vou ver com ele e já retorno. Valeu.', sender: 'user', timestamp: '08:34' },
  { id: '7', type: 'audio', content: 'audio', sender: 'user', timestamp: '08:50', audioDuration: '3:15' },
  { id: '8', type: 'sticker', content: 'sticker', sender: 'contact', timestamp: '09:02', stickerEmoji: 'emoji_25' },
];

const RESPONSES = ['Entendi, vou analisar.', 'Deixa comigo.', 'Perfeito!', 'Ok, aguarde.', 'Certo!', 'Recebido!', 'Beleza!', 'Vou verificar.'];

// ===========================================================================
// Ícones SVG
// ===========================================================================

/**
 * Ícone de seta para voltar
 */
const BackIcon = memo(() => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path d="M10 19L1 10M1 10L10 1M1 10L19 10" stroke="#1777CF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de três pontos (mais opções)
 */
const MoreIcon = memo(() => (
  <Svg width={35} height={35} viewBox="0 0 35 35" fill="none">
    <Rect x={0.4} y={0.4} width={34.2} height={34.2} rx={5.6} fill="#FCFCFC" />
    <Path d="M19.5 10.5C19.5 11.6 18.6 12.5 17.5 12.5C16.4 12.5 15.5 11.6 15.5 10.5C15.5 9.4 16.4 8.5 17.5 8.5C18.6 8.5 19.5 9.4 19.5 10.5Z" fill="#1777CF" />
    <Path d="M19.5 17.5C19.5 18.6 18.6 19.5 17.5 19.5C16.4 19.5 15.5 18.6 15.5 17.5C15.5 16.4 16.4 15.5 17.5 15.5C18.6 15.5 19.5 16.4 19.5 17.5Z" fill="#1777CF" />
    <Path d="M17.5 26.5C18.6 26.5 19.5 25.6 19.5 24.5C19.5 23.4 18.6 22.5 17.5 22.5C16.4 22.5 15.5 23.4 15.5 24.5C15.5 25.6 16.4 26.5 17.5 26.5Z" fill="#1777CF" />
  </Svg>
));

/**
 * Ícone de microfone (botão principal azul)
 */
const MicIcon = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect width={40} height={40} rx={6} fill="#1777CF" />
    <Path d="M26.5 18V20C26.5 21.7 25.8 23.3 24.6 24.5C23.4 25.7 21.7 26.4 20 26.4M20 26.4C18.3 26.4 16.6 25.7 15.4 24.5C14.2 23.3 13.5 21.7 13.5 20V18M20 26.4V30M16.3 30H23.7M20 10C18.9 10 17.9 10.4 17.1 11.2C16.3 12 15.9 13 15.9 14V20C15.9 21 16.3 22 17.1 22.8C17.9 23.6 18.9 24 20 24C21.1 24 22.1 23.6 22.9 22.8C23.7 22 24.1 21 24.1 20V14C24.1 13 23.7 12 22.9 11.2C22.1 10.4 21.1 10 20 10Z" stroke="white" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de microfone pequeno (cinza para estado pausado)
 */
const MicSmallIcon = memo(() => (
  <Svg width={13} height={20} viewBox="0 0 13 20" fill="none">
    <Path d="M12.5 8V10C12.5 11.7 11.8 13.3 10.6 14.5C9.4 15.7 7.7 16.4 6 16.4M6 16.4C4.3 16.4 2.6 15.7 1.4 14.5C0.2 13.3 -0.5 11.7 -0.5 10V8M6 16.4V20M2.3 20H9.7M6 0C4.9 0 3.9 0.4 3.1 1.2C2.3 2 1.9 3 1.9 4V10C1.9 11 2.3 12 3.1 12.8C3.9 13.6 4.9 14 6 14C7.1 14 8.1 13.6 8.9 12.8C9.7 12 10.1 11 10.1 10V4C10.1 3 9.7 2 8.9 1.2C8.1 0.4 7.1 0 6 0Z" stroke="#7D8592" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de enviar (SEMPRE AZUL)
 */
const SendBtnIcon = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect width={40} height={40} rx={6} fill="#1777CF" />
    <Path d="M10 28L30 20L10 12V18L24 20L10 22V28Z" fill="white" />
  </Svg>
));

/**
 * Ícone de mais (anexos) cinza
 */
const PlusBtn = memo(() => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M12 5V19M5 12H19" stroke="#7D8592" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de play (cinza)
 */
const PlayIcon = memo(() => (
  <Svg width={13} height={15} viewBox="0 0 13 15" fill="none">
    <Path d="M1 1V14L12 7.5L1 1Z" fill="#7D8592" stroke="#7D8592" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de pausa (duas barras)
 */
const PauseIcon = memo(() => (
  <Svg width={11} height={14} viewBox="0 0 11 14" fill="none">
    <Rect x={0} y={0} width={3.5} height={14} rx={1} fill="#7D8592" />
    <Rect x={7.5} y={0} width={3.5} height={14} rx={1} fill="#7D8592" />
  </Svg>
));

/**
 * Ícone de lixeira
 */
const TrashIcon = memo(() => (
  <Svg width={13} height={15} viewBox="0 0 13 15" fill="none">
    <Path d="M0.5 3.5H2H12.5" stroke="#7D8592" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.5 3.5V2C3.5 1.6 3.7 1.2 4 0.9C4.3 0.6 4.7 0.5 5 0.5H8C8.3 0.5 8.7 0.6 9 0.9C9.3 1.2 9.5 1.6 9.5 2V3.5M11 3.5V13C11 13.4 10.8 13.8 10.5 14.1C10.2 14.4 9.8 14.5 9.5 14.5H3.5C3.2 14.5 2.8 14.4 2.5 14.1C2.2 13.8 2 13.4 2 13V3.5H11Z" stroke="#7D8592" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M5 6.5V11.5" stroke="#7D8592" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M8 6.5V11.5" stroke="#7D8592" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
));

/**
 * Ícone de Fotos (EXATO do Figma - SVG Original)
 */
const PhotosIconFigma = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} fill="#1777CF" />
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} stroke="#FCFCFC" strokeWidth={0.8} />
    <Path 
      d="M15.4467 25.3182C14.8267 25.317 14.2227 25.115 13.7197 24.7406C13.2167 24.3662 12.8399 23.8382 12.6423 23.231L12.6146 23.1369C12.5259 22.8501 12.4797 22.5511 12.4776 22.25V16.6716L10.5569 23.2973C10.4393 23.7687 10.5055 24.269 10.7412 24.6906C10.977 25.1121 11.3634 25.4212 11.8173 25.5514L24.06 28.9395C24.2128 28.9804 24.3656 29 24.516 29C25.3046 29 26.0251 28.4592 26.227 27.6623L26.9403 25.3182H15.4467ZM17.6239 16.7273C18.4972 16.7273 19.2074 15.9934 19.2074 15.0909C19.2074 14.1885 18.4972 13.4545 17.6239 13.4545C16.7506 13.4545 16.0405 14.1885 16.0405 15.0909C16.0405 15.9934 16.7506 16.7273 17.6239 16.7273Z" 
      fill="#FCFCFC" 
    />
    <Path 
      d="M27.5207 11H15.6446C15.1198 11.0006 14.6167 11.2164 14.2457 11.5998C13.8746 11.9833 13.6659 12.5032 13.6652 13.0455V22.0455C13.6652 23.1729 14.5536 24.0909 15.6446 24.0909H27.5207C28.6117 24.0909 29.5 23.1729 29.5 22.0455V13.0455C29.5 11.918 28.6117 11 27.5207 11ZM15.6446 12.6364H27.5207C27.6256 12.6364 27.7263 12.6795 27.8006 12.7562C27.8748 12.8329 27.9165 12.937 27.9165 13.0455V18.8537L25.4154 15.8379C25.2832 15.6809 25.1201 15.5549 24.937 15.4681C24.754 15.3813 24.5551 15.3359 24.3537 15.3347C24.1516 15.3358 23.9522 15.3826 23.7695 15.4718C23.5867 15.561 23.4251 15.6904 23.2959 15.851L20.3554 19.4985L19.3974 18.5109C19.1369 18.2421 18.7838 18.0911 18.4157 18.0911C18.0475 18.0911 17.6944 18.2421 17.4339 18.5109L15.2487 20.7683V13.0455C15.2487 12.937 15.2904 12.8329 15.3647 12.7562C15.4389 12.6795 15.5396 12.6364 15.6446 12.6364Z" 
      fill="#FCFCFC" 
    />
  </Svg>
));

/**
 * Ícone de Câmera (EXATO do Figma - SVG Original)
 */
const CameraIconFigma = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} fill="#1777CF" />
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} stroke="#FCFCFC" strokeWidth={0.8} />
    <Path 
      d="M29 14.7429H25.535C25.3704 14.7428 25.2083 14.7056 25.0631 14.6346C24.918 14.5635 24.7943 14.4608 24.703 14.3355L23.5935 12.8142C23.4109 12.5637 23.1634 12.3584 22.8731 12.2163C22.5829 12.0743 22.2587 12 21.9295 12H18.0705C17.7413 12 17.4171 12.0743 17.1269 12.2163C16.8366 12.3584 16.5891 12.5637 16.4065 12.8142L15.297 14.3355C15.2057 14.4608 15.082 14.5635 14.9369 14.6346C14.7917 14.7056 14.6296 14.7428 14.465 14.7429H14V14.2857C14 14.1645 13.9473 14.0482 13.8536 13.9625C13.7598 13.8767 13.6326 13.8286 13.5 13.8286H12C11.8674 13.8286 11.7402 13.8767 11.6464 13.9625C11.5527 14.0482 11.5 14.1645 11.5 14.2857V14.7429H11C10.4696 14.7429 9.96086 14.9355 9.58579 15.2784C9.21071 15.6214 9 16.0865 9 16.5714V26.1714C9 26.6564 9.21071 27.1215 9.58579 27.4644C9.96086 27.8073 10.4696 28 11 28H29C29.5304 28 30.0391 27.8073 30.4142 27.4644C30.7893 27.1215 31 26.6564 31 26.1714V16.5714C31 16.0865 30.7893 15.6214 30.4142 15.2784C30.0391 14.9355 29.5304 14.7429 29 14.7429ZM20 26.1714C18.8628 26.1714 17.7511 25.8631 16.8055 25.2854C15.8599 24.7078 15.1229 23.8867 14.6877 22.9261C14.2525 21.9655 14.1386 20.9085 14.3605 19.8887C14.5823 18.8689 15.13 17.9321 15.9341 17.1969C16.7383 16.4617 17.7628 15.961 18.8782 15.7582C19.9936 15.5553 21.1498 15.6594 22.2004 16.0573C23.2511 16.4552 24.1491 17.129 24.781 17.9936C25.4128 18.8581 25.75 19.8745 25.75 20.9143C25.75 22.3086 25.1442 23.6457 24.0659 24.6316C22.9875 25.6176 21.525 26.1714 20 26.1714Z" 
      fill="#FCFCFC" 
    />
    <Path 
      d="M20 17.4857C19.2583 17.4857 18.5333 17.6868 17.9166 18.0635C17.2999 18.4403 16.8193 18.9757 16.5355 19.6022C16.2516 20.2287 16.1774 20.9181 16.3221 21.5832C16.4667 22.2482 16.8239 22.8592 17.3483 23.3387C17.8728 23.8181 18.541 24.1447 19.2684 24.277C19.9958 24.4093 20.7498 24.3414 21.4351 24.0819C22.1203 23.8224 22.706 23.3829 23.118 22.8191C23.5301 22.2553 23.75 21.5924 23.75 20.9143C23.75 20.005 23.3549 19.1329 22.6517 18.4899C21.9484 17.8469 20.9946 17.4857 20 17.4857ZM20 22.9714C19.4035 22.9708 18.8316 22.7539 18.4097 22.3682C17.9879 21.9826 17.7507 21.4597 17.75 20.9143C17.75 20.793 17.8027 20.6768 17.8964 20.591C17.9902 20.5053 18.1174 20.4571 18.25 20.4571C18.3826 20.4571 18.5098 20.5053 18.6036 20.591C18.6973 20.6768 18.75 20.793 18.75 20.9143C18.75 21.2174 18.8817 21.5081 19.1161 21.7224C19.3505 21.9367 19.6685 22.0571 20 22.0571C20.1326 22.0571 20.2598 22.1053 20.3536 22.191C20.4473 22.2768 20.5 22.393 20.5 22.5143C20.5 22.6355 20.4473 22.7518 20.3536 22.8375C20.2598 22.9233 20.1326 22.9714 20 22.9714Z" 
      fill="#FCFCFC" 
    />
  </Svg>
));

/**
 * Ícone de Documento (EXATO do Figma - SVG Original)
 */
const DocumentIconFigma = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} fill="#1777CF" />
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} stroke="#FCFCFC" strokeWidth={0.8} />
    <Path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M22.7115 11.9091L26.0984 15.3252H22.7115V11.9091ZM26.2339 29C26.6562 29 27 28.6535 27 28.2276V16.611H22.0742C21.722 16.611 21.4368 16.3232 21.4368 15.9682V11H13.7657C13.3433 11 13 11.3465 13 11.7724V28.2276C13 28.6535 13.3434 29 13.7657 29H26.2339Z" 
      fill="#FCFCFC" 
    />
  </Svg>
));

/**
 * Ícone de Emoji (EXATO do Figma - SVG Original)
 */
const EmojiIconFigma = memo(() => (
  <Svg width={40} height={40} viewBox="0 0 40 40" fill="none">
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} fill="#1777CF" />
    <Rect x={0.4} y={0.4} width={39.2} height={39.2} rx={9.6} stroke="#FCFCFC" strokeWidth={0.8} />
    <Path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M20 10C14.486 10 10 14.4869 10 20C10 25.515 14.486 30 20 30C25.514 30 30 25.515 30 20C30 14.4869 25.514 10 20 10ZM25.0669 23.6172C24.5228 24.4674 23.7735 25.167 22.8881 25.6516C22.0026 26.1362 21.0094 26.3902 20 26.3902C18.9906 26.3902 17.9974 26.1362 17.112 25.6516C16.2265 25.167 15.4772 24.4674 14.9331 23.6172C14.8477 23.4777 14.8203 23.3103 14.8569 23.1509C14.8935 22.9915 14.9911 22.8528 15.1288 22.7645C15.2665 22.6763 15.4333 22.6455 15.5934 22.6788C15.7535 22.7121 15.8942 22.8069 15.9853 22.9428C16.4165 23.6162 17.0103 24.1704 17.7119 24.5542C18.4134 24.938 19.2003 25.1392 20 25.1392C20.7997 25.1392 21.5866 24.938 22.2881 24.5542C22.9897 24.1704 23.5835 23.6162 24.0147 22.9428C24.1057 22.8067 24.2464 22.7117 24.4066 22.6782C24.5669 22.6447 24.7338 22.6755 24.8717 22.7638C25.0095 22.8522 25.1071 22.991 25.1437 23.1506C25.1802 23.3102 25.1526 23.4777 25.0669 23.6172ZM15.0375 17.1863C15.0375 16.7978 15.1918 16.4252 15.4665 16.1505C15.7413 15.8758 16.1138 15.7215 16.5023 15.7215H16.5026C16.7923 15.7215 17.0755 15.8074 17.3164 15.9684C17.5573 16.1293 17.745 16.3581 17.8559 16.6258C17.9668 16.8934 17.9958 17.188 17.9393 17.4721C17.8828 17.7563 17.7432 18.0173 17.5384 18.2221C17.3335 18.427 17.0725 18.5665 16.7884 18.623C16.5042 18.6795 16.2097 18.6505 15.942 18.5397C15.6743 18.4288 15.4456 18.241 15.2846 18.0002C15.1236 17.7593 15.0377 17.476 15.0377 17.1863H15.0375ZM22.0328 17.1863C22.0328 16.7978 22.1871 16.4252 22.4619 16.1505C22.7366 15.8758 23.1092 15.7215 23.4977 15.7215H23.4979C23.7876 15.7215 24.0709 15.8074 24.3118 15.9684C24.5526 16.1293 24.7404 16.3581 24.8513 16.6258C24.9621 16.8934 24.9911 17.188 24.9346 17.4721C24.8781 17.7563 24.7386 18.0173 24.5337 18.2221C24.3289 18.427 24.0679 18.5665 23.7837 18.623C23.4996 18.6795 23.205 18.6505 22.9374 18.5397C22.6697 18.4288 22.4409 18.241 22.28 18.0002C22.119 17.7593 22.0331 17.476 22.0331 17.1863H22.0328Z" 
      fill="#FCFCFC" 
    />
  </Svg>
));

// Removido: MessageAudioPlayer interno (substituído pelo componente do arquivo de áudio)

// ===========================================================================
// Componente Principal
// ===========================================================================

const DiscountChatScreen: React.FC = () => {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // =========================================================================
  // Estados
  // =========================================================================

  const [msgs, setMsgs] = useState<ChatMessage[]>(INIT_MSGS);
  const [txt, setTxt] = useState('');
  const [bottomPanel, setBottomPanel] = useState<BottomPanelState>('none');
  const [callModalVisible, setCallModalVisible] = useState(false);
  const [callAnchor, setCallAnchor] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);
  const moreBtnRef = useRef<View>(null);
  const [contactLayout, setContactLayout] = useState<{ x: number; y: number; width: number; height: number } | undefined>(undefined);

  const formatCardNumber = (n: number) => n.toString().padStart(2, '0');
  const gerenciarBadgeCount = 6;
  const chatBadgeCount = 3;

  // =========================================================================
  // Refs
  // =========================================================================

  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);
  // Refs para controle de auto-play de áudios em sequência
  const audioPlayerRefs = useRef<Map<string, MessageAudioPlayerRef>>(new Map());

  // =========================================================================
// Cálculo de Altura
  // =========================================================================

  const getPanelHeight = () => {
    if (bottomPanel === 'options') return OPTIONS_HEIGHT;
    if (bottomPanel === 'emoji') return EMOJI_HEIGHT;
    return 0;
  };

  const messagesAreaHeight = windowHeight 
    - insets.top 
    - insets.bottom 
    - HEADER_HEIGHT 
    - CONTACT_HEIGHT 
    - INPUT_HEIGHT 
    - INPUT_BOTTOM_PADDING
    - CHAT_INPUT_GAP
    - getPanelHeight()
    - (bottomPanel === 'options' ? OPTIONS_BOTTOM_PADDING : 0)
    - (bottomPanel === 'emoji' ? EMOJI_BOTTOM_PADDING : 0)
    + 32;

  useEffect(() => {
    console.log('DiscountChat msgsArea metrics', {
      windowHeight,
      insetsTop: insets.top,
      insetsBottom: insets.bottom,
      header: HEADER_HEIGHT,
      contact: CONTACT_HEIGHT,
      input: INPUT_HEIGHT,
      inputBottomPadding: INPUT_BOTTOM_PADDING,
      chatInputGap: CHAT_INPUT_GAP,
      panel: bottomPanel,
      height: messagesAreaHeight,
    });
  }, [messagesAreaHeight, bottomPanel, windowHeight, insets.top, insets.bottom]);

  // =========================================================================
  // Efeitos
  // =========================================================================

  

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);
    return () => clearTimeout(t);
  }, [msgs.length]);

  

  

  // =========================================================================
// Funções de Permissão
  // =========================================================================

  

  // =========================================================================
// Funções Utilitárias
  // =========================================================================

  const id = useCallback(() => `m${Date.now()}${Math.random().toString(36).slice(2, 8)}`, []);
  const time = useCallback(() => `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`, []);
  const fmt = useCallback((s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`, []);

  // =========================================================================
// Funções de Mensagem
  // =========================================================================

  // Array de emojis Unicode correspondentes aos SVGs do EmojiContainer
  // A ordem DEVE corresponder exatamente aos emojis SVG (Emoji01 a Emoji30)
  const EMOJI_UNICODE_MAP = [
    // Linha 1 (Emoji01 a Emoji06)
    '\u{1F600}', // 01 - Carinha sorrindo com boca aberta (grinning face)
    '\u{1F61F}', // 02 - Carinha triste com sobrancelhas (worried face)
    '\u{1F622}', // 03 - Carinha chorando com lagrimas (crying face)
    '\u{1F603}', // 04 - Carinha com boca aberta sorrindo (grinning face with big eyes)
    '\u{1F632}', // 05 - Carinha com expressao de surpresa (astonished face)
    '\u{1F62F}', // 06 - Carinha com expressao de "O" (hushed face)
    // Linha 2 (Emoji07 a Emoji12)
    '\u{1F62E}', // 07 - Carinha surpresa com boca em "O" (face with open mouth)
    '\u{1F627}', // 08 - Carinha preocupada com sobrancelhas levantadas (anguished face)
    '\u{1F60A}', // 09 - Carinha feliz com bochechas rosadas (smiling face with smiling eyes)
    '\u{1F618}', // 10 - Carinha com coracao e beijo (face blowing a kiss)
    '\u{1F60D}', // 11 - Carinha com coracoes nos olhos (smiling face with heart-eyes)
    '\u{1F970}', // 12 - Carinha apaixonada com lagrimas de alegria (smiling face with hearts)
    // Linha 3 (Emoji13 a Emoji18)
    '\u{1F60E}', // 13 - Carinha sorrindo com oculos escuros (smiling face with sunglasses)
    '\u{1F635}', // 14 - Carinha com X nos olhos (dizzy face)
    '\u{1F641}', // 15 - Carinha triste com sobrancelhas inclinadas (slightly frowning face)
    '\u{1F621}', // 16 - Carinha com raiva (pouting face)
    '\u{1F642}', // 17 - Carinha com olhos grandes e sorriso leve (slightly smiling face)
    '\u{1F929}', // 18 - Carinha sorrindo com estrela brilhando (star-struck)
    // Linha 4 (Emoji19 a Emoji24)
    '\u{1F607}', // 19 - Carinha feliz simples (smiling face with halo)
    '\u{1F61B}', // 20 - Carinha com lingua para fora (face with tongue)
    '\u{1F643}', // 21 - Carinha triste invertida (upside-down face)
    '\u{1F92A}', // 22 - Carinha maluca com olhos grandes e lingua (zany face)
    '\u{1F976}', // 23 - Carinha azul com frio (cold face)
    '\u{1F922}', // 24 - Carinha verde enjoada (nauseated face)
    // Linha 5 (Emoji25 a Emoji30)
    '\u{1F914}', // 25 - Carinha pensativa com sobrancelhas (thinking face)
    '\u{1F605}', // 26 - Carinha sorrindo com gota de suor (grinning face with sweat)
    '\u{1F44D}', // 27 - Like (thumbs up)
    '\u{2764}\u{FE0F}', // 28 - Coracao vermelho (red heart)
    '\u{1F608}', // 29 - Carinha vermelha com orelhas (smiling face with horns)
    '\u{1F47F}', // 30 - Carinha vermelha com orelhas de gato (angry face with horns)
  ];

  /**
   * Envia a mensagem de texto (pode conter emojis)
   */
  const send = useCallback(() => {
    const t = txt.trim();
    if (!t) return;
    
    // Regex para detectar emojis Unicode
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F000}-\u{1FFFF}]+$/u;
    
    // Verifica se o texto contem APENAS emoji(s)
    const isOnlyEmoji = emojiRegex.test(t);
    
    if (isOnlyEmoji) {
      // Envia como sticker (emoji grande, fora da bolha)
      // Encontra o indice do emoji no EMOJI_UNICODE_MAP
      const emojiIndex = EMOJI_UNICODE_MAP.findIndex(e => t.includes(e));
      const stickerEmojiId = emojiIndex >= 0 ? `emoji_${emojiIndex + 1}` : 'emoji_1';
      
      setMsgs(p => [...p, { 
        id: id(), 
        type: 'sticker', 
        content: 'sticker', 
        sender: 'user', 
        timestamp: time(),
        stickerEmoji: stickerEmojiId
      }]);
    } else {
      // Envia como texto normal (emoji fica inline no texto)
      setMsgs(p => [...p, { id: id(), type: 'text', content: t, sender: 'user', timestamp: time() }]);
    }
    
    setTxt('');
    setBottomPanel('none');
    
    // Resposta automatica
    setTimeout(() => {
      setMsgs(p => [...p, { id: id(), type: 'text', content: RESPONSES[Math.floor(Math.random() * RESPONSES.length)], sender: 'contact', timestamp: time() }]);
    }, 1500);
  }, [txt, id, time]);

  /**
   * Adiciona um emoji ao texto do input (nao envia, apenas insere)
   * O emoji e adicionado a posicao atual do cursor
   */
  const insertEmoji = useCallback((index: number) => {
    const emoji = EMOJI_UNICODE_MAP[index] || '\u{1F600}';
    setTxt(prev => prev + emoji);
    // Mantem o foco no input
    inputRef.current?.focus();
  }, []);

  const handleSendAudio = useCallback((durationSec: number, uri?: string | null) => {
    setMsgs(p => [...p, {
      id: id(),
      type: 'audio',
      content: 'audio',
      sender: 'user',
      timestamp: time(),
      audioDuration: fmt(durationSec),
      audioUri: uri || undefined,
    }]);
    setBottomPanel('none');
  }, [id, time, fmt]);

  // =========================================================================
// Funções de Mídia (Foto, Câmera, Documento)
  // =========================================================================

  /**
   * Abre a galeria de fotos para o usuário selecionar uma imagem
   */
  const pickPhoto = async () => {
    try {
      // Solicita permissão de acesso à galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Para selecionar fotos, precisamos de acesso à sua galeria.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Abre a galeria apenas para imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // Envia a imagem como mensagem do usuário
        setMsgs(p => [...p, { 
          id: id(), 
          type: 'image', 
          content: '', 
          imageUri,
          sender: 'user', 
          timestamp: time() 
        }]);
        setBottomPanel('none');
        
        // Resposta automática
        setTimeout(() => {
          setMsgs(p => [...p, { 
            id: id(), 
            type: 'text', 
            content: 'Recebi sua foto!', 
            sender: 'contact', 
            timestamp: time() 
          }]);
        }, 1500);
      }
    } catch (error) {
      console.log('Erro ao selecionar foto:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
    }
  };

  /**
   * Abre a câmera para tirar uma foto
   */
  const openCamera = async () => {
    try {
      // Solicita permissão de acesso à câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão Necessária',
          'Para usar a câmera, precisamos de acesso à sua câmera.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Abre a câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // Envia a foto da câmera como mensagem do usuário
        setMsgs(p => [...p, { 
          id: id(), 
          type: 'image', 
          content: '', 
          imageUri,
          sender: 'user', 
          timestamp: time() 
        }]);
        setBottomPanel('none');
        
        // Resposta automática
        setTimeout(() => {
          setMsgs(p => [...p, { 
            id: id(), 
            type: 'text', 
            content: 'Recebi sua foto da câmera!', 
            sender: 'contact', 
            timestamp: time() 
          }]);
        }, 1500);
      }
    } catch (error) {
      console.log('Erro ao abrir câmera:', error);
      Alert.alert('Erro', 'Não foi possível abrir a câmera.');
    }
  };

  /**
   * Abre o seletor de documentos para o usuário escolher arquivos
   */
  const pickDocument = async () => {
    try {
      // Abre o seletor de documentos
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Aceita qualquer tipo de arquivo
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const doc = result.assets[0];
        const fileName = doc.name || 'Documento';
        
        // Simula envio de documento como mensagem
        setMsgs(p => [...p, { 
          id: id(), 
          type: 'text', 
          content: `📄 ${fileName}`, 
          sender: 'user', 
          timestamp: time() 
        }]);
        setBottomPanel('none');
        
        // Resposta automática
        setTimeout(() => {
          setMsgs(p => [...p, { 
            id: id(), 
            type: 'text', 
            content: 'Recebi seu documento!', 
            sender: 'contact', 
            timestamp: time() 
          }]);
        }, 1500);
      }
    } catch (error) {
      console.log('Erro ao selecionar documento:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    }
  };

  /**
   * Fecha o painel inferior quando o usuário clica fora
   */
  const closePanel = useCallback(() => {
    if (bottomPanel !== 'none') {
      setBottomPanel('none');
    }
  }, [bottomPanel]);

  

  // =========================================================================
  // Toggle Painel
  // =========================================================================

  const toggleOptions = () => {
    Keyboard.dismiss();
    setBottomPanel(prev => prev === 'options' ? 'none' : 'options');
  };

  const openEmoji = () => {
    setBottomPanel('emoji');
  };

  // =========================================================================
  // Render Mensagem
  // =========================================================================

  const renderMsg = useCallback((m: ChatMessage, isLast: boolean = false, msgIndex: number = 0) => {
    const u = m.sender === 'user';
    // Remove marginBottom da última mensagem para que CHAT_INPUT_GAP controle o espaço
    const rowStyle = isLast 
      ? [styles.msgRow, u ? styles.msgR : styles.msgL, { marginBottom: 0 }]
      : [styles.msgRow, u ? styles.msgR : styles.msgL];
    
    if (m.type === 'text') {
      return (
        <View key={m.id} style={rowStyle}>
          <View style={[styles.bubble, u ? styles.bubbleU : styles.bubbleC]}>
            <Text style={[styles.bubbleTxt, u ? styles.txtW : styles.txtD]}>{m.content}</Text>
            <Text style={[styles.timeT, u ? styles.timeW : styles.timeG]}>{m.timestamp}</Text>
          </View>
        </View>
      );
    }
    
    if (m.type === 'image' && m.imageUri) {
      return (
        <View key={m.id} style={rowStyle}>
          <ChatImageMessage uri={m.imageUri} timestamp={m.timestamp} isUser={u} />
        </View>
      );
    }

    if (m.type === 'audio') {
      // Verifica se a próxima mensagem também é áudio (para auto-play)
      const nextMsg = msgs[msgIndex + 1];
      const hasNextAudio = nextMsg?.type === 'audio';
      
      // Callback para tocar próximo áudio quando este terminar
      const handleAudioFinished = () => {
        if (!hasNextAudio) return;
        const nextPlayerRef = audioPlayerRefs.current.get(msgs[msgIndex + 1]?.id);
        if (nextPlayerRef) {
          nextPlayerRef.play();
        }
      };
      
      return (
        <View key={m.id} style={rowStyle}>
          <MessageAudioPlayer
            ref={(ref) => {
              if (ref) {
                audioPlayerRefs.current.set(m.id, ref);
              } else {
                audioPlayerRefs.current.delete(m.id);
              }
            }}
            message={m}
            isUser={u}
            onFinished={hasNextAudio ? handleAudioFinished : undefined}
          />
        </View>
      );
    }
    
    if (m.type === 'sticker') {
      // Array de emojis Unicode para stickers - DEVE corresponder ao EMOJI_UNICODE_MAP
      const STICKER_EMOJIS = [
        // Linha 1 (Emoji01 a Emoji06)
        '\u{1F600}', '\u{1F61F}', '\u{1F622}', '\u{1F603}', '\u{1F632}', '\u{1F62F}',
        // Linha 2 (Emoji07 a Emoji12)
        '\u{1F62E}', '\u{1F627}', '\u{1F60A}', '\u{1F618}', '\u{1F60D}', '\u{1F970}',
        // Linha 3 (Emoji13 a Emoji18)
        '\u{1F60E}', '\u{1F635}', '\u{1F641}', '\u{1F621}', '\u{1F642}', '\u{1F929}',
        // Linha 4 (Emoji19 a Emoji24)
        '\u{1F607}', '\u{1F61B}', '\u{1F643}', '\u{1F92A}', '\u{1F976}', '\u{1F922}',
        // Linha 5 (Emoji25 a Emoji30)
        '\u{1F914}', '\u{1F605}', '\u{1F44D}', '\u{2764}\u{FE0F}', '\u{1F608}', '\u{1F47F}',
      ];
      // Extrai o indice do emoji do identificador (ex: "emoji_25" -> 25)
      const emojiIndex = parseInt(m.stickerEmoji?.replace('emoji_', '') || '1', 10);
      const emojiChar = STICKER_EMOJIS[emojiIndex - 1] || '\u{1F600}';
      
      return (
        <View key={m.id} style={rowStyle}>
          <View style={styles.stickerBox}>
            <Text style={styles.stickerEmoji}>{emojiChar}</Text>
            <Text style={styles.stickerT}>{m.timestamp}</Text>
          </View>
        </View>
      );
    }
    
    return null;
  }, [msgs]);

  

  // =========================================================================
  // Render Input Area
  // =========================================================================

  const renderInputArea = () => {
    return (
      <ChatAudioInput
        txt={txt}
        setTxt={setTxt}
        onSendText={send}
        toggleOptions={toggleOptions}
        inputRef={inputRef}
        onSendAudio={handleSendAudio}
      />
    );
  };

  // =========================================================================
  // Render Painel de Opções (ÍCONES EXATOS DO FIGMA)
  // =========================================================================

  const renderOptionsPanel = () => {
    if (bottomPanel !== 'options') return null;

    return (
      <View style={[styles.optionsPanel, { marginBottom: OPTIONS_BOTTOM_PADDING }]}>
        <View style={styles.optionsRow}>
          {/* Fotos - Abre galeria de imagens */}
          <TouchableOpacity style={styles.optionItem} onPress={pickPhoto} activeOpacity={0.7}>
            <PhotosIconFigma />
            <Text style={styles.optionLabel}>Fotos</Text>
          </TouchableOpacity>

          {/* Câmera - Abre câmera do dispositivo */}
          <TouchableOpacity style={styles.optionItem} onPress={openCamera} activeOpacity={0.7}>
            <CameraIconFigma />
            <Text style={styles.optionLabel}>Câmera</Text>
          </TouchableOpacity>

          {/* Documento - Abre seletor de arquivos */}
          <TouchableOpacity style={styles.optionItem} onPress={pickDocument} activeOpacity={0.7}>
            <DocumentIconFigma />
            <Text style={styles.optionLabel}>Documento</Text>
          </TouchableOpacity>

          {/* Emoji - Abre painel de emojis */}
          <TouchableOpacity style={styles.optionItem} onPress={openEmoji} activeOpacity={0.7}>
            <EmojiIconFigma />
            <Text style={styles.optionLabel}>Emoji</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // =========================================================================
  // Render Painel de Emojis (NOVO COMPONENTE SVG)
  // =========================================================================

  const renderEmojiPanel = () => {
    if (bottomPanel !== 'emoji') return null;

    return (
      <View style={[styles.emojiPanel, { marginBottom: EMOJI_BOTTOM_PADDING }]}>
        <EmojiContainer onSelectEmoji={insertEmoji} />
      </View>
    );
  };

  // =========================================================================
  // Render Principal
  // =========================================================================

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <View style={styles.header}>
        <View style={styles.backRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => nav.navigate(ScreenNames.SalesHome as any, { autoOpenDiscount: true } as any)}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <BackIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={styles.tabsRow}>
          <View style={styles.tabsBox}>
            <TouchableOpacity style={[styles.tab, styles.tabWCliente]} onPress={() => nav.navigate(ScreenNames.DiscountCustomer as any)}>
              <Text style={styles.tabT}>Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.tabWVenda]} onPress={() => nav.navigate(ScreenNames.DiscountSales as any)}>
              <Text style={styles.tabT}>Venda</Text>
            </TouchableOpacity>
            <View style={styles.tabBtnWithBadge}>
              <TouchableOpacity style={[styles.tab, styles.tabWGerenciar]} onPress={() => nav.navigate(ScreenNames.DiscountManage as any)}>
                <Text style={styles.tabT}>Gerenciar</Text>
              </TouchableOpacity>
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{formatCardNumber(gerenciarBadgeCount)}</Text>
              </View>
            </View>
            <View style={styles.tabBtnWithBadge}>
              <View style={[styles.tab, styles.tabWChat, styles.tabOn]}>
                <Text style={[styles.tabT, styles.tabTOn]}>Chat</Text>
              </View>
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{formatCardNumber(chatBadgeCount)}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ================================================================= */}
      {/* CONTACT CARD */}
      {/* ================================================================= */}
      <View style={styles.contactCard} onLayout={(e) => setContactLayout(e.nativeEvent.layout)}>
        <Image source={require('../../../assets/01-Foto.png')} style={styles.avatar} />
        <View style={styles.contactInfo}>
          <Text style={styles.contactN}>Gestor</Text>
          <Text style={styles.contactS}>Andrade de Mello</Text>
        </View>
        <TouchableOpacity
          ref={moreBtnRef}
          style={styles.moreBtn}
          onLayout={() => {
            // no-op: apenas garante ref
          }}
          onPress={() => {
            let used = false;
            const node: any = moreBtnRef.current as any;
            try {
              node?.measureInWindow?.((x: number, y: number, width: number, height: number) => {
                setCallAnchor({ x, y, width, height });
                setCallModalVisible(true);
                used = true;
              });
            } catch {}
            if (!used) {
              // Fallback baseado no layout relativo do contato
              const btnW = 35;
              const rightPadding = 15;
              const topPadding = 20;
              const x = (Dimensions.get('window').width - rightPadding - btnW);
              const y = insets.top + HEADER_HEIGHT + topPadding;
              setCallAnchor({ x, y, width: btnW, height: btnW });
              setCallModalVisible(true);
            }
          }}
        >
          <MoreIcon />
        </TouchableOpacity>
      </View>

      {/* ================================================================= */}
      {/* MESSAGES AREA - Fecha painel ao tocar */}
      {/* ================================================================= */}
      <TouchableWithoutFeedback onPress={closePanel}>
        <View
          style={[styles.msgsArea, { height: messagesAreaHeight }]}
          onLayout={(e) => {
            console.log('DiscountChat msgsArea layout', e.nativeEvent.layout);
          }}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
            overScrollMode="never"
          >
            {msgs.map((m, index) => renderMsg(m, index === msgs.length - 1, index))}
            {/* Espaçador entre a última mensagem e o container de input */}
            <View style={{ height: CHAT_INPUT_GAP }} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* ================================================================= */}
      {/* BOTTOM CONTAINER (INPUT + PANELS) */}
      {/* ================================================================= */}
      <View style={[styles.bottomContainer, { height: INPUT_HEIGHT + INPUT_BOTTOM_PADDING + getPanelHeight() + (bottomPanel === 'options' ? OPTIONS_BOTTOM_PADDING : 0) + (bottomPanel === 'emoji' ? EMOJI_BOTTOM_PADDING : 0) + (Platform.OS === 'ios' ? insets.bottom : 0), paddingBottom: INPUT_BOTTOM_PADDING }]}>
        <View
          style={styles.inputArea}
          onLayout={(e) => {
            const { y, height } = e.nativeEvent.layout;
            console.log('DiscountChat inputArea layout', { y, height });
          }}
        >
          {renderInputArea()}
        </View>
        {renderOptionsPanel()}
        {renderEmojiPanel()}
        <DiscountChatCallModal visible={callModalVisible} onClose={() => setCallModalVisible(false)} anchor={callAnchor} />
      </View>

      
    </View>
  );
};

// ===========================================================================
// Estilos
// ===========================================================================

const styles = StyleSheet.create({
  /**
   * Container raiz da tela
   */
  root: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },

  /**
   * Container do header
   */
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: '#FCFCFC',
  },

  /**
   * Linha do botão voltar
   */
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  /**
   * Botão de voltar
   */
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * Linha divisória
   */
  divider: {
    height: 1,
    backgroundColor: '#D8E0F0',
  },

  /**
   * Container das tabs
   */
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingTop: 18,
  },

  /**
   * Box das tabs
   */
  tabsBox: {
    height: 40,
    padding: 4,
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  /**
   * Tab individual
   */
  tab: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },

  /**
   * Tab ativa
   */
  tabOn: {
    backgroundColor: '#1777CF',
  },

  /**
   * Texto da tab
   */
  tabT: {
    color: '#3A3F51',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },

  /**
   * Texto da tab ativa
   */
  tabTOn: {
    color: '#FCFCFC',
  },

  tabWCliente: { minWidth: 70 },
  tabWVenda: { minWidth: 56 },
  tabWGerenciar: { minWidth: 92 },
  tabWChat: { minWidth: 60 },
  tabBtnWithBadge: {
    position: 'relative',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  tabBadge: {
    position: 'absolute',
    top: -20,
    left: '50%',
    width: 25,
    height: 25,
    borderRadius: 99,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.3,
    borderColor: '#D8E0F0',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }],
  },
  tabBadgeText: {
    color: '#1777CF',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },

  /**
   * Card de contato azul
   */
  contactCard: {
    height: CONTACT_HEIGHT,
    flexDirection: 'row',
    paddingTop: 20,
    paddingLeft: 25,
    paddingRight: 15,
    gap: 10,
    backgroundColor: '#1777CF',
  },

  /**
   * Avatar do contato
   */
  avatar: {
    width: 40,
    height: 52,
    borderRadius: 8,
  },

  /**
   * Informações do contato
   */
  contactInfo: {
    flex: 1,
    gap: 2,
  },

  /**
   * Nome do contato
   */
  contactN: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#FCFCFC',
    paddingTop: 6,
  },

  /**
   * Sobrenome do contato
   */
  contactS: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#FCFCFC',
    
  },

  /**
   * Botão de mais opções do contato
   */
  moreBtn: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Área de mensagens
   */
  msgsArea: {
    backgroundColor: '#FCFCFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    overflow: 'hidden',
  },

  /**
   * ScrollView das mensagens
   */
  scrollView: {
    flex: 1,
  },

  /**
   * Conteúdo do scroll
   */
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 0,
  },

  /**
   * Área de input
   */
  inputArea: {
    height: INPUT_HEIGHT,
    backgroundColor: '#FCFCFC',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingBottom: 0,
    marginBottom: 0,
  },

  /**
   * Linha do input
   */
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  /**
   * Box do input de texto
   */
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 40,
  },

  /**
   * Botão de anexos
   */
  attachBtn: {
    width: 30,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Input de texto
   */
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#3A3F51',
    paddingHorizontal: 8,
    height: 40,
    // Remove borda de foco (outline) no web/desktop
    outlineStyle: 'none' as any,
    borderWidth: 0,
  },

  /**
   * Botão de ação (mic/enviar)
   */
  actBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  

  /**
   * Painel de opções (Fotos, Câmera, Documento, Emoji)
   */
  optionsPanel: {
    height: OPTIONS_HEIGHT,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },

  /**
   * Linha de opções
   */
  optionsRow: {
    flexDirection: 'row',
    gap: 20,
  },

  /**
   * Item de opção individual
   */
  optionItem: {
    width: 60,
    alignItems: 'center',
    gap: 5,
  },

  /**
   * Label da opção
   */
  optionLabel: {
    fontSize: 12,
    color: '#3A3F51',
  },

  /**
   * Painel de emojis - container principal
   */
  emojiPanel: {
    height: EMOJI_HEIGHT,
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  /**
   * Conteúdo do scroll de emojis
   */
  emojiScrollContent: {
    paddingHorizontal: 15,
    alignItems: 'center',
  },

  /**
   * Grid de emojis - 6 colunas com gap de 20
   */
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  /**
   * Item de emoji individual
   */
  emojiItem: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Espaçador inferior
   */
  bottomSpacer: {
    height: BOTTOM_MARGIN,
    backgroundColor: '#FCFCFC',
  },

  /**
   * Linha de mensagem
   */
  msgRow: {
    marginBottom: 15,
  },

  /**
   * Mensagem alinhada à direita (usuário)
   */
  msgR: {
    alignItems: 'flex-end',
  },

  /**
   * Mensagem alinhada à esquerda (contato)
   */
  msgL: {
    alignItems: 'flex-start',
  },

  /**
   * Bolha da mensagem
   */
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
  },

  /**
   * Bolha do usuário (azul)
   */
  bubbleU: {
    backgroundColor: '#1777CF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 0,
  },

  /**
   * Bolha do contato (cinza)
   */
  bubbleC: {
    backgroundColor: '#F4F4F4',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },

  /**
   * Texto da bolha
   */
  bubbleTxt: {
    fontSize: 14,
    flex: 1,
  },

  /**
   * Texto branco
   */
  txtW: {
    color: '#FCFCFC',
  },

  /**
   * Texto escuro
   */
  txtD: {
    color: '#3A3F51',
  },

  /**
   * Texto de horário
   */
  timeT: {
    fontSize: 12,
  },

  /**
   * Horário branco
   */
  timeW: {
    color: 'rgba(255,255,255,0.7)',
  },

  /**
   * Horário cinza
   */
  timeG: {
    color: '#91929E',
  },

  /**
   * Box de áudio na mensagem
   */
  audioBox: {
    maxWidth: '85%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  /**
   * Botão de play/pause na mensagem
   */
  playB: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /**
   * Botão play do usuário (branco)
   */
  playBU: {
    backgroundColor: '#FCFCFC',
  },

  /**
   * Botão play do contato (cinza claro)
   */
  playBC: {
    backgroundColor: '#E8E8E8',
  },

  /**
   * Box do waveform na mensagem
   */
  waveBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    maxWidth: 100,
  },

  /**
   * Barra do waveform na mensagem
   */
  waveBar: {
    width: 2.5,
    borderRadius: 1.25,
  },

  /**
   * Duração do áudio
   */
  durT: {
    fontSize: 11,
    minWidth: 30,
  },

  /**
   * Botão de velocidade
   */
  speedBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },

  /**
   * Texto da velocidade
   */
  speedText: {
    fontSize: 11,
    fontWeight: '600',
  },

  /**
   * Box de figurinha/emoji
   */
  stickerBox: {
    alignItems: 'center',
  },

  /**
   * Emoji do sticker (texto grande)
   */
  stickerEmoji: {
    fontSize: 60,
  },

  /**
   * Horário da figurinha
   */
  stickerT: {
    fontSize: 12,
    color: '#91929E',
    marginTop: 4,
  },

  /**
   * Container inferior fixo que contém o input e painéis
   */
  bottomContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FCFCFC',
    paddingBottom: 0,
  },
});

export default DiscountChatScreen;
