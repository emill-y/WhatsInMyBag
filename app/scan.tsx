import { useState } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../src/theme/tokens';
import { type } from '../src/theme/typography';
import { Screen, PrimaryButton, PillChip, TextLink, SectionHeader } from '../src/components/ui';
import { BackBar } from '../src/components/BackBar';
import { Photo } from '../src/components/Photo';
import { bagCover } from '../src/data/photos';
import { starterProducts } from '../src/data/demos';
import { productById } from '../src/data/products';
import { useStore } from '../src/store';

const FREQ = ['Daily', 'A few times a week', 'Occasionally'];
const CONF = [0.96, 0.93, 0.88, 0.61, 0.55];

export default function Scan() {
  const { flash, bags, activeBagId } = useStore();
  const bag = bags.find((b) => b.id === activeBagId) ?? bags[0];
  // Milestone 1: canned scan result for the active bag, no vision API.
  const detected = starterProducts[bag.type].slice(0, 5).map((id, i) => ({ id, label: productById(id).name, confidence: CONF[i] }));
  const [stage, setStage] = useState<'camera' | 'review' | 'questions'>('camera');
  const [list, setList] = useState(detected);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [freq, setFreq] = useState<Record<string, string>>({});

  if (stage === 'camera') return (
    <Screen>
      <BackBar title="Snap your bag" />
      <Photo id={bagCover[bag.type]} width={1000} label="Sample photo" style={{ aspectRatio: 3 / 4, borderRadius: radius.photo }}>
        <View style={{ position: 'absolute', top: 20, left: 20, right: 20, bottom: 20, borderWidth: 1, borderColor: colors.gold }} />
        <View style={{ position: 'absolute', bottom: 32, alignSelf: 'center', backgroundColor: colors.veil, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}>
          <Text style={type.small}>Tip everything out and lay it flat</Text>
        </View>
      </Photo>
      <PrimaryButton label="Scan" style={{ marginTop: 24 }} onPress={() => setStage('review')} />
      <Text style={[type.smallStone, { textAlign: 'center', marginTop: 12 }]}>Demo uses a sample photo.</Text>
    </Screen>
  );

  if (stage === 'review') return (
    <Screen>
      <BackBar title={`We found ${list.length} things`} />
      {list.map((d) => {
        const p = productById(d.id), low = d.confidence < 0.7, ok = confirmed.includes(d.id);
        return (
          <View key={d.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, borderBottomWidth: 1, borderColor: colors.line }}>
            <Photo id={p.photo} width={300} label={d.label} fallbackSize={11} style={{ width: 60, height: 60, borderRadius: radius.photo }} />
            <View style={{ flex: 1 }}>
              <Text style={type.body} numberOfLines={2}>{d.label}</Text>
              <Text style={[type.small, { color: low ? colors.goldDeep : colors.stone }]}>{low ? 'Check this one' : p.brand}</Text>
            </View>
            <View style={{ gap: 6, alignItems: 'flex-end' }}>
              <TextLink label={ok ? 'Confirmed' : 'Confirm'} onPress={() => setConfirmed([...confirmed, d.id])} style={ok ? { textDecorationLine: 'none', color: colors.stone } : undefined} />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TextLink label="Edit" onPress={() => flash('Editing comes with real scanning')} style={{ color: colors.stone }} />
                <TextLink label="Remove" onPress={() => setList(list.filter((x) => x.id !== d.id))} style={{ color: colors.stone }} />
              </View>
            </View>
          </View>
        );
      })}
      <PrimaryButton label="Continue" style={{ marginTop: 32 }} onPress={() => setStage('questions')} />
    </Screen>
  );

  return (
    <Screen>
      <BackBar title="A few quick questions" />
      {list.slice(0, 3).map((d) => (
        <View key={d.id}>
          <SectionHeader title={`How often do you use the ${d.label.toLowerCase()}?`} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {FREQ.map((f) => <PillChip key={f} label={f} active={freq[d.id] === f} onPress={() => setFreq({ ...freq, [d.id]: f })} />)}
          </View>
        </View>
      ))}
      <PrimaryButton label="Add to bag" style={{ marginTop: 40 }} onPress={() => { flash(`Your ${bag.name.toLowerCase()} is up to date`); router.replace('/home'); }} />
    </Screen>
  );
}
