import { useState } from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { margin, maxWidth } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PillChip, ChipRow, ProductTile, SectionHeader } from '../../src/components/ui';
import { products } from '../../src/data/products';
import { useStore } from '../../src/store';
import { Product } from '../../src/data/types';

const FILTERS = ['All', 'Beauty', 'Baby', 'Snacks', 'Travel', 'Wishlist'];
const beauty = ['Lips', 'Eyes', 'Face', 'Cheeks', 'Fragrance', 'Care'];

export default function Shop() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const [f, setF] = useState('All');
  const { wishlist, items, user } = useStore();
  const owned = new Set(items.map((i) => i.productId));
  const ok = (p: Product) => !p.ingredients.some((x) => user.avoidIngredients.includes(x));
  const match = (p: Product) =>
    f === 'All' ? true : f === 'Beauty' ? beauty.includes(p.category) : f === 'Wishlist' ? wishlist.includes(p.id)
      : f === 'Travel' ? p.tags.includes('travel') : p.category === f;
  const pool = products.filter((p) => ok(p) && match(p) && (f === 'Wishlist' || !owned.has(p.id)));

  const edits: [string, Product[]][] = f === 'All'
    ? [
      ['Little joys under $25', pool.filter((p) => p.price < 25 && (p.tags.includes('joy') || p.category === 'Accessories'))],
      ['Travel-size heroes', pool.filter((p) => p.tags.includes('travel') && p.bagFit === 'mini')],
      ['Mom-tested', pool.filter((p) => p.tags.includes('baby') || p.tags.includes('kids'))],
      ['Refills and new favorites', pool.filter((p) => ['Lips', 'Eyes', 'Face', 'Cheeks'].includes(p.category))],
    ]
    : [[f === 'Wishlist' ? 'Your wishlist' : f, pool]];

  return (
    <Screen>
      <Text accessibilityRole="header" style={type.h1}>Joy shop</Text>
      <Text style={[type.secondary, { marginBottom: 16 }]}>Refills and small things, picked for your bags.</Text>
      <ChipRow>{FILTERS.map((x) => <PillChip key={x} label={x} active={f === x} onPress={() => setF(x)} />)}</ChipRow>
      {edits.filter(([, ps]) => ps.length).map(([title, ps]) => (
        <View key={title}>
          <SectionHeader title={title} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 24 }}>
            {ps.map((p) => <ProductTile key={p.id} product={p} width={(w - 16) / 2} onPress={() => router.push(`/product/${p.id}`)} />)}
          </View>
        </View>
      ))}
      {f === 'Wishlist' && !pool.length ? <Text style={[type.secondary, { marginTop: 24 }]}>Tap the heart on anything to keep it here.</Text> : null}
    </Screen>
  );
}
