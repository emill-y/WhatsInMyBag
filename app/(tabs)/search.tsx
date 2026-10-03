import { useMemo, useState } from 'react';
import { Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Search as SearchIcon } from 'lucide-react-native';
import { colors, margin, maxWidth } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PillChip, ChipRow, ProductTile, TextLink } from '../../src/components/ui';
import { useStore } from '../../src/store';
import { products } from '../../src/data/products';
import { bags } from '../../src/data/user';
import { search } from '../../src/logic/search';

const SUGGEST = ['vegan snack', 'travel', 'lips', 'baby spf'];

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { items, user, addWant } = useStore();
  const [q, setQ] = useState('');
  const [bagId, setBagId] = useState<string | undefined>();
  const [under25, setUnder25] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [valuesOnly, setValuesOnly] = useState(false);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    let r = search(q, products, items, bags, user, { bagId, inStockOnly: inStock, maxPrice: under25 ? 25 : undefined });
    if (valuesOnly) r = r.filter((x) => x.product.values.some((v) => user.values.includes(v)));
    return r;
  }, [q, bagId, under25, inStock, valuesOnly, items, user]);

  return (
    <Screen>
      <Text accessibilityRole="header" style={type.h1}>Search</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: colors.ink, marginTop: 16, paddingBottom: 8 }}>
        <SearchIcon size={20} strokeWidth={1.25} color={colors.ink} />
        <TextInput value={q} onChangeText={setQ} placeholder="Search for something new, like a vegan snack" placeholderTextColor={colors.stone}
          accessibilityLabel="Search" returnKeyType="search" autoCorrect={false}
          style={[type.h3, { flex: 1, fontSize: 20, paddingVertical: 4, outlineStyle: 'none' } as any]} />
        {q ? <TextLink label="Clear" onPress={() => setQ('')} style={{ color: colors.stone }} /> : null}
      </View>
      <View style={{ marginTop: 16 }}>
        <ChipRow>
          {bags.map((b) => <PillChip key={b.id} label={`${b.name} bag`} active={bagId === b.id} onPress={() => setBagId(bagId === b.id ? undefined : b.id)} />)}
          <PillChip label="Under $25" active={under25} onPress={() => setUnder25(!under25)} />
          <PillChip label="My values" active={valuesOnly} onPress={() => setValuesOnly(!valuesOnly)} />
          <PillChip label="In stock" active={inStock} onPress={() => setInStock(!inStock)} />
        </ChipRow>
      </View>

      {!q.trim() ? (
        <View style={{ marginTop: 40, gap: 12 }}>
          <Text style={type.secondary}>Try</Text>
          {SUGGEST.map((s) => <Text key={s} onPress={() => setQ(s)} accessibilityRole="button" style={[type.italic, { fontSize: 22, lineHeight: 30 }]}>{s}</Text>)}
        </View>
      ) : (
        <>
          <Text style={[type.smallStone, { marginTop: 24, marginBottom: 16 }]}>{results.length} {results.length === 1 ? 'result' : 'results'}, best fit first</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 28 }}>
            {results.map((r) => (
              <View key={r.product.id} style={{ width: (w - 16) / 2 }}>
                <ProductTile product={r.product} why={r.why} onPress={() => router.push(`/product/${r.product.id}`)} />
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                  <TextLink label="Add to bag" onPress={() => addWant(r.product.id, bagId, r.product.name)} />
                  <TextLink label="Shop" onPress={() => router.push(`/product/${r.product.id}`)} />
                </View>
              </View>
            ))}
          </View>
          {!results.length ? <Text style={[type.body, { color: colors.stone }]}>Nothing that fits yet. Try fewer words.</Text> : null}
        </>
      )}
    </Screen>
  );
}
