import { router } from 'expo-router';
import { AccessibilitySettings } from '@/components/AccessibilitySettings';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { useSettings } from '@/state/settings';
import { Dots } from '@/components/Dots';

/** A3 · "Como você prefere usar" — texto grande, contraste e voz. */
export default function OnboardingA11y() {
  const { update } = useSettings();
  return (
    <Screen
      back
      title="Como você prefere usar"
      icon="⚙️"
      footer={
        <>
          <Button
            label="Salvar e continuar"
            onPress={() => {
              update({ onboarded: true });
              router.replace('/(tabs)');
            }}
          />
          <Dots active={2} />
        </>
      }
    >
      <AccessibilitySettings />
    </Screen>
  );
}
