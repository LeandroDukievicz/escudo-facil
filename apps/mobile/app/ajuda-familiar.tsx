import { SHARE_MESSAGE } from '@escudo/core';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Box, confirm } from '@/components/ui';
import { tap } from '@/services/haptics';
import { buildShareText, shareViaWhatsApp } from '@/services/share';
import { useSession } from '@/state/session';
import { useSettings } from '@/state/settings';
import { FONT, useTheme } from '@/theme';

/** B3 · Pedir ajuda para familiar — grátis e sem login. */
export default function AskFamily() {
  const t = useTheme();
  const { settings, update } = useSettings();
  const { link, print, questionnaire } = useSession();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const contact = settings.trustedContact;

  // Usa a análise mais recente (link, print ou perguntas), se houver.
  const latest = link?.result ?? print?.result ?? questionnaire;
  const text = useMemo(() => buildShareText(latest), [latest]);

  const inputStyle = [styles.input, { borderColor: t.c.ink, color: t.c.title, backgroundColor: t.c.surface, fontSize: t.fs(16) }];

  const send = async () => {
    const ok = await confirm(
      'Enviar pelo WhatsApp?',
      contact ? `Vamos abrir o WhatsApp para você mandar a mensagem para ${contact.name}.` : 'Vamos abrir o WhatsApp para você escolher para quem mandar.',
      'Enviar',
    );
    if (ok) await shareViaWhatsApp(text, contact?.phone);
  };

  return (
    <Screen
      back
      title="Pedir ajuda"
      footer={
        <>
          <Button variant="success" icon="💬" label="Enviar pelo WhatsApp" onPress={send} />
          <Button variant="link" size={14} label="Modo Família com alertas → exige login (Plus)" onPress={() => router.push('/modo-familia')} />
        </>
      }
    >
      <AppText size={16} lh={1.4}>
        Você pode mandar essa análise para alguém de confiança verificar com você.
      </AppText>
      <Box bg={t.c.surface}>
        <AppText size={12} color={t.c.subtle} style={styles.mb6}>
          Mensagem pronta
        </AppText>
        <AppText size={15} color={t.c.title} lh={1.4}>
          “{SHARE_MESSAGE}”
        </AppText>
        {latest && (
          <AppText size={13} color={t.c.subtle} style={styles.mt6}>
            + resultado: {latest.title}
          </AppText>
        )}
      </Box>

      <AppText size={14} color={t.c.subtle}>
        Escolher contato de confiança
      </AppText>
      <View style={styles.contacts}>
        {contact && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${contact.relation}, ${contact.name}. Toque e segure para remover.`}
            onLongPress={async () => {
              if (await confirm('Remover contato?', `${contact.name} deixará de ser seu contato de confiança.`, 'Remover')) update({ trustedContact: undefined });
            }}
            style={[styles.contact, { borderColor: t.c.ink }]}
          >
            <AppText size={15} weight="bold" color={t.c.title}>
              👤 {contact.relation}
            </AppText>
            <AppText size={12} color={t.c.subtle}>
              {contact.name}
            </AppText>
          </Pressable>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar contato de confiança"
          onPress={() => {
            tap();
            setAdding(true);
          }}
          style={[styles.contact, styles.add, { borderColor: t.c.border }]}
        >
          <AppText size={18} color={t.c.subtle}>
            ＋
          </AppText>
          <AppText size={13} color={t.c.subtle}>
            {contact ? 'Trocar' : 'Adicionar'}
          </AppText>
        </Pressable>
      </View>

      {adding && (
        <Box style={styles.form}>
          <TextInput value={name} onChangeText={setName} placeholder="Nome (ex.: Ana)" placeholderTextColor={t.c.placeholder} style={inputStyle} accessibilityLabel="Nome do contato" />
          <TextInput value={relation} onChangeText={setRelation} placeholder="Quem é (ex.: Filha)" placeholderTextColor={t.c.placeholder} style={inputStyle} accessibilityLabel="Parentesco" />
          <TextInput value={phone} onChangeText={setPhone} placeholder="WhatsApp com DDD (opcional)" placeholderTextColor={t.c.placeholder} keyboardType="phone-pad" style={inputStyle} accessibilityLabel="Telefone do contato" />
          <AppText size={12} color={t.c.subtle}>
            Fica salvo só neste celular.
          </AppText>
          <Button
            label="Salvar contato"
            height={50}
            onPress={() => {
              if (!name.trim()) return;
              update({ trustedContact: { name: name.trim(), relation: relation.trim() || 'Contato', phone: phone.trim() || undefined } });
              setAdding(false);
            }}
          />
        </Box>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  mb6: { marginBottom: 6 },
  mt6: { marginTop: 6 },
  contacts: { flexDirection: 'row', gap: 10 },
  contact: { flex: 1, borderWidth: 2, borderRadius: 14, padding: 12, alignItems: 'center', minHeight: 64, justifyContent: 'center' },
  add: { borderStyle: 'dashed' },
  form: { gap: 10 },
  input: { borderWidth: 2, borderRadius: 12, minHeight: 50, paddingHorizontal: 14, fontFamily: FONT.regular },
});
