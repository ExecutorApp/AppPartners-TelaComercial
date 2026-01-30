import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ModalProvider } from './src/context/ModalContext';
import { KeymanProvider } from './src/context/KeymanContext';
import { MiniPlayerProvider } from './src/context/MiniPlayerContext';
import ModalRoot from './src/components/ModalRoot';
import GlobalMiniPlayer from './src/components/GlobalMiniPlayer';
import {
  useFonts,
  Inter_100Thin,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from '@expo-google-fonts/inter';

export default function App() {
  // Log de montagem do App
  React.useEffect(() => {
    console.log('[APP] ========== App MONTADO ==========');
    return () => {
      console.log('[APP] ========== App DESMONTADO ==========');
    };
  }, []);

  const [fontsLoaded] = useFonts({
    Inter_100Thin,
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  // Fallback: força fontes como carregadas após 2s (evita tela branca)
  const [forceFontsLoaded, setForceFontsLoaded] = React.useState(false);

  // Timer de fallback para fontes (roda apenas uma vez)
  React.useEffect(() => {
    const fontFallbackTimer = setTimeout(() => {
      try { console.log('[App] Font loading timeout - forcing fallback'); } catch {}
      setForceFontsLoaded(true);
    }, 100); // 100ms - quase instantaneo

    return () => clearTimeout(fontFallbackTimer);
  }, []); // Sem dependências - roda apenas uma vez

  if (!fontsLoaded && !forceFontsLoaded) {
    try { console.log('[App] fontsLoaded=false, waiting...'); } catch {}
    return (
      <View style={[styles.container, Platform.OS === 'web' ? ({ height: '100vh', minHeight: 0 } as any) : undefined]}>
        <StatusBar style="dark" backgroundColor="#FCFCFC" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="small" color="#1777CF" />
        </View>
      </View>
    );
  }
  // Log de cada render do App
  console.log('[APP] App renderizando...');

  return (
    <KeymanProvider>
      <ModalProvider>
        <MiniPlayerProvider>
          <View style={[
            styles.container,
            Platform.OS === 'web' ? ({ height: '100vh', minHeight: 0 } as any) : undefined,
          ]}>
            <StatusBar style="dark" backgroundColor="#FCFCFC" />
            <AppNavigator />
            <ModalRoot />
            <GlobalMiniPlayer />
          </View>
        </MiniPlayerProvider>
      </ModalProvider>
    </KeymanProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
});
