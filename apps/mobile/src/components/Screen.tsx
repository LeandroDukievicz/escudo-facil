import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

interface Props {
  title?: string;
  icon?: string;
  /** Mostra "‹ Voltar". */
  back?: boolean;
  /** Ação à direita do cabeçalho (ex.: botão de voz 🔊). */
  right?: React.ReactNode;
  /** Botões fixos no rodapé (padrão do wireframe). */
  footer?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
  bg?: string;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom')[];
}

export function BackButton({ color }: { color?: string }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      hitSlop={12}
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      style={styles.back}
    >
      <AppText size={26} weight="bold" color={color ?? (t.hc ? t.c.accent : t.c.primary)}>
        ‹
      </AppText>
    </Pressable>
  );
}

export function Screen({ title, icon, back, right, footer, children, scroll = true, bg, contentStyle, edges = ['top', 'bottom'] }: Props) {
  const t = useTheme();
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg ?? t.c.bg }]} edges={edges}>
      {(title || back || right) && (
        <View style={styles.header}>
          {back ? <BackButton /> : null}
          {title ? (
            <AppText size={19} weight="heavy" color={t.c.title} accessibilityRole="header" style={styles.title}>
              {icon ? `${icon} ` : ''}
              {title}
            </AppText>
          ) : (
            <View style={styles.title} />
          )}
          {right}
        </View>
      )}
      <Body
        style={styles.body}
        {...(scroll
          ? { contentContainerStyle: [styles.content, contentStyle], keyboardShouldPersistTaps: 'handled' as const }
          : { style: [styles.body, styles.content, contentStyle] })}
      >
        {children}
      </Body>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 8, minHeight: 56 },
  back: { minWidth: 32, minHeight: 44, justifyContent: 'center' },
  title: { flex: 1 },
  body: { flex: 1 },
  content: { paddingHorizontal: 22, paddingBottom: 20, gap: 14 },
  footer: { paddingHorizontal: 18, paddingBottom: 18, paddingTop: 10, gap: 9 },
});
