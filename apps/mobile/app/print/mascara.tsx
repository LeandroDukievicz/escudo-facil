import { MASK_LABELS, maskSensitive, type MaskKind } from '@escudo/core';
import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AiPanel } from '@/components/AiPanel';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box } from '@/components/ui';
import { tap } from '@/services/haptics';
import { useSession } from '@/state/session';
import { useTheme } from '@/theme';

const KINDS: MaskKind[] = ['cpf', 'phone', 'email', 'pix', 'card', 'document', 'address'];

/** D2 · Máscara de dados — roda no aparelho ANTES de qualquer envio para a IA. */
export default function MaskBeforeAi() {
  const t = useTheme();
  const { print } = useSession();
  const [kinds, setKinds] = useState<MaskKind[]>(['cpf', 'phone', 'email', 'pix', 'card']);
  const masked = useMemo(() => maskSensitive(print?.text ?? '', kinds), [print?.text, kinds]);
  const [send, setSend] = useState(false);
  if (!print?.result) return <Redirect href="/print" />;

  const toggle = (k: MaskKind) => {
    tap();
    setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  };

  return (
    <Screen
      back
      title="Proteger seus dados"
      footer={
        <>
          {!send && <Button variant="ai" icon="🤖" label="Enviar protegido para IA" onPress={() => setSend(true)} />}
          <Button variant="link" label="Analisar só no aparelho (sem IA)" onPress={() => router.back()} />
        </>
      }
    >
      <AppText size={15} lh={1.45}>
        Antes de enviar para a IA, vamos esconder seus dados pessoais.{' '}
        <AppText size={15} weight="heavy">
          Você decide.
        </AppText>
      </AppText>
      <Box bg={t.c.surface}>
        <AppText size={13} lh={1.6} selectable>
          {masked.text}
        </AppText>
      </Box>
      <AppText size={13} color={t.c.subtle}>
        Ocultar automaticamente{masked.total ? ` · ${masked.total} dado(s) escondido(s)` : ''}:
      </AppText>
      <View style={styles.chips}>
        {KINDS.map((k) => {
          const on = kinds.includes(k);
          return (
            <Pressable
              key={k}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`Ocultar ${MASK_LABELS[k]}`}
              onPress={() => toggle(k)}
              style={[
                styles.chip,
                on
                  ? { backgroundColor: t.hc ? '#000' : t.risk('low').soft, borderColor: t.hc ? t.c.accent : t.risk('low').solid }
                  : { backgroundColor: t.c.surface, borderColor: t.c.border },
              ]}
            >
              <AppText size={14} weight={on ? 'bold' : 'regular'} color={on ? (t.hc ? t.c.accent : t.risk('low').strong) : t.c.subtle}>
                {on ? '✓' : '＋'} {MASK_LABELS[k]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {send && (
        <AiPanel
          request={{
            kind: 'text',
            content: masked.text,
            local: { level: print.result.level, signals: print.result.signals },
            locale: 'pt-BR',
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 2, borderRadius: 20, paddingHorizontal: 12, minHeight: 44, justifyContent: 'center' },
});
