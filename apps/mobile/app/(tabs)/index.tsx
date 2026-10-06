import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Screen } from '@/components/Screen';
import { VoiceButton } from '@/components/VoiceButton';
import { tap } from '@/services/haptics';
import { useTheme } from '@/theme';

const ACTIONS: { href: Href; icon: string; title: string; hcTitle: string; sub: string; tone: 'primary' | 'low' | 'attention' }[] = [
  { href: '/link', icon: '🔗', title: 'Verificar link', hcTitle: 'Verificar link', sub: 'Cole um link sem abrir', tone: 'primary' },
  { href: '/print', icon: '🖼️', title: 'Verificar print', hcTitle: 'Verificar print', sub: 'Mande a foto da conversa', tone: 'low' },
  { href: '/proposta', icon: '💬', title: 'Recebi proposta suspeita', hcTitle: 'Proposta suspeita', sub: 'A gente pergunta, você responde', tone: 'attention' },
];

/** B1/B2 · Home — só 3 ações grandes + pedir ajuda. */
export default function Home() {
  const t = useTheme();
  const bgFor = (tone: (typeof ACTIONS)[number]['tone']) => {
    if (t.hc) return tone === 'primary' ? '#0b3d91' : tone === 'low' ? '#0d6b35' : '#8a6100';
    return tone === 'primary' ? t.c.primarySoft : t.risk(tone).soft;
  };
  const speech =
    'O que você quer verificar? Opções: Verificar link. Verificar print. Recebi proposta suspeita. Ou: Pedir ajuda para familiar.';

  return (
    <Screen edges={['top']}>
      <View style={[styles.top, t.hc && { borderBottomWidth: 2, borderBottomColor: '#fff', paddingBottom: 10 }]}>
        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: t.hc ? 'transparent' : t.c.primary }]}>
            <AppText size={16}>🛡️</AppText>
          </View>
          <AppText size={16} weight="heavy" color={t.hc ? t.c.accent : t.c.title}>
            Escudo Fácil
          </AppText>
        </View>
        <VoiceButton text={speech} />
      </View>

      <AppText size={t.hc ? 25 : 23} weight="heavy" color={t.c.title} lh={1.2} accessibilityRole="header">
        O que você quer{t.hc ? ' ' : '\n'}verificar?
      </AppText>

      {ACTIONS.map((a) => (
        <Pressable
          key={a.title}
          accessibilityRole="button"
          accessibilityLabel={`${a.title}. ${a.sub}`}
          onPress={() => {
            tap();
            router.push(a.href);
          }}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: bgFor(a.tone),
              borderColor: t.hc ? '#fff' : t.c.ink,
              borderWidth: t.hc ? 3 : 2,
              borderRadius: t.hc ? 14 : 18,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <AppText size={36}>{a.icon}</AppText>
          <View style={styles.flex}>
            <AppText size={t.hc ? 22 : 20} weight="heavy" color={t.hc ? '#fff' : t.c.title} lh={1.15}>
              {t.hc ? a.hcTitle : a.title}
            </AppText>
            {!t.hc && (
              <AppText size={14} color={t.c.muted}>
                {a.sub}
              </AppText>
            )}
          </View>
        </Pressable>
      ))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Pedir ajuda para familiar"
        onPress={() => {
          tap();
          router.push('/ajuda-familiar');
        }}
        style={[styles.family, { borderColor: t.hc ? t.c.accent : t.c.primary }]}
      >
        <AppText size={17} weight="bold" color={t.hc ? t.c.accent : t.c.primary}>
          👨‍👩‍👧 Pedir ajuda para familiar
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  mark: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, minHeight: 88 },
  flex: { flex: 1 },
  family: { borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, minHeight: 56, alignItems: 'center', justifyContent: 'center', padding: 12 },
});
