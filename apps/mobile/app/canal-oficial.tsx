import { router } from 'expo-router';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { BulletList, Notice } from '@/components/ui';

/** Como confirmar pelo canal oficial (botão "Confirmar canal oficial"). */
export default function OfficialChannel() {
  return (
    <Screen back title="Confirmar canal oficial" icon="🏛️" footer={<Button label="Entendi" onPress={() => router.back()} />}>
      <AppText size={16}>Antes de informar dados, fazer login ou pagar, confirme por um caminho que você já conhece:</AppText>
      <BulletList
        size={16}
        items={[
          { key: '1', bullet: '📱', text: 'Abra o app oficial do banco ou da loja que você já tem instalado — não pelo link recebido.' },
          { key: '2', bullet: '💳', text: 'Ligue para o número que está atrás do seu cartão.' },
          { key: '3', bullet: '⌨️', text: 'Digite você mesmo o endereço do site (ex.: o nome do banco + .com.br).' },
          { key: '4', bullet: '🏛️', text: 'Para governo, use o app gov.br ou o site que termina em .gov.br.' },
          { key: '5', bullet: '👨‍👩‍👧', text: 'Na dúvida, peça para alguém de confiança conferir com você.' },
        ]}
      />
      <Notice icon="⚠️">Nenhum banco pede senha, código ou Pix por mensagem.</Notice>
    </Screen>
  );
}
