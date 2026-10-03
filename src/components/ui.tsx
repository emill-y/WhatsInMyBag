import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Heart } from 'lucide-react-native';
import { colors, margin, maxWidth, radius, space } from '../theme/tokens';
import { fonts, type } from '../theme/typography';
import { Product } from '../data/types';
import { useStore } from '../store';
import { Photo } from './Photo';

export function Screen({ children, scroll = true, style, top = true }: { children: React.ReactNode; scroll?: boolean; style?: ViewStyle; top?: boolean }) {
  const insets = useSafeAreaInsets();
  const inner = <View style={[styles.column, { paddingTop: top ? insets.top + space(2) : 0 }, style]}>{children}</View>;
  return (
    <View style={styles.page}>
      {scroll ? <ScrollView contentContainerStyle={{ paddingBottom: space(8) }} showsVerticalScrollIndicator={false}>{inner}</ScrollView> : inner}
    </View>
  );
}

/** Full-bleed block that escapes the 24pt column margins. */
export function Bleed({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ marginHorizontal: -margin }, style]}>{children}</View>;
}

export function Wordmark({ size = 24 }: { size?: number }) {
  return <Text accessibilityRole="header" style={[type.h2, { fontSize: size, lineHeight: size * 1.2, textAlign: 'center', letterSpacing: 0.3 }]}>What’s In My Bag</Text>;
}

export function Eyebrow({ children, color = colors.goldDeep, style }: { children: React.ReactNode; color?: string; style?: TextStyle }) {
  return <Text style={[type.small, { color, letterSpacing: 0.4 }, style]}>{children}</Text>;
}

export function PillChip({ label, active, onPress, style, onPhoto }: { label: string; active?: boolean; onPress?: () => void; style?: ViewStyle; onPhoto?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!active }} onPress={onPress}
      style={({ pressed }) => [styles.chip, onPhoto && { backgroundColor: colors.veil, borderColor: 'transparent' }, active && { backgroundColor: colors.ink, borderColor: colors.ink }, pressed && { opacity: 0.7 }, style]}>
      <Text style={[type.small, { color: active ? colors.paper : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin, flexGrow: 0 }}
      contentContainerStyle={{ paddingHorizontal: margin, gap: space(1) }}>{children}</ScrollView>
  );
}

export function PrimaryButton({ label, onPress, style, small }: { label: string; onPress?: () => void; style?: ViewStyle; small?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.btn, small && styles.btnSmall, { backgroundColor: colors.ink, opacity: pressed ? 0.8 : 1 }, style]}>
      <Text style={[styles.btnText, small && { fontSize: 13 }, { color: colors.paper }]}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, style, small, onPhoto }: { label: string; onPress?: () => void; style?: ViewStyle; small?: boolean; onPhoto?: boolean }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.btn, small && styles.btnSmall, { borderWidth: 1, borderColor: colors.ink, opacity: pressed ? 0.6 : 1 }, onPhoto && { backgroundColor: colors.veil, borderColor: 'transparent' }, style]}>
      <Text style={[styles.btnText, small && { fontSize: 13 }]}>{label}</Text>
    </Pressable>
  );
}

export function TextLink({ label, onPress, style }: { label: string; onPress?: () => void; style?: TextStyle }) {
  return <Text accessibilityRole="link" onPress={onPress} style={[type.small, { textDecorationLine: 'underline' }, style]}>{label}</Text>;
}

export function SectionHeader({ title, eyebrow, action, onAction }: { title: string; eyebrow?: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Eyebrow style={{ marginBottom: 2 }}>{eyebrow}</Eyebrow> : null}
        <Text style={type.h2}>{title}</Text>
      </View>
      {action ? <TextLink label={action} onPress={onAction} style={{ color: colors.stone, marginBottom: 4 }} /> : null}
    </View>
  );
}

export function GoldRule({ width = 32, style }: { width?: number; style?: ViewStyle }) {
  return <View style={[{ width, height: 1, backgroundColor: colors.gold }, style]} />;
}

export function Hairline({ style }: { style?: ViewStyle }) {
  return <View style={[{ height: 1, backgroundColor: colors.line }, style]} />;
}

export function Avatar({ id, name, size = 32 }: { id?: string; name: string; size?: number }) {
  if (!id) return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serif, color: colors.paper, fontSize: size * 0.45 }}>{name[0]}</Text>
    </View>
  );
  return <Photo id={id} width={160} style={{ width: size, height: size, borderRadius: size / 2 }} label={name[0]} fallbackSize={size * 0.4} />;
}

