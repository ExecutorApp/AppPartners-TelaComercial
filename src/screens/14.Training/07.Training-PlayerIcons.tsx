import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { COLORS } from './02.Training-Types';

// ========================================
// ICONES DO PLAYER DE TREINAMENTO
// ========================================

// Icone de Play (Player.txt - 35x35)
export const PlayIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 35 }) => (
  <Svg width={size} height={size} viewBox="0 0 35 35" fill="none">
    <Path
      d="M11.1895 9.5C11.337 9.50001 11.473 9.54603 11.5851 9.62244C11.5867 9.62352 11.5885 9.62422 11.5904 9.62449C11.5922 9.62467 11.5939 9.62522 11.5954 9.6261L24.1431 16.9189C24.3551 17.0326 24.5 17.2489 24.5 17.5C24.5 17.7508 24.3548 17.9668 24.1431 18.0806L11.5957 25.3737C11.5941 25.3746 11.5923 25.3751 11.5904 25.375C11.5884 25.3751 11.5865 25.3757 11.5849 25.3768C11.4727 25.4533 11.3371 25.5 11.1895 25.5C10.8087 25.5 10.5 25.2012 10.5 24.833V10.167C10.5 9.7988 10.8087 9.5 11.1895 9.5Z"
      fill={color}
    />
  </Svg>
);

// Icone de Pause
export const PauseIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 35 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="6" y="4" width="4" height="16" rx="1" fill={color} />
    <Rect x="14" y="4" width="4" height="16" rx="1" fill={color} />
  </Svg>
);

// Icone Anterior (Player.txt - 25x25)
export const PreviousIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <Path
      d="M6.5 7.35714V17.6429C6.5 17.8702 6.59052 18.0882 6.75165 18.2489C6.91278 18.4097 7.13131 18.5 7.35918 18.5H7.93197C8.15983 18.5 8.37837 18.4097 8.5395 18.2489C8.70063 18.0882 8.79115 17.8702 8.79115 17.6429V7.35714C8.79115 7.12981 8.70063 6.9118 8.5395 6.75105C8.37837 6.59031 8.15983 6.5 7.93197 6.5H7.35918C7.13131 6.5 6.91278 6.59031 6.75165 6.75105C6.59052 6.9118 6.5 7.12981 6.5 7.35714ZM10.4236 11.5743L16.6727 6.78571C16.8397 6.6602 17.0379 6.58267 17.2459 6.56151C17.4539 6.54036 17.6637 6.5764 17.8526 6.66571C18.0492 6.7604 18.2145 6.90913 18.3291 7.09439C18.4438 7.27964 18.503 7.49372 18.4999 7.71143V17.2886C18.5012 17.5008 18.4433 17.7092 18.3326 17.8905C18.2219 18.0717 18.0627 18.2186 17.873 18.3147C17.6833 18.4109 17.4706 18.4524 17.2586 18.4346C17.0466 18.4169 16.8437 18.3406 16.6727 18.2143L10.4236 13.4314C10.281 13.322 10.1655 13.1814 10.086 13.0204C10.0065 12.8594 9.96521 12.6823 9.96521 12.5029C9.96521 12.3234 10.0065 12.1463 10.086 11.9853C10.1655 11.8243 10.281 11.6837 10.4236 11.5743Z"
      fill={color}
      fillOpacity={0.6}
    />
  </Svg>
);

