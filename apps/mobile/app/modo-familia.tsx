import { router } from 'expo-router';
import { useState } from 'react';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Badge, Box, Notice, Row, Toggle } from '@/components/ui';
import { useTheme } from '@/theme';

/** B4 · Modo Família — alertas com consentimento dos dois (Plus + login). */
export default function FamilyMode() {
  const t = useTheme();
  const [alerts, setAlerts] = useState(true);
  const [report, setReport] = useState(false);
  return (
    <Screen back title="Modo Família 👨‍👩‍👧" footer={<Button label="Entrar / Criar conta" onPress={() => router.push('/assinar')} />}>
      <Row>
        <Badge kind="plus" />
        <Badge kind="login" />
        <Badge kind="online" />
      </Row>
      <Box bg={t.c.primarySoft} border={t.hc ? t.c.ink : t.c.primary}>
        <AppText size={15} color={t.c.title} lh={1.4}>
          Um familiar de confiança pode receber um alerta quando você marcar algo como{' '}
          <AppText size={15} weight="heavy" color={t.c.title}>
            muito suspeito
          </AppText>
          .
        </AppText>
      </Box>
      <Notice icon="✋">
        <AppText size={14} color={t.hc ? t.c.title : '#7a5b00'}>
          Só funciona com{' '}
          <AppText size={14} weight="heavy" color={t.hc ? t.c.title : '#7a5b00'}>
            consentimento dos dois
          </AppText>
          . O familiar precisa aceitar o convite.
        </AppText>
      </Notice>
      <Toggle label='Avisar quando eu marcar "muito suspeito"' value={alerts} onChange={setAlerts} />
      <Toggle label="Relatório mensal para a família" value={report} onChange={setReport} />
      <AppText size={13} color={t.c.subtle}>
        O familiar só vê o que você escolher compartilhar. Você pode desligar a qualquer momento.
      </AppText>
    </Screen>
  );
}
