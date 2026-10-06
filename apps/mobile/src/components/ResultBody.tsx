import { LEVEL_COPY, type AnalysisResult } from '@escudo/core';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { TechnicalDetails } from './TechnicalDetails';
import { BulletList, Notice, SectionLabel } from './ui';

function actionIcon(a: string) {
  const s = a.toLowerCase();
  if (s.includes('ligue')) return '📞';
  if (s.includes('familiar') || s.includes('confiança')) return '👨‍👩‍👧';
  if (s.includes('oficial')) return '🏛️';
  if (s.includes('senha') || s.includes('código')) return '🔒';
  return '🚫';
}

/** Explicação em camadas: resumo → sinais → o que fazer → detalhes técnicos. */
export function ResultBody({ result, pressure }: { result: AnalysisResult; pressure?: boolean }) {
  const t = useTheme();
  const lvl = result.level;
  const signalColor = t.risk(lvl === 'low' ? 'attention' : lvl).border;
  return (
    <View style={styles.wrap}>
      <AppText size={15} lh={1.45}>
        {result.summary}
      </AppText>

      {pressure && (
        <Button
          variant="calm"
          icon="🌬️"
          label="Estão te apressando? Respire primeiro"
          height={52}
          size={15}
          onPress={() => router.push('/nao-me-pressione')}
        />
      )}

      {result.checked.length > 0 && (
        <View style={styles.block}>
          <SectionLabel>O que foi analisado</SectionLabel>
          <BulletList items={result.checked.map((c) => ({ key: c, text: c }))} bullet="✓" bulletColor={t.risk('low').solid} />
        </View>
      )}

      {result.signals.length > 0 && (
        <View style={styles.block}>
          <SectionLabel>Sinais encontrados</SectionLabel>
          <BulletList
            items={result.signals.map((s) => ({ key: s.id, text: s.label }))}
            bullet={lvl === 'high' ? '●' : '⚠'}
            bulletColor={signalColor}
          />
        </View>
      )}

      {lvl === 'low' && (
        <Notice>
          <AppText size={14} color={t.hc ? t.c.title : '#7a5b00'}>
            <AppText size={14} weight="heavy" color={t.hc ? t.c.title : '#7a5b00'}>
              Continue atento.{' '}
            </AppText>
            {LEVEL_COPY.low.reminder?.replace('Continue atento. ', '')}
          </AppText>
        </Notice>
      )}

      {result.notice && <Notice icon="📶">{result.notice}</Notice>}

      <View style={styles.block}>
        <SectionLabel>O que fazer agora</SectionLabel>
        <BulletList items={result.actions.map((a) => ({ key: a, text: a, bullet: actionIcon(a) }))} />
      </View>

      <TechnicalDetails items={result.technical} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  block: { gap: 6 },
});
