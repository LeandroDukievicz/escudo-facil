import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { FONT, useTheme } from '@/theme';

const TAB_ICON: Record<string, string> = { index: '🏠', historico: '🕘', aprender: '📚', ajuda: '❓' };

/** Navegação inferior simples: ícone + texto, sempre visível. */
export default function TabsLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: t.hc ? t.c.accent : t.c.primary,
        tabBarInactiveTintColor: t.hc ? '#fff' : t.c.subtle,
        tabBarStyle: {
          backgroundColor: t.c.bg,
          borderTopWidth: t.hc ? 3 : 2,
          borderTopColor: t.c.ink,
          minHeight: 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: FONT.bold, fontSize: t.fs(12) },
        tabBarIcon: () => <Text style={{ fontSize: t.fs(20) }}>{TAB_ICON[route.name] ?? '•'}</Text>,
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Início', tabBarAccessibilityLabel: 'Início' }} />
      <Tabs.Screen name="historico" options={{ title: 'Histórico' }} />
      <Tabs.Screen name="aprender" options={{ title: 'Aprender' }} />
      <Tabs.Screen name="ajuda" options={{ title: 'Ajuda' }} />
    </Tabs>
  );
}
