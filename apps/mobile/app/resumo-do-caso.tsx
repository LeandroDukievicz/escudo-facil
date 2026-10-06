import { useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box, Notice } from '@/components/ui';
import { caseSummaryText, exportCasePdf, type CaseSummary } from '@/services/report';
import { shareViaWhatsApp } from '@/services/share';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { FONT, useTheme } from '@/theme';

/** G2 · Resumo do caso — para levar ao banco e ao boletim de ocorrência. */
export default function CaseSummaryScreen() {
  const t = useTheme();
  const { entries } = useHistory();
  const { link, print, questionnaire } = useSession();
  const latest = print?.result ?? link?.result ?? questionnaire;
  const evidenceCount = entries.filter((e) => e.evidence).length;

  const [what, setWhat] = useState(print?.scamType ? `mensagem de ${print.scamType}` : '');
  const [channel, setChannel] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const summary: CaseSummary = useMemo(
    () => ({
      what,
      channel,
      amount,
      signals: latest?.signals.map((s) => s.label.toLowerCase()).join(', ') ?? '',
      evidence: evidenceCount ? `${evidenceCount} verificação(ões) salva(s) como prova no app` : 'prints e comprovantes no celular',
      generatedAt: new Date(),
    }),
    [what, channel, amount, latest, evidenceCount],
  );

  const field = (label: string, value: string, set: (v: string) => void, placeholder: string, kb?: 'numeric') => (
    <View style={styles.field}>
      <AppText size={13} color={t.c.subtle}>
        {label}
      </AppText>
      <TextInput
        value={value}
        onChangeText={set}
        placeholder={placeholder}
        placeholderTextColor={t.c.placeholder}
        keyboardType={kb === 'numeric' ? 'numbers-and-punctuation' : 'default'}
        accessibilityLabel={label}
        style={[styles.input, { borderColor: t.c.ink, color: t.c.title, backgroundColor: t.c.surface, fontSize: t.fs(15) }]}
      />
    </View>
  );

  return (
    <Screen
      back
      title="Resumo do caso"
      icon="📄"
      footer={
        <>
          <Button variant="success" icon="💬" label="Compartilhar com familiar" height={52} onPress={() => shareViaWhatsApp(caseSummaryText(summary))} />
          <Button
            variant="secondary"
            label="Salvar em PDF"
            height={48}
            size={15}
            onPress={() => exportCasePdf(summary).catch(() => setError('Não foi possível gerar o PDF neste aparelho. Use "Compartilhar".'))}
          />
        </>
      }
    >
      {field('O que houve', what, setWhat, 'Ex.: mensagem falsa do "banco" pedindo Pix')}
      {field('Canal', channel, setChannel, 'Ex.: WhatsApp, número desconhecido')}
      {field('Valor enviado', amount, setAmount, 'Ex.: R$ 250 via Pix (ou "nenhum")', 'numeric')}

      <Box bg={t.c.surface} style={styles.card}>
        <AppText size={11} color={t.c.subtle}>
          Gerado pelo Escudo Fácil · {summary.generatedAt.toLocaleString('pt-BR')}
        </AppText>
        <AppText size={14}>
          <AppText size={14} weight="bold">Sinais: </AppText>
          {summary.signals || '—'}
        </AppText>
        <AppText size={14}>
          <AppText size={14} weight="bold">Provas: </AppText>
          {summary.evidence}
        </AppText>
      </Box>
      <Notice icon="📋" tone="success">
        Leve este resumo ao banco e ao boletim de ocorrência. Ele organiza tudo para você.
      </Notice>
      {error ? (
        <AppText size={14} weight="bold" color={t.hc ? t.c.accent : '#a02020'}>
          {error}
        </AppText>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: 4 },
  input: { borderWidth: 2, borderRadius: 12, minHeight: 50, paddingHorizontal: 14, fontFamily: FONT.regular },
  card: { gap: 8 },
});
