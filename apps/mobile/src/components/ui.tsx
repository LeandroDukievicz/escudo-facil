import type { RiskLevel } from '@escudo/core';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { tap } from '@/services/haptics';
import { useTheme } from '@/theme';
import { AppText } from './AppText';

/** Caixa com borda forte (padrão do wireframe). */
export function Box({ children, bg, border, dashed, style, radius = 14 }: { children: React.ReactNode; bg?: string; border?: string; dashed?: boolean; style?: ViewStyle; radius?: number }) {
  const t = useTheme();
  return (
    <View
      style={[
        { borderWidth: t.hc ? 3 : 2, borderRadius: radius, borderColor: border ?? t.c.ink, backgroundColor: t.hc ? t.c.bg : (bg ?? t.c.card), padding: 14, borderStyle: dashed ? 'dashed' : 'solid' },
        style,
      ]}
    >
      {children}
    </View>
  );
}

type NoticeTone = 'warning' | 'success' | 'info' | 'danger' | 'neutral';

/** Aviso com ícone (ex.: "O app não abre o link durante a análise."). */
export function Notice({ icon, children, tone = 'warning' }: { icon?: string; children: React.ReactNode; tone?: NoticeTone }) {
  const t = useTheme();
  const map: Record<NoticeTone, { bg: string; border: string; fg: string }> = {
    warning: { bg: t.risk('attention').soft, border: t.risk('attention').border, fg: t.hc ? t.c.title : '#7a5b00' },
    success: { bg: t.risk('low').soft, border: t.risk('low').border, fg: t.hc ? t.c.title : t.risk('low').strong },
    danger: { bg: t.risk('high').soft, border: t.risk('high').border, fg: t.hc ? t.c.title : t.risk('high').strong },
    info: { bg: t.c.primarySoft, border: t.c.primary, fg: t.c.title },
    neutral: { bg: t.c.surface, border: t.c.border, fg: t.c.subtle },
  };
  const v = map[tone];
  return (
    <View style={[styles.notice, { backgroundColor: v.bg, borderColor: t.hc ? t.c.ink : v.border }]}>
      {icon ? <AppText size={20}>{icon}</AppText> : null}
      <View style={styles.flex}>{typeof children === 'string' ? <AppText size={14} color={v.fg}>{children}</AppText> : children}</View>
    </View>
  );
}

/** Interruptor grande (52×30) com rótulo — nunca ícone sozinho. */
export function Toggle({ label, value, onChange, icon, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; icon?: string; hint?: string }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ checked: value }}
      onPress={() => {
        tap();
        onChange(!value);
      }}
      style={styles.toggleRow}
    >
      <AppText size={17} weight="semibold" color={t.c.title} style={styles.flex}>
        {icon ? `${icon} ` : ''}
        {label}
      </AppText>
      <View
        style={[
          styles.track,
          { backgroundColor: value ? (t.hc ? t.c.accent : t.risk('low').solid) : t.hc ? '#333' : '#cbd5e1', borderColor: t.c.ink, justifyContent: value ? 'flex-end' : 'flex-start' },
        ]}
      >
        <View style={[styles.knob, { backgroundColor: t.hc && value ? '#000' : '#fff' }]} />
      </View>
    </Pressable>
  );
}

export type BadgeKind = 'free' | 'plus' | 'login' | 'offline' | 'online' | 'ai';

const BADGE_LABEL: Record<BadgeKind, string> = {
  free: 'GRÁTIS',
  plus: 'PLUS',
  login: 'LOGIN',
  offline: 'OFFLINE',
  online: 'ONLINE',
  ai: 'IA',
};

export function Badge({ kind, label }: { kind: BadgeKind; label?: string }) {
  const t = useTheme();
  const map: Record<BadgeKind, [string, string, string]> = {
    free: ['#e8f6ee', '#1f9d57', '#a7ddbd'],
    plus: ['#fdf4dc', '#a87a00', '#e7d08a'],
    login: ['#fbe9e9', '#c0392b', '#e6b3ad'],
    offline: ['#eef1f4', '#6b7280', '#c7cfd9'],
    online: ['#e9f1fb', '#2563a8', '#a9c6e8'],
    ai: ['#efe9f7', '#6d4ea8', '#c8b6e2'],
  };
  const [bg, fg, border] = map[kind];
  return (
    <View style={[styles.badge, { backgroundColor: t.hc ? '#000' : bg, borderColor: t.hc ? '#fff' : border }]}>
      <AppText size={10} weight="heavy" color={t.hc ? t.c.accent : fg}>
        {label ?? BADGE_LABEL[kind]}
      </AppText>
    </View>
  );
}

export function Row({ children, gap = 8, style }: { children: React.ReactNode; gap?: number; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap, flexWrap: 'wrap' }, style]}>{children}</View>;
}

/** Barrinhas do semáforo. Decorativas: o nível sempre vem escrito. */
export function RiskMeter({ level }: { level: RiskLevel }) {
  const t = useTheme();
  const filled = level === 'high' ? 3 : level === 'attention' ? 2 : 1;
  const color = t.hc ? t.c.accent : t.risk(level).solid;
  return (
    <View style={styles.meter} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {[0, 1, 2].map((i) => (
        <View key={i} style={[styles.meterBar, { backgroundColor: i < filled ? color : t.hc ? '#333' : '#dfe5ec' }]} />
      ))}
    </View>
  );
}

/** Lista com marcador (✓, ⚠, ●, emoji). */
export function BulletList({ items, bullet, bulletColor, size = 14 }: { items: { key: string; text: string; bullet?: string }[]; bullet?: string; bulletColor?: string; size?: number }) {
  const t = useTheme();
  return (
    <View style={{ gap: 7 }}>
      {items.map((it) => (
        <View key={it.key} style={styles.bullet}>
          <AppText size={size} color={bulletColor ?? t.c.text}>
            {it.bullet ?? bullet ?? '•'}
          </AppText>
          <AppText size={size} style={styles.flex}>
            {it.text}
          </AppText>
        </View>
      ))}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  const t = useTheme();
  return (
    <AppText size={14} weight="heavy" color={t.c.title} accessibilityRole="header">
      {children}
    </AppText>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  notice: { flexDirection: 'row', gap: 10, alignItems: 'center', borderWidth: 2, borderRadius: 14, padding: 12 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52 },
  track: { width: 56, height: 32, borderRadius: 32, borderWidth: 2, paddingHorizontal: 3, flexDirection: 'row', alignItems: 'center' },
  knob: { width: 22, height: 22, borderRadius: 22 },
  badge: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  meter: { flexDirection: 'row', gap: 5 },
  meterBar: { width: 38, height: 10, borderRadius: 6 },
  bullet: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
});

export async function confirm(title: string, message: string, okLabel = 'Confirmar'): Promise<boolean> {
  const { Alert, Platform } = await import('react-native');
  if (Platform.OS === 'web') return typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`);
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
      { text: okLabel, style: 'destructive', onPress: () => resolve(true) },
    ], { cancelable: true, onDismiss: () => resolve(false) }),
  );
}
