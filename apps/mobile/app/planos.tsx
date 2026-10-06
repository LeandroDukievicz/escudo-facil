import { PLANS } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Badge, Box, Row } from '@/components/ui';
import { useTheme } from '@/theme';

/** G3 · Planos — "Você pode continuar grátis". Sem dark pattern. */
export default function Plans() {
  const t = useTheme();
  return (
    <Screen
      back
      footer={
        <>
          <Button label="Ver planos" height={52} onPress={() => router.push('/assinar')} />
          <Button variant="secondary" label="Continuar grátis" height={48} onPress={() => router.back()} />
        </>
      }
    >
      <AppText size={20} weight="heavy" color={t.c.title} align="center" accessibilityRole="header">
        Você pode continuar grátis
      </AppText>
      <AppText size={14} color={t.c.muted} align="center">
        O plano pago adiciona proteção, mas{' '}
        <AppText size={14} weight="heavy" color={t.c.muted}>
          não é obrigatório
        </AppText>
        .
      </AppText>
      {PLANS.map((p) => {
        const free = p.id === 'free';
        const r = t.risk(free ? 'low' : 'attention');
        return (
          <Box key={p.id} bg={r.soft} border={r.border} style={styles.plan}>
            <View style={styles.head}>
              <AppText size={17} weight="heavy" color={r.strong}>
                {p.name}
                {free ? '' : ' ⭐'}
              </AppText>
              <AppText size={14} weight="bold" color={r.strong}>
                {free ? p.price : 'Em breve'}
              </AppText>
            </View>
            <Row>{free ? <Badge kind="free" /> : <><Badge kind="plus" /><Badge kind="login" /><Badge kind="ai" /></>}</Row>
            {p.features.map((f) => (
              <AppText key={f} size={14}>
                <AppText size={14} weight="heavy" color={free ? t.risk('low').solid : t.risk('attention').border}>
                  {free ? '✓ ' : '＋ '}
                </AppText>
                {f}
              </AppText>
            ))}
          </Box>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  plan: { gap: 5 },
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
