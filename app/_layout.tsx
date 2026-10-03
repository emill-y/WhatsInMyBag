import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, EBGaramond_400Regular, EBGaramond_400Regular_Italic, EBGaramond_500Medium } from '@expo-google-fonts/eb-garamond';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { colors } from '../src/theme/tokens';
import { Toast } from '../src/components/ui';
import { AlertSheet } from '../src/components/AlertSheet';

export default function RootLayout() {
  const [loaded] = useFonts({ EBGaramond_400Regular, EBGaramond_400Regular_Italic, EBGaramond_500Medium, Inter_400Regular, Inter_500Medium });

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    // iPhone home-screen web app polish
    const add = (name: string, content: string) => {
      if (document.querySelector(`meta[name="${name}"]`)) return;
      const m = document.createElement('meta'); m.name = name; m.content = content; document.head.appendChild(m);
    };
    add('apple-mobile-web-app-capable', 'yes');
    add('apple-mobile-web-app-status-bar-style', 'default');
    add('apple-mobile-web-app-title', 'My Bag');
    const vp = document.querySelector('meta[name="viewport"]');
    vp?.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1');
    document.body.style.backgroundColor = colors.paper;
  }, []);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.paper }} />;
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper }, animation: 'fade' }} />
      <AlertSheet />
      <Toast />
    </SafeAreaProvider>
  );
}
