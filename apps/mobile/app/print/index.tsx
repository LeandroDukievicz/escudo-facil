import { analyzeText, maskSensitive } from '@escudo/core';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box, BulletList, Notice, Toggle } from '@/components/ui';
import { tap } from '@/services/haptics';
import { isOnline } from '@/services/network';
import { recognizeText } from '@/services/ocr';
import { useHistory } from '@/state/history';
import { useSession } from '@/state/session';
import { useSettings } from '@/state/settings';
import { FONT, useTheme } from '@/theme';

/** D1 · Verificar print — OCR no aparelho, sem enviar nada. */
export default function VerifyPrint() {
  const t = useTheme();
  const { settings, update } = useSettings();
  const { setPrint } = useSession();
  const { add } = useHistory();
  const [imageUri, setImageUri] = useState<string>();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [needsText, setNeedsText] = useState(false);
  const [error, setError] = useState('');

  const pick = async (from: 'library' | 'camera') => {
    setError('');
    const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.9 };
    let res: ImagePicker.ImagePickerResult;
    if (from === 'camera') {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setError('Sem permissão para a câmera. Você pode escolher da galeria ou colar o texto.');
        return;
      }
      res = await ImagePicker.launchCameraAsync(opts);
    } else {
      res = await ImagePicker.launchImageLibraryAsync(opts);
    }
    if (res.canceled || !res.assets[0]) return;
    const uri = res.assets[0].uri;
    setImageUri(uri);
    setBusy(true);
    const ocr = await recognizeText(uri);
    setBusy(false);
    if (ocr.available && ocr.text.trim()) {
      setText(ocr.text.trim());
      setNeedsText(false);
    } else {
      setNeedsText(true);
    }
  };

  const analyze = async () => {
    if (!text.trim()) {
      setError(imageUri ? 'Não conseguimos ler o texto. Digite ou cole a mensagem abaixo.' : 'Escolha um print ou cole o texto da conversa.');
      setNeedsText(true);
      return;
    }
    const offline = !(await isOnline());
    const a = analyzeText(text, { offline, fromImage: !!imageUri });
    const masked = settings.autoMask ? maskSensitive(text, ['cpf', 'phone', 'email']).text : text;
    const entry = add({
      kind: 'print',
      level: a.result.level,
      title: a.result.title,
      preview: masked.slice(0, 80),
      signals: a.result.signals.map((s) => s.label),
    });
    setPrint({
      imageUri,
      text,
      maskedText: masked,
      result: a.result,
      highlights: a.highlights,
      explanation: a.explanation,
      scamType: a.scamType,
      pressure: a.pressure,
      historyId: entry.id,
    });
    router.push('/print/resultado');
  };

  const BigOption = ({ icon, label, bg, onPress }: { icon: string; label: string; bg: string; onPress: () => void }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.option, { backgroundColor: t.hc ? '#000' : bg, borderColor: t.c.ink, borderWidth: t.hc ? 3 : 2, opacity: pressed ? 0.85 : 1 }]}
    >
      <AppText size={32}>{icon}</AppText>
      <AppText size={18} weight="heavy" color={t.c.title} style={styles.flex} lh={1.15}>
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <Screen back title="Verificar print" icon="🖼️" footer={<Button label="Analisar print" onPress={analyze} disabled={busy} />}>
      <BigOption icon="🖼️" label="Escolher print da galeria" bg={t.risk('low').soft} onPress={() => pick('library')} />
      <BigOption icon="📷" label="Tirar foto da tela de outro celular" bg={t.c.primarySoft} onPress={() => pick('camera')} />

      {imageUri && (
        <View style={styles.preview}>
          <Image source={{ uri: imageUri }} style={styles.thumb} accessibilityLabel="Print escolhido" />
          {busy ? (
            <View style={styles.row}>
              <ActivityIndicator color={t.c.primary} />
              <AppText size={14}>Lendo o texto no aparelho…</AppText>
            </View>
          ) : (
            <AppText size={14} color={t.c.muted} style={styles.flex}>
              {text ? 'Texto lido no aparelho. Confira abaixo.' : 'Print escolhido.'}
            </AppText>
          )}
        </View>
      )}

      {needsText && !busy && (
        <Notice icon="✍️" tone="info">
          Não conseguimos ler o print neste aparelho. Cole ou digite o texto da mensagem abaixo.
        </Notice>
      )}

      {(needsText || !!text) && (
        <TextInput
          value={text}
          onChangeText={setText}
          multiline
          placeholder="Cole aqui o texto da conversa"
          placeholderTextColor={t.c.placeholder}
          accessibilityLabel="Texto da conversa"
          style={[styles.input, { borderColor: t.c.ink, backgroundColor: t.c.surface, color: t.c.title, fontSize: t.fs(15) }]}
        />
      )}

      {!imageUri && !needsText && (
        <Button variant="link" label="Prefiro colar o texto da mensagem" onPress={() => setNeedsText(true)} />
      )}

      {error ? (
        <AppText size={14} weight="bold" color={t.hc ? t.c.accent : '#a02020'} accessibilityLiveRegion="polite">
          {error}
        </AppText>
      ) : null}

      <Box dashed border={t.c.border} bg={t.c.bg} style={styles.tips}>
        <BulletList
          size={14}
          bullet="✓"
          items={[
            { key: '1', text: 'Envie uma imagem nítida da conversa' },
            { key: '2', text: 'Não precisa cortar a imagem' },
            { key: '3', text: 'Você pode esconder dados pessoais' },
          ]}
        />
      </Box>

      <Box bg={t.c.primarySoft} border={t.hc ? t.c.ink : t.c.primary}>
        <Toggle
          icon="🛡️"
          label="Ocultar CPF, telefone e e-mail automaticamente"
          value={settings.autoMask}
          onChange={(v) => update({ autoMask: v })}
        />
      </Box>
    </Screen>
  );
}

const styles = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 14, minHeight: 76 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  preview: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumb: { width: 64, height: 96, borderRadius: 10, borderWidth: 2, borderColor: '#1f2a37' },
  input: { minHeight: 120, borderWidth: 2, borderRadius: 14, padding: 14, fontFamily: FONT.regular, textAlignVertical: 'top' },
  tips: { borderWidth: 1, padding: 12 },
});
