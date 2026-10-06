import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button, ButtonRow } from '@/components/Button';
import { HighlightTags, HighlightedText } from '@/components/HighlightedText';
import { ResultScreen } from '@/components/ResultScreen';
import { RiskHeader } from '@/components/RiskHeader';
import { TechnicalDetails } from '@/components/TechnicalDetails';
import { Badge, Box, BulletList, Notice, Row, SectionLabel } from '@/components/ui';
import { aiAvailable } from '@/services/ai';
import { useOnline } from '@/services/network';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme';

const SUBTITLE = { high: 'Mensagem com vários sinais', attention: 'Alguns sinais suspeitos', low: 'Sem sinais fortes agora', unknown: 'Texto insuficiente' } as const;

/** D3 · Resultado do print — trechos destacados e explicação simples. */
export default function PrintResult() {
  const t = useTheme();
  const { print } = useSession();
  const { markEvidence } = useHistory();
  const online = useOnline();
  const [saved, setSaved] = useState(false);
  if (!print?.result) return <Redirect href="/print" />;
  const { result, highlights = [], explanation = [] } = print;
  const lvl = result.level;

  return (
    <ResultScreen
      result={result}
      header={<RiskHeader compact level={lvl} subtitle={SUBTITLE[lvl]} />}
      footer={
        <>
          <Button label="Não sei o que fazer →" height={52} onPress={() => router.push('/passo-a-passo')} />
          <ButtonRow>
            <Button variant="secondary" label="Mandar p/ familiar" height={48} size={14} style={{ flex: 1 }} onPress={() => router.push('/ajuda-familiar')} />
            <Button
              variant="secondary"
              label={saved ? 'Prova salva ✓' : 'Salvar prova'}
              height={48}
              size={14}
              style={{ flex: 1 }}
              onPress={() => {
                if (print.historyId) markEvidence(print.historyId);
                setSaved(true);
              }}
            />
          </ButtonRow>
        </>
      }
    >
      <Row>
        <Badge kind="offline" label="OCR NO APARELHO" />
        {result.mode === 'ai' && <Badge kind="ai" />}
      </Row>
      <View style={styles.previewRow}>
        {print.imageUri ? <Image source={{ uri: print.imageUri }} style={[styles.thumb, { borderColor: t.c.ink }]} accessibilityLabel="Print analisado" /> : null}
        <View style={styles.flex}>
          <HighlightedText text={print.text} highlights={highlights} />
        </View>
      </View>
      {highlights.length > 0 && <HighlightTags highlights={highlights} />}

      <Box bg={t.c.primarySoft} border={t.c.primarySoft} style={styles.explain}>
        <AppText size={14} lh={1.45}>
          {explanation.length ? explanation.join(' ') : result.summary}
        </AppText>
      </Box>

      {print.pressure && (
        <Button variant="calm" icon="🌬️" label="Estão te apressando? Respire primeiro" height={52} size={15} onPress={() => router.push('/nao-me-pressione')} />
      )}

      {result.notice && <Notice icon="📶">{result.notice}</Notice>}

      <View style={styles.block}>
        <SectionLabel>O que fazer agora</SectionLabel>
        <BulletList items={result.actions.map((a) => ({ key: a, text: a, bullet: '•' }))} />
      </View>

      <TechnicalDetails items={result.technical} />

      {aiAvailable() && online !== false && (
        <Button variant="ai" icon="🤖" label="Análise com IA (dados protegidos)" height={52} size={15} onPress={() => router.push('/print/mascara')} />
      )}
      {saved && (
        <AppText size={13} color={t.risk('low').strong} align="center">
          Salvo no histórico deste celular como prova.
        </AppText>
      )}
    </ResultScreen>
  );
}

const styles = StyleSheet.create({
  previewRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  thumb: { width: 56, height: 90, borderRadius: 8, borderWidth: 2 },
  flex: { flex: 1 },
  explain: { padding: 10 },
  block: { gap: 6 },
});
