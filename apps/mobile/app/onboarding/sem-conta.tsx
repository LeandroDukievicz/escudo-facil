import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Title } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useTheme } from '@/theme';
import { Dots } from '@/components/Dots';

/** A2 · Sem cadastro — login só para plano pago, nuvem e família. */
export default function NoAccount() {
  const t = useTheme();
  const items = [
    { mark: '✓', color: t.risk('low').solid, text: 'As verificações básicas funcionam sem login.' },
    { mark: '✓', color: t.risk('low').solid, text: 'Seus dados ficam só neste celular.' },
    { mark: '•', color: t.c.subtle, text: 'Login só é necessário para plano pago, histórico na nuvem e recursos de família.' },
  ];
  return (
    <Screen
      back
      footer={
        <>
          <Button label="Usar sem conta" height={58} size={19} onPress={() => router.push('/onboarding/acessibilidade')} />
          <Button label="Já tenho conta" variant="link" onPress={() => router.push('/assinar')} />
          <Dots active={1} />
        </>
      }
    >
      <View style={[styles.icon, { backgroundColor: t.risk('low').soft, borderColor: t.hc ? t.c.ink : t.risk('low').solid }]}>
        <AppText size={42}>🔓</AppText>
      </View>
      <Title size={24}>Você não precisa criar conta.</Title>
      <View style={styles.list}>
        {items.map((it) => (
          <View key={it.text} style={styles.item}>
            <AppText size={17} weight="heavy" color={it.color}>
              {it.mark}
            </AppText>
            <AppText size={17} style={styles.flex}>
              {it.text}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  icon: { width: 84, height: 84, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  list: { gap: 14, marginTop: 4 },
  item: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
});
