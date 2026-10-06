import {
  Asap_400Regular,
  Asap_500Medium,
  Asap_600SemiBold,
  Asap_700Bold,
  Asap_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/asap';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HistoryProvider } from '@/state/history';
import { SessionProvider } from '@/state/session';
import { SettingsProvider, useSettings } from '@/state/settings';
import { useTheme } from '@/theme';

void SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { ready } = useSettings();
  const t = useTheme();
  const [fontsLoaded] = useFonts({ Asap_400Regular, Asap_500Medium, Asap_600SemiBold, Asap_700Bold, Asap_800ExtraBold });

  useEffect(() => {
    if (ready && fontsLoaded) void SplashScreen.hideAsync();
  }, [ready, fontsLoaded]);

  if (!ready || !fontsLoaded) return null;

  return (
    <>
      <StatusBar style={t.hc ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: t.c.bg },
          // Transições simples: sem gestos complexos.
          animation: 'fade',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <HistoryProvider>
          <SessionProvider>
            <RootStack />
          </SessionProvider>
        </HistoryProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
