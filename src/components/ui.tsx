import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';
import { Heart } from 'lucide-react-native';
import { colors, margin, maxWidth, radius, space } from '../theme/tokens';
import { fonts, type } from '../theme/typography';
import { Product } from '../data/types';
import { ProductArt } from './ProductArt';
import { useStore } from '../store';

export function Screen({ children, scroll = true, style }: { children: React.ReactNode; scroll?: boolean; style?: ViewStyle }) {
  const insets = useSafeAreaInsets();
  const inner = <View style={[styles.column, { paddingTop: insets.top + space(2) }, style]}>{children}</View>;
  return (
    <View style={styles.page}>
      {scroll ? <ScrollView contentContainerStyle={{ paddingBottom: space(6) }} showsVerticalScrollIndicator={false}>{inner}</ScrollView> : inner}
    </View>
  );
}

export function Wordmark({ size = 26 }: { size?: number }) {
  return <Text accessibilityRole="header" style={[type.h2, { fontSize: size, lineHeight: size * 1.2, textAlign: 'center', letterSpacing: 0.2 }]}>What’s In My Bag</Text>;
}

export function PillChip({ label, active, onPress, style }: { label: string; active?: boolean; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!active }} onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.ink, borderColor: colors.ink }, style]}>
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

export function PrimaryButton({ label, onPress, style }: { label: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.btn, { backgroundColor: colors.ink, opacity: pressed ? 0.8 : 1 }, style]}>
      <Text style={[styles.btnText, { color: colors.paper }]}>{label}</Text>
    </Pressable>
  );
}

export function OutlineButton({ label, onPress, style }: { label: string; onPress?: () => void; style?: ViewStyle }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.btn, { borderWidth: 1, borderColor: colors.ink, opacity: pressed ? 0.6 : 1 }, style]}>
      <Text style={styles.btnText}>{label}</Text>
    </Pressable>
  );
}

export function TextLink({ label, onPress, style }: { label: string; onPress?: () => void; style?: TextStyle }) {
  return <Text accessibilityRole="link" onPress={onPress} style={[type.small, { textDecorationLine: 'underline' }, style]}>{label}</Text>;
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={type.h3}>{title}</Text>
      {action ? <TextLink label={action} onPress={onAction} style={{ color: colors.stone }} /> : null}
    </View>
  );
}

export function Hairline({ style }: { style?: ViewStyle }) {
  return <View style={[{ height: 1, backgroundColor: colors.line }, style]} />;
}

export function ProductTile({ product, why, onPress, width, compact }: { product: Product; why?: string; onPress?: () => void; width?: number | `${number}%`; compact?: boolean }) {
  const wish = useStore((s) => s.wishlist.includes(product.id));
  const toggleWish = useStore((s) => s.toggleWish);
  return (
    <Pressable onPress={onPress} accessibilityLabel={`${product.brand} ${product.name}, $${product.price}`} style={{ width }}>
      <View style={[styles.tile, compact && { aspectRatio: 1 }]}>
        <ProductArt shape={product.image} id={product.id} size={compact ? 64 : 88} />
        <Pressable accessibilityLabel={wish ? 'Remove from wishlist' : 'Add to wishlist'} hitSlop={10} onPress={() => toggleWish(product.id)} style={styles.heart}>
          <Heart size={18} strokeWidth={1.25} color={colors.ink} fill={wish ? colors.ink : 'transparent'} />
        </Pressable>
      </View>
      <Text style={[type.body, { marginTop: space(1), fontSize: 16, lineHeight: 21 }]} numberOfLines={2}>{product.name}</Text>
      <Text style={type.smallStone} numberOfLines={1}>{product.brand}</Text>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 }}>
        <Text style={type.price}>${product.price}</Text>
        {product.sponsored ? <Text style={[type.smallStone, { fontSize: 11 }]}>Sponsored</Text> : null}
        {!product.inStock ? <Text style={[type.small, { fontSize: 11 }]}>Out of stock</Text> : null}
      </View>
      {why ? <Text style={[type.italic, { fontSize: 15, lineHeight: 20, color: colors.stone, marginTop: 4 }]}>{why}</Text> : null}
    </Pressable>
  );
}

/** Thin gold arc gauge. fraction 0..1 */
export function DaysLeftGauge({ fraction, days, size = 160 }: { fraction: number; days: number; size?: number }) {
  const r = size / 2 - 6, c = size / 2;
  const start = Math.PI * 0.75, sweep = Math.PI * 1.5;
  const pt = (a: number) => `${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`;
  const arc = (f: number) => {
    const end = start + sweep * Math.max(0.001, Math.min(1, f));
    return `M ${pt(start)} A ${r} ${r} 0 ${sweep * f > Math.PI ? 1 : 0} 1 ${pt(end)}`;
  };
  const label = !isFinite(days) ? 'Keeps' : days <= 0 ? 'Out' : String(days);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={isFinite(days) ? `${days} days left` : 'Does not run out'}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Path d={arc(1)} stroke={colors.line} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        {days > 0 ? <Path d={arc(fraction)} stroke={colors.gold} strokeWidth={2} fill="none" strokeLinecap="round" /> : null}
      </Svg>
      <Text style={[type.display, { fontSize: 44, lineHeight: 50 }]}>{label}</Text>
      <Text style={type.secondary}>{!isFinite(days) ? 'no refill needed' : days <= 0 ? 'of stock' : 'days left'}</Text>
    </View>
  );
}

export function RingGauge({ fraction, size = 14 }: { fraction: number; size?: number }) {
  const r = size / 2 - 1.5, len = 2 * Math.PI * r;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.line} strokeWidth={1.5} fill="none" />
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.gold} strokeWidth={1.5} fill="none"
        strokeDasharray={`${len * fraction} ${len}`} rotation={-90} origin={`${size / 2}, ${size / 2}`} />
    </Svg>
  );
}

export function Toast() {
  const msg = useStore((s) => s.toast);
  const insets = useSafeAreaInsets();
  if (!msg) return null;
  return (
    <View pointerEvents="none" style={[styles.toast, { bottom: insets.bottom + 72 }]}>
      <Text style={[type.small, { color: colors.paper }]}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  column: { width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal: margin },
  chip: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.paper },
  btn: { borderRadius: radius.pill, paddingHorizontal: 28, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.ink },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: space(5), marginBottom: space(2) },
  tile: { backgroundColor: colors.porcelain, borderRadius: radius.card, aspectRatio: 4 / 5, alignItems: 'center', justifyContent: 'center' },
  heart: { position: 'absolute', top: 10, right: 10 },
  toast: { position: 'absolute', alignSelf: 'center', backgroundColor: colors.ink, borderRadius: radius.pill, paddingHorizontal: 20, paddingVertical: 10 },
});
