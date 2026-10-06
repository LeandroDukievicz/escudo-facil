import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { BulletList, Notice } from '@/components/ui';

/** Denunciar / Orientações. */
export default function Report() {
  return (
    <Screen
      back
      title="Denunciar e se proteger"
      icon="📣"
      footer={
        <>
          <Button variant="danger" label="Acho que caí em golpe" onPress={() => router.push('/emergencia')} />
          <Button variant="secondary" label="Voltar" onPress={() => router.back()} />
        </>
      }
    >
      <AppText size={16}>Denunciar ajuda a proteger outras pessoas. Você pode:</AppText>
      <BulletList
        size={16}
        items={[
          { key: '1', bullet: '🚩', text: 'No WhatsApp: toque no nome do contato → "Denunciar" e "Bloquear".' },
          { key: '2', bullet: '🏦', text: 'Se usaram o nome de um banco ou loja, avise a empresa pelo canal oficial.' },
          { key: '3', bullet: '🌐', text: 'Denuncie sites falsos na SaferNet Brasil (denuncie.org.br).' },
          { key: '4', bullet: '🚓', text: 'Se você perdeu dinheiro ou dados, registre um boletim de ocorrência (pode ser pela delegacia virtual).' },
        ]}
      />
      <Notice icon="📸" tone="info">
        Antes de apagar a conversa, tire prints. Eles servem de prova.
      </Notice>
    </Screen>
  );
}