// Icone Proximo (Player.txt - 25x25)
export const NextIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <Path
      d="M18.5 7.35714V17.6429C18.5 17.8702 18.4095 18.0882 18.2484 18.2489C18.0872 18.4097 17.8687 18.5 17.6408 18.5H17.068C16.8402 18.5 16.6216 18.4097 16.4605 18.2489C16.2994 18.0882 16.2089 17.8702 16.2089 17.6429V7.35714C16.2089 7.12981 16.2994 6.9118 16.4605 6.75105C16.6216 6.59031 16.8402 6.5 17.068 6.5H17.6408C17.8687 6.5 18.0872 6.59031 18.2484 6.75105C18.4095 6.9118 18.5 7.12981 18.5 7.35714ZM14.5764 11.5743L8.32731 6.78571C8.16033 6.6602 7.96211 6.58267 7.75412 6.56151C7.54613 6.54036 7.3363 6.5764 7.14737 6.66571C6.95084 6.7604 6.78552 6.90913 6.67085 7.09439C6.55619 7.27964 6.49695 7.49372 6.50012 7.71143V17.2886C6.49878 17.5008 6.55672 17.7092 6.66743 17.8905C6.77815 18.0717 6.93727 18.2186 7.12696 18.3147C7.31666 18.4109 7.52943 18.4524 7.74144 18.4346C7.95345 18.4169 8.15632 18.3406 8.32731 18.2143L14.5764 13.4314C14.719 13.322 14.8345 13.1814 14.914 13.0204C14.9935 12.8594 15.0348 12.6823 15.0348 12.5029C15.0348 12.3234 14.9935 12.1463 14.914 11.9853C14.8345 11.8243 14.719 11.6837 14.5764 11.5743Z"
      fill={color}
    />
  </Svg>
);

// Icone Check Circulo
export const CheckCircleIcon: React.FC<{ color: string; filled?: boolean }> = ({ color, filled = false }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth="2"
      fill={filled ? color : 'none'}
    />
    <Path
      d="M8 12l3 3 5-6"
      stroke={filled ? COLORS.white : color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Lista
export const ListIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Fechar
export const CloseIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6l12 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Seta Voltar (para navegacao) - Slim e centralizado
export const BackArrowIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 25 }) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none">
    <Path
      d="M14.5 18L8.5 12.5L14.5 7"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Minimizar/Voltar (Seta para baixo) - Slim e centralizado
export const ChevronDownIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <Path
      d="M7 10L12.5 15.5L18 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ========================================
// AJUSTES MANUAIS DO AUTOPLAY - ALTERAR AQUI
// ========================================
const AUTOPLAY_WIDTH = 34; //...............Largura total do componente
const AUTOPLAY_HEIGHT = 18; //..............Altura total do componente
const AUTOPLAY_BAR_WIDTH = 32; //...........Largura da barra de fundo (AJUSTE AQUI)
const AUTOPLAY_BAR_HEIGHT = 12; //..........Altura da barra de fundo
const AUTOPLAY_BAR_RADIUS = 6; //...........Raio dos cantos da barra
const AUTOPLAY_BALL_RADIUS = 9; //..........Raio da bolinha

