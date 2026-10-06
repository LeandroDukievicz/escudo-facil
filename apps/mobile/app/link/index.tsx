import { analyzeLink } from '@escudo/core';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box, Notice } from '@/components/ui';
import { isOnline } from '@/services/network';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { FONT, useTheme } from '@/theme';

/** C1 · Verificar link — o app nunca abre o link. */
export default function VerifyLink() {
  const t = useTheme();
  const { setLink } = useSession();
  const { add } = useHistory();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const paste = async () => {
    const text = await Clipboard.getStringAsync().catch(() => '');
    if (text) {
      setValue(text.trim());
      setError('');
    } else setError('Não encontramos nenhum link copiado. Copie o link e tente de novo.');
  };

  const verify = async () => {
    if (!value.trim()) {
      setError('Cole ou digite o link primeiro.');
      return;
    }
    const offline = !(await isOnline());
    const result = analyzeLink(value, { offline });
    const entry = add({
      kind: 'link',
      level: result.level,
      title: result.title,
      preview: 'Link analisado (endereço oculto)',
      signals: result.signals.map((s) => s.label),
    });
    setLink({ input: value.trim(), result, historyId: entry.id });
    router.push('/link/verificando');
  };

  return (
    <Screen
      back
      title="Verificar link"
      icon="🔗"
      footer={<Button label="Verificar sem abrir" height={58} size={18} onPress={verify} />}
    >
      <AppText size={17}>Cole aqui o link que você recebeu:</AppText>
      <TextInput
        value={value}
        onChangeText={(v) => {
          setValue(v);
          setError('');
        }}
        placeholder="http://..."
        placeholderTextColor={t.c.placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        multiline
        accessibilityLabel="Link para verificar"
        style={[
          styles.input,
          { borderColor: t.c.ink, backgroundColor: t.c.surface, color: t.c.title, fontSize: t.fs(16), borderWidth: t.hc ? 3 : 2 },
        ]}
      />
      {error ? (
        <AppText size={14} weight="bold" color={t.hc ? t.c.accent : '#a02020'} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}
      <Button variant="secondary" icon="📋" label="Colar link copiado" height={52} onPress={paste} />
      <Notice icon="🚫">
        <AppText size={14} color={t.hc ? t.c.title : '#7a5b00'}>
          O app <AppText size={14} weight="heavy" color={t.hc ? t.c.title : '#7a5b00'}>não abre</AppText> o link durante a
          análise. Você fica protegido.
        </AppText>
      </Notice>
      <Box dashed border={t.c.border} bg={t.c.bg} style={styles.example}>
        <AppText size={13} color={t.c.subtle}>
          Ex.:{' '}
          <AppText size={13} color={t.hc ? t.c.accent : '#c0392b'}>
            http://seu-banco.verifique-conta
            <AppText size={13} weight="heavy" color={t.hc ? t.c.accent : '#c0392b'}>
              .xyz
            </AppText>
            /login
          </AppText>{' '}
          — endereço estranho
        </AppText>
      </Box>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 96, borderRadius: 14, padding: 14, fontFamily: FONT.regular, textAlignVertical: 'top' },
  example: { padding: 10, borderWidth: 1 },
});
