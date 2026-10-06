import { LEVEL_COPY } from '@escudo/core';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { AiPanel } from '@/components/AiPanel';
import { AppText } from '@/components/AppText';
import { Button, ButtonRow } from '@/components/Button';
import { ResultBody } from '@/components/ResultBody';
import { ResultScreen } from '@/components/ResultScreen';
import { RiskHeader } from '@/components/RiskHeader';
import { Box } from '@/components/ui';
import { buildShareText, shareSystem } from '@/services/share';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme';

/** C3–C6 · Resultado do link nas 4 variações do semáforo. */
export default function LinkResult() {
  const t = useTheme();
  const { link } = useSession();
  const { markEvidence } = useHistory();
  const [saved, setSaved] = useState(false);
  if (!link) return <Redirect href="/link" />;
  const { result } = link;
  const lvl = result.level;

  const share = () => shareSystem(buildShareText(result, 'Peça ajuda para conferir o endereço no seu próprio celular.'));
  const again = () => router.replace('/link');
  const save = () => {
    if (link.historyId) markEvidence(link.historyId);
    setSaved(true);
  };

  const footer = (() => {
    switch (lvl) {
      case 'low':
        return (
          <>
            <Button label="Confirmar canal oficial" height={52} size={16} onPress={() => router.push('/canal-oficial')} />
            <ButtonRow>
              <Button variant="secondary" label="Compartilhar" height={48} size={15} style={{ flex: 1 }} onPress={share} />
              <Button variant="secondary" label="Nova análise" height={48} size={15} style={{ flex: 1 }} onPress={again} />
            </ButtonRow>
          </>
        );
      case 'attention':
        return (
          <>
            <Button icon="👨‍👩‍👧" label="Mandar para familiar" height={52} size={16} onPress={() => router.push('/ajuda-familiar')} />
            <ButtonRow>
              <Button variant="secondary" label={saved ? 'Prova salva ✓' : 'Salvar prova'} height={48} size={15} style={{ flex: 1 }} onPress={save} />
              <Button variant="secondary" label="Nova análise" height={48} size={15} style={{ flex: 1 }} onPress={again} />
            </ButtonRow>
          </>
        );
      case 'high':
        return (
          <>
            <Button variant="danger" icon="🚫" label="Não clique nesse link" height={52} size={16} accessibilityHint="Abre o passo a passo de segurança" onPress={() => router.push('/passo-a-passo')} />
            <ButtonRow>
              <Button variant="secondary" label="Mandar p/ familiar" height={48} size={14} style={{ flex: 1 }} onPress={() => router.push('/ajuda-familiar')} />
              <Button variant="secondary" label="Denunciar" height={48} size={14} style={{ flex: 1 }} onPress={() => router.push('/denunciar')} />
            </ButtonRow>
          </>
        );
      default:
        return (
          <>
            <Button label="Confirmar canal oficial" height={52} size={16} onPress={() => router.push('/canal-oficial')} />
            <Button variant="secondary" label="Nova análise" height={48} size={15} onPress={again} />
          </>
        );
    }
  })();

  return (
    <ResultScreen
      result={result}
      statusRight="ANÁLISE LOCAL"
      header={<RiskHeader level={lvl} subtitle={lvl === 'high' ? LEVEL_COPY.high.reminder : undefined} />}
      footer={footer}
    >
      <Box bg={t.c.surface} border={t.c.border} style={{ padding: 10, borderWidth: 1 }}>
        <AppText size={12} color={t.c.subtle}>
          Link verificado (não é clicável):
        </AppText>
        <AppText size={13} color={t.c.title} selectable numberOfLines={3}>
          {link.input}
        </AppText>
      </Box>
      <ResultBody result={result} />
      <AiPanel request={{ kind: 'link', content: link.input, local: { level: lvl, signals: result.signals }, locale: 'pt-BR' }} />
      {saved && (
        <AppText size={13} color={t.risk('low').strong} align="center" accessibilityLiveRegion="polite">
          Salvo no histórico deste celular como prova.
        </AppText>
      )}
    </ResultScreen>
  );
}
