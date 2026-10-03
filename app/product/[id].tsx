import { Linking, Text, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, OutlineButton, PillChip, Bleed, Eyebrow, SectionHeader, ProductTile, PhotoTag } from '../../src/components/ui';
import { FloatingBack } from '../../src/components/BackBar';
import { Photo } from '../../src/components/Photo';
import { productById, products } from '../../src/data/products';
import { useStore } from '../../src/store';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth);
  const p = productById(id);
  const { addWant, toggleWish, posts } = useStore();
  const wish = useStore((s) => s.wishlist.includes(id));
  const inPosts = posts.filter((x) => x.productIds.includes(id)).length;
  const related = products.filter((x) => x.id !== p.id && (x.category === p.category || x.tags.some((t) => p.tags.includes(t)))).slice(0, 4);
  return (
    <View style={{ flex: 1 }}>
      <Screen top={false}>
        <Bleed>
          <Photo id={p.photo} width={1200} label={p.name} fallbackSize={24} style={{ height: w * 1.15 }}>
            {p.sponsored ? <PhotoTag label="Sponsored" style={{ position: 'absolute', right: 16, bottom: 16 }} /> : null}
          </Photo>
        </Bleed>
        <Eyebrow style={{ marginTop: 24 }}>{p.brand}</Eyebrow>
        <Text style={[type.h1, { marginTop: 4 }]}>{p.name}</Text>
        <Text style={[type.price, { fontSize: 17, marginTop: 8 }]}>${p.price} <Text style={type.smallStone}> · {p.sizeAmount} {p.unit}</Text></Text>
        {p.blurb ? <Text style={[type.body, { marginTop: 12 }]}>{p.blurb}</Text> : null}
        {inPosts ? <Text style={[type.italic, { color: colors.stone, marginTop: 12 }]}>In {inPosts} bags shared by the community.</Text> : null}
        {p.values.length ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {p.values.map((v) => <PillChip key={v} label={v} />)}
          </View>
        ) : null}
        <View style={{ gap: 12, marginTop: 28 }}>
          <PrimaryButton label={p.inStock ? 'Shop' : 'Out of stock'} onPress={() => p.inStock && Linking.openURL(p.retailerUrl)} />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <OutlineButton label="Add to bag" style={{ flex: 1 }} onPress={() => addWant(p.id)} />
            <OutlineButton label={wish ? 'Saved' : 'Save'} style={{ flex: 1 }} onPress={() => toggleWish(p.id)} />
          </View>
        </View>
        {related.length ? (
          <>
            <SectionHeader eyebrow="You might also like" title="Goes well with" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 24 }}>
              {related.map((r) => <ProductTile key={r.id} product={r} width={(w - 48 - 12) / 2} onPress={() => router.push(`/product/${r.id}`)} />)}
            </View>
          </>
        ) : null}
      </Screen>
      <FloatingBack />
    </View>
  );
}