/** Translucent pill for labels sitting on a photo. */
export function PhotoTag({ label, tone = 'veil', style }: { label: string; tone?: 'veil' | 'ink' | 'gold'; style?: ViewStyle }) {
  const bg = tone === 'ink' ? colors.ink : tone === 'gold' ? colors.gold : colors.veil;
  const fg = tone === 'veil' ? colors.ink : colors.paper;
  return (
    <View style={[{ backgroundColor: bg, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }, style]}>
      <Text style={{ fontFamily: fonts.sansMedium, fontSize: 11, lineHeight: 14, color: fg }}>{label}</Text>
    </View>
  );
}

/** Thin gold level line: how much is left. */
export function LevelBar({ fraction, style }: { fraction: number; style?: ViewStyle }) {
  return (
    <View style={[{ height: 2, backgroundColor: colors.line }, style]}>
      <View style={{ height: 2, width: `${Math.round(Math.max(0, Math.min(1, fraction)) * 100)}%`, backgroundColor: fraction < 0.2 ? colors.ink : colors.gold }} />
    </View>
  );
}

export function ProductTile({ product, why, onPress, width, aspect = 4 / 5 }: { product: Product; why?: string; onPress?: () => void; width?: number | `${number}%`; aspect?: number }) {
  const wish = useStore((s) => s.wishlist.includes(product.id));
  const toggleWish = useStore((s) => s.toggleWish);
  return (
    <Pressable onPress={onPress} accessibilityLabel={`${product.brand} ${product.name}, $${product.price}`} style={{ width }}>
      <Photo id={product.photo} width={600} label={product.name} style={{ aspectRatio: aspect, borderRadius: radius.photo }}>
        <Pressable accessibilityLabel={wish ? 'Remove from wishlist' : 'Save to wishlist'} hitSlop={10} onPress={() => toggleWish(product.id)} style={styles.heart}>
          <Heart size={16} strokeWidth={1.5} color={colors.ink} fill={wish ? colors.ink : 'transparent'} />
        </Pressable>
        {product.sponsored ? <PhotoTag label="Sponsored" style={{ position: 'absolute', left: 10, top: 10 }} /> : null}
        {!product.inStock ? <PhotoTag label="Out of stock" tone="ink" style={{ position: 'absolute', left: 10, bottom: 10 }} /> : null}
      </Photo>
      <Text style={[type.smallStone, { marginTop: 10 }]} numberOfLines={1}>{product.brand}</Text>
      <Text style={[type.body, { fontSize: 16, lineHeight: 21 }]} numberOfLines={2}>{product.name}</Text>
      <Text style={[type.price, { marginTop: 2 }]}>${product.price}</Text>
      {why ? <Text style={[type.italic, { fontSize: 15, lineHeight: 20, color: colors.stone, marginTop: 4 }]}>{why}</Text> : null}
    </Pressable>
  );
}

/** Thin gold arc gauge. fraction 0..1 */
export function DaysLeftGauge({ fraction, days, size = 168 }: { fraction: number; days: number; size?: number }) {
  const r = size / 2 - 6, c = size / 2;
  const start = Math.PI * 0.75, sweep = Math.PI * 1.5;
  const pt = (a: number) => `${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`;
  const arc = (f: number) => {
    const end = start + sweep * Math.max(0.001, Math.min(1, f));
    return `M ${pt(start)} A ${r} ${r} 0 ${sweep * f > Math.PI ? 1 : 0} 1 ${pt(end)}`;
  };
  const label = !isFinite(days) ? '∞' : days <= 0 ? 'Out' : String(days);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={isFinite(days) ? `${days} days left` : 'Does not run out'}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path d={arc(1)} stroke={colors.line} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {days > 0 && isFinite(days) ? <Path d={arc(fraction)} stroke={colors.gold} strokeWidth={2.5} fill="none" strokeLinecap="round" /> : null}
      </Svg>
      <Text style={[type.display, { fontSize: 48, lineHeight: 54 }]}>{label}</Text>
      <Text style={type.secondary}>{!isFinite(days) ? 'keeps going' : days <= 0 ? 'of stock' : 'days left'}</Text>
    </View>
  );
}

export function Toast() {
  const msg = useStore((s) => s.toast);
  const insets = useSafeAreaInsets();
  if (!msg) return null;
  return (
    <View pointerEvents="none" style={[styles.toast, { bottom: insets.bottom + 76 }]}>
      <Text style={[type.small, { color: colors.paper }]}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  column: { width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: margin },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.paper },
  btn: { borderRadius: radius.pill, paddingHorizontal: 28, minHeight: 50, alignItems: 'center', justifyContent: 'center' },
  btnSmall: { minHeight: 36, paddingHorizontal: 16 },
  btnText: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: space(6), marginBottom: space(2) },
  heart: { position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.veil, alignItems: 'center', justifyContent: 'center' },
  toast: { position: 'absolute', alignSelf: 'center', backgroundColor: colors.ink, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 12 },
});
