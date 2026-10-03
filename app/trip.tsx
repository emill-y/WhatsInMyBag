import { useState } from 'react';
import { Text, TextInput, View, Pressable } from 'react-native';
import { Check } from 'lucide-react-native';
import { colors, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PillChip, PrimaryButton, SectionHeader, TextLink, Bleed, Eyebrow } from '../src/components/ui';
import { FloatingBack } from '../src/components/BackBar';
import { Photo } from '../src/components/Photo';
import { useStore } from '../src/store';
import { hardToFind, tripList } from '../src/data/demos';
import { scenes } from '../src/data/photos';
import { productById } from '../src/data/products';

const LIST = tripList;

export default function Trip() {
  const { items, addWant, trip, bags } = useStore();
  const [dest, setDest] = useState(trip?.destination ?? 'Lisbon');
  const [nights, setNights] = useState('10');
  const [who, setWho] = useState(['Adult']);
  const [checked, setChecked] = useState<string[]>(['tr-passport', 'tr-carryon']);
  const travelBag = bags.find((b) => b.type === 'travel');
  const owned = new Set(items.filter((i) => i.bagId === travelBag?.id && i.status !== 'want').map((i) => i.productId));
  const hard = hardToFind[dest] ?? [];
  const field = { borderBottomWidth: 1, borderColor: colors.line, paddingVertical: 8, outlineStyle: 'none' } as any;

  return (
    <View style={{ flex: 1 }}>
      <Screen top={false}>
        <Bleed>
          <Photo id={scenes.travelPacked} width={1200} label="Packing" style={{ height: 260 }}>
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.scrim, justifyContent: 'flex-end', padding: 24 }}>
              <Text style={[type.small, { color: colors.paper }]}>Trip planner</Text>
              <Text style={[type.display, { color: colors.paper }]}>{dest || 'Somewhere new'}</Text>
            </View>
          </Photo>
        </Bleed>
        <Text style={[type.secondary, { marginTop: 24 }]}>Destination</Text>
        <TextInput value={dest} onChangeText={setDest} style={[type.h2, field]} />
        <View style={{ flexDirection: 'row', gap: 24, marginTop: 16 }}>
          <View style={{ flex: 1 }}><Text style={type.secondary}>Nights</Text><TextInput value={nights} onChangeText={setNights} keyboardType="number-pad" style={[type.h3, field]} /></View>
          <View style={{ flex: 1 }}><Text style={type.secondary}>Bag</Text><Text style={[type.h3, { paddingVertical: 8 }]}>{travelBag?.name ?? 'Carry-on'}</Text></View>
        </View>
        <Text style={[type.secondary, { marginTop: 16, marginBottom: 8 }]}>Who’s going</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {['Adult', 'Child', 'Baby'].map((w) => <PillChip key={w} label={w} active={who.includes(w)} onPress={() => setWho(who.includes(w) ? who.filter((x) => x !== w) : [...who, w])} />)}
        </View>

        <View style={{ backgroundColor: colors.porcelain, borderRadius: radius.card, padding: 16, marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold }} />
          <Text style={[type.body, { flex: 1 }]}>{hard.length ? `${hard.length} things are hard to find in ${dest}. Buy them before you go.` : 'Everything on your list is easy to find there.'}</Text>
        </View>

        {Object.entries(LIST).filter(([k]) => k !== 'Baby' || who.includes('Baby')).map(([cat, ids]) => (
          <View key={cat}>
            <SectionHeader title={cat} />
            {ids.map((id) => {
              const p = productById(id), have = owned.has(id), buy = hard.includes(id), done = checked.includes(id);
              return (
                <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.line }}>
                  <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: done }} accessibilityLabel={`Packed ${p.name}`} hitSlop={8}
                    onPress={() => setChecked(done ? checked.filter((x) => x !== id) : [...checked, id])}
                    style={{ width: 22, height: 22, borderWidth: 1, borderColor: colors.ink, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? colors.ink : colors.paper }}>
                    {done ? <Check size={13} strokeWidth={2} color={colors.paper} /> : null}
                  </Pressable>
                  <Photo id={p.photo} width={200} style={{ width: 44, height: 44, borderRadius: radius.photo }} />
                  <View style={{ flex: 1 }}>
                    <Text style={[type.body, done && { color: colors.stone, textDecorationLine: 'line-through' }]} numberOfLines={1}>{p.name}</Text>
                    {buy ? <Eyebrow>Buy before you go</Eyebrow> : null}
                  </View>
                  {have ? <Text style={type.smallStone}>Packed</Text> : <TextLink label="Add" onPress={() => addWant(id, travelBag?.id)} />}
                </View>
              );
            })}
          </View>
        ))}
        <PrimaryButton label="Add everything missing" style={{ marginTop: 32 }} onPress={() => Object.values(LIST).flat().filter((id) => !owned.has(id)).forEach((id) => addWant(id, travelBag?.id))} />
      </Screen>
      <FloatingBack />
    </View>
  );
}
