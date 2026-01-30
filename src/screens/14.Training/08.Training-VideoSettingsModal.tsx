import React, { useMemo, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SpeedIcon, CaptionsIcon, RepeatIcon } from './07.Training-PlayerIcons';

// ========================================
// TIPOS DO MODAL
// ========================================

type Props = {
  visible: boolean; //..........................Visibilidade do modal
  onRequestClose: () => void; //................Callback ao fechar
  playbackRate: number; //......................Velocidade atual
  setPlaybackRate: (rate: number) => void; //...Callback para mudar velocidade
  captionsEnabled: boolean; //..................Legendas ativadas
  setCaptionsEnabled: (enabled: boolean) => void; //..Callback para legendas
  repeatEnabled: boolean; //....................Modo repeticao ativado
  setRepeatEnabled: (enabled: boolean) => void; //....Callback para repeticao
};

// ========================================
// COMPONENTE MODAL DE CONFIGURACOES
// ========================================

// Modal de configuracao do video com layout fiel ao Figma
const VideoSettingsModal: React.FC<Props> = ({
  visible,
  onRequestClose,
  playbackRate,
  setPlaybackRate,
  captionsEnabled,
  setCaptionsEnabled,
  repeatEnabled,
  setRepeatEnabled,
}) => {
  // Opcoes de velocidade predefinidas
  const speedOptions = useMemo(() => [1.0, 1.25, 1.5, 2.0, 2.5, 3.0], []);

  // Faixa de velocidade suportada pelo slider (0..3) com passo de 0,05
  const rateMin = 0.0; //......................Velocidade minima
  const rateMax = 3.0; //......................Velocidade maxima
  const step = 0.05; //........................Passo do slider

  // Estado para largura do slider
  const [sliderWidth, setSliderWidth] = useState(250);

  // Calcula fracao preenchida do slider
  const fraction = Math.max(0, Math.min(1, (playbackRate - rateMin) / (rateMax - rateMin)));
  const filledWidth = Math.round(fraction * (sliderWidth - 5));

  // Posicao da bolinha do slider
  const knobLeft = Math.max(0, Math.min(sliderWidth - 9, filledWidth + 2));

  // Passos dos botoes +/-: 0,20
  const btnStep = 0.20; //...................Incremento dos botoes
  const toFixed2 = (v: number) => parseFloat(v.toFixed(2));
  const clampRate = (v: number) => Math.max(0.0, Math.min(3.0, toFixed2(v)));
  const isOnBtnStep = (v: number) => Math.abs(v / btnStep - Math.round(v / btnStep)) < 1e-6;

  // Incrementa velocidade
  const stepUp = () => {
    const next = isOnBtnStep(playbackRate)
      ? playbackRate + btnStep
      : Math.ceil(playbackRate / btnStep) * btnStep;
    setPlaybackRate(clampRate(next));
  };

  // Decrementa velocidade
  const stepDown = () => {
    const next = isOnBtnStep(playbackRate)
      ? playbackRate - btnStep
      : Math.floor(playbackRate / btnStep) * btnStep;
    setPlaybackRate(clampRate(next));
  };

  // Snap para o passo mais proximo
  const snapToStep = (value: number) => {
    const snapped = Math.round(value / step) * step;
    return Math.max(rateMin, Math.min(rateMax, parseFloat(snapped.toFixed(2))));
  };

  // Define velocidade a partir da posicao X do toque
  const setRateFromX = (x: number) => {
    const trackLeft = 2; //.................Margem esquerda do track
    const trackWidth = Math.max(1, sliderWidth - 5);
    const frac = Math.max(0, Math.min(1, (x - trackLeft) / trackWidth));
    const rawRate = rateMin + frac * (rateMax - rateMin);
    const rate = snapToStep(rawRate);
    setPlaybackRate(rate);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      {/* Backdrop - fecha modal ao clicar */}
      <Pressable style={styles.backdrop} onPress={onRequestClose} />

      {/* Area de ancoragem do modal (parte inferior) */}
      <View pointerEvents="box-none" style={styles.anchorArea}>
        {/* Card do modal */}
        <View style={styles.card}>
          {/* ======================================== */}
          {/* SECAO: VELOCIDADE DE REPRODUCAO */}
          {/* ======================================== */}

          {/* Titulo com icone de velocidade */}
          <View style={styles.titleRow}>
            <SpeedIcon />
            <Text style={styles.title}>Velocidade de reprodução</Text>
          </View>

          {/* Linha de controles de velocidade */}
          <View style={styles.speedRow}>
            {/* Botao diminuir */}
            <TouchableOpacity style={styles.squareBtn} onPress={stepDown}>
              <Text style={styles.squareBtnText}>-</Text>
            </TouchableOpacity>

            {/* Slider central */}
            <View style={styles.speedCenter}>
              {/* Valor atual */}
              <Text style={styles.speedValue}>{playbackRate.toFixed(2)}x</Text>

              {/* Barra de progresso interativa */}
              <View
                style={styles.progress}
                onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                onStartShouldSetResponder={() => true}
                onResponderGrant={(e) => setRateFromX(e.nativeEvent.locationX)}
                onResponderMove={(e) => setRateFromX(e.nativeEvent.locationX)}
                onResponderRelease={(e) => setRateFromX(e.nativeEvent.locationX)}
              >
                {/* Linha de fundo (cinza) */}
                <View style={styles.line} />
                {/* Linha preenchida (azul) */}
                <View style={[styles.lineFill, { width: filledWidth }]} />
                {/* Bolinha indicadora */}
                <View style={[styles.knob, { left: knobLeft }]} />
              </View>
            </View>

            {/* Botao aumentar */}
            <TouchableOpacity style={styles.squareBtn} onPress={stepUp}>
              <Text style={styles.squareBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Botoes de presets de velocidade */}
          <View style={styles.presetRow}>
            {speedOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.presetBtn, playbackRate === opt ? styles.presetBtnActive : null]}
                onPress={() => setPlaybackRate(opt)}
              >
                <Text style={[styles.presetText, playbackRate === opt ? styles.presetTextActive : null]}>
                  {String(opt).replace('.', ',')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* ======================================== */}
          {/* SECAO: LEGENDAS */}
          {/* ======================================== */}

          <View style={styles.optionRow}>
            <CaptionsIcon />
            <Text style={styles.title}>Legendas</Text>
            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityState={{ checked: captionsEnabled }}
              style={[
                styles.switch,
                { borderColor: captionsEnabled ? '#1777CF' : '#7D8592' },
              ]}
              onPress={() => setCaptionsEnabled(!captionsEnabled)}
            >
              <View
                style={[
                  styles.switchBullet,
                  captionsEnabled ? styles.switchBulletRight : styles.switchBulletLeft,
                  { backgroundColor: captionsEnabled ? '#1777CF' : '#7D8592' },
                ]}
              />
            </TouchableOpacity>
          </View>

          {/* Divisor */}
          <View style={styles.divider} />

          {/* ======================================== */}
          {/* SECAO: MODO REPETICAO */}
          {/* ======================================== */}

          <View style={styles.optionRow}>
            <RepeatIcon />
            <Text style={styles.title}>Modo repetição</Text>
            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityState={{ checked: repeatEnabled }}
              style={[
                styles.switch,
                { borderColor: repeatEnabled ? '#1777CF' : '#7D8592' },
              ]}
              onPress={() => setRepeatEnabled(!repeatEnabled)}
            >
              <View
                style={[
                  styles.switchBullet,
                  repeatEnabled ? styles.switchBulletRight : styles.switchBulletLeft,
                  { backgroundColor: repeatEnabled ? '#1777CF' : '#7D8592' },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default VideoSettingsModal;

// ========================================
// ESTILOS DO MODAL
// ========================================

const styles = StyleSheet.create({
  // Fundo escurecido
  backdrop: {
    position: 'absolute', //.....Posicao absoluta
    left: 0, //..................Alinhado a esquerda
    right: 0, //.................Alinhado a direita
    top: 0, //....................Alinhado ao topo
    bottom: 0, //.................Alinhado ao fundo
    backgroundColor: '#00000055', //..Cor preta semi-transparente
  },

  // Area de ancoragem (parte inferior)
  anchorArea: {
    flex: 1, //...................Ocupa espaco disponivel
    justifyContent: 'flex-end', //..Alinha ao fundo
    paddingHorizontal: 10, //.....Margem lateral
    paddingBottom: 10, //.........Margem inferior
  },

  // Card do modal
  card: {
    borderWidth: 1, //.................Borda em todos os lados
    borderColor: '#D8E0F0', //..........Cor da borda
    borderRadius: 16, //................Arredondamento em todos os cantos
    backgroundColor: '#FCFCFC', //......Cor de fundo
    width: '100%', //......................Largura total
    paddingHorizontal: 20, //..............Padding horizontal
    paddingVertical: 20, //................Padding vertical
    ...Platform.select({
      ios: {
        shadowColor: '#676E76', //...........Cor da sombra
        shadowOffset: { width: 0, height: -2 }, //..Offset da sombra
        shadowOpacity: 0.08, //...............Opacidade da sombra
        shadowRadius: 5, //..................Raio da sombra
      },
      android: {
        elevation: 5, //...................Elevacao Android
      },
      web: {
        boxShadow: '0px -2px 5px rgba(103, 110, 118, 0.08), 0px -1px 1px rgba(0, 0, 0, 0.12)',
      },
    }),
  },

  // Linha do titulo (icone + texto)
  titleRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 10, //......................Espaco entre elementos
    height: 20, //....................Altura fixa
    marginBottom: 20, //...............Margem inferior
  },

  // Texto do titulo
  title: {
    color: '#3A3F51', //..............Cor do texto
    fontSize: 14, //.................Tamanho da fonte
    lineHeight: 15, //................Altura da linha
    fontFamily: 'Inter_600SemiBold', //..Fonte semi-bold
  },

  // Linha de controles de velocidade
  speedRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 10, //......................Espaco entre elementos
    marginBottom: 15, //...............Margem inferior
  },

  // Botao quadrado (+/-)
  squareBtn: {
    width: 35, //....................Largura
    height: 35, //...................Altura
    borderWidth: 0.5, //..............Espessura da borda
    borderColor: '#D8E0F0', //........Cor da borda
    borderRadius: 4, //...............Arredondamento
    alignItems: 'center', //..........Centraliza horizontalmente
    justifyContent: 'center', //......Centraliza verticalmente
  },

  // Texto do botao quadrado
  squareBtnText: {
    color: '#1777CF', //..............Cor azul
    fontSize: 20, //.................Tamanho da fonte
    fontFamily: 'Inter_400Regular', //..Fonte regular
    lineHeight: 24, //................Altura da linha
  },

  // Centro do slider
  speedCenter: {
    flex: 1, //......................Ocupa espaco disponivel
    paddingHorizontal: 0, //..........Sem padding horizontal
    paddingBottom: 0, //..............Sem padding inferior
    alignItems: 'center', //..........Centraliza horizontalmente
  },

  // Valor da velocidade
  speedValue: {
    color: '#3A3F51', //..............Cor do texto
    fontSize: 14, //.................Tamanho da fonte
    lineHeight: 17, //................Altura da linha
    fontFamily: 'Inter_500Medium', //..Fonte medium
    marginBottom: 6, //................Margem inferior
  },

  // Container do slider
  progress: {
    position: 'relative', //..........Posicao relativa
    width: '100%', //.................Largura total
    height: 5, //....................Altura
  },

  // Linha de fundo (cinza)
  line: {
    position: 'absolute', //..........Posicao absoluta
    top: 0, //........................Alinhado ao topo
    left: 2, //......................Margem esquerda
    height: 2, //....................Altura da linha
    width: '100%', //.................Largura total
    borderRadius: 8, //...............Arredondamento
    backgroundColor: '#5F758B80', //..Cor cinza semi-transparente
  },

  // Linha preenchida (azul)
  lineFill: {
    position: 'absolute', //..........Posicao absoluta
    top: 0, //........................Alinhado ao topo
    left: 2, //......................Margem esquerda
    height: 2, //....................Altura da linha
    borderRadius: 8, //...............Arredondamento
    backgroundColor: '#1777CF', //....Cor azul
  },

  // Bolinha indicadora
  knob: {
    position: 'absolute', //..........Posicao absoluta
    top: -3, //......................Offset vertical
    width: 10, //....................Largura
    height: 10, //...................Altura
    borderRadius: 5, //...............Arredondamento (circular)
    backgroundColor: '#1777CF', //....Cor azul
  },

  // Linha de presets
  presetRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 10, //......................Espaco entre elementos
    marginTop: 10, //................Margem superior
    marginBottom: 20, //..............Margem inferior
  },

  // Botao de preset
  presetBtn: {
    flex: 1, //......................Distribui igualmente
    height: 35, //...................Altura
    borderWidth: 1, //................Espessura da borda
    borderColor: '#D8E0F0', //........Cor da borda
    borderRadius: 4, //...............Arredondamento
    alignItems: 'center', //..........Centraliza horizontalmente
    justifyContent: 'center', //......Centraliza verticalmente
    paddingHorizontal: 10, //..........Padding horizontal
  },

  // Botao de preset ativo
  presetBtnActive: {
    backgroundColor: '#1777CF', //....Fundo azul
    borderColor: '#1777CF', //........Borda azul
  },

  // Texto do preset
  presetText: {
    color: '#3A3F51', //..............Cor do texto
    fontSize: 14, //.................Tamanho da fonte
    fontFamily: 'Inter_400Regular', //..Fonte regular
    lineHeight: 17, //................Altura da linha
  },

  // Texto do preset ativo
  presetTextActive: {
    color: '#FFFFFF', //..............Cor branca
  },

  // Divisor horizontal
  divider: {
    height: 1, //....................Altura
    backgroundColor: '#D8E0F0', //....Cor cinza
    alignSelf: 'stretch', //..........Estica para preencher
    marginBottom: 20, //..............Margem inferior
  },

  // Linha de opcao (legendas/repeticao)
  optionRow: {
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
    gap: 10, //......................Espaco entre elementos
    height: 20, //....................Altura fixa
    marginBottom: 20, //...............Margem inferior
  },

  // Switch toggle
  switch: {
    marginLeft: 'auto', //............Empurra para direita
    width: 40, //....................Largura
    height: 24, //...................Altura
    borderRadius: 45, //..............Arredondamento (pill)
    borderWidth: 1, //................Espessura da borda
    padding: 4, //...................Padding interno
    flexDirection: 'row', //..........Layout horizontal
    alignItems: 'center', //..........Centraliza verticalmente
  },

  // Bolinha do switch
  switchBullet: {
    width: 16, //....................Largura
    height: 16, //...................Altura
    borderRadius: 99, //..............Arredondamento (circular)
    alignSelf: 'center', //...........Centraliza verticalmente
  },

  // Bolinha posicionada a esquerda (off)
  switchBulletLeft: {
    marginLeft: 0, //................Sem margem esquerda
  },

  // Bolinha posicionada a direita (on)
  switchBulletRight: {
    marginLeft: 'auto', //............Empurra para direita
  },
});
