import { useState } from 'react';
import { Linking, Pressable, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, PrimaryButton, OutlineButton, DaysLeftGauge, PillChip, Hairline, SectionHeader, Eyebrow, Bleed, PhotoTag } from '../../src/components/ui';
import { BackBar, FloatingBack } from '../../src/components/BackBar';
import { Photo } from '../../src/components/Photo';
import { useStore } from '../../src/store';
import { productById } from '../../src/data/products';
import { dupes } from '../../src/data/demos';
import { daysLeft, expiresInDays, fraction, status, usageLine } from '../../src/logic/depletion';

export default function ItemPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const item = useStore((s) => s.items.find((i) => i.id === id));
  const bag = useStore((s) => s.bags.find((b) => b.id === item?.bagId));
  const { correctItem, flash, restock, addWant } = useStore();
  const [note, setNote] = useState('');
  if (!item) return <Screen><BackBar /><Text style={type.body}>This item is no longer in your bag.</Text></Screen>;
  const p = productById(item.productId);
  const d = daysLeft(item), st = status(item), exp = expiresInDays(item);
  const outOfStock = st === 'out' && !p.inStock;
  const itemDupes = dupes.filter((x) => x.productId === p.id);
  const lasts = isFinite(d);

  return (
    <View style={{ flex: 1 }}>
      <Screen top={false}>
        <Bleed>
          <Photo id={p.photo} width={1200} label={p.name} fallbackSize={24} style={{ height: Math.min(width, maxWidth) * 1.0 }}>
            {st !== 'have' ? <PhotoTag label={st === 'out' ? 'Out' : st === 'low' ? `${d} days left` : 'Want'} tone="ink" style={{ position: 'absolute', right: 16, bottom: 16 }} /> : null}
          </Photo>
        </Bleed>
        <Eyebrow style={{ marginTop: 24 }}>{p.brand} · in your {bag?.name.toLowerCase()}</Eyebrow>
        <Text style={[type.h1, { marginTop: 4 }]}>{p.name}</Text>
        <Text style={[type.secondary, { marginTop: 4 }]}>{p.sizeAmount} {p.unit} · <Text style={type.price}>${p.price}</Text></Text>
        {p.blurb ? <Text style={[type.body, { marginTop: 12 }]}>{p.blurb}</Text> : null}

        {lasts && item.status !== 'want' ? (
          <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, alignItems: 'center', paddingVertical: 28, marginTop: 28 }}>
            <DaysLeftGauge fraction={fraction(item)} days={d} />
            <Text style={[type.secondary, { marginTop: 8 }]}>{usageLine(item)}</Text>
            {exp != null && exp <= 60 ? <Text style={[type.small, { color: colors.goldDeep, marginTop: 4 }]}>Opened {Math.round((Date.now() - new Date(item.openedOn!).getTime()) / 864e5)} days ago · expires in {exp} days</Text> : null}
            {d > 0 ? (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                <PillChip label="I’m almost out" onPress={() => { correctItem(item.id, 'almostOut'); flash('Updated. We’ll learn your pace.'); }} />
                <PillChip label="Still plenty" onPress={() => { correctItem(item.id, 'plenty'); flash('Updated'); }} />
              </View>
            ) : null}
          </View>
        ) : null}

        <View style={{ gap: 12, marginTop: 24 }}>
          {outOfStock ? null : <PrimaryButton label={item.status === 'want' ? 'Shop' : 'Reorder'} onPress={() => Linking.openURL(p.retailerUrl)} />}
          {lasts && item.status !== 'want' ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <OutlineButton label="Snooze" style={{ flex: 1 }} onPress={() => flash('We’ll remind you in 3 days')} />
              <OutlineButton label="Restocked" style={{ flex: 1 }} onPress={() => { restock(item.id); flash('Marked as restocked'); }} />
            </View>
          ) : null}
        </View>

        {outOfStock && itemDupes.length ? (
          <>
            <SectionHeader eyebrow="Out of stock at your retailer" title="Three close matches" />
            {itemDupes.map((x) => {
              const dp = productById(x.dupeId);
              return (
                <Pressable key={x.dupeId} onPress={() => router.push(`/product/${dp.id}`)} style={{ flexDirection: 'row', gap: 16, paddingVertical: 16, borderTopWidth: 1, borderColor: colors.line }}>
                  <Photo id={dp.photo} width={400} label={dp.name} fallbackSize={12} style={{ width: 96, height: 120, borderRadius: radius.photo }} />
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={type.smallStone}>{dp.brand} · {Math.round(x.matchScore * 100)}% match</Text>
                    <Text style={type.h3}>{dp.name}</Text>
                    <Text style={type.price}>${dp.price}</Text>
                    <Text style={[type.italic, { fontSize: 15, color: colors.stone }]}>{x.reason}</Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                      <PrimaryButton small label="Shop" onPress={() => Linking.openURL(dp.retailerUrl)} />
                      <OutlineButton small label="Add to bag" onPress={() => addWant(dp.id, item.bagId)} />
                    </View>
                  </View>
                </Pressable>
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
      <FloatingBack />
    </View>
  );
}
