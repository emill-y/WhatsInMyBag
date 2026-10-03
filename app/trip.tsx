import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PillChip, PrimaryButton, SectionHeader, TextLink } from '../src/components/ui';
import { BackBar } from '../src/components/BackBar';
import { useStore } from '../src/store';
import { trip, hardToFind } from '../src/data/user';
import { productById } from '../src/data/products';

const LIST: Record<string, string[]> = {
  Baby: ['p-diapers', 'p-wipes', 'p-cream', 'p-sunstick', 'p-bibs', 'p-sippy', 'p-mat'],
  Snacks: ['p-bars', 'p-puffs', 'p-tea'],
  Beauty: ['p-spf', 'p-lipoil', 'p-mist', 'p-mascara'],
  Travel: ['p-passport', 'p-earbuds', 'p-mask', 'p-tsa', 'p-sanitizer'],
};

export default function Trip() {
  const { items, addWant } = useStore();
  const [dest, setDest] = useState(trip.destination);
  const [nights, setNights] = useState('10');
  const [who, setWho] = useState(['Adult', 'Baby']);
  const [made, setMade] = useState(true);
  const [checked, setChecked] = useState<string[]>([]);
  const owned = new Set(items.filter((i) => i.bagId === trip.bagId || i.bagId === 'b-diaper').map((i) => i.productId));
  const hard = hardToFind[dest] ?? [];

  const field = { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 8, outlineStyle: 'none' } as any;
  return (
    <Screen>
      <BackBar title="Trip planner" />
      <Text style={type.secondary}>Destination</Text>
      <TextInput value={dest} onChangeText={setDest} style={[type.h2, field]} />
      <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
        <View style={{ flex: 1 }}><Text style={type.secondary}>Nights</Text><TextInput value={nights} onChangeText={setNights} keyboardType="number-pad" style={[type.h3, field]} /></View>
        <View style={{ flex: 1 }}><Text style={type.secondary}>Bag</Text><Text style={[type.h3, { paddingVertical: 8 }]}>Travel</Text></View>
      </View>
      <Text style={[type.secondary, { marginTop: 16, marginBottom: 8 }]}>Who’s going</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {['Adult', 'Child', 'Baby'].map((w) => <PillChip key={w} label={w} active={who.includes(w)} onPress={() => setWho(who.includes(w) ? who.filter((x) => x !== w) : [...who, w])} />)}
      </View>
      <PrimaryButton label="Make my list" style={{ marginTop: 24 }} onPress={() => setMade(true)} />

      {made ? Object.entries(LIST).filter(([k]) => k !== 'Baby' || who.includes('Baby')).map(([cat, ids]) => (
        <View key={cat}>
          <SectionHeader title={cat} />
          {ids.map((id) => {
            const p = productById(id), have = owned.has(id), buy = hard.includes(id), done = checked.includes(id);
            return (
              <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.line }}>
                <Text onPress={() => setChecked(done ? checked.filter((x) => x !== id) : [...checked, id])} accessibilityRole="checkbox" accessibilityState={{ checked: done }}
                  style={{ width: 20, height: 20, borderWidth: 1, borderColor: colors.ink, borderRadius: 2, textAlign: 'center', lineHeight: 18, color: colors.paper, backgroundColor: done ? colors.ink : colors.paper }}>✓</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[type.body, done && { color: colors.stone, textDecorationLine: 'line-through' }]}>{p.name}</Text>
                  {buy ? <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold }} /><Text style={[type.small, { color: colors.goldDeep }]}>Buy before you go</Text></View> : null}
                </View>
                {have ? <Text style={type.smallStone}>In your bag</Text> : <TextLink label="Add to bag" onPress={() => addWant(id, trip.bagId, p.name)} />}
              </View>
            );
          })}
        </View>
      )) : null}
    </Screen>
  );
}
