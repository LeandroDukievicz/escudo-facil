import { LEVEL_COPY } from '@escudo/core';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Badge, Box, confirm, Notice, Row, Toggle } from '@/components/ui';
import { relativeDate, useHistory, type HistoryEntry } from '@/state/history';
import { useTheme } from '@/theme';

const KIND_LABEL: Record<HistoryEntry['kind'], string> = {
  link: 'Link',
  print: 'Print',
  text: 'Mensagem',
  questionnaire: 'Proposta',
  checklist: 'Checklist',
};

/** F1 · Histórico local (grátis) + prévia do F2 (nuvem, Plus). */
export default function History() {
  const t = useTheme();
  const { entries, clear } = useHistory();
  const [showPlus, setShowPlus] = useState(false);

  const wipe = async () => {
    if (await confirm('Apagar todo o histórico?', 'Isso apaga as verificações salvas neste celular. Não dá para desfazer.', 'Apagar tudo')) await clear();
  };

  return (
    <Screen
      title="Histórico"
      icon="🕘"
      edges={['top']}
      footer={
        entries.length > 0 ? (
          <>
            <Button variant="danger-outline" icon="🗑️" label="Apagar tudo" height={50} size={15} onPress={wipe} />
            <AppText size={12} color={t.c.subtle} align="center">
              Pede confirmação antes de apagar
            </AppText>
          </>
        ) : undefined
      }
    >
      <Notice icon="📱" tone="neutral">
        Seu histórico fica apenas neste celular.
      </Notice>

      {entries.length === 0 ? (
        <Box dashed border={t.c.border} style={styles.empty}>
          <AppText size={32}>🗂️</AppText>
          <AppText size={16} color={t.c.muted} align="center">
            Nenhuma verificação ainda. Quando você verificar um link, print ou proposta, ela aparece aqui.
          </AppText>
          <Button label="Verificar agora" height={50} onPress={() => router.push('/(tabs)')} />
        </Box>
      ) : (
        entries.map((e) => {
          const r = t.risk(e.level);
          return (
            <View
              key={e.id}
              accessible
              accessibilityLabel={`${KIND_LABEL[e.kind]}, ${LEVEL_COPY[e.level].short}, ${relativeDate(e.createdAt)}${e.evidence ? ', salvo como prova' : ''}`}
              style={[styles.item, { borderColor: t.c.ink, borderWidth: t.hc ? 3 : 2 }]}
            >
              <View style={[styles.dot, { backgroundColor: r.soft, borderColor: r.chip }]}>
                <AppText size={16}>{LEVEL_COPY[e.level].icon}</AppText>
              </View>
              <View style={styles.flex}>
                <AppText size={15} weight="bold" color={t.c.title}>
                  {KIND_LABEL[e.kind]} · {LEVEL_COPY[e.level].short.toLowerCase()}
                  {e.evidence ? '  📎' : ''}
                </AppText>
                <AppText size={12} color={t.c.subtle} numberOfLines={1}>
                  {relativeDate(e.createdAt)} · {e.preview}
                </AppText>
              </View>
            </View>
          );
        })
      )}

      <Box bg={t.risk('attention').soft} border={t.risk('attention').border} style={styles.plus}>
        <Row>
          <Badge kind="plus" />
          <Badge kind="login" />
          <Badge kind="online" />
        </Row>
        <Toggle label="Ver como fica no Plus" value={showPlus} onChange={setShowPlus} />
        {showPlus && (
          <View style={styles.plusBody}>
            <Notice icon="☁️" tone="success">
              Protegido na nuvem e sincronizado.
            </Notice>
            <Box bg={t.c.primarySoft} border={t.c.primary}>
              <AppText size={14} weight="heavy" color={t.c.title}>
                📊 Relatório do mês
              </AppText>
              <Row style={styles.between}>
                <AppText size={14}>{entries.length} verificações</AppText>
                <AppText size={14} weight="bold" color={t.hc ? t.c.accent : '#c0392b'}>
                  {entries.filter((e) => e.level === 'high').length} alto risco
                </AppText>
              </Row>
            </Box>
            <AppText size={13} color={t.c.subtle}>
              Sincronização, alertas para a família e relatório mensal fazem parte do plano Plus.
            </AppText>
            <Button variant="secondary" label="Ver planos" height={48} size={15} onPress={() => router.push('/planos')} />
          </View>
        )}
      </Box>
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', gap: 12, padding: 20 },
  item: { borderRadius: 12, padding: 11, flexDirection: 'row', alignItems: 'center', gap: 11 },
  dot: { width: 38, height: 38, borderRadius: 38, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  plus: { gap: 8, marginTop: 6 },
  plusBody: { gap: 10 },
  between: { justifyContent: 'space-between' },
});
