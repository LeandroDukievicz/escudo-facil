import { findForbiddenPhrases, LEVEL_COPY, type AiAnalysisRequest, type AiAnalysisResponse } from '@escudo/core';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { aiAvailable, analyzeWithAi } from '@/services/ai';
import { useOnline } from '@/services/network';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Badge, Box, BulletList, Row, SectionLabel } from './ui';

/**
 * "Análise com IA" (online, opcional). Só aparece se houver internet e a
 * API estiver configurada. Nunca é chamada sem o usuário tocar.
 */
export function AiPanel({ request }: { request: AiAnalysisRequest }) {
  const t = useTheme();
  const online = useOnline();
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [res, setRes] = useState<AiAnalysisResponse>();

  if (!aiAvailable() || online === false) return null;

  const run = async () => {
    setState('loading');
    try {
      const r = await analyzeWithAi(request);
      // Segunda barreira para a regra "nunca dizer seguro".
      if (findForbiddenPhrases(JSON.stringify(r)).length) r.title = LEVEL_COPY[r.level].title;
      setRes(r);
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'idle' || state === 'error') {
    return (
      <View style={styles.gap}>
        <Button variant="ai" icon="🤖" label="Análise com IA (mais completa)" height={52} size={15} onPress={run} />
        <AppText size={12} color={t.c.subtle} align="center">
          {state === 'error'
            ? 'Não foi possível usar a IA agora. O resultado acima continua válido.'
            : 'Envia só o texto, com seus dados pessoais escondidos.'}
        </AppText>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <Box bg={t.c.aiSoft} border={t.c.ai}>
        <Row>
          <ActivityIndicator color={t.c.ai} />
          <AppText size={14}>A IA está analisando…</AppText>
        </Row>
      </Box>
    );
  }

  return res ? (
    <Box bg={t.c.aiSoft} border={t.c.ai} style={styles.gap}>
      <Row>
        <Badge kind="ai" />
        <Badge kind="online" />
      </Row>
      <AppText size={16} weight="heavy" color={t.c.title}>
        {res.title}
      </AppText>
      <AppText size={14}>{res.intent}</AppText>
      {res.known.length > 0 && (
        <>
          <SectionLabel>O que sabemos</SectionLabel>
          <BulletList items={res.known.map((k) => ({ key: k, text: k }))} bullet="✓" />
        </>
      )}
      {res.unknown.length > 0 && (
        <>
          <SectionLabel>O que não dá para confirmar</SectionLabel>
          <BulletList items={res.unknown.map((k) => ({ key: k, text: k }))} bullet="?" />
        </>
      )}
    </Box>
  ) : null;
}

const styles = StyleSheet.create({ gap: { gap: 8 } });
