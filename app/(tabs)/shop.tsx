import { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Heart, Play } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PillChip, ChipRow, PhotoTag, Eyebrow, SectionHeader } from '../../src/components/ui';
import { Photo } from '../../src/components/Photo';
import { CATEGORY_ORDER, products } from '../../src/data/products';
import { Product } from '../../src/data/types';
import { useStore } from '../../src/store';

const ASPECTS = [3 / 4, 1, 4 / 5, 2 / 3];

/** The shop: real products, ordered by kind of thing, plus a swipe feed of picks. */
export default function Shop() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { user, wishlist } = useStore();
  const [filter, setFilter] = useState<string>('All');
  const allowed = products.filter((p) => !p.ingredients.some((x) => user.avoidIngredients.includes(x)));
  const cats = CATEGORY_ORDER.filter((c) => allowed.some((p) => p.category === c));
  const sections = filter === 'Saved'
    ? [{ title: 'Saved', items: allowed.filter((p) => wishlist.includes(p.id)) }]
    : cats.filter((c) => filter === 'All' || c === filter).map((c) => ({ title: c, items: allowed.filter((p) => p.category === c) }));
  const colW = (w - 12) / 2;

  return (
    <Screen>
      <Eyebrow>Picked for your bags</Eyebrow>
      <Text accessibilityRole="header" style={[type.display, { marginTop: 4 }]}>The shop</Text>
      <Text style={[type.secondary, { marginTop: 8 }]}>Refills, replacements and little joys. Every item links to a real store.</Text>

      <Pressable onPress={() => router.push('/shop-feed')}
        style={{ marginTop: 20, backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
          <Play size={18} strokeWidth={1.5} color={colors.paper} fill={colors.paper} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.h3}>Scroll today’s picks</Text>
          <Text style={type.smallStone}>Swipe up, double tap to save, add to bag in one tap.</Text>
        </View>
      </Pressable>

      <View style={{ marginTop: 20 }}>
        <ChipRow>
          {['All', ...cats, 'Saved'].map((c) => <PillChip key={c} label={c} active={filter === c} onPress={() => setFilter(c)} />)}
        </ChipRow>
      </View>

      {sections.map((s) => {
        const cols: Product[][] = [[], []];
        s.items.forEach((p, i) => cols[i % 2].push(p));
        return (
          <View key={s.title}>
            <SectionHeader eyebrow={`${s.items.length} ${s.items.length === 1 ? 'item' : 'items'}`} title={s.title} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {cols.map((col, c) => (
                <View key={c} style={{ flex: 1, gap: 24 }}>
                  {col.map((p, i) => <ProductCard key={p.id} p={p} width={colW} aspect={ASPECTS[(i * 2 + c) % ASPECTS.length]} />)}
                </View>
              ))}
            </View>
          </View>
        );
      })}
      {filter === 'Saved' && !sections[0].items.length ? <Text style={[type.italic, { color: colors.stone, marginTop: 24 }]}>Tap the heart on anything to keep it here.</Text> : null}
    </Screen>
  );
}

function ProductCard({ p, width, aspect }: { p: Product; width: number; aspect: number }) {
  const wish = useStore((s) => s.wishlist.includes(p.id));
  const toggleWish = useStore((s) => s.toggleWish);
  return (
    <Pressable onPress={() => router.push(`/product/${p.id}`)} style={{ width }} accessibilityLabel={`${p.name}, $${p.price}`}>
      <Photo id={p.photo} width={700} label={p.name} style={{ width, aspectRatio: aspect, borderRadius: radius.photo }}>
        <PhotoTag label={`$${p.price}`} style={{ position: 'absolute', left: 8, bottom: 8 }} />
        {p.sponsored ? <PhotoTag label="Sponsored" style={{ position: 'absolute', left: 8, top: 8 }} /> : null}
        {!p.inStock ? <PhotoTag label="Out of stock" tone="ink" style={{ position: 'absolute', left: 8, top: 8 }} /> : null}
      </Photo>
      <Text style={[type.body, { fontSize: 16, lineHeight: 21, marginTop: 8 }]} numberOfLines={3}>{p.name}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
        <Text style={[type.small, { flex: 1 }]} numberOfLines={1}>{p.brand}</Text>
        <Pressable hitSlop={8} accessibilityLabel={wish ? 'Saved' : 'Save'} onPress={() => toggleWish(p.id)}>
          <Heart size={14} strokeWidth={1.5} color={colors.ink} fill={wish ? colors.ink : 'transparent'} />
        </Pressable>
      </View>
    </Pressable>
  );
}