// Icone Autoplay Toggle (Player.txt - 34x18)
// Barra sempre branca, bolinha direita quando ativo (azul), esquerda quando inativo (cinza)
export const AutoplayIcon: React.FC<{ color: string; active?: boolean }> = ({ color, active = false }) => {
  // Posicao da bolinha
  const ballX = active ? (AUTOPLAY_WIDTH - AUTOPLAY_BALL_RADIUS) : AUTOPLAY_BALL_RADIUS;
  // Posicao da barra (centralizada atras da bolinha)
  const barX = active ? (AUTOPLAY_WIDTH - AUTOPLAY_BAR_WIDTH - 2) : 2;
  const barY = (AUTOPLAY_HEIGHT - AUTOPLAY_BAR_HEIGHT) / 2;

  return (
    <Svg width={AUTOPLAY_WIDTH} height={AUTOPLAY_HEIGHT} viewBox={`0 0 ${AUTOPLAY_WIDTH} ${AUTOPLAY_HEIGHT}`} fill="none">
      {/* Barra de fundo - branca quando ativo, cinza quando inativo */}
      <Rect
        x={barX}
        y={barY}
        width={AUTOPLAY_BAR_WIDTH}
        height={AUTOPLAY_BAR_HEIGHT}
        rx={AUTOPLAY_BAR_RADIUS}
        fill={active ? '#FFFFFF' : '#91929E'}
      />
      {/* Bolinha - azul quando ativo, branca quando inativo */}
      <Circle
        cx={ballX}
        cy={AUTOPLAY_HEIGHT / 2}
        r={AUTOPLAY_BALL_RADIUS}
        fill={active ? COLORS.primary : '#F4F4F4'}
      />
      {/* Icone Play interno - branco quando ativo, cinza quando inativo */}
      <Path
        d={active
          ? "M28.7814 8.06087L24.0372 4.53913C23.861 4.40832 23.6515 4.32867 23.4321 4.30909C23.2127 4.28951 22.9922 4.33078 22.7952 4.42828C22.5982 4.52578 22.4325 4.67565 22.3167 4.8611C22.2009 5.04655 22.1395 5.26025 22.1395 5.47826V12.5217C22.1395 12.7397 22.2009 12.9535 22.3167 13.1389C22.4325 13.3244 22.5982 13.4742 22.7952 13.5717C22.9922 13.6692 23.2127 13.7105 23.4321 13.6909C23.6515 13.6713 23.861 13.5917 24.0372 13.4609L28.7814 9.93913C28.9287 9.82978 29.0483 9.68799 29.1306 9.52499C29.2129 9.36199 29.2558 9.18224 29.2558 9C29.2558 8.81776 29.2129 8.63801 29.1306 8.47501C29.0483 8.31201 28.9287 8.17022 28.7814 8.06087Z"
          : "M5.2186 8.06087L9.9628 4.53913C10.139 4.40832 10.3485 4.32867 10.5679 4.30909C10.7873 4.28951 11.0078 4.33078 11.2048 4.42828C11.4018 4.52578 11.5675 4.67565 11.6833 4.8611C11.7991 5.04655 11.8605 5.26025 11.8605 5.47826V12.5217C11.8605 12.7397 11.7991 12.9535 11.6833 13.1389C11.5675 13.3244 11.4018 13.4742 11.2048 13.5717C11.0078 13.6692 10.7873 13.7105 10.5679 13.6909C10.3485 13.6713 10.139 13.5917 9.9628 13.4609L5.2186 9.93913C5.0713 9.82978 4.9517 9.68799 4.8694 9.52499C4.7871 9.36199 4.7442 9.18224 4.7442 9C4.7442 8.81776 4.7871 8.63801 4.8694 8.47501C4.9517 8.31201 5.0713 8.17022 5.2186 8.06087Z"
        }
        fill={active ? '#FFFFFF' : '#91929E'}
      />
    </Svg>
  );
};

// Icone Configuracoes (Player.txt - 20x20)
export const SettingsIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={20} height={20} viewBox="0 0 20 20" fill="none">
    <Path
      d="M18.9033 7.82833L17.3366 7.62917C17.2074 7.23167 17.0482 6.84833 16.8624 6.48417L17.8299 5.23833C18.2216 4.73417 18.1758 4.0225 17.7282 3.58917L16.4157 2.27667C15.9782 1.825 15.2665 1.78 14.7614 2.17083L13.5172 3.13833C13.153 2.9525 12.7697 2.79333 12.3713 2.66417L12.1722 1.1C12.0972 0.4725 11.5646 0 10.9338 0H9.06704C8.43618 0 7.90366 0.4725 7.82866 1.0975L7.62948 2.66417C7.23113 2.79333 6.84778 2.95167 6.4836 3.13833L5.23855 2.17083C4.7352 1.78 4.0235 1.825 3.58932 2.2725L2.27676 3.58417C1.82508 4.0225 1.77924 4.73417 2.17092 5.23917L3.13846 6.48417C2.95179 6.84833 2.79345 7.23167 2.66428 7.62917L1.10005 7.82833C0.47252 7.90333 0 8.43583 0 9.06667V10.9333C0 11.5642 0.47252 12.0967 1.09755 12.1717L2.66428 12.3708C2.79345 12.7683 2.95262 13.1517 3.13846 13.5158L2.17092 14.7617C1.77924 15.2658 1.82508 15.9775 2.27259 16.4108L3.58515 17.7233C4.0235 18.1742 4.73436 18.2192 5.23938 17.8283L6.48444 16.8608C6.84862 17.0475 7.23197 17.2067 7.62948 17.335L7.82866 18.8983C7.90366 19.5275 8.43618 20 9.06704 20H10.9338C11.5646 20 12.0972 19.5275 12.1722 18.9025L12.3713 17.3358C12.7689 17.2067 13.1522 17.0475 13.5164 16.8617L14.7623 17.8292C15.2665 18.2208 15.9782 18.175 16.4115 17.7275L17.7241 16.415C18.1758 15.9767 18.2216 15.2658 17.8299 14.7608L16.8624 13.5158C17.049 13.1517 17.2082 12.7683 17.3366 12.3708L18.9 12.1717C19.5275 12.0967 20 11.5642 20 10.9333V9.06667C20.0008 8.43583 19.5283 7.90333 18.9033 7.82833ZM10.0004 14.1667C7.70282 14.1667 5.83358 12.2975 5.83358 10C5.83358 7.7025 7.70282 5.83333 10.0004 5.83333C12.298 5.83333 14.1673 7.7025 14.1673 10C14.1673 12.2975 12.298 14.1667 10.0004 14.1667Z"
      fill={color}
    />
  </Svg>
);

