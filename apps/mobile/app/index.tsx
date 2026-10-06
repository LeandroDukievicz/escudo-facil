import { Redirect } from 'expo-router';
import { useSettings } from '@/state/settings';

/** Primeira abertura → onboarding sem cadastro. Depois, direto para a Home. */
export default function Index() {
  const { settings } = useSettings();
  return <Redirect href={settings.onboarded ? '/(tabs)' : '/onboarding'} />;
}
