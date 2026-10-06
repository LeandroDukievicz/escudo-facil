import { QUESTIONS, scoreQuestionnaire, type Answer } from '@escudo/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { VoiceButton } from '@/components/VoiceButton';
import { tap } from '@/services/haptics';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme';

/** E1/E2 · Perguntas guiadas — Sim / Não / Não sei, uma por tela. */
export default function Questionnaire() {
  const t = useTheme();
  const { setQuestionnaire } = useSession();
  const { add } = useHistory();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const q = QUESTIONS[index]!;
  const total = QUESTIONS.length;

  const answer = (a: Answer) => {
    tap();
    const next = { ...answers, [q.id]: a };
    setAnswers(next);
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    const r = scoreQuestionnaire(next);
    const entry = add({ kind: 'questionnaire', level: r.level, title: r.headline, preview: 'Proposta suspeita (perguntas)', signals: r.marked });
    setQuestionnaire({ ...r, historyId: entry.id });
    router.replace('/proposta/resultado');
  };

  const back = () => (index > 0 ? setIndex(index - 1) : router.back());

  const answerStyle = (kind: 'yes' | 'no' | 'unknown') => {
    if (t.hc) return { bg: '#000', fg: '#fff' };
    if (kind === 'yes') return { bg: t.risk('high').soft, fg: '#a02020' };
    if (kind === 'no') return { bg: t.risk('low').soft, fg: '#0d6b35' };
    return { bg: t.risk('unknown').soft, fg: '#475063' };
  };

  const AnswerButton = ({ kind, icon, label, height }: { kind: Answer; icon: string; label: string; height: number }) => {
    const s = answerStyle(kind);
    const selected = answers[q.id] === kind;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ selected }}
        onPress={() => answer(kind)}
        style={({ pressed }) => [
          styles.answer,
          { height, backgroundColor: s.bg, borderColor: selected && t.hc ? t.c.accent : t.c.ink, borderWidth: t.hc ? 3 : 2, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}
      >
        <AppText size={kind === 'unknown' ? 19 : 21} weight="heavy" color={s.fg}>
          {icon} {label}
        </AppText>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.c.bg }]}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={back} style={styles.backHit}>
          <AppText size={26} weight="bold" color={t.hc ? t.c.accent : t.c.primary}>
            ‹
          </AppText>
        </Pressable>
        <AppText size={14} weight="bold" color={t.c.subtle} style={styles.flex}>
          Pergunta {index + 1} de {total}
        </AppText>
        <VoiceButton text={`${q.text} Responda: Sim, Não, ou Não sei.`} />
      </View>
      <View style={styles.progressWrap}>
        <View
          style={[styles.progress, { backgroundColor: t.hc ? '#333' : '#dfe5ec' }]}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: index + 1 }}
        >
          <View style={{ width: `${((index + 1) / total) * 100}%`, height: '100%', backgroundColor: t.hc ? t.c.accent : t.c.primary }} />
        </View>
      </View>
      <View style={styles.question}>
        <AppText size={48}>{q.icon}</AppText>
        <AppText size={25} weight="heavy" color={t.c.title} align="center" lh={1.2} accessibilityRole="header" accessibilityLiveRegion="polite">
          {q.text}
        </AppText>
      </View>
      <View style={styles.answers}>
        <AnswerButton kind="yes" icon="👍" label="Sim" height={62} />
        <AnswerButton kind="no" icon="👎" label="Não" height={62} />
        <AnswerButton kind="unknown" icon="🤔" label="Não sei" height={56} />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 22, paddingTop: 12 },
  backHit: { minWidth: 44, minHeight: 48, justifyContent: 'center' },
  flex: { flex: 1 },
  progressWrap: { paddingHorizontal: 22 },
  progress: { height: 8, borderRadius: 8, overflow: 'hidden' },
  question: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 8 },
  answers: { paddingHorizontal: 22, paddingBottom: 24, gap: 12 },
  answer: { borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