// Icone Tela Cheia (Player.txt - 25x25)
export const FullscreenIcon: React.FC<{ color: string }> = ({ color }) => (
  <Svg width={25} height={25} viewBox="0 0 25 25" fill="none">
    <Path
      d="M6.67651 16.1328C6.67651 16.4932 6.96872 16.7853 7.3291 16.7854H9.96619C10.4397 16.7854 10.8235 17.1692 10.8235 17.6427C10.8235 18.1162 10.4397 18.5 9.96619 18.5H5.65259C5.29221 18.4999 5.00008 18.2078 5 17.8474V15.0529C5 14.5899 5.3753 14.2146 5.83826 14.2146C6.30121 14.2146 6.67651 14.5899 6.67651 15.0529V16.1328ZM19.1617 14.2146C19.6247 14.2146 20 14.5899 20 15.0529V17.8474C19.9999 18.2078 19.7078 18.4999 19.3474 18.5H15.0338C14.5603 18.5 14.1765 18.1162 14.1765 17.6427C14.1765 17.1692 14.5603 16.7854 15.0338 16.7854H17.6709C18.0313 16.7853 18.3235 16.4932 18.3235 16.1328V15.0529C18.3235 14.5899 18.6988 14.2146 19.1617 14.2146ZM10.8235 7.3573C10.8235 7.83077 10.4397 8.2146 9.96619 8.2146H7.3291C6.96872 8.21474 6.67651 8.50678 6.67651 8.86719V9.94714C6.67651 10.4101 6.30121 10.7854 5.83826 10.7854C5.3753 10.7854 5 10.4101 5 9.94714V7.15259C5.00008 6.79221 5.29221 6.50008 5.65259 6.5H9.96619C10.4397 6.5 10.8235 6.88383 10.8235 7.3573ZM19.3474 6.5C19.7078 6.50008 19.9999 6.79221 20 7.15259V9.94714C20 10.4101 19.6247 10.7854 19.1617 10.7854C18.6988 10.7854 18.3235 10.4101 18.3235 9.94714V8.86719C18.3235 8.50678 18.0313 8.21474 17.6709 8.2146H15.0338C14.5603 8.2146 14.1765 7.83077 14.1765 7.3573C14.1765 6.88383 14.5603 6.5 15.0338 6.5H19.3474Z"
      fill={color}
    />
  </Svg>
);

// Icone de Video (para tipo de conteudo)
export const VideoIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 7l-7 5 7 5V7z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="1"
      y="5"
      width="15"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
  </Svg>
);

// Icone de Texto (para tipo de conteudo)
export const TextIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Icone Expandir (para mini player - setas para fora)
export const ExpandIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <Path
      d="M1 5V1H5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 9V13H9"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M1 1L5.5 5.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <Path
      d="M13 13L8.5 8.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
