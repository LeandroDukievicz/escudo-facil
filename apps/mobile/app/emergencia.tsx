import { EMERGENCY_STEPS } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, ButtonRow } from '@/components/Button';
import { BackButton } from '@/components/Screen';
import { VoiceButton } from '@/components/VoiceButton';
import { confirm } from '@/components/ui';
import { shareViaWhatsApp } from '@/services/share';
import { useHistory } from '@/state/history';
import { useSettings } from '@/state/settings';
import { removeKeys } from '@/state/storage';
import { useTheme } from '@/theme';

/** G1 · "Acho que caí em golpe. O que faço agora?" — sempre gratuita e offline. */
export default function Emergency() {
  const t = useTheme();
  const { clear } = useHistory();
  const { update } = useSettings();
  const r = t.risk('high');
  const speech = `Acho que caí em golpe. O que faço agora? ${EMERGENCY_STEPS.map((s, i) => `${i + 1}. ${s}`).join(' ')}`;

  const wipe = async () => {
    const ok = await confirm(
      'Apagar dados sensíveis do app?',
      'Vamos apagar o histórico, o contato de confiança e o progresso salvos neste celular. Suas preferências de acessibilidade continuam.',
      'Apagar',
    );
    if (!ok) return;
    await clear();
    update({ trustedContact: undefined });
    await removeKeys(['escudo:learned']);
  };

  const share = () =>
    shareViaWhatsApp(
      `Oi, acho que caí em um golpe e preciso da sua ajuda. Pode falar comigo agora?\n\nO que já estou fazendo:\n${EMERGENCY_STEPS.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.c.bg }]}>
      <View style={[styles.head, { backgroundColor: r.soft, borderBottomColor: t.hc ? t.c.ink : r.solid }]}>
        <BackButton color={t.hc ? t.c.accent : r.strong} />
        <AppText size={30}>🆘</AppText>
        <AppText size={18} weight="heavy" color={r.strong} style={styles.flex} lh={1.15} accessibilityRole="header">
          Acho que caí em golpe. O que faço agora?
        </AppText>
        <VoiceButton text={speech} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText size={15} color={t.c.muted}>
          Respire. Isso acontece com muita gente — não é culpa sua. Faça uma coisa de cada vez:
        </AppText>
        {EMERGENCY_STEPS.map((s, i) => (
          <View key={s} style={styles.step}>
            <View style={[styles.num, { backgroundColor: t.hc ? t.c.accent : r.solid }]}>
              <AppText size={13} weight="heavy" color={t.hc ? '#000' : '#fff'}>
                {i + 1}
              </AppText>
            </View>
            <AppText size={16} color={t.c.title} style={styles.flex}>
              {s}
            </AppText>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <Button label="Gerar lista do que aconteceu" height={52} size={16} onPress={() => router.push('/resumo-do-caso')} />
        <ButtonRow>
          <Button variant="secondary" label="Orientação Pix" height={48} size={14} style={{ flex: 1 }} onPress={() => router.push('/orientacao-pix')} />
          <Button variant="secondary" label="Compartilhar" height={48} size={14} style={{ flex: 1 }} onPress={share} />
        </ButtonRow>
        <Button variant="danger-outline" icon="🧹" label="Apagar dados sensíveis do app" height={48} size={14} onPress={wipe} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2 },
  flex: { flex: 1 },
  content: { padding: 22, gap: 11 },
  step: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  num: { width: 28, height: 28, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  footer: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 6, gap: 8 },
});
