import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Badge, Box, Notice, Row } from '@/components/ui';
import { FONT, useTheme } from '@/theme';

/**
 * G4 · Login + pagamento — o ÚNICO lugar (com Modo Família e nuvem) onde
 * pedimos dados. O backend de contas/pagamento ainda não existe: a tela é
 * honesta sobre isso e devolve o usuário ao plano grátis.
 */
export default function Subscribe() {
  const t = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  const input = [styles.input, { borderColor: t.c.ink, color: t.c.title, backgroundColor: t.c.card, fontSize: t.fs(15) }];

  return (
    <Screen
      back
      title="Assinar o Plus"
      footer={
        <>
          <Button variant="success" label="Continuar para pagamento" height={52} onPress={() => setSent(true)} disabled={!email || !password} />
          <Button variant="link" label="Agora não, continuar grátis" onPress={() => router.replace('/(tabs)')} />
        </>
      }
    >
      <Row>
        <Badge kind="login" label="LOGIN SÓ AQUI" />
        <Badge kind="online" />
      </Row>
      <Box bg={t.c.surface}>
        <AppText size={13} color={t.c.muted}>
          É a primeira vez que pedimos seus dados. Login só serve para o plano pago e a sincronização.
        </AppText>
      </Box>
      <View style={styles.field}>
        <AppText size={13} color={t.c.subtle}>
          E-mail
        </AppText>
        <TextInput value={email} onChangeText={setEmail} placeholder="voce@email.com" placeholderTextColor={t.c.placeholder} autoCapitalize="none" keyboardType="email-address" autoComplete="email" accessibilityLabel="E-mail" style={input} />
      </View>
      <View style={styles.field}>
        <AppText size={13} color={t.c.subtle}>
          Senha
        </AppText>
        <TextInput value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor={t.c.placeholder} secureTextEntry autoComplete="password" accessibilityLabel="Senha" style={input} />
      </View>
      <Box bg={t.risk('attention').soft} border={t.risk('attention').border} style={styles.plan}>
        <AppText size={15} weight="heavy" color={t.risk('attention').strong}>
          Plus · mensal
        </AppText>
        <AppText size={15} weight="heavy" color={t.risk('attention').strong}>
          Em breve
        </AppText>
      </Box>
      <AppText size={12} color={t.c.subtle}>
        Sem cobrança escondida. Você pode cancelar quando quiser e continuar no plano grátis.
      </AppText>
      {sent && (
        <Notice icon="⭐" tone="info">
          O plano Plus ainda não está disponível. Você continua com todas as funções grátis — nada foi cobrado.
        </Notice>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: 5 },
  input: { borderWidth: 2, borderRadius: 12, height: 52, paddingHorizontal: 14, fontFamily: FONT.regular },
  plan: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
