import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AccessibilitySettings } from '@/components/AccessibilitySettings';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { tap } from '@/services/haptics';
import { useTheme } from '@/theme';

const LINKS: { href: Href; icon: string; title: string; sub: string }[] = [
  { href: '/checklist', icon: '✅', title: 'Checklist anti-golpe', sub: 'Marque o que está acontecendo' },
  { href: '/nao-me-pressione', icon: '🌬️', title: 'Estão me apressando', sub: 'Respire antes de agir' },
  { href: '/ajuda-familiar', icon: '👨‍👩‍👧', title: 'Pedir ajuda para familiar', sub: 'Mande pelo WhatsApp' },
  { href: '/privacidade', icon: '🔒', title: 'Sua privacidade', sub: 'O que fica no celular' },
  { href: '/planos', icon: '⭐', title: 'Planos', sub: 'Você pode continuar grátis' },
];

/** Ajuda — emergência em destaque, atalhos e preferências de acessibilidade. */
export default function Help() {
  const t = useTheme();
  return (
    <Screen edges={['top']} title="Ajuda" icon="❓">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Acho que caí em golpe. O que faço agora?"
        onPress={() => {
          tap();
          router.push('/emergencia');
        }}
        style={[styles.sos, { backgroundColor: t.risk('high').soft, borderColor: t.hc ? t.c.accent : t.risk('high').solid }]}
      >
        <AppText size={32}>🆘</AppText>
        <View style={styles.flex}>
          <AppText size={18} weight="heavy" color={t.hc ? t.c.accent : t.risk('high').strong}>
            Acho que caí em golpe
          </AppText>
          <AppText size={13} color={t.hc ? t.c.text : t.risk('high').strong}>
            O que fazer agora, passo a passo · sempre grátis
          </AppText>
        </View>
      </Pressable>

      {LINKS.map((l) => (
        <Pressable
          key={l.title}
          accessibilityRole="button"
          accessibilityLabel={`${l.title}. ${l.sub}`}
          onPress={() => {
            tap();
            router.push(l.href);
          }}
          style={[styles.row, { borderColor: t.c.ink, borderWidth: t.hc ? 3 : 2 }]}
        >
          <AppText size={24}>{l.icon}</AppText>
          <View style={styles.flex}>
            <AppText size={16} weight="bold" color={t.c.title}>
              {l.title}
            </AppText>
            <AppText size={13} color={t.c.subtle}>
              {l.sub}
            </AppText>
          </View>
          <AppText size={20} color={t.c.placeholder}>
            ›
          </AppText>
        </Pressable>
      ))}

      <AppText size={18} weight="heavy" color={t.c.title} style={styles.mt} accessibilityRole="header">
        ⚙️ Como você prefere usar
      </AppText>
      <AccessibilitySettings />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sos: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 2, borderRadius: 16, padding: 16, minHeight: 76 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 13, minHeight: 64 },
  flex: { flex: 1 },
  mt: { marginTop: 10 },
});
