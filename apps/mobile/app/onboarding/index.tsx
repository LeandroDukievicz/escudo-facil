import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Dots } from '@/components/Dots';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme';

/** A1 · Onboarding — "Antes de clicar, verifique." */
export default function Welcome() {
  const t = useTheme();
  return (
    <Screen
      scroll={false}
      contentStyle={styles.center}
      footer={
        <>
          <Button label="Começar agora" height={58} size={19} onPress={() => router.push('/onboarding/sem-conta')} />
          <Button label="Como funciona?" variant="link" onPress={() => router.push('/privacidade')} />
          <Dots active={0} />
        </>
      }
    >
      <View style={[styles.logo, { backgroundColor: t.c.primarySoft, borderColor: t.hc ? t.c.ink : t.c.primary }]}>
        <AppText size={48}>🛡️</AppText>
      </View>
      <AppText size={24} weight="heavy" color={t.c.title} style={styles.mt24}>
        Escudo Fácil
      </AppText>
      <AppText size={26} weight="bold" color={t.c.title} align="center" style={styles.mt18} accessibilityRole="header">
        Antes de clicar,{'\n'}verifique.
      </AppText>
      <AppText size={16} color={t.c.muted} align="center" style={styles.mt12}>
        Analise links, prints e mensagens suspeitas em poucos segundos.
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logo: { width: 96, height: 96, borderRadius: 26, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  mt24: { marginTop: 24 },
  mt18: { marginTop: 18 },
  mt12: { marginTop: 12 },
});
