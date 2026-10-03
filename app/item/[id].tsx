import { useState } from 'react';
import { Linking, Pressable, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, OutlineButton, DaysLeftGauge, PillChip, Hairline, SectionHeader } from '../../src/components/ui';
import { BackBar } from '../../src/components/BackBar';
import { ProductArt } from '../../src/components/ProductArt';
import { useStore } from '../../src/store';
import { productById } from '../../src/data/products';
import { dupes } from '../../src/data/user';
import { daysLeft, expiresInDays, fraction, status, usageLine } from '../../src/logic/depletion';

export default function ItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useStore((s) => s.items.find((i) => i.id === id));
  const { correctItem, flash, restock, addWant } = useStore();
  const [note, setNote] = useState('');
  if (!item) return <Screen><BackBar /><Text style={type.body}>This item is no longer in your bag.</Text></Screen>;
  const p = productById(item.productId);
  const d = daysLeft(item), st = status(item), exp = expiresInDays(item);
  const outOfStock = st === 'out' || !p.inStock;
  const itemDupes = dupes.filter((x) => x.productId === p.id);

  return (
    <Screen>
      <BackBar />
      <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, aspectRatio: 1.2, alignItems: 'center', justifyContent: 'center' }}>
        <ProductArt shape={p.image} id={p.id} size={160} />
      </View>
      <Text style={[type.h2, { marginTop: 24 }]}>{p.name}</Text>
      <Text style={type.secondary}>{p.brand} · {p.sizeAmount} {p.unit}</Text>

      <View style={{ alignItems: 'center', marginTop: 32 }}>
        <DaysLeftGauge fraction={fraction(item)} days={d} />
        <Text style={[type.secondary, { marginTop: 8 }]}>{usageLine(item)}</Text>
        {exp != null && exp <= 60 ? <Text style={[type.small, { color: colors.goldDeep, marginTop: 4 }]}>Expires in {exp} days</Text> : null}
      </View>
      {isFinite(d) && d > 0 ? (
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 16 }}>
          <PillChip label="I’m almost out" onPress={() => { correctItem(item.id, 'almostOut'); flash('Updated. We’ll learn your pace.'); }} />
          <PillChip label="Still plenty" onPress={() => { correctItem(item.id, 'plenty'); flash('Updated'); }} />
        </View>
      ) : null}

      <View style={{ gap: 12, marginTop: 32 }}>
        {outOfStock && itemDupes.length ? null : <PrimaryButton label="Reorder" onPress={() => { Linking.openURL(p.retailerUrl); }} />}
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <OutlineButton label="Snooze" style={{ flex: 1 }} onPress={() => flash('We’ll remind you in 3 days')} />
          <OutlineButton label="Restocked" style={{ flex: 1 }} onPress={() => { restock(item.id); flash('Marked as restocked'); }} />
        </View>
      </View>

      {outOfStock && itemDupes.length ? (
        <>
          <SectionHeader title="Out of stock at your retailer" />
          <Text style={[type.secondary, { marginTop: -8, marginBottom: 16 }]}>Three close matches, in stock now.</Text>
          {itemDupes.map((x) => {
            const dp = productById(x.dupeId);
            return (
              <View key={x.dupeId} style={{ flexDirection: 'row', gap: 16, paddingVertical: 16, borderTopWidth: 1, borderColor: colors.line }}>
                <Pressable onPress={() => router.push(`/product/${dp.id}`)} style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 8 }}>
                  <ProductArt shape={dp.image} id={dp.id} size={72} />
                </Pressable>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={type.body}>{dp.name}</Text>
                  <Text style={type.smallStone}>{dp.brand} · <Text style={type.price}>${dp.price}</Text> · {Math.round(x.matchScore * 100)}% match</Text>
                  <Text style={[type.italic, { fontSize: 15, color: colors.stone }]}>{x.reason}</Text>
                  <View style={{ flexDirection: 'row', gap: 16, marginTop: 6 }}>
                    <Text accessibilityRole="link" style={[type.small, { textDecorationLine: 'underline' }]} onPress={() => Linking.openURL(dp.retailerUrl)}>Shop</Text>
                    <Text accessibilityRole="link" style={[type.small, { textDecorationLine: 'underline' }]} onPress={() => addWant(dp.id, item.bagId, 'Concealer')}>Add to bag</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </>
      ) : null}

      <SectionHeader title="Notes" />
      <TextInput value={note} onChangeText={setNote} multiline placeholder="Shade, where you bought it, anything to remember" placeholderTextColor={colors.stone}
        style={[type.body, { borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 12, minHeight: 88, textAlignVertical: 'top', outlineStyle: 'none' } as any]} />
      <Hairline style={{ marginTop: 24 }} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12 }}>
        <Text style={type.secondary}>Opened on</Text>
        <Text style={type.small}>{item.openedOn ? new Date(item.openedOn).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</Text>
      </View>
    </Screen>
  );
}
