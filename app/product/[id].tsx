import { Linking, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, OutlineButton, PillChip } from '../../src/components/ui';
import { BackBar } from '../../src/components/BackBar';
import { ProductArt } from '../../src/components/ProductArt';
import { productById } from '../../src/data/products';
import { useStore } from '../../src/store';

export default function ProductPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = productById(id);
  const { addWant, toggleWish } = useStore();
  const wish = useStore((s) => s.wishlist.includes(id));
  return (
    <Screen>
      <BackBar />
      <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ProductArt shape={p.image} id={p.id} size={180} />
      </View>
      <Text style={[type.h2, { marginTop: 24 }]}>{p.name}</Text>
      <Text style={type.secondary}>{p.brand} · {p.sizeAmount} {p.unit}</Text>
      <Text style={[type.price, { fontSize: 17, marginTop: 8 }]}>${p.price}</Text>
      {p.sponsored ? <Text style={[type.smallStone, { marginTop: 4 }]}>Sponsored</Text> : null}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {p.values.map((v) => <PillChip key={v} label={v} />)}
      </View>
      <View style={{ gap: 12, marginTop: 32 }}>
        <PrimaryButton label="Shop" onPress={() => Linking.openURL(p.retailerUrl)} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <OutlineButton label="Add to bag" style={{ flex: 1 }} onPress={() => addWant(p.id, undefined, p.name.split(',')[0])} />
          <OutlineButton label={wish ? 'Saved' : 'Save'} style={{ flex: 1 }} onPress={() => toggleWish(p.id)} />
        </View>
      </View>
    </Screen>
  );
}
