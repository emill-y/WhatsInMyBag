import { useMemo, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, maxWidth, radius } from '../src/theme/tokens';
import { fonts } from '../src/theme/typography';
import { FeedPage, Card } from '../src/components/FeedPage';
import { FloatingBack } from '../src/components/BackBar';
import { products } from '../src/data/products';
import { Product } from '../src/data/types';
import { useStore } from '../src/store';

function editFor(p: Product) {
  if (p.tags.includes('joy') && p.price < 25) return 'Little joys under $25';
  if (p.bagTypes.includes('travel') && p.bagFit === 'mini') return 'Travel-size heroes';
  if (p.bagTypes.includes('mom')) return 'Mom-tested';
  if (p.bagTypes.includes('makeup')) return 'Beauty refills';
  return p.category;
}

/** Full-screen product feed: swipe up through picks for your bags. */
export default function ShopFeed() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth);
  const [h, setH] = useState(0);
  const { items, bags, user } = useStore();
  const feed = useMemo<Card[]>(() => {
    const owned = new Set(items.map((i) => i.productId));
    const mine = new Set(bags.map((b) => b.type));
    return products
      .filter((p) => !owned.has(p.id) && !p.ingredients.some((x) => user.avoidIngredients.includes(x)))
      .sort((a, b) => Number(b.bagTypes.some((t) => mine.has(t))) - Number(a.bagTypes.some((t) => mine.has(t))))
      .map((product) => ({ kind: 'product', product, edit: editFor(product) }));
  }, [items, bags, user]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.ink }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      {h ? (
        <ScrollView pagingEnabled snapToInterval={h} decelerationRate="fast" showsVerticalScrollIndicator={false} style={{ width: w, alignSelf: 'center' }}>
          {feed.map((c) => <FeedPage key={c.kind === 'product' ? c.product.id : c.post.id} card={c} height={h} width={w} />)}
        </ScrollView>
      ) : null}
      <View style={{ position: 'absolute', top: insets.top + 14, alignSelf: 'center', backgroundColor: colors.veil, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 }}>
        <Text style={{ fontFamily: fonts.sansMedium, fontSize: 13 }}>Today’s picks</Text>
      </View>
      <FloatingBack />
    </View>
  );
}
