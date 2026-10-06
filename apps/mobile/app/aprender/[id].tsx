import { LEARN_CARDS } from '@escudo/core';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Dots } from '@/components/Dots';
import { Screen } from '@/components/Screen';
import { VoiceButton } from '@/components/VoiceButton';
import { useLearned } from '@/state/learn';
import { useTheme } from '@/theme';

/** F4 · Card de aprendizado — ilustração, texto curto e "Entendi". */
export default function LearnCard() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { markLearned } = useLearned();
  const index = Math.max(0, LEARN_CARDS.findIndex((c) => c.id === id));
  const card = LEARN_CARDS[index]!;
  const next = LEARN_CARDS[index + 1];

  return (
    <Screen
      back
      right={<VoiceButton text={`${card.title}. ${card.body}`} />}
      title={`${index + 1} de ${LEARN_CARDS.length}`}
      footer={
        <>
          <Dots active={index} total={LEARN_CARDS.length} />
          <Button
            variant="success"
            label="Entendi 👍"
            onPress={() => {
              markLearned(card.id);
              if (next) router.replace({ pathname: '/aprender/[id]', params: { id: next.id } });
              else router.back();
            }}
          />
        </>
      }
    >
      <View style={[styles.art, { borderColor: t.c.border, backgroundColor: t.c.surface }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <AppText size={64}>{card.icon}</AppText>
      </View>
      <AppText size={24} weight="heavy" color={t.c.title} align="center" lh={1.2} accessibilityRole="header">
        {card.title}
      </AppText>
      <AppText size={17} align="center" lh={1.5}>
        {card.body}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  art: { height: 160, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
