import { LEVEL_COPY, type RiskLevel } from '@escudo/core';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme';
import { AppText } from './AppText';
import { RiskMeter } from './ui';

/** Cabeçalho do semáforo: ícone grande + título + barrinhas (cor + ícone + texto). */
export function RiskHeader({ level, title, subtitle, compact }: { level: RiskLevel; title?: string; subtitle?: string; compact?: boolean }) {
  const t = useTheme();
  const r = t.risk(level);
  const copy = LEVEL_COPY[level];
  const heading = title ?? copy.title;
  return (
    <View
      accessible
      accessibilityRole="header"
      accessibilityLabel={`Resultado: ${heading}. Nível: ${copy.short}.${subtitle ? ` ${subtitle}` : ''}`}
      style={[
        compact ? styles.compact : styles.full,
        { backgroundColor: r.soft, borderBottomColor: t.hc ? t.c.ink : r.border, borderBottomWidth: t.hc ? 3 : 2 },
      ]}
    >
      <View style={[compact ? styles.iconSm : styles.icon, { backgroundColor: r.solid, borderColor: t.c.ink }]}>
        <AppText size={compact ? 26 : 38} color="#fff" weight="heavy">
          {copy.icon}
        </AppText>
      </View>
      <View style={compact ? styles.flex : styles.centerText}>
        <AppText size={compact ? 18 : 21} weight="heavy" color={r.strong} align={compact ? 'left' : 'center'} lh={1.15}>
          {heading}
        </AppText>
        {subtitle ? (
          <AppText size={13} weight="bold" color={r.strong} align={compact ? 'left' : 'center'}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {!compact && <RiskMeter level={level} />}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { paddingHorizontal: 22, paddingVertical: 20, alignItems: 'center', gap: 8 },
  compact: { paddingHorizontal: 22, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 76, height: 76, borderRadius: 76, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  iconSm: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  centerText: { alignItems: 'center', gap: 4 },
  flex: { flex: 1 },
});
