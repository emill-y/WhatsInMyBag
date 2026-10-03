import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { router } from 'expo-router';
import { Bell, Camera, Plane } from 'lucide-react-native';
import { colors, margin, maxWidth, radius } from '../../src/theme/tokens';
import { type } from '../../src/theme/typography';
import { Screen, Wordmark, PillChip, ChipRow, SectionHeader, ProductTile, TextLink, RingGauge } from '../../src/components/ui';
import { OpenBagHero } from '../../src/components/OpenBagHero';
import { SurpriseTeaser } from '../../src/components/SurpriseCardTeaser';
import { ProductArt } from '../../src/components/ProductArt';
import { useStore } from '../../src/store';
import { bags } from '../../src/data/user';
import { productById, products } from '../../src/data/products';
import { daysLeft, fraction, status } from '../../src/logic/depletion';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const w = Math.min(width, maxWidth) - margin * 2;
  const { items, activeBagId, setBag, showAlert, user, flash } = useStore();
  const [all, setAll] = useState(false);
  const bagItems = items.filter((i) => i.bagId === activeBagId);
  const running = items.filter((i) => ['low', 'out'].includes(status(i))).sort((a, b) => daysLeft(a) - daysLeft(b));
  const joys = products.filter((p) => p.price < 25 && !items.some((i) => i.productId === p.id)).slice(0, 4);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable accessibilityLabel="Scan a bag" onPress={() => router.push('/scan')} hitSlop={10}><Camera size={20} strokeWidth={1.25} color={colors.ink} /></Pressable>
        <Wordmark />
        <Pressable accessibilityLabel="Show restock alert" onPress={() => showAlert('i-lipoil')} hitSlop={10}>
          <Bell size={20} strokeWidth={1.25} color={colors.ink} />
          <View style={{ position: 'absolute', top: -1, right: -1, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold }} />
        </Pressable>
      </View>
      <Text style={[type.secondary, { textAlign: 'center', marginTop: 4, fontFamily: 'EBGaramond_400Regular_Italic' }]}>Good morning, {user.name}.</Text>

      <View style={{ marginTop: 20 }}>
        <ChipRow>
          {bags.map((b) => <PillChip key={b.id} label={b.name} active={b.id === activeBagId} onPress={() => { setBag(b.id); setAll(false); }} />)}
          <PillChip label="+" onPress={() => flash('Grocery and home bags are coming soon')} />
        </ChipRow>
      </View>

      <View style={{ marginTop: 16 }}><OpenBagHero items={bagItems.filter((i) => i.status !== 'want')} width={w} /></View>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <TextLink label={all ? 'Show less' : bagItems.length > 8 ? `+${bagItems.length - 8} more` : `See all ${bagItems.length} items`} onPress={() => setAll(!all)} />
      </View>
      {all ? (
        <View style={{ marginTop: 16 }}>
          {bagItems.map((it) => {
            const p = productById(it.productId), d = daysLeft(it), st = status(it);
            return (
              <Pressable key={it.id} onPress={() => router.push(`/item/${it.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line }}>
                <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card }}><ProductArt shape={p.image} id={p.id} size={48} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={type.body}>{it.label}</Text>
                  <Text style={type.smallStone}>{p.brand}</Text>
                </View>
                {isFinite(d) ? <RingGauge fraction={fraction(it)} /> : null}
                <Text style={[type.small, { color: st === 'have' ? colors.stone : colors.ink, minWidth: 64, textAlign: 'right' }]}>
                  {st === 'out' ? 'Out' : st === 'want' ? 'Want' : isFinite(d) ? `${d} days` : '—'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      <SectionHeader title="Running low" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -margin }} contentContainerStyle={{ paddingHorizontal: margin, gap: 12 }}>
        {running.map((it) => {
          const p = productById(it.productId), d = daysLeft(it);
          return (
            <Pressable key={it.id} onPress={() => router.push(`/item/${it.id}`)} style={{ width: 148 }} accessibilityLabel={`${it.label}, ${d <= 0 ? 'out' : d + ' days left'}`}>
              <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ProductArt shape={p.image} id={p.id} size={72} />
              </View>
              <Text style={[type.body, { marginTop: 8 }]}>{it.label}</Text>
              <Text style={[type.small, { color: d <= 0 ? colors.ink : colors.goldDeep }]}>{d <= 0 ? 'Out of stock' : `${d} days left`}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ marginTop: 40 }}><SurpriseTeaser /></View>

      <Pressable onPress={() => router.push('/trip')} style={{ marginTop: 24, borderWidth: 1, borderColor: colors.line, borderRadius: radius.card, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <Plane size={22} strokeWidth={1.25} color={colors.ink} />
        <View style={{ flex: 1 }}>
          <Text style={type.h3}>Lisbon in 12 days</Text>
          <Text style={type.secondary}>Your packing list, with what to buy before you go.</Text>
        </View>
      </Pressable>

      <SectionHeader title="Little joys under $25" action="Shop all" onAction={() => router.push('/shop')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        {joys.map((p) => <ProductTile key={p.id} product={p} width={(w - 16) / 2} onPress={() => router.push(`/product/${p.id}`)} />)}
      </View>
    </Screen>
  );
}
