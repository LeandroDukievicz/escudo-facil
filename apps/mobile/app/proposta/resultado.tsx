import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, ButtonRow } from '@/components/Button';
import { ResultScreen } from '@/components/ResultScreen';
import { RiskHeader } from '@/components/RiskHeader';
import { Box } from '@/components/ui';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme';

const SCORE_LINE = {
  high: 'Risco alto pelas suas respostas',
  attention: 'Alguns sinais de risco nas suas respostas',
  low: 'Risco baixo pelas suas respostas',
  unknown: 'Muitas respostas "não sei"',
} as const;

/** E3 · Resultado da proposta — score simples e "Melhor parar antes de continuar". */
export default function ProposalResult() {
  const t = useTheme();
  const { questionnaire: q } = useSession();
  const { markEvidence } = useHistory();
  const [saved, setSaved] = useState(false);
  if (!q) return <Redirect href="/proposta" />;
  // No briefing, a proposta com vários sinais usa o tom "atenção" (amarelo) com texto de alto risco.
  const tone = q.level === 'high' ? 'attention' : q.level;

  return (
    <ResultScreen
      result={q}
      header={<RiskHeader level={tone} title={q.headline} subtitle={SCORE_LINE[q.level]} />}
      footer={
        <>
          <Button label="Ver orientação" height={52} onPress={() => router.push('/passo-a-passo')} />
          <ButtonRow>
            <Button variant="secondary" label="Mandar p/ familiar" height={48} size={14} style={{ flex: 1 }} onPress={() => router.push('/ajuda-familiar')} />
            <Button
              variant="secondary"
              label={saved ? 'Prova salva ✓' : 'Salvar como prova'}
              height={48}
              size={14}
              style={{ flex: 1 }}
              onPress={() => {
                if (q.historyId) markEvidence(q.historyId);
                setSaved(true);
              }}
            />
          </ButtonRow>
        </>
      }
    >
      {q.marked.length > 0 && (
        <Box bg={t.c.surface} style={styles.gap}>
          <AppText size={13} color={t.c.subtle}>
            Sinais que você marcou
          </AppText>
          <View style={styles.chips}>
            {q.marked.map((m) => (
              <View key={m} style={[styles.chip, { backgroundColor: t.hc ? '#000' : t.risk('high').soft, borderColor: t.hc ? t.c.accent : t.risk('high').chip }]}>
                <AppText size={13} weight="bold" color={t.hc ? t.c.accent : '#c0392b'}>
                  {m}
                </AppText>
              </View>
            ))}
          </View>
        </Box>
      )}
      <AppText size={15} lh={1.45}>
        {q.summary}
      </AppText>
      {q.level !== 'low' && (
        <Button variant="calm" icon="🌬️" label="Estão te apressando? Respire primeiro" height={52} size={15} onPress={() => router.push('/nao-me-pressione')} />
      )}
      <Button variant="link" label="Responder de novo" onPress={() => router.replace('/proposta')} />
    </ResultScreen>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  chip: { borderWidth: 1, borderRadius: 18, paddingHorizontal: 11, paddingVertical: 6 },
});
